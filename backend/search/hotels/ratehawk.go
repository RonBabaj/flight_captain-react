package hotels

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"strconv"
	"strings"
	"sync"
	"time"
	"unicode"
)

const (
	defaultRateHawkBaseURL = "https://api.worldota.net"
	defaultRateHawkTimeout = 30 * time.Second
	defaultGeoRadiusKm     = 25
	defaultCacheTTL        = 5 * time.Minute
	defaultResidency       = "us"
	providerNameRateHawk   = "ratehawk"
)

// RateHawkProvider implements HotelProvider against ETG/RateHawk API v3.
// Auth: HTTP Basic with KEY_ID (username) and API_KEY (password).
// Docs: https://docs.emergingtravel.com/
type RateHawkProvider struct {
	keyID     string
	apiKey    string
	baseURL   string
	residency string
	radiusKm  int
	client    *http.Client
	cache     *TTLCache
	mu        sync.Mutex
}

// NewRateHawkProvider constructs a provider when RATEHAWK_ENABLED=true and credentials exist.
func NewRateHawkProvider() *RateHawkProvider {
	if strings.ToLower(strings.TrimSpace(os.Getenv("RATEHAWK_ENABLED"))) != "true" {
		return nil
	}
	keyID := strings.TrimSpace(os.Getenv("RATEHAWK_KEY_ID"))
	apiKey := strings.TrimSpace(os.Getenv("RATEHAWK_API_KEY"))
	if keyID == "" || apiKey == "" {
		log.Println("[RateHawk] enabled but RATEHAWK_KEY_ID / RATEHAWK_API_KEY missing — provider disabled")
		return nil
	}
	base := strings.TrimSpace(os.Getenv("RATEHAWK_BASE_URL"))
	if base == "" {
		base = defaultRateHawkBaseURL
	}
	base = strings.TrimRight(base, "/")

	timeout := defaultRateHawkTimeout
	if s := strings.TrimSpace(os.Getenv("RATEHAWK_TIMEOUT_SECONDS")); s != "" {
		if v, err := strconv.Atoi(s); err == nil && v >= 5 && v <= 120 {
			timeout = time.Duration(v) * time.Second
		}
	}
	ttl := defaultCacheTTL
	if s := strings.TrimSpace(os.Getenv("RATEHAWK_CACHE_TTL_SECONDS")); s != "" {
		if v, err := strconv.Atoi(s); err == nil && v >= 30 && v <= 3600 {
			ttl = time.Duration(v) * time.Second
		}
	}
	radius := defaultGeoRadiusKm
	if s := strings.TrimSpace(os.Getenv("RATEHAWK_GEO_RADIUS_KM")); s != "" {
		if v, err := strconv.Atoi(s); err == nil && v >= 1 && v <= 150 {
			radius = v
		}
	}
	residency := strings.ToLower(strings.TrimSpace(os.Getenv("RATEHAWK_RESIDENCY")))
	if residency == "" {
		residency = defaultResidency
	}

	log.Printf("[RateHawk] provider enabled base=%s cacheTTL=%s radiusKm=%d", base, ttl, radius)
	return &RateHawkProvider{
		keyID:     keyID,
		apiKey:    apiKey,
		baseURL:   base,
		residency: residency,
		radiusKm:  radius,
		client:    &http.Client{Timeout: timeout},
		cache:     NewTTLCache(ttl),
	}
}

func (p *RateHawkProvider) Name() string { return providerNameRateHawk }

