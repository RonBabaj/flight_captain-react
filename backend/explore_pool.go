package main

import (
	"sort"
	"strings"
)

// exploreFixedPool is the only destination set used for Explore / Anywhere (caps upstream API usage).
// ~64 major hubs worldwide; distance ordering uses explore_airport_coords.tsv when available.
var exploreFixedPool = []string{
	// Europe
	"LHR", "CDG", "AMS", "FRA", "MAD", "FCO", "BCN", "LIS", "DUB", "ZRH", "VIE", "CPH", "OSL", "ARN", "HEL",
	"MAN", "EDI", "BER", "MUC", "WAW", "PRG", "BUD", "ATH", "IST",
	// Middle East / Africa
	"DXB", "DOH", "AUH", "CAI", "JED", "TLV", "NBO", "JNB", "CPT", "CMN",
	// South Asia
	"DEL", "BOM", "BLR",
	// East / SE Asia
	"SIN", "BKK", "HKG", "TPE", "NRT", "ICN", "KUL", "MNL", "SGN",
	// China
	"PVG", "PEK", "CAN",
	// Pacific
	"SYD", "MEL", "AKL",
	// North America
	"JFK", "LAX", "SFO", "ORD", "DFW", "ATL", "MIA", "YYZ", "YVR", "MEX", "CUN",
	// Latin America
	"GRU", "EZE", "BOG", "LIM", "SCL",
}

const explorePoolMax = 64

// explorePoolOrderedForOrigin returns exploreFixedPool minus origin and minus any destination in the
// same metro (no NYC→JFK-style rows; people use ground transport within a city).
func explorePoolOrderedForOrigin(origin string) []string {
	o := strings.ToUpper(strings.TrimSpace(origin))
	oMetro := exploreMetroKey(o)
	out := make([]string, 0, len(exploreFixedPool))
	for _, d := range exploreFixedPool {
		if d == o {
			continue
		}
		if exploreMetroKey(d) == oMetro {
			continue
		}
		if len(out) < explorePoolMax {
			out = append(out, d)
		}
	}
	oco, ok := getAirportCoord(o)
	if !ok {
		return out
	}
	type ddist struct {
		code string
		km   float64
	}
	pairs := make([]ddist, 0, len(out))
	for _, code := range out {
		dc, has := getAirportCoord(code)
		km := 1e9
		if has {
			km = haversineKm(oco, dc)
		}
		pairs = append(pairs, ddist{code: code, km: km})
	}
	sort.Slice(pairs, func(i, j int) bool {
		if pairs[i].km != pairs[j].km {
			return pairs[i].km < pairs[j].km
		}
		return pairs[i].code < pairs[j].code
	})
	ordered := make([]string, len(pairs))
	for i := range pairs {
		ordered[i] = pairs[i].code
	}
	return ordered
}
