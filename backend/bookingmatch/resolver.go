package bookingmatch

import (
	"context"
	"fmt"
	"log"
	"strings"
	"time"

	"flightcaptainweb/search"
)

// Resolver runs the booking matcher pipeline for one canonical itinerary.
type Resolver struct {
	Searcher WebSearcher
	Fetcher  *PageFetcher
	Config   Config
}

func NewResolver(cfg Config) *Resolver {
	searcher := NewWebSearcherFromConfig(cfg)
	var fetcher *PageFetcher
	if searcher != nil {
		fetcher = NewPageFetcher(cfg)
	}
	return &Resolver{
		Searcher: searcher,
		Fetcher:  fetcher,
		Config:   cfg,
	}
}

// Match finds verified booking offers for an itinerary via web search.
func (r *Resolver) Match(ctx context.Context, it search.CanonicalItinerary) (*MatchResult, error) {
	start := time.Now()
	cfg := r.Config
	if r == nil {
		return nil, fmt.Errorf("resolver not configured")
	}
	if r.Searcher == nil {
		return nil, fmt.Errorf("web search not configured (set WEB_SEARCH_ENABLED=true and SERPAPI_API_KEY)")
	}

	fp := search.CanonicalItineraryFingerprint(it)
	result := &MatchResult{
		Itinerary:            it,
		ItineraryFingerprint: fp,
	}

	queries := GenerateQueries(it, cfg.MaxQueries)
	result.Queries = queries
	if len(queries) == 0 {
		logMatchEvent(MatchEvent{
			Event:                "match_failed",
			ItineraryFingerprint: fp,
			FailureReason:        "no search queries generated",
			DurationMs:           elapsedMs(start),
		})
		return result, fmt.Errorf("no search queries generated for itinerary")
	}

	for _, q := range queries {
		r.log(result, "query: %s", q)
	}

	seenURL := map[string]struct{}{}
	var candidates []SearchCandidate

	perQueryMax := cfg.MaxCandidates / len(queries)
	if perQueryMax < 3 {
		perQueryMax = 3
	}

	for _, q := range queries {
		if ctx.Err() != nil {
			logMatchEvent(MatchEvent{
				Event:                "match_timeout",
				ItineraryFingerprint: fp,
				Query:                q,
				FailureReason:        ctx.Err().Error(),
				DurationMs:           elapsedMs(start),
			})
			return result, ctx.Err()
		}
		hits, err := r.Searcher.Search(ctx, q, perQueryMax)
		if err != nil {
			r.log(result, "search failed for %q: %v", q, err)
			logMatchEvent(MatchEvent{
				Event:                "search_error",
				ItineraryFingerprint: fp,
				Query:                q,
				FailureReason:        err.Error(),
			})
			continue
		}
		r.log(result, "query %q returned %d candidates", q, len(hits))
		for _, h := range hits {
			if h.URL == "" {
				continue
			}
			if err := ValidateBookingURL(h.URL); err != nil {
				r.log(result, "rejected unsafe url=%s err=%v", h.URL, err)
				logMatchEvent(MatchEvent{
					Event:                "candidate_rejected",
					ItineraryFingerprint: fp,
					CandidateURL:         h.URL,
					RejectionReason:      "unsafe URL",
				})
				continue
			}
			if _, ok := seenURL[h.URL]; ok {
				continue
			}
			seenURL[h.URL] = struct{}{}
			if h.Domain == "" {
				h.Domain = domainFromURL(h.URL)
			}
			candidates = append(candidates, h)
			r.log(result, "candidate url=%s domain=%s title=%q", h.URL, h.Domain, truncateStr(h.Title, 80))
		}
		if len(candidates) >= cfg.MaxCandidates {
			candidates = candidates[:cfg.MaxCandidates]
			break
		}
	}
	result.CandidatesConsidered = len(candidates)

	var offers []BookingOffer
	rejected := 0
	for _, c := range candidates {
		offer := VerifyCandidate(it, c, cfg)
		offers = append(offers, offer)
		r.log(result, "verified url=%s score=%d status=%s reason=%s",
			c.URL, offer.MatchScore, offer.VerificationStatus, offer.RejectionReason)
		if offer.VerificationStatus != StatusVerifiedExact {
			rejected++
			logMatchEvent(MatchEvent{
				Event:                "candidate_rejected",
				ItineraryFingerprint: fp,
				CandidateURL:         c.URL,
				CandidateDomain:      c.Domain,
				MatchScore:           offer.MatchScore,
				VerificationStatus:   string(offer.VerificationStatus),
				RejectionReason:      offer.RejectionReason,
			})
		}
	}

	if r.Fetcher != nil && cfg.MaxPagesToFetch > 0 {
		offers = r.refineWithPageFetch(ctx, it, offers, candidates, cfg, result)
	}

	result.Offers = offers
	result.BestOffer = SelectBestOffer(offers)

	if result.BestOffer != nil {
		logMatchEvent(MatchEvent{
			Event:                "match_success",
			ItineraryFingerprint: fp,
			CandidatesFound:      len(candidates),
			CandidatesRejected:   rejected,
			MatchScore:           result.BestOffer.MatchScore,
			SelectedProvider:     result.BestOffer.Domain,
			SelectedURLType:      string(result.BestOffer.URLType),
			DurationMs:           elapsedMs(start),
		})
		r.log(result, "selected offer url=%s type=%s score=%d price=%v",
			result.BestOffer.URL, result.BestOffer.URLType, result.BestOffer.MatchScore, result.BestOffer.Price)
	} else {
		logMatchEvent(MatchEvent{
			Event:                "match_not_found",
			ItineraryFingerprint: fp,
			CandidatesFound:      len(candidates),
			CandidatesRejected:   rejected,
			FailureReason:        "no verified exact offer",
			DurationMs:           elapsedMs(start),
		})
		r.log(result, "no verified exact offer found among %d candidates", len(candidates))
	}

	return result, nil
}

