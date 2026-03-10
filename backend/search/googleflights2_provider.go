package search

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"net/url"
	"os"
	"strings"
	"sync"
	"time"
)

const (
	gf2Timeout         = 15 * time.Second
	gf2CacheTTL        = 10 * time.Minute
	gf2RateLimitPerMin = 5
)

// GoogleFlights2Provider calls RapidAPI google-flights2 (DataCrawler).
type GoogleFlights2Provider struct {
	apiKey  string
	host    string
	path    string // endpoint path e.g. /search or /
	client  *http.Client
	cache   *gf2Cache
	limiter *gf2RateLimiter
}

type gf2Cache struct {
	mu    sync.RWMutex
	items map[string]gf2CacheEntry
}

type gf2CacheEntry struct {
	results []ProviderResult
	expires time.Time
}

type gf2RateLimiter struct {
	mu         sync.Mutex
	tokens     int
	lastRefill time.Time
}

func (r *gf2RateLimiter) allow() bool {
	r.mu.Lock()
	defer r.mu.Unlock()
	now := time.Now()
	elapsed := now.Sub(r.lastRefill).Minutes()
	if elapsed >= 1 {
		r.tokens = gf2RateLimitPerMin
		r.lastRefill = now
	}
	if r.tokens <= 0 {
		return false
	}
	r.tokens--
	return true
}

func newGF2Cache() *gf2Cache {
	c := &gf2Cache{items: make(map[string]gf2CacheEntry)}
	go func() {
		ticker := time.NewTicker(1 * time.Minute)
		defer ticker.Stop()
		for range ticker.C {
			c.evict()
		}
	}()
	return c
}

func (c *gf2Cache) get(key string) ([]ProviderResult, bool) {
	c.mu.RLock()
	defer c.mu.RUnlock()
	e, ok := c.items[key]
	if !ok || time.Now().After(e.expires) {
		return nil, false
	}
	return e.results, true
}

func (c *gf2Cache) set(key string, results []ProviderResult) {
	c.mu.Lock()
	defer c.mu.Unlock()
	c.items[key] = gf2CacheEntry{results: results, expires: time.Now().Add(gf2CacheTTL)}
}

func (c *gf2Cache) evict() {
	c.mu.Lock()
	defer c.mu.Unlock()
	now := time.Now()
	for k, e := range c.items {
		if now.After(e.expires) {
			delete(c.items, k)
		}
	}
}

// NewGoogleFlights2Provider creates a provider when GOOGLEFLIGHTS2_ENABLED=true and keys are set.
func NewGoogleFlights2Provider() *GoogleFlights2Provider {
	if strings.ToLower(strings.TrimSpace(os.Getenv("GOOGLEFLIGHTS2_ENABLED"))) != "true" {
		return nil
	}
	apiKey := strings.TrimSpace(os.Getenv("GOOGLEFLIGHTS2_RAPIDAPI_KEY"))
	host := strings.TrimSpace(os.Getenv("GOOGLEFLIGHTS2_RAPIDAPI_HOST"))
	if apiKey == "" {
		return nil
	}
	if host == "" {
		host = "google-flights2.p.rapidapi.com"
	}
	path := strings.TrimSpace(os.Getenv("GOOGLEFLIGHTS2_ENDPOINT_PATH"))
	if path == "" {
		path = "/api/v1/searchFlights"
	}
	if !strings.HasPrefix(path, "/") {
		path = "/" + path
	}
	return &GoogleFlights2Provider{
		apiKey:  apiKey,
		host:    host,
		path:    path,
		client:  &http.Client{Timeout: gf2Timeout},
		cache:   newGF2Cache(),
		limiter: &gf2RateLimiter{tokens: gf2RateLimitPerMin, lastRefill: time.Now()},
	}
}

func (p *GoogleFlights2Provider) Name() string {
	return "googleflights2"
}

func (p *GoogleFlights2Provider) Search(ctx context.Context, req SearchRequest) ([]ProviderResult, error) {
	start := time.Now()
	enabled := true
	cacheHit := false
	var errLog string
	var resultCount int
	var cheapest float64
	defer func() {
		latency := time.Since(start).Milliseconds()
		if errLog != "" {
			log.Printf("[GF2] enabled=%t cacheHit=%t latencyMs=%d results=%d cheapest=%.2f err=%s",
				enabled, cacheHit, latency, resultCount, cheapest, errLog)
		} else {
			log.Printf("[GF2] enabled=%t cacheHit=%t latencyMs=%d results=%d cheapest=%.2f",
				enabled, cacheHit, latency, resultCount, cheapest)
		}
	}()

	if !p.limiter.allow() {
		errLog = "rate limited"
		return nil, nil
	}

	cacheKey := p.buildCacheKey(req)
	if cached, ok := p.cache.get(cacheKey); ok {
		cacheHit = true
		resultCount = len(cached)
		if len(cached) > 0 {
			cheapest = cached[0].Price.Amount
		}
		return cached, nil
	}

	// For round-trip: search outbound and return separately (one-way each), then combine legs.
	// This mirrors the Amadeus approach and guarantees we always have the actual return flight data.
	if req.ReturnDate != "" {
		results, err := p.searchRoundTrip(ctx, req)
		if err != nil {
			errLog = err.Error()
			return nil, err
		}
		resultCount = len(results)
		if len(results) > 0 {
			cheapest = results[0].Price.Amount
			p.cache.set(cacheKey, results)
		}
		return results, nil
	}

	results, err := p.doSearch(ctx, req)
	if err != nil {
		errLog = err.Error()
		return nil, err
	}
	resultCount = len(results)
	if len(results) > 0 {
		cheapest = results[0].Price.Amount
		p.cache.set(cacheKey, results)
	}
	return results, nil
}

