'use strict';

const { scrapeKiwi } = require('./sites/kiwi');
const { scrapeSkyscanner } = require('./sites/skyscanner');
const { scrapeExpedia } = require('./sites/expedia');
const { isSkyscannerBlocked } = require('./warm');
const SITE_FNS = {
  kiwi: scrapeKiwi,
  skyscanner: scrapeSkyscanner,
  expedia: scrapeExpedia,
};

function hasCdp(config) {
  return !!(config.cdpUrls?.length || config.cdpUrl);
}

async function runOne(site, req, config) {
  const fn = SITE_FNS[site];
  if (!fn) {
    return { site, offers: [], error: `unknown site ${site}`, durationMs: 0 };
  }
  const started = Date.now();
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
    console.log(`[flight-scraper] site=${site} durationMs=${durationMs} error=${String(err.message || err).slice(0, 120)}`);
    return { site, offers: [], error: String(err.message || err), durationMs };
  }
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
  // After a PX wall, Skyscanner first can burn 10+ minutes before Kiwi runs; serve Kiwi first.
  if (hasCdp(config) && unique.includes('skyscanner') && unique.includes('kiwi') && isSkyscannerBlocked()) {
    orderedSites = ['kiwi', 'skyscanner'];
    console.log('[flight-scraper] skyscanner PX cooldown — scrape kiwi before skyscanner');
  }

  let results;
  // Parallel CDP tabs routinely trip Skyscanner PerimeterX on the shared VPS Chrome profile.
  // On CDP, always run Skyscanner first (alone), then other OTAs — even when SCRAPER_SERIAL_SITES=0.
  if (unique.length > 1 && hasCdp(config)) {
    console.log(`[flight-scraper] serial CDP scrape sites=${orderedSites.join(',')}`);
    results = [];
    const scrapeBudgetMs = Math.min(
      Math.max(Number(process.env.SCRAPER_ALL_MAX_MS || 600_000) || 600_000, 120_000),
      720_000,
    );
    for (const site of orderedSites) {
      if (Date.now() - started > scrapeBudgetMs) {
        console.log(`[flight-scraper] scrapeAll budget exceeded — skip ${site}`);
        results.push({ site, offers: [], error: 'scrape budget exceeded', durationMs: 0 });
        continue;
      }
      results.push(await runOne(site, req, config));
    }
    // Do not run a second full Skyscanner scrape in the same request — it routinely pushes
    // scrapeAll past the API soft deadline when the first pass already hit PerimeterX.
  } else if (config.serialSites) {
    console.log(`[flight-scraper] serial scrape sites=${orderedSites.join(',')}`);
    results = [];
    for (const site of orderedSites) {
      results.push(await runOne(site, req, config));
    }
  } else {
    results = await Promise.all(unique.map((site) => runOne(site, req, config)));
  }

  console.log(
    `[flight-scraper] scrapeAll done durationMs=${Date.now() - started} sites=${results
      .map((r) => `${r.site}:${r.offers?.length || 0}/${r.durationMs || 0}ms`)
      .join(',')}`,
  );
  return { sites: results };
}

module.exports = { scrapeAll, SITE_FNS };
