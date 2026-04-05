package main

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"log"
	"net/http"
	"net/url"
	"os"
	"sort"
	"strconv"
	"strings"
	"sync"
	"time"
)

// NOTE: Changed base URL from test to live API
const amadeusBaseURL = "https://api.amadeus.com" // Now using the live API environment
const maxConcurrentTrips = 5                     // Max number of simultaneous date-pair searches to avoid 429 errors
const cheapestSearchMaxOffers = 50               // Max offers per leg when searching for the cheapest single leg

// --- API Response Structures ---

// APIResponse encapsulates the full structured response from the Flight Offers API.
type APIResponse struct {
	Data         []map[string]interface{} `json:"data"`
	Dictionaries map[string]interface{}   `json:"dictionaries"`
	Meta         map[string]interface{}   `json:"meta"`
}

// FullRoundTrip encapsulates a complete round trip flight deal for /month_deals.
type FullRoundTrip struct {
	OutboundFlight map[string]interface{}
	ReturnFlight   map[string]interface{}
	TotalCost      float64
	OutboundDate   string
	ReturnDate     string
	// Store dictionaries (carriers, airports, etc.) for detailed message building in main.go
	Dictionaries map[string]interface{}
}

// --- Utility Helpers ---

// extractRawPrice safely extracts the price from a raw Amadeus flight offer map by checking
// the nested "grandTotal" or "total" fields and converting it to float64.
// This is critical for getting the correct price from the raw offer JSON structure.
func extractRawPrice(flight map[string]interface{}) float64 {
	// 1. Check if price is already a direct float64 (if it was simplified before storage)
	if price, ok := flight["price"].(float64); ok {
		appendDebugLogDe4859(map[string]any{
			"location":     "backend/amadeus_api.go:extractRawPrice",
			"message":      "Price already float64 on offer",
			"hypothesisId": "pricing-1",
			"runId":        "pre-fix",
			"data": map[string]any{
				"price": price,
				"path":  "price (float64)",
			},
		})
		return price
	}

	// 2. Check for the price map structure
	rawPrice, ok := flight["price"]
	if !ok {
		return 0
	}

	priceMap, ok := rawPrice.(map[string]interface{})
	if !ok {
		return 0
	}

	// 3. Extract the price string from "grandTotal" or "total"
	var priceStr string
	sourceField := ""
	if totalStr, found := priceMap["grandTotal"].(string); found {
		priceStr = totalStr
		sourceField = "grandTotal"
	} else if totalStr, found := priceMap["total"].(string); found {
		// Fallback to "total" if "grandTotal" is missing (Amadeus response structure varies)
		priceStr = totalStr
		sourceField = "total"
	} else {
		return 0
	}

	p, err := strconv.ParseFloat(priceStr, 64)
	if err != nil {
		log.Printf("[PRICE_ERROR] Failed to parse float '%s': %v", priceStr, err)
		return 0
	}

	appendDebugLogDe4859(map[string]any{
		"location":     "backend/amadeus_api.go:extractRawPrice",
		"message":      "Parsed offer price",
		"hypothesisId": "pricing-1",
		"runId":        "pre-fix",
		"data": map[string]any{
			"rawPrice":    priceMap,
			"price":       p,
			"sourceField": sourceField,
		},
	})
	return p
}

// mergeDictionaries combines two dictionary maps from Amadeus responses.
func mergeDictionaries(d1, d2 map[string]interface{}) map[string]interface{} {
	if d1 == nil {
		return d2
	}
	if d2 == nil {
		return d1
	}

	merged := make(map[string]interface{})
	// Start with d1
	for k, v := range d1 {
		merged[k] = v
	}

	// Merge d2 into merged (overwriting d1's values for inner map keys)
	for k, v := range d2 {
		if existing, ok := merged[k].(map[string]interface{}); ok {
			if incoming, ok := v.(map[string]interface{}); ok {
				// Safely merge inner maps (e.g., 'carriers', 'locations')
				for innerK, innerV := range incoming {
					existing[innerK] = innerV
				}
				merged[k] = existing
			} else {
				merged[k] = v
			}
		} else {
			merged[k] = v
		}
	}
	return merged
}

// --- Amadeus Client ---

// AmadeusClient handles API key, token management, and requests.
type AmadeusClient struct {
	clientID     string
	clientSecret string
	token        string
	tokenExpiry  time.Time
	mu           sync.Mutex // Mutex to protect token updates
}

