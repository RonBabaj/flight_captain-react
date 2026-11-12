package main

import (
	"strings"
	"testing"
	"time"
)

func TestBuildLegAirlineDirectURL_wizzPathNotHash(t *testing.T) {
	dep := time.Date(2027, 1, 7, 10, 0, 0, 0, time.UTC)
	opt := &FlightOption{
		ID: "opt_0",
		Legs: []FlightLeg{{Segments: []FlightSegment{{
			From: AirportLike{Code: "TLV"}, To: AirportLike{Code: "BUD"},
			DepartureTime: dep,
			MarketingCarrier: Carrier{Code: "W6"},
		}}}},
	}
	sess := &SearchSession{Params: CreateSearchSessionRequest{
		Origin: "TLV", Destination: "BUD",
		DepartureDate: "2027-01-07", Adults: 1, Currency: "USD",
	}}
	u := BuildLegAirlineDirectURL(sess, opt, 0, -1, "", "")
	if u == "" {
		t.Fatal("empty url")
	}
	if strings.Contains(u, "#/") {
		t.Fatalf("hash SPA url redirects to homepage: %s", u)
	}
	if !strings.Contains(u, "/en-gb/booking/select-flight/TLV/BUD/2027-01-07/null/1/0/0/null") {
		t.Fatalf("unexpected wizz url: %s", u)
	}
	if !isAffiliateTemplateBookingURL(u) {
		t.Fatalf("should recognize wizz template: %s", u)
	}
}

func TestBuildLegAirlineDirectURL_wizzRoundTripReturnDate(t *testing.T) {
	dep := time.Date(2027, 1, 7, 10, 0, 0, 0, time.UTC)
	ret := time.Date(2027, 1, 14, 10, 0, 0, 0, time.UTC)
	opt := &FlightOption{
		Legs: []FlightLeg{
			{Segments: []FlightSegment{{
				From: AirportLike{Code: "TLV"}, To: AirportLike{Code: "BUD"},
				DepartureTime: dep, MarketingCarrier: Carrier{Code: "W6"},
			}}},
			{Segments: []FlightSegment{{
				From: AirportLike{Code: "BUD"}, To: AirportLike{Code: "TLV"},
				DepartureTime: ret, MarketingCarrier: Carrier{Code: "W6"},
			}}},
		},
	}
	sess := &SearchSession{Params: CreateSearchSessionRequest{
		Origin: "TLV", Destination: "BUD",
		DepartureDate: "2027-01-07", ReturnDate: "2027-01-14", Adults: 2,
	}}
	u := BuildLegAirlineDirectURL(sess, opt, 0, -1, "", "")
	if !strings.Contains(u, "/TLV/BUD/2027-01-07/2027-01-14/2/0/0/null") {
		t.Fatalf("rt wizz url: %s", u)
	}
}
