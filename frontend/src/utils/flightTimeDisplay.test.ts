/**
 * Flight time display — airport mode must match airline / Google Flights wall clocks.
 * Run: npx --yes tsx src/utils/flightTimeDisplay.test.ts
 */
import { formatFlightTime, formatFlightShortDate } from './flightTimeDisplay';

function assert(cond: unknown, msg: string): void {
  if (!cond) throw new Error(msg);
}

// After backend parse: SZG local 06:30 in January (CET) is 05:30 UTC.
const szgDep = '2027-01-14T05:30:00.000Z';
assert(
  formatFlightTime(szgDep, 'SZG', 'airport', 'en-US') === '06:30',
  `airport mode should show SZG wall clock 06:30, got ${formatFlightTime(szgDep, 'SZG', 'airport')}`,
);
assert(
  formatFlightTime(szgDep, 'SZG', 'utc', 'en-US') === '05:30',
  `utc mode should show 05:30, got ${formatFlightTime(szgDep, 'SZG', 'utc')}`,
);

// TLV arrival 15:30 local in January (IST UTC+2) → 13:30 UTC
const tlvArr = '2027-01-14T13:30:00.000Z';
assert(
  formatFlightTime(tlvArr, 'TLV', 'airport', 'en-US') === '15:30',
  `airport mode should show TLV wall clock 15:30, got ${formatFlightTime(tlvArr, 'TLV', 'airport')}`,
);

assert(
  formatFlightShortDate(szgDep, 'SZG', 'airport', 'en-US').includes('14'),
  `short date should keep Jan 14, got ${formatFlightShortDate(szgDep, 'SZG', 'airport')}`,
);

console.log('flightTimeDisplay.test.ts: OK');
