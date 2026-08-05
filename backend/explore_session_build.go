package main

import (
	"sort"
	"strings"
)

type exploreLiveCandidate struct {
	dest string
	est  float64
}

func exploreBuildRowsAndQueue(
	origin, dep, ret string,
	useMonth bool,
	year, month, duration int,
	currency string,
	adults, children int,
	nonStop bool,
) (rows []exploreDestRow, liveQueue []string) {
	pool := explorePoolOrderedForOrigin(origin)
	rows = make([]exploreDestRow, 0, len(pool))
	needLive := make([]exploreLiveCandidate, 0, len(pool))
	for _, dest := range pool {
		dest = strings.ToUpper(strings.TrimSpace(dest))
		key := explorePriceCacheKey(origin, dest, currency, useMonth, year, month, duration, adults, children, nonStop, dep, ret)
		ent, ok := explorePriceCacheGet(key)
		if ok && explorePriceCacheIsFresh(ent) {
			rows = append(rows, exploreDestRow{
				destination:   dest,
				price:         ent.Price,
				departureDate: ent.DepartureDate,
				priceSource:   "cached",
			})
			continue
		}
		if ok {
			// Stale cache: show last known real price, but still refresh live.
			rows = append(rows, exploreDestRow{
				destination:   dest,
				price:         ent.Price,
				departureDate: ent.DepartureDate,
				priceSource:   "cached",
			})
			needLive = append(needLive, exploreLiveCandidate{
				dest: dest,
				est:  ent.Price,
			})
			continue
		}
		// No placeholder estimate cards — only queue for live GF2 so the UI grows with real prices.
		needLive = append(needLive, exploreLiveCandidate{
			dest: dest,
			est:  exploreEstimateInCurrency(origin, dest, dep, currency),
		})
	}
	sort.Slice(rows, func(i, j int) bool {
		if rows[i].price != rows[j].price {
			return rows[i].price < rows[j].price
		}
		return rows[i].destination < rows[j].destination
	})
	// Cheapest-heuristic first so early live batches fill the top of the list.
	sort.Slice(needLive, func(i, j int) bool {
		if needLive[i].est != needLive[j].est {
			return needLive[i].est < needLive[j].est
		}
		return needLive[i].dest < needLive[j].dest
	})
	liveQueue = make([]string, 0, len(needLive))
	for _, c := range needLive {
		liveQueue = append(liveQueue, c.dest)
	}
	return rows, liveQueue
}

func mergeExplorePriceRows(existing []exploreDestRow, incoming []exploreDestRow) []exploreDestRow {
	rank := func(s string) int {
		switch s {
		case "live":
			return 3
		case "cached":
			return 2
		case "estimated":
			return 1
		default:
			return 0
		}
	}
	m := make(map[string]exploreDestRow, len(existing)+len(incoming))
	for _, r := range existing {
		m[r.destination] = r
	}
	for _, r := range incoming {
		old, ok := m[r.destination]
		if !ok {
			m[r.destination] = r
			continue
		}
		if rank(r.priceSource) > rank(old.priceSource) {
			m[r.destination] = r
			continue
		}
		if rank(r.priceSource) == rank(old.priceSource) && r.price < old.price {
			m[r.destination] = r
		}
	}
	out := make([]exploreDestRow, 0, len(m))
	for _, r := range m {
		out = append(out, r)
	}
	sort.Slice(out, func(i, j int) bool {
		if out[i].price != out[j].price {
			return out[i].price < out[j].price
		}
		return out[i].destination < out[j].destination
	})
	return out
}
