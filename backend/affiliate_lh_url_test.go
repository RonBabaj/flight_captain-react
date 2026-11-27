package main

import (
	"strings"
	"testing"
	"time"
)

func TestBuildLegAirlineDirectURL_lufthansaSearchFlights(t *testing.T) {
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
	if u == "" {
		t.Fatal("expected Lufthansa search-flights URL")
	}
	if !strings.Contains(u, "lufthansa.com") || !strings.Contains(u, "search-flights") {
		t.Fatalf("expected lufthansa.com/booking/search-flights, got %s", u)
	}
	if strings.Contains(u, "/booking/flight") || strings.Contains(u, "deeplink/partner") {
		t.Fatalf("dead Lufthansa path: %s", u)
	}
	if !strings.Contains(u, "origin1=TLV") || !strings.Contains(u, "destination1=ATH") {
		t.Fatalf("missing route params: %s", u)
	}
}

func TestBuildLegAirlineDirectURL_swissPerHopSearchFlights(t *testing.T) {
	dep := time.Date(2026, 11, 28, 18, 0, 0, 0, time.UTC)
	opt := &FlightOption{
		Legs: []FlightLeg{
			{Segments: []FlightSegment{
				{
					From: AirportLike{Code: "TLV"}, To: AirportLike{Code: "ZRH"},
					DepartureTime: dep, MarketingCarrier: Carrier{Code: "LX"}, FlightNumber: "LX253",
				},
				{
					From: AirportLike{Code: "ZRH"}, To: AirportLike{Code: "VIE"},
					DepartureTime: dep.Add(11 * time.Hour), MarketingCarrier: Carrier{Code: "OS"}, FlightNumber: "OS148",
				},
			}},
		},
	}
	sess := &SearchSession{Params: CreateSearchSessionRequest{
		Origin: "TLV", Destination: "VIE",
		DepartureDate: "2026-11-28", Adults: 1,
	}}
	u := BuildLegAirlineDirectURL(sess, opt, 0, 0, "", "")
	if u == "" {
		t.Fatal("expected Swiss search-flights for TLV→ZRH hop")
	}
	if !strings.Contains(u, "swiss.com") || !strings.Contains(u, "origin1=TLV") || !strings.Contains(u, "destination1=ZRH") {
		t.Fatalf("expected swiss.com TLV→ZRH search-flights, got %s", u)
	}
}
