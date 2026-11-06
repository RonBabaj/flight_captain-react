'use strict';

/**
 * Keep headed Chrome CDP "warm": cookies dismissed, culture settled, tabs ready.
 * Cold scrapes hit PerimeterX / cookie walls and can take minutes; warming at
 * process start (and periodically) makes the first user search much faster.
 *
 * Warm is best-effort — timeouts/captchas must never crash the scraper process.
 * A partial warm is still useful (CDP reachable, some cookies set).
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

const GOTO_TIMEOUT_MS = Math.max(
  15_000,
  Number(process.env.SCRAPER_WARM_GOTO_MS || 55_000) || 55_000,
);

let lastWarm = {
  at: 0,
  ok: false,
  detail: 'not started',
  sites: [],
};

let warmInFlight = null;

function warmStatus() {
  return { ...lastWarm, inFlight: !!warmInFlight };
}

async function pruneExtraPages(context) {
  const pages = context.pages();
  for (let i = 0; i < pages.length; i++) {
    const p = pages[i];
    let href = '';
    try {
      href = p.url();
    } catch {
      continue;
    }
    if (i === 0 && (/^about:blank/i.test(href) || href === '')) continue;
    if (/safeframe|doubleclick|rubicon|onetag|px-cloud|captcha|googlesyndication|recaptcha/i.test(href)) {
      await p.close().catch(() => {});
    }
  }
}

async function connectCdp(cdpUrl, attempts = 3) {
  let lastErr;
  for (let i = 0; i < attempts; i++) {
    try {
      return await chromium.connectOverCDP(cdpUrl, { timeout: 15_000 });
    } catch (err) {
      lastErr = err;
      await new Promise((r) => setTimeout(r, 1500 * (i + 1)));
    }
  }
  throw lastErr || new Error(`CDP connect failed: ${cdpUrl}`);
}

/**
 * Navigate with progressive wait strategy:
 * 1) commit (network response started) — enough to set cookies
 * 2) best-effort domcontentloaded — don't fail warm if SPA hangs
 */
async function gotoSoft(page, url) {
  try {
    await page.goto(url, { waitUntil: 'commit', timeout: GOTO_TIMEOUT_MS });
  } catch (err) {
    // Absolute failure to start navigation.
    throw err;
  }
  try {
    await page.waitForLoadState('domcontentloaded', { timeout: Math.min(20_000, GOTO_TIMEOUT_MS) });
  } catch {
    /* SPA / bot interstitial may never fire DOMContentLoaded — still useful */
  }
  try {
    await page.waitForLoadState('networkidle', { timeout: 8_000 });
  } catch {
    /* ok */
  }
}

async function warmOne(cdpUrl, url) {
  const browser = await connectCdp(cdpUrl);
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
      await gotoSoft(page, url);
      await dismissCookieBanners(page).catch(() => {});
      await page.waitForTimeout(1500);
      const blocked = await pageLooksBlocked(page).catch(() => false);
      const title = await page.title().catch(() => '');
      const href = page.url();
      return { url, blocked, title, href, reached: true };
    } finally {
      await page.close().catch(() => {});
      await pruneExtraPages(context);
    }
  } finally {
    await browser.close().catch(() => {});
  }
}

async function warmAll(config) {
  if (warmInFlight) {
    return warmInFlight;
  }
  warmInFlight = (async () => {
    const cdpUrls =
      config.cdpUrls?.length > 0 ? config.cdpUrls : config.cdpUrl ? [config.cdpUrl] : [];
    if (!cdpUrls.length) {
      lastWarm = { at: Date.now(), ok: false, detail: 'no CDP endpoints', sites: [] };
      return lastWarm;
    }
    const sites = [];
    let reachedAny = false;
    let blockedAny = false;
    for (const cdpUrl of cdpUrls) {
      for (const url of WARM_URLS) {
        try {
          const result = await warmOne(cdpUrl, url);
          sites.push({ cdpUrl, ...result });
          if (result.reached) reachedAny = true;
          if (result.blocked) {
            blockedAny = true;
            console.log(
              `[flight-scraper] warm BLOCKED ${url} → ${String(result.href || '').slice(0, 80)}`,
            );
          } else {
            console.log(
              `[flight-scraper] warm ok ${url} → ${String(result.href || '').slice(0, 80)}`,
            );
          }
        } catch (err) {
          const msg = String(err.message || err);
          sites.push({ cdpUrl, url, error: msg, reached: false });
          // Soft: log and continue — user searches still use GF2-first PARTIAL path.
          console.warn(`[flight-scraper] warm soft-fail ${url}: ${msg.split('\n')[0]}`);
        }
      }
    }
    // One unblocked site is enough to call warm "ok" — Skyscanner often flashes PX
    // on the homepage while dated search URLs still work later.
    const ok = reachedAny && sites.some((s) => s.reached && !s.blocked && !s.error);
    lastWarm = {
      at: Date.now(),
      ok,
      detail: ok ? (blockedAny ? 'ready (some sites blocked)' : 'ready') : reachedAny ? 'partial' : 'unreachable',
      sites,
    };
    return lastWarm;
  })().finally(() => {
    warmInFlight = null;
  });
  return warmInFlight;
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
  // Defer so /health is up and CDP/socat have a moment after compose start.
  setTimeout(run, 5_000);
  setInterval(run, intervalMs);
  console.log(`[flight-scraper] CDP warm loop every ${Math.round(intervalMs / 1000)}s (best-effort)`);
}

module.exports = { warmAll, warmStatus, startWarmLoop, WARM_URLS };