// searchRoundTrip performs two one-way GF2 searches (outbound + return) and combines their legs,
// mirroring the Amadeus mixed round-trip approach so every result has both legs with full route data.
func (p *GoogleFlights2Provider) searchRoundTrip(ctx context.Context, req SearchRequest) ([]ProviderResult, error) {
	// Outbound: origin → dest on departureDate (one-way)
	outboundReq := req
	outboundReq.ReturnDate = ""
	outboundResults, err := p.doSearch(ctx, outboundReq)
	if err != nil || len(outboundResults) == 0 {
		// Fall back to the combined search if outbound fails
		return p.doSearch(ctx, req)
	}

	// Return: dest → origin on returnDate (one-way)
	returnReq := req
	returnReq.Origin = req.Destination
	returnReq.Destination = req.Origin
	returnReq.DepartureDate = req.ReturnDate
	returnReq.ReturnDate = ""
	returnResults, err := p.doSearch(ctx, returnReq)
	if err != nil || len(returnResults) == 0 {
		log.Printf("[GF2_RT] return search failed or empty (err=%v results=%d); serving outbound-only results", err, len(returnResults))
		return outboundResults, nil
	}

	log.Printf("[GF2_RT] outbound=%d return=%d; combining into round-trip results", len(outboundResults), len(returnResults))

	// Combine: pair each outbound result with the cheapest matching return leg.
	// Use the first (cheapest) return result's legs as the return leg for all outbound results.
	// This mirrors what Amadeus does with buildCombinedOffer.
	const maxCombinations = 30
	var combined []ProviderResult
	for i, ob := range outboundResults {
		if i >= maxCombinations {
			break
		}
		for j, ret := range returnResults {
			if j >= maxCombinations {
				break
			}
			// Build a new combined result: outbound leg(s) + return leg(s)
			var legs []Leg
			legs = append(legs, ob.Legs...)
			legs = append(legs, ret.Legs...)
			combinedResult := ProviderResult{
				ID:                    fmt.Sprintf("gf2rt_%d_%d", i, j),
				Price:                 Monetary{Currency: ob.Price.Currency, Amount: ob.Price.Amount + ret.Price.Amount},
				DurationMinutes:       ob.DurationMinutes + ret.DurationMinutes,
				Legs:                  legs,
				Source:                "googleflights2",
				DeepLink:              ob.DeepLink,
				PrimaryDisplayCarrier: ob.PrimaryDisplayCarrier,
				BaggageClass:          ob.BaggageClass,
			}
			combined = append(combined, combinedResult)
		}
	}

	// Sort by total price ascending
	for i := 0; i < len(combined); i++ {
		for j := i + 1; j < len(combined); j++ {
			if combined[j].Price.Amount < combined[i].Price.Amount {
				combined[i], combined[j] = combined[j], combined[i]
			}
		}
	}

	return combined, nil
}

func (p *GoogleFlights2Provider) buildCacheKey(req SearchRequest) string {
	bags := 0
	if req.IncludeCheckedBag {
		bags = 1
	}
	cabin := req.CabinPreference
	if cabin == "" {
		cabin = req.CabinClass
	}
	if cabin == "" {
		cabin = "ECONOMY"
	}
	return fmt.Sprintf("%s|%s|%s|%s|%d|%s|%d",
		req.Origin, req.Destination, req.DepartureDate, req.ReturnDate,
		req.Adults, cabin, bags)
}

func (p *GoogleFlights2Provider) doSearch(ctx context.Context, req SearchRequest) ([]ProviderResult, error) {
	ctx, cancel := context.WithTimeout(ctx, gf2Timeout)
	defer cancel()

	travelClass := "ECONOMY"
	switch strings.ToUpper(req.CabinPreference) {
	case "PREMIUM_ECONOMY":
		travelClass = "PREMIUM_ECONOMY"
	case "BUSINESS":
		travelClass = "BUSINESS"
	case "FIRST":
		travelClass = "FIRST"
	default:
		travelClass = "ECONOMY"
	}
	currency := req.Currency
	if currency == "" {
		currency = "USD"
	}
	adults := req.Adults
	if adults < 1 {
		adults = 1
	}

	params := url.Values{}
	params.Set("departure_id", strings.ToUpper(req.Origin))
	params.Set("arrival_id", strings.ToUpper(req.Destination))
	params.Set("outbound_date", req.DepartureDate)
	if req.ReturnDate != "" {
		params.Set("return_date", req.ReturnDate)
	}
	params.Set("travel_class", travelClass)
	params.Set("adults", fmt.Sprintf("%d", adults))
	// Optional passenger breakdown – follow documented param names
	if req.Children > 0 {
		params.Set("children", fmt.Sprintf("%d", max(0, req.Children)))
	}
	if req.Infants > 0 {
		// Assume infant on lap by default; could be split later if needed
		params.Set("infant_on_lap", fmt.Sprintf("%d", max(0, req.Infants)))
	}
	params.Set("show_hidden", "1")
	params.Set("currency", currency)
	params.Set("language_code", "en-US")
	params.Set("country_code", "US")
	params.Set("search_type", "best")

	base := "https://" + p.host
	if p.path != "" && p.path != "/" {
		base += strings.TrimSuffix(p.path, "/")
	} else {
		base += "/"
	}
	u := base + "?" + params.Encode()
	httpReq, err := http.NewRequestWithContext(ctx, http.MethodGet, u, nil)
	if err != nil {
		return nil, err
	}
	httpReq.Header.Set("x-rapidapi-host", p.host)
	httpReq.Header.Set("x-rapidapi-key", p.apiKey)

	resp, err := p.client.Do(httpReq)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	body, _ := io.ReadAll(resp.Body)

	if resp.StatusCode != http.StatusOK {
		log.Printf("[GF2_ERROR] status=%d body=%s", resp.StatusCode, truncateGF2(string(body), 300))
		return nil, fmt.Errorf("GF2 status %d", resp.StatusCode)
	}

	return parseGF2Response(body, req.Origin, req.Destination, currency, req.DepartureDate)
}

