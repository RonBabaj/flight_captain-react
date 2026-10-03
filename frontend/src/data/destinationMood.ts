/**
 * Per-destination mood photography (Unsplash) keyed by IATA / city / country.
 * Used to set travel atmosphere when a destination is selected.
 */

import { getAirportEntry } from './airports';
import { isCountryDestination, parseCountryDestination } from '../types';

export type DestinationMood = {
  /** Stable Unsplash image URL (crop-friendly). */
  imageUrl: string;
  /** Short English place label for overlay fallback. */
  labelEn: string;
  /** Soft accent wash over the photo (hex). */
  accent?: string;
};

/** Popular airport/city codes → mood stills. */
const BY_CODE: Record<string, DestinationMood> = {
  // Europe
  PRG: {
    labelEn: 'Prague',
    imageUrl: 'https://images.unsplash.com/photo-1519677100203-a0e668c92439?auto=format&fit=crop&w=1600&q=80',
    accent: '#1BA7A0',
  },
  PAR: {
    labelEn: 'Paris',
    imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1600&q=80',
    accent: '#0F766E',
  },
  CDG: {
    labelEn: 'Paris',
    imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1600&q=80',
    accent: '#0F766E',
  },
  ORY: {
    labelEn: 'Paris',
    imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1600&q=80',
  },
  LON: {
    labelEn: 'London',
    imageUrl: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1600&q=80',
  },
  LHR: {
    labelEn: 'London',
    imageUrl: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1600&q=80',
  },
  LGW: {
    labelEn: 'London',
    imageUrl: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1600&q=80',
  },
  STN: {
    labelEn: 'London',
    imageUrl: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1600&q=80',
  },
  ROM: {
    labelEn: 'Rome',
    imageUrl: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1600&q=80',
  },
  FCO: {
    labelEn: 'Rome',
    imageUrl: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1600&q=80',
  },
  CIA: {
    labelEn: 'Rome',
    imageUrl: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1600&q=80',
  },
  BCN: {
    labelEn: 'Barcelona',
    imageUrl: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=1600&q=80',
  },
  MAD: {
    labelEn: 'Madrid',
    imageUrl: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?auto=format&fit=crop&w=1600&q=80',
  },
  AMS: {
    labelEn: 'Amsterdam',
    imageUrl: 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?auto=format&fit=crop&w=1600&q=80',
  },
  BER: {
    labelEn: 'Berlin',
    imageUrl: 'https://images.unsplash.com/photo-1560969184-10fe8719e047?auto=format&fit=crop&w=1600&q=80',
  },
  VIE: {
    labelEn: 'Vienna',
    imageUrl: 'https://images.unsplash.com/photo-1516550893923-42d28e5677af?auto=format&fit=crop&w=1600&q=80',
  },
  BUD: {
    labelEn: 'Budapest',
    imageUrl: 'https://images.unsplash.com/photo-1551867633-194f125bddfa?auto=format&fit=crop&w=1600&q=80',
  },
  ATH: {
    labelEn: 'Athens',
    imageUrl: 'https://images.unsplash.com/photo-1555993539-1732b0258235?auto=format&fit=crop&w=1600&q=80',
  },
  IST: {
    labelEn: 'Istanbul',
    imageUrl: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=1600&q=80',
  },
  SAW: {
    labelEn: 'Istanbul',
    imageUrl: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=1600&q=80',
  },
  LIS: {
    labelEn: 'Lisbon',
    imageUrl: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?auto=format&fit=crop&w=1600&q=80',
  },
  DUB: {
    labelEn: 'Dublin',
    imageUrl: 'https://images.unsplash.com/photo-1560707303-4e980ce876ad?auto=format&fit=crop&w=1600&q=80',
  },
  CPH: {
    labelEn: 'Copenhagen',
    imageUrl: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?auto=format&fit=crop&w=1600&q=80',
  },
  ZRH: {
    labelEn: 'Zurich',
    imageUrl: 'https://images.unsplash.com/photo-1515488764276-beab7607c1e6?auto=format&fit=crop&w=1600&q=80',
  },
  GVA: {
    labelEn: 'Geneva',
    imageUrl: 'https://images.unsplash.com/photo-1527668752968-14dc70a27c95?auto=format&fit=crop&w=1600&q=80',
  },
  MUC: {
    labelEn: 'Munich',
    imageUrl: 'https://images.unsplash.com/photo-1595867818082-083862f3d630?auto=format&fit=crop&w=1600&q=80',
  },
  FRA: {
    labelEn: 'Frankfurt',
    imageUrl: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=1600&q=80',
  },
  MIL: {
    labelEn: 'Milan',
    imageUrl: 'https://images.unsplash.com/photo-1513581166391-887a96ddeafd?auto=format&fit=crop&w=1600&q=80',
  },
  MXP: {
    labelEn: 'Milan',
    imageUrl: 'https://images.unsplash.com/photo-1513581166391-887a96ddeafd?auto=format&fit=crop&w=1600&q=80',
  },
  LIN: {
    labelEn: 'Milan',
    imageUrl: 'https://images.unsplash.com/photo-1513581166391-887a96ddeafd?auto=format&fit=crop&w=1600&q=80',
  },
  VCE: {
    labelEn: 'Venice',
    imageUrl: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?auto=format&fit=crop&w=1600&q=80',
  },
  NCE: {
    labelEn: 'Nice',
    imageUrl: 'https://images.unsplash.com/photo-1498503182468-3b51cbb6cb24?auto=format&fit=crop&w=1600&q=80',
  },
  WAW: {
    labelEn: 'Warsaw',
    imageUrl: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=1600&q=80',
  },
  KRK: {
    labelEn: 'Krakow',
    imageUrl: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=1600&q=80',
  },
  // Middle East / Africa / Asia / Americas
  DXB: {
    labelEn: 'Dubai',
    imageUrl: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1600&q=80',
  },
  AUH: {
    labelEn: 'Abu Dhabi',
    imageUrl: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=1600&q=80',
  },
  TLV: {
    labelEn: 'Tel Aviv',
    imageUrl: 'https://images.unsplash.com/photo-1543783207-ec64e4d95325?auto=format&fit=crop&w=1600&q=80',
  },
  ETH: {
    labelEn: 'Eilat',
    imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1600&q=80',
  },
  CAI: {
    labelEn: 'Cairo',
    imageUrl: 'https://images.unsplash.com/photo-1572252009286-268acec5ca0a?auto=format&fit=crop&w=1600&q=80',
  },
  BKK: {
    labelEn: 'Bangkok',
    imageUrl: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=1600&q=80',
  },
  HKT: {
    labelEn: 'Phuket',
    imageUrl: 'https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?auto=format&fit=crop&w=1600&q=80',
  },
  SIN: {
    labelEn: 'Singapore',
    imageUrl: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=1600&q=80',
  },
  TYO: {
    labelEn: 'Tokyo',
    imageUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1600&q=80',
  },
  HND: {
    labelEn: 'Tokyo',
    imageUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1600&q=80',
  },
  NRT: {
    labelEn: 'Tokyo',
    imageUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1600&q=80',
  },
  SEL: {
    labelEn: 'Seoul',
    imageUrl: 'https://images.unsplash.com/photo-1517154421773-0529f29ea451?auto=format&fit=crop&w=1600&q=80',
  },
  ICN: {
    labelEn: 'Seoul',
    imageUrl: 'https://images.unsplash.com/photo-1517154421773-0529f29ea451?auto=format&fit=crop&w=1600&q=80',
  },
  NYC: {
    labelEn: 'New York',
    imageUrl: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=1600&q=80',
  },
  JFK: {
    labelEn: 'New York',
    imageUrl: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=1600&q=80',
  },
  EWR: {
    labelEn: 'New York',
    imageUrl: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=1600&q=80',
  },
  LGA: {
    labelEn: 'New York',
    imageUrl: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=1600&q=80',
  },
  LAX: {
    labelEn: 'Los Angeles',
    imageUrl: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=1600&q=80',
  },
  MIA: {
    labelEn: 'Miami',
    imageUrl: 'https://images.unsplash.com/photo-1533106497176-45ae19e68ba2?auto=format&fit=crop&w=1600&q=80',
  },
  RAK: {
    labelEn: 'Marrakesh',
    imageUrl: 'https://images.unsplash.com/photo-1517824806704-9040b037703b?auto=format&fit=crop&w=1600&q=80',
  },
  CMN: {
    labelEn: 'Casablanca',
    imageUrl: 'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=1600&q=80',
  },
  AYT: {
    labelEn: 'Antalya',
    imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1600&q=80',
  },
  LCA: {
    labelEn: 'Larnaca',
    imageUrl: 'https://images.unsplash.com/photo-1533104816931-20fa691ff6ca?auto=format&fit=crop&w=1600&q=80',
  },
  PFO: {
    labelEn: 'Paphos',
    imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1600&q=80',
  },
  HER: {
    labelEn: 'Heraklion',
    imageUrl: 'https://images.unsplash.com/photo-1533104816931-20fa691ff6ca?auto=format&fit=crop&w=1600&q=80',
  },
  TBS: {
    labelEn: 'Tbilisi',
    imageUrl: 'https://images.unsplash.com/photo-1565008576549-57569a49371d?auto=format&fit=crop&w=1600&q=80',
  },
  EVN: {
    labelEn: 'Yerevan',
    imageUrl: 'https://images.unsplash.com/photo-1565008576549-57569a49371d?auto=format&fit=crop&w=1600&q=80',
  },
};

