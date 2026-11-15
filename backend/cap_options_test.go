package main

import "testing"

func TestCapOptionsKeepingVariety(t *testing.T) {
	seg := FlightSegment{}
	opt := func(src string, price float64, nonstop bool) FlightOption {
		leg := FlightLeg{Segments: []FlightSegment{seg, seg}}
		if nonstop {
			leg = FlightLeg{Segments: []FlightSegment{seg}}
		}
		return FlightOption{Source: src, Price: MonetaryAmount{Amount: price}, Legs: []FlightLeg{leg, leg}}
	}
	var options []FlightOption
	for i := 0; i < 60; i++ {
		options = append(options, opt("googleflights2", 100+float64(i), false))
	}
	options = append(options, opt("kiwi", 300, true), opt("skyscanner", 310, false))

	got := capOptionsKeepingVariety(options, 50)
	if len(got) != 50 {
		t.Fatalf("len=%d", len(got))
	}
	sources := map[string]bool{}
	nonstop := false
	for i, o := range got {
		sources[o.Source] = true
		nonstop = nonstop || optionIsNonstop(o)
		if i > 0 && o.Price.Amount < got[i-1].Price.Amount {
			t.Fatalf("price order broken at %d", i)
		}
	}
	if !sources["kiwi"] || !sources["skyscanner"] || !nonstop {
		t.Fatalf("sources=%v nonstop=%v", sources, nonstop)
	}
	if got[0].Price.Amount != 100 {
		t.Fatalf("cheapest dropped: %.0f", got[0].Price.Amount)
	}
}
