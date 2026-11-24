'use strict';

const { withPage, gotoAndSettle, skyscannerDate } = require('../src/sites/shared');
const { attachJsonCapture } = require('../src/sites/jsonCapture');
const { pageLooksBlocked } = require('../src/browser/botWall');
const { waitUntil } = require('../src/browser/fastLoad');
const { extractUnifiedOffers, webUnifiedSettled } = require('../src/sites/skyscannerParse');
const config = require('../src/config');

function skyscannerUrl(req, host = 'www.skyscanner.fr') {
  const o = String(req.origin).toLowerCase();
  const d = String(req.destination).toLowerCase();
  const dep = skyscannerDate(req.departureDate);
  const ret = req.returnDate ? skyscannerDate(req.returnDate) : '';
  const adults = Math.max(1, req.adults || 1);
  const base = `https://${host}/transport/vols/${o}/${d}/${dep}`;
  const qs = `adultsv2=${adults}&cabinclass=economy&rtn=${ret ? 1 : 0}&preferdirects=false`;
  return ret ? `${base}/${ret}/?${qs}` : `${base}/?${qs}`;
}

function extractSkyscanner(payloads, req) {
  const unified = extractUnifiedOffers(payloads, req);
  if (unified.length) return unified;
  return [];
}

const req = {
  origin: process.env.ORIGIN || 'TLV',
  destination: process.env.DEST || 'VIE',
  departureDate: process.env.DEP || '2026-12-10',
  returnDate: process.env.RET || '2026-12-17',
  adults: 1,
  currency: 'USD',
};

const url = skyscannerUrl(req);

(async () => {
  await withPage(config.headless, async (page) => {
    const captured = attachJsonCapture(
      page,
      /skyscanner|graphql|radar|chicken-wings|flights|unified|itinerary/i,
    );
    try {
      await gotoAndSettle(page, url, config, { networkIdleMs: 8000 });
    } catch (e) {
      console.log('goto_error', String(e.message || e).slice(0, 120));
    }
    // Wait for fare cards only — do not gate on unified JSON.
    await waitUntil(
      page,
      async () =>
        (await page.locator('[data-testid="ticket"], [data-testid="itinerary-card"]').count().catch(() => 0)) >
        0,
      { timeoutMs: Number(process.env.WAIT_MS || 55000), intervalMs: 300 },
    );

    const blocked = await pageLooksBlocked(page);
    const captcha = /captcha-v2/i.test(page.url());
    const settled = webUnifiedSettled(captured);
    const parsed = extractSkyscanner(captured, req);
    const inbound = parsed.filter((o) => (o.segments || []).some((s) => s.leg === 'inbound'));
    const cards = await page
      .locator('[data-testid="ticket"], [data-testid="itinerary-card"]')
      .count()
      .catch(() => -1);
    const title = await page.title().catch(() => '');
    const snippet = await page
      .evaluate(() => (document.body?.innerText || '').slice(0, 400))
      .catch(() => '');

    console.log(
      JSON.stringify(
        {
          finalUrl: page.url(),
          blocked,
          captcha,
          jsonPayloads: captured.length,
          webUnifiedSettled: settled,
          parsedTotal: parsed.length,
          parsedWithInbound: inbound.length,
          domCards: cards,
          title,
          bodySnippet: snippet.replace(/\s+/g, ' ').trim(),
        },
        null,
        2,
      ),
    );
  });
})().catch((e) => {
  console.error('fatal', e);
  process.exit(1);
});