'use strict';

const { withPage, runWithRetries, gotoAndSettle, skyscannerDate } = require('./shared');
const { closePageIfPoisoned } = require('../browser/session');
const { attachJsonCapture } = require('./jsonCapture');
const { offerTemplate, segment, segmentsFromRoundTripClocks } = require('../normalize');
const {
  airlinesFromCardText,
  pickSessionBookingUrl,
  extractUnifiedOffers,
} = require('./skyscannerParse');
const { parseRoundTripHm } = require('../localTime');
const { pageLooksBlocked } = require('../browser/botWall');
const { trySolvePerimeterX, pxSolveAttempts } = require('../browser/perimeterx');
const { waitUntil } = require('../browser/fastLoad');
const { noteSkyscannerBlocked } = require('../warm');

/** Locale path segment after /transport/ for each Skyscanner TLD. */
const FLIGHTS_PATH_BY_HOST = {
  'www.skyscanner.com': 'flights',
  'www.skyscanner.net': 'flights',
  'www.skyscanner.co.uk': 'flights',
  'www.skyscanner.fr': 'vols',
  'www.skyscanner.de': 'fluege',
  'www.skyscanner.it': 'voli',
  'www.skyscanner.es': 'vuelos',
  'www.skyscanner.nl': 'vluchten',
  'www.skyscanner.pt': 'voos',
};

