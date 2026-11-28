package main

import (
	"strings"
	"testing"
	"time"
)

func TestBuildLegAirlineDirectURL_aegeanUsesFlightsHost(t *testing.T) {
	dep := time.Date(2026, 6, 15, 10, 0, 0, 0, time.UTC)
	arr := time.Date(2026, 6, 15, 12, 30, 0, 0, time.UTC)
	opt := &FlightOption{
		Legs: []FlightLeg{{
			Segments: []FlightSegment{{
				From: AirportLike{Code: "ATH"}, To: AirportLike{Code: "LHR"},
				DepartureTime: dep, ArrivalTime: arr,
				MarketingCarrier: Carrier{Code: "A3"},
				FlightNumber:     "A3600",
			}},
		}},
	}
	sess := &SearchSession{Params: CreateSearchSessionRequest{
		Origin: "ATH", Destination: "LHR", DepartureDate: "2026-06-15", Adults: 2, Currency: "EUR",
	}}
	got := BuildLegAirlineDirectURL(sess, opt, 0, -1, "s1", "o1")
	low := strings.ToLower(got)
	if !strings.Contains(low, "flights.aegeanair.com") {
		t.Fatalf("expected flights.aegeanair.com, got %q", got)
	}
	if strings.Contains(low, "/plan/booking/flights") {
		t.Fatalf("must not use dead en.aegeanair.com/plan/booking/flights path, got %q", got)
	}
	if !strings.Contains(low, "origin=ath") || !strings.Contains(low, "destination=lhr") {
		t.Fatalf("expected origin/destination query, got %q", got)
	}
	if !isAffiliateTemplateBookingURL(got) {
		t.Fatalf("Aegean prefill URL must classify as affiliate template: %q", got)
	}
}
