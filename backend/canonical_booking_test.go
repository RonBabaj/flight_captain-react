package main

import (
	"os"
	"strings"
	"testing"
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
