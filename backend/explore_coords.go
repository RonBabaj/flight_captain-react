package main

import (
	_ "embed"
	"math"
	"strconv"
	"strings"
	"sync"
)

//go:embed data/explore_airport_coords.tsv
var exploreAirportCoordsTSV string

type airportCoord struct {
	lat, lon float64
}

var (
	exploreCoordsOnce sync.Once
	exploreCoordsMap  map[string]airportCoord
)

func initExploreCoordsMap() {
	exploreCoordsMap = make(map[string]airportCoord)
	for _, line := range strings.Split(strings.TrimSpace(exploreAirportCoordsTSV), "\n") {
		line = strings.TrimSpace(line)
		if line == "" {
			continue
		}
		parts := strings.Split(line, "\t")
		if len(parts) != 3 {
			continue
		}
		code := strings.ToUpper(strings.TrimSpace(parts[0]))
		lat, err1 := strconv.ParseFloat(parts[1], 64)
		lon, err2 := strconv.ParseFloat(parts[2], 64)
		if err1 != nil || err2 != nil {
			continue
		}
		exploreCoordsMap[code] = airportCoord{lat: lat, lon: lon}
	}
}

func getAirportCoord(code string) (airportCoord, bool) {
	exploreCoordsOnce.Do(initExploreCoordsMap)
	c, ok := exploreCoordsMap[strings.ToUpper(strings.TrimSpace(code))]
	return c, ok
}

// haversineKm is great-circle distance on the WGS84 mean sphere (accurate enough for route prioritization).
func haversineKm(a, b airportCoord) float64 {
	const earthRadiusKm = 6371.0
	lat1 := a.lat * math.Pi / 180
	lat2 := b.lat * math.Pi / 180
	dlat := (b.lat - a.lat) * math.Pi / 180
	dlon := (b.lon - a.lon) * math.Pi / 180
	x := math.Sin(dlat/2)*math.Sin(dlat/2) + math.Cos(lat1)*math.Cos(lat2)*math.Sin(dlon/2)*math.Sin(dlon/2)
	return 2 * earthRadiusKm * math.Asin(math.Min(1, math.Sqrt(x)))
}