func parseGF2Response(body []byte, origin, dest, currency, departureDate string) ([]ProviderResult, error) {
	var raw map[string]interface{}
	if err := json.Unmarshal(body, &raw); err != nil {
		return nil, fmt.Errorf("parse GF2 response: %w", err)
	}

	// Debug: log structure when no known format found
	debugKeys := func() {
		keys := make([]string, 0, len(raw))
		for k := range raw {
			keys = append(keys, k)
		}
		log.Printf("[GF2_DEBUG] response keys=%v", keys)
		if data, ok := raw["data"].(map[string]interface{}); ok {
			dataKeys := make([]string, 0, len(data))
			for k := range data {
				dataKeys = append(dataKeys, k)
			}
			log.Printf("[GF2_DEBUG] data keys=%v", dataKeys)
			if itins, ok := data["itineraries"].([]interface{}); ok {
				log.Printf("[GF2_DEBUG] itineraries count=%d", len(itins))
				if len(itins) > 0 {
					if m, ok := itins[0].(map[string]interface{}); ok {
						sampleKeys := make([]string, 0, len(m))
						for k := range m {
							sampleKeys = append(sampleKeys, k)
						}
						log.Printf("[GF2_DEBUG] first itinerary keys=%v", sampleKeys)
					}
				}
			} else {
				log.Printf("[GF2_DEBUG] itineraries type=%T (not []interface{})", data["itineraries"])
			}
			if ph, ok := data["priceHistory"].(map[string]interface{}); ok {
				phKeys := make([]string, 0, len(ph))
				for k := range ph {
					phKeys = append(phKeys, k)
				}
				log.Printf("[GF2_DEBUG] priceHistory keys=%v", phKeys)
				if summary, ok := ph["summary"].(map[string]interface{}); ok {
					sumKeys := make([]string, 0, len(summary))
					for k := range summary {
						sumKeys = append(sumKeys, k)
					}
					log.Printf("[GF2_DEBUG] priceHistory.summary keys=%v", sumKeys)
					for k, v := range summary {
						log.Printf("[GF2_DEBUG] summary.%s=%v (type=%T)", k, v, v)
					}
				}
				if hist, ok := ph["history"]; ok {
					switch h := hist.(type) {
					case map[string]interface{}:
						log.Printf("[GF2_DEBUG] priceHistory.history type=map len=%d", len(h))
						for k, v := range h {
							log.Printf("[GF2_DEBUG] priceHistory.history sample key=%q valType=%T", k, v)
							break
						}
					case []interface{}:
						log.Printf("[GF2_DEBUG] priceHistory.history type=array len=%d", len(h))
						if len(h) > 0 {
							if m, ok := h[0].(map[string]interface{}); ok {
								hk := make([]string, 0, len(m))
								for k := range m {
									hk = append(hk, k)
								}
								log.Printf("[GF2_DEBUG] priceHistory.history[0] keys=%v", hk)
							}
						}
					default:
						log.Printf("[GF2_DEBUG] priceHistory.history type=%T", hist)
					}
				}
			}
		}
	}

	var results []ProviderResult

	// Debug: log top-level keys to diagnose round-trip return_flights availability
	{
		topKeys := make([]string, 0, len(raw))
		for k := range raw {
			topKeys = append(topKeys, k)
		}
		log.Printf("[GF2_RT_DEBUG] top-level keys=%v hasReturnFlights=%t", topKeys, raw["return_flights"] != nil)
		if best, ok := raw["best_flights"].([]interface{}); ok && len(best) > 0 {
			if f0, ok := best[0].(map[string]interface{}); ok {
				itemKeys := make([]string, 0, len(f0))
				for k := range f0 {
					itemKeys = append(itemKeys, k)
				}
				log.Printf("[GF2_RT_DEBUG] best_flights[0] keys=%v", itemKeys)
			}
		}
	}

	// Try common response shapes: best_flights, other_flights, flights, data.flights
	extractFlights := func(arr []interface{}) {
		for i, fAny := range arr {
			f, ok := fAny.(map[string]interface{})
			if !ok {
				continue
			}
			pr := extractGF2Flight(f, origin, dest, currency, i, departureDate)
			if pr != nil && pr.Price.Amount > 0 {
				results = append(results, *pr)
			}
		}
	}

	if best, ok := raw["best_flights"].([]interface{}); ok {
		extractFlights(best)
	}
	if other, ok := raw["other_flights"].([]interface{}); ok {
		extractFlights(other)
	}
	if flights, ok := raw["flights"].([]interface{}); ok {
		extractFlights(flights)
	}
	if data, ok := raw["data"].(map[string]interface{}); ok {
		if fl, ok := data["flights"].([]interface{}); ok {
			extractFlights(fl)
		}
		if fl, ok := data["results"].([]interface{}); ok {
			extractFlights(fl)
		}
		if fl, ok := data["best_flights"].([]interface{}); ok {
			extractFlights(fl)
		}
		if fl, ok := data["other_flights"].([]interface{}); ok {
			extractFlights(fl)
		}
		// GF2 API: data.itineraries (map or array) + data.priceHistory
		priceHistory := data["priceHistory"]
		if itinsArr, ok := data["itineraries"].([]interface{}); ok {
			extractGF2Itineraries(itinsArr, priceHistory, origin, dest, currency, departureDate, &results)
		}
		if itinsMap, ok := data["itineraries"].(map[string]interface{}); ok {
			extractGF2ItinerariesFromMap(itinsMap, priceHistory, origin, dest, currency, departureDate, &results)
		}
		// Nested: data.data.flights or data.search_results etc
		if inner, ok := data["data"].(map[string]interface{}); ok {
			if fl, ok := inner["flights"].([]interface{}); ok {
				extractFlights(fl)
			}
			if fl, ok := inner["best_flights"].([]interface{}); ok {
				extractFlights(fl)
			}
			if itins, ok := inner["itineraries"].([]interface{}); ok {
				extractFlights(itins)
			}
		}
	}

	// Sort by price
	for i := 0; i < len(results); i++ {
		for j := i + 1; j < len(results); j++ {
			if results[j].Price.Amount < results[i].Price.Amount {
				results[i], results[j] = results[j], results[i]
			}
		}
	}

	// SerpAPI round-trip: top-level return_flights array holds return options separate from best_flights.
	// Attach the best available return leg to any outbound-only result (1 leg).
	attachReturnLegsFromArray := func(retArr []interface{}) {
		var bestReturnLeg *Leg
		for _, rAny := range retArr {
			r, _ := rAny.(map[string]interface{})
			if r == nil {
				continue
			}
			if flightsArr, ok := r["flights"].([]interface{}); ok && len(flightsArr) > 0 {
				if leg := extractGF2LegFromFlightsArray(flightsArr, dest, origin, departureDate); leg != nil {
					bestReturnLeg = leg
					break
				}
			}
		}
		if bestReturnLeg != nil {
			for i := range results {
				if len(results[i].Legs) == 1 {
					results[i].Legs = append(results[i].Legs, *bestReturnLeg)
				}
			}
		}
	}
	if retFlights, ok := raw["return_flights"].([]interface{}); ok && len(retFlights) > 0 {
		attachReturnLegsFromArray(retFlights)
	}
	if data, ok := raw["data"].(map[string]interface{}); ok {
		if retFlights, ok := data["return_flights"].([]interface{}); ok && len(retFlights) > 0 {
			attachReturnLegsFromArray(retFlights)
		}
	}

	if len(results) == 0 {
		debugKeys()
		// Try to find any array of flight-like objects under data
		if data, ok := raw["data"].(map[string]interface{}); ok {
			for key, val := range data {
				if arr, ok := val.([]interface{}); ok && len(arr) > 0 {
					if first, ok := arr[0].(map[string]interface{}); ok {
						if _, hasPrice := first["price"]; hasPrice {
							log.Printf("[GF2_DEBUG] found array under data.%s with price-like objects", key)
							extractFlights(arr)
						}
						if _, hasFlights := first["flights"]; hasFlights {
							log.Printf("[GF2_DEBUG] found array under data.%s with flights", key)
							extractFlights(arr)
						}
					}
				}
			}
		}
		// Re-sort if we found any
		for i := 0; i < len(results); i++ {
			for j := i + 1; j < len(results); j++ {
				if results[j].Price.Amount < results[i].Price.Amount {
					results[i], results[j] = results[j], results[i]
				}
			}
		}
	}

	return results, nil
}

