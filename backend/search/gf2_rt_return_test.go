package search

import "testing"

func TestProviderResultArrivalAirport(t *testing.T) {
	r := ProviderResult{
		Legs: []Leg{{
			Segments: []Segment{
				{From: "TLV", To: "ZRH"},
				{From: "ZRH", To: "NRT"},
			},
		}},
	}
	if got := providerResultArrivalAirport(r); got != "NRT" {
		t.Fatalf("got %q want NRT", got)
	}
}

func TestCheapestReturnLeg(t *testing.T) {
	results := []ProviderResult{
		{Price: Monetary{Amount: 900}, Legs: []Leg{{Segments: []Segment{{From: "NRT", To: "TLV"}}}}},
		{Price: Monetary{Amount: 700}, Legs: []Leg{{Segments: []Segment{{From: "NRT", To: "VIE"}, {From: "VIE", To: "TLV"}}}}},
	}
	leg := cheapestReturnLeg(results)
	if leg == nil || len(leg.Segments) != 2 || leg.Segments[1].To != "TLV" {
		t.Fatalf("unexpected leg %+v", leg)
	}
}

func TestEnrichNativeRoundTripReturnLegs_skipsWhenTwoLegs(t *testing.T) {
	results := []ProviderResult{
		{Legs: []Leg{{Segments: []Segment{{From: "TLV", To: "NRT"}}}, {Segments: []Segment{{From: "NRT", To: "TLV"}}}}},
	}
	before := len(results[0].Legs)
	p := &GoogleFlights2Provider{}
	p.enrichNativeRoundTripReturnLegs(nil, SearchRequest{ReturnDate: "2027-06-22", Origin: "TLV"}, results)
	if len(results[0].Legs) != before {
		t.Fatal("should not modify results that already have return leg")
	}
}
