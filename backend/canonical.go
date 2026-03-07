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
// - direct_provider: use option.DeepLink when set, else prefill
// - google_prefill: prefer DeepLink if set, else Google Flights prefill
// - skyscanner_prefill: stub; returns Skyscanner-style URL when enabled
const (
	BookingModeDirectProvider   = "direct_provider"
	BookingModeGooglePrefill   = "google_prefill"
	BookingModeSkyscannerPrefill = "skyscanner_prefill"
)

// BuildUniformBookingLink returns a URL the user can use to book. Never returns empty if session/option are valid.
func BuildUniformBookingLink(session *SearchSession, option *FlightOption) string {
	mode := strings.TrimSpace(strings.ToLower(os.Getenv("BOOKING_LINK_MODE")))
	if mode == "" {
		mode = BookingModeGooglePrefill
	}

	// Preferred: provider deep link when valid
	if option != nil && option.DeepLink != "" && strings.HasPrefix(option.DeepLink, "https://") {
		if mode == BookingModeDirectProvider {
			return option.DeepLink
		}
		// google_prefill / skyscanner_prefill still allow using direct link when present
		return option.DeepLink
	}

	// Fallback: prefilled search
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
	if option != nil && len(option.Legs) > 0 {
		if len(option.Legs[0].Segments) > 0 {
			origin = option.Legs[0].Segments[0].From.Code
			dest = option.Legs[0].Segments[0].To.Code
			depAt := option.Legs[0].Segments[0].DepartureTime
			if !depAt.IsZero() {
				dep = depAt.Format("2006-01-02")
			}
		}
		if len(option.Legs) > 1 && len(option.Legs[1].Segments) > 0 {
			arrAt := option.Legs[1].Segments[len(option.Legs[1].Segments)-1].ArrivalTime
			if !arrAt.IsZero() {
				ret = arrAt.Format("2006-01-02")
			}
		}
	}
	if dep == "" && session != nil {
		dep = session.Params.DepartureDate
	}

	switch mode {
	case BookingModeSkyscannerPrefill:
		return buildSkyscannerPrefillURL(origin, dest, dep, ret)
	default:
		url := buildGoogleFlightsPrefillURL(origin, dest, dep, ret)
		if url == "" {
			url = "https://www.google.com/travel/flights?q=Flights"
		}
		return url
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

func buildSkyscannerPrefillURL(origin, dest, dep, ret string) string {
	// Stub: Skyscanner search URL format (no affiliate yet). Enable when BOOKING_LINK_MODE=skyscanner_prefill.
	// Format: /transport/flights/{origin}/{dest}/{outboundYYMMDD}/{inboundYYMMDD}/
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
	return fmt.Sprintf("https://www.skyscanner.net/transport/flights/%s/%s/%s/%s/", origin, dest, outbound, inbound)
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