// extractGF2ItinerariesFromMap parses GF2 data.itineraries when it's a map (id -> itinerary).
func extractGF2ItinerariesFromMap(itinsMap map[string]interface{}, priceHistory interface{}, origin, dest, currency, departureDate string, results *[]ProviderResult) {
	defaultPrice := extractGF2PriceFromHistory(priceHistory)
	log.Printf("[GF2_DEBUG] itineraries map len=%d defaultPrice=%.2f", len(itinsMap), defaultPrice)
	idx := 0
	loggedItin := false
	for id, itinAny := range itinsMap {
		// google-flights2 uses itineraries: { "topFlights": [...], "otherFlights": [...] }
		if arr, ok := itinAny.([]interface{}); ok {
			if !loggedItin && len(arr) > 0 {
				if fm, ok := arr[0].(map[string]interface{}); ok {
					keys := make([]string, 0, len(fm))
					for k := range fm {
						keys = append(keys, k)
					}
					log.Printf("[GF2_DEBUG] first itinerary[%s][0] keys=%v", id, keys)
					loggedItin = true
				}
			}
			for _, fAny := range arr {
				itin, ok := fAny.(map[string]interface{})
				if !ok {
					continue
				}
				amount := extractGF2Price(itin)
				if amount <= 0 {
					amount = defaultPrice
				}
				if amount <= 0 {
					continue
				}
				pr := buildGF2ResultFromItinerary(itin, origin, dest, currency, amount, idx, departureDate)
				if pr != nil {
					pr.ID = fmt.Sprintf("gf2_%s_%d", id, idx)
					*results = append(*results, *pr)
					idx++
				}
			}
			continue
		}

		itin, ok := itinAny.(map[string]interface{})
		if !ok {
			log.Printf("[GF2_DEBUG] itinerary %q type=%T (not map or []interface)", id, itinAny)
			continue
		}
		if !loggedItin {
			keys := make([]string, 0, len(itin))
			for k := range itin {
				keys = append(keys, k)
			}
			log.Printf("[GF2_DEBUG] first itinerary keys=%v", keys)
			loggedItin = true
		}
		amount := extractGF2Price(itin)
		if amount <= 0 {
			amount = defaultPrice
		}
		if amount <= 0 {
			continue
		}
		pr := buildGF2ResultFromItinerary(itin, origin, dest, currency, amount, idx, departureDate)
		if pr != nil {
			pr.ID = fmt.Sprintf("gf2_%s", id)
			*results = append(*results, *pr)
			idx++
		}
	}
}

func extractGF2PriceFromHistory(priceHistory interface{}) float64 {
	if ph, ok := priceHistory.(map[string]interface{}); ok {
		if summary, ok := ph["summary"].(map[string]interface{}); ok {
			// summary has: high, current, low, typical - may be number, string, or {amount/price/value}
			for _, key := range []string{"current", "low", "typical"} {
				v := summary[key]
				if v == nil {
					continue
				}
				if amt := toFloat64(v); amt > 0 {
					return amt
				}
				if m, ok := v.(map[string]interface{}); ok {
					if amt := extractGF2Price(m); amt > 0 {
						return amt
					}
				}
			}
		}
		if history, ok := ph["history"].([]interface{}); ok && len(history) > 0 {
			if h, ok := history[0].(map[string]interface{}); ok {
				return toFloat64(h["value"])
			}
		}
	}
	return 0
}

// extractGF2Itineraries parses GF2 data.itineraries + priceHistory structure (array form).
func extractGF2Itineraries(itins []interface{}, priceHistory interface{}, origin, dest, currency, departureDate string, results *[]ProviderResult) {
	priceByID := make(map[string]float64)
	defaultPrice := extractGF2PriceFromHistory(priceHistory)
	if defaultPrice > 0 {
		priceByID["_default"] = defaultPrice
	}
	if ph, ok := priceHistory.(map[string]interface{}); ok {
		if history, ok := ph["history"].(map[string]interface{}); ok {
			for id, v := range history {
				if amt := toFloat64(v); amt > 0 {
					priceByID[id] = amt
				}
			}
		}
		// history might be array of {id, price}
		if historyArr, ok := ph["history"].([]interface{}); ok {
			for _, hAny := range historyArr {
				if h, ok := hAny.(map[string]interface{}); ok {
					id, _ := h["id"].(string)
					amt := extractGF2Price(h)
					if amt > 0 && id != "" {
						priceByID[id] = amt
					}
				}
			}
		}
	}

	for i, itinAny := range itins {
		itin, ok := itinAny.(map[string]interface{})
		if !ok {
			continue
		}
		amount := extractGF2Price(itin)
		if amount <= 0 {
			if id, _ := itin["id"].(string); id != "" {
				amount = priceByID[id]
			}
			if amount <= 0 {
				amount = priceByID["_default"]
			}
			if amount <= 0 && defaultPrice > 0 {
				amount = defaultPrice // use first itinerary's price as fallback when no id match
			}
		}
		if amount <= 0 {
			continue
		}

		pr := buildGF2ResultFromItinerary(itin, origin, dest, currency, amount, i, departureDate)
		if pr != nil {
			*results = append(*results, *pr)
		}
	}
}

