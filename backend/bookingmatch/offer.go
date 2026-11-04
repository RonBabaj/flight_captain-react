package bookingmatch

import (
	"time"

	"flightcaptainweb/search"
)

// URLType classifies how specific a booking URL is.
type URLType string

const (
	URLTypeExactBooking URLType = "exact_booking_deeplink"
	URLTypeExactSearch  URLType = "exact_search_result"
	URLTypeGenericSearch URLType = "generic_search_page"
)

// VerificationStatus indicates whether a candidate was verified against the itinerary.
type VerificationStatus string

const (
	StatusVerifiedExact VerificationStatus = "verified_exact"
	StatusPartial       VerificationStatus = "partial"
	StatusRejected      VerificationStatus = "rejected"
)

// BookingOffer is a normalized, scored booking page offer for an itinerary.
type BookingOffer struct {
	Provider             string             `json:"provider"`
	Domain               string             `json:"domain"`
	URL                  string             `json:"url"`
	URLType              URLType            `json:"urlType"`
	Price                *float64           `json:"price,omitempty"`
	Currency             string             `json:"currency,omitempty"`
	ItineraryFingerprint string             `json:"itineraryFingerprint"`
	MatchScore           int                `json:"matchScore"`
	VerificationStatus   VerificationStatus `json:"verificationStatus"`
	CheckedAt            time.Time          `json:"checkedAt"`
	Title                string             `json:"title,omitempty"`
	Snippet              string             `json:"snippet,omitempty"`
	RejectionReason      string             `json:"rejectionReason,omitempty"`
}

// MatchResult is the output of the booking matcher pipeline.
type MatchResult struct {
	Itinerary            search.CanonicalItinerary `json:"itinerary"`
	ItineraryFingerprint string                    `json:"itineraryFingerprint"`
	Queries              []string                  `json:"queries"`
	CandidatesConsidered int                       `json:"candidatesConsidered"`
	Offers               []BookingOffer            `json:"offers"`
	BestOffer            *BookingOffer             `json:"bestOffer,omitempty"`
	Log                  []string                  `json:"log,omitempty"`
}
