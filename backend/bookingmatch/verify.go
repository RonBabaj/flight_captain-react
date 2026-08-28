package bookingmatch

import (
	"fmt"
	"strings"
	"time"

	"flightcaptainweb/search"
)

// VerifyCandidate scores a search candidate against a canonical itinerary.
func VerifyCandidate(it search.CanonicalItinerary, c SearchCandidate, cfg Config) BookingOffer {
	now := time.Now().UTC()
	fp := search.CanonicalItineraryFingerprint(it)
	rawText := strings.Join([]string{c.Title, c.Snippet, c.PageText}, " ")

	offer := BookingOffer{
		Provider:             c.Domain,
		Domain:               domainFromURL(c.URL),
		URL:                  c.URL,
		URLType:              classifyURLType(c.URL),
		ItineraryFingerprint: fp,
		CheckedAt:            now,
		Title:                c.Title,
		Snippet:              c.Snippet,
	}

	if amount, cur, ok := extractPrice(rawText); ok {
		offer.Price = &amount
		offer.Currency = cur
	}

	segs := it.Segments
	if len(segs) == 0 {
		offer.VerificationStatus = StatusRejected
		offer.RejectionReason = "empty itinerary"
		return offer
	}

	allFlightNumbersFound := true
	total := 0
	segMax := 90 / len(segs)

	for _, seg := range segs {
		_, fn := segmentIdentity(seg)
		segScore := 0

		if fn != "" {
			if flightNumberInText(rawText, fn) {
				segScore += segMax * 35 / 100
			} else {
				allFlightNumbersFound = false
			}
		}
		if textContainsAirport(rawText, seg.From) {
			segScore += segMax * 15 / 100
		}
		if textContainsAirport(rawText, seg.To) {
			segScore += segMax * 15 / 100
		}
		if textContainsAny(rawText, segmentDateVariants(seg)) {
			segScore += segMax * 15 / 100
		}
		if timeMatches(rawText, seg, true) {
			segScore += segMax * 10 / 100
		}
		if timeMatches(rawText, seg, false) {
			segScore += segMax * 10 / 100
		}
		total += segScore
	}

	if len(segs) > 1 && segmentOrderMatches(rawText, segs) {
		total += 10
	}
	if total > 100 {
		total = 100
	}
	offer.MatchScore = total

	threshold := cfg.VerifyThreshold
	if threshold <= 0 {
		threshold = 85
	}

	switch {
	case !allFlightNumbersFound:
		offer.VerificationStatus = StatusPartial
		offer.RejectionReason = "flight number not established in candidate text"
	case total >= threshold && allFlightNumbersFound:
		offer.VerificationStatus = StatusVerifiedExact
	default:
		offer.VerificationStatus = StatusPartial
		offer.RejectionReason = fmt.Sprintf("score %d below verify threshold %d", total, threshold)
	}

	return offer
}

// segmentOrderMatches checks flight numbers appear in itinerary order in text.
func segmentOrderMatches(text string, segs []search.CanonicalSegment) bool {
	var nums []string
	for _, seg := range segs {
		_, fn := segmentIdentity(seg)
		if fn != "" {
			nums = append(nums, fn)
		}
	}
	if len(nums) < 2 {
		return true
	}
	upper := strings.ToUpper(text)
	lastIdx := -1
	for _, fn := range nums {
		idx := strings.Index(upper, fn)
		if idx < 0 && len(fn) >= 3 {
			spaced := fn[:2] + " " + strings.TrimLeft(fn[2:], "0")
			idx = strings.Index(upper, spaced)
		}
		if idx < 0 || idx <= lastIdx {
			return false
		}
		lastIdx = idx
	}
	return true
}
