package main

import (
	"context"
	"net/url"
	"strings"
	"time"

	"flightcaptainweb/bookingmatch"
	"flightcaptainweb/search"
)

// resolveGF2PartnerOffer resolves GF2 partner checkout URLs for legacy redirect flows
// (e.g. /api/out/booking). It is NOT used by POST /api/booking/resolve, which always
// runs the web-search bookingmatcher pipeline.
func resolveGF2PartnerOffer(ctx context.Context, session *SearchSession, option *FlightOption, fp string, legIndex int) *bookingmatch.BookingOffer {
	if googleFlights2Provider == nil || option == nil || fp == "" {
		return nil
	}
	if legIndex < 0 && itineraryIsSplit(session, option) {
		return nil
	}

	currency := "USD"
	if session != nil && strings.TrimSpace(session.Params.Currency) != "" {
		currency = session.Params.CurrencyOrDefault()
	}
	quote := quoteBindingFromOption(session, option, legIndex)

	// Search-time deep link is tied to the quoted fare — prefer it over re-resolving to another seller.
	if legIndex < 0 && quote.DeepLink != "" {
		if offer := gf2PartnerOfferFromQuoteURL(quote.DeepLink, fp, quote); offer != nil {
			return offer
		}
	}

	if legIndex < 0 && strings.TrimSpace(option.BookingToken) != "" {
		if resolved, err := googleFlights2Provider.ResolveQuotedPartnerBooking(ctx, option.BookingToken, currency, quote); err == nil {
			if offer := gf2PartnerOfferFromResolved(resolved, fp); offer != nil {
				return offer
			}
		}
	}

	sreq := searchRequestFromSession(session, option, legIndex)
	if resolved, err := googleFlights2Provider.ResolveQuotedPartnerBookingForFingerprint(ctx, sreq, fp, currency, quote); err == nil {
		if offer := gf2PartnerOfferFromResolved(resolved, fp); offer != nil {
			return offer
		}
	}

	if legIndex >= 0 && legIndex < len(option.Legs) {
		origin, dest, dep := routeFromFlightLeg(option.Legs[legIndex])
		adults := 1
		if session != nil && session.Params.Adults > 0 {
			adults = session.Params.Adults
		}
		if u, err := googleFlights2Provider.ResolvePartnerBookingForRoute(ctx, origin, dest, dep, "", currency, adults); err == nil {
			return gf2PartnerOfferFromQuoteURL(u, fp, quote)
		}
	}

	return nil
}

func quoteBindingFromOption(session *SearchSession, option *FlightOption, legIndex int) search.QuoteBinding {
	_ = session
	_ = legIndex
	q := search.QuoteBinding{}
	if option == nil {
		return q
	}
	q.Amount = option.Price.Amount
	q.Currency = option.Price.Currency
	if option.OriginalPrice != nil && option.PriceIsEstimate {
		q.Amount = option.OriginalPrice.Amount
		q.Currency = option.OriginalPrice.Currency
	}
	q.DeepLink = normalizeProviderBookingURL(option.DeepLink)
	return q
}

func gf2PartnerOfferFromQuoteURL(rawURL, fp string, quote search.QuoteBinding) *bookingmatch.BookingOffer {
	offer := gf2PartnerOfferFromURL(rawURL, fp)
	if offer == nil {
		return nil
	}
	if quote.Amount > 0 {
		p := quote.Amount
		offer.Price = &p
		offer.Currency = quote.Currency
	}
	if vn := strings.TrimSpace(optionVendorFromQuote(quote)); vn != "" {
		offer.Provider = vn
	}
	return offer
}

func optionVendorFromQuote(quote search.QuoteBinding) string {
	if quote.DeepLink == "" {
		return ""
	}
	parsed, err := url.Parse(quote.DeepLink)
	if err != nil {
		return ""
	}
	return strings.TrimPrefix(parsed.Hostname(), "www.")
}

func gf2PartnerOfferFromResolved(res *search.ResolvedPartnerBooking, fp string) *bookingmatch.BookingOffer {
	if res == nil {
		return nil
	}
	offer := gf2PartnerOfferFromURL(res.URL, fp)
	if offer == nil {
		return nil
	}
	if res.Price > 0 {
		p := res.Price
		offer.Price = &p
	}
	if c := strings.TrimSpace(res.Currency); c != "" {
		offer.Currency = c
	}
	if p := strings.TrimSpace(res.Provider); p != "" {
		offer.Provider = p
		offer.Domain = p
	}
	return offer
}

func gf2PartnerOfferFromURL(rawURL, fp string) *bookingmatch.BookingOffer {
	u := normalizeProviderBookingURL(rawURL)
	if u == "" {
		return nil
	}
	if err := bookingmatch.ValidateBookingURL(u); err != nil {
		return nil
	}
	domain := providerDomainFromURL(u)
	return &bookingmatch.BookingOffer{
		Provider:             domain,
		Domain:               domain,
		URL:                  u,
		URLType:              bookingmatch.URLTypeExactBooking,
		ItineraryFingerprint: fp,
		MatchScore:           95,
		VerificationStatus:   bookingmatch.StatusVerifiedExact,
		CheckedAt:            time.Now().UTC(),
	}
}

func providerDomainFromURL(raw string) string {
	parsed, err := url.Parse(strings.TrimSpace(raw))
	if err != nil {
		return ""
	}
	return strings.TrimPrefix(parsed.Hostname(), "www.")
}

func searchRequestFromSession(session *SearchSession, option *FlightOption, legIndex int) search.SearchRequest {
	req := search.SearchRequest{
		Adults:     1,
		Currency:   "USD",
		CabinClass: "ECONOMY",
	}
	if session != nil {
		p := session.Params
		extra := make([]search.ExtraLeg, 0, len(p.ExtraLegs))
		for _, e := range p.ExtraLegs {
			extra = append(extra, search.ExtraLeg{
				Origin: e.Origin, Destination: e.Destination, Date: e.Date,
			})
		}
		req = search.SearchRequest{
			Origin:            p.Origin,
			Destination:       p.Destination,
			DepartureDate:     p.DepartureDate,
			ReturnDate:        p.ReturnDate,
			ReturnOrigin:      p.ReturnOrigin,
			ReturnDestination: p.ReturnDestination,
			ExtraLegs:         extra,
			CabinClass:        p.CabinClass,
			CabinPreference:   p.CabinPrefOrDefault(),
			IncludeCheckedBag: p.IncludeCheckedBagOrDefault(),
			Adults:            p.Adults,
			Children:          p.ChildrenOrDefault(),
			Infants:           p.InfantsOrDefault(),
			Currency:          p.CurrencyOrDefault(),
		}
		req = search.SanitizeStandardSearchRequest(req)
	}
	if legIndex >= 0 && option != nil && legIndex < len(option.Legs) {
		origin, dest, dep := routeFromFlightLeg(option.Legs[legIndex])
		req.Origin = origin
		req.Destination = dest
		req.DepartureDate = dep
		req.ReturnDate = ""
		req.ReturnOrigin = ""
		req.ReturnDestination = ""
		req.ExtraLegs = nil
	}
	if req.Adults < 1 {
		req.Adults = 1
	}
	return req
}

func attachQuotedPriceMeta(resp BookingResolveResponse, session *SearchSession, option *FlightOption, legIndex int) BookingResolveResponse {
	if option == nil {
		return resp
	}
	q := quoteBindingFromOption(session, option, legIndex)
	if q.Amount > 0 {
		amt := q.Amount
		resp.QuotedPrice = &amt
		resp.QuotedCurrency = q.Currency
	}
	if resp.Offer != nil && resp.Offer.Price != nil && q.Amount > 0 {
		resp.PriceMismatch = !search.PricesMatchQuote(q.Amount, *resp.Offer.Price)
		if resp.PriceMismatch {
			resp.Message = "Checkout price may differ from the search quote. Verify on the partner site before paying."
		}
	}
	return resp
}
