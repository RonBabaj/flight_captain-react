package search

import (
	"strings"
	"testing"
	"time"
)

func segTLVJFK(dep, arr time.Time) Segment {
	return Segment{
		From: "TLV", To: "JFK",
		DepartureTime: dep, ArrivalTime: arr,
		MarketingCarrier: "LY", FlightNumber: "LY001",
		DurationMinutes: int(arr.Sub(dep).Minutes()),
		CabinClass:      "ECONOMY",
	}
}

func TestCanonicalItineraryFingerprint_directFlight(t *testing.T) {
	dep := time.Date(2026, 10, 7, 14, 30, 0, 0, time.UTC)
	arr := time.Date(2026, 10, 7, 22, 15, 0, 0, time.UTC)
	pr := ProviderResult{
		ID: "gf2_0", Source: "googleflights2",
		Price: Monetary{Currency: "USD", Amount: 450},
		Legs:  []Leg{{Segments: []Segment{segTLVJFK(dep, arr)}}},
	}
	AttachCanonicalIdentity(&pr)
	if pr.ItineraryFingerprint == "" {
		t.Fatal("expected fingerprint")
	}
	if len(pr.CanonicalItinerary.Segments) != 1 {
		t.Fatalf("segments=%d", len(pr.CanonicalItinerary.Segments))
	}
	s := pr.CanonicalItinerary.Segments[0]
	if s.From != "TLV" || s.To != "JFK" || s.FlightNumber != "LY001" {
		t.Fatalf("segment=%+v", s)
	}
}

func TestCanonicalItineraryFingerprint_sameItineraryDifferentPrice(t *testing.T) {
	dep := time.Date(2026, 10, 7, 14, 30, 0, 0, time.UTC)
	arr := time.Date(2026, 10, 7, 22, 15, 0, 0, time.UTC)
	legs := []Leg{{Segments: []Segment{segTLVJFK(dep, arr)}}}
	a := ProviderResult{Price: Monetary{Currency: "USD", Amount: 400}, Legs: legs, Source: "googleflights2"}
	b := ProviderResult{Price: Monetary{Currency: "USD", Amount: 520}, Legs: legs, Source: "kiwi"}
	AttachCanonicalIdentity(&a)
	AttachCanonicalIdentity(&b)
	if a.ItineraryFingerprint != b.ItineraryFingerprint {
		t.Fatalf("price must not affect fingerprint: %s vs %s", a.ItineraryFingerprint, b.ItineraryFingerprint)
	}
}

func TestNormalizeFlightNumber_formatting(t *testing.T) {
	cases := []struct {
		carrier, raw, want string
	}{
		{"LY", "LY 081", "LY081"},
		{"LY", "081", "LY081"},
		{"BA", "BA117", "BA117"},
		{"", "UA123", "UA123"},
		{"AF", "AF-1234", "AF1234"},
	}
	for _, tc := range cases {
		got := NormalizeFlightNumber(tc.carrier, tc.raw)
		if got != tc.want {
			t.Errorf("NormalizeFlightNumber(%q, %q) = %q, want %q", tc.carrier, tc.raw, got, tc.want)
		}
	}
}

func TestCanonicalItineraryFingerprint_formattingStable(t *testing.T) {
	dep := time.Date(2026, 8, 10, 10, 0, 0, 0, time.UTC)
	arr := time.Date(2026, 8, 10, 18, 0, 0, 0, time.UTC)
	a := ProviderResult{
		Legs: []Leg{{Segments: []Segment{{
			From: "TLV", To: "HND", DepartureTime: dep, ArrivalTime: arr,
			MarketingCarrier: "LY", FlightNumber: "LY081",
		}}}},
	}
	b := ProviderResult{
		Legs: []Leg{{Segments: []Segment{{
			From: "tlv", To: "hnd", DepartureTime: dep, ArrivalTime: arr,
			MarketingCarrier: "ly", FlightNumber: "LY 081",
		}}}},
	}
	AttachCanonicalIdentity(&a)
	AttachCanonicalIdentity(&b)
	if a.ItineraryFingerprint != b.ItineraryFingerprint {
		t.Fatalf("formatting should normalize to same fingerprint")
	}
}

