'use strict';

const assert = require('assert');
const {
  airlinesFromCardText,
  pickSessionBookingUrl,
  extractUnifiedOffers,
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

console.log('skyscanner parse ok');
