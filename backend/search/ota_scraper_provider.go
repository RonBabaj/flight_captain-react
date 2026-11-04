package search

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"strings"
	"sync"
	"time"
)

const (
	otaScraperHTTPTimeout = 90 * time.Second
	defaultOtaScraperURL  = "http://flight-scraper:3099"
)

// OtaScraperProvider calls the self-hosted multisite flight scraper (Kiwi, Skyscanner, Expedia).
type OtaScraperProvider struct {
	baseURL string
	sites   []string
	token   string
	client  *http.Client
	cache   *otaScraperCache
}

type otaScraperCache struct {
	mu    sync.RWMutex
	items map[string]otaScraperCacheEntry
	ttl   time.Duration
}

type otaScraperCacheEntry struct {
	results []ProviderResult
	expires time.Time
}

type otaScraperSearchRequest struct {
	Origin        string   `json:"origin"`
	Destination   string   `json:"destination"`
	DepartureDate string   `json:"departureDate"`
	ReturnDate    string   `json:"returnDate,omitempty"`
	Adults        int      `json:"adults"`
	Children      int      `json:"children"`
	Infants       int      `json:"infants"`
	Currency      string   `json:"currency"`
	CabinClass    string   `json:"cabinClass"`
	CheckedBags   bool     `json:"checkedBags"`
	Sites         []string `json:"sites"`
}

type otaScraperSiteResult struct {
	Site   string                   `json:"site"`
	Offers []map[string]interface{} `json:"offers"`
	Error  string                   `json:"error,omitempty"`
}

type otaScraperSearchResponse struct {
	Sites  []otaScraperSiteResult `json:"sites"`
	Errors []string               `json:"errors,omitempty"`
}

// NewOtaScraperProvider returns a provider when FLIGHT_SCRAPER_URL is set (or default docker URL in compose).
func NewOtaScraperProvider() *OtaScraperProvider {
	base := strings.TrimRight(strings.TrimSpace(os.Getenv("FLIGHT_SCRAPER_URL")), "/")
	if base == "" {
		// Allow enabling via explicit provider list without URL only when default docker hostname is intended.
		if !envTruthy(os.Getenv("FLIGHT_SCRAPER_ENABLED")) {
			return nil
		}
		base = defaultOtaScraperURL
	}
	sites := parseOtaScraperSites(os.Getenv("FLIGHT_SCRAPER_SITES"))
	ttl := KiwiEffectiveCacheTTL()
	if ttl <= 0 {
		ttl = kiwiCacheTTL
	}
	c := &otaScraperCache{items: make(map[string]otaScraperCacheEntry), ttl: ttl}
	go func() {
		t := time.NewTicker(2 * time.Minute)
		defer t.Stop()
		for range t.C {
			c.evict()
		}
	}()
	return &OtaScraperProvider{
		baseURL: base,
		sites:   sites,
		token:   strings.TrimSpace(os.Getenv("FLIGHT_SCRAPER_TOKEN")),
		client:  &http.Client{Timeout: otaScraperHTTPTimeout},
		cache:   c,
	}
}

func parseOtaScraperSites(raw string) []string {
	raw = strings.TrimSpace(raw)
	if raw == "" {
		return []string{"kiwi", "skyscanner", "expedia"}
	}
	var out []string
	seen := map[string]bool{}
	for _, p := range strings.Split(raw, ",") {
		s := strings.ToLower(strings.TrimSpace(p))
		if s == "" || seen[s] {
			continue
		}
		seen[s] = true
		out = append(out, s)
	}
	return out
}

func (p *OtaScraperProvider) Name() string { return "multisite" }

func (p *OtaScraperProvider) ScraperBaseURL() string {
	if p == nil {
		return ""
	}
	return p.baseURL
}

func (p *OtaScraperProvider) ConfiguredSites() []string {
	if p == nil {
		return nil
	}
	return append([]string(nil), p.sites...)
}

// Ping checks scraper /health (best-effort).
func (p *OtaScraperProvider) Ping(ctx context.Context) (ok bool, detail string) {
	if p == nil || p.baseURL == "" {
		return false, "not configured"
	}
	req, err := http.NewRequestWithContext(ctx, http.MethodGet, p.baseURL+"/health", nil)
	if err != nil {
		return false, err.Error()
	}
	if p.token != "" {
		req.Header.Set("Authorization", "Bearer "+p.token)
	}
	resp, err := p.client.Do(req)
	if err != nil {
		return false, err.Error()
	}
	defer resp.Body.Close()
	if resp.StatusCode != http.StatusOK {
		raw, _ := io.ReadAll(io.LimitReader(resp.Body, 256))
		return false, fmt.Sprintf("status %d %s", resp.StatusCode, truncateStr(string(raw), 120))
	}
	return true, "ok"
}

func (c *otaScraperCache) get(key string) ([]ProviderResult, bool) {
	c.mu.RLock()
	defer c.mu.RUnlock()
	e, ok := c.items[key]
	if !ok || time.Now().After(e.expires) {
		return nil, false
	}
	return e.results, true
}