func TestCanonicalItineraryFingerprint_connectingFlight(t *testing.T) {
	dep1 := time.Date(2026, 11, 1, 8, 0, 0, 0, time.UTC)
	arr1 := time.Date(2026, 11, 1, 12, 0, 0, 0, time.UTC)
	dep2 := time.Date(2026, 11, 1, 14, 0, 0, 0, time.UTC)
	arr2 := time.Date(2026, 11, 1, 20, 0, 0, 0, time.UTC)
	pr := ProviderResult{
		Legs: []Leg{{Segments: []Segment{
			{From: "TLV", To: "FRA", DepartureTime: dep1, ArrivalTime: arr1, MarketingCarrier: "LH", FlightNumber: "LH687"},
			{From: "FRA", To: "JFK", DepartureTime: dep2, ArrivalTime: arr2, MarketingCarrier: "LH", FlightNumber: "LH400"},
		}}},
	}
	AttachCanonicalIdentity(&pr)
	if len(pr.CanonicalItinerary.Segments) != 2 {
		t.Fatalf("expected 2 segments, got %d", len(pr.CanonicalItinerary.Segments))
	}
	if pr.CanonicalItinerary.StopsCount != 1 {
		t.Fatalf("stops=%d", pr.CanonicalItinerary.StopsCount)
	}
	if pr.CanonicalItinerary.Legs[0].StopsCount != 1 {
		t.Fatalf("leg stops=%d", pr.CanonicalItinerary.Legs[0].StopsCount)
	}
}

func TestCanonicalItineraryFingerprint_roundTrip(t *testing.T) {
	outDep := time.Date(2026, 12, 1, 10, 0, 0, 0, time.UTC)
	outArr := time.Date(2026, 12, 1, 14, 0, 0, 0, time.UTC)
	inDep := time.Date(2026, 12, 8, 16, 0, 0, 0, time.UTC)
	inArr := time.Date(2026, 12, 8, 22, 0, 0, 0, time.UTC)
	pr := ProviderResult{
		Legs: []Leg{
			{Segments: []Segment{{From: "TLV", To: "VIE", DepartureTime: outDep, ArrivalTime: outArr, MarketingCarrier: "OS", FlightNumber: "OS861"}}},
			{Segments: []Segment{{From: "VIE", To: "TLV", DepartureTime: inDep, ArrivalTime: inArr, MarketingCarrier: "OS", FlightNumber: "OS860"}}},
		},
	}
	AttachCanonicalIdentity(&pr)
	if len(pr.CanonicalItinerary.Legs) != 2 {
		t.Fatalf("legs=%d", len(pr.CanonicalItinerary.Legs))
	}
	if len(pr.CanonicalItinerary.Segments) != 2 {
		t.Fatalf("flat segments=%d", len(pr.CanonicalItinerary.Segments))
	}
}

func TestCanonicalItineraryFingerprint_differentFlightsDoNotCollide(t *testing.T) {
	dep := time.Date(2026, 9, 1, 9, 0, 0, 0, time.UTC)
	arr := time.Date(2026, 9, 1, 13, 0, 0, 0, time.UTC)
	a := ProviderResult{Legs: []Leg{{Segments: []Segment{{
		From: "TLV", To: "BCN", DepartureTime: dep, ArrivalTime: arr,
		MarketingCarrier: "VY", FlightNumber: "VY7842",
	}}}}}
	b := ProviderResult{Legs: []Leg{{Segments: []Segment{{
		From: "TLV", To: "BCN", DepartureTime: dep.Add(2 * time.Hour), ArrivalTime: arr.Add(2 * time.Hour),
		MarketingCarrier: "VY", FlightNumber: "VY7844",
	}}}}}
	AttachCanonicalIdentity(&a)
	AttachCanonicalIdentity(&b)
	if a.ItineraryFingerprint == b.ItineraryFingerprint {
		t.Fatal("different flights must not share fingerprint")
	}
}

func TestCanonicalItineraryFingerprint_missingOptionalFields(t *testing.T) {
	pr := ProviderResult{
		Legs: []Leg{{Segments: []Segment{{
			From: "TLV", To: "LCA",
			MarketingCarrier: "CY", FlightNumber: "CY101",
		}}}},
	}
	AttachCanonicalIdentity(&pr)
	if pr.ItineraryFingerprint == "" {
		t.Fatal("expected fingerprint even with missing times")
	}
	dbg := FingerprintDebugString(pr.CanonicalItinerary)
	if !strings.Contains(dbg, "TLV:LCA:CY:CY101") {
		t.Fatalf("unexpected debug string: %s", dbg)
	}
}

func TestCanonicalItineraryFingerprint_operatingCarrier(t *testing.T) {
	dep := time.Date(2026, 7, 4, 11, 0, 0, 0, time.UTC)
	arr := time.Date(2026, 7, 4, 15, 30, 0, 0, time.UTC)
	marketed := ProviderResult{
		Legs: []Leg{{Segments: []Segment{{
			From: "TLV", To: "FCO", DepartureTime: dep, ArrivalTime: arr,
			MarketingCarrier: "AZ", FlightNumber: "AZ809",
			OperatingCarrier: "AZ", OperatingFlightNumber: "AZ809",
		}}}},
	}
	codeshareSold := ProviderResult{
		Legs: []Leg{{Segments: []Segment{{
			From: "TLV", To: "FCO", DepartureTime: dep, ArrivalTime: arr,
			MarketingCarrier: "LY", FlightNumber: "LY809",
			OperatingCarrier: "AZ", OperatingFlightNumber: "AZ809",
		}}}},
	}
	AttachCanonicalIdentity(&marketed)
	AttachCanonicalIdentity(&codeshareSold)
	if marketed.ItineraryFingerprint != codeshareSold.ItineraryFingerprint {
		t.Fatalf("same operated flight should fingerprint equally: %s vs %s",
			marketed.ItineraryFingerprint, codeshareSold.ItineraryFingerprint)
	}
}

