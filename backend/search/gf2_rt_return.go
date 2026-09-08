package search

import (
	"context"
	"log"
	"strings"
)

// enrichNativeRoundTripReturnLegs attaches return-leg schedules to native round-trip
// search hits that only contain outbound data. RapidAPI GF2 (like SerpAPI) often returns
// outbound options in topFlights even when return_date is set; return legs are not included
// until a follow-up request (departure_token) or a separate one-way return search.
func (p *GoogleFlights2Provider) enrichNativeRoundTripReturnLegs(ctx context.Context, req SearchRequest, results []ProviderResult) {
	if p == nil || req.ReturnDate == "" || len(results) == 0 {
		return
	}
	returnDest := strings.ToUpper(strings.TrimSpace(req.Origin))
	if returnDest == "" {
		return
	}

	byArrival := map[string][]int{}
	for i := range results {
		if len(results[i].Legs) >= 2 {
			continue
		}
		arr := providerResultArrivalAirport(results[i])
		if arr == "" {
			arr = strings.ToUpper(strings.TrimSpace(req.Destination))
		}
		byArrival[arr] = append(byArrival[arr], i)
	}
	if len(byArrival) == 0 {
		return
	}

	for retOrigin, indices := range byArrival {
		retReq := req
		retReq.Origin = retOrigin
		retReq.Destination = returnDest
		retReq.DepartureDate = req.ReturnDate
		retReq.ReturnDate = ""
		retReq.ReturnOrigin = ""
		retReq.ReturnDestination = ""
		retReq.ExtraLegs = nil

		retResults, err := p.searchLegCachedWithRetry(ctx, retReq)
		if err != nil || len(retResults) == 0 {
			log.Printf("[GF2_RT] return enrich %s→%s date=%s err=%v results=%d",
				retOrigin, returnDest, req.ReturnDate, err, len(retResults))
			continue
		}
		retLeg := cheapestReturnLeg(retResults)
		if retLeg == nil {
			continue
		}
		for _, i := range indices {
			if len(results[i].Legs) == 1 {
				results[i].Legs = append(results[i].Legs, *retLeg)
			}
		}
		log.Printf("[GF2_RT] return enrich %s→%s attached to %d outbound results", retOrigin, returnDest, len(indices))
	}
}

func providerResultArrivalAirport(r ProviderResult) string {
	if len(r.Legs) == 0 {
		return ""
	}
	segs := r.Legs[0].Segments
	if len(segs) == 0 {
		return ""
	}
	return strings.ToUpper(strings.TrimSpace(segs[len(segs)-1].To))
}

func cheapestReturnLeg(results []ProviderResult) *Leg {
	var best *Leg
	var bestPrice float64
	for i := range results {
		if len(results[i].Legs) == 0 {
			continue
		}
		price := results[i].Price.Amount
		if best == nil || (price > 0 && (bestPrice == 0 || price < bestPrice)) {
			leg := results[i].Legs[0]
			copyLeg := leg
			best = &copyLeg
			bestPrice = price
		}
	}
	return best
}
