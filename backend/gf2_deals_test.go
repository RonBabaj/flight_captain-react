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

// Regression: month-deals card used Search() RT total (e.g. ₪592) while details used to
// add the return one-way fare on top (₪592+₪764=₪1356). Attaching a return leg must keep price.
func TestAttachReturnLegKeepPrice(t *testing.T) {
	opt := &FlightOption{
		ID: "ow-payload",
		Legs: []FlightLeg{
			{Segments: []FlightSegment{
				{From: AirportLike{Code: "TLV"}, To: AirportLike{Code: "ATH"}},
				{From: AirportLike{Code: "ATH"}, To: AirportLike{Code: "BER"}},
			}},
		},
		Price: MonetaryAmount{Currency: "ILS", Amount: 592},
	}
	ret := FlightLeg{Segments: []FlightSegment{
		{From: AirportLike{Code: "BER"}, To: AirportLike{Code: "ATH"}},
		{From: AirportLike{Code: "ATH"}, To: AirportLike{Code: "TLV"}},
	}}
	attachReturnLegKeepPrice(opt, ret)
	if len(opt.Legs) != 2 {
		t.Fatalf("expected 2 legs, got %d", len(opt.Legs))
	}
	if opt.Price.Amount != 592 {
		t.Fatalf("price must stay at card RT total 592, got %.2f (would be ~1356 if return fare were added)", opt.Price.Amount)
	}
}
