package search

import (
	"crypto/sha256"
	"encoding/hex"
	"fmt"
	"strings"
	"time"
)

const itineraryFingerprintVersion = "v1"

// PassengerContext holds search-party size when known (not part of fingerprint).
type PassengerContext struct {
	Adults   int `json:"adults,omitempty"`
	Children int `json:"children,omitempty"`
	Infants  int `json:"infants,omitempty"`
}

// CanonicalSegment is one flown segment with normalized identity fields.
type CanonicalSegment struct {
	From                  string    `json:"from"`
	To                    string    `json:"to"`
	DepartureTime         time.Time `json:"departureTime"`
	ArrivalTime           time.Time `json:"arrivalTime"`
	MarketingCarrier      string    `json:"marketingCarrier"`
	OperatingCarrier      string    `json:"operatingCarrier,omitempty"`
	FlightNumber          string    `json:"flightNumber"`
	OperatingFlightNumber string    `json:"operatingFlightNumber,omitempty"`
	DurationMinutes       int       `json:"durationMinutes,omitempty"`
	CabinClass            string    `json:"cabinClass,omitempty"`
}

// CanonicalLeg groups segments for one directional hop (outbound, return, extra).
type CanonicalLeg struct {
	Segments   []CanonicalSegment `json:"segments"`
	StopsCount int                `json:"stopsCount"`
}

// CanonicalItinerary is the normalized identity of a flight offer from Google Flights (or other providers).
// Price and passenger context are stored for reference but excluded from ItineraryFingerprint.
type CanonicalItinerary struct {
	Legs                 []CanonicalLeg     `json:"legs"`
	Segments             []CanonicalSegment `json:"segments"` // flat chronological list
	TotalDurationMinutes int                `json:"totalDurationMinutes,omitempty"`
	StopsCount           int                `json:"stopsCount"`
	Price                Monetary           `json:"price"`
	Source               string             `json:"source,omitempty"`
	ProviderID           string             `json:"providerId,omitempty"`
	SelfTransfer         bool               `json:"selfTransfer,omitempty"`
	Passengers           *PassengerContext  `json:"passengers,omitempty"`
}

// AttachCanonicalIdentity fills CanonicalItinerary and ItineraryFingerprint on a provider result.
func AttachCanonicalIdentity(pr *ProviderResult) {
	if pr == nil {
		return
	}
	it := BuildCanonicalItinerary(*pr)
	pr.CanonicalItinerary = it
	pr.ItineraryFingerprint = CanonicalItineraryFingerprint(it)
}

// AttachCanonicalIdentityAll enriches every result in place and returns the slice.
func AttachCanonicalIdentityAll(in []ProviderResult) []ProviderResult {
	for i := range in {
		AttachCanonicalIdentity(&in[i])
	}
	return in
}

// BuildCanonicalItinerary constructs the canonical model from a normalized provider result.
func BuildCanonicalItinerary(pr ProviderResult) CanonicalItinerary {
	it := CanonicalItinerary{
		TotalDurationMinutes: pr.DurationMinutes,
		StopsCount:           TotalStops(pr),
		Price:                pr.Price,
		Source:               pr.Source,
		ProviderID:           pr.ID,
		SelfTransfer:         pr.SelfTransfer,
	}
	if it.StopsCount == 0 && pr.Stops > 0 {
		it.StopsCount = pr.Stops
	}

	for _, leg := range pr.Legs {
		cl := CanonicalLeg{}
		for _, seg := range leg.Segments {
			cs := canonicalSegmentFromProvider(seg)
			cl.Segments = append(cl.Segments, cs)
			it.Segments = append(it.Segments, cs)
		}
		if len(cl.Segments) > 0 {
			cl.StopsCount = len(cl.Segments) - 1
			if cl.StopsCount < 0 {
				cl.StopsCount = 0
			}
		}
		it.Legs = append(it.Legs, cl)
	}

	if it.TotalDurationMinutes <= 0 {
		it.TotalDurationMinutes = sumCanonicalSegmentDurations(it.Segments)
	}
	if it.StopsCount == 0 && len(it.Segments) > 0 {
		it.StopsCount = len(it.Segments) - 1
		if len(it.Legs) > 1 {
			it.StopsCount = 0
			for _, leg := range it.Legs {
				it.StopsCount += leg.StopsCount
			}
		}
	}
	return it
}

func canonicalSegmentFromProvider(seg Segment) CanonicalSegment {
	mkt := NormalizeCarrierCode(seg.MarketingCarrier)
	op := NormalizeCarrierCode(seg.OperatingCarrier)
	mktFn := NormalizeFlightNumber(mkt, seg.FlightNumber)
	opFn := ""
	if seg.OperatingFlightNumber != "" {
		opFn = NormalizeFlightNumber(op, seg.OperatingFlightNumber)
	} else if op != "" && op != mkt {
		opFn = NormalizeFlightNumber(op, seg.FlightNumber)
	}
	return CanonicalSegment{
		From:                  NormalizeAirportCode(seg.From),
		To:                    NormalizeAirportCode(seg.To),
		DepartureTime:         seg.DepartureTime.UTC().Truncate(time.Second),
		ArrivalTime:           seg.ArrivalTime.UTC().Truncate(time.Second),
		MarketingCarrier:      mkt,
		OperatingCarrier:      op,
		FlightNumber:          mktFn,
		OperatingFlightNumber: opFn,
		DurationMinutes:       seg.DurationMinutes,
		CabinClass:            normalizeCabinClass(seg.CabinClass),
	}
}

