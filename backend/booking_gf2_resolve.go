package main

import (
	"context"
	"net/url"
	"strings"
	"time"

	"flightcaptainweb/bookingmatch"
	"flightcaptainweb/search"
)

// resolveGF2PartnerOffer uses Google Flights partner checkout for the exact selected fare.
// This is the same path the legacy affiliate redirect used; SerpAPI is only a fallback.
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

	if legIndex < 0 && strings.TrimSpace(option.BookingToken) != "" {
		if u, err := googleFlights2Provider.ResolvePartnerBookingURL(ctx, option.BookingToken, currency); err == nil {
			if offer := gf2PartnerOfferFromURL(u, fp); offer != nil {
				return offer
			}
		}
	}

	sreq := searchRequestFromSession(session, option, legIndex)
	if u, err := googleFlights2Provider.ResolvePartnerBookingForFingerprint(ctx, sreq, fp, currency); err == nil {
		if offer := gf2PartnerOfferFromURL(u, fp); offer != nil {
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
			return gf2PartnerOfferFromURL(u, fp)
		}
	}

	return nil
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
