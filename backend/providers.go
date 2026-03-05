package main

import (
	"context"
	"sort"
	"strings"

	"flightcaptainweb/search"
)

// AmadeusProvider wraps the Amadeus client to implement search.Provider.
type AmadeusProvider struct {
	client *AmadeusClient
}

// NewAmadeusProvider creates an Amadeus provider.
func NewAmadeusProvider(client *AmadeusClient) *AmadeusProvider {
	if client == nil {
		return nil
	}
	return &AmadeusProvider{client: client}
}

// Name implements search.Provider.
func (p *AmadeusProvider) Name() string {
	return "amadeus"
}

// Search implements search.Provider. Runs one-way or round-trip Amadeus search.
func (p *AmadeusProvider) Search(ctx context.Context, req search.SearchRequest) ([]search.ProviderResult, error) {
	opts, err := fetchAmadeusOptions(ctx, req)
	if err != nil {
		return nil, err
	}
	return flightOptionsToProviderResults(opts), nil
}

// DuffelProvider wraps the Duffel client to implement search.Provider.
type DuffelProvider struct {
	client *DuffelClient
}

// NewDuffelProvider creates a Duffel provider.
func NewDuffelProvider(client *DuffelClient) *DuffelProvider {
	if client == nil {
		return nil
	}
	return &DuffelProvider{client: client}
}

// Name implements search.Provider.
func (p *DuffelProvider) Name() string {
	return "duffel"
}

// Search implements search.Provider.
func (p *DuffelProvider) Search(ctx context.Context, req search.SearchRequest) ([]search.ProviderResult, error) {
	result := p.client.SearchOffers(
		strings.ToUpper(req.Origin),
		strings.ToUpper(req.Destination),
		req.DepartureDate,
		req.ReturnDate,
		req.CabinPreference,
	)
	if result.Err != nil {
		return nil, result.Err
	}
	return flightOptionsToProviderResults(result.Options), nil
}

// flightOptionsToProviderResults converts []FlightOption to []search.ProviderResult.
func flightOptionsToProviderResults(opts []FlightOption) []search.ProviderResult {
	var out []search.ProviderResult
	for _, o := range opts {
		var legs []search.Leg
		for _, fl := range o.Legs {
			var segs []search.Segment
			for _, fs := range fl.Segments {
				segs = append(segs, search.Segment{
					From:             fs.From.Code,
					To:               fs.To.Code,
					DepartureTime:    fs.DepartureTime,
					ArrivalTime:      fs.ArrivalTime,
					MarketingCarrier: fs.MarketingCarrier.Code,
					FlightNumber:     fs.FlightNumber,
					DurationMinutes:  fs.DurationMinutes,
					CabinClass:       fs.CabinClass,
				})
			}
			legs = append(legs, search.Leg{Segments: segs})
		}
		out = append(out, search.ProviderResult{
			ID:                    o.ID,
			Price:                 search.Monetary{Currency: o.Price.Currency, Amount: o.Price.Amount},
			DurationMinutes:       o.DurationMinutes,
			Legs:                  legs,
			ValidatingAirlines:     o.ValidatingAirlines,
			BaggageClass:          o.BaggageClass,
			PrimaryDisplayCarrier: o.PrimaryDisplayCarrier,
			Source:                o.Source,
			DeepLink:              o.DeepLink,
			VendorName:            o.VendorName,
		})
	}
	return out
}

// fetchAmadeusOptions runs the Amadeus search logic (one-way or round-trip) and returns normalized options.
// Extracted for use by AmadeusProvider; also used by handleCreateSession.
func fetchAmadeusOptions(ctx context.Context, req search.SearchRequest) ([]FlightOption, error) {
	cabinPref := req.CabinPreference
	if cabinPref == "" {
		cabinPref = req.CabinClass
	}
	if cabinPref == "" {
		cabinPref = "ECONOMY"
	}
	currency := req.Currency
	if currency == "" {
		currency = "USD"
	}
	children := req.Children
	if children < 0 {
		children = 0
	}

	mainReq := &CreateSearchSessionRequest{
		Origin:            req.Origin,
		Destination:       req.Destination,
		DepartureDate:     req.DepartureDate,
		ReturnDate:        req.ReturnDate,
		CabinClass:        req.CabinClass,
		CabinPreference:   cabinPref,
		IncludeCheckedBag: req.IncludeCheckedBag,
		Adults:            max(1, req.Adults),
		Children:          children,
		Infants:           max(0, req.Infants),
		Currency:          currency,
	}

	return fetchAmadeusOptionsFromRequest(ctx, mainReq)
}