// SuggestDestinations calls POST /api/b2b/v3/search/multicomplete/
func (p *RateHawkProvider) SuggestDestinations(ctx context.Context, query, language string) ([]DestinationSuggestion, error) {
	query = strings.TrimSpace(query)
	if len(query) < 2 {
		return nil, nil
	}
	if language == "" {
		language = "en"
	}
	cacheKey := "suggest|" + language + "|" + strings.ToLower(query)
	if v, ok := p.cache.Get(cacheKey); ok {
		if s, ok := v.([]DestinationSuggestion); ok {
			return s, nil
		}
	}

	body := map[string]any{
		"query":    query,
		"language": language,
	}
	var resp rhAPIResponse
	if err := p.post(ctx, "/api/b2b/v3/search/multicomplete/", body, &resp); err != nil {
		return nil, err
	}
	if err := resp.asError(); err != nil {
		return nil, err
	}

	out := make([]DestinationSuggestion, 0, 10)
	for _, r := range resp.Data.Regions {
		out = append(out, DestinationSuggestion{
			ID:          fmt.Sprintf("region:%d", r.ID),
			Name:        r.Name,
			Type:        normalizeRegionType(r.Type),
			CountryCode: strings.ToUpper(r.CountryCode),
			RegionID:    r.ID,
		})
	}
	for _, h := range resp.Data.Hotels {
		out = append(out, DestinationSuggestion{
			ID:          fmt.Sprintf("hotel:%d", h.HID),
			Name:        h.Name,
			Type:        "hotel",
			RegionID:    h.RegionID,
			HotelID:     h.ID,
			ProviderHID: h.HID,
		})
	}
	p.cache.Set(cacheKey, out)
	return out, nil
}

// Search performs a SERP search via region or geo endpoints.
func (p *RateHawkProvider) Search(ctx context.Context, req HotelSearchRequest) ([]HotelOffer, error) {
	if err := validateStay(req.CheckIn, req.CheckOut); err != nil {
		return nil, err
	}
	cacheKey := searchCacheKey(req)
	if v, ok := p.cache.Get(cacheKey); ok {
		if offers, ok := v.([]HotelOffer); ok {
			return cloneOffers(offers), nil
		}
	}

	// Resolve destination query → region via multicomplete when needed.
	if req.RegionID == 0 && req.Latitude == nil && strings.TrimSpace(req.DestinationQuery) != "" {
		sugs, err := p.SuggestDestinations(ctx, req.DestinationQuery, req.Language)
		if err != nil {
			return nil, err
		}
		for _, s := range sugs {
			if s.RegionID > 0 && (s.Type == "city" || s.Type == "region" || s.Type == "multi-city") {
				req.RegionID = s.RegionID
				break
			}
		}
		if req.RegionID == 0 {
			for _, s := range sugs {
				if s.RegionID > 0 {
					req.RegionID = s.RegionID
					break
				}
			}
		}
		if req.RegionID == 0 {
			return nil, fmt.Errorf("could not resolve destination %q", req.DestinationQuery)
		}
	}

	body, path, err := p.buildSERPBody(req)
	if err != nil {
		return nil, err
	}

	var resp rhAPIResponse
	if err := p.post(ctx, path, body, &resp); err != nil {
		return nil, err
	}
	if err := resp.asError(); err != nil {
		return nil, err
	}

	nights := NightsBetween(req.CheckIn, req.CheckOut)
	offers := normalizeSERPHotels(resp.Data.Hotels, req, nights, PriceEstimated)
	offers = applyClientFilters(offers, req)
	SortHotels(offers, "cheapest")
	p.cache.Set(cacheKey, offers)
	return cloneOffers(offers), nil
}

// HotelDetails calls POST /api/b2b/v3/search/hp/ for live rates on a selected hotel.
func (p *RateHawkProvider) HotelDetails(ctx context.Context, hotelID string, hid int64, req HotelSearchRequest) (*HotelOffer, []HotelOffer, error) {
	if err := validateStay(req.CheckIn, req.CheckOut); err != nil {
		return nil, nil, err
	}
	if hid <= 0 && hotelID == "" {
		return nil, nil, fmt.Errorf("hotel id required")
	}

	body := p.baseGuestBody(req)
	if hid > 0 {
		body["hid"] = hid
	} else {
		body["id"] = hotelID
	}
	if f := buildFilter(req); f != nil {
		body["filter"] = f
	}

	var resp rhAPIResponse
	if err := p.post(ctx, "/api/b2b/v3/search/hp/", body, &resp); err != nil {
		return nil, nil, err
	}
	if err := resp.asError(); err != nil {
		return nil, nil, err
	}
	if len(resp.Data.Hotels) == 0 {
		return nil, nil, fmt.Errorf("hotel unavailable")
	}

	nights := NightsBetween(req.CheckIn, req.CheckOut)
	offers := normalizeSERPHotels(resp.Data.Hotels, req, nights, PriceLive)
	if len(offers) == 0 {
		return nil, nil, fmt.Errorf("no rooms available")
	}
	SortHotels(offers, "cheapest")
	best := offers[0]
	return &best, offers, nil
}

