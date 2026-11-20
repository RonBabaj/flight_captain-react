package main

import "testing"

func TestMarketingCarrierForScopeUsesSegmentCarrier(t *testing.T) {
	opt := &FlightOption{
		Legs: []FlightLeg{{
			Segments: []FlightSegment{
				{MarketingCarrier: Carrier{Code: "DE"}},
				{MarketingCarrier: Carrier{Code: "OS"}},
			},
		}},
	}
	if got := marketingCarrierForScope(opt, 0, 1); got != "OS" {
		t.Fatalf("segment scope carrier=%q want OS", got)
	}
	if got := marketingCarrierForScope(opt, 0, 0); got != "DE" {
		t.Fatalf("segment scope carrier=%q want DE", got)
	}
}