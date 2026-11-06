'use strict';

const express = require('express');
const config = require('./config');
const { scrapeAll } = require('./scrape');
const { startWarmLoop, warmStatus } = require('./warm');
const { beginSearch, endSearch } = require('./searchBusy');

const app = express();
app.use(express.json({ limit: '1mb' }));

function authOk(req) {
  if (!config.token) return true;
  const h = req.headers.authorization || '';
  if (h === `Bearer ${config.token}`) return true;
  return false;
}

app.get('/health', (_req, res) => {
  const warm = warmStatus();
  res.json({
    status: 'ok',
    service: 'flight-scraper',
    sites: config.defaultSites,
    dryRun: config.dryRun,
    browser: config.cdpUrls?.length ? 'chrome-cdp' : config.headless ? 'playwright-headless' : 'playwright-headed',
    cdpEndpoints: config.cdpUrls?.length ? config.cdpUrls.length : 0,
    display: config.display || undefined,
    warm: {
      ok: warm.ok,
      at: warm.at || undefined,
      detail: warm.detail,
    },
  });
});

app.post('/v1/search', async (req, res) => {
  if (!authOk(req)) {
    res.status(401).json({ error: 'unauthorized' });
    return;
  }
  const body = req.body || {};
  const origin = String(body.origin || '').trim().toUpperCase();
  const destination = String(body.destination || '').trim().toUpperCase();
  const departureDate = String(body.departureDate || '').trim();
  if (!origin || !destination || !departureDate) {
    res.status(400).json({ error: 'origin, destination, departureDate required' });
    return;
  }
  const searchReq = {
    origin,
    destination,
    departureDate,
    returnDate: String(body.returnDate || '').trim(),
    adults: Number(body.adults || 1),
    children: Number(body.children || 0),
    infants: Number(body.infants || 0),
    currency: String(body.currency || 'USD').toUpperCase(),
    cabinClass: String(body.cabinClass || 'ECONOMY').toUpperCase(),
    checkedBags: !!body.checkedBags,
    sites: Array.isArray(body.sites) ? body.sites : config.parseSites(process.env.FLIGHT_SCRAPER_SITES),
  };

  beginSearch();
  try {
    const result = await scrapeAll(searchReq, config);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: String(err.message || err) });
  } finally {
    endSearch();
  }
});

app.listen(config.port, () => {
  console.log(`[flight-scraper] listening on :${config.port} sites=${config.defaultSites.join(',')}`);
  if (process.env.SCRAPER_WARM_ON_START !== '0') {
    startWarmLoop(config);
  }
});
