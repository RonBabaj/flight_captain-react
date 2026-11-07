'use strict';

const { scrapeKiwi } = require('./sites/kiwi');
const { scrapeSkyscanner } = require('./sites/skyscanner');
const { scrapeExpedia } = require('./sites/expedia');
const { withCdpBrowser } = require('./browser/session');
const { runWithOpenPage } = require('./browser/parallelContext');

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

  let results;
  // One headed Chrome: parallel tabs on a single CDP connection (shared lock).
  // Serial mode is opt-in for low-RAM hosts (SCRAPER_SERIAL_SITES=1).
  if (!config.serialSites && unique.length > 1 && hasCdp(config)) {
    console.log(`[flight-scraper] parallel CDP scrape sites=${unique.join(',')}`);
    results = await withCdpBrowser(config, async ({ openPage }) =>
      runWithOpenPage(openPage, () => Promise.all(unique.map((site) => runOne(site, req, config)))),
    );
  } else if (config.serialSites) {
    console.log(`[flight-scraper] serial scrape sites=${unique.join(',')}`);
    results = [];
    for (const site of unique) {
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
