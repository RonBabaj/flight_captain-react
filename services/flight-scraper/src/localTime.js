'use strict';

/** IATA → IANA (subset aligned with backend/search/airport_tz.go). */
const AIRPORT_TZ = {
  TLV: 'Asia/Jerusalem',
  HFA: 'Asia/Jerusalem',
  VIE: 'Europe/Vienna',
  SZG: 'Europe/Vienna',
  FRA: 'Europe/Berlin',
  MUC: 'Europe/Berlin',
  BER: 'Europe/Berlin',
  ZRH: 'Europe/Zurich',
  GVA: 'Europe/Zurich',
  CDG: 'Europe/Paris',
  ORY: 'Europe/Paris',
  AMS: 'Europe/Amsterdam',
  FCO: 'Europe/Rome',
  MXP: 'Europe/Rome',
  MAD: 'Europe/Madrid',
  BCN: 'Europe/Madrid',
  LHR: 'Europe/London',
  LGW: 'Europe/London',
  STN: 'Europe/London',
  IST: 'Europe/Istanbul',
  ATH: 'Europe/Athens',
  BUD: 'Europe/Budapest',
  PRG: 'Europe/Prague',
  WAW: 'Europe/Warsaw',
  CPH: 'Europe/Copenhagen',
  DXB: 'Asia/Dubai',
  JFK: 'America/New_York',
  EWR: 'America/New_York',
  LAX: 'America/Los_Angeles',
  SFO: 'America/Los_Angeles',
  ORD: 'America/Chicago',
};

function tzForAirport(code) {
  const c = String(code || '')
    .trim()
    .toUpperCase();
  return AIRPORT_TZ[c] || 'UTC';
}

/** Offset (ms) such that local = utc + offset for this instant in `timeZone`. */
function tzOffsetMs(utcDate, timeZone) {
  const dtf = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  });
  const parts = dtf.formatToParts(utcDate);
  const map = {};
  for (const p of parts) {
    if (p.type !== 'literal') map[p.type] = p.value;
  }
  const asUTC = Date.UTC(
    Number(map.year),
    Number(map.month) - 1,
    Number(map.day),
    Number(map.hour),
    Number(map.minute),
    Number(map.second),
  );
  return asUTC - utcDate.getTime();
}

/**
 * Build an ISO-8601 UTC timestamp from a YMD date + local HH:MM at an airport.
 * Overnight: when arrival clock is earlier than departure, bump the calendar day.
 */
function localHmToIso(dateYmd, hm, { afterHm, airport } = {}) {
  const ymd = String(dateYmd || '').slice(0, 10);
  const m = String(hm || '')
    .trim()
    .match(/^(\d{1,2}):(\d{2})$/);
  if (!ymd || !m) return '';
  const hour = Number(m[1]);
  const min = Number(m[2]);
  if (hour > 23 || min > 59) return '';

  const [y, mo, d] = ymd.split('-').map(Number);
  if (!y || !mo || !d) return '';

  let day = d;
  if (afterHm) {
    const am = String(afterHm)
      .trim()
      .match(/^(\d{1,2}):(\d{2})$/);
    if (am) {
      const afterMin = Number(am[1]) * 60 + Number(am[2]);
      const thisMin = hour * 60 + min;
      if (thisMin < afterMin) day += 1;
    }
  }

  const tz = tzForAirport(airport);
  // Treat wall clock as if UTC, then subtract the zone offset at that instant.
  const utcGuess = new Date(Date.UTC(y, mo - 1, day, hour, min, 0));
  if (Number.isNaN(utcGuess.getTime())) return '';
  const offset = tzOffsetMs(utcGuess, tz);
  const real = new Date(utcGuess.getTime() - offset);
  return real.toISOString().replace(/\.\d{3}Z$/, 'Z');
}

/** Parse first two HH:MM tokens from free text (dep / arr). */
function parseDepArrHm(text) {
  const matches = String(text || '').match(/\b([01]?\d|2[0-3]):([0-5]\d)\b/g) || [];
  if (matches.length < 2) return null;
  return { depHm: matches[0], arrHm: matches[1] };
}

module.exports = { localHmToIso, parseDepArrHm, tzForAirport, AIRPORT_TZ };