/** ISO country → mood (for country destinations like FR / IT). */
const BY_COUNTRY: Record<string, DestinationMood> = {
  FR: BY_CODE.PAR,
  GB: BY_CODE.LON,
  IT: BY_CODE.ROM,
  ES: BY_CODE.BCN,
  NL: BY_CODE.AMS,
  DE: BY_CODE.BER,
  AT: BY_CODE.VIE,
  HU: BY_CODE.BUD,
  GR: BY_CODE.ATH,
  TR: BY_CODE.IST,
  PT: BY_CODE.LIS,
  IE: BY_CODE.DUB,
  DK: BY_CODE.CPH,
  CH: BY_CODE.ZRH,
  CZ: BY_CODE.PRG,
  AE: BY_CODE.DXB,
  IL: BY_CODE.TLV,
  EG: BY_CODE.CAI,
  TH: BY_CODE.BKK,
  SG: BY_CODE.SIN,
  JP: BY_CODE.TYO,
  KR: BY_CODE.SEL,
  US: BY_CODE.NYC,
  MA: BY_CODE.RAK,
  CY: BY_CODE.LCA,
  PL: BY_CODE.WAW,
  GE: BY_CODE.TBS,
  AM: BY_CODE.EVN,
};

const FALLBACK: DestinationMood = {
  labelEn: 'Your trip',
  imageUrl: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1600&q=80',
  accent: '#1BA7A0',
};

