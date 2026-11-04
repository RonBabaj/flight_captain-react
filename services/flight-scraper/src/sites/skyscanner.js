'use strict';

const { withPage, yyyymmdd } = require('./shared');
const { offerTemplate, segment } = require('../normalize');

function skyscannerUrl(req) {
  const o = String(req.origin).toLowerCase();
  const d = String(req.destination).toLowerCase();
  const dep = yyyymmdd(req.departureDate);
  const ret = req.returnDate ? yyyymmdd(req.returnDate) : '';
  if (ret) {
    return `https://www.skyscanner.net/transport/flights/${o}/${d}/${dep}/${ret}/`;
  }
  return `https://www.skyscanner.net/transport/flights/${o}/${d}/${dep}/`;
}

async function scrapeSkyscanner(req, config) {
  if (config.dryRun) {
    return { offers: [], error: 'dry run' };
  }
  const url = skyscannerUrl(req);
  const payloads = [];

  try {
    const offers = await withPage(config.headless, async (page) => {
      page.on('response', async (resp) => {
        try {
          const u = resp.url();
          if (!/skyscanner/i.test(u)) return;
          if (!/graphql|api|search/i.test(u)) return;
          const ct = resp.headers()['content-type'] || '';
          if (!ct.includes('json')) return;
          payloads.push(await resp.json());
        } catch {
          /* ignore */
        }
      });

      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: config.navigationTimeoutMs });
      await page.waitForTimeout(9000);

      const parsed = extractSkyscanner(payloads, req);
      if (parsed.length) return parsed.slice(0, config.maxOffersPerSite);

      const dom = await page.evaluate(() => {
        const prices = [];
        document.querySelectorAll('[class*="Price"], [data-testid*="price"]').forEach((el) => {
          const n = parseFloat(String(el.textContent || '').replace(/[^\d.]/g, ''));
          if (n > 20 && n < 50000) prices.push(n);
        });
        return [...new Set(prices)].slice(0, 15);
      });

      return dom.map((price) =>
        offerTemplate({
          origin: req.origin,
          destination: req.destination,
          price,
          currency: req.currency || 'USD',
          bookingUrl: url,
          segments: [
            segment({
              leg: 'outbound',
              from: req.origin,
              to: req.destination,
              departureTime: `${req.departureDate}T09:00:00Z`,
              arrivalTime: `${req.departureDate}T19:00:00Z`,
            }),
          ],
        }),
      );
    });
    return {
      offers,
      error: offers.length ? undefined : 'no skyscanner offers parsed',
    };
  } catch (err) {
    return { offers: [], error: String(err.message || err) };
  }
}

function extractSkyscanner(payloads, req) {
  const out = [];
  for (const p of payloads) {
    walk(p, (node) => {
      const price = node.price || node.rawPrice || node.amount;
      if (typeof price !== 'number' || price <= 0) return;
      if (!node.legs && !node.segments) return;
      out.push(
        offerTemplate({
          origin: req.origin,
          destination: req.destination,
          price,
          currency: req.currency || 'USD',
          bookingUrl: node.deepLink || node.deeplink || skyscannerUrl(req),
          segments: normalizeLegs(node),
        }),
      );
    });
  }
  return out;
}

function walk(node, fn, depth = 0) {
  if (!node || depth > 10) return;
  if (Array.isArray(node)) {
    node.forEach((x) => walk(x, fn, depth + 1));
    return;
  }
  if (typeof node === 'object') {
    fn(node);
    for (const v of Object.values(node)) walk(v, fn, depth + 1);
  }
}

function normalizeLegs(node) {
  const segs = [];
  const legs = node.legs || node.segments || [];
  if (!Array.isArray(legs)) return segs;
  for (const leg of legs) {
    const from = leg.origin?.iata || leg.origin || leg.from;
    const to = leg.destination?.iata || leg.destination || leg.to;
    if (!from || !to) continue;
    segs.push(
      segment({
        leg: 'outbound',
        from,
        to,
        departureTime: leg.departure || leg.departureTime,
        arrivalTime: leg.arrival || leg.arrivalTime,
        airline: leg.marketingCarrier?.iata || leg.carrier,
        flightNumber: leg.flightNumber,
      }),
    );
  }
  return segs;
}

module.exports = { scrapeSkyscanner, skyscannerUrl };
