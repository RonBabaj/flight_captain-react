package main

import (
	"context"
	"strings"
	"testing"
	"time"

	"flightcaptainweb/bookingmatch"
	"flightcaptainweb/search"
)

// Live shape from sess_dmt6q8yg3p24 / opt_0 — Skyscanner DOM scrape with times but
// empty carriers, listing URL only. Prod returned not_found after ~43s.
func prodShapeSkyscannerEmptyCarrierOption() *FlightOption {
	depOut := time.Date(2027, 1, 7, 13, 40, 0, 0, time.FixedZone("IST", 2*3600))
	arrOut := time.Date(2027, 1, 7, 17, 25, 0, 0, time.FixedZone("CET", 1*3600))
	depIn := time.Date(2027, 1, 14, 19, 15, 0, 0, time.FixedZone("CET", 1*3600))
	arrIn := time.Date(2027, 1, 14, 22, 40, 0, 0, time.FixedZone("IST", 2*3600))
	return &FlightOption{
		ID:         "opt_0",
		Source:     "skyscanner",
		VendorName: "Skyscanner",
		Price:      MonetaryAmount{Currency: "USD", Amount: 278},
		ListingURL: "https://www.skyscanner.fr/transport/vols/tlv/vie/270107/270114/?rtn=1&adultsv2=1&cabinclass=economy",
		Legs: []FlightLeg{
			{Segments: []FlightSegment{{
				From: AirportLike{Code: "TLV"}, To: AirportLike{Code: "VIE"},
				DepartureTime: depOut, ArrivalTime: arrOut,
				DurationMinutes: 225, CabinClass: "ECONOMY",
			}}},
			{Segments: []FlightSegment{{
				From: AirportLike{Code: "VIE"}, To: AirportLike{Code: "TLV"},
				DepartureTime: depIn, ArrivalTime: arrIn,
				DurationMinutes: 145, CabinClass: "ECONOMY",
			}}},
		},
	}
}

func TestOtaListingPrefillURL_skyscanner(t *testing.T) {
	opt := prodShapeSkyscannerEmptyCarrierOption()
	u := otaListingPrefillURL(opt, -1)
	if u == "" || !strings.Contains(u, "skyscanner") {
		t.Fatalf("otaListingPrefillURL=%q", u)
	}
	if otaListingPrefillURL(opt, 0) != "" {
		t.Fatal("per-leg must not reuse outbound listing")
	}
}

func TestRunBookingMatch_skyscannerEmptyCarrierGetsListingPrefill(t *testing.T) {
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

	opt := prodShapeSkyscannerEmptyCarrierOption()
	session := &SearchSession{Params: CreateSearchSessionRequest{
		Origin: "TLV", Destination: "VIE",
		DepartureDate: "2027-01-07", ReturnDate: "2027-01-14",
		Adults: 1, Currency: "USD",
	}}
	it, err := canonicalItineraryForOption(opt, -1, -1)
	if err != nil {
		t.Fatal(err)
	}
	fp := search.CanonicalItineraryFingerprint(it)
	resp := runBookingMatch(context.Background(), session, opt, it, fp, -1, -1)
	if !resp.Found || resp.Offer == nil {
		t.Fatalf("expected Skyscanner listing prefill, got found=%v status=%s msg=%s", resp.Found, resp.Status, resp.Message)
	}
	if !strings.Contains(strings.ToLower(resp.Offer.URL), "skyscanner") {
		t.Fatalf("url=%q", resp.Offer.URL)
	}
	if resp.Offer.PriceLabel != "search_prefill" {
		t.Fatalf("priceLabel=%q", resp.Offer.PriceLabel)
	}
}
