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
	"strconv"
	"strings"
	"sync"
	"time"
)

const (
	// Kiwi + Skyscanner serial CDP scrapes often need >5m on a cold/contended VPS.
	otaScraperHTTPTimeout = 8 * time.Minute
	// Partner-panel resolve is on the Book click path — keep a tighter bound.
	otaPartnerResolveHTTPTimeout = 90 * time.Second
	defaultOtaScraperURL         = "http://flight-scraper:3099"
)

// Process-wide scrape gate so overlapping SearchAll calls cannot flood one Chrome CDP.
var (
	otaScrapeSemOnce sync.Once
	otaScrapeSem     chan struct{}
)

func otaScrapeSemaphore() chan struct{} {
	otaScrapeSemOnce.Do(func() {
		n := 1
		if raw := strings.TrimSpace(os.Getenv("FLIGHT_SCRAPER_MAX_CONCURRENT")); raw != "" {
			if v, err := strconv.Atoi(raw); err == nil && v > 0 {
				n = v
			}
		}
		otaScrapeSem = make(chan struct{}, n)
	})
	return otaScrapeSem
}

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
	ttl := OtaScraperCacheTTL()
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
		// Kiwi + Skyscanner via headed Chrome CDP; Expedia still often bot-walled.
		return []string{"kiwi", "skyscanner"}
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
	// Open-jaw / extra hops: scrape each leg as one-way (same decomposition as GF2)
	// then CombineOneWayBatches — previously we skipped and left DD GF2-only.
	if IsOpenJaw(req) || HasExtraLegs(req) {
		return p.searchDynamicDestination(ctx, req)
	}
	return p.searchSingle(ctx, req, true)
}

// dynamicDestinationOneWayRequests builds outbound (+ extras) + return one-ways for DD/open-jaw.
func dynamicDestinationOneWayRequests(req SearchRequest) []SearchRequest {
	oneWay := func(origin, dest, date string) SearchRequest {
		r := req
		r.Origin = origin
		r.Destination = dest
		r.DepartureDate = date
		r.ReturnDate = ""
		r.ReturnOrigin = ""
		r.ReturnDestination = ""
		r.ExtraLegs = nil
		return r
	}
	extras := CompleteExtraLegs(req.ExtraLegs)
	out := make([]SearchRequest, 0, 2+len(extras))
	out = append(out, oneWay(req.Origin, req.Destination, req.DepartureDate))
	for _, e := range extras {
		out = append(out, oneWay(e.Origin, e.Destination, e.Date))
	}
	retO, retD := ResolveReturnAirports(req)
	out = append(out, oneWay(retO, retD, req.ReturnDate))
	return out
}

func (p *OtaScraperProvider) searchDynamicDestination(ctx context.Context, req SearchRequest) ([]ProviderResult, error) {
	steps := dynamicDestinationOneWayRequests(req)
	if len(steps) == 0 {
		return nil, fmt.Errorf("multisite: empty dynamic-destination steps")
	}
	retO, retD := ResolveReturnAirports(req)
	log.Printf("[MULTISITE] dynamic-destination scrape legs=%d outbound=%s→%s return=%s→%s",
		len(steps), req.Origin, req.Destination, retO, retD)

	sem := otaScrapeSemaphore()
	select {
	case sem <- struct{}{}:
		defer func() { <-sem }()
	case <-ctx.Done():
		return nil, ctx.Err()
	}

	batches := make([][]ProviderResult, 0, len(steps))
	for i, step := range steps {
		label := fmt.Sprintf("%s→%s on %s", step.Origin, step.Destination, step.DepartureDate)
		res, err := p.searchSingle(ctx, step, false)
		if err != nil || len(res) == 0 {
			if err != nil {
				return nil, fmt.Errorf("multisite leg %s: %w", label, err)
			}
			return nil, fmt.Errorf("multisite leg %s: no offers", label)
		}
		log.Printf("[MULTISITE] leg %d/%d %s results=%d", i+1, len(steps), label, len(res))
		batches = append(batches, res)
	}
	combined := CombineOneWayBatches(batches, "otaoj")
	log.Printf("[MULTISITE] dynamic-destination combined=%d from %d legs", len(combined), len(batches))
	return combined, nil
}

// searchSingle runs one classic (or one-way) scrape. acquireSem=false when the caller
// already holds the process-wide CDP scrape gate (dynamic-destination multi-leg).
func (p *OtaScraperProvider) searchSingle(ctx context.Context, req SearchRequest, acquireSem bool) ([]ProviderResult, error) {
	key := p.cacheKey(req)
	if cached, ok := p.cache.get(key); ok {
		log.Printf("[MULTISITE] cacheHit=true results=%d", len(cached))
		return cached, nil
	}

	if acquireSem {
		sem := otaScrapeSemaphore()
		select {
		case sem <- struct{}{}:
			defer func() { <-sem }()
		case <-ctx.Done():
			return nil, ctx.Err()
		}
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
		part := parseOtaOffers(site.Offers, req, siteName)
		out = append(out, part...)
	}
	return out
}