// NewAmadeusClient initializes the client and loads credentials from the environment.
func NewAmadeusClient() *AmadeusClient {
	clientID := os.Getenv("AMADEUS_CLIENT_ID")
	clientSecret := os.Getenv("AMADEUS_CLIENT_SECRET")

	if clientID == "" || clientSecret == "" {
		// NOTE: This now points to the live API, so credentials are required.
		log.Fatal("AMADEUS_CLIENT_ID and AMADEUS_CLIENT_SECRET must be set in the .env file.")
	}

	client := &AmadeusClient{
		clientID:     clientID,
		clientSecret: clientSecret,
	}

	if err := client.getAccessToken(); err != nil {
		log.Fatalf("Failed to get initial Amadeus token: %v", err)
	}
	return client
}

// getAccessToken refreshes the Amadeus access token.
func (c *AmadeusClient) getAccessToken() error {
	c.mu.Lock()
	defer c.mu.Unlock()

	// Check if the current token is still valid (with a 5-minute buffer)
	if time.Now().Add(5*time.Minute).Before(c.tokenExpiry) && c.token != "" {
		return nil
	}

	log.Println("[AMADEUS_AUTH] Attempting to refresh access token...")

	data := url.Values{}
	data.Set("grant_type", "client_credentials")
	data.Set("client_id", c.clientID)
	data.Set("client_secret", c.clientSecret)

	req, err := http.NewRequest("POST", amadeusBaseURL+"/v1/security/oauth2/token", strings.NewReader(data.Encode()))
	if err != nil {
		return fmt.Errorf("could not create auth request: %w", err)
	}

	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return fmt.Errorf("failed to send auth request: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		return fmt.Errorf("auth request failed with status %d: %s", resp.StatusCode, string(body))
	}

	var result struct {
		AccessToken string `json:"access_token"`
		ExpiresIn   int    `json:"expires_in"` // in seconds
	}

	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return fmt.Errorf("failed to decode auth response: %w", err)
	}

	c.token = result.AccessToken
	c.tokenExpiry = time.Now().Add(time.Duration(result.ExpiresIn) * time.Second).Add(-1 * time.Minute)
	log.Printf("[AMADEUS_AUTH] Token refreshed. Expires in %d seconds.", result.ExpiresIn)

	return nil
}

// makeAPIRequest handles token refreshing, request signing, and response decoding.
func (c *AmadeusClient) makeAPIRequest(method, endpoint string, queryParams url.Values) (map[string]interface{}, error) {
	if err := c.getAccessToken(); err != nil {
		return nil, fmt.Errorf("failed to refresh access token: %w", err)
	}

	u, err := url.Parse(amadeusBaseURL + endpoint)
	if err != nil {
		return nil, fmt.Errorf("invalid endpoint URL: %w", err)
	}
	u.RawQuery = queryParams.Encode()
	fullURL := u.String()

	log.Printf("[AMADEUS_API] Making request to %s", fullURL)

	req, err := http.NewRequest(method, fullURL, nil)
	if err != nil {
		return nil, fmt.Errorf("could not create request: %w", err)
	}

	c.mu.Lock()
	req.Header.Set("Authorization", "Bearer "+c.token)
	c.mu.Unlock()

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("failed to send request: %w", err)
	}
	defer resp.Body.Close()

	body, _ := io.ReadAll(resp.Body)

	if resp.StatusCode < 200 || resp.StatusCode >= 300 {
		log.Printf("[AMADEUS_ERROR] Status %d for %s: %s", resp.StatusCode, endpoint, string(body))

		var apiError struct {
			Errors []struct {
				Title  string `json:"title"`
				Detail string `json:"detail"`
			} `json:"errors"`
		}
		if err := json.Unmarshal(body, &apiError); err == nil && len(apiError.Errors) > 0 {
			errMsg := fmt.Sprintf("%s: %s", apiError.Errors[0].Title, apiError.Errors[0].Detail)
			return nil, errors.New(errMsg)
		}
		return nil, fmt.Errorf("API request failed with status %d: %s", resp.StatusCode, string(body))
	}

	var result map[string]interface{}
	if err := json.Unmarshal(body, &result); err != nil {
		return nil, fmt.Errorf("failed to decode API response: %w", err)
	}

	return result, nil
}

