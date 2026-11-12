/**
 * Run: npx --yes tsx src/components/search/searchProgressRatio.test.ts
 */
import { searchProgressRatio } from './searchProgressRatio';

function assert(cond: unknown, msg: string): void {
  if (!cond) throw new Error(msg);
}

assert(searchProgressRatio(null, 0) >= 0.05 && searchProgressRatio(null, 0) < 0.2, 'start soft floor');
assert(searchProgressRatio(null, 45_000) > searchProgressRatio(null, 5_000), 'soft crawl increases');

const half = searchProgressRatio({ providersDone: 1, providersTotal: 2, phase: 'searching' }, 0);
const full = searchProgressRatio({ providersDone: 2, providersTotal: 2, phase: 'searching' }, 0);
assert(half > 0.4 && half < 0.6, `half provider share=${half}`);
assert(full > half && full <= 0.9, `full searching=${full}`);

const fin = searchProgressRatio({ providersDone: 2, providersTotal: 2, phase: 'finalizing' }, 0);
assert(fin >= 0.92, `finalizing=${fin}`);

console.log('searchProgressRatio.test.ts OK');