// Estimate returns a destination-level cheapest-hotel estimate from SERP (price_status=estimated).
func (p *RateHawkProvider) Estimate(ctx context.Context, req HotelSearchRequest) (*HotelEstimate, error) {
	if err := validateStay(req.CheckIn, req.CheckOut); err != nil {
		return &HotelEstimate{
			Destination: destLabel(req),
			CheckIn:     req.CheckIn,
			CheckOut:    req.CheckOut,
			Available:   false,
			Message:     err.Error(),
			PriceStatus: PriceEstimated,
			Currency:    req.Currency,
			Provider:    p.Name(),
		}, nil
	}

	cacheKey := "est|" + EstimateCacheKey(destLabel(req), req.CheckIn, req.CheckOut, req.Currency, effectiveRooms(req), effectiveGuests(req), filterKey(req))
	if v, ok := p.cache.Get(cacheKey); ok {
		if est, ok := v.(*HotelEstimate); ok {
			cp := *est
			cp.Cached = true
			return &cp, nil
		}
	}

	// Limit hotels for estimates to keep responses small.
	if req.HotelsLimit <= 0 || req.HotelsLimit > 30 {
		req.HotelsLimit = 30
	}

	offers, err := p.Search(ctx, req)
	est := &HotelEstimate{
		Destination: destLabel(req),
		CheckIn:     req.CheckIn,
		CheckOut:    req.CheckOut,
		Nights:      NightsBetween(req.CheckIn, req.CheckOut),
		Rooms:       effectiveRooms(req),
		Guests:      effectiveGuests(req),
		Currency:    req.Currency,
		PriceStatus: PriceEstimated,
		Provider:    p.Name(),
	}
	if err != nil {
		est.Available = false
		est.Message = "Hotel prices unavailable"
		log.Printf("[RateHawk] estimate error dest=%s: %v", est.Destination, err)
		return est, nil // soft-fail: never break callers
	}
	if len(offers) == 0 {
		est.Available = false
		est.Message = "No hotels found"
		p.cache.Set(cacheKey, est)
		return est, nil
	}
	best := offers[0]
	est.Available = true
	est.HotelCount = len(offers)
	est.SampleHotelID = best.HotelID
	est.SampleName = best.Name
	tp := best.TotalPrice
	ppn := best.PricePerNight
	est.TotalPrice = &tp
	est.PricePerNight = &ppn
	est.Currency = best.Currency
	p.cache.Set(cacheKey, est)
	return est, nil
}

func (p *RateHawkProvider) buildSERPBody(req HotelSearchRequest) (map[string]any, string, error) {
	body := p.baseGuestBody(req)
	if f := buildFilter(req); f != nil {
		body["filter"] = f
	}
	if req.HotelsLimit > 0 {
		body["hotels_limit"] = req.HotelsLimit
	}

	if req.RegionID > 0 {
		body["region_id"] = req.RegionID
		return body, "/api/b2b/v3/search/serp/region/", nil
	}
	if req.Latitude != nil && req.Longitude != nil {
		body["latitude"] = *req.Latitude
		body["longitude"] = *req.Longitude
		radius := req.RadiusKm
		if radius <= 0 {
			radius = p.radiusKm
		}
		body["radius"] = radius
		return body, "/api/b2b/v3/search/serp/geo/", nil
	}
	return nil, "", fmt.Errorf("region_id or latitude/longitude required for hotel search")
}

