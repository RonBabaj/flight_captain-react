package search

import (
	"fmt"
	"sort"
	"strings"
	"time"
)

// ItineraryFingerprint builds a stable key for the physical itinerary (not price/source).
func ItineraryFingerprint(r ProviderResult) string {
	var parts []string
	for _, leg := range r.Legs {
		if len(leg.Segments) == 0 {
			continue
		}
		first := leg.Segments[0]
		last := leg.Segments[len(leg.Segments)-1]
		parts = append(parts,
			strings.ToUpper(first.From),
			strings.ToUpper(last.To),
			roundTimeKey(first.DepartureTime),
			roundTimeKey(last.ArrivalTime),
		)
		for _, s := range leg.Segments {
			parts = append(parts,
				strings.ToUpper(s.MarketingCarrier),
				normalizeFlightNumber(s.FlightNumber),
			)
		}
		parts = append(parts, fmt.Sprintf("stops%d", maxInt(0, len(leg.Segments)-1)))
	}
	if len(parts) == 0 {
		return r.ID
	}
	return strings.Join(parts, "|")
}

func roundTimeKey(t time.Time) string {
	if t.IsZero() {
		return ""
	}
	// 5-minute buckets tolerate minor provider clock differences
	unix := t.Unix()
	rounded := (unix / 300) * 300
	return time.Unix(rounded, 0).UTC().Format(time.RFC3339)
}

func normalizeFlightNumber(n string) string {
	n = strings.ToUpper(strings.TrimSpace(n))
	n = strings.ReplaceAll(n, " ", "")
	return n
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
