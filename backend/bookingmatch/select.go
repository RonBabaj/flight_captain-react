package bookingmatch

import "sort"

// PriceNormalizer converts an amount from one currency to another for comparison.
// Returns (convertedAmount, effectiveCurrency). When conversion is unavailable,
// return the original amount and currency.
type PriceNormalizer func(amount float64, fromCurr, toCurr string) (float64, string)

// DefaultCompareCurrency is used when normalizing offer prices for comparison.
const DefaultCompareCurrency = "USD"

// urlTypeRank lower is better (more specific booking URL).
func urlTypeRank(t URLType) int {
	switch t {
	case URLTypeExactBooking:
		return 0
	case URLTypeExactSearch:
		return 1
	case URLTypeGenericSearch:
		return 2
	default:
		return 3
	}
}

// normalizedOfferPrice returns a comparable price in compareCurr, or ok=false when unavailable.
func normalizedOfferPrice(o BookingOffer, compareCurr string, normalize PriceNormalizer) (float64, bool) {
	if o.Price == nil || *o.Price <= 0 {
		return 0, false
	}
	from := o.Currency
	if from == "" {
		from = compareCurr
	}
	if normalize == nil {
		if from == compareCurr {
			return *o.Price, true
		}
		return 0, false
	}
	amount, cur := normalize(*o.Price, from, compareCurr)
	if amount <= 0 {
		return 0, false
	}
	if cur == "" {
		cur = compareCurr
	}
	return amount, true
}

// SelectBestOffer picks the cheapest verified offer with a reliable price.
// Only StatusVerifiedExact offers with safe, non-generic URLs and extractable prices are eligible.
func SelectBestOffer(offers []BookingOffer, normalize PriceNormalizer) *BookingOffer {
	compareCurr := DefaultCompareCurrency

	type priced struct {
		offer    BookingOffer
		normPrice float64
	}
	var verified []priced
	for _, o := range offers {
		if o.VerificationStatus != StatusVerifiedExact {
			continue
		}
		if o.URLType == URLTypeGenericSearch {
			continue
		}
		if err := ValidateBookingURL(o.URL); err != nil {
			continue
		}
		np, ok := normalizedOfferPrice(o, compareCurr, normalize)
		if !ok {
			continue
		}
		verified = append(verified, priced{offer: o, normPrice: np})
	}
	if len(verified) == 0 {
		return nil
	}

	sort.SliceStable(verified, func(i, j int) bool {
		a, b := verified[i], verified[j]
		if a.normPrice != b.normPrice {
			return a.normPrice < b.normPrice
		}
		ra, rb := urlTypeRank(a.offer.URLType), urlTypeRank(b.offer.URLType)
		if ra != rb {
			return ra < rb
		}
		return a.offer.MatchScore > b.offer.MatchScore
	})

	best := verified[0].offer
	return &best
}
