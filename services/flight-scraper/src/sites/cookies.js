'use strict';

/** Best-effort dismiss cookie / privacy overlays so search UI can load. */
async function dismissCookieBanners(page) {
  const selectors = [
    '[data-test="CookiesPopup-Accept"]',
    '[data-test="CookiesPopup"] button',
    'button:has-text("Accept")',
    'button:has-text("Accept all")',
    'button:has-text("I agree")',
    'button:has-text("Agree")',
    '#onetrust-accept-btn-handler',
    '[id*="accept" i][role="button"]',
    'button[aria-label*="Accept" i]',
  ];
  for (let round = 0; round < 3; round++) {
    for (const sel of selectors) {
      try {
        const loc = page.locator(sel).first();
        if (await loc.isVisible({ timeout: 800 })) {
          await loc.click({ timeout: 3000 });
          await page.waitForTimeout(800);
        }
      } catch {
        /* next selector */
      }
    }
    await page.waitForTimeout(500);
  }
}

module.exports = { dismissCookieBanners };
