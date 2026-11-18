/**
 * Run: npx --yes tsx src/components/search/searchLoadingPhrases.test.ts
 */
import assert from 'node:assert/strict';
import { pickSearchStatusPhrase } from './searchLoadingPhrases';

assert.match(
  pickSearchStatusPhrase('en', { providersDone: 1, providersTotal: 2, phase: 'searching' }, [
    { provider: 'googleflights2', durationMs: 1000, results: 40 },
  ], false, 0),
  /Kiwi/i,
);

assert.equal(
  pickSearchStatusPhrase('en', { providersDone: 2, providersTotal: 2, phase: 'finalizing' }, [], true, 0),
  'Almost done…',
);

console.log('searchLoadingPhrases.test.ts OK');