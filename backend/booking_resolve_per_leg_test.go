package main

import (
	"context"
	"testing"
	"time"

	"flightcaptainweb/bookingmatch"
	"flightcaptainweb/search"
)

func TestRunBookingMatch_perLegGF2Fallback(t *testing.T) {
	t.Setenv("WEB_SEARCH_ENABLED", "false")

	depOut := time.Date(2027, 3, 10, 8, 0, 0, 0, time.UTC)
	arrOut := time.Date(2027, 3, 10, 20, 0, 0, 0, time.UTC)
	depRet := time.Date(2027, 3, 24, 10, 0, 0, 0, time.UTC)
	arrRet := time.Date(2027, 3, 25, 6, 0, 0, 0, time.UTC)

	outSeg := search.CanonicalSegment{
		From: "TLV", To: "LAX",
		DepartureTime: depOut, ArrivalTime: arrOut,
		MarketingCarrier: "LY", FlightNumber: "LY1",
	}
	retSeg := search.CanonicalSegment{
		From: "LAX", To: "TLV",
		DepartureTime: depRet, ArrivalTime: arrRet,
		MarketingCarrier: "LY", FlightNumber: "LY2",
	}
	fullItin := search.CanonicalItinerary{
		Segments: []search.CanonicalSegment{outSeg, retSeg},
		Legs: []search.CanonicalLeg{
			{Segments: []search.CanonicalSegment{outSeg}},
			{Segments: []search.CanonicalSegment{retSeg}},
		},
		Source: "googleflights2",
	}
	fp := search.CanonicalItineraryFingerprint(fullItin)

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
		switch legIndex {
		case 0:
			u := "https://partner.example/outbound-checkout"
			return []bookingmatch.BookingOffer{{
				Domain:               "partner.example",
				URL:                  u,
				URLType:              bookingmatch.URLTypeExactBooking,
				VerificationStatus:   bookingmatch.StatusVerifiedExact,
				ItineraryFingerprint: search.CanonicalItineraryFingerprint(wantItin),
				CheckedAt:            time.Now().UTC(),
			}}, nil
		case 1:
			u := "https://partner.example/return-checkout"
			return []bookingmatch.BookingOffer{{
				Domain:               "partner.example",
				URL:                  u,
				URLType:              bookingmatch.URLTypeExactBooking,
				VerificationStatus:   bookingmatch.StatusVerifiedExact,
				ItineraryFingerprint: search.CanonicalItineraryFingerprint(wantItin),
				CheckedAt:            time.Now().UTC(),
			}}, nil
		default:
			return nil, nil
		}
	}

	opt := &FlightOption{
		Source: "googleflights2",
		Price:  MonetaryAmount{Amount: 900, Currency: "USD"},
		Legs: []FlightLeg{
			{Segments: []FlightSegment{{
				From: AirportLike{Code: "TLV"}, To: AirportLike{Code: "LAX"},
				DepartureTime: depOut, ArrivalTime: arrOut,
				MarketingCarrier: Carrier{Code: "LY"}, FlightNumber: "LY1",
			}}},
			{Segments: []FlightSegment{{
				From: AirportLike{Code: "LAX"}, To: AirportLike{Code: "TLV"},
				DepartureTime: depRet, ArrivalTime: arrRet,
				MarketingCarrier: Carrier{Code: "LY"}, FlightNumber: "LY2",
			}}},
		},
	}
	sess := &SearchSession{Params: CreateSearchSessionRequest{Currency: "USD"}}

	resp := runBookingMatch(context.Background(), sess, opt, fullItin, fp, -1, -1)
	if !resp.Found {
		t.Fatalf("expected per-leg fallback found=true, got %+v", resp)
	}
	if resp.Offer == nil || resp.Offer.URL != "https://partner.example/outbound-checkout" {
		t.Fatalf("offer=%+v", resp.Offer)
	}
	if len(resp.Alternatives) != 1 || resp.Alternatives[0].URL != "https://partner.example/return-checkout" {
		t.Fatalf("alternatives=%+v", resp.Alternatives)
	}
}