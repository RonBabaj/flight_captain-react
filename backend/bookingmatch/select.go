package bookingmatch

import "sort"

// urlTypeRank lower is better (more specific).
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

// SelectBestOffer picks the best verified offer from scored candidates.
// Only StatusVerifiedExact offers with safe URLs are eligible; unverified offers are never returned.
func SelectBestOffer(offers []BookingOffer) *BookingOffer {
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

	sort.SliceStable(verified, func(i, j int) bool {
		a, b := verified[i], verified[j]
		ra, rb := urlTypeRank(a.URLType), urlTypeRank(b.URLType)
		if ra != rb {
			return ra < rb
		}
		if a.MatchScore != b.MatchScore {
			return a.MatchScore > b.MatchScore
		}
		if a.Price != nil && b.Price != nil && *a.Price != *b.Price {
			return *a.Price < *b.Price
		}
		if a.Price != nil && b.Price == nil {
			return true
		}
		return false
	})

	best := verified[0]
	return &best
}
