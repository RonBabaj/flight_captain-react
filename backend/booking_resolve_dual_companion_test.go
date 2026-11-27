package main

import (
	"context"
	"strings"
	"testing"
	"time"

	"flightcaptainweb/bookingmatch"
	"flightcaptainweb/search"
)

func TestEnsureDualBookingCompanion_attachesOTAWhenAirlineOnly(t *testing.T) {
	dep := time.Date(2026, 11, 27, 10, 0, 0, 0, time.UTC)
	seg := search.CanonicalSegment{
		From: "TLV", To: "ATH",
		DepartureTime: dep, MarketingCarrier: "LH", FlightNumber: "LH686",
	}
	it := search.CanonicalItinerary{
		Segments: []search.CanonicalSegment{seg},
		Legs:     []search.CanonicalLeg{{Segments: []search.CanonicalSegment{seg}}},
	}
	fp := search.CanonicalItineraryFingerprint(it)

	oldGF2 := bookingGF2OffersResolver
	defer func() { bookingGF2OffersResolver = oldGF2 }()
	bookingGF2OffersResolver = func(
		ctx context.Context,
		session *SearchSession,
		option *FlightOption,
		wantItin search.CanonicalItinerary,
		legIndex int,
		segmentIndex int,
	) ([]bookingmatch.BookingOffer, error) {
		return []bookingmatch.BookingOffer{{
			Domain:               "kiwi.com",
			URL:                  "https://www.kiwi.com/en/booking/?token=leg1",
			URLType:              bookingmatch.URLTypeExactBooking,
			VerificationStatus:   bookingmatch.StatusVerifiedExact,
			ItineraryFingerprint: fp,
			CheckedAt:            time.Now().UTC(),
		}}, nil
	}

	opt := &FlightOption{
		Source: "googleflights2",
		Price:  MonetaryAmount{Amount: 150, Currency: "USD"},
		Legs: []FlightLeg{{Segments: []FlightSegment{{
			From: AirportLike{Code: "TLV"}, To: AirportLike{Code: "ATH"},
			DepartureTime: dep, MarketingCarrier: Carrier{Code: "LH"}, FlightNumber: "LH686",
		}}}},
	}
	airline := &PublicBookingOffer{
		Provider:   "Lufthansa",
		Domain:     "lufthansa.com",
		URL:        "https://www.lufthansa.com/",
		PriceLabel: "airline_direct_prefill",
		Currency:   "USD",
	}
	p := 150.0
	airline.Price = &p
	resp := BookingResolveResponse{
		Found:                true,
		Status:               BookingResolveVerified,
		ItineraryFingerprint: fp,
		Offer:                airline,
		AirlineDirect:        airline,
	}
	ensureDualBookingCompanion(context.Background(), nil, opt, it, fp, 0, 0, &resp)
	if resp.CheapestOta == nil || resp.CheapestOta.URL != "https://www.kiwi.com/en/booking/?token=leg1" {
		t.Fatalf("expected OTA companion, got cheapestOta=%+v", resp.CheapestOta)
	}
	if resp.AirlineDirect == nil {
		t.Fatal("expected airline direct to remain")
	}
}

func TestEnsureDualBookingCompanion_attachesAirlineWhenOTAOnlySwissHop(t *testing.T) {
	dep := time.Date(2026, 11, 28, 18, 0, 0, 0, time.UTC)
	seg := search.CanonicalSegment{
		From: "TLV", To: "ZRH",
		DepartureTime: dep, MarketingCarrier: "LX", FlightNumber: "LX253",
	}
	it := search.CanonicalItinerary{
		Segments: []search.CanonicalSegment{seg},
		Legs:     []search.CanonicalLeg{{Segments: []search.CanonicalSegment{seg}}},
	}
	fp := search.CanonicalItineraryFingerprint(it)

	oldGF2 := bookingGF2OffersResolver
	defer func() { bookingGF2OffersResolver = oldGF2 }()
	bookingGF2OffersResolver = func(
		ctx context.Context,
		session *SearchSession,
		option *FlightOption,
		wantItin search.CanonicalItinerary,
		legIndex int,
		segmentIndex int,
	) ([]bookingmatch.BookingOffer, error) {
		return nil, nil
	}

	opt := &FlightOption{
		Source: "googleflights2",
		Price:  MonetaryAmount{Amount: 344, Currency: "USD"},
		Legs: []FlightLeg{{Segments: []FlightSegment{{
			From: AirportLike{Code: "TLV"}, To: AirportLike{Code: "ZRH"},
			DepartureTime: dep, MarketingCarrier: Carrier{Code: "LX"}, FlightNumber: "LX253",
		}}}},
	}
	session := &SearchSession{Params: CreateSearchSessionRequest{
		Origin: "TLV", Destination: "VIE",
		DepartureDate: "2026-11-28", Adults: 1, Currency: "USD",
	}}
	p := 180.0
	ota := &PublicBookingOffer{
		Provider:   "Orbitz",
		Domain:     "orbitz.com",
		URL:        "https://www.orbitz.com/book?x=1",
		PriceLabel: "verified",
		Currency:   "USD",
		Price:      &p,
	}
	resp := BookingResolveResponse{
		Found:                true,
		Status:               BookingResolveVerified,
		ItineraryFingerprint: fp,
		Offer:                ota,
		CheapestOta:          ota,
	}
	ensureDualBookingCompanion(context.Background(), session, opt, it, fp, 0, 0, &resp)
	if resp.CheapestOta == nil || resp.CheapestOta.URL != ota.URL {
		t.Fatalf("OTA must remain, got %+v", resp.CheapestOta)
	}
	if resp.AirlineDirect == nil {
		t.Fatal("expected airlineDirect companion for Swiss LX hop")
	}
	low := strings.ToLower(resp.AirlineDirect.URL)
	if !strings.Contains(low, "swiss.com") || !strings.Contains(low, "search-flights") {
		t.Fatalf("expected Swiss search-flights airlineDirect, got %q", resp.AirlineDirect.URL)
	}
}

