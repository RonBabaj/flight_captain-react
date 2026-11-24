'use strict';

const { scrapeKiwi } = require('./sites/kiwi');
const { scrapeSkyscanner } = require('./sites/skyscanner');
const { scrapeExpedia } = require('./sites/expedia');
const { isSkyscannerBlocked, noteSkyscannerBlocked } = require('./warm');
const { resetCdpLock } = require('./browser/cdpLock');
const { chromeRecentlyRestarted } = require('./browser/cdpHeal');
const {
  totalScrapeBudgetMs,
  siteTimeBudgetMs,
  siteEnvCapMs,
} = require('./scrapeBudget');
const SITE_FNS = {
  kiwi: scrapeKiwi,
  skyscanner: scrapeSkyscanner,
  expedia: scrapeExpedia,
};

function hasCdp(config) {
  return !!(config.cdpUrls?.length || config.cdpUrl);
}

async function runWithSiteBudget(site, req, config) {
  const started = Date.now();
  const budgetMs = config.siteMaxMs;
  const fn = SITE_FNS[site];
  if (!fn) {
    return { site, offers: [], error: `unknown site ${site}`, durationMs: 0 };
  }
  const work = (async () => {
    try {
      const { offers, error } = await fn(req, config);
      const durationMs = Date.now() - started;
      console.log(
        `[flight-scraper] site=${site} durationMs=${durationMs} offers=${(offers || []).length}${
          error ? ` error=${String(error).slice(0, 120)}` : ''
        }`,
      );
      return {
        site,
        offers: offers || [],
        error,
        durationMs,
      };
    } catch (err) {
      const durationMs = Date.now() - started;
      console.log(
        `[flight-scraper] site=${site} durationMs=${durationMs} error=${String(err.message || err).slice(0, 120)}`,
      );
      return { site, offers: [], error: String(err.message || err), durationMs };
    }
  })();

  if (!budgetMs || budgetMs < 1000) {
    return work;
  }

  let timer;
  let timedOut = false;
  const timeout = new Promise((resolve) => {
    timer = setTimeout(() => {
      timedOut = true;
      console.log(`[flight-scraper] site=${site} siteMaxMs=${budgetMs} exceeded`);
      resetCdpLock(`${site}_site_budget`);
      resolve({
        site,
        offers: [],
        error: 'site time budget exceeded',
        durationMs: Date.now() - started,
      });
    }, budgetMs);
  });
  const result = await Promise.race([work, timeout]);
  clearTimeout(timer);
  // Orphaned work after a budget kill still finishes later; ignore its result if we already timed out.
  if (timedOut && result.error === 'site time budget exceeded') {
    work.catch(() => {});
  }
  return result;
}

async function scrapeSerial(req, config, orderedSites, opts = {}) {
  const started = Date.now();
  const scrapeBudgetMs = totalScrapeBudgetMs();
  const results = [];
  for (let i = 0; i < orderedSites.length; i++) {
    const site = orderedSites[i];
    const elapsed = Date.now() - started;
    const remaining = scrapeBudgetMs - elapsed;
    if (remaining < 5000) {
      console.log(`[flight-scraper] scrapeAll budget exceeded — skip ${site}`);
      results.push({ site, offers: [], error: 'scrape budget exceeded', durationMs: 0 });
      continue;
    }
    const sitesLeft = orderedSites.length - i;
    const siteMaxMs = siteTimeBudgetMs(site, remaining, sitesLeft, opts);
    console.log(`[flight-scraper] site=${site} budgetMs=${siteMaxMs} remainingMs=${remaining}`);
    const siteConfig = { ...config, siteMaxMs };
    results.push(await runWithSiteBudget(site, req, siteConfig));
  }
  return results;
}

async function scrapeAll(req, config) {
  const sites = (req.sites && req.sites.length ? req.sites : config.defaultSites).map((s) =>
    String(s).toLowerCase(),
  );
  const unique = [...new Set(sites)];
  const started = Date.now();

  // Serial CDP: Skyscanner often needs the full scrape window after Kiwi; run it first
  // so it is not starved when SCRAPER_SERIAL_SITES=1 on the VPS.
  const skyscannerFirst = (sites) => {
    const sky = sites.filter((s) => s === 'skyscanner');
    const rest = sites.filter((s) => s !== 'skyscanner');
    return sky.length ? [...sky, ...rest] : sites;
  };
  let orderedSites = config.serialSites || (hasCdp(config) && unique.includes('skyscanner'))
    ? skyscannerFirst(unique)
    : unique;
  // Cold Chrome after watchdog restart re-arms PerimeterX — prefer Kiwi first and mark Sky blocked.
  if (hasCdp(config) && chromeRecentlyRestarted() && unique.includes('skyscanner')) {
    noteSkyscannerBlocked();
    console.log('[flight-scraper] Chrome recently restarted — Skyscanner PX cooldown');
  }
  const pxCooldown =
    hasCdp(config) && unique.includes('skyscanner') && unique.includes('kiwi') && isSkyscannerBlocked();
  // After a PX wall, Skyscanner first can burn 10+ minutes before Kiwi runs; serve Kiwi first.
  if (pxCooldown) {
    orderedSites = ['kiwi', 'skyscanner'];
    console.log('[flight-scraper] skyscanner PX cooldown — scrape kiwi before skyscanner');
  }

  let results;
  // Parallel CDP tabs routinely trip Skyscanner PerimeterX on the shared VPS Chrome profile.
  // On CDP, always run Skyscanner first (alone), then other OTAs — even when SCRAPER_SERIAL_SITES=0.
  if (unique.length > 1 && hasCdp(config)) {
    console.log(`[flight-scraper] serial CDP scrape sites=${orderedSites.join(',')}`);
    results = await scrapeSerial(req, config, orderedSites, { skyscannerPxCooldown: pxCooldown });
    // Do not run a second full Skyscanner scrape in the same request — it routinely pushes
    // scrapeAll past the API soft deadline when the first pass already hit PerimeterX.
  } else if (config.serialSites) {
    console.log(`[flight-scraper] serial scrape sites=${orderedSites.join(',')}`);
    results = await scrapeSerial(req, config, orderedSites, { skyscannerPxCooldown: pxCooldown });
  } else {
    results = await Promise.all(unique.map((site) => runWithSiteBudget(site, req, config)));
  }

  console.log(
    `[flight-scraper] scrapeAll done durationMs=${Date.now() - started} sites=${results
      .map((r) => `${r.site}:${r.offers?.length || 0}/${r.durationMs || 0}ms`)
      .join(',')}`,
  );
  return { sites: results };
}

module.exports = { scrapeAll, SITE_FNS };