func (p *RateHawkProvider) baseGuestBody(req HotelSearchRequest) map[string]any {
	rooms := effectiveRooms(req)
	adults := req.Adults
	if adults < 1 {
		adults = 1
	}
	if adults > 6 {
		adults = 6
	}
	guests := make([]map[string]any, 0, rooms)
	children := req.Children
	if children == nil {
		children = []int{}
	}
	for i := 0; i < rooms; i++ {
		guests = append(guests, map[string]any{
			"adults":   adults,
			"children": children,
		})
	}
	residency := req.Residency
	if residency == "" {
		residency = p.residency
	}
	language := req.Language
	if language == "" {
		language = "en"
	}
	body := map[string]any{
		"checkin":   req.CheckIn,
		"checkout":  req.CheckOut,
		"residency": strings.ToLower(residency),
		"language":  language,
		"guests":    guests,
	}
	if req.Currency != "" {
		body["currency"] = strings.ToUpper(req.Currency)
	}
	return body
}

func (p *RateHawkProvider) post(ctx context.Context, path string, body any, out *rhAPIResponse) error {
	raw, err := json.Marshal(body)
	if err != nil {
		return err
	}
	url := p.baseURL + path
	req, err := http.NewRequestWithContext(ctx, http.MethodPost, url, bytes.NewReader(raw))
	if err != nil {
		return err
	}
	req.SetBasicAuth(p.keyID, p.apiKey)
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Accept", "application/json")

	start := time.Now()
	res, err := p.client.Do(req)
	if err != nil {
		if ctx.Err() != nil {
			return fmt.Errorf("ratehawk timeout")
		}
		return fmt.Errorf("ratehawk request failed: %w", err)
	}
	defer res.Body.Close()
	respBody, err := io.ReadAll(io.LimitReader(res.Body, 8<<20))
	if err != nil {
		return fmt.Errorf("ratehawk read failed: %w", err)
	}

	if res.StatusCode == http.StatusTooManyRequests {
		return fmt.Errorf("ratehawk rate limited")
	}
	if res.StatusCode == http.StatusUnauthorized || res.StatusCode == http.StatusForbidden {
		return fmt.Errorf("ratehawk authentication failed")
	}
	if res.StatusCode >= 500 {
		return fmt.Errorf("ratehawk unavailable")
	}

	if err := json.Unmarshal(respBody, out); err != nil {
		return fmt.Errorf("ratehawk invalid response")
	}
	log.Printf("[RateHawk] POST %s status=%d latencyMs=%d apiStatus=%s", path, res.StatusCode, time.Since(start).Milliseconds(), out.Status)
	return nil
}

// --- RateHawk wire types (subset of documented fields) ---

type rhAPIResponse struct {
	Data   rhData `json:"data"`
	Status string `json:"status"`
	Error  any    `json:"error"`
}

type rhData struct {
	Hotels  []rhHotel         `json:"hotels"`
	Regions []rhRegionSuggest `json:"regions"`
	// multicomplete also nests hotels at data.hotels with different shape — same struct works
}

type rhRegionSuggest struct {
	ID          int    `json:"id"`
	Name        string `json:"name"`
	Type        string `json:"type"`
	CountryCode string `json:"country_code"`
}

type rhHotel struct {
	ID       string   `json:"id"`
	HID      int64    `json:"hid"`
	Name     string   `json:"name"` // present on multicomplete / some content responses
	RegionID int      `json:"region_id"`
	Rates    []rhRate `json:"rates"`
}

type rhRate struct {
	MatchHash      string            `json:"match_hash"`
	SearchHash     *string           `json:"search_hash"`
	BookHash       string            `json:"book_hash"`
	DailyPrices    []string          `json:"daily_prices"`
	Meal           string            `json:"meal"`
	MealData       *rhMealData       `json:"meal_data"`
	RoomName       string            `json:"room_name"`
	Allotment      int               `json:"allotment"`
	Amenities      []string          `json:"amenities_data"`
	SerpFilters    []string          `json:"serp_filters"`
	PaymentOptions *rhPaymentOptions `json:"payment_options"`
	RoomDataTrans  *rhRoomDataTrans  `json:"room_data_trans"`
	LegalInfo      *rhLegalInfo      `json:"legal_info"`
}

