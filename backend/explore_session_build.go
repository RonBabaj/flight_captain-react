package main

import (
	"sort"
	"strings"
)

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
	needsLive := make(map[string]struct{}, len(pool))
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
			// Stale cache: show last price but queue for live refresh.
			rows = append(rows, exploreDestRow{
				destination:   dest,
				price:         ent.Price,
				departureDate: ent.DepartureDate,
				priceSource:   "cached",
			})
			needsLive[dest] = struct{}{}
			continue
		}
		est := exploreEstimateInCurrency(origin, dest, dep, currency)
		rows = append(rows, exploreDestRow{
			destination:   dest,
			price:         est,
			departureDate: dep,
			priceSource:   "estimated",
		})
		needsLive[dest] = struct{}{}
	}
	sort.Slice(rows, func(i, j int) bool {
		if rows[i].price != rows[j].price {
			return rows[i].price < rows[j].price
		}
		return rows[i].destination < rows[j].destination
	})
	// Order live fetches like the UI (cheapest-first by heuristic), not airport-pool order, so early batches improve the top of the list.
	for _, r := range rows {
		if _, ok := needsLive[r.destination]; ok {
			liveQueue = append(liveQueue, r.destination)
			delete(needsLive, r.destination)
		}
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
