/**
 * Lightweight assertions for shared-link param merging + sessionStorage stash.
 * Run: npx --yes tsx src/utils/deepLinkParams.test.ts
 */

import { mergeDeepLinkParams } from './deepLinkParams';
import { clearSharedLinkCache, readSharedLinkCache, rememberSharedLink } from './sharedLinkCache';

function assert(cond: unknown, msg: string): void {
  if (!cond) throw new Error(msg);
}

const store: Record<string, string> = {};
(globalThis as any).window = {
  location: {
    search:
      '?sessionId=sess_dll0keke7b9i&origin=TLV&destination=VIE&departureDate=2027-01-07&returnDate=2027-01-14&adults=1&currency=USD&cabinClass=ECONOMY',
  },
  sessionStorage: {
    getItem: (k: string) => (k in store ? store[k] : null),
    setItem: (k: string, v: string) => {
      store[k] = v;
    },
    removeItem: (k: string) => {
      delete store[k];
    },
  },
};

clearSharedLinkCache();

const fromUrl = mergeDeepLinkParams({});
assert(fromUrl.sessionId === 'sess_dll0keke7b9i', `expected URL session, got ${fromUrl.sessionId}`);
assert(readSharedLinkCache()?.sessionId === 'sess_dll0keke7b9i', 'URL open must stash sessionId');

// SearchForm shared-link recovery navigates with sessionId:'' while URL still has the id.
const recovery = mergeDeepLinkParams({ sessionId: '' });
assert(
  recovery.sessionId === 'sess_dll0keke7b9i',
  `empty route sessionId must fall back to URL, got ${recovery.sessionId}`,
);

const kept = mergeDeepLinkParams({ sessionId: 'sess_new' });
assert(kept.sessionId === 'sess_new', `route sessionId must win, got ${kept.sessionId}`);

// Chrome stripped the address bar — recover from sessionStorage stash.
(globalThis as any).window.location.search = '';
clearSharedLinkCache();
rememberSharedLink({
  sessionId: 'sess_stashed',
  origin: 'TLV',
  destination: 'VIE',
  departureDate: '2027-01-07',
});
const fromStash = mergeDeepLinkParams({});
assert(fromStash.sessionId === 'sess_stashed', `expected stash session, got ${fromStash.sessionId}`);
assert(fromStash.origin === 'TLV', 'stash should keep origin');

console.log('deepLinkParams.test.ts: ok');