func TestCanonicalItineraryFingerprint_excludesPrice(t *testing.T) {
	it := CanonicalItinerary{
		Segments: []CanonicalSegment{{
			From: "A", To: "B", MarketingCarrier: "X", FlightNumber: "X1",
			DepartureTime: time.Date(2026, 1, 1, 10, 0, 0, 0, time.UTC),
			ArrivalTime:   time.Date(2026, 1, 1, 12, 0, 0, 0, time.UTC),
		}},
	}
	itCheap := it
	itCheap.Price = Monetary{Currency: "USD", Amount: 100}
	itDear := it
	itDear.Price = Monetary{Currency: "USD", Amount: 999}
	if CanonicalItineraryFingerprint(itCheap) != CanonicalItineraryFingerprint(itDear) {
		t.Fatal("price must not be in fingerprint")
	}
}

func TestFingerprintDebugString_format(t *testing.T) {
	dep := time.Date(2026, 10, 7, 14, 30, 0, 0, time.UTC)
	arr := time.Date(2026, 10, 7, 17, 45, 0, 0, time.UTC)
	it := BuildCanonicalItinerary(ProviderResult{
		Legs: []Leg{{Segments: []Segment{{
			From: "TLV", To: "VIE", DepartureTime: dep, ArrivalTime: arr,
			MarketingCarrier: "LY", FlightNumber: "LY315",
		}}}},
	})
	dbg := FingerprintDebugString(it)
	if !strings.HasPrefix(dbg, "v1|") {
		t.Fatalf("expected v1 prefix, got %q", dbg)
	}
	if !strings.Contains(dbg, "TLV:VIE:LY:LY315:2026-10-07T14:30:00Z:2026-10-07T17:45:00Z") {
		t.Fatalf("unexpected segment part: %s", dbg)
	}
}

func TestAttachCanonicalIdentityAll_combineOneWay(t *testing.T) {
	dep := time.Date(2026, 6, 1, 8, 0, 0, 0, time.UTC)
	arr := time.Date(2026, 6, 1, 12, 0, 0, 0, time.UTC)
	batchA := []ProviderResult{{
		ID: "a0", Price: Monetary{Currency: "USD", Amount: 200},
		Legs: []Leg{{Segments: []Segment{{From: "TLV", To: "ATH", DepartureTime: dep, ArrivalTime: arr, MarketingCarrier: "A3", FlightNumber: "A3928"}}}},
	}}
	batchB := []ProviderResult{{
		ID: "b0", Price: Monetary{Currency: "USD", Amount: 150},
		Legs: []Leg{{Segments: []Segment{{From: "ATH", To: "JMK", DepartureTime: dep.Add(3 * time.Hour), ArrivalTime: arr.Add(3 * time.Hour), MarketingCarrier: "A3", FlightNumber: "A3123"}}}},
	}}
	combined := CombineOneWayBatches([][]ProviderResult{batchA, batchB}, "combo")
	if len(combined) != 1 {
		t.Fatalf("combined=%d", len(combined))
	}
	if combined[0].ItineraryFingerprint == "" {
		t.Fatal("combined result should have fingerprint")
	}
	if len(combined[0].CanonicalItinerary.Segments) != 2 {
		t.Fatalf("segments=%d", len(combined[0].CanonicalItinerary.Segments))
	}
}


func TestGF2OperatingCarrierExtraction(t *testing.T) {
	seg := map[string]interface{}{
		"departure_airport": map[string]interface{}{"id": "TLV", "time": "2026-05-01T10:00:00Z"},
		"arrival_airport":   map[string]interface{}{"id": "FCO", "time": "2026-05-01T14:00:00Z"},
		"airline":           "LY",
		"flight_number":     "LY809",
		"operating_airline": "AZ",
		"operating_flight_number": "AZ809",
	}
	got := extractGF2SegmentFromFlight(seg, "TLV", "FCO", "2026-05-01", "ECONOMY")
	if got == nil {
		t.Fatal("nil segment")
	}
	if got.OperatingCarrier != "AZ" {
		t.Fatalf("operating=%q", got.OperatingCarrier)
	}
	if got.OperatingFlightNumber != "AZ809" {
		t.Fatalf("operating fn=%q", got.OperatingFlightNumber)
	}
}
