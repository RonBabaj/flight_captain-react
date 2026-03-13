package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"strconv"
	"strings"
	"time"
)

const duffelAPIBase = "https://api.duffel.com"
const duffelDeepLinkPrefix = "https://duffel.com/air/offers/"

// DuffelClient calls Duffel Flights API. Nil if DUFFEL_API_KEY is not set.
type DuffelClient struct {
	apiKey string
	client *http.Client
}

// NewDuffelClient creates a client if DUFFEL_API_KEY is set; otherwise returns nil.
func NewDuffelClient() *DuffelClient {
	key := strings.TrimSpace(os.Getenv("DUFFEL_API_KEY"))
	if key == "" {
		return nil
	}
	return &DuffelClient{
		apiKey: key,
		client: &http.Client{Timeout: 30 * time.Second},
	}
}

// duffelCabin maps our cabin preference to Duffel cabin_class.
func duffelCabin(cabin string) string {
	switch strings.ToUpper(cabin) {
	case "ECONOMY":
		return "economy"
	case "PREMIUM_ECONOMY":
		return "premium_economy"
	case "BUSINESS":
		return "business"
	case "FIRST":
		return "first"
	default:
		return "economy"
	}
}

// DuffelSearchResult holds options and timing for logging.
type DuffelSearchResult struct {
	Options   []FlightOption
	LatencyMs int64
	Err       error
}

// SearchOffers runs a Duffel offer request (one-way or round-trip) and returns normalized FlightOptions.
// If round-trip, slices are [outbound, return]. Cabin is mapped from our preference.
// When premium cabin returns 0 offers, retries with economy (Duffel often has limited premium inventory).
func (c *DuffelClient) SearchOffers(origin, destination, departureDate, returnDate, cabinPreference string) DuffelSearchResult {
	return c.searchOffers(origin, destination, departureDate, returnDate, cabinPreference, false)
}

func (c *DuffelClient) searchOffers(origin, destination, departureDate, returnDate, cabinPreference string, economyFallbackDone bool) DuffelSearchResult {
	start := time.Now()
	defer func() { log.Printf("[DUFFEL] request latency=%dms", time.Since(start).Milliseconds()) }()

	slices := []map[string]string{
		{"origin": strings.ToUpper(origin), "destination": strings.ToUpper(destination), "departure_date": departureDate},
	}
	if returnDate != "" {
		slices = append(slices, map[string]string{
			"origin":         strings.ToUpper(destination),
			"destination":    strings.ToUpper(origin),
			"departure_date": returnDate,
		})
	}
	body := map[string]interface{}{
		"slices":      slices,
		"passengers":  []map[string]string{{"type": "adult"}},
		"cabin_class": duffelCabin(cabinPreference),
	}
	payload, _ := json.Marshal(map[string]interface{}{"data": body})

	// supplier_timeout in ms; 25s gives airlines more time to return offers (default 20s)
	req, err := http.NewRequest(http.MethodPost, duffelAPIBase+"/air/offer_requests?return_offers=true&supplier_timeout=25000", bytes.NewReader(payload))
	if err != nil {
		return DuffelSearchResult{LatencyMs: time.Since(start).Milliseconds(), Err: err}
	}
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Accept", "application/json")
	req.Header.Set("Authorization", "Bearer "+c.apiKey)
	req.Header.Set("Duffel-Version", "v2")

	resp, err := c.client.Do(req)
	latency := time.Since(start).Milliseconds()
	if err != nil {
		log.Printf("[DUFFEL] request error: %v", err)
		return DuffelSearchResult{LatencyMs: latency, Err: err}
	}
	defer resp.Body.Close()

	bodyBytes, _ := io.ReadAll(resp.Body)
	if resp.StatusCode != http.StatusOK && resp.StatusCode != http.StatusCreated {
		log.Printf("[DUFFEL] API status %d: %s", resp.StatusCode, string(bodyBytes))
		return DuffelSearchResult{LatencyMs: latency, Err: fmt.Errorf("duffel API status %d: %s", resp.StatusCode, string(bodyBytes))}
	}

	var result struct {
		Data struct {
			Offers []map[string]interface{} `json:"offers"`
		} `json:"data"`
	}
	if err := json.Unmarshal(bodyBytes, &result); err != nil {
		log.Printf("[DUFFEL] decode error: %v", err)
		return DuffelSearchResult{LatencyMs: latency, Err: err}
	}

	if len(result.Data.Offers) == 0 && !economyFallbackDone && duffelCabin(cabinPreference) != "economy" {
		// Duffel often has no inventory for premium cabins; retry with economy once
		log.Printf("[DUFFEL] 0 offers for cabin=%s, retrying with economy", cabinPreference)
		return c.searchOffers(origin, destination, departureDate, returnDate, "ECONOMY", true)
	}

	if len(result.Data.Offers) == 0 {
		log.Printf("[DUFFEL] 0 offers for %s-%s %s/%s cabin=%s",
			origin, destination, departureDate, returnDate, cabinPreference)
	}

	options := normalizeDuffelOffers(result.Data.Offers)
	return DuffelSearchResult{Options: options, LatencyMs: latency}
}

// parseISODuration parses ISO 8601 duration like PT2H26M into minutes.
func parseISODuration(s string) int {
	if s == "" {
		return 0
	}
	s = strings.TrimPrefix(s, "PT")
	var h, m int
	for i := 0; i < len(s); {
		j := i
		for j < len(s) && (s[j] < '0' || s[j] > '9') {
			j++
		}
		if j >= len(s) {
			break
		}
		k := j
		for k < len(s) && s[k] >= '0' && s[k] <= '9' {
			k++
		}
		num, _ := strconv.Atoi(s[j:k])
		if k < len(s) {
			switch s[k] {
			case 'H':
				h = num
			case 'M':
				m = num
			}
		}
		i = k + 1
	}
	return h*60 + m
}

func parseDuffelTime(s string) time.Time {
	if s == "" {
		return time.Time{}
	}
	// Duffel: "2020-06-13T16:38:02" or with timezone
	t, err := time.Parse("2006-01-02T15:04:05", s)
	if err == nil {
		return t
	}
	t, err = time.Parse(time.RFC3339, s)
	if err == nil {
		return t
	}
	return time.Time{}
}

// normalizeDuffelOffers converts Duffel offer objects into FlightOption with source=duffel and deepLink.
func normalizeDuffelOffers(offers []map[string]interface{}) []FlightOption {
	var out []FlightOption
	for i, o := range offers {
		opt := normalizeOneDuffelOffer(o, i)
		if opt != nil {
			out = append(out, *opt)
		}
	}
	return out
}

func normalizeOneDuffelOffer(o map[string]interface{}, idx int) *FlightOption {
	offerID, _ := o["id"].(string)
	totalAmount, _ := o["total_amount"].(string)
	totalCurrency, _ := o["total_currency"].(string)
	if totalAmount == "" {
		return nil
	}
	amount, err := strconv.ParseFloat(totalAmount, 64)
	if err != nil || amount <= 0 {
		return nil
	}
	if totalCurrency == "" {
		totalCurrency = "USD"
	}

	slicesRaw, ok := o["slices"].([]interface{})
	if !ok || len(slicesRaw) == 0 {
		return nil
	}

	var legs []FlightLeg
	var totalDuration int

	for _, slAny := range slicesRaw {
		sl, _ := slAny.(map[string]interface{})
		segsRaw, _ := sl["segments"].([]interface{})
		if len(segsRaw) == 0 {
			continue
		}
		var segments []FlightSegment
		for _, segAny := range segsRaw {
			seg, _ := segAny.(map[string]interface{})
			origin, _ := seg["origin"].(map[string]interface{})
			dest, _ := seg["destination"].(map[string]interface{})
			if origin == nil || dest == nil {
				continue
			}
			depCode, _ := origin["iata_code"].(string)
			arrCode, _ := dest["iata_code"].(string)
			depAt, _ := seg["departing_at"].(string)
			arrAt, _ := seg["arriving_at"].(string)
			durStr, _ := seg["duration"].(string)
			depTime := parseDuffelTime(depAt)
			arrTime := parseDuffelTime(arrAt)
			durationMin := parseISODuration(durStr)
			if durationMin == 0 && !arrTime.IsZero() && !depTime.IsZero() {
				durationMin = int(arrTime.Sub(depTime).Minutes())
			}
			if durationMin < 0 {
				durationMin = 0
			}

			carrierCode := ""
			if mc, ok := seg["marketing_carrier"].(map[string]interface{}); ok {
				carrierCode, _ = mc["iata_code"].(string)
			}
			flightNum := ""
			if fn, ok := seg["marketing_carrier_flight_number"].(string); ok {
				flightNum = fn
			}
			cabinClass := "ECONOMY"
			if passList, ok := seg["passengers"].([]interface{}); ok && len(passList) > 0 {
				if p, ok := passList[0].(map[string]interface{}); ok {
					if cc, ok := p["cabin_class"].(string); ok && cc != "" {
						cabinClass = strings.ToUpper(strings.ReplaceAll(cc, "_", " "))
					}
				}
			}

			segments = append(segments, FlightSegment{
				From:             AirportLike{Code: strings.ToUpper(depCode)},
				To:               AirportLike{Code: strings.ToUpper(arrCode)},
				DepartureTime:    depTime,
				ArrivalTime:      arrTime,
				MarketingCarrier: Carrier{Code: carrierCode},
				FlightNumber:     flightNum,
				DurationMinutes:  durationMin,
				CabinClass:       cabinClass,
			})
			totalDuration += durationMin
		}
		if len(segments) > 0 {
			legs = append(legs, FlightLeg{Segments: segments})
		}
	}
	if len(legs) == 0 {
		return nil
	}
	// Total duration = sum of (last segment arrival - first segment departure) per leg (includes layovers)
	totalDuration = 0
	for _, leg := range legs {
		if len(leg.Segments) == 0 {
			continue
		}
		first := leg.Segments[0]
		last := leg.Segments[len(leg.Segments)-1]
		if !first.DepartureTime.IsZero() && !last.ArrivalTime.IsZero() {
			mins := int(last.ArrivalTime.Sub(first.DepartureTime).Minutes())
			if mins > 0 {
				totalDuration += mins
			}
		}
	}
	if totalDuration == 0 {
		// Fallback to sum of segment durations if times missing
		for _, leg := range legs {
			for _, seg := range leg.Segments {
				totalDuration += seg.DurationMinutes
			}
		}
	}

	primaryCarrier := ""
	if len(legs) > 0 && len(legs[0].Segments) > 0 {
		primaryCarrier = legs[0].Segments[0].MarketingCarrier.Code
	}
	if primaryCarrier == "" {
		if owner, ok := o["owner"].(map[string]interface{}); ok {
			primaryCarrier, _ = owner["iata_code"].(string)
		}
	}

	deepLink := duffelDeepLinkPrefix + offerID
	return &FlightOption{
		ID:                    fmt.Sprintf("duffel_%d_%s", idx, offerID),
		Price:                 MonetaryAmount{Currency: totalCurrency, Amount: amount},
		DurationMinutes:       totalDuration,
		Legs:                  legs,
		PrimaryDisplayCarrier: primaryCarrier,
		Source:                "duffel",
		DeepLink:              deepLink,
	}
}
