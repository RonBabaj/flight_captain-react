package main

import (
	"bytes"
	"context"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
	"time"

	"flightcaptainweb/bookingmatch"
	"flightcaptainweb/search"
)

func TestHandleBookingResolve_verified(t *testing.T) {
	t.Setenv("WEB_SEARCH_ENABLED", "true")
	t.Setenv("SERPAPI_API_KEY", "test-key")

	dep := time.Date(2027, 1, 7, 10, 0, 0, 0, time.UTC)
	arr := time.Date(2027, 1, 7, 12, 30, 0, 0, time.UTC)
	seg := search.CanonicalSegment{
		From: "TLV", To: "VIE",
		DepartureTime: dep, ArrivalTime: arr,
		MarketingCarrier: "OS", FlightNumber: "OS860",
	}
	it := search.CanonicalItinerary{
		Segments: []search.CanonicalSegment{seg},
		Legs:     []search.CanonicalLeg{{Segments: []search.CanonicalSegment{seg}}},
	}
	fp := search.CanonicalItineraryFingerprint(it)
	price := 137.0

	oldRunner := bookingMatchRunner
	defer func() { bookingMatchRunner = oldRunner }()
	bookingMatchRunner = func(ctx context.Context, got search.CanonicalItinerary) (*bookingmatch.MatchResult, error) {
		if search.CanonicalItineraryFingerprint(got) != fp {
			t.Fatalf("itinerary fingerprint mismatch")
		}
		return &bookingmatch.MatchResult{
			ItineraryFingerprint: fp,
			BestOffer: &bookingmatch.BookingOffer{
				Domain:             "trip.com",
				URL:                "https://trip.com/book/OS860",
				URLType:            bookingmatch.URLTypeExactBooking,
				Price:              &price,
				Currency:           "EUR",
				MatchScore:         90,
				VerificationStatus: bookingmatch.StatusVerifiedExact,
				CheckedAt:          time.Now().UTC(),
			},
		}, nil
	}

	sessionsMu.Lock()
	sessions["sess_test"] = SearchSessionResultsResponse{
		Session: SearchSession{ID: "sess_test", CreatedAt: time.Now(), Status: StatusComplete},
		Results: []FlightOption{{
			ID:                   "opt_0",
			ItineraryFingerprint: fp,
			CanonicalItinerary:   &it,
			Legs: []FlightLeg{{Segments: []FlightSegment{{
				From: AirportLike{Code: "TLV"}, To: AirportLike{Code: "VIE"},
				DepartureTime: dep, ArrivalTime: arr,
				MarketingCarrier: Carrier{Code: "OS"}, FlightNumber: "OS860",
			}}}},
		}},
	}
	sessionsMu.Unlock()

	body, _ := json.Marshal(BookingResolveRequest{SessionID: "sess_test", OptionID: "opt_0"})
	req := httptest.NewRequest(http.MethodPost, "/api/booking/resolve", bytes.NewReader(body))
	rec := httptest.NewRecorder()
	handleBookingResolve(rec, req)

	if rec.Code != http.StatusOK {
		t.Fatalf("status=%d body=%s", rec.Code, rec.Body.String())
	}
	var out BookingResolveResponse
	if err := json.Unmarshal(rec.Body.Bytes(), &out); err != nil {
		t.Fatal(err)
	}
	if !out.Found || out.Status != BookingResolveVerified {
		t.Fatalf("found=%v status=%s", out.Found, out.Status)
	}
	if out.Offer == nil || out.Offer.URL == "" || out.Offer.MatchConfidence != 90 {
		t.Fatalf("offer=%+v", out.Offer)
	}
	if out.Offer.Price == nil || *out.Offer.Price != 137 {
		t.Fatalf("price=%v", out.Offer.Price)
	}
}

func TestHandleBookingResolve_prefillFallback(t *testing.T) {
	oldRunner := bookingMatchRunner
	defer func() { bookingMatchRunner = oldRunner }()
	bookingMatchRunner = func(ctx context.Context, it search.CanonicalItinerary) (*bookingmatch.MatchResult, error) {
		return &bookingmatch.MatchResult{ItineraryFingerprint: search.CanonicalItineraryFingerprint(it)}, nil
	}

	dep := time.Date(2027, 1, 7, 10, 0, 0, 0, time.UTC)
	sessionsMu.Lock()
	sessions["sess_nf"] = SearchSessionResultsResponse{
		Session: SearchSession{ID: "sess_nf", CreatedAt: time.Now(), Status: StatusComplete},
		Results: []FlightOption{{
			ID: "opt_0",
			Legs: []FlightLeg{{Segments: []FlightSegment{{
				From: AirportLike{Code: "TLV"}, To: AirportLike{Code: "VIE"},
				DepartureTime: dep,
				MarketingCarrier: Carrier{Code: "OS"}, FlightNumber: "OS860",
			}}}},
		}},
	}
	sessionsMu.Unlock()

	body, _ := json.Marshal(BookingResolveRequest{SessionID: "sess_nf", OptionID: "opt_0"})
	req := httptest.NewRequest(http.MethodPost, "/api/booking/resolve", bytes.NewReader(body))
	rec := httptest.NewRecorder()
	handleBookingResolve(rec, req)

	var out BookingResolveResponse
	_ = json.Unmarshal(rec.Body.Bytes(), &out)
	if !out.Found || out.Status != BookingResolveVerified || out.Offer == nil {
		t.Fatalf("expected prefill verified offer, got %+v", out)
	}
	if !strings.Contains(out.Offer.URL, "google.com/travel/flights") {
		t.Fatalf("expected google flights prefill, got %q", out.Offer.URL)
	}
}

