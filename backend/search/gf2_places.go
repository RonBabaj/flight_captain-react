package search

import (
	"sort"
	"strings"
)

// gf2MetroByIATA maps IATA airport/city codes to a shared metro key (same data as explore_metro.go).
// RapidAPI GF2 accepts one IATA code per request — metro city codes need parallel per-airport searches.
var gf2MetroByIATA = map[string]string{
	"NYC": "METRO_NYC", "JFK": "METRO_NYC", "LGA": "METRO_NYC", "EWR": "METRO_NYC", "SWF": "METRO_NYC",
	"LON": "METRO_LON", "LHR": "METRO_LON", "LGW": "METRO_LON", "STN": "METRO_LON", "LTN": "METRO_LON", "LCY": "METRO_LON", "SEN": "METRO_LON",
	"PAR": "METRO_PAR", "CDG": "METRO_PAR", "ORY": "METRO_PAR", "BVA": "METRO_PAR",
	"TYO": "METRO_TYO", "NRT": "METRO_TYO", "HND": "METRO_TYO",
	"CHI": "METRO_CHI", "ORD": "METRO_CHI", "MDW": "METRO_CHI",
	"WAS": "METRO_WAS", "DCA": "METRO_WAS", "IAD": "METRO_WAS", "BWI": "METRO_WAS",
	"BJS": "METRO_BJS", "PEK": "METRO_BJS", "PKX": "METRO_BJS",
	"SHA": "METRO_SHA", "PVG": "METRO_SHA",
	"DFW": "METRO_DFW", "DAL": "METRO_DFW",
	"HOU": "METRO_HOU", "IAH": "METRO_HOU",
	"MIA": "METRO_MIA", "FLL": "METRO_MIA", "PBI": "METRO_MIA",
	"SFO": "METRO_SFO", "OAK": "METRO_SFO", "SJC": "METRO_SFO",
	"LAX": "METRO_LAX", "BUR": "METRO_LAX", "SNA": "METRO_LAX", "ONT": "METRO_LAX", "LGB": "METRO_LAX",
	"YTO": "METRO_YTO", "YYZ": "METRO_YTO", "YTZ": "METRO_YTO", "YKZ": "METRO_YTO",
	"YMQ": "METRO_YMQ", "YUL": "METRO_YMQ", "YMX": "METRO_YMQ",
	"MIL": "METRO_MIL", "MXP": "METRO_MIL", "LIN": "METRO_MIL", "BGY": "METRO_MIL",
	"ROM": "METRO_ROM", "FCO": "METRO_ROM", "CIA": "METRO_ROM",
	"IST": "METRO_IST", "SAW": "METRO_IST",
	"SAO": "METRO_SAO", "GRU": "METRO_SAO", "CGH": "METRO_SAO", "VCP": "METRO_SAO",
	"SEL": "METRO_SEL", "ICN": "METRO_SEL", "GMP": "METRO_SEL",
	"BUE": "METRO_BUE", "EZE": "METRO_BUE", "AEP": "METRO_BUE",
	"MEX": "METRO_MEX", "NLU": "METRO_MEX",
	"DXB": "METRO_DXB", "SHJ": "METRO_DXB", "DWC": "METRO_DXB",
	"OSL": "METRO_OSL", "TRF": "METRO_OSL", "RYG": "METRO_OSL",
	"STO": "METRO_STO", "ARN": "METRO_STO", "BMA": "METRO_STO",
	"BER": "METRO_BER", "SXF": "METRO_BER", "TXL": "METRO_BER",
	"HHN": "METRO_FRA", "FRA": "METRO_FRA",
	"MUC": "METRO_MUC", "AGB": "METRO_MUC",
	"BCN": "METRO_BCN", "GRO": "METRO_BCN",
	"MAD": "METRO_MAD", "TOJ": "METRO_MAD",
}

// gf2MetroCityCodes are metro identifiers that GF2 does not accept as airport IDs.
var gf2MetroCityCodes = map[string]bool{
	"NYC": true, "LON": true, "PAR": true, "TYO": true, "CHI": true, "WAS": true,
	"BJS": true, "YTO": true, "YMQ": true, "MIL": true, "ROM": true, "SAO": true,
	"SEL": true, "BUE": true, "STO": true, "OSL": true,
}

// gf2CityToAirport maps city codes with a single primary airport (cityCode != airportCode).
var gf2CityToAirport = map[string]string{
	"THR": "IKA", "IZM": "ADB", "ANK": "ESB", "ALY": "HBE", "CAS": "CMN", "KAM": "EBB",
	"TCI": "TFS", "REY": "KEF", "BUH": "OTP", "IEV": "KBP", "BAK": "GYD", "NIC": "LCA",
	"PAF": "PFO", "JKT": "CGK", "HCM": "SGN", "SIA": "XIY", "SPK": "CTS", "ORL": "MCO",
	"DTT": "DTW", "MKC": "MCI", "YEA": "YEG",
}

var gf2MetroAirports map[string][]string

func init() {
	members := map[string][]string{}
	for code, metro := range gf2MetroByIATA {
		if gf2MetroCityCodes[code] {
			continue
		}
		members[metro] = append(members[metro], code)
	}
	gf2MetroAirports = make(map[string][]string, len(members))
	for metro, airports := range members {
		sort.Strings(airports)
		gf2MetroAirports[metro] = airports
	}
}

func gf2MetroKey(code string) string {
	code = strings.ToUpper(strings.TrimSpace(code))
	if k, ok := gf2MetroByIATA[code]; ok {
		return k
	}
	return code
}

// GF2SearchAirports returns the list of single IATA codes to query for a place.
// Metro city codes (TYO, NYC) expand to all airports in the metro; specific airports stay as-is.
func GF2SearchAirports(code string) []string {
	code = strings.ToUpper(strings.TrimSpace(code))
	if code == "" {
		return nil
	}
	if gf2MetroCityCodes[code] {
		metro := gf2MetroKey(code)
		if airports, ok := gf2MetroAirports[metro]; ok && len(airports) > 0 {
			out := append([]string(nil), airports...)
			return out
		}
	}
	if airport, ok := gf2CityToAirport[code]; ok {
		return []string{airport}
	}
	return []string{code}
}

// ResolveGF2PlaceCode returns a single IATA for callers that cannot fan out (legacy).
func ResolveGF2PlaceCode(code string) string {
	airports := GF2SearchAirports(code)
	if len(airports) == 0 {
		return strings.ToUpper(strings.TrimSpace(code))
	}
	return airports[0]
}
