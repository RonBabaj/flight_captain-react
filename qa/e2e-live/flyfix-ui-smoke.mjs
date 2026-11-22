#!/usr/bin/env node
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';

const SITE = 'https://fly-fix.com';
const url = `${SITE}/search/results?origin=TLV&destination=JFK&departureDate=2026-06-15&adults=1&currency=USD`;

await mkdir('/opt/cursor/artifacts', { recursive: true });
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });

const logs = [];
page.on('console', (m) => logs.push(m.text()));

await page.goto(url, { waitUntil: 'networkidle', timeout: 120_000 }).catch(() =>
  page.goto(url, { waitUntil: 'domcontentloaded', timeout: 120_000 }),
);

let parallel = false;
let merging = false;
for (let i = 0; i < 90; i++) {
  const text = await page.locator('body').innerText();
  if (/parallel/i.test(text)) parallel = true;
  if (/Merging Google Flights/i.test(text)) merging = true;
  if (parallel) break;
  await page.waitForTimeout(1000);
}
await page.screenshot({ path: '/opt/cursor/artifacts/flyfix-loading.png' });

let cards = 0;
for (let i = 0; i < 120; i++) {
  cards = await page.locator('text=/\\$[0-9]/').count();
  if (cards >= 3) break;
  await page.waitForTimeout(2000);
}
await page.screenshot({ path: '/opt/cursor/artifacts/flyfix-results.png', fullPage: true });

console.log(JSON.stringify({ parallel, merging, priceLines: cards, url }, null, 2));
await browser.close();
process.exit(merging && !parallel ? 1 : 0);