func buildGF2ResultFromItinerary(itin map[string]interface{}, origin, dest, currency string, amount float64, idx int, departureDate string) *ProviderResult {
	var legs []Leg
	var totalDur int

	// SerpAPI-style: flights array = segments in one leg
	if flightsArr, ok := itin["flights"].([]interface{}); ok && len(flightsArr) > 0 {
		var segs []Segment
		for _, sAny := range flightsArr {
			s, _ := sAny.(map[string]interface{})
			if s == nil {
				continue
			}
			seg := extractGF2SegmentFromFlight(s, origin, dest, departureDate)
			if seg != nil {
				segs = append(segs, *seg)
				totalDur += seg.DurationMinutes
			}
		}
		if len(segs) > 0 {
			legs = append(legs, Leg{Segments: segs})
		}
	}
	// segments array (some APIs use "segments" instead of "flights")
	if len(legs) == 0 {
		if segsArr, ok := itin["segments"].([]interface{}); ok && len(segsArr) > 0 {
			var segs []Segment
			for _, sAny := range segsArr {
				s, _ := sAny.(map[string]interface{})
				if s == nil {
					continue
				}
				seg := extractGF2SegmentFromFlight(s, origin, dest, departureDate)
				if seg == nil {
					var segDur int
					seg, segDur = extractGF2Segment(s, origin, dest, departureDate)
					if seg != nil {
						segs = append(segs, *seg)
						totalDur += segDur
					}
				} else {
					segs = append(segs, *seg)
					totalDur += seg.DurationMinutes
				}
			}
			if len(segs) > 0 {
				legs = append(legs, Leg{Segments: segs})
			}
		}
	}
	// legs array
	if len(legs) == 0 {
		if legsArr, ok := itin["legs"].([]interface{}); ok {
			for _, lAny := range legsArr {
				l, _ := lAny.(map[string]interface{})
				if l == nil {
					continue
				}
				seg, dur := extractGF2Leg(l, origin, dest, departureDate)
				if len(seg) > 0 {
					legs = append(legs, Leg{Segments: seg})
					totalDur += dur
				}
			}
		}
	}
	// SerpAPI round-trip: return_flights embedded within this itinerary item
	if retFlightsArr, ok := itin["return_flights"].([]interface{}); ok && len(retFlightsArr) > 0 {
		if retLeg := extractGF2LegFromFlightsArray(retFlightsArr, dest, origin, departureDate); retLeg != nil {
			legs = append(legs, *retLeg)
		}
	}
	if totalDur == 0 {
		totalDur = extractGF2DurationMinutes(itin, "total_duration", "duration", "duration_minutes")
	}
	if totalDur == 0 {
		if depS, _ := itin["departure_time"].(string); depS != "" {
			if arrS, _ := itin["arrival_time"].(string); arrS != "" {
				if depT, err := parseGF2TimeWithDateHint(depS, departureDate); err == nil && !depT.IsZero() {
					if arrT, err := parseGF2TimeWithDateHint(arrS, departureDate); err == nil && !arrT.IsZero() {
						if mins := int(arrT.Sub(depT).Minutes()); mins > 0 {
							totalDur = mins
						}
					}
				}
			}
		}
	}
	if totalDur == 0 && len(legs) > 0 {
		durVal := itin["duration"]
		depVal := itin["departure_time"]
		arrVal := itin["arrival_time"]
		log.Printf("[GF2_DEBUG] itinerary totalDur=0; duration=%v(%T) departure_time=%v(%T) arrival_time=%v(%T)",
			durVal, durVal, depVal, depVal, arrVal, arrVal)
	}
	if len(legs) == 0 {
		return nil
	}

	// When we have a total duration but individual segments don't, distribute to the single-segment case
	// so computeOutboundSummary can pick it up.
	if totalDur > 0 && len(legs) == 1 && len(legs[0].Segments) == 1 && legs[0].Segments[0].DurationMinutes <= 0 {
		legs[0].Segments[0].DurationMinutes = totalDur
	}

	// Propagate itinerary-level departure_time/arrival_time to segments when segment times are zero.
	if len(legs) > 0 {
		firstSeg := &legs[0].Segments[0]
		lastLeg := &legs[len(legs)-1]
		lastSeg := &lastLeg.Segments[len(lastLeg.Segments)-1]

		if firstSeg.DepartureTime.IsZero() {
			if depS, _ := itin["departure_time"].(string); depS != "" {
				if t, err := parseGF2TimeWithDateHint(depS, departureDate); err == nil {
					firstSeg.DepartureTime = t
				}
			}
		}
		if lastSeg.ArrivalTime.IsZero() {
			if arrS, _ := itin["arrival_time"].(string); arrS != "" {
				if t, err := parseGF2TimeWithDateHint(arrS, departureDate); err == nil {
					lastSeg.ArrivalTime = t
				}
			}
		}
		// If we now have both times on a single-segment flight, derive arrival from dep+dur or vice versa.
		if len(legs) == 1 && len(legs[0].Segments) == 1 {
			seg := &legs[0].Segments[0]
			if seg.ArrivalTime.IsZero() && !seg.DepartureTime.IsZero() && seg.DurationMinutes > 0 {
				seg.ArrivalTime = seg.DepartureTime.Add(time.Duration(seg.DurationMinutes) * time.Minute)
			}
			if seg.DepartureTime.IsZero() && !seg.ArrivalTime.IsZero() && seg.DurationMinutes > 0 {
				seg.DepartureTime = seg.ArrivalTime.Add(-time.Duration(seg.DurationMinutes) * time.Minute)
			}
		}
	}

	deepLink := ""
	if u, ok := itin["link"].(string); ok && strings.HasPrefix(u, "http") {
		deepLink = u
	}
	if u, ok := itin["booking_link"].(string); ok && strings.HasPrefix(u, "http") {
		deepLink = u
	}

	return &ProviderResult{
		ID:              fmt.Sprintf("gf2_itin_%d", idx),
		Price:           Monetary{Currency: currency, Amount: amount},
		DurationMinutes: totalDur,
		Legs:            legs,
		Source:          "googleflights2",
		DeepLink:        deepLink,
	}
}

func toFloat64(v interface{}) float64 {
	switch x := v.(type) {
	case float64:
		return x
	case int:
		return float64(x)
	case string:
		return parsePriceString(x)
	default:
		return 0
	}
}

func extractGF2Flight(f map[string]interface{}, origin, dest, currency string, idx int, departureDate string) *ProviderResult {
	amount := extractGF2Price(f)
	if amount <= 0 {
		return nil
	}

	var legs []Leg
	var totalDur int

	// SerpAPI-style: "flights" array = segments in one leg (e.g. PEK->HND->LAX->AUS)
	if flightsArr, ok := f["flights"].([]interface{}); ok && len(flightsArr) > 0 {
		var segs []Segment
		for _, sAny := range flightsArr {
			s, _ := sAny.(map[string]interface{})
			if s == nil {
				continue
			}
			seg := extractGF2SegmentFromFlight(s, origin, dest, departureDate)
			if seg != nil {
				segs = append(segs, *seg)
				totalDur += seg.DurationMinutes
			}
		}
		if len(segs) > 0 {
			legs = append(legs, Leg{Segments: segs})
		}
	}
	// Try legs (each leg = array of segments), or outbound/return
	if len(legs) == 0 {
		if legsArr, ok := f["legs"].([]interface{}); ok {
			for _, lAny := range legsArr {
				l, _ := lAny.(map[string]interface{})
				if l == nil {
					continue
				}
				seg, dur := extractGF2Leg(l, origin, dest, departureDate)
				if len(seg) > 0 {
					legs = append(legs, Leg{Segments: seg})
					totalDur += dur
				}
			}
		}
	}
	if len(legs) == 0 {
		if outbound, ok := f["outbound"].(map[string]interface{}); ok {
			seg, dur := extractGF2Leg(outbound, origin, dest, departureDate)
			if len(seg) > 0 {
				legs = append(legs, Leg{Segments: seg})
				totalDur += dur
			}
		}
	}
	if ret, ok := f["return"].(map[string]interface{}); ok {
		seg, dur := extractGF2Leg(ret, dest, origin, departureDate)
		if len(seg) > 0 {
			legs = append(legs, Leg{Segments: seg})
			totalDur += dur
		}
	}
	// SerpAPI round-trip: return_flights embedded within each result item
	if retFlightsArr, ok := f["return_flights"].([]interface{}); ok && len(retFlightsArr) > 0 {
		if retLeg := extractGF2LegFromFlightsArray(retFlightsArr, dest, origin, departureDate); retLeg != nil {
			legs = append(legs, *retLeg)
		}
	}
	if totalDur == 0 {
		totalDur = extractGF2DurationMinutes(f, "total_duration", "duration", "duration_minutes")
	}
	if totalDur == 0 {
		if depS, _ := f["departure_time"].(string); depS != "" {
			if arrS, _ := f["arrival_time"].(string); arrS != "" {
				if depT, err := parseGF2TimeWithDateHint(depS, departureDate); err == nil && !depT.IsZero() {
					if arrT, err := parseGF2TimeWithDateHint(arrS, departureDate); err == nil && !arrT.IsZero() {
						if mins := int(arrT.Sub(depT).Minutes()); mins > 0 {
							totalDur = mins
						}
					}
				}
			}
		}
	}
	if len(legs) == 0 {
		return nil
	}

	deepLink := ""
	if u, ok := f["link"].(string); ok && strings.HasPrefix(u, "http") {
		deepLink = u
	}
	if u, ok := f["booking_link"].(string); ok && strings.HasPrefix(u, "http") {
		deepLink = u
	}
	if u, ok := f["deep_link"].(string); ok && strings.HasPrefix(u, "http") {
		deepLink = u
	}

	return &ProviderResult{
		ID:              fmt.Sprintf("gf2_%d", idx),
		Price:           Monetary{Currency: currency, Amount: amount},
		DurationMinutes: totalDur,
		Legs:            legs,
		Source:          "googleflights2",
		DeepLink:        deepLink,
	}
}

