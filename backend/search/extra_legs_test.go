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
	if out[0].Legs[1].Segments[0].From != "BER" || out[0].Legs[1].Segments[0].To != "PRG" {
		t.Fatalf("middle leg = %+v", out[0].Legs[1])
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
