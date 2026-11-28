package main

import (
	"strings"
	"testing"
	"time"
)

func TestBuildLegAirlineDirectURL_austrianSearchFlights(t *testing.T) {
	dep := time.Date(2027, 1, 7, 15, 40, 0, 0, time.UTC)
	ret := time.Date(2027, 1, 14, 14, 45, 0, 0, time.UTC)
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
		t.Fatal("expected Austrian search-flights URL")
	}
	if !strings.Contains(u, "austrian.com") || !strings.Contains(u, "search-flights") {
		t.Fatalf("expected austrian.com/booking/search-flights, got %s", u)
	}
	if !strings.Contains(u, "origin1=TLV") || !strings.Contains(u, "destination1=VIE") {
		t.Fatalf("missing route params: %s", u)
	}
	if strings.Contains(u, "deeplink/partner") || strings.Contains(u, "/at/en/booking?") {
		t.Fatalf("dead Austrian path: %s", u)
	}
}

func TestBuildLHGroupSearchURL_oneWayAndRoundTrip(t *testing.T) {
	one := buildLHGroupSearchURL("OS", "TLV", "VIE", "2026-11-28", "", 1)
	if !strings.Contains(one, "origin1=TLV") || strings.Contains(one, "origin2=") {
		t.Fatalf("one-way should only set origin1: %s", one)
	}
	rt := buildLHGroupSearchURL("LH", "TLV", "ATH", "2026-11-27", "2026-12-04", 2)
	if !strings.Contains(rt, "lufthansa.com") || !strings.Contains(rt, "origin2=ATH") || !strings.Contains(rt, "adults=2") {
		t.Fatalf("round-trip LH URL: %s", rt)
	}
	swiss := buildLHGroupSearchURL("LX", "TLV", "ZRH", "2026-11-28", "", 1)
	if !strings.Contains(swiss, "swiss.com") || !strings.Contains(swiss, "search-flights") || !strings.Contains(swiss, "destination1=ZRH") {
		t.Fatalf("Swiss hop URL: %s", swiss)
	}
}
