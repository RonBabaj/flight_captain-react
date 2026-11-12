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

// Production-shaped Kiwi option from sess_dmt5sgj985sc / opt_10 (TLV–PRG Israir $313).
// Reproduces the live failure: display-name carrier, empty flight numbers, no deep link.
func prodShapeKiwiIsrairOption() *FlightOption {
	depOut := time.Date(2026, 11, 13, 15, 0, 0, 0, time.FixedZone("IST", 2*3600))
	arrOut := time.Date(2026, 11, 13, 19, 5, 0, 0, time.FixedZone("CET", 1*3600))
	depIn := time.Date(2026, 11, 20, 9, 15, 0, 0, time.FixedZone("CET", 1*3600))
	arrIn := time.Date(2026, 11, 20, 12, 55, 0, 0, time.FixedZone("IST", 2*3600))
	return &FlightOption{
		ID:                    "opt_10",
		Source:                "kiwi",
		VendorName:            "Kiwi.com",
		PrimaryDisplayCarrier: "ISRAIR",
		ValidatingAirlines:    []string{"ISRAIR"},
		Price:                 MonetaryAmount{Currency: "USD", Amount: 313},
		ListingURL:            "https://www.kiwi.com/en/search/results/tel-aviv-israel/prague-czechia/2026-11-13/2026-11-20/",
		Legs: []FlightLeg{
			{Segments: []FlightSegment{{
				From: AirportLike{Code: "TLV"}, To: AirportLike{Code: "PRG"},
				DepartureTime: depOut, ArrivalTime: arrOut,
				MarketingCarrier: Carrier{Code: "ISRAIR"},
				DurationMinutes:  305,
				CabinClass:       "ECONOMY",
			}}},
			{Segments: []FlightSegment{{
				From: AirportLike{Code: "PRG"}, To: AirportLike{Code: "TLV"},
				DepartureTime: depIn, ArrivalTime: arrIn,
				MarketingCarrier: Carrier{Code: "ISRAIR"},
				DurationMinutes:  160,
				CabinClass:       "ECONOMY",
			}}},
		},
	}
}

func TestLookupAirlineIATA_Israir(t *testing.T) {
	if got := search.LookupAirlineIATA("ISRAIR"); got != "6H" {
		t.Fatalf("LookupAirlineIATA(ISRAIR)=%q want 6H", got)
	}
	if got := search.LookupAirlineIATA("Wizz Air Malta"); got != "W4" {
		t.Fatalf("LookupAirlineIATA(Wizz Air Malta)=%q want W4", got)
	}
}

func TestParseOtaOffers_normalizesIsrairDisplayName(t *testing.T) {
	item := map[string]interface{}{
		"price": 313.0, "currency": "USD",
		"bookingUrl": "https://www.kiwi.com/en/search/results/tel-aviv-israel/prague-czechia/2026-11-13/2026-11-20/",
		"segments": []interface{}{
			map[string]interface{}{
				"leg": "outbound", "fromCode": "TLV", "toCode": "PRG",
				"departureTime": "2026-11-13T15:00:00+02:00", "arrivalTime": "2026-11-13T19:05:00+01:00",
				"airline": "ISRAIR",
			},
			map[string]interface{}{
				"leg": "inbound", "fromCode": "PRG", "toCode": "TLV",
				"departureTime": "2026-11-20T09:15:00+01:00", "arrivalTime": "2026-11-20T12:55:00+02:00",
				"airline": "ISRAIR",
			},
		},
	}
	out := search.ParseOtaOffers([]map[string]interface{}{item}, search.SearchRequest{
		Origin: "TLV", Destination: "PRG", Currency: "USD",
	}, "kiwi")
	if len(out) != 1 {
		t.Fatalf("len=%d", len(out))
	}
	seg := out[0].Legs[0].Segments[0]
	if seg.MarketingCarrier != "6H" {
		t.Fatalf("MarketingCarrier=%q want 6H", seg.MarketingCarrier)
	}
}

func TestProdShape_airlinePrefillPieces(t *testing.T) {
	opt := prodShapeKiwiIsrairOption()
	sess := &SearchSession{Params: CreateSearchSessionRequest{
		Origin: "TLV", Destination: "PRG",
		DepartureDate: "2026-11-13", ReturnDate: "2026-11-20",
		Adults: 1, Currency: "USD",
	}}
	if got := marketingCarrierForLeg(opt, 0); got != "6H" {
		t.Fatalf("marketingCarrierForLeg=%q want 6H", got)
	}
	u := BuildLegAirlineDirectURL(sess, opt, 0, -1, "", "")
	if u == "" || !strings.Contains(strings.ToLower(u), "israir") {
		t.Fatalf("BuildLegAirlineDirectURL=%q", u)
	}
	pre := bookingPrefillURL(sess, opt, -1, -1)
	if pre == "" || !isAffiliateTemplateBookingURL(pre) {
		t.Fatalf("bookingPrefillURL=%q affiliate=%v", pre, isAffiliateTemplateBookingURL(pre))
	}
}

