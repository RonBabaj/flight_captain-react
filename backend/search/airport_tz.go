package search

import (
	"strings"
	"sync"
	"time"
)

// airportTimeZones maps IATA codes to IANA time zones for segment time parsing/display.
// Prefer explicit airport entries; unknown codes fall back to UTC.
var airportTimeZones = map[string]string{
	// Israel / Middle East
	"TLV": "Asia/Jerusalem", "HFA": "Asia/Jerusalem", "ETH": "Asia/Jerusalem", "VDA": "Asia/Jerusalem",
	"AMM": "Asia/Amman", "BEY": "Asia/Beirut", "DXB": "Asia/Dubai", "AUH": "Asia/Dubai", "DOH": "Asia/Qatar",
	"IST": "Europe/Istanbul", "SAW": "Europe/Istanbul", "CAI": "Africa/Cairo",
	// Central Europe
	"VIE": "Europe/Vienna", "SZG": "Europe/Vienna", "INN": "Europe/Vienna", "GRZ": "Europe/Vienna",
	"FRA": "Europe/Berlin", "MUC": "Europe/Berlin", "BER": "Europe/Berlin", "DUS": "Europe/Berlin", "HAM": "Europe/Berlin",
	"ZRH": "Europe/Zurich", "GVA": "Europe/Zurich", "BSL": "Europe/Zurich",
	"CDG": "Europe/Paris", "ORY": "Europe/Paris",
	"AMS": "Europe/Amsterdam",
	"BRU": "Europe/Brussels",
	"CPH": "Europe/Copenhagen",
	"OSL": "Europe/Oslo",
	"ARN": "Europe/Stockholm",
	"HEL": "Europe/Helsinki",
	"WAW": "Europe/Warsaw", "KRK": "Europe/Warsaw",
	"PRG": "Europe/Prague",
	"BUD": "Europe/Budapest",
	"OTP": "Europe/Bucharest",
	"SOF": "Europe/Sofia",
	"ATH": "Europe/Athens",
	"FCO": "Europe/Rome", "MXP": "Europe/Rome", "NAP": "Europe/Rome", "VCE": "Europe/Rome",
	"MAD": "Europe/Madrid", "BCN": "Europe/Madrid",
	"LIS": "Europe/Lisbon",
	"DUB": "Europe/Dublin",
	// UK
	"LHR": "Europe/London", "LGW": "Europe/London", "STN": "Europe/London", "LTN": "Europe/London", "MAN": "Europe/London",
	// Americas
	"JFK": "America/New_York", "EWR": "America/New_York", "LGA": "America/New_York", "BOS": "America/New_York", "MIA": "America/New_York",
	"ORD": "America/Chicago", "DFW": "America/Chicago", "IAH": "America/Chicago",
	"LAX": "America/Los_Angeles", "SFO": "America/Los_Angeles", "SEA": "America/Los_Angeles",
	"YYZ": "America/Toronto", "YVR": "America/Vancouver",
	"GRU": "America/Sao_Paulo", "EZE": "America/Argentina/Buenos_Aires",
	// Asia-Pacific
	"HND": "Asia/Tokyo", "NRT": "Asia/Tokyo",
	"ICN": "Asia/Seoul", "GMP": "Asia/Seoul",
	"PEK": "Asia/Shanghai", "PVG": "Asia/Shanghai", "HKG": "Asia/Hong_Kong", "TPE": "Asia/Taipei",
	"SIN": "Asia/Singapore", "KUL": "Asia/Kuala_Lumpur", "BKK": "Asia/Bangkok",
	"DEL": "Asia/Kolkata", "BOM": "Asia/Kolkata",
	"SYD": "Australia/Sydney", "MEL": "Australia/Melbourne", "BNE": "Australia/Brisbane",
	"AKL": "Pacific/Auckland",
}

var (
	locationCache   = map[string]*time.Location{}
	locationCacheMu sync.RWMutex
)

// AirportLocation returns the IANA location for an IATA airport code (UTC if unknown).
func AirportLocation(airportCode string) *time.Location {
	code := strings.ToUpper(strings.TrimSpace(airportCode))
	if code == "" {
		return time.UTC
	}
	locationCacheMu.RLock()
	if loc, ok := locationCache[code]; ok {
		locationCacheMu.RUnlock()
		return loc
	}
	locationCacheMu.RUnlock()

	tzName := airportTimeZones[code]
	loc := time.UTC
	if tzName != "" {
		if loaded, err := time.LoadLocation(tzName); err == nil {
			loc = loaded
		}
	}

	locationCacheMu.Lock()
	locationCache[code] = loc
	locationCacheMu.Unlock()
	return loc
}

// AirportTimeZone returns the IANA zone name for an airport, or "UTC".
func AirportTimeZone(airportCode string) string {
	code := strings.ToUpper(strings.TrimSpace(airportCode))
	if tz, ok := airportTimeZones[code]; ok && tz != "" {
		return tz
	}
	return "UTC"
}
