package bookingmatch

import (
	"fmt"
	"strings"
	"time"

	"flightcaptainweb/search"
)

type segmentCheck struct {
	score             int
	flightNumOK       bool
	dateOK            bool
	fromOK            bool
	toOK              bool
	depTimeOK         bool
	arrTimeOK         bool
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
	if routeDateTimeVerified(checks, segs) {
		total += 15
	}
	if total > 100 {
		total = 100
	}
	offer.MatchScore = total

	threshold := cfg.VerifyThreshold
	if threshold <= 0 {
		threshold = 70
	}

	reason := verifyExactEligibility(checks, segs, total, threshold, offer.URLType, rawText)
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

	if fn != "" {
		if flightNumberInText(rawText, fn) {
			chk.flightNumOK = true
			chk.score += segMax * 50 / 100
		} else if opFn := operatingFlightForMatch(seg); opFn != "" && flightNumberInText(rawText, opFn) {
			chk.flightNumOK = true
			chk.score += segMax * 45 / 100
		}
	}

	if chk.fromOK = textContainsAirport(rawText, seg.From); chk.fromOK {
		chk.score += segMax * 15 / 100
	}
	if chk.toOK = textContainsAirport(rawText, seg.To); chk.toOK {
		chk.score += segMax * 15 / 100
	}

	if chk.dateOK = textContainsAny(rawText, segmentDateVariants(seg)); chk.dateOK {
		chk.score += segMax * 15 / 100
	}

	if chk.depTimeOK = timeMatches(rawText, seg, true); chk.depTimeOK {
		chk.score += segMax * 5 / 100
	}
	if chk.arrTimeOK = timeMatches(rawText, seg, false); chk.arrTimeOK {
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

func routeDateTimeVerified(checks []segmentCheck, segs []search.CanonicalSegment) bool {
	for i, chk := range checks {
		if !chk.fromOK || !chk.toOK || !chk.dateOK {
			return false
		}
		if !segs[i].DepartureTime.IsZero() && !chk.depTimeOK {
			return false
		}
	}
	return true
}

// legEndToEndVerified accepts OTA snippets that describe the whole bookable leg (origin→destination)
// with outbound date and end times, without requiring every connection segment's departure time.
func legEndToEndVerified(checks []segmentCheck, segs []search.CanonicalSegment, rawText string) bool {
	if len(segs) == 0 || len(checks) != len(segs) {
		return false
	}
	first := checks[0]
	last := checks[len(checks)-1]
	if !first.fromOK || !last.toOK || !first.dateOK {
		return false
	}
	if !segs[0].DepartureTime.IsZero() && !first.depTimeOK {
		return false
	}
	if !segs[len(segs)-1].ArrivalTime.IsZero() && !last.arrTimeOK {
		return false
	}
	if len(segs) == 1 {
		return true
	}
	for _, chk := range checks {
		if chk.flightNumOK {
			return true
		}
	}
	return len(extractFlightNumbers(strings.ToUpper(rawText))) == 0
}

// verifyExactEligibility returns "" when the candidate qualifies as verified exact.
func verifyExactEligibility(checks []segmentCheck, segs []search.CanonicalSegment, total, threshold int, urlType URLType, rawText string) string {
	if urlType == URLTypeGenericSearch {
		return "generic search page cannot be an exact-flight booking"
	}
	for i, chk := range checks {
		if !chk.dateOK && !segs[i].DepartureTime.IsZero() {
			// OTA snippets usually cite the outbound date only; skip connection-segment date checks.
			if len(segs) > 1 && i > 0 {
				continue
			}
			return "departure date not established in candidate text"
		}
	}

	// OTA pages often omit flight numbers but include route, date, and times.
	if legEndToEndVerified(checks, segs, rawText) && !conflictingFlightNumberInText(rawText, segs) {
		return ""
	}
	if routeDateTimeVerified(checks, segs) && !conflictingFlightNumberInText(rawText, segs) {
		return ""
	}

	for _, chk := range checks {
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

// conflictingFlightNumberInText returns true when snippet mentions a flight number that is not equivalent to any itinerary segment.
func conflictingFlightNumberInText(rawText string, segs []search.CanonicalSegment) bool {
	found := extractFlightNumbers(strings.ToUpper(rawText))
	if len(found) == 0 {
		return false
	}
	want := map[string]struct{}{}
	for _, seg := range segs {
		_, fn := segmentIdentity(seg)
		if fn != "" {
			want[fn] = struct{}{}
		}
		if op := operatingFlightForMatch(seg); op != "" {
			want[op] = struct{}{}
		}
	}
	for _, f := range found {
		matched := false
		for w := range want {
			if flightNumbersEquivalent(w, f) {
				matched = true
				break
			}
		}
		if matched {
			continue
		}
		// Ignore unrelated carriers (ads); conflict only when same carrier, different flight number.
		fc, _, ok := splitFlightDesignator(f)
		if !ok {
			continue
		}
		for _, seg := range segs {
			carrier, _ := segmentIdentity(seg)
			if carrier == fc {
				return true
			}
		}
	}
	return false
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
