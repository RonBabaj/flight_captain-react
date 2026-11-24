'use strict';

const { pageLooksBlocked } = require('./botWall');

function pxHoldMs() {
  return Math.min(Math.max(Number(process.env.SCRAPER_PX_HOLD_MS || 6500) || 6500, 3000), 15_000);
}

function pxSolveAttempts() {
  return Math.min(Math.max(Number(process.env.SCRAPER_PX_SOLVE_ATTEMPTS || 5) || 5, 1), 8);
}

async function pressHoldInBox(page, box) {
  const jitterX = (Math.random() - 0.5) * Math.min(12, box.width * 0.08);
  const jitterY = (Math.random() - 0.5) * Math.min(10, box.height * 0.08);
  const x = box.x + box.width * 0.5 + jitterX;
  const y = box.y + Math.min(box.height * 0.55, 280) + jitterY;
  await page.mouse.move(x - 4, y - 2);
  await page.waitForTimeout(80);
  await page.mouse.move(x, y);
  await page.waitForTimeout(180 + Math.floor(Math.random() * 120));
  await page.mouse.down();
  await page.waitForTimeout(pxHoldMs());
  await page.mouse.up();
  await page.waitForTimeout(1500);
}

/** Best-effort PerimeterX "Press & Hold" on headed Chrome (CDP). */
async function trySolvePerimeterX(page) {
  if (!(await pageLooksBlocked(page)) && !/captcha-v2/i.test(page.url())) {
    return false;
  }
  const selectors = [
    '#px-captcha',
    '#px-captcha-wrapper',
    '#px-captcha iframe',
    'iframe[src*="captcha"]',
    'button:has-text("Appuyer")',
    'button:has-text("maintenir")',
    'button:has-text("Press")',
    'button:has-text("hold")',
    '[class*="captcha"]',
    'div[style*="cursor"]',
    'body',
  ];
  const targets = [];
  for (let attempt = 0; attempt < pxSolveAttempts(); attempt++) {
    for (const frame of [page, ...page.frames()]) {
      for (const sel of selectors) {
        try {
          const loc = frame.locator(sel).first();
          const box = await loc.boundingBox({ timeout: 1500 });
          if (!box || box.width < 20 || box.height < 20) continue;
          const key = `${box.x}|${box.y}|${box.width}`;
          if (targets.includes(key)) continue;
          targets.push(key);
          await pressHoldInBox(page, box);
          await page.waitForTimeout(1200);
          if (!(await pageLooksBlocked(page)) && !/captcha-v2/i.test(page.url())) {
            return true;
          }
        } catch {
          /* try next target */
        }
      }
    }
    await page.waitForTimeout(600);
  }
  return false;
}

module.exports = {
  trySolvePerimeterX,
  pxHoldMs,
  pxSolveAttempts,
};