// FlightOffersSearch performs the main flight search. Uses a single request with max;
// offset is not used (not supported in our Amadeus environment). Optional travelClass
// is sent as query param when non-empty (ECONOMY, PREMIUM_ECONOMY, BUSINESS, FIRST).
// currencyCode is sent to Amadeus (e.g. USD, GBP, EUR); if empty, USD is used.
// adults and children default to 1 and 0 if < 1 or < 0. nonStop restricts to direct flights.
func (c *AmadeusClient) FlightOffersSearch(origin, destination, departureDate, returnDate string, maxOffers int, travelClass string, currencyCode string, adults, children int, nonStop bool) (APIResponse, error) {
	if adults < 1 {
		adults = 1
	}
	if children < 0 {
		children = 0
	}
	queryParams := url.Values{}
	queryParams.Set("originLocationCode", origin)
	queryParams.Set("destinationLocationCode", destination)
	queryParams.Set("departureDate", departureDate)
	queryParams.Set("adults", strconv.Itoa(adults))
	if children > 0 {
		queryParams.Set("children", strconv.Itoa(children))
	}
	queryParams.Set("max", strconv.Itoa(maxOffers))

	if currencyCode == "" {
		currencyCode = "USD"
	}
	queryParams.Set("currencyCode", currencyCode)

	if returnDate != "" {
		queryParams.Set("returnDate", returnDate)
	}

	if travelClass != "" {
		queryParams.Set("travelClass", travelClass)
	}

	if nonStop {
		queryParams.Set("nonStop", "true")
	}

	rawResult, err := c.makeAPIRequest("GET", "/v2/shopping/flight-offers", queryParams)
	if err != nil {
		return APIResponse{}, fmt.Errorf("API request failed: %w", err)
	}

	// Process the raw map response into the structured APIResponse
	var resp APIResponse
	if data, ok := rawResult["data"].([]interface{}); ok {
		offers := make([]map[string]interface{}, 0, len(data))
		for _, item := range data {
			if offerMap, ok := item.(map[string]interface{}); ok {
				offers = append(offers, offerMap)
			}
		}
		resp.Data = offers
	}
	if len(resp.Data) > 0 {
		prettyJSON, err := json.MarshalIndent(resp.Data[0], "", "  ")
		if err == nil {
			log.Printf("[RAW_AMADEUS_OFFER_SAMPLE]\n%s\n", string(prettyJSON))
		}
	}
	if meta, ok := rawResult["meta"].(map[string]interface{}); ok {
		resp.Meta = meta
	}
	if dictionaries, ok := rawResult["dictionaries"].(map[string]interface{}); ok {
		resp.Dictionaries = dictionaries
	}

	return resp, nil
}

// pickCheapestOffer scans a slice of raw Amadeus offers and returns the single
// cheapest one based on extractRawPrice. Returns nil if no offer has a
// positive price.
func pickCheapestOffer(offers []map[string]interface{}) map[string]interface{} {
	var cheapest map[string]interface{}
	lowest := 0.0
	for _, offer := range offers {
		price := extractRawPrice(offer)
		if price <= 0 {
			continue
		}
		if cheapest == nil || price < lowest {
			cheapest = offer
			lowest = price
		}
	}
	return cheapest
}

// searchCheapestSingleLeg is a helper for SearchMonthDeal and SearchDealsRange,
// finding the single cheapest flight for a given origin/destination/date.
// Single request (no offset); picks minimum by extractRawPrice.
// currencyCode is passed to Amadeus (e.g. USD, GBP, EUR); if empty, USD is used.
func (c *AmadeusClient) searchCheapestSingleLeg(origin, destination, date string, currencyCode string, adults, children int, nonStop bool) (map[string]interface{}, map[string]interface{}, error) {
	if currencyCode == "" {
		currencyCode = "USD"
	}
	resp, err := c.FlightOffersSearch(origin, destination, date, "", cheapestSearchMaxOffers, "", currencyCode, adults, children, nonStop)
	if err != nil {
		return nil, nil, err
	}
	if len(resp.Data) == 0 {
		return nil, nil, errors.New("no offers found")
	}

	cheapest := pickCheapestOffer(resp.Data)
	if cheapest == nil {
		return nil, nil, errors.New("no offers with positive price found")
	}

	var validating []string
	if codes, ok := cheapest["validatingAirlineCodes"].([]interface{}); ok {
		for _, c := range codes {
			if s, ok := c.(string); ok && s != "" {
				validating = append(validating, s)
			}
		}
	}

	uniqueCarriers := make(map[string]struct{})
	for _, offer := range resp.Data {
		itinsRaw, ok := offer["itineraries"].([]interface{})
		if !ok || len(itinsRaw) == 0 {
			continue
		}
		firstItin, ok := itinsRaw[0].(map[string]interface{})
		if !ok {
			continue
		}
		segsRaw, ok := firstItin["segments"].([]interface{})
		if !ok {
			continue
		}
		for _, segAny := range segsRaw {
			seg, ok := segAny.(map[string]interface{})
			if !ok {
				continue
			}
			if carrierCode, ok := seg["carrierCode"].(string); ok && carrierCode != "" {
				uniqueCarriers[carrierCode] = struct{}{}
			}
		}
	}
	sample := make([]string, 0, 8)
	for code := range uniqueCarriers {
		sample = append(sample, code)
		if len(sample) >= 8 {
			break
		}
	}

	cheapestPrice := extractRawPrice(cheapest)
	log.Printf("[CHEAPEST_LEG] date=%s offersReturned=%d cheapest=%.2f validating=%v uniqueCarriers=%d sample=%v",
		date, len(resp.Data), cheapestPrice, validating, len(uniqueCarriers), sample)

	return cheapest, resp.Dictionaries, nil
}

