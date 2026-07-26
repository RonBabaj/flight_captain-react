// Package hotels defines the hotel provider abstraction and normalized models
// used by Fly-Fix. Providers (RateHawk today, others later) implement HotelProvider
// and must not leak credentials or raw provider payloads to API clients.
package hotels

import (
	"context"
	"time"
)

// PriceStatus distinguishes how trustworthy a hotel price is.
// estimated  – derived from SERP cheapest rate (not hotelpage-verified)
// live       – retrieved via hotelpage / live availability
// confirmed  – verified through prebook/booking flow
type PriceStatus string

const (
	PriceEstimated PriceStatus = "estimated"
	PriceLive      PriceStatus = "live"
	PriceConfirmed PriceStatus = "confirmed"
)

// Monetary is currency + amount.
type Monetary struct {
	Currency string  `json:"currency"`
	Amount   float64 `json:"amount"`
}

// GeoPoint is an optional lat/lon.
type GeoPoint struct {
	Latitude  float64 `json:"latitude"`
	Longitude float64 `json:"longitude"`
}

// HotelSearchRequest is the provider-agnostic search input.
type HotelSearchRequest struct {
	// Destination resolution — exactly one of RegionID, Geo, or DestinationQuery should be set.
	RegionID         int
	DestinationQuery string // free-text; provider may resolve via suggest
	Latitude         *float64
	Longitude        *float64
	RadiusKm         int

	CheckIn  string // YYYY-MM-DD
	CheckOut string // YYYY-MM-DD

	Adults   int
	Children []int // ages; empty = no children
	Rooms    int   // number of rooms (each room gets Adults guests by default)

	Currency  string
	Language  string
	Residency string // ISO 3166-1 alpha-2

	// Optional filters
	MinStarRating     int
	MaxStarRating     int
	MinGuestRating    float64
	MinPrice          *float64
	MaxPrice          *float64
	FreeCancellation  bool
	BreakfastIncluded bool
	PropertyTypes     []string // e.g. Hotel, Apartment
	HotelsLimit       int
}

// HotelOffer is the normalized hotel + rate shape returned to the rest of Fly-Fix.
type HotelOffer struct {
	HotelID                string            `json:"hotelId"`
	Provider               string            `json:"provider"`
	ProviderHID            int64             `json:"providerHid,omitempty"`
	Name                   string            `json:"name"`
	Destination            string            `json:"destination,omitempty"`
	Country                string            `json:"country,omitempty"`
	Address                string            `json:"address,omitempty"`
	Location               *GeoPoint         `json:"location,omitempty"`
	StarRating             float64           `json:"starRating,omitempty"`
	GuestRating            float64           `json:"guestRating,omitempty"`
	ReviewCount            int               `json:"reviewCount,omitempty"`
	RoomType               string            `json:"roomType,omitempty"`
	BoardType              string            `json:"boardType,omitempty"`
	HasBreakfast           bool              `json:"hasBreakfast,omitempty"`
	CheckIn                string            `json:"checkIn"`
	CheckOut               string            `json:"checkOut"`
	Nights                 int               `json:"nights"`
	TotalPrice             Monetary          `json:"totalPrice"`
	PricePerNight          Monetary          `json:"pricePerNight"`
	Currency               string            `json:"currency"`
	CancellationPolicy     string            `json:"cancellationPolicy,omitempty"`
	Refundable             bool              `json:"refundable"`
	FreeCancellationBefore string            `json:"freeCancellationBefore,omitempty"`
	RoomAvailability       int               `json:"roomAvailability,omitempty"`
	Photos                 []string          `json:"photos,omitempty"`
	Amenities              []string          `json:"amenities,omitempty"`
	DeepLink               string            `json:"deepLink,omitempty"`
	PriceStatus            PriceStatus       `json:"priceStatus"`
	SearchHash             string            `json:"-"` // provider-internal; not exposed
	MatchHash              string            `json:"-"`
	BookHash               string            `json:"-"`
	Metadata               map[string]string `json:"-"` // provider-specific extras kept internally
}

