package main

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
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
	// LegIndex resolves a single hop for split (open-jaw / extra-leg) itineraries.
	LegIndex *int `json:"legIndex,omitempty"`
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

var (
	bookingResolveCache   sync.Map
	bookingResolveCacheTTL = 30 * time.Minute
	bookingMatchRunner    = defaultBookingMatchRunner
)

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
	var base search.CanonicalItinerary
	if option.CanonicalItinerary != nil && len(option.CanonicalItinerary.Segments) > 0 {
		base = *option.CanonicalItinerary
	} else {
		pr := providerResultFromFlightOption(option)
		base = search.BuildCanonicalItinerary(pr)
	}
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

func setCachedBookingResolve(key string, resp BookingResolveResponse) {
	if key == "" {
		return
	}
	bookingResolveCache.Store(key, bookingResolveCacheEntry{
		resp:      resp,
		expiresAt: time.Now().Add(bookingResolveCacheTTL),
	})
}

func publicOfferFromMatch(o *bookingmatch.BookingOffer, hadMultipleVerified bool) *PublicBookingOffer {
	if o == nil {
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
		setCachedBookingResolve(cacheKey, resp)
		return resp
	}

	resp := BookingResolveResponse{
		Found:                true,
		Status:               BookingResolveVerified,
		ItineraryFingerprint: fp,
		Offer:                publicOfferFromMatch(matchResult.BestOffer, verifiedCount > 1),
	}
	setCachedBookingResolve(cacheKey, resp)
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

	ctx, cancel := context.WithTimeout(r.Context(), bookingResolveTimeout)
	defer cancel()

	out := resolveBookingOffer(ctx, option, legIndex)
	statusCode := http.StatusOK
	if out.Status == BookingResolveInvalidItinerary {
		statusCode = http.StatusBadRequest
	}
	writeJSON(w, statusCode, out)
}
