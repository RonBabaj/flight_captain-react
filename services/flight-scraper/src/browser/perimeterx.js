'use strict';

const { pageLooksBlocked, getBlockState, urlIsCaptchaHardWall } = require('./botWall');

function pxHoldMs() {
  return Math.min(Math.max(Number(process.env.SCRAPER_PX_HOLD_MS || 7200) || 7200, 3000), 16_000);
}

function pxSolveAttempts() {
  return Math.min(Math.max(Number(process.env.SCRAPER_PX_SOLVE_ATTEMPTS || 6) || 6, 1), 10);
}

async function pressHoldAt(page, x, y, holdMs) {
  const jx = (Math.random() - 0.5) * 8;
  const jy = (Math.random() - 0.5) * 6;
  const tx = x + jx;
  const ty = y + jy;
  await page.mouse.move(tx - 6, ty - 3, { steps: 4 }).catch(() => {});
  await page.waitForTimeout(60 + Math.floor(Math.random() * 80));
  await page.mouse.move(tx, ty, { steps: 3 });
  await page.waitForTimeout(120 + Math.floor(Math.random() * 180));
  await page.mouse.down();
  await page.waitForTimeout(holdMs);
  await page.mouse.up();
  await page.waitForTimeout(900 + Math.floor(Math.random() * 700));
}

async function pressHoldInBox(page, box, holdMs = pxHoldMs()) {
  const points = [
    [0.5, 0.5],
    [0.45, 0.55],
    [0.55, 0.48],
    [0.5, Math.min(0.7, 280 / Math.max(box.height, 1))],
  ];
  for (const [fx, fy] of points) {
    const x = box.x + box.width * fx;
    const y = box.y + Math.min(box.height * fy, box.height - 4);
    await pressHoldAt(page, x, y, holdMs);
    if (!(await pageLooksBlocked(page)) && !urlIsCaptchaHardWall(page.url())) {
      return true;
    }
  }
  return false;
}

async function collectHoldTargets(page) {
  const selectors = [
    '#px-captcha',
    '#px-captcha-wrapper',
    '[id*="px-captcha"]',
    'iframe[src*="captcha"]',
    'iframe[title*="captcha" i]',
    'button:has-text("Appuyer")',
    'button:has-text("maintenir")',
    'button:has-text("Press & Hold")',
    'button:has-text("Press and Hold")',
    'button:has-text("Press")',
    'button:has-text("hold")',
    '[class*="captcha"]',
  ];
  const boxes = [];
  const seen = new Set();
  const push = (box) => {
    if (!box || box.width < 24 || box.height < 24) return;
    const key = `${Math.round(box.x)}|${Math.round(box.y)}|${Math.round(box.width)}`;
    if (seen.has(key)) return;
    seen.add(key);
    boxes.push(box);
  };

  for (const frame of [page, ...page.frames()]) {
    for (const sel of selectors) {
      try {
        const loc = frame.locator(sel).first();
        const box = await loc.boundingBox({ timeout: 800 });
        push(box);
      } catch {
        /* next */
      }
    }
  }

  // Viewport-center fallback — PX often paints a large invisible hit area.
  try {
    const vp = page.viewportSize() || { width: 1400, height: 900 };
    push({ x: vp.width * 0.25, y: vp.height * 0.25, width: vp.width * 0.5, height: Math.min(420, vp.height * 0.45) });
  } catch {
    /* ignore */
  }
  return boxes;
}

async function pxCleared(page) {
  const state = await getBlockState(page);
  if (state.hard) return false;
  if (state.soft) return false;
  return true;
}

/**
 * Best-effort PerimeterX "Press & Hold" on headed Chrome (CDP).
 * Returns true when the hard/soft challenge is gone.
 */
async function trySolvePerimeterX(page) {
  const state = await getBlockState(page);
  if (!state.blocked && !urlIsCaptchaHardWall(page.url())) {
    return false;
  }

  const attempts = pxSolveAttempts();
  for (let attempt = 0; attempt < attempts; attempt++) {
    const holdMs = pxHoldMs() + attempt * 400;
    const targets = await collectHoldTargets(page);
    for (const box of targets) {
      try {
        const ok = await pressHoldInBox(page, box, holdMs);
        if (ok || (await pxCleared(page))) {
          console.log(`[flight-scraper] PX hold cleared attempt=${attempt + 1}`);
          return true;
        }
      } catch {
        /* try next box */
      }
    }
    // Full-viewport hold as last resort this attempt.
    try {
      const vp = page.viewportSize() || { width: 1400, height: 900 };
      await pressHoldAt(page, vp.width * 0.5, Math.min(360, vp.height * 0.42), holdMs);
      if (await pxCleared(page)) {
        console.log(`[flight-scraper] PX viewport hold cleared attempt=${attempt + 1}`);
        return true;
      }
    } catch {
      /* continue */
    }
    await page.waitForTimeout(500 + attempt * 200);
  }
  return pxCleared(page);
}

/**
 * Soft overlay on a results URL: try hold, then continue if tickets are scrapable.
 * Returns { cleared, hasCards } so callers can scrape DOM instead of aborting.
 */
async function recoverSkyCaptcha(page, { hasCards } = {}) {
  const before = await getBlockState(page);
  if (!before.blocked && !urlIsCaptchaHardWall(before.url)) {
    return { cleared: true, hasCards: !!(await hasCards?.()), soft: false, hard: false };
  }
  const solved = await trySolvePerimeterX(page);
  const after = await getBlockState(page);
  const cards = !!(await hasCards?.());
  return {
    cleared: solved || (!after.hard && !after.soft),
    hasCards: cards,
    soft: after.soft,
    hard: after.hard,
    // Usable when we left the hard captcha page or cards are visible under/after overlay.
    usable: (!after.hard && cards) || (urlIsCaptchaHardWall(before.url) === false && cards),
  };
}

module.exports = {
  trySolvePerimeterX,
  recoverSkyCaptcha,
  pxHoldMs,
  pxSolveAttempts,
  getBlockState,
};
