package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strconv"
	"strings"
	"time"

	"flightcaptainweb/search/hotels"
)

var hotelProvider hotels.HotelProvider

type hotelSearchAPIRequest struct {
	Destination       string   `json:"destination"`
	RegionID          int      `json:"regionId"`
	Latitude          *float64 `json:"latitude"`
	Longitude         *float64 `json:"longitude"`
	RadiusKm          int      `json:"radiusKm"`
	CheckIn           string   `json:"checkIn"`
	CheckOut          string   `json:"checkOut"`
	Adults            int      `json:"adults"`
	ChildrenAges      []int    `json:"childrenAges"`
	Rooms             int      `json:"rooms"`
	Currency          string   `json:"currency"`
	Language          string   `json:"language"`
	Residency         string   `json:"residency"`
	MinStarRating     int      `json:"minStarRating"`
	MaxStarRating     int      `json:"maxStarRating"`
	MinGuestRating    float64  `json:"minGuestRating"`
	MinPrice          *float64 `json:"minPrice"`
	MaxPrice          *float64 `json:"maxPrice"`
	FreeCancellation  bool     `json:"freeCancellation"`
	BreakfastIncluded bool     `json:"breakfastIncluded"`
	PropertyTypes     []string `json:"propertyTypes"`
	Sort              string   `json:"sort"`
	HotelsLimit       int      `json:"hotelsLimit"`
}

type hotelSearchAPIResponse struct {
	Results     []hotels.HotelOffer `json:"results"`
	Count       int                 `json:"count"`
	Provider    string              `json:"provider,omitempty"`
	PriceStatus hotels.PriceStatus  `json:"priceStatus"`
	Message     string              `json:"message,omitempty"`
}

type hotelEstimateAPIRequest struct {
	// Single estimate fields (also used as template for batch items).
	Destination string   `json:"destination"`
	RegionID    int      `json:"regionId"`
	Latitude    *float64 `json:"latitude"`
	Longitude   *float64 `json:"longitude"`
	CheckIn     string   `json:"checkIn"`
	CheckOut    string   `json:"checkOut"`
	Adults      int      `json:"adults"`
	Rooms       int      `json:"rooms"`
	Currency    string   `json:"currency"`
	Language    string   `json:"language"`

	// Optional flight context for date mapping.
	FlightDepartureDate string `json:"flightDepartureDate"`
	FlightReturnDate    string `json:"flightReturnDate"`
	ItineraryType       string `json:"itineraryType"` // round_trip | one_way | multi_city

	// Batch: unique destination/date combos (deduped server-side).
	Items []hotelEstimateItem `json:"items"`
}

type hotelEstimateItem struct {
	Key         string   `json:"key"`
	Destination string   `json:"destination"`
	RegionID    int      `json:"regionId"`
	Latitude    *float64 `json:"latitude"`
	Longitude   *float64 `json:"longitude"`
	CheckIn     string   `json:"checkIn"`
	CheckOut    string   `json:"checkOut"`
	Adults      int      `json:"adults"`
	Rooms       int      `json:"rooms"`
	Currency    string   `json:"currency"`
}

type hotelEstimateAPIResponse struct {
	Estimate  *hotels.HotelEstimate            `json:"estimate,omitempty"`
	Estimates map[string]*hotels.HotelEstimate `json:"estimates,omitempty"`
	Message   string                           `json:"message,omitempty"`
}

type tripEstimateAPIRequest struct {
	Destination         string  `json:"destination"`
	FlightOptionID      string  `json:"flightOptionId"`
	FlightPriceAmount   float64 `json:"flightPriceAmount"`
	FlightPriceCurrency string  `json:"flightPriceCurrency"`
	DepartureDate       string  `json:"departureDate"`
	ReturnDate          string  `json:"returnDate"`
	ItineraryType       string  `json:"itineraryType"`
	Adults              int     `json:"adults"`
	Rooms               int     `json:"rooms"`
	Currency            string  `json:"currency"`
	Label               string  `json:"label"`
	// Optional explicit stay override
	CheckIn  string `json:"checkIn"`
	CheckOut string `json:"checkOut"`
}