// SearchMonthDeals finds the cheapest round-trip flights for a fixed duration
// across all days of the specified month. currencyCode is sent to Amadeus (e.g. USD, GBP); if empty, USD is used.
func (c *AmadeusClient) SearchMonthDeals(origin, destination string, month time.Time, durationDays int, currencyCode string, adults, children int, nonStop bool) ([]FullRoundTrip, error) {
	log.Printf("[MONTH] Starting search for %s to %s in %s for duration %d days.",
		origin, destination, month.Format("January 2006"), durationDays)

	// First bookable day: the later of the 1st of the requested month and tomorrow.
	// Amadeus rejects departure dates that are today or in the past.
	firstOfMonth := time.Date(month.Year(), month.Month(), 1, 0, 0, 0, 0, time.UTC)
	tomorrow := time.Now().UTC().Truncate(24 * time.Hour).AddDate(0, 0, 1)
	currentOutboundDate := firstOfMonth
	if tomorrow.After(firstOfMonth) {
		currentOutboundDate = tomorrow
	}

	// If the whole month is already in the past, bail out immediately.
	if currentOutboundDate.Month() != month.Month() {
		log.Printf("[MONTH] All days in %s are in the past — returning empty result set.", month.Format("January 2006"))
		return nil, nil
	}

	var wg sync.WaitGroup
	semaphore := make(chan struct{}, maxConcurrentTrips)
	tripsChan := make(chan FullRoundTrip, 31)

	// Iterate remaining days of the month (starting from the first bookable day).
	for i := 0; i < 31; i++ {

		outboundDate := currentOutboundDate.AddDate(0, 0, i)

		// Check if we have moved into the next month
		if outboundDate.Month() != month.Month() {
			break // Stop iterating when we exceed the target month
		}

		// Calculate return date
		returnDate := outboundDate.AddDate(0, 0, durationDays)

		// Convert dates to string format for API call
		outboundDateStr := outboundDate.Format("2006-01-02")
		returnDateStr := returnDate.Format("2006-01-02")

		wg.Add(1)

		go func(outboundStr, returnStr string) {
			semaphore <- struct{}{} // Acquire token (limit concurrent goroutines)
			defer func() {
				<-semaphore // Release token
				wg.Done()
			}()

			// --- 1. Find cheapest outbound flight ---
			cheapestOutbound, outboundDictionaries, err := c.searchCheapestSingleLeg(origin, destination, outboundStr, currencyCode, adults, children, nonStop)
			if err != nil {
				// We don't log this as an error, as it's common for no flights to exist on a given day
				// log.Printf("[MONTH:TRIP] Outbound search failed for %s: %v", outboundStr, err)
				return
			}

			// --- 2. Find cheapest return flight ---
			cheapestReturn, returnDictionaries, err := c.searchCheapestSingleLeg(destination, origin, returnStr, currencyCode, adults, children, nonStop)
			if err != nil {
				// log.Printf("[MONTH:TRIP] Return search failed for %s: %v", returnStr, err)
				return
			}

			// --- 3. Combine and send to channel ---
			totalCost := extractRawPrice(cheapestOutbound) + extractRawPrice(cheapestReturn)

			// Merge the dictionaries from both legs to ensure full coverage of all used codes
			combinedDictionaries := mergeDictionaries(outboundDictionaries, returnDictionaries)

			trip := FullRoundTrip{
				OutboundFlight: cheapestOutbound, // Store full raw flight offer
				ReturnFlight:   cheapestReturn,   // Store full raw flight offer
				TotalCost:      totalCost,
				OutboundDate:   outboundStr,
				ReturnDate:     returnStr,
				Dictionaries:   combinedDictionaries, // Store combined dictionaries
			}

			tripsChan <- trip
			log.Printf("[MONTH:TRIP] Found round-trip deal (%s/%s): $%.2f", outboundStr, returnStr, totalCost)

		}(outboundDateStr, returnDateStr)
	}

	wg.Wait()
	close(tripsChan)

	var allTrips []FullRoundTrip
	for trip := range tripsChan {
		allTrips = append(allTrips, trip)
	}

	log.Printf("[MONTH] Finished concurrent search loop. Found %d deals.", len(allTrips))

	// Sort final results by total cost
	sort.Slice(allTrips, func(i, j int) bool {
		return allTrips[i].TotalCost < allTrips[j].TotalCost
	})

	return allTrips, nil
}