func (r *Resolver) refineWithPageFetch(ctx context.Context, it search.CanonicalItinerary, offers []BookingOffer, candidates []SearchCandidate, cfg Config, result *MatchResult) []BookingOffer {
	type idxScore struct {
		i int
		s int
	}
	var toFetch []idxScore
	for i, o := range offers {
		if o.VerificationStatus == StatusVerifiedExact {
			continue
		}
		if o.MatchScore >= 50 {
			toFetch = append(toFetch, idxScore{i, o.MatchScore})
		}
	}
	for a := 0; a < len(toFetch); a++ {
		for b := a + 1; b < len(toFetch); b++ {
			if toFetch[b].s > toFetch[a].s {
				toFetch[a], toFetch[b] = toFetch[b], toFetch[a]
			}
		}
	}
	fetched := 0
	candByURL := map[string]SearchCandidate{}
	for _, c := range candidates {
		candByURL[c.URL] = c
	}
	for _, idx := range toFetch {
		if fetched >= cfg.MaxPagesToFetch {
			break
		}
		o := offers[idx.i]
		c := candByURL[o.URL]
		text, err := r.Fetcher.FetchText(ctx, o.URL)
		if err != nil {
			r.log(result, "page fetch failed url=%s err=%v", o.URL, err)
			continue
		}
		fetched++
		c.PageText = text
		newOffer := VerifyCandidate(it, c, cfg)
		r.log(result, "re-verified after fetch url=%s score=%d status=%s", o.URL, newOffer.MatchScore, newOffer.VerificationStatus)
		offers[idx.i] = newOffer
	}
	return offers
}

func (r *Resolver) log(result *MatchResult, format string, args ...interface{}) {
	msg := fmt.Sprintf(format, args...)
	result.Log = append(result.Log, msg)
	log.Printf("[BOOKING_MATCH] %s", msg)
}

func truncateStr(s string, n int) string {
	s = strings.TrimSpace(s)
	if len(s) <= n {
		return s
	}
	return s[:n] + "…"
}

// MatchItinerary is a convenience entry point using default config.
func MatchItinerary(ctx context.Context, it search.CanonicalItinerary) (*MatchResult, error) {
	cfg := DefaultConfig()
	return NewResolver(cfg).Match(ctx, it)
}
