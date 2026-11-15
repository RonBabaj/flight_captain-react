'use strict';

const ACCEPT_SELECTORS = [
  '[data-test="CookiesPopup-Accept"]',
  '#onetrust-accept-btn-handler',
  '[id*="accept" i][role="button"]',
  'button[aria-label*="Accept" i]',
];
// Any button inside a known consent dialog, only when no accept button matched.
const DIALOG_SELECTORS = ['[data-testid="cookie-policy-manage-dialog"] button', '[data-test="CookiesPopup"] button'];

/**
 * Best-effort dismiss cookie / privacy overlays so search UI can load.
 * Finds the button in one page round trip; probing selectors one by one cost ~5s per load.
 */
async function dismissCookieBanners(page) {
  for (let round = 0; round < 2; round++) {
    let handle;
    try {
      handle = await page.evaluateHandle(
        ([accept, dialog]) => {
          const visible = (el) => {
            const r = el.getBoundingClientRect();
            return r.width > 0 && r.height > 0 && getComputedStyle(el).visibility !== 'hidden';
          };
          const first = (selectors) => {
            for (const sel of selectors) {
              const el = document.querySelector(sel);
              if (el && visible(el)) return el;
            }
            return null;
          };
          const label = /^(accept|accepter|tout accepter|i agree|agree|ok)\b/i;
          const byLabel = () => {
            for (const el of document.querySelectorAll('button, [role="button"]')) {
              if (visible(el) && label.test((el.textContent || '').trim())) return el;
            }
            return null;
          };
          return first(accept) || byLabel() || first(dialog);
        },
        [ACCEPT_SELECTORS, DIALOG_SELECTORS],
      );
      const el = handle.asElement();
      if (!el) return;
      await el.click({ timeout: 3000 });
      await page.waitForTimeout(500);
    } catch {
      return;
    } finally {
      if (handle) await handle.dispose().catch(() => {});
    }
  }
}

module.exports = { dismissCookieBanners };
