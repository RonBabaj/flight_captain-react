package main

import (
	"strings"

	"flightcaptainweb/search"
)

// quoteBindingFromOption is used by the legacy /api/out/booking redirect path.
func quoteBindingFromOption(session *SearchSession, option *FlightOption, legIndex int) search.QuoteBinding {
	q := search.QuoteBinding{}
	if option == nil {
		return q
	}
	amount := option.Price.Amount
	currency := option.Price.Currency
	if option.OriginalPrice != nil && option.PriceIsEstimate {
		amount = option.OriginalPrice.Amount
		currency = option.OriginalPrice.Currency
	}
	if legIndex >= 0 && legIndex < len(option.LegPrices) && option.LegPrices[legIndex] > 0 {
		amount = option.LegPrices[legIndex]
	}
	q.Amount = amount
	q.Currency = currency
	if session != nil && strings.TrimSpace(session.Params.Currency) != "" && q.Currency == "" {
		q.Currency = session.Params.CurrencyOrDefault()
	}
	q.DeepLink = normalizeProviderBookingURL(option.DeepLink)
	return q
}
