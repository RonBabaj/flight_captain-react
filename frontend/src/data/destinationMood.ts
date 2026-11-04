/**
 * Per-destination mood photography (Unsplash) keyed by IATA / city / country.
 * Used to set travel atmosphere when a destination is selected.
 *
 * Unmapped airport/city codes get a stable, code-hashed image from UNIQUE_POOL
 * so explore destinations do not collapse onto one shared fallback photo.
 */

import { AIRPORT_DICTIONARY, getAirportEntry } from './airports';
import { isCountryDestination, parseCountryDestination } from '../types';

export type DestinationMood = {
  /** Stable Unsplash image URL (crop-friendly). */
  imageUrl: string;
  /** Short English place label for overlay fallback. */
  labelEn: string;
  /** Soft accent wash over the photo (hex). */
  accent?: string;
};

const unsplash = (photoId: string) =>
  `https://images.unsplash.com/${photoId}?auto=format&fit=crop&w=1600&q=80`;

/**
 * Large catalog of distinct travel stills. Hashed by city/airport code when a
 * destination is not in BY_CODE so each code gets a stable unique image.
 */
const UNIQUE_POOL: string[] = [
  unsplash('photo-1519677100203-a0e668c92439'),
  unsplash('photo-1502602898657-3e91760cbb34'),
  unsplash('photo-1513635269975-59663e0ac1ad'),
  unsplash('photo-1552832230-c0197dd311b5'),
  unsplash('photo-1583422409516-2895a77efded'),
  unsplash('photo-1539037116277-4db20889f2d4'),
  unsplash('photo-1534351590666-13e3e96b5017'),
  unsplash('photo-1560969184-10fe8719e047'),
  unsplash('photo-1516550893923-42d28e5677af'),
  unsplash('photo-1551867633-194f125bddfa'),
  unsplash('photo-1555993539-1732b0258235'),
  unsplash('photo-1524231757912-21f4fe3a7200'),
  unsplash('photo-1555881400-74d7acaacd8b'),
  unsplash('photo-1560707303-4e980ce876ad'),
  unsplash('photo-1558642452-9d2a7deb7f62'),
  unsplash('photo-1515488764276-beab7607c1e6'),
  unsplash('photo-1527668752968-14dc70a27c95'),
  unsplash('photo-1595867818082-083862f3d630'),
  unsplash('photo-1477959858617-67f85cf4f1df'),
  unsplash('photo-1513581166391-887a96ddeafd'),
  unsplash('photo-1523906834658-6e24ef2386f9'),
  unsplash('photo-1498503182468-3b51cbb6cb24'),
  unsplash('photo-1467269204594-9661b134dd2b'),
  unsplash('photo-1499856871958-5b9627545d1a'),
  unsplash('photo-1512453979798-5ea266f8880c'),
  unsplash('photo-1518684079-3c830dcef090'),
  unsplash('photo-1543783207-ec64e4d95325'),
  unsplash('photo-1507525428034-b723cf961d3e'),
  unsplash('photo-1572252009286-268acec5ca0a'),
  unsplash('photo-1508009603885-50cf7c579365'),
  unsplash('photo-1589394815804-964ed0be2eb5'),
  unsplash('photo-1525625293386-3f8f99389edd'),
  unsplash('photo-1540959733332-eab4deabeeaf'),
  unsplash('photo-1517154421773-0529f29ea451'),
  unsplash('photo-1496442226666-8d4d0e62e6e9'),
  unsplash('photo-1514565131-fce0801e5785'),
  unsplash('photo-1533106497176-45ae19e68ba2'),
  unsplash('photo-1517824806704-9040b037703b'),
  unsplash('photo-1539020140153-e479b8c22e70'),
  unsplash('photo-1506905925346-21bda4d32df4'),
  unsplash('photo-1533104816931-20fa691ff6ca'),
  unsplash('photo-1570077188670-e3a8d69ac5ff'),
  unsplash('photo-1530841377377-3ff06c0ca713'),
  unsplash('photo-1565008576549-57569a49371d'),
  unsplash('photo-1605649487212-47bdab064df7'),
  unsplash('photo-1436491865332-7a61a109cc05'),
  unsplash('photo-1488646953014-85cb44e25828'),
  unsplash('photo-1476514525535-07fb3b4ae5f1'),
  unsplash('photo-1469854523086-cc02fe5d8800'),
  unsplash('photo-1501785888041-af3ef285b470'),
  unsplash('photo-1530521954074-e64f6810b32d'),
  unsplash('photo-1503220317375-aaad61436b1b'),
  unsplash('photo-1526772662001-3d340edfdf17'),
  unsplash('photo-1500835556837-99ac94a94552'),
  unsplash('photo-1469474968028-56623f02e42e'),
  unsplash('photo-1441974231531-c6227db76b6e'),
  unsplash('photo-1470071459604-3b5ec3a7fe05'),
  unsplash('photo-1447752875215-b2761acb3c5d'),
  unsplash('photo-1501854140801-50d01698950b'),
  unsplash('photo-1519904981063-b0cf448d479e'),
  unsplash('photo-1472214103451-9374bd1c798e'),
  unsplash('photo-1418065460487-3e41a6c84dc5'),
  unsplash('photo-1449824913935-59a10b8d2000'),
  unsplash('photo-1444724819723-adc133e05c60'),
  unsplash('photo-1493246507139-91e8fad9978e'),
  unsplash('photo-1519681393784-d120267933ba'),
  unsplash('photo-1480714378408-67cf0d32bc58'),
  unsplash('photo-1520250497591-112f2f40a3f4'),
  unsplash('photo-1571896349842-33c89424de2d'),
  unsplash('photo-1566073771259-6a8506099945'),
  unsplash('photo-1542314831-068cd1dbfeeb'),
  unsplash('photo-1551882547-ff40c63fe5fa'),
  unsplash('photo-1564501049412-61c2a3083791'),
  unsplash('photo-1549294413-26f195200c16'),
  unsplash('photo-1571003123894-1f0594d2b5d9'),
  unsplash('photo-1582719478250-c89cae4dc85b'),
  unsplash('photo-1568084680786-a84f91d1153c'),
  unsplash('photo-1551632436-cbf8dd35adfa'),
  unsplash('photo-1519046904884-53103b34b206'),
  unsplash('photo-1493976040374-85c8e12f0c0e'),
  unsplash('photo-1528164344705-47542687000d'),
  unsplash('photo-1545569341-9eb8b30979d9'),
  unsplash('photo-1526481280695-3c4694936777'),
  unsplash('photo-1513407030348-c983a97b98d8'),
  unsplash('photo-1491555103943-2f4bdd7d2d08'),
  unsplash('photo-1516483638261-f4dbaf036963'),
  unsplash('photo-1534445867742-43195f401b6c'),
  unsplash('photo-1609137144813-7d9921338f24'),
  unsplash('photo-1596422846543-75c6fc197f07'),
  unsplash('photo-1474185401918-9d9876980690'),
  unsplash('photo-1486299267070-83823f5448dd'),
  unsplash('photo-1505761671935-60b3a7488801'),
  unsplash('photo-1544551763-46a013bb70d5'),
  unsplash('photo-1528183429752-a97d2815f8b4'),
];