func handleHotelDestinations(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusNoContent)
		return
	}
	if r.Method != http.MethodGet {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}
	if hotelProvider == nil {
		writeJSON(w, http.StatusOK, map[string]any{"results": []any{}, "message": "Hotel search unavailable"})
		return
	}
	q := strings.TrimSpace(r.URL.Query().Get("q"))
	lang := strings.TrimSpace(r.URL.Query().Get("language"))
	if lang == "" {
		lang = "en"
	}
	ctx, cancel := context.WithTimeout(r.Context(), 15*time.Second)
	defer cancel()
	results, err := hotelProvider.SuggestDestinations(ctx, q, lang)
	if err != nil {
		log.Printf("[hotels] suggest error: %v", err)
		writeJSON(w, http.StatusOK, map[string]any{"results": []any{}, "message": "Destination lookup unavailable"})
		return
	}
	writeJSON(w, http.StatusOK, map[string]any{"results": results})
}

func handleHotelSearch(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusNoContent)
		return
	}
	if r.Method != http.MethodPost {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}
	if hotelProvider == nil {
		writeJSON(w, http.StatusOK, hotelSearchAPIResponse{
			Results:     []hotels.HotelOffer{},
			PriceStatus: hotels.PriceEstimated,
			Message:     "Hotel search unavailable",
		})
		return
	}

	var req hotelSearchAPIRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid request body"})
		return
	}
	sreq := toHotelSearchRequest(req)
	enrichHotelSearchFromAirport(&sreq)

	ctx, cancel := context.WithTimeout(r.Context(), 45*time.Second)
	defer cancel()
	offers, err := hotelProvider.Search(ctx, sreq)
	if err != nil {
		log.Printf("[hotels] search error: %v", err)
		writeJSON(w, http.StatusOK, hotelSearchAPIResponse{
			Results:     []hotels.HotelOffer{},
			PriceStatus: hotels.PriceEstimated,
			Message:     friendlyHotelError(err),
			Provider:    hotelProvider.Name(),
		})
		return
	}
	hotels.SortHotels(offers, req.Sort)
	writeJSON(w, http.StatusOK, hotelSearchAPIResponse{
		Results:     offers,
		Count:       len(offers),
		Provider:    hotelProvider.Name(),
		PriceStatus: hotels.PriceEstimated,
	})
}

func handleHotelDetails(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusNoContent)
		return
	}
	if r.Method != http.MethodGet && r.Method != http.MethodPost {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}
	if hotelProvider == nil {
		writeJSON(w, http.StatusOK, map[string]any{"message": "Hotel details unavailable"})
		return
	}

	var (
		hotelID string
		hid     int64
		sreq    hotels.HotelSearchRequest
	)

	if r.Method == http.MethodPost {
		var body struct {
			HotelID string `json:"hotelId"`
			HID     int64  `json:"hid"`
			hotelSearchAPIRequest
		}
		if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
			writeJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid request body"})
			return
		}
		hotelID = body.HotelID
		hid = body.HID
		sreq = toHotelSearchRequest(body.hotelSearchAPIRequest)
	} else {
		q := r.URL.Query()
		hotelID = strings.TrimSpace(q.Get("hotelId"))
		if h := strings.TrimSpace(q.Get("hid")); h != "" {
			if v, err := strconv.ParseInt(h, 10, 64); err == nil {
				hid = v
			}
		}
		sreq = hotels.HotelSearchRequest{
			CheckIn:  q.Get("checkIn"),
			CheckOut: q.Get("checkOut"),
			Adults:   atoiDefault(q.Get("adults"), 2),
			Rooms:    atoiDefault(q.Get("rooms"), 1),
			Currency: strings.ToUpper(q.Get("currency")),
			Language: q.Get("language"),
		}
	}
	enrichHotelSearchFromAirport(&sreq)

	ctx, cancel := context.WithTimeout(r.Context(), 45*time.Second)
	defer cancel()
	best, rates, err := hotelProvider.HotelDetails(ctx, hotelID, hid, sreq)
	if err != nil {
		log.Printf("[hotels] details error: %v", err)
		writeJSON(w, http.StatusOK, map[string]any{
			"message": friendlyHotelError(err),
		})
		return
	}
	writeJSON(w, http.StatusOK, map[string]any{
		"hotel":       best,
		"rates":       rates,
		"priceStatus": hotels.PriceLive,
		"provider":    hotelProvider.Name(),
	})
}

