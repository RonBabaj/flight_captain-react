/**
 * Results cache trust rules for airport-absolute times.
 * Run: npx --yes tsx src/api/searchCacheTrust.test.ts
 */
import { isTrustedTimeSchema } from './search';

function assert(cond: unknown, msg: string): void {
  if (!cond) throw new Error(msg);
}

assert(!isTrustedTimeSchema(null), 'null untrusted');
assert(!isTrustedTimeSchema({ session: {} }), 'missing schema untrusted');
assert(!isTrustedTimeSchema({ session: { timeSchemaVersion: 0 } }), 'schema 0 untrusted');
assert(isTrustedTimeSchema({ session: { timeSchemaVersion: 1 } }), 'schema 1 trusted');

console.log('searchCacheTrust.test.ts: OK');
