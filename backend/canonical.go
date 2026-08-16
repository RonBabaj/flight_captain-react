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

// BOOKING_LINK_MODE: "google_prefill" | "skyscanner_prefill" | "direct_provider"
// - direct_provider: use option deep link / partner URL when set, else Google Flights prefill
// - google_prefill: default; Google Flights search prefilled with the clicked route/dates
// - skyscanner_prefill: Skyscanner search prefilled with route/dates (legacy fallback)
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

func bookingLinkMode() string {
	mode := strings.TrimSpace(strings.ToLower(os.Getenv("BOOKING_LINK_MODE")))
	switch mode {
	case BookingModeDirectProvider, BookingModeGooglePrefill, BookingModeSkyscannerPrefill:
		return mode
	case "skyscanner", "sky":
		return BookingModeSkyscannerPrefill
	case "direct", "provider":
		return BookingModeDirectProvider
	case "google", "":
		return BookingModeGooglePrefill
	default:
		return BookingModeGooglePrefill
	}
}

// BuildUniformBookingLink returns a URL the user can use to book. Never returns empty if session/option are valid.
// Prefer an already-resolved partner/deep link on the option; otherwise prefill Google Flights (default) or Skyscanner.
// Partner checkout resolution (GF2 booking_token → getBookingURL) happens in resolveBookingRedirectURL on Book click.
func BuildUniformBookingLink(session *SearchSession, option *FlightOption) string {
	mode := bookingLinkMode()

	if option != nil {
		providerURL := normalizeProviderBookingURL(option.BookingURL)
		if providerURL == "" {
			providerURL = normalizeProviderBookingURL(option.DeepLink)
		}
		if providerURL != "" {
			return providerURL
		}
	}

	origin, dest, dep, ret := bookingRouteFromSessionOption(session, option)

	switch mode {
	case BookingModeSkyscannerPrefill:
		cabin := ""
		adults := 1
		if session != nil {
			cabin = session.Params.CabinClass
			if session.Params.Adults > 0 {
				adults = session.Params.Adults
			}
		}
		return buildSkyscannerPrefillURL(origin, dest, dep, ret, cabin, adults)
	default:
		u := buildGoogleFlightsPrefillURL(origin, dest, dep, ret)
		if u == "" {
			u = "https://www.google.com/travel/flights"
		}
		return u
	}
}

func bookingRouteFromSessionOption(session *SearchSession, option *FlightOption) (origin, dest, dep, ret string) {
	if session != nil {
		origin = strings.ToUpper(session.Params.Origin)
		dest = strings.ToUpper(session.Params.Destination)
		dep = session.Params.DepartureDate
		ret = session.Params.ReturnDate
	}
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
			firstRet := option.Legs[1].Segments[0]
			if !firstRet.DepartureTime.IsZero() {
				ret = firstRet.DepartureTime.Format("2006-01-02")
			} else {
				lastSeg := option.Legs[1].Segments[len(option.Legs[1].Segments)-1]
				if !lastSeg.ArrivalTime.IsZero() {
					ret = lastSeg.ArrivalTime.Format("2006-01-02")
				}
			}
		}
	}
	if dep == "" && session != nil {
		dep = session.Params.DepartureDate
	}
	return origin, dest, dep, ret
}

func buildGoogleFlightsPrefillURL(origin, dest, dep, ret string) string {
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
		inbound = outbound
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
	return iso[2:4] + iso[5:7] + iso[8:10]
}

// BuildSkyscannerFallbackFromParams builds a Skyscanner search URL from query params.
func BuildSkyscannerFallbackFromParams(origin, destination, departureDate, returnDate string) string {
	return buildSkyscannerPrefillURL(origin, destination, departureDate, returnDate, "", 1)
}

// BuildGoogleFlightsFallbackFromParams builds a Google Flights search URL from query params.
func BuildGoogleFlightsFallbackFromParams(origin, destination, departureDate, returnDate string) string {
	u := buildGoogleFlightsPrefillURL(origin, destination, departureDate, returnDate)
	if u == "" {
		return "https://www.google.com/travel/flights"
	}
	return u
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
