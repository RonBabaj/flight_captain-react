package search

import (
	"context"
	"log"
	"os"
	"strings"
	"sync"
	"time"
)

// Registry holds enabled flight providers and runs multi-provider search.
type Registry struct {
	providers []Provider
}

// NewRegistryFromEnv builds providers based on FLIGHT_PROVIDERS and credentials.
// Default when unset: googleflights2 (preserves current production behavior).
// Examples:
//
//	FLIGHT_PROVIDERS=googleflights2
//	FLIGHT_PROVIDERS=kiwi
//	FLIGHT_PROVIDERS=googleflights2,kiwi
func NewRegistryFromEnv() *Registry {
	names := parseProviderNames(os.Getenv("FLIGHT_PROVIDERS"))
	if len(names) == 0 {
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
		case "kiwi", "kiwi_apify", "apify":
			if p := NewKiwiApifyProvider(); p != nil {
				providers = append(providers, p)
				log.Printf("[PROVIDERS] enabled: kiwi")
			} else {
				log.Printf("[PROVIDERS] skipped kiwi (APIFY_API_TOKEN / APIFY_KIWI_ACTOR_ID missing)")
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

// SearchAll queries every enabled provider in parallel, merges results, and never fails the whole
// search solely because one provider failed (unless all fail with zero results).
func (r *Registry) SearchAll(ctx context.Context, req SearchRequest) MultiSearchResult {
	out := MultiSearchResult{}
	if r == nil || len(r.providers) == 0 {
		return out
	}
	type part struct {
		stats   ProviderSearchStats
		results []ProviderResult
	}
	ch := make(chan part, len(r.providers))
	var wg sync.WaitGroup
	for _, p := range r.providers {
		wg.Add(1)
		go func(p Provider) {
			defer wg.Done()
			start := time.Now()
			st := ProviderSearchStats{Provider: p.Name()}
			results, err := p.Search(ctx, req)
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
	wg.Wait()
	close(ch)
	for p := range ch {
		out.Stats = append(out.Stats, p.stats)
		out.Results = append(out.Results, p.results...)
	}
	out.Results = DedupeProviderResults(out.Results)
	return out
}

// AllFailed returns true when every provider reported an error and there are no results.
func (m MultiSearchResult) AllFailed() bool {
	if len(m.Results) > 0 {
		return false
	}
	if len(m.Stats) == 0 {
		return true
	}
	for _, s := range m.Stats {
		if s.Err == "" {
			return false
		}
	}
	return true
}