func TestCacheTTLForStatus_doesNotCacheMisses(t *testing.T) {
	if cacheTTLForStatus(BookingResolveNotFound) != 0 {
		t.Fatal("not_found must not be negatively cached")
	}
	if cacheTTLForStatus(BookingResolveVerified) <= 0 {
		t.Fatal("verified offers should remain cached")
	}
}

func TestHandleBookingResolve_searchUnavailable(t *testing.T) {
	t.Setenv("WEB_SEARCH_ENABLED", "true")
	t.Setenv("SERPAPI_API_KEY", "test-key")

	oldRunner := bookingMatchRunner
	oldGF2 := bookingGF2OffersResolver
	defer func() {
		bookingMatchRunner = oldRunner
		bookingGF2OffersResolver = oldGF2
	}()
	bookingMatchRunner = func(ctx context.Context, it search.CanonicalItinerary) (*bookingmatch.MatchResult, error) {
		return nil, errBookingSearchUnavailable
	}
	bookingGF2OffersResolver = func(ctx context.Context, session *SearchSession, option *FlightOption, wantItin search.CanonicalItinerary, legIndex int, segmentIndex int) []bookingmatch.BookingOffer {
		return nil
	}

	sessionsMu.Lock()
	sessions["sess_su"] = SearchSessionResultsResponse{
		Session: SearchSession{ID: "sess_su", CreatedAt: time.Now(), Status: StatusComplete},
		Results: []FlightOption{{
			ID: "opt_0",
			Legs: []FlightLeg{{Segments: []FlightSegment{{
				From: AirportLike{Code: "A"}, To: AirportLike{Code: "B"},
				MarketingCarrier: Carrier{Code: "X"}, FlightNumber: "X1",
			}}}},
		}},
	}
	sessionsMu.Unlock()

	body, _ := json.Marshal(BookingResolveRequest{SessionID: "sess_su", OptionID: "opt_0"})
	req := httptest.NewRequest(http.MethodPost, "/api/booking/resolve", bytes.NewReader(body))
	rec := httptest.NewRecorder()
	handleBookingResolve(rec, req)

	var out BookingResolveResponse
	_ = json.Unmarshal(rec.Body.Bytes(), &out)
	if out.Status != BookingResolveSearchUnavailable {
		t.Fatalf("status=%s", out.Status)
	}
}

func TestHandleBookingResolve_invalidItinerary(t *testing.T) {
	sessionsMu.Lock()
	sessions["sess_bad"] = SearchSessionResultsResponse{
		Session: SearchSession{ID: "sess_bad", CreatedAt: time.Now(), Status: StatusComplete},
		Results: []FlightOption{{ID: "opt_0", Legs: nil}},
	}
	sessionsMu.Unlock()

	body, _ := json.Marshal(BookingResolveRequest{SessionID: "sess_bad", OptionID: "opt_0"})
	req := httptest.NewRequest(http.MethodPost, "/api/booking/resolve", bytes.NewReader(body))
	rec := httptest.NewRecorder()
	handleBookingResolve(rec, req)

	if rec.Code != http.StatusBadRequest {
		t.Fatalf("status=%d", rec.Code)
	}
}

