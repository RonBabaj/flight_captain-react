package search

import (
	"testing"
	"time"
)

func TestParseOTASegmentTime_AirportWallClock(t *testing.T) {
	// Skyscanner-style zoneless clock at TLV (= Asia/Jerusalem).
	got := parseOTASegmentTime("2027-01-07T15:40:00", "TLV")
	if got.IsZero() {
		t.Fatal("expected parse")
	}
	local := got.In(AirportLocation("TLV"))
	if local.Hour() != 15 || local.Minute() != 40 {
		t.Fatalf("expected 15:40 TLV local, got %s", local.Format("15:04 MST"))
	}
}

func TestResultMatchesItinerary_OTAToGF2AcrossProviders(t *testing.T) {
	// OTA row: wall-clock scrape interpreted via airport TZ.
	otaDep := parseOTASegmentTime("2027-01-07T15:40:00", "TLV")
	otaArr := parseOTASegmentTime("2027-01-07T18:25:00", "VIE")
	want := BuildCanonicalItinerary(ProviderResult{
		Source: "skyscanner",
		Legs: []Leg{{
			Segments: []Segment{{
				From: "TLV", To: "VIE",
				DepartureTime:    otaDep,
				ArrivalTime:      otaArr,
				MarketingCarrier: "OS",
				FlightNumber:     "OS860",
			}},
		}},
	})

	// GF2 row: same physical flight as absolute UTC (winter TLV = UTC+2 → 13:40Z).
	gf2 := ProviderResult{
		Source: "googleflights2",
		Legs: []Leg{{
			Segments: []Segment{{
				From: "TLV", To: "VIE",
				DepartureTime:    time.Date(2027, 1, 7, 13, 40, 0, 0, time.UTC),
				ArrivalTime:      time.Date(2027, 1, 7, 17, 25, 0, 0, time.UTC),
				MarketingCarrier: "OS",
				FlightNumber:     "OS860",
			}},
		}},
	}
	AttachCanonicalIdentity(&gf2)

	if !ResultMatchesItinerary(want, gf2) {
		t.Fatalf("OTA itinerary should match GF2 hit for partner-token resolve")
	}
}

func TestResultMatchesItinerary_RejectsDifferentFlightNumber(t *testing.T) {
	dep := time.Date(2027, 1, 7, 13, 40, 0, 0, time.UTC)
	want := BuildCanonicalItinerary(ProviderResult{
		Legs: []Leg{{Segments: []Segment{{
			From: "TLV", To: "VIE", DepartureTime: dep,
			MarketingCarrier: "OS", FlightNumber: "OS860",
		}}}},
	})
	other := ProviderResult{
		Legs: []Leg{{Segments: []Segment{{
			From: "TLV", To: "VIE", DepartureTime: dep,
			MarketingCarrier: "OS", FlightNumber: "OS862",
		}}}},
	}
	AttachCanonicalIdentity(&other)
	if ResultMatchesItinerary(want, other) {
		t.Fatal("different flight numbers must not match")
	}
}
