package main

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"net/http"
	"os"
	"strconv"
	"strings"
	"sync"
	"time"

	"flightcaptainweb/bookingmatch"
	"flightcaptainweb/search"
)

const bookingResolveTimeout = 45 * time.Second

// Booking resolve status codes exposed to clients.
const (
	BookingResolveVerified          = "verified"
	BookingResolveNotFound          = "not_found"
	BookingResolveSearchUnavailable = "search_unavailable"
	BookingResolveTimeout           = "timeout"
	BookingResolveInvalidItinerary  = "invalid_itinerary"
)

// BookingResolveRequest identifies a flight option to match via web search.
type BookingResolveRequest struct {
	SessionID string `json:"sessionId"`
	OptionID  string `json:"optionId"`
	LegIndex  *int   `json:"legIndex,omitempty"`
}

// PublicBookingOffer is the client-facing verified booking offer (no internal search details).
type PublicBookingOffer struct {
	Provider        string   `json:"provider"`
	Domain          string   `json:"domain"`
	URL             string   `json:"url"`
	URLType         string   `json:"urlType"`
	Price           *float64 `json:"price,omitempty"`
	Currency        string   `json:"currency,omitempty"`
	MatchConfidence int      `json:"matchConfidence"`
	PriceLabel      string   `json:"priceLabel,omitempty"`
	CheckedAt       string   `json:"checkedAt"`
}

// BookingResolveResponse is returned by POST /api/booking/resolve.
type BookingResolveResponse struct {
	Found                bool                `json:"found"`
	Status               string              `json:"status"`
	ItineraryFingerprint string              `json:"itineraryFingerprint,omitempty"`
	Offer                *PublicBookingOffer `json:"offer,omitempty"`
	Message              string              `json:"message,omitempty"`
}

type bookingResolveCacheEntry struct {
	resp      BookingResolveResponse
	expiresAt time.Time
}

type bookingResolveLogEvent struct {
	Event                string `json:"event"`
	SessionID            string `json:"sessionId,omitempty"`
	OptionID             string `json:"optionId,omitempty"`
	ItineraryFingerprint string `json:"itineraryFingerprint,omitempty"`
	Status               string `json:"status,omitempty"`
	Provider             string `json:"provider,omitempty"`
	DurationMs           int64  `json:"durationMs,omitempty"`
	CacheHit             bool   `json:"cacheHit,omitempty"`
	FailureReason        string `json:"failureReason,omitempty"`
}

type inflightResolveEntry struct {
	done chan struct{}
	resp *BookingResolveResponse
}

var (
	bookingResolveCache        sync.Map
	bookingResolveInflight     sync.Map // cacheKey -> *inflightResolveEntry
	bookingResolveCacheTTL     = 30 * time.Minute
	bookingResolveNegativeTTL  = 5 * time.Minute
	bookingResolveSem          chan struct{}
	bookingMatchRunner         = defaultBookingMatchRunner
)

func init() {
	bookingResolveSem = make(chan struct{}, bookingResolveMaxConcurrentFromEnv())
	if v := envDurationMinutes("BOOKING_RESOLVE_CACHE_TTL_MIN", 30); v > 0 {
		bookingResolveCacheTTL = v
	}
	if v := envDurationMinutes("BOOKING_RESOLVE_NEGATIVE_CACHE_TTL_MIN", 5); v > 0 {
		bookingResolveNegativeTTL = v
	}
}

func envDurationMinutes(key string, def int) time.Duration {
	s := strings.TrimSpace(os.Getenv(key))
	if s == "" {
		return time.Duration(def) * time.Minute
	}
	n, err := strconv.Atoi(s)
	if err != nil || n <= 0 {
		return time.Duration(def) * time.Minute
	}
	return time.Duration(n) * time.Minute
}

func bookingResolveMaxConcurrentFromEnv() int {
	s := strings.TrimSpace(os.Getenv("BOOKING_RESOLVE_MAX_CONCURRENT"))
	if s == "" {
		return 5
	}
	n, err := strconv.Atoi(s)
	if err != nil || n <= 0 {
		return 5
	}
	return n
}

func logBookingResolve(ev bookingResolveLogEvent) {
	b, err := json.Marshal(ev)
	if err != nil {
		log.Printf("[BOOKING_RESOLVE] event=%s status=%s", ev.Event, ev.Status)
		return
	}
	log.Printf("[BOOKING_RESOLVE] %s", string(b))
}

