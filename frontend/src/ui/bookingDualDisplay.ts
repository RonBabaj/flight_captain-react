import type { PublicBookingOffer } from '../api/booking';

export type BookingDisplayBadge = 'cheapest' | 'direct' | 'partner' | 'lowest';

function offerPriceAmount(offer: PublicBookingOffer): number | null {
  if (offer.price == null || offer.price <= 0) return null;
  return offer.price;
}

/** Pick honest card badges from comparable numeric prices. */
export function badgesForDualOffers(
  partner: PublicBookingOffer,
  airline: PublicBookingOffer,
): { partnerBadge: BookingDisplayBadge; airlineBadge: BookingDisplayBadge; partnerIsLower: boolean } {
  const pp = offerPriceAmount(partner);
  const ap = offerPriceAmount(airline);
  const airlineBadge: BookingDisplayBadge = 'direct';

  if (pp == null && ap == null) {
    return { partnerBadge: 'partner', airlineBadge, partnerIsLower: false };
  }
  if (pp == null) {
    return { partnerBadge: 'partner', airlineBadge: ap != null ? 'lowest' : airlineBadge, partnerIsLower: false };
  }
  if (ap == null) {
    return { partnerBadge: 'cheapest', airlineBadge, partnerIsLower: true };
  }

  const partnerIsLower = pp < ap;
  const tie = Math.abs(pp - ap) < 1;

  if (tie) {
    return { partnerBadge: 'partner', airlineBadge, partnerIsLower: false };
  }
  if (partnerIsLower) {
    return { partnerBadge: 'cheapest', airlineBadge, partnerIsLower: true };
  }
  return { partnerBadge: 'partner', airlineBadge: 'lowest', partnerIsLower: false };
}

export function badgeToTranslationKey(badge: BookingDisplayBadge): string {
  switch (badge) {
    case 'cheapest':
      return 'booking_badge_cheapest';
    case 'lowest':
      return 'booking_badge_lowest';
    case 'partner':
      return 'booking_badge_partner';
    default:
      return 'booking_badge_direct';
  }
}