// SearchDealsRange finds the cheapest round-trip for each day in [startDate, endDate] (inclusive).
// Lighter than SearchMonthDeals when only a short range is needed (e.g. 14 days for flight-search calendar).
// currencyCode is sent to Amadeus (e.g. USD, GBP); if empty, USD is used.
// anywhereDestinations is the curated list of major global airports searched concurrently
// when a user selects "Anywhere" as the destination. The origin is excluded at search time.
// All results are returned sorted cheapest-first; the frontend paginates them.
var anywhereDestinations = []string{
	// Europe — western
	"LHR", "LGW", "STN", "MAN", "EDI", "BHX", // UK
	"CDG", "ORY", "NCE", "LYS", "MRS",         // France
	"FCO", "MXP", "VCE", "NAP", "BLQ",         // Italy
	"AMS", "BRU", "LUX",                        // Benelux
	"MAD", "BCN", "VLC", "AGP", "PMI", "SVQ",  // Spain
	"LIS", "OPO",                               // Portugal
	"FRA", "MUC", "BER", "HAM", "DUS", "STR",  // Germany
	"ZRH", "GVA",                               // Switzerland
	"VIE",                                      // Austria
	// Europe — north
	"CPH", "OSL", "ARN", "HEL", "KEF", "RKV",  // Scandinavia + Iceland
	// Europe — east / south-east
	"WAW", "KRK", "GDN",                        // Poland
	"PRG", "BUD", "BTS",                        // Czech/Slovakia/Hungary
	"BEG", "SKP", "TGD",                        // Balkans
	"ATH", "SKG", "HER", "RHO",                 // Greece
	"SOF", "OTP", "CLJ",                        // Bulgaria / Romania
	"DUB", "SNN",                               // Ireland
	// Middle East
	"DXB", "AUH", "DOH", "KWI", "BAH", "MCT",  // Gulf
	"IST", "SAW",                               // Turkey
	"AMM", "BEY", "RUH", "JED",                // Levant / Saudi
	"CAI", "HRG", "SSH",                        // Egypt
	// Africa
	"NBO", "JNB", "CPT", "DUR",                 // East / South Africa
	"CMN", "TUN", "ALG",                        // North Africa
	"ADD", "ACC", "LOS", "ABV", "DKR",          // Sub-Saharan
	"DAR", "EBB",                               // East Africa
	// Asia — south
	"DEL", "BOM", "MAA", "BLR", "HYD", "CCU",  // India
	"CMB", "KTM", "DAC",                        // Sri Lanka / Nepal / Bangladesh
	// Asia — south-east
	"BKK", "DMK", "KBV",                        // Thailand
	"SIN",                                      // Singapore
	"KUL", "PEN",                               // Malaysia
	"CGK", "DPS",                               // Indonesia
	"MNL",                                      // Philippines
	"SGN", "HAN",                               // Vietnam
	"REP",                                      // Cambodia
	"RGN",                                      // Myanmar
	// Asia — east
	"HKG",                                      // Hong Kong
	"TPE",                                      // Taiwan
	"ICN", "PUS",                               // South Korea
	"HND", "NRT", "KIX", "NGO", "FUK", "CTS",  // Japan
	"PVG", "PEK", "CAN", "CTU", "WUH", "SZX",  // China
	// Asia-Pacific
	"SYD", "MEL", "BNE", "PER", "ADL",          // Australia
	"AKL", "CHC",                               // New Zealand
	"MLE",                                      // Maldives
	// Americas — North
	"JFK", "EWR", "LGA", "BOS", "PHL", "DCA",  // US North-east
	"ATL", "MCO", "MIA", "FLL", "TPA",          // US South-east
	"ORD", "MDW", "DTW", "MSP", "CLE",          // US Mid-west
	"DFW", "IAH", "AUS", "SAT",                 // US South
	"DEN", "PHX", "LAS", "SLC",                 // US Mountain/West
	"LAX", "SFO", "SEA", "PDX", "SAN",          // US West Coast
	"YYZ", "YUL", "YVR", "YYC",                 // Canada
	"MEX", "GDL", "MTY", "CUN",                 // Mexico
	// Americas — Central & South
	"PTY",                                      // Panama
	"BOG", "MDE",                               // Colombia
	"LIM",                                      // Peru
	"GRU", "GIG", "BSB", "SSA",                 // Brazil
	"EZE", "COR",                               // Argentina
	"SCL",                                      // Chile
	"UIO", "GYE",                               // Ecuador
	"CCS",                                      // Venezuela
	"HAV",                                      // Cuba
}

const exploreMaxConcurrent = 12 // single-date explore: concurrent destination searches

// Month-mode explore: one Flight Cheapest Date Search per destination (see flightDatesCheapestRoundTripMonth).
const exploreMonthConcurrentFlightDates = 12 // parallel /v1/shopping/flight-dates calls