func defaultBookingMatchRunner(ctx context.Context, it search.CanonicalItinerary) (*bookingmatch.MatchResult, error) {
	cfg := bookingmatch.DefaultConfig()
	if !cfg.Enabled || cfg.SerpAPIKey == "" {
		return nil, errBookingSearchUnavailable
	}
	return bookingmatch.NewResolver(cfg).Match(ctx, it)
}

var errBookingSearchUnavailable = errors.New("web search not configured")

func canonicalItineraryForOption(option *FlightOption, legIndex int) (search.CanonicalItinerary, error) {
	if option == nil {
		return search.CanonicalItinerary{}, fmt.Errorf("missing option")
	}
	// Always rebuild from leg segments so booking uses corrected flight identity
	// (stored canonicalItinerary may predate carrier/name normalization fixes).
	pr := providerResultFromFlightOption(option)
	base := search.BuildCanonicalItinerary(pr)
	if len(base.Segments) == 0 {
		return search.CanonicalItinerary{}, fmt.Errorf("itinerary has no segments")
	}
	if legIndex < 0 {
		return base, nil
	}
	if legIndex >= len(base.Legs) {
		return search.CanonicalItinerary{}, fmt.Errorf("legIndex out of range")
	}
	leg := base.Legs[legIndex]
	if len(leg.Segments) == 0 {
		return search.CanonicalItinerary{}, fmt.Errorf("leg has no segments")
	}
	sub := search.CanonicalItinerary{
		Legs:   []search.CanonicalLeg{leg},
		Source: base.Source,
		Price:  base.Price,
	}
	sub.Segments = append([]search.CanonicalSegment(nil), leg.Segments...)
	sub.StopsCount = leg.StopsCount
	if sub.StopsCount == 0 && len(sub.Segments) > 1 {
		sub.StopsCount = len(sub.Segments) - 1
	}
	return sub, nil
}

func bookingResolveCacheKey(fp string, legIndex int) string {
	if legIndex < 0 {
		return fp
	}
	return fmt.Sprintf("%s:leg:%d", fp, legIndex)
}

func getCachedBookingResolve(key string) (BookingResolveResponse, bool) {
	if key == "" {
		return BookingResolveResponse{}, false
	}
	if v, ok := bookingResolveCache.Load(key); ok {
		e := v.(bookingResolveCacheEntry)
		if time.Now().Before(e.expiresAt) {
			return e.resp, true
		}
		bookingResolveCache.Delete(key)
	}
	return BookingResolveResponse{}, false
}

func setCachedBookingResolve(key string, resp BookingResolveResponse, ttl time.Duration) {
	if key == "" || ttl <= 0 {
		return
	}
	bookingResolveCache.Store(key, bookingResolveCacheEntry{
		resp:      resp,
		expiresAt: time.Now().Add(ttl),
	})
}

func cacheTTLForStatus(status string) time.Duration {
	switch status {
	case BookingResolveVerified:
		return bookingResolveCacheTTL
	case BookingResolveNotFound:
		return bookingResolveNegativeTTL
	default:
		return 0
	}
}

func publicOfferFromMatch(o *bookingmatch.BookingOffer, hadMultipleVerified bool) *PublicBookingOffer {
	if o == nil {
		return nil
	}
	if err := bookingmatch.ValidateBookingURL(o.URL); err != nil {
		return nil
	}
	provider := strings.TrimSpace(o.Domain)
	if provider == "" {
		provider = strings.TrimSpace(o.Provider)
	}
	priceLabel := ""
	if o.Price != nil {
		if hadMultipleVerified {
			priceLabel = "cheapest_matching_offer"
		} else {
			priceLabel = "best_matching_price"
		}
	}
	return &PublicBookingOffer{
		Provider:        provider,
		Domain:          o.Domain,
		URL:             o.URL,
		URLType:         string(o.URLType),
		Price:           o.Price,
		Currency:        o.Currency,
		MatchConfidence: o.MatchScore,
		PriceLabel:      priceLabel,
		CheckedAt:       o.CheckedAt.UTC().Format(time.RFC3339),
	}
}

