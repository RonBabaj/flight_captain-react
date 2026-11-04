package main

import (
	"context"
	"errors"
	"net/url"
	"sort"
	"strings"
	"time"

	"flightcaptainweb/bookingmatch"
	"flightcaptainweb/search"
)

func isTransientGF2BookingErr(err error) bool {
	if err == nil {
		return false
	}
	if search.IsGF2RateLimitError(err) {
		return true
	}
	if errors.Is(err, context.DeadlineExceeded) || errors.Is(err, context.Canceled) {
		return true
	}
	msg := strings.ToLower(err.Error())
	return strings.Contains(msg, "timeout") || strings.Contains(msg, "timed out")
}

// resolveGF2PartnerOffers collects every GF2 partner checkout candidate for an itinerary.
// Search-time deep links are included but never short-circuit before live booking_options.
func resolveGF2PartnerOffers(ctx context.Context, session *SearchSession, option *FlightOption, it search.CanonicalItinerary, legIndex int, segmentIndex int) ([]bookingmatch.BookingOffer, error) {
	if option == nil {
		return nil, nil
	}
	fp := search.CanonicalItineraryFingerprint(it)
	if fp == "" {
		return nil, nil
	}
	split := itineraryIsSplit(session, option)
	if legIndex < 0 && split {
		return nil, nil
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

	var offers []bookingmatch.BookingOffer
	var lastTransientErr error
	noteErr := func(err error) {
		if isTransientGF2BookingErr(err) {
			lastTransientErr = err
		}
	}
	addResolved := func(resolved []search.ResolvedPartnerBooking) {
		for _, r := range resolved {
			if legIndex >= 0 && !resolvedPartnerURLMatchesLeg(option, legIndex, r.URL) {
				continue
			}
			if offer := gf2PartnerOfferFromResolved(&r, fp); offer != nil {
				offers = append(offers, *offer)
			}
		}
	}
	addOffer := func(offer *bookingmatch.BookingOffer) {
		if offer == nil {
			return
		}
		if legIndex >= 0 && !resolvedPartnerURLMatchesLeg(option, legIndex, offer.URL) {
			return
		}
		offers = append(offers, *offer)
	}

	if token != "" && googleFlights2Provider != nil {
		if resolved, err := resolveAllPartnerBookingsFromTokenWithRetry(ctx, token, currency); err == nil {
			addResolved(resolved)
		} else {
			noteErr(err)
		}
	}

	supplementGF2Partners := func() {
		if googleFlights2Provider == nil {
			return
		}
		sreq := searchRequestFromSession(session, option, legIndex, segmentIndex)
		if resolved, err := googleFlights2Provider.ResolveAllPartnerBookingsForFingerprint(ctx, sreq, it, currency, quote); err == nil {
			addResolved(resolved)
		} else {
			noteErr(err)
		}
	}

	// Live re-search when the token returned nothing, or when checkout prices exceed the search quote
	// (stale tokens often omit the current cheapest seller).
	if len(offers) == 0 {
		supplementGF2Partners()
	} else if quote.Amount > 0 {
		if best := bookingmatch.SelectCheapestVerifiedOffer(offers, bookingMatchPriceNormalizer()); best != nil && best.Price != nil && *best.Price > 0 {
			if !search.PricesMatchQuote(quote.Amount, *best.Price) {
				supplementGF2Partners()
			}
		}
	}

	if deepLink != "" && search.IsLikelyPartnerCheckoutURL(deepLink) {
		offer := gf2PartnerOfferFromQuoteURL(deepLink, fp, quote)
		if offer != nil && gf2OffersHavePrice(offers) {
			carrier := marketingCarrierForLegIndex(option, legIndex)
			if !airlineDomainForCarrier(offer.Domain, carrier) {
				offer.Price = nil
				offer.Currency = ""
			}
		}
		addOffer(offer)
	}
	if legIndex < 0 && !split {
		for _, raw := range []string{option.BookingURL, option.DeepLink} {
			if u := normalizeProviderBookingURL(raw); u != "" && search.IsLikelyPartnerCheckoutURL(u) {
				offer := gf2PartnerOfferFromQuoteURL(u, fp, quote)
				if offer != nil && gf2OffersHavePrice(offers) {
					carrier := marketingCarrierForLegIndex(option, legIndex)
					if !airlineDomainForCarrier(offer.Domain, carrier) {
						offer.Price = nil
						offer.Currency = ""
					}
				}
				addOffer(offer)
			}
		}
	}

	carrier := marketingCarrierForLegIndex(option, legIndex)
	if carrier != "" {
		injectAirline := !offersIncludeAirlineDirect(offers, carrier)
		if !injectAirline && quote.Amount > 0 {
			if best := bookingmatch.SelectCheapestVerifiedOffer(offers, bookingMatchPriceNormalizer()); best != nil && best.Price != nil && *best.Price > 0 {
				if !airlineDomainForCarrier(best.Domain, carrier) && !search.PricesMatchQuote(quote.Amount, *best.Price) {
					injectAirline = true
				}
			}
		}
		if injectAirline {
			if u := BuildLegAirlineDirectURL(session, option, legIndex, segmentIndex, "", ""); u != "" {
				if offer := gf2PartnerOfferFromQuoteURL(u, fp, quote); offer != nil {
					// Affiliate templates are search forms, not GF2-verified checkout deeplinks.
					offer.URLType = bookingmatch.URLTypeExactSearch
					offer.VerificationStatus = bookingmatch.StatusPartial
					addOffer(offer)
				}
			}
		}
	}

	if len(offers) == 0 && googleFlights2Provider != nil {
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
			if resolved, err := googleFlights2Provider.ResolveAllPartnerBookingsForRoute(ctx, origin, dest, dep, ret, currency, adults); err == nil {
				addResolved(resolved)
			} else {
				noteErr(err)
				if u, err2 := googleFlights2Provider.ResolvePartnerBookingForRoute(ctx, origin, dest, dep, ret, currency, adults); err2 == nil {
					addOffer(gf2PartnerOfferFromURL(u, fp))
				} else {
					noteErr(err2)
				}
			}
		}
	}

	offers = dedupeGF2PartnerOffers(offers)
	if len(offers) > 0 {
		return offers, nil
	}
	if lastTransientErr != nil {
		return nil, lastTransientErr
	}
	return nil, nil
}

