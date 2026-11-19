package search

import "testing"

func TestExpandCountryJamaica(t *testing.T) {
	got := ExpandSearchDestinations("COUNTRY:JM")
	seen := map[string]bool{}
	for _, c := range got {
		seen[c] = true
	}
	if !seen["KIN"] || !seen["MBJ"] {
		t.Fatalf("JM: %+v", got)
	}
}

func TestExpandSearchDestinations_TokyoStillMetro(t *testing.T) {
	got := ExpandSearchDestinations("TYO")
	if len(got) < 2 {
		t.Fatalf("TYO metro: %+v", got)
	}
}