/**
 * Mood catalog uniqueness checks.
 * Run: npx --yes tsx src/data/destinationMood.test.ts
 */

import { readFileSync } from 'fs';
import { resolve } from 'path';
import { resolveDestinationMood } from './destinationMood';
import { getAirportEntry } from './airports';

function assert(cond: unknown, msg: string): void {
  if (!cond) throw new Error(msg);
}

// Curated different cities must not share a photo.
const curatedCities = ['PRG', 'BCN', 'ATH', 'LIS', 'DXB', 'ROM', 'AMS', 'BKK', 'ETH', 'AYT', 'PFO', 'HER', 'TBS', 'EVN'];
const curatedUrls = curatedCities.map((c) => resolveDestinationMood(c)?.imageUrl);
assert(curatedUrls.every(Boolean), 'curated cities must resolve');
assert(new Set(curatedUrls).size === curatedUrls.length, 'curated different cities must have unique images');

// Metro airports may share (same city).
assert(
  resolveDestinationMood('CDG')?.imageUrl === resolveDestinationMood('PAR')?.imageUrl,
  'Paris metro airports should share a mood image',
);

// Explore airport list: distinct cities → distinct images (until pool exhaustion + picsum).
const exploreCodes = readFileSync(
  resolve(__dirname, '../../../backend/data/explore_airport_codes.txt'),
  'utf8',
)
  .split(/\s+/)
  .map((c) => c.trim().toUpperCase())
  .filter((c) => c.length === 3);

const byCity = new Map<string, string>();
let collisions = 0;
for (const code of exploreCodes) {
  const entry = getAirportEntry(code);
  const city = (entry?.cityCode || code).toUpperCase();
  const mood = resolveDestinationMood(code);
  assert(mood?.imageUrl, `missing mood for ${code}`);
  const prev = byCity.get(city);
  if (!prev) {
    byCity.set(city, mood!.imageUrl);
  } else if (prev !== mood!.imageUrl) {
    throw new Error(`city ${city} mapped to multiple mood URLs`);
  }
}

const urls = [...byCity.values()];
const unique = new Set(urls);
// Allow shared only when pool exhausted would force it — with picsum overflow, all should be unique.
assert(
  unique.size === urls.length,
  `expected unique mood per city, got ${unique.size} unique / ${urls.length} cities`,
);

console.log(
  `destinationMood.test.ts OK — ${curatedCities.length} curated unique, ${byCity.size} explore cities unique`,
);
