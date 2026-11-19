package search

import (
	"bufio"
	_ "embed"
	"os"
	"strconv"
	"strings"
	"sync"
)

//go:embed data/country_airports.tsv
var countryAirportsTSV string

const countryDestPrefix = "COUNTRY:"

var (
	countryAirportsOnce sync.Once
	countryAirports     map[string][]string
)

func loadCountryAirports() {
	countryAirports = make(map[string][]string)
	sc := bufio.NewScanner(strings.NewReader(countryAirportsTSV))
	for sc.Scan() {
		line := strings.TrimSpace(sc.Text())
		if line == "" || strings.HasPrefix(line, "#") {
			continue
		}
		parts := strings.SplitN(line, "\t", 2)
		if len(parts) != 2 {
			continue
		}
		cc := strings.ToUpper(strings.TrimSpace(parts[0]))
		var codes []string
		for _, raw := range strings.Split(parts[1], ",") {
			c := strings.ToUpper(strings.TrimSpace(raw))
			if len(c) == 3 {
				codes = append(codes, c)
			}
		}
		if cc != "" && len(codes) > 0 {
			countryAirports[cc] = codes
		}
	}
}

func airportsForCountry(cc string) []string {
	countryAirportsOnce.Do(loadCountryAirports)
	cc = strings.ToUpper(strings.TrimSpace(cc))
	return append([]string(nil), countryAirports[cc]...)
}

func countrySearchMaxAirports() int {
	const defaultMax = 6
	raw := strings.TrimSpace(os.Getenv("COUNTRY_SEARCH_MAX_AIRPORTS"))
	if raw == "" {
		return defaultMax
	}
	n, err := strconv.Atoi(raw)
	if err != nil || n < 1 {
		return defaultMax
	}
	if n > 20 {
		return 20
	}
	return n
}

func expandCountryDestination(code string) []string {
	cc := strings.TrimPrefix(strings.ToUpper(strings.TrimSpace(code)), countryDestPrefix)
	list := airportsForCountry(cc)
	if len(list) == 0 {
		return nil
	}
	max := countrySearchMaxAirports()
	if len(list) > max {
		list = append([]string(nil), list[:max]...)
	}
	return list
}

// ExpandSearchDestinations returns airport IATA codes to query for a destination field.
func ExpandSearchDestinations(code string) []string {
	code = strings.ToUpper(strings.TrimSpace(code))
	if strings.HasPrefix(code, countryDestPrefix) {
		return expandCountryDestination(code)
	}
	return GF2SearchAirports(code)
}