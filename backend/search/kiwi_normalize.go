package search

import (
	"fmt"
	"strconv"
	"strings"
	"time"
)

const kiwiCacheTTL = 10 * time.Minute

func flattenKiwiItems(v interface{}) []map[string]interface{} {
	switch x := v.(type) {
	case []interface{}:
		var out []map[string]interface{}
		for _, it := range x {
			if m, ok := it.(map[string]interface{}); ok {
				out = append(out, m)
			}
		}
		return out
	case map[string]interface{}:
		for _, key := range []string{"items", "results", "data", "flights", "options"} {
			if child, ok := x[key]; ok {
				if out := flattenKiwiItems(child); len(out) > 0 {
					return out
				}
			}
		}
	}
	return nil
}

// parseOtaOffers normalizes multisite scraper offer rows (Kiwi / Skyscanner / Expedia) into ProviderResult.
func parseOtaOffers(items []map[string]interface{}, req SearchRequest, source string) []ProviderResult {
	if source == "" {
		source = "kiwi"
	}
	now := time.Now().UTC()
	var out []ProviderResult
	for i, item := range items {
		pr := normalizeKiwiItem(item, req, i, now, source)
		if pr == nil || pr.Price.Amount <= 0 || len(pr.Legs) == 0 {
			continue
		}
		out = append(out, *pr)
	}
	return out
}

func normalizeKiwiItem(item map[string]interface{}, req SearchRequest, idx int, fetchedAt time.Time, source string) *ProviderResult {
	if item == nil {
		return nil
	}
	price := firstFloat(item, "price", "priceUsd", "priceEUR", "priceEur", "totalPrice", "amount")
	currency := firstString(item, "currency", "currencyCode", "priceCurrency")
	if currency == "" {
		currency = req.Currency
	}
	if currency == "" {
		currency = "USD"
	}
	rawListingURL := firstString(item, "bookingUrl", "booking_url", "deepLink", "deep_link", "url", "link")
	deepLink := rawListingURL
	// Meta-search / OTA listing URLs are not seller checkout. Clear them so Book uses
	// OTA partner-panel resolve (or GF2 token path) instead of opening a results page.
	if deepLink != "" && !isLikelyPartnerCheckoutURL(deepLink) {
		deepLink = ""
	}
	selfTransfer := detectSelfTransfer(item)

	legs := extractKiwiLegs(item, req)
	if len(legs) == 0 {
		return nil
	}
	durMin := int(firstFloat(item, "durationMinutes", "duration_minutes"))
	if durMin <= 0 {
		if hours := firstFloat(item, "durationHours", "duration_hours", "duration"); hours > 0 {
			if hours < 100 {
				durMin = int(hours * 60)
			} else {
				durMin = int(hours)
			}
		}
	}
	if durMin <= 0 {
		durMin = sumLegDurations(legs)
	}
	carriers := collectCarriers(legs)
	primary := ""
	if len(carriers) > 0 {
		primary = carriers[0]
	}
	meta := map[string]interface{}{}
	if rawListingURL != "" {
		meta["listingUrl"] = rawListingURL
	}
	if v, ok := item["priceEur"]; ok {
		meta["priceEur"] = v
	}
	if v, ok := item["layoverNights"]; ok {
		meta["layoverNights"] = v
	}
	if v, ok := item["airlines"]; ok {
		meta["airlines"] = v
	}
	vendor := vendorNameForSource(source)
	if v := firstString(item, "vendorName", "vendor", "provider"); v != "" {
		vendor = v
	}
	pr := &ProviderResult{
		ID:                    fmt.Sprintf("%s_%d", source, idx),
		Price:                 Monetary{Currency: currency, Amount: price},
		DurationMinutes:       durMin,
		Stops:                 TotalStops(ProviderResult{Legs: legs}),
		Legs:                  legs,
		ValidatingAirlines:    carriers,
		PrimaryDisplayCarrier: primary,
		Source:                source,
		DeepLink:              deepLink,
		ListingURL:            strings.TrimSpace(rawListingURL),
		VendorName:            vendor,
		SelfTransfer:          selfTransfer,
		FetchedAt:             fetchedAt,
		Metadata:              meta,
		BaggageClass:          "BAG_UNKNOWN",
	}
	if selfTransfer {
		pr.FareConditions = "Self-transfer — separate tickets may be required"
	}
	return pr
}