func gf2OffersHavePrice(offers []bookingmatch.BookingOffer) bool {
	for _, o := range offers {
		if o.Price != nil && *o.Price > 0 {
			return true
		}
	}
	return false
}

// resolveGF2PartnerOffer returns the cheapest GF2 partner offer for redirect-style flows.
func resolveGF2PartnerOffer(ctx context.Context, session *SearchSession, option *FlightOption, it search.CanonicalItinerary, legIndex int, segmentIndex int) *bookingmatch.BookingOffer {
	offers, _ := resolveGF2PartnerOffers(ctx, session, option, it, legIndex, segmentIndex)
	return bookingmatch.SelectCheapestVerifiedOffer(offers, bookingMatchPriceNormalizer())
}

func dedupeGF2PartnerOffers(offers []bookingmatch.BookingOffer) []bookingmatch.BookingOffer {
	if len(offers) == 0 {
		return nil
	}
	seen := map[string]struct{}{}
	out := make([]bookingmatch.BookingOffer, 0, len(offers))
	for _, o := range offers {
		key := strings.ToLower(strings.TrimSpace(o.URL))
		if key == "" {
			continue
		}
		if _, ok := seen[key]; ok {
			continue
		}
		seen[key] = struct{}{}
		out = append(out, o)
	}
	return out
}

func legBookingToken(option *FlightOption, legIndex int) string {
	if option == nil {
		return ""
	}
	if legIndex < 0 {
		return strings.TrimSpace(option.BookingToken)
	}
	if legIndex >= len(option.Legs) {
		return ""
	}
	nLegs := len(option.Legs)
	nTokens := len(option.LegBookingTokens)
	if nTokens == 0 {
		return ""
	}
	// One token for a multi-leg itinerary: use it only for the first leg.
	if nTokens == 1 && nLegs > 1 {
		if legIndex == 0 {
			return strings.TrimSpace(option.LegBookingTokens[0])
		}
		return ""
	}
	if nTokens != nLegs {
		return ""
	}
	if legIndex >= nTokens {
		return ""
	}
	return strings.TrimSpace(option.LegBookingTokens[legIndex])
}