// HotelEstimate is a lightweight destination-level price estimate (not a specific booking).
type HotelEstimate struct {
	Destination   string      `json:"destination"`
	CheckIn       string      `json:"checkIn"`
	CheckOut      string      `json:"checkOut"`
	Nights        int         `json:"nights"`
	Rooms         int         `json:"rooms"`
	Guests        int         `json:"guests"`
	TotalPrice    *Monetary   `json:"totalPrice,omitempty"`
	PricePerNight *Monetary   `json:"pricePerNight,omitempty"`
	Currency      string      `json:"currency"`
	PriceStatus   PriceStatus `json:"priceStatus"`
	SampleHotelID string      `json:"sampleHotelId,omitempty"`
	SampleName    string      `json:"sampleName,omitempty"`
	HotelCount    int         `json:"hotelCount,omitempty"`
	Available     bool        `json:"available"`
	Message       string      `json:"message,omitempty"`
	Provider      string      `json:"provider,omitempty"`
	Cached        bool        `json:"cached,omitempty"`
}

// DestinationSuggestion is an autocomplete hit for hotel destinations.
type DestinationSuggestion struct {
	ID          string `json:"id"`
	Name        string `json:"name"`
	Type        string `json:"type"` // city | region | hotel | airport | ...
	CountryCode string `json:"countryCode,omitempty"`
	RegionID    int    `json:"regionId,omitempty"`
	HotelID     string `json:"hotelId,omitempty"`
	ProviderHID int64  `json:"providerHid,omitempty"`
}

// TripDeal combines a flight price with a hotel estimate/offer.
type TripDeal struct {
	ID               string         `json:"id"`
	Label            string         `json:"label,omitempty"`
	Destination      string         `json:"destination"`
	CheckIn          string         `json:"checkIn,omitempty"`
	CheckOut         string         `json:"checkOut,omitempty"`
	FlightOptionID   string         `json:"flightOptionId,omitempty"`
	FlightPrice      Monetary       `json:"flightPrice"`
	HotelEstimate    *HotelEstimate `json:"hotelEstimate,omitempty"`
	HotelOffer       *HotelOffer    `json:"hotelOffer,omitempty"`
	HotelPrice       *Monetary      `json:"hotelPrice,omitempty"`
	EstimatedTotal   *Monetary      `json:"estimatedTotal,omitempty"`
	LiveTotal        *Monetary      `json:"liveTotal,omitempty"`
	TotalPriceStatus PriceStatus    `json:"totalPriceStatus"`
	Currency         string         `json:"currency"`
	Providers        []string       `json:"providers,omitempty"`
	Message          string         `json:"message,omitempty"`
}

// StayDates describes a single contiguous hotel stay derived from a flight itinerary.
type StayDates struct {
	Destination string
	CheckIn     string
	CheckOut    string
	Eligible    bool
	Reason      string // set when Eligible is false
}

// HotelProvider is the abstraction every hotel supplier must implement.
type HotelProvider interface {
	Name() string
	SuggestDestinations(ctx context.Context, query, language string) ([]DestinationSuggestion, error)
	Search(ctx context.Context, req HotelSearchRequest) ([]HotelOffer, error)
	HotelDetails(ctx context.Context, hotelID string, hid int64, req HotelSearchRequest) (*HotelOffer, []HotelOffer, error)
	Estimate(ctx context.Context, req HotelSearchRequest) (*HotelEstimate, error)
}

// NightsBetween returns the number of nights between check-in and check-out (YYYY-MM-DD).
func NightsBetween(checkIn, checkOut string) int {
	in, err1 := time.Parse("2006-01-02", checkIn)
	out, err2 := time.Parse("2006-01-02", checkOut)
	if err1 != nil || err2 != nil {
		return 0
	}
	n := int(out.Sub(in).Hours() / 24)
	if n < 0 {
		return 0
	}
	return n
}
