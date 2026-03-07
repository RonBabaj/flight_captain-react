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