func countVerifiedExactOffers(offers []bookingmatch.BookingOffer) int {
	n := 0
	for _, o := range offers {
		if o.VerificationStatus == bookingmatch.StatusVerifiedExact {
			n++
		}
	}
	return n
}

func acquireBookingResolveSlot(ctx context.Context) error {
	select {
	case bookingResolveSem <- struct{}{}:
		return nil
	case <-ctx.Done():
		return ctx.Err()
	}
}

func releaseBookingResolveSlot() {
	select {
	case <-bookingResolveSem:
	default:
	}
}

func resolveBookingOffer(ctx context.Context, option *FlightOption, legIndex int) BookingResolveResponse {
	it, err := canonicalItineraryForOption(option, legIndex)
	if err != nil {
		return BookingResolveResponse{
			Found:   false,
			Status:  BookingResolveInvalidItinerary,
			Message: "Could not build itinerary identity for this flight.",
		}
	}
	fp := search.CanonicalItineraryFingerprint(it)
	cacheKey := bookingResolveCacheKey(fp, legIndex)
	if cached, ok := getCachedBookingResolve(cacheKey); ok {
		return cached
	}

	waitEntry, leader := beginInflightResolve(cacheKey)
	if !leader {
		select {
		case <-waitEntry.done:
		case <-ctx.Done():
			return BookingResolveResponse{
				Found:                false,
				Status:               BookingResolveTimeout,
				ItineraryFingerprint: fp,
				Message:              "Booking search timed out. Please try again.",
			}
		}
		if waitEntry.resp != nil {
			return *waitEntry.resp
		}
		if cached, ok := getCachedBookingResolve(cacheKey); ok {
			return cached
		}
		return BookingResolveResponse{
			Found:                false,
			Status:               BookingResolveSearchUnavailable,
			ItineraryFingerprint: fp,
			Message:              "Booking search is temporarily unavailable.",
		}
	}

	defer finishInflightResolve(cacheKey, waitEntry)

	if err := acquireBookingResolveSlot(ctx); err != nil {
		resp := BookingResolveResponse{
			Found:                false,
			Status:               BookingResolveTimeout,
			ItineraryFingerprint: fp,
			Message:              "Booking search timed out. Please try again.",
		}
		waitEntry.resp = &resp
		return resp
	}
	defer releaseBookingResolveSlot()

	if cached, ok := getCachedBookingResolve(cacheKey); ok {
		waitEntry.resp = &cached
		return cached
	}

	resp := runBookingMatch(ctx, it, fp, legIndex)
	waitEntry.resp = &resp
	if ttl := cacheTTLForStatus(resp.Status); ttl > 0 {
		setCachedBookingResolve(cacheKey, resp, ttl)
	}
	return resp
}

func beginInflightResolve(key string) (*inflightResolveEntry, bool) {
	entry := &inflightResolveEntry{done: make(chan struct{})}
	actual, loaded := bookingResolveInflight.LoadOrStore(key, entry)
	if loaded {
		return actual.(*inflightResolveEntry), false
	}
	return entry, true
}

func finishInflightResolve(key string, entry *inflightResolveEntry) {
	close(entry.done)
	bookingResolveInflight.Delete(key)
}

