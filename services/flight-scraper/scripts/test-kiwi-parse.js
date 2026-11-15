'use strict';

const assert = require('assert');
const { extractKiwiUmbrella, kiwiUmbrellaSettled } = require('../src/sites/kiwiParse');

const seg = (from, to, dep, arr, carrier, code) => ({
  segment: {
    source: { station: { code: from }, localTime: dep, utcTimeIso: `${dep}Z` },
    destination: { station: { code: to }, localTime: arr },
    carrier: { code: carrier, name: carrier },
    code,
  },
});
const itinerary = (price, outbound, inbound) => ({
  price: { amount: String(price) },
  outbound: { sectorSegments: outbound },
  inbound: { sectorSegments: inbound },
  travelHack: { isVirtualInterlining: outbound.length > 1 },
  bookingOptions: {
    edges: [
      { node: { price: { amount: String(price + 100) }, bookingUrl: '/en/booking/?currency=eur&token=pricier' } },
      { node: { price: { amount: String(price) }, bookingUrl: '/en/booking/?currency=eur&token=match' } },
    ],
  },
});
const payload = (hasMorePending, itineraries) => ({
  data: { returnItineraries: { metadata: { hasMorePending }, itineraries } },
});

const req = { origin: 'TLV', destination: 'BCN', departureDate: '2027-02-10', returnDate: '2027-02-17', currency: 'USD' };
const pending = payload(true, [
  itinerary(
    322,
    [seg('TLV', 'BCN', '2027-02-10T10:05:00', '2027-02-10T13:45:00', 'BZ', '252')],
    [seg('BCN', 'TLV', '2027-02-17T14:45:00', '2027-02-17T20:00:00', 'BZ', '251')],
  ),
  itinerary(
    199,
    [
      seg('TLV', 'VCE', '2027-02-10T10:55:00', '2027-02-10T13:55:00', 'W4', '6736'),
      seg('VCE', 'BCN', '2027-02-10T22:20:00', '2027-02-11T00:20:00', 'VY', '6095'),
    ],
    [seg('BCN', 'TLV', '2027-02-17T14:45:00', '2027-02-17T20:00:00', 'BZ', '251')],
  ),
  itinerary(150, [seg('TLV', 'BCN', '2027-02-10T10:05:00', '2027-02-10T13:45:00', 'BZ', '252')], []),
]);

const offers = extractKiwiUmbrella([pending], req);
assert.strictEqual(offers.length, 2, 'round trip without a return sector is dropped');
assert.strictEqual(offers[0].price, 199, 'cheapest first');
assert.strictEqual(offers[0].currency, 'EUR', 'currency from the booking URL, not the request');
assert.strictEqual(offers[0].bookingUrl, 'https://www.kiwi.com/en/booking/?currency=eur&token=match');
assert.strictEqual(offers[0].selfTransfer, true);
assert.deepStrictEqual(
  offers[0].segments.map((s) => `${s.leg}:${s.fromCode}-${s.toCode}:${s.flightNumber}`),
  ['outbound:TLV-VCE:W46736', 'outbound:VCE-BCN:VY6095', 'inbound:BCN-TLV:BZ251'],
);
assert.strictEqual(offers[0].segments[0].departureTime, '2027-02-10T10:55:00', 'airport wall clock');

assert.strictEqual(kiwiUmbrellaSettled([pending]), false);
assert.strictEqual(kiwiUmbrellaSettled([pending, payload(false, pending.data.returnItineraries.itineraries)]), true);
assert.deepStrictEqual(extractKiwiUmbrella([{ data: { other: {} } }], req), []);

console.log('kiwi parse ok');