func TestRunBookingMatch_prodShapeKiwiIsrairGetsAirlinePrefill(t *testing.T) {
	oldGF2 := bookingGF2OffersResolver
	oldOTA := bookingOTAOffersResolver
	oldWeb := bookingMatchRunner
	defer func() {
		bookingGF2OffersResolver = oldGF2
		bookingOTAOffersResolver = oldOTA
		bookingMatchRunner = oldWeb
	}()
	// Simulate live: OTA partner panel empty, GF2 rematch empty, web search off.
	bookingGF2OffersResolver = func(ctx context.Context, session *SearchSession, option *FlightOption, wantItin search.CanonicalItinerary, legIndex int, segmentIndex int) ([]bookingmatch.BookingOffer, error) {
		return nil, nil
	}
	bookingOTAOffersResolver = func(ctx context.Context, session *SearchSession, option *FlightOption, wantItin search.CanonicalItinerary, legIndex int, segmentIndex int) ([]bookingmatch.BookingOffer, error) {
		return nil, nil
	}
	bookingMatchRunner = func(ctx context.Context, it search.CanonicalItinerary) (*bookingmatch.MatchResult, error) {
		return nil, errBookingSearchUnavailable
	}

	opt := prodShapeKiwiIsrairOption()
	session := &SearchSession{Params: CreateSearchSessionRequest{
		Origin: "TLV", Destination: "PRG",
		DepartureDate: "2026-11-13", ReturnDate: "2026-11-20",
		Adults: 1, Currency: "USD",
	}}
	it, err := canonicalItineraryForOption(opt, -1, -1)
	if err != nil {
		t.Fatal(err)
	}
	fp := search.CanonicalItineraryFingerprint(it)
	resp := runBookingMatch(context.Background(), session, opt, it, fp, -1, -1)
	if !resp.Found || resp.Offer == nil {
		t.Fatalf("expected Kiwi listing for Israir Kiwi fare, got found=%v status=%s msg=%s", resp.Found, resp.Status, resp.Message)
	}
	if !strings.Contains(strings.ToLower(resp.Offer.URL), "kiwi.com") {
		t.Fatalf("expected Kiwi listing URL, got %q", resp.Offer.URL)
	}
	if resp.Offer.PriceLabel != "search_prefill" {
		t.Fatalf("priceLabel=%q want search_prefill", resp.Offer.PriceLabel)
	}
	if resp.AirlineDirect == nil || !strings.Contains(strings.ToLower(resp.AirlineDirect.URL), "israir") {
		t.Fatalf("expected Israir airline secondary, got %+v", resp.AirlineDirect)
	}
	if resp.AirlineDirect.PriceLabel != "airline_direct_prefill" {
		t.Fatalf("airlineDirect.priceLabel=%q", resp.AirlineDirect.PriceLabel)
	}
}

// HTTP path shaped like live sess_dmt5sgj985sc / opt_10: empty OTA panel + no web search
// must open the Kiwi listing (where the fare was shown) with Israir airline as secondary.
func TestHandleBookingResolve_prodShapeKiwiIsrairHTTP(t *testing.T) {
	oldGF2 := bookingGF2OffersResolver
	oldOTA := bookingOTAOffersResolver
	oldWeb := bookingMatchRunner
	defer func() {
		bookingGF2OffersResolver = oldGF2
		bookingOTAOffersResolver = oldOTA
		bookingMatchRunner = oldWeb
	}()
	bookingGF2OffersResolver = func(ctx context.Context, session *SearchSession, option *FlightOption, wantItin search.CanonicalItinerary, legIndex int, segmentIndex int) ([]bookingmatch.BookingOffer, error) {
		return nil, nil
	}
	bookingOTAOffersResolver = func(ctx context.Context, session *SearchSession, option *FlightOption, wantItin search.CanonicalItinerary, legIndex int, segmentIndex int) ([]bookingmatch.BookingOffer, error) {
		return nil, nil
	}
	bookingMatchRunner = func(ctx context.Context, it search.CanonicalItinerary) (*bookingmatch.MatchResult, error) {
		return nil, errBookingSearchUnavailable
	}

	opt := prodShapeKiwiIsrairOption()
	sid := "sess_kiwi_israir_verify"
	sessionsMu.Lock()
	sessions[sid] = SearchSessionResultsResponse{
		Session: SearchSession{
			ID:        sid,
			CreatedAt: time.Now(),
			Status:    StatusComplete,
			Params: CreateSearchSessionRequest{
				Origin: "TLV", Destination: "PRG",
				DepartureDate: "2026-11-13", ReturnDate: "2026-11-20",
				Adults: 1, Currency: "USD", CabinClass: "ECONOMY",
			},
		},
		Results: []FlightOption{*opt},
	}
	sessionsMu.Unlock()

	body, _ := json.Marshal(BookingResolveRequest{SessionID: sid, OptionID: "opt_10", Force: true})
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
	if !out.Found || out.Status != BookingResolveVerified || out.Offer == nil {
		t.Fatalf("expected verified Kiwi listing, got found=%v status=%s msg=%s body=%s", out.Found, out.Status, out.Message, rec.Body.String())
	}
	if !strings.Contains(strings.ToLower(out.Offer.URL), "kiwi.com") {
		t.Fatalf("expected Kiwi listing URL, got %q", out.Offer.URL)
	}
	if out.Offer.PriceLabel != "search_prefill" {
		t.Fatalf("priceLabel=%q want search_prefill", out.Offer.PriceLabel)
	}
	if out.AirlineDirect == nil || !strings.Contains(strings.ToLower(out.AirlineDirect.URL), "israir") {
		t.Fatalf("expected Israir airline secondary, got %+v", out.AirlineDirect)
	}
}

