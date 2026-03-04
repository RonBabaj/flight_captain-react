package main

import (
	"log"
	"net/url"
	"os"
	"strconv"
	"strings"
	"sync"
	"time"
)

const (
	ProviderTypeAirline = "airline"
	ProviderTypeOTA     = "ota"
)

// Provider is a booking target (airline or OTA).
// URLTpl may contain {origin}, {destination}, {departureDate}, {returnDate}, {cabin}, {aff_id}, {subid}.
type Provider struct {
	Code   string `json:"code"`
	Name   string `json:"name"`
	Type   string `json:"type"` // "airline" | "ota"
	URLTpl string `json:"-"`   // template placeholders filled at link build time
}

// ClickRecord stores one outbound click for revenue tracking.
type ClickRecord struct {
	ID           string    `json:"id"`
	SessionID    string    `json:"sessionId"`
	OptionID     string    `json:"optionId"`
	ProviderCode string    `json:"providerCode"`
	ProviderName string    `json:"providerName"`
	ProviderType string    `json:"providerType"`
	RedirectURL  string    `json:"redirectUrl,omitempty"`
	CreatedAt    time.Time `json:"createdAt"`
}

// OutboundLinkResponse is the JSON response for GET /api/affiliate/outbound-link.
type OutboundLinkResponse struct {
	RedirectURL string   `json:"redirectUrl"`
	Provider    Provider `json:"provider"`
	ClickID     string   `json:"clickId"`
}

// ProviderResponse is the JSON response for GET /api/affiliate/provider (no click recorded).
type ProviderResponse struct {
	Provider Provider `json:"provider"`
}

// ClicksSummaryResponse is the JSON response for GET /api/affiliate/clicks/summary.
type ClicksSummaryResponse struct {
	From   string                  `json:"from"`
	To     string                  `json:"to"`
	Total  int                     `json:"total"`
	ByProvider []ClicksByProvider  `json:"byProvider"`
}

type ClicksByProvider struct {
	ProviderCode string `json:"providerCode"`
	ProviderName string `json:"providerName"`
	Count        int    `json:"count"`
}

var (
	// providerRegistry maps carrier IATA code (or "OTA") to provider config.
	providerRegistry   map[string]*Provider
	providerRegistryMu sync.RWMutex

	// affiliateIDDefault is the default affiliate ID (AFFILIATE_ID env). Used when per-provider is not set.
	affiliateIDDefault string
	// affiliateIDByProvider maps provider code to optional affiliate ID (e.g. AFF_ID_LY). Loaded at init.
	affiliateIDByProvider map[string]string
	affiliateIDMu         sync.RWMutex

	// clickStore holds all recorded clicks (in-memory MVP).
	clickStore   []ClickRecord
	clickStoreMu sync.RWMutex
)

