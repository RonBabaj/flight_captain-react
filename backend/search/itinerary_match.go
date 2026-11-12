package search

import (
	"strings"
	"time"
)

const itineraryMatchTimeSlack = 90 * time.Minute

// ResultMatchesItinerary reports whether a GF2 search hit is the same physical trip as want,
// allowing small schedule drift on re-search. Exact fingerprint match always wins first.
//
// This is the bridge that lets OTA-scraped flights (Skyscanner/Kiwi/…) reuse the same
// booking_token → partner checkout pipeline as native GF2 rows.
func ResultMatchesItinerary(want CanonicalItinerary, result ProviderResult) bool {
	if strings.TrimSpace(result.ItineraryFingerprint) != "" &&
		strings.TrimSpace(result.ItineraryFingerprint) == CanonicalItineraryFingerprint(want) {
		return true
	}
	got := result.CanonicalItinerary
	if len(got.Segments) == 0 {
		got = BuildCanonicalItinerary(result)
	}
	wantSegs := want.Segments
	gotSegs := got.Segments
	if len(wantSegs) == 0 || len(wantSegs) != len(gotSegs) {
		return false
	}
	for i := range wantSegs {
		if !segmentsLooselyMatch(wantSegs[i], gotSegs[i]) {
			return false
		}
	}
	return true
}

func segmentsLooselyMatch(want, got CanonicalSegment) bool {
	if NormalizeAirportCode(want.From) != NormalizeAirportCode(got.From) {
		return false
	}
	if NormalizeAirportCode(want.To) != NormalizeAirportCode(got.To) {
		return false
	}
	wc, wf := segmentIdentityCarrier(want)
	gc, gf := segmentIdentityCarrier(got)
	// When both sides know flight identity, require the same designator.
	if wc != "" && gc != "" && wf != "" && gf != "" {
		if wc == gc && !flightNumbersEquivalent(wf, gf) {
			return false
		}
		// Different marketing carriers with flight numbers → different product.
		if wc != gc {
			return false
		}
	} else if wc != "" && gc != "" && wc != gc {
		// Carrier known on both sides but no flight numbers — still require same airline.
		return false
	}
	if !want.DepartureTime.IsZero() && !got.DepartureTime.IsZero() {
		if !departureTimesCompatible(want, got) {
			return false
		}
	}
	return true
}

// departureTimesCompatible compares departures using the origin airport's local
// calendar day (not UTC midnight), then allows itineraryMatchTimeSlack of drift.
func departureTimesCompatible(want, got CanonicalSegment) bool {
	loc := AirportLocation(want.From)
	wLocal := want.DepartureTime.In(loc)
	gLocal := got.DepartureTime.In(loc)
	if wLocal.Format("2006-01-02") != gLocal.Format("2006-01-02") {
		// Overnight / TZ edge: allow matching UTC calendar day as a fallback.
		if want.DepartureTime.UTC().Format("2006-01-02") != got.DepartureTime.UTC().Format("2006-01-02") {
			return false
		}
	}
	depDiff := want.DepartureTime.Sub(got.DepartureTime)
	if depDiff < -itineraryMatchTimeSlack || depDiff > itineraryMatchTimeSlack {
		return false
	}
	return true
}

func flightNumbersEquivalent(a, b string) bool {
	a = strings.ToUpper(strings.TrimSpace(a))
	b = strings.ToUpper(strings.TrimSpace(b))
	if a == b {
		return true
	}
	ac, an, aok := splitFlightDesignator(a)
	bc, bn, bok := splitFlightDesignator(b)
	if !aok || !bok || ac != bc {
		return false
	}
	return strings.TrimLeft(an, "0") == strings.TrimLeft(bn, "0")
}