// Live Wizz-on-Kiwi shape: airline calendar often has no flights that day. Prefer Kiwi listing.
func TestRunBookingMatch_kiwiWizzPrefersListingOverAirlineCalendar(t *testing.T) {
	oldGF2 := bookingGF2OffersResolver
	oldOTA := bookingOTAOffersResolver
	oldWeb := bookingMatchRunner
	defer func() {
		bookingGF2OffersResolver = oldGF2
		bookingOTAOffersResolver = oldOTA
		bookingMatchRunner = oldWeb
	}()
	bookingGF2OffersResolver = func(ctx context.Context, session *SearchSession, option *FlightOption, wantItin search.CanonicalItinerary, legIndex int, segmentIndex int) ([]bookingmatch.BookingOffer, error) {
		return nil, nil
	}
	bookingOTAOffersResolver = func(ctx context.Context, session *SearchSession, option *FlightOption, wantItin search.CanonicalItinerary, legIndex int, segmentIndex int) ([]bookingmatch.BookingOffer, error) {
		return nil, nil
	}
	bookingMatchRunner = func(ctx context.Context, it search.CanonicalItinerary) (*bookingmatch.MatchResult, error) {
		return nil, errBookingSearchUnavailable
	}

	depOut := time.Date(2026, 11, 28, 8, 50, 0, 0, time.FixedZone("IST", 2*3600))
	arrOut := time.Date(2026, 11, 28, 16, 45, 0, 0, time.FixedZone("CET", 1*3600))
	depIn := time.Date(2026, 11, 30, 22, 0, 0, 0, time.FixedZone("CET", 1*3600))
	arrIn := time.Date(2026, 12, 1, 8, 10, 0, 0, time.FixedZone("IST", 2*3600))
	opt := &FlightOption{
		ID:                    "opt_0",
		Source:                "kiwi",
		VendorName:            "Kiwi.com",
		PrimaryDisplayCarrier: "W4",
		Price:                 MonetaryAmount{Currency: "USD", Amount: 229},
		ListingURL:            "https://www.kiwi.com/en/search/results/tel-aviv-israel/barcelona-spain/2026-11-28/2026-11-30/",
		Legs: []FlightLeg{
			{Segments: []FlightSegment{{
				From: AirportLike{Code: "TLV"}, To: AirportLike{Code: "BCN"},
				DepartureTime: depOut, ArrivalTime: arrOut,
				MarketingCarrier: Carrier{Code: "W4"},
				DurationMinutes:  535, CabinClass: "ECONOMY",
			}}},
			{Segments: []FlightSegment{{
				From: AirportLike{Code: "BCN"}, To: AirportLike{Code: "TLV"},
				DepartureTime: depIn, ArrivalTime: arrIn,
				MarketingCarrier: Carrier{Code: "W4"},
				DurationMinutes:  550, CabinClass: "ECONOMY",
			}}},
		},
	}
	session := &SearchSession{Params: CreateSearchSessionRequest{
		Origin: "TLV", Destination: "BCN",
		DepartureDate: "2026-11-28", ReturnDate: "2026-11-30",
		Adults: 1, Currency: "USD",
	}}
	it, err := canonicalItineraryForOption(opt, -1, -1)
	if err != nil {
		t.Fatal(err)
	}
	fp := search.CanonicalItineraryFingerprint(it)
	resp := runBookingMatch(context.Background(), session, opt, it, fp, -1, -1)
	if !resp.Found || resp.Offer == nil {
		t.Fatalf("expected Kiwi listing, got found=%v status=%s", resp.Found, resp.Status)
	}
	if !strings.Contains(strings.ToLower(resp.Offer.URL), "kiwi.com") {
		t.Fatalf("primary should be Kiwi listing, got %q", resp.Offer.URL)
	}
	if resp.AirlineDirect == nil || !strings.Contains(strings.ToLower(resp.AirlineDirect.URL), "wizzair.com") {
		t.Fatalf("expected Wizz secondary prefill, got %+v", resp.AirlineDirect)
	}
}
