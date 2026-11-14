'use strict';

const { offerTemplate, segment } = require('../normalize');

function cleanLabel(raw) {
  return String(raw || '')
    .replace(/\s+/g, ' ')
    .replace(/[.,;:]+$/g, '')
    .trim();
}

function rejectAirlineLabel(label) {
  if (!label || label.length < 2 || label.length > 40) return true;
  if (/^\d/.test(label)) return true;
  if (/^[A-Z0-9]{3}$/i.test(label)) return true;
  return /logo|icon|image|photo|arrow|chevron|skyscanner|direct|stop|airport|a[eé]roport|international|ben[-\s]?gour|terminal|flughafen|depart|arriv|hour|heure|minute|option|montant|total/i.test(
    label,
  );
}

/** Airline names written on the result card ("opéré par …", "operated by …"). */
function airlinesFromCardText(text) {
  const raw = String(text || '').replace(/\u00a0/g, ' ');
  const take = (m) => {
    const label = cleanLabel(m && m[1]);
    return rejectAirlineLabel(label) ? '' : label;
  };
  let outbound = take(
    raw.match(/vol aller[\s\S]{0,160}?op[eé]r[eé](?:e)? par\s+([^\n.]{2,40})/i) ||
      raw.match(/outbound[\s\S]{0,120}?operated by\s+([^\n.]{2,40})/i),
  );
  let inbound = take(
    raw.match(/vol retour[\s\S]{0,160}?op[eé]r[eé](?:e)? par\s+([^\n.]{2,40})/i) ||
      raw.match(/\breturn[\s\S]{0,120}?operated by\s+([^\n.]{2,40})/i),
  );
  if (!outbound && !inbound) {
    const header = cleanLabel(
      (raw.split('\n').find((line) => cleanLabel(line) && !rejectAirlineLabel(cleanLabel(line))) || ''),
    );
    const parts = header
      .split(/\s+(?:et|&|and)\s+/i)
      .map(cleanLabel)
      .filter((p) => !rejectAirlineLabel(p));
    if (parts.length >= 1 && parts.length <= 3) {
      outbound = parts[0];
      inbound = parts[1] || '';
    }
  }
  if (!inbound) inbound = outbound;
  return { outbound, inbound };
}

