package main

import (
	"context"
	"strings"
	"testing"
	"time"

	"flightcaptainweb/bookingmatch"
	"flightcaptainweb/search"
)

func TestBuildCondorSearchURL_roundTrip(t *testing.T) {
	u := buildCondorSearchURL("TLV", "MBJ", "2025-11-21", "2025-11-28")
	if u == "" {
		t.Fatal("empty condor URL")
	}
	if !strings.Contains(u, "origin=TLV") || !strings.Contains(u, "destination=MBJ") {
		t.Fatalf("route missing: %q", u)
	}
	if !strings.Contains(u, "outboundDate=20251121") || !strings.Contains(u, "inboundDate=20251128") {
		t.Fatalf("dates missing: %q", u)
	}
	if !strings.Contains(u, "oneway=false") {
		t.Fatalf("expected RT: %q", u)
	}
	if !isAffiliateTemplateBookingURL(u) {
		t.Fatalf("condor search should count as template: %q", u)
	}
}

func TestBuildLegAirlineDirectURL_condor(t *testing.T) {
	dep := time.Date(2025, 11, 21, 5, 40, 0, 0, time.UTC)
	arr := time.Date(2025, 11, 21, 16, 20, 0, 0, time.UTC)
	retDep := time.Date(2025, 11, 28, 18, 15, 0, 0, time.UTC)
	opt := &FlightOption{
		Legs: []FlightLeg{
			{Segments: []FlightSegment{{
				From: AirportLike{Code: "TLV"}, To: AirportLike{Code: "MBJ"},
				DepartureTime: dep, ArrivalTime: arr,
				MarketingCarrier: Carrier{Code: "DE"},
			}}},
			{Segments: []FlightSegment{{
				From: AirportLike{Code: "MBJ"}, To: AirportLike{Code: "TLV"},
				DepartureTime: retDep,
				MarketingCarrier: Carrier{Code: "DE"},
			}}},
		},
	}
	sess := &SearchSession{Params: CreateSearchSessionRequest{
		ReturnDate: "2025-11-28",
		Adults:     2,
	}}
	u := BuildLegAirlineDirectURL(sess, opt, 0, -1, "", "")
	if u == "" || !strings.Contains(u, "condor.com") {
		t.Fatalf("BuildLegAirlineDirectURL(DE)=%q", u)
	}
}

func TestRunBookingMatch_skyscannerSessionDualWithCondorPrefill(t *testing.T) {
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

	dep := time.Date(2025, 11, 21, 5, 40, 0, 0, time.UTC)
	arr := time.Date(2025, 11, 21, 16, 20, 0, 0, time.UTC)
	retDep := time.Date(2025, 11, 28, 18, 15, 0, 0, time.UTC)
	opt := &FlightOption{
		Source:   "skyscanner",
		DeepLink: "https://www.skyscanner.net/transport_deeplink/4.0/IL/en/USD/air/de/flights?itinerary=tlv-mbj",
		Price:    MonetaryAmount{Amount: 1544, Currency: "USD"},
		Legs: []FlightLeg{
			{Segments: []FlightSegment{{
				From: AirportLike{Code: "TLV"}, To: AirportLike{Code: "MBJ"},
				DepartureTime: dep, ArrivalTime: arr,
				MarketingCarrier: Carrier{Code: "DE"}, FlightNumber: "DE4309",
			}}},
			{Segments: []FlightSegment{{
				From: AirportLike{Code: "MBJ"}, To: AirportLike{Code: "TLV"},
				DepartureTime: retDep,
				MarketingCarrier: Carrier{Code: "DE"}, FlightNumber: "DE2162",
			}}},
		},
	}
	session := &SearchSession{Params: CreateSearchSessionRequest{
		Origin: "TLV", Destination: "MBJ",
		DepartureDate: "2025-11-21", ReturnDate: "2025-11-28",
		Adults: 1, Currency: "USD",
	}}
	it, err := canonicalItineraryForOption(opt, -1, -1)
	if err != nil {
		t.Fatal(err)
	}
	fp := search.CanonicalItineraryFingerprint(it)
	resp := runBookingMatch(context.Background(), session, opt, it, fp, -1, -1)
	if resp.CheapestOta == nil || !strings.Contains(resp.CheapestOta.URL, "transport_deeplink") {
		t.Fatalf("expected cheapestOta=session deeplink, got %+v", resp.CheapestOta)
	}
	if resp.AirlineDirect == nil || !strings.Contains(strings.ToLower(resp.AirlineDirect.URL), "condor.com") {
		t.Fatalf("expected airlineDirect Condor prefill, got %+v", resp.AirlineDirect)
	}
	if sameBookingURL(resp.CheapestOta.URL, resp.AirlineDirect.URL) {
		t.Fatal("dual options must differ")
	}
	if resp.AirlineDirect.Price == nil || *resp.AirlineDirect.Price <= 0 {
		t.Fatalf("airlineDirect should show search quote price, got %+v", resp.AirlineDirect)
	}
}

func TestPickAirlineDirectOffer_fullItineraryUsesLegZeroTemplate(t *testing.T) {
	dep := time.Date(2027, 1, 7, 10, 0, 0, 0, time.UTC)
	arr := time.Date(2027, 1, 7, 14, 0, 0, 0, time.UTC)
	opt := &FlightOption{
		Legs: []FlightLeg{{
			Segments: []FlightSegment{{
				From: AirportLike{Code: "TLV"}, To: AirportLike{Code: "VIE"},
				DepartureTime: dep, ArrivalTime: arr,
				MarketingCarrier: Carrier{Code: "LY"},
			}},
		}},
	}
	sess := &SearchSession{Params: CreateSearchSessionRequest{Adults: 1}}
	it, err := canonicalItineraryForOption(opt, -1, -1)
	if err != nil {
		t.Fatal(err)
	}
	fp := search.CanonicalItineraryFingerprint(it)
	ad := pickAirlineDirectOffer(nil, nil, sess, opt, -1, -1, fp, bookingMatchPriceNormalizer())
	if ad == nil || !strings.Contains(strings.ToLower(ad.URL), "elal") {
		t.Fatalf("expected LY template for legIndex -1, got %+v", ad)
	}
}