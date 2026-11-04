'use strict';

const { chromium } = require('playwright');

let browserPromise;

async function getBrowser(headless) {
  if (!browserPromise) {
    browserPromise = chromium.launch({
      headless,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
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
    viewport: { width: 1366, height: 900 },
  });
  const page = await context.newPage();
  try {
    return await fn(page);
  } finally {
    await context.close();
  }
}

function yyyymmdd(isoDate) {
  return String(isoDate || '').replace(/-/g, '').slice(0, 8);
}

module.exports = { withPage, yyyymmdd };
