'use strict';

const { chromium } = require('playwright');
const { dismissCookieBanners } = require('./cookies');

let browserPromise;

async function getBrowser(headless) {
  if (!browserPromise) {
    browserPromise = chromium.launch({
      headless,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-blink-features=AutomationControlled',
      ],
    });
  }
  return browserPromise;
}

async function withPage(headless, fn) {
  const browser = await getBrowser(headless);
  const context = await browser.newContext({
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
    locale: 'en-US',
    timezoneId: 'America/New_York',
    viewport: { width: 1400, height: 900 },
    extraHTTPHeaders: {
      'Accept-Language': 'en-US,en;q=0.9',
    },
  });
  await context.addInitScript(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
  });
  const page = await context.newPage();
  try {
    return await fn(page, { dismissCookieBanners });
  } finally {
    await context.close();
  }
}

async function gotoAndSettle(page, url, config) {
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: config.navigationTimeoutMs });
  await dismissCookieBanners(page);
  // Bot/challenge scripts (Kiwi Fastly) often need a beat after consent.
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

module.exports = { withPage, gotoAndSettle, yyyymmdd, dismissCookieBanners };