func (c *otaScraperCache) set(key string, results []ProviderResult) {
	c.mu.Lock()
	defer c.mu.Unlock()
	c.items[key] = otaScraperCacheEntry{results: results, expires: time.Now().Add(c.ttl)}
}

func (c *otaScraperCache) evict() {
	c.mu.Lock()
	defer c.mu.Unlock()
	now := time.Now()
	for k, e := range c.items {
		if now.After(e.expires) {
			delete(c.items, k)
		}
	}
}

func (p *OtaScraperProvider) cacheKey(req SearchRequest) string {
	cabin := req.CabinPreference
	if cabin == "" {
		cabin = req.CabinClass
	}
	sitesKey := strings.Join(p.sites, "+")
	return fmt.Sprintf("ota|%s|%s|%s|%s|%s|%d|%d|%s|%d|%t",
		strings.ToUpper(req.Origin), strings.ToUpper(req.Destination),
		req.DepartureDate, req.ReturnDate, sitesKey,
		req.Adults, req.Children, cabin, req.Infants, req.IncludeCheckedBag)
}

func (p *OtaScraperProvider) Search(ctx context.Context, req SearchRequest) ([]ProviderResult, error) {
	if p == nil {
		return nil, fmt.Errorf("multisite scraper not configured")
	}
	if IsOpenJaw(req) || HasExtraLegs(req) {
		retO, retD := ResolveReturnAirports(req)
		log.Printf("[MULTISITE] skipping dynamic-destination search (return %s→%s); GF2 handles open-jaw", retO, retD)
		return nil, ErrProviderSkipped
	}
	key := p.cacheKey(req)
	if cached, ok := p.cache.get(key); ok {
		log.Printf("[MULTISITE] cacheHit=true results=%d", len(cached))
		return cached, nil
	}

	body := otaScraperSearchRequest{
		Origin:        strings.ToUpper(strings.TrimSpace(req.Origin)),
		Destination:   strings.ToUpper(strings.TrimSpace(req.Destination)),
		DepartureDate: req.DepartureDate,
		ReturnDate:    req.ReturnDate,
		Adults:        req.Adults,
		Children:      req.Children,
		Infants:       req.Infants,
		Currency:      otaCurrency(req),
		CabinClass:    otaCabin(req),
		CheckedBags:   req.IncludeCheckedBag,
		Sites:         p.sites,
	}
	payload, _ := json.Marshal(body)
	httpReq, err := http.NewRequestWithContext(ctx, http.MethodPost, p.baseURL+"/v1/search", bytes.NewReader(payload))
	if err != nil {
		return nil, err
	}
	httpReq.Header.Set("Content-Type", "application/json")
	if p.token != "" {
		httpReq.Header.Set("Authorization", "Bearer "+p.token)
	}
	resp, err := p.client.Do(httpReq)
	if err != nil {
		return nil, fmt.Errorf("multisite scraper request: %w", err)
	}
	defer resp.Body.Close()
	raw, _ := io.ReadAll(io.LimitReader(resp.Body, 8<<20))
	if resp.StatusCode < 200 || resp.StatusCode >= 300 {
		return nil, fmt.Errorf("multisite scraper status %d: %s", resp.StatusCode, truncateStr(string(raw), 200))
	}
	var parsed otaScraperSearchResponse
	if err := json.Unmarshal(raw, &parsed); err != nil {
		return nil, fmt.Errorf("multisite scraper parse: %w", err)
	}
	results := flattenOtaScraperResponse(parsed, req)
	log.Printf("[MULTISITE] cacheHit=false results=%d sites=%d", len(results), len(parsed.Sites))
	if len(results) == 0 {
		var errs []string
		for _, s := range parsed.Sites {
			if s.Error != "" {
				errs = append(errs, s.Site+": "+s.Error)
			}
		}
		if len(errs) > 0 {
			return nil, fmt.Errorf("multisite scraper: no offers (%s)", strings.Join(errs, "; "))
		}
	}
	if len(results) > 0 {
		p.cache.set(key, results)
	}
	return results, nil
}

func otaCurrency(req SearchRequest) string {
	c := strings.ToUpper(strings.TrimSpace(req.Currency))
	if c == "" {
		return "USD"
	}
	return c
}

func otaCabin(req SearchRequest) string {
	c := strings.ToUpper(strings.TrimSpace(req.CabinPreference))
	if c == "" {
		c = strings.ToUpper(strings.TrimSpace(req.CabinClass))
	}
	if c == "" {
		return "ECONOMY"
	}
	return c
}

func flattenOtaScraperResponse(resp otaScraperSearchResponse, req SearchRequest) []ProviderResult {
	var out []ProviderResult
	for _, site := range resp.Sites {
		if len(site.Offers) == 0 {
			continue
		}
		siteName := strings.ToLower(strings.TrimSpace(site.Site))
		if siteName == "" {
			siteName = "ota"
		}
		part := parseKiwiOffers(site.Offers, req, siteName)
		out = append(out, part...)
	}
	return out
}
