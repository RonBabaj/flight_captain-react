import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';

await mkdir('/opt/cursor/artifacts', { recursive: true });
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
await page.goto(
  'https://fly-fix.com/search/results?origin=TLV&destination=JFK&departureDate=2026-06-15&adults=1',
  { timeout: 90000, waitUntil: 'domcontentloaded' },
);
let text = await page.locator('body').innerText();
console.log('initial', { parallel: /parallel/i.test(text), merge: /Merging Google/i.test(text) });
for (let i = 0; i < 60; i++) {
  text = await page.locator('body').innerText();
  if (/\$[0-9]/.test(text)) break;
  if (/parallel/i.test(text)) {
    await page.screenshot({ path: '/opt/cursor/artifacts/flyfix-parallel-banner.png' });
  }
  await page.waitForTimeout(2000);
}
const prices = (text.match(/\$[\d,]+/g) || []).length;
await page.screenshot({ path: '/opt/cursor/artifacts/flyfix-ui-quick.png', fullPage: true });
console.log(
  JSON.stringify({
    parallel: /parallel/i.test(text),
    merge: /Merging Google/i.test(text),
    prices,
  }),
);
await browser.close();