func handleHotelEstimate(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusNoContent)
		return
	}
	if r.Method != http.MethodPost {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}
	if hotelProvider == nil {
		writeJSON(w, http.StatusOK, hotelEstimateAPIResponse{
			Estimate: &hotels.HotelEstimate{
				Available:   false,
				Message:     "Hotel prices unavailable",
				PriceStatus: hotels.PriceEstimated,
			},
			Message: "Hotel prices unavailable",
		})
		return
	}

	var req hotelEstimateAPIRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid request body"})
		return
	}

	// Batch path: dedupe identical destination/date/occupancy combos.
	if len(req.Items) > 0 {
		type workItem struct {
			key string
			req hotels.HotelSearchRequest
		}
		seen := map[string]workItem{}
		order := []string{}
		for _, it := range req.Items {
			adults := it.Adults
			if adults < 1 {
				adults = req.Adults
			}
			if adults < 1 {
				adults = 2
			}
			rooms := it.Rooms
			if rooms < 1 {
				rooms = req.Rooms
			}
			if rooms < 1 {
				rooms = 1
			}
			currency := it.Currency
			if currency == "" {
				currency = req.Currency
			}
			checkIn, checkOut := it.CheckIn, it.CheckOut
			dest := it.Destination
			if dest == "" {
				dest = req.Destination
			}
			stay := hotels.MapFlightToStayDates(nil, checkIn, checkOut, dest)
			if checkIn == "" || checkOut == "" {
				stay = hotels.MapFlightToStayDates(nil, req.FlightDepartureDate, req.FlightReturnDate, dest)
			} else {
				stay = hotels.MapFlightToStayDates(nil, checkIn, checkOut, dest)
			}
			key := it.Key
			if key == "" {
				key = hotels.EstimateCacheKey(dest, stay.CheckIn, stay.CheckOut, currency, rooms, adults, "")
			}
			if _, ok := seen[key]; ok {
				continue
			}
			if !stay.Eligible {
				seen[key] = workItem{key: key, req: hotels.HotelSearchRequest{}}
				// Store ineligible marker via empty CheckIn
				order = append(order, key)
				continue
			}
			sreq := hotels.HotelSearchRequest{
				DestinationQuery: dest,
				RegionID:         it.RegionID,
				Latitude:         it.Latitude,
				Longitude:        it.Longitude,
				CheckIn:          stay.CheckIn,
				CheckOut:         stay.CheckOut,
				Adults:           adults,
				Rooms:            rooms,
				Currency:         currency,
				Language:         req.Language,
			}
			enrichHotelSearchFromAirport(&sreq)
			seen[key] = workItem{key: key, req: sreq}
			order = append(order, key)
		}

		out := map[string]*hotels.HotelEstimate{}
		ctx, cancel := context.WithTimeout(r.Context(), 60*time.Second)
		defer cancel()
		for _, key := range order {
			wi := seen[key]
			if wi.req.CheckIn == "" {
				out[key] = &hotels.HotelEstimate{
					Available:   false,
					Message:     "Hotel estimate unavailable for this itinerary.",
					PriceStatus: hotels.PriceEstimated,
				}
				continue
			}
			est, err := hotelProvider.Estimate(ctx, wi.req)
			if err != nil || est == nil {
				out[key] = &hotels.HotelEstimate{
					Destination: wi.req.DestinationQuery,
					CheckIn:     wi.req.CheckIn,
					CheckOut:    wi.req.CheckOut,
					Available:   false,
					Message:     "Hotel prices unavailable",
					PriceStatus: hotels.PriceEstimated,
					Provider:    hotelProvider.Name(),
				}
				continue
			}
			out[key] = est
		}
		writeJSON(w, http.StatusOK, hotelEstimateAPIResponse{Estimates: out})
		return
	}

	// Single estimate
	dest := req.Destination
	checkIn, checkOut := req.CheckIn, req.CheckOut
	if strings.EqualFold(req.ItineraryType, "multi_city") {
		writeJSON(w, http.StatusOK, hotelEstimateAPIResponse{
			Estimate: &hotels.HotelEstimate{
				Destination: dest,
				Available:   false,
				Message:     "Hotel estimate unavailable for this itinerary.",
				PriceStatus: hotels.PriceEstimated,
			},
		})
		return
	}
	if checkIn == "" {
		checkIn = req.FlightDepartureDate
	}
	if checkOut == "" {
		checkOut = req.FlightReturnDate
	}
	stay := hotels.MapFlightToStayDates(nil, checkIn, checkOut, dest)
	if !stay.Eligible {
		writeJSON(w, http.StatusOK, hotelEstimateAPIResponse{
			Estimate: &hotels.HotelEstimate{
				Destination: dest,
				CheckIn:     stay.CheckIn,
				CheckOut:    stay.CheckOut,
				Available:   false,
				Message:     stay.Reason,
				PriceStatus: hotels.PriceEstimated,
			},
		})
		return
	}

	sreq := hotels.HotelSearchRequest{
		DestinationQuery: dest,
		RegionID:         req.RegionID,
		Latitude:         req.Latitude,
		Longitude:        req.Longitude,
		CheckIn:          stay.CheckIn,
		CheckOut:         stay.CheckOut,
		Adults:           maxInt(req.Adults, 1),
		Rooms:            maxInt(req.Rooms, 1),
		Currency:         req.Currency,
		Language:         req.Language,
	}
	enrichHotelSearchFromAirport(&sreq)

	ctx, cancel := context.WithTimeout(r.Context(), 45*time.Second)
	defer cancel()
	est, err := hotelProvider.Estimate(ctx, sreq)
	if err != nil {
		writeJSON(w, http.StatusOK, hotelEstimateAPIResponse{
			Estimate: &hotels.HotelEstimate{
				Destination: dest,
				Available:   false,
				Message:     "Hotel prices unavailable",
				PriceStatus: hotels.PriceEstimated,
			},
			Message: "Hotel prices unavailable",
		})
		return
	}
	writeJSON(w, http.StatusOK, hotelEstimateAPIResponse{Estimate: est})
}