function absolutizeSkyscanner(href) {
  const h = String(href || '').trim();
  if (!h) return '';
  if (/^https?:\/\//i.test(h)) return h;
  if (h.startsWith('/')) return `https://www.skyscanner.net${h}`;
  return '';
}

/** Seller redirect already attached to the card. Results-page URLs are not booking links. */
function pickSessionBookingUrl(hrefs) {
  const list = (Array.isArray(hrefs) ? hrefs : [])
    .map((h) => absolutizeSkyscanner(h))
    .filter(Boolean);
  const deeplink = list.find((h) => /transport_deeplink|\/deeplink\//i.test(h));
  if (deeplink) return deeplink;
  const external = list.find((h) => {
    try {
      const host = new URL(h).hostname.toLowerCase();
      return host && !/skyscanner\.|google\.|gstatic\./i.test(host);
    } catch {
      return false;
    }
  });
  return external || '';
}

function asList(v) {
  if (Array.isArray(v)) return v;
  if (v && typeof v === 'object') return Object.values(v);
  return [];
}

function pad2(n) {
  return String(n).padStart(2, '0');
}

function timeFrom(v) {
  if (!v) return '';
  if (typeof v === 'string') return v;
  if (typeof v === 'object' && v.year && v.month && v.day) {
    return `${v.year}-${pad2(v.month)}-${pad2(v.day)}T${pad2(v.hour || 0)}:${pad2(v.minute || 0)}:00`;
  }
  return '';
}

function iataCode(v) {
  const s = String(v || '')
    .trim()
    .toUpperCase();
  return /^[A-Z0-9]{2}$/.test(s) || /^[A-Z]{3}$/.test(s) ? s : '';
}

function placeCode(v, places) {
  if (v && typeof v === 'object') {
    return placeCode(v.iata || v.displayCode || v.altId || v.id, places);
  }
  const direct = String(v || '').trim().toUpperCase();
  if (/^[A-Z]{3}$/.test(direct)) return direct;
  const mapped = places.get(String(v || ''));
  return mapped && /^[A-Z]{3}$/.test(mapped) ? mapped : '';
}

function priceAmount(v) {
  if (typeof v === 'number' && v > 0) return v;
  if (typeof v === 'string') {
    const n = parseFloat(v.replace(/[^\d.]/g, ''));
    return n > 0 ? n : 0;
  }
  if (v && typeof v === 'object') {
    return priceAmount(v.amount ?? v.raw ?? v.value);
  }
  return 0;
}

function indexEntities(payloads) {
  const carriers = new Map();
  const places = new Map();
  const legs = new Map();
  const itineraries = [];

  const walk = (node, depth) => {
    if (!node || depth > 10) return;
    if (Array.isArray(node)) {
      node.forEach((x) => walk(x, depth + 1));
      return;
    }
    if (typeof node !== 'object') return;

    const id = node.id != null ? String(node.id) : '';
    const iata = iataCode(node.iata || node.displayCode || node.altId);
    if (id && iata.length === 3 && (node.name || node.type === 'PLACE' || node.placeType)) {
      places.set(id, iata);
    }
    if (id && (node.name || node.displayName) && (iata.length === 2 || iataCode(id).length === 2) && !node.pricingOptions && !node.originPlaceId) {
      const code = iata.length === 2 ? iata : iataCode(id);
      if (code.length === 2) {
        carriers.set(id, { code, name: cleanLabel(node.name || node.displayName) });
      }
    }
    if (
      id &&
      (node.originPlaceId || node.origin) &&
      (node.destinationPlaceId || node.destination) &&
      (node.departureDateTime || node.departure)
    ) {
      legs.set(id, node);
    }
    if (Array.isArray(node.legIds) && (node.pricingOptions || node.pricing_options)) {
      itineraries.push(node);
    }

    for (const v of Object.values(node)) walk(v, depth + 1);
  };

  for (const p of payloads || []) walk(p, 0);
  return { carriers, places, legs, itineraries };
}

function carrierFromLeg(leg, carriers) {
  const ids = []
    .concat(leg.marketingCarrierIds || [])
    .concat(leg.operatingCarrierIds || [])
    .concat(leg.carrierIds || []);
  for (const id of ids) {
    const hit = carriers.get(String(id));
    if (hit) return hit.code || hit.name;
    const code = iataCode(id);
    if (code.length === 2) return code;
  }
  const named = leg.marketingCarrier || leg.carrier;
  if (named && typeof named === 'object') {
    return named.iata || named.displayCode || named.name || '';
  }
  if (typeof named === 'string') return named;
  return '';
}

function sessionURLFromItinerary(it) {
  const hrefs = [];
  const opts = asList(it.pricingOptions || it.pricing_options);
  for (const opt of opts) {
    if (opt.url) hrefs.push(opt.url);
    for (const item of asList(opt.items)) {
      hrefs.push(item.url || item.deepLink || item.deeplink || '');
    }
  }
  hrefs.push(it.deepLink || it.deeplink || '');
  return pickSessionBookingUrl(hrefs);
}

function priceFromItinerary(it) {
  const opts = asList(it.pricingOptions || it.pricing_options);
  for (const opt of opts) {
    const n = priceAmount(opt.price);
    if (n) return n;
    for (const item of asList(opt.items)) {
      const inner = priceAmount(item.price);
      if (inner) return inner;
    }
  }
  return priceAmount(it.price);
}

/**
 * Read itineraries out of the JSON the results page already loaded
 * (legs + carriers + pricingOptions), instead of searching for the flight again.
 */
function extractUnifiedOffers(payloads, req) {
  const { carriers, places, legs, itineraries } = indexEntities(payloads);
  const out = [];
  const seen = new Set();
  for (const it of itineraries) {
    const segs = [];
    for (let i = 0; i < it.legIds.length; i++) {
      const leg = legs.get(String(it.legIds[i]));
      if (!leg) continue;
      const from = placeCode(leg.originPlaceId || leg.origin, places);
      const to = placeCode(leg.destinationPlaceId || leg.destination, places);
      const dep = timeFrom(leg.departureDateTime || leg.departure);
      const arr = timeFrom(leg.arrivalDateTime || leg.arrival);
      if (!from || !to || !dep) continue;
      const direction = i === 0 ? 'outbound' : 'inbound';
      segs.push(
        segment({
          leg: direction,
          from,
          to,
          departureTime: dep,
          arrivalTime: arr,
          airline: carrierFromLeg(leg, carriers),
          flightNumber: leg.flightNumber || '',
        }),
      );
    }
    if (!segs.length) continue;
    if (req.returnDate && !segs.some((s) => s.leg === 'inbound')) continue;
    const price = priceFromItinerary(it);
    if (!price) continue;
    const key = `${price}|${segs.map((s) => `${s.fromCode}${s.toCode}${s.departureTime}${s.airlineCode}`).join('|')}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(
      offerTemplate({
        origin: req.origin,
        destination: req.destination,
        price,
        currency: req.currency || 'USD',
        bookingUrl: sessionURLFromItinerary(it),
        segments: segs,
      }),
    );
  }
  return out;
}

module.exports = {
  airlinesFromCardText,
  pickSessionBookingUrl,
  extractUnifiedOffers,
  rejectAirlineLabel,
};