// CanonicalItineraryFingerprint returns a deterministic SHA-256 hash (first 32 hex chars) of the
// physical itinerary. Price, source, and passenger counts are excluded.
func CanonicalItineraryFingerprint(it CanonicalItinerary) string {
	parts := []string{itineraryFingerprintVersion}
	for _, seg := range it.Segments {
		parts = append(parts, segmentFingerprintPart(seg))
	}
	if len(parts) == 1 {
		return ""
	}
	sum := sha256.Sum256([]byte(strings.Join(parts, "|")))
	return hex.EncodeToString(sum[:16])
}

func segmentFingerprintPart(seg CanonicalSegment) string {
	carrier, flightNum := segmentIdentityCarrier(seg)
	return strings.Join([]string{
		seg.From,
		seg.To,
		carrier,
		flightNum,
		NormalizeTimestamp(seg.DepartureTime),
		NormalizeTimestamp(seg.ArrivalTime),
	}, ":")
}

// segmentIdentityCarrier picks operating carrier/flight when present, else marketing.
func segmentIdentityCarrier(seg CanonicalSegment) (carrier, flightNum string) {
	op := NormalizeCarrierCode(seg.OperatingCarrier)
	mkt := NormalizeCarrierCode(seg.MarketingCarrier)
	if op != "" {
		carrier = op
		if seg.OperatingFlightNumber != "" {
			flightNum = NormalizeFlightNumber(op, seg.OperatingFlightNumber)
		} else {
			flightNum = NormalizeFlightNumber(op, seg.FlightNumber)
		}
		return
	}
	carrier = mkt
	flightNum = NormalizeFlightNumber(mkt, seg.FlightNumber)
	return
}

// NormalizeAirportCode uppercases and trims IATA codes.
func NormalizeAirportCode(code string) string {
	return strings.ToUpper(strings.TrimSpace(code))
}

// NormalizeCarrierCode uppercases and trims IATA airline codes.
func NormalizeCarrierCode(code string) string {
	return strings.ToUpper(strings.TrimSpace(code))
}

// NormalizeFlightNumber produces a stable carrier+number token (e.g. "LY081" from "LY", "LY 081").
func NormalizeFlightNumber(carrier, flightNum string) string {
	carrier = NormalizeCarrierCode(carrier)
	fn := strings.ToUpper(strings.TrimSpace(flightNum))
	fn = strings.ReplaceAll(fn, " ", "")
	fn = strings.ReplaceAll(fn, "-", "")
	if fn == "" {
		return carrier
	}
	if carrier != "" && strings.HasPrefix(fn, carrier) {
		return fn
	}
	// Strip duplicate carrier prefix variants: "081" with carrier "LY"
	if carrier != "" {
		return carrier + strings.TrimPrefix(fn, carrier)
	}
	return fn
}

// NormalizeTimestamp formats a UTC instant for fingerprinting (second precision).
func NormalizeTimestamp(t time.Time) string {
	if t.IsZero() {
		return ""
	}
	return t.UTC().Truncate(time.Second).Format(time.RFC3339)
}

func normalizeCabinClass(cabin string) string {
	c := strings.ToUpper(strings.TrimSpace(cabin))
	if c == "" {
		return ""
	}
	return c
}

func sumCanonicalSegmentDurations(segs []CanonicalSegment) int {
	total := 0
	for _, s := range segs {
		total += s.DurationMinutes
	}
	return total
}

// FingerprintDebugString returns the pre-hash identity string (for tests).
func FingerprintDebugString(it CanonicalItinerary) string {
	parts := []string{itineraryFingerprintVersion}
	for _, seg := range it.Segments {
		parts = append(parts, segmentFingerprintPart(seg))
	}
	return strings.Join(parts, "|")
}

// SetPassengerContext attaches search-party size to an itinerary (not included in fingerprint).
func (it *CanonicalItinerary) SetPassengerContext(adults, children, infants int) {
	if adults <= 0 && children <= 0 && infants <= 0 {
		return
	}
	if adults < 0 {
		adults = 0
	}
	it.Passengers = &PassengerContext{
		Adults:   adults,
		Children: children,
		Infants:  infants,
	}
}

// String returns a short debug summary.
func (it CanonicalItinerary) String() string {
	return fmt.Sprintf("itinerary{segments=%d legs=%d stops=%d fp=%s}",
		len(it.Segments), len(it.Legs), it.StopsCount, CanonicalItineraryFingerprint(it))
}
