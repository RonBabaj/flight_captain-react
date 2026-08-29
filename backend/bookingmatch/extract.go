package bookingmatch

import (
	"net/url"
	"regexp"
	"strconv"
	"strings"
	"time"

	"flightcaptainweb/search"
)

var (
	flightNumPattern = regexp.MustCompile(`(?i)\b([A-Z]{2})\s*(\d{1,4})\b`)
	priceUSD         = regexp.MustCompile(`(?i)\$\s*([\d,]+(?:\.\d{2})?)`)
	priceEURPrefix   = regexp.MustCompile(`(?i)€\s*([\d,]+(?:\.\d{2})?)`)
	priceEURSuffix   = regexp.MustCompile(`(?i)\b([\d,]+(?:\.\d{2})?)\s+EUR\b`)
	priceGBP         = regexp.MustCompile(`(?i)£\s*([\d,]+(?:\.\d{2})?)`)
)

// corpusText combines searchable text from a candidate.
func corpusText(c SearchCandidate) string {
	parts := []string{c.Title, c.Snippet, c.PageText}
	return strings.ToLower(strings.Join(parts, " "))
}

// extractFlightNumbers finds normalized flight numbers in text (e.g. OS860).
func extractFlightNumbers(text string) []string {
	text = strings.ToUpper(text)
	seen := map[string]struct{}{}
	var out []string
	for _, m := range flightNumPattern.FindAllStringSubmatch(text, -1) {
		if len(m) < 3 {
			continue
		}
		fn := search.NormalizeFlightNumber(m[1], m[1]+m[2])
		if fn == "" {
			continue
		}
		if _, ok := seen[fn]; ok {
			continue
		}
		seen[fn] = struct{}{}
		out = append(out, fn)
	}
	return out
}

// extractPrice attempts to parse a price from text.
func extractPrice(text string) (amount float64, currency string, ok bool) {
	if m := priceUSD.FindStringSubmatch(text); len(m) > 1 {
		if v, err := strconv.ParseFloat(strings.ReplaceAll(m[1], ",", ""), 64); err == nil {
			return v, "USD", true
		}
	}
	if m := priceEURPrefix.FindStringSubmatch(text); len(m) > 1 {
		if v, err := strconv.ParseFloat(strings.ReplaceAll(m[1], ",", ""), 64); err == nil {
			return v, "EUR", true
		}
	}
	if m := priceGBP.FindStringSubmatch(text); len(m) > 1 {
		if v, err := strconv.ParseFloat(strings.ReplaceAll(m[1], ",", ""), 64); err == nil {
			return v, "GBP", true
		}
	}
	if m := priceEURSuffix.FindStringSubmatch(text); len(m) > 1 {
		if v, err := strconv.ParseFloat(strings.ReplaceAll(m[1], ",", ""), 64); err == nil {
			return v, "EUR", true
		}
	}
	return 0, "", false
}

// classifyURLType heuristically classifies booking URL specificity.
func classifyURLType(rawURL string) URLType {
	u := strings.ToLower(strings.TrimSpace(rawURL))
	if u == "" {
		return URLTypeGenericSearch
	}
	parsed, err := url.Parse(u)
	if err != nil {
		return URLTypeGenericSearch
	}
	path := parsed.Path
	host := parsed.Host
	q := parsed.Query()

	bookingHints := []string{"/book", "/booking", "/checkout", "/purchase", "/pay", "/confirm", "/reserve", "selectflight", "buy"}
	for _, h := range bookingHints {
		if strings.Contains(path, h) {
			return URLTypeExactBooking
		}
	}

	exactSearchHints := []string{
		"/travel/flights", "/flights/", "/flight/", "/itinerary", "/trip/",
		"flightdetails", "flight-details", "/transport/flights/",
	}
	for _, h := range exactSearchHints {
		if strings.Contains(path, h) || strings.Contains(u, h) {
			if strings.Contains(host, "google.") && (q.Get("q") != "" || q.Get("tfs") != "") {
				return URLTypeExactSearch
			}
			if strings.Contains(host, "skyscanner.") || strings.Contains(host, "kayak.") ||
				strings.Contains(host, "expedia.") || strings.Contains(host, "momondo.") {
				return URLTypeExactSearch
			}
			return URLTypeExactSearch
		}
	}

	genericHosts := []string{"google.com/search", "bing.com/search", "duckduckgo.com"}
	for _, g := range genericHosts {
		if strings.Contains(u, g) {
			return URLTypeGenericSearch
		}
	}

	if strings.Contains(host, "google.com") && strings.Contains(path, "/travel/flights") {
		return URLTypeExactSearch
	}

	return URLTypeGenericSearch
}

func domainFromURL(raw string) string {
	parsed, err := url.Parse(raw)
	if err != nil {
		return ""
	}
	host := parsed.Host
	if idx := strings.Index(host, ":"); idx >= 0 {
		host = host[:idx]
	}
	return strings.TrimPrefix(host, "www.")
}

func textContainsAny(text string, variants []string) bool {
	text = strings.ToLower(text)
	for _, v := range variants {
		v = strings.TrimSpace(v)
		if v == "" {
			continue
		}
		if strings.Contains(text, strings.ToLower(v)) {
			return true
		}
	}
	return false
}

func textContainsAirport(text, code string) bool {
	code = strings.ToUpper(strings.TrimSpace(code))
	if code == "" {
		return false
	}
	text = strings.ToUpper(text)
	if strings.Contains(text, code) {
		return true
	}
	if city, ok := airportCityNames[code]; ok {
		return strings.Contains(strings.ToLower(text), strings.ToLower(city))
	}
	return false
}

func flightNumberInText(text, want string) bool {
	want = strings.ToUpper(strings.TrimSpace(want))
	if want == "" {
		return false
	}
	found := extractFlightNumbers(strings.ToUpper(text))
	for _, f := range found {
		if f == want {
			return true
		}
	}
	if len(want) >= 3 {
		carrier := want[:2]
		num := strings.TrimPrefix(strings.TrimPrefix(want[2:], "0"), "0")
		if strings.Contains(strings.ToUpper(text), carrier+" "+num) {
			return true
		}
	}
	return strings.Contains(strings.ToUpper(text), want)
}

func timeMatches(text string, seg search.CanonicalSegment, dep bool) bool {
	var target time.Time
	var variants []string
	if dep {
		target = seg.DepartureTime
		variants = segmentDepTimeVariants(seg)
	} else {
		target = seg.ArrivalTime
		variants = segmentArrTimeVariants(seg)
	}
	if target.IsZero() {
		return true
	}
	if textContainsAny(text, variants) {
		return true
	}
	hourStr := target.Format("15:")
	return strings.Contains(text, hourStr)
}