// FlightDestinations finds cheapest one-way prices from origin to a curated list of global
// destinations using the standard Flight Offers Search endpoint (no subscription required).
// departureDate must be a YYYY-MM-DD string.
// FlightDestinationsCtx is the context-aware version of FlightDestinations.
func (c *AmadeusClient) FlightDestinationsCtx(ctx context.Context, origin, departureDate, returnDate, currencyCode string, adults int) ([]map[string]interface{}, error) {
	if adults < 1 {
		adults = 1
	}
	if currencyCode == "" {
		currencyCode = "USD"
	}
	if departureDate == "" {
		departureDate = time.Now().AddDate(0, 0, 14).Format("2006-01-02")
	}

	isRoundTrip := returnDate != ""
	log.Printf("[EXPLORE_SEARCH] origin=%s departure=%s return=%s roundTrip=%v currency=%s adults=%d destinations=%d",
		origin, departureDate, returnDate, isRoundTrip, currencyCode, adults, len(anywhereDestinations))

	type destResult struct {
		destination string
		price       float64
		depDate     string
	}

	resultCh := make(chan destResult, len(anywhereDestinations))
	sem := make(chan struct{}, exploreMaxConcurrent)
	var wg sync.WaitGroup

	for _, dest := range anywhereDestinations {
		if dest == origin {
			continue
		}
		// Stop if context was cancelled
		select {
		case <-ctx.Done():
			break
		default:
		}
		wg.Add(1)
		go func(d string) {
			defer wg.Done()
			// Acquire semaphore slot
			select {
			case sem <- struct{}{}:
			case <-ctx.Done():
				return
			}
			defer func() { <-sem }()

			// Use 3 offers so Amadeus has enough data to construct round-trip combinations
			resp, err := c.FlightOffersSearch(origin, d, departureDate, returnDate, 3, "", currencyCode, adults, 0, false)
			if err != nil {
				log.Printf("[EXPLORE_DEST] %s->%s error: %v", origin, d, err)
				return
			}
			cheapest := pickCheapestOffer(resp.Data)
			if cheapest == nil {
				log.Printf("[EXPLORE_DEST] %s->%s no offers", origin, d)
				return
			}
			price := extractRawPrice(cheapest)
			if price <= 0 {
				log.Printf("[EXPLORE_DEST] %s->%s price=0 (extraction failed)", origin, d)
				return
			}
			log.Printf("[EXPLORE_DEST] %s->%s price=%.2f", origin, d, price)
			resultCh <- destResult{destination: d, price: price, depDate: departureDate}
		}(dest)
	}

	wg.Wait()
	close(resultCh)

	var all []destResult
	for r := range resultCh {
		all = append(all, r)
	}

	log.Printf("[EXPLORE_SEARCH] origin=%s completed: %d/%d destinations returned prices",
		origin, len(all), len(anywhereDestinations))

	sort.Slice(all, func(i, j int) bool { return all[i].price < all[j].price })

	results := make([]map[string]interface{}, 0, len(all))
	for _, r := range all {
		results = append(results, map[string]interface{}{
			"destination":   r.destination,
			"price":         strconv.FormatFloat(r.price, 'f', 2, 64),
			"currency":      currencyCode,
			"departureDate": r.depDate,
		})
	}
	return results, nil
}

// outboundDatesForMonthBookable returns each calendar day in [year, month] with departure >= tomorrow (UTC).
func outboundDatesForMonthBookable(year, month int) []string {
	tomorrow := time.Now().UTC()
	tomorrow = time.Date(tomorrow.Year(), tomorrow.Month(), tomorrow.Day(), 0, 0, 0, 0, time.UTC).AddDate(0, 0, 1)
	lastDay := time.Date(year, time.Month(month)+1, 0, 0, 0, 0, 0, time.UTC).Day()
	var out []string
	for d := 1; d <= lastDay; d++ {
		day := time.Date(year, time.Month(month), d, 0, 0, 0, 0, time.UTC)
		if day.Before(tomorrow) {
			continue
		}
		out = append(out, day.Format("2006-01-02"))
	}
	return out
}

func parseFlightDatesPriceEntry(m map[string]interface{}) float64 {
	priceRaw, ok := m["price"]
	if !ok {
		return 0
	}
	pm, ok := priceRaw.(map[string]interface{})
	if !ok {
		return 0
	}
	totalStr, ok := pm["total"].(string)
	if !ok {
		return 0
	}
	p, err := strconv.ParseFloat(totalStr, 64)
	if err != nil || p <= 0 {
		return 0
	}
	return p
}

// flightDatesCheapestRoundTripMonth uses Amadeus Flight Cheapest Date Search (one HTTP call) to find
// the cheapest round-trip in the month for a fixed stay length. Replaces hundreds of Flight Offers calls.
func (c *AmadeusClient) flightDatesCheapestRoundTripMonth(origin, dest string, year, month, durationDays int, currency string, adults int, nonStop bool) (price float64, depDate string, ok bool) {
	outboundDates := outboundDatesForMonthBookable(year, month)
	if len(outboundDates) == 0 {
		return 0, "", false
	}
	first := outboundDates[0]
	last := outboundDates[len(outboundDates)-1]

	q := url.Values{}
	q.Set("origin", origin)
	q.Set("destination", dest)
	q.Set("departureDate", first+","+last)
	q.Set("oneWay", "false")
	q.Set("duration", strconv.Itoa(durationDays))
	if currency != "" {
		q.Set("currency", currency)
	}
	if adults >= 1 {
		q.Set("adults", strconv.Itoa(adults))
	}
	if nonStop {
		q.Set("nonStop", "true")
	}

	raw, err := c.makeAPIRequest("GET", "/v1/shopping/flight-dates", q)
	if err != nil {
		log.Printf("[EXPLORE_FLIGHT_DATES] %s->%s: %v", origin, dest, err)
		return 0, "", false
	}
	data, ok := raw["data"].([]interface{})
	if !ok || len(data) == 0 {
		return 0, "", false
	}

	var best float64
	var bestDep string
	for _, item := range data {
		m, ok := item.(map[string]interface{})
		if !ok {
			continue
		}
		depStr, _ := m["departureDate"].(string)
		retStr, _ := m["returnDate"].(string)
		if depStr == "" || retStr == "" {
			continue
		}
		depT, err1 := time.Parse("2006-01-02", depStr)
		retT, err2 := time.Parse("2006-01-02", retStr)
		if err1 != nil || err2 != nil {
			continue
		}
		y, mth, _ := depT.Date()
		if y != year || int(mth) != month {
			continue
		}
		days := int(retT.Sub(depT).Hours() / 24)
		if days != durationDays {
			continue
		}
		pr := parseFlightDatesPriceEntry(m)
		if pr <= 0 {
			continue
		}
		if best == 0 || pr < best {
			best = pr
			bestDep = depStr
		}
	}
	return best, bestDep, best > 0
}

// flightOffersSingleMonthSample is a cheap fallback: one Flight Offers round-trip on a mid-month day.
func (c *AmadeusClient) flightOffersSingleMonthSample(ctx context.Context, origin, dest string, year, month, durationDays int, currency string, adults, children int, nonStop bool) (float64, string, bool) {
	if ctx.Err() != nil {
		return 0, "", false
	}
	dates := outboundDatesForMonthBookable(year, month)
	if len(dates) == 0 {
		return 0, "", false
	}
	dep := dates[len(dates)/2]
	depT, err := time.Parse("2006-01-02", dep)
	if err != nil {
		return 0, "", false
	}
	ret := depT.AddDate(0, 0, durationDays).Format("2006-01-02")
	resp, err := c.FlightOffersSearch(origin, dest, dep, ret, 2, "", currency, adults, children, nonStop)
	if err != nil {
		return 0, "", false
	}
	cheapest := pickCheapestOffer(resp.Data)
	if cheapest == nil {
		return 0, "", false
	}
	p := extractRawPrice(cheapest)
	if p <= 0 {
		return 0, "", false
	}
	return p, dep, true
}

