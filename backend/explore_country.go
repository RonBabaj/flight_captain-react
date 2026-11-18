package main

import "strings"

// exploreAirportsForCountry returns IATA codes to prioritize when Explore is scoped
// to a country (client countryFilter). The fixed hub pool omits many countries.
var exploreExtraCountryAirports = map[string][]string{
	"JM": {"KIN", "MBJ"},
}

// Minimal primary-airport map for countries users pick as destination (ISO 3166-1 alpha-2).
// Extra airports in exploreExtraCountryAirports override/extend these.
var exploreCountryPrimaryAirport = map[string]string{
	"JM": "KIN",
	"US": "JFK",
	"GB": "LHR",
	"FR": "CDG",
	"DE": "FRA",
	"ES": "MAD",
	"IT": "FCO",
	"GR": "ATH",
	"TR": "IST",
	"AE": "DXB",
	"TH": "BKK",
	"JP": "NRT",
	"AU": "SYD",
	"CA": "YYZ",
	"MX": "MEX",
	"BR": "GRU",
	"AR": "EZE",
	"CO": "BOG",
	"ZA": "JNB",
	"EG": "CAI",
	"IL": "TLV",
}

func exploreAirportsForCountry(countryCode string) []string {
	cc := strings.ToUpper(strings.TrimSpace(countryCode))
	if cc == "" {
		return nil
	}
	seen := map[string]bool{}
	var out []string
	add := func(code string) {
		code = strings.ToUpper(strings.TrimSpace(code))
		if len(code) != 3 || seen[code] {
			return
		}
		seen[code] = true
		out = append(out, code)
	}
	for _, c := range exploreExtraCountryAirports[cc] {
		add(c)
	}
	if p := exploreCountryPrimaryAirport[cc]; p != "" {
		add(p)
	}
	return out
}

func mergeExploreLiveQueuePriority(priority []string, queue []string) []string {
	if len(priority) == 0 {
		return queue
	}
	seen := map[string]bool{}
	var out []string
	for _, d := range priority {
		d = strings.ToUpper(strings.TrimSpace(d))
		if len(d) != 3 || seen[d] {
			continue
		}
		seen[d] = true
		out = append(out, d)
	}
	for _, d := range queue {
		d = strings.ToUpper(strings.TrimSpace(d))
		if len(d) != 3 || seen[d] {
			continue
		}
		seen[d] = true
		out = append(out, d)
	}
	return out
}