type rhMealData struct {
	Value        string `json:"value"`
	HasBreakfast bool   `json:"has_breakfast"`
}

type rhPaymentOptions struct {
	PaymentTypes []rhPaymentType `json:"payment_types"`
}

type rhPaymentType struct {
	Amount                string             `json:"amount"`
	ShowAmount            string             `json:"show_amount"`
	CurrencyCode          string             `json:"currency_code"`
	ShowCurrencyCode      string             `json:"show_currency_code"`
	CancellationPenalties *rhCancelPenalties `json:"cancellation_penalties"`
}

type rhCancelPenalties struct {
	FreeCancellationBefore *string `json:"free_cancellation_before"`
}

type rhRoomDataTrans struct {
	MainName string `json:"main_name"`
}

type rhLegalInfo struct {
	Hotel *rhLegalHotel `json:"hotel"`
}

type rhLegalHotel struct {
	Name    string `json:"name"`
	Address string `json:"address"`
}

func (r rhAPIResponse) asError() error {
	if strings.EqualFold(r.Status, "ok") {
		return nil
	}
	// Empty status with nil error is treated as ok (defensive).
	if r.Status == "" && r.Error == nil {
		return nil
	}
	msg := strings.TrimSpace(fmt.Sprintf("%v", r.Error))
	if msg == "<nil>" {
		msg = ""
	}
	lower := strings.ToLower(msg + " " + r.Status)
	switch {
	case strings.Contains(lower, "auth"), strings.Contains(lower, "unauthorized"), strings.Contains(lower, "forbidden"):
		return fmt.Errorf("ratehawk authentication failed")
	case strings.Contains(lower, "rate limit"), strings.Contains(lower, "too many"):
		return fmt.Errorf("ratehawk rate limited")
	case strings.Contains(lower, "no_available"), strings.Contains(lower, "soldout"):
		return fmt.Errorf("hotel unavailable")
	case msg == "":
		return fmt.Errorf("ratehawk error: %s", firstNonEmpty(r.Status, "unknown"))
	default:
		return fmt.Errorf("ratehawk error: %s", sanitizeErr(msg))
	}
}

func sanitizeErr(s string) string {
	s = strings.TrimSpace(s)
	if len(s) > 120 {
		s = s[:120]
	}
	return s
}

func validateStay(checkIn, checkOut string) error {
	if !validDate(checkIn) || !validDate(checkOut) {
		return fmt.Errorf("invalid check-in/check-out dates")
	}
	n := NightsBetween(checkIn, checkOut)
	if n < 1 {
		return fmt.Errorf("check-out must be after check-in")
	}
	if n > 30 {
		return fmt.Errorf("stay must be 30 nights or fewer")
	}
	return nil
}

func buildFilter(req HotelSearchRequest) map[string]any {
	f := map[string]any{}
	has := false
	if req.MinStarRating > 0 || req.MaxStarRating > 0 {
		stars := []int{}
		min := req.MinStarRating
		max := req.MaxStarRating
		if min <= 0 {
			min = 1
		}
		if max <= 0 {
			max = 5
		}
		for s := min; s <= max; s++ {
			stars = append(stars, s)
		}
		f["star_rating"] = stars
		has = true
	}
	if len(req.PropertyTypes) > 0 {
		f["kind"] = req.PropertyTypes
		has = true
	}
	if req.BreakfastIncluded {
		f["meal_type"] = []string{"breakfast", "half-board", "full-board", "all-inclusive", "super-all-inclusive", "soft-all-inclusive", "ultra-all-inclusive"}
		has = true
	}
	if has {
		return f
	}
	return nil
}

