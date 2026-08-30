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

// SanitizeStandardSearchRequest strips open-jaw / extra-leg fields for classic round-trips.
// Stale returnOrigin values from prior open-jaw searches must not force decomposed one-way searches.
func SanitizeStandardSearchRequest(req SearchRequest) SearchRequest {
	if strings.TrimSpace(req.ReturnDate) == "" {
		return req
	}
	if HasExtraLegs(req) {
		return req
	}
	dest := strings.ToUpper(strings.TrimSpace(req.Destination))
	retOrig := strings.ToUpper(strings.TrimSpace(req.ReturnOrigin))
	if retOrig != "" && dest != "" && retOrig != dest {
		return req
	}
	req.ReturnOrigin = ""
	req.ReturnDestination = ""
	req.ExtraLegs = nil
	return req
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
		sorted := append([]ProviderResult(nil), b...)
		sort.Slice(sorted, func(a, b int) bool {
			return sorted[a].Price.Amount < sorted[b].Price.Amount
		})
		if len(sorted) > maxPer {
			trimmed[i] = sorted[:maxPer]
		} else {
			trimmed[i] = sorted
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
				next.LegBookingTokens = []string{strings.TrimSpace(r.BookingToken)}
				next.LegDeepLinks = []string{strings.TrimSpace(r.DeepLink)}
				next.LegPrices = []float64{r.Price.Amount}
				next.BookingToken = ""
				next.DeepLink = ""
			} else {
				next = mergeProviderLeg(cur, r, i, idPrefix)
			}
			walk(idx+1, next)
		}
	}
	walk(0, ProviderResult{})
	acc = finalizeCombinedBatches(acc, trimmed, idPrefix, maxOut)
	return AttachCanonicalIdentityAll(acc)
}

func mergeProviderLeg(cur, r ProviderResult, rIdx int, idPrefix string) ProviderResult {
	next := cur
	next.Legs = append(cloneLegs(cur.Legs), cloneLegs(r.Legs)...)
	next.Price.Amount = cur.Price.Amount + r.Price.Amount
	next.DurationMinutes = cur.DurationMinutes + r.DurationMinutes
	next.ID = fmt.Sprintf("%s_%d", cur.ID, rIdx)
	next.LegBookingTokens = append(append([]string(nil), cur.LegBookingTokens...), strings.TrimSpace(r.BookingToken))
	next.LegDeepLinks = append(append([]string(nil), cur.LegDeepLinks...), strings.TrimSpace(r.DeepLink))
	next.LegPrices = append(append([]float64(nil), cur.LegPrices...), r.Price.Amount)
	next.BookingToken = ""
	next.DeepLink = ""
	next.ValidatingAirlines = mergeCarrierCodeLists(cur.ValidatingAirlines, r.ValidatingAirlines)
	if len(next.ValidatingAirlines) == 0 {
		next.ValidatingAirlines = marketingCarriersFromLegs(next.Legs)
	}
	return next
}

func mergeCarrierCodeLists(a, b []string) []string {
	seen := map[string]struct{}{}
	var out []string
	for _, list := range [][]string{a, b} {
		for _, c := range list {
			c = strings.ToUpper(strings.TrimSpace(c))
			if c == "" {
				continue
			}
			if _, ok := seen[c]; ok {
				continue
			}
			seen[c] = struct{}{}
			out = append(out, c)
		}
	}
	return out
}

func marketingCarriersFromLegs(legs []Leg) []string {
	seen := map[string]struct{}{}
	var out []string
	for _, leg := range legs {
		for _, seg := range leg.Segments {
			c := strings.ToUpper(strings.TrimSpace(seg.MarketingCarrier))
			if c == "" {
				continue
			}
			if _, ok := seen[c]; ok {
				continue
			}
			seen[c] = struct{}{}
			out = append(out, c)
		}
	}
	return out
}

// finalizeCombinedBatches keeps the cheapest combinations but reserves slots so distinct
// return (last-batch) options — e.g. a direct El Al SZG→TLV — are not crowded out by
// slightly cheaper connecting fares on every open-jaw result row.
func finalizeCombinedBatches(acc []ProviderResult, trimmed [][]ProviderResult, idPrefix string, maxOut int) []ProviderResult {
	sort.Slice(acc, func(i, j int) bool {
		return acc[i].Price.Amount < acc[j].Price.Amount
	})
	if len(trimmed) != 2 || len(acc) == 0 {
		if len(acc) > maxOut {
			return acc[:maxOut]
		}
		return acc
	}

	const minCheapest = 28
	seen := map[string]struct{}{}
	var out []ProviderResult
	add := func(r ProviderResult) {
		if len(out) >= maxOut {
			return
		}
		it := BuildCanonicalItinerary(r)
		k := CanonicalItineraryFingerprint(it)
		if k == "" {
			return
		}
		if _, ok := seen[k]; ok {
			return
		}
		seen[k] = struct{}{}
		out = append(out, r)
	}

	for i := 0; i < len(acc) && len(out) < minCheapest; i++ {
		add(acc[i])
	}

	lastBatch := trimmed[len(trimmed)-1]
	cheapestOutbound := trimmed[0][0]
	returnSeen := map[string]struct{}{}
	for _, ret := range lastBatch {
		if len(out) >= maxOut {
			break
		}
		rk := providerResultLegKey(ret)
		if rk == "" {
			continue
		}
		if _, ok := returnSeen[rk]; ok {
			continue
		}
		returnSeen[rk] = struct{}{}
		combined := mergeProviderLeg(cheapestOutbound, ret, 0, idPrefix)
		combined.ID = fmt.Sprintf("%s_div_%s", idPrefix, rk)
		add(combined)
	}
	// Ensure direct flights on the return batch appear when GF2 offers them.
	for _, ret := range lastBatch {
		if len(out) >= maxOut {
			break
		}
		if legStopCount(ret) > 0 {
			continue
		}
		combined := mergeProviderLeg(cheapestOutbound, ret, 0, idPrefix)
		combined.ID = fmt.Sprintf("%s_direct_%s", idPrefix, providerResultLegKey(ret))
		add(combined)
	}

	sort.Slice(out, func(i, j int) bool {
		return out[i].Price.Amount < out[j].Price.Amount
	})
	if len(out) > maxOut {
		out = out[:maxOut]
	}
	return out
}

func providerResultLegKey(r ProviderResult) string {
	var parts []string
	for _, leg := range r.Legs {
		for _, s := range leg.Segments {
			parts = append(parts, fmt.Sprintf("%s-%s-%s-%s",
				strings.ToUpper(strings.TrimSpace(s.From)),
				strings.ToUpper(strings.TrimSpace(s.To)),
				strings.ToUpper(strings.TrimSpace(s.MarketingCarrier)),
				strings.TrimSpace(s.FlightNumber),
			))
		}
	}
	return strings.Join(parts, "|")
}

func legStopCount(r ProviderResult) int {
	stops := 0
	for _, leg := range r.Legs {
		n := len(leg.Segments)
		if n > 1 {
			stops += n - 1
		}
	}
	return stops
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
	LegBookingTokens      []string // per-leg GF2 tokens after open-jaw OW combine (parallel to Legs)
	LegDeepLinks          []string // per-leg partner checkout URLs (parallel to Legs)
	LegPrices             []float64 // per-leg one-way fares (parallel to Legs)
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
