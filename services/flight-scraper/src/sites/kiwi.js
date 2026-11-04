'use strict';

const { withPage, yyyymmdd } = require('./shared');
const { offerTemplate, segment } = require('../normalize');

function kiwiSearchUrl(req) {
  const o = String(req.origin).toLowerCase();
  const d = String(req.destination).toLowerCase();
  const dep = req.departureDate;
  const ret = req.returnDate || '';
  if (ret) {
    return `https://www.kiwi.com/en/search/results/${o}/${d}/${dep}/${ret}`;
  }
  return `https://www.kiwi.com/en/search/results/${o}/${d}/${dep}`;
}

async function scrapeKiwi(req, config) {
  if (config.dryRun) {
    return { offers: [], error: 'dry run' };
  }
  const captured = [];
  const url = kiwiSearchUrl(req);

  try {
    const offers = await withPage(config.headless, async (page) => {
      page.on('response', async (resp) => {
        try {
          const u = resp.url();
          if (!/kiwi\.com/i.test(u)) return;
          if (!/search|graphql|itinerary|results/i.test(u)) return;
          const ct = resp.headers()['content-type'] || '';
          if (!ct.includes('json')) return;
          const json = await resp.json();
          captured.push(json);
        } catch {
          /* ignore parse errors */
        }
      });

      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: config.navigationTimeoutMs });
      await page.waitForTimeout(8000);

      const fromNetwork = extractFromCaptured(captured, req);
      if (fromNetwork.length > 0) {
        return fromNetwork.slice(0, config.maxOffersPerSite);
      }

      const fromDom = await page.evaluate(() => {
        const cards = document.querySelectorAll('[data-test="ResultCard"], [data-test="ResultCardWrapper"]');
        const out = [];
        cards.forEach((card, idx) => {
          const priceText =
            card.querySelector('[data-test="ResultCardPrice"]')?.textContent ||
            card.querySelector('[class*="price"]')?.textContent ||
            '';
          const num = parseFloat(String(priceText).replace(/[^\d.]/g, ''));
          if (!num || Number.isNaN(num)) return;
          const link = card.querySelector('a[href*="/booking"]')?.href || '';
          out.push({ idx, price: num, bookingUrl: link });
        });
        return out;
      });

      return fromDom.map((row, i) =>
        offerTemplate({
          origin: req.origin,
          destination: req.destination,
          price: row.price,
          currency: req.currency || 'USD',
          bookingUrl: row.bookingUrl,
          segments: [
            segment({
              leg: 'outbound',
              from: req.origin,
              to: req.destination,
              departureTime: `${req.departureDate}T08:00:00Z`,
              arrivalTime: `${req.departureDate}T18:00:00Z`,
            }),
          ],
        }),
      );
    });
    return { offers, error: offers.length ? undefined : 'no kiwi offers parsed (site layout or bot check)' };
  } catch (err) {
    return { offers: [], error: String(err.message || err) };
  }
}

function extractFromCaptured(blobs, req) {
  const flat = [];
  for (const b of blobs) {
    flat.push(...flattenOffers(b));
  }
  const out = [];
  for (const item of flat) {
    const price = pickNumber(item, ['price', 'priceUsd', 'amount', 'totalPrice']);
    if (!price) continue;
    const segs = pickSegments(item);
    if (!segs.length) continue;
    out.push(
      offerTemplate({
        origin: req.origin,
        destination: req.destination,
        price,
        currency: pickString(item, ['currency', 'currencyCode']) || req.currency || 'USD',
        bookingUrl: pickString(item, ['bookingUrl', 'deepLink', 'url']),
        selfTransfer: !!item.selfTransfer || !!item.virtualInterlining,
        segments: segs,
      }),
    );
  }
  return out;
}

function flattenOffers(node, depth = 0) {
  if (!node || depth > 8) return [];
  if (Array.isArray(node)) {
    return node.flatMap((x) => flattenOffers(x, depth + 1));
  }
  if (typeof node !== 'object') return [];
  if (node.segments || node.route || node.price || node.priceUsd) return [node];
  const keys = ['data', 'itineraries', 'results', 'items', 'flights', 'offers'];
  let out = [];
  for (const k of keys) {
    if (node[k]) out = out.concat(flattenOffers(node[k], depth + 1));
  }
  return out;
}

function pickSegments(item) {
  if (Array.isArray(item.segments)) {
    return item.segments.map((s) => ({
      leg: s.leg || s.direction || 'outbound',
      fromCode: s.fromCode || s.from || s.flyFrom,
      toCode: s.toCode || s.to || s.flyTo,
      departureTime: s.departureTime || s.departureTimeUtc,
      arrivalTime: s.arrivalTime || s.arrivalTimeUtc,
      airlineCode: s.airlineCode || s.airline,
      flightNumber: s.flightNumber,
    }));
  }
  return [];
}

function pickString(obj, keys) {
  for (const k of keys) {
    if (obj[k] && typeof obj[k] === 'string') return obj[k];
  }
  return '';
}

function pickNumber(obj, keys) {
  for (const k of keys) {
    const v = obj[k];
    if (typeof v === 'number' && v > 0) return v;
  }
  return 0;
}

module.exports = { scrapeKiwi, kiwiSearchUrl };