func applyClientFilters(offers []HotelOffer, req HotelSearchRequest) []HotelOffer {
	out := offers[:0:0]
	for _, o := range offers {
		if req.FreeCancellation && !o.Refundable {
			continue
		}
		if req.BreakfastIncluded && !o.HasBreakfast {
			continue
		}
		if req.MinPrice != nil && o.TotalPrice.Amount < *req.MinPrice {
			continue
		}
		if req.MaxPrice != nil && o.TotalPrice.Amount > *req.MaxPrice {
			continue
		}
		if req.MinGuestRating > 0 && o.GuestRating > 0 && o.GuestRating < req.MinGuestRating {
			continue
		}
		out = append(out, o)
	}
	if out == nil {
		return []HotelOffer{}
	}
	return out
}

func normalizeSERPHotels(hotels []rhHotel, req HotelSearchRequest, nights int, status PriceStatus) []HotelOffer {
	out := make([]HotelOffer, 0, len(hotels))
	for _, h := range hotels {
		best := pickCheapestRate(h.Rates)
		if best == nil {
			continue
		}
		offer := normalizeOffer(h, best, req, nights, status)
		out = append(out, offer)
	}
	return out
}

func pickCheapestRate(rates []rhRate) *rhRate {
	var best *rhRate
	var bestAmt float64
	for i := range rates {
		r := &rates[i]
		amt, _, ok := rateShowAmount(r)
		if !ok {
			continue
		}
		if best == nil || amt < bestAmt {
			best = r
			bestAmt = amt
		}
	}
	return best
}

func rateShowAmount(r *rhRate) (float64, string, bool) {
	if r == nil || r.PaymentOptions == nil || len(r.PaymentOptions.PaymentTypes) == 0 {
		return 0, "", false
	}
	pt := r.PaymentOptions.PaymentTypes[0]
	amt, err := strconv.ParseFloat(pt.ShowAmount, 64)
	if err != nil {
		amt, err = strconv.ParseFloat(pt.Amount, 64)
		if err != nil {
			return 0, "", false
		}
	}
	cur := pt.ShowCurrencyCode
	if cur == "" {
		cur = pt.CurrencyCode
	}
	return amt, cur, true
}

func normalizeOffer(h rhHotel, r *rhRate, req HotelSearchRequest, nights int, status PriceStatus) HotelOffer {
	amt, cur, _ := rateShowAmount(r)
	if nights < 1 {
		nights = 1
	}
	name := h.Name
	address := ""
	if r.LegalInfo != nil && r.LegalInfo.Hotel != nil {
		if r.LegalInfo.Hotel.Name != "" {
			name = r.LegalInfo.Hotel.Name
		}
		address = r.LegalInfo.Hotel.Address
	}
	if name == "" {
		name = humanizeHotelID(h.ID)
	}

	board := r.Meal
	hasBreakfast := false
	if r.MealData != nil {
		if r.MealData.Value != "" {
			board = r.MealData.Value
		}
		hasBreakfast = r.MealData.HasBreakfast
	}

	roomType := r.RoomName
	if r.RoomDataTrans != nil && r.RoomDataTrans.MainName != "" {
		roomType = r.RoomDataTrans.MainName
	}

	refundable := false
	freeBefore := ""
	cancelPolicy := "Non-refundable"
	if r.PaymentOptions != nil && len(r.PaymentOptions.PaymentTypes) > 0 {
		cp := r.PaymentOptions.PaymentTypes[0].CancellationPenalties
		if cp != nil && cp.FreeCancellationBefore != nil && *cp.FreeCancellationBefore != "" {
			refundable = true
			freeBefore = *cp.FreeCancellationBefore
			cancelPolicy = "Free cancellation before " + freeBefore
		}
	}

	amenities := append([]string{}, r.Amenities...)
	amenities = append(amenities, r.SerpFilters...)

	searchHash := ""
	if r.SearchHash != nil {
		searchHash = *r.SearchHash
	}

	perNight := round2(amt / float64(nights))
	hotelID := h.ID
	if hotelID == "" && h.HID > 0 {
		hotelID = strconv.FormatInt(h.HID, 10)
	}

	return HotelOffer{
		HotelID:                hotelID,
		Provider:               providerNameRateHawk,
		ProviderHID:            h.HID,
		Name:                   name,
		Destination:            destLabel(req),
		Address:                address,
		RoomType:               roomType,
		BoardType:              board,
		HasBreakfast:           hasBreakfast,
		CheckIn:                req.CheckIn,
		CheckOut:               req.CheckOut,
		Nights:                 nights,
		TotalPrice:             Monetary{Currency: cur, Amount: amt},
		PricePerNight:          Monetary{Currency: cur, Amount: perNight},
		Currency:               cur,
		CancellationPolicy:     cancelPolicy,
		Refundable:             refundable,
		FreeCancellationBefore: freeBefore,
		RoomAvailability:       r.Allotment,
		Amenities:              uniqueStrings(amenities),
		PriceStatus:            status,
		SearchHash:             searchHash,
		MatchHash:              r.MatchHash,
		BookHash:               r.BookHash,
	}
}