// OtaPartnerResolveRequest asks the scraper to open an OTA booking panel and
// extract seller checkout URLs (GF2 getBookingDetails analogue).
type OtaPartnerResolveRequest struct {
	Site          string                   `json:"site"`
	Origin        string                   `json:"origin"`
	Destination   string                   `json:"destination"`
	DepartureDate string                   `json:"departureDate"`
	ReturnDate    string                   `json:"returnDate,omitempty"`
	Adults        int                      `json:"adults"`
	Children      int                      `json:"children"`
	Infants       int                      `json:"infants"`
	Currency      string                   `json:"currency"`
	CabinClass    string                   `json:"cabinClass"`
	Price         float64                  `json:"price,omitempty"`
	ListingURL    string                   `json:"listingUrl,omitempty"`
	Segments      []map[string]interface{} `json:"segments,omitempty"`
	OutDepHm      string                   `json:"outDepHm,omitempty"`
	InDepHm       string                   `json:"inDepHm,omitempty"`
}

// OtaResolvedPartner is one seller checkout URL from an OTA booking panel.
type OtaResolvedPartner struct {
	URL      string  `json:"url"`
	Provider string  `json:"provider,omitempty"`
	Price    float64 `json:"price,omitempty"`
}

type otaPartnerResolveResponse struct {
	Site      string               `json:"site"`
	Partners  []OtaResolvedPartner `json:"partners"`
	Error     string               `json:"error,omitempty"`
	DurationMs int64               `json:"durationMs,omitempty"`
}

// ResolvePartners opens the OTA booking panel for a scraped itinerary and returns
// partner checkout URLs (same role as GF2 booking_token → getBookingURL).
func (p *OtaScraperProvider) ResolvePartners(ctx context.Context, req OtaPartnerResolveRequest) ([]OtaResolvedPartner, error) {
	if p == nil {
		return nil, fmt.Errorf("multisite scraper not configured")
	}
	site := strings.ToLower(strings.TrimSpace(req.Site))
	if site != "skyscanner" && site != "kiwi" {
		return nil, fmt.Errorf("unsupported OTA site %q", req.Site)
	}
	req.Site = site
	if req.Adults < 1 {
		req.Adults = 1
	}
	if req.Currency == "" {
		req.Currency = "USD"
	}
	if req.CabinClass == "" {
		req.CabinClass = "ECONOMY"
	}

	sem := otaScrapeSemaphore()
	select {
	case sem <- struct{}{}:
		defer func() { <-sem }()
	case <-ctx.Done():
		return nil, ctx.Err()
	}

	payload, err := json.Marshal(req)
	if err != nil {
		return nil, err
	}
	resolveCtx, cancel := context.WithTimeout(ctx, otaPartnerResolveHTTPTimeout)
	defer cancel()
	httpReq, err := http.NewRequestWithContext(resolveCtx, http.MethodPost, p.baseURL+"/v1/resolve-partners", bytes.NewReader(payload))
	if err != nil {
		return nil, err
	}
	httpReq.Header.Set("Content-Type", "application/json")
	if p.token != "" {
		httpReq.Header.Set("Authorization", "Bearer "+p.token)
	}
	client := p.client
	if client == nil || client.Timeout > otaPartnerResolveHTTPTimeout {
		client = &http.Client{Timeout: otaPartnerResolveHTTPTimeout}
	}
	resp, err := client.Do(httpReq)
	if err != nil {
		return nil, fmt.Errorf("ota resolve-partners request: %w", err)
	}
	defer resp.Body.Close()
	raw, _ := io.ReadAll(io.LimitReader(resp.Body, 2<<20))
	if resp.StatusCode < 200 || resp.StatusCode >= 300 {
		return nil, fmt.Errorf("ota resolve-partners status %d: %s", resp.StatusCode, truncateStr(string(raw), 200))
	}
	var parsed otaPartnerResolveResponse
	if err := json.Unmarshal(raw, &parsed); err != nil {
		return nil, fmt.Errorf("ota resolve-partners parse: %w", err)
	}
	var out []OtaResolvedPartner
	for _, partner := range parsed.Partners {
		u := strings.TrimSpace(partner.URL)
		if u == "" || !isLikelyPartnerCheckoutURL(u) {
			continue
		}
		out = append(out, OtaResolvedPartner{
			URL:      u,
			Provider: firstNonEmpty(strings.TrimSpace(partner.Provider), providerFromURL(u)),
			Price:    partner.Price,
		})
	}
	if len(out) == 0 {
		if parsed.Error != "" {
			return nil, fmt.Errorf("ota resolve-partners: %s", parsed.Error)
		}
		return nil, fmt.Errorf("ota resolve-partners: no partner checkouts")
	}
	log.Printf("[MULTISITE] resolve-partners site=%s partners=%d durationMs=%d", site, len(out), parsed.DurationMs)
	return out, nil
}