func init() {
	// Load affiliate IDs from env (do not commit real values).
	affiliateIDDefault = strings.TrimSpace(os.Getenv("AFFILIATE_ID"))
	affiliateIDByProvider = map[string]string{
		"OTA": strings.TrimSpace(os.Getenv("AFF_ID_OTA")),
		"LY":  strings.TrimSpace(os.Getenv("AFF_ID_LY")),
		"UA":  strings.TrimSpace(os.Getenv("AFF_ID_UA")),
		"AA":  strings.TrimSpace(os.Getenv("AFF_ID_AA")),
		"BA":  strings.TrimSpace(os.Getenv("AFF_ID_BA")),
		"LH":  strings.TrimSpace(os.Getenv("AFF_ID_LH")),
		"TK":  strings.TrimSpace(os.Getenv("AFF_ID_TK")),
		"EK":  strings.TrimSpace(os.Getenv("AFF_ID_EK")),
		"DL":  strings.TrimSpace(os.Getenv("AFF_ID_DL")),
	}

	providerRegistry = map[string]*Provider{
		// OTA fallback: used when no airline template or as default. {aff_id} and {subid} for tracking.
		"OTA": {
			Code:   "GOOGLE_FLIGHTS",
			Name:   "Google Flights",
			Type:   ProviderTypeOTA,
			URLTpl: "https://www.google.com/travel/flights?q=Flights%20to%20{destination}%20from%20{origin}%20on%20{departureDate}&aff_id={aff_id}&subid={subid}",
		},
		"LY": {
			Code:   "LY",
			Name:   "El Al",
			Type:   ProviderTypeAirline,
			URLTpl: "https://www.elal.com/en/Book/Flights?from={origin}&to={destination}&departure={departureDate}&return={returnDate}&cabin={cabin}&aff_id={aff_id}&subid={subid}",
		},
		"UA": {
			Code:   "UA",
			Name:   "United Airlines",
			Type:   ProviderTypeAirline,
			URLTpl: "https://www.united.com/en/us/book-flight?f={origin}&t={destination}&d={departureDate}&r={returnDate}&aff_id={aff_id}&subid={subid}",
		},
		"AA": {
			Code:   "AA",
			Name:   "American Airlines",
			Type:   ProviderTypeAirline,
			URLTpl: "https://www.aa.com/booking/find-flights?origin={origin}&destination={destination}&departureDate={departureDate}&returnDate={returnDate}&aff_id={aff_id}&subid={subid}",
		},
		"BA": {
			Code:   "BA",
			Name:   "British Airways",
			Type:   ProviderTypeAirline,
			URLTpl: "https://www.britishairways.com/travel/book/public/en_us?eId=106019&from={origin}&to={destination}&outbound={departureDate}&inbound={returnDate}&aff_id={aff_id}&subid={subid}",
		},
		"LH": {
			Code:   "LH",
			Name:   "Lufthansa",
			Type:   ProviderTypeAirline,
			URLTpl: "https://www.lufthansa.com/booking/flight?from={origin}&to={destination}&outbound={departureDate}&inbound={returnDate}&aff_id={aff_id}&subid={subid}",
		},
		"TK": {
			Code:   "TK",
			Name:   "Turkish Airlines",
			Type:   ProviderTypeAirline,
			URLTpl: "https://www.turkishairlines.com/book/flights?from={origin}&to={destination}&departure={departureDate}&return={returnDate}&aff_id={aff_id}&subid={subid}",
		},
		"EK": {
			Code:   "EK",
			Name:   "Emirates",
			Type:   ProviderTypeAirline,
			URLTpl: "https://www.emirates.com/book/flights?from={origin}&to={destination}&departure={departureDate}&return={returnDate}&aff_id={aff_id}&subid={subid}",
		},
		"DL": {
			Code:   "DL",
			Name:   "Delta",
			Type:   ProviderTypeAirline,
			URLTpl: "https://www.delta.com/flight-search?from={origin}&to={destination}&departure={departureDate}&return={returnDate}&aff_id={aff_id}&subid={subid}",
		},
	}
}

// ResolveProvider returns the provider for the given option (PrimaryDisplayCarrier / marketing or OTA fallback).
func ResolveProvider(option *FlightOption) *Provider {
	if option == nil {
		return getOTAProvider()
	}
	carrierCode := strings.ToUpper(option.PrimaryDisplayCarrier)
	if carrierCode == "" && len(option.Legs) > 0 && len(option.Legs[0].Segments) > 0 {
		carrierCode = strings.ToUpper(option.Legs[0].Segments[0].MarketingCarrier.Code)
	}
	if carrierCode == "" {
		return getOTAProvider()
	}
	providerRegistryMu.RLock()
	defer providerRegistryMu.RUnlock()
	if p, ok := providerRegistry[carrierCode]; ok && p.URLTpl != "" {
		return p
	}
	return getOTAProvider()
}

func getOTAProvider() *Provider {
	providerRegistryMu.RLock()
	defer providerRegistryMu.RUnlock()
	if p, ok := providerRegistry["OTA"]; ok {
		return p
	}
	return &Provider{Code: "OTA", Name: "Partner site", Type: ProviderTypeOTA, URLTpl: "https://www.google.com/travel/flights"}
}

// getAffiliateID returns the affiliate ID for the given provider code (per-provider env or default). Never hardcoded.
func getAffiliateID(providerCode string) string {
	affiliateIDMu.RLock()
	defer affiliateIDMu.RUnlock()
	if id := affiliateIDByProvider[providerCode]; id != "" {
		return id
	}
	return affiliateIDDefault
}

