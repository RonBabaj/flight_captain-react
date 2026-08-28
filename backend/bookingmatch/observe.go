package bookingmatch

import (
	"encoding/json"
	"log"
	"time"
)

// MatchEvent is a structured observability record for the booking matcher pipeline.
type MatchEvent struct {
	Event                string `json:"event"`
	ItineraryFingerprint string `json:"itineraryFingerprint,omitempty"`
	Query                string `json:"query,omitempty"`
	CandidateURL         string `json:"candidateUrl,omitempty"`
	CandidateDomain      string `json:"candidateDomain,omitempty"`
	CandidatesFound      int    `json:"candidatesFound,omitempty"`
	CandidatesRejected   int    `json:"candidatesRejected,omitempty"`
	MatchScore           int    `json:"matchScore,omitempty"`
	VerificationStatus   string `json:"verificationStatus,omitempty"`
	RejectionReason      string `json:"rejectionReason,omitempty"`
	SelectedProvider     string `json:"selectedProvider,omitempty"`
	SelectedURLType      string `json:"selectedUrlType,omitempty"`
	DurationMs           int64  `json:"durationMs,omitempty"`
	FailureReason        string `json:"failureReason,omitempty"`
}

func logMatchEvent(ev MatchEvent) {
	b, err := json.Marshal(ev)
	if err != nil {
		log.Printf("[BOOKING_MATCH] event=%s fp=%s", ev.Event, ev.ItineraryFingerprint)
		return
	}
	log.Printf("[BOOKING_MATCH] %s", string(b))
}

func elapsedMs(start time.Time) int64 {
	return time.Since(start).Milliseconds()
}
