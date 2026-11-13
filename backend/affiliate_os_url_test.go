package main

import (
	"strings"
	"testing"
	"time"
)

func TestBuildLegAirlineDirectURL_austrianHasNoUnverifiedLink(t *testing.T) {
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
	if u != "" {
		t.Fatalf("must not emit unverified Austrian URL (partner deeplink errors): %s", u)
	}
	if strings.Contains(u, "deeplink/partner") || strings.Contains(u, "/at/en/booking") {
		t.Fatalf("dead Austrian path: %s", u)
	}
}