func TestApplyAirlinePrefillPricing_clearsSearchQuoteWhenOTAPriced(t *testing.T) {
	p := 728.0
	q := 185.0
	resp := BookingResolveResponse{
		CheapestOta: &PublicBookingOffer{
			Provider: "Priceline", Domain: "priceline.com",
			URL: "https://www.priceline.com/book", Price: &p, Currency: "USD",
			PriceLabel: "google_flights_partner",
		},
		AirlineDirect: &PublicBookingOffer{
			Provider: "British Airways", Domain: "britishairways.com",
			URL: "https://www.britishairways.com/travel/book/public/en_us/flightList?onds=TLV-LHR_2026-11-28&ad=1",
			Price: &q, Currency: "USD", PriceLabel: "airline_direct",
		},
	}
	sess := &SearchSession{Params: CreateSearchSessionRequest{
		Origin: "TLV", Destination: "LHR", DepartureDate: "2026-11-28", Adults: 1, Currency: "USD",
	}}
	opt := &FlightOption{Price: MonetaryAmount{Amount: 185, Currency: "USD"}}
	applyAirlinePrefillPricing(&resp, sess, opt, -1)
	if resp.AirlineDirect.PriceLabel != "airline_direct_prefill" {
		t.Fatalf("priceLabel=%q", resp.AirlineDirect.PriceLabel)
	}
	if resp.AirlineDirect.Price != nil {
		t.Fatalf("must not keep search quote on BA prefill beside priced OTA, got %v", *resp.AirlineDirect.Price)
	}
}

func TestRunBookingMatch_swissHopPrefillNotNotFound(t *testing.T) {
	dep := time.Date(2026, 11, 28, 18, 0, 0, 0, time.UTC)
	arr := time.Date(2026, 11, 28, 22, 10, 0, 0, time.UTC)
	seg := search.CanonicalSegment{
		From: "TLV", To: "ZRH",
		DepartureTime: dep, ArrivalTime: arr,
		MarketingCarrier: "LX", FlightNumber: "LX253",
	}
	it := search.CanonicalItinerary{
		Segments: []search.CanonicalSegment{seg},
		Legs:     []search.CanonicalLeg{{Segments: []search.CanonicalSegment{seg}}},
	}
	fp := search.CanonicalItineraryFingerprint(it)

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

	opt := &FlightOption{
		Source: "googleflights2",
		Price:  MonetaryAmount{Amount: 344, Currency: "USD"},
		Legs: []FlightLeg{{Segments: []FlightSegment{{
			From: AirportLike{Code: "TLV"}, To: AirportLike{Code: "ZRH"},
			DepartureTime: dep, ArrivalTime: arr,
			MarketingCarrier: Carrier{Code: "LX"}, FlightNumber: "LX253",
		}}}},
	}
	session := &SearchSession{Params: CreateSearchSessionRequest{
		Origin: "TLV", Destination: "VIE",
		DepartureDate: "2026-11-28", Adults: 1, Currency: "USD",
	}}
	resp := runBookingMatch(context.Background(), session, opt, it, fp, 0, 0)
	if !resp.Found || resp.Status == BookingResolveNotFound {
		t.Fatalf("Swiss hop must not be not_found; got found=%v status=%s msg=%q", resp.Found, resp.Status, resp.Message)
	}
	if resp.AirlineDirect == nil || !strings.Contains(strings.ToLower(resp.AirlineDirect.URL), "swiss.com") {
		t.Fatalf("expected Swiss airlineDirect prefill, got %+v", resp.AirlineDirect)
	}
}