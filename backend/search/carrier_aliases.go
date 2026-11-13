package search

import "strings"

// airlineNameToIATA maps common scraped display names → IATA codes.
// Keys are uppercased alphanumeric-only (spaces/punctuation stripped).
var airlineNameToIATA = map[string]string{
	"ISRAIR":               "6H",
	"ISRAIRAIRLINES":       "6H",
	"ELAL":                 "LY",
	"ELALISRAELAIRLINES":   "LY",
	"ARKIA":                "IZ",
	"WIZZAIR":              "W6",
	"WIZZAIRMALTA":         "W4",
	"WIZZAIRUK":            "W9",
	"TUSAIRWAYS":           "U8",
	"SMARTWINGS":           "QS",
	"AUSTRIAN":             "OS",
	"AUSTRIANAIRLINES":     "OS",
	"AUSTRIANA":            "OS",
	"LUFTHANSA":            "LH",
	"SWISS":                "LX",
	"AIRFRANCE":            "AF",
	"KLM":                  "KL",
	"BRITISHAIRWAYS":       "BA",
	"RYANAIR":              "FR",
	"EASYJET":              "U2",
	"VUELING":              "VY",
	"PEGASUS":              "PC",
	"PEGASUSAIRLINES":      "PC",
	"TURKISHAIRLINES":      "TK",
	"AEGEAN":               "A3",
	"AEGEANAIRLINES":       "A3",
	"LOT":                  "LO",
	"LOTPOLISHAIRLINES":    "LO",
	"ITA":                  "AZ",
	"ITAAIRWAYS":           "AZ",
	"TRANSAVIA":            "HV",
	"BLUEBIRDAIRWAYS":      "BZ",
	"ARKIAISRAELIAIRLINES": "IZ",
}

func airlineAliasKey(raw string) string {
	var b strings.Builder
	for _, r := range strings.ToUpper(strings.TrimSpace(raw)) {
		if (r >= 'A' && r <= 'Z') || (r >= '0' && r <= '9') {
			b.WriteRune(r)
		}
	}
	return b.String()
}

// LooksLikeAirportLabel is true for scraped alt/aria text that names an airport
// (e.g. "David-Ben-Gurion International") rather than an airline.
func LooksLikeAirportLabel(raw string) bool {
	s := strings.ToLower(strings.TrimSpace(raw))
	if s == "" {
		return false
	}
	if strings.Contains(s, "airport") || strings.Contains(s, "aéroport") || strings.Contains(s, "aeroport") {
		return true
	}
	if strings.Contains(s, "international") || strings.Contains(s, "internationale") {
		return true
	}
	if strings.Contains(s, "ben-gurion") || strings.Contains(s, "ben gurion") || strings.Contains(s, "ben-gourion") {
		return true
	}
	if strings.Contains(s, "terminal") || strings.Contains(s, "flughafen") {
		return true
	}
	return false
}

// LookupAirlineIATA returns a 2-char IATA code when raw is already a code or a
// known airline display name (e.g. "Israir" → "6H"). Unknown / airport-like
// labels return "" — never echo them as fake carrier codes (that produced
// "David-Ben-Gurion International" in the Flight details UI).
func LookupAirlineIATA(raw string) string {
	s := strings.ToUpper(strings.TrimSpace(raw))
	if s == "" {
		return ""
	}
	if LooksLikeAirportLabel(raw) {
		return ""
	}
	if isIATACarrierCode(s) {
		return s
	}
	key := airlineAliasKey(s)
	if code, ok := airlineNameToIATA[key]; ok {
		return code
	}
	// "WIZZ AIR MALTA logo" / trailing junk from scraper alt text.
	for name, code := range airlineNameToIATA {
		if len(name) >= 5 && strings.HasPrefix(key, name) {
			return code
		}
	}
	// Unknown long display names are not IATA codes.
	return ""
}
