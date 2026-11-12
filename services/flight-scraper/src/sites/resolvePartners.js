'use strict';

/**
 * Resolve seller checkout URLs from Skyscanner / Kiwi booking panels —
 * same role as GF2 getBookingDetails → getBookingURL.
 */

const { withPage, runWithRetries, gotoAndSettle } = require('./shared');
const { pageLooksBlocked } = require('../browser/botWall');
const { skyscannerUrl, preferUsCulture, trySolvePerimeterX, ensureDatedResultsUrl, parsePriceText } = require('./skyscanner');
const { kiwiSearchUrl, ensureKiwiResultsUrl } = require('./kiwi');
const { noteSkyscannerBlocked } = require('../warm');

const META_HOST_RE =
  /(^|\.)(skyscanner\.|google\.|gstatic\.|kayak\.|momondo\.|cheapflights\.)/i;

function isMetaHost(hostname) {
  const h = String(hostname || '')
    .toLowerCase()
    .replace(/^www\./, '');
  return META_HOST_RE.test(h) || h.includes('skyscanner.');
}

function isPartnerCheckoutURL(raw) {
  try {
    const u = new URL(String(raw || '').trim());
    if (u.protocol !== 'https:' && u.protocol !== 'http:') return false;
    if (isMetaHost(u.hostname)) return false;
    const path = u.pathname.toLowerCase();
    // Kiwi results listing is not checkout.
    if (/kiwi\.com$/i.test(u.hostname.replace(/^www\./, '')) && /\/search\/results\//i.test(path)) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

function providerFromURL(raw) {
  try {
    return new URL(raw).hostname.replace(/^www\./, '');
  } catch {
    return '';
  }
}

function hmFromIso(iso) {
  const s = String(iso || '');
  const m = s.match(/T(\d{2}):(\d{2})/);
  return m ? `${m[1]}:${m[2]}` : '';
}

function clocksFromSegments(segments) {
  const segs = Array.isArray(segments) ? segments : [];
  const out = segs.find((s) => String(s.leg || '').toLowerCase() !== 'inbound') || segs[0];
  const inn = segs.find((s) => String(s.leg || '').toLowerCase() === 'inbound');
  return {
    outDep: hmFromIso(out?.departureTime),
    outArr: hmFromIso(out?.arrivalTime),
    inDep: hmFromIso(inn?.departureTime),
    inArr: hmFromIso(inn?.arrivalTime),
  };
}

function priceClose(a, b, slack = 3) {
  const x = Number(a) || 0;
  const y = Number(b) || 0;
  if (x <= 0 || y <= 0) return false;
  return Math.abs(x - y) <= slack;
}

function textHasHm(text, hm) {
  if (!hm) return true;
  const t = String(text || '');
  // Allow "13:40" or "1:40" style.
  const [h, m] = hm.split(':');
  if (!h || !m) return true;
  const hNum = String(parseInt(h, 10));
  const re = new RegExp(`\\b0?${hNum}:${m}\\b`);
  return re.test(t);
}

function collectPartnerMap() {
  return new Map(); // url -> { url, provider, price }
}

function addPartner(map, url, price, provider) {
  if (!isPartnerCheckoutURL(url)) return;
  const key = String(url).split('#')[0];
  if (map.has(key)) return;
  map.set(key, {
    url: key,
    provider: provider || providerFromURL(key),
    price: Number(price) > 0 ? Number(price) : undefined,
  });
}

/**
 * Follow Skyscanner / Kiwi redirector hops without completing a purchase UI.
 * Returns the first non-meta https URL observed.
 */
async function peekRedirectTarget(page, href, timeoutMs = 12000) {
  if (!href) return '';
  if (isPartnerCheckoutURL(href)) return href;
  let found = '';
  const onReq = (req) => {
    try {
      const u = req.url();
      if (isPartnerCheckoutURL(u) && !found) found = u;
    } catch {
      /* ignore */
    }
  };
  page.on('request', onReq);
  let popup;
  try {
    const ctx = page.context();
    const popupPromise = ctx.waitForEvent('page', { timeout: timeoutMs }).catch(() => null);
    await page.evaluate((u) => {
      const a = document.createElement('a');
      a.href = u;
      a.target = '_blank';
      a.rel = 'noopener';
      document.body.appendChild(a);
      a.click();
      a.remove();
    }, href);
    popup = await popupPromise;
    if (popup) {
      try {
        await popup.waitForLoadState('domcontentloaded', { timeout: Math.min(8000, timeoutMs) });
      } catch {
        /* ignore */
      }
      const finalUrl = popup.url();
      if (isPartnerCheckoutURL(finalUrl)) found = finalUrl;
      await popup.close().catch(() => {});
    }
  } catch {
    /* ignore */
  } finally {
    page.off('request', onReq);
  }
  return found;
}

async function extractPartnersFromDom(page, quotePrice) {
  return page.evaluate((qp) => {
    const out = [];
    const seen = new Set();
    const push = (url, provider, price) => {
      if (!url || seen.has(url)) return;
      seen.add(url);
      out.push({ url, provider: provider || '', price: price || 0 });
    };
    const anchors = document.querySelectorAll(
      'a[href], button[data-href], [data-testid*="booking"] a, [data-testid*="agent"] a, [class*="Booking"] a',
    );
    anchors.forEach((el) => {
      const href = el.href || el.getAttribute('href') || el.getAttribute('data-href') || '';
      if (!href || href.startsWith('javascript:')) return;
      const host = (() => {
        try {
          return new URL(href, location.href).hostname;
        } catch {
          return '';
        }
      })();
      if (!host) return;
      if (/skyscanner\.|google\.|gstatic\./i.test(host)) {
        // Keep redirector links for later peek — mark with raw href.
        push(href, host, qp);
        return;
      }
      const label =
        (el.getAttribute('aria-label') || el.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 80);
      push(href, label || host, qp);
    });
    // Provider name rows often expose deeplink in data attributes.
    document.querySelectorAll('[data-testid*="provider"], [data-testid*="agent"], [class*="Provider"]').forEach((row) => {
      const a = row.querySelector('a[href]');
      if (!a) return;
      const href = a.href;
      const name =
        row.querySelector('[class*="name"], [data-testid*="name"]')?.textContent?.trim() ||
        a.textContent?.trim() ||
        '';
      push(href, name.slice(0, 80), qp);
    });
    return out;
  }, quotePrice || 0);
}

async function clickMatchingSkyscannerCard(page, want) {
  const match = await page.evaluate((w) => {
    const cards = [
      ...document.querySelectorAll(
        '[data-testid="ticket"], [data-testid="itinerary-card"], [class*="FlightsTicket"]',
      ),
    ];
    const hmRe = /\b([01]?\d|2[0-3]):([0-5]\d)\b/g;
    const parsePrice = (text) => {
      const t = String(text || '').replace(/\u00a0/g, ' ').trim();
      const m =
        t.match(/(\d[\d\s.,]*)\s*€/) ||
        t.match(/€\s*(\d[\d\s.,]*)/) ||
        t.match(/\$\s*(\d[\d\s.,]*)/) ||
        t.match(/(\d[\d.,]+)/);
      if (!m) return 0;
      const num = parseFloat((m[1] || '').replace(/\s/g, '').replace(',', '.'));
      return num > 15 && num < 50000 ? num : 0;
    };
    let bestIdx = -1;
    let bestScore = -1;
    cards.forEach((card, idx) => {
      const text = card.innerText || card.textContent || '';
      const priceEl =
        card.querySelector('[data-testid="price"]') ||
        card.querySelector('[data-testid="price-main-container"]') ||
        card.querySelector('[class*="Price"]');
      const price = parsePrice(priceEl?.textContent || '') || parsePrice(text);
      if (!price) return;
      let score = 0;
      if (w.price > 0 && Math.abs(price - w.price) <= 3) score += 10;
      else if (w.price > 0 && Math.abs(price - w.price) <= 15) score += 3;
      else return;
      const times = text.match(hmRe) || [];
      if (w.outDep && times.some((t) => t === w.outDep || t.replace(/^0/, '') === w.outDep.replace(/^0/, ''))) {
        score += 5;
      }
      if (w.inDep && times.some((t) => t === w.inDep || t.replace(/^0/, '') === w.inDep.replace(/^0/, ''))) {
        score += 5;
      }
      if (score > bestScore) {
        bestScore = score;
        bestIdx = idx;
      }
    });
    if (bestIdx < 0) return null;
    cards[bestIdx].setAttribute('data-flyfix-resolve-target', '1');
    return { idx: bestIdx, score: bestScore };
  }, want);

  if (!match) return false;
  const target = page.locator('[data-flyfix-resolve-target="1"]').first();
  try {
    await target.scrollIntoViewIfNeeded({ timeout: 3000 });
    await target.click({ timeout: 5000 });
    return true;
  } catch {
    try {
      await target.click({ timeout: 5000, force: true });
      return true;
    } catch {
      return false;
    }
  }
}

async function waitForBookingPanel(page) {
  const sels = [
    '[data-testid*="booking-panel"]',
    '[data-testid*="BookingPanel"]',
    '[data-testid*="agent"]',
    '[data-testid*="provider"]',
    'button:has-text("Select")',
    'a:has-text("Select")',
    'button:has-text("Book")',
    'a:has-text("Book")',
    'button:has-text("Continuer")',
    'a:has-text("Continuer")',
  ];
  for (const sel of sels) {
    try {
      await page.waitForSelector(sel, { timeout: 2500 });
      return true;
    } catch {
      /* try next */
    }
  }
  await page.waitForTimeout(1500);
  return true;
}

async function resolveSkyscannerPartners(req, config) {
  if (config.dryRun) {
    return { partners: [], error: 'dry run' };
  }
  const preferFr = process.env.SCRAPER_SKYSCANNER_HOST || 'www.skyscanner.fr';
  const url = String(req.listingUrl || '').trim() || skyscannerUrl(req, preferFr);
  const clocks = clocksFromSegments(req.segments);
  const want = {
    price: Number(req.price) || 0,
    outDep: clocks.outDep || String(req.outDepHm || ''),
    inDep: clocks.inDep || String(req.inDepHm || ''),
  };

  return runWithRetries(config.headless, 'skyscanner-resolve', async () => {
    const partners = await withPage(config.headless, async (page) => {
      if (!/\.fr$/i.test(preferFr)) {
        await preferUsCulture(page);
      }
      const partnerMap = collectPartnerMap();
      const onReq = (request) => {
        try {
          addPartner(partnerMap, request.url(), want.price);
        } catch {
          /* ignore */
        }
      };
      page.on('request', onReq);

      try {
        await gotoAndSettle(page, url, config);
      } catch {
        /* captcha may interrupt */
      }
      for (let i = 0; i < 2; i++) {
        if (!/captcha-v2/i.test(page.url()) && !(await pageLooksBlocked(page))) break;
        const solved = await trySolvePerimeterX(page);
        if (solved) break;
        await page.waitForTimeout(800);
      }
      if ((await pageLooksBlocked(page)) || /captcha-v2/i.test(page.url())) {
        noteSkyscannerBlocked();
        page.off('request', onReq);
        return [];
      }
      await ensureDatedResultsUrl(page, req, config);
      if ((await pageLooksBlocked(page)) || /captcha-v2/i.test(page.url())) {
        noteSkyscannerBlocked();
        page.off('request', onReq);
        return [];
      }

      try {
        await page.waitForSelector('[data-testid="ticket"], [data-testid="itinerary-card"]', {
          timeout: 12000,
        });
      } catch {
        /* continue */
      }

      const clicked = await clickMatchingSkyscannerCard(page, want);
      if (!clicked) {
        page.off('request', onReq);
        return [];
      }
      await waitForBookingPanel(page);

      const domRows = await extractPartnersFromDom(page, want.price);
      for (const row of domRows) {
        if (isPartnerCheckoutURL(row.url)) {
          addPartner(partnerMap, row.url, row.price || want.price, row.provider);
          continue;
        }
        // Redirector / same-site CTA — peek final seller URL.
        if (/skyscanner\./i.test(row.url) || /\/transport_deeplink\//i.test(row.url) || /redirect/i.test(row.url)) {
          const finalUrl = await peekRedirectTarget(page, row.url, 10000);
          if (finalUrl) addPartner(partnerMap, finalUrl, row.price || want.price, row.provider);
        }
      }

      // Click a few Select CTAs and capture popups / navigations.
      const cta = page.locator(
        'a:has-text("Select"), button:has-text("Select"), a:has-text("Book"), button:has-text("Book"), a:has-text("Continuer"), button:has-text("Continuer")',
      );
      const n = Math.min(await cta.count().catch(() => 0), 4);
      for (let i = 0; i < n; i++) {
        try {
          const btn = cta.nth(i);
          const href = await btn.getAttribute('href').catch(() => null);
          if (href && isPartnerCheckoutURL(href)) {
            addPartner(partnerMap, href, want.price);
            continue;
          }
          const ctx = page.context();
          const popupPromise = ctx.waitForEvent('page', { timeout: 8000 }).catch(() => null);
          await btn.click({ timeout: 4000 });
          const popup = await popupPromise;
          if (popup) {
            try {
              await popup.waitForLoadState('domcontentloaded', { timeout: 8000 });
            } catch {
              /* ignore */
            }
            addPartner(partnerMap, popup.url(), want.price);
            await popup.close().catch(() => {});
          } else if (isPartnerCheckoutURL(page.url())) {
            addPartner(partnerMap, page.url(), want.price);
            await page.goBack({ waitUntil: 'domcontentloaded' }).catch(() => {});
            await waitForBookingPanel(page);
          }
        } catch {
          /* next CTA */
        }
      }

      page.off('request', onReq);
      return [...partnerMap.values()];
    });

    if (!partners.length) {
      return { partners: [], error: 'no skyscanner partner checkouts resolved' };
    }
    return { partners, error: undefined };
  });
}

async function clickMatchingKiwiCard(page, want) {
  const match = await page.evaluate((w) => {
    const cards = [
      ...document.querySelectorAll(
        '[data-test="ResultCard"], [data-test="ResultCardWrapper"], [data-test="ResultList-result"]',
      ),
    ];
    const parsePrice = (text) => {
      const m = String(text || '').match(/(\d[\d\s.,]*)\s*€|\$\s*(\d[\d\s.,]*)|(\d[\d\s.,]*)/);
      const raw = (m && (m[1] || m[2] || m[3])) || '';
      const num = parseFloat(String(raw).replace(/\s/g, '').replace(',', '.').replace(/[^\d.]/g, ''));
      return num && !Number.isNaN(num) && num >= 15 ? num : 0;
    };
    let bestIdx = -1;
    let bestScore = -1;
    cards.forEach((card, idx) => {
      const priceText =
        card.querySelector('[data-test="ResultCardPrice"]')?.textContent ||
        card.querySelector('[data-test*="Price"]')?.textContent ||
        card.textContent ||
        '';
      const price = parsePrice(priceText);
      if (!price) return;
      let score = 0;
      if (w.price > 0 && Math.abs(price - w.price) <= 3) score += 10;
      else if (w.price > 0 && Math.abs(price - w.price) <= 15) score += 3;
      else return;
      const stamps = [...card.querySelectorAll('[data-test="TripTimestamp"]')]
        .map((el) => (el.textContent || '').trim())
        .filter((t) => /^\d{1,2}:\d{2}$/.test(t));
      if (w.outDep && stamps.includes(w.outDep)) score += 5;
      if (w.inDep && stamps.includes(w.inDep)) score += 5;
      if (score > bestScore) {
        bestScore = score;
        bestIdx = idx;
      }
    });
    if (bestIdx < 0) return null;
    cards[bestIdx].setAttribute('data-flyfix-resolve-target', '1');
    return { idx: bestIdx, score: bestScore };
  }, want);
  if (!match) return false;
  const target = page.locator('[data-flyfix-resolve-target="1"]').first();
  try {
    await target.scrollIntoViewIfNeeded({ timeout: 3000 });
    await target.click({ timeout: 5000 });
    return true;
  } catch {
    try {
      await target.click({ timeout: 5000, force: true });
      return true;
    } catch {
      return false;
    }
  }
}

async function resolveKiwiPartners(req, config) {
  if (config.dryRun) {
    return { partners: [], error: 'dry run' };
  }
  // Direct booking deep link already usable (Tequila /booking).
  const listing = String(req.listingUrl || '').trim();
  if (listing && isPartnerCheckoutURL(listing)) {
    return {
      partners: [
        {
          url: listing,
          provider: providerFromURL(listing) || 'kiwi.com',
          price: Number(req.price) || undefined,
        },
      ],
    };
  }

  const url = listing || kiwiSearchUrl(req);
  const clocks = clocksFromSegments(req.segments);
  const want = {
    price: Number(req.price) || 0,
    outDep: clocks.outDep || String(req.outDepHm || ''),
    inDep: clocks.inDep || String(req.inDepHm || ''),
  };

  return runWithRetries(config.headless, 'kiwi-resolve', async () => {
    const partners = await withPage(config.headless, async (page) => {
      const partnerMap = collectPartnerMap();
      const onReq = (request) => {
        try {
          addPartner(partnerMap, request.url(), want.price);
        } catch {
          /* ignore */
        }
      };
      page.on('request', onReq);

      await ensureKiwiResultsUrl(page, url, req, config);
      if (await pageLooksBlocked(page)) {
        page.off('request', onReq);
        return [];
      }

      try {
        await page.waitForSelector('[data-test="ResultCard"], [data-test="ResultCardWrapper"]', {
          timeout: 10000,
        });
      } catch {
        /* continue */
      }

      const clicked = await clickMatchingKiwiCard(page, want);
      if (clicked) {
        await page.waitForTimeout(1200);
      }

      // Prefer explicit booking links.
      const hrefs = await page.evaluate(() => {
        const out = [];
        document.querySelectorAll('a[href*="/booking"], a[href*="kiwi.com"]').forEach((a) => {
          if (a.href) out.push(a.href);
        });
        return out;
      });
      for (const href of hrefs) {
        if (isPartnerCheckoutURL(href)) addPartner(partnerMap, href, want.price, 'kiwi.com');
      }

      // Current page may already be booking.
      if (isPartnerCheckoutURL(page.url())) {
        addPartner(partnerMap, page.url(), want.price, 'kiwi.com');
      }

      const domRows = await extractPartnersFromDom(page, want.price);
      for (const row of domRows) {
        if (isPartnerCheckoutURL(row.url)) {
          addPartner(partnerMap, row.url, row.price || want.price, row.provider || 'kiwi.com');
        }
      }

      page.off('request', onReq);
      return [...partnerMap.values()];
    });

    if (!partners.length) {
      return { partners: [], error: 'no kiwi partner checkouts resolved' };
    }
    return { partners, error: undefined };
  });
}

async function resolvePartners(req, config) {
  const site = String(req.site || '').toLowerCase();
  if (site === 'skyscanner') return resolveSkyscannerPartners(req, config);
  if (site === 'kiwi') return resolveKiwiPartners(req, config);
  return { partners: [], error: `unsupported site ${site}` };
}

module.exports = {
  resolvePartners,
  resolveSkyscannerPartners,
  resolveKiwiPartners,
  isPartnerCheckoutURL,
  // re-export helpers tests may want
  priceClose,
  textHasHm,
  parsePriceText,
};
