'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { buildWarmUrlsForPass } = require('./warmPolicy');

function withEnv(overrides, fn) {
  const prev = {};
  for (const key of Object.keys(overrides)) {
    prev[key] = process.env[key];
    const v = overrides[key];
    if (v === undefined) delete process.env[key];
    else process.env[key] = v;
  }
  try {
    fn();
  } finally {
    for (const key of Object.keys(overrides)) {
      if (prev[key] === undefined) delete process.env[key];
      else process.env[key] = prev[key];
    }
  }
}

test('loop pass is Kiwi-only by default', () => {
  withEnv({ SCRAPER_WARM_LOOP_SKY: '0', SCRAPER_WARM_SKY_ON_START: '0' }, () => {
    const loop = buildWarmUrlsForPass({ startupWarmPass: false, skyscannerBlockedUntil: 0 });
    assert.equal(loop.length, 1);
    assert.match(loop[0], /kiwi\.com/);
  });
});

test('startup can opt in to Sky warm', () => {
  withEnv({ SCRAPER_WARM_LOOP_SKY: '0', SCRAPER_WARM_SKY_ON_START: '1' }, () => {
    const start = buildWarmUrlsForPass({ startupWarmPass: true, skyscannerBlockedUntil: 0 });
    assert.ok(start.some((u) => /skyscanner/i.test(u)));
  });
});