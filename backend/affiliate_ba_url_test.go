package main

import (
	"strings"
	"testing"
	"time"
)

func TestBuildLegAirlineDirectURL_britishAirwaysFlightList(t *testing.T) {
	dep := time.Date(2026, 11, 28, 10, 0, 0, 0, time.UTC)
	opt := &FlightOption{
		Legs: []FlightLeg{
			{Segments: []FlightSegment{{
				From: AirportLike{Code: "TLV"}, To: AirportLike{Code: "LHR"},
				DepartureTime: dep, MarketingCarrier: Carrier{Code: "BA"}, FlightNumber: "BA166",
			}}},
		},
	}
	sess := &SearchSession{Params: CreateSearchSessionRequest{
		Origin: "TLV", Destination: "LHR",
		DepartureDate: "2026-11-28", Adults: 1,
	}}
	u := BuildLegAirlineDirectURL(sess, opt, 0, 0, "", "")
	if u == "" {
		t.Fatal("expected BA flightList URL")
	}
	if !strings.Contains(u, "britishairways.com") || !strings.Contains(u, "flightList") {
		t.Fatalf("expected flightList URL, got %s", u)
	}
	if !strings.Contains(u, "onds=") || !strings.Contains(u, "TLV-LHR_2026-11-28") {
		t.Fatalf("missing onds route: %s", u)
	}
	if strings.Contains(u, "eId=") || strings.Contains(u, "from=TLV") {
		t.Fatalf("must not use legacy 404 BA template: %s", u)
	}
}

func TestBuildBASearchURL_roundTrip(t *testing.T) {
	u := buildBASearchURL("LHR", "JFK", "2026-12-01", "2026-12-10", 2)
	if !(strings.Contains(u, "LHR-JFK_2026-12-01,JFK-LHR_2026-12-10") ||
		strings.Contains(u, "LHR-JFK_2026-12-01%2CJFK-LHR_2026-12-10")) || !strings.Contains(u, "ad=2") {
		t.Fatalf("round-trip BA URL: %s", u)
	}
}

func TestIsAffiliateTemplateBookingURL_baFlightList(t *testing.T) {
	if !isAffiliateTemplateBookingURL("https://www.britishairways.com/travel/book/public/en_us/flightList?onds=TLV-LHR_2026-11-28&ad=1") {
		t.Fatal("expected BA flightList to be affiliate template")
	}
	if !isAffiliateTemplateBookingURL("https://www.britishairways.com/travel/book/public/en_us?eId=106019&from=TLV&to=LHR&outbound=2026-11-28") {
		t.Fatal("legacy BA from=/outbound= must still classify as template")
	}
}
