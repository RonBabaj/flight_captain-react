package main

import (
	"testing"
	"time"
)

func TestComputeTotalDurationFromLegs(t *testing.T) {
	dep1 := time.Date(2025, 3, 6, 8, 0, 0, 0, time.UTC)
	arr1 := time.Date(2025, 3, 6, 14, 35, 0, 0, time.UTC) // 6h35m
	dep2 := time.Date(2025, 3, 10, 10, 0, 0, 0, time.UTC)
	arr2 := time.Date(2025, 3, 10, 12, 30, 0, 0, time.UTC) // 2h30m

	legs := []FlightLeg{
		{
			Segments: []FlightSegment{
				{DepartureTime: dep1, ArrivalTime: arr1, DurationMinutes: 395},
			},
		},
		{
			Segments: []FlightSegment{
				{DepartureTime: dep2, ArrivalTime: arr2, DurationMinutes: 150},
			},
		},
	}
	got := computeTotalDurationFromLegs(legs)
	want := 395 + 150 // 545
	if got != want {
		t.Errorf("got %d, want %d", got, want)
	}
}

func TestComputeTotalDurationFromLegs_IncludesLayover(t *testing.T) {
	// One leg with two segments: 1h flight + 1h layover + 1h flight = 3h total
	dep1 := time.Date(2025, 3, 6, 8, 0, 0, 0, time.UTC)
	arr1 := time.Date(2025, 3, 6, 9, 0, 0, 0, time.UTC)
	dep2 := time.Date(2025, 3, 6, 10, 0, 0, 0, time.UTC)
	arr2 := time.Date(2025, 3, 6, 11, 0, 0, 0, time.UTC)

	legs := []FlightLeg{
		{
			Segments: []FlightSegment{
				{DepartureTime: dep1, ArrivalTime: arr1, DurationMinutes: 60},
				{DepartureTime: dep2, ArrivalTime: arr2, DurationMinutes: 60},
			},
		},
	}
	got := computeTotalDurationFromLegs(legs)
	want := 180 // 3h = last arrive - first depart
	if got != want {
		t.Errorf("got %d, want %d (layover included)", got, want)
	}
}

func TestSumSegmentDurations(t *testing.T) {
	// Segments with no times but with DurationMinutes (e.g. from API) should sum
	legs := []FlightLeg{
		{
			Segments: []FlightSegment{
				{DurationMinutes: 200},
				{DurationMinutes: 95},
			},
		},
		{
			Segments: []FlightSegment{
				{DurationMinutes: 150},
			},
		},
	}
	got := sumSegmentDurations(legs)
	want := 200 + 95 + 150
	if got != want {
		t.Errorf("got %d, want %d", got, want)
	}
}

// TestRoundtripOption_HasTwoLegs ensures a roundtrip option has two legs and the first leg
// is the outbound (card summary uses legs[0]).
func TestRoundtripOption_HasTwoLegs(t *testing.T) {
	opt := FlightOption{
		Legs: []FlightLeg{
			{Segments: []FlightSegment{
				{From: AirportLike{Code: "TLV"}, To: AirportLike{Code: "NAP"},
					DepartureTime: time.Date(2025, 3, 6, 8, 0, 0, 0, time.UTC),
					ArrivalTime:   time.Date(2025, 3, 6, 14, 35, 0, 0, time.UTC)},
			}},
			{Segments: []FlightSegment{
				{From: AirportLike{Code: "NAP"}, To: AirportLike{Code: "TLV"},
					DepartureTime: time.Date(2025, 3, 10, 10, 0, 0, 0, time.UTC),
					ArrivalTime:   time.Date(2025, 3, 10, 16, 0, 0, 0, time.UTC)},
			}},
		},
	}
	if len(opt.Legs) != 2 {
		t.Fatalf("roundtrip should have 2 legs, got %d", len(opt.Legs))
	}
	outbound := opt.Legs[0]
	if len(outbound.Segments) == 0 {
		t.Fatal("outbound leg should have segments")
	}
	first := outbound.Segments[0]
	last := outbound.Segments[len(outbound.Segments)-1]
	if first.From.Code != "TLV" || last.To.Code != "NAP" {
		t.Errorf("outbound should be TLV → NAP, got %s → %s", first.From.Code, last.To.Code)
	}
	// Card uses first leg times; they must differ
	if first.DepartureTime.Equal(last.ArrivalTime) {
		t.Error("outbound depart and arrive must differ for card")
	}
}

