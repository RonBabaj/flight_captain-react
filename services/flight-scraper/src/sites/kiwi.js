'use strict';

const { withPage, runWithRetries, gotoAndSettle } = require('./shared');
const { attachJsonCapture } = require('./jsonCapture');
const { scrapeKiwiTequila } = require('./tequila');
const { offerTemplate, segmentsFromRoundTripClocks } = require('../normalize');
const { parseRoundTripHm } = require('../localTime');
const { pageLooksBlocked } = require('../browser/botWall');
const { kiwiPlaceSlug } = require('./kiwiPlaces');

function kiwiSearchUrl(req) {
  const o = kiwiPlaceSlug(req.origin, { cityName: req.originCity, countryCode: req.originCountry });
  const d = kiwiPlaceSlug(req.destination, {
    cityName: req.destinationCity,
    countryCode: req.destinationCountry,
  });
  const dep = req.departureDate;
  const ret = req.returnDate || '';
  // Current Kiwi SPA ignores bare IATA path segments — needs city-country slugs + no-return.
  if (ret) {
    return `https://www.kiwi.com/en/search/results/${o}/${d}/${dep}/${ret}/`;
  }
  return `https://www.kiwi.com/en/search/results/${o}/${d}/${dep}/no-return/`;
}

function kiwiPathLooksCorrect(href, req) {
  const path = String(href || '').split('?')[0].toLowerCase();
  if (!/\/search\/results\//.test(path)) return false;
  const o = String(req.origin || '').toLowerCase();
  const d = String(req.destination || '').toLowerCase();
  // Accept either IATA or city slug presence (slug maps change; path still names the cities).
  const originCity = String(req.originCity || '').toLowerCase().replace(/[^a-z]+/g, '-');
  const destCity = String(req.destinationCity || '').toLowerCase().replace(/[^a-z]+/g, '-');
  const originOk =
    path.includes(`/${o}/`) ||
    (o === 'tlv' && path.includes('tel-aviv')) ||
    (originCity.length >= 4 && path.includes(originCity.slice(0, 6)));
  const destOk =
    path.includes(`/${d}/`) ||
    (d === 'prg' && path.includes('prague')) ||
    (destCity.length >= 4 && path.includes(destCity.slice(0, 6)));
  // Prefer mapped slugs when present.
  const mappedO = kiwiPlaceSlug(req.origin, { cityName: req.originCity, countryCode: req.originCountry });
  const mappedD = kiwiPlaceSlug(req.destination, {
    cityName: req.destinationCity,
    countryCode: req.destinationCountry,
  });
  if (path.includes(`/${mappedO}/`) && path.includes(`/${mappedD}/`)) return true;
  return !!(originOk && destOk);
}

async function clearKiwiSpaState(page) {
  try {
    await page.evaluate(() => {
      try {
        localStorage.clear();
      } catch {
        /* ignore */
      }
      try {
        sessionStorage.clear();
      } catch {
        /* ignore */
      }
    });
  } catch {
    /* ignore */
  }
}

async function ensureKiwiResultsUrl(page, url, req, config) {
  const candidates = [url];
  // Historical Kiwi country slugs that now 302/SPA-redirect to homepage.
  if (/czech-republic/i.test(url)) {
    candidates.push(url.replace(/czech-republic/gi, 'czechia'));
  }
  if (/czechia/i.test(url)) {
    candidates.push(url.replace(/czechia/gi, 'czech-republic'));
  }

  for (const candidate of candidates) {
    await clearKiwiSpaState(page);
    try {
      await page.goto('about:blank', { waitUntil: 'commit', timeout: 10_000 });
    } catch {
      /* ignore */
    }
    await gotoAndSettle(page, candidate, config);
    if (kiwiPathLooksCorrect(page.url(), req) || /\/search\/results\//i.test(page.url())) {
      return page.url();
    }
  }
  // Hard reload of primary URL once more.
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: config.navigationTimeoutMs });
    await page.waitForTimeout(Math.min(4000, config.settleMs || 4000));
  } catch {
    /* ignore */
  }
  return page.url();
}

