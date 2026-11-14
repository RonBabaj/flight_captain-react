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
// empty carriers, listing URL only.
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

func prodShapeSkyscannerAustrianOption() *FlightOption {
	opt := prodShapeSkyscannerEmptyCarrierOption()
	opt.PrimaryDisplayCarrier = "OS"
	opt.ValidatingAirlines = []string{"OS"}
	for i := range opt.Legs {
		for j := range opt.Legs[i].Segments {
			opt.Legs[i].Segments[j].MarketingCarrier = Carrier{Code: "OS", Name: "Austrian Airlines"}
		}
	}
	return opt
}

func TestOtaListingPrefillURL_rejectsSkyscannerMeta(t *testing.T) {
	opt := prodShapeSkyscannerEmptyCarrierOption()
	if u := otaListingPrefillURL(opt, -1); u != "" {
		t.Fatalf("meta listing must not be a Book handoff, got %q", u)
	}
}

func TestRunBookingMatch_skyscannerEmptyCarrierNotMetaListing(t *testing.T) {
	oldGF2 := bookingGF2OffersResolver
	oldOTA := bookingOTAOffersResolver
	oldWeb := bookingMatchRunner
	defer func() {
		bookingGF2OffersResolver = oldGF2
		bookingOTAOffersResolver = oldOTA
		bookingMatchRunner = oldWeb
	}()
	var gf2Called, webCalled bool
	bookingGF2OffersResolver = func(ctx context.Context, session *SearchSession, option *FlightOption, wantItin search.CanonicalItinerary, legIndex int, segmentIndex int) ([]bookingmatch.BookingOffer, error) {
		gf2Called = true
		return nil, nil
	}
	bookingOTAOffersResolver = func(ctx context.Context, session *SearchSession, option *FlightOption, wantItin search.CanonicalItinerary, legIndex int, segmentIndex int) ([]bookingmatch.BookingOffer, error) {
		return nil, nil
	}
	bookingMatchRunner = func(ctx context.Context, it search.CanonicalItinerary) (*bookingmatch.MatchResult, error) {
		webCalled = true
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
	if resp.Found && resp.Offer != nil && strings.Contains(strings.ToLower(resp.Offer.URL), "skyscanner") {
		t.Fatalf("must not Book via Skyscanner listing, got %q", resp.Offer.URL)
	}
	if resp.Found {
		t.Fatalf("expected not_found without seller handoff, got found status=%s url=%v", resp.Status, resp.Offer)
	}
	if gf2Called || webCalled {
		t.Fatal("a Skyscanner fare must not be re-found with a Google search")
	}
}

func TestRunBookingMatch_skyscannerDeeplinkIsTheBooking(t *testing.T) {
	oldGF2 := bookingGF2OffersResolver
	oldOTA := bookingOTAOffersResolver
	oldWeb := bookingMatchRunner
	defer func() {
		bookingGF2OffersResolver = oldGF2
		bookingOTAOffersResolver = oldOTA
		bookingMatchRunner = oldWeb
	}()
	var searched bool
	bookingGF2OffersResolver = func(ctx context.Context, session *SearchSession, option *FlightOption, wantItin search.CanonicalItinerary, legIndex int, segmentIndex int) ([]bookingmatch.BookingOffer, error) {
		searched = true
		return nil, nil
	}
	bookingOTAOffersResolver = func(ctx context.Context, session *SearchSession, option *FlightOption, wantItin search.CanonicalItinerary, legIndex int, segmentIndex int) ([]bookingmatch.BookingOffer, error) {
		searched = true
		return nil, nil
	}
	bookingMatchRunner = func(ctx context.Context, it search.CanonicalItinerary) (*bookingmatch.MatchResult, error) {
		searched = true
		return nil, errBookingSearchUnavailable
	}

	opt := prodShapeSkyscannerEmptyCarrierOption()
	opt.DeepLink = "https://www.skyscanner.net/transport_deeplink/4.0/FR/fr/EUR/air/airli/flights?itinerary=tlv-vie"
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
	if searched {
		t.Fatal("stored session deeplink must not start Google or a second scrape")
	}
	if !resp.Found || resp.Offer == nil || !strings.Contains(resp.Offer.URL, "transport_deeplink") {
		t.Fatalf("expected the session deeplink, got found=%v offer=%v", resp.Found, resp.Offer)
	}
}

func TestRunBookingMatch_skyscannerAustrianDoesNotUseBrokenDeeplink(t *testing.T) {
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

	opt := prodShapeSkyscannerAustrianOption()
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
	if resp.Found && resp.Offer != nil {
		low := strings.ToLower(resp.Offer.URL)
		if strings.Contains(low, "skyscanner") || strings.Contains(low, "austrian.com") {
			t.Fatalf("must not Book via Skyscanner or a broken Austrian URL, got %q", resp.Offer.URL)
		}
	}
	if resp.AirlineDirect != nil && strings.Contains(strings.ToLower(resp.AirlineDirect.URL), "austrian.com") {
		t.Fatalf("airline direct must not be an unverified Austrian URL: %q", resp.AirlineDirect.URL)
	}
}
