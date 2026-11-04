package main

import (
	"log"
	"time"

	"flightcaptainweb/search"
)

// timeSchemaAirportAbsolute marks snapshots whose segment times are true absolute
// instants (airport wall clocks parsed in the airport zone). Schema 0 / missing is
// the legacy form where GF2 wall clocks were stored as UTC (…Z), which made
// "Airport local" display shift by the zone offset on shared-link reloads.
const timeSchemaAirportAbsolute = 1

// reinterpretUTCWallClockAsAirportLocal treats t's clock face as local time at
// airportCode when t was unmarshaled from a …Z JSON value (Location UTC).
// Times that already carry a non-zero zone offset are left unchanged.
func reinterpretUTCWallClockAsAirportLocal(t time.Time, airportCode string) time.Time {
	if t.IsZero() {
		return t
	}
	if _, offset := t.Zone(); offset != 0 {
		return t
	}
	name := t.Location().String()
	if t.Location() != time.UTC && name != "UTC" {
		return t
	}
	loc := search.AirportLocation(airportCode)
	return time.Date(t.Year(), t.Month(), t.Day(), t.Hour(), t.Minute(), t.Second(), t.Nanosecond(), loc)
}

// migrateLegacySessionTimes upgrades a persisted shared-link snapshot so airport
// wall clocks display like airline sites. Returns true when the snapshot was
// rewritten (caller should re-persist).
func migrateLegacySessionTimes(resp *SearchSessionResultsResponse) bool {
	if resp == nil {
		return false
	}
	if resp.Session.TimeSchemaVersion >= timeSchemaAirportAbsolute {
		return false
	}

	changed := false
	for i := range resp.Results {
		opt := &resp.Results[i]
		for li := range opt.Legs {
			for si := range opt.Legs[li].Segments {
				seg := &opt.Legs[li].Segments[si]
				dep := reinterpretUTCWallClockAsAirportLocal(seg.DepartureTime, seg.From.Code)
				arr := reinterpretUTCWallClockAsAirportLocal(seg.ArrivalTime, seg.To.Code)
				if !dep.Equal(seg.DepartureTime) || !arr.Equal(seg.ArrivalTime) ||
					dep.Location().String() != seg.DepartureTime.Location().String() ||
					arr.Location().String() != seg.ArrivalTime.Location().String() {
					seg.DepartureTime = dep
					seg.ArrivalTime = arr
					changed = true
				}
			}
		}
		sanitizeSegmentTimes(opt.Legs)
		opt.OutboundSummary = computeOutboundSummary(opt)
	}

	resp.Session.TimeSchemaVersion = timeSchemaAirportAbsolute
	// Always persist the version bump so we do not re-scan on every GET — even when
	// every timestamp already had an offset (noop reinterpret).
	if !changed {
		log.Printf("[SESSION_TIME_MIGRATE] id=%s schema=%d (version bump only)", resp.Session.ID, timeSchemaAirportAbsolute)
	} else {
		log.Printf("[SESSION_TIME_MIGRATE] id=%s schema=%d reinterpreted wall-clock Z times", resp.Session.ID, timeSchemaAirportAbsolute)
	}
	return true
}
