package search

import (
	"encoding/json"
	"testing"
)

func TestParseGF2Response_RapidAPIFlatTopFlights(t *testing.T) {
	body := []byte(`{
		"status": true,
		"data": {
			"itineraries": {
				"topFlights": [
					{
						"departure_time": "08-10-2026 07:50 AM",
						"arrival_time": "08-10-2026 10:10 AM",
						"duration": {"raw": 140, "text": "2 hr 20 min"},
						"price": 850,
						"stops": 0
					}
				]
			}
		}
	}`)
	results, err := parseGF2Response(body, "TLV", "HND", "USD", "2026-10-08", "ECONOMY")
	if err != nil {
		t.Fatal(err)
	}
	if len(results) != 1 {
		t.Fatalf("expected 1 result, got %d", len(results))
	}
	if results[0].Price.Amount != 850 {
		t.Fatalf("price=%v", results[0].Price.Amount)
	}
	if len(results[0].Legs) == 0 || len(results[0].Legs[0].Segments) == 0 {
		t.Fatal("expected outbound leg segment")
	}
	seg := results[0].Legs[0].Segments[0]
	if seg.From != "TLV" || seg.To != "HND" {
		t.Fatalf("route=%s→%s", seg.From, seg.To)
	}
	if seg.DurationMinutes != 140 {
		t.Fatalf("duration=%d", seg.DurationMinutes)
	}
}

func TestParseGF2Time_EuropeanDateFormat(t *testing.T) {
	got, err := parseGF2Time("08-10-2026 07:50 AM", "TLV")
	if err != nil {
		t.Fatal(err)
	}
	if got.Day() != 8 || got.Month() != 10 || got.Year() != 2026 {
		t.Fatalf("parsed %v", got)
	}
}

func TestBuildGF2ResultFromItinerary_FlatFormat(t *testing.T) {
	var itin map[string]interface{}
	if err := json.Unmarshal([]byte(`{
		"departure_time": "08-10-2026 07:50 AM",
		"arrival_time": "08-10-2026 10:10 AM",
		"duration": {"raw": 140},
		"price": 500
	}`), &itin); err != nil {
		t.Fatal(err)
	}
	pr := buildGF2ResultFromItinerary(itin, "TLV", "LHR", "USD", 500, 0, "2026-10-08", "ECONOMY")
	if pr == nil {
		t.Fatal("expected result")
	}
	if len(pr.Legs) != 1 || len(pr.Legs[0].Segments) != 1 {
		t.Fatal("expected one segment")
	}
}
