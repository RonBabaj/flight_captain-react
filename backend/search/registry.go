package search

import (
	"context"
	"errors"
	"log"
	"os"
	"strings"
	"sync"
	"time"
)

// ErrProviderSkipped marks providers that intentionally did not run for this request.
// SearchAll ignores these when deciding whether the overall search failed.
var ErrProviderSkipped = errors.New("provider skipped for this itinerary type")

// Registry holds enabled flight providers and runs multi-provider search.
type Registry struct {
	providers []Provider
}

// NewRegistryFromEnv builds providers based on FLIGHT_PROVIDERS and credentials.
// Default when unset: googleflights2 (preserves current production behavior).
// Examples:
//
//	FLIGHT_PROVIDERS=googleflights2
//	FLIGHT_PROVIDERS=multisite
//	FLIGHT_PROVIDERS=googleflights2,multisite
func NewRegistryFromEnv() *Registry {
	names := parseProviderNames(os.Getenv("FLIGHT_PROVIDERS"))
	if len(names) == 0 {
		names = []string{"googleflights2"}
	}
	names = FilterProviderNamesForBudget(names)
	if len(names) == 0 {
		log.Printf("[BUDGET] all providers filtered — falling back to googleflights2 only")
		names = []string{"googleflights2"}
	}
	var providers []Provider
	for _, name := range names {
		switch name {
		case "googleflights2", "gf2", "google":
			if p := NewGoogleFlights2Provider(); p != nil {
				providers = append(providers, p)
				log.Printf("[PROVIDERS] enabled: googleflights2")
			} else {
				log.Printf("[PROVIDERS] skipped googleflights2 (not configured)")
			}
		case "multisite", "ota", "metascraper", "kiwi", "kiwi_scraper":
			// Legacy env aliases (kiwi/kiwi_scraper) map to the same CDP multisite provider.
			if p := NewOtaScraperProvider(); p != nil {
				providers = append(providers, p)
				log.Printf("[PROVIDERS] enabled: multisite (sites=%v url=%s)", p.ConfiguredSites(), p.ScraperBaseURL())
			} else {
				log.Printf("[PROVIDERS] skipped multisite (set FLIGHT_SCRAPER_URL or FLIGHT_SCRAPER_ENABLED=1)")
			}
		default:
			log.Printf("[PROVIDERS] unknown provider %q (ignored)", name)
		}
	}
	return &Registry{providers: providers}
}

func parseProviderNames(raw string) []string {
	raw = strings.TrimSpace(raw)
	if raw == "" {
		return nil
	}
	parts := strings.Split(raw, ",")
	var out []string
	seen := map[string]bool{}
	for _, p := range parts {
		n := strings.ToLower(strings.TrimSpace(p))
		if n == "" || seen[n] {
			continue
		}
		seen[n] = true
		out = append(out, n)
	}
	return out
}

// Names returns enabled provider names.
func (r *Registry) Names() []string {
	if r == nil {
		return nil
	}
	var names []string
	for _, p := range r.providers {
		names = append(names, p.Name())
	}
	return names
}

// HasAny reports whether at least one provider is configured.
func (r *Registry) HasAny() bool {
	return r != nil && len(r.providers) > 0
}

// ProviderCount returns how many providers will run in SearchAll.
func (r *Registry) ProviderCount() int {
	if r == nil {
		return 0
	}
	return len(r.providers)
}

// SearchProgressFunc is called as each provider finishes (and once when all are done).
// done/total are 1-based completion counts; stats is a snapshot of finished providers so far.
type SearchProgressFunc func(done, total int, stats []ProviderSearchStats)

// Get returns a provider by name, or nil.
func (r *Registry) Get(name string) Provider {
	if r == nil {
		return nil
	}
	name = strings.ToLower(strings.TrimSpace(name))
	for _, p := range r.providers {
		if strings.EqualFold(p.Name(), name) {
			return p
		}
	}
	return nil
}

// GoogleFlights2 returns the GF2 provider if enabled (for deals/explore paths that still call it directly).
func (r *Registry) GoogleFlights2() *GoogleFlights2Provider {
	p := r.Get("googleflights2")
	if p == nil {
		return nil
	}
	gf, _ := p.(*GoogleFlights2Provider)
	return gf
}

