'use strict';

const { withPage, runWithRetries, gotoAndSettle, skyscannerDate } = require('./shared');
const { attachJsonCapture } = require('./jsonCapture');
const { offerTemplate, segment, segmentsFromRoundTripClocks } = require('../normalize');
const { parseRoundTripHm } = require('../localTime');
const { pageLooksBlocked } = require('../browser/botWall');
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

/** Best-effort PerimeterX "Press & Hold" on headed Chrome (CDP). */
async function trySolvePerimeterX(page) {
  if (!(await pageLooksBlocked(page)) && !/captcha-v2/i.test(page.url())) {
    return false;
  }
  const targets = ['#px-captcha', '#px-captcha-wrapper', 'div[style*="cursor"]', 'body'];
  for (const sel of targets) {
    try {
      const loc = page.locator(sel).first();
      const box = await loc.boundingBox({ timeout: 2000 });
      if (!box || box.width < 20 || box.height < 20) continue;
      // Hold near the typical "Press & Hold" control (upper-mid of captcha card).
      const x = box.x + box.width * 0.5;
      const y = box.y + Math.min(box.height * 0.55, 280);
      await page.mouse.move(x, y);
      await page.waitForTimeout(200);
      await page.mouse.down();
      await page.waitForTimeout(4200);
      await page.mouse.up();
      await page.waitForTimeout(1500);
      if (!(await pageLooksBlocked(page)) && !/captcha-v2/i.test(page.url())) {
        return true;
      }
    } catch {
      /* try next target */
    }
  }
  return false;
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
    const offers = await withPage(
      config.headless,
      async (page) => {
        // Only seed US culture when scraping .com; on .fr it fights geo and can worsen PX.
        if (!/\.fr$/i.test(preferFr)) {
          await preferUsCulture(page);
        }

        // Skip homepage warm — it often hits PerimeterX; deep search URLs work in headed Chrome.
        const captured = attachJsonCapture(page, /skyscanner|graphql|radar|chicken-wings|flights|unified|itinerary/i);
        const jsonUseful = () => {
          const parsed = extractSkyscanner(captured, req);
          if (!parsed.length) return false;
          if (!req.returnDate) return true;
          return parsed.some((o) => (o.segments || []).some((s) => s.leg === 'inbound'));
        };
        try {
          await gotoAndSettle(page, url, config, { ready: jsonUseful });
        } catch {
          /* captcha may interrupt navigation */
        }

        // PerimeterX sometimes flashes then continues; attempt headed press-and-hold.
        // Cap at 2 — each hold is ~6s; more attempts dominated total scrape time.
        for (let i = 0; i < 2; i++) {
          const href = page.url();
          if (!/captcha-v2/i.test(href) && !(await pageLooksBlocked(page))) break;
          const solved = await trySolvePerimeterX(page);
          if (solved) break;
          await page.waitForTimeout(800);
        }
        if (await pageLooksBlocked(page) || /captcha-v2/i.test(page.url())) {
          noteSkyscannerBlocked();
          return [];
        }

        await ensureDatedResultsUrl(page, req, config);
        if (await pageLooksBlocked(page) || /captcha-v2/i.test(page.url())) {
          noteSkyscannerBlocked();
          return [];
        }
        if (urlMissingSearchDates(page.url())) {
          // Still on calendar — don't pretend we scraped itineraries.
          return [];
        }

        // Prefer early JSON exit before optional sort / DOM waits.
        await waitUntil(page, jsonUseful, { timeoutMs: 7000, intervalMs: 200 });
        let parsed = extractSkyscanner(captured, req);
        const jsonMissingReturn =
          !!req.returnDate &&
          parsed.length > 0 &&
          parsed.every((o) => !(o.segments || []).some((s) => s.leg === 'inbound'));
        if (parsed.length && !jsonMissingReturn) {
          return parsed.slice(0, config.maxOffersPerSite);
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

        parsed = extractSkyscanner(captured, req);
        const stillMissingReturn =
          !!req.returnDate &&
          parsed.length > 0 &&
          parsed.every((o) => !(o.segments || []).some((s) => s.leg === 'inbound'));
        if (parsed.length && !stillMissingReturn) {
          return parsed.slice(0, config.maxOffersPerSite);
        }

        try {
          await page.waitForSelector('[data-testid="ticket"], [data-testid="itinerary-card"]', {
            timeout: 12000,
          });
        } catch {
          /* DOM scrape anyway */
        }

        const dom = await page.evaluate(() => {
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
            // Extract clocks from the FULL card text — truncating to ~240 chars
            // cut off French "Vol retour" times and caused "return not loaded".
            const times = fullText.match(hmRe) || [];
            // Prefer airline-specific nodes; never treat airport img alts as carriers
            // (that produced "David-Ben-Gurion International" in Flight details).
            const airlines = [];
            const pushAirline = (raw) => {
              const label = String(raw || '')
                .replace(/\s+/g, ' ')
                .replace(/\s*logo.*/i, '')
                .trim();
              if (!label || label.length < 2 || label.length > 40 || skipAlt.test(label)) return;
              if (/^[A-Z0-9]{3}$/i.test(label)) return; // airport IATA
              if (!airlines.includes(label)) airlines.push(label);
            };
            card
              .querySelectorAll(
                '[data-testid*="airline"] img[alt], [data-testid*="carrier"] img[alt], [class*="Airline"] img[alt], [class*="Carrier"] img[alt]',
              )
              .forEach((el) => pushAirline(el.getAttribute('alt') || el.getAttribute('title')));
            if (!airlines.length) {
              card.querySelectorAll('img[alt], img[title]').forEach((el) => {
                pushAirline(el.getAttribute('alt') || el.getAttribute('title'));
              });
            }
            out.push({
              priceText,
              link: card.querySelector('a')?.href || window.location.href,
              times,
              airlines,
              text: fullText.slice(0, 500),
            });
          });
          return out.slice(0, 30);
        });

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
          const airlineHint =
            (Array.isArray(row.airlines) && row.airlines[0]) || undefined;
          const segments = segmentsFromRoundTripClocks(req, clocks, {
            airline: airlineHint,
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
              bookingUrl: row.link || url,
              segments,
            }),
          );
        }
        // Prefer DOM RT offers when JSON lacked inbound legs.
        if (fromDom.length) return fromDom;
        return parsed.slice(0, config.maxOffersPerSite);
      },
      { proxyUrl: config.proxyUrl, engines: ['chromium'] },
    );

    if (offers.length) return { offers, error: undefined };
    return {
      offers: [],
      error: config.proxyUrl
        ? 'no skyscanner offers parsed'
        : 'no skyscanner offers (captcha or empty results)',
    };
  }).then(({ offers, error }) => ({
    offers: offers || [],
    error: offers?.length ? undefined : error,
  }));
}

function extractSkyscanner(payloads, req) {
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