func TestRunBookingMatch_picksCheapestWebOfferOverGF2Partner(t *testing.T) {
	dep := time.Date(2027, 1, 7, 14, 30, 0, 0, time.UTC)
	arr := time.Date(2027, 1, 7, 17, 5, 0, 0, time.UTC)
	seg := search.CanonicalSegment{
		From: "TLV", To: "VIE",
		DepartureTime: dep, ArrivalTime: arr,
		MarketingCarrier: "OS", FlightNumber: "OS860",
	}
	it := search.CanonicalItinerary{
		Segments: []search.CanonicalSegment{seg},
		Legs:     []search.CanonicalLeg{{Segments: []search.CanonicalSegment{seg}}},
	}
	fp := search.CanonicalItineraryFingerprint(it)
	tripPrice := 137.0
	gf2Price := 158.0

	t.Setenv("WEB_SEARCH_ENABLED", "true")
	t.Setenv("SERPAPI_API_KEY", "test-key")

	oldRunner := bookingMatchRunner
	oldGF2 := bookingGF2OffersResolver
	defer func() {
		bookingMatchRunner = oldRunner
		bookingGF2OffersResolver = oldGF2
	}()

	webSearchCalled := false
	bookingMatchRunner = func(ctx context.Context, got search.CanonicalItinerary) (*bookingmatch.MatchResult, error) {
		webSearchCalled = true
		return &bookingmatch.MatchResult{
			ItineraryFingerprint: fp,
			Offers: []bookingmatch.BookingOffer{{
				Domain:             "trip.com",
				URL:                "https://trip.com/book/OS860",
				URLType:            bookingmatch.URLTypeExactBooking,
				Price:              &tripPrice,
				Currency:           "EUR",
				MatchScore:         90,
				VerificationStatus: bookingmatch.StatusVerifiedExact,
				CheckedAt:          time.Now().UTC(),
			}},
			BestOffer: &bookingmatch.BookingOffer{
				Domain:             "trip.com",
				URL:                "https://trip.com/book/OS860",
				URLType:            bookingmatch.URLTypeExactBooking,
				Price:              &tripPrice,
				Currency:           "EUR",
				MatchScore:         90,
				VerificationStatus: bookingmatch.StatusVerifiedExact,
				CheckedAt:          time.Now().UTC(),
			},
		}, nil
	}
	bookingGF2OffersResolver = func(ctx context.Context, session *SearchSession, option *FlightOption, wantItin search.CanonicalItinerary, legIndex int, segmentIndex int) []bookingmatch.BookingOffer {
		return []bookingmatch.BookingOffer{{
			Domain:             "austrian.com",
			URL:                "https://www.austrian.com/en/book-flight/checkout",
			URLType:            bookingmatch.URLTypeExactBooking,
			Price:              &gf2Price,
			Currency:           "EUR",
			MatchScore:         95,
			VerificationStatus: bookingmatch.StatusVerifiedExact,
			CheckedAt:          time.Now().UTC(),
		}}
	}

	opt := &FlightOption{
		DeepLink: "https://www.austrian.com/en/book-flight/checkout",
		Price:    MonetaryAmount{Amount: 158, Currency: "EUR"},
		Legs: []FlightLeg{{Segments: []FlightSegment{{
			From: AirportLike{Code: "TLV"}, To: AirportLike{Code: "VIE"},
			DepartureTime: dep, ArrivalTime: arr,
			MarketingCarrier: Carrier{Code: "OS"}, FlightNumber: "OS860",
		}}}},
	}
	sess := &SearchSession{Params: CreateSearchSessionRequest{Currency: "EUR"}}

	resp := runBookingMatch(context.Background(), sess, opt, it, fp, -1, -1)
	if !webSearchCalled {
		t.Fatal("expected parallel web search when enabled")
	}
	if !resp.Found || resp.Offer == nil {
		t.Fatalf("expected a verified offer, got %+v", resp)
	}
	if resp.Offer.Domain != "trip.com" {
		t.Fatalf("expected cheapest trip.com offer, got %+v", resp.Offer)
	}
	if resp.Offer.PriceLabel != "cheapest_matching_offer" {
		t.Fatalf("priceLabel=%q", resp.Offer.PriceLabel)
	}
	if resp.Offer.Price == nil || *resp.Offer.Price != 137 {
		t.Fatalf("price=%v", resp.Offer.Price)
	}
}

