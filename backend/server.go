package main

import (
	"encoding/json"
	"fmt"
	"log"
	"math/rand/v2"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"strings"
	"time"

	"github.com/joho/godotenv"
)

type SearchSessionStatus string

const (
	StatusPending  SearchSessionStatus = "PENDING"
	StatusComplete SearchSessionStatus = "COMPLETE"
	StatusFailed   SearchSessionStatus = "FAILED"
)

type CreateSearchSessionRequest struct {
	Origin        string `json:"origin"`
	Destination   string `json:"destination"`
	DepartureDate string `json:"departureDate"`
	ReturnDate    string `json:"returnDate,omitempty"`
	CabinClass    string `json:"cabinClass"`
	Adults        int    `json:"adults"`
	Children      int    `json:"children,omitempty"`
	Infants       int    `json:"infants,omitempty"`
	Currency      string `json:"currency,omitempty"`
	Locale        string `json:"locale,omitempty"`
}

type SearchSession struct {
	ID        string              `json:"id"`
	Status    SearchSessionStatus `json:"status"`
	CreatedAt time.Time           `json:"createdAt"`
	Params    CreateSearchSessionRequest `json:"params"`
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
	From          AirportLike `json:"from"`
	To            AirportLike `json:"to"`
	DepartureTime time.Time   `json:"departureTime"`
	ArrivalTime   time.Time   `json:"arrivalTime"`
	MarketingCarrier Carrier  `json:"marketingCarrier"`
	FlightNumber     string   `json:"flightNumber"`
	DurationMinutes  int      `json:"durationMinutes"`
	CabinClass       string   `json:"cabinClass"`
}

type FlightLeg struct {
	Segments []FlightSegment `json:"segments"`
}

type FlightOption struct {
	ID              string         `json:"id"`
	Price           MonetaryAmount `json:"price"`
	DurationMinutes int            `json:"durationMinutes"`
	Legs            []FlightLeg    `json:"legs"`
}

type SearchSessionResultsResponse struct {
	Session SearchSession  `json:"session"`
	Version int64          `json:"version"`
	Results []FlightOption `json:"results"`
}

var (
	sessions      = make(map[string]SearchSessionResultsResponse)
	amadeusClient *AmadeusClient
)

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
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET,POST,OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
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

	// Call Amadeus to get real flight offers.
	apiResp, err := amadeusClient.FlightOffersSearch(
		strings.ToUpper(req.Origin),
		strings.ToUpper(req.Destination),
		req.DepartureDate,
		req.ReturnDate,
		0,
		20,
	)
	if err != nil {
		log.Printf("FlightOffersSearch error: %v", err)
		appendDebugLog(map[string]any{
			"location":     "backend/server.go:handleCreateSession",
			"message":      "Amadeus search error",
			"hypothesisId": "backend-A",
			"data": map[string]any{
				"error": err.Error(),
			},
		})
		writeJSON(w, http.StatusBadGateway, map[string]string{"error": fmt.Sprintf("search failed: %v", err)})
		return
	}

	options := normalizeFlightOptions(apiResp.Data, &req)

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

	sessions[id] = resp

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
	resp, ok := sessions[id]
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

				duration := int(arrTime.Sub(depTime).Minutes())
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
					From:            AirportLike{Code: strings.ToUpper(depCode)},
					To:              AirportLike{Code: strings.ToUpper(arrCode)},
					DepartureTime:   depTime,
					ArrivalTime:     arrTime,
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

		options = append(options, FlightOption{
			ID:              fmt.Sprintf("opt_%d", idx),
			Price:           MonetaryAmount{Currency: req.CurrencyOrDefault(), Amount: price},
			DurationMinutes: totalDuration,
			Legs:            legs,
		})
	}

	return options
}

func parseAmadeusTime(s string) (time.Time, error) {
	if s == "" {
		return time.Time{}, fmt.Errorf("empty time")
	}
	// Try common Amadeus formats.
	if t, err := time.Parse("2006-01-02T15:04:05", s); err == nil {
		return t, nil
	}
	if t, err := time.Parse(time.RFC3339, s); err == nil {
		return t, nil
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
	Origin        AirportLike  `json:"origin"`
	Destination   AirportLike  `json:"destination"`
	DepartureDate string       `json:"departureDate"`
	ReturnDate    string       `json:"returnDate"`
	DurationDays  int          `json:"durationDays"`
	Outbound      FlightLeg    `json:"outbound"`
	Return        FlightLeg    `json:"return"`
	TotalPrice    MonetaryAmount `json:"totalPrice"`
	Fare          *FareBreakdown  `json:"fare,omitempty"`
	Stops         StopsSummary    `json:"stops"`
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

	endDate := startDate

	// Reuse existing deals search for a single day to find the best round-trip.
	deals, err := amadeusClient.SearchDealsRange(origin, destination, startDate, endDate, durationDays)
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
	}
	retReq := &CreateSearchSessionRequest{
		Origin:        destination,
		Destination:   origin,
		DepartureDate: trip.ReturnDate,
		CabinClass:    "ECONOMY",
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
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET,POST,OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
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
		deals, err = amadeusClient.SearchDealsRange(origin, destination, startDate, endDate, durationDays)
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
				dayDeal.LowestPrice = &MonetaryAmount{Currency: "USD", Amount: amount}
			}
			days = append(days, dayDeal)
		}
		rangeYear = startDate.Year()
		rangeMonth = int(startDate.Month())
	} else {
		monthTime := time.Date(year, time.Month(month), 1, 0, 0, 0, 0, time.UTC)
		deals, err = amadeusClient.SearchMonthDeals(origin, destination, monthTime, durationDays)
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
				dayDeal.LowestPrice = &MonetaryAmount{Currency: "USD", Amount: amount}
			}
			days = append(days, dayDeal)
		}
		rangeYear = year
		rangeMonth = month
	}

	resp := MonthDealsResponse{
		Year:     rangeYear,
		Month:    rangeMonth,
		Currency: "USD",
		Days:     days,
	}
	resp.Route.Origin = AirportLike{Code: origin}
	resp.Route.Destination = AirportLike{Code: destination}

	writeJSON(w, http.StatusOK, resp)
}

// corsMiddleware adds CORS headers to every response and responds to OPTIONS.
func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}
		next.ServeHTTP(w, r)
	})
}

func main() {
	// Load .env file for AMADEUS_CLIENT_ID / AMADEUS_CLIENT_SECRET, etc.
	if err := godotenv.Load(); err != nil {
		log.Println("Note: .env file not found; falling back to process environment.")
	}

	amadeusClient = NewAmadeusClient()

	mux := http.NewServeMux()
	mux.HandleFunc("/api/search/sessions", handleCreateSession)
	mux.HandleFunc("/api/search/sessions/", handleGetSession)
	mux.HandleFunc("/api/deals/month", handleMonthDeals)
	mux.HandleFunc("/api/flights/details", handleFlightDetails)
	mux.HandleFunc("/api/airports/search", handleAirportSearch)

	server := &http.Server{
		Addr:         ":8080",
		Handler:      corsMiddleware(mux),
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 30 * time.Second,
	}

	log.Println("Go HTTP API listening on :8080")
	log.Fatal(server.ListenAndServe())
}

