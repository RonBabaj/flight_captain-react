'use strict';

/** Minimal ISO2 → Kiwi URL country slug (extend as needed). */
const COUNTRY = {
  IL: 'israel',
  AT: 'austria',
  DE: 'germany',
  GB: 'united-kingdom',
  US: 'united-states',
  FR: 'france',
  ES: 'spain',
  IT: 'italy',
  GR: 'greece',
  CY: 'cyprus',
  TR: 'turkey',
  NL: 'netherlands',
  BE: 'belgium',
  CH: 'switzerland',
  // Kiwi path slugs use "czechia" (not "czech-republic") — wrong slug redirects to homepage.
  CZ: 'czechia',
  HU: 'hungary',
  PL: 'poland',
  PT: 'portugal',
  RO: 'romania',
  BG: 'bulgaria',
  HR: 'croatia',
  RS: 'serbia',
  AE: 'united-arab-emirates',
  JO: 'jordan',
  GE: 'georgia',
  AM: 'armenia',
  AZ: 'azerbaijan',
  EG: 'egypt',
  TH: 'thailand',
  JP: 'japan',
  KR: 'south-korea',
  CN: 'china',
  IN: 'india',
  CA: 'canada',
  AU: 'australia',
  BR: 'brazil',
  MX: 'mexico',
  SE: 'sweden',
  NO: 'norway',
  DK: 'denmark',
  FI: 'finland',
  IE: 'ireland',
  LT: 'lithuania',
  LV: 'latvia',
  EE: 'estonia',
  SK: 'slovakia',
  SI: 'slovenia',
  MT: 'malta',
  LU: 'luxembourg',
  IS: 'iceland',
  UA: 'ukraine',
  MD: 'moldova',
  AL: 'albania',
  MK: 'north-macedonia',
  BA: 'bosnia-and-herzegovina',
  ME: 'montenegro',
  XK: 'kosovo',
};

/** Common IATA → Kiwi path slug (city-country). Prefer over heuristics. */
const IATA_SLUG = {
  TLV: 'tel-aviv-israel',
  VIE: 'vienna-austria',
  BUD: 'budapest-hungary',
  PRG: 'prague-czechia',
  ATH: 'athens-greece',
  LCA: 'larnaca-cyprus',
  HER: 'heraklion-crete-greece',
  SKG: 'thessaloniki-greece',
  IST: 'istanbul-turkey',
  SAW: 'istanbul-turkey',
  AYT: 'antalya-turkey',
  AMS: 'amsterdam-netherlands',
  BCN: 'barcelona-spain',
  MAD: 'madrid-spain',
  FCO: 'rome-italy',
  MXP: 'milan-italy',
  CDG: 'paris-france',
  ORY: 'paris-france',
  LHR: 'london-united-kingdom',
  LGW: 'london-united-kingdom',
  STN: 'london-united-kingdom',
  LTN: 'london-united-kingdom',
  FRA: 'frankfurt-germany',
  MUC: 'munich-germany',
  BER: 'berlin-germany',
  DUS: 'dusseldorf-germany',
  ZRH: 'zurich-switzerland',
  GVA: 'geneva-switzerland',
  WAW: 'warsaw-poland',
  KRK: 'krakow-poland',
  OTP: 'bucharest-romania',
  SOF: 'sofia-bulgaria',
  BEG: 'belgrade-serbia',
  ZAG: 'zagreb-croatia',
  DBV: 'dubrovnik-croatia',
  SPU: 'split-croatia',
  DXB: 'dubai-united-arab-emirates',
  AUH: 'abu-dhabi-united-arab-emirates',
  JFK: 'new-york-city-new-york-united-states',
  EWR: 'new-york-city-new-york-united-states',
  LGA: 'new-york-city-new-york-united-states',
  LAX: 'los-angeles-california-united-states',
  MIA: 'miami-florida-united-states',
  BKK: 'bangkok-thailand',
  HKT: 'phuket-thailand',
  TBS: 'tbilisi-georgia',
  BUS: 'batumi-georgia',
  EVN: 'yerevan-armenia',
  AMM: 'amman-jordan',
  CAI: 'cairo-egypt',
  LIS: 'lisbon-portugal',
  OPO: 'porto-portugal',
  BRU: 'brussels-belgium',
  CPH: 'copenhagen-denmark',
  ARN: 'stockholm-sweden',
  OSL: 'oslo-norway',
  HEL: 'helsinki-finland',
  DUB: 'dublin-ireland',
  VNO: 'vilnius-lithuania',
  RIX: 'riga-latvia',
  TLL: 'tallinn-estonia',
};

function slugify(s) {
  return String(s || '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Resolve Kiwi URL place slug for an IATA code.
 * Optional hint: { cityName, countryCode } from caller.
 */
function kiwiPlaceSlug(iata, hint = {}) {
  const code = String(iata || '').toUpperCase();
  if (IATA_SLUG[code]) return IATA_SLUG[code];
  const city = slugify(hint.cityName);
  const country = COUNTRY[String(hint.countryCode || '').toUpperCase()] || slugify(hint.countryName);
  if (city && country) return `${city}-${country}`;
  // Last resort: lowercase IATA (often fails on current Kiwi SPA — prefer mapped slugs).
  return code.toLowerCase();
}

module.exports = { kiwiPlaceSlug, IATA_SLUG, COUNTRY };