// extractGF2LegFromFlightsArray converts a SerpAPI-style "flights" array (segment list) into a single Leg.
// Used to parse embedded return_flights within a result item.
func extractGF2LegFromFlightsArray(flightsArr []interface{}, defaultFrom, defaultTo, departureDate string) *Leg {
	var segs []Segment
	for _, sAny := range flightsArr {
		s, _ := sAny.(map[string]interface{})
		if s == nil {
			continue
		}
		seg := extractGF2SegmentFromFlight(s, defaultFrom, defaultTo, departureDate)
		if seg != nil {
			segs = append(segs, *seg)
		}
	}
	if len(segs) == 0 {
		return nil
	}
	l := Leg{Segments: segs}
	return &l
}

func extractGF2Price(f map[string]interface{}) float64 {
	if p, ok := f["price"].(float64); ok && p > 0 {
		return p
	}
	if p, ok := f["price"].(int); ok && p > 0 {
		return float64(p)
	}
	if p, ok := f["total_price"].(float64); ok && p > 0 {
		return p
	}
	if p, ok := f["total_price"].(int); ok && p > 0 {
		return float64(p)
	}
	if pm, ok := f["price"].(map[string]interface{}); ok {
		if a, ok := pm["amount"].(float64); ok {
			return a
		}
		if a, ok := pm["total"].(float64); ok {
			return a
		}
	}
	// SerpAPI-style: extensions array with price string
	if ext, ok := f["extensions"].([]interface{}); ok {
		for _, eAny := range ext {
			e, _ := eAny.(map[string]interface{})
			if e == nil {
				continue
			}
			if s, ok := e["price"].(string); ok && s != "" {
				if v := parsePriceString(s); v > 0 {
					return v
				}
			}
		}
	}
	// Price as string e.g. "₹51,984" or "$199"
	if s, ok := f["price"].(string); ok && s != "" {
		return parsePriceString(s)
	}
	// priceHistory.summary style: cheapest, lowest_price, min, current, low, typical
	if p, ok := f["cheapest"].(float64); ok && p > 0 {
		return p
	}
	if p, ok := f["current"].(float64); ok && p > 0 {
		return p
	}
	if p, ok := f["low"].(float64); ok && p > 0 {
		return p
	}
	if p, ok := f["typical"].(float64); ok && p > 0 {
		return p
	}
	if p, ok := f["lowest_price"].(float64); ok && p > 0 {
		return p
	}
	if p, ok := f["min_price"].(float64); ok && p > 0 {
		return p
	}
	return 0
}

func parsePriceString(s string) float64 {
	var buf []byte
	for _, r := range s {
		if r >= '0' && r <= '9' || r == '.' {
			buf = append(buf, byte(r))
		}
	}
	if len(buf) == 0 {
		return 0
	}
	var v float64
	_, _ = fmt.Sscanf(string(buf), "%f", &v)
	return v
}

func extractGF2Leg(leg map[string]interface{}, defaultFrom, defaultTo, departureDate string) ([]Segment, int) {
	var segs []Segment
	totalDur := 0

	depTime := time.Time{}
	arrTime := time.Time{}
	carrier := ""
	flightNum := ""
	from := defaultFrom
	to := defaultTo

	if d, ok := leg["departure"].(string); ok && d != "" {
		from = d
	}
	if a, ok := leg["arrival"].(string); ok && a != "" {
		to = a
	}
	if dt, ok := leg["departure_time"].(string); ok {
		depTime, _ = parseGF2TimeWithDateHint(dt, departureDate)
	}
	if at, ok := leg["arrival_time"].(string); ok {
		arrTime, _ = parseGF2TimeWithDateHint(at, departureDate)
	}
	if c, ok := leg["airline"].(string); ok {
		carrier = c
	}
	if c, ok := leg["carrier"].(string); ok {
		carrier = c
	}
	if fn, ok := leg["flight_number"].(string); ok {
		flightNum = fn
	}
	if o, ok := leg["origin"].(string); ok && o != "" {
		from = o
	}
	if d, ok := leg["destination"].(string); ok && d != "" {
		to = d
	}
	if o, ok := leg["departure_airport"].(string); ok && o != "" {
		from = o
	} else if depMap, ok := leg["departure_airport"].(map[string]interface{}); ok {
		if code := gf2AirportCode(depMap); code != "" {
			from = code
		}
	}
	if d, ok := leg["arrival_airport"].(string); ok && d != "" {
		to = d
	} else if arrMap, ok := leg["arrival_airport"].(map[string]interface{}); ok {
		if code := gf2AirportCode(arrMap); code != "" {
			to = code
		}
	}

	durMin := extractGF2DurationMinutes(leg, "duration", "duration_minutes", "total_duration")
	if !depTime.IsZero() && !arrTime.IsZero() {
		durMin = int(arrTime.Sub(depTime).Minutes())
	}

	// Handle segments array
	if segsArr, ok := leg["segments"].([]interface{}); ok && len(segsArr) > 0 {
		for _, sAny := range segsArr {
			s, _ := sAny.(map[string]interface{})
			if s == nil {
				continue
			}
			seg, dur := extractGF2Segment(s, defaultFrom, defaultTo, departureDate)
			if seg != nil {
				segs = append(segs, *seg)
				totalDur += dur
			}
		}
	}
	if len(segs) == 0 {
		// Single segment from leg-level fields. Ensure arrive != depart when we have duration.
		// Never use time-only parsed value for both (causes "02:20 → 02:20"); derive arrival from dep+duration when needed.
		arr := arrTime
		if arr.IsZero() && !depTime.IsZero() && durMin > 0 {
			arr = depTime.Add(time.Duration(durMin) * time.Minute)
		}
		if !arr.IsZero() && depTime.IsZero() && durMin > 0 {
			depTime = arr.Add(-time.Duration(durMin) * time.Minute)
		}
		segs = append(segs, Segment{
			From:             from,
			To:               to,
			DepartureTime:    depTime,
			ArrivalTime:      arr,
			MarketingCarrier: carrier,
			FlightNumber:     flightNum,
			DurationMinutes:  durMin,
			CabinClass:       "ECONOMY",
		})
		totalDur = durMin
	}

	return segs, totalDur
}

