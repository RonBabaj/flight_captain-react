'use strict';

function totalScrapeBudgetMs() {
  return Math.min(
    Math.max(Number(process.env.SCRAPER_ALL_MAX_MS || 480_000) || 480_000, 120_000),
    720_000,
  );
}

function siteEnvCapMs(site) {
  const envKey =
    site === 'skyscanner'
      ? 'SCRAPER_SKY_MAX_MS'
      : site === 'kiwi'
        ? 'SCRAPER_KIWI_MAX_MS'
        : site === 'expedia'
          ? 'SCRAPER_EXPEDIA_MAX_MS'
          : '';
  const fallback =
    site === 'skyscanner' ? 150_000 : site === 'kiwi' ? 120_000 : site === 'expedia' ? 150_000 : 180_000;
  if (!envKey) return fallback;
  const raw = process.env[envKey];
  const n = Number(raw || fallback);
  return Math.min(Math.max(Number.isFinite(n) ? n : fallback, 30_000), 300_000);
}

/** Fair split of remaining wall clock across sites still to run. */
function siteTimeBudgetMs(site, remainingMs, sitesLeft, opts = {}) {
  const left = Math.max(1, sitesLeft);
  const share = Math.floor(remainingMs / left);
  let cap = siteEnvCapMs(site);
  if (opts.skyscannerPxCooldown && site === 'skyscanner') {
    const pxCap = Math.min(
      Math.max(Number(process.env.SCRAPER_SKY_COOLDOWN_MAX_MS || 90_000) || 90_000, 45_000),
      180_000,
    );
    cap = Math.min(cap, pxCap);
  }
  return Math.max(15_000, Math.min(share, cap));
}

module.exports = {
  totalScrapeBudgetMs,
  siteEnvCapMs,
  siteTimeBudgetMs,
};