function flightsSegmentForHost(hostname) {
  const host = String(hostname || '')
    .replace(/^https?:\/\//, '')
    .split('/')[0]
    .toLowerCase();
  if (FLIGHTS_PATH_BY_HOST[host]) return FLIGHTS_PATH_BY_HOST[host];
  // Fallback: keep English path — most mirrors accept /flights/ even when UI is localized.
  return 'flights';
}

function skyscannerUrl(req, host = 'www.skyscanner.com') {
  const o = String(req.origin).toLowerCase();
  const d = String(req.destination).toLowerCase();
  const dep = skyscannerDate(req.departureDate);
  const ret = req.returnDate ? skyscannerDate(req.returnDate) : '';
  const adults = Math.max(1, req.adults || 1);
  const hostname = String(host || 'www.skyscanner.com')
    .replace(/^https?:\/\//, '')
    .split('/')[0];
  const flights = flightsSegmentForHost(hostname);
  const base = `https://${hostname}/transport/${flights}/${o}/${d}/${dep}`;
  const qs = `adultsv2=${adults}&cabinclass=economy&rtn=${ret ? 1 : 0}&preferdirects=false`;
  if (ret) {
    return `${base}/${ret}/?${qs}`;
  }
  return `${base}/?${qs}`;
}

/** True when culture redirect dropped YYMMDD date slugs (lands on month calendar). */
function urlMissingSearchDates(href) {
  const path = String(href || '').split('?')[0];
  // Expect .../origin/dest/YYMMDD/ or .../origin/dest/YYMMDD/YYMMDD/
  return !/\/[a-z0-9-]+\/[a-z0-9-]+\/\d{6}(?:\/\d{6})?\/?$/i.test(path);
}

async function preferUsCulture(page) {
  // Shared CDP context also holds Kiwi cookies — only drop Skyscanner culture cookies.
  const ctx = page.context();
  try {
    const existing = await ctx.cookies();
    const keep = existing.filter((c) => !/skyscanner/i.test(c.domain || ''));
    const sky = existing.filter((c) => /skyscanner/i.test(c.domain || ''));
    if (sky.length) {
      await ctx.clearCookies();
      if (keep.length) {
        await ctx.addCookies(keep);
      }
    }
  } catch {
    /* best-effort */
  }
  const cookieOpts = { path: '/', expires: Math.floor(Date.now() / 1000) + 86400 * 30 };
  try {
    await ctx.addCookies([
      { name: 'ss_csm', value: 'us', domain: '.skyscanner.com', ...cookieOpts },
      { name: 'ss_csm', value: 'us', domain: '.skyscanner.net', ...cookieOpts },
      { name: 'ss_csm', value: 'us', domain: 'www.skyscanner.com', ...cookieOpts },
    ]);
  } catch {
    /* cookie seed best-effort */
  }
}

/** Path Skyscanner wanted before redirecting to sttc/px/captcha-v2 (base64 `url` query). */
function skyscannerPathFromCaptchaPage(href, host = 'www.skyscanner.fr') {
  try {
    const u = new URL(href);
    const enc = u.searchParams.get('url');
    if (!enc) return '';
    const path = Buffer.from(enc, 'base64').toString('utf8');
    if (!/\/transport\//i.test(path)) return '';
    const h = String(host || 'www.skyscanner.fr').replace(/^https?:\/\//, '').split('/')[0];
    return `https://${h}${path.startsWith('/') ? path : `/${path}`}`;
  } catch {
    return '';
  }
}

function skyResultsWaitMs(config) {
  const base = Math.min(
    Math.max(Number(process.env.SCRAPER_SKY_RESULTS_WAIT_MS || 55000) || 55000, 15000),
    90000,
  );
  return Math.min(base, skyBudgetMs(config) - 8000);
}

function jsonHasOffers(captured, req) {
  const parsed = extractSkyscanner(captured, req);
  if (!parsed.length) return false;
  if (!req.returnDate) return true;
  return parsed.some((o) => (o.segments || []).some((s) => s.leg === 'inbound'));
}

async function skyDomHasCards(page) {
  try {
    const n = await page
      .locator('[data-testid="ticket"], [data-testid="itinerary-card"]')
      .count();
    return n > 0;
  } catch {
    return false;
  }
}

/**
 * Wait for JSON offers OR DOM fare cards. Do NOT block on web-unified-search XHR first —
 * on headed CDP that response often never appears in Playwright capture while cards do.
 * Blocking on it burned 25s+ per call and let site budgets kill the scrape with 0 offers.
 */
async function waitForSkyResults(page, captured, req, config) {
  const waitMs = skyResultsWaitMs(config);
  const ready = async () => jsonHasOffers(captured, req) || (await skyDomHasCards(page));
  if (await ready()) return true;
  return waitUntil(page, ready, { timeoutMs: waitMs, intervalMs: 350 });
}

async function readDomCardRows(page) {
  try {
    return await page.evaluate(() => {
      const out = [];
      const cards = document.querySelectorAll(
        '[data-testid="ticket"], [data-testid="itinerary-card"], [class*="FlightsTicket"]',
      );
      const hmRe = /\b([01]?\d|2[0-3]):([0-5]\d)\b/g;
      const skipAlt =
        /logo|icon|image|photo|arrow|chevron|skyscanner|direct|stop|airport|a[eé]roport|international|ben[-\s]?gour?ion|terminal|flughafen|depart|arriv|hour|heure|minute/i;
      cards.forEach((card) => {
        const priceEl =
          card.querySelector('[data-testid="price"]') ||
          card.querySelector('[data-testid="price-main-container"]') ||
          card.querySelector('[class*="Price"]') ||
          card.querySelector('span[class*="price"]');
        let priceText = priceEl?.textContent || '';
        const fullText = card.innerText || card.textContent || '';
        if (!priceText) {
          const m = fullText.match(/(\d[\d\s.,]*)\s*€|€\s*(\d[\d\s.,]*)/);
          priceText = m ? m[0] : '';
        }
        const times = fullText.match(hmRe) || [];
        const airlines = [];
        const pushAirline = (raw) => {
          const label = String(raw || '')
            .replace(/\s+/g, ' ')
            .replace(/\s*logo.*/i, '')
            .trim();
          if (!label || label.length < 2 || label.length > 40 || skipAlt.test(label)) return;
          if (/^[A-Z0-9]{3}$/i.test(label)) return;
          if (!airlines.includes(label)) airlines.push(label);
        };
        card
          .querySelectorAll(
            '[data-testid*="airline"], [data-testid*="carrier"], [class*="Airline"], [class*="Carrier"]',
          )
          .forEach((el) => {
            pushAirline(el.getAttribute('alt') || el.getAttribute('title') || el.textContent);
          });
        if (!airlines.length) {
          card.querySelectorAll('img[alt], img[title]').forEach((el) => {
            pushAirline(el.getAttribute('alt') || el.getAttribute('title'));
          });
        }
        const hrefs = [];
        card.querySelectorAll('a[href]').forEach((a) => {
          if (a.href) hrefs.push(a.href);
        });
        out.push({
          priceText,
          link: card.querySelector('a')?.href || window.location.href,
          hrefs,
          times,
          airlines,
          text: fullText.slice(0, 1500),
        });
      });
      return out.slice(0, 30);
    });
  } catch (err) {
    console.warn(`[flight-scraper] sky DOM read failed: ${String(err.message || err).slice(0, 120)}`);
    return [];
  }
}

function offersFromDomRows(dom, req, url, config) {
  const fromDom = [];
  const seenDom = new Set();
  for (const row of dom) {
    const price = parsePriceText(row.priceText) || parsePriceText(row.text);
    if (!price) continue;
    let clocks = null;
    if (Array.isArray(row.times) && row.times.length >= 2) {
      clocks = {
        outbound: { depHm: row.times[0], arrHm: row.times[1] },
      };
      if (row.times.length >= 4) {
        clocks.inbound = { depHm: row.times[2], arrHm: row.times[3] };
      }
    } else {
      clocks = parseRoundTripHm(row.text);
    }
    if (!clocks) continue;
    // Round-trip search with only outbound clocks on the card — still keep the offer;
    // missing inbound used to drop every DOM row when JSON was empty (Sky 0).
    const fromText = airlinesFromCardText(row.text);
    const outboundAirline =
      (Array.isArray(row.airlines) && row.airlines[0]) || fromText.outbound || undefined;
    const inboundAirline =
      (Array.isArray(row.airlines) && row.airlines[1]) || fromText.inbound || outboundAirline;
    const segments = segmentsFromRoundTripClocks(req, clocks, {
      airline: outboundAirline,
      inboundAirline,
    });
    if (!segments.length) continue;
    const key = `${price}|${segments.map((s) => `${s.leg}:${s.departureTime}:${s.arrivalTime}`).join('|')}`;
    if (seenDom.has(key)) continue;
    seenDom.add(key);
    fromDom.push(
      offerTemplate({
        origin: req.origin,
        destination: req.destination,
        price,
        currency: req.currency || 'EUR',
        bookingUrl: pickSessionBookingUrl(row.hrefs) || row.link || url,
        segments,
      }),
    );
  }
  return fromDom.slice(0, config.maxOffersPerSite || 60);
}

async function humanSkyPause(page) {
  const base = Math.min(Math.max(Number(process.env.SCRAPER_SKY_HUMAN_MS || 450) || 450, 0), 3000);
  if (base <= 0) return;
  const jitter = Math.floor(Math.random() * Math.min(400, base));
  await page.waitForTimeout(base + jitter);
}

function skyBudgetMs(config) {
  const base = Math.min(Math.max(Number(process.env.SCRAPER_SKY_MAX_MS || 150_000) || 150_000, 45_000), 300_000);
  const cap = config?.siteMaxMs;
  if (cap && cap > 0) return Math.min(base, cap);
  return base;
}

async function leaveCaptchaForSearch(page, req, config, preferFr) {
  const resume = skyscannerPathFromCaptchaPage(page.url(), preferFr);
  const target = resume || skyscannerUrl(req, preferFr);
  if (!target || /captcha-v2/i.test(target)) return false;
  try {
    await gotoAndSettle(page, target, config);
  } catch {
    /* checked below */
  }
  return !(await pageLooksBlocked(page)) && !/captcha-v2/i.test(page.url());
}

/**
 * Culture/geo redirects often strip YYMMDD date slugs (land on month calendar).
 * Re-navigate on the redirected host with the localized flights segment + dates.
 * Skip repair when already on captcha — another navigation usually deepens the wall.
 */
async function ensureDatedResultsUrl(page, req, config) {
  let href = page.url();
  if (/captcha-v2/i.test(href) || (await pageLooksBlocked(page))) {
    return href;
  }
  if (!urlMissingSearchDates(href) && !/previousCultureSource=/i.test(href)) {
    return href;
  }
  let host;
  try {
    host = new URL(href).hostname;
  } catch {
    host = 'www.skyscanner.com';
  }
  const repaired = skyscannerUrl(req, host);
  if (repaired.split('?')[0] === href.split('?')[0] && !urlMissingSearchDates(href)) {
    return href;
  }
  try {
    await gotoAndSettle(page, repaired, config);
  } catch {
    /* navigation interrupted by captcha redirect — caller checks blocked */
  }
  return page.url();
}

function parsePriceText(text) {
  const t = String(text || '').replace(/\u00a0/g, ' ').trim();
  // "164 €", "€164", "$118", "118", French "118 €"
  const m =
    t.match(/(\d[\d\s.,]*)\s*€/) ||
    t.match(/€\s*(\d[\d\s.,]*)/) ||
    t.match(/\$\s*(\d[\d\s.,]*)/) ||
    t.match(/^(\d[\d.,]+)$/);
  if (!m) return 0;
  const num = parseFloat(m[1].replace(/\s/g, '').replace(',', '.'));
  return num > 15 && num < 50000 ? num : 0;
}

async function scrapeSkyscanner(req, config) {
  if (config.dryRun) {
    return { offers: [], error: 'dry run' };
  }
  // VPS egress is FR — start on .fr /vols/ so geo redirect does not strip YYMMDD dates.
  // Fall back to .com for non-FR deployments (culture cookie / ss_csm still applied).
  const preferFr = process.env.SCRAPER_SKYSCANNER_HOST || 'www.skyscanner.fr';
  const url = skyscannerUrl(req, preferFr);

  return runWithRetries(config.headless, 'skyscanner', async () => {
    let endedOnWall = false;
    const offers = await withPage(
      config.headless,
      async (page) => {
        // Only seed US culture when scraping .com; on .fr it fights geo and can worsen PX.
        if (!/\.fr$/i.test(preferFr)) {
          await preferUsCulture(page);
        } else {
          await page.addInitScript(() => {
            Object.defineProperty(navigator, 'languages', { get: () => ['fr-FR', 'fr', 'en'] });
          });
        }

        // Skip homepage warm — it often hits PerimeterX; deep search URLs work in headed Chrome.
        const captured = attachJsonCapture(
          page,
          /skyscanner|graphql|radar|chicken-wings|flights|unified|itinerary|slipstream|falcon|acorn/i,
        );
        await humanSkyPause(page);
        try {
          await gotoAndSettle(page, url, config, { networkIdleMs: 3500 });
        } catch {
          /* captcha may interrupt navigation */
        }

        const onWall = async () => /captcha-v2/i.test(page.url()) || (await pageLooksBlocked(page));
        // PerimeterX sometimes flashes then continues; attempt headed press-and-hold.
        // Cap at 2 — each hold is ~6s; more attempts dominated total scrape time.
        const scrapeStarted = Date.now();
        const overSkyBudget = () => Date.now() - scrapeStarted > skyBudgetMs(config);
        const solveWall = async () => {
          for (let i = 0; i < pxSolveAttempts(); i++) {
            if (overSkyBudget()) break;
            if (!(await onWall())) return true;
            const solved = await trySolvePerimeterX(page);
            if (solved) return true;
            if (!overSkyBudget() && (await leaveCaptchaForSearch(page, req, config, preferFr))) return true;
            await page.waitForTimeout(800);
          }
          if (await onWall()) {
            endedOnWall = true;
            noteSkyscannerBlocked();
            await closePageIfPoisoned(page);
            return false;
          }
          return true;
        };
        const parsedWithReturn = () => {
          const parsed = extractSkyscanner(captured, req);
          const missingReturn =
            !!req.returnDate && parsed.every((o) => !(o.segments || []).some((s) => s.leg === 'inbound'));
          return parsed.length && !missingReturn ? parsed.slice(0, config.maxOffersPerSite) : [];
        };

        if (!(await solveWall()) || overSkyBudget()) {
          if (endedOnWall) await closePageIfPoisoned(page);
          return [];
        }

        await ensureDatedResultsUrl(page, req, config);
        if (overSkyBudget()) return [];
        if (await pageLooksBlocked(page) || /captcha-v2/i.test(page.url())) {
          endedOnWall = true;
          noteSkyscannerBlocked();
          return [];
        }
        if (urlMissingSearchDates(page.url())) {
          // Still on calendar — don't pretend we scraped itineraries.
          return [];
        }

        await waitForSkyResults(page, captured, req, config);
        if (overSkyBudget()) return [];
        let found = parsedWithReturn();
        if (found.length) return found;

        // DOM first when cards are already painted — this is the VPS reality (JSON often missing).
        let domRows = await readDomCardRows(page);
        let fromDom = offersFromDomRows(domRows, req, url, config);
        if (fromDom.length) {
          console.log(`[flight-scraper] sky DOM offers=${fromDom.length} (json=0)`);
          return fromDom;
        }

        // PerimeterX can also swap the results page for its wall mid-search (captcha
        // url=/). Solve it and reload the search instead of waiting on cards that never come.
        if (await onWall()) {
          if (!(await solveWall())) return [];
          if (urlMissingSearchDates(page.url())) {
            try {
              await gotoAndSettle(page, url, config, { networkIdleMs: 8000 });
            } catch {
              /* checked below */
            }
            if (!(await solveWall())) return [];
          }
          await waitForSkyResults(page, captured, req, config);
          found = parsedWithReturn();
          if (found.length) return found;
          domRows = await readDomCardRows(page);
          fromDom = offersFromDomRows(domRows, req, url, config);
          if (fromDom.length) return fromDom;
        }

        try {
          const cheapest = page
            .locator(
              '[data-testid="FqsTab_CHEAPEST"], button:has-text("Cheapest"), button:has-text("moins cher"), button:has-text("Le moins cher"), [role="tab"]:has-text("Cheapest"), [role="tab"]:has-text("moins cher")',
            )
            .first();
          if (await cheapest.isVisible({ timeout: 2000 })) {
            await cheapest.click({ timeout: 2000 });
            await page.waitForTimeout(600);
          }
        } catch {
          /* optional sort */
        }

        await page.evaluate(() => window.scrollBy(0, 800)).catch(() => {});
        await page.waitForTimeout(400);

        found = parsedWithReturn();
        if (found.length) return found;
        if (await onWall()) {
          endedOnWall = true;
          noteSkyscannerBlocked();
          return [];
        }

        domRows = await readDomCardRows(page);
        fromDom = offersFromDomRows(domRows, req, url, config);
        if (fromDom.length) return fromDom;
        console.log(
          `[flight-scraper] sky 0 offers after wait cards=${domRows.length} json=${extractSkyscanner(captured, req).length}`,
        );
        return [];
      },
      { proxyUrl: config.proxyUrl, engines: ['chromium'], site: 'skyscanner' },
    );

    if (offers.length) return { offers, error: undefined };
    if (endedOnWall) {
      return { offers: [], error: 'skyscanner blocked (perimeterx captcha)' };
    }
    return {
      offers: [],
      error: config.proxyUrl ? 'no skyscanner offers parsed' : 'no skyscanner offers (empty or unmatched json)',
    };
  }).then(({ offers, error }) => ({
    offers: offers || [],
    error: offers?.length ? undefined : error,
  }));
}

function extractSkyscanner(payloads, req) {
  const unified = extractUnifiedOffers(payloads, req);
  if (unified.length) return unified;
  const out = [];
  const seen = new Set();
  for (const p of payloads) {
    walk(p, (node) => {
      let price = node.price || node.rawPrice || node.amount || node.minPrice;
      if (price && typeof price === 'object') price = price.amount || price.value;
      if (typeof price !== 'number' || price <= 0) return;
      const segs = normalizeLegs(node, req);
      // Skip price-only nodes — identical placeholders collapse to 1 offer after API dedupe.
      if (!segs.length) return;
      const key = [
        price,
        ...segs.map((s) => `${s.fromCode}-${s.toCode}-${s.departureTime || ''}-${s.flightNumber || ''}`),
      ].join('|');
      if (seen.has(key)) return;
      seen.add(key);
      out.push(
        offerTemplate({
          origin: req.origin,
          destination: req.destination,
          price,
          currency: req.currency || 'USD',
          bookingUrl: node.deepLink || node.deeplink || skyscannerUrl(req),
          segments: segs,
        }),
      );
    });
  }
  return out;
}

function walk(node, fn, depth = 0) {
  if (!node || depth > 12) return;
  if (Array.isArray(node)) {
    node.forEach((x) => walk(x, fn, depth + 1));
    return;
  }
  if (typeof node === 'object') {
    fn(node);
    for (const v of Object.values(node)) walk(v, fn, depth + 1);
  }
}

function normalizeLegs(node, req = {}) {
  const segs = [];
  // Prefer explicit outbound / inbound arrays when present.
  const outArr = node.outboundLegs || node.outbound || node.outSegments;
  const inArr = node.inboundLegs || node.inbound || node.returnLegs || node.returnSegments;
  if (Array.isArray(outArr) && outArr.length) {
    for (const leg of outArr) {
      const s = legToSegment(leg, 'outbound');
      if (s) segs.push(s);
    }
    if (Array.isArray(inArr)) {
      for (const leg of inArr) {
        const s = legToSegment(leg, 'inbound');
        if (s) segs.push(s);
      }
    }
    return segs;
  }

  const legs = node.legs || node.segments || [];
  if (!Array.isArray(legs)) return segs;
  // Skyscanner itineraries: legs[0]=outbound, legs[1]=return for RT.
  // Only treat as RT directions when we have exactly 2 leg objects (not stopover segments).
  const rtPair =
    !!req.returnDate &&
    legs.length === 2 &&
    looksLikeItineraryLegPair(legs, req);
  for (let i = 0; i < legs.length; i++) {
    const direction = rtPair && i > 0 ? 'inbound' : 'outbound';
    const s = legToSegment(legs[i], direction);
    if (s) segs.push(s);
  }
  return segs;
}

function legToSegment(leg, direction) {
  if (!leg || typeof leg !== 'object') return null;
  const from = leg.origin?.iata || leg.originPlaceId || leg.origin || leg.from || leg.fromCode;
  const to = leg.destination?.iata || leg.destinationPlaceId || leg.destination || leg.to || leg.toCode;
  if (!from || !to) return null;
  let airline =
    leg.marketingCarrier?.iata ||
    leg.marketingCarrier?.code ||
    leg.carrier?.iata ||
    leg.carrier?.code ||
    (typeof leg.carrier === 'string' ? leg.carrier : '') ||
    leg.airlineCode ||
    leg.airline?.iata ||
    leg.airline?.code ||
    (typeof leg.airline === 'string' ? leg.airline : '') ||
    leg.marketingCarrier?.name ||
    leg.carrier?.name ||
    '';
  airline = String(airline || '').trim();
  // Keep IATA codes as-is; pass display names through for backend LookupAirlineIATA
  // (do not slice names to 2 chars — "Austrian" → "AU" is wrong).
  if (/^[A-Za-z0-9]{2}$/.test(airline)) {
    airline = airline.toUpperCase();
  }
  // Prefer full designator when present — GF2 fingerprint match needs flight identity.
  let flightNumber =
    leg.marketingFlightNumber ||
    leg.flightNumber ||
    leg.marketingCarrier?.flightNumber ||
    '';
  if (
    flightNumber &&
    /^[A-Za-z0-9]{2}$/.test(airline) &&
    !String(flightNumber).toUpperCase().startsWith(airline)
  ) {
    flightNumber = `${airline}${String(flightNumber).replace(/\D/g, '')}`;
  }
  return segment({
    leg: direction,
    from: String(from).slice(-3).toUpperCase(),
    to: String(to).slice(-3).toUpperCase(),
    departureTime: leg.departure || leg.departureTime || leg.departureDateTime,
    arrivalTime: leg.arrival || leg.arrivalTime || leg.arrivalDateTime,
    airline,
    flightNumber: flightNumber ? String(flightNumber) : '',
  });
}

function looksLikeItineraryLegPair(legs, req) {
  const o = String(req.origin || '').toUpperCase();
  const d = String(req.destination || '').toUpperCase();
  if (!o || !d || legs.length !== 2) return false;
  const from0 = String(
    legs[0].origin?.iata || legs[0].origin || legs[0].from || legs[0].fromCode || '',
  )
    .slice(-3)
    .toUpperCase();
  const to0 = String(
    legs[0].destination?.iata || legs[0].destination || legs[0].to || legs[0].toCode || '',
  )
    .slice(-3)
    .toUpperCase();
  const from1 = String(
    legs[1].origin?.iata || legs[1].origin || legs[1].from || legs[1].fromCode || '',
  )
    .slice(-3)
    .toUpperCase();
  const to1 = String(
    legs[1].destination?.iata || legs[1].destination || legs[1].to || legs[1].toCode || '',
  )
    .slice(-3)
    .toUpperCase();
  // Classic RT: A→B then B→A (or at least second leg starts at dest / ends at origin).
  if (from0 === o && to0 === d && (from1 === d || to1 === o)) return true;
  if (to0 === d && from1 === d) return true;
  return false;
}

module.exports = {
  scrapeSkyscanner,
  skyscannerUrl,
  urlMissingSearchDates,
  flightsSegmentForHost,
  preferUsCulture,
  trySolvePerimeterX,
  ensureDatedResultsUrl,
  parsePriceText,
};
