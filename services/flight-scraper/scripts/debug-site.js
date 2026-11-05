'use strict';

const { chromium } = require('playwright');

const site = process.argv[2] || 'kiwi';
const origin = process.argv[3] || 'TLV';
const dest = process.argv[4] || 'VIE';

async function main() {
  const browser = await chromium.launch({
    headless: process.env.PLAYWRIGHT_HEADLESS !== '0',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
  });
  const ctx = await browser.newContext({
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
    locale: 'en-US',
    viewport: { width: 1400, height: 900 },
  });
  const page = await ctx.newPage();
  const hits = [];
  page.on('response', async (resp) => {
    const u = resp.url();
    if (!/kiwi|skypicker|skyscanner|expedia|graphql|search|flight/i.test(u)) return;
    const ct = resp.headers()['content-type'] || '';
    let sample = '';
    if (ct.includes('json') && resp.status() === 200) {
      try {
        const j = await resp.json();
        sample = JSON.stringify(j).slice(0, 200);
      } catch {
        sample = '(json parse fail)';
      }
    }
    hits.push({ status: resp.status(), url: u.slice(0, 160), sample });
  });

  let url;
  if (site === 'skyscanner') {
    url = `https://www.skyscanner.net/transport/flights/${origin.toLowerCase()}/${dest.toLowerCase()}/270615/270622/`;
  } else if (site === 'expedia') {
    url = `https://www.expedia.com/Flights-Search?trip=roundtrip&leg1=from:${origin},to:${dest},departure:270615TANYT&leg2=from:${dest},to:${origin},departure:270622TANYT&passengers=adults:1&mode=search`;
  } else {
    url = `https://www.kiwi.com/en/search/results/${origin.toLowerCase()}/${dest.toLowerCase()}/2027-06-15/2027-06-22`;
  }

  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(15000);
  const title = await page.title();
  const text = await page.evaluate(() => document.body?.innerText?.slice(0, 500) || '');
  const dataTests = await page.evaluate(() =>
    [...document.querySelectorAll('[data-test]')].slice(0, 15).map((el) => el.getAttribute('data-test')),
  );
  console.log(JSON.stringify({ site, url, title, textPreview: text, dataTests, hits: hits.slice(0, 20) }, null, 2));
  await browser.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
