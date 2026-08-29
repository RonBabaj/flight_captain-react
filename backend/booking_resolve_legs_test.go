package main

import (
	"testing"
	"time"

	"flightcaptainweb/search"
)

func TestCanonicalItineraryForOption_isolatesSplitLegs(t *testing.T) {
	depOut := time.Date(2027, 1, 7, 18, 20, 0, 0, time.UTC)
	arrOut := time.Date(2027, 1, 8, 14, 0, 0, 0, time.UTC)
	depRet := time.Date(2027, 1, 14, 16, 45, 0, 0, time.UTC)
	arrRet := time.Date(2027, 1, 14, 23, 0, 0, 0, time.UTC)

	opt := &FlightOption{
		Legs: []FlightLeg{
			{Segments: []FlightSegment{
				{From: AirportLike{Code: "TLV"}, To: AirportLike{Code: "ZRH"}, DepartureTime: depOut, MarketingCarrier: Carrier{Code: "LY"}, FlightNumber: "LY343"},
				{From: AirportLike{Code: "ZRH"}, To: AirportLike{Code: "VIE"}, ArrivalTime: arrOut, MarketingCarrier: Carrier{Code: "OS"}, FlightNumber: "OS134"},
			}},
			{Segments: []FlightSegment{
				{From: AirportLike{Code: "SZG"}, To: AirportLike{Code: "TLV"}, DepartureTime: depRet, ArrivalTime: arrRet, MarketingCarrier: Carrier{Code: "LH"}, FlightNumber: "LH690"},
			}},
		},
	}

	leg0, err := canonicalItineraryForOption(opt, 0)
	if err != nil {
		t.Fatal(err)
	}
	if len(leg0.Segments) != 2 || leg0.Segments[0].From != "TLV" || leg0.Segments[1].To != "VIE" {
		t.Fatalf("leg0=%+v", leg0.Segments)
	}

	leg1, err := canonicalItineraryForOption(opt, 1)
	if err != nil {
		t.Fatal(err)
	}
	if len(leg1.Segments) != 1 || leg1.Segments[0].From != "SZG" || leg1.Segments[0].To != "TLV" {
		t.Fatalf("leg1=%+v", leg1.Segments)
	}

	fp0 := search.CanonicalItineraryFingerprint(leg0)
	fp1 := search.CanonicalItineraryFingerprint(leg1)
	if fp0 == fp1 {
		t.Fatal("split legs must have distinct fingerprints")
	}
	if legRouteLabel(leg0) != "TLV→VIE" || legRouteLabel(leg1) != "SZG→TLV" {
		t.Fatalf("routes=%s %s", legRouteLabel(leg0), legRouteLabel(leg1))
	}
}
