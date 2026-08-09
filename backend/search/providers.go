package search

import (
	"context"
	"time"
)

// SearchRequest holds parameters for a flight search.
type SearchRequest struct {
	Origin            string
	Destination       string
	DepartureDate     string
	ReturnDate        string
	CabinClass        string
	CabinPreference   string
	IncludeCheckedBag bool
	Adults            int
	Children          int
	Infants           int
	Currency          string
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
