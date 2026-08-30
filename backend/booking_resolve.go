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
	SessionID    string `json:"sessionId"`
	OptionID     string `json:"optionId"`
	LegIndex     *int   `json:"legIndex,omitempty"`
	SegmentIndex *int   `json:"segmentIndex,omitempty"`
	Force        bool   `json:"force,omitempty"`
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
	QuotedPrice          *float64            `json:"quotedPrice,omitempty"`
	QuotedCurrency       string              `json:"quotedCurrency,omitempty"`
	PriceMismatch        bool                `json:"priceMismatch,omitempty"`
}

type bookingResolveCacheEntry struct {
	resp      BookingResolveResponse
	expiresAt time.Time
}

type bookingResolveLogEvent struct {
	Event                string `json:"event"`
	SessionID            string `json:"sessionId,omitempty"`
	OptionID             string `json:"optionId,omitempty"`
	LegIndex             *int   `json:"legIndex,omitempty"`
	SegmentIndex         *int   `json:"segmentIndex,omitempty"`
	LegRoute             string `json:"legRoute,omitempty"`
	SegmentCount         int    `json:"segmentCount,omitempty"`
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
	bookingGF2Resolver         = resolveGF2PartnerOffer
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
	cfg.PriceNormalizer = bookingMatchPriceNormalizer()
	return bookingmatch.NewResolver(cfg).Match(ctx, it)
}

func webBookingMatchEnabled() bool {
	cfg := bookingmatch.DefaultConfig()
	return cfg.Enabled && cfg.SerpAPIKey != ""
}

func collectVerifiedBookingOffers(gf2 *bookingmatch.BookingOffer, match *bookingmatch.MatchResult) []bookingmatch.BookingOffer {
	var out []bookingmatch.BookingOffer
	seen := map[string]struct{}{}
	add := func(o bookingmatch.BookingOffer) {
		if o.VerificationStatus != bookingmatch.StatusVerifiedExact {
			return
		}
		if o.URLType == bookingmatch.URLTypeGenericSearch {
			return
		}
		if err := bookingmatch.ValidateBookingURL(o.URL); err != nil {
			return
		}
		key := strings.ToLower(strings.TrimSpace(o.URL))
		if key == "" {
			return
		}
		if _, ok := seen[key]; ok {
			return
		}
		seen[key] = struct{}{}
		out = append(out, o)
	}
	if gf2 != nil {
		add(*gf2)
	}
	if match != nil {
		for _, o := range match.Offers {
			add(o)
		}
		if match.BestOffer != nil {
			add(*match.BestOffer)
		}
	}
	return out
}

func bookingOfferSameURL(a, b *bookingmatch.BookingOffer) bool {
	if a == nil || b == nil {
		return false
	}
	return strings.EqualFold(strings.TrimSpace(a.URL), strings.TrimSpace(b.URL))
}

var errBookingSearchUnavailable = errors.New("web search not configured")

