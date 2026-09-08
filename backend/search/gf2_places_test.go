package search

import (
	"strings"
	"testing"
)

func TestResolveGF2PlaceCode_TokyoMetro(t *testing.T) {
	got := ResolveGF2PlaceCode("TYO")
	want := "HND,NRT"
	if got != want {
		t.Fatalf("TYO: got %q want %q", got, want)
	}
}

func TestResolveGF2PlaceCode_TokyoAirportExpandsMetro(t *testing.T) {
	got := ResolveGF2PlaceCode("HND")
	if got != "HND,NRT" {
		t.Fatalf("HND expands to metro airports, got %q", got)
	}
}

func TestResolveGF2PlaceCode_SingleAirport(t *testing.T) {
	if got := ResolveGF2PlaceCode("TLV"); got != "TLV" {
		t.Fatalf("TLV passthrough got %q", got)
	}
	if got := ResolveGF2PlaceCode("VIE"); got != "VIE" {
		t.Fatalf("VIE passthrough got %q", got)
	}
}

func TestResolveGF2PlaceCode_CityOnlyCode(t *testing.T) {
	if got := ResolveGF2PlaceCode("THR"); got != "IKA" {
		t.Fatalf("THR got %q want IKA", got)
	}
}

func TestResolveGF2PlaceCode_LondonParis(t *testing.T) {
	lon := ResolveGF2PlaceCode("LON")
	if lon == "LON" || !containsAll(lon, "LHR", "LGW") {
		t.Fatalf("LON: got %q", lon)
	}
	par := ResolveGF2PlaceCode("PAR")
	if par == "PAR" || !containsAll(par, "CDG", "ORY") {
		t.Fatalf("PAR: got %q", par)
	}
}

func TestResolveGF2PlaceCode_Istanbul(t *testing.T) {
	got := ResolveGF2PlaceCode("IST")
	if !containsAll(got, "IST", "SAW") {
		t.Fatalf("IST metro got %q", got)
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
