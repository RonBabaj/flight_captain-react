'use strict';

const { scrapeKiwi } = require('./sites/kiwi');
const { scrapeSkyscanner } = require('./sites/skyscanner');
const { scrapeExpedia } = require('./sites/expedia');

const SITE_FNS = {
  kiwi: scrapeKiwi,
  skyscanner: scrapeSkyscanner,
  expedia: scrapeExpedia,
};

async function scrapeAll(req, config) {
  const sites = (req.sites && req.sites.length ? req.sites : config.defaultSites).map((s) =>
    String(s).toLowerCase(),
  );
  const unique = [...new Set(sites)];
  const runOne = async (site) => {
    const fn = SITE_FNS[site];
    if (!fn) {
      return { site, offers: [], error: `unknown site ${site}` };
    }
    const started = Date.now();
    try {
      const { offers, error } = await fn(req, config);
      return {
        site,
        offers: offers || [],
        error,
        durationMs: Date.now() - started,
      };
    } catch (err) {
      return { site, offers: [], error: String(err.message || err), durationMs: Date.now() - started };
    }
  };

  let results;
  if (config.serialSites) {
    results = [];
    for (const site of unique) {
      results.push(await runOne(site));
    }
  } else {
    results = await Promise.all(unique.map(runOne));
  }
  return { sites: results };
}

module.exports = { scrapeAll, SITE_FNS };
