package search

import (
	"context"
	"testing"
)

func TestSearchLegCached_usesCache(t *testing.T) {
	p := &GoogleFlights2Provider{cache: newGF2Cache(gf2CacheTTL)}
	req := SearchRequest{Origin: "TLV", Destination: "VIE", DepartureDate: "2027-01-07", Adults: 1}
	cached := []ProviderResult{{ID: "x", Price: Monetary{Currency: "USD", Amount: 99}}}
	p.cache.set(p.buildCacheKey(req), cached)

	got, err := p.searchLegCached(context.Background(), req)
	if err != nil {
		t.Fatal(err)
	}
	if len(got) != 1 || got[0].ID != "x" {
		t.Fatalf("expected cached result, got %+v", got)
	}
}


