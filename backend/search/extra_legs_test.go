package search

import "testing"

func TestCompleteExtraLegs(t *testing.T) {
	got := CompleteExtraLegs([]ExtraLeg{
		{Origin: " ber ", Destination: "prg", Date: "2026-12-20"},
		{Origin: "", Destination: "VIE", Date: "2026-12-21"},
		{},
	})
	if len(got) != 1 || got[0].Origin != "BER" || got[0].Destination != "PRG" {
		t.Fatalf("CompleteExtraLegs = %+v", got)
	}
}

func TestHasExtraLegs(t *testing.T) {
	if HasExtraLegs(SearchRequest{}) {
		t.Fatal("empty request should not have extra legs")
	}
	req := SearchRequest{ExtraLegs: []ExtraLeg{{Origin: "BER", Destination: "PRG", Date: "2026-12-20"}}}
	if !HasExtraLegs(req) {
		t.Fatal("complete extra leg should count")
	}
}

func TestCombineOneWayBatches(t *testing.T) {
	cheap := func(id string, price float64, from, to string) ProviderResult {
		return ProviderResult{
			ID:              id,
			Price:           Monetary{Currency: "USD", Amount: price},
			DurationMinutes: 60,
			Legs:            []Leg{{Segments: []Segment{{From: from, To: to}}}},
			DeepLink:        "https://example.com/" + id,
			BookingToken:    "tok-" + id,
		}
	}
	out := CombineOneWayBatches([][]ProviderResult{
		{cheap("a1", 100, "TLV", "BER"), cheap("a2", 140, "TLV", "BER")},
		{cheap("b1", 50, "BER", "PRG")},
		{cheap("c1", 80, "PRG", "TLV"), cheap("c2", 70, "PRG", "TLV")},
	}, "gf2oj")
	if len(out) != 4 {
		t.Fatalf("want 4 combinations, got %d", len(out))
	}
	if out[0].Price.Amount != 220 { // 100+50+70
		t.Fatalf("cheapest = %.0f, want 220", out[0].Price.Amount)
	}
	if len(out[0].Legs) != 3 {
		t.Fatalf("want 3 legs, got %d", len(out[0].Legs))
	}
	if out[0].DeepLink != "" || out[0].BookingToken != "" {
		t.Fatalf("combined itinerary must not keep a single-leg booking link, got deep=%q token=%q", out[0].DeepLink, out[0].BookingToken)
	}
	if len(out[0].LegBookingTokens) != 3 || out[0].LegBookingTokens[0] != "tok-a1" || out[0].LegBookingTokens[2] != "tok-c2" {
		t.Fatalf("LegBookingTokens=%v", out[0].LegBookingTokens)
	}
	if len(out[0].LegDeepLinks) != 3 || out[0].LegDeepLinks[0] != "https://example.com/a1" || out[0].LegDeepLinks[2] != "https://example.com/c2" {
		t.Fatalf("LegDeepLinks=%v", out[0].LegDeepLinks)
	}
	if len(out[0].LegPrices) != 3 || out[0].LegPrices[0] != 100 || out[0].LegPrices[2] != 70 {
		t.Fatalf("LegPrices=%v", out[0].LegPrices)
	}
	if out[0].Legs[1].Segments[0].From != "BER" || out[0].Legs[1].Segments[0].To != "PRG" {
		t.Fatalf("middle leg = %+v", out[0].Legs[1])
	}
}

func TestCombineOneWayBatches_openJawReturnDiversity(t *testing.T) {
	leg := func(from, to, carrier, fn string, stops int) Leg {
		segs := []Segment{{From: from, To: to, MarketingCarrier: carrier, FlightNumber: fn}}
		if stops > 0 {
			segs = []Segment{
				{From: from, To: "FRA", MarketingCarrier: "LH", FlightNumber: "LH100"},
				{From: "FRA", To: to, MarketingCarrier: "LH", FlightNumber: "LH200"},
			}
		}
		return Leg{Segments: segs}
	}
	oneWay := func(id string, price float64, l Leg) ProviderResult {
		return ProviderResult{
			ID:              id,
			Price:           Monetary{Currency: "EUR", Amount: price},
			DurationMinutes: 120,
			Legs:            []Leg{l},
		}
	}
	outbound := oneWay("out", 100, leg("TLV", "VIE", "OS", "OS860", 0))
	cheapReturn := oneWay("ret-lh", 50, leg("SZG", "TLV", "LH", "LH1267", 1))
	directReturn := oneWay("ret-ly", 200, leg("SZG", "TLV", "LY", "LY5194", 0))

	out := CombineOneWayBatches([][]ProviderResult{
		{outbound},
		{cheapReturn, directReturn},
	}, "gf2oj")
	if len(out) == 0 {
		t.Fatal("expected combined results")
	}
	hasDirectLY := false
	for _, r := range out {
		if len(r.Legs) < 2 {
			continue
		}
		segs := r.Legs[1].Segments
		if len(segs) == 1 && segs[0].MarketingCarrier == "LY" && segs[0].From == "SZG" && segs[0].To == "TLV" {
			hasDirectLY = true
			break
		}
	}
	if !hasDirectLY {
		t.Fatalf("expected direct LY SZG→TLV return in open-jaw results, got %d combos", len(out))
	}
}

func TestCombineOneWayBatches_emptyBatch(t *testing.T) {
	if got := CombineOneWayBatches([][]ProviderResult{{}, {{ID: "x"}}}, "x"); got != nil {
		t.Fatalf("empty batch should yield nil, got %d", len(got))
	}
}

func TestExtraLegsFingerprint(t *testing.T) {
	got := ExtraLegsFingerprint([]ExtraLeg{
		{Origin: "ber", Destination: "prg", Date: "2026-12-20"},
	})
	if got != "BER>PRG@2026-12-20" {
		t.Fatalf("fingerprint = %q", got)
	}
}