func TestRunBookingMatch_prefersWebCheckoutWhenGF2ListingInflated(t *testing.T) {
	dep := time.Date(2027, 1, 14, 19, 5, 0, 0, time.UTC)
	arr := time.Date(2027, 1, 14, 23, 35, 0, 0, time.UTC)
	seg := search.CanonicalSegment{
		From: "SZG", To: "TLV",
		DepartureTime: dep, ArrivalTime: arr,
		MarketingCarrier: "LY", FlightNumber: "LY5194",
	}
	it := search.CanonicalItinerary{
		Segments: []search.CanonicalSegment{seg},
		Legs:     []search.CanonicalLeg{{Segments: []search.CanonicalSegment{seg}}},
	}
	fp := search.CanonicalItineraryFingerprint(it)
	gf2Budget := 360.0
	webGotogate := 328.0

	t.Setenv("WEB_SEARCH_ENABLED", "true")
	t.Setenv("SERPAPI_API_KEY", "test-key")

	oldRunner := bookingMatchRunner
	oldGF2 := bookingGF2OffersResolver
	defer func() {
		bookingMatchRunner = oldRunner
		bookingGF2OffersResolver = oldGF2
	}()

	bookingMatchRunner = func(ctx context.Context, got search.CanonicalItinerary) (*bookingmatch.MatchResult, error) {
		return &bookingmatch.MatchResult{
			ItineraryFingerprint: fp,
			Offers: []bookingmatch.BookingOffer{{
				Domain: "us.gotogate.com", URL: "https://us.gotogate.com/checkout/szg-tlv",
				URLType: bookingmatch.URLTypeExactBooking, Price: &webGotogate, Currency: "USD",
				MatchScore: 88, VerificationStatus: bookingmatch.StatusVerifiedExact, CheckedAt: time.Now().UTC(),
			}},
		}, nil
	}
	bookingGF2OffersResolver = func(ctx context.Context, session *SearchSession, option *FlightOption, wantItin search.CanonicalItinerary, legIndex int, segmentIndex int) []bookingmatch.BookingOffer {
		return []bookingmatch.BookingOffer{{
			Domain: "budgetair.com", URL: "https://www.budgetair.com/checkout/szg-tlv",
			URLType: bookingmatch.URLTypeExactBooking, Price: &gf2Budget, Currency: "USD",
			MatchScore: 95, VerificationStatus: bookingmatch.StatusVerifiedExact, CheckedAt: time.Now().UTC(),
		}}
	}

	opt := &FlightOption{
		Price: MonetaryAmount{Amount: 288, Currency: "USD"},
		Legs: []FlightLeg{{Segments: []FlightSegment{{
			From: AirportLike{Code: "SZG"}, To: AirportLike{Code: "TLV"},
			DepartureTime: dep, ArrivalTime: arr,
			MarketingCarrier: Carrier{Code: "LY"}, FlightNumber: "LY5194",
		}}}},
	}
	sess := &SearchSession{Params: CreateSearchSessionRequest{Currency: "USD"}}

	resp := runBookingMatch(context.Background(), sess, opt, it, fp, 0, -1)
	if !resp.Found || resp.Offer == nil {
		t.Fatalf("expected verified offer, got %+v", resp)
	}
	if resp.Offer.Domain != "us.gotogate.com" {
		t.Fatalf("expected cheaper web checkout over inflated GF2 listing, got %+v", resp.Offer)
	}
	if resp.Offer.Price == nil || *resp.Offer.Price != webGotogate {
		t.Fatalf("price=%v", resp.Offer.Price)
	}
}

func TestRunBookingMatch_usesLegTokenFromSearchQuote(t *testing.T) {
	dep := time.Date(2027, 1, 7, 17, 40, 0, 0, time.UTC)
	arr := time.Date(2027, 1, 7, 20, 25, 0, 0, time.UTC)
	seg := search.CanonicalSegment{
		From: "TLV", To: "VIE",
		DepartureTime: dep, ArrivalTime: arr,
		MarketingCarrier: "OS", FlightNumber: "OS860",
	}
	it := search.CanonicalItinerary{
		Segments: []search.CanonicalSegment{seg},
		Legs:     []search.CanonicalLeg{{Segments: []search.CanonicalSegment{seg}}},
	}
	fp := search.CanonicalItineraryFingerprint(it)
	gf2Price := 180.0

	t.Setenv("WEB_SEARCH_ENABLED", "true")
	t.Setenv("SERPAPI_API_KEY", "test-key")

	oldRunner := bookingMatchRunner
	oldGF2 := bookingGF2OffersResolver
	defer func() {
		bookingMatchRunner = oldRunner
		bookingGF2OffersResolver = oldGF2
	}()

	webSearchCalled := false
	bookingMatchRunner = func(ctx context.Context, got search.CanonicalItinerary) (*bookingmatch.MatchResult, error) {
		webSearchCalled = true
		return &bookingmatch.MatchResult{ItineraryFingerprint: fp}, nil
	}
	gf2Called := false
	bookingGF2OffersResolver = func(ctx context.Context, session *SearchSession, option *FlightOption, wantItin search.CanonicalItinerary, legIndex int, segmentIndex int) []bookingmatch.BookingOffer {
		gf2Called = true
		if search.CanonicalItineraryFingerprint(wantItin) != fp || legIndex != 0 {
			t.Fatalf("search partner fingerprint=%s legIndex=%d", search.CanonicalItineraryFingerprint(wantItin), legIndex)
		}
		return []bookingmatch.BookingOffer{{
			Domain:             "mytrip.com",
			URL:                "https://mytrip.com/checkout/tlv-vie",
			URLType:            bookingmatch.URLTypeExactBooking,
			Price:              &gf2Price,
			Currency:           "USD",
			MatchScore:         95,
			VerificationStatus: bookingmatch.StatusVerifiedExact,
			CheckedAt:          time.Now().UTC(),
		}}
	}

	opt := &FlightOption{
		Price: MonetaryAmount{Amount: 360, Currency: "USD"},
		LegBookingTokens: []string{"tok-outbound", "tok-return"},
		LegDeepLinks:     []string{"https://mytrip.com/checkout/tlv-vie", "https://example.com/return"},
		Legs: []FlightLeg{
			{Segments: []FlightSegment{{
				From: AirportLike{Code: "TLV"}, To: AirportLike{Code: "VIE"},
				DepartureTime: dep, ArrivalTime: arr,
				MarketingCarrier: Carrier{Code: "OS"}, FlightNumber: "OS860",
			}}},
			{Segments: []FlightSegment{{
				From: AirportLike{Code: "SZG"}, To: AirportLike{Code: "TLV"},
				DepartureTime: time.Date(2027, 1, 14, 16, 45, 0, 0, time.UTC),
				MarketingCarrier: Carrier{Code: "LH"}, FlightNumber: "LH1263",
			}}},
		},
	}
	sess := &SearchSession{Params: CreateSearchSessionRequest{Currency: "USD"}}

	resp := runBookingMatch(context.Background(), sess, opt, it, fp, 0, -1)
	if !webSearchCalled {
		t.Fatal("expected parallel web search when enabled")
	}
	if !gf2Called {
		t.Fatal("expected GF2 resolver to run")
	}
	if !resp.Found || resp.Offer == nil || resp.Offer.Domain != "mytrip.com" {
		t.Fatalf("expected search-quote partner offer, got %+v", resp)
	}
	if resp.Offer.PriceLabel != "google_flights_partner" {
		t.Fatalf("priceLabel=%q", resp.Offer.PriceLabel)
	}
}

