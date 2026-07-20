/**
 * UTC YYYY-MM-DD helpers for flight search (future departures).
 */

/** Next calendar day in UTC (matches DateRangePicker "earliest selectable"). */
export function tomorrowYmdUtc(): string {
  const d = new Date();
  const t = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() + 1));
  return t.toISOString().slice(0, 10);
}

const pad2 = (n: number) => String(n).padStart(2, '0');

/**
 * First departure date in [year, month] that is still bookable (>= tomorrow UTC).
 * If every day in that month is already before tomorrow, returns tomorrow (may be in the next month).
 */
export function firstBookableDepartureInMonth(year: number, month: number): string {
  const lastDay = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const firstOfMonth = `${year}-${pad2(month)}-01`;
  const lastOfMonth = `${year}-${pad2(month)}-${pad2(lastDay)}`;
  const tomorrowStr = tomorrowYmdUtc();

  if (tomorrowStr > lastOfMonth) {
    return tomorrowStr;
  }
  if (firstOfMonth >= tomorrowStr) {
    return firstOfMonth;
  }
  return tomorrowStr;
}

export function addDaysYmdUtc(departureYmd: string, days: number): string {
  const t = new Date(departureYmd + 'T12:00:00Z').getTime() + days * 86400000;
  return new Date(t).toISOString().slice(0, 10);
}

/**
 * Normalize Explore (deals) departure/return: never use today or past departures.
 */
export function clampExploreDealsDates(
  departureYmd: string | undefined,
  returnYmd: string | undefined,
  durationDays: number,
  yearMonth: { year: number; month: number },
): { departureDate: string; returnDate: string } {
  const tomorrowStr = tomorrowYmdUtc();
  let dep = departureYmd;
  if (!dep || dep < tomorrowStr) {
    dep = firstBookableDepartureInMonth(yearMonth.year, yearMonth.month);
  }
  if (dep < tomorrowStr) {
    dep = tomorrowStr;
  }
  let ret =
    returnYmd && returnYmd > dep
      ? returnYmd
      : addDaysYmdUtc(dep, Math.max(1, durationDays));
  if (ret <= dep) {
    ret = addDaysYmdUtc(dep, Math.max(1, durationDays));
  }
  return { departureDate: dep, returnDate: ret };
}

/** Search-mode Explore: clamp departure to tomorrow+; fix return if needed. */
export function clampExploreSearchDates(
  departureYmd: string | undefined,
  returnYmd: string | undefined,
  tripIsRoundTrip: boolean,
): { departureDate: string; returnDate: string } {
  const tomorrowStr = tomorrowYmdUtc();
  let dep = departureYmd || tomorrowStr;
  if (dep < tomorrowStr) dep = tomorrowStr;
  let ret = returnYmd || '';
  if (tripIsRoundTrip) {
    if (!ret || ret <= dep) {
      ret = addDaysYmdUtc(dep, 7);
    }
  } else {
    ret = '';
  }
  return { departureDate: dep, returnDate: ret };
}
