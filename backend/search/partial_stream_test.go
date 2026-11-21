package search

import (
	"context"
	"testing"
	"time"
)

func TestMergeProviderResultsForPublish_dedupes(t *testing.T) {
	dep := time.Date(2026, 8, 10, 10, 0, 0, 0, time.UTC)
	arr := time.Date(2026, 8, 10, 18, 0, 0, 0, time.UTC)
	legs := []Leg{{Segments: []Segment{{
		From: "TLV", To: "HND", DepartureTime: dep, ArrivalTime: arr,
		MarketingCarrier: "LY", FlightNumber: "LY081",
	}}}}
	raw := []ProviderResult{
		{ID: "a", Price: Monetary{Currency: "USD", Amount: 400}, Source: "googleflights2", Legs: legs},
		{ID: "b", Price: Monetary{Currency: "USD", Amount: 350}, Source: "kiwi", Legs: legs, SelfTransfer: true},
	}
	out := MergeProviderResultsForPublish(raw, SearchRequest{Currency: "USD"})
	if len(out) != 1 {
		t.Fatalf("len=%d", len(out))
	}
	if out[0].Price.Amount != 350 {
		t.Fatalf("price=%.0f", out[0].Price.Amount)
	}
}

func TestRegistrySearchAllPartialStream(t *testing.T) {
	legs := []Leg{{Segments: []Segment{{From: "TLV", To: "VIE", MarketingCarrier: "OS", FlightNumber: "OS1"}}}}
	fast := &stubProvider{
		name: "googleflights2",
		results: []ProviderResult{{
			ID: "gf2", Price: Monetary{Currency: "USD", Amount: 200}, Source: "googleflights2", Legs: legs,
		}},
	}
	slow := &stubProvider{
		name:    "multisite",
		delay:   80 * time.Millisecond,
		results: []ProviderResult{{ID: "ota", Price: Monetary{Currency: "USD", Amount: 180}, Source: "kiwi", Legs: legs}},
	}
	r := &Registry{providers: []Provider{fast, slow}}

	var partialTicks []int
	var finalLen int
	res := r.SearchAllWithProgress(
		context.Background(),
		SearchRequest{Origin: "TLV", Destination: "VIE", DepartureDate: "2027-01-07", Currency: "USD"},
		nil,
		func(done, total int, partial MultiSearchResult) {
			if done >= total {
				t.Fatalf("partial callback after all done: %d/%d", done, total)
			}
			if len(partial.Results) == 0 {
				t.Fatalf("empty partial at %d/%d", done, total)
			}
			partialTicks = append(partialTicks, len(partial.Results))
		},
	)
	finalLen = len(res.Results)
	if len(partialTicks) != 1 || partialTicks[0] != 1 {
		t.Fatalf("partialTicks=%v", partialTicks)
	}
	if finalLen != 1 {
		t.Fatalf("final merged results=%d", finalLen)
	}
	if res.Results[0].Price.Amount != 180 {
		t.Fatalf("expected cheaper OTA after dedupe, got %.0f", res.Results[0].Price.Amount)
	}
}