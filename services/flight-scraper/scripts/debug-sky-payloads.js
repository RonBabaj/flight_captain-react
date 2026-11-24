'use strict';

const { withPage, gotoAndSettle, skyscannerDate } = require('../src/sites/shared');
const { attachJsonCapture } = require('../src/sites/jsonCapture');

function webUnifiedPayloads(payloads) {
  return (payloads || []).filter((p) => p && Array.isArray(p.itineraries?.results));
}
const config = require('../src/config');

const req = {
  origin: process.env.ORIGIN || 'TLV',
  destination: process.env.DEST || 'VIE',
  departureDate: process.env.DEP || '2026-12-10',
  returnDate: process.env.RET || '2026-12-17',
  adults: 1,
};

function skyUrl(r) {
  const o = String(r.origin).toLowerCase();
  const d = String(r.destination).toLowerCase();
  const dep = skyscannerDate(r.departureDate);
  const ret = skyscannerDate(r.returnDate);
  return `https://www.skyscanner.fr/transport/vols/${o}/${d}/${dep}/${ret}/?adultsv2=1&cabinclass=economy&rtn=1`;
}

(async () => {
  const url = skyUrl(req);
  const apiUrls = [];
  await withPage(config.headless, async (page) => {
    const captured = attachJsonCapture(page, /./);
    page.on('response', (r) => {
      const u = r.url();
      if (/skyscanner/i.test(u) && /json|graphql/i.test(r.headers()['content-type'] || '')) {
        apiUrls.push(`${r.status()} ${u.replace(/\?.*/, '').slice(-96)}`);
      }
    });
    await gotoAndSettle(page, url, config);
    const waitMs = Number(process.env.WAIT_MS || 50000);
    const step = 5000;
    for (let elapsed = 0; elapsed < waitMs; elapsed += step) {
      await page.waitForTimeout(step);
      const unified = webUnifiedPayloads(captured);
      const cards = await page.locator('[data-testid="ticket"]').count().catch(() => 0);
      if (unified.some((p) => (p.itineraries?.results?.length || 0) > 0) || cards > 0) break;
    }
    const unified = webUnifiedPayloads(captured);
    const summaries = captured.slice(0, 25).map((p, i) => ({
      i,
      keys: Object.keys(p || {}).slice(0, 10),
      resultCount: p?.itineraries?.results?.length ?? 0,
      status: p?.context?.status,
    }));
    const flightApis = apiUrls.filter((u) =>
      /unified|radar|chicken|graphql|falcon|itinerary|verticals|slipstream/i.test(u),
    );
    console.log(
      JSON.stringify(
        {
          finalUrl: page.url(),
          title: await page.title(),
          domCards: await page.locator('[data-testid="ticket"]').count().catch(() => 0),
          bodyTextLen: await page.evaluate(() => (document.body?.innerText || '').length).catch(() => 0),
          captureCount: captured.length,
          webUnifiedPayloads: unified.length,
          maxResults: unified.reduce((m, p) => Math.max(m, p.itineraries?.results?.length || 0), 0),
          summaries,
          flightApiHits: [...new Set(flightApis)].slice(0, 20),
        },
        null,
        2,
      ),
    );
  }, { site: 'skyscanner' });
})().catch((e) => {
  console.error(String(e.message || e));
  process.exit(1);
});