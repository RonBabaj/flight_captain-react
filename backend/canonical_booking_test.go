package main

import (
	"os"
	"strings"
	"testing"
	"time"
)

func TestBookingLinkModeDefaultsToGoogle(t *testing.T) {
	_ = os.Unsetenv("BOOKING_LINK_MODE")
	if got := bookingLinkMode(); got != BookingModeGooglePrefill {
		t.Fatalf("got %q", got)
	}
	t.Setenv("BOOKING_LINK_MODE", "skyscanner")
	if got := bookingLinkMode(); got != BookingModeSkyscannerPrefill {
		t.Fatalf("alias got %q", got)
	}
	t.Setenv("BOOKING_LINK_MODE", "direct")
	if got := bookingLinkMode(); got != BookingModeDirectProvider {
		t.Fatalf("alias got %q", got)
	}
}

func TestBuildGoogleFlightsFallbackFromParams(t *testing.T) {
	u := BuildGoogleFlightsFallbackFromParams("TLV", "HND", "2026-08-10", "2026-08-20")
	if u == "" || u == "https://www.google.com/travel/flights" {
		t.Fatalf("expected prefilled URL, got %q", u)
	}
	if !strings.Contains(u, "google.com/travel/flights") || !strings.Contains(u, "TLV") || !strings.Contains(u, "HND") {
		t.Fatalf("unexpected url %q", u)
	}
}

func TestBuildUniformBookingLinkPrefersDeepLink(t *testing.T) {
	t.Setenv("BOOKING_LINK_MODE", "google_prefill")
	opt := &FlightOption{
		DeepLink: "https://www.partner.com/checkout",
		Legs: []FlightLeg{{
			Segments: []FlightSegment{{
				From: AirportLike{Code: "TLV"},
				To:   AirportLike{Code: "HND"},
			}},
		}},
	}
	u := BuildUniformBookingLink(nil, opt)
	if u != "https://www.partner.com/checkout" {
		t.Fatalf("got %q", u)
	}
}

func TestBuildSkyscannerPrefillURL_oneWay(t *testing.T) {
	u := buildSkyscannerPrefillURL("TLV", "VIE", "2026-10-07", "", "ECONOMY", 1)
	if !strings.Contains(u, "/transport/flights/tlv/vie/261007/") {
		t.Fatalf("expected one-way path, got %q", u)
	}
	if strings.Contains(u, "/261007/261007/") {
		t.Fatalf("one-way must not invent a same-day return: %q", u)
	}
	if !strings.Contains(u, "rtn=0") {
		t.Fatalf("expected rtn=0, got %q", u)
	}
}

func TestBuildSkyscannerPrefillURL_roundTrip(t *testing.T) {
	u := buildSkyscannerPrefillURL("TLV", "HND", "2026-08-10", "2026-08-20", "ECONOMY", 2)
	if !strings.Contains(u, "/transport/flights/tlv/hnd/260810/260820/") {
		t.Fatalf("expected RT path, got %q", u)
	}
	if !strings.Contains(u, "rtn=1") {
		t.Fatalf("expected rtn=1, got %q", u)
	}
}

func openJawOption() *FlightOption {
	outDep := time.Date(2026, 10, 7, 9, 45, 0, 0, time.UTC)
	retDep := time.Date(2026, 10, 14, 16, 0, 0, 0, time.UTC)
	return &FlightOption{
		ID:       "opt_oj",
		DeepLink: "https://www.partner.com/outbound-only",
		Legs: []FlightLeg{
			{Segments: []FlightSegment{{
				From:          AirportLike{Code: "TLV"},
				To:            AirportLike{Code: "VIE"},
				DepartureTime: outDep,
			}}},
			{Segments: []FlightSegment{
				{
					From:          AirportLike{Code: "MUC"},
					To:            AirportLike{Code: "ATH"},
					DepartureTime: retDep,
				},
				{
					From: AirportLike{Code: "ATH"},
					To:   AirportLike{Code: "TLV"},
				},
			}},
		},
	}
}

func TestItineraryIsSplit_openJaw(t *testing.T) {
	// Open-jaw: return departs from a different city — needs two one-way bookings.
	opt := openJawOption()
	sess := &SearchSession{Params: CreateSearchSessionRequest{
		Origin: "TLV", Destination: "VIE", ReturnOrigin: "MUC", ReturnDestination: "TLV",
		DepartureDate: "2026-10-07", ReturnDate: "2026-10-14",
	}}
	if !itineraryIsSplit(sess, opt) {
		t.Fatal("open-jaw should be split")
	}
	// Classic RT: same airports reversed — single bookable ticket.
	classic := &FlightOption{Legs: []FlightLeg{
		{Segments: []FlightSegment{{From: AirportLike{Code: "TLV"}, To: AirportLike{Code: "VIE"}}}},
		{Segments: []FlightSegment{{From: AirportLike{Code: "VIE"}, To: AirportLike{Code: "TLV"}}}},
	}}
	if itineraryIsSplit(nil, classic) {
		t.Fatal("classic RT should not be split")
	}
	// Extra hops = split.
	extraSess := &SearchSession{Params: CreateSearchSessionRequest{
		Origin: "TLV", Destination: "VIE",
		ExtraLegs: []ExtraSearchLeg{{Origin: "VIE", Destination: "PRG", Date: "2026-10-10"}},
	}}
	if !itineraryIsSplit(extraSess, nil) {
		t.Fatal("extra hops should be split")
	}
	threeLegs := &FlightOption{Legs: []FlightLeg{{}, {}, {}}}
	if !itineraryIsSplit(nil, threeLegs) {
		t.Fatal("3-leg option should be split")
	}
}

func TestBookingRouteFromSessionOption_splitOmitsReturn(t *testing.T) {
	// Open-jaw IS split — return date must be omitted (needs separate one-way links).
	opt := openJawOption()
	sess := &SearchSession{Params: CreateSearchSessionRequest{
		Origin: "TLV", Destination: "VIE", ReturnOrigin: "MUC", ReturnDate: "2026-10-14",
	}}
	origin, dest, dep, ret := bookingRouteFromSessionOption(sess, opt)
	if origin != "TLV" || dest != "VIE" || dep != "2026-10-07" {
		t.Fatalf("outbound route %s %s %s", origin, dest, dep)
	}
	if ret != "" {
		t.Fatalf("split itinerary must not advertise a round-trip return date, got %q", ret)
	}
}

func TestBuildOneWayLegBookingURL(t *testing.T) {
	opt := openJawOption()
	out := BuildOneWayLegBookingURL(nil, opt, 0)
	if !strings.Contains(out, "/transport/flights/tlv/vie/261007/") || !strings.Contains(out, "rtn=0") {
		t.Fatalf("outbound hop %q", out)
	}
	inb := BuildOneWayLegBookingURL(nil, opt, 1)
	if !strings.Contains(inb, "/transport/flights/muc/tlv/261014/") || !strings.Contains(inb, "rtn=0") {
		t.Fatalf("return hop should be MUC→TLV one-way, got %q", inb)
	}
}

func TestBuildUniformBookingLink_splitIgnoresDeepLink(t *testing.T) {
	t.Setenv("BOOKING_LINK_MODE", "skyscanner_prefill")
	// Open-jaw is split — must not use the single-leg deep link.
	opt := openJawOption()
	u := BuildUniformBookingLink(nil, opt)
	if u == opt.DeepLink {
		t.Fatal("split itinerary must not use a single-leg deep link")
	}
	if !strings.Contains(u, "/transport/flights/tlv/vie/261007/") {
		t.Fatalf("expected outbound Skyscanner one-way fallback, got %q", u)
	}
}
