package main

// Extra airline search templates for airline-direct prefill (route + dates; fare not guaranteed).
// Added after core registry init in affiliate.go.
func registerExtraAirlineProviders() {
	extra := map[string]*Provider{
		"SN": {
			Code:   "SN",
			Name:   "Brussels Airlines",
			Type:   ProviderTypeAirline,
			URLTpl: "https://www.brusselsairlines.com/de/en/booking/flight-ticket.html?from={origin}&to={destination}&outbound={departureDate}&inbound={returnDate}&aff_id={aff_id}&subid={subid}",
		},
		"EW": {
			Code:   "EW",
			Name:   "Eurowings",
			Type:   ProviderTypeAirline,
			URLTpl: "https://www.eurowings.com/en/booking/flights/select.html?LANG=en&origin={origin}&destination={destination}&outboundDate={departureDate}&returnDate={returnDate}",
		},
		"A3": {
			Code:   "A3",
			Name:   "Aegean Airlines",
			Type:   ProviderTypeAirline,
			URLTpl: "https://en.aegeanair.com/plan/booking/flights/?Origin={origin}&Destination={destination}&DepartureDate={departureDate}&ReturnDate={returnDate}&aff_id={aff_id}&subid={subid}",
		},
		"IB": {
			Code:   "IB",
			Name:   "Iberia",
			Type:   ProviderTypeAirline,
			URLTpl: "https://www.iberia.com/flights/?market=EN&language=en&appliesOMB=false&splitEndDate=false&initializedOMB=true&flexible=true&TRIP_TYPE=2&BEGINNING_DM={departureDate}&BEGINNING_CITY_1={origin}&END_CITY_1={destination}&RETURN_CITY_1={origin}&RETURN_DM={returnDate}&aff_id={aff_id}&subid={subid}",
		},
		"VY": {
			Code:   "VY",
			Name:   "Vueling",
			Type:   ProviderTypeAirline,
			URLTpl: "https://tickets.vueling.com/Search.aspx?Culture=en-GB&origin={origin}&destination={destination}&outboundDate={departureDate}&returnDate={returnDate}",
		},
		"SK": {
			Code:   "SK",
			Name:   "SAS",
			Type:   ProviderTypeAirline,
			URLTpl: "https://www.flysas.com/en/book/flights/?from={origin}&to={destination}&departure={departureDate}&return={returnDate}&aff_id={aff_id}&subid={subid}",
		},
		"AY": {
			Code:   "AY",
			Name:   "Finnair",
			Type:   ProviderTypeAirline,
			URLTpl: "https://www.finnair.com/en/booking?origin={origin}&destination={destination}&departureDate={departureDate}&returnDate={returnDate}&aff_id={aff_id}&subid={subid}",
		},
		"DY": {
			Code:   "DY",
			Name:   "Norwegian",
			Type:   ProviderTypeAirline,
			URLTpl: "https://www.norwegian.com/uk/ipr/campaign/start?Currency=GBP&D_City={origin}&A_City={destination}&D_Month={departureDate}&R_Month={returnDate}&TripType=2&aff_id={aff_id}&subid={subid}",
		},
		"QR": {
			Code:   "QR",
			Name:   "Qatar Airways",
			Type:   ProviderTypeAirline,
			URLTpl: "https://www.qatarairways.com/app/booking/flight-selection?widget=QR&searchType=F&addTaxToFare=Y&minPurTime=0&bookingClass=E&tripType=R&fromStation={origin}&toStation={destination}&departing={departureDate}&returning={returnDate}&aff_id={aff_id}&subid={subid}",
		},
		"EY": {
			Code:   "EY",
			Name:   "Etihad Airways",
			Type:   ProviderTypeAirline,
			URLTpl: "https://www.etihad.com/en/book/flights?origin={origin}&destination={destination}&departure={departureDate}&return={returnDate}&aff_id={aff_id}&subid={subid}",
		},
		"AC": {
			Code:   "AC",
			Name:   "Air Canada",
			Type:   ProviderTypeAirline,
			URLTpl: "https://www.aircanada.com/aeroplan/redeem/availability/outbound?org1={origin}&dest1={destination}&departure1={departureDate}&return={returnDate}&aff_id={aff_id}&subid={subid}",
		},
		"TP": {
			Code:   "TP",
			Name:   "TAP Air Portugal",
			Type:   ProviderTypeAirline,
			URLTpl: "https://www.flytap.com/en-us/book/flights?origin={origin}&destination={destination}&departure={departureDate}&return={returnDate}&aff_id={aff_id}&subid={subid}",
		},
		"AZ": {
			Code:   "AZ",
			Name:   "ITA Airways",
			Type:   ProviderTypeAirline,
			URLTpl: "https://www.ita-airways.com/en_en/booking/flights.html?origin={origin}&destination={destination}&departureDate={departureDate}&returnDate={returnDate}&aff_id={aff_id}&subid={subid}",
		},
		"XQ": {
			Code:   "XQ",
			Name:   "SunExpress",
			Type:   ProviderTypeAirline,
			URLTpl: "https://www.sunexpress.com/en-gb/booking/flight-search/?origin={origin}&destination={destination}&departureDate={departureDate}&returnDate={returnDate}",
		},
		"BY": {
			Code:   "BY",
			Name:   "TUI Airways",
			Type:   ProviderTypeAirline,
			URLTpl: "https://www.tui.co.uk/flight/search?origin={origin}&destination={destination}&departureDate={departureDate}&returnDate={returnDate}",
		},
	}
	providerRegistryMu.Lock()
	defer providerRegistryMu.Unlock()
	for code, p := range extra {
		if _, exists := providerRegistry[code]; !exists {
			providerRegistry[code] = p
		}
	}
}