'use strict';

const assert = require('assert');
const {
  airlinesFromCardText,
  pickSessionBookingUrl,
  extractUnifiedOffers,
  webUnifiedSettled,
} = require('../src/sites/skyscannerParse');

const frenchCard =
  "Tus Airways et Smart Wings\n\nOptions de vol 2 : Montant total : 302 €.\n" +
  "Vol aller opéré par Tus Airways\nDépart pour Prague à 13:30 depuis David-Ben-Gourion International. Arrivée à 16:35.\n" +
  "Vol direct d'une durée de 4 heures 5 minutes.\nVol retour opéré par Smart Wings.\n" +
  "Départ pour David-Ben-Gourion International à 23:45 depuis Prague. Arrivée à 04:35, un jour plus tard.";

const named = airlinesFromCardText(frenchCard);
assert.strictEqual(named.outbound, 'Tus Airways');
assert.strictEqual(named.inbound, 'Smart Wings');

const english = airlinesFromCardText(
  'Austrian\nOutbound operated by Austrian Airlines\nReturn operated by Austrian Airlines',
);
assert.strictEqual(english.outbound, 'Austrian Airlines');
assert.strictEqual(english.inbound, 'Austrian Airlines');

assert.strictEqual(
  pickSessionBookingUrl([
    'https://www.skyscanner.fr/transport/vols/tlv/vie/270107/270114/',
    '/transport_deeplink/4.0/FR/fr/EUR/air/airli/flights?itinerary=1',
  ]),
  'https://www.skyscanner.net/transport_deeplink/4.0/FR/fr/EUR/air/airli/flights?itinerary=1',
);
assert.strictEqual(
  pickSessionBookingUrl(['https://www.skyscanner.fr/transport/vols/tlv/vie/270107/270114/']),
  '',
);

const req = {
  origin: 'TLV',
  destination: 'VIE',
  departureDate: '2027-01-07',
  returnDate: '2027-01-14',
  currency: 'USD',
};
const offers = extractUnifiedOffers(
  [
    {
      carriers: [{ id: 'OS', name: 'Austrian Airlines', iata: 'OS' }],
      agents: [{ id: 'osag', name: 'Austrian Airlines', type: 'AGENT' }],
      places: [
        { id: 'p1', name: 'Tel Aviv', iata: 'TLV' },
        { id: 'p2', name: 'Vienna', iata: 'VIE' },
      ],
      legs: [
        {
          id: 'l1',
          originPlaceId: 'p1',
          destinationPlaceId: 'p2',
          departureDateTime: '2027-01-07T13:40:00',
          arrivalDateTime: '2027-01-07T17:25:00',
          marketingCarrierIds: ['OS'],
        },
        {
          id: 'l2',
          originPlaceId: 'p2',
          destinationPlaceId: 'p1',
          departureDateTime: '2027-01-14T09:20:00',
          arrivalDateTime: '2027-01-14T12:45:00',
          marketingCarrierIds: ['OS'],
        },
      ],
      itineraries: {
        results: [
          {
            id: 'it1',
            legIds: ['l1', 'l2'],
            pricingOptions: [
              {
                agentIds: ['osag'],
                price: { amount: '279' },
                items: [{ url: '/transport_deeplink/4.0/FR/fr/EUR/air/os?itinerary=it1', agentId: 'osag' }],
              },
            ],
          },
        ],
      },
    },
  ],
  req,
);
assert.strictEqual(offers.length, 1);
assert.strictEqual(offers[0].price, 279);
assert.strictEqual(offers[0].segments.length, 2);
assert.strictEqual(offers[0].segments[0].airlineCode, 'OS');
assert.strictEqual(offers[0].segments[1].leg, 'inbound');
assert.strictEqual(offers[0].segments[1].airlineCode, 'OS');
assert.ok(offers[0].bookingUrl.includes('transport_deeplink'));
assert.strictEqual(offers[0].vendorName, undefined);

const seg = (from, to, dep, arr, code, num) => ({
  origin: { displayCode: from },
  destination: { displayCode: to },
  departure: dep,
  arrival: arr,
  flightNumber: num,
  marketingCarrier: { displayCode: code, name: code },
});
const radar = (status, results) => ({ context: { status }, itineraries: { results } });
const radarItinerary = (price, outSegs, inSegs) => ({
  price: { raw: price },
  legs: [{ segments: outSegs }, { segments: inSegs }],
  pricingOptions: [{ items: [{ url: `/transport_deeplink/4.0/FR/fr-FR/EUR/mtfr/2/x?p=${price}` }] }],
});
const firstPage = radar('incomplete', [
  radarItinerary(
    150,
    [seg('TLV', 'VIE', '2027-01-07T06:00:00', '2027-01-07T09:00:00', 'OS', '858')],
    [seg('VIE', 'TLV', '2027-01-14T10:00:00', '2027-01-14T14:30:00', 'OS', '857')],
  ),
  radarItinerary(
    120,
    [
      seg('TLV', 'ATH', '2027-01-07T05:00:00', '2027-01-07T07:00:00', 'A3', '929'),
      seg('ATH', 'VIE', '2027-01-07T09:00:00', '2027-01-07T10:30:00', 'A3', '860'),
    ],
    [seg('VIE', 'TLV', '2027-01-14T10:00:00', '2027-01-14T14:30:00', 'OS', '857')],
  ),
]);
const radarOffers = extractUnifiedOffers([firstPage], req);
assert.strictEqual(radarOffers.length, 2);
assert.strictEqual(radarOffers[0].price, 120, 'cheapest first');
assert.strictEqual(radarOffers[0].currency, 'EUR', 'currency from the deeplink, not the request');
assert.deepStrictEqual(
  radarOffers[0].segments.map((s) => `${s.leg}:${s.fromCode}-${s.toCode}:${s.flightNumber}`),
  ['outbound:TLV-ATH:A3929', 'outbound:ATH-VIE:A3860', 'inbound:VIE-TLV:OS857'],
);
assert.strictEqual(radarOffers[0].segments[0].departureTime, '2027-01-07T05:00:00');
assert.ok(radarOffers[0].bookingUrl.includes('transport_deeplink'));

assert.strictEqual(webUnifiedSettled([firstPage]), false, 'first page of a pending search');
assert.strictEqual(webUnifiedSettled([radar('complete', firstPage.itineraries.results)]), true);
assert.strictEqual(
  webUnifiedSettled([radar('incomplete', Array(50).fill(firstPage.itineraries.results[0]))]),
  true,
);

console.log('skyscanner parse ok');
