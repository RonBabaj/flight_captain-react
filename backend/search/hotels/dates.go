package hotels

import (
	"fmt"
	"strings"
	"time"
)

// FlightLegSummary is the minimal flight leg info needed to derive hotel stay dates.
type FlightLegSummary struct {
	// DestinationCode is the IATA code of the stay city/airport for this leg arrival.
	DestinationCode string
	// ArrivalDate is YYYY-MM-DD at the destination (local calendar date preferred).
	ArrivalDate string
	// DepartureDate is YYYY-MM-DD when leaving the destination (for the return/next leg).
	DepartureDate string
}

// MapFlightToStayDates derives hotel check-in/out from a flight itinerary.
//
// Round-trip / simple one-destination:
//
//	check-in  = destination arrival date (outbound)
//	check-out = destination departure date (return)
//
// Multi-city / complex:
//
//	if more than one distinct destination stay is required, returns ineligible
//	unless a single contiguous stay can be determined.
func MapFlightToStayDates(legs []FlightLegSummary, searchDeparture, searchReturn, destination string) StayDates {
	dest := strings.ToUpper(strings.TrimSpace(destination))
	if dest == "" || dest == "ANYWHERE" || dest == "XXX" {
		return StayDates{Eligible: false, Reason: "Hotel estimate unavailable for this itinerary."}
	}

	// Prefer explicit leg-derived dates when a single destination stay is clear.
	if len(legs) >= 1 {
		// Collect unique destinations from legs.
		uniq := map[string]struct{}{}
		for _, leg := range legs {
			c := strings.ToUpper(strings.TrimSpace(leg.DestinationCode))
			if c != "" {
				uniq[c] = struct{}{}
			}
		}
		if len(uniq) > 1 {
			// Multi-city: do not invent a misleading single-hotel estimate.
			return StayDates{
				Destination: dest,
				Eligible:    false,
				Reason:      "Hotel estimate unavailable for this itinerary.",
			}
		}
	}

	checkIn := strings.TrimSpace(searchDeparture)
	checkOut := strings.TrimSpace(searchReturn)

	if len(legs) >= 1 && legs[0].ArrivalDate != "" {
		checkIn = legs[0].ArrivalDate
	}
	if len(legs) >= 2 && legs[len(legs)-1].DepartureDate != "" {
		checkOut = legs[len(legs)-1].DepartureDate
	} else if len(legs) >= 1 && legs[0].DepartureDate != "" && checkOut == "" {
		checkOut = legs[0].DepartureDate
	}

	// One-way without return: no hotel stay end date → unavailable.
	if checkOut == "" {
		return StayDates{
			Destination: dest,
			CheckIn:     checkIn,
			Eligible:    false,
			Reason:      "Hotel estimate unavailable for this itinerary.",
		}
	}

	if !validDate(checkIn) || !validDate(checkOut) {
		return StayDates{
			Destination: dest,
			CheckIn:     checkIn,
			CheckOut:    checkOut,
			Eligible:    false,
			Reason:      "Hotel estimate unavailable for this itinerary.",
		}
	}

	nights := NightsBetween(checkIn, checkOut)
	if nights < 1 {
		return StayDates{
			Destination: dest,
			CheckIn:     checkIn,
			CheckOut:    checkOut,
			Eligible:    false,
			Reason:      "Hotel estimate unavailable for this itinerary.",
		}
	}
	// RateHawk checkout must be within 30 days of checkin.
	if nights > 30 {
		return StayDates{
			Destination: dest,
			CheckIn:     checkIn,
			CheckOut:    checkOut,
			Eligible:    false,
			Reason:      "Hotel estimate unavailable for this itinerary.",
		}
	}

	return StayDates{
		Destination: dest,
		CheckIn:     checkIn,
		CheckOut:    checkOut,
		Eligible:    true,
	}
}

func validDate(s string) bool {
	_, err := time.Parse("2006-01-02", s)
	return err == nil
}

