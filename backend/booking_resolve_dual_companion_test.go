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
	applyAirlinePrefillPricing(&resp)
	if resp.AirlineDirect.PriceLabel != "airline_direct_prefill" {
		t.Fatalf("priceLabel=%q", resp.AirlineDirect.PriceLabel)
	}
	if resp.AirlineDirect.Price != nil {
		t.Fatalf("must not keep search quote on BA prefill beside priced OTA, got %v", *resp.AirlineDirect.Price)
	}
}

func TestApplyAirlinePrefillPricing_neverAttachesSearchQuote(t *testing.T) {
	q := 185.0
	resp := BookingResolveResponse{
		AirlineDirect: &PublicBookingOffer{
			Provider: "Aegean Airlines", Domain: "aegeanair.com",
			URL: "https://flights.aegeanair.com/en/?Origin=ATH&Destination=LHR&DepartureDate=2026-06-15&Adults=1",
			Price: &q, Currency: "USD", PriceLabel: "airline_direct",
		},
	}
	applyAirlinePrefillPricing(&resp)
	if resp.AirlineDirect.PriceLabel != "airline_direct_prefill" {
		t.Fatalf("priceLabel=%q", resp.AirlineDirect.PriceLabel)
	}
	if resp.AirlineDirect.Price != nil || resp.AirlineDirect.Currency != "" {
		t.Fatalf("prefill must not carry a fare, got price=%v currency=%q", resp.AirlineDirect.Price, resp.AirlineDirect.Currency)
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

// Exact prod shape from "LEG 1 OF 3" self-transfer: LX TLV→ZRH + OS ZRH→VIE + BZ VIE→TLV.
// Empty GF2/OTA/web must still return Swiss airline-direct — never "No verified booking offer found yet".
func TestRunBookingMatch_leg1Of3SwissSelfTransferNotNotFound(t *testing.T) {
	depLX := time.Date(2026, 12, 25, 6, 0, 0, 0, time.UTC)
	arrLX := time.Date(2026, 12, 25, 10, 40, 0, 0, time.UTC)
	depOS := time.Date(2026, 12, 25, 19, 20, 0, 0, time.UTC)
	arrOS := time.Date(2026, 12, 25, 20, 40, 0, 0, time.UTC)
	depBZ := time.Date(2026, 12, 31, 14, 45, 0, 0, time.UTC)
	arrBZ := time.Date(2026, 12, 31, 19, 15, 0, 0, time.UTC)

	opt := &FlightOption{
		Source: "googleflights2",
		Price:  MonetaryAmount{Amount: 400, Currency: "USD"},
		Legs: []FlightLeg{
			{Segments: []FlightSegment{
				{
					From: AirportLike{Code: "TLV"}, To: AirportLike{Code: "ZRH"},
					DepartureTime: depLX, ArrivalTime: arrLX,
					MarketingCarrier: Carrier{Code: "LX", Name: "SWISS"}, FlightNumber: "LX257",
				},
				{
					From: AirportLike{Code: "ZRH"}, To: AirportLike{Code: "VIE"},
					DepartureTime: depOS, ArrivalTime: arrOS,
					MarketingCarrier: Carrier{Code: "OS", Name: "Austrian Airlines"}, FlightNumber: "OS144",
				},
			}},
			{Segments: []FlightSegment{{
				From: AirportLike{Code: "VIE"}, To: AirportLike{Code: "TLV"},
				DepartureTime: depBZ, ArrivalTime: arrBZ,
				MarketingCarrier: Carrier{Code: "BZ", Name: "Bluebird Airways"}, FlightNumber: "BZ317",
			}}},
		},
	}

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

	session := &SearchSession{Params: CreateSearchSessionRequest{
		Origin: "TLV", Destination: "VIE",
		DepartureDate: "2026-12-25", ReturnDate: "2026-12-31",
		Adults: 1, Currency: "USD",
	}}

	// LEG 1 OF 3 — TLV→ZRH SWISS
	it0, err := canonicalItineraryForOption(opt, 0, 0)
	if err != nil {
		t.Fatal(err)
	}
	fp0 := search.CanonicalItineraryFingerprint(it0)
	resp0 := runBookingMatch(context.Background(), session, opt, it0, fp0, 0, 0)
	if !resp0.Found || resp0.Status == BookingResolveNotFound {
		t.Fatalf("LEG1 LX must not be not_found; got found=%v status=%s msg=%q", resp0.Found, resp0.Status, resp0.Message)
	}
	if resp0.AirlineDirect == nil || !strings.Contains(strings.ToLower(resp0.AirlineDirect.URL), "swiss.com") ||
		!strings.Contains(resp0.AirlineDirect.URL, "origin1=TLV") || !strings.Contains(resp0.AirlineDirect.URL, "destination1=ZRH") {
		t.Fatalf("LEG1 expected swiss.com TLV→ZRH search-flights, got %+v", resp0.AirlineDirect)
	}

	// LEG 2 OF 3 — ZRH→VIE Austrian
	it1, err := canonicalItineraryForOption(opt, 0, 1)
	if err != nil {
		t.Fatal(err)
	}
	fp1 := search.CanonicalItineraryFingerprint(it1)
	resp1 := runBookingMatch(context.Background(), session, opt, it1, fp1, 0, 1)
	if !resp1.Found || resp1.Status == BookingResolveNotFound {
		t.Fatalf("LEG2 OS must not be not_found; got found=%v status=%s msg=%q", resp1.Found, resp1.Status, resp1.Message)
	}
	if resp1.AirlineDirect == nil || !strings.Contains(strings.ToLower(resp1.AirlineDirect.URL), "austrian.com") {
		t.Fatalf("LEG2 expected austrian.com prefill, got %+v", resp1.AirlineDirect)
	}
}