'use strict';

const { chromium, firefox } = require('playwright');
const { stealthInitScript } = require('./stealth');
const { pageLooksBlocked } = require('./botWall');
const { dismissCookieBanners } = require('../sites/cookies');

let browserPromises = {};

async function getBrowser(engine, headless) {
  const key = `${engine}:${headless}`;
  if (!browserPromises[key]) {
    const launchOpts = {
      headless: headless === 'false' ? false : true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-blink-features=AutomationControlled',
        '--window-size=1400,900',
      ],
    };
    if (engine === 'firefox') {
      browserPromises[key] = firefox.launch(launchOpts);
    } else {
      browserPromises[key] = chromium.launch(launchOpts);
    }
  }
  return browserPromises[key];
}

async function withPage(config, fn, options = {}) {
  const engines = options.engines || [config.browserEngine || 'chromium'];
  const proxyUrl = options.proxyUrl || config.proxyUrl;
  let lastErr;

  for (const engine of engines) {
    const browser = await getBrowser(engine, config.headless ? 'true' : 'false');
    // eslint-disable-next-line no-await-in-loop
    const ctxOpts = {
      userAgent:
        engine === 'firefox'
          ? 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:131.0) Gecko/20100101 Firefox/131.0'
          : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
      locale: 'en-US',
      timezoneId: 'America/New_York',
      viewport: { width: 1400, height: 900 },
      deviceScaleFactor: 1,
      hasTouch: false,
      isMobile: false,
      extraHTTPHeaders: {
        'Accept-Language': 'en-US,en;q=0.9',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
      },
    };
    if (proxyUrl) ctxOpts.proxy = { server: proxyUrl };
    if (config.storageDir) {
      ctxOpts.storageState = undefined;
    }

    const context = await browser.newContext(ctxOpts);
    await context.addInitScript(stealthInitScript);
    const page = await context.newPage();
    try {
      const out = await fn(page, { dismissCookieBanners, pageLooksBlocked, engine });
      const empty = Array.isArray(out) ? out.length === 0 : !out;
      if (!empty || engines.length === 1) {
        return out;
      }
    } catch (err) {
      lastErr = err;
    } finally {
      await context.close();
    }
  }
  if (lastErr) throw lastErr;
  return [];
}

async function runWithRetries(config, label, runner) {
  const attempts = Math.max(1, config.sessionRetries || 1);
  let lastError = `${label}: no offers`;
  for (let i = 0; i < attempts; i++) {
    try {
      const result = await runner(i);
      if (result?.offers?.length) {
        return { offers: result.offers, error: undefined };
      }
      if (result?.error) lastError = result.error;
    } catch (err) {
      lastError = `${label}: ${err.message || err}`;
    }
  }
  return { offers: [], error: lastError };
}

async function warmHomepage(page, url, config) {
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: config.navigationTimeoutMs });
  await dismissCookieBanners(page);
  await page.waitForTimeout(2000);
  if (await pageLooksBlocked(page)) {
    return false;
  }
  try {
    await page.waitForLoadState('networkidle', { timeout: 10000 });
  } catch {
    /* ok */
  }
  await page.waitForTimeout(1500);
  return !(await pageLooksBlocked(page));
}

module.exports = { withPage, runWithRetries, warmHomepage, pageLooksBlocked };
