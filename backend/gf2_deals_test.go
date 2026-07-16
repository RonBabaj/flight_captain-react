package main

import "testing"

func TestEnsureRoundTripLegs_noOpWhenTwoLegs(t *testing.T) {
	opt := &FlightOption{
		ID: "test",
		Legs: []FlightLeg{
			{Segments: []FlightSegment{{From: AirportLike{Code: "TLV"}, To: AirportLike{Code: "HND"}}}},
			{Segments: []FlightSegment{{From: AirportLike{Code: "HND"}, To: AirportLike{Code: "TLV"}}}},
		},
		Price: MonetaryAmount{Currency: "USD", Amount: 900},
	}
	out := ensureRoundTripLegs(nil, nil, opt, "TLV", "HND", "2026-07-25", "USD", 1, 0, "ECONOMY", false)
	if out == nil || len(out.Legs) != 2 {
		t.Fatalf("expected 2 legs unchanged, got %v", out)
	}
	if out.Price.Amount != 900 {
		t.Fatalf("expected price unchanged, got %.2f", out.Price.Amount)
	}
}

func TestEnsureRoundTripLegs_nilSafe(t *testing.T) {
	if ensureRoundTripLegs(nil, nil, nil, "TLV", "HND", "2026-07-25", "USD", 1, 0, "ECONOMY", false) != nil {
		t.Fatal("nil opt should stay nil")
	}
}