func handleTripEstimate(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusNoContent)
		return
	}
	if r.Method != http.MethodPost {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req tripEstimateAPIRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid request body"})
		return
	}

	flightPrice := hotels.Monetary{
		Currency: firstNonEmptyStr(req.FlightPriceCurrency, req.Currency, "USD"),
		Amount:   req.FlightPriceAmount,
	}

	if strings.EqualFold(req.ItineraryType, "multi_city") {
		td := hotels.BuildTripDeal(
			"trip-"+req.FlightOptionID, hotels.FormatStayLabel(req.Destination),
			req.Destination, "", "", req.FlightOptionID, flightPrice, nil, nil,
		)
		td.Message = "Hotel estimate unavailable for this itinerary."
		writeJSON(w, http.StatusOK, td)
		return
	}

	checkIn := req.CheckIn
	checkOut := req.CheckOut
	if checkIn == "" {
		checkIn = req.DepartureDate
	}
	if checkOut == "" {
		checkOut = req.ReturnDate
	}
	stay := hotels.MapFlightToStayDates(nil, checkIn, checkOut, req.Destination)

	var estimate *hotels.HotelEstimate
	if hotelProvider != nil && stay.Eligible {
		sreq := hotels.HotelSearchRequest{
			DestinationQuery: req.Destination,
			CheckIn:          stay.CheckIn,
			CheckOut:         stay.CheckOut,
			Adults:           maxInt(req.Adults, 1),
			Rooms:            maxInt(req.Rooms, 1),
			Currency:         firstNonEmptyStr(req.Currency, flightPrice.Currency),
		}
		enrichHotelSearchFromAirport(&sreq)
		ctx, cancel := context.WithTimeout(r.Context(), 45*time.Second)
		defer cancel()
		est, err := hotelProvider.Estimate(ctx, sreq)
		if err == nil {
			estimate = est
		} else {
			estimate = &hotels.HotelEstimate{
				Destination: req.Destination,
				CheckIn:     stay.CheckIn,
				CheckOut:    stay.CheckOut,
				Available:   false,
				Message:     "Hotel prices unavailable",
				PriceStatus: hotels.PriceEstimated,
			}
		}
	} else {
		msg := "Hotel prices unavailable"
		if !stay.Eligible && stay.Reason != "" {
			msg = stay.Reason
		}
		estimate = &hotels.HotelEstimate{
			Destination: req.Destination,
			CheckIn:     stay.CheckIn,
			CheckOut:    stay.CheckOut,
			Available:   false,
			Message:     msg,
			PriceStatus: hotels.PriceEstimated,
		}
	}

	label := req.Label
	if label == "" {
		label = hotels.FormatStayLabel(req.Destination)
	}
	td := hotels.BuildTripDeal(
		fmt.Sprintf("trip-%s-%s", req.Destination, req.FlightOptionID),
		label,
		req.Destination,
		stay.CheckIn,
		stay.CheckOut,
		req.FlightOptionID,
		flightPrice,
		estimate,
		nil,
	)
	writeJSON(w, http.StatusOK, td)
}

