import assert from 'node:assert/strict';
import {
  formatBookingOfferPriceAmount,
  formatBookingOfferPriceDisplay,
} from './bookingOfferDisplay';
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

const t = (key: string) => key;

{
  const amount = formatBookingOfferPriceAmount(
    offer({ price: 185, priceLabel: 'airline_direct_prefill' }),
    t,
  );
  assert.equal(amount, null);
  assert.equal(
    formatBookingOfferPriceDisplay(offer({ price: 185, priceLabel: 'airline_direct_prefill' }), t),
    '—',
  );
}

{
  const amount = formatBookingOfferPriceAmount(
    offer({ price: 728, priceLabel: 'google_flights_partner' }),
    t,
  );
  assert.ok(amount && amount.includes('728'));
  assert.equal(
    formatBookingOfferPriceDisplay(offer({ price: 728, priceLabel: 'google_flights_partner' }), t),
    amount,
  );
}

{
  assert.equal(
    formatBookingOfferPriceDisplay(offer({ price: undefined, priceLabel: 'airline_direct' }), t),
    '—',
  );
}

console.log('bookingOfferDisplay.test.ts: ok');
