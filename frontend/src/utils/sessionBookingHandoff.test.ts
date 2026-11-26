import assert from 'node:assert/strict';
import {
  sessionBookingResolveFromOption,
  sessionCheckoutUrlFromOption,
} from './sessionBookingHandoff';
import type { FlightOption } from '../types';

const kiwi = {
  id: 'opt_0',
  source: 'kiwi',
  vendorName: 'Kiwi.com',
  price: { amount: 88, currency: 'USD' },
  durationMinutes: 120,
  legs: [],
  deepLink:
    'https://www.kiwi.com/en/booking/?direct=true&locale=en&currency=eur&passengers=1-0-0&token=abc',
} as FlightOption;

assert.equal(
  sessionCheckoutUrlFromOption(kiwi),
  kiwi.deepLink,
);
const seeded = sessionBookingResolveFromOption(kiwi);
assert.equal(seeded?.found, true);
assert.equal(seeded?.offer?.url, kiwi.deepLink);

const skyBad = {
  ...kiwi,
  source: 'skyscanner',
  deepLink: 'https://www.skyscanner.net/transport/flights/tlv/vie/',
} as FlightOption;
assert.equal(sessionCheckoutUrlFromOption(skyBad), null);

const skyOk = {
  ...kiwi,
  source: 'skyscanner',
  deepLink:
    'https://www.skyscanner.net/transport_deeplink/4.0/IL/en/USD/air/os?itinerary=xyz',
} as FlightOption;
assert.equal(sessionCheckoutUrlFromOption(skyOk), skyOk.deepLink);

console.log('sessionBookingHandoff.test.ts: ok');