// TestSanitizeSegmentTimes ensures identical dep/arr are fixed when duration is set (fixes "02:20 -> 02:20").
func TestSanitizeSegmentTimes(t *testing.T) {
	same := time.Date(2025, 3, 6, 2, 20, 0, 0, time.UTC)
	legs := []FlightLeg{
		{
			Segments: []FlightSegment{
				{From: AirportLike{Code: "TLV"}, To: AirportLike{Code: "NAP"},
					DepartureTime: same, ArrivalTime: same, DurationMinutes: 245},
			},
		},
	}
	sanitizeSegmentTimes(legs)
	seg := &legs[0].Segments[0]
	if seg.DepartureTime.Equal(seg.ArrivalTime) {
		t.Error("after sanitize, departure and arrival must differ")
	}
	expectedArr := seg.DepartureTime.Add(245 * time.Minute)
	if !seg.ArrivalTime.Equal(expectedArr) {
		t.Errorf("arrival should be dep+245m, got %v", seg.ArrivalTime)
	}
}

// TestComputeOutboundSummary_Direct ensures direct flight has different dep/arr, stopsCount=0, no layovers.
func TestComputeOutboundSummary_Direct(t *testing.T) {
	dep := time.Date(2025, 3, 6, 8, 0, 0, 0, time.UTC)
	arr := time.Date(2025, 3, 6, 14, 35, 0, 0, time.UTC)
	opt := FlightOption{
		Legs: []FlightLeg{
			{Segments: []FlightSegment{
				{From: AirportLike{Code: "TLV"}, To: AirportLike{Code: "NAP"},
					DepartureTime: dep, ArrivalTime: arr, DurationMinutes: 395},
			}},
		},
	}
	sum := computeOutboundSummary(&opt)
	if sum == nil {
		t.Fatal("expected non-nil summary")
	}
	if sum.StopsCount != 0 {
		t.Errorf("direct flight stopsCount want 0, got %d", sum.StopsCount)
	}
	if len(sum.Layovers) != 0 {
		t.Errorf("direct flight layovers want 0, got %d", len(sum.Layovers))
	}
	if !sum.DepartureTime.Equal(dep) || !sum.ArrivalTime.Equal(arr) {
		t.Errorf("departure/arrival mismatch: got dep=%v arr=%v", sum.DepartureTime, sum.ArrivalTime)
	}
	if sum.DurationMinutes != 395 {
		t.Errorf("durationMinutes want 395, got %d", sum.DurationMinutes)
	}
}

// TestComputeOutboundSummary_OneStop ensures one-stop has two segments, one layover at intermediate airport (not destination).
func TestComputeOutboundSummary_OneStop(t *testing.T) {
	dep1 := time.Date(2025, 3, 6, 8, 0, 0, 0, time.UTC)
	arr1 := time.Date(2025, 3, 6, 10, 30, 0, 0, time.UTC)  // TLV -> FCO
	dep2 := time.Date(2025, 3, 6, 12, 0, 0, 0, time.UTC)   // 1h30 layover at FCO
	arr2 := time.Date(2025, 3, 6, 14, 35, 0, 0, time.UTC) // FCO -> NAP
	opt := FlightOption{
		Legs: []FlightLeg{
			{Segments: []FlightSegment{
				{From: AirportLike{Code: "TLV"}, To: AirportLike{Code: "FCO"},
					DepartureTime: dep1, ArrivalTime: arr1, DurationMinutes: 150},
				{From: AirportLike{Code: "FCO"}, To: AirportLike{Code: "NAP"},
					DepartureTime: dep2, ArrivalTime: arr2, DurationMinutes: 155},
			}},
		},
	}
	sum := computeOutboundSummary(&opt)
	if sum == nil {
		t.Fatal("expected non-nil summary")
	}
	if sum.StopsCount != 1 {
		t.Errorf("one-stop stopsCount want 1, got %d", sum.StopsCount)
	}
	if len(sum.Layovers) != 1 {
		t.Fatalf("one-stop layovers want 1, got %d", len(sum.Layovers))
	}
	if sum.Layovers[0].AirportCode != "FCO" {
		t.Errorf("layover airport should be intermediate FCO, got %s", sum.Layovers[0].AirportCode)
	}
	if sum.Layovers[0].Minutes != 90 {
		t.Errorf("layover duration want 90m, got %d", sum.Layovers[0].Minutes)
	}
	if sum.DurationMinutes != 395 {
		t.Errorf("total outbound duration want 395 (6h35m), got %d", sum.DurationMinutes)
	}
}
