import assert from 'node:assert/strict';
import { badgesForDualOffers } from './bookingDualDisplay';
import type { PublicBookingOffer } from '../api/booking';

function offer(partial: Partial<PublicBookingOffer>): PublicBookingOffer {
  return {
    provider: 'x',
    domain: 'x.com',
    url: 'https://x.com',
    urlType: 'exact_booking_deeplink',
    matchConfidence: 90,
    currency: 'USD',
    checkedAt: new Date().toISOString(),
    ...partial,
  };
}

{
  const { partnerBadge, airlineBadge, partnerIsLower } = badgesForDualOffers(
    offer({ provider: 'Priceline', price: 728, priceLabel: 'google_flights_partner' }),
    offer({
      provider: 'British Airways',
      price: 185,
      priceLabel: 'airline_direct_prefill',
    }),
  );
  assert.equal(partnerBadge, 'cheapest');
  assert.equal(airlineBadge, 'direct');
  assert.equal(partnerIsLower, true);
}

{
  const { airlineBadge, partnerIsLower } = badgesForDualOffers(
    offer({ provider: 'Priceline', price: 728, priceLabel: 'partner_checkout_price' }),
    offer({ provider: 'British Airways', price: 700, priceLabel: 'airline_direct' }),
  );
  assert.equal(airlineBadge, 'lowest');
  assert.equal(partnerIsLower, false);
}

{
  const { partnerBadge, airlineBadge } = badgesForDualOffers(
    offer({ provider: 'Priceline', price: 400, priceLabel: 'google_flights_partner' }),
    offer({
      provider: 'Aegean Airlines',
      price: undefined,
      currency: '',
      priceLabel: 'airline_direct_prefill',
    }),
  );
  assert.equal(partnerBadge, 'cheapest');
  assert.equal(airlineBadge, 'direct');
}

console.log('bookingDualDisplay.test.ts: ok');
