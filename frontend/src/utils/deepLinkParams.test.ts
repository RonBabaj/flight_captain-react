/**
 * Lightweight assertions for stale-session URL vs route.params merging.
 * Run: npx --yes tsx src/utils/deepLinkParams.test.ts
 */

import { mergeDeepLinkParams } from './deepLinkParams';

function assert(cond: unknown, msg: string): void {
  if (!cond) throw new Error(msg);
}

// Simulate window.location.search for parseSearchParamsFromUrl inside merge.
(globalThis as any).window = {
  location: {
    search:
      '?sessionId=sess_dll0keke7b9i&origin=TLV&destination=VIE&departureDate=2027-01-07&returnDate=2027-01-14&adults=1&currency=USD&cabinClass=ECONOMY',
  },
};

const stale = mergeDeepLinkParams({});
assert(stale.sessionId === 'sess_dll0keke7b9i', `expected URL session, got ${stale.sessionId}`);

const cleared = mergeDeepLinkParams({ sessionId: '' });
assert(
  cleared.sessionId === undefined,
  `explicit empty route sessionId must not fall back to URL, got ${cleared.sessionId}`,
);
assert(cleared.origin === 'TLV' || cleared.origin === undefined, 'origin ok');

const kept = mergeDeepLinkParams({ sessionId: 'sess_new' });
assert(kept.sessionId === 'sess_new', `route sessionId must win, got ${kept.sessionId}`);

console.log('deepLinkParams.test.ts: ok');
