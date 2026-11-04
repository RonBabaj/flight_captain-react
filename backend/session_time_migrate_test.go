package main

import (
	"testing"
	"time"

	"flightcaptainweb/search"
)

func TestReinterpretUTCWallClockAsAirportLocal_SZG(t *testing.T) {
	// Legacy shared-link JSON: "2027-01-14T06:30:00Z" meant 06:30 at SZG, not UTC.
	legacy := time.Date(2027, 1, 14, 6, 30, 0, 0, time.UTC)
	got := reinterpretUTCWallClockAsAirportLocal(legacy, "SZG")
	local := got.In(search.AirportLocation("SZG"))
	if local.Hour() != 6 || local.Minute() != 30 {
		t.Fatalf("expected 06:30 SZG local, got %s", local.Format("15:04 MST"))
	}
	if utc := got.UTC(); utc.Hour() != 5 || utc.Minute() != 30 {
		t.Fatalf("expected 05:30 UTC, got %s", utc.Format("15:04"))
	}
}

func TestReinterpretUTCWallClockAsAirportLocal_SkipsOffset(t *testing.T) {
	// Already-absolute instant with offset must not be shifted again.
	loc := time.FixedZone("CET", 3600)
	abs := time.Date(2027, 1, 14, 6, 30, 0, 0, loc)
	got := reinterpretUTCWallClockAsAirportLocal(abs, "SZG")
	if !got.Equal(abs) {
		t.Fatalf("offset time should be unchanged: got %v want %v", got, abs)
	}
}

func TestMigrateLegacySessionTimes_SharedLinkSnapshot(t *testing.T) {
	resp := SearchSessionResultsResponse{
		Session: SearchSession{ID: "sess_old", TimeSchemaVersion: 0},
		Results: []FlightOption{{
			ID: "opt_0",
			Legs: []FlightLeg{{
				Segments: []FlightSegment{{
					From:          AirportLike{Code: "SZG"},
					To:            AirportLike{Code: "FRA"},
					DepartureTime: time.Date(2027, 1, 14, 6, 30, 0, 0, time.UTC),
					ArrivalTime:   time.Date(2027, 1, 14, 7, 35, 0, 0, time.UTC),
					DurationMinutes: 65,
				}},
			}},
		}},
	}
	if !migrateLegacySessionTimes(&resp) {
		t.Fatal("expected migration to rewrite snapshot")
	}
	if resp.Session.TimeSchemaVersion != timeSchemaAirportAbsolute {
		t.Fatalf("schema=%d", resp.Session.TimeSchemaVersion)
	}
	seg := resp.Results[0].Legs[0].Segments[0]
	if dep := seg.DepartureTime.In(search.AirportLocation("SZG")); dep.Hour() != 6 || dep.Minute() != 30 {
		t.Fatalf("dep local=%s", dep.Format("15:04"))
	}
	if arr := seg.ArrivalTime.In(search.AirportLocation("FRA")); arr.Hour() != 7 || arr.Minute() != 35 {
		t.Fatalf("arr local=%s", arr.Format("15:04"))
	}
	// Second pass is a no-op.
	if migrateLegacySessionTimes(&resp) {
		t.Fatal("second migrate should be false")
	}
}
