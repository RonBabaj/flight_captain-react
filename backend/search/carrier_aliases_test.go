package search

import "testing"

func TestLookupAirlineIATA(t *testing.T) {
	cases := map[string]string{
		"ISRAIR":         "6H",
		"Israir":         "6H",
		"6H":             "6H",
		"Wizz Air Malta": "W4",
		"WIZZAIRMALTA":   "W4",
		"Tus Airways":    "U8",
		"LY":             "LY",
	}
	for in, want := range cases {
		if got := LookupAirlineIATA(in); got != want {
			t.Errorf("LookupAirlineIATA(%q)=%q want %q", in, got, want)
		}
	}
}

func TestParseOtaOffers_IsrairNameToIATA(t *testing.T) {
	item := map[string]interface{}{
		"price": 313.0, "currency": "USD",
		"bookingUrl": "https://www.kiwi.com/en/search/results/tel-aviv-israel/prague-czechia/2026-11-13/2026-11-20/",
		"segments": []interface{}{
			map[string]interface{}{
				"leg": "outbound", "fromCode": "TLV", "toCode": "PRG",
				"departureTime": "2026-11-13T15:00:00+02:00", "arrivalTime": "2026-11-13T19:05:00+01:00",
				"airline": "ISRAIR",
			},
			map[string]interface{}{
				"leg": "inbound", "fromCode": "PRG", "toCode": "TLV",
				"departureTime": "2026-11-20T09:15:00+01:00", "arrivalTime": "2026-11-20T12:55:00+02:00",
				"airline": "ISRAIR",
			},
		},
	}
	out := ParseOtaOffers([]map[string]interface{}{item}, SearchRequest{
		Origin: "TLV", Destination: "PRG", Currency: "USD",
	}, "kiwi")
	if len(out) != 1 {
		t.Fatalf("len=%d", len(out))
	}
	if out[0].Legs[0].Segments[0].MarketingCarrier != "6H" {
		t.Fatalf("carrier=%q want 6H", out[0].Legs[0].Segments[0].MarketingCarrier)
	}
	if out[0].DeepLink != "" {
		t.Fatalf("listing deep link must stay cleared, got %q", out[0].DeepLink)
	}
	if out[0].ListingURL == "" {
		t.Fatal("expected ListingURL preserved")
	}
}