// gf2AirportCode extracts the IATA code from an airport map, trying common field names.
func gf2AirportCode(m map[string]interface{}) string {
	for _, key := range []string{"id", "airport_code", "code", "iata", "iata_code"} {
		if v, ok := m[key].(string); ok && v != "" {
			return v
		}
	}
	return ""
}

// extractGF2SegmentFromFlight parses SerpAPI-style segment: departure_airport{id,time}, arrival_airport{id,time}, duration, airline, flight_number.
func extractGF2SegmentFromFlight(s map[string]interface{}, defaultFrom, defaultTo, departureDate string) *Segment {
	from := defaultFrom
	to := defaultTo
	depTime := time.Time{}
	arrTime := time.Time{}
	carrier := ""
	flightNum := ""
	durMin := 0

	if dep, ok := s["departure_airport"].(map[string]interface{}); ok {
		if code := gf2AirportCode(dep); code != "" {
			from = code
		}
		if t, ok := dep["time"].(string); ok {
			depTime, _ = parseGF2TimeWithDateHint(t, departureDate)
		}
	}
	if arr, ok := s["arrival_airport"].(map[string]interface{}); ok {
		if code := gf2AirportCode(arr); code != "" {
			to = code
		}
		if t, ok := arr["time"].(string); ok {
			arrTime, _ = parseGF2TimeWithDateHint(t, departureDate)
		}
	}
	if depTime.IsZero() && arrTime.IsZero() {
		if t, ok := s["departure_time"].(string); ok {
			depTime, _ = parseGF2TimeWithDateHint(t, departureDate)
		}
		if t, ok := s["arrival_time"].(string); ok {
			arrTime, _ = parseGF2TimeWithDateHint(t, departureDate)
		}
	}
	if c, ok := s["airline"].(string); ok {
		carrier = c
	}
	if fn, ok := s["flight_number"].(string); ok {
		flightNum = fn
		// Extract carrier code from "NH 962" -> "NH" when airline not set
		if carrier == "" && len(fn) >= 2 {
			parts := strings.Fields(fn)
			if len(parts) > 0 {
				carrier = parts[0]
			}
		}
	}
	if durMin == 0 {
		durMin = extractGF2DurationMinutes(s, "duration", "duration_minutes", "extended_duration", "flight_duration")
	}
	if !depTime.IsZero() && !arrTime.IsZero() {
		durMin = int(arrTime.Sub(depTime).Minutes())
	}
	if arrTime.IsZero() && !depTime.IsZero() && durMin > 0 {
		arrTime = depTime.Add(time.Duration(durMin) * time.Minute)
	}
	if depTime.IsZero() && !arrTime.IsZero() && durMin > 0 {
		depTime = arrTime.Add(-time.Duration(durMin) * time.Minute)
	}

	if depTime.IsZero() || arrTime.IsZero() {
		rawDep := s["departure_airport"]
		rawArr := s["arrival_airport"]
		rawDepT := s["departure_time"]
		rawArrT := s["arrival_time"]
		log.Printf("[GF2_TIME_DEBUG] segment depZero=%t arrZero=%t departure_airport=%v(%T) arrival_airport=%v(%T) departure_time=%v(%T) arrival_time=%v(%T) dateHint=%s",
			depTime.IsZero(), arrTime.IsZero(), rawDep, rawDep, rawArr, rawArr, rawDepT, rawDepT, rawArrT, rawArrT, departureDate)
	}

	return &Segment{
		From:             from,
		To:               to,
		DepartureTime:    depTime,
		ArrivalTime:      arrTime,
		MarketingCarrier: carrier,
		FlightNumber:     flightNum,
		DurationMinutes:  durMin,
		CabinClass:       "ECONOMY",
	}
}

func extractGF2Segment(seg map[string]interface{}, defaultFrom, defaultTo, departureDate string) (*Segment, int) {
	from := defaultFrom
	to := defaultTo
	depTime := time.Time{}
	arrTime := time.Time{}
	carrier := ""
	flightNum := ""
	durMin := 0

	if o, ok := seg["origin"].(string); ok && o != "" {
		from = o
	}
	if d, ok := seg["destination"].(string); ok && d != "" {
		to = d
	}
	if dt, ok := seg["departure_time"].(string); ok {
		depTime, _ = parseGF2TimeWithDateHint(dt, departureDate)
	}
	if at, ok := seg["arrival_time"].(string); ok {
		arrTime, _ = parseGF2TimeWithDateHint(at, departureDate)
	}
	if c, ok := seg["airline"].(string); ok {
		carrier = c
	}
	if fn, ok := seg["flight_number"].(string); ok {
		flightNum = fn
	}
	if durMin == 0 {
		durMin = extractGF2DurationMinutes(seg, "duration", "duration_minutes", "extended_duration", "flight_duration")
	}
	if !depTime.IsZero() && !arrTime.IsZero() {
		durMin = int(arrTime.Sub(depTime).Minutes())
	}
	if arrTime.IsZero() && !depTime.IsZero() && durMin > 0 {
		arrTime = depTime.Add(time.Duration(durMin) * time.Minute)
	}
	if depTime.IsZero() && !arrTime.IsZero() && durMin > 0 {
		depTime = arrTime.Add(-time.Duration(durMin) * time.Minute)
	}

	return &Segment{
		From:             from,
		To:               to,
		DepartureTime:    depTime,
		ArrivalTime:      arrTime,
		MarketingCarrier: carrier,
		FlightNumber:     flightNum,
		DurationMinutes:  durMin,
		CabinClass:       "ECONOMY",
	}, durMin
}

func truncateGF2(s string, max int) string {
	if len(s) <= max {
		return s
	}
	return s[:max] + "..."
}

