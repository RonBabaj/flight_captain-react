package bookingmatch

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"os"
	"strconv"
	"strings"
	"time"
)

// Config controls booking matcher behavior.
type Config struct {
	MaxQueries         int
	MaxCandidates      int
	VerifyThreshold    int
	MinPromisingScore  int
	SearchTimeout      time.Duration
	FetchPageTimeout   time.Duration
	MaxPagesToFetch    int
	SerpAPIKey         string
	SerpAPIEngine      string
	Enabled            bool
	PriceNormalizer    PriceNormalizer
}

// DefaultConfig loads configuration from environment variables.
func DefaultConfig() Config {
	key := strings.TrimSpace(os.Getenv("SERPAPI_API_KEY"))
	if key == "" {
		key = strings.TrimSpace(os.Getenv("WEB_SEARCH_API_KEY"))
	}
	enabled := strings.EqualFold(strings.TrimSpace(os.Getenv("WEB_SEARCH_ENABLED")), "true")
	if !enabled && key != "" && !strings.EqualFold(strings.TrimSpace(os.Getenv("WEB_SEARCH_ENABLED")), "false") {
		// Auto-enable when a SerpAPI key is configured unless explicitly disabled.
		enabled = true
	}
	engine := strings.TrimSpace(os.Getenv("SERPAPI_ENGINE"))
	if engine == "" {
		engine = "google"
	}
	maxQ := envInt("WEB_SEARCH_MAX_QUERIES", 8)
	maxC := envInt("WEB_SEARCH_MAX_CANDIDATES", 20)
	threshold := envInt("BOOKING_MATCH_VERIFY_THRESHOLD", 70)
	timeoutSec := envInt("WEB_SEARCH_TIMEOUT_SEC", 15)

	return Config{
		Enabled:           enabled,
		SerpAPIKey:        key,
		SerpAPIEngine:     engine,
		MaxQueries:        maxQ,
		MaxCandidates:     maxC,
		VerifyThreshold:   threshold,
		SearchTimeout:     time.Duration(timeoutSec) * time.Second,
		FetchPageTimeout:  10 * time.Second,
		MaxPagesToFetch:   5,
	}
}

func envInt(key string, def int) int {
	s := strings.TrimSpace(os.Getenv(key))
	if s == "" {
		return def
	}
	v, err := strconv.Atoi(s)
	if err != nil {
		return def
	}
	return v
}

// WebSearcher discovers candidate URLs from web search queries.
type WebSearcher interface {
	Search(ctx context.Context, query string, maxResults int) ([]SearchCandidate, error)
}

// SerpAPISearcher uses SerpAPI (https://serpapi.com) Google search JSON API.
type SerpAPISearcher struct {
	APIKey string
	Engine string
	Client *http.Client
}

func NewSerpAPISearcher(cfg Config) *SerpAPISearcher {
	engine := cfg.SerpAPIEngine
	if engine == "" {
		engine = "google"
	}
	client := &http.Client{Timeout: cfg.SearchTimeout}
	if client.Timeout == 0 {
		client.Timeout = 15 * time.Second
	}
	return &SerpAPISearcher{
		APIKey: cfg.SerpAPIKey,
		Engine: engine,
		Client: client,
	}
}

func (s *SerpAPISearcher) Search(ctx context.Context, query string, maxResults int) ([]SearchCandidate, error) {
	if s == nil || strings.TrimSpace(s.APIKey) == "" {
		return nil, fmt.Errorf("serpapi not configured")
	}
	if maxResults <= 0 {
		maxResults = 10
	}
	params := url.Values{
		"engine": {s.Engine},
		"q":      {query},
		"api_key": {s.APIKey},
		"num":    {strconv.Itoa(maxResults)},
	}
	reqURL := "https://serpapi.com/search.json?" + params.Encode()
	req, err := http.NewRequestWithContext(ctx, http.MethodGet, reqURL, nil)
	if err != nil {
		return nil, err
	}
	client := s.Client
	if client == nil {
		client = http.DefaultClient
	}
	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	body, _ := io.ReadAll(resp.Body)
	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("serpapi status %d: %s", resp.StatusCode, truncate(body, 200))
	}
	return parseSerpAPIResults(body, query)
}

func parseSerpAPIResults(body []byte, query string) ([]SearchCandidate, error) {
	var raw map[string]interface{}
	if err := json.Unmarshal(body, &raw); err != nil {
		return nil, err
	}
	var out []SearchCandidate
	appendResult := func(link, title, snippet string) {
		link = strings.TrimSpace(link)
		if link == "" {
			return
		}
		out = append(out, SearchCandidate{
			URL: link, Title: title, Snippet: snippet,
			Domain: domainFromURL(link), Query: query,
		})
	}
	for _, rAny := range collectSerpAPIResultMaps(raw) {
		link, _ := rAny["link"].(string)
		title, _ := rAny["title"].(string)
		snippet, _ := rAny["snippet"].(string)
		appendResult(link, title, snippet)
	}
	return out, nil
}

func collectSerpAPIResultMaps(raw map[string]interface{}) []map[string]interface{} {
	var out []map[string]interface{}
	for _, key := range []string{"organic_results", "ads", "inline_videos"} {
		items, _ := raw[key].([]interface{})
		for _, rAny := range items {
			if m, ok := rAny.(map[string]interface{}); ok {
				out = append(out, m)
			}
		}
	}
	if box, ok := raw["answer_box"].(map[string]interface{}); ok {
		out = append(out, box)
	}
	return out
}

func truncate(b []byte, n int) string {
	s := string(b)
	if len(s) <= n {
		return s
	}
	return s[:n]
}

// NewWebSearcherFromConfig returns a configured searcher or nil when disabled/unconfigured.
func NewWebSearcherFromConfig(cfg Config) WebSearcher {
	if !cfg.Enabled || cfg.SerpAPIKey == "" {
		return nil
	}
	return NewSerpAPISearcher(cfg)
}

// MockSearcher returns canned results for tests.
type MockSearcher struct {
	Results map[string][]SearchCandidate
	Err     error
}

func (m *MockSearcher) Search(ctx context.Context, query string, maxResults int) ([]SearchCandidate, error) {
	if m.Err != nil {
		return nil, m.Err
	}
	if m.Results == nil {
		return nil, nil
	}
	if rs, ok := m.Results[query]; ok {
		if len(rs) > maxResults && maxResults > 0 {
			return rs[:maxResults], nil
		}
		return rs, nil
	}
	// fallback: return all results from any query
	var all []SearchCandidate
	for _, rs := range m.Results {
		all = append(all, rs...)
	}
	if len(all) > maxResults && maxResults > 0 {
		return all[:maxResults], nil
	}
	return all, nil
}

// PageFetcher optionally fetches page text for top candidates.
type PageFetcher struct {
	Client  *http.Client
	Timeout time.Duration
}

func NewPageFetcher(cfg Config) *PageFetcher {
	t := cfg.FetchPageTimeout
	if t == 0 {
		t = 10 * time.Second
	}
	return &PageFetcher{Client: &http.Client{Timeout: t}, Timeout: t}
}

func (f *PageFetcher) FetchText(ctx context.Context, rawURL string) (string, error) {
	if f == nil || rawURL == "" {
		return "", nil
	}
	req, err := http.NewRequestWithContext(ctx, http.MethodGet, rawURL, nil)
	if err != nil {
		return "", err
	}
	req.Header.Set("User-Agent", "FlyFix-BookingMatcher/1.0")
	client := f.Client
	if client == nil {
		client = &http.Client{Timeout: f.Timeout}
	}
	resp, err := client.Do(req)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()
	if resp.StatusCode != http.StatusOK {
		return "", fmt.Errorf("fetch status %d", resp.StatusCode)
	}
	body, err := io.ReadAll(io.LimitReader(resp.Body, 512*1024))
	if err != nil {
		return "", err
	}
	return stripHTMLTags(string(body)), nil
}

func stripHTMLTags(s string) string {
	// lightweight tag stripper for verification snippets
	var b strings.Builder
	inTag := false
	for _, r := range s {
		switch {
		case r == '<':
			inTag = true
		case r == '>':
			inTag = false
		case !inTag:
			b.WriteRune(r)
		}
	}
	return strings.Join(strings.Fields(b.String()), " ")
}
