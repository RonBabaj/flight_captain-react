package main

import (
	"strings"
	"testing"
	"time"
)

func TestBuildLegAirlineDirectURL_lufthansaHasNoUnverifiedLink(t *testing.T) {
	dep := time.Date(2026, 11, 27, 10, 0, 0, 0, time.UTC)
	opt := &FlightOption{
		Legs: []FlightLeg{
			{Segments: []FlightSegment{{
				From: AirportLike{Code: "TLV"}, To: AirportLike{Code: "ATH"},
				DepartureTime: dep, MarketingCarrier: Carrier{Code: "LH"}, FlightNumber: "LH686",
			}}},
		},
	}
	sess := &SearchSession{Params: CreateSearchSessionRequest{
		Origin: "TLV", Destination: "ATH",
		DepartureDate: "2026-11-27", Adults: 1,
	}}
	u := BuildLegAirlineDirectURL(sess, opt, 0, 0, "", "")
	if u != "" {
		t.Fatalf("must not emit unverified Lufthansa /booking/flight URL (404s): %s", u)
	}
	if strings.Contains(u, "lufthansa.com/booking") {
		t.Fatalf("dead Lufthansa path: %s", u)
	}
}