func vendorNameForSource(source string) string {
	switch strings.ToLower(strings.TrimSpace(source)) {
	case "skyscanner":
		return "Skyscanner"
	case "expedia":
		return "Expedia"
	case "kiwi":
		return "Kiwi.com"
	default:
		return source
	}
}

func detectSelfTransfer(item map[string]interface{}) bool {
	for _, key := range []string{
		"selfTransfer", "self_transfer", "isSelfTransfer", "is_self_transfer",
		"virtualInterlining", "virtual_interlining", "viFlight", "bagsRecheckRequired",
	} {
		if b, ok := item[key].(bool); ok && b {
			return true
		}
		if s, ok := item[key].(string); ok {
			s = strings.ToLower(strings.TrimSpace(s))
			if s == "true" || s == "yes" || s == "1" {
				return true
			}
		}
	}
	for _, nestKey := range []string{"quality", "flags", "meta", "extras"} {
		if m, ok := item[nestKey].(map[string]interface{}); ok && detectSelfTransfer(m) {
			return true
		}
	}
	return false
}

func extractKiwiLegs(item map[string]interface{}, req SearchRequest) []Leg {
	if segsRaw, ok := item["segments"].([]interface{}); ok && len(segsRaw) > 0 {
		var outSegs, inSegs []Segment
		for _, sAny := range segsRaw {
			s, _ := sAny.(map[string]interface{})
			if s == nil {
				continue
			}
			seg := kiwiSegmentFromMap(s, req.CabinPreference)
			if seg == nil {
				continue
			}
			legKind := strings.ToLower(firstString(s, "leg", "direction", "route"))
			switch {
			case strings.Contains(legKind, "in") || strings.Contains(legKind, "return"):
				inSegs = append(inSegs, *seg)
			default:
				outSegs = append(outSegs, *seg)
			}
		}
		var legs []Leg
		if len(outSegs) > 0 {
			legs = append(legs, Leg{Segments: outSegs})
		}
		if len(inSegs) > 0 {
			legs = append(legs, Leg{Segments: inSegs})
		}
		if len(legs) > 0 {
			return legs
		}
	}

	if route, ok := item["route"].([]interface{}); ok && len(route) > 0 {
		var segs []Segment
		for _, sAny := range route {
			s, _ := sAny.(map[string]interface{})
			if seg := kiwiSegmentFromMap(s, req.CabinPreference); seg != nil {
				segs = append(segs, *seg)
			}
		}
		if len(segs) > 0 {
			return splitKiwiRouteByReturn(segs, req)
		}
	}
	if outArr, ok := asArray(item["outbound"], item["outboundSegments"], item["out"]); ok {
		inArr, _ := asArray(item["inbound"], item["inboundSegments"], item["return"], item["returnSegments"])
		var legs []Leg
		if segs := mapsToSegments(outArr, req.CabinPreference); len(segs) > 0 {
			legs = append(legs, Leg{Segments: segs})
		}
		if segs := mapsToSegments(inArr, req.CabinPreference); len(segs) > 0 {
			legs = append(legs, Leg{Segments: segs})
		}
		if len(legs) > 0 {
			return legs
		}
	}

	from := firstString(item, "originCode", "origin", "flyFrom", "from")
	to := firstString(item, "destinationCode", "destination", "flyTo", "to")
	if from == "" {
		from = req.Origin
	}
	if to == "" {
		to = req.Destination
	}
	dep := parseOTASegmentTime(firstString(item, "departureTime", "departure", "dTimeUTC", "dTime"), from)
	arr := parseOTASegmentTime(firstString(item, "arrivalTime", "arrival", "aTimeUTC", "aTime"), to)
	if from != "" && to != "" && !dep.IsZero() {
		cabin := req.CabinPreference
		if cabin == "" {
			cabin = "ECONOMY"
		}
		return []Leg{{Segments: []Segment{{
			From: from, To: to, DepartureTime: dep, ArrivalTime: arr,
			MarketingCarrier: firstString(item, "airlineCode", "airline"),
			FlightNumber:     firstString(item, "flightNumber", "flight_no"),
			CabinClass:       cabin,
		}}}}
	}
	return nil
}

func splitKiwiRouteByReturn(segs []Segment, req SearchRequest) []Leg {
	if req.ReturnDate == "" || len(segs) < 2 {
		return []Leg{{Segments: segs}}
	}
	dest := strings.ToUpper(req.Destination)
	for i := 1; i < len(segs); i++ {
		if strings.EqualFold(segs[i-1].To, dest) || strings.EqualFold(segs[i].From, dest) {
			return []Leg{
				{Segments: append([]Segment{}, segs[:i]...)},
				{Segments: append([]Segment{}, segs[i:]...)},
			}
		}
	}
	return []Leg{{Segments: segs}}
}

func kiwiSegmentFromMap(s map[string]interface{}, cabin string) *Segment {
	if s == nil {
		return nil
	}
	from := firstString(s, "fromCode", "flyFrom", "from", "origin", "originCode", "cityFrom")
	to := firstString(s, "toCode", "flyTo", "to", "destination", "destinationCode", "cityTo")
	if from == "" || to == "" {
		return nil
	}
	// Prefer explicit UTC fields; otherwise treat zoneless/Z times as airport wall
	// clocks (same convention as GF2) so fingerprint match can find a booking_token.
	depRawUTC := firstString(s, "departureTimeUtc", "dTimeUTC", "utc_departure")
	arrRawUTC := firstString(s, "arrivalTimeUtc", "aTimeUTC", "utc_arrival")
	depRaw := firstString(s, "departureTime", "dTime", "local_departure", "departure")
	arrRaw := firstString(s, "arrivalTime", "aTime", "local_arrival", "arrival")
	var dep, arr time.Time
	if depRawUTC != "" {
		dep = parseFlexibleTime(depRawUTC)
	} else {
		dep = parseOTASegmentTime(depRaw, from)
	}
	if arrRawUTC != "" {
		arr = parseFlexibleTime(arrRawUTC)
	} else {
		arr = parseOTASegmentTime(arrRaw, to)
	}
	carrier := firstString(s, "airlineCode", "airline", "carrier", "marketingAirline", "marketingCarrier")
	operating := firstString(s, "operatingAirline", "operating_airline", "operatedBy", "operated_by")
	if carrier == "" {
		carrier = operating
	}
	flightNum := firstString(s, "flightNumber", "flight_no", "flightNo", "number")
	opFlightNum := firstString(s, "operatingFlightNumber", "operating_flight_number")
	dur := int(firstFloat(s, "durationMinutes"))
	if dur <= 0 {
		if h := firstFloat(s, "durationHours", "duration"); h > 0 {
			if h < 100 {
				dur = int(h * 60)
			} else {
				dur = int(h)
			}
		}
	}
	// OTA scrapes often omit duration — derive from clock times when possible.
	if dur <= 0 && !dep.IsZero() && !arr.IsZero() {
		delta := arr.Sub(dep)
		if delta < 0 {
			delta += 24 * time.Hour
		}
		if delta > 0 && delta < 48*time.Hour {
			dur = int(delta.Minutes())
		}
	}
	if cabin == "" {
		cabin = firstString(s, "cabinClass", "cabin")
	}
	if cabin == "" {
		cabin = "ECONOMY"
	}
	return &Segment{
		From:                  strings.ToUpper(from),
		To:                    strings.ToUpper(to),
		DepartureTime:         dep,
		ArrivalTime:           arr,
		MarketingCarrier:      strings.ToUpper(carrier),
		OperatingCarrier:      strings.ToUpper(operating),
		FlightNumber:          flightNum,
		OperatingFlightNumber: opFlightNum,
		DurationMinutes:       dur,
		CabinClass:            cabin,
	}
}

func mapsToSegments(arr []interface{}, cabin string) []Segment {
	var segs []Segment
	for _, sAny := range arr {
		s, _ := sAny.(map[string]interface{})
		if seg := kiwiSegmentFromMap(s, cabin); seg != nil {
			segs = append(segs, *seg)
		}
	}
	return segs
}

func asArray(vals ...interface{}) ([]interface{}, bool) {
	for _, v := range vals {
		if arr, ok := v.([]interface{}); ok && len(arr) > 0 {
			return arr, true
		}
	}
	return nil, false
}

func sumLegDurations(legs []Leg) int {
	total := 0
	for _, leg := range legs {
		for _, s := range leg.Segments {
			total += s.DurationMinutes
		}
	}
	return total
}

func collectCarriers(legs []Leg) []string {
	seen := map[string]bool{}
	var out []string
	for _, leg := range legs {
		for _, s := range leg.Segments {
			c := strings.ToUpper(strings.TrimSpace(s.MarketingCarrier))
			if c == "" || seen[c] {
				continue
			}
			seen[c] = true
			out = append(out, c)
		}
	}
	return out
}

func firstString(m map[string]interface{}, keys ...string) string {
	for _, k := range keys {
		if v, ok := m[k]; ok {
			switch x := v.(type) {
			case string:
				if strings.TrimSpace(x) != "" {
					return strings.TrimSpace(x)
				}
			case float64:
				return strconv.FormatInt(int64(x), 10)
			}
		}
	}
	return ""
}

func firstFloat(m map[string]interface{}, keys ...string) float64 {
	for _, k := range keys {
		if v, ok := m[k]; ok {
			switch x := v.(type) {
			case float64:
				return x
			case int:
				return float64(x)
			case string:
				f, _ := strconv.ParseFloat(strings.TrimSpace(strings.ReplaceAll(x, ",", "")), 64)
				return f
			}
		}
	}
	return 0
}

func parseFlexibleTime(s string) time.Time {
	s = strings.TrimSpace(s)
	if s == "" {
		return time.Time{}
	}
	if n, err := strconv.ParseInt(s, 10, 64); err == nil && n > 1_000_000_000 {
		return time.Unix(n, 0).UTC()
	}
	formats := []string{
		time.RFC3339,
		"2006-01-02T15:04:05Z",
		"2006-01-02T15:04:05",
		"2006-01-02 15:04:05",
		"2006-01-02 15:04",
		"2006-01-02T15:04",
	}
	for _, f := range formats {
		if t, err := time.Parse(f, s); err == nil {
			return t.UTC()
		}
		if t, err := time.ParseInLocation(f, s, time.UTC); err == nil {
			return t
		}
	}
	return time.Time{}
}

// parseOTASegmentTime aligns OTA scrape clocks with GF2: zoneless / trailing Z are
// airport wall clocks so CanonicalItinerary fingerprints can match across providers.
func parseOTASegmentTime(s, airportCode string) time.Time {
	s = strings.TrimSpace(s)
	if s == "" {
		return time.Time{}
	}
	if t, err := parseGF2Time(s, airportCode); err == nil && !t.IsZero() {
		return t
	}
	return parseFlexibleTime(s)
}

func truncateStr(s string, n int) string {
	if len(s) <= n {
		return s
	}
	return s[:n] + "..."
}
