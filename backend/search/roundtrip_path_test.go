package search

import (
	"context"
	"testing"
)

func TestSearchLegCached_usesCache(t *testing.T) {
	p := &GoogleFlights2Provider{cache: newGF2Cache()}
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

func TestClassicRoundTrip_usesNativeSearchPath(t *testing.T) {
	req := SearchRequest{
		Origin: "TLV", Destination: "VIE",
		DepartureDate: "2027-01-07", ReturnDate: "2027-01-14",
	}
	if IsOpenJaw(req) || HasExtraLegs(req) {
		t.Fatal("classic RT must not be open-jaw")
	}
}

func TestOpenJaw_usesDecomposedSearchPath(t *testing.T) {
	req := SearchRequest{
		Origin: "TLV", Destination: "VIE",
		DepartureDate: "2027-01-07", ReturnDate: "2027-01-14",
		ReturnOrigin: "SZG", ReturnDestination: "TLV",
	}
	if !IsOpenJaw(req) {
		t.Fatal("expected open-jaw")
	}
}