func canonicalItineraryForOption(option *FlightOption, legIndex int, segmentIndex int) (search.CanonicalItinerary, error) {
	if option == nil {
		return search.CanonicalItinerary{}, fmt.Errorf("missing option")
	}
	if legIndex >= 0 && segmentIndex >= 0 {
		if legIndex >= len(option.Legs) {
			return search.CanonicalItinerary{}, fmt.Errorf("legIndex out of range")
		}
		segs := option.Legs[legIndex].Segments
		if segmentIndex >= len(segs) {
			return search.CanonicalItinerary{}, fmt.Errorf("segmentIndex out of range")
		}
		single := &FlightOption{
			Legs:   []FlightLeg{{Segments: []FlightSegment{segs[segmentIndex]}}},
			Source: option.Source,
			Price:  option.Price,
		}
		pr := providerResultFromFlightOption(single)
		sub := search.BuildCanonicalItinerary(pr)
		if len(sub.Segments) == 0 {
			return search.CanonicalItinerary{}, fmt.Errorf("segment has no identity")
		}
		sub.StopsCount = 0
		return sub, nil
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

func bookingResolveCacheKey(fp string, legIndex int, segmentIndex int) string {
	if legIndex < 0 {
		return fp
	}
	if segmentIndex >= 0 {
		return fmt.Sprintf("%s:leg:%d:seg:%d", fp, legIndex, segmentIndex)
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
		// Do not cache misses. Try again must re-resolve; a 5-minute negative
		// cache made booking look permanently broken after the first failure.
		return 0
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

func resolveBookingOffer(ctx context.Context, session *SearchSession, option *FlightOption, legIndex int, segmentIndex int, force bool) BookingResolveResponse {
	it, err := canonicalItineraryForOption(option, legIndex, segmentIndex)
	if err != nil {
		return BookingResolveResponse{
			Found:   false,
			Status:  BookingResolveInvalidItinerary,
			Message: "Could not build itinerary identity for this flight.",
		}
	}
	fp := search.CanonicalItineraryFingerprint(it)
	cacheKey := bookingResolveCacheKey(fp, legIndex, segmentIndex)
	if !force {
		if cached, ok := getCachedBookingResolve(cacheKey); ok {
			return cached
		}
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
		if !force {
			if cached, ok := getCachedBookingResolve(cacheKey); ok {
				return cached
			}
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

	if !force {
		if cached, ok := getCachedBookingResolve(cacheKey); ok {
			waitEntry.resp = &cached
			return cached
		}
	}

	resp := runBookingMatch(ctx, session, option, it, fp, legIndex, segmentIndex)
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

func runBookingMatch(ctx context.Context, session *SearchSession, option *FlightOption, it search.CanonicalItinerary, fp string, legIndex int, segmentIndex int) BookingResolveResponse {
	start := time.Now()
	legRoute := legRouteLabel(it)
	q := quoteBindingFromOption(session, option, legIndex)
	normalize := bookingMatchPriceNormalizer()

	var (
		gf2Offer    *bookingmatch.BookingOffer
		matchResult *bookingmatch.MatchResult
		matchErr    error
		wg          sync.WaitGroup
	)

	wg.Add(1)
	go func() {
		defer wg.Done()
		gf2Offer = bookingGF2Resolver(ctx, session, option, it, legIndex, segmentIndex)
	}()

	if webBookingMatchEnabled() {
		wg.Add(1)
		go func() {
			defer wg.Done()
			matchResult, matchErr = bookingMatchRunner(ctx, it)
		}()
	}

	wg.Wait()

	offers := collectVerifiedBookingOffers(gf2Offer, matchResult)
	if len(offers) > 0 {
		best := bookingmatch.SelectCheapestVerifiedOffer(offers, normalize)
		if best != nil {
			extractedBeforeQuote := applySearchQuoteToOffer(best, q)
			hadMultiple := len(offers) > 1
			offer := publicOfferFromMatch(best, hadMultiple)
			if offer != nil {
				if hadMultiple {
					offer.PriceLabel = "cheapest_matching_offer"
				} else if bookingOfferSameURL(best, gf2Offer) {
					offer.PriceLabel = "google_flights_partner"
				} else if extractedBeforeQuote == nil {
					offer.PriceLabel = "search_quote"
				}
				event := "resolve_verified"
				if hadMultiple {
					event = "resolve_verified_cheapest"
				} else if bookingOfferSameURL(best, gf2Offer) {
					event = "resolve_verified_gf2"
				}
				resp := BookingResolveResponse{
					Found:                true,
					Status:               BookingResolveVerified,
					ItineraryFingerprint: fp,
					Offer:                offer,
				}
				resp = attachQuotedPriceMeta(resp, session, option, legIndex, extractedBeforeQuote)
				logBookingResolve(bookingResolveLogEvent{
					Event:                event,
					ItineraryFingerprint: fp,
					LegIndex:             intPtrOrNil(legIndex),
					LegRoute:             legRoute,
					Status:               resp.Status,
					Provider:             offer.Provider,
					DurationMs:           time.Since(start).Milliseconds(),
				})
				return resp
			}
		}
	}

	if matchErr != nil && len(offers) == 0 {
		resp := BookingResolveResponse{
			Found:                false,
			ItineraryFingerprint: fp,
			Message:              "Booking search is temporarily unavailable.",
		}
		if errors.Is(matchErr, context.DeadlineExceeded) || errors.Is(matchErr, context.Canceled) {
			resp.Status = BookingResolveTimeout
			resp.Message = "Booking search timed out. Please try again."
		} else if errors.Is(matchErr, errBookingSearchUnavailable) {
			resp.Status = BookingResolveSearchUnavailable
			resp.Message = "Exact-flight booking search is not configured on this server."
		} else {
			resp.Status = BookingResolveSearchUnavailable
		}
		logBookingResolve(bookingResolveLogEvent{
			Event:                "resolve_failed",
			ItineraryFingerprint: fp,
			LegIndex:             intPtrOrNil(legIndex),
			LegRoute:             legRoute,
			Status:               resp.Status,
			DurationMs:           time.Since(start).Milliseconds(),
			FailureReason:        matchErr.Error(),
		})
		return resp
	}

	if prefill := bookingPrefillURL(session, option, legIndex, segmentIndex); prefill != "" {
		if gf2Prefill := gf2PartnerOfferFromURL(prefill, fp); gf2Prefill != nil {
			offer := publicOfferFromMatch(gf2Prefill, false)
			if offer != nil {
				offer.PriceLabel = "search_prefill"
				offer.MatchConfidence = 0
				resp := BookingResolveResponse{
					Found:                true,
					Status:               BookingResolveVerified,
					ItineraryFingerprint: fp,
					Offer:                offer,
					Message:              "Direct partner link unavailable. Opens a prefilled search — select your flight and verify the fare before paying.",
				}
				logBookingResolve(bookingResolveLogEvent{
					Event:                "resolve_verified_prefill",
					ItineraryFingerprint: fp,
					LegIndex:             intPtrOrNil(legIndex),
					LegRoute:             legRoute,
					Status:               resp.Status,
					Provider:             offer.Provider,
					DurationMs:           time.Since(start).Milliseconds(),
				})
				return resp
			}
		}
	}
	resp := BookingResolveResponse{
		Found:                false,
		Status:               BookingResolveNotFound,
		ItineraryFingerprint: fp,
		Message:              "No verified booking offer found yet",
	}
	logBookingResolve(bookingResolveLogEvent{
		Event:                "resolve_not_found",
		ItineraryFingerprint: fp,
		LegIndex:             intPtrOrNil(legIndex),
		LegRoute:             legRoute,
		Status:               resp.Status,
		DurationMs:           time.Since(start).Milliseconds(),
	})
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
	segmentIndex := -1
	if req.SegmentIndex != nil {
		segmentIndex = *req.SegmentIndex
	}

	if !req.Force {
		if cached, ok := getCachedBookingResolve(bookingResolveCacheKey(
			search.CanonicalItineraryFingerprint(mustCanonicalForLog(option, legIndex, segmentIndex)), legIndex, segmentIndex)); ok {
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
	}

	ctx, cancel := context.WithTimeout(r.Context(), bookingResolveTimeout)
	defer cancel()

	out := resolveBookingOffer(ctx, &resp.Session, option, legIndex, segmentIndex, req.Force)
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

func mustCanonicalForLog(option *FlightOption, legIndex int, segmentIndex int) search.CanonicalItinerary {
	it, err := canonicalItineraryForOption(option, legIndex, segmentIndex)
	if err != nil {
		return search.CanonicalItinerary{}
	}
	return it
}

func legRouteLabel(it search.CanonicalItinerary) string {
	if len(it.Segments) == 0 {
		return ""
	}
	first := it.Segments[0]
	last := it.Segments[len(it.Segments)-1]
	return search.NormalizeAirportCode(first.From) + "→" + search.NormalizeAirportCode(last.To)
}

func intPtrOrNil(legIndex int) *int {
	if legIndex < 0 {
		return nil
	}
	v := legIndex
	return &v
}