// OtaScraper returns the multisite scraper provider if enabled (partner-panel resolve).
func (r *Registry) OtaScraper() *OtaScraperProvider {
	p := r.Get("multisite")
	if p == nil {
		return nil
	}
	ota, _ := p.(*OtaScraperProvider)
	return ota
}

func isFastProvider(name string) bool {
	return strings.EqualFold(name, "googleflights2")
}

func multisiteSoftTimeout() time.Duration {
	// Safety cap for hung CDP scrapes (optimized path should finish well under this).
	soft := 90 * time.Second
	if raw := strings.TrimSpace(os.Getenv("FLIGHT_SCRAPER_SOFT_TIMEOUT_SEC")); raw != "" {
		if sec, err := time.ParseDuration(raw + "s"); err == nil && sec > 0 {
			soft = sec
		}
	}
	return soft
}

// multisiteSoftTimeoutFor stretches the soft deadline when dynamic destinations
// scrape multiple one-way legs (outbound + extras + return) under one Search call.
func multisiteSoftTimeoutFor(req SearchRequest) time.Duration {
	soft := multisiteSoftTimeout()
	if !IsOpenJaw(req) && !HasExtraLegs(req) {
		return soft
	}
	legs := 2 + len(CompleteExtraLegs(req.ExtraLegs))
	if legs < 2 {
		legs = 2
	}
	scaled := time.Duration(legs) * soft
	// Sequential one-way scrapes for DD/open-jaw need room for each leg; the old
	// 4m clamp starved later legs and left the UI PENDING until the client gave up.
	const maxSoft = 12 * time.Minute
	if scaled > maxSoft {
		return maxSoft
	}
	return scaled
}

// SearchAll queries every enabled provider in parallel, merges results, and never fails the whole
// search solely because one provider failed (unless all fail with zero results).
func (r *Registry) SearchAll(ctx context.Context, req SearchRequest) MultiSearchResult {
	return r.SearchAllWithProgress(ctx, req, nil)
}

// SearchAllWithProgress is SearchAll plus optional per-provider completion callbacks.
func (r *Registry) SearchAllWithProgress(ctx context.Context, req SearchRequest, onProgress SearchProgressFunc) MultiSearchResult {
	out := MultiSearchResult{}
	if r == nil || len(r.providers) == 0 {
		return out
	}
	providers := r.providers
	if req.FastOnly {
		providers = nil
		for _, p := range r.providers {
			if isFastProvider(p.Name()) {
				providers = append(providers, p)
			}
		}
		if len(providers) == 0 {
			return out
		}
	}
	total := len(providers)
	type part struct {
		stats   ProviderSearchStats
		results []ProviderResult
	}
	ch := make(chan part, total)
	var wg sync.WaitGroup
	for _, p := range providers {
		wg.Add(1)
		go func(p Provider) {
			defer wg.Done()
			start := time.Now()
			st := ProviderSearchStats{Provider: p.Name()}
			pctx := ctx
			var cancel context.CancelFunc
			if !isFastProvider(p.Name()) {
				soft := 20 * time.Second
				if strings.EqualFold(p.Name(), "multisite") {
					soft = multisiteSoftTimeoutFor(req)
				}
				// Detach from parent cancel so a short-lived HTTP create (PENDING ack)
				// does not kill the background unified SearchAll scrape.
				pctx, cancel = context.WithTimeout(context.WithoutCancel(ctx), soft)
				defer cancel()
			}
			results, err := p.Search(pctx, req)
			st.DurationMs = time.Since(start).Milliseconds()
			st.Results = len(results)
			if err != nil {
				st.Err = err.Error()
				log.Printf("[SEARCH] provider=%s failed durationMs=%d err=%v", p.Name(), st.DurationMs, err)
			} else {
				log.Printf("[SEARCH] provider=%s ok durationMs=%d results=%d", p.Name(), st.DurationMs, st.Results)
			}
			ch <- part{stats: st, results: results}
		}(p)
	}
	go func() {
		wg.Wait()
		close(ch)
	}()
	for p := range ch {
		out.Stats = append(out.Stats, p.stats)
		out.Results = append(out.Results, p.results...)
		if onProgress != nil {
			snap := append([]ProviderSearchStats(nil), out.Stats...)
			onProgress(len(out.Stats), total, snap)
		}
	}
	out.Results = AttachCanonicalIdentityAll(out.Results)
	out.Results = DedupeProviderResults(out.Results)
	return out
}

