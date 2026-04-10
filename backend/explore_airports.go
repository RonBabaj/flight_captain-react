package main

import (
	_ "embed"
	"strings"
)

// Full IATA list generated from frontend/src/data/airports.ts (same dictionary as autocomplete).
//
//go:embed data/explore_airport_codes.txt
var exploreAirportCodesRaw string

func exploreAllAirportCodes() []string {
	lines := strings.Split(strings.TrimSpace(exploreAirportCodesRaw), "\n")
	out := make([]string, 0, len(lines))
	for _, line := range lines {
		c := strings.TrimSpace(strings.ToUpper(line))
		if len(c) == 3 {
			out = append(out, c)
		}
	}
	return out
}