// parseGF2TimeWithDateHint first tries parseGF2Time (full datetime), then combines
// time-only strings with the provided date hint (e.g. "2026-04-10") to produce a full datetime.
func parseGF2TimeWithDateHint(s, dateHint string) (time.Time, error) {
	s = strings.TrimSpace(s)
	if s == "" {
		return time.Time{}, fmt.Errorf("empty")
	}
	// Try full datetime first.
	if t, err := parseGF2Time(s); err == nil {
		return t, nil
	}
	// If no date hint available, we cannot resolve time-only strings.
	dateHint = strings.TrimSpace(dateHint)
	if dateHint == "" {
		return time.Time{}, fmt.Errorf("time-only %q with no date hint", s)
	}
	// Time-only formats: combine with date hint.
	timeOnlyFormats := []string{
		"3:04 PM",
		"03:04 PM",
		"3:04PM",
		"03:04PM",
		"15:04",
		"3:04 pm",
		"03:04 pm",
	}
	for _, tf := range timeOnlyFormats {
		combined := dateHint + " " + s
		fullFmt := "2006-01-02 " + tf
		if t, err := time.ParseInLocation(fullFmt, combined, time.UTC); err == nil {
			return t, nil
		}
	}
	// Also try "date, time" composite formats the API might return.
	compositeFormats := []string{
		"2006-01-02, 3:04 PM",
		"2006-01-02 3:04 PM",
		"2006-01-02, 03:04 PM",
		"2006-01-02 03:04 PM",
		"Jan 2, 2006, 3:04 PM",
		"Jan 2, 2006 3:04 PM",
		"January 2, 2006 3:04 PM",
		"January 2, 2006, 3:04 PM",
		"2 Jan 2006 15:04",
		"2 Jan 2006, 15:04",
		"Mon, Jan 2, 3:04 PM",
	}
	for _, cf := range compositeFormats {
		if t, err := time.ParseInLocation(cf, s, time.UTC); err == nil {
			return t, nil
		}
	}
	return time.Time{}, fmt.Errorf("could not parse %q with date hint %q", s, dateHint)
}

// parseGF2Time parses full date-time strings only. Time-only (e.g. "15:04") is rejected
// to avoid 0001-01-01 and identical depart/arrive display ("02:20 → 02:20" bug).
func parseGF2Time(s string) (time.Time, error) {
	if s == "" {
		return time.Time{}, fmt.Errorf("empty")
	}
	// Only full date-time formats; do NOT include "15:04" (time-only)
	formats := []string{
		time.RFC3339,
		time.RFC3339Nano,
		"2006-01-02T15:04:05.999Z",
		"2006-01-02T15:04:05Z",
		"2006-01-02T15:04:05",
		"2006-01-02T15:04",
		"2006-01-02 15:04:05",
		"2006-01-02 15:04",
		"2006-1-2 15:04",
		"2006-1-2 15:04:05",
		"2006-1-2T15:04:05",
		"2006-1-2T15:04",
		"Jan 2, 2006, 3:04 PM",
		"Jan 2, 2006 3:04 PM",
		"Jan 2, 3:04 PM",
	}
	for _, f := range formats {
		if t, err := time.ParseInLocation(f, s, time.UTC); err == nil {
			return t, nil
		}
		if t, err := time.Parse(f, s); err == nil {
			return t.UTC(), nil
		}
	}
	return time.Time{}, fmt.Errorf("could not parse %q", s)
}

// extractGF2DurationMinutes reads duration from a map using multiple possible API field names and types.
// Tries each key in order; for each key tries: number (float64/int), string (parsed), or object with "minutes"/"min"/"value".
func extractGF2DurationMinutes(m map[string]interface{}, keys ...string) int {
	for _, key := range keys {
		v, ok := m[key]
		if !ok {
			continue
		}
		switch x := v.(type) {
		case float64:
			if x > 0 {
				return int(x)
			}
		case int:
			if x > 0 {
				return x
			}
		case string:
			if n := parseGF2DurationMinutes(x); n > 0 {
				return n
			}
		case map[string]interface{}:
			// Direct: minutes, min, value, text (number or string)
			for _, k := range []string{"minutes", "min", "value", "text"} {
				if n, ok := x[k]; ok {
					switch vv := n.(type) {
					case float64:
						if vv > 0 {
							return int(vv)
						}
					case int:
						if vv > 0 {
							return vv
						}
					case string:
						if nn := parseGF2DurationMinutes(vv); nn > 0 {
							return nn
						}
					}
				}
			}
			// hours + minutes (e.g. {"hours": 3, "minutes": 45})
			hours, mins := 0, 0
			if h, ok := x["hours"]; ok {
				switch vv := h.(type) {
				case float64:
					hours = int(vv)
				case int:
					hours = vv
				}
			}
			if m, ok := x["minutes"]; ok {
				switch vv := m.(type) {
				case float64:
					mins = int(vv)
				case int:
					mins = vv
				}
			}
			if hours > 0 || mins > 0 {
				return hours*60 + mins
			}
		}
	}
	return 0
}

// parseGF2DurationMinutes parses duration string (e.g. "PT2H20M", "2h 20m", "140") into minutes.
func parseGF2DurationMinutes(s string) int {
	s = strings.TrimSpace(s)
	if s == "" {
		return 0
	}
	// ISO 8601 PT1H30M
	if strings.HasPrefix(s, "PT") {
		var h, m int
		for i := 2; i < len(s); {
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
			var num int
			if _, err := fmt.Sscanf(s[j:k], "%d", &num); err != nil {
				i = k
				continue
			}
			if k < len(s) {
				switch s[k] {
				case 'H', 'h':
					h = num
				case 'M', 'm':
					m = num
				}
			}
			i = k + 1
		}
		return h*60 + m
	}
	// "2h 20m" or "2h20m"
	var h, m int
	_, _ = fmt.Sscanf(s, "%dh %dm", &h, &m)
	if h != 0 || m != 0 {
		return h*60 + m
	}
	_, _ = fmt.Sscanf(s, "%dh%dm", &h, &m)
	if h != 0 || m != 0 {
		return h*60 + m
	}
	// "2 hr 20 min" or "2 hours 20 minutes"
	_, _ = fmt.Sscanf(s, "%d hr %d min", &h, &m)
	if h != 0 || m != 0 {
		return h*60 + m
	}
	_, _ = fmt.Sscanf(s, "%d hours %d minutes", &h, &m)
	if h != 0 || m != 0 {
		return h*60 + m
	}
	// "2 hr" (no minutes)
	_, _ = fmt.Sscanf(s, "%d hr", &h)
	if h > 0 {
		return h * 60
	}
	var mins int
	if _, err := fmt.Sscanf(s, "%d", &mins); err == nil && mins >= 0 {
		return mins
	}
	return 0
}
