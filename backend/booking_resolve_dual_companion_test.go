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

func TestEnsureDualBookingCompanion_attachesAirlineWhenOTAOnlyAustrian(t *testing.T) {
	dep := time.Date(2026, 11, 28, 15, 40, 0, 0, time.UTC)
	seg := search.CanonicalSegment{
		From: "TLV", To: "VIE",
		DepartureTime: dep, MarketingCarrier: "OS", FlightNumber: "OS860",
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
		Price:  MonetaryAmount{Amount: 185, Currency: "USD"},
		Legs: []FlightLeg{{Segments: []FlightSegment{{
			From: AirportLike{Code: "TLV"}, To: AirportLike{Code: "VIE"},
			DepartureTime: dep, MarketingCarrier: Carrier{Code: "OS"}, FlightNumber: "OS860",
		}}}},
	}
	session := &SearchSession{Params: CreateSearchSessionRequest{
		Origin: "TLV", Destination: "VIE",
		DepartureDate: "2026-11-28", Adults: 1, Currency: "USD",
	}}
	p := 185.0
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
		t.Fatal("expected airlineDirect companion for Austrian OS")
	}
	low := strings.ToLower(resp.AirlineDirect.URL)
	if !strings.Contains(low, "austrian.com") || !strings.Contains(low, "search-flights") {
		t.Fatalf("expected Austrian search-flights airlineDirect, got %q", resp.AirlineDirect.URL)
	}
	if !strings.Contains(low, "origin1=tlv") || !strings.Contains(low, "destination1=vie") {
		t.Fatalf("airlineDirect missing route: %q", resp.AirlineDirect.URL)
	}
}