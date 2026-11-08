'use strict';

const assert = require('assert');
const { parseRoundTripHm, parseDepArrHm } = require('../src/localTime');
const { segmentsFromRoundTripClocks } = require('../src/normalize');
// Avoid requiring sites/skyscanner.js here — it pulls Playwright.

// OW still returns first pair only via parseDepArrHm
assert.deepStrictEqual(parseDepArrHm('01:15\n9h 50m\n10:05\nTLV AMS'), {
  depHm: '01:15',
  arrHm: '10:05',
});

// RT card text has four clocks
const rt = parseRoundTripHm('01:15\n9h 50m\n10:05\nDirect\n14:20\n5h 10m\n19:30\nDirect');
assert.deepStrictEqual(rt, {
  outbound: { depHm: '01:15', arrHm: '10:05' },
  inbound: { depHm: '14:20', arrHm: '19:30' },
});

const req = {
  origin: 'TLV',
  destination: 'AMS',
  departureDate: '2026-11-28',
  returnDate: '2026-11-30',
  currency: 'USD',
};
const segs = segmentsFromRoundTripClocks(req, rt);
assert.strictEqual(segs.length, 2, `expected 2 segments, got ${segs.length}`);
assert.strictEqual(segs[0].leg, 'outbound');
assert.strictEqual(segs[0].fromCode, 'TLV');
assert.strictEqual(segs[0].toCode, 'AMS');
assert.strictEqual(segs[1].leg, 'inbound');
assert.strictEqual(segs[1].fromCode, 'AMS');
assert.strictEqual(segs[1].toCode, 'TLV');
assert.ok(segs[0].departureTime);
assert.ok(segs[1].departureTime);
assert.notStrictEqual(segs[0].departureTime.slice(0, 10), segs[1].departureTime.slice(0, 10));

// Without returnDate, only outbound is emitted even if 4 clocks present
const owSegs = segmentsFromRoundTripClocks({ ...req, returnDate: '' }, rt);
assert.strictEqual(owSegs.length, 1);
assert.strictEqual(owSegs[0].leg, 'outbound');

// French Skyscanner a11y text: outbound clocks come first; return clocks are far later.
const frenchCard =
  "Tus Airways et Smart Wings\n\nOptions de vol 2 : Montant total : 302 €.\n" +
  "Vol aller opéré par Tus Airways\nDépart pour Prague à 13:30 depuis David-Ben-Gourion International. Arrivée à 16:35.\n" +
  "Vol direct d'une durée de 4 heures 5 minutes.\nVol retour opéré par Smart Wings.\n" +
  "Départ pour David-Ben-Gourion International à 23:45 depuis Prague. Arrivée à 04:35, un jour plus tard.";
assert.deepStrictEqual(frenchCard.slice(0, 240).match(/\b([01]?\d|2[0-3]):([0-5]\d)\b/g), [
  '13:30',
  '16:35',
]);
assert.deepStrictEqual(parseRoundTripHm(frenchCard), {
  outbound: { depHm: '13:30', arrHm: '16:35' },
  inbound: { depHm: '23:45', arrHm: '04:35' },
});
const frSegs = segmentsFromRoundTripClocks(req, parseRoundTripHm(frenchCard));
assert.strictEqual(frSegs.length, 2);
assert.strictEqual(frSegs[1].leg, 'inbound');

console.log('roundtrip legs ok');
