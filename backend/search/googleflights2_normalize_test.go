package search

import (
	"testing"
)

// TestParseGF2Time_RejectsTimeOnly ensures time-only strings like "02:20" are rejected
// so we never produce identical depart/arrive (02:20 → 02:20 bug).
func TestParseGF2Time_RejectsTimeOnly(t *testing.T) {
	_, err := parseGF2Time("02:20")
	if err == nil {
		t.Error("parseGF2Time should reject time-only \"02:20\"")
	}
	_, err = parseGF2Time("15:04")
	if err == nil {
		t.Error("parseGF2Time should reject time-only \"15:04\"")
	}
}

// TestParseGF2Time_AcceptsFullDateTime ensures full ISO/RFC3339 datetimes parse correctly.
func TestParseGF2Time_AcceptsFullDateTime(t *testing.T) {
	got, err := parseGF2Time("2025-03-06T08:00:00Z")
	if err != nil {
		t.Fatalf("parseGF2Time: %v", err)
	}
	if got.Year() != 2025 || got.Month() != 3 || got.Day() != 6 || got.Hour() != 8 || got.Minute() != 0 {
		t.Errorf("got %v", got)
	}

	got2, err := parseGF2Time("2025-03-06T14:35:00Z")
	if err != nil {
		t.Fatalf("parseGF2Time: %v", err)
	}
	if got2.Hour() != 14 || got2.Minute() != 35 {
		t.Errorf("got %v", got2)
	}
	// Depart and arrive should be different
	if got.Equal(got2) {
		t.Error("depart and arrive must be different for card display")
	}
}

// TestExtractGF2Leg_SingleSegment_DepartArriveDiffer ensures a single-segment leg built from
// leg-level fields never has identical departure and arrival times (fixes 02:20 → 02:20).
func TestExtractGF2Leg_SingleSegment_DepartArriveDiffer(t *testing.T) {
	// Leg with full datetime for departure and duration; arrival_time time-only (rejected) so arrival derived from dep+duration
	leg := map[string]interface{}{
		"departure_time": "2025-03-06T08:00:00Z",
		"arrival_time":   "02:20", // time-only, rejected
		"duration":       "PT2H20M",
		"origin":         "TLV",
		"destination":   "NAP",
	}
	segs, dur := extractGF2Leg(leg, "TLV", "NAP")
	if len(segs) != 1 {
		t.Fatalf("expected 1 segment, got %d", len(segs))
	}
	s := segs[0]
	if s.DepartureTime.IsZero() {
		t.Error("departure should be set from full datetime")
	}
	if s.ArrivalTime.IsZero() {
		t.Error("arrival should be derived from departure + duration")
	}
	if s.DepartureTime.Equal(s.ArrivalTime) {
		t.Error("departure and arrival must differ (no 02:20 → 02:20)")
	}
	diff := s.ArrivalTime.Sub(s.DepartureTime).Minutes()
	if diff != 140 { // 2h20m
		t.Errorf("expected 140 min, got %.0f", diff)
	}
	if dur != 140 {
		t.Errorf("totalDur expected 140, got %d", dur)
	}
}
