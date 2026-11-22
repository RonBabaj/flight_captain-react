package search

import "testing"

func TestGf2CountryCodeForRequest(t *testing.T) {
	if gf2CountryCodeForRequest(SearchRequest{Origin: "TLV", Destination: "JFK"}) != "IL" {
		t.Fatal("TLV origin expects IL market")
	}
	if gf2CountryCodeForRequest(SearchRequest{Origin: "JFK", Destination: "TLV", Locale: "en"}) != "US" {
		t.Fatal("US origin expects US")
	}
	if gf2CountryCodeForRequest(SearchRequest{Origin: "JFK", Locale: "he"}) != "IL" {
		t.Fatal("he locale expects IL")
	}
}

func TestGf2LanguageCodeForRequest_hebrewUsesEnUS(t *testing.T) {
	if got := gf2LanguageCodeForRequest(SearchRequest{Locale: "he", Origin: "TLV"}); got != "en-US" {
		t.Fatalf("GF2 API language=%q want en-US", got)
	}
}