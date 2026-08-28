package search

import (
	"context"
	"fmt"
	"sort"
	"strings"
	"time"
)

// MaxExtraLegs is the cap on additional one-way hops between outbound and return.
const MaxExtraLegs = 3

// ExtraLeg is an additional one-way hop in a dynamic-destination itinerary
// (between outbound Origin→Destination and the return leg).
type ExtraLeg struct {
	Origin      string
	Destination string
	Date        string // YYYY-MM-DD
}

// SearchRequest holds parameters for a flight search.
type SearchRequest struct {
	Origin        string
	Destination   string
	DepartureDate string
	ReturnDate    string
	// ReturnOrigin / ReturnDestination enable open-jaw (dynamic destination) round-trips:
	// outbound Origin→Destination, return ReturnOrigin→ReturnDestination.
	// Empty values default to classic RT (Destination→Origin).
	ReturnOrigin      string
	ReturnDestination string
	// ExtraLegs are optional extra one-way hops (A→B, then extra, then return).
	ExtraLegs         []ExtraLeg
	CabinClass        string
	CabinPreference   string
	IncludeCheckedBag bool
	Adults            int
	Children          int
	Infants           int
	Currency          string
}

// ResolveReturnAirports returns the return-leg endpoints for a round-trip search.
// Classic RT: destination → origin. Open-jaw: explicit return origin/destination when set.
func ResolveReturnAirports(req SearchRequest) (returnOrigin, returnDestination string) {
	returnOrigin = strings.ToUpper(strings.TrimSpace(req.ReturnOrigin))
	returnDestination = strings.ToUpper(strings.TrimSpace(req.ReturnDestination))
	if returnOrigin == "" {
		returnOrigin = strings.ToUpper(strings.TrimSpace(req.Destination))
	}
	if returnDestination == "" {
		returnDestination = strings.ToUpper(strings.TrimSpace(req.Origin))
	}
	return returnOrigin, returnDestination
}

// IsOpenJaw reports whether the return leg differs from a classic destination→origin reverse.
func IsOpenJaw(req SearchRequest) bool {
	if strings.TrimSpace(req.ReturnDate) == "" {
		return false
	}
	retOrig, retDest := ResolveReturnAirports(req)
	outOrig := strings.ToUpper(strings.TrimSpace(req.Origin))
	outDest := strings.ToUpper(strings.TrimSpace(req.Destination))
	return retOrig != outDest || retDest != outOrig
}

// NormalizeExtraLegs uppercases airports and drops fully empty rows.
func NormalizeExtraLegs(legs []ExtraLeg) []ExtraLeg {
	if len(legs) == 0 {
		return nil
	}
	out := make([]ExtraLeg, 0, len(legs))
	for _, l := range legs {
		o := strings.ToUpper(strings.TrimSpace(l.Origin))
		d := strings.ToUpper(strings.TrimSpace(l.Destination))
		date := strings.TrimSpace(l.Date)
		if o == "" && d == "" && date == "" {
			continue
		}
		out = append(out, ExtraLeg{Origin: o, Destination: d, Date: date})
	}
	return out
}

// CompleteExtraLegs returns extra hops that have origin, destination, and date.
func CompleteExtraLegs(legs []ExtraLeg) []ExtraLeg {
	norm := NormalizeExtraLegs(legs)
	out := make([]ExtraLeg, 0, len(norm))
	for _, l := range norm {
		if l.Origin != "" && l.Destination != "" && l.Date != "" {
			out = append(out, l)
		}
	}
	return out
}

// HasExtraLegs reports whether the request includes at least one complete extra hop.
func HasExtraLegs(req SearchRequest) bool {
	return len(CompleteExtraLegs(req.ExtraLegs)) > 0
}

// ExtraLegsFingerprint is a stable cache-key fragment for extra hops.
func ExtraLegsFingerprint(legs []ExtraLeg) string {
	complete := CompleteExtraLegs(legs)
	if len(complete) == 0 {
		return ""
	}
	parts := make([]string, 0, len(complete))
	for _, l := range complete {
		parts = append(parts, l.Origin+">"+l.Destination+"@"+l.Date)
	}
	return strings.Join(parts, ";")
}

func extraLegMaxPerBatch(n int) int {
	switch {
	case n <= 2:
		return 30
	case n == 3:
		return 8
	default:
		return 5
	}
}

func cloneLegs(legs []Leg) []Leg {
	out := make([]Leg, len(legs))
	copy(out, legs)
	return out
}

