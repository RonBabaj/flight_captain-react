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

	"flightcaptainweb/search"

	"github.com/joho/godotenv"
)

const frankfurterURL = "https://api.frankfurter.dev/v1/latest?base=USD&symbols=GBP,EUR,ILS,JPY"
const exchangeRefreshInterval = 1 * time.Hour

var (
	exchangeRatesMu    sync.RWMutex
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

func (r *CreateSearchSessionRequest) InfantsOrDefault() int {
	if r.Infants < 0 {
		return 0
	}
	return r.Infants
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
	From               AirportLike `json:"from"`
	To                 AirportLike `json:"to"`
	DepartureTime      time.Time   `json:"departureTime"`
	ArrivalTime        time.Time   `json:"arrivalTime"`
	MarketingCarrier   Carrier     `json:"marketingCarrier"`
	OperatingCarrier   *Carrier    `json:"operatingCarrier,omitempty"` // when present, flight is codeshare (marketing != operating)
	FlightNumber       string      `json:"flightNumber"`
	OperatingFlightNum string      `json:"operatingFlightNumber,omitempty"` // effective flight number when operated by different carrier
	DurationMinutes    int         `json:"durationMinutes"`
	CabinClass         string      `json:"cabinClass"`
}

type FlightLeg struct {
	Segments []FlightSegment `json:"segments"`
}

// LayoverSummary is a stop between two consecutive segments (at segment[i].from == segment[i-1].to).
type LayoverSummary struct {
	AirportCode string `json:"airportCode"`
	Minutes     int    `json:"minutes"`
}

// OutboundSummary is the canonical summary for the outbound leg (legs[0]) used by result cards and details modal.
type OutboundSummary struct {
	DepartureTime   time.Time        `json:"departureTime"`
	ArrivalTime     time.Time        `json:"arrivalTime"`
	DurationMinutes int              `json:"durationMinutes"`
	StopsCount      int              `json:"stopsCount"`
	Layovers        []LayoverSummary `json:"layovers,omitempty"`
}

// SellerOption represents one way to book the same physical flight (e.g. different marketing carrier or provider).
type SellerOption struct {
	CarrierCode string         `json:"carrierCode"`        // marketing carrier for this offer
	Provider    string         `json:"provider,omitempty"` // "amadeus" | "duffel" | "compare"
	VendorName  string         `json:"vendorName,omitempty"`
	Price       MonetaryAmount `json:"price"`
	BookingURL  string         `json:"bookingUrl,omitempty"` // empty if not available
}

type FlightOption struct {
	ID                    string           `json:"id"`
	Price                 MonetaryAmount   `json:"price"`
	OriginalPrice         *MonetaryAmount  `json:"originalPrice,omitempty"`
	PriceIsEstimate       bool             `json:"priceIsEstimate,omitempty"`
	DurationMinutes       int              `json:"durationMinutes"`
	Legs                  []FlightLeg      `json:"legs"`
	Fare                  *FareBreakdown   `json:"fare,omitempty"`
	OutboundSummary       *OutboundSummary `json:"outboundSummary,omitempty"`
	ValidatingAirlines    []string         `json:"validatingAirlines,omitempty"`
	BaggageClass          string           `json:"baggageClass,omitempty"`          // BAG_OK, BAG_UNKNOWN, BAG_INCLUDED
	PrimaryDisplayCarrier string           `json:"primaryDisplayCarrier,omitempty"` // main airline for UI/affiliate (marketing first)
	Source                string           `json:"source,omitempty"`                // "amadeus" | "duffel" | "compare"
	DeepLink              string           `json:"deepLink,omitempty"`              // provider booking link (e.g. Duffel)
	BookingURL            string           `json:"-"`                               // normalized internal booking URL used by /api/out/booking
	VendorName            string           `json:"vendorName,omitempty"`            // OTA name (kayak/expedia etc) when source=compare
	CanonicalFingerprint  string           `json:"canonicalFingerprint,omitempty"`  // stable hash for dedupe; optional in response

	// Codeshare / multi-seller (additive)
	PrimaryMarketingCarrier string         `json:"primaryMarketingCarrier,omitempty"` // first segment marketing
	PrimaryOperatingCarrier string         `json:"primaryOperatingCarrier,omitempty"` // first segment operating (if codeshare)
	IsCodeshare             bool           `json:"isCodeshare,omitempty"`
	MarketedBy              []string       `json:"marketedBy,omitempty"`     // distinct marketing carriers selling this flight
	CheapestSeller          string         `json:"cheapestSeller,omitempty"` // provider/source of the main (cheapest) offer
	SellerOptions           []SellerOption `json:"sellerOptions,omitempty"`  // other sellers for same physical flight
}

type SearchSessionResultsResponse struct {
	Session SearchSession  `json:"session"`
	Version int64          `json:"version"`
	Results []FlightOption `json:"results"`
}

const searchSessionTTL = 25 * time.Minute

var (
	sessions               = make(map[string]SearchSessionResultsResponse)
	sessionsMu             sync.Mutex
	googleFlights2Provider *search.GoogleFlights2Provider
)

// loadSearchSession returns the stored session if present and not expired; expired entries are deleted.
func loadSearchSession(id string) (SearchSessionResultsResponse, bool) {
	sessionsMu.Lock()
	defer sessionsMu.Unlock()
	resp, ok := sessions[id]
	if !ok {
		return SearchSessionResultsResponse{}, false
	}
	if time.Since(resp.Session.CreatedAt) > searchSessionTTL {
		delete(sessions, id)
		return SearchSessionResultsResponse{}, false
	}
	return resp, true
}

func startSearchSessionCleanup() {
	go func() {
		t := time.NewTicker(5 * time.Minute)
		defer t.Stop()
		for range t.C {
			sessionsMu.Lock()
			now := time.Now()
			for id, resp := range sessions {
				if now.Sub(resp.Session.CreatedAt) > searchSessionTTL {
					delete(sessions, id)
				}
			}
			sessionsMu.Unlock()
		}
	}()
}

const (
	maxOffersReturnedToClient = 50
	minOkForStrictBags        = 10 // soft-strict: if BAG_OK count >= this, use only BAG_OK; else BAG_OK+ BAG_UNKNOWN
)

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
	// Accept an offer when at least one segment across any traveler pricing matches
	// the requested cabin. This handles the common case where a long-haul First/Business
	// itinerary includes a short Economy connecting hop — requiring every segment to match
	// would eliminate every such offer.
	anyMatch := false
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
			c, ok := fd["cabin"].(string)
			if !ok || c == "" {
				continue
			}
			if strings.EqualFold(c, cabin) {
				anyMatch = true
			}
		}
	}
	return anyMatch
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