async function scrapeKiwi(req, config) {
  if (config.dryRun) {
    return { offers: [], error: 'dry run' };
  }
  if (config.tequilaKey) {
    return scrapeKiwiTequila(req, config);
  }
  const url = kiwiSearchUrl(req);
  let lastHref = '';

  try {
    return await runWithRetries(config.headless, 'kiwi', async () => {
      const offers = await withPage(config.headless, async (page) => {
      // Do NOT warmHomepage on shared CDP — it sticks origin/destination in SPA state
      // and redirects dated /search/results/ URLs to the wrong city (e.g. Athens).
      await clearKiwiSpaState(page);

      const captured = attachJsonCapture(page, /skypicker|kiwi\.com|graphql|search|itinerar|booking-api/i);

      lastHref = await ensureKiwiResultsUrl(page, url, req, config);
      if (await pageLooksBlocked(page)) {
        return [];
      }
      if (!kiwiPathLooksCorrect(lastHref, req)) {
        // Wrong city / homepage — don't parse unrelated cards.
        return [];
      }

      let fromNetwork = extractFromCaptured(captured, req);
      if (fromNetwork.length > 0) {
        return fromNetwork.slice(0, config.maxOffersPerSite);
      }

      const nextData = await extractNextData(page, req);
      if (nextData.length > 0) {
        return nextData.slice(0, config.maxOffersPerSite);
      }

      // Wait for result cards after cookie + challenge settle.
      try {
        await page.waitForSelector('[data-test="ResultCard"], [data-test="ResultCardWrapper"]', {
          timeout: 15000,
        });
      } catch {
        /* DOM fallback may still find prices */
      }

      const fromDom = await page.evaluate(() => {
        const cards = document.querySelectorAll(
          '[data-test="ResultCard"], [data-test="ResultCardWrapper"], [data-test="ResultList-result"]',
        );
        const out = [];
        cards.forEach((card) => {
          const priceText =
            card.querySelector('[data-test="ResultCardPrice"]')?.textContent ||
            card.querySelector('[data-test*="Price"]')?.textContent ||
            card.textContent ||
            '';
          const m = String(priceText).match(/(\d[\d\s.,]*)\s*€|\$\s*(\d[\d\s.,]*)|(\d[\d\s.,]*)/);
          const raw = (m && (m[1] || m[2] || m[3])) || '';
          const num = parseFloat(String(raw).replace(/\s/g, '').replace(',', '.').replace(/[^\d.]/g, ''));
          if (!num || Number.isNaN(num) || num < 15) return;
          const link = card.querySelector('a[href*="/booking"], a[href*="kiwi.com"]')?.href || window.location.href;
          const stamps = [...card.querySelectorAll('[data-test="TripTimestamp"]')]
            .map((el) => (el.textContent || '').trim())
            .filter((t) => /^\d{1,2}:\d{2}$/.test(t));
          // Prefer the first sector (outbound) — RT cards list return stations too.
          const sector =
            card.querySelector('[data-test="ResultCardSectorWrapper"]') || card;
          const stops = [...sector.querySelectorAll('[data-test="ResultCardStopPlace"], [data-test="stationName"]')]
            .map((el) => (el.textContent || '').trim().toUpperCase())
            .filter((t) => /^[A-Z]{3}$/.test(t));
          const logo =
            card.querySelector('[data-test="ResultCardCarrierLogo"] img') ||
            card.querySelector('img[alt*="airline" i], img[class*="Carrier"]');
          const airline =
            (logo?.getAttribute('alt') || '').replace(/\s*logo.*/i, '').trim() ||
            (logo?.getAttribute('src') || '').match(/\/([A-Z0-9]{2})\./i)?.[1] ||
            '';
          const stopBadge =
            card.querySelector('[data-test^="StopCountBadge"]')?.textContent?.trim() || '';
          out.push({
            price: num,
            bookingUrl: link,
            stamps,
            fromCode: stops[0] || '',
            toCode: stops.length > 1 ? stops[stops.length - 1] : '',
            airline,
            stopBadge,
            text: (card.innerText || '').slice(0, 240),
          });
        });
        return out;
      });

      return fromDom
        .map((row) => {
          let clocks = null;
          if (row.stamps?.length >= 2) {
            clocks = {
              outbound: { depHm: row.stamps[0], arrHm: row.stamps[1] },
            };
            if (row.stamps.length >= 4) {
              clocks.inbound = { depHm: row.stamps[2], arrHm: row.stamps[3] };
            }
          } else {
            clocks = parseRoundTripHm(row.text);
          }
          if (!clocks) return null;
          let fromCode = row.fromCode || req.origin;
          let toCode = row.toCode || req.destination;
          // RT cards can still collapse to origin/origin — force search OD.
          if (!toCode || toCode === fromCode) {
            fromCode = req.origin;
            toCode = req.destination;
          }
          const segments = segmentsFromRoundTripClocks(req, clocks, {
            origin: fromCode,
            destination: toCode,
            airline: row.airline || undefined,
          });
          if (!segments.length) return null;
          return offerTemplate({
            origin: req.origin,
            destination: req.destination,
            price: row.price,
            currency: req.currency || 'USD',
            bookingUrl: row.bookingUrl,
            segments,
          });
        })
        .filter(Boolean);
    }, { proxyUrl: config.proxyUrl, engines: ['chromium', 'firefox'] });

      if (offers.length) return { offers, error: undefined };
      const wrongRoute = lastHref && !kiwiPathLooksCorrect(lastHref, req);
      return {
        offers: [],
        error: wrongRoute
          ? `kiwi SPA redirected away from results (${String(lastHref).slice(0, 120)})`
          : pageLooksBlockedHint(lastHref)
            ? 'Kiwi bot check — set SCRAPER_PROXY_URL (residential) or retry'
            : 'no kiwi offers parsed (layout or empty route)',
      };
    }).then(({ offers, error }) => ({
      offers: offers || [],
      error: offers?.length ? undefined : error,
    }));
  } catch (err) {
    return { offers: [], error: String(err.message || err) };
  }
}

