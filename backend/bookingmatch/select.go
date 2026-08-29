package bookingmatch

import (
	"sort"

	"flightcaptainweb/search"
)

// PriceNormalizer converts an amount from one currency to another for comparison.
type PriceNormalizer func(amount float64, fromCurr, toCurr string) (float64, string)

// QuoteBinding is the search-time fare shown to the user (for price matching).
type QuoteBinding struct {
	Amount   float64
	Currency string
}

// DefaultCompareCurrency is used when normalizing offer prices for comparison.
const DefaultCompareCurrency = "USD"

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

func normalizedQuoteAmount(q QuoteBinding, compareCurr string, normalize PriceNormalizer) (float64, bool) {
	if q.Amount <= 0 {
		return 0, false
	}
	from := q.Currency
	if from == "" {
		from = compareCurr
	}
	if normalize == nil {
		if from == compareCurr {
			return q.Amount, true
		}
		return 0, false
	}
	amount, cur := normalize(q.Amount, from, compareCurr)
	if amount <= 0 {
		return 0, false
	}
	if cur == "" {
		cur = compareCurr
	}
	return amount, true
}

type offerCandidate struct {
	offer      BookingOffer
	normPrice  float64
	hasPrice   bool
	quoteMatch bool
}

// SelectBestOffer picks the best verified booking offer.
// Priority: verified exact → valid URL → prefer extracted prices matching search quote →
// cheapest extracted price → fallback to best verified URL without extracted price.
func SelectBestOffer(offers []BookingOffer, normalize PriceNormalizer, quote *QuoteBinding) *BookingOffer {
	compareCurr := DefaultCompareCurrency
	var quoteNorm float64
	hasQuote := false
	if quote != nil && quote.Amount > 0 {
		if n, ok := normalizedQuoteAmount(*quote, compareCurr, normalize); ok {
			quoteNorm = n
			hasQuote = true
		}
	}

	var verified []BookingOffer
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
		verified = append(verified, o)
	}
	if len(verified) == 0 {
		return nil
	}

	var priced, unpriced []offerCandidate
	for _, o := range verified {
		c := offerCandidate{offer: o}
		if np, ok := normalizedOfferPrice(o, compareCurr, normalize); ok {
			c.hasPrice = true
			c.normPrice = np
			if hasQuote {
				c.quoteMatch = search.PricesMatchQuote(quoteNorm, np)
			}
			priced = append(priced, c)
		} else {
			unpriced = append(unpriced, c)
		}
	}

	sortCandidates := func(list []offerCandidate) {
		sort.SliceStable(list, func(i, j int) bool {
			a, b := list[i], list[j]
			if a.quoteMatch != b.quoteMatch {
				return a.quoteMatch
			}
			if a.hasPrice && b.hasPrice && a.normPrice != b.normPrice {
				return a.normPrice < b.normPrice
			}
			ra, rb := urlTypeRank(a.offer.URLType), urlTypeRank(b.offer.URLType)
			if ra != rb {
				return ra < rb
			}
			return a.offer.MatchScore > b.offer.MatchScore
		})
	}

	if len(priced) > 0 {
		sortCandidates(priced)
		best := priced[0].offer
		return &best
	}

	sortCandidates(unpriced)
	best := unpriced[0].offer
	return &best
}