func runBookingMatch(ctx context.Context, it search.CanonicalItinerary, fp string, legIndex int) BookingResolveResponse {
	start := time.Now()
	matchResult, err := bookingMatchRunner(ctx, it)
	if err != nil {
		resp := BookingResolveResponse{
			Found:                false,
			ItineraryFingerprint: fp,
			Message:              "Booking search is temporarily unavailable.",
		}
		if errors.Is(err, context.DeadlineExceeded) || errors.Is(err, context.Canceled) {
			resp.Status = BookingResolveTimeout
			resp.Message = "Booking search timed out. Please try again."
		} else if errors.Is(err, errBookingSearchUnavailable) {
			resp.Status = BookingResolveSearchUnavailable
			resp.Message = "Exact-flight booking search is not configured on this server."
		} else {
			resp.Status = BookingResolveSearchUnavailable
		}
		logBookingResolve(bookingResolveLogEvent{
			Event:                "resolve_failed",
			ItineraryFingerprint: fp,
			Status:               resp.Status,
			DurationMs:           time.Since(start).Milliseconds(),
			FailureReason:        err.Error(),
		})
		return resp
	}

	verifiedCount := countVerifiedExactOffers(matchResult.Offers)
	if matchResult.BestOffer == nil {
		resp := BookingResolveResponse{
			Found:                false,
			Status:               BookingResolveNotFound,
			ItineraryFingerprint: fp,
			Message:              "No verified booking page found for this exact itinerary.",
		}
		logBookingResolve(bookingResolveLogEvent{
			Event:                "resolve_not_found",
			ItineraryFingerprint: fp,
			Status:               resp.Status,
			DurationMs:           time.Since(start).Milliseconds(),
		})
		return resp
	}

	offer := publicOfferFromMatch(matchResult.BestOffer, verifiedCount > 1)
	if offer == nil {
		resp := BookingResolveResponse{
			Found:                false,
			Status:               BookingResolveNotFound,
			ItineraryFingerprint: fp,
			Message:              "No safe verified booking URL found for this exact itinerary.",
		}
		logBookingResolve(bookingResolveLogEvent{
			Event:                "resolve_unsafe_url",
			ItineraryFingerprint: fp,
			Status:               resp.Status,
			DurationMs:           time.Since(start).Milliseconds(),
			FailureReason:        "verified offer failed URL validation",
		})
		return resp
	}

	resp := BookingResolveResponse{
		Found:                true,
		Status:               BookingResolveVerified,
		ItineraryFingerprint: fp,
		Offer:                offer,
	}
	logBookingResolve(bookingResolveLogEvent{
		Event:                "resolve_verified",
		ItineraryFingerprint: fp,
		Status:               resp.Status,
		Provider:             offer.Provider,
		DurationMs:           time.Since(start).Milliseconds(),
	})
	_ = legIndex
	return resp
}

func handleBookingResolve(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusNoContent)
		return
	}
	if r.Method != http.MethodPost {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}

	start := time.Now()
	var req BookingResolveRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid JSON"})
		return
	}
	sessionID := strings.TrimSpace(req.SessionID)
	optionID := strings.TrimSpace(req.OptionID)
	if sessionID == "" || optionID == "" {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": "sessionId and optionId are required"})
		return
	}

	resp, option := GetSessionAndOption(sessionID, optionID)
	if resp == nil {
		writeJSON(w, http.StatusNotFound, map[string]string{"error": "session not found"})
		return
	}
	if option == nil {
		writeJSON(w, http.StatusNotFound, map[string]string{"error": "option not found"})
		return
	}

	legIndex := -1
	if req.LegIndex != nil {
		legIndex = *req.LegIndex
	}

	if cached, ok := getCachedBookingResolve(bookingResolveCacheKey(
		search.CanonicalItineraryFingerprint(mustCanonicalForLog(option, legIndex)), legIndex)); ok {
		logBookingResolve(bookingResolveLogEvent{
			Event:                "resolve_request",
			SessionID:            sessionID,
			OptionID:             optionID,
			ItineraryFingerprint: cached.ItineraryFingerprint,
			Status:               cached.Status,
			CacheHit:             true,
			DurationMs:           time.Since(start).Milliseconds(),
		})
		writeJSON(w, http.StatusOK, cached)
		return
	}

	ctx, cancel := context.WithTimeout(r.Context(), bookingResolveTimeout)
	defer cancel()

	out := resolveBookingOffer(ctx, option, legIndex)
	statusCode := http.StatusOK
	if out.Status == BookingResolveInvalidItinerary {
		statusCode = http.StatusBadRequest
	}
	logBookingResolve(bookingResolveLogEvent{
		Event:                "resolve_request",
		SessionID:            sessionID,
		OptionID:             optionID,
		ItineraryFingerprint: out.ItineraryFingerprint,
		Status:               out.Status,
		Provider:             providerFromOffer(out.Offer),
		DurationMs:           time.Since(start).Milliseconds(),
	})
	writeJSON(w, statusCode, out)
}

func providerFromOffer(o *PublicBookingOffer) string {
	if o == nil {
		return ""
	}
	return o.Provider
}

func mustCanonicalForLog(option *FlightOption, legIndex int) search.CanonicalItinerary {
	it, err := canonicalItineraryForOption(option, legIndex)
	if err != nil {
		return search.CanonicalItinerary{}
	}
	return it
}
