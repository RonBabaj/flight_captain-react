'use strict';

const { withPage, yyyymmdd } = require('./shared');
const { offerTemplate, segment } = require('../normalize');

function expediaUrl(req) {
  const dep = yyyymmdd(req.departureDate);
  const ret = req.returnDate ? yyyymmdd(req.returnDate) : '';
  const trip = ret ? 'roundtrip' : 'oneway';
  const params = new URLSearchParams({
    trip,
    leg1: `from:${req.origin},to:${req.destination},departure:${dep}TANYT`,
    passengers: `adults:${Math.max(1, req.adults || 1)}`,
    mode: 'search',
  });
  if (ret) {
    params.set('leg2', `from:${req.destination},to:${req.origin},departure:${ret}TANYT`);
  }
  return `https://www.expedia.com/Flights-Search?${params.toString()}`;
}

async function scrapeExpedia(req, config) {
  if (config.dryRun) {
    return { offers: [], error: 'dry run' };
  }
  const url = expediaUrl(req);

  try {
    const offers = await withPage(config.headless, async (page) => {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: config.navigationTimeoutMs });
      await page.waitForTimeout(10000);

      const rows = await page.evaluate(() => {
        const out = [];
        document.querySelectorAll('[data-stid="offer-card"], .uitk-card, [class*="offer-card"]').forEach((card) => {
          const priceEl =
            card.querySelector('[data-stid="price-lockup-text"]') ||
            card.querySelector('[class*="price"]') ||
            card.querySelector('[data-test-id="offer-price"]');
          const price = parseFloat(String(priceEl?.textContent || '').replace(/[^\d.]/g, ''));
          if (!price || price < 20) return;
          const link = card.querySelector('a[href*="expedia"]')?.href || window.location.href;
          out.push({ price, link });
        });
        return out.slice(0, 20);
      });

      return rows.map((row) =>
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
              departureTime: `${req.departureDate}T10:00:00Z`,
              arrivalTime: `${req.departureDate}T20:00:00Z`,
            }),
          ],
        }),
      );
    });
    return { offers, error: offers.length ? undefined : 'no expedia offers parsed' };
  } catch (err) {
    return { offers: [], error: String(err.message || err) };
  }
}

module.exports = { scrapeExpedia, expediaUrl };