func baggageOrderString(class string) int {
	switch class {
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

func classifyFlightOptionBaggage(opt *FlightOption) string {
	if opt == nil {
		return BaggageUnknown
	}
	if opt.BaggageClass != "" {
		return opt.BaggageClass
	}
	return BaggageUnknown
}

// applySoftStrictBaggageOptions mirrors applySoftStrictBaggage for normalized FlightOptions (e.g. GF2).
func applySoftStrictBaggageOptions(offers []FlightOption, includeCheckedBag bool) (
	selected []FlightOption,
	okCount, unknownCount, includedCount int,
	minOkThresholdUsed, fallback bool,
) {
	for i := range offers {
		offers[i].BaggageClass = classifyFlightOptionBaggage(&offers[i])
	}
	okOffers := make([]FlightOption, 0)
	unknownOffers := make([]FlightOption, 0)
	includedOffers := make([]FlightOption, 0)
	for _, o := range offers {
		switch o.BaggageClass {
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
	selected = append(append([]FlightOption{}, okOffers...), unknownOffers...)
	if len(selected) == 0 {
		selected = offers
		fallback = true
	}
	return selected, okCount, unknownCount, includedCount, false, fallback
}

// segmentMatchesCabinClass implements the same cabin rule as early GF2 filtering: empty segment cabin counts as ECONOMY only.
func segmentMatchesCabinClass(seg FlightSegment, wantUpper string) bool {
	sc := strings.TrimSpace(seg.CabinClass)
	if sc == "" {
		return wantUpper == "ECONOMY"
	}
	return strings.EqualFold(sc, wantUpper)
}

func optionMatchesCabinFlightOption(opt *FlightOption, cabin string) bool {
	if cabin == "" {
		return true
	}
	want := strings.ToUpper(strings.TrimSpace(cabin))
	for _, leg := range opt.Legs {
		for _, seg := range leg.Segments {
			if segmentMatchesCabinClass(seg, want) {
				return true
			}
		}
	}
	return false
}

func filterFlightOptionsByCabinPref(opts []FlightOption, cabin string) []FlightOption {
	if cabin == "" {
		return opts
	}
	var out []FlightOption
	for i := range opts {
		if optionMatchesCabinFlightOption(&opts[i], cabin) {
			out = append(out, opts[i])
		}
	}
	return out
}

// CarrierCodes holds marketing, operating, and validating carrier codes extracted from a raw offer.
type CarrierCodes struct {
	Marketing  []string
	Operating  []string
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

func writeJSON(w http.ResponseWriter, code int, v any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(code)
	_ = json.NewEncoder(w).Encode(v)
}

// writeOptionsNoContent responds to CORS preflight without a JSON body (204 must be empty).
func writeOptionsNoContent(w http.ResponseWriter) {
	w.WriteHeader(http.StatusNoContent)
}

func handleCreateSession(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodOptions {
		writeOptionsNoContent(w)
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

	var missing []string
	if strings.TrimSpace(req.Origin) == "" {
		missing = append(missing, "origin")
	}
	if strings.TrimSpace(req.Destination) == "" {
		missing = append(missing, "destination")
	}
	if strings.TrimSpace(req.DepartureDate) == "" {
		missing = append(missing, "departureDate")
	}
	if len(missing) > 0 {
		writeJSON(w, http.StatusBadRequest, map[string]string{
			"error": fmt.Sprintf("missing required field(s): %s", strings.Join(missing, ", ")),
		})
		return
	}

	if req.Adults <= 0 {
		req.Adults = 1
	}
	req.Infants = req.InfantsOrDefault()

	if googleFlights2Provider == nil {
		writeJSON(w, http.StatusInternalServerError, map[string]string{"error": "flight search backend not configured"})
		return
	}

	cabinPref := req.CabinPrefOrDefault()
	includeBag := req.IncludeCheckedBagOrDefault()

	ctx, cancel := context.WithTimeout(r.Context(), 45*time.Second)
	defer cancel()
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

	prs, err := googleFlights2Provider.Search(ctx, sreq)
	if err != nil {
		log.Printf("[SEARCH] Google Flights2 error: %v", err)
		writeJSON(w, http.StatusBadGateway, map[string]string{"error": "flight search failed"})
		return
	}

	options := providerResultsToFlightOptions(prs)
	offersInitial := options

	offersAfterCabin := options
	if cabinPref != "" {
		offersAfterCabin = filterFlightOptionsByCabinPref(options, cabinPref)
		options = offersAfterCabin
	}

	selected, okCount, unknownCount, includedCount, _, bagFallback := applySoftStrictBaggageOptions(options, includeBag)
	options = selected

	if len(options) == 0 && len(offersAfterCabin) > 0 {
		options = offersAfterCabin
	}
	explicitPremiumCabin := cabinPref != "" && !strings.EqualFold(cabinPref, "ECONOMY")
	if len(options) == 0 && len(offersInitial) > 0 && !explicitPremiumCabin {
		options = offersInitial
		offersAfterCabin = options
	}

	if len(options) > 0 {
		if !includeBag {
			sort.Slice(options, func(i, j int) bool {
				oi, oj := baggageOrderString(options[i].BaggageClass), baggageOrderString(options[j].BaggageClass)
				if oi != oj {
					return oi < oj
				}
				return options[i].Price.Amount < options[j].Price.Amount
			})
		} else {
			sort.Slice(options, func(i, j int) bool {
				return options[i].Price.Amount < options[j].Price.Amount
			})
		}
		fallbackFlag := ""
		if bagFallback {
			fallbackFlag = "relaxedBagsAll"
		}
		log.Printf("[SEARCH] includeCheckedBag=%t okCount=%d unknownCount=%d includedCount=%d fallback=%s cheapest=%.2f baggageClass=%s",
			includeBag, okCount, unknownCount, includedCount, fallbackFlag, options[0].Price.Amount, options[0].BaggageClass)
	}

	if len(options) > 0 {
		seenM := make(map[string]struct{})
		for _, o := range options {
			for _, leg := range o.Legs {
				for _, seg := range leg.Segments {
					if c := seg.MarketingCarrier.Code; c != "" {
						seenM[c] = struct{}{}
					}
				}
			}
			for _, c := range o.ValidatingAirlines {
				if c != "" {
					seenM[c] = struct{}{}
				}
			}
		}
		log.Printf("[SEARCH_SUMMARY] results=%d cabinPreference=%s includeCheckedBag=%t okCount=%d unknownCount=%d includedCount=%d fallbackApplied=%t uniqueCarriers=%d",
			len(options), cabinPref, includeBag, okCount, unknownCount, includedCount, bagFallback, len(seenM))
	}

	if len(options) > maxOffersReturnedToClient {
		options = options[:maxOffersReturnedToClient]
	}

	requestedCurr := req.CurrencyOrDefault()

	if cabinPref != "" && !strings.EqualFold(cabinPref, "ECONOMY") {
		wantCabin := strings.ToUpper(strings.TrimSpace(cabinPref))
		filtered := options[:0]
		for _, opt := range options {
			match := false
			for _, leg := range opt.Legs {
				for _, seg := range leg.Segments {
					if segmentMatchesCabinClass(seg, wantCabin) {
						match = true
						break
					}
				}
				if match {
					break
				}
			}
			if match {
				filtered = append(filtered, opt)
			}
		}
		options = filtered
	}

	options = groupCodeshareAndMerge(options)

	for i := range options {
		sanitizeSegmentTimes(options[i].Legs)
		ensurePrimaryCarrier(&options[i])
		options[i].OutboundSummary = computeOutboundSummary(&options[i])
	}
	if len(options) > 0 {
		o := &options[0]
		sum := o.OutboundSummary
		if sum != nil {
			layoversStr := ""
			for _, l := range sum.Layovers {
				if layoversStr != "" {
					layoversStr += ","
				}
				layoversStr += l.AirportCode + "(" + fmt.Sprintf("%d", l.Minutes) + "m)"
			}
			log.Printf("[NORMALIZED_SUMMARY] departure=%s arrival=%s durationMinutes=%d stops=%d layovers=[%s]",
				sum.DepartureTime.Format("2006-01-02T15:04:05Z"),
				sum.ArrivalTime.Format("2006-01-02T15:04:05Z"),
				sum.DurationMinutes, sum.StopsCount, layoversStr)
		}
	}

	convertOptionsToCurrency(options, requestedCurr)
	applyPriceNormalization(options)
	sort.Slice(options, func(i, j int) bool {
		return options[i].Price.Amount < options[j].Price.Amount
	})
	if len(options) > maxOffersReturnedToClient {
		options = options[:maxOffersReturnedToClient]
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

	writeJSON(w, http.StatusOK, session)
}

func handleGetSession(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodOptions {
		writeOptionsNoContent(w)
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
	resp, ok := loadSearchSession(id)
	if !ok {
		writeJSON(w, http.StatusNotFound, map[string]string{"error": "session not found"})
		return
	}

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
		if p.Currency != requestedCurr {
			converted, _ := convertPrice(p.Amount, p.Currency, requestedCurr)
			p.Amount = converted
			p.Currency = requestedCurr
		}
		if options[i].OriginalPrice != nil {
			op := options[i].OriginalPrice
			if op.Currency != requestedCurr {
				converted, _ := convertPrice(op.Amount, op.Currency, requestedCurr)
				op.Amount = converted
				op.Currency = requestedCurr
			}
		}
		if options[i].Fare != nil {
			f := options[i].Fare
			if f.Currency != "" && f.Currency != requestedCurr {
				if f.Total > 0 {
					if conv, _ := convertPrice(f.Total, f.Currency, requestedCurr); conv > 0 {
						f.Total = conv
					}
				}
				if f.AdultsTotal > 0 {
					if conv, _ := convertPrice(f.AdultsTotal, f.Currency, requestedCurr); conv > 0 {
						f.AdultsTotal = conv
					}
				}
				if f.ChildrenTotal > 0 {
					if conv, _ := convertPrice(f.ChildrenTotal, f.Currency, requestedCurr); conv > 0 {
						f.ChildrenTotal = conv
					}
				}
				if f.InfantsTotal > 0 {
					if conv, _ := convertPrice(f.InfantsTotal, f.Currency, requestedCurr); conv > 0 {
						f.InfantsTotal = conv
					}
				}
				f.Currency = requestedCurr
			}
		}
	}
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

// sumSegmentDurations returns total minutes from all segment DurationMinutes. Used when segment times are missing but API provided per-segment duration.
func sumSegmentDurations(legs []FlightLeg) int {
	var total int
	for _, leg := range legs {
		for _, seg := range leg.Segments {
			if seg.DurationMinutes > 0 {
				total += seg.DurationMinutes
			}
		}
	}
	return total
}

// ensurePrimaryCarrier derives PrimaryDisplayCarrier from the first outbound segment when the provider didn't set it (e.g. Google Flights).
func ensurePrimaryCarrier(opt *FlightOption) {
	if opt.PrimaryDisplayCarrier != "" {
		return
	}
	if len(opt.Legs) > 0 {
		for _, seg := range opt.Legs[0].Segments {
			if seg.MarketingCarrier.Code != "" {
				opt.PrimaryDisplayCarrier = seg.MarketingCarrier.Code
				return
			}
		}
	}
}

// sanitizeSegmentTimes ensures no segment has identical departure and arrival when duration is known (fixes "02:20 -> 02:20" and fake 0h layovers).
func sanitizeSegmentTimes(legs []FlightLeg) {
	for i := range legs {
		for j := range legs[i].Segments {
			s := &legs[i].Segments[j]
			if !s.DepartureTime.IsZero() && s.DepartureTime.Equal(s.ArrivalTime) && s.DurationMinutes > 0 {
				s.ArrivalTime = s.DepartureTime.Add(time.Duration(s.DurationMinutes) * time.Minute)
			}
			if !s.ArrivalTime.IsZero() && s.DepartureTime.Equal(s.ArrivalTime) && s.DurationMinutes > 0 {
				s.DepartureTime = s.ArrivalTime.Add(-time.Duration(s.DurationMinutes) * time.Minute)
			}
		}
	}
}

// computeOutboundSummary builds the canonical outbound summary from legs[0] for result cards and details modal.
// Rules: departure = first segment dep, arrival = last segment arr, duration = last arr - first dep (or sum of segment durations), stopsCount = segments-1, layovers only between consecutive segments.
func computeOutboundSummary(opt *FlightOption) *OutboundSummary {
	if len(opt.Legs) == 0 || len(opt.Legs[0].Segments) == 0 {
		return nil
	}
	leg := &opt.Legs[0]
	segs := leg.Segments
	first := &segs[0]
	last := &segs[len(segs)-1]

	dep := first.DepartureTime
	arr := last.ArrivalTime
	durMin := 0
	if !dep.IsZero() && !arr.IsZero() {
		durMin = int(arr.Sub(dep).Minutes())
	}
	if durMin <= 0 {
		for _, s := range segs {
			durMin += s.DurationMinutes
		}
	}
	if durMin <= 0 && opt.DurationMinutes > 0 {
		durMin = opt.DurationMinutes
	}

	stopsCount := len(segs) - 1
	if stopsCount < 0 {
		stopsCount = 0
	}

	var layovers []LayoverSummary
	for i := 1; i < len(segs); i++ {
		prev := segs[i-1]
		curr := segs[i]
		if prev.ArrivalTime.IsZero() || curr.DepartureTime.IsZero() {
			continue
		}
		mins := int(curr.DepartureTime.Sub(prev.ArrivalTime).Minutes())
		if mins < 0 {
			mins = 0
		}
		airport := prev.To.Code
		if airport == "" {
			airport = curr.From.Code
		}
		layovers = append(layovers, LayoverSummary{AirportCode: airport, Minutes: mins})
	}

	return &OutboundSummary{
		DepartureTime:   dep,
		ArrivalTime:     arr,
		DurationMinutes: durMin,
		StopsCount:      stopsCount,
		Layovers:        layovers,
	}
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
		} else if sum := sumSegmentDurations(legs); sum > 0 {
			durMin = sum
		}
		opt := FlightOption{
			ID:                    pr.ID,
			Price:                 MonetaryAmount{Currency: pr.Price.Currency, Amount: pr.Price.Amount},
			DurationMinutes:       durMin,
			Legs:                  legs,
			ValidatingAirlines:    pr.ValidatingAirlines,
			BaggageClass:          pr.BaggageClass,
			PrimaryDisplayCarrier: pr.PrimaryDisplayCarrier,
			Source:                pr.Source,
			DeepLink:              pr.DeepLink,
			VendorName:            pr.VendorName,
		}
		sanitizeSegmentTimes(opt.Legs)
		ensurePrimaryCarrier(&opt)
		opt.BookingURL = normalizeProviderBookingURL(opt.DeepLink)
		opt.OutboundSummary = computeOutboundSummary(&opt)
		out = append(out, opt)
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

// groupCodeshareAndMerge groups options by operated-flight fingerprint (CodeshareFingerprint), keeps cheapest as main, attaches others as sellerOptions. One result per physical flight.
func groupCodeshareAndMerge(opts []FlightOption) []FlightOption {
	if len(opts) == 0 {
		return opts
	}
	type keyIndex struct {
		fp string
		i  int
	}
	var withFP []keyIndex
	for i := range opts {
		if opts[i].CanonicalFingerprint == "" {
			opts[i].CanonicalFingerprint = CanonicalFingerprint(&opts[i])
		}
		fp := CodeshareFingerprint(&opts[i])
		if fp == "" {
			fp = fmt.Sprintf("legacy_%d", i)
		}
		withFP = append(withFP, keyIndex{fp, i})
	}
	groups := make(map[string][]int)
	for _, ki := range withFP {
		groups[ki.fp] = append(groups[ki.fp], ki.i)
	}
	var out []FlightOption
	for _, indices := range groups {
		if len(indices) == 0 {
			continue
		}
		sort.Slice(indices, func(a, b int) bool {
			return opts[indices[a]].Price.Amount < opts[indices[b]].Price.Amount
		})
		cheapestIdx := indices[0]
		main := opts[cheapestIdx]
		main.CanonicalFingerprint = CanonicalFingerprint(&main)
		var sellers []SellerOption
		marketedBySet := make(map[string]struct{})
		if len(main.Legs) > 0 && len(main.Legs[0].Segments) > 0 {
			marketedBySet[strings.ToUpper(main.Legs[0].Segments[0].MarketingCarrier.Code)] = struct{}{}
		}
		for _, idx := range indices[1:] {
			o := &opts[idx]
			bookingURL := normalizeProviderBookingURL(o.DeepLink)
			if bookingURL == "" {
				bookingURL = normalizeProviderBookingURL(o.BookingURL)
			}
			carrier := ""
			if len(o.Legs) > 0 && len(o.Legs[0].Segments) > 0 {
				carrier = strings.ToUpper(o.Legs[0].Segments[0].MarketingCarrier.Code)
				marketedBySet[carrier] = struct{}{}
			}
			sellers = append(sellers, SellerOption{
				CarrierCode: carrier,
				Provider:    o.Source,
				VendorName:  o.VendorName,
				Price:       o.Price,
				BookingURL:  bookingURL,
			})
		}
		main.SellerOptions = sellers
		main.CheapestSeller = main.Source
		for c := range marketedBySet {
			main.MarketedBy = append(main.MarketedBy, c)
		}
		sort.Strings(main.MarketedBy)
		isCodeshare := false
		var primaryOperating string
		for _, leg := range main.Legs {
			for _, seg := range leg.Segments {
				if seg.OperatingCarrier != nil && seg.OperatingCarrier.Code != "" {
					if seg.OperatingCarrier.Code != seg.MarketingCarrier.Code {
						isCodeshare = true
					}
					if primaryOperating == "" {
						primaryOperating = seg.OperatingCarrier.Code
					}
					break
				}
			}
		}
		main.IsCodeshare = isCodeshare
		main.PrimaryOperatingCarrier = primaryOperating
		if len(main.Legs) > 0 && len(main.Legs[0].Segments) > 0 {
			main.PrimaryMarketingCarrier = main.Legs[0].Segments[0].MarketingCarrier.Code
		}
		out = append(out, main)
	}
	sort.Slice(out, func(i, j int) bool {
		return out[i].Price.Amount < out[j].Price.Amount
	})
	for i := range out {
		out[i].ID = fmt.Sprintf("opt_%d", i)
	}
	for i := range out {
		fp := CodeshareFingerprint(&out[i])
		if fp != "" {
			if g, ok := groups[fp]; ok && len(g) > 1 {
				log.Printf("[CODESHARE_GROUP] fingerprint=%s groupSize=%d isCodeshare=%t mainCarrier=%s operatedBy=%s marketedBy=%v cheapest=%.0f",
					fp, len(g), out[i].IsCodeshare, out[i].PrimaryMarketingCarrier, out[i].PrimaryOperatingCarrier, out[i].MarketedBy, out[i].Price.Amount)
			}
		}
	}
	return out
}

func (r *CreateSearchSessionRequest) CurrencyOrDefault() string {
	if r.Currency != "" {
		return r.Currency
	}
	return "USD"
}

// priceUpliftMultiplier returns a configurable multiplier to approximate realistic checkout totals.
// Env: SEARCH_PRICE_UPLIFT_PCT (e.g., "25" means 25% uplift => 1.25x). Defaults to 1.20 (20%).
func priceUpliftMultiplier() float64 {
	raw := strings.TrimSpace(os.Getenv("SEARCH_PRICE_UPLIFT_PCT"))
	if raw == "" {
		return 1.20
	}
	if v, err := strconv.ParseFloat(raw, 64); err == nil && v > 0 && v < 200 {
		return 1.0 + v/100.0
	}
	return 1.20
}

// applyPriceNormalization adjusts provider prices to be more realistic (include typical taxes/fees/OTA variance).
// Current strategy: apply a configurable uplift to Google Flights-derived results, preserving original in OriginalPrice.
func applyPriceNormalization(options []FlightOption) {
	if len(options) == 0 {
		return
	}
	mult := priceUpliftMultiplier()
	if mult <= 1.0 {
		return
	}
	for i := range options {
		if strings.EqualFold(strings.TrimSpace(options[i].Source), "googleflights2") {
			orig := options[i].Price
			newAmt := orig.Amount * mult
			// Basic sanity guard to avoid wild swings
			if newAmt > 0 && newAmt < orig.Amount*2.5 {
				options[i].OriginalPrice = &MonetaryAmount{Currency: orig.Currency, Amount: orig.Amount}
				options[i].Price.Amount = newAmt
				options[i].PriceIsEstimate = true
			}
			if options[i].Fare != nil && options[i].Fare.Total <= 0 {
				options[i].Fare.Total = options[i].Price.Amount
				options[i].Fare.Currency = options[i].Price.Currency
			}
		}
	}
}

// --- Monthly deals API (per backend_api_contracts.md) ---

type DayDeal struct {
	Date         string          `json:"date"`
	LowestPrice  *MonetaryAmount `json:"lowestPrice,omitempty"`
	Stops        *int            `json:"stops,omitempty"`        // outbound stop count (segments-1)
	Carriers     []string        `json:"carriers,omitempty"`     // outbound marketing carrier codes
	OutboundPath []string        `json:"outboundPath,omitempty"` // e.g. ["TLV","ADD","BKK","HND"]
	ReturnPath   []string        `json:"returnPath,omitempty"`   // e.g. ["HND","DOH","LCA","TLV"]
}

// iataCode safely extracts an IATA code from a nested Amadeus endpoint map
// (e.g. segment.departure or segment.arrival).
func iataCode(endpoint interface{}) string {
	m, ok := endpoint.(map[string]interface{})
	if !ok {
		return ""
	}
	code, _ := m["iataCode"].(string)
	return code
}

// extractRoutePath returns the ordered list of airport codes for one itinerary
// from a raw Amadeus flight offer (e.g. ["TLV","ADD","BKK","HND"]).
func extractRoutePath(offer map[string]interface{}) []string {
	if offer == nil {
		return nil
	}
	itinsRaw, ok := offer["itineraries"].([]interface{})
	if !ok || len(itinsRaw) == 0 {
		return nil
	}
	firstItin, ok := itinsRaw[0].(map[string]interface{})
	if !ok {
		return nil
	}
	segsRaw, ok := firstItin["segments"].([]interface{})
	if !ok || len(segsRaw) == 0 {
		return nil
	}
	var path []string
	for i, segAny := range segsRaw {
		seg, ok := segAny.(map[string]interface{})
		if !ok {
			continue
		}
		if i == 0 {
			if dep := iataCode(seg["departure"]); dep != "" {
				path = append(path, dep)
			}
		}
		if arr := iataCode(seg["arrival"]); arr != "" {
			path = append(path, arr)
		}
	}
	return path
}

// extractDealMeta derives stop count, carrier codes, and route path
// from a raw Amadeus flight offer map stored in FullRoundTrip.OutboundFlight.
func extractDealMeta(offer map[string]interface{}) (stops int, carriers []string, path []string) {
	path = extractRoutePath(offer)
	if offer == nil {
		return 0, nil, nil
	}
	itinsRaw, ok := offer["itineraries"].([]interface{})
	if !ok || len(itinsRaw) == 0 {
		return 0, nil, path
	}
	firstItin, ok := itinsRaw[0].(map[string]interface{})
	if !ok {
		return 0, nil, path
	}
	segsRaw, ok := firstItin["segments"].([]interface{})
	if !ok || len(segsRaw) == 0 {
		return 0, nil, path
	}
	stops = len(segsRaw) - 1
	seen := make(map[string]struct{})
	for _, segAny := range segsRaw {
		seg, ok := segAny.(map[string]interface{})
		if !ok {
			continue
		}
		if code, ok := seg["carrierCode"].(string); ok && code != "" {
			seen[code] = struct{}{}
		}
	}
	for code := range seen {
		carriers = append(carriers, code)
	}
	return stops, carriers, path
}

// extractDealMetaFromLeg derives stop count, carrier codes, and route path from a normalized FlightLeg (GF2).
func extractDealMetaFromLeg(leg *FlightLeg) (stops int, carriers []string, path []string) {
	if leg == nil || len(leg.Segments) == 0 {
		return 0, nil, nil
	}
	segs := leg.Segments
	stops = len(segs) - 1
	seen := make(map[string]struct{})
	for _, seg := range segs {
		if c := seg.MarketingCarrier.Code; c != "" {
			seen[strings.ToUpper(c)] = struct{}{}
		}
	}
	for c := range seen {
		carriers = append(carriers, c)
	}
	sort.Strings(carriers)
	for i, seg := range segs {
		if i == 0 && seg.From.Code != "" {
			path = append(path, seg.From.Code)
		}
		if seg.To.Code != "" {
			path = append(path, seg.To.Code)
		}
	}
	return stops, carriers, path
}

type MonthDealsResponse struct {
	Route struct {
		Origin      AirportLike `json:"origin"`
		Destination AirportLike `json:"destination"`
	} `json:"route"`
	Year      int       `json:"year"`
	Month     int       `json:"month"`
	StartDate string    `json:"startDate,omitempty"` // full range when using startDate/endDate query mode
	EndDate   string    `json:"endDate,omitempty"`
	Currency  string    `json:"currency"`
	Days      []DayDeal `json:"days"`
}

// Short TTL cache so repeat identical month-deals requests (e.g. QA back-to-back) avoid redundant GF2 work.
type monthDealsCacheEntry struct {
	expires time.Time
	resp    MonthDealsResponse
}

var (
	monthDealsCacheMu sync.Mutex
	monthDealsCache   = make(map[string]monthDealsCacheEntry)
)

const monthDealsCacheTTL = 15 * time.Minute

func monthDealsCacheKey(origin, destination, currency string, useRange bool, year, month int, startDateStr, endDateStr string, durationDays, adults, children int, nonStop bool) string {
	if useRange {
		return fmt.Sprintf("r\x1e%s\x1e%s\x1e%s\x1e%s\x1e%s\x1e%d\x1e%d\x1e%d\x1e%v", origin, destination, currency, startDateStr, endDateStr, durationDays, adults, children, nonStop)
	}
	return fmt.Sprintf("m\x1e%s\x1e%s\x1e%s\x1e%d\x1e%d\x1e%d\x1e%d\x1e%d\x1e%v", origin, destination, currency, year, month, durationDays, adults, children, nonStop)
}

func monthDealsCacheGet(key string) (MonthDealsResponse, bool) {
	now := time.Now()
	monthDealsCacheMu.Lock()
	defer monthDealsCacheMu.Unlock()
	e, ok := monthDealsCache[key]
	if !ok || now.After(e.expires) {
		if ok {
			delete(monthDealsCache, key)
		}
		return MonthDealsResponse{}, false
	}
	return e.resp, true
}

func monthDealsCachePut(key string, resp MonthDealsResponse) {
	monthDealsCacheMu.Lock()
	defer monthDealsCacheMu.Unlock()
	monthDealsCache[key] = monthDealsCacheEntry{expires: time.Now().Add(monthDealsCacheTTL), resp: resp}
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
		writeOptionsNoContent(w)
		return
	}
	if r.Method != http.MethodGet {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}
	q := strings.TrimSpace(strings.ToLower(r.URL.Query().Get("q")))
	limit := 10
	if lStr := r.URL.Query().Get("limit"); lStr != "" {
		if v, err := strconv.Atoi(lStr); err == nil && v > 0 {
			limit = v
		}
	}
	if q == "" {
		n := len(airportDirectory)
		if n > limit {
			n = limit
		}
		writeJSON(w, http.StatusOK, AirportCitySearchResponse{Items: airportDirectory[:n]})
		return
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
	Currency      string  `json:"currency"`
	Total         float64 `json:"total,omitempty"`
	AdultsTotal   float64 `json:"adultsTotal,omitempty"`
	ChildrenTotal float64 `json:"childrenTotal,omitempty"`
	InfantsTotal  float64 `json:"infantsTotal,omitempty"`
	AdultsCount   int     `json:"adultsCount,omitempty"`
	ChildrenCount int     `json:"childrenCount,omitempty"`
	InfantsCount  int     `json:"infantsCount,omitempty"`
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

func handleFlightDetails(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodOptions {
		writeOptionsNoContent(w)
		return
	}
	if r.Method != http.MethodGet {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}

	if googleFlights2Provider == nil {
		writeJSON(w, http.StatusInternalServerError, map[string]string{"error": "flight search backend not configured"})
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

	var missingFD []string
	if origin == "" {
		missingFD = append(missingFD, "origin")
	}
	if destination == "" {
		missingFD = append(missingFD, "destination")
	}
	if strings.TrimSpace(dateStr) == "" {
		missingFD = append(missingFD, "date")
	}
	if len(missingFD) > 0 {
		writeJSON(w, http.StatusBadRequest, map[string]string{
			"error": fmt.Sprintf("missing required field(s): %s", strings.Join(missingFD, ", ")),
		})
		return
	}

	startDate, err := time.Parse("2006-01-02", dateStr)
	if err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid date (use YYYY-MM-DD)"})
		return
	}

	durationDays := 7
	if durationStr != "" {
		v, err := strconv.Atoi(durationStr)
		if err != nil || v <= 0 {
			writeJSON(w, http.StatusBadRequest, map[string]string{"error": "durationDays must be a positive integer"})
			return
		}
		durationDays = v
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


	ctx, cancel := context.WithTimeout(r.Context(), 90*time.Second)
	defer cancel()
	outStr := startDate.Format("2006-01-02")
	retStr := startDate.AddDate(0, 0, durationDays).Format("2006-01-02")
	trip, err := gf2OneRoundTrip(ctx, googleFlights2Provider, origin, destination, outStr, retStr, currency, adults, children, "ECONOMY", false, false, true)
	if err != nil {
		log.Printf("[FLIGHT_DETAILS] gf2OneRoundTrip error: %v", err)
		writeJSON(w, http.StatusBadGateway, map[string]string{"error": "failed to load flight details"})
		return
	}
	if trip == nil || trip.CombinedOption == nil || len(trip.CombinedOption.Legs) == 0 {
		writeJSON(w, http.StatusBadGateway, map[string]string{"error": "no deals found for requested date"})
		return
	}
	opt := trip.CombinedOption
	opts := []FlightOption{*opt}
	convertOptionsToCurrency(opts, currency)
	applyPriceNormalization(opts)
	*opt = opts[0]
	trip.TotalCost = opt.Price.Amount

	outLeg := opt.Legs[0]
	retLeg := FlightLeg{}
	if len(opt.Legs) >= 2 {
		retLeg = opt.Legs[1]
	} else {
		log.Printf("[FLIGHT_DETAILS] warning: only outbound leg for %s→%s %s (return %s)", origin, destination, outStr, retStr)
	}

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
			Currency: currency,
			Amount:   trip.TotalCost,
		},
		Fare: &FareBreakdown{
			Currency: currency,
			Total:    trip.TotalCost,
		},
		Stops: StopsSummary{
			Outbound: countStops(outLeg),
			Return:   countStops(retLeg),
		},
	}

	writeJSON(w, http.StatusOK, resp)
}

func handleExplore(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodOptions {
		writeOptionsNoContent(w)
		return
	}
	if r.Method != http.MethodGet {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}

	limit := 10
	if ls := r.URL.Query().Get("limit"); ls != "" {
		if v, err := strconv.Atoi(ls); err == nil && v >= 1 {
			limit = v
			// Fixed destination pool is ≤ explorePoolMax (~64); allow one page for full list + progressive refresh.
			if limit > 80 {
				limit = 80
			}
		}
	}
	offset := 0
	if os := r.URL.Query().Get("offset"); os != "" {
		if v, err := strconv.Atoi(os); err == nil && v >= 0 {
			offset = v
		}
	}
	sessionID := strings.TrimSpace(r.URL.Query().Get("sessionId"))

	if googleFlights2Provider == nil {
		writeJSON(w, http.StatusInternalServerError, map[string]string{"error": "flight search backend not configured"})
		return
	}

	timeout := 10 * time.Minute
	ctx, cancel := context.WithTimeout(r.Context(), timeout)
	defer cancel()

	writeExplorePage := func(w http.ResponseWriter, sess *exploreSession, sid string, offset, limit int) {
		sess.mu.Lock()
		total := len(sess.Rows)
		sliceFrom := offset
		if sliceFrom > total {
			sliceFrom = total
		}
		sliceEnd := sliceFrom + limit
		if sliceEnd > total {
			sliceEnd = total
		}
		var page []map[string]interface{}
		if sliceFrom < total {
			page = exploreDestRowsToMaps(sess.Rows[sliceFrom:sliceEnd], sess.Currency)
		} else {
			page = []map[string]interface{}{}
		}
		hasMorePages := sliceFrom+len(page) < total
		liveRefreshAvailable := sess.LiveQueueCursor < len(sess.LiveQueue) && sess.LiveFetchAttempts < exploreMaxLiveFetchesPerSession
		partial := false
		for _, r := range sess.Rows {
			if r.priceSource == "estimated" {
				partial = true
				break
			}
		}
		sess.mu.Unlock()

		log.Printf("[EXPLORE] session=%s offset=%d limit=%d page=%d total=%d partial=%v liveAvail=%v", sid, offset, limit, len(page), total, partial, liveRefreshAvailable)
		writeJSON(w, http.StatusOK, map[string]interface{}{
			"destinations":         page,
			"sessionId":            sid,
			"total":                total,
			"offset":               offset,
			"limit":                limit,
			"hasMore":              hasMorePages,
			"partialResults":       partial,
			"liveRefreshAvailable": liveRefreshAvailable,
		})
	}

	if sessionID != "" {
		sess := getExploreSession(sessionID)
		if sess == nil {
			writeJSON(w, http.StatusNotFound, map[string]string{"error": "explore session expired or invalid"})
			return
		}
		liveRefresh := strings.EqualFold(strings.TrimSpace(r.URL.Query().Get("live")), "true")
		if liveRefresh {
			if err := exploreRunLiveBatch(ctx, googleFlights2Provider, sess); err != nil {
				log.Printf("[EXPLORE] live batch error: %v", err)
				writeJSON(w, http.StatusBadGateway, map[string]string{"error": "failed to fetch destinations"})
				return
			}
		}
		putExploreSession(sessionID, sess)
		writeExplorePage(w, sess, sessionID, offset, limit)
		return
	}

	origin := strings.TrimSpace(strings.ToUpper(r.URL.Query().Get("origin")))
	if origin == "" {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": "origin is required"})
		return
	}
	if len(origin) < 2 || len(origin) > 3 {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": "origin must be a valid 2–3 character IATA code"})
		return
	}

	currency := strings.TrimSpace(strings.ToUpper(r.URL.Query().Get("currency")))
	switch currency {
	case "USD", "GBP", "EUR", "ILS", "JPY":
	default:
		currency = "USD"
	}

	adults := 1
	if a := r.URL.Query().Get("adults"); a != "" {
		if v, err := strconv.Atoi(a); err == nil && v >= 1 {
			adults = v
		}
	}

	departureDate := strings.TrimSpace(r.URL.Query().Get("departureDate"))
	returnDate := strings.TrimSpace(r.URL.Query().Get("returnDate"))

	yearStr := strings.TrimSpace(r.URL.Query().Get("year"))
	monthStr := strings.TrimSpace(r.URL.Query().Get("month"))
	durationStr := strings.TrimSpace(r.URL.Query().Get("durationDays"))
	children := 0
	if ch := r.URL.Query().Get("children"); ch != "" {
		if v, err := strconv.Atoi(ch); err == nil && v >= 0 {
			children = v
		}
	}
	nonStop := strings.EqualFold(strings.TrimSpace(r.URL.Query().Get("nonStop")), "true")

	useMonthDealsExplore := false
	var exploreYear, exploreMonth, exploreDuration int
	if yearStr != "" && monthStr != "" && durationStr != "" {
		if y, err := strconv.Atoi(yearStr); err == nil && y >= 2000 && y <= 2100 {
			if m, err := strconv.Atoi(monthStr); err == nil && m >= 1 && m <= 12 {
				if dur, err := strconv.Atoi(durationStr); err == nil && dur >= 1 && dur <= 60 {
					useMonthDealsExplore = true
					exploreYear, exploreMonth, exploreDuration = y, m, dur
				}
			}
		}
	}

	if useMonthDealsExplore {
		log.Printf("[EXPLORE] MONTH GF2 origin=%s year=%d month=%d durationDays=%d currency=%s adults=%d children=%d nonStop=%v",
			origin, exploreYear, exploreMonth, exploreDuration, currency, adults, children, nonStop)
	} else {
		log.Printf("[EXPLORE] GF2 origin=%s departureDate=%s returnDate=%s currency=%s adults=%d",
			origin, departureDate, returnDate, currency, adults)
	}

	dep, ret, monthEmpty := gf2ExploreResolveDeps(departureDate, returnDate, useMonthDealsExplore, exploreYear, exploreMonth, exploreDuration)
	if monthEmpty {
		writeJSON(w, http.StatusOK, map[string]interface{}{
			"destinations":         []map[string]interface{}{},
			"sessionId":            "",
			"total":                0,
			"offset":               offset,
			"limit":                limit,
			"hasMore":              false,
			"partialResults":       false,
			"liveRefreshAvailable": false,
		})
		return
	}

	// prefetch=true skips the initial live GF2 batch (estimates + cache only); use for instant first paint, then ?live=true to refresh prices.
	prefetch := strings.EqualFold(strings.TrimSpace(r.URL.Query().Get("prefetch")), "true")

	sessionKey := exploreSessionKey(origin, dep, ret, useMonthDealsExplore, exploreYear, exploreMonth, exploreDuration, currency, adults, children, nonStop)
	rows, liveQ := exploreBuildRowsAndQueue(origin, dep, ret, useMonthDealsExplore, exploreYear, exploreMonth, exploreDuration, currency, adults, children, nonStop)
	sess := &exploreSession{
		Key:               sessionKey,
		Rows:              rows,
		LiveQueue:         liveQ,
		LiveQueueCursor:   0,
		LiveFetchAttempts: 0,
		Origin:            origin,
		Dep:               dep,
		Ret:               ret,
		UseMonth:          useMonthDealsExplore,
		Year:              exploreYear,
		Month:             exploreMonth,
		DurationDays:      exploreDuration,
		Currency:          currency,
		Adults:            adults,
		Children:          children,
		NonStop:           nonStop,
		CabinPref:         "ECONOMY",
		IncludeBag:        false,
	}

	if !prefetch {
		if err := exploreRunLiveBatch(ctx, googleFlights2Provider, sess); err != nil {
			log.Printf("[EXPLORE] GF2 error for %s: %v", origin, err)
			writeJSON(w, http.StatusBadGateway, map[string]string{"error": "failed to fetch destinations"})
			return
		}
	}

	id := newExploreSessionID()
	putExploreSession(id, sess)
	writeExplorePage(w, sess, id, offset, limit)
}

func handleMonthDeals(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodOptions {
		writeOptionsNoContent(w)
		return
	}
	if r.Method != http.MethodGet {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}

	origin := strings.TrimSpace(strings.ToUpper(r.URL.Query().Get("origin")))
	destination := strings.TrimSpace(strings.ToUpper(r.URL.Query().Get("destination")))
	yearStr := strings.TrimSpace(r.URL.Query().Get("year"))
	monthStr := strings.TrimSpace(r.URL.Query().Get("month"))
	durationStr := r.URL.Query().Get("durationDays")
	startDateStr := strings.TrimSpace(r.URL.Query().Get("startDate"))
	endDateStr := strings.TrimSpace(r.URL.Query().Get("endDate"))
	currency := strings.TrimSpace(strings.ToUpper(r.URL.Query().Get("currency")))
	if currency == "" {
		currency = "USD"
	}
	// Supported display currencies; default to USD if unsupported
	switch currency {
	case "USD", "GBP", "EUR", "ILS", "JPY":
		// use as-is
	default:
		currency = "USD"
	}

	var missing []string
	if origin == "" {
		missing = append(missing, "origin")
	}
	if destination == "" {
		missing = append(missing, "destination")
	}
	useRange := startDateStr != "" && endDateStr != ""
	partialRange := (startDateStr != "" && endDateStr == "") || (startDateStr == "" && endDateStr != "")
	if partialRange {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": "startDate and endDate must be provided together"})
		return
	}
	if !useRange {
		if yearStr == "" {
			missing = append(missing, "year")
		}
		if monthStr == "" {
			missing = append(missing, "month")
		}
	}
	if len(missing) > 0 {
		writeJSON(w, http.StatusBadRequest, map[string]string{
			"error": fmt.Sprintf("missing required field(s): %s (or use startDate and endDate together)", strings.Join(missing, ", ")),
		})
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

	if googleFlights2Provider == nil {
		writeJSON(w, http.StatusInternalServerError, map[string]string{"error": "flight search backend not configured"})
		return
	}

	cacheKey := monthDealsCacheKey(origin, destination, currency, useRange, year, month, startDateStr, endDateStr, durationDays, adults, children, nonStop)
	if cached, ok := monthDealsCacheGet(cacheKey); ok {
		writeJSON(w, http.StatusOK, cached)
		return
	}

	ctx, cancel := context.WithTimeout(r.Context(), 300*time.Second)
	defer cancel()
	cabinPref := "ECONOMY"
	includeBag := false

	var deals []FullRoundTrip
	var days []DayDeal
	var rangeYear, rangeMonth int
	var err error

	type tripMeta struct {
		price        float64
		stops        int
		carriers     []string
		outboundPath []string
		returnPath   []string
	}
	metaByDate := make(map[string]tripMeta)

	populateMeta := func(tripList []FullRoundTrip) {
		for _, trip := range tripList {
			d := trip.OutboundDate
			if existing, ok := metaByDate[d]; ok && existing.price <= trip.TotalCost {
				continue
			}
			var stops int
			var carriers []string
			var outPath, retPath []string
			if trip.CombinedOption != nil && len(trip.CombinedOption.Legs) >= 2 {
				stops, carriers, outPath = extractDealMetaFromLeg(&trip.CombinedOption.Legs[0])
				_, _, retPath = extractDealMetaFromLeg(&trip.CombinedOption.Legs[1])
			} else {
				stops, carriers, outPath = extractDealMeta(trip.OutboundFlight)
				_, _, retPath = extractDealMeta(trip.ReturnFlight)
			}
			metaByDate[d] = tripMeta{
				price:        trip.TotalCost,
				stops:        stops,
				carriers:     carriers,
				outboundPath: outPath,
				returnPath:   retPath,
			}
		}
	}

	if useRange {
		startDate, err1 := time.Parse("2006-01-02", startDateStr)
		endDate, err2 := time.Parse("2006-01-02", endDateStr)
		if err1 != nil || err2 != nil || endDate.Before(startDate) {
			writeJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid startDate/endDate (use YYYY-MM-DD)"})
			return
		}
		deals, err = gf2SearchDealsRange(ctx, googleFlights2Provider, origin, destination, startDate, endDate, durationDays, currency, adults, children, nonStop, cabinPref, includeBag)
		if err != nil {
			log.Printf("[MONTH_DEALS] gf2SearchDealsRange error: %v", err)
			writeJSON(w, http.StatusBadGateway, map[string]string{"error": fmt.Sprintf("deals search failed: %v", err)})
			return
		}
		populateMeta(deals)
		for d := startDate; !d.After(endDate); d = d.AddDate(0, 0, 1) {
			date := d.Format("2006-01-02")
			dayDeal := DayDeal{Date: date}
			if meta, ok := metaByDate[date]; ok && meta.price > 0 {
				dayDeal.LowestPrice = &MonetaryAmount{Currency: currency, Amount: meta.price}
				dayDeal.Stops = &meta.stops
				dayDeal.Carriers = meta.carriers
				dayDeal.OutboundPath = meta.outboundPath
				dayDeal.ReturnPath = meta.returnPath
			}
			days = append(days, dayDeal)
		}
		rangeYear = startDate.Year()
		rangeMonth = int(startDate.Month())
	} else {
		monthTime := time.Date(year, time.Month(month), 1, 0, 0, 0, 0, time.UTC)
		deals, err = gf2SearchMonthDeals(ctx, googleFlights2Provider, origin, destination, monthTime, durationDays, currency, adults, children, nonStop, cabinPref, includeBag)
		if err != nil {
			log.Printf("[MONTH_DEALS] gf2SearchMonthDeals error: %v", err)
			writeJSON(w, http.StatusBadGateway, map[string]string{"error": fmt.Sprintf("month deals search failed: %v", err)})
			return
		}
		populateMeta(deals)
		daysInMonth := time.Date(year, time.Month(month)+1, 0, 0, 0, 0, 0, time.UTC).Day()
		for d := 1; d <= daysInMonth; d++ {
			date := fmt.Sprintf("%04d-%02d-%02d", year, month, d)
			dayDeal := DayDeal{Date: date}
			if meta, ok := metaByDate[date]; ok && meta.price > 0 {
				dayDeal.LowestPrice = &MonetaryAmount{Currency: currency, Amount: meta.price}
				dayDeal.Stops = &meta.stops
				dayDeal.Carriers = meta.carriers
				dayDeal.OutboundPath = meta.outboundPath
				dayDeal.ReturnPath = meta.returnPath
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
	if useRange {
		resp.StartDate = startDateStr
		resp.EndDate = endDateStr
	}
	resp.Route.Origin = AirportLike{Code: origin}
	resp.Route.Destination = AirportLike{Code: destination}

	monthDealsCachePut(cacheKey, resp)
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
	if resp == nil {
		writeJSON(w, http.StatusNotFound, map[string]string{"error": "session not found"})
		return
	}
	if option == nil {
		writeJSON(w, http.StatusNotFound, map[string]string{"error": "option not found"})
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
	if resp == nil {
		writeJSON(w, http.StatusNotFound, map[string]string{"error": "session not found"})
		return
	}
	if option == nil {
		writeJSON(w, http.StatusNotFound, map[string]string{"error": "option not found"})
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
	resp, option := GetSessionAndOption(sessionID, optionID)
	if resp == nil {
		writeJSON(w, http.StatusNotFound, map[string]string{"error": "session not found"})
		return
	}
	if option == nil {
		writeJSON(w, http.StatusNotFound, map[string]string{"error": "option not found"})
		return
	}
	provider := ResolveProvider(option)
	writeJSON(w, http.StatusOK, ProviderResponse{Provider: *provider})
}

// handleOutBooking is the uniform booking redirect: GET /api/out/booking?sessionId=...&optionId=...
// Optional query params (origin, destination, departureDate, returnDate) are used when session/option is not found
// so we still redirect to a Skyscanner search instead of returning JSON error.
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
	origin := strings.TrimSpace(q.Get("origin"))
	destination := strings.TrimSpace(q.Get("destination"))
	departureDate := strings.TrimSpace(q.Get("departureDate"))
	returnDate := strings.TrimSpace(q.Get("returnDate"))

	if sessionID != "" && optionID != "" {
		resp, option := GetSessionAndOption(sessionID, optionID)
		if resp != nil && option != nil {
			redirectURL := BuildUniformBookingLink(&resp.Session, option)
			if redirectURL != "" {
				provider := ResolveProvider(option)
				_ = RecordClick(sessionID, optionID, provider, redirectURL)
				w.Header().Set("Location", redirectURL)
				w.WriteHeader(http.StatusFound)
				return
			}
		}
	}

	{
		redirectURL := BuildSkyscannerFallbackFromParams(origin, destination, departureDate, returnDate)
		if redirectURL == "" {
			redirectURL = "https://www.skyscanner.net/transport/flights/"
		}
		w.Header().Set("Location", redirectURL)
		w.WriteHeader(http.StatusFound)
		return
	}
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
	now := time.Now().UTC()
	today := time.Date(now.Year(), now.Month(), now.Day(), 0, 0, 0, 0, time.UTC)
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
	switch {
	case fromStr == "" && toStr == "":
		to = today
		from = to.AddDate(0, 0, -30)
	case fromStr != "" && toStr == "":
		to = today
	case fromStr == "" && toStr != "":
		from = to.AddDate(0, 0, -30)
	}
	summary := GetClicksSummary(from, to)
	writeJSON(w, http.StatusOK, summary)
}

// handleHealth returns JSON for uptime and lightweight readiness (no external calls).
func handleHealth(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodOptions {
		writeOptionsNoContent(w)
		return
	}
	if r.Method != http.MethodGet {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}
	gf2 := "disabled"
	if googleFlights2Provider != nil {
		gf2 = "enabled"
	}
	ver := strings.TrimSpace(os.Getenv("APP_VERSION"))
	if ver == "" {
		ver = "dev"
	}
	writeJSON(w, http.StatusOK, map[string]any{
		"status":    "ok",
		"timestamp": time.Now().UTC().Format(time.RFC3339),
		"version":   ver,
		"services": map[string]string{
			"googleFlights2": gf2,
		},
	})
}

// allowedCORSOrigins are origins allowed for CORS (production + dev).
var allowedCORSOrigins = map[string]bool{
	"https://fly-fix.com":    true,
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
	// Load .env for GOOGLEFLIGHTS2_* and other config.
	if err := godotenv.Load(); err != nil {
		// Try backend/.env when run from project root
		if err2 := godotenv.Load(filepath.Join("backend", ".env")); err2 != nil {
			log.Println("Note: .env file not found; falling back to process environment.")
		}
	}

	googleFlights2Provider = search.NewGoogleFlights2Provider()
	if googleFlights2Provider != nil {
		log.Println("[STARTUP] Google Flights2 provider: enabled (primary flight data source)")
	} else {
		log.Println("[STARTUP] Google Flights2 provider: disabled — set GOOGLEFLIGHTS2_ENABLED=true and GOOGLEFLIGHTS2_RAPIDAPI_KEY (required for search, deals, explore)")
	}
	startExchangeRateRefresh()
	startExploreSessionCleanup()
	startSearchSessionCleanup()

	mux := http.NewServeMux()
	mux.HandleFunc("/health", handleHealth)
	mux.HandleFunc("/api/health", handleHealth)
	mux.HandleFunc("/api/search/sessions", handleCreateSession)
	mux.HandleFunc("/api/search/sessions/", handleGetSession)
	mux.HandleFunc("/api/deals/month", handleMonthDeals)
	mux.HandleFunc("/api/flights/details", handleFlightDetails)
	mux.HandleFunc("/api/airports/search", handleAirportSearch)
	mux.HandleFunc("/api/explore", handleExplore)
	mux.HandleFunc("/api/affiliate/redirect", handleAffiliateRedirect)
	mux.HandleFunc("/api/affiliate/outbound-link", handleAffiliateOutboundLink)
	mux.HandleFunc("/api/affiliate/provider", handleAffiliateProvider)
	mux.HandleFunc("/api/affiliate/clicks/summary", handleAffiliateClicksSummary)
	mux.HandleFunc("/api/out/booking", handleOutBooking)
	mux.HandleFunc("/api/flyfix/refine-issues", handleFlyFixRefineIssues)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	addr := ":" + port
	server := &http.Server{
		Addr:         addr,
		Handler:      corsMiddleware(mux),
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 630 * time.Second, // explore can run up to ~10m of sequential GF2 calls + backoff
	}

	log.Printf("Go HTTP API listening on %s", addr)
	log.Fatal(server.ListenAndServe())
}
