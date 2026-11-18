package main

import "testing"

func TestExploreAirportsForCountryJamaica(t *testing.T) {
	got := exploreAirportsForCountry("JM")
	if len(got) < 2 {
		t.Fatalf("JM: want KIN+MBJ, got %v", got)
	}
	seen := map[string]bool{}
	for _, c := range got {
		seen[c] = true
	}
	if !seen["KIN"] || !seen["MBJ"] {
		t.Fatalf("JM: got %v", got)
	}
}

func TestMergeExploreLiveQueuePriority(t *testing.T) {
	q := mergeExploreLiveQueuePriority([]string{"KIN", "MBJ"}, []string{"LHR", "KIN", "CDG"})
	if q[0] != "KIN" || q[1] != "MBJ" {
		t.Fatalf("priority order: %v", q)
	}
}