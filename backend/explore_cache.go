package main

import (
	"fmt"
	"strings"
	"sync"
	"time"
)

const explorePriceCacheTTL = 24 * time.Hour

type explorePriceCacheEntry struct {
	Price         float64
	DepartureDate string
	UpdatedAt     time.Time
}

var (
	explorePriceCacheMu sync.RWMutex
	explorePriceCache   = make(map[string]explorePriceCacheEntry)
)

func explorePriceCacheKey(origin, dest, currency string, useMonth bool, year, month, durationDays, adults, children int, nonStop bool, dep, ret string) string {
	ns := "0"
	if nonStop {
		ns = "1"
	}
	dest = strings.ToUpper(strings.TrimSpace(dest))
	origin = strings.ToUpper(strings.TrimSpace(origin))
	if useMonth {
		return fmt.Sprintf("v2|%s|%s|%s|%d|%d|%d|%d|%d|%s", origin, dest, currency, year, month, durationDays, adults, children, ns)
	}
	return fmt.Sprintf("v2|%s|%s|%s|%s|%s|%d|%d|%s", origin, dest, currency, strings.TrimSpace(dep), strings.TrimSpace(ret), adults, children, ns)
}

func explorePriceCacheGet(key string) (explorePriceCacheEntry, bool) {
	explorePriceCacheMu.RLock()
	e, ok := explorePriceCache[key]
	explorePriceCacheMu.RUnlock()
	if !ok {
		return explorePriceCacheEntry{}, false
	}
	return e, true
}

func explorePriceCachePut(key string, price float64, departureDate string) {
	explorePriceCacheMu.Lock()
	defer explorePriceCacheMu.Unlock()
	explorePriceCache[key] = explorePriceCacheEntry{
		Price:         price,
		DepartureDate: departureDate,
		UpdatedAt:     time.Now().UTC(),
	}
}

func explorePriceCacheIsFresh(e explorePriceCacheEntry) bool {
	return time.Since(e.UpdatedAt) < explorePriceCacheTTL
}

// exploreEstimateRTPriceUSD returns a rough RT economy fare in USD (indicative only).
func exploreEstimateRTPriceUSD(origin, dest, dep string) float64 {
	o, okO := getAirportCoord(origin)
	d, okD := getAirportCoord(dest)
	km := 1200.0
	if okO && okD {
		km = haversineKm(o, d)
	}
	if km < 200 {
		km = 200
	}
	// Base + distance — tuned for plausible card sorting, not quotes.
	return 90.0 + km*0.14
}

// exploreEstimateInCurrency converts the USD heuristic to the requested display currency.
func exploreEstimateInCurrency(origin, dest, dep, currency string) float64 {
	usd := exploreEstimateRTPriceUSD(origin, dest, dep)
	out, _ := convertPrice(usd, "USD", currency)
	if out <= 0 {
		return usd
	}
	return out
}
