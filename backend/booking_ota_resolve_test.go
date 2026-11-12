package main

import (
	"context"
	"strings"
	"testing"
	"time"

	"flightcaptainweb/bookingmatch"
	"flightcaptainweb/search"
)

func TestIsOTAScrapedSource(t *testing.T) {
	if !isOTAScrapedSource("skyscanner") || !isOTAScrapedSource("Kiwi") {
		t.Fatal("expected OTA sources")
	}
	if isOTAScrapedSource("googleflights2") {
		t.Fatal("GF2 is not an OTA scrape source")
	}
}

func TestResolveOTAPartnerOffers_usesExistingCheckoutDeepLink(t *testing.T) {
	oldProv := otaScraperProvider
	defer func() { otaScraperProvider = oldProv }()
	// Non-nil so resolver runs; deep link short-circuit must not call HTTP.
	otaScraperProvider = &search.OtaScraperProvider{}

	dep := time.Date(2027, 1, 7, 13, 40, 0, 0, time.UTC)
	arr := time.Date(2027, 1, 7, 17, 25, 0, 0, time.UTC)
	opt := &FlightOption{
		ID:       "kiwi_1",
		Source:   "kiwi",
		Price:    MonetaryAmount{Currency: "USD", Amount: 199},
		DeepLink: "https://www.kiwi.com/en/booking?token=abc123",
		Legs: []FlightLeg{{
			Segments: []FlightSegment{{
				From: AirportLike{Code: "TLV"}, To: AirportLike{Code: "VIE"},
				DepartureTime:    dep,
				ArrivalTime:      arr,
				MarketingCarrier: Carrier{Code: "OS"},
				FlightNumber:     "OS860",
			}},
		}},
	}
	it := search.BuildCanonicalItinerary(search.ProviderResult{
		Source: opt.Source,
		Price:  search.Monetary{Currency: "USD", Amount: 199},
		Legs: []search.Leg{{
			Segments: []search.Segment{{
				From: "TLV", To: "VIE",
				DepartureTime:    dep,
				ArrivalTime:      arr,
				MarketingCarrier: "OS",
				FlightNumber:     "OS860",
			}},
		}},
	})

	offers, err := resolveOTAPartnerOffers(context.Background(), nil, opt, it, -1, -1)
	if err != nil {
		t.Fatalf("unexpected err: %v", err)
	}
	if len(offers) != 1 {
		t.Fatalf("expected 1 offer, got %d", len(offers))
	}
	if offers[0].VerificationStatus != bookingmatch.StatusVerifiedExact {
		t.Fatalf("expected verified exact, got %s", offers[0].VerificationStatus)
	}
	if !strings.Contains(offers[0].URL, "kiwi.com") {
		t.Fatalf("unexpected url %s", offers[0].URL)
	}
}

func TestRunBookingMatch_mergesOTAPartners(t *testing.T) {
	oldGF2 := bookingGF2OffersResolver
	oldOTA := bookingOTAOffersResolver
	defer func() {
		bookingGF2OffersResolver = oldGF2
		bookingOTAOffersResolver = oldOTA
	}()

	bookingGF2OffersResolver = func(ctx context.Context, session *SearchSession, option *FlightOption, wantItin search.CanonicalItinerary, legIndex int, segmentIndex int) ([]bookingmatch.BookingOffer, error) {
		return nil, nil
	}
	price := 278.0
	bookingOTAOffersResolver = func(ctx context.Context, session *SearchSession, option *FlightOption, wantItin search.CanonicalItinerary, legIndex int, segmentIndex int) ([]bookingmatch.BookingOffer, error) {
		fp := search.CanonicalItineraryFingerprint(wantItin)
		return []bookingmatch.BookingOffer{{
			Provider:             "mytrip.com",
			Domain:               "mytrip.com",
			URL:                  "https://www.mytrip.com/checkout/tlv-vie",
			URLType:              bookingmatch.URLTypeExactBooking,
			Price:                &price,
			Currency:             "USD",
			ItineraryFingerprint: fp,
			MatchScore:           95,
			VerificationStatus:   bookingmatch.StatusVerifiedExact,
			CheckedAt:            time.Now().UTC(),
		}}, nil
	}

	opt := &FlightOption{
		ID:     "sky_1",
		Source: "skyscanner",
		Price:  MonetaryAmount{Currency: "USD", Amount: 278},
		Legs: []FlightLeg{{
			Segments: []FlightSegment{{
				From: AirportLike{Code: "TLV"}, To: AirportLike{Code: "VIE"},
				DepartureTime:    time.Date(2027, 1, 7, 13, 40, 0, 0, time.UTC),
				ArrivalTime:      time.Date(2027, 1, 7, 17, 25, 0, 0, time.UTC),
				MarketingCarrier: Carrier{Code: "OS"},
				FlightNumber:     "OS860",
			}},
		}, {
			Segments: []FlightSegment{{
				From: AirportLike{Code: "VIE"}, To: AirportLike{Code: "TLV"},
				DepartureTime:    time.Date(2027, 1, 14, 19, 15, 0, 0, time.UTC),
				ArrivalTime:      time.Date(2027, 1, 14, 22, 40, 0, 0, time.UTC),
				MarketingCarrier: Carrier{Code: "OS"},
				FlightNumber:     "OS859",
			}},
		}},
	}
	session := &SearchSession{
		Params: CreateSearchSessionRequest{
			Origin: "TLV", Destination: "VIE",
			DepartureDate: "2027-01-07", ReturnDate: "2027-01-14",
			Adults: 1, Currency: "USD",
		},
	}
	it, err := canonicalItineraryForOption(opt, -1, -1)
	if err != nil {
		t.Fatal(err)
	}
	fp := search.CanonicalItineraryFingerprint(it)
	resp := runBookingMatch(context.Background(), session, opt, it, fp, -1, -1)
	if !resp.Found {
		t.Fatalf("expected found, status=%s msg=%s", resp.Status, resp.Message)
	}
	if resp.Offer == nil || !strings.Contains(resp.Offer.URL, "mytrip.com") {
		t.Fatalf("expected mytrip offer, got %+v", resp.Offer)
	}
}
