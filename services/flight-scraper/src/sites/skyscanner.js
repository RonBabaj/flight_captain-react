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
  const base = `https://www.skyscanner.com/transport/flights/${o}/${d}/${dep}`;
  if (ret) {
    return `${base}/${ret}/?adultsv2=${adults}&cabinclass=economy&rtn=1`;
  }
  return `${base}/?adultsv2=${adults}&cabinclass=economy&rtn=0`;
}

async function scrapeSkyscanner(req, config) {
  if (config.dryRun) {
    return { offers: [], error: 'dry run' };
  }
  const url = skyscannerUrl(req);
  const proxyHint = config.proxyUrl
    ? 'no skyscanner offers parsed'
    : 'Skyscanner PerimeterX — set SCRAPER_PROXY_URL (residential sticky session)';

  return runWithRetries(config.headless, 'skyscanner', async () => {
    const offers = await withPage(
      config.headless,
      async (page) => {
        if (!(await warmHomepage(page, SKY_HOME, config.headless))) {
          return [];
        }

        const captured = attachJsonCapture(page, /skyscanner|graphql|radar|chicken-wings|flights|unified/i);
        await gotoAndSettle(page, url, config);
        if (await pageLooksBlocked(page)) {
          return [];
        }

        await page.evaluate(() => window.scrollBy(0, 700)).catch(() => {});
        await page.waitForTimeout(2000);

        try {
          const cheapest = page.locator('button:has-text("Cheapest"), [role="tab"]:has-text("Cheapest")').first();
          if (await cheapest.isVisible({ timeout: 4000 })) {
            await cheapest.click({ timeout: 5000 });
            await page.waitForTimeout(2500);
          }
        } catch {
          /* optional */
        }

        let parsed = extractSkyscanner(captured, req);
        if (parsed.length) return parsed.slice(0, config.maxOffersPerSite);

        try {
          await page.waitForSelector('[data-testid="itinerary-card"], [class*="FlightsTicket"]', {
            timeout: 18000,
          });
        } catch {
          /* DOM fallback */
        }

        const dom = await page.evaluate(() => {
          const out = [];
          document.querySelectorAll('[data-testid="itinerary-card"], [class*="FlightsTicket"]').forEach((card) => {
            const priceEl =
              card.querySelector('[data-testid="price"]') ||
              card.querySelector('[class*="Price"]') ||
              card.querySelector('span[class*="price"]');
            const price = parseFloat(String(priceEl?.textContent || '').replace(/[^\d.]/g, ''));
            if (!price || price < 20) return;
            const link = card.querySelector('a[href*="skyscanner"]')?.href || window.location.href;
            out.push({ price, link });
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
      },
      { proxyUrl: config.proxyUrl, engines: ['chromium', 'firefox'] },
    );

    if (offers.length) return { offers, error: undefined };
    return { offers: [], error: proxyHint };
  }).then(({ offers, error }) => ({ offers: offers || [], error: offers?.length ? undefined : error }));
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
