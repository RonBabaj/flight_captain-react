package search

import "strings"

// airlineNameToIATA maps common scraped display names → IATA codes.
// Keys are uppercased alphanumeric-only (spaces/punctuation stripped).
var airlineNameToIATA = map[string]string{
	"ISRAIR":              "6H",
	"ISRAIRAIRLINES":      "6H",
	"ELAL":                "LY",
	"ELALISRAELAIRLINES":  "LY",
	"ARKIA":               "IZ",
	"WIZZAIR":             "W6",
	"WIZZAIRMALTA":        "W4",
	"WIZZAIRUK":           "W9",
	"TUSAIRWAYS":          "U8",
	"SMARTWINGS":          "QS",
	"AUSTRIAN":            "OS",
	"AUSTRIANAIRLINES":    "OS",
	"LUFTHANSA":           "LH",
	"SWISS":               "LX",
	"AIRFRANCE":           "AF",
	"KLM":                 "KL",
	"BRITISHAIRWAYS":      "BA",
	"RYANAIR":             "FR",
	"EASYJET":             "U2",
	"VUELING":             "VY",
	"PEGASUS":             "PC",
	"PEGASUSAIRLINES":     "PC",
	"TURKISHAIRLINES":     "TK",
	"AEGEAN":              "A3",
	"AEGEANAIRLINES":      "A3",
	"LOT":                 "LO",
	"LOTPOLISHAIRLINES":   "LO",
	"ITA":                 "AZ",
	"ITAAIRWAYS":          "AZ",
	"TRANSAVIA":           "HV",
	"BLUEBIRDAIRWAYS":     "BZ",
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

// LookupAirlineIATA returns a 2-char IATA code when raw is already a code or a
// known airline display name (e.g. "Israir" → "6H"). Otherwise returns the
// uppercased trimmed input.
func LookupAirlineIATA(raw string) string {
	s := strings.ToUpper(strings.TrimSpace(raw))
	if s == "" {
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
	return s
}
