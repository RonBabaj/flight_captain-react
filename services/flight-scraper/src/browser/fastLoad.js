'use strict';

/**
 * Speed up OTA scrapes: drop images/fonts/media/ads so JSON + DOM settle sooner.
 * Keep stylesheets/scripts/XHR — SPAs need them to emit search results.
 */
async function blockHeavyResources(page) {
  if (!page || typeof page.route !== 'function') return;
  try {
    await page.route('**/*', (route) => {
      const req = route.request();
      const type = req.resourceType();
      const url = req.url();
      if (type === 'image' || type === 'media' || type === 'font') {
        return route.abort();
      }
      if (
        /googletagmanager|google-analytics|doubleclick|facebook\.net|hotjar|segment\.io|sentry\.io|clarity\.ms|adsystem|googlesyndication|scorecardresearch|newrelic|nr-data\.net|px-cloud\.net\/.*\/captcha/i.test(
          url,
        )
      ) {
        // Do not abort PerimeterX challenge scripts — captcha needs them.
        if (/px-cdn|perimeterx|captcha/i.test(url) && type === 'script') {
          return route.continue();
        }
        if (/googletagmanager|google-analytics|doubleclick|facebook\.net|hotjar|segment\.io|clarity\.ms|adsystem|googlesyndication|scorecardresearch|newrelic|nr-data\.net/i.test(url)) {
          return route.abort();
        }
      }
      return route.continue();
    });
  } catch {
    /* route may already be set */
  }
}

/**
 * Poll until `check()` is truthy or timeout. Prefer this over fixed waits when
 * JSON capture or a results selector can fire early.
 */
async function waitUntil(page, check, { timeoutMs = 10000, intervalMs = 200 } = {}) {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    try {
      if (await check()) return true;
    } catch {
      /* keep polling */
    }
    await page.waitForTimeout(intervalMs);
  }
  try {
    return !!(await check());
  } catch {
    return false;
  }
}

module.exports = { blockHeavyResources, waitUntil };