func humanizeHotelID(id string) string {
	id = strings.TrimSpace(id)
	if id == "" {
		return "Hotel"
	}
	parts := strings.FieldsFunc(id, func(r rune) bool {
		return r == '_' || r == '-' || unicode.IsSpace(r)
	})
	for i, p := range parts {
		if p == "" {
			continue
		}
		runes := []rune(strings.ToLower(p))
		runes[0] = unicode.ToUpper(runes[0])
		parts[i] = string(runes)
	}
	return strings.Join(parts, " ")
}

func uniqueStrings(in []string) []string {
	seen := map[string]struct{}{}
	out := make([]string, 0, len(in))
	for _, s := range in {
		s = strings.TrimSpace(s)
		if s == "" {
			continue
		}
		if _, ok := seen[s]; ok {
			continue
		}
		seen[s] = struct{}{}
		out = append(out, s)
	}
	return out
}

func normalizeRegionType(t string) string {
	t = strings.ToLower(strings.TrimSpace(t))
	switch {
	case strings.Contains(t, "city"):
		return "city"
	case strings.Contains(t, "airport"):
		return "airport"
	case strings.Contains(t, "hotel"):
		return "hotel"
	case t == "":
		return "region"
	default:
		return t
	}
}

func destLabel(req HotelSearchRequest) string {
	if q := strings.TrimSpace(req.DestinationQuery); q != "" {
		return q
	}
	if req.RegionID > 0 {
		return fmt.Sprintf("region:%d", req.RegionID)
	}
	if req.Latitude != nil && req.Longitude != nil {
		return fmt.Sprintf("%.4f,%.4f", *req.Latitude, *req.Longitude)
	}
	return ""
}

func effectiveRooms(req HotelSearchRequest) int {
	if req.Rooms < 1 {
		return 1
	}
	if req.Rooms > 9 {
		return 9
	}
	return req.Rooms
}

func effectiveGuests(req HotelSearchRequest) int {
	a := req.Adults
	if a < 1 {
		a = 1
	}
	return a*effectiveRooms(req) + len(req.Children)
}

func filterKey(req HotelSearchRequest) string {
	parts := []string{}
	if req.FreeCancellation {
		parts = append(parts, "fc")
	}
	if req.BreakfastIncluded {
		parts = append(parts, "bf")
	}
	if req.MinStarRating > 0 {
		parts = append(parts, "minStar"+itoa(req.MinStarRating))
	}
	return strings.Join(parts, ",")
}

func searchCacheKey(req HotelSearchRequest) string {
	return "search|" + EstimateCacheKey(destLabel(req), req.CheckIn, req.CheckOut, req.Currency, effectiveRooms(req), effectiveGuests(req), filterKey(req)+"|reg"+itoa(req.RegionID))
}

func cloneOffers(in []HotelOffer) []HotelOffer {
	out := make([]HotelOffer, len(in))
	copy(out, in)
	return out
}
