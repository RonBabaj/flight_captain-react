/**
 * Results cache trust rules for airport-absolute times.
 * Run: npx --yes tsx src/api/searchCacheTrust.test.ts
 */

function isTrustedTimeSchema(data: { session?: { timeSchemaVersion?: number } } | null | undefined): boolean {
  const v = data?.session?.timeSchemaVersion;
  return typeof v === 'number' && v >= 1;
}

function assert(cond: unknown, msg: string): void {
  if (!cond) throw new Error(msg);
}

assert(!isTrustedTimeSchema(null), 'null untrusted');
assert(!isTrustedTimeSchema({ session: {} }), 'missing schema untrusted');
assert(!isTrustedTimeSchema({ session: { timeSchemaVersion: 0 } }), 'schema 0 untrusted');
assert(isTrustedTimeSchema({ session: { timeSchemaVersion: 1 } }), 'schema 1 trusted');

console.log('searchCacheTrust.test.ts: OK');
