'use strict';

const { chromium, firefox } = require('playwright');
const { stealthInitScript } = require('./stealth');
const { pageLooksBlocked } = require('./botWall');
const { dismissCookieBanners } = require('../sites/cookies');
const { withCdpLock } = require('./cdpLock');
const { getOpenPageHook } = require('./parallelContext');

let browserPromises = {};

/** Close ad/captcha/junk tabs so scrapes don't inherit a poisoned SPA tab. */
async function pruneJunkPages(context) {
  if (!context) return;
  const pages = context.pages();
  for (const p of pages) {
    let href = '';
    try {
      href = p.url();
    } catch {
      continue;
    }
    if (
      /safeframe|doubleclick|rubicon|onetag|px-cloud|captcha-v2|sttc\/px|googlesyndication|recaptcha|criteo|pubmatic|inmobi/i.test(
        href,
      )
    ) {
      await p.close().catch(() => {});
    }
  }
}

async function getBrowser(engine, headless, config) {
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
    if (config.display) {
      process.env.DISPLAY = config.display;
    }
    if (!headless && config.chromeExecutable) {
      launchOpts.executablePath = config.chromeExecutable;
    }
    if (engine === 'firefox') {
      browserPromises[key] = firefox.launch(launchOpts);
    } else {
      browserPromises[key] = chromium.launch(launchOpts);
    }
  }
  return browserPromises[key];
}

async function withPageViaCdp(cdpUrl, config, fn, _proxyUrl) {
  return withCdpLock(async () => {
    // Reuse the default Chrome context — newContext() + service workers crashes Playwright CDP
    // (assert on service_worker target attach). Flight Chrome is started with SW disabled.
    const browser = await chromium.connectOverCDP(cdpUrl);
    const contexts = browser.contexts();
    const context = contexts[0] || (await browser.newContext({ viewport: { width: 1400, height: 900 } }));
    let ownedContext = contexts.length === 0;
    try {
      await context.addInitScript(stealthInitScript);
    } catch {
      /* already attached */
    }
    await pruneJunkPages(context);
    const page = await context.newPage();
    try {
      return await fn(page, {
        dismissCookieBanners,
        pageLooksBlocked,
        engine: 'chrome-cdp',
        cdpUrl,
      });
    } finally {
      try {
        await page.close();
      } catch {
        /* ignore */
      }
      await pruneJunkPages(context);
      if (ownedContext) {
        try {
          await context.close();
        } catch {
          /* ignore */
        }
      }
      // Disconnect CDP client only — does not kill host Chrome.
      try {
        await browser.close();
      } catch {
        /* ignore */
      }
    }
  });
}

/**
 * Hold one CDP connection and run `fn({ openPage })` so multiple sites can
 * scrape in parallel tabs without racing connectOverCDP clients.
 */
async function withCdpBrowser(config, fn) {
  const cdpUrls =
    config.cdpUrls?.length > 0 ? config.cdpUrls : config.cdpUrl ? [config.cdpUrl] : [];
  if (!cdpUrls.length) {
    throw new Error('withCdpBrowser requires SCRAPER_CDP_URLS');
  }
  const cdpUrl = cdpUrls[0];
  return withCdpLock(async () => {
    const browser = await chromium.connectOverCDP(cdpUrl);
    const contexts = browser.contexts();
    const context = contexts[0] || (await browser.newContext({ viewport: { width: 1400, height: 900 } }));
    const ownedContext = contexts.length === 0;
    try {
      await context.addInitScript(stealthInitScript);
    } catch {
      /* already attached */
    }
    await pruneJunkPages(context);

    const openPage = async (pageFn) => {
      await pruneJunkPages(context);
      const page = await context.newPage();
      try {
        return await pageFn(page, {
          dismissCookieBanners,
          pageLooksBlocked,
          engine: 'chrome-cdp',
          cdpUrl,
        });
      } finally {
        await page.close().catch(() => {});
        await pruneJunkPages(context);
      }
    };

    try {
      return await fn({ openPage, browser, context, cdpUrl });
    } finally {
      if (ownedContext) {
        await context.close().catch(() => {});
      }
      await browser.close().catch(() => {});
    }
  });
}

async function withPage(config, fn, options = {}) {
  // Parallel multi-site scrape: reuse the shared CDP page factory (no nested lock).
  const hook = getOpenPageHook();
  if (typeof hook === 'function') {
    return hook(fn);
  }

  const proxyUrl = options.proxyUrl || config.proxyUrl;
  const cdpUrls =
    config.cdpUrls?.length > 0 ? config.cdpUrls : config.cdpUrl ? [config.cdpUrl] : [];

  if (cdpUrls.length > 0) {
    let lastErr;
    for (const cdpUrl of cdpUrls) {
      try {
        const out = await withPageViaCdp(cdpUrl, config, fn, proxyUrl);
        const empty = Array.isArray(out) ? out.length === 0 : !out;
        if (!empty) {
          return out;
        }
      } catch (err) {
        lastErr = err;
      }
    }
    if (lastErr) throw lastErr;
    return [];
  }

  const engines = options.engines || [config.browserEngine || 'chromium'];
  let lastErr;

  for (const engine of engines) {
    const browser = await getBrowser(engine, config.headless ? 'true' : 'false', config);
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

function isTransientScrapeError(msg) {
  return /Target page|has been closed|Timeout|net::|ECONNREFUSED|cdp|browser has been/i.test(
    String(msg || ''),
  );
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
      // Empty result with a stable business error (bot wall / wrong URL) — don't burn another full scrape.
      if (result?.error && !isTransientScrapeError(result.error)) {
        break;
      }
    } catch (err) {
      lastError = `${label}: ${err.message || err}`;
      if (!isTransientScrapeError(lastError) || i === attempts - 1) {
        break;
      }
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

module.exports = {
  withPage,
  withCdpBrowser,
  runWithRetries,
  warmHomepage,
  pageLooksBlocked,
  pruneJunkPages,
};