function pageLooksBlockedHint(href) {
  return /captcha|perimeterx|bot/i.test(String(href || ''));
}

async function extractNextData(page, req) {
  try {
    const raw = await page.evaluate(() => {
      const el = document.getElementById('__NEXT_DATA__');
      return el ? el.textContent : '';
    });
    if (!raw) return [];
    const data = JSON.parse(raw);
    return extractFromCaptured([data], req);
  } catch {
    return [];
  }
}

function extractFromCaptured(blobs, req) {
  const flat = [];
  for (const b of blobs) {
    flat.push(...flattenOffers(b));
  }
  const out = [];
  const seen = new Set();
  for (const item of flat) {
    const price = pickNumber(item, [
      'price',
      'priceUsd',
      'priceEur',
      'amount',
      'totalPrice',
      'total',
      'conversion',
    ]);
    if (!price || price < 15) continue;
    let segs = pickSegments(item);
    if (!segs.length && item.route) {
      segs = routeToSegments(item.route, req);
    }
    // Skip price-only rows: identical placeholder segments collapse to 1 offer in API dedupe.
    if (!segs.length) continue;
    const key = [
      price,
      ...segs.map((s) => `${s.fromCode}-${s.toCode}-${s.departureTime || ''}-${s.flightNumber || ''}`),
    ].join('|');
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(
      offerTemplate({
        origin: req.origin,
        destination: req.destination,
        price,
        currency:
          pickString(item, ['currency', 'currencyCode']) ||
          (typeof item.conversion === 'object' && item.conversion?.currency) ||
          req.currency ||
          'USD',
        bookingUrl: pickString(item, ['bookingUrl', 'deepLink', 'url', 'shareUrl', 'booking_link']),
        selfTransfer: !!item.selfTransfer || !!item.virtualInterlining || !!item.isVirtualInterlining,
        segments: segs,
      }),
    );
  }
  return out;
}

