'use strict';

const { withPage, runWithRetries, warmHomepage, gotoAndSettle, skyscannerDate } = require('./shared');
const { attachJsonCapture } = require('./jsonCapture');
const { offerTemplate, segment } = require('../normalize');
const { pageLooksBlocked } = require('../browser/botWall');

const SKY_HOME = 'https://www.skyscanner.com/';

function skyscannerUrl(req) {
  const o = String(req.origin).toLowerCase();
  const d = String(req.destination).toLowerCase();
  const dep = skyscannerDate(req.departureDate);
  const ret = req.returnDate ? skyscannerDate(req.returnDate) : '';
  const adults = Math.max(1, req.adults || 1);
  // .com redirects by culture cookie (often .fr on this VPS) — search path stays valid.
  const base = `https://www.skyscanner.com/transport/flights/${o}/${d}/${dep}`;
  if (ret) {
    return `${base}/${ret}/?adultsv2=${adults}&cabinclass=economy&rtn=1`;
  }
  return `${base}/?adultsv2=${adults}&cabinclass=economy&rtn=0`;
}

function parsePriceText(text) {
  const t = String(text || '').replace(/\u00a0/g, ' ').trim();
  // "164 €", "€164", "$118", "118"
  const m = t.match(/(\d[\d\s.,]*)\s*€/) || t.match(/€\s*(\d[\d\s.,]*)/) || t.match(/\$\s*(\d[\d\s.,]*)/) || t.match(/^(\d[\d.,]+)$/);
  if (!m) return 0;
  const num = parseFloat(m[1].replace(/\s/g, '').replace(',', '.'));
  return num > 15 && num < 50000 ? num : 0;
}

async function scrapeSkyscanner(req, config) {
  if (config.dryRun) {
    return { offers: [], error: 'dry run' };
  }
  const url = skyscannerUrl(req);

  return runWithRetries(config.headless, 'skyscanner', async () => {
    const offers = await withPage(config.headless, async (page) => {
      // Skip homepage warm — it often hits PerimeterX; deep search URLs work in headed Chrome.
      const captured = attachJsonCapture(page, /skyscanner|graphql|radar|chicken-wings|flights|unified|itinerary/i);
      await gotoAndSettle(page, url, config);

      // PerimeterX sometimes flashes then continues; wait for tickets or clear captcha URL.
      for (let i = 0; i < 8; i++) {
        const href = page.url();
        if (!/captcha-v2|person or a robot/i.test(href)) break;
        await page.waitForTimeout(2000);
      }
      if (await pageLooksBlocked(page)) {
        // Still on captcha after waits — empty this attempt.
        return [];
      }

      try {
        const cheapest = page
          .locator('[data-testid="FqsTab_CHEAPEST"], button:has-text("Cheapest"), button:has-text("moins cher"), [role="tab"]:has-text("Cheapest")')
          .first();
        if (await cheapest.isVisible({ timeout: 5000 })) {
          await cheapest.click({ timeout: 5000 });
          await page.waitForTimeout(2500);
        }
      } catch {
        /* optional sort */
      }

      await page.evaluate(() => window.scrollBy(0, 800)).catch(() => {});
      await page.waitForTimeout(1500);

      let parsed = extractSkyscanner(captured, req);
      if (parsed.length) return parsed.slice(0, config.maxOffersPerSite);

      try {
        await page.waitForSelector('[data-testid="ticket"], [data-testid="itinerary-card"]', {
          timeout: 25000,
        });
      } catch {
        /* DOM scrape anyway */
      }

      const dom = await page.evaluate(() => {
        const out = [];
        const cards = document.querySelectorAll(
          '[data-testid="ticket"], [data-testid="itinerary-card"], [class*="FlightsTicket"]',
        );
        cards.forEach((card) => {
          const priceEl =
            card.querySelector('[data-testid="price"]') ||
            card.querySelector('[data-testid="price-main-container"]') ||
            card.querySelector('[class*="Price"]') ||
            card.querySelector('span[class*="price"]');
          let priceText = priceEl?.textContent || '';
          if (!priceText) {
            const m = (card.textContent || '').match(/(\d[\d\s.,]*)\s*€|€\s*(\d[\d\s.,]*)/);
            priceText = m ? m[0] : '';
          }
          out.push({
            priceText,
            link: card.querySelector('a')?.href || window.location.href,
            text: (card.innerText || '').slice(0, 240),
          });
        });
        return out.slice(0, 30);
      });

      const fromDom = [];
      for (const row of dom) {
        const price = parsePriceText(row.priceText) || parsePriceText(row.text);
        if (!price) continue;
        fromDom.push(
          offerTemplate({
            origin: req.origin,
            destination: req.destination,
            price,
            currency: req.currency || 'EUR',
            bookingUrl: row.link || url,
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
      }
      return fromDom;
    }, { proxyUrl: config.proxyUrl, engines: ['chromium'] });

    if (offers.length) return { offers, error: undefined };
    return {
      offers: [],
      error: config.proxyUrl
        ? 'no skyscanner offers parsed'
        : 'no skyscanner offers (captcha or empty results)',
    };
  }).then(({ offers, error }) => ({
    offers: offers || [],
    error: offers?.length ? undefined : error,
  }));
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