// BuildRedirectURL fills the provider's URL template with session/option data and optional affiliate tracking.
// sessionID and optionID are used for {subid} (e.g. sessionId_optionId) for click/conversion tracking.
func BuildRedirectURL(session *SearchSession, option *FlightOption, provider *Provider, sessionID, optionID string) string {
	if session == nil || provider == nil {
		return ""
	}
	params := session.Params
	origin := strings.ToUpper(params.Origin)
	destination := strings.ToUpper(params.Destination)
	departureDate := params.DepartureDate
	returnDate := params.ReturnDate
	if returnDate == "" {
		returnDate = departureDate
	}
	cabin := params.CabinPreference
	if cabin == "" {
		cabin = params.CabinClass
	}
	if cabin == "" {
		cabin = "ECONOMY"
	}

	affID := getAffiliateID(provider.Code)
	subid := sessionID + "_" + optionID
	if subid == "_" {
		subid = ""
	}

	s := provider.URLTpl
	s = strings.ReplaceAll(s, "{origin}", url.QueryEscape(origin))
	s = strings.ReplaceAll(s, "{destination}", url.QueryEscape(destination))
	s = strings.ReplaceAll(s, "{departureDate}", url.QueryEscape(departureDate))
	s = strings.ReplaceAll(s, "{returnDate}", url.QueryEscape(returnDate))
	s = strings.ReplaceAll(s, "{cabin}", url.QueryEscape(cabin))
	s = strings.ReplaceAll(s, "{aff_id}", url.QueryEscape(affID))
	s = strings.ReplaceAll(s, "{subid}", url.QueryEscape(subid))
	return s
}

// RecordClick stores a click and returns its ID. Call before returning redirect or outbound-link.
func RecordClick(sessionID, optionID string, provider *Provider, redirectURL string) string {
	id := randomID("click_")
	rec := ClickRecord{
		ID:           id,
		SessionID:    sessionID,
		OptionID:     optionID,
		ProviderCode: provider.Code,
		ProviderName: provider.Name,
		ProviderType: provider.Type,
		RedirectURL:  redirectURL,
		CreatedAt:    time.Now().UTC(),
	}
	clickStoreMu.Lock()
	clickStore = append(clickStore, rec)
	clickStoreMu.Unlock()

	log.Printf("[affiliate] click recorded clickId=%s sessionId=%s optionId=%s provider=%s", id, sessionID, optionID, provider.Code)
	return id
}

// GetClicksSummary returns counts by provider and total for the given date range (inclusive).
func GetClicksSummary(from, to time.Time) ClicksSummaryResponse {
	clickStoreMu.RLock()
	defer clickStoreMu.RUnlock()

	var total int
	byProvider := make(map[string]ClicksByProvider)

	for _, c := range clickStore {
		if (c.CreatedAt.Before(from) || c.CreatedAt.After(to)) && !from.IsZero() && !to.IsZero() {
			continue
		}
		total++
		key := c.ProviderCode
		entry := byProvider[key]
		entry.ProviderCode = c.ProviderCode
		entry.ProviderName = c.ProviderName
		entry.Count++
		byProvider[key] = entry
	}

	slice := make([]ClicksByProvider, 0, len(byProvider))
	for _, v := range byProvider {
		slice = append(slice, v)
	}
	return ClicksSummaryResponse{
		From:        from.Format("2006-01-02"),
		To:          to.Format("2006-01-02"),
		Total:       total,
		ByProvider:  slice,
	}
}

// ParseOptionIndex extracts option index from optionId (e.g. "opt_0" -> 0). Returns -1 if invalid.
func ParseOptionIndex(optionID string) int {
	if !strings.HasPrefix(optionID, "opt_") {
		return -1
	}
	i, err := strconv.Atoi(strings.TrimPrefix(optionID, "opt_"))
	if err != nil || i < 0 {
		return -1
	}
	return i
}

// GetSessionAndOption looks up session and option by sessionId and optionId. Returns nil if not found.
func GetSessionAndOption(sessionID, optionID string) (*SearchSessionResultsResponse, *FlightOption) {
	sessionsMu.RLock()
	defer sessionsMu.RUnlock()
	resp, ok := sessions[sessionID]
	if !ok {
		return nil, nil
	}
	idx := ParseOptionIndex(optionID)
	if idx < 0 || idx >= len(resp.Results) {
		return nil, nil
	}
	option := &resp.Results[idx]
	return &resp, option
}
