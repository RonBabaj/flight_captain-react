#!/usr/bin/env node
/**
 * Live checks on fly-fix.com + api.fly-fix.com (post #222 #223).
 * Run: node flyfix-prod-check.mjs
 */
import { chromium } from 'playwright';

const SITE = process.env.FLYFIX_SITE || 'https://fly-fix.com';
const API = process.env.FLYFIX_API || 'https://api.fly-fix.com';
const ORIGIN = 'TLV';
const DEST = 'MBJ';
const DEP = '2026-03-15';
const RET = '2026-03-22';

const report = { ok: true, steps: [], partialObserved: false, completeObserved: false, parallelCopy: false, bookingResolve: null };

function step(name, pass, detail) {
  report.steps.push({ name, pass, detail });
  if (!pass) report.ok = false;
  const mark = pass ? 'PASS' : 'FAIL';
  console.log(`[${mark}] ${name}${detail ? ` — ${detail}` : ''}`);
}

async function pollSession(sessionId, maxMs = 420_000) {
  const seen = { partial: false, complete: false, statuses: [] };
  const start = Date.now();
  let last = null;
  while (Date.now() - start < maxMs) {
    const res = await fetch(`${API}/api/search/sessions/${sessionId}`);
    if (!res.ok) {
      throw new Error(`GET session ${res.status}`);
    }
    last = await res.json();
    const st = last.session?.status;
    if (st && seen.statuses[seen.statuses.length - 1] !== st) seen.statuses.push(st);
    if (st === 'PARTIAL') {
      seen.partial = true;
      const n = last.results?.length ?? 0;
      if (n > 0) return { ...seen, snapshot: last, reason: 'partial_with_results' };
    }
    if (st === 'COMPLETE') {
      seen.complete = true;
      return { ...seen, snapshot: last, reason: 'complete' };
    }
    if (st === 'FAILED') {
      return { ...seen, snapshot: last, reason: 'failed' };
    }
    await new Promise((r) => setTimeout(r, 1500));
  }
  return { ...seen, snapshot: last, reason: 'timeout' };
}

async function apiSearchFlow() {
  const body = {
    origin: ORIGIN,
    destination: DEST,
    departureDate: DEP,
    returnDate: RET,
    cabinClass: 'ECONOMY',
    adults: 1,
    currency: 'USD',
    locale: 'en',
  };
  const createRes = await fetch(`${API}/api/search/sessions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!createRes.ok) {
    const t = await createRes.text();
    step('create search session', false, `${createRes.status} ${t.slice(0, 200)}`);
    return null;
  }
  const created = await createRes.json();
  const sid = created.session?.id || created.id;
  step('create search session', !!sid, sid);
  if (!sid) return null;

  const poll = await pollSession(sid);
  report.partialObserved = poll.partial;
  report.completeObserved = poll.complete;
  step('session reached COMPLETE', poll.complete, `statuses=${poll.statuses.join('→')} reason=${poll.reason}`);
  step('PARTIAL drip observed', poll.partial, poll.partial ? `results=${poll.snapshot?.results?.length}` : `statuses=${poll.statuses.join('→')}`);
  const stats = poll.snapshot?.providerStats ?? [];
  step('GF2 in provider stats', stats.some((s) => /googleflights2/i.test(s.provider)), stats.map((s) => s.provider).join(','));
  return poll.snapshot;
}

async function uiSearchFlow() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  try {
    await page.goto(`${SITE}/search`, { waitUntil: 'domcontentloaded', timeout: 60_000 });
    await page.waitForTimeout(2000);

    const fillAirport = async (testIdOrPlaceholder, code) => {
      const input = page.getByPlaceholder(/origin|from|TLV|מקור/i).first();
      // fallback: any text input in form
      const el =
        (await page.locator('input').filter({ hasText: '' }).first().count()) > 0
          ? page.locator('input[type="text"], input:not([type])').nth(0)
          : input;
      await el.click({ timeout: 5000 }).catch(() => {});
    };

    // Deep link to results with params (more reliable than full form on RN-web)
    const qs = new URLSearchParams({
      origin: ORIGIN,
      destination: DEST,
      departureDate: DEP,
      returnDate: RET,
      adults: '1',
      currency: 'USD',
    });
    await page.goto(`${SITE}/search/results?${qs}`, { waitUntil: 'domcontentloaded', timeout: 60_000 });

    let parallelText = false;
    const deadline = Date.now() + 120_000;
    while (Date.now() < deadline) {
      const body = await page.locator('body').innerText();
      if (/parallel/i.test(body)) {
        parallelText = true;
        break;
      }
      if (/Google Flights, Kiwi/i.test(body)) {
        parallelText = true;
        break;
      }
      await page.waitForTimeout(1000);
    }
    report.parallelCopy = parallelText;
    step('loading copy mentions parallel search', parallelText, parallelText ? 'found' : 'not seen in 120s');

  const cardDeadline = Date.now() + 300_000;
  let cards = 0;
  while (Date.now() < cardDeadline) {
    cards = await page.getByRole('button', { name: /\$|USD|Book|Select/i }).count();
    if (cards >= 1) break;
    const text = await page.locator('body').innerText();
    if (/No flights found/i.test(text) && !/Searching|parallel|Almost/i.test(text)) break;
    await page.waitForTimeout(2000);
  }
  step('result cards appeared', cards >= 1, `buttons≈${cards}`);
  await page.screenshot({ path: '/opt/cursor/artifacts/flyfix-results-partial.png', fullPage: false });

    if (cards >= 1) {
      await page.getByRole('button', { name: /\$|Book|Select/i }).first().click({ timeout: 15_000 }).catch(async () => {
        await page.locator('[data-testid="flight-card"], [class*="ResultCard"]').first().click();
      });
      await page.waitForTimeout(3000);
      const book = page.getByRole('button', { name: /book|continue|הזמן/i }).first();
      if (await book.count()) {
        await book.click({ timeout: 10_000 }).catch(() => {});
        await page.waitForTimeout(8000);
        const modalText = await page.locator('body').innerText();
        const badCheapest = /CHEAPEST/i.test(modalText) && /British Airways|Direct/i.test(modalText);
        step('dual compare not mislabeled CHEAPEST on direct', !badCheapest, badCheapest ? 'CHEAPEST still on airline card context' : 'ok');
        await page.screenshot({ path: '/opt/cursor/artifacts/flyfix-booking-dual.png', fullPage: false });
      }
    }
  } finally {
    await browser.close();
  }
}

async function main() {
  console.log(`SITE=${SITE} API=${API} route ${ORIGIN}→${DEST}`);
  await apiSearchFlow();
  await uiSearchFlow();
  const outPath = '/opt/cursor/artifacts/flyfix-prod-check.json';
  await import('node:fs/promises').then((fs) => fs.writeFile(outPath, JSON.stringify(report, null, 2)));
  console.log(`\nReport: ${outPath}`);
  process.exit(report.ok ? 0 : 1);
}

main().catch((e) => {
  console.error(e);
  process.exit(2);
});