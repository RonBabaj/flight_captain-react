package main

import (
	"crypto/sha256"
	"encoding/hex"
	"fmt"
	"net/url"
	"os"
	"sort"
	"strings"
	"time"
)

// BOOKING_LINK_MODE: "skyscanner_prefill" | "google_prefill" | "direct_provider"
// - direct_provider: use option.DeepLink when set, else prefill
// - skyscanner_prefill: default; Skyscanner URL with route/dates from the clicked option
// - google_prefill: Google Flights prefill (legacy)
const (
	BookingModeDirectProvider    = "direct_provider"
	BookingModeGooglePrefill     = "google_prefill"
	BookingModeSkyscannerPrefill = "skyscanner_prefill"
)

func normalizeProviderBookingURL(raw string) string {
	u := strings.TrimSpace(raw)
	if strings.HasPrefix(u, "https://") {
		return u
	}
	return ""
}

// BuildUniformBookingLink returns a URL the user can use to book. Never returns empty if session/option are valid.
// The URL is always populated from the selected option (route + dates) so it correlates to the flight the user clicked.
func BuildUniformBookingLink(session *SearchSession, option *FlightOption) string {
	mode := strings.TrimSpace(strings.ToLower(os.Getenv("BOOKING_LINK_MODE")))
	if mode == "" {
		mode = BookingModeSkyscannerPrefill
	}

	// Preferred: provider deep link when valid (e.g. Duffel, OTA)
	if option != nil {
		providerURL := normalizeProviderBookingURL(option.BookingURL)
		if providerURL == "" {
			providerURL = normalizeProviderBookingURL(option.DeepLink)
		}
		if providerURL != "" {
			if mode == BookingModeDirectProvider {
				return providerURL
			}
			return providerURL
		}
	}

	// Fallback: prefilled search URL populated from the clicked option so the link matches that flight
	origin := ""
	dest := ""
	dep := ""
	ret := ""
	if session != nil {
		origin = strings.ToUpper(session.Params.Origin)
		dest = strings.ToUpper(session.Params.Destination)
		dep = session.Params.DepartureDate
		ret = session.Params.ReturnDate
	}
	// Always prefer the selected option's route and dates so Skyscanner opens with that flight's itinerary
	if option != nil && len(option.Legs) > 0 {
		if len(option.Legs[0].Segments) > 0 {
			origin = option.Legs[0].Segments[0].From.Code
			dest = option.Legs[0].Segments[len(option.Legs[0].Segments)-1].To.Code
			depAt := option.Legs[0].Segments[0].DepartureTime
			if !depAt.IsZero() {
				dep = depAt.Format("2006-01-02")
			}
		}
		if len(option.Legs) > 1 && len(option.Legs[1].Segments) > 0 {
			lastSeg := option.Legs[1].Segments[len(option.Legs[1].Segments)-1]
			arrAt := lastSeg.ArrivalTime
			if !arrAt.IsZero() {
				ret = arrAt.Format("2006-01-02")
			}
		}
	}
	if dep == "" && session != nil {
		dep = session.Params.DepartureDate
	}

	switch mode {
	case BookingModeGooglePrefill:
		u := buildGoogleFlightsPrefillURL(origin, dest, dep, ret)
		if u == "" {
			u = "https://www.google.com/travel/flights?q=Flights"
		}
		return u
	default:
		// Skyscanner: prefill with this option's route and dates. When provider DeepLink exists we use it above (specific offer).
		// Skyscanner has no public URL for a single flight, so we open a search for that route/dates so the user's flight is in the results.
		cabin := ""
		adults := 1
		if session != nil {
			cabin = session.Params.CabinClass
			if session.Params.Adults > 0 {
				adults = session.Params.Adults
			}
		}
		return buildSkyscannerPrefillURL(origin, dest, dep, ret, cabin, adults)
	}
}

func buildGoogleFlightsPrefillURL(origin, dest, dep, ret string) string {
	// Google Flights: q=Flights to DEST from ORIGIN, or use structured params
	q := fmt.Sprintf("Flights to %s from %s", dest, origin)
	if dep != "" {
		q += " " + dep
	}
	if ret != "" {
		q += " " + ret
	}
	return "https://www.google.com/travel/flights?q=" + url.QueryEscape(q)
}

func buildSkyscannerPrefillURL(origin, dest, dep, ret, cabin string, adults int) string {
	// Skyscanner: route and dates from the clicked option. Query params narrow the search (cabin, adults).
	// Format: /transport/flights/{origin}/{dest}/{outboundYYMMDD}/{inboundYYMMDD}/?cabinclass=economy&adultsv2=1
	origin = strings.ToLower(strings.TrimSpace(origin))
	dest = strings.ToLower(strings.TrimSpace(dest))
	if origin == "" {
		origin = "any"
	}
	if dest == "" {
		dest = "any"
	}
	outbound := depToYYMMDD(dep)
	inbound := depToYYMMDD(ret)
	if outbound == "" {
		outbound = "any"
	}
	if inbound == "" {
		inbound = outbound // one-way: same date or "any"
	}
	u := fmt.Sprintf("https://www.skyscanner.net/transport/flights/%s/%s/%s/%s/", origin, dest, outbound, inbound)
	params := url.Values{}
	if cabin != "" {
		params.Set("cabinclass", strings.ToLower(cabin))
	}
	if adults >= 1 {
		params.Set("adultsv2", fmt.Sprintf("%d", adults))
	}
	if len(params) > 0 {
		u += "?" + params.Encode()
	}
	return u
}

// depToYYMMDD converts YYYY-MM-DD to YYMMDD for Skyscanner URL.
func depToYYMMDD(iso string) string {
	iso = strings.TrimSpace(iso)
	if len(iso) < 10 {
		return ""
	}
	// 2025-03-06 -> 250306
	return iso[2:4] + iso[5:7] + iso[8:10]
}

// BuildSkyscannerFallbackFromParams builds a Skyscanner search URL from query params (e.g. when session/option not found).
// Used so the user always gets a redirect instead of JSON error.
func BuildSkyscannerFallbackFromParams(origin, destination, departureDate, returnDate string) string {
	return buildSkyscannerPrefillURL(origin, destination, departureDate, returnDate, "", 1)
}

// CanonicalFingerprint returns a stable hash for dedupe: origin, dest, departAt, arriveAt, carrierCodes, flightNumbers, stopsCount, totalDuration. Does not include price so same flight from different providers dedupes to cheapest.
func CanonicalFingerprint(option *FlightOption) string {
	if option == nil || len(option.Legs) == 0 {
		return ""
	}
	var parts []string
	for _, leg := range option.Legs {
		if len(leg.Segments) == 0 {
			continue
		}
		first := leg.Segments[0]
		last := leg.Segments[len(leg.Segments)-1]
		parts = append(parts, first.From.Code, last.To.Code)
		parts = append(parts, first.DepartureTime.Format(time.RFC3339), last.ArrivalTime.Format(time.RFC3339))
		var carriers, numbers []string
		stops := len(leg.Segments) - 1
		parts = append(parts, fmt.Sprintf("%d", stops))
		for _, s := range leg.Segments {
			carriers = append(carriers, s.MarketingCarrier.Code)
			numbers = append(numbers, s.FlightNumber)
		}
		sort.Strings(carriers)
		sort.Strings(numbers)
		parts = append(parts, strings.Join(carriers, ","), strings.Join(numbers, ","))
	}
	parts = append(parts, fmt.Sprintf("%d", option.DurationMinutes))
	h := sha256.Sum256([]byte(strings.Join(parts, "|")))
	return hex.EncodeToString(h[:16])
}

// roundTimeToMinutes rounds t to the nearest 5-minute bucket (e.g. for fingerprint tolerance).
func roundTimeToMinutes(t time.Time, bucketMin int) time.Time {
	if bucketMin <= 0 {
		return t
	}
	unix := t.Unix()
	bucketSec := int64(bucketMin * 60)
	rounded := (unix / bucketSec) * bucketSec
	return time.Unix(rounded, 0).UTC()
}

// CodeshareFingerprint returns a stable hash for the *operated* flight: uses operating carrier and operating flight number when present, else marketing. Same physical flight (e.g. AZ operated, sold as AZ/LY/AF) gets the same fingerprint. Times rounded to 5 min for tolerance.
func CodeshareFingerprint(option *FlightOption) string {
	if option == nil || len(option.Legs) == 0 {
		return ""
	}
	const timeBucketMin = 5
	var parts []string
	for _, leg := range option.Legs {
		if len(leg.Segments) == 0 {
			continue
		}
		first := leg.Segments[0]
		last := leg.Segments[len(leg.Segments)-1]
		parts = append(parts, strings.ToUpper(first.From.Code), strings.ToUpper(last.To.Code))
		depRounded := roundTimeToMinutes(first.DepartureTime, timeBucketMin)
		arrRounded := roundTimeToMinutes(last.ArrivalTime, timeBucketMin)
		parts = append(parts, depRounded.Format(time.RFC3339), arrRounded.Format(time.RFC3339))
		stops := len(leg.Segments) - 1
		parts = append(parts, fmt.Sprintf("%d", stops))
		var carriers, numbers []string
		for _, s := range leg.Segments {
			carrier := s.MarketingCarrier.Code
			num := s.FlightNumber
			if s.OperatingCarrier != nil && s.OperatingCarrier.Code != "" {
				carrier = s.OperatingCarrier.Code
				if s.OperatingFlightNum != "" {
					num = s.OperatingFlightNum
				}
			}
			carriers = append(carriers, strings.ToUpper(carrier))
			numbers = append(numbers, num)
		}
		sort.Strings(carriers)
		sort.Strings(numbers)
		parts = append(parts, strings.Join(carriers, ","), strings.Join(numbers, ","))
	}
	parts = append(parts, fmt.Sprintf("%d", option.DurationMinutes))
	h := sha256.Sum256([]byte(strings.Join(parts, "|")))
	return hex.EncodeToString(h[:16])
}
