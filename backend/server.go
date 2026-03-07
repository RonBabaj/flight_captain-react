package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"math/rand/v2"
	"net/http"
	"os"
	"path/filepath"
	"sort"
	"strconv"
	"strings"
	"sync"
	"time"

	"github.com/joho/godotenv"
	"flightcaptainweb/search"
)

const frankfurterURL = "https://api.frankfurter.dev/v1/latest?base=USD&symbols=GBP,EUR,ILS,JPY"
const exchangeRefreshInterval = 1 * time.Hour

var (
	exchangeRatesMu   sync.RWMutex
	exchangeRatesToUSD = map[string]float64{
		"USD": 1.0,
		"GBP": 1.27,
		"EUR": 1.08,
		"ILS": 0.27,
		"JPY": 0.0067,
	}
)

func fetchExchangeRates() {
	client := &http.Client{Timeout: 10 * time.Second}
	resp, err := client.Get(frankfurterURL)
	if err != nil {
		log.Printf("[EXCHANGE] fetch failed (using fallback rates): %v", err)
		return
	}
	defer resp.Body.Close()
	if resp.StatusCode != http.StatusOK {
		log.Printf("[EXCHANGE] status %d (using fallback rates)", resp.StatusCode)
		return
	}
	var data struct {
		Base  string             `json:"base"`
		Rates map[string]float64 `json:"rates"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&data); err != nil {
		log.Printf("[EXCHANGE] decode failed (using fallback rates): %v", err)
		return
	}
	exchangeRatesMu.Lock()
	defer exchangeRatesMu.Unlock()
	exchangeRatesToUSD["USD"] = 1.0
	for curr, perUSD := range data.Rates {
		if perUSD > 0 {
			exchangeRatesToUSD[curr] = 1.0 / perUSD // 1 unit of curr = X USD
		}
	}
	log.Printf("[EXCHANGE] updated rates (date from API): USD=1 GBP=%.4f EUR=%.4f ILS=%.4f JPY=%.6f",
		exchangeRatesToUSD["GBP"], exchangeRatesToUSD["EUR"], exchangeRatesToUSD["ILS"], exchangeRatesToUSD["JPY"])
}

func startExchangeRateRefresh() {
	fetchExchangeRates()
	go func() {
		ticker := time.NewTicker(exchangeRefreshInterval)
		defer ticker.Stop()
		for range ticker.C {
			fetchExchangeRates()
		}
	}()
}

type SearchSessionStatus string

const (
	StatusPending  SearchSessionStatus = "PENDING"
	StatusComplete SearchSessionStatus = "COMPLETE"
	StatusFailed   SearchSessionStatus = "FAILED"
)

type CreateSearchSessionRequest struct {
	Origin            string `json:"origin"`
	Destination       string `json:"destination"`
	DepartureDate     string `json:"departureDate"`
	ReturnDate        string `json:"returnDate,omitempty"`
	CabinClass        string `json:"cabinClass"`
	CabinPreference   string `json:"cabinPreference,omitempty"`
	IncludeCheckedBag bool   `json:"includeCheckedBag,omitempty"`
	Adults            int    `json:"adults"`
	Children          int    `json:"children,omitempty"`
	Infants           int    `json:"infants,omitempty"`
	Currency          string `json:"currency,omitempty"`
	Locale            string `json:"locale,omitempty"`
}

type SearchSession struct {
	ID        string                     `json:"id"`
	Status    SearchSessionStatus        `json:"status"`
	CreatedAt time.Time                  `json:"createdAt"`
	Params    CreateSearchSessionRequest `json:"params"`
}

func (r *CreateSearchSessionRequest) CabinPrefOrDefault() string {
	if r.CabinPreference != "" {
		return r.CabinPreference
	}
	if r.CabinClass != "" {
		return r.CabinClass
	}
	return "ECONOMY"
}

func (r *CreateSearchSessionRequest) IncludeCheckedBagOrDefault() bool {
	return r.IncludeCheckedBag
}

func (r *CreateSearchSessionRequest) ChildrenOrDefault() int {
	if r.Children < 0 {
		return 0
	}
	return r.Children
}

type MonetaryAmount struct {
	Currency string  `json:"currency"`
	Amount   float64 `json:"amount"`
}

type AirportLike struct {
	Code string `json:"code"`
}

type Carrier struct {
	Code string `json:"code"`
}

type FlightSegment struct {
	From             AirportLike `json:"from"`
	To               AirportLike `json:"to"`
	DepartureTime    time.Time   `json:"departureTime"`
	ArrivalTime      time.Time   `json:"arrivalTime"`
	MarketingCarrier Carrier     `json:"marketingCarrier"`
	FlightNumber     string      `json:"flightNumber"`
	DurationMinutes  int         `json:"durationMinutes"`
	CabinClass       string      `json:"cabinClass"`
}

type FlightLeg struct {
	Segments []FlightSegment `json:"segments"`
}

type FlightOption struct {
	ID                    string         `json:"id"`
	Price                 MonetaryAmount `json:"price"`
	DurationMinutes       int            `json:"durationMinutes"`
	Legs                  []FlightLeg    `json:"legs"`
	ValidatingAirlines    []string       `json:"validatingAirlines,omitempty"`
	BaggageClass          string         `json:"baggageClass,omitempty"`   // BAG_OK, BAG_UNKNOWN, BAG_INCLUDED
	PrimaryDisplayCarrier string         `json:"primaryDisplayCarrier,omitempty"` // main airline for UI/affiliate (marketing first)
	Source                string         `json:"source,omitempty"`           // "amadeus" | "duffel" | "compare"
	DeepLink              string         `json:"deepLink,omitempty"`        // provider booking link (e.g. Duffel)
	VendorName            string         `json:"vendorName,omitempty"`      // OTA name (kayak/expedia etc) when source=compare
	CanonicalFingerprint  string         `json:"canonicalFingerprint,omitempty"` // stable hash for dedupe; optional in response
}

type SearchSessionResultsResponse struct {
	Session SearchSession  `json:"session"`
	Version int64          `json:"version"`
	Results []FlightOption `json:"results"`
}

var (
	sessions           = make(map[string]SearchSessionResultsResponse)
	sessionsMu         sync.RWMutex
	rawOffersBySession = make(map[string][]map[string]interface{})
	rawOffersMu        sync.RWMutex
	amadeusClient         *AmadeusClient
	duffelClient          *DuffelClient
	googleFlights2Provider *search.GoogleFlights2Provider
)

const (
	mainSearchMaxOffers       = 250 // single request; no offset in our Amadeus env
	maxOffersReturnedToClient = 50
	minOkForStrictBags        = 10 // soft-strict: if BAG_OK count >= this, use only BAG_OK; else BAG_OK+ BAG_UNKNOWN
	mixLimit                  = 30 // for mixed one-way round-trip: top N outbound and top N return candidates to mix
)

// MixedRoundTrip holds one outbound and one return one-way offer and their combined price (for mixed round-trip).
type MixedRoundTrip struct {
	Outbound   map[string]interface{}
	Return     map[string]interface{}
	TotalPrice float64
}

// Baggage classification for soft-strict filtering (additive to response).
const (
	BaggageOK       = "BAG_OK"       // all segments with includedCheckedBags have quantity == 0, at least one segment has the field
	BaggageUnknown  = "BAG_UNKNOWN"  // includedCheckedBags missing everywhere or in some segments
	BaggageIncluded = "BAG_INCLUDED" // any segment has includedCheckedBags.quantity >= 1
)

// filterOffersByCabin keeps only offers where all fareDetailsBySegment.cabin
// match the requested cabin. Missing cabin information is treated as
// non-matching in strict mode.
func filterOffersByCabin(offers []map[string]interface{}, cabin string) []map[string]interface{} {
	if cabin == "" {
		return offers
	}
	var out []map[string]interface{}
	for _, offer := range offers {
		if offerMatchesCabin(offer, cabin) {
			out = append(out, offer)
		}
	}
	return out
}

func offerMatchesCabin(offer map[string]interface{}, cabin string) bool {
	tps, ok := offer["travelerPricings"].([]interface{})
	if !ok || len(tps) == 0 {
		return false
	}
	for _, tpAny := range tps {
		tp, ok := tpAny.(map[string]interface{})
		if !ok {
			return false
		}
		fds, ok := tp["fareDetailsBySegment"].([]interface{})
		if !ok || len(fds) == 0 {
			return false
		}
		for _, fdAny := range fds {
			fd, ok := fdAny.(map[string]interface{})
			if !ok {
				return false
			}
			c, ok := fd["cabin"].(string)
			if !ok || c == "" {
				return false
			}
			if !strings.EqualFold(c, cabin) {
				return false
			}
		}
	}
	return true
}

// classifyOfferBaggage returns BAG_OK, BAG_UNKNOWN, or BAG_INCLUDED based on fareDetailsBySegment.
// BAG_OK: all segments that have includedCheckedBags have quantity==0, and at least one segment has the field.
// BAG_UNKNOWN: includedCheckedBags missing everywhere or in some segments (cannot confirm 0).
// BAG_INCLUDED: any segment has includedCheckedBags.quantity >= 1.
func classifyOfferBaggage(offer map[string]interface{}) string {
	tps, ok := offer["travelerPricings"].([]interface{})
	if !ok || len(tps) == 0 {
		return BaggageUnknown
	}
	hasAnyBaggageField := false
	for _, tpAny := range tps {
		tp, ok := tpAny.(map[string]interface{})
		if !ok {
			continue
		}
		fds, ok := tp["fareDetailsBySegment"].([]interface{})
		if !ok || len(fds) == 0 {
			continue
		}
		for _, fdAny := range fds {
			fd, ok := fdAny.(map[string]interface{})
			if !ok {
				continue
			}
			icb, ok := fd["includedCheckedBags"].(map[string]interface{})
			if !ok {
				continue // segment has no baggage info
			}
			hasAnyBaggageField = true
			qAny, ok := icb["quantity"]
			if !ok {
				return BaggageUnknown
			}
			var q float64
			switch v := qAny.(type) {
			case float64:
				q = v
			case int:
				q = float64(v)
			default:
				return BaggageUnknown
			}
			if q >= 1 {
				return BaggageIncluded
			}
		}
	}
	if !hasAnyBaggageField {
		return BaggageUnknown
	}
	return BaggageOK
}

// applySoftStrictBaggage partitions offers by baggage class and applies soft-strict when includeCheckedBag=false.
// Returns: selected offers (with _baggageClass set), okCount, unknownCount, includedCount, minOkThresholdUsed, fallback.
func applySoftStrictBaggage(offers []map[string]interface{}, includeCheckedBag bool) (
	selected []map[string]interface{},
	okCount, unknownCount, includedCount int,
	minOkThresholdUsed, fallback bool,
) {
	okOffers := make([]map[string]interface{}, 0)
	unknownOffers := make([]map[string]interface{}, 0)
	includedOffers := make([]map[string]interface{}, 0)
	for _, o := range offers {
		class := classifyOfferBaggage(o)
		o["_baggageClass"] = class
		switch class {
		case BaggageOK:
			okOffers = append(okOffers, o)
			okCount++
		case BaggageUnknown:
			unknownOffers = append(unknownOffers, o)
			unknownCount++
		case BaggageIncluded:
			includedOffers = append(includedOffers, o)
			includedCount++
		default:
			unknownOffers = append(unknownOffers, o)
			unknownCount++
		}
	}
	if includeCheckedBag {
		selected = offers
		return selected, okCount, unknownCount, includedCount, false, false
	}
	if okCount >= minOkForStrictBags {
		selected = okOffers
		minOkThresholdUsed = true
		return selected, okCount, unknownCount, includedCount, true, false
	}
	selected = append(append([]map[string]interface{}{}, okOffers...), unknownOffers...)
	if len(selected) == 0 {
		selected = offers
		fallback = true
	}
	return selected, okCount, unknownCount, includedCount, false, fallback
}

func baggageOrder(class interface{}) int {
	s, _ := class.(string)
	switch s {
	case BaggageOK:
		return 0
	case BaggageUnknown:
		return 1
	case BaggageIncluded:
		return 2
	default:
		return 1
	}
}

// CarrierCodes holds marketing, operating, and validating carrier codes extracted from a raw offer.
type CarrierCodes struct {
	Marketing []string
	Operating []string
	Validating []string
}

// ExtractCarrierCodes returns marketing, operating, and validating carrier codes from a raw Amadeus offer.
// Marketing/operating come from itineraries[].segments[]; validating from offer.validatingAirlineCodes.
func ExtractCarrierCodes(offer map[string]interface{}) CarrierCodes {
	var out CarrierCodes
	seenM := make(map[string]struct{})
	seenO := make(map[string]struct{})
	seenV := make(map[string]struct{})
	itins, _ := offer["itineraries"].([]interface{})
	for _, itinAny := range itins {
		itin, _ := itinAny.(map[string]interface{})
		segs, _ := itin["segments"].([]interface{})
		for _, segAny := range segs {
			seg, _ := segAny.(map[string]interface{})
			if code, ok := seg["carrierCode"].(string); ok && code != "" {
				if _, ok := seenM[code]; !ok {
					seenM[code] = struct{}{}
					out.Marketing = append(out.Marketing, code)
				}
			}
			if op, ok := seg["operating"].(map[string]interface{}); ok {
				if code, ok := op["carrierCode"].(string); ok && code != "" {
					if _, ok := seenO[code]; !ok {
						seenO[code] = struct{}{}
						out.Operating = append(out.Operating, code)
					}
				}
			}
		}
	}
	if codes, ok := offer["validatingAirlineCodes"].([]interface{}); ok {
		for _, c := range codes {
			if s, ok := c.(string); ok && s != "" {
				if _, ok := seenV[s]; !ok {
					seenV[s] = struct{}{}
					out.Validating = append(out.Validating, s)
				}
			}
		}
	}
	return out
}

// PrimaryDisplayCarrier returns the carrier code to show as the main airline for a raw offer.
// Prefer first segment marketing carrier; else first validating code.
func PrimaryDisplayCarrier(offer map[string]interface{}) string {
	cc := ExtractCarrierCodes(offer)
	if len(cc.Marketing) > 0 {
		return cc.Marketing[0]
	}
	if len(cc.Validating) > 0 {
		return cc.Validating[0]
	}
	return ""
}

// buildCombinedOffer merges one outbound and one return one-way offer into a single round-trip raw offer
// (itineraries, price, travelerPricings) so normalizeFlightOptions and cabin/baggage filters work.
func buildCombinedOffer(outbound, returnOffer map[string]interface{}, totalPrice float64) map[string]interface{} {
	combined := make(map[string]interface{})

	// itineraries: [outbound first itinerary, return first itinerary]
	var itins []interface{}
	if oItins, ok := outbound["itineraries"].([]interface{}); ok && len(oItins) > 0 {
		itins = append(itins, oItins[0])
	}
	if rItins, ok := returnOffer["itineraries"].([]interface{}); ok && len(rItins) > 0 {
		itins = append(itins, rItins[0])
	}
	if len(itins) == 0 {
		return nil
	}
	combined["itineraries"] = itins

	// price: total and grandTotal as strings
	priceStr := fmt.Sprintf("%.2f", totalPrice)
	combined["price"] = map[string]interface{}{
		"total":      priceStr,
		"grandTotal": priceStr,
	}

	// travelerPricings: merge first traveler from each so fareDetailsBySegment covers both legs
	var mergedTP []interface{}
	if oTP, ok := outbound["travelerPricings"].([]interface{}); ok && len(oTP) > 0 {
		if rTP, ok := returnOffer["travelerPricings"].([]interface{}); ok && len(rTP) > 0 {
			oT, _ := oTP[0].(map[string]interface{})
			rT, _ := rTP[0].(map[string]interface{})
			if oT != nil && rT != nil {
				oFds, _ := oT["fareDetailsBySegment"].([]interface{})
				rFds, _ := rT["fareDetailsBySegment"].([]interface{})
				mergedFds := append(append([]interface{}{}, oFds...), rFds...)
				mergedTP = []interface{}{
					map[string]interface{}{"fareDetailsBySegment": mergedFds},
				}
			}
		}
	}
	if mergedTP == nil {
		mergedTP = []interface{}{map[string]interface{}{"fareDetailsBySegment": []interface{}{}}}
	}
	combined["travelerPricings"] = mergedTP

	// validatingAirlineCodes: prefer outbound, fallback to return
	if codes, ok := outbound["validatingAirlineCodes"].([]interface{}); ok && len(codes) > 0 {
		combined["validatingAirlineCodes"] = codes
	} else if codes, ok := returnOffer["validatingAirlineCodes"].([]interface{}); ok {
		combined["validatingAirlineCodes"] = codes
	}

	return combined
}

// #region agent log (de4859)
func appendDebugLogDe4859(entry map[string]any) {
	logPath := "/Users/rongurfinkel/Desktop/Projects/GO/flight_captain web/.cursor/debug-de4859.log"
	_ = os.MkdirAll(filepath.Dir(logPath), 0o755)
	f, err := os.OpenFile(logPath, os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0o644)
	if err != nil {
		return
	}
	defer f.Close()

	entry["timestamp"] = time.Now().UnixMilli()
	entry["sessionId"] = "de4859"

	b, err := json.Marshal(entry)
	if err != nil {
		return
	}
	_, _ = f.Write(append(b, '\n'))
}

// #endregion

// #region agent log
func appendDebugLog(entry map[string]any) {
	dir, _ := os.Getwd()
	// When run from backend/, project root is parent; write to project .cursor/debug-68d1d3.log
	logPath := filepath.Join(dir, ".cursor", "debug-68d1d3.log")
	if filepath.Base(dir) == "backend" {
		logPath = filepath.Join(dir, "..", ".cursor", "debug-68d1d3.log")
	}
	logPath = filepath.Clean(logPath)
	_ = os.MkdirAll(filepath.Dir(logPath), 0o755)
	f, err := os.OpenFile(logPath, os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0o644)
	if err != nil {
		return
	}
	defer f.Close()

	entry["timestamp"] = time.Now().UnixMilli()
	entry["sessionId"] = "68d1d3"

	b, err := json.Marshal(entry)
	if err != nil {
		return
	}
	_, _ = f.Write(append(b, '\n'))
}

// #endregion

func writeJSON(w http.ResponseWriter, code int, v any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(code)
	_ = json.NewEncoder(w).Encode(v)
}

func handleCreateSession(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodOptions {
		writeJSON(w, http.StatusNoContent, nil)
		return
	}
	if r.Method != http.MethodPost {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}

	var req CreateSearchSessionRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid JSON"})
		return
	}
	// Normalize and ensure currency defaults to USD when empty or unsupported
	req.Currency = strings.TrimSpace(strings.ToUpper(req.Currency))
	if req.Currency == "" {
		req.Currency = "USD"
	}
	switch req.Currency {
	case "USD", "GBP", "EUR", "ILS", "JPY":
		// use as-is
	default:
		req.Currency = "USD"
	}

	appendDebugLog(map[string]any{
		"location":     "backend/server.go:handleCreateSession",
		"message":      "Create session request",
		"hypothesisId": "backend-A",
		"data": map[string]any{
			"origin":        req.Origin,
			"destination":   req.Destination,
			"departureDate": req.DepartureDate,
			"hasReturnDate": req.ReturnDate != "",
		},
	})

	if req.Origin == "" || req.Destination == "" || req.DepartureDate == "" {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": "origin, destination and departureDate are required"})
		return
	}

	if req.Adults <= 0 {
		req.Adults = 1
	}

	if amadeusClient == nil {
		writeJSON(w, http.StatusInternalServerError, map[string]string{"error": "backend not initialized"})
		return
	}

	cabinPref := req.CabinPrefOrDefault()
	includeBag := req.IncludeCheckedBagOrDefault()

	// Start Duffel search in parallel (if configured).
	var duffelCh chan DuffelSearchResult
	if duffelClient != nil {
		duffelCh = make(chan DuffelSearchResult, 1)
		go func() {
			duffelCh <- duffelClient.SearchOffers(
				strings.ToUpper(req.Origin),
				strings.ToUpper(req.Destination),
				req.DepartureDate,
				req.ReturnDate,
				cabinPref,
			)
		}()
	}

	// Start Google Flights2 search in parallel when provider is configured (same as Duffel).
	var gf2Ch chan []search.ProviderResult
	if googleFlights2Provider != nil {
		gf2Ch = make(chan []search.ProviderResult, 1)
		go func() {
			sreq := search.SearchRequest{
				Origin:            strings.ToUpper(req.Origin),
				Destination:       strings.ToUpper(req.Destination),
				DepartureDate:     req.DepartureDate,
				ReturnDate:        req.ReturnDate,
				CabinClass:        req.CabinClass,
				CabinPreference:   cabinPref,
				IncludeCheckedBag: includeBag,
				Adults:            req.Adults,
				Children:          req.ChildrenOrDefault(),
				Infants:           req.Infants,
				Currency:          req.CurrencyOrDefault(),
			}
			ctx, cancel := context.WithTimeout(context.Background(), 20*time.Second)
			defer cancel()
			res, err := googleFlights2Provider.Search(ctx, sreq)
			if err != nil {
				gf2Ch <- nil
				return
			}
			gf2Ch <- res
		}()
	}

	var offers []map[string]interface{}
	var outboundOffersReturned, returnOffersReturned int
	var combosGenerated int
	var cheapestOutbound, cheapestReturn, cheapestMixed float64

	if req.ReturnDate != "" {
		// Mixed one-way round-trip: search outbound and return separately, then combine with price-bounded mixing.
		// On Amadeus error we continue with empty offers so Duffel/GF2 results can still be returned.
		origin := strings.ToUpper(req.Origin)
		dest := strings.ToUpper(req.Destination)

		currency := req.CurrencyOrDefault()
		outResp, errOut := amadeusClient.FlightOffersSearch(origin, dest, req.DepartureDate, "", mainSearchMaxOffers, cabinPref, currency, req.Adults, req.ChildrenOrDefault(), false)
		if errOut != nil {
			log.Printf("FlightOffersSearch (outbound) error: %v; continuing with other providers", errOut)
			appendDebugLog(map[string]any{"location": "backend/server.go:handleCreateSession", "message": "Amadeus search error", "hypothesisId": "backend-A", "data": map[string]any{"error": errOut.Error()}})
			offers = nil
		}
		var retResp APIResponse
		var errRet error
		if errOut == nil {
			retResp, errRet = amadeusClient.FlightOffersSearch(dest, origin, req.ReturnDate, "", mainSearchMaxOffers, cabinPref, currency, req.Adults, req.ChildrenOrDefault(), false)
			if errRet != nil {
				log.Printf("FlightOffersSearch (return) error: %v; continuing with other providers", errRet)
				appendDebugLog(map[string]any{"location": "backend/server.go:handleCreateSession", "message": "Amadeus search error", "hypothesisId": "backend-A", "data": map[string]any{"error": errRet.Error()}})
				offers = nil
			}
		}

		if errOut == nil && errRet == nil {
			// Filter out non-positive prices.
		var outboundFiltered []map[string]interface{}
		for _, o := range outResp.Data {
			if p := extractRawPrice(o); p > 0 {
				outboundFiltered = append(outboundFiltered, o)
			}
		}
		var returnFiltered []map[string]interface{}
		for _, r := range retResp.Data {
			if p := extractRawPrice(r); p > 0 {
				returnFiltered = append(returnFiltered, r)
			}
		}

		// Sort by price ascending.
		sort.Slice(outboundFiltered, func(i, j int) bool {
			return extractRawPrice(outboundFiltered[i]) < extractRawPrice(outboundFiltered[j])
		})
		sort.Slice(returnFiltered, func(i, j int) bool { return extractRawPrice(returnFiltered[i]) < extractRawPrice(returnFiltered[j]) })

		// Limit candidates.
		outboundCandidates := outboundFiltered
		if len(outboundCandidates) > mixLimit {
			outboundCandidates = outboundCandidates[:mixLimit]
		}
		returnCandidates := returnFiltered
		if len(returnCandidates) > mixLimit {
			returnCandidates = returnCandidates[:mixLimit]
		}

		// Generate all combinations (no early exit) then sort and take top 50 for correctness.
		var combos []MixedRoundTrip
		for _, o := range outboundCandidates {
			outPrice := extractRawPrice(o)
			if outPrice <= 0 {
				continue
			}
			for _, r := range returnCandidates {
				retPrice := extractRawPrice(r)
				if retPrice <= 0 {
					continue
				}
				combos = append(combos, MixedRoundTrip{
					Outbound:   o,
					Return:     r,
					TotalPrice: outPrice + retPrice,
				})
			}
		}
		combosGenerated = len(combos)

		// Sort by total price ascending and keep top 50.
		sort.Slice(combos, func(i, j int) bool { return combos[i].TotalPrice < combos[j].TotalPrice })
		topK := maxOffersReturnedToClient
		if len(combos) < topK {
			topK = len(combos)
		}
		combos = combos[:topK]

		for _, c := range combos {
			merged := buildCombinedOffer(c.Outbound, c.Return, c.TotalPrice)
			if merged != nil {
				offers = append(offers, merged)
			}
		}

		// Preserve dictionaries merging behavior.
		_ = mergeDictionaries(outResp.Dictionaries, retResp.Dictionaries)

		outboundOffersReturned = len(outResp.Data)
		returnOffersReturned = len(retResp.Data)
		if len(combos) > 0 {
			cheapestMixed = combos[0].TotalPrice
		}
		if len(outboundCandidates) > 0 {
			cheapestOutbound = extractRawPrice(outboundCandidates[0])
		}
		if len(returnCandidates) > 0 {
			cheapestReturn = extractRawPrice(returnCandidates[0])
		}

		log.Printf("[ROUNDTRIP_MIX] outboundCandidates=%d returnCandidates=%d combinationsGenerated=%d cheapestMixed=%.2f cheapestOutbound=%.2f cheapestReturn=%.2f",
			len(outboundCandidates), len(returnCandidates), combosGenerated, cheapestMixed, cheapestOutbound, cheapestReturn)
		}
	} else {
		// One-way: single Amadeus request (no offset). travelClass from cabin preference.
		apiResp, err := amadeusClient.FlightOffersSearch(
			strings.ToUpper(req.Origin),
			strings.ToUpper(req.Destination),
			req.DepartureDate,
			"",
			mainSearchMaxOffers,
			cabinPref,
			req.CurrencyOrDefault(),
			req.Adults,
			req.ChildrenOrDefault(),
			false,
		)
		if err != nil {
			log.Printf("FlightOffersSearch error: %v; continuing with other providers", err)
			appendDebugLog(map[string]any{
				"location":     "backend/server.go:handleCreateSession",
				"message":      "Amadeus search error",
				"hypothesisId": "backend-A",
				"data":         map[string]any{"error": err.Error()},
			})
			offers = nil
		} else {
			offers = apiResp.Data
		outboundOffersReturned = len(apiResp.Data)
		for _, o := range offers {
			if p := extractRawPrice(o); p > 0 && (cheapestOutbound == 0 || p < cheapestOutbound) {
				cheapestOutbound = p
			}
		}
		cheapestMixed = cheapestOutbound
		}
	}

	offersInitial := offers

	// Post-fetch: cabin filter (already applied via travelClass; filter for consistency).
	offersAfterCabin := offers
	if cabinPref != "" {
		offersAfterCabin = filterOffersByCabin(offers, cabinPref)
		offers = offersAfterCabin
	}

	// Post-fetch: soft-strict baggage (partition BAG_OK / BAG_UNKNOWN / BAG_INCLUDED, then select + sort).
	selected, okCount, unknownCount, includedCount, minOkThresholdUsed, bagFallback := applySoftStrictBaggage(offers, includeBag)
	offers = selected

	// Fallback if filtering yielded no offers.
	if len(offers) == 0 && len(offersAfterCabin) > 0 {
		offers = offersAfterCabin
	}
	if len(offers) == 0 && len(offersInitial) > 0 {
		offers = offersInitial
		offersAfterCabin = offers
	}

	// Sort: when includeCheckedBag=false, BAG_OK first, then BAG_UNKNOWN, then by price; else by price only.
	if len(offers) > 0 {
		if !includeBag {
			sort.Slice(offers, func(i, j int) bool {
				oi, oj := baggageOrder(offers[i]["_baggageClass"]), baggageOrder(offers[j]["_baggageClass"])
				if oi != oj {
					return oi < oj
				}
				return extractRawPrice(offers[i]) < extractRawPrice(offers[j])
			})
		} else {
			sort.Slice(offers, func(i, j int) bool {
				return extractRawPrice(offers[i]) < extractRawPrice(offers[j])
			})
		}

		cheapestPrice := extractRawPrice(offers[0])
		cheapestBaggage, _ := offers[0]["_baggageClass"].(string)
		var validating []string
		if codes, ok := offers[0]["validatingAirlineCodes"].([]interface{}); ok {
			for _, c := range codes {
				if s, ok := c.(string); ok && s != "" {
					validating = append(validating, s)
				}
			}
		}
		fallbackFlag := ""
		if bagFallback {
			fallbackFlag = "relaxedBagsAll"
		}
		log.Printf("[SEARCH] includeCheckedBag=%t okCount=%d unknownCount=%d includedCount=%d minOkThresholdUsed=%t fallback=%s cheapest=%.2f baggageClass=%s validating=%v",
			includeBag, okCount, unknownCount, includedCount, minOkThresholdUsed, fallbackFlag, cheapestPrice, cheapestBaggage, validating)

		// Structured debug log of raw first offer price (post-sort, cheapest).
		rawPrice, _ := offers[0]["price"].(map[string]interface{})
		appendDebugLogDe4859(map[string]any{
			"location":     "backend/server.go:handleCreateSession",
			"message":      "Cheapest raw offer price from Amadeus (post-sort)",
			"hypothesisId": "pricing-2",
			"runId":        "pre-fix",
			"data": map[string]any{
				"origin":      req.Origin,
				"destination": req.Destination,
				"departure":   req.DepartureDate,
				"returnDate":  req.ReturnDate,
				"priceObject": rawPrice,
			},
		})

		// Log that NDC content is not available on the self-service Flight Offers Search API.
		log.Printf("[SEARCH_NDC] NDC content is not available for the self-service Flight Offers Search API; proceeding with standard content only.")
	}

	// [SEARCH_SUMMARY] — one line per search, computed before trimming to top N.
	{
		seenM := make(map[string]struct{})
		seenO := make(map[string]struct{})
		seenV := make(map[string]struct{})
		for _, o := range offers {
			cc := ExtractCarrierCodes(o)
			for _, c := range cc.Marketing {
				seenM[c] = struct{}{}
			}
			for _, c := range cc.Operating {
				seenO[c] = struct{}{}
			}
			for _, c := range cc.Validating {
				seenV[c] = struct{}{}
			}
		}
		var marketingList, operatingList, validatingList []string
		for c := range seenM {
			marketingList = append(marketingList, c)
		}
		for c := range seenO {
			operatingList = append(operatingList, c)
		}
		for c := range seenV {
			validatingList = append(validatingList, c)
		}
		sample := func(list []string, max int) []string {
			if len(list) <= max {
				return list
			}
			return list[:max]
		}
		allCodes := make(map[string]struct{})
		for c := range seenM {
			allCodes[c] = struct{}{}
		}
		for c := range seenO {
			allCodes[c] = struct{}{}
		}
		for c := range seenV {
			allCodes[c] = struct{}{}
		}
		_, containsW6 := allCodes["W6"]
		_, containsW4 := allCodes["W4"]
		log.Printf("[SEARCH_SUMMARY] outboundOffersReturned=%d returnOffersReturned=%d mixLimit=%d combosGenerated=%d cheapestOutbound=%.2f cheapestReturn=%.2f cheapestMixed=%.2f cabinPreference=%s includeCheckedBag=%t okCount=%d unknownCount=%d includedCount=%d fallbackApplied=%t uniqueMarketingCarriers=%d marketingSample=%v uniqueOperatingCarriers=%d operatingSample=%v uniqueValidatingCarriers=%d validatingSample=%v containsW6=%t containsW4=%t",
			outboundOffersReturned, returnOffersReturned, mixLimit, combosGenerated, cheapestOutbound, cheapestReturn, cheapestMixed, cabinPref, includeBag, okCount, unknownCount, includedCount, bagFallback,
			len(seenM), sample(marketingList, 10), len(seenO), sample(operatingList, 10), len(seenV), sample(validatingList, 10), containsW6, containsW4)
	}

	// Return only top N offers to the client to keep payloads reasonable.
	if len(offers) > maxOffersReturnedToClient {
		offers = offers[:maxOffersReturnedToClient]
	}

	options := normalizeFlightOptions(offers, &req)

	// Merge Duffel results if available (ran in parallel).
	requestedCurr := req.CurrencyOrDefault()
	if duffelCh != nil {
		duffelResult := <-duffelCh
		if duffelResult.Err != nil {
			log.Printf("[DUFFEL] search error: %v", duffelResult.Err)
		} else {
			options = append(options, duffelResult.Options...)
			// [DUFFEL_SUMMARY]
			duffelOffers := duffelResult.Options
			offersReturned := len(duffelOffers)
			cheapest := 0.0
			carriersSample := make([]string, 0, 10)
			seen := make(map[string]struct{})
			for _, o := range duffelOffers {
				if o.Price.Amount > 0 && (cheapest == 0 || o.Price.Amount < cheapest) {
					cheapest = o.Price.Amount
				}
				c := o.PrimaryDisplayCarrier
				if c != "" {
					if _, ok := seen[c]; !ok {
						seen[c] = struct{}{}
						carriersSample = append(carriersSample, c)
						if len(carriersSample) >= 10 {
							break
						}
					}
				}
			}
			log.Printf("[DUFFEL_SUMMARY] offersReturned=%d cheapest=%.2f carriersSample=%v latency=%dms",
				offersReturned, cheapest, carriersSample, duffelResult.LatencyMs)
		}
	}

	// Merge Google Flights2 results if available (never fail whole request on GF2 failure).
	if gf2Ch != nil {
		gf2Results := <-gf2Ch
		if len(gf2Results) > 0 {
			gf2Opts := providerResultsToFlightOptions(gf2Results)
			options = append(options, gf2Opts...)
		}
	}

	// Best-effort dedupe: same origin+dest, depart within 10 min, same carrier+flight when available.
	options = dedupeFlightOptions(options)

	// Convert all option prices to the requested currency (so Amadeus + Duffel + GF2 results are comparable and displayed in user's choice).
	convertOptionsToCurrency(options, requestedCurr)
	sort.Slice(options, func(i, j int) bool {
		return options[i].Price.Amount < options[j].Price.Amount
	})
	if len(options) > maxOffersReturnedToClient {
		options = options[:maxOffersReturnedToClient]
	}

	if len(options) > 0 {
		firstOpt := options[0]
		appendDebugLogDe4859(map[string]any{
			"location":     "backend/server.go:handleCreateSession",
			"message":      "Normalized first option price",
			"hypothesisId": "pricing-3",
			"runId":        "pre-fix",
			"data": map[string]any{
				"optionId":      firstOpt.ID,
				"currency":      firstOpt.Price.Currency,
				"amount":        firstOpt.Price.Amount,
				"adults":        req.Adults,
				"children":      req.Children,
				"infants":       req.Infants,
				"requestedCurr": req.CurrencyOrDefault(),
			},
		})
	}

	id := randomID("sess_")
	now := time.Now().UTC()

	session := SearchSession{
		ID:        id,
		Status:    StatusComplete, // simple synchronous search for now
		CreatedAt: now,
		Params:    req,
	}

	resp := SearchSessionResultsResponse{
		Session: session,
		Version: 1,
		Results: options,
	}

	sessionsMu.Lock()
	sessions[id] = resp
	sessionsMu.Unlock()
	rawOffersMu.Lock()
	rawOffersBySession[id] = offers
	rawOffersMu.Unlock()

	appendDebugLog(map[string]any{
		"location":     "backend/server.go:handleCreateSession",
		"message":      "Create session success",
		"hypothesisId": "backend-A",
		"data": map[string]any{
			"sessionId":    id,
			"resultsCount": len(options),
		},
	})

	writeJSON(w, http.StatusOK, session)
}

func handleGetSession(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodOptions {
		writeJSON(w, http.StatusNoContent, nil)
		return
	}
	if r.Method != http.MethodGet {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}
	// path: /api/search/sessions/{id}
	parts := strings.Split(strings.TrimPrefix(r.URL.Path, "/api/search/sessions/"), "/")
	if len(parts) == 0 || parts[0] == "" {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": "missing session id"})
		return
	}
	id := parts[0]
	sessionsMu.RLock()
	resp, ok := sessions[id]
	sessionsMu.RUnlock()
	if !ok {
		appendDebugLog(map[string]any{
			"location":     "backend/server.go:handleGetSession",
			"message":      "Session not found",
			"hypothesisId": "backend-B",
			"data": map[string]any{
				"id": id,
			},
		})
		writeJSON(w, http.StatusNotFound, map[string]string{"error": "session not found"})
		return
	}

	if len(resp.Results) > 0 {
		first := resp.Results[0]
		appendDebugLogDe4859(map[string]any{
			"location":     "backend/server.go:handleGetSession",
			"message":      "Get session first option price",
			"hypothesisId": "pricing-4",
			"runId":        "pre-fix",
			"data": map[string]any{
				"sessionId": id,
				"optionId":  first.ID,
				"currency":  first.Price.Currency,
				"amount":    first.Price.Amount,
			},
		})
	}
	appendDebugLog(map[string]any{
		"location":     "backend/server.go:handleGetSession",
		"message":      "Get session success",
		"hypothesisId": "backend-B",
		"data": map[string]any{
			"id":           id,
			"resultsCount": len(resp.Results),
			"version":      resp.Version,
		},
	})
	writeJSON(w, http.StatusOK, resp)
}

func randomID(prefix string) string {
	return prefix + strconv.FormatInt(time.Now().UnixNano()+int64(rand.IntN(1000)), 36)
}

// convertPrice converts amount from fromCurr to toCurr using live rates. Returns (convertedAmount, toCurr). If rates unknown, returns original.
func convertPrice(amount float64, fromCurr, toCurr string) (float64, string) {
	if fromCurr == toCurr || amount <= 0 {
		return amount, toCurr
	}
	exchangeRatesMu.RLock()
	fromRate, okFrom := exchangeRatesToUSD[fromCurr]
	toRate, okTo := exchangeRatesToUSD[toCurr]
	exchangeRatesMu.RUnlock()
	if !okFrom || !okTo || toRate <= 0 {
		return amount, fromCurr
	}
	usd := amount * fromRate
	return usd / toRate, toCurr
}

// convertOptionsToCurrency converts all options' prices to requestedCurr in place.
func convertOptionsToCurrency(options []FlightOption, requestedCurr string) {
	for i := range options {
		p := &options[i].Price
		if p.Currency == requestedCurr {
			continue
		}
		converted, _ := convertPrice(p.Amount, p.Currency, requestedCurr)
		p.Amount = converted
		p.Currency = requestedCurr
	}
}

// normalizeFlightOptions converts raw Amadeus offers into the simplified FlightOption shape.
func normalizeFlightOptions(data []map[string]interface{}, req *CreateSearchSessionRequest) []FlightOption {
	var options []FlightOption

	for idx, offer := range data {
		price := extractRawPrice(offer)
		if price <= 0 {
			continue
		}

		itinsRaw, ok := offer["itineraries"].([]interface{})
		if !ok || len(itinsRaw) == 0 {
			continue
		}

		var legs []FlightLeg
		totalDuration := 0

		for _, itinAny := range itinsRaw {
			itin, ok := itinAny.(map[string]interface{})
			if !ok {
				continue
			}
			segsRaw, ok := itin["segments"].([]interface{})
			if !ok || len(segsRaw) == 0 {
				continue
			}

			var segments []FlightSegment
			for _, segAny := range segsRaw {
				seg, ok := segAny.(map[string]interface{})
				if !ok {
					continue
				}
				dep, _ := seg["departure"].(map[string]interface{})
				arr, _ := seg["arrival"].(map[string]interface{})
				if dep == nil || arr == nil {
					continue
				}

				depCode, _ := dep["iataCode"].(string)
				arrCode, _ := arr["iataCode"].(string)
				depAt, _ := dep["at"].(string)
				arrAt, _ := arr["at"].(string)

				depTime, _ := parseAmadeusTime(depAt)
				arrTime, _ := parseAmadeusTime(arrAt)

				duration := 0
				if !depTime.IsZero() && !arrTime.IsZero() {
					duration = int(arrTime.Sub(depTime).Minutes())
				}
				if duration < 0 {
					duration = 0
				}

				carrierCode, _ := seg["carrierCode"].(string)
				number, _ := seg["number"].(string)

				cabinClass := req.CabinClass
				if travelerPricings, ok := offer["travelerPricings"].([]interface{}); ok && len(travelerPricings) > 0 {
					if tp, ok := travelerPricings[0].(map[string]interface{}); ok {
						if fareDetailsBySegment, ok := tp["fareDetailsBySegment"].([]interface{}); ok && len(fareDetailsBySegment) > 0 {
							if fd, ok := fareDetailsBySegment[0].(map[string]interface{}); ok {
								if cabin, ok := fd["cabin"].(string); ok && cabin != "" {
									cabinClass = cabin
								}
							}
						}
					}
				}

				segments = append(segments, FlightSegment{
					From:             AirportLike{Code: strings.ToUpper(depCode)},
					To:               AirportLike{Code: strings.ToUpper(arrCode)},
					DepartureTime:    depTime,
					ArrivalTime:      arrTime,
					MarketingCarrier: Carrier{Code: carrierCode},
					FlightNumber:     number,
					DurationMinutes:  duration,
					CabinClass:       cabinClass,
				})
				totalDuration += duration
			}
			if len(segments) > 0 {
				legs = append(legs, FlightLeg{Segments: segments})
			}
		}

		if len(legs) == 0 {
			continue
		}

		var validating []string
		if codes, ok := offer["validatingAirlineCodes"].([]interface{}); ok {
			for _, c := range codes {
				if s, ok := c.(string); ok && s != "" {
					validating = append(validating, s)
				}
			}
		}
		baggageClass, _ := offer["_baggageClass"].(string)
		primaryCarrier := PrimaryDisplayCarrier(offer)
		if computed := computeTotalDurationFromLegs(legs); computed > 0 {
			totalDuration = computed
		}

		options = append(options, FlightOption{
			ID:                    fmt.Sprintf("opt_%d", idx),
			Price:                 MonetaryAmount{Currency: req.CurrencyOrDefault(), Amount: price},
			DurationMinutes:       totalDuration,
			Legs:                  legs,
			ValidatingAirlines:    validating,
			BaggageClass:          baggageClass,
			PrimaryDisplayCarrier: primaryCarrier,
			Source:                "amadeus",
		})
	}

	return options
}

// computeTotalDurationFromLegs returns total minutes (flight + layovers) per leg: last segment arrival - first segment departure per leg.
func computeTotalDurationFromLegs(legs []FlightLeg) int {
	var total int
	for _, leg := range legs {
		if len(leg.Segments) == 0 {
			continue
		}
		first := leg.Segments[0]
		last := leg.Segments[len(leg.Segments)-1]
		if first.DepartureTime.IsZero() || last.ArrivalTime.IsZero() {
			continue
		}
		mins := int(last.ArrivalTime.Sub(first.DepartureTime).Minutes())
		if mins > 0 {
			total += mins
		}
	}
	return total
}

// providerResultsToFlightOptions converts search.ProviderResult to FlightOption.
func providerResultsToFlightOptions(prs []search.ProviderResult) []FlightOption {
	var out []FlightOption
	for _, pr := range prs {
		var legs []FlightLeg
		for _, l := range pr.Legs {
			var segs []FlightSegment
			for _, s := range l.Segments {
				segs = append(segs, FlightSegment{
					From:             AirportLike{Code: strings.ToUpper(s.From)},
					To:               AirportLike{Code: strings.ToUpper(s.To)},
					DepartureTime:    s.DepartureTime,
					ArrivalTime:      s.ArrivalTime,
					MarketingCarrier: Carrier{Code: s.MarketingCarrier},
					FlightNumber:     s.FlightNumber,
					DurationMinutes:  s.DurationMinutes,
					CabinClass:       s.CabinClass,
				})
			}
			legs = append(legs, FlightLeg{Segments: segs})
		}
		durMin := pr.DurationMinutes
		if computed := computeTotalDurationFromLegs(legs); computed > 0 {
			durMin = computed
		}
		out = append(out, FlightOption{
			ID:                    pr.ID,
			Price:                 MonetaryAmount{Currency: pr.Price.Currency, Amount: pr.Price.Amount},
			DurationMinutes:       durMin,
			Legs:                  legs,
			ValidatingAirlines:     pr.ValidatingAirlines,
			BaggageClass:          pr.BaggageClass,
			PrimaryDisplayCarrier: pr.PrimaryDisplayCarrier,
			Source:                pr.Source,
			DeepLink:              pr.DeepLink,
			VendorName:            pr.VendorName,
		})
	}
	return out
}

// dedupeFlightOptions removes duplicates by canonicalFingerprint (when set), else by legacy key; keeps cheapest. Renumbers IDs to opt_0, opt_1, ...
func dedupeFlightOptions(opts []FlightOption) []FlightOption {
	// Assign fingerprint to any option that doesn't have it
	for i := range opts {
		if opts[i].CanonicalFingerprint == "" {
			opts[i].CanonicalFingerprint = CanonicalFingerprint(&opts[i])
		}
	}
	seen := make(map[string]int) // key -> index of option to keep (lowest price)
	for i, o := range opts {
		key := o.CanonicalFingerprint
		if key == "" {
			// Legacy fallback
			origin := ""
			dest := ""
			depMin := int64(0)
			carrier := ""
			flight := ""
			if len(o.Legs) > 0 && len(o.Legs[0].Segments) > 0 {
				seg := o.Legs[0].Segments[0]
				origin = seg.From.Code
				dest = seg.To.Code
				depMin = seg.DepartureTime.Unix() / 600
				carrier = seg.MarketingCarrier.Code
				flight = seg.FlightNumber
			}
			key = fmt.Sprintf("%s-%s-%d-%s-%s", origin, dest, depMin, carrier, flight)
		}
		if j, exists := seen[key]; exists {
			if opts[j].Price.Amount > o.Price.Amount {
				seen[key] = i
			}
		} else {
			seen[key] = i
		}
	}
	keep := make(map[int]bool)
	for _, idx := range seen {
		keep[idx] = true
	}
	var out []FlightOption
	for i, o := range opts {
		if keep[i] {
			out = append(out, o)
		}
	}
	// Renumber IDs so GetSessionAndOption works (opt_0, opt_1, ...)
	for i := range out {
		out[i].ID = fmt.Sprintf("opt_%d", i)
	}
	return out
}

// parseAmadeusTime parses ISO timestamps from Amadeus; prefers RFC3339 (timezone preserved).
func parseAmadeusTime(s string) (time.Time, error) {
	if s == "" {
		return time.Time{}, fmt.Errorf("empty time")
	}
	if t, err := time.Parse(time.RFC3339, s); err == nil {
		return t, nil
	}
	if t, err := time.Parse(time.RFC3339Nano, s); err == nil {
		return t, nil
	}
	// No Z suffix: treat as UTC for consistency
	if t, err := time.Parse("2006-01-02T15:04:05.999", s); err == nil {
		return t.UTC(), nil
	}
	if t, err := time.Parse("2006-01-02T15:04:05", s); err == nil {
		return t.UTC(), nil
	}
	return time.Time{}, fmt.Errorf("could not parse time %q", s)
}

func (r *CreateSearchSessionRequest) CurrencyOrDefault() string {
	if r.Currency != "" {
		return r.Currency
	}
	return "USD"
}

// --- Monthly deals API (per backend_api_contracts.md) ---

type DayDeal struct {
	Date        string          `json:"date"`
	LowestPrice *MonetaryAmount `json:"lowestPrice,omitempty"`
}

type MonthDealsResponse struct {
	Route struct {
		Origin      AirportLike `json:"origin"`
		Destination AirportLike `json:"destination"`
	} `json:"route"`
	Year     int       `json:"year"`
	Month    int       `json:"month"`
	Currency string    `json:"currency"`
	Days     []DayDeal `json:"days"`
}

// --- Airport autocomplete API ---

type AirportCityType string

const (
	AirportType AirportCityType = "AIRPORT"
	CityType    AirportCityType = "CITY"
)

type AirportCityResult struct {
	ID          string          `json:"id"`
	Type        AirportCityType `json:"type"`
	AirportCode string          `json:"airportCode,omitempty"`
	CityCode    string          `json:"cityCode,omitempty"`
	Name        string          `json:"name"`
	CityName    string          `json:"cityName,omitempty"`
	CountryCode string          `json:"countryCode,omitempty"`
}

type AirportCitySearchResponse struct {
	Items []AirportCityResult `json:"items"`
}

var airportDirectory = []AirportCityResult{
	{ID: "TLV", Type: AirportType, AirportCode: "TLV", CityCode: "TLV", Name: "Ben Gurion Intl", CityName: "Tel Aviv", CountryCode: "IL"},
	{ID: "NAP", Type: AirportType, AirportCode: "NAP", CityCode: "NAP", Name: "Naples Intl", CityName: "Naples", CountryCode: "IT"},
	{ID: "HND", Type: AirportType, AirportCode: "HND", CityCode: "TYO", Name: "Tokyo Haneda", CityName: "Tokyo", CountryCode: "JP"},
	{ID: "BER", Type: AirportType, AirportCode: "BER", CityCode: "BER", Name: "Berlin Brandenburg", CityName: "Berlin", CountryCode: "DE"},
}

func handleAirportSearch(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodOptions {
		writeJSON(w, http.StatusNoContent, nil)
		return
	}
	if r.Method != http.MethodGet {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}
	q := strings.TrimSpace(strings.ToLower(r.URL.Query().Get("q")))
	if q == "" {
		writeJSON(w, http.StatusOK, AirportCitySearchResponse{Items: []AirportCityResult{}})
		return
	}
	limit := 10
	if lStr := r.URL.Query().Get("limit"); lStr != "" {
		if v, err := strconv.Atoi(lStr); err == nil && v > 0 {
			limit = v
		}
	}
	var items []AirportCityResult
	for _, a := range airportDirectory {
		if strings.Contains(strings.ToLower(a.AirportCode), q) ||
			strings.Contains(strings.ToLower(a.CityCode), q) ||
			strings.Contains(strings.ToLower(a.Name), q) ||
			strings.Contains(strings.ToLower(a.CityName), q) {
			items = append(items, a)
			if len(items) >= limit {
				break
			}
		}
	}
	writeJSON(w, http.StatusOK, AirportCitySearchResponse{Items: items})
}

// --- Flight details API (for monthly deals modal) ---

type FareBreakdown struct {
	Currency string  `json:"currency"`
	Total    float64 `json:"total"`
}

type StopsSummary struct {
	Outbound int `json:"outbound"`
	Return   int `json:"return"`
}

type FlightDetailsResponse struct {
	Origin        AirportLike    `json:"origin"`
	Destination   AirportLike    `json:"destination"`
	DepartureDate string         `json:"departureDate"`
	ReturnDate    string         `json:"returnDate"`
	DurationDays  int            `json:"durationDays"`
	Outbound      FlightLeg      `json:"outbound"`
	Return        FlightLeg      `json:"return"`
	TotalPrice    MonetaryAmount `json:"totalPrice"`
	Fare          *FareBreakdown `json:"fare,omitempty"`
	Stops         StopsSummary   `json:"stops"`
}

// normalizeSingleOffer converts a single raw offer into one FlightOption using the
// existing normalization logic.
func normalizeSingleOffer(offer map[string]interface{}, req *CreateSearchSessionRequest) (*FlightOption, error) {
	options := normalizeFlightOptions([]map[string]interface{}{offer}, req)
	if len(options) == 0 {
		return nil, fmt.Errorf("no normalized options")
	}
	return &options[0], nil
}

func handleFlightDetails(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodOptions {
		writeJSON(w, http.StatusNoContent, nil)
		return
	}
	if r.Method != http.MethodGet {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}

	if amadeusClient == nil {
		writeJSON(w, http.StatusInternalServerError, map[string]string{"error": "backend not initialized"})
		return
	}

	q := r.URL.Query()
	origin := strings.TrimSpace(strings.ToUpper(q.Get("origin")))
	destination := strings.TrimSpace(strings.ToUpper(q.Get("destination")))
	dateStr := q.Get("date")
	durationStr := q.Get("durationDays")
	currency := strings.TrimSpace(strings.ToUpper(q.Get("currency")))
	if currency == "" {
		currency = "USD"
	}
	switch currency {
	case "USD", "GBP", "EUR", "ILS", "JPY":
	default:
		currency = "USD"
	}

	if origin == "" || destination == "" || dateStr == "" {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": "origin, destination and date are required"})
		return
	}

	startDate, err := time.Parse("2006-01-02", dateStr)
	if err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid date (use YYYY-MM-DD)"})
		return
	}

	durationDays := 7
	if durationStr != "" {
		if v, err := strconv.Atoi(durationStr); err == nil && v > 0 {
			durationDays = v
		}
	}

	adults := 1
	if a := q.Get("adults"); a != "" {
		if v, err := strconv.Atoi(a); err == nil && v >= 1 {
			adults = v
		}
	}
	children := 0
	if ch := q.Get("children"); ch != "" {
		if v, err := strconv.Atoi(ch); err == nil && v >= 0 {
			children = v
		}
	}

	endDate := startDate

	// Reuse existing deals search for a single day to find the best round-trip.
	deals, err := amadeusClient.SearchDealsRange(origin, destination, startDate, endDate, durationDays, currency, adults, children, false)
	if err != nil || len(deals) == 0 {
		writeJSON(w, http.StatusBadGateway, map[string]string{"error": "no deals found for requested date"})
		return
	}
	trip := deals[0]

	// Normalize outbound and return offers to FlightLegs using existing logic.
	outReq := &CreateSearchSessionRequest{
		Origin:        origin,
		Destination:   destination,
		DepartureDate: trip.OutboundDate,
		CabinClass:    "ECONOMY",
		Currency:      currency,
	}
	retReq := &CreateSearchSessionRequest{
		Origin:        destination,
		Destination:   origin,
		DepartureDate: trip.ReturnDate,
		CabinClass:    "ECONOMY",
		Currency:      currency,
	}

	outOpt, err := normalizeSingleOffer(trip.OutboundFlight, outReq)
	if err != nil || len(outOpt.Legs) == 0 {
		writeJSON(w, http.StatusBadGateway, map[string]string{"error": "failed to normalize outbound flight"})
		return
	}
	retOpt, err := normalizeSingleOffer(trip.ReturnFlight, retReq)
	if err != nil || len(retOpt.Legs) == 0 {
		writeJSON(w, http.StatusBadGateway, map[string]string{"error": "failed to normalize return flight"})
		return
	}

	outLeg := outOpt.Legs[0]
	retLeg := retOpt.Legs[0]

	countStops := func(leg FlightLeg) int {
		if len(leg.Segments) == 0 {
			return 0
		}
		return len(leg.Segments) - 1
	}

	resp := FlightDetailsResponse{
		Origin:        AirportLike{Code: origin},
		Destination:   AirportLike{Code: destination},
		DepartureDate: trip.OutboundDate,
		ReturnDate:    trip.ReturnDate,
		DurationDays:  durationDays,
		Outbound:      outLeg,
		Return:        retLeg,
		TotalPrice: MonetaryAmount{
			Currency: outReq.CurrencyOrDefault(),
			Amount:   trip.TotalCost,
		},
		Fare: &FareBreakdown{
			Currency: outReq.CurrencyOrDefault(),
			Total:    trip.TotalCost,
		},
		Stops: StopsSummary{
			Outbound: countStops(outLeg),
			Return:   countStops(retLeg),
		},
	}

	writeJSON(w, http.StatusOK, resp)
}

func handleMonthDeals(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodOptions {
		writeJSON(w, http.StatusNoContent, nil)
		return
	}
	if r.Method != http.MethodGet {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}

	origin := strings.TrimSpace(strings.ToUpper(r.URL.Query().Get("origin")))
	destination := strings.TrimSpace(strings.ToUpper(r.URL.Query().Get("destination")))
	yearStr := r.URL.Query().Get("year")
	monthStr := r.URL.Query().Get("month")
	durationStr := r.URL.Query().Get("durationDays")
	startDateStr := r.URL.Query().Get("startDate")
	endDateStr := r.URL.Query().Get("endDate")
	currency := strings.TrimSpace(strings.ToUpper(r.URL.Query().Get("currency")))
	if currency == "" {
		currency = "USD"
	}
	// Amadeus supports common codes; default to USD if unsupported
	switch currency {
	case "USD", "GBP", "EUR", "ILS", "JPY":
		// use as-is
	default:
		currency = "USD"
	}

	if origin == "" || destination == "" {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": "origin and destination are required"})
		return
	}
	// Either (year + month) for full month, or (startDate + endDate) for range.
	useRange := startDateStr != "" && endDateStr != ""
	if !useRange && (yearStr == "" || monthStr == "") {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": "year and month are required, or startDate and endDate"})
		return
	}

	var year, month int
	if !useRange {
		var err error
		year, err = strconv.Atoi(yearStr)
		if err != nil || year < 2000 || year > 2100 {
			writeJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid year"})
			return
		}
		month, err = strconv.Atoi(monthStr)
		if err != nil || month < 1 || month > 12 {
			writeJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid month (1-12)"})
			return
		}
	}

	durationDays := 7
	if durationStr != "" {
		if v, err := strconv.Atoi(durationStr); err == nil && v > 0 {
			durationDays = v
		}
	}

	adults := 1
	if a := r.URL.Query().Get("adults"); a != "" {
		if v, err := strconv.Atoi(a); err == nil && v >= 1 {
			adults = v
		}
	}
	children := 0
	if ch := r.URL.Query().Get("children"); ch != "" {
		if v, err := strconv.Atoi(ch); err == nil && v >= 0 {
			children = v
		}
	}
	nonStop := strings.ToLower(r.URL.Query().Get("nonStop")) == "true"

	if amadeusClient == nil {
		writeJSON(w, http.StatusInternalServerError, map[string]string{"error": "backend not initialized"})
		return
	}

	var deals []FullRoundTrip
	var byDate map[string]float64
	var days []DayDeal
	var rangeYear, rangeMonth int
	var err error

	if useRange {
		startDate, err1 := time.Parse("2006-01-02", startDateStr)
		endDate, err2 := time.Parse("2006-01-02", endDateStr)
		if err1 != nil || err2 != nil || endDate.Before(startDate) {
			writeJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid startDate/endDate (use YYYY-MM-DD)"})
			return
		}
		deals, err = amadeusClient.SearchDealsRange(origin, destination, startDate, endDate, durationDays, currency, adults, children, nonStop)
		if err != nil {
			log.Printf("[MONTH_DEALS] SearchDealsRange error: %v", err)
			writeJSON(w, http.StatusBadGateway, map[string]string{"error": fmt.Sprintf("deals search failed: %v", err)})
			return
		}
		byDate = make(map[string]float64)
		for _, trip := range deals {
			d := trip.OutboundDate
			if p, ok := byDate[d]; !ok || trip.TotalCost < p {
				byDate[d] = trip.TotalCost
			}
		}
		for d := startDate; !d.After(endDate); d = d.AddDate(0, 0, 1) {
			date := d.Format("2006-01-02")
			dayDeal := DayDeal{Date: date}
			if amount, ok := byDate[date]; ok && amount > 0 {
				dayDeal.LowestPrice = &MonetaryAmount{Currency: currency, Amount: amount}
			}
			days = append(days, dayDeal)
		}
		rangeYear = startDate.Year()
		rangeMonth = int(startDate.Month())
	} else {
		monthTime := time.Date(year, time.Month(month), 1, 0, 0, 0, 0, time.UTC)
		deals, err = amadeusClient.SearchMonthDeals(origin, destination, monthTime, durationDays, currency, adults, children, nonStop)
		if err != nil {
			log.Printf("[MONTH_DEALS] SearchMonthDeals error: %v", err)
			writeJSON(w, http.StatusBadGateway, map[string]string{"error": fmt.Sprintf("month deals search failed: %v", err)})
			return
		}
		byDate = make(map[string]float64)
		for _, trip := range deals {
			d := trip.OutboundDate
			if p, ok := byDate[d]; !ok || trip.TotalCost < p {
				byDate[d] = trip.TotalCost
			}
		}
		daysInMonth := time.Date(year, time.Month(month)+1, 0, 0, 0, 0, 0, time.UTC).Day()
		for d := 1; d <= daysInMonth; d++ {
			date := fmt.Sprintf("%04d-%02d-%02d", year, month, d)
			dayDeal := DayDeal{Date: date}
			if amount, ok := byDate[date]; ok && amount > 0 {
				dayDeal.LowestPrice = &MonetaryAmount{Currency: currency, Amount: amount}
			}
			days = append(days, dayDeal)
		}
		rangeYear = year
		rangeMonth = month
	}

	resp := MonthDealsResponse{
		Year:     rangeYear,
		Month:    rangeMonth,
		Currency: currency,
		Days:     days,
	}
	resp.Route.Origin = AirportLike{Code: origin}
	resp.Route.Destination = AirportLike{Code: destination}

	writeJSON(w, http.StatusOK, resp)
}

// --- Affiliate redirect and outbound-link (per affiliate plan) ---

func handleAffiliateRedirect(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusNoContent)
		return
	}
	if r.Method != http.MethodGet {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}
	q := r.URL.Query()
	sessionID := strings.TrimSpace(q.Get("sessionId"))
	optionID := strings.TrimSpace(q.Get("optionId"))
	if sessionID == "" || optionID == "" {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": "sessionId and optionId are required"})
		return
	}
	resp, option := GetSessionAndOption(sessionID, optionID)
	if resp == nil || option == nil {
		writeJSON(w, http.StatusNotFound, map[string]string{"error": "session or option not found"})
		return
	}
	var redirectURL string
	if option.DeepLink != "" {
		redirectURL = option.DeepLink
	} else {
		provider := ResolveProvider(option)
		redirectURL = BuildRedirectURL(&resp.Session, option, provider, sessionID, optionID)
	}
	if redirectURL == "" {
		writeJSON(w, http.StatusInternalServerError, map[string]string{"error": "could not build redirect URL"})
		return
	}
	provider := ResolveProvider(option)
	_ = RecordClick(sessionID, optionID, provider, redirectURL)
	w.Header().Set("Location", redirectURL)
	w.WriteHeader(http.StatusFound)
}

func handleAffiliateOutboundLink(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusNoContent)
		return
	}
	if r.Method != http.MethodGet {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}
	q := r.URL.Query()
	sessionID := strings.TrimSpace(q.Get("sessionId"))
	optionID := strings.TrimSpace(q.Get("optionId"))
	if sessionID == "" || optionID == "" {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": "sessionId and optionId are required"})
		return
	}
	resp, option := GetSessionAndOption(sessionID, optionID)
	if resp == nil || option == nil {
		writeJSON(w, http.StatusNotFound, map[string]string{"error": "session or option not found"})
		return
	}
	var redirectURL string
	if option.DeepLink != "" {
		redirectURL = option.DeepLink
	} else {
		provider := ResolveProvider(option)
		redirectURL = BuildRedirectURL(&resp.Session, option, provider, sessionID, optionID)
	}
	if redirectURL == "" {
		writeJSON(w, http.StatusInternalServerError, map[string]string{"error": "could not build redirect URL"})
		return
	}
	provider := ResolveProvider(option)
	clickID := RecordClick(sessionID, optionID, provider, redirectURL)
	writeJSON(w, http.StatusOK, OutboundLinkResponse{
		RedirectURL: redirectURL,
		Provider:    *provider,
		ClickID:     clickID,
	})
}

func handleAffiliateProvider(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusNoContent)
		return
	}
	if r.Method != http.MethodGet {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}
	q := r.URL.Query()
	sessionID := strings.TrimSpace(q.Get("sessionId"))
	optionID := strings.TrimSpace(q.Get("optionId"))
	if sessionID == "" || optionID == "" {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": "sessionId and optionId are required"})
		return
	}
	_, option := GetSessionAndOption(sessionID, optionID)
	if option == nil {
		writeJSON(w, http.StatusNotFound, map[string]string{"error": "session or option not found"})
		return
	}
	provider := ResolveProvider(option)
	writeJSON(w, http.StatusOK, ProviderResponse{Provider: *provider})
}

// handleOutBooking is the uniform booking redirect: GET /api/out/booking?sessionId=...&optionId=...
// Builds link via BuildUniformBookingLink (prefer option.DeepLink, else prefill), records click, returns 302.
func handleOutBooking(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusNoContent)
		return
	}
	if r.Method != http.MethodGet {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}
	q := r.URL.Query()
	sessionID := strings.TrimSpace(q.Get("sessionId"))
	optionID := strings.TrimSpace(q.Get("optionId"))
	if sessionID == "" || optionID == "" {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": "sessionId and optionId are required"})
		return
	}
	resp, option := GetSessionAndOption(sessionID, optionID)
	if resp == nil || option == nil {
		writeJSON(w, http.StatusNotFound, map[string]string{"error": "session or option not found"})
		return
	}
	redirectURL := BuildUniformBookingLink(&resp.Session, option)
	if redirectURL == "" {
		writeJSON(w, http.StatusInternalServerError, map[string]string{"error": "could not build booking URL"})
		return
	}
	provider := ResolveProvider(option)
	_ = RecordClick(sessionID, optionID, provider, redirectURL)
	w.Header().Set("Location", redirectURL)
	w.WriteHeader(http.StatusFound)
}

func handleAffiliateClicksSummary(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusNoContent)
		return
	}
	if r.Method != http.MethodGet {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}
	q := r.URL.Query()
	fromStr := q.Get("from")
	toStr := q.Get("to")
	var from, to time.Time
	if fromStr != "" {
		t, err := time.Parse("2006-01-02", fromStr)
		if err != nil {
			writeJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid from date (use YYYY-MM-DD)"})
			return
		}
		from = t
	}
	if toStr != "" {
		t, err := time.Parse("2006-01-02", toStr)
		if err != nil {
			writeJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid to date (use YYYY-MM-DD)"})
			return
		}
		to = t
	}
	summary := GetClicksSummary(from, to)
	writeJSON(w, http.StatusOK, summary)
}

// handleHealth returns a simple JSON health status for uptime checks.
func handleHealth(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodOptions {
		writeJSON(w, http.StatusNoContent, nil)
		return
	}
	if r.Method != http.MethodGet {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}
	writeJSON(w, http.StatusOK, map[string]string{"status": "ok"})
}

// allowedCORSOrigins are origins allowed for CORS (production + dev).
var allowedCORSOrigins = map[string]bool{
	"https://fly-fix.com":   true,
	"http://localhost:19006": true, // Expo web/dev
	"http://localhost:8081":  true, // local web/dev
}

func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		origin := r.Header.Get("Origin")
		if allowedCORSOrigins[origin] {
			w.Header().Set("Access-Control-Allow-Origin", origin)
		}
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}
		next.ServeHTTP(w, r)
	})
}

func main() {
	// Load .env file for AMADEUS_CLIENT_ID / AMADEUS_CLIENT_SECRET, DUFFEL_API_KEY, etc.
	if err := godotenv.Load(); err != nil {
		// Try backend/.env when run from project root
		if err2 := godotenv.Load(filepath.Join("backend", ".env")); err2 != nil {
			log.Println("Note: .env file not found; falling back to process environment.")
		}
	}

	amadeusClient = NewAmadeusClient()
	duffelClient = NewDuffelClient()
	if duffelClient != nil {
		log.Println("[STARTUP] Duffel client: enabled")
	} else {
		log.Println("[STARTUP] Duffel client: disabled (set DUFFEL_API_KEY in .env to enable)")
	}
	googleFlights2Provider = search.NewGoogleFlights2Provider()
	if googleFlights2Provider != nil {
		log.Println("[STARTUP] Google Flights2 provider: enabled")
	} else {
		log.Println("[STARTUP] Google Flights2 provider: disabled (set GOOGLEFLIGHTS2_ENABLED=true and GOOGLEFLIGHTS2_RAPIDAPI_KEY)")
	}
	startExchangeRateRefresh()

	mux := http.NewServeMux()
	mux.HandleFunc("/health", handleHealth)
	mux.HandleFunc("/api/health", handleHealth)
	mux.HandleFunc("/api/search/sessions", handleCreateSession)
	mux.HandleFunc("/api/search/sessions/", handleGetSession)
	mux.HandleFunc("/api/deals/month", handleMonthDeals)
	mux.HandleFunc("/api/flights/details", handleFlightDetails)
	mux.HandleFunc("/api/airports/search", handleAirportSearch)
	mux.HandleFunc("/api/affiliate/redirect", handleAffiliateRedirect)
	mux.HandleFunc("/api/affiliate/outbound-link", handleAffiliateOutboundLink)
	mux.HandleFunc("/api/affiliate/provider", handleAffiliateProvider)
	mux.HandleFunc("/api/affiliate/clicks/summary", handleAffiliateClicksSummary)
	mux.HandleFunc("/api/out/booking", handleOutBooking)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	addr := ":" + port
	server := &http.Server{
		Addr:         addr,
		Handler:      corsMiddleware(mux),
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 30 * time.Second,
	}

	log.Printf("Go HTTP API listening on %s", addr)
	log.Fatal(server.ListenAndServe())
}
