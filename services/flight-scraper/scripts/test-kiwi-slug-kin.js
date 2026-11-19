'use strict';

const assert = require('assert');
const { kiwiPlaceSlug } = require('../src/sites/kiwiPlaces');

assert.strictEqual(kiwiPlaceSlug('KIN'), 'kingston-jamaica');
assert.strictEqual(kiwiPlaceSlug('MBJ'), 'montego-bay-jamaica');
assert.strictEqual(kiwiPlaceSlug('TLV'), 'tel-aviv-israel');
const urlBit = `${kiwiPlaceSlug('TLV')}/${kiwiPlaceSlug('KIN')}`;
assert.ok(urlBit.includes('kingston-jamaica'), urlBit);

console.log('test-kiwi-slug-kin.js OK');