function hashCode(key: string): number {
  let h = 2166136261;
  for (let i = 0; i < key.length; i++) {
    h ^= key.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Stable per-city image URLs — filled after BY_CODE is declared. */
const ASSIGNED_URLS = new Map<string, string>();

function moodFromPool(key: string, labelEn: string): DestinationMood {
  const k = key.trim().toUpperCase();
  const imageUrl =
    ASSIGNED_URLS.get(k) ||
    UNIQUE_POOL[hashCode(k) % UNIQUE_POOL.length] ||
    FALLBACK_IMAGE;
  return {
    labelEn,
    imageUrl,
    accent: '#163A5F',
  };
}

const FALLBACK_IMAGE = unsplash('photo-1436491865332-7a61a109cc05');

/** Popular airport/city codes → mood stills. */
const BY_CODE: Record<string, DestinationMood> = {
  PRG: {
    labelEn: 'Prague',
    imageUrl: unsplash('photo-1519677100203-a0e668c92439'),
    accent: '#163A5F',
  },
  PAR: {
    labelEn: 'Paris',
    imageUrl: unsplash('photo-1502602898657-3e91760cbb34'),
    accent: '#163A5F',
  },
  CDG: {
    labelEn: 'Paris',
    imageUrl: unsplash('photo-1502602898657-3e91760cbb34'),
  },
  ORY: {
    labelEn: 'Paris',
    imageUrl: unsplash('photo-1502602898657-3e91760cbb34'),
  },
  LON: {
    labelEn: 'London',
    imageUrl: unsplash('photo-1513635269975-59663e0ac1ad'),
  },
  LHR: {
    labelEn: 'London',
    imageUrl: unsplash('photo-1513635269975-59663e0ac1ad'),
  },
  LGW: {
    labelEn: 'London',
    imageUrl: unsplash('photo-1513635269975-59663e0ac1ad'),
  },
  STN: {
    labelEn: 'London',
    imageUrl: unsplash('photo-1513635269975-59663e0ac1ad'),
  },
  ROM: {
    labelEn: 'Rome',
    imageUrl: unsplash('photo-1552832230-c0197dd311b5'),
  },
  FCO: {
    labelEn: 'Rome',
    imageUrl: unsplash('photo-1552832230-c0197dd311b5'),
  },
  CIA: {
    labelEn: 'Rome',
    imageUrl: unsplash('photo-1552832230-c0197dd311b5'),
  },
  BCN: {
    labelEn: 'Barcelona',
    imageUrl: unsplash('photo-1583422409516-2895a77efded'),
  },
  MAD: {
    labelEn: 'Madrid',
    imageUrl: unsplash('photo-1539037116277-4db20889f2d4'),
  },
  AMS: {
    labelEn: 'Amsterdam',
    imageUrl: unsplash('photo-1534351590666-13e3e96b5017'),
  },
  BER: {
    labelEn: 'Berlin',
    imageUrl: unsplash('photo-1560969184-10fe8719e047'),
  },
  VIE: {
    labelEn: 'Vienna',
    imageUrl: unsplash('photo-1516550893923-42d28e5677af'),
  },
  BUD: {
    labelEn: 'Budapest',
    imageUrl: unsplash('photo-1551867633-194f125bddfa'),
  },
  ATH: {
    labelEn: 'Athens',
    imageUrl: unsplash('photo-1555993539-1732b0258235'),
  },
  IST: {
    labelEn: 'Istanbul',
    imageUrl: unsplash('photo-1524231757912-21f4fe3a7200'),
  },
  SAW: {
    labelEn: 'Istanbul',
    imageUrl: unsplash('photo-1524231757912-21f4fe3a7200'),
  },
  LIS: {
    labelEn: 'Lisbon',
    imageUrl: unsplash('photo-1555881400-74d7acaacd8b'),
  },
  DUB: {
    labelEn: 'Dublin',
    imageUrl: unsplash('photo-1560707303-4e980ce876ad'),
  },
  CPH: {
    labelEn: 'Copenhagen',
    imageUrl: unsplash('photo-1558642452-9d2a7deb7f62'),
  },
  ZRH: {
    labelEn: 'Zurich',
    imageUrl: unsplash('photo-1515488764276-beab7607c1e6'),
  },
  GVA: {
    labelEn: 'Geneva',
    imageUrl: unsplash('photo-1527668752968-14dc70a27c95'),
  },
  MUC: {
    labelEn: 'Munich',
    imageUrl: unsplash('photo-1595867818082-083862f3d630'),
  },
  FRA: {
    labelEn: 'Frankfurt',
    imageUrl: unsplash('photo-1477959858617-67f85cf4f1df'),
  },
  MIL: {
    labelEn: 'Milan',
    imageUrl: unsplash('photo-1513581166391-887a96ddeafd'),
  },
  MXP: {
    labelEn: 'Milan',
    imageUrl: unsplash('photo-1513581166391-887a96ddeafd'),
  },
  LIN: {
    labelEn: 'Milan',
    imageUrl: unsplash('photo-1513581166391-887a96ddeafd'),
  },
  VCE: {
    labelEn: 'Venice',
    imageUrl: unsplash('photo-1523906834658-6e24ef2386f9'),
  },
  NCE: {
    labelEn: 'Nice',
    imageUrl: unsplash('photo-1498503182468-3b51cbb6cb24'),
  },
  WAW: {
    labelEn: 'Warsaw',
    imageUrl: unsplash('photo-1467269204594-9661b134dd2b'),
  },
  KRK: {
    labelEn: 'Krakow',
    imageUrl: unsplash('photo-1499856871958-5b9627545d1a'),
  },
  DXB: {
    labelEn: 'Dubai',
    imageUrl: unsplash('photo-1512453979798-5ea266f8880c'),
  },
  AUH: {
    labelEn: 'Abu Dhabi',
    imageUrl: unsplash('photo-1518684079-3c830dcef090'),
  },
  TLV: {
    labelEn: 'Tel Aviv',
    imageUrl: unsplash('photo-1543783207-ec64e4d95325'),
  },
  ETH: {
    labelEn: 'Eilat',
    imageUrl: unsplash('photo-1507525428034-b723cf961d3e'),
  },
  CAI: {
    labelEn: 'Cairo',
    imageUrl: unsplash('photo-1572252009286-268acec5ca0a'),
  },
  BKK: {
    labelEn: 'Bangkok',
    imageUrl: unsplash('photo-1508009603885-50cf7c579365'),
  },
  HKT: {
    labelEn: 'Phuket',
    imageUrl: unsplash('photo-1589394815804-964ed0be2eb5'),
  },
  SIN: {
    labelEn: 'Singapore',
    imageUrl: unsplash('photo-1525625293386-3f8f99389edd'),
  },
  TYO: {
    labelEn: 'Tokyo',
    imageUrl: unsplash('photo-1540959733332-eab4deabeeaf'),
  },
  HND: {
    labelEn: 'Tokyo',
    imageUrl: unsplash('photo-1540959733332-eab4deabeeaf'),
  },
  NRT: {
    labelEn: 'Tokyo',
    imageUrl: unsplash('photo-1540959733332-eab4deabeeaf'),
  },
  SEL: {
    labelEn: 'Seoul',
    imageUrl: unsplash('photo-1517154421773-0529f29ea451'),
  },
  ICN: {
    labelEn: 'Seoul',
    imageUrl: unsplash('photo-1517154421773-0529f29ea451'),
  },
  NYC: {
    labelEn: 'New York',
    imageUrl: unsplash('photo-1496442226666-8d4d0e62e6e9'),
  },
  JFK: {
    labelEn: 'New York',
    imageUrl: unsplash('photo-1496442226666-8d4d0e62e6e9'),
  },
  EWR: {
    labelEn: 'New York',
    imageUrl: unsplash('photo-1496442226666-8d4d0e62e6e9'),
  },
  LGA: {
    labelEn: 'New York',
    imageUrl: unsplash('photo-1496442226666-8d4d0e62e6e9'),
  },
  LAX: {
    labelEn: 'Los Angeles',
    imageUrl: unsplash('photo-1514565131-fce0801e5785'),
  },
  MIA: {
    labelEn: 'Miami',
    imageUrl: unsplash('photo-1533106497176-45ae19e68ba2'),
  },
  RAK: {
    labelEn: 'Marrakesh',
    imageUrl: unsplash('photo-1517824806704-9040b037703b'),
  },
  CMN: {
    labelEn: 'Casablanca',
    imageUrl: unsplash('photo-1539020140153-e479b8c22e70'),
  },
  AYT: {
    labelEn: 'Antalya',
    imageUrl: unsplash('photo-1506905925346-21bda4d32df4'),
  },
  LCA: {
    labelEn: 'Larnaca',
    imageUrl: unsplash('photo-1533104816931-20fa691ff6ca'),
  },
  PFO: {
    labelEn: 'Paphos',
    imageUrl: unsplash('photo-1570077188670-e3a8d69ac5ff'),
  },
  HER: {
    labelEn: 'Heraklion',
    imageUrl: unsplash('photo-1530841377377-3ff06c0ca713'),
  },
  TBS: {
    labelEn: 'Tbilisi',
    imageUrl: unsplash('photo-1565008576549-57569a49371d'),
  },
  EVN: {
    labelEn: 'Yerevan',
    imageUrl: unsplash('photo-1605649487212-47bdab064df7'),
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

/**
 * Pre-assign a distinct image to every known city code (sorted for stability).
 * Curated BY_CODE cities keep their photos; remaining cities take unused pool
 * slots, then unique seeded placeholders once the pool is exhausted.
 */
(function assignUniqueMoodImages() {
  const cityKeys = new Set<string>();
  for (const a of AIRPORT_DICTIONARY) {
    const k = (a.cityCode || a.airportCode || a.id || '').toUpperCase();
    if (k.length === 3) cityKeys.add(k);
  }
  for (const k of Object.keys(BY_CODE)) cityKeys.add(k);

  const used = new Set<string>();
  const sorted = [...cityKeys].sort();

  for (const key of sorted) {
    const curated = BY_CODE[key];
    if (curated) {
      ASSIGNED_URLS.set(key, curated.imageUrl);
      used.add(curated.imageUrl);
    }
  }

  for (const key of sorted) {
    if (ASSIGNED_URLS.has(key)) continue;
    let idx = hashCode(key) % UNIQUE_POOL.length;
    let url: string | undefined;
    for (let t = 0; t < UNIQUE_POOL.length; t++) {
      const candidate = UNIQUE_POOL[(idx + t) % UNIQUE_POOL.length];
      if (!used.has(candidate)) {
        url = candidate;
        break;
      }
    }
    if (!url) {
      // Pool exhausted — still unique per city code.
      url = `https://picsum.photos/seed/flyfix-${key.toLowerCase()}/1600/900`;
    }
    used.add(url);
    ASSIGNED_URLS.set(key, url);
  }
})();

export function resolveDestinationMood(destinationCode: string | undefined | null): DestinationMood | null {
  if (!destinationCode || typeof destinationCode !== 'string') return null;
  const raw = destinationCode.trim().toUpperCase();
  if (!raw || raw === 'ANYWHERE') return null;

  if (isCountryDestination(raw)) {
    const cc = parseCountryDestination(raw) || raw.replace(/^COUNTRY[:-]?/, '');
    return BY_COUNTRY[cc] ?? moodFromPool(`COUNTRY:${cc}`, cc);
  }

  const direct = BY_CODE[raw];
  if (direct) return direct;

  const entry = getAirportEntry(raw);
  if (entry) {
    const city = (entry.cityCode || '').toUpperCase();
    if (city && BY_CODE[city]) return BY_CODE[city];
    const airport = (entry.airportCode || '').toUpperCase();
    if (airport && BY_CODE[airport]) return BY_CODE[airport];
    // Prefer a stable per-city (or per-airport) pool image — do NOT collapse
    // every airport in a country onto the same capital photo.
    const key = city || airport || raw;
    const label = entry.cityName || key;
    return moodFromPool(key, label);
  }

  return moodFromPool(raw, raw);
}
