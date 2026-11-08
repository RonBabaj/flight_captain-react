'use strict';

const DEFAULT_SITES = ['kiwi', 'skyscanner'];

function parseSites(raw) {
  if (!raw || !String(raw).trim()) return [...DEFAULT_SITES];
  return String(raw)
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

function parseCdpUrls() {
  const raw =
    process.env.SCRAPER_CDP_URLS ||
    process.env.SCRAPER_CDP_URL ||
    'http://host.docker.internal:9224';
  return String(raw)
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

module.exports = {
  port: Number(process.env.PORT || 3099),
  token: (process.env.FLIGHT_SCRAPER_TOKEN || '').trim(),
  defaultSites: parseSites(process.env.FLIGHT_SCRAPER_SITES),
  parseSites,
  headless: process.env.PLAYWRIGHT_HEADLESS !== '0',
  maxOffersPerSite: Math.min(Number(process.env.SCRAPER_MAX_OFFERS || 40), 80),
  navigationTimeoutMs: Number(process.env.SCRAPER_NAV_TIMEOUT_MS || 45000),
  settleMs: Number(process.env.SCRAPER_SETTLE_MS || 2000),
  dryRun: process.env.SCRAPER_DRY_RUN === '1',
  // Default: parallel Kiwi+Skyscanner tabs on one CDP Chrome.
  // Set SCRAPER_SERIAL_SITES=1 only on very low-RAM hosts.
  serialSites: process.env.SCRAPER_SERIAL_SITES === '1',
  proxyUrl: (process.env.SCRAPER_PROXY_URL || '').trim(),
  /** Headed flight Chrome on DISPLAY :99 via CDP (default gateway:9224). Not apartment :9223. */
  cdpUrls: parseCdpUrls(),
  cdpUrl: parseCdpUrls()[0] || '',
  display: (process.env.DISPLAY || '').trim(),
  chromeExecutable: (process.env.CHROME_EXECUTABLE_PATH || '').trim(),
  // At least 2 attempts — CDP races / one-off PX flashes are common without a proxy.
  sessionRetries: Math.min(Math.max(Number(process.env.SCRAPER_SESSION_RETRIES || 2), 1), 5),
  browserEngine: (process.env.SCRAPER_BROWSER || 'chromium').trim().toLowerCase(),
  storageDir: (process.env.SCRAPER_STORAGE_DIR || '').trim(),
  /** Optional legacy REST path — off by default; Playwright is the primary Kiwi scraper. */
  tequilaKey:
    process.env.KIWI_USE_TEQUILA === '1' ? (process.env.KIWI_TEQUILA_API_KEY || '').trim() : '',
};