/** Destinations surfaced on the landing “get in the mood” strip. */
export const LANDING_MOOD_DESTINATIONS: { code: string; mood: DestinationMood }[] = [
  { code: 'PRG', mood: BY_CODE.PRG },
  { code: 'BCN', mood: BY_CODE.BCN },
  { code: 'ATH', mood: BY_CODE.ATH },
  { code: 'LIS', mood: BY_CODE.LIS },
  { code: 'DXB', mood: BY_CODE.DXB },
  { code: 'ROM', mood: BY_CODE.ROM },
  { code: 'AMS', mood: BY_CODE.AMS },
  { code: 'BKK', mood: BY_CODE.BKK },
];

export function resolveDestinationMood(destinationCode: string | undefined | null): DestinationMood | null {
  if (!destinationCode || typeof destinationCode !== 'string') return null;
  const raw = destinationCode.trim().toUpperCase();
  if (!raw || raw === 'ANYWHERE') return null;

  if (isCountryDestination(raw)) {
    const cc = parseCountryDestination(raw) || raw.replace(/^COUNTRY[:-]?/, '');
    return BY_COUNTRY[cc] ?? FALLBACK;
  }

  const direct = BY_CODE[raw];
  if (direct) return direct;

  const entry = getAirportEntry(raw);
  if (entry) {
    const city = (entry.cityCode || '').toUpperCase();
    if (city && BY_CODE[city]) return BY_CODE[city];
    const airport = (entry.airportCode || '').toUpperCase();
    if (airport && BY_CODE[airport]) return BY_CODE[airport];
    const country = (entry.countryCode || '').toUpperCase();
    if (country && BY_COUNTRY[country]) return BY_COUNTRY[country];
    if (entry.cityName) {
      return {
        ...FALLBACK,
        labelEn: entry.cityName,
      };
    }
  }

  // Unknown but selected → still show a friendly travel mood
  return FALLBACK;
}
