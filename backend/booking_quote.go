package main

import (
	"strings"

	"flightcaptainweb/search"
)

// quoteBindingFromOption is used by the legacy /api/out/booking redirect path only.
// POST /api/booking/resolve uses the PR 69 web-search matcher and does not call this.
func quoteBindingFromOption(session *SearchSession, option *FlightOption, _ int) search.QuoteBinding {
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
	q.Amount = amount
	q.Currency = currency
	if session != nil && strings.TrimSpace(session.Params.Currency) != "" && q.Currency == "" {
		q.Currency = session.Params.CurrencyOrDefault()
	}
	q.DeepLink = normalizeProviderBookingURL(option.DeepLink)
	return q
}
