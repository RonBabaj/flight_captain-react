'use strict';

const { withPage, runWithRetries, warmHomepage } = require('../browser/session');

/**
 * Navigate and settle just enough for SPA search XHR to fire.
 * Optional `ready()` aborts remaining waits early (e.g. JSON already captured).
 */
async function gotoAndSettle(page, url, config, opts = {}) {
  const settleMs = Math.min(Math.max(Number(config.settleMs || 800), 200), 4000);
  const ready = typeof opts.ready === 'function' ? opts.ready : null;
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: config.navigationTimeoutMs });
  const { dismissCookieBanners } = require('./cookies');
  await dismissCookieBanners(page);
  if (ready && (await ready())) return;
  // Short post-DOM beat — networkidle used to burn 6–12s per site.
  await page.waitForTimeout(Math.min(400, settleMs));
  if (ready && (await ready())) return;
  try {
    await page.waitForLoadState('networkidle', { timeout: opts.networkIdleMs ?? 3500 });
  } catch {
    /* continue */
  }
  if (ready && (await ready())) return;
  await page.waitForTimeout(settleMs);
}

function yyyymmdd(isoDate) {
  return String(isoDate || '').replace(/-/g, '').slice(0, 8);
}

/** Skyscanner URLs use YYMMDD (matches backend depToYYMMDD). */
function skyscannerDate(isoDate) {
  const iso = String(isoDate || '').trim();
  if (iso.length < 10) return '';
  return iso.slice(2, 4) + iso.slice(5, 7) + iso.slice(8, 10);
}

function mergeConfig(headless) {
  const base = require('../config');
  return { ...base, headless: headless !== false && headless !== '0' };
}

module.exports = {
  withPage: (headless, fn, options) => withPage(mergeConfig(headless), fn, options),
  runWithRetries: (headless, label, runner) => runWithRetries(mergeConfig(headless), label, runner),
  warmHomepage: (page, url, headless) => warmHomepage(page, url, mergeConfig(headless)),
  gotoAndSettle,
  yyyymmdd,
  skyscannerDate,
  dismissCookieBanners: require('./cookies').dismissCookieBanners,
};
