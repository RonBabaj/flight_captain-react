'use strict';

/**
 * Keep headed Chrome CDP "warm": cookies dismissed, culture settled, tabs ready.
 * Cold scrapes hit PerimeterX / cookie walls and can take minutes; warming at
 * process start (and periodically) makes the first user search much faster.
 */
const { chromium } = require('playwright');
const { dismissCookieBanners } = require('./sites/cookies');
const { pageLooksBlocked } = require('./browser/botWall');
const { stealthInitScript } = require('./browser/stealth');

const WARM_URLS = [
  'https://www.kiwi.com/en/',
  // FR mirror matches VPS geo — warming .com alone still redirects and can strip state.
  'https://www.skyscanner.fr/',
];

let lastWarm = {
  at: 0,
  ok: false,
  detail: 'not started',
  sites: [],
};

function warmStatus() {
  return { ...lastWarm };
}

async function pruneExtraPages(context) {
  const pages = context.pages();
  // Keep a single blank/about tab; close ad/captcha leftovers from prior scrapes.
  for (let i = 0; i < pages.length; i++) {
    const p = pages[i];
    const href = p.url();
    if (i === 0 && (/^about:blank/i.test(href) || href === '')) continue;
    if (/safeframe|doubleclick|rubicon|onetag|px-cloud|captcha/i.test(href)) {
      await p.close().catch(() => {});
    }
  }
}

async function warmOne(cdpUrl, url) {
  const browser = await chromium.connectOverCDP(cdpUrl);
  try {
    const contexts = browser.contexts();
    const context = contexts[0] || (await browser.newContext({ viewport: { width: 1400, height: 900 } }));
    try {
      await context.addInitScript(stealthInitScript);
    } catch {
      /* already attached */
    }
    await pruneExtraPages(context);
    const page = await context.newPage();
    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 25000 });
      await dismissCookieBanners(page);
      await page.waitForTimeout(2000);
      const blocked = await pageLooksBlocked(page);
      const title = await page.title().catch(() => '');
      return { url, blocked, title, href: page.url() };
    } finally {
      await page.close().catch(() => {});
    }
  } finally {
    await browser.close().catch(() => {});
  }
}

async function warmAll(config) {
  const cdpUrls =
    config.cdpUrls?.length > 0 ? config.cdpUrls : config.cdpUrl ? [config.cdpUrl] : [];
  if (!cdpUrls.length) {
    lastWarm = { at: Date.now(), ok: false, detail: 'no CDP endpoints', sites: [] };
    return lastWarm;
  }
  const sites = [];
  let ok = true;
  for (const cdpUrl of cdpUrls) {
    for (const url of WARM_URLS) {
      try {
        const result = await warmOne(cdpUrl, url);
        sites.push({ cdpUrl, ...result });
        if (result.blocked) ok = false;
        console.log(
          `[flight-scraper] warm ${result.blocked ? 'BLOCKED' : 'ok'} ${url} → ${String(result.href || '').slice(0, 80)}`,
        );
      } catch (err) {
        ok = false;
        sites.push({ cdpUrl, url, error: String(err.message || err) });
        console.warn(`[flight-scraper] warm failed ${url}: ${err.message || err}`);
      }
    }
  }
  lastWarm = {
    at: Date.now(),
    ok,
    detail: ok ? 'ready' : 'partial/blocked',
    sites,
  };
  return lastWarm;
}

/**
 * Fire-and-forget warm after listen; re-warm on an interval so PX cookies stay fresh.
 */
function startWarmLoop(config) {
  const intervalMs = Math.max(
    5 * 60 * 1000,
    Number(process.env.SCRAPER_WARM_INTERVAL_MS || 15 * 60 * 1000) || 15 * 60 * 1000,
  );
  const run = () => {
    warmAll(config).catch((err) => {
      console.warn(`[flight-scraper] warm loop error: ${err.message || err}`);
    });
  };
  // Defer slightly so /health is up before CDP work.
  setTimeout(run, 1500);
  setInterval(run, intervalMs);
  console.log(`[flight-scraper] CDP warm loop every ${Math.round(intervalMs / 1000)}s`);
}

module.exports = { warmAll, warmStatus, startWarmLoop, WARM_URLS };
