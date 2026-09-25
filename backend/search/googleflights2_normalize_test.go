package search

import (
	"testing"
)

// TestParseGF2Time_RejectsTimeOnly ensures time-only strings like "02:20" are rejected
// so we never produce identical depart/arrive (02:20 → 02:20 bug).
func TestParseGF2Time_RejectsTimeOnly(t *testing.T) {
	_, err := parseGF2Time("02:20", "")
	if err == nil {
		t.Error("parseGF2Time should reject time-only \"02:20\"")
	}
	_, err = parseGF2Time("15:04", "")
	if err == nil {
		t.Error("parseGF2Time should reject time-only \"15:04\"")
	}
}

// TestParseGF2Time_AcceptsFullDateTime ensures full ISO datetimes parse as airport wall clocks
// (GF2 often labels local times with a trailing Z).
func TestParseGF2Time_AcceptsFullDateTime(t *testing.T) {
	got, err := parseGF2Time("2025-03-06T08:00:00Z", "TLV")
	if err != nil {
		t.Fatalf("parseGF2Time: %v", err)
	}
	local := got.In(AirportLocation("TLV"))
	if local.Year() != 2025 || local.Month() != 3 || local.Day() != 6 || local.Hour() != 8 || local.Minute() != 0 {
		t.Errorf("expected 08:00 TLV local, got %v", local)
	}

	got2, err := parseGF2Time("2025-03-06T14:35:00Z", "NAP")
	if err != nil {
		t.Fatalf("parseGF2Time: %v", err)
	}
	local2 := got2.In(AirportLocation("NAP"))
	if local2.Hour() != 14 || local2.Minute() != 35 {
		t.Errorf("expected 14:35 NAP local, got %v", local2)
	}
	if got.Equal(got2) {
		t.Error("depart and arrive must be different for card display")
	}
}

// TestParseGF2Time_ZIsAirportWallClock: "06:30Z" at SZG in winter (CET) is 05:30 UTC,
// and airport-local display must still show 06:30 (airline / Google Flights style).
func TestParseGF2Time_ZIsAirportWallClock(t *testing.T) {
	got, err := parseGF2Time("2027-01-14T06:30:00Z", "SZG")
	if err != nil {
		t.Fatalf("parse: %v", err)
	}
	if utc := got.UTC(); utc.Hour() != 5 || utc.Minute() != 30 {
		t.Errorf("expected 05:30 UTC, got %s", utc.Format("15:04"))
	}
	local := got.In(AirportLocation("SZG"))
	if local.Hour() != 6 || local.Minute() != 30 {
		t.Errorf("expected 06:30 SZG local, got %s", local.Format("15:04"))
	}
}

// TestParseGF2Time_NumericOffsetIsAbsolute trusts real ±HH:MM offsets.
func TestParseGF2Time_NumericOffsetIsAbsolute(t *testing.T) {
	got, err := parseGF2Time("2027-01-14T06:30:00+01:00", "SZG")
	if err != nil {
		t.Fatalf("parse: %v", err)
	}
	if utc := got.UTC(); utc.Hour() != 5 || utc.Minute() != 30 {
		t.Errorf("expected 05:30 UTC from +01:00 offset, got %s", utc.Format("15:04"))
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
	segs, dur := extractGF2Leg(leg, "TLV", "NAP", "2026-04-10", "ECONOMY")
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
	// Wall clocks are airport-local: 08:00 Asia/Jerusalem and 10:20 Europe/Rome in April
	// → 05:00 UTC to 08:20 UTC = 200 minutes (not the naive 140 from treating Z as UTC).
	diff := s.ArrivalTime.Sub(s.DepartureTime).Minutes()
	if diff != 200 {
		t.Errorf("expected 200 min (timezone-aware), got %.0f", diff)
	}
	if dur != 200 {
		t.Errorf("totalDur expected 200, got %d", dur)
	}
	depLocal := s.DepartureTime.In(AirportLocation("TLV"))
	if depLocal.Hour() != 8 || depLocal.Minute() != 0 {
		t.Errorf("expected 08:00 TLV local, got %s", depLocal.Format("15:04"))
	}
	arrLocal := s.ArrivalTime.In(AirportLocation("NAP"))
	if arrLocal.Hour() != 10 || arrLocal.Minute() != 20 {
		t.Errorf("expected 10:20 NAP local, got %s", arrLocal.Format("15:04"))
	}
}

// TestExtractGF2Leg_TimeOnly_WithDateHint ensures time-only strings are parsed in airport local zones.
func TestExtractGF2Leg_TimeOnly_WithDateHint(t *testing.T) {
	leg := map[string]interface{}{
		"departure_time": "8:00 AM",
		"arrival_time":   "10:20 AM",
		"duration":       "PT2H20M",
		"origin":         "TLV",
		"destination":    "NAP",
	}
	segs, dur := extractGF2Leg(leg, "TLV", "NAP", "2026-04-10", "ECONOMY")
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
	depLocal := s.DepartureTime.In(AirportLocation("TLV"))
	if depLocal.Hour() != 8 || depLocal.Minute() != 0 {
		t.Errorf("expected 08:00 TLV local, got %s", depLocal.Format("15:04"))
	}
	arrLocal := s.ArrivalTime.In(AirportLocation("NAP"))
	if arrLocal.Hour() != 10 || arrLocal.Minute() != 20 {
		t.Errorf("expected 10:20 NAP local, got %s", arrLocal.Format("15:04"))
	}
	if dur <= 0 {
		t.Errorf("totalDur expected positive, got %d", dur)
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
	segs, _ := extractGF2Leg(leg, "TLV", "NAP", "", "ECONOMY")
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
