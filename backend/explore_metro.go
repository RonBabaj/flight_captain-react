package main

import "strings"

// exploreMetroByIATA maps IATA airport/city codes to a shared metro key so we can drop
// nonsensical "flights" within the same city (e.g. NYC → JFK).
// Codes not listed fall back to uppercase code (each airport is its own metro).
var exploreMetroByIATA = map[string]string{
	// New York
	"NYC": "METRO_NYC", "JFK": "METRO_NYC", "LGA": "METRO_NYC", "EWR": "METRO_NYC", "SWF": "METRO_NYC",
	// London
	"LON": "METRO_LON", "LHR": "METRO_LON", "LGW": "METRO_LON", "STN": "METRO_LON", "LTN": "METRO_LON", "LCY": "METRO_LON", "SEN": "METRO_LON",
	// Paris
	"PAR": "METRO_PAR", "CDG": "METRO_PAR", "ORY": "METRO_PAR", "BVA": "METRO_PAR",
	// Tokyo
	"TYO": "METRO_TYO", "NRT": "METRO_TYO", "HND": "METRO_TYO",
	// Chicago
	"CHI": "METRO_CHI", "ORD": "METRO_CHI", "MDW": "METRO_CHI",
	// Washington DC
	"WAS": "METRO_WAS", "DCA": "METRO_WAS", "IAD": "METRO_WAS", "BWI": "METRO_WAS",
	// Beijing
	"BJS": "METRO_BJS", "PEK": "METRO_BJS", "PKX": "METRO_BJS",
	// Shanghai (Hongqiao SHA + Pudong PVG)
	"SHA": "METRO_SHA", "PVG": "METRO_SHA",
	// Dallas–Fort Worth
	"DFW": "METRO_DFW", "DAL": "METRO_DFW",
	// Houston — IAH in pool; include HOU for origin
	"HOU": "METRO_HOU", "IAH": "METRO_HOU",
	// Miami / South Florida
	"MIA": "METRO_MIA", "FLL": "METRO_MIA", "PBI": "METRO_MIA",
	// SF Bay
	"SFO": "METRO_SFO", "OAK": "METRO_SFO", "SJC": "METRO_SFO",
	// Los Angeles
	"LAX": "METRO_LAX", "BUR": "METRO_LAX", "SNA": "METRO_LAX", "ONT": "METRO_LAX", "LGB": "METRO_LAX",
	// Toronto
	"YTO": "METRO_YTO", "YYZ": "METRO_YTO", "YTZ": "METRO_YTO", "YKZ": "METRO_YTO",
	// Montreal
	"YMQ": "METRO_YMQ", "YUL": "METRO_YMQ", "YMX": "METRO_YMQ",
	// Milan
	"MIL": "METRO_MIL", "MXP": "METRO_MIL", "LIN": "METRO_MIL", "BGY": "METRO_MIL",
	// Rome (FCO in pool)
	"ROM": "METRO_ROM", "FCO": "METRO_ROM", "CIA": "METRO_ROM",
	// Istanbul
	"IST": "METRO_IST", "SAW": "METRO_IST",
	// São Paulo (GRU in pool)
	"SAO": "METRO_SAO", "GRU": "METRO_SAO", "CGH": "METRO_SAO", "VCP": "METRO_SAO",
	// Seoul (ICN in pool)
	"SEL": "METRO_SEL", "ICN": "METRO_SEL", "GMP": "METRO_SEL",
	// Buenos Aires (EZE in pool)
	"BUE": "METRO_BUE", "EZE": "METRO_BUE", "AEP": "METRO_BUE",
	// Mexico City (MEX in pool)
	"MEX": "METRO_MEX", "NLU": "METRO_MEX",
	// Dubai / Sharjah / DWC
	"DXB": "METRO_DXB", "SHJ": "METRO_DXB", "DWC": "METRO_DXB",
	// Oslo (OSL in pool)
	"OSL": "METRO_OSL", "TRF": "METRO_OSL", "RYG": "METRO_OSL",
	// Stockholm (ARN in pool)
	"STO": "METRO_STO", "ARN": "METRO_STO", "BMA": "METRO_STO",
	// Berlin (BER in pool)
	"BER": "METRO_BER", "SXF": "METRO_BER", "TXL": "METRO_BER",
	// Frankfurt (FRA in pool) — single major, Hahn for LCC
	"HHN": "METRO_FRA", "FRA": "METRO_FRA",
	// Munich (MUC in pool)
	"MUC": "METRO_MUC", "AGB": "METRO_MUC",
	// Barcelona (BCN in pool)
	"BCN": "METRO_BCN", "GRO": "METRO_BCN",
	// Madrid (MAD in pool)
	"MAD": "METRO_MAD", "TOJ": "METRO_MAD",
}

func exploreMetroKey(code string) string {
	code = strings.ToUpper(strings.TrimSpace(code))
	if k, ok := exploreMetroByIATA[code]; ok {
		return k
	}
	return code
}
