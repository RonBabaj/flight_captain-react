'use strict';

const { offerTemplate, segment } = require('../normalize');

/**
 * Official Kiwi.com Tequila API — works from VPS IPs (no browser).
 * Sign up: https://tequila.kiwi.com/portal
 */
async function scrapeKiwiTequila(req, config) {
  const apikey = config.tequilaKey;
  if (!apikey) {
    return { offers: [], error: 'KIWI_TEQUILA_API_KEY not set' };
  }
  const flyFrom = String(req.origin).toUpperCase();
  const flyTo = String(req.destination).toUpperCase();
  const dep = formatTequilaDate(req.departureDate);
  const params = new URLSearchParams({
    fly_from: flyFrom,
    fly_to: flyTo,
    date_from: dep,
    date_to: dep,
    adults: String(Math.max(1, req.adults || 1)),
    curr: (req.currency || 'USD').toUpperCase(),
    limit: String(Math.min(config.maxOffersPerSite || 40, 50)),
    sort: 'price',
    max_stopovers: '5',
    partner_market: 'us',
  });
  if (req.returnDate) {
    const ret = formatTequilaDate(req.returnDate);
    params.set('return_from', ret);
    params.set('return_to', ret);
  }
  const url = `https://api.tequila.kiwi.com/v2/search?${params.toString()}`;
  try {
    const resp = await fetch(url, {
      headers: { apikey, Accept: 'application/json' },
      signal: AbortSignal.timeout(45000),
    });
    const body = await resp.text();
    if (!resp.ok) {
      return { offers: [], error: `tequila status ${resp.status}: ${body.slice(0, 160)}` };
    }
    const json = JSON.parse(body);
    const offers = parseTequilaData(json, req);
    return { offers, error: offers.length ? undefined : 'tequila returned no itineraries' };
  } catch (err) {
    return { offers: [], error: `tequila: ${err.message || err}` };
  }
}

function formatTequilaDate(iso) {
  // 2027-06-15 -> 15/06/2027
  const m = String(iso).match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!m) return iso;
  return `${m[3]}/${m[2]}/${m[1]}`;
}

function parseTequilaData(json, req) {
  const data = json.data || json;
  if (!Array.isArray(data)) return [];
  const out = [];
  for (const it of data) {
    const price = it.price || it.conversion?.EUR || it.conversion?.USD;
    if (typeof price !== 'number' || price <= 0) continue;
    const route = it.route || [];
    if (!route.length) continue;
    const segs = route.map((leg, idx) => {
      const isReturn =
        req.returnDate &&
        idx > 0 &&
        String(leg.flyFrom || '').toUpperCase() !== String(req.origin).toUpperCase();
      return {
        leg: isReturn ? 'inbound' : 'outbound',
        fromCode: leg.flyFrom,
        toCode: leg.flyTo,
        departureTime: leg.local_departure || leg.utc_departure,
        arrivalTime: leg.local_arrival || leg.utc_arrival,
        airlineCode: leg.airline,
        flightNumber: leg.flight_no,
      };
    });
    out.push(
      offerTemplate({
        origin: req.origin,
        destination: req.destination,
        price,
        currency: (it.conversion && Object.keys(it.conversion)[0]) || req.currency || 'USD',
        bookingUrl: it.deep_link || it.booking_token || '',
        selfTransfer: !!it.has_airport_change || route.some((l) => l.guarantee === false),
        segments: segs,
      }),
    );
  }
  return out;
}

module.exports = { scrapeKiwiTequila };