func toHotelSearchRequest(req hotelSearchAPIRequest) hotels.HotelSearchRequest {
	adults := req.Adults
	if adults < 1 {
		adults = 2
	}
	rooms := req.Rooms
	if rooms < 1 {
		rooms = 1
	}
	return hotels.HotelSearchRequest{
		DestinationQuery:  strings.TrimSpace(req.Destination),
		RegionID:          req.RegionID,
		Latitude:          req.Latitude,
		Longitude:         req.Longitude,
		RadiusKm:          req.RadiusKm,
		CheckIn:           strings.TrimSpace(req.CheckIn),
		CheckOut:          strings.TrimSpace(req.CheckOut),
		Adults:            adults,
		Children:          req.ChildrenAges,
		Rooms:             rooms,
		Currency:          strings.ToUpper(strings.TrimSpace(req.Currency)),
		Language:          req.Language,
		Residency:         req.Residency,
		MinStarRating:     req.MinStarRating,
		MaxStarRating:     req.MaxStarRating,
		MinGuestRating:    req.MinGuestRating,
		MinPrice:          req.MinPrice,
		MaxPrice:          req.MaxPrice,
		FreeCancellation:  req.FreeCancellation,
		BreakfastIncluded: req.BreakfastIncluded,
		PropertyTypes:     req.PropertyTypes,
		HotelsLimit:       req.HotelsLimit,
	}
}

// enrichHotelSearchFromAirport fills lat/lon from the explore airport coords table
// when the destination looks like an IATA code and no region/geo was provided.
func enrichHotelSearchFromAirport(req *hotels.HotelSearchRequest) {
	if req.RegionID > 0 || req.Latitude != nil {
		return
	}
	code := strings.ToUpper(strings.TrimSpace(req.DestinationQuery))
	if len(code) != 3 {
		return
	}
	if c, ok := getAirportCoord(code); ok {
		lat, lon := c.lat, c.lon
		req.Latitude = &lat
		req.Longitude = &lon
	}
}

func friendlyHotelError(err error) string {
	if err == nil {
		return "Hotel search unavailable"
	}
	msg := strings.ToLower(err.Error())
	switch {
	case strings.Contains(msg, "auth"):
		return "Hotel search temporarily unavailable"
	case strings.Contains(msg, "rate limited"):
		return "Hotel search is busy — try again shortly"
	case strings.Contains(msg, "timeout"):
		return "Hotel search timed out — try again"
	case strings.Contains(msg, "unavailable"):
		return "Hotel unavailable"
	case strings.Contains(msg, "no rooms"), strings.Contains(msg, "no hotels"):
		return "No hotels found"
	case strings.Contains(msg, "resolve destination"):
		return "Could not find that destination"
	default:
		return "Hotel search unavailable"
	}
}

func atoiDefault(s string, def int) int {
	s = strings.TrimSpace(s)
	if s == "" {
		return def
	}
	v, err := strconv.Atoi(s)
	if err != nil {
		return def
	}
	return v
}

func maxInt(a, b int) int {
	if a > b {
		return a
	}
	return b
}

func firstNonEmptyStr(vals ...string) string {
	for _, v := range vals {
		if strings.TrimSpace(v) != "" {
			return v
		}
	}
	return ""
}
