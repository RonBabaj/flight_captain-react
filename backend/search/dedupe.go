package search

import (
	"sort"
	"strings"
)

// ItineraryFingerprint builds a stable key for the physical itinerary (not price/source).
func ItineraryFingerprint(r ProviderResult) string {
	if fp := strings.TrimSpace(r.ItineraryFingerprint); fp != "" {
		return fp
	}
	it := BuildCanonicalItinerary(r)
	return CanonicalItineraryFingerprint(it)
}

// DedupeProviderResults keeps the cheapest offer per itinerary fingerprint.
// Different sources for the same itinerary collapse to one result; Metadata.sources lists losers.
func DedupeProviderResults(in []ProviderResult) []ProviderResult {
	if len(in) <= 1 {
		return in
	}
	type entry struct {
		idx int
		fp  string
	}
	best := map[string]int{} // fingerprint -> index in out
	var out []ProviderResult
	for _, r := range in {
		fp := ItineraryFingerprint(r)
		if fp == "" {
			out = append(out, r)
			continue
		}
		if bi, ok := best[fp]; ok {
			// Keep cheaper; note alternate source
			if r.Price.Amount > 0 && (out[bi].Price.Amount <= 0 || r.Price.Amount < out[bi].Price.Amount) {
				prev := out[bi]
				if out[bi].Metadata == nil {
					out[bi].Metadata = map[string]interface{}{}
				}
				alts, _ := out[bi].Metadata["alternateSources"].([]string)
				alts = append(alts, prev.Source)
				r = mergeSelfTransfer(r, prev)
				if r.Metadata == nil {
					r.Metadata = map[string]interface{}{}
				}
				r.Metadata["alternateSources"] = uniqueStrings(append(alts, prev.Source))
				out[bi] = r
			} else {
				if out[bi].Metadata == nil {
					out[bi].Metadata = map[string]interface{}{}
				}
				alts, _ := out[bi].Metadata["alternateSources"].([]string)
				out[bi].Metadata["alternateSources"] = uniqueStrings(append(alts, r.Source))
				out[bi] = mergeSelfTransfer(out[bi], r)
			}
			continue
		}
		best[fp] = len(out)
		out = append(out, r)
	}
	sort.SliceStable(out, func(i, j int) bool {
		return out[i].Price.Amount < out[j].Price.Amount
	})
	return out
}

func mergeSelfTransfer(a, b ProviderResult) ProviderResult {
	if b.SelfTransfer {
		a.SelfTransfer = true
	}
	return a
}

func uniqueStrings(in []string) []string {
	seen := map[string]bool{}
	var out []string
	for _, s := range in {
		s = strings.TrimSpace(s)
		if s == "" || seen[s] {
			continue
		}
		seen[s] = true
		out = append(out, s)
	}
	return out
}

func maxInt(a, b int) int {
	if a > b {
		return a
	}
	return b
}

// TotalStops counts stops across legs.
func TotalStops(r ProviderResult) int {
	stops := 0
	for _, leg := range r.Legs {
		if len(leg.Segments) > 0 {
			stops += len(leg.Segments) - 1
		}
	}
	return stops
}