function routeToSegments(route, req) {
  if (!Array.isArray(route)) return [];
  return route.map((s, i) => ({
    leg: i === 0 ? 'outbound' : 'inbound',
    fromCode: s.flyFrom || s.from || s.cityFrom || s.origin?.code,
    toCode: s.flyTo || s.to || s.cityTo || s.destination?.code,
    departureTime: s.dTime || s.local_departure || s.departure?.utc,
    arrivalTime: s.aTime || s.local_arrival || s.arrival?.utc,
    airlineCode: s.airline || s.carrier?.code,
    flightNumber: s.flight_no || s.flightNumber,
  })).filter((s) => s.fromCode && s.toCode);
}

function flattenOffers(node, depth = 0) {
  if (!node || depth > 12) return [];
  if (Array.isArray(node)) {
    return node.flatMap((x) => flattenOffers(x, depth + 1));
  }
  if (typeof node !== 'object') return [];

  const hasPrice =
    pickNumber(node, ['price', 'priceUsd', 'amount', 'totalPrice', 'total']) > 0 ||
    (node.conversion && typeof node.conversion === 'object' && node.conversion.amount);
  if (hasPrice && (node.segments || node.route || node.outbound || node.itinerary)) {
    return [node];
  }
  if (hasPrice && node.flyFrom && node.flyTo) {
    return [node];
  }

  const keys = [
    'data',
    'itineraries',
    'results',
    'items',
    'flights',
    'offers',
    'connections',
    'itinerariesList',
    'search',
    'props',
    'pageProps',
    'initialState',
    'bundles',
  ];
  let out = [];
  for (const k of keys) {
    if (node[k] != null) out = out.concat(flattenOffers(node[k], depth + 1));
  }
  return out;
}

function pickSegments(item) {
  if (Array.isArray(item.segments)) {
    return item.segments.map((s) => ({
      leg: s.leg || s.direction || 'outbound',
      fromCode: s.fromCode || s.from || s.flyFrom || s.cityFrom,
      toCode: s.toCode || s.to || s.flyTo || s.cityTo,
      departureTime: s.departureTime || s.departureTimeUtc || s.dTime,
      arrivalTime: s.arrivalTime || s.arrivalTimeUtc || s.aTime,
      airlineCode: s.airlineCode || s.airline || s.carrier?.code,
      flightNumber: s.flightNumber || s.flight_no,
    }));
  }
  if (Array.isArray(item.outbound) || Array.isArray(item.inbound)) {
    const segs = [];
    for (const s of item.outbound || []) {
      segs.push({ ...mapRouteSeg(s), leg: 'outbound' });
    }
    for (const s of item.inbound || []) {
      segs.push({ ...mapRouteSeg(s), leg: 'inbound' });
    }
    return segs;
  }
  return [];
}

function mapRouteSeg(s) {
  return {
    fromCode: s.flyFrom || s.from || s.cityFrom,
    toCode: s.flyTo || s.to || s.cityTo,
    departureTime: s.dTime || s.local_departure,
    arrivalTime: s.aTime || s.local_arrival,
    airlineCode: s.airline || s.carrier,
    flightNumber: s.flight_no || s.flightNumber,
  };
}

function pickString(obj, keys) {
  for (const k of keys) {
    if (obj[k] && typeof obj[k] === 'string') return obj[k];
  }
  return '';
}

function pickNumber(obj, keys) {
  for (const k of keys) {
    const v = obj[k];
    if (typeof v === 'number' && v > 0) return v;
    if (typeof v === 'string') {
      const n = parseFloat(v.replace(/[^\d.]/g, ''));
      if (n > 0) return n;
    }
  }
  if (obj.conversion && typeof obj.conversion === 'object') {
    const a = obj.conversion.amount || obj.conversion.EUR || obj.conversion.USD;
    if (typeof a === 'number' && a > 0) return a;
  }
  return 0;
}

module.exports = { scrapeKiwi, kiwiSearchUrl };
