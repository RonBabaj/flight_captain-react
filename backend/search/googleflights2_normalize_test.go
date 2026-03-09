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
	leg := map[string]interface{}{
		"departure_time": "2026-04-10T08:00:00Z",
		"arrival_time":   "2026-04-10T10:20:00Z",
		"duration":       "PT2H20M",
		"origin":         "TLV",
		"destination":    "NAP",
	}
	segs, dur := extractGF2Leg(leg, "TLV", "NAP", "2026-04-10")
	if len(segs) != 1 {
		t.Fatalf("expected 1 segment, got %d", len(segs))
	}
	s := segs[0]
	if s.DepartureTime.IsZero() {
		t.Error("departure should be set from full datetime")
	}
	if s.ArrivalTime.IsZero() {
		t.Error("arrival should be set from full datetime")
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

// TestExtractGF2Leg_TimeOnly_WithDateHint ensures time-only strings are parsed with date hint.
func TestExtractGF2Leg_TimeOnly_WithDateHint(t *testing.T) {
	leg := map[string]interface{}{
		"departure_time": "8:00 AM",
		"arrival_time":   "10:20 AM",
		"duration":       "PT2H20M",
		"origin":         "TLV",
		"destination":    "NAP",
	}
	segs, dur := extractGF2Leg(leg, "TLV", "NAP", "2026-04-10")
	if len(segs) != 1 {
		t.Fatalf("expected 1 segment, got %d", len(segs))
	}
	s := segs[0]
	if s.DepartureTime.IsZero() {
		t.Error("departure should be parsed with date hint")
	}
	if s.ArrivalTime.IsZero() {
		t.Error("arrival should be parsed with date hint")
	}
	if s.DepartureTime.Year() != 2026 || s.DepartureTime.Month() != 4 || s.DepartureTime.Day() != 10 {
		t.Errorf("expected 2026-04-10, got %v", s.DepartureTime)
	}
	if dur != 140 {
		t.Errorf("totalDur expected 140, got %d", dur)
	}
}

// TestExtractGF2Leg_TimeOnly_NoDateHint ensures time-only strings are rejected without date hint.
func TestExtractGF2Leg_TimeOnly_NoDateHint(t *testing.T) {
	leg := map[string]interface{}{
		"departure_time": "8:00 AM",
		"duration":       "PT2H20M",
		"origin":         "TLV",
		"destination":    "NAP",
	}
	segs, _ := extractGF2Leg(leg, "TLV", "NAP", "")
	if len(segs) != 1 {
		t.Fatalf("expected 1 segment, got %d", len(segs))
	}
	s := segs[0]
	if !s.DepartureTime.IsZero() {
		t.Error("departure should be zero when no date hint and time-only string")
	}
	if !s.ArrivalTime.IsZero() {
		t.Error("arrival should also be zero when departure cannot be parsed (no date hint)")
	}
}