// BuildTripDeal constructs a TripDeal from flight + hotel estimate/offer.
func BuildTripDeal(id, label, destination, checkIn, checkOut, flightOptionID string, flightPrice Monetary, estimate *HotelEstimate, offer *HotelOffer) TripDeal {
	currency := flightPrice.Currency
	td := TripDeal{
		ID:             id,
		Label:          label,
		Destination:    destination,
		CheckIn:        checkIn,
		CheckOut:       checkOut,
		FlightOptionID: flightOptionID,
		FlightPrice:    flightPrice,
		HotelEstimate:  estimate,
		HotelOffer:     offer,
		Currency:       currency,
		Providers:      []string{},
	}

	var hotelAmount float64
	var hotelCurrency string
	status := PriceEstimated

	if offer != nil {
		hotelAmount = offer.TotalPrice.Amount
		hotelCurrency = offer.TotalPrice.Currency
		status = offer.PriceStatus
		hp := offer.TotalPrice
		td.HotelPrice = &hp
		td.Providers = append(td.Providers, offer.Provider)
	} else if estimate != nil {
		td.Providers = appendUnique(td.Providers, estimate.Provider)
		if estimate.Available && estimate.TotalPrice != nil {
			hotelAmount = estimate.TotalPrice.Amount
			hotelCurrency = estimate.TotalPrice.Currency
			status = estimate.PriceStatus
			td.HotelPrice = estimate.TotalPrice
		} else {
			td.TotalPriceStatus = PriceEstimated
			td.Message = firstNonEmpty(estimate.Message, "Hotel prices unavailable")
			return td
		}
	} else {
		td.TotalPriceStatus = PriceEstimated
		td.Message = "Hotel prices unavailable"
		return td
	}

	if hotelCurrency != "" {
		currency = hotelCurrency
		td.Currency = currency
	}
	total := Monetary{Currency: currency, Amount: round2(flightPrice.Amount + hotelAmount)}
	td.TotalPriceStatus = status
	if status == PriceLive || status == PriceConfirmed {
		td.LiveTotal = &total
	} else {
		td.EstimatedTotal = &total
	}
	return td
}

func appendUnique(ss []string, s string) []string {
	if s == "" {
		return ss
	}
	for _, x := range ss {
		if x == s {
			return ss
		}
	}
	return append(ss, s)
}

func firstNonEmpty(vals ...string) string {
	for _, v := range vals {
		if strings.TrimSpace(v) != "" {
			return v
		}
	}
	return ""
}

func round2(v float64) float64 {
	return float64(int(v*100+0.5)) / 100
}

// RankingScore computes a transparent "best value" score for hotel offers.
// Lower is better. Formula: totalPrice / max(guestRating, 1) / max(starRating, 1)
// Documented so we do not claim "best" arbitrarily.
func RankingScore(o HotelOffer) float64 {
	price := o.TotalPrice.Amount
	if price <= 0 {
		return 1e12
	}
	guest := o.GuestRating
	if guest < 1 {
		guest = 1
	}
	stars := o.StarRating
	if stars < 1 {
		stars = 1
	}
	return price / guest / stars
}

// SortHotels sorts offers in place by the given mode.
// Modes: cheapest | best_value | highest_rated | most_popular
func SortHotels(offers []HotelOffer, mode string) {
	switch strings.ToLower(strings.TrimSpace(mode)) {
	case "highest_rated", "rating":
		sortHotelsBy(offers, func(a, b HotelOffer) bool {
			if a.GuestRating != b.GuestRating {
				return a.GuestRating > b.GuestRating
			}
			if a.StarRating != b.StarRating {
				return a.StarRating > b.StarRating
			}
			return a.TotalPrice.Amount < b.TotalPrice.Amount
		})
	case "most_popular", "popular":
		sortHotelsBy(offers, func(a, b HotelOffer) bool {
			if a.ReviewCount != b.ReviewCount {
				return a.ReviewCount > b.ReviewCount
			}
			return a.GuestRating > b.GuestRating
		})
	case "best_value", "value":
		sortHotelsBy(offers, func(a, b HotelOffer) bool {
			return RankingScore(a) < RankingScore(b)
		})
	default: // cheapest
		sortHotelsBy(offers, func(a, b HotelOffer) bool {
			return a.TotalPrice.Amount < b.TotalPrice.Amount
		})
	}
}

func sortHotelsBy(offers []HotelOffer, less func(a, b HotelOffer) bool) {
	// Simple insertion sort — offer lists are typically small (< few hundred).
	for i := 1; i < len(offers); i++ {
		j := i
		for j > 0 && less(offers[j], offers[j-1]) {
			offers[j], offers[j-1] = offers[j-1], offers[j]
			j--
		}
	}
}

// FormatStayLabel builds a short destination getaway label.
func FormatStayLabel(destination string) string {
	d := strings.TrimSpace(destination)
	if d == "" {
		return "Trip Deal"
	}
	return fmt.Sprintf("%s Getaway", d)
}
