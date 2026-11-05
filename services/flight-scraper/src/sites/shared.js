'use strict';

const { withPage, runWithRetries, warmHomepage } = require('../browser/session');

async function gotoAndSettle(page, url, config) {
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: config.navigationTimeoutMs });
  const { dismissCookieBanners } = require('./cookies');
  await dismissCookieBanners(page);
  await page.waitForTimeout(2500);
  try {
    await page.waitForLoadState('networkidle', { timeout: 12000 });
  } catch {
    /* continue */
  }
  await page.waitForTimeout(config.settleMs || 6000);
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
