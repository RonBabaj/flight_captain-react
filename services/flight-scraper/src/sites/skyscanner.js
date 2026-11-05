'use strict';

const { withPage, gotoAndSettle, yyyymmdd } = require('./shared');
const { attachJsonCapture } = require('./jsonCapture');
const { offerTemplate, segment } = require('../normalize');

function skyscannerUrl(req) {
  const o = String(req.origin).toLowerCase();
  const d = String(req.destination).toLowerCase();
  const dep = yyyymmdd(req.departureDate);
  const ret = req.returnDate ? yyyymmdd(req.returnDate) : '';
  if (ret) {
    return `https://www.skyscanner.net/transport/flights/${o}/${d}/${dep}/${ret}/?adultsv2=${Math.max(1, req.adults || 1)}&cabinclass=economy&rtn=1`;
  }
  return `https://www.skyscanner.net/transport/flights/${o}/${d}/${dep}/?adultsv2=${Math.max(1, req.adults || 1)}&cabinclass=economy`;
}

async function scrapeSkyscanner(req, config) {
  if (config.dryRun) {
    return { offers: [], error: 'dry run' };
  }
  const url = skyscannerUrl(req);

  try {
    const offers = await withPage(config.headless, async (page) => {
      const captured = attachJsonCapture(page, /skyscanner|graphql|radar|chicken-wings|flights/i);

      await gotoAndSettle(page, url, config);

      let parsed = extractSkyscanner(captured, req);
      if (parsed.length) return parsed.slice(0, config.maxOffersPerSite);

      try {
        await page.waitForSelector('[data-testid="itinerary-card"], [class*="FlightsTicket"]', {
          timeout: 18000,
        });
      } catch {
        /* fall through */
      }

      const dom = await page.evaluate(() => {
        const out = [];
        const cards = document.querySelectorAll('[data-testid="itinerary-card"], [class*="FlightsTicket"]');
        cards.forEach((card) => {
          const priceEl =
            card.querySelector('[data-testid="price"]') ||
            card.querySelector('[class*="Price"]') ||
            card.querySelector('span[class*="price"]');
          const price = parseFloat(String(priceEl?.textContent || '').replace(/[^\d.]/g, ''));
          if (!price || price < 20) return;
          const link = card.querySelector('a[href*="skyscanner"]')?.href || window.location.href;
          out.push({ price, link });
        });
        if (out.length) return out;
        document.querySelectorAll('[data-testid*="price"], [class*="Price_mainPrice"]').forEach((el) => {
          const price = parseFloat(String(el.textContent || '').replace(/[^\d.]/g, ''));
          if (price > 20 && price < 50000) out.push({ price, link: window.location.href });
        });
        return out.slice(0, 20);
      });

      return dom.map((row) =>
        offerTemplate({
          origin: req.origin,
          destination: req.destination,
          price: row.price,
          currency: req.currency || 'USD',
          bookingUrl: row.link,
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
  const seen = new Set();
  for (const p of payloads) {
    walk(p, (node) => {
      let price = node.price || node.rawPrice || node.amount || node.minPrice;
      if (price && typeof price === 'object') price = price.amount || price.value;
      if (typeof price !== 'number' || price <= 0) return;
      const segs = normalizeLegs(node);
      const key = String(price);
      if (seen.has(key) && segs.length === 0) return;
      seen.add(key);
      out.push(
        offerTemplate({
          origin: req.origin,
          destination: req.destination,
          price,
          currency: req.currency || 'USD',
          bookingUrl: node.deepLink || node.deeplink || skyscannerUrl(req),
          segments:
            segs.length > 0
              ? segs
              : [
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
  }
  return out;
}

function walk(node, fn, depth = 0) {
  if (!node || depth > 12) return;
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
  const legs = node.legs || node.segments || node.outboundLegs || [];
  if (!Array.isArray(legs)) return segs;
  for (const leg of legs) {
    const from = leg.origin?.iata || leg.originPlaceId || leg.origin || leg.from;
    const to = leg.destination?.iata || leg.destinationPlaceId || leg.destination || leg.to;
    if (!from || !to) continue;
    segs.push(
      segment({
        leg: 'outbound',
        from: String(from).slice(-3).toUpperCase(),
        to: String(to).slice(-3).toUpperCase(),
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
