'use strict';

const { withPage, gotoAndSettle } = require('./shared');
const { attachJsonCapture } = require('./jsonCapture');
const { offerTemplate, segment } = require('../normalize');

function expediaUrl(req) {
  const dep = String(req.departureDate || '').slice(0, 10);
  const ret = req.returnDate ? String(req.returnDate).slice(0, 10) : '';
  const trip = ret ? 'roundtrip' : 'oneway';
  const params = new URLSearchParams({
    trip,
    leg1: `from:${req.origin},to:${req.destination},departure:${dep}TANYT`,
    passengers: `adults:${Math.max(1, req.adults || 1)}`,
    mode: 'search',
    options: 'carrier:*',
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
      attachJsonCapture(page, /expedia|graphql|flight/i);

      await gotoAndSettle(page, url, config);

      try {
        await page.waitForSelector('[data-stid="offer-card"], [data-test-id="offer-listing"]', {
          timeout: 22000,
        });
      } catch {
        /* DOM scrape anyway */
      }

      const rows = await page.evaluate(() => {
        const out = [];
        const selectors = [
          '[data-stid="offer-card"]',
          '[data-test-id="offer-listing"]',
          'li[data-test-id="listing"]',
          '[class*="uitk-card"]',
        ];
        for (const sel of selectors) {
          document.querySelectorAll(sel).forEach((card) => {
            const priceEl =
              card.querySelector('[data-stid="price-lockup-text"]') ||
              card.querySelector('[data-test-id="offer-price"]') ||
              card.querySelector('[class*="price"]');
            const price = parseFloat(String(priceEl?.textContent || '').replace(/[^\d.]/g, ''));
            if (!price || price < 20) return;
            const link = card.querySelector('a[href*="expedia"]')?.href || window.location.href;
            out.push({ price, link });
          });
          if (out.length) break;
        }
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
    }, { proxyUrl: config.proxyUrl });
    return { offers, error: offers.length ? undefined : 'no expedia offers parsed' };
  } catch (err) {
    return { offers: [], error: String(err.message || err) };
  }
}

module.exports = { scrapeExpedia, expediaUrl };