// CombineOneWayBatches cartesian-combines one-way result sets into multi-leg itineraries,
// cheapest first. Empty input batches yield nil.
func CombineOneWayBatches(batches [][]ProviderResult, idPrefix string) []ProviderResult {
	n := len(batches)
	if n == 0 {
		return nil
	}
	for _, b := range batches {
		if len(b) == 0 {
			return nil
		}
	}
	maxPer := extraLegMaxPerBatch(n)
	trimmed := make([][]ProviderResult, n)
	for i, b := range batches {
		if len(b) > maxPer {
			trimmed[i] = b[:maxPer]
		} else {
			trimmed[i] = b
		}
	}
	const maxOut = 40
	var acc []ProviderResult
	var walk func(idx int, cur ProviderResult)
	walk = func(idx int, cur ProviderResult) {
		if idx == n {
			acc = append(acc, cur)
			return
		}
		for i, r := range trimmed[idx] {
			var next ProviderResult
			if idx == 0 {
				next = r
				next.Legs = cloneLegs(r.Legs)
				next.ID = fmt.Sprintf("%s_%d", idPrefix, i)
				next.BookingToken = ""
				next.DeepLink = ""
			} else {
				next = cur
				next.Legs = append(cloneLegs(cur.Legs), cloneLegs(r.Legs)...)
				next.Price.Amount = cur.Price.Amount + r.Price.Amount
				next.DurationMinutes = cur.DurationMinutes + r.DurationMinutes
				next.ID = fmt.Sprintf("%s_%d", cur.ID, i)
				next.BookingToken = ""
				next.DeepLink = ""
			}
			walk(idx+1, next)
		}
	}
	walk(0, ProviderResult{})
	sort.Slice(acc, func(i, j int) bool {
		return acc[i].Price.Amount < acc[j].Price.Amount
	})
	if len(acc) > maxOut {
		acc = acc[:maxOut]
	}
	return AttachCanonicalIdentityAll(acc)
}

// Monetary holds currency and amount.
type Monetary struct {
	Currency string
	Amount   float64
}

// Layover describes a connection between segments.
type Layover struct {
	Airport         string
	DurationMinutes int
}

// ProviderResult is the normalized flight option shape returned by providers.
// Matches backend FlightOption for easy conversion.
type ProviderResult struct {
	ID                    string
	Price                 Monetary
	DurationMinutes       int
	Stops                 int // total stops across all legs (segments-1 summed)
	Legs                  []Leg
	Layovers              []Layover
	ValidatingAirlines    []string
	BaggageClass          string
	BaggageInfo           string // free-text baggage note when available
	PrimaryDisplayCarrier string
	Source                string // "googleflights2" | "kiwi" | future providers
	DeepLink              string // booking URL if present
	BookingToken          string // GF2 booking_token for partner checkout resolution
	VendorName            string // kayak/expedia/kiwi etc if present
	FareConditions        string
	SelfTransfer          bool                   // separate tickets / virtual interlining
	FetchedAt             time.Time              // data freshness
	Metadata              map[string]interface{} // provider-specific extras (never secrets)
	CanonicalItinerary    CanonicalItinerary     // normalized identity (excludes price from fingerprint)
	ItineraryFingerprint  string                 // deterministic hash of physical itinerary
}

// Leg represents one direction (outbound or return).
type Leg struct {
	Segments []Segment
}

// Segment represents a single flight segment.
type Segment struct {
	From                  string
	To                    string
	DepartureTime         time.Time
	ArrivalTime           time.Time
	MarketingCarrier      string
	OperatingCarrier      string
	FlightNumber          string
	OperatingFlightNumber string
	DurationMinutes       int
	CabinClass            string
}

// Provider is the interface all flight search providers implement.
type Provider interface {
	Name() string
	Search(ctx context.Context, req SearchRequest) ([]ProviderResult, error)
}

// ProviderSearchStats is diagnostic info for one provider within a multi search.
type ProviderSearchStats struct {
	Provider   string `json:"provider"`
	DurationMs int64  `json:"durationMs"`
	Results    int    `json:"results"`
	Err        string `json:"error,omitempty"` // empty on success
	CacheHit   bool   `json:"cacheHit,omitempty"`
}

// MultiSearchResult aggregates results from one or more providers.
type MultiSearchResult struct {
	Results []ProviderResult
	Stats   []ProviderSearchStats
}
