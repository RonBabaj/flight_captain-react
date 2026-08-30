package search

import (
	"testing"
	"time"
)

func TestParseGF2TimeWithDateHint_AirportLocal(t *testing.T) {
	// 6:25 AM Salzburg local on Jan 14 2026 (CET, UTC+1) -> 05:25 UTC
	got, err := parseGF2TimeWithDateHint("6:25 AM", "2026-01-14", "SZG")
	if err != nil {
		t.Fatalf("parse: %v", err)
	}
	want := time.Date(2026, 1, 14, 5, 25, 0, 0, time.UTC)
	if !got.Equal(want) {
		t.Errorf("got %v want %v (UTC)", got.UTC(), want)
	}
}

func TestParseGF2TimeWithDateHint_TelAviv(t *testing.T) {
	got, err := parseGF2TimeWithDateHint("8:00 AM", "2026-04-10", "TLV")
	if err != nil {
		t.Fatalf("parse: %v", err)
	}
	loc := AirportLocation("TLV")
	local := got.In(loc)
	if local.Hour() != 8 || local.Minute() != 0 {
		t.Errorf("expected 08:00 local TLV, got %v", local.Format("15:04 MST"))
	}
}

func TestAirportLocation_UnknownFallsBackUTC(t *testing.T) {
	loc := AirportLocation("ZZZ")
	if loc.String() != "UTC" {
		t.Errorf("expected UTC, got %s", loc)
	}
}
