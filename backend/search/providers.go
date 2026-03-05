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

// ProviderResult is the normalized flight option shape returned by providers.
// Matches backend FlightOption for easy conversion.
type ProviderResult struct {
	ID                    string
	Price                 Monetary
	DurationMinutes       int
	Legs                  []Leg
	ValidatingAirlines    []string
	BaggageClass          string
	PrimaryDisplayCarrier string
	Source                string  // "amadeus" | "duffel" | "googleflights2"
	DeepLink              string  // booking URL if present
	VendorName            string  // kayak/expedia etc if present
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