// FlightDestinationsMonthCtx is the monthly-deals-style explore: cheapest round-trip of fixed duration
// in the month. Uses Flight Cheapest Date Search (one call per destination) instead of sampling many
// days × Flight Offers, so the page loads much faster and stays within API limits.
func (c *AmadeusClient) FlightDestinationsMonthCtx(ctx context.Context, origin string, year, month, durationDays int, currencyCode string, adults, children int, nonStop bool) ([]map[string]interface{}, error) {
	if adults < 1 {
		adults = 1
	}
	if children < 0 {
		children = 0
	}
	if durationDays < 1 {
		durationDays = 7
	}
	if currencyCode == "" {
		currencyCode = "USD"
	}

	outboundDates := outboundDatesForMonthBookable(year, month)
	if len(outboundDates) == 0 {
		log.Printf("[EXPLORE_MONTH] origin=%s %04d-%02d: no bookable days in month", origin, year, month)
		return nil, nil
	}

	type destResult struct {
		destination string
		price       float64
		depDate     string
	}

	destinations := make([]string, 0, len(anywhereDestinations))
	for _, dest := range anywhereDestinations {
		if dest != origin {
			destinations = append(destinations, dest)
		}
	}

	log.Printf("[EXPLORE_MONTH] origin=%s %04d-%02d duration=%d bookableDays=%d destinations=%d concurrent=%d (flight-dates per dest)",
		origin, year, month, durationDays, len(outboundDates), len(destinations), exploreMonthConcurrentFlightDates)

	sem := make(chan struct{}, exploreMonthConcurrentFlightDates)
	resultCh := make(chan destResult, len(destinations))
	var wg sync.WaitGroup

	for _, dest := range destinations {
		wg.Add(1)
		go func(d string) {
			defer wg.Done()
			select {
			case sem <- struct{}{}:
			case <-ctx.Done():
				return
			}
			defer func() { <-sem }()

			var price float64
			var dep string
			var ok bool

			// Flight-dates is adult-oriented in practice; with children use offers search only.
			if children == 0 {
				price, dep, ok = c.flightDatesCheapestRoundTripMonth(origin, d, year, month, durationDays, currencyCode, adults, nonStop)
			}
			if !ok {
				price, dep, ok = c.flightOffersSingleMonthSample(ctx, origin, d, year, month, durationDays, currencyCode, adults, children, nonStop)
			}
			if !ok || price <= 0 {
				return
			}
			select {
			case resultCh <- destResult{destination: d, price: price, depDate: dep}:
			case <-ctx.Done():
			}
		}(dest)
	}

	go func() {
		wg.Wait()
		close(resultCh)
	}()

	var all []destResult
	for r := range resultCh {
		all = append(all, r)
		log.Printf("[EXPLORE_MONTH_DEST] %s->%s best=%.2f on %s", origin, r.destination, r.price, r.depDate)
	}

	log.Printf("[EXPLORE_MONTH] origin=%s completed: %d destinations with prices", origin, len(all))

	sort.Slice(all, func(i, j int) bool { return all[i].price < all[j].price })

	results := make([]map[string]interface{}, 0, len(all))
	for _, r := range all {
		results = append(results, map[string]interface{}{
			"destination":   r.destination,
			"price":         strconv.FormatFloat(r.price, 'f', 2, 64),
			"currency":      currencyCode,
			"departureDate": r.depDate,
		})
	}
	return results, nil
}

// FlightDestinations is the legacy wrapper (no context). Kept for backward compatibility.
func (c *AmadeusClient) FlightDestinations(origin, departureDate, returnDate, currencyCode string, adults int) ([]map[string]interface{}, error) {
	return c.FlightDestinationsCtx(context.Background(), origin, departureDate, returnDate, currencyCode, adults)
}

func (c *AmadeusClient) SearchDealsRange(origin, destination string, startDate, endDate time.Time, durationDays int, currencyCode string, adults, children int, nonStop bool) ([]FullRoundTrip, error) {
	// Clamp startDate to tomorrow — Amadeus rejects past/today departure dates.
	tomorrow := time.Now().UTC().Truncate(24 * time.Hour).AddDate(0, 0, 1)
	if tomorrow.After(startDate) {
		startDate = tomorrow
	}

	if startDate.After(endDate) {
		log.Printf("[RANGE] All days in range are in the past — returning empty result set.")
		return nil, nil
	}

	log.Printf("[RANGE] Starting search for %s to %s from %s to %s, duration %d days.",
		origin, destination, startDate.Format("2006-01-02"), endDate.Format("2006-01-02"), durationDays)

	var wg sync.WaitGroup
	semaphore := make(chan struct{}, maxConcurrentTrips)
	tripsChan := make(chan FullRoundTrip, 31)

	for d := startDate; !d.After(endDate); d = d.AddDate(0, 0, 1) {
		outboundDateStr := d.Format("2006-01-02")
		returnDate := d.AddDate(0, 0, durationDays)
		returnDateStr := returnDate.Format("2006-01-02")

		wg.Add(1)
		go func(outboundStr, returnStr string) {
			semaphore <- struct{}{}
			defer func() { <-semaphore; wg.Done() }()

			cheapestOutbound, outboundDictionaries, err := c.searchCheapestSingleLeg(origin, destination, outboundStr, currencyCode, adults, children, nonStop)
			if err != nil {
				return
			}
			cheapestReturn, returnDictionaries, err := c.searchCheapestSingleLeg(destination, origin, returnStr, currencyCode, adults, children, nonStop)
			if err != nil {
				return
			}
			totalCost := extractRawPrice(cheapestOutbound) + extractRawPrice(cheapestReturn)
			combinedDictionaries := mergeDictionaries(outboundDictionaries, returnDictionaries)
			tripsChan <- FullRoundTrip{
				OutboundFlight: cheapestOutbound,
				ReturnFlight:   cheapestReturn,
				TotalCost:      totalCost,
				OutboundDate:   outboundStr,
				ReturnDate:     returnStr,
				Dictionaries:   combinedDictionaries,
			}
		}(outboundDateStr, returnDateStr)
	}

	wg.Wait()
	close(tripsChan)

	var allTrips []FullRoundTrip
	for trip := range tripsChan {
		allTrips = append(allTrips, trip)
	}
	sort.Slice(allTrips, func(i, j int) bool { return allTrips[i].TotalCost < allTrips[j].TotalCost })
	return allTrips, nil
}