func TestRunBookingMatch_usesSearchQuoteWhenWebSearchErrors(t *testing.T) {
	dep := time.Date(2027, 1, 7, 17, 40, 0, 0, time.UTC)
	arr := time.Date(2027, 1, 7, 20, 25, 0, 0, time.UTC)
	seg := search.CanonicalSegment{
		From: "TLV", To: "VIE",
		DepartureTime: dep, ArrivalTime: arr,
		MarketingCarrier: "OS", FlightNumber: "OS860",
	}
	it := search.CanonicalItinerary{
		Segments: []search.CanonicalSegment{seg},
		Legs:     []search.CanonicalLeg{{Segments: []search.CanonicalSegment{seg}}},
	}
	fp := search.CanonicalItineraryFingerprint(it)
	gf2Price := 180.0

	oldRunner := bookingMatchRunner
	oldGF2 := bookingGF2OffersResolver
	defer func() {
		bookingMatchRunner = oldRunner
		bookingGF2OffersResolver = oldGF2
	}()

	bookingMatchRunner = func(ctx context.Context, got search.CanonicalItinerary) (*bookingmatch.MatchResult, error) {
		return nil, errBookingSearchUnavailable
	}
	bookingGF2OffersResolver = func(ctx context.Context, session *SearchSession, option *FlightOption, wantItin search.CanonicalItinerary, legIndex int, segmentIndex int) []bookingmatch.BookingOffer {
		return []bookingmatch.BookingOffer{{
			Domain:             "mytrip.com",
			URL:                "https://mytrip.com/checkout/tlv-vie",
			URLType:            bookingmatch.URLTypeExactBooking,
			Price:              &gf2Price,
			Currency:           "USD",
			MatchScore:         95,
			VerificationStatus: bookingmatch.StatusVerifiedExact,
			CheckedAt:          time.Now().UTC(),
		}}
	}

	opt := &FlightOption{
		Price:            MonetaryAmount{Amount: 360, Currency: "USD"},
		LegBookingTokens: []string{"tok-outbound"},
		LegDeepLinks:     []string{"https://mytrip.com/checkout/tlv-vie"},
		Legs: []FlightLeg{{Segments: []FlightSegment{{
			From: AirportLike{Code: "TLV"}, To: AirportLike{Code: "VIE"},
			DepartureTime: dep, ArrivalTime: arr,
			MarketingCarrier: Carrier{Code: "OS"}, FlightNumber: "OS860",
		}}}},
	}
	sess := &SearchSession{Params: CreateSearchSessionRequest{Currency: "USD"}}

	resp := runBookingMatch(context.Background(), sess, opt, it, fp, 0, -1)
	if !resp.Found || resp.Offer == nil || resp.Offer.Domain != "mytrip.com" {
		t.Fatalf("expected persisted search-quote offer when web search errors, got %+v", resp)
	}
}

