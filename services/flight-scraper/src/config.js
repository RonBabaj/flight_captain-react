'use strict';

const DEFAULT_SITES = ['kiwi', 'skyscanner', 'expedia'];

function parseSites(raw) {
  if (!raw || !String(raw).trim()) return [...DEFAULT_SITES];
  return String(raw)
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

module.exports = {
  port: Number(process.env.PORT || 3099),
  token: (process.env.FLIGHT_SCRAPER_TOKEN || '').trim(),
  defaultSites: DEFAULT_SITES,
  parseSites,
  headless: process.env.PLAYWRIGHT_HEADLESS !== '0',
  maxOffersPerSite: Math.min(Number(process.env.SCRAPER_MAX_OFFERS || 40), 80),
  navigationTimeoutMs: Number(process.env.SCRAPER_NAV_TIMEOUT_MS || 55000),
  settleMs: Number(process.env.SCRAPER_SETTLE_MS || 8000),
  dryRun: process.env.SCRAPER_DRY_RUN === '1',
  // Run heavy sites one-at-a-time to reduce RAM spikes on small VPS.
  serialSites: process.env.SCRAPER_SERIAL_SITES !== '0',
  tequilaKey: (process.env.KIWI_TEQUILA_API_KEY || '').trim(),
  proxyUrl: (process.env.SCRAPER_PROXY_URL || '').trim(),
};
