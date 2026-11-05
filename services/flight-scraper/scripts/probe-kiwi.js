'use strict';

const { withPage, gotoAndSettle } = require('../src/sites/shared');
const { attachJsonCapture } = require('../src/sites/jsonCapture');
const config = require('../src/config');

const url = 'https://www.kiwi.com/en/search/results/tlv/vie/2027-06-15/2027-06-22/';

withPage(config.headless, async (page) => {
  const cap = attachJsonCapture(page, /skypicker|graphql|umbrella|search/i);
  await gotoAndSettle(page, url, config);
  const cards = await page.locator('[data-test="ResultCard"]').count();
  const cookieVisible = await page.locator('[data-test="CookiesPopup-Accept"]').isVisible().catch(() => false);
  const title = await page.title();
  const sample = cap.slice(0, 3).map((j) => JSON.stringify(j).slice(0, 120));
  console.log(JSON.stringify({ title, cookieVisible, cards, captured: cap.length, sample }, null, 2));
}).then(() => process.exit(0)).catch((e) => {
  console.error(e);
  process.exit(1);
});