// fetchAmadeusOptionsFromRequest contains the core Amadeus search logic.
func fetchAmadeusOptionsFromRequest(ctx context.Context, req *CreateSearchSessionRequest) ([]FlightOption, error) {
	amadeusClient := getAmadeusClient()
	if amadeusClient == nil {
		return nil, nil
	}

	cabinPref := req.CabinPrefOrDefault()
	includeBag := req.IncludeCheckedBagOrDefault()
	currency := req.CurrencyOrDefault()
	origin := strings.ToUpper(req.Origin)
	dest := strings.ToUpper(req.Destination)

	var offers []map[string]interface{}

	if req.ReturnDate != "" {
		outResp, err := amadeusClient.FlightOffersSearch(origin, dest, req.DepartureDate, "", mainSearchMaxOffers, cabinPref, currency, req.Adults, req.ChildrenOrDefault(), false)
		if err != nil {
			return nil, err
		}
		retResp, err := amadeusClient.FlightOffersSearch(dest, origin, req.ReturnDate, "", mainSearchMaxOffers, cabinPref, currency, req.Adults, req.ChildrenOrDefault(), false)
		if err != nil {
			return nil, err
		}
		var outboundFiltered, returnFiltered []map[string]interface{}
		for _, o := range outResp.Data {
			if p := extractRawPrice(o); p > 0 {
				outboundFiltered = append(outboundFiltered, o)
			}
		}
		for _, r := range retResp.Data {
			if p := extractRawPrice(r); p > 0 {
				returnFiltered = append(returnFiltered, r)
			}
		}
		sort.Slice(outboundFiltered, func(i, j int) bool { return extractRawPrice(outboundFiltered[i]) < extractRawPrice(outboundFiltered[j]) })
		sort.Slice(returnFiltered, func(i, j int) bool { return extractRawPrice(returnFiltered[i]) < extractRawPrice(returnFiltered[j]) })
		if len(outboundFiltered) > mixLimit {
			outboundFiltered = outboundFiltered[:mixLimit]
		}
		if len(returnFiltered) > mixLimit {
			returnFiltered = returnFiltered[:mixLimit]
		}
		var combos []MixedRoundTrip
		for _, o := range outboundFiltered {
			for _, r := range returnFiltered {
				if po, pr := extractRawPrice(o), extractRawPrice(r); po > 0 && pr > 0 {
					combos = append(combos, MixedRoundTrip{Outbound: o, Return: r, TotalPrice: po + pr})
				}
			}
		}
		sort.Slice(combos, func(i, j int) bool { return combos[i].TotalPrice < combos[j].TotalPrice })
		topK := maxOffersReturnedToClient
		if len(combos) < topK {
			topK = len(combos)
		}
		for i := 0; i < topK && i < len(combos); i++ {
			c := combos[i]
			if merged := buildCombinedOffer(c.Outbound, c.Return, c.TotalPrice); merged != nil {
				offers = append(offers, merged)
			}
		}
	} else {
		apiResp, err := amadeusClient.FlightOffersSearch(origin, dest, req.DepartureDate, "", mainSearchMaxOffers, cabinPref, currency, req.Adults, req.ChildrenOrDefault(), false)
		if err != nil {
			return nil, err
		}
		offers = apiResp.Data
	}

	if cabinPref != "" {
		offers = filterOffersByCabin(offers, cabinPref)
	}
	selected, _, _, _, _, _ := applySoftStrictBaggage(offers, includeBag)
	offers = selected
	if !includeBag {
		sort.Slice(offers, func(i, j int) bool {
			oi, oj := baggageOrder(offers[i]["_baggageClass"]), baggageOrder(offers[j]["_baggageClass"])
			if oi != oj {
				return oi < oj
			}
			return extractRawPrice(offers[i]) < extractRawPrice(offers[j])
		})
	} else {
		sort.Slice(offers, func(i, j int) bool { return extractRawPrice(offers[i]) < extractRawPrice(offers[j]) })
	}
	if len(offers) > maxOffersReturnedToClient {
		offers = offers[:maxOffersReturnedToClient]
	}

	opts := normalizeFlightOptions(offers, req)
	for i := range opts {
		opts[i].Source = "amadeus"
	}
	return opts, nil
}

// getAmadeusClient returns the global amadeus client (for provider use).
func getAmadeusClient() *AmadeusClient {
	return amadeusClient
}
