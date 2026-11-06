'use strict';

const assert = require('assert');
const { localHmToIso, parseDepArrHm } = require('../src/localTime');

assert.deepStrictEqual(parseDepArrHm('15:40\n3h 45m\n18:25\nTLV'), {
  depHm: '15:40',
  arrHm: '18:25',
});

// TLV winter (UTC+2): 15:40 local → 13:40Z
const dep = localHmToIso('2027-01-07', '15:40', { airport: 'TLV' });
assert.strictEqual(dep, '2027-01-07T13:40:00Z', dep);

// VIE winter (UTC+1): 18:25 local → 17:25Z
const arr = localHmToIso('2027-01-07', '18:25', { afterHm: '15:40', airport: 'VIE' });
assert.strictEqual(arr, '2027-01-07T17:25:00Z', arr);

// Overnight arrival
const late = localHmToIso('2027-01-07', '01:10', { afterHm: '22:00', airport: 'VIE' });
assert.strictEqual(late, '2027-01-08T00:10:00Z', late);

// Distinct clocks → distinct ISO (dedupe must not collapse)
const a = localHmToIso('2027-01-07', '10:30', { airport: 'TLV' });
const b = localHmToIso('2027-01-07', '15:40', { airport: 'TLV' });
assert.notStrictEqual(a, b);

console.log('localTime ok');
