package search

import "strings"

// gf2CountryCodeForRequest picks GF2 market country for pricing/availability (RapidAPI).
// TLV and Hebrew locale should use IL — US-only market often returns empty for Israel-origin routes.
func gf2CountryCodeForRequest(req SearchRequest) string {
	loc := strings.ToUpper(strings.TrimSpace(req.Locale))
	switch {
	case strings.HasPrefix(loc, "HE"), strings.HasSuffix(loc, "_IL"), loc == "IL":
		return "IL"
	case strings.HasPrefix(loc, "RU"):
		return "RU"
	case strings.HasPrefix(loc, "DE"):
		return "DE"
	case strings.HasPrefix(loc, "FR"):
		return "FR"
	case strings.HasPrefix(loc, "GB"), strings.HasPrefix(loc, "EN_GB"):
		return "GB"
	}
	orig := strings.ToUpper(strings.TrimSpace(req.Origin))
	if orig == "TLV" || orig == "ETH" || orig == "HFA" || orig == "VDA" || orig == "RPN" {
		return "IL"
	}
	if strings.HasPrefix(orig, "COUNTRY:IL") {
		return "IL"
	}
	return "US"
}

func gf2LanguageCodeForRequest(req SearchRequest) string {
	loc := strings.ToLower(strings.TrimSpace(req.Locale))
	if loc == "" {
		if gf2CountryCodeForRequest(req) == "IL" {
			return "he-IL"
		}
		return "en-US"
	}
	if strings.HasPrefix(loc, "he") {
		return "he-IL"
	}
	if strings.HasPrefix(loc, "ru") {
		return "ru-RU"
	}
	return "en-US"
}