// AllFailed returns true when every provider that actually ran reported an error and there are no results.
func (m MultiSearchResult) AllFailed() bool {
	if len(m.Results) > 0 {
		return false
	}
	if len(m.Stats) == 0 {
		return true
	}
	attempted := 0
	failed := 0
	for _, s := range m.Stats {
		if isSkippedProviderErr(s.Err) {
			continue
		}
		attempted++
		if s.Err != "" {
			failed++
		}
	}
	if attempted == 0 {
		return true
	}
	return failed == attempted
}

func isSkippedProviderErr(errMsg string) bool {
	return strings.Contains(errMsg, ErrProviderSkipped.Error())
}

// IsTransientFailure reports whether all provider errors look retryable (rate limit, timeout, gateway).
func (m MultiSearchResult) IsTransientFailure() bool {
	if len(m.Results) > 0 {
		return false
	}
	attempted := 0
	transient := 0
	for _, s := range m.Stats {
		if s.Err == "" || isSkippedProviderErr(s.Err) {
			continue
		}
		attempted++
		if IsTransientSearchErrMsg(s.Err) {
			transient++
		}
	}
	if attempted == 0 {
		return true
	}
	return transient == attempted
}

// IsTransientSearchErrMsg classifies provider error strings that often succeed on retry.
func IsTransientSearchErrMsg(errMsg string) bool {
	if errMsg == "" {
		return false
	}
	msg := strings.ToLower(errMsg)
	if strings.Contains(msg, "rate limit") ||
		strings.Contains(msg, "try again") ||
		strings.Contains(msg, "timed out") ||
		strings.Contains(msg, "timeout") ||
		strings.Contains(msg, "gateway") ||
		strings.Contains(msg, "temporarily unavailable") ||
		strings.Contains(msg, "status 5") {
		return true
	}
	// Empty or blipped GF2 leg responses during open-jaw combine — not a true "no flights" outcome.
	if strings.Contains(msg, "outbound search failed") {
		return true
	}
	return false
}

// FailureMessage returns a user-facing error when SearchAll produced no results.
func (m MultiSearchResult) FailureMessage() string {
	if m.IsTransientFailure() {
		return "Flight search is temporarily unavailable. Please try again."
	}
	for _, s := range m.Stats {
		if s.Err == "" || isSkippedProviderErr(s.Err) {
			continue
		}
		if strings.Contains(s.Err, "no flights found for") {
			return s.Err
		}
		if strings.Contains(s.Err, "outbound search failed") {
			return "No flights found for the outbound leg. Try different dates or airports."
		}
		if strings.Contains(s.Err, "rate limited") {
			return "Flight search is temporarily rate limited. Please try again in a minute."
		}
	}
	for _, s := range m.Stats {
		if s.Err != "" && !isSkippedProviderErr(s.Err) {
			return SanitizeProviderErrorForUser(s.Err)
		}
	}
	return "Flight search is temporarily unavailable. Please try again."
}

// SanitizeProviderErrorForUser maps billing/auth failures to messages safe for end users.
func SanitizeProviderErrorForUser(errMsg string) string {
	if errMsg == "" {
		return "Flight search is temporarily unavailable. Please try again."
	}
	lower := strings.ToLower(errMsg)
	if strings.Contains(lower, "status 403") ||
		strings.Contains(lower, "forbidden") && strings.Contains(lower, "rapid") ||
		strings.Contains(lower, "subscription") && strings.Contains(lower, "rapid") {
		return "Flight search is unavailable right now (provider access). The site operator needs to renew the flight API subscription."
	}
	if strings.Contains(lower, "payment required") {
		return "Extra flight sources are paused (usage limits). Try again later or use a simpler route."
	}
	return errMsg
}
