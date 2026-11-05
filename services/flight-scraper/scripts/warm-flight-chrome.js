'use strict';

/**
 * Pre-warm OTA homepages in headed Chrome CDP sessions (cookie banners, session trust).
 * Run on VPS after ensure-flight-chrome: node scripts/warm-flight-chrome.js
 */
const { chromium } = require('playwright');
const { dismissCookieBanners } = require('../src/sites/cookies');
const config = require('../src/config');

const WARM_URLS = [
  'https://www.skyscanner.com/',
  'https://www.kiwi.com/en/',
  'https://www.expedia.com/',
];

async function warmEndpoint(cdpUrl) {
  const browser = await chromium.connectOverCDP(cdpUrl);
  const context = await browser.newContext({ viewport: { width: 1400, height: 900 } });
  const page = await context.newPage();
  try {
    for (const url of WARM_URLS) {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 90000 });
      await dismissCookieBanners(page);
      await page.waitForTimeout(3500);
      const blocked = /robot|AppError|captcha-v2/i.test(
        (await page.content()).slice(0, 8000),
      );
      console.log(JSON.stringify({ cdpUrl, url, blocked, title: await page.title() }));
    }
  } finally {
    await context.close();
  }
}

async function main() {
  const endpoints = config.cdpUrls.length ? config.cdpUrls : ['http://127.0.0.1:9223'];
  for (const cdpUrl of endpoints) {
    try {
      await warmEndpoint(cdpUrl);
    } catch (err) {
      console.warn(JSON.stringify({ cdpUrl, error: String(err.message || err) }));
    }
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
