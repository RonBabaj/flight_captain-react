package main

import (
	"strings"
	"testing"
	"time"
)

func TestBuildLegAirlineDirectURL_austrianDeeplinkNotLegacyBooking404(t *testing.T) {
	dep := time.Date(2027, 1, 7, 13, 40, 0, 0, time.UTC)
	ret := time.Date(2027, 1, 14, 10, 0, 0, 0, time.UTC)
	opt := &FlightOption{
		Legs: []FlightLeg{
			{Segments: []FlightSegment{{
				From: AirportLike{Code: "TLV"}, To: AirportLike{Code: "VIE"},
				DepartureTime: dep, MarketingCarrier: Carrier{Code: "OS"},
			}}},
			{Segments: []FlightSegment{{
				From: AirportLike{Code: "VIE"}, To: AirportLike{Code: "TLV"},
				DepartureTime: ret, MarketingCarrier: Carrier{Code: "OS"},
			}}},
		},
	}
	sess := &SearchSession{Params: CreateSearchSessionRequest{
		Origin: "TLV", Destination: "VIE",
		DepartureDate: "2027-01-07", ReturnDate: "2027-01-14", Adults: 1,
	}}
	u := BuildLegAirlineDirectURL(sess, opt, 0, -1, "", "")
	if u == "" {
		t.Fatal("empty url")
	}
	if strings.Contains(u, "/at/en/booking") {
		t.Fatalf("legacy path 404s: %s", u)
	}
	if !strings.Contains(u, "/deeplink/partner") {
		t.Fatalf("expected LH-group deeplink, got %s", u)
	}
	if !strings.Contains(u, "origin=TLV") || !strings.Contains(u, "destination=VIE") {
		t.Fatalf("missing OD: %s", u)
	}
	if !strings.Contains(u, "travel=2027-01-07") || !strings.Contains(u, "return=2027-01-14") {
		t.Fatalf("missing dates: %s", u)
	}
	if strings.Contains(u, "return=null") {
		t.Fatalf("literal null return breaks Austrian: %s", u)
	}
}
