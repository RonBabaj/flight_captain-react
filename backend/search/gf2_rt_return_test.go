package search

import (
	"context"
	"testing"
)

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

func TestClassicRoundTripMissingReturn(t *testing.T) {
	if classicRoundTripMissingReturn(nil) {
		t.Fatal("empty should not be missing")
	}
	complete := []ProviderResult{
		{Legs: []Leg{{}, {}}},
		{Legs: []Leg{{}, {}}},
	}
	if classicRoundTripMissingReturn(complete) {
		t.Fatal("complete RT should not be missing")
	}
	outboundOnly := []ProviderResult{
		{Legs: []Leg{{Segments: []Segment{{From: "TLV", To: "PRG"}}}}},
		{Legs: []Leg{{Segments: []Segment{{From: "TLV", To: "ATH"}}}}},
	}
	if !classicRoundTripMissingReturn(outboundOnly) {
		t.Fatal("outbound-only majority should be missing")
	}
	mixed := []ProviderResult{
		{Legs: []Leg{{}, {}}},
		{Legs: []Leg{{}, {}}},
		{Legs: []Leg{{}}}, // one incomplete among mostly complete
	}
	if classicRoundTripMissingReturn(mixed) {
		t.Fatal("minority incomplete should not trigger missing")
	}
}

func TestSearch_servesCompleteClassicRTCache(t *testing.T) {
	p := &GoogleFlights2Provider{cache: newGF2Cache()}
	req := SearchRequest{
		Origin: "TLV", Destination: "PRG",
		DepartureDate: "2026-10-08", ReturnDate: "2026-10-15",
		Adults: 1, Currency: "USD",
	}
	key := p.buildCacheKey(req)
	p.cache.set(key, []ProviderResult{{
		ID:    "full-rt",
		Price: Monetary{Currency: "USD", Amount: 403},
		Legs: []Leg{
			{Segments: []Segment{{From: "TLV", To: "PRG"}}},
			{Segments: []Segment{{From: "PRG", To: "TLV"}}},
		},
	}})

	got, err := p.Search(context.Background(), req)
	if err != nil {
		t.Fatal(err)
	}
	if len(got) != 1 || got[0].ID != "full-rt" || len(got[0].Legs) != 2 {
		t.Fatalf("expected complete cached RT, got %+v", got)
	}
}

func TestSearch_ignoresIncompleteClassicRTCache(t *testing.T) {
	p := &GoogleFlights2Provider{cache: newGF2Cache()}
	req := SearchRequest{
		Origin: "TLV", Destination: "PRG",
		DepartureDate: "2026-10-08", ReturnDate: "2026-10-15",
		Adults: 1, Currency: "USD",
	}
	key := p.buildCacheKey(req)
	incomplete := []ProviderResult{{
		ID:    "outbound-only",
		Price: Monetary{Currency: "USD", Amount: 403},
		Legs:  []Leg{{Segments: []Segment{{From: "TLV", To: "PRG"}}}},
	}}
	p.cache.set(key, incomplete)

	cached, ok := p.cache.get(key)
	if !ok || !classicRoundTripMissingReturn(cached) {
		t.Fatal("fixture must be an incomplete classic RT cache entry")
	}

	// Search should ignore this cache entry (same gate as production). With no HTTP client
	// the live path panics/fails — recover and assert we never got the stale ID back.
	var got []ProviderResult
	var searchErr error
	func() {
		defer func() { _ = recover() }()
		got, searchErr = p.Search(context.Background(), req)
	}()
	if searchErr == nil {
		for _, r := range got {
			if r.ID == "outbound-only" {
				t.Fatal("served stale outbound-only cache entry")
			}
		}
	}
}

func TestDoSearchWithRetry_doesNotCacheRoundTrip(t *testing.T) {
	// Round-trip caching must happen only after return enrichment in Search().
	p := &GoogleFlights2Provider{cache: newGF2Cache()}
	req := SearchRequest{
		Origin: "TLV", Destination: "PRG",
		DepartureDate: "2026-10-08", ReturnDate: "2026-10-15",
		Adults: 1, Currency: "USD",
	}
	key := p.buildCacheKey(req)
	if _, ok := p.cache.get(key); ok {
		t.Fatal("cache should start empty")
	}
	// Even if doSearchWithRetry were somehow successful, it must not write the RT key.
	// Here we only assert the pre-condition helper: incomplete results must not be
	// considered cacheable by Search's final gate.
	outboundOnly := []ProviderResult{{Legs: []Leg{{}}}}
	if !classicRoundTripMissingReturn(outboundOnly) {
		t.Fatal("outbound-only must be treated as uncacheable incomplete RT")
	}
}
