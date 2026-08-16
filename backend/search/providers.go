package search

import (
	"context"
	"strings"
	"time"
)

// SearchRequest holds parameters for a flight search.
type SearchRequest struct {
	Origin            string
	Destination       string
	DepartureDate     string
	ReturnDate        string
	// ReturnOrigin / ReturnDestination enable open-jaw (dynamic destination) round-trips:
	// outbound Origin→Destination, return ReturnOrigin→ReturnDestination.
	// Empty values default to classic RT (Destination→Origin).
	ReturnOrigin      string
	ReturnDestination string
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
	VendorName            string // kayak/expedia/kiwi etc if present
	FareConditions        string
	SelfTransfer          bool                   // separate tickets / virtual interlining
	FetchedAt             time.Time              // data freshness
	Metadata              map[string]interface{} // provider-specific extras (never secrets)
}

// Leg represents one direction (outbound or return).
type Leg struct {
	Segments []Segment
}

// Segment represents a single flight segment.
type Segment struct {
	From             string
	To               string
	DepartureTime    time.Time
	ArrivalTime      time.Time
	MarketingCarrier string
	FlightNumber     string
	DurationMinutes  int
	CabinClass       string
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
