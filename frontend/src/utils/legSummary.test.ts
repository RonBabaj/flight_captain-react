/**
 * Run: npx --yes tsx src/utils/legSummary.test.ts
 */
import { formatDuration, railConnectionLabel } from './legSummary';

const t = (key: string) =>
  ({
    direct: 'Direct',
    stop: 'stop',
    stops: 'stops',
    connection_unclear: 'Connection',
  }[key] || key);

function assert(cond: unknown, msg: string): void {
  if (!cond) throw new Error(msg);
}

assert(formatDuration(18 * 60 + 20) === '18h 20m', 'formatDuration');
assert(railConnectionLabel({ stopsCount: 0, layovers: [] }, t) === 'Direct', 'direct');
assert(
  railConnectionLabel({ stopsCount: 0, layovers: [] }, t, { selfTransfer: true }) === 'Connection',
  'self-transfer zero-stop is not Direct',
);

assert(
  railConnectionLabel({ stopsCount: 1, layovers: [{ airportCode: 'WAW', minutes: 18 * 60 + 20 }] }, t) ===
    '1 stop · 18h 20m',
  'single layover duration',
);

assert(
  railConnectionLabel(
    {
      stopsCount: 2,
      layovers: [
        { airportCode: 'LCA', minutes: 45 },
        { airportCode: 'ZRH', minutes: 10 * 60 + 45 },
      ],
    },
    t,
  ) === '2 stops · 11h 30m',
  'sum of multi layover minutes',
);

assert(
  railConnectionLabel({ stopsCount: 1, layovers: [{ airportCode: 'FRA', minutes: 0 }] }, t) === '1 stop',
  'stops only when minutes missing',
);

console.log('legSummary.test.ts: OK');