func TestRunBookingMatch_picksCheapestAmongMultipleGF2Partners(t *testing.T) {
	dep := time.Date(2027, 1, 14, 16, 45, 0, 0, time.UTC)
	arr := time.Date(2027, 1, 14, 20, 10, 0, 0, time.UTC)
	seg := search.CanonicalSegment{
		From: "SZG", To: "TLV",
		DepartureTime: dep, ArrivalTime: arr,
		MarketingCarrier: "LH", FlightNumber: "LH1263",
	}
	it := search.CanonicalItinerary{
		Segments: []search.CanonicalSegment{seg},
		Legs:     []search.CanonicalLeg{{Segments: []search.CanonicalSegment{seg}}},
	}
	fp := search.CanonicalItineraryFingerprint(it)
	budgetair := 324.0
	trip := 289.0

	oldGF2 := bookingGF2OffersResolver
	defer func() { bookingGF2OffersResolver = oldGF2 }()
	bookingGF2OffersResolver = func(ctx context.Context, session *SearchSession, option *FlightOption, wantItin search.CanonicalItinerary, legIndex int, segmentIndex int) []bookingmatch.BookingOffer {
		return []bookingmatch.BookingOffer{
			{
				Domain: "budgetair.com", URL: "https://www.budgetair.com/checkout/szg-tlv",
				URLType: bookingmatch.URLTypeExactBooking, Price: &budgetair, Currency: "USD",
				MatchScore: 95, VerificationStatus: bookingmatch.StatusVerifiedExact, CheckedAt: time.Now().UTC(),
			},
			{
				Domain: "trip.com", URL: "https://www.trip.com/flights/book/LH1263",
				URLType: bookingmatch.URLTypeExactBooking, Price: &trip, Currency: "USD",
				MatchScore: 90, VerificationStatus: bookingmatch.StatusVerifiedExact, CheckedAt: time.Now().UTC(),
			},
		}
	}

	opt := &FlightOption{
		Price: MonetaryAmount{Amount: 650, Currency: "USD"},
		LegDeepLinks: []string{
			"https://www.budgetair.com/checkout/tlv-vie",
			"https://www.budgetair.com/checkout/szg-tlv",
		},
		Legs: []FlightLeg{
			{Segments: []FlightSegment{{From: AirportLike{Code: "TLV"}, To: AirportLike{Code: "VIE"}, MarketingCarrier: Carrier{Code: "OS"}}}},
			{Segments: []FlightSegment{{
				From: AirportLike{Code: "SZG"}, To: AirportLike{Code: "TLV"},
				DepartureTime: dep, ArrivalTime: arr,
				MarketingCarrier: Carrier{Code: "LH"}, FlightNumber: "LH1263",
			}}},
		},
	}
	sess := &SearchSession{Params: CreateSearchSessionRequest{Currency: "USD"}}

	resp := runBookingMatch(context.Background(), sess, opt, it, fp, 1, -1)
	if !resp.Found || resp.Offer == nil {
		t.Fatalf("expected verified offer, got %+v", resp)
	}
	if resp.Offer.Domain != "trip.com" {
		t.Fatalf("expected cheapest GF2 partner URL, got %+v", resp.Offer)
	}
	if resp.Offer.PriceLabel != "google_flights_partner" {
		t.Fatalf("priceLabel=%q", resp.Offer.PriceLabel)
	}
	if resp.Offer.Price == nil || *resp.Offer.Price != trip {
		t.Fatalf("expected GF2 ranking price on primary for transparency, got %v", resp.Offer.Price)
	}
}

func TestRunBookingMatch_prefersAirlineDirectWhenOTAAboveSearchQuote(t *testing.T) {
	dep := time.Date(2027, 1, 14, 19, 5, 0, 0, time.UTC)
	arr := time.Date(2027, 1, 14, 23, 35, 0, 0, time.UTC)
	seg := search.CanonicalSegment{
		From: "SZG", To: "TLV",
		DepartureTime: dep, ArrivalTime: arr,
		MarketingCarrier: "LY", FlightNumber: "LY5194",
	}
	it := search.CanonicalItinerary{
		Segments: []search.CanonicalSegment{seg},
		Legs:     []search.CanonicalLeg{{Segments: []search.CanonicalSegment{seg}}},
	}
	fp := search.CanonicalItineraryFingerprint(it)
	budgetair := 324.0
	elalQuote := 288.0

	oldGF2 := bookingGF2OffersResolver
	defer func() { bookingGF2OffersResolver = oldGF2 }()
	bookingGF2OffersResolver = func(ctx context.Context, session *SearchSession, option *FlightOption, wantItin search.CanonicalItinerary, legIndex int, segmentIndex int) []bookingmatch.BookingOffer {
		return []bookingmatch.BookingOffer{
			{
				Domain: "budgetair.com", URL: "https://www.budgetair.com/checkout/szg-tlv",
				URLType: bookingmatch.URLTypeExactBooking, Price: &budgetair, Currency: "USD",
				MatchScore: 95, VerificationStatus: bookingmatch.StatusVerifiedExact, CheckedAt: time.Now().UTC(),
			},
			{
				Domain: "booking.elal.co.il", URL: "https://booking.elal.co.il/checkout/szg-tlv",
				URLType: bookingmatch.URLTypeExactBooking, Price: &elalQuote, Currency: "USD",
				MatchScore: 95, VerificationStatus: bookingmatch.StatusVerifiedExact, CheckedAt: time.Now().UTC(),
			},
		}
	}

	opt := &FlightOption{
		Price:     MonetaryAmount{Amount: 465, Currency: "USD"},
		LegPrices: []float64{288},
		Legs: []FlightLeg{{Segments: []FlightSegment{{
			From: AirportLike{Code: "SZG"}, To: AirportLike{Code: "TLV"},
			DepartureTime: dep, ArrivalTime: arr,
			MarketingCarrier: Carrier{Code: "LY"}, FlightNumber: "LY5194",
		}}}},
	}
	sess := &SearchSession{Params: CreateSearchSessionRequest{Currency: "USD"}}

	resp := runBookingMatch(context.Background(), sess, opt, it, fp, 0, -1)
	if !resp.Found || resp.Offer == nil {
		t.Fatalf("expected verified offer, got %+v", resp)
	}
	if resp.Offer.Domain != "budgetair.com" {
		t.Fatalf("expected cheapest OTA (budgetair) as primary, got %+v", resp.Offer)
	}
	if resp.CheapestOta == nil || resp.CheapestOta.Domain != "budgetair.com" {
		t.Fatalf("expected cheapestOta=budgetair, got %+v", resp.CheapestOta)
	}
	if resp.AirlineDirect == nil || !strings.Contains(resp.AirlineDirect.Domain, "elal") {
		t.Fatalf("expected airlineDirect=elal, got %+v", resp.AirlineDirect)
	}
	if resp.Offer.PriceLabel != "google_flights_partner" {
		t.Fatalf("priceLabel=%q", resp.Offer.PriceLabel)
	}
}

func TestRunBookingMatch_prefersCheapestCheckoutWhenAirlineGF2PriceInflated(t *testing.T) {
	dep := time.Date(2027, 1, 14, 19, 5, 0, 0, time.UTC)
	arr := time.Date(2027, 1, 14, 23, 35, 0, 0, time.UTC)
	seg := search.CanonicalSegment{
		From: "SZG", To: "TLV",
		DepartureTime: dep, ArrivalTime: arr,
		MarketingCarrier: "LY", FlightNumber: "LY5194",
	}
	it := search.CanonicalItinerary{
		Segments: []search.CanonicalSegment{seg},
		Legs:     []search.CanonicalLeg{{Segments: []search.CanonicalSegment{seg}}},
	}
	fp := search.CanonicalItineraryFingerprint(it)
	budgetair := 324.0
	elalGF2 := 340.0

	oldGF2 := bookingGF2OffersResolver
	defer func() { bookingGF2OffersResolver = oldGF2 }()
	bookingGF2OffersResolver = func(ctx context.Context, session *SearchSession, option *FlightOption, wantItin search.CanonicalItinerary, legIndex int, segmentIndex int) []bookingmatch.BookingOffer {
		return []bookingmatch.BookingOffer{
			{
				Domain: "budgetair.com", URL: "https://www.budgetair.com/checkout/szg-tlv",
				URLType: bookingmatch.URLTypeExactBooking, Price: &budgetair, Currency: "USD",
				MatchScore: 95, VerificationStatus: bookingmatch.StatusVerifiedExact, CheckedAt: time.Now().UTC(),
			},
			{
				Domain: "booking.elal.co.il", URL: "https://booking.elal.co.il/checkout/szg-tlv",
				URLType: bookingmatch.URLTypeExactBooking, Price: &elalGF2, Currency: "USD",
				MatchScore: 95, VerificationStatus: bookingmatch.StatusVerifiedExact, CheckedAt: time.Now().UTC(),
			},
		}
	}

	opt := &FlightOption{
		Price:     MonetaryAmount{Amount: 465, Currency: "USD"},
		LegPrices: []float64{288},
		Legs: []FlightLeg{{Segments: []FlightSegment{{
			From: AirportLike{Code: "SZG"}, To: AirportLike{Code: "TLV"},
			DepartureTime: dep, ArrivalTime: arr,
			MarketingCarrier: Carrier{Code: "LY"}, FlightNumber: "LY5194",
		}}}},
	}
	sess := &SearchSession{Params: CreateSearchSessionRequest{Currency: "USD"}}

	resp := runBookingMatch(context.Background(), sess, opt, it, fp, 0, -1)
	if !resp.Found || resp.Offer == nil {
		t.Fatalf("expected verified offer, got %+v", resp)
	}
	if resp.Offer.Domain != "budgetair.com" {
		t.Fatalf("expected cheapest verified checkout (budgetair), not inflated elal GF2 price, got %+v", resp.Offer)
	}
	if resp.Offer.PriceLabel != "google_flights_partner" {
		t.Fatalf("priceLabel=%q", resp.Offer.PriceLabel)
	}
	if resp.CheapestOta == nil || resp.CheapestOta.Domain != "budgetair.com" {
		t.Fatalf("expected cheapestOta=budgetair, got %+v", resp.CheapestOta)
	}
	if resp.AirlineDirect == nil || !strings.Contains(strings.ToLower(resp.AirlineDirect.Domain), "elal") {
		t.Fatalf("expected airlineDirect=elal when BudgetAir wins, got %+v", resp.AirlineDirect)
	}
}

func TestPreferAirlineDirectWhenCheaperThanMarkedUpOTA(t *testing.T) {
	budgetair := 324.0
	elal := 310.0
	quote := search.QuoteBinding{Amount: 288, Currency: "USD"}
	offers := []bookingmatch.BookingOffer{
		{
			Domain: "budgetair.com", URL: "https://www.budgetair.com/checkout/szg-tlv",
			URLType: bookingmatch.URLTypeExactBooking, Price: &budgetair, Currency: "USD",
			VerificationStatus: bookingmatch.StatusVerifiedExact, CheckedAt: time.Now().UTC(),
		},
		{
			Domain: "booking.elal.co.il", URL: "https://booking.elal.co.il/checkout/szg-tlv",
			URLType: bookingmatch.URLTypeExactBooking, Price: &elal, Currency: "USD",
			VerificationStatus: bookingmatch.StatusVerifiedExact, CheckedAt: time.Now().UTC(),
		},
	}
	best := bookingmatch.SelectCheapestVerifiedOffer(offers, bookingMatchPriceNormalizer())
	got := preferAirlineDirectWhenCheaperThanMarkedUpOTA(best, offers, quote, "LY", bookingMatchPriceNormalizer())
	if got == nil || !strings.Contains(got.Domain, "elal") {
		t.Fatalf("expected El Al when cheaper than marked-up OTA, got %+v", got)
	}

	inflated := 340.0
	offers[1].Price = &inflated
	best = bookingmatch.SelectCheapestVerifiedOffer(offers, bookingMatchPriceNormalizer())
	got = preferAirlineDirectWhenCheaperThanMarkedUpOTA(best, offers, quote, "LY", bookingMatchPriceNormalizer())
	if got == nil || got.Domain != "budgetair.com" {
		t.Fatalf("expected BudgetAir when El Al GF2 is inflated above OTA, got %+v", got)
	}
}

func TestRunBookingMatch_usesCheapestOTAWhenMarkedUpWithoutAirlineCheckout(t *testing.T) {
	dep := time.Date(2027, 1, 14, 19, 5, 0, 0, time.UTC)
	arr := time.Date(2027, 1, 14, 23, 35, 0, 0, time.UTC)
	seg := search.CanonicalSegment{
		From: "SZG", To: "TLV",
		DepartureTime: dep, ArrivalTime: arr,
		MarketingCarrier: "LY", FlightNumber: "LY5194",
	}
	it := search.CanonicalItinerary{
		Segments: []search.CanonicalSegment{seg},
		Legs:     []search.CanonicalLeg{{Segments: []search.CanonicalSegment{seg}}},
	}
	fp := search.CanonicalItineraryFingerprint(it)
	budgetair := 324.0

	oldGF2 := bookingGF2OffersResolver
	defer func() { bookingGF2OffersResolver = oldGF2 }()
	bookingGF2OffersResolver = func(ctx context.Context, session *SearchSession, option *FlightOption, wantItin search.CanonicalItinerary, legIndex int, segmentIndex int) []bookingmatch.BookingOffer {
		return []bookingmatch.BookingOffer{
			{
				Domain: "budgetair.com", URL: "https://www.budgetair.com/checkout/szg-tlv",
				URLType: bookingmatch.URLTypeExactBooking, Price: &budgetair, Currency: "USD",
				MatchScore: 95, VerificationStatus: bookingmatch.StatusVerifiedExact, CheckedAt: time.Now().UTC(),
			},
		}
	}

	opt := &FlightOption{
		Price:     MonetaryAmount{Amount: 465, Currency: "USD"},
		LegPrices: []float64{288},
		Legs: []FlightLeg{{Segments: []FlightSegment{{
			From: AirportLike{Code: "SZG"}, To: AirportLike{Code: "TLV"},
			DepartureTime: dep, ArrivalTime: arr,
			MarketingCarrier: Carrier{Code: "LY"}, FlightNumber: "LY5194",
		}}}},
	}
	sess := &SearchSession{Params: CreateSearchSessionRequest{Currency: "USD"}}

	resp := runBookingMatch(context.Background(), sess, opt, it, fp, 0, -1)
	if !resp.Found || resp.Offer == nil {
		t.Fatalf("expected verified offer, got %+v", resp)
	}
	if resp.Offer.Domain != "budgetair.com" {
		t.Fatalf("expected cheapest verified OTA checkout, got %+v", resp.Offer)
	}
	if strings.Contains(resp.Offer.URL, "skyscanner.net") {
		t.Fatalf("must not redirect to Skyscanner, got %q", resp.Offer.URL)
	}
	if resp.Offer.PriceLabel != "google_flights_partner" {
		t.Fatalf("priceLabel=%q", resp.Offer.PriceLabel)
	}
}

func TestIsAffiliateTemplateBookingURL(t *testing.T) {
	if !isAffiliateTemplateBookingURL("https://booking.elal.com/en/booking/flights?origin=SZG&destination=TLV&departureDate=2027-01-14") {
		t.Fatal("expected elal template URL")
	}
	if isAffiliateTemplateBookingURL("https://booking.elal.co.il/checkout/szg-tlv") {
		t.Fatal("checkout deeplink is not a template")
	}
}

