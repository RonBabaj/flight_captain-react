package bookingmatch

import (
	"fmt"
	"strings"
	"time"

	"flightcaptainweb/search"
)

type segmentCheck struct {
	score         int
	flightNumOK   bool
	dateOK        bool
	fromOK        bool
	toOK          bool
	requiresFlightNum bool
}

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

	if err := ValidateBookingURL(c.URL); err != nil {
		offer.VerificationStatus = StatusRejected
		offer.RejectionReason = "unsafe or malformed URL"
		return offer
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

	segMax := 90 / len(segs)
	if segMax < 1 {
		segMax = 1
	}

	var checks []segmentCheck
	total := 0
	for _, seg := range segs {
		chk := scoreSegment(seg, rawText, segMax)
		checks = append(checks, chk)
		total += chk.score
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

	reason := verifyExactEligibility(checks, segs, total, threshold, offer.URLType)
	switch reason {
	case "":
		offer.VerificationStatus = StatusVerifiedExact
	case "partial":
		offer.VerificationStatus = StatusPartial
		if offer.RejectionReason == "" {
			offer.RejectionReason = fmt.Sprintf("score %d below verify threshold %d", total, threshold)
		}
	default:
		offer.VerificationStatus = StatusPartial
		offer.RejectionReason = reason
	}

	return offer
}

func scoreSegment(seg search.CanonicalSegment, rawText string, segMax int) segmentCheck {
	_, fn := segmentIdentity(seg)
	chk := segmentCheck{requiresFlightNum: fn != ""}

	// Flight number — heavily weighted (50% of segment score).
	if fn != "" {
		if flightNumberInText(rawText, fn) {
			chk.flightNumOK = true
			chk.score += segMax * 50 / 100
		} else if opFn := operatingFlightForMatch(seg); opFn != "" && flightNumberInText(rawText, opFn) {
			chk.flightNumOK = true
			chk.score += segMax * 45 / 100
		}
	}

	// Airports (15% each).
	if chk.fromOK = textContainsAirport(rawText, seg.From); chk.fromOK {
		chk.score += segMax * 15 / 100
	}
	if chk.toOK = textContainsAirport(rawText, seg.To); chk.toOK {
		chk.score += segMax * 15 / 100
	}

	// Date — mandatory for exact match (15%).
	if chk.dateOK = textContainsAny(rawText, segmentDateVariants(seg)); chk.dateOK {
		chk.score += segMax * 15 / 100
	}

	// Departure / arrival times (5% each).
	if timeMatches(rawText, seg, true) {
		chk.score += segMax * 5 / 100
	}
	if timeMatches(rawText, seg, false) {
		chk.score += segMax * 5 / 100
	}

	return chk
}

func operatingFlightForMatch(seg search.CanonicalSegment) string {
	op := search.NormalizeCarrierCode(seg.OperatingCarrier)
	mkt := search.NormalizeCarrierCode(seg.MarketingCarrier)
	if op == "" || op == mkt {
		return ""
	}
	if seg.OperatingFlightNumber != "" {
		return search.NormalizeFlightNumber(op, seg.OperatingFlightNumber)
	}
	return search.NormalizeFlightNumber(op, seg.FlightNumber)
}

// verifyExactEligibility returns "" when the candidate qualifies as verified exact.
func verifyExactEligibility(checks []segmentCheck, segs []search.CanonicalSegment, total, threshold int, urlType URLType) string {
	if urlType == URLTypeGenericSearch {
		return "generic search page cannot be an exact-flight booking"
	}
	for i, chk := range checks {
		if !chk.dateOK && !segs[i].DepartureTime.IsZero() {
			return "departure date not established in candidate text"
		}
		if chk.requiresFlightNum && !chk.flightNumOK {
			return "flight number not established in candidate text"
		}
		if !chk.requiresFlightNum {
			if !chk.fromOK || !chk.toOK {
				return "route not established for segment without flight number"
			}
			if !chk.dateOK {
				return "date required when flight number is missing"
			}
		}
	}
	if total < threshold {
		return "partial"
	}
	return ""
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
