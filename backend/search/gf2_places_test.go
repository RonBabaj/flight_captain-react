package search

import (
	"strings"
	"testing"
)

func TestGF2SearchAirports_TokyoMetro(t *testing.T) {
	got := GF2SearchAirports("TYO")
	if !containsAll(strings.Join(got, ","), "HND", "NRT") || len(got) != 2 {
		t.Fatalf("TYO: got %v want HND and NRT", got)
	}
}

func TestGF2SearchAirports_SpecificAirportNotExpanded(t *testing.T) {
	got := GF2SearchAirports("HND")
	if len(got) != 1 || got[0] != "HND" {
		t.Fatalf("HND should stay single airport, got %v", got)
	}
}

func TestGF2SearchAirports_SingleAirport(t *testing.T) {
	if got := GF2SearchAirports("TLV"); len(got) != 1 || got[0] != "TLV" {
		t.Fatalf("TLV passthrough got %v", got)
	}
	if got := GF2SearchAirports("VIE"); len(got) != 1 || got[0] != "VIE" {
		t.Fatalf("VIE passthrough got %v", got)
	}
}

func TestGF2SearchAirports_CityOnlyCode(t *testing.T) {
	got := GF2SearchAirports("THR")
	if len(got) != 1 || got[0] != "IKA" {
		t.Fatalf("THR got %v want [IKA]", got)
	}
}

func TestGF2SearchAirports_LondonParis(t *testing.T) {
	lon := GF2SearchAirports("LON")
	if len(lon) < 2 || !containsAll(strings.Join(lon, ","), "LHR", "LGW") {
		t.Fatalf("LON: got %v", lon)
	}
	par := GF2SearchAirports("PAR")
	if len(par) < 2 || !containsAll(strings.Join(par, ","), "CDG", "ORY") {
		t.Fatalf("PAR: got %v", par)
	}
}

func TestResolveGF2PlaceCode_PrimaryAirport(t *testing.T) {
	if got := ResolveGF2PlaceCode("TYO"); got != "HND" {
		t.Fatalf("primary for TYO got %q", got)
	}
}

func containsAll(s string, parts ...string) bool {
	for _, p := range parts {
		found := false
		for _, part := range strings.Split(s, ",") {
			if strings.TrimSpace(part) == p {
				found = true
				break
			}
		}
		if !found {
			return false
		}
	}
	return true
}
