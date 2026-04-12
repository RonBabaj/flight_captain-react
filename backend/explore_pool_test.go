package main

import (
	"slices"
	"testing"
)

func TestExplorePoolOrderedForOrigin_ExcludesSameMetro(t *testing.T) {
	pool := explorePoolOrderedForOrigin("NYC")
	if slices.Contains(pool, "JFK") {
		t.Fatalf("NYC origin should not include JFK (same metro): %v", pool)
	}
	pool2 := explorePoolOrderedForOrigin("JFK")
	if slices.Contains(pool2, "JFK") {
		t.Fatal("JFK origin should not include JFK as destination")
	}
	// TLV → New York should still appear
	if !slices.Contains(explorePoolOrderedForOrigin("TLV"), "JFK") {
		t.Fatal("TLV origin should still offer JFK as a destination")
	}
}
