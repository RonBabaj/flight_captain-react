package search

import (
	"context"
	"os"
	"testing"
	"time"
)

func TestUnifiedSearchStagger_multisiteFinishesBeforeGF2(t *testing.T) {
	t.Setenv("UNIFIED_SEARCH_FAST_DELAY_MS", "100")
	legs := []Leg{{Segments: []Segment{{From: "TLV", To: "JFK", MarketingCarrier: "LY", FlightNumber: "LY1"}}}}
	fast := &stubProvider{name: "googleflights2", results: []ProviderResult{{
		ID: "gf2", Price: Monetary{Currency: "USD", Amount: 500}, Source: "googleflights2", Legs: legs,
	}}}
	slow := &stubProvider{
		name:    "multisite",
		delay:   40 * time.Millisecond,
		results: []ProviderResult{{ID: "ota", Price: Monetary{Currency: "USD", Amount: 400}, Source: "kiwi", Legs: legs}},
	}
	r := &Registry{providers: []Provider{fast, slow}}
	var partialAt int
	_ = r.SearchAllWithProgress(context.Background(), SearchRequest{
		Origin: "TLV", Destination: "JFK", DepartureDate: "2027-02-01", Currency: "USD", Locale: "he",
	}, nil, func(done, total int, partial MultiSearchResult) {
		if done < total && len(partial.Results) > 0 {
			partialAt = done
		}
	})
	if partialAt != 1 {
		t.Fatalf("expected partial at first completion with stagger, partialAt=%d", partialAt)
	}
	os.Unsetenv("UNIFIED_SEARCH_FAST_DELAY_MS")
}