func legDeepLink(option *FlightOption, legIndex int) string {
	if option == nil {
		return ""
	}
	if legIndex < 0 {
		return normalizeProviderBookingURL(option.DeepLink)
	}
	if legIndex >= len(option.Legs) {
		return ""
	}
	nLegs := len(option.Legs)
	nLinks := len(option.LegDeepLinks)
	if nLinks == 0 {
		return ""
	}
	// Fewer deeplinks than legs: never bind by index (wrong-leg risk).
	if nLinks != nLegs {
		return ""
	}
	if legIndex >= nLinks {
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

// legPartnerArraysAligned requires per-leg partner metadata to line up with Legs[].
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

// airlineDomainForCarrier is true when domain belongs to the marketing carrier's own booking site.
func airlineDomainForCarrier(domain, carrier string) bool {
	domain = strings.ToLower(strings.TrimPrefix(strings.TrimSpace(domain), "www."))
	carrier = strings.ToUpper(strings.TrimSpace(carrier))
	if domain == "" || carrier == "" {
		return false
	}
	checks := []struct{ carrier, domain string }{
		{"LY", "elal.co.il"},
		{"LY", "elal.com"},
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
		if carrier == chk.carrier && strings.Contains(domain, chk.domain) {
			return true
		}
	}
	return false
}

func marketingCarrierForLegIndex(option *FlightOption, legIndex int) string {
	if legIndex >= 0 {
		return marketingCarrierForLeg(option, legIndex)
	}
	if option == nil || len(option.Legs) == 0 {
		return ""
	}
	return marketingCarrierForLeg(option, 0)
}

func offersIncludeAirlineDirect(offers []bookingmatch.BookingOffer, carrier string) bool {
	for _, o := range offers {
		if airlineDomainForCarrier(o.Domain, carrier) || airlineDomainForCarrier(o.Provider, carrier) {
			return true
		}
	}
	return false
}

// preferAirlineDirectWhenCheaperThanMarkedUpOTA keeps the cheapest OTA when it beats airline GF2,
// but switches to verified airline checkout when the OTA exceeds the search quote and the airline
// offer is cheaper than that OTA (without forcing an inflated airline GF2 price above the OTA).
func preferAirlineDirectWhenCheaperThanMarkedUpOTA(best *bookingmatch.BookingOffer, offers []bookingmatch.BookingOffer, quote search.QuoteBinding, carrier string, normalize bookingmatch.PriceNormalizer) *bookingmatch.BookingOffer {
	if best == nil || quote.Amount <= 0 || carrier == "" {
		return best
	}
	if airlineDomainForCarrier(best.Domain, carrier) || airlineDomainForCarrier(best.Provider, carrier) {
		return best
	}
	otaPrice, ok := normalizedGF2OfferPrice(*best, normalize)
	if !ok || otaPrice <= quote.Amount {
		return best
	}

	var airlinePick *bookingmatch.BookingOffer
	var airlinePrice float64
	hasAirlinePrice := false
	for i := range offers {
		o := &offers[i]
		if o.VerificationStatus != bookingmatch.StatusVerifiedExact {
			continue
		}
		if !airlineDomainForCarrier(o.Domain, carrier) && !airlineDomainForCarrier(o.Provider, carrier) {
			continue
		}
		if isAffiliateTemplateBookingURL(o.URL) {
			continue
		}
		if np, ok := normalizedGF2OfferPrice(*o, normalize); ok {
			if np >= otaPrice {
				continue
			}
			if !hasAirlinePrice || np < airlinePrice {
				airlinePick = o
				airlinePrice = np
				hasAirlinePrice = true
			}
		}
	}
	if airlinePick != nil {
		return airlinePick
	}
	return best
}

// isAffiliateTemplateBookingURL is true for synthetic airline search URLs built from provider templates
// (not live GF2 partner checkout deeplinks). El Al rejects these with "Request is not allowed."
func isAffiliateTemplateBookingURL(raw string) bool {
	u := strings.ToLower(strings.TrimSpace(raw))
	if u == "" || strings.Contains(u, "/checkout") {
		return false
	}
	if strings.Contains(u, "elal") && strings.Contains(u, "/booking/flights") && strings.Contains(u, "origin=") {
		return true
	}
	if strings.Contains(u, "aff_id=") && (strings.Contains(u, "origin=") || strings.Contains(u, "from=")) {
		return true
	}
	return false
}

func normalizedGF2OfferPrice(o bookingmatch.BookingOffer, normalize bookingmatch.PriceNormalizer) (float64, bool) {
	if o.Price == nil || *o.Price <= 0 {
		return 0, false
	}
	from := o.Currency
	if from == "" {
		from = bookingmatch.DefaultCompareCurrency
	}
	if normalize == nil {
		return *o.Price, true
	}
	amount, cur := normalize(*o.Price, from, bookingmatch.DefaultCompareCurrency)
	if amount <= 0 {
		return 0, false
	}
	if cur == "" {
		cur = bookingmatch.DefaultCompareCurrency
	}
	return amount, true
}

func publicAlternativesFromOffers(offers []bookingmatch.BookingOffer, best *bookingmatch.BookingOffer, normalize bookingmatch.PriceNormalizer, limit int) []PublicBookingAlternative {
	if best == nil || limit <= 0 {
		return nil
	}
	bestURL := strings.ToLower(strings.TrimSpace(best.URL))
	type altCandidate struct {
		alt   PublicBookingAlternative
		price float64
		has   bool
	}
	var cands []altCandidate
	for _, o := range offers {
		if strings.ToLower(strings.TrimSpace(o.URL)) == bestURL {
			continue
		}
		if o.VerificationStatus != bookingmatch.StatusVerifiedExact {
			continue
		}
		if err := bookingmatch.ValidateBookingURL(o.URL); err != nil {
			continue
		}
		alt := PublicBookingAlternative{
			Provider: strings.TrimSpace(o.Provider),
			Domain:   strings.TrimSpace(o.Domain),
			URL:      strings.TrimSpace(o.URL),
			Currency: o.Currency,
		}
		if alt.Provider == "" {
			alt.Provider = alt.Domain
		}
		c := altCandidate{alt: alt}
		if o.Price != nil {
			p := *o.Price
			alt.Price = &p
			c.alt = alt
			if np, ok := normalizedGF2OfferPrice(o, normalize); ok {
				c.price = np
				c.has = true
			}
		}
		cands = append(cands, c)
	}
	sort.SliceStable(cands, func(i, j int) bool {
		a, b := cands[i], cands[j]
		if a.has && b.has && a.price != b.price {
			return a.price < b.price
		}
		if a.has != b.has {
			return a.has
		}
		return strings.ToLower(a.alt.Domain) < strings.ToLower(b.alt.Domain)
	})
	if len(cands) > limit {
		cands = cands[:limit]
	}
	out := make([]PublicBookingAlternative, len(cands))
	for i, c := range cands {
		out[i] = c.alt
	}
	return out
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

func resolveAllPartnerBookingsFromTokenWithRetry(ctx context.Context, token, currency string) ([]search.ResolvedPartnerBooking, error) {
	if googleFlights2Provider == nil {
		return nil, nil
	}
	resolved, err := googleFlights2Provider.ResolveAllPartnerBookingsFromToken(ctx, token, currency)
	if err == nil && len(resolved) > 0 {
		return resolved, nil
	}
	if err != nil && search.IsGF2RateLimitError(err) {
		select {
		case <-ctx.Done():
			return nil, ctx.Err()
		case <-time.After(2 * time.Second):
		}
		return googleFlights2Provider.ResolveAllPartnerBookingsFromToken(ctx, token, currency)
	}
	return resolved, err
}
