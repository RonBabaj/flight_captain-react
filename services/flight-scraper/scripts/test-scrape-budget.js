'use strict';

const assert = require('assert');
const { siteTimeBudgetMs, totalScrapeBudgetMs, siteEnvCapMs } = require('../src/scrapeBudget');

assert(totalScrapeBudgetMs() >= 120_000);

const sky = siteTimeBudgetMs('skyscanner', 400_000, 2, {});
const kiwi = siteTimeBudgetMs('kiwi', 400_000, 2, {});
assert(sky <= siteEnvCapMs('skyscanner'), 'sky share capped by env');
assert(kiwi <= siteEnvCapMs('kiwi'), 'kiwi share capped by env');
assert(sky >= 15_000 && kiwi >= 15_000);

const pxSky = siteTimeBudgetMs('skyscanner', 200_000, 1, { skyscannerPxCooldown: true });
assert(pxSky <= 90_000, 'PX cooldown shrinks sky budget');

console.log('test-scrape-budget.js OK');