package main

import (
	"context"
	"net/url"
	"strings"
	"time"

	"flightcaptainweb/bookingmatch"
	"flightcaptainweb/search"
)

// resolveGF2PartnerOffer resolves checkout for the exact fare shown in search results
// using preserved GF2 booking tokens and deep links. For open-jaw itineraries each leg
// keeps its own token from CombineOneWayBatches instead of losing them at merge time.
func resolveGF2PartnerOffer(ctx context.Context, session *SearchSession, option *FlightOption, it search.CanonicalItinerary, legIndex int, segmentIndex int) *bookingmatch.BookingOffer {
	if option == nil {
		return nil
	}
	fp := search.CanonicalItineraryFingerprint(it)
	if fp == "" {
		return nil
	}
	split := itineraryIsSplit(session, option)
	if legIndex < 0 && split {
		return nil
	}

	currency := "USD"
	adults := 1
	if session != nil {
		if strings.TrimSpace(session.Params.Currency) != "" {
			currency = session.Params.CurrencyOrDefault()
		}
		if session.Params.Adults > 0 {
			adults = session.Params.Adults
		}
	}
	quote := quoteBindingFromOption(session, option, legIndex)
	token := legBookingToken(option, legIndex)
	deepLink := legDeepLink(option, legIndex)

	// Search-time partner checkout URL is enough — no live GF2 call required.
	if deepLink != "" && search.IsLikelyPartnerCheckoutURL(deepLink) {
		if offer := gf2PartnerOfferFromQuoteURL(deepLink, fp, quote); offer != nil {
			return offer
		}
	}
	if legIndex < 0 && !split {
		for _, raw := range []string{option.BookingURL, option.DeepLink} {
			if u := normalizeProviderBookingURL(raw); u != "" && search.IsLikelyPartnerCheckoutURL(u) {
				if offer := gf2PartnerOfferFromQuoteURL(u, fp, quote); offer != nil {
					return offer
				}
			}
		}
	}

	if token != "" && googleFlights2Provider != nil {
		if resolved, err := googleFlights2Provider.ResolveQuotedPartnerBooking(ctx, token, currency, quote); err == nil {
			if resolved != nil && resolvedPartnerURLMatchesLeg(option, legIndex, resolved.URL) {
				if offer := gf2PartnerOfferFromResolved(resolved, fp); offer != nil {
					return offer
				}
			}
		}
	}

	// Re-search only when search-time token/deeplink were not preserved (e.g. legacy session).
	if googleFlights2Provider != nil {
		sreq := searchRequestFromSession(session, option, legIndex, segmentIndex)
		if resolved, err := googleFlights2Provider.ResolveQuotedPartnerBookingForFingerprint(ctx, sreq, it, currency, quote); err == nil {
			if resolved != nil && (legIndex < 0 || resolvedPartnerURLMatchesLeg(option, legIndex, resolved.URL)) {
				if offer := gf2PartnerOfferFromResolved(resolved, fp); offer != nil {
					return offer
				}
			}
		}
	}

	// Live GF2 route search → partner checkout (round-trip when legIndex < 0, one-way per leg otherwise).
	if googleFlights2Provider != nil {
		var origin, dest, dep, ret string
		if legIndex >= 0 && option != nil && legIndex < len(option.Legs) {
			if segmentIndex >= 0 && segmentIndex < len(option.Legs[legIndex].Segments) {
				origin, dest, dep = routeFromFlightSegment(option.Legs[legIndex].Segments[segmentIndex])
			} else {
				origin, dest, dep = routeFromFlightLeg(option.Legs[legIndex])
			}
		} else {
			origin, dest, dep, ret = bookingRouteFromSessionOption(session, option)
		}
		if origin != "" && dest != "" && dep != "" {
			if u, err := googleFlights2Provider.ResolvePartnerBookingForRoute(ctx, origin, dest, dep, ret, currency, adults); err == nil {
				if offer := gf2PartnerOfferFromURL(u, fp); offer != nil {
					return offer
				}
			}
		}
	}

	return nil
}

func legBookingToken(option *FlightOption, legIndex int) string {
	if option == nil {
		return ""
	}
	if legIndex >= 0 {
		if !legPartnerArraysAligned(option) || legIndex >= len(option.LegBookingTokens) {
			return ""
		}
		return strings.TrimSpace(option.LegBookingTokens[legIndex])
	}
	return strings.TrimSpace(option.BookingToken)
}

func legDeepLink(option *FlightOption, legIndex int) string {
	if option == nil {
		return ""
	}
	if legIndex >= 0 {
		if !legPartnerArraysAligned(option) || legIndex >= len(option.LegDeepLinks) {
			return ""
		}
		u := normalizeProviderBookingURL(option.LegDeepLinks[legIndex])
		if u == "" {
			return ""
		}
		if !resolvedPartnerURLMatchesLeg(option, legIndex, u) {
			return ""
		}
		return u
	}
	return normalizeProviderBookingURL(option.DeepLink)
}

// legPartnerArraysAligned requires per-leg partner metadata to line up with Legs[].
// Misaligned arrays caused open-jaw leg 0 to reuse leg 1's El Al checkout URL.
func legPartnerArraysAligned(option *FlightOption) bool {
	if option == nil {
		return false
	}
	n := len(option.Legs)
	if n == 0 {
		return false
	}
	if len(option.LegDeepLinks) > 0 && len(option.LegDeepLinks) != n {
		return false
	}
	if len(option.LegBookingTokens) > 0 && len(option.LegBookingTokens) != n {
		return false
	}
	return true
}

func marketingCarrierForLeg(option *FlightOption, legIndex int) string {
	if option == nil || legIndex < 0 || legIndex >= len(option.Legs) {
		return ""
	}
	for _, seg := range option.Legs[legIndex].Segments {
		if c := strings.ToUpper(strings.TrimSpace(seg.MarketingCarrier.Code)); c != "" {
			return c
		}
	}
	return ""
}

func resolvedPartnerURLMatchesLeg(option *FlightOption, legIndex int, rawURL string) bool {
	if rawURL == "" || option == nil || legIndex < 0 || legIndex >= len(option.Legs) {
		return false
	}
	carrier := marketingCarrierForLeg(option, legIndex)
	if carrier == "" {
		return true
	}
	return partnerDomainMatchesCarrier(providerDomainFromURL(rawURL), carrier)
}

func partnerDomainMatchesCarrier(domain, carrier string) bool {
	domain = strings.ToLower(strings.TrimPrefix(strings.TrimSpace(domain), "www."))
	carrier = strings.ToUpper(strings.TrimSpace(carrier))
	if domain == "" || carrier == "" {
		return true
	}
	// Reject known airline-direct checkout domains that belong to a different carrier.
	type carrierDomain struct {
		carrier string
		domain  string
	}
	checks := []carrierDomain{
		{"LY", "elal.co.il"},
		{"OS", "austrian.com"},
		{"LH", "lufthansa.com"},
		{"LX", "swiss.com"},
		{"BA", "britishairways.com"},
		{"AF", "airfrance.com"},
		{"KL", "klm.com"},
		{"UA", "united.com"},
		{"AA", "aa.com"},
		{"DL", "delta.com"},
		{"FR", "ryanair.com"},
		{"W6", "wizzair.com"},
	}
	for _, chk := range checks {
		if strings.Contains(domain, chk.domain) && carrier != chk.carrier {
			return false
		}
	}
	return true
}

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
	} else if legIndex >= 0 && len(option.Legs) > 1 {
		amount = allocateLegQuoteAmount(option, legIndex, amount)
	}
	q.Amount = amount
	q.Currency = currency
	q.DeepLink = legDeepLink(option, legIndex)
	return q
}

func allocateLegQuoteAmount(option *FlightOption, legIndex int, totalAmount float64) float64 {
	if option == nil || legIndex < 0 || legIndex >= len(option.Legs) || totalAmount <= 0 {
		return totalAmount
	}
	totalDur := option.DurationMinutes
	if totalDur <= 0 {
		for _, leg := range option.Legs {
			totalDur += flightLegDurationMinutes(leg)
		}
	}
	legDur := flightLegDurationMinutes(option.Legs[legIndex])
	if totalDur <= 0 || legDur <= 0 {
		return totalAmount / float64(len(option.Legs))
	}
	return totalAmount * (float64(legDur) / float64(totalDur))
}

func flightLegDurationMinutes(leg FlightLeg) int {
	if len(leg.Segments) == 0 {
		return 0
	}
	first := leg.Segments[0].DepartureTime
	last := leg.Segments[len(leg.Segments)-1].ArrivalTime
	if !first.IsZero() && !last.IsZero() && last.After(first) {
		return int(last.Sub(first).Minutes())
	}
	total := 0
	for _, s := range leg.Segments {
		total += s.DurationMinutes
	}
	return total
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

func searchRequestFromSession(session *SearchSession, option *FlightOption, legIndex int, segmentIndex int) search.SearchRequest {
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
		if segmentIndex >= 0 && segmentIndex < len(option.Legs[legIndex].Segments) {
			origin, dest, dep := routeFromFlightSegment(option.Legs[legIndex].Segments[segmentIndex])
			req.Origin = origin
			req.Destination = dest
			req.DepartureDate = dep
		} else {
			origin, dest, dep := routeFromFlightLeg(option.Legs[legIndex])
			req.Origin = origin
			req.Destination = dest
			req.DepartureDate = dep
		}
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

func attachQuotedPriceMeta(resp BookingResolveResponse, session *SearchSession, option *FlightOption, legIndex int, extractedPrice *float64) BookingResolveResponse {
	if option == nil {
		return resp
	}
	q := quoteBindingFromOption(session, option, legIndex)
	if q.Amount > 0 {
		amt := q.Amount
		resp.QuotedPrice = &amt
		resp.QuotedCurrency = q.Currency
	}
	if resp.Offer == nil || q.Amount <= 0 {
		return resp
	}
	comparePrice := extractedPrice
	if comparePrice == nil {
		comparePrice = resp.Offer.Price
	}
	if comparePrice != nil && *comparePrice > 0 {
		actual := *comparePrice
		actualCur := resp.Offer.Currency
		if actualCur != "" && q.Currency != "" && actualCur != q.Currency {
			actual, _ = convertPrice(actual, actualCur, q.Currency)
		}
		if !search.PricesMatchQuote(q.Amount, actual) {
			resp.PriceMismatch = true
			resp.Message = "Checkout price may differ from the search quote. Verify on the partner site before paying."
		}
	}
	return resp
}

func applySearchQuoteToOffer(offer *bookingmatch.BookingOffer, quote search.QuoteBinding) (extractedBeforeFill *float64) {
	if offer == nil {
		return nil
	}
	if offer.Price != nil {
		p := *offer.Price
		return &p
	}
	if quote.Amount <= 0 {
		return nil
	}
	p := quote.Amount
	offer.Price = &p
	if quote.Currency != "" {
		offer.Currency = quote.Currency
	}
	return nil
}

func bookingMatchPriceNormalizer() bookingmatch.PriceNormalizer {
	return func(amount float64, from, to string) (float64, string) {
		return convertPrice(amount, from, to)
	}
}

func quoteBindingForMatch(session *SearchSession, option *FlightOption, legIndex int) *bookingmatch.QuoteBinding {
	q := quoteBindingFromOption(session, option, legIndex)
	if q.Amount <= 0 {
		return nil
	}
	return &bookingmatch.QuoteBinding{Amount: q.Amount, Currency: q.Currency}
}

// resolveLegBookingRedirectURL resolves GF2 partner checkout for one leg of a split itinerary,
// falling back to a one-way search prefill when partner checkout is unavailable.
func resolveLegBookingRedirectURL(ctx context.Context, session *SearchSession, option *FlightOption, legIndex int) string {
	if option == nil || legIndex < 0 || legIndex >= len(option.Legs) {
		return ""
	}
	it, err := canonicalItineraryForOption(option, legIndex, -1)
	if err == nil {
		if offer := resolveGF2PartnerOffer(ctx, session, option, it, legIndex, -1); offer != nil && strings.TrimSpace(offer.URL) != "" {
			return offer.URL
		}
	}
	return bookingPrefillURL(session, option, legIndex, -1)
}
