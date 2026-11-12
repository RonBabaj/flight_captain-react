package main

import (
	"context"
	"log"
	"strings"
	"time"

	"flightcaptainweb/bookingmatch"
	"flightcaptainweb/search"
)

// bookingOTAOffersResolver is swappable in tests (mirrors bookingGF2OffersResolver).
var bookingOTAOffersResolver = resolveOTAPartnerOffers

func isOTAScrapedSource(source string) bool {
	switch strings.ToLower(strings.TrimSpace(source)) {
	case "skyscanner", "kiwi", "expedia", "multisite", "ota":
		return true
	default:
		return false
	}
}

func otaResolveSiteForSource(source string) string {
	switch strings.ToLower(strings.TrimSpace(source)) {
	case "skyscanner":
		return "skyscanner"
	case "kiwi":
		return "kiwi"
	default:
		return ""
	}
}

func otaFirstNonEmpty(vals ...string) string {
	for _, v := range vals {
		if strings.TrimSpace(v) != "" {
			return strings.TrimSpace(v)
		}
	}
	return ""
}

// resolveOTAPartnerOffers opens the OTA booking panel (Skyscanner / Kiwi) and
// returns seller checkout URLs — same role as GF2 getBookingDetails → getBookingURL.
func resolveOTAPartnerOffers(ctx context.Context, session *SearchSession, option *FlightOption, it search.CanonicalItinerary, legIndex int, segmentIndex int) ([]bookingmatch.BookingOffer, error) {
	if option == nil || otaScraperProvider == nil {
		return nil, nil
	}
	site := otaResolveSiteForSource(option.Source)
	if site == "" {
		return nil, nil
	}
	split := itineraryIsSplit(session, option)
	if legIndex < 0 && split {
		return nil, nil
	}

	fp := search.CanonicalItineraryFingerprint(it)
	if fp == "" {
		return nil, nil
	}

	// Already have a partner checkout deep link from search (e.g. Kiwi /booking).
	if u := strings.TrimSpace(legDeepLink(option, legIndex)); search.IsLikelyPartnerCheckoutURL(u) {
		quote := quoteBindingFromOption(session, option, legIndex)
		if offer := gf2PartnerOfferFromQuoteURL(u, fp, quote); offer != nil {
			return []bookingmatch.BookingOffer{*offer}, nil
		}
	}

	sreq := searchRequestFromSession(session, option, legIndex, segmentIndex)
	quote := quoteBindingFromOption(session, option, legIndex)
	outDep, inDep := otaResolveClockHints(option, legIndex, sreq.ReturnDate == "")

	// Never reuse the outbound listing page for return/extra legs — rebuild from route.
	listingURL := strings.TrimSpace(option.ListingURL)
	if legIndex > 0 {
		listingURL = ""
	}

	req := search.OtaPartnerResolveRequest{
		Site:          site,
		Origin:        sreq.Origin,
		Destination:   sreq.Destination,
		DepartureDate: sreq.DepartureDate,
		ReturnDate:    sreq.ReturnDate,
		Adults:        sreq.Adults,
		Children:      sreq.Children,
		Infants:       sreq.Infants,
		Currency:      otaFirstNonEmpty(quote.Currency, sreq.Currency, "USD"),
		CabinClass:    otaFirstNonEmpty(sreq.CabinClass, "ECONOMY"),
		Price:         quote.Amount,
		ListingURL:    listingURL,
		Segments:      otaResolveSegmentsPayload(option, legIndex, segmentIndex),
		OutDepHm:      outDep,
		InDepHm:       inDep,
	}

	partners, err := otaScraperProvider.ResolvePartners(ctx, req)
	if err != nil {
		log.Printf("[BOOKING_OTA] resolve site=%s err=%v", site, err)
		return nil, err
	}

	var offers []bookingmatch.BookingOffer
	for _, p := range partners {
		res := search.ResolvedPartnerBooking{
			URL:      p.URL,
			Price:    p.Price,
			Currency: req.Currency,
			Provider: p.Provider,
		}
		if res.Price <= 0 && quote.Amount > 0 {
			res.Price = quote.Amount
		}
		if offer := gf2PartnerOfferFromResolved(&res, fp); offer != nil {
			offers = append(offers, *offer)
		}
	}
	if len(offers) == 0 {
		return nil, nil
	}
	log.Printf("[BOOKING_OTA] site=%s partners=%d", site, len(offers))
	return dedupeGF2PartnerOffers(offers), nil
}

func otaResolveSegmentsPayload(option *FlightOption, legIndex int, segmentIndex int) []map[string]interface{} {
	if option == nil {
		return nil
	}
	out := make([]map[string]interface{}, 0)
	appendLeg := func(legIdx int, segs []FlightSegment) {
		legName := "outbound"
		if legIdx > 0 {
			legName = "inbound"
		}
		for _, s := range segs {
			out = append(out, flightSegmentToOtaMap(s, legName))
		}
	}
	if legIndex >= 0 && legIndex < len(option.Legs) {
		leg := option.Legs[legIndex]
		if segmentIndex >= 0 && segmentIndex < len(leg.Segments) {
			appendLeg(legIndex, []FlightSegment{leg.Segments[segmentIndex]})
		} else {
			appendLeg(legIndex, leg.Segments)
		}
		return out
	}
	for i, leg := range option.Legs {
		appendLeg(i, leg.Segments)
	}
	return out
}

func flightSegmentToOtaMap(s FlightSegment, leg string) map[string]interface{} {
	m := map[string]interface{}{
		"leg":      leg,
		"fromCode": strings.TrimSpace(s.From.Code),
		"toCode":   strings.TrimSpace(s.To.Code),
	}
	if !s.DepartureTime.IsZero() {
		m["departureTime"] = s.DepartureTime.Format(time.RFC3339)
	}
	if !s.ArrivalTime.IsZero() {
		m["arrivalTime"] = s.ArrivalTime.Format(time.RFC3339)
	}
	if c := strings.TrimSpace(s.MarketingCarrier.Code); c != "" {
		m["airlineCode"] = c
	}
	if n := strings.TrimSpace(s.FlightNumber); n != "" {
		m["flightNumber"] = n
	}
	return m
}

func otaResolveClockHints(option *FlightOption, legIndex int, oneWay bool) (outDepHm, inDepHm string) {
	if option == nil || len(option.Legs) == 0 {
		return "", ""
	}
	hm := func(t time.Time) string {
		if t.IsZero() {
			return ""
		}
		return t.Format("15:04")
	}
	if legIndex >= 0 && legIndex < len(option.Legs) {
		leg := option.Legs[legIndex]
		if len(leg.Segments) == 0 {
			return "", ""
		}
		dep := hm(leg.Segments[0].DepartureTime)
		// Per-leg resolve always searches one-way — put dep in OutDepHm so the
		// scraper can match the card (return/extra used to land in InDepHm only).
		if oneWay || legIndex == 0 {
			return dep, ""
		}
		return "", dep
	}
	if len(option.Legs[0].Segments) > 0 {
		outDepHm = hm(option.Legs[0].Segments[0].DepartureTime)
	}
	if !oneWay && len(option.Legs) > 1 && len(option.Legs[1].Segments) > 0 {
		inDepHm = hm(option.Legs[1].Segments[0].DepartureTime)
	}
	return outDepHm, inDepHm
}
