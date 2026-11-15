'use strict';

const { offerTemplate, segment } = require('../normalize');

/** Kiwi umbrella GraphQL roots (SearchReturnItinerariesQuery / SearchOneWayItinerariesQuery). */
function umbrellaRoots(payloads) {
  const out = [];
  for (const p of payloads || []) {
    const d = p && p.data;
    if (!d || typeof d !== 'object') continue;
    for (const key of ['returnItineraries', 'onewayItineraries']) {
      const root = d[key];
      if (root && Array.isArray(root.itineraries)) out.push(root);
    }
  }
  return out;
}

/** Results are final once Kiwi stops reporting `hasMorePending`. */
function kiwiUmbrellaSettled(payloads) {
  return umbrellaRoots(payloads).some((r) => r.itineraries.length > 0 && r.metadata?.hasMorePending === false);
}

function urlCurrency(url) {
  const m = String(url || '').match(/[?&]currency=([a-z]{3})\b/i);
  return m ? m[1].toUpperCase() : '';
}

function sectorSegments(sector, leg) {
  const out = [];
  for (const ss of sector?.sectorSegments || []) {
    const s = ss && ss.segment;
    if (!s) continue;
    const from = String(s.source?.station?.code || '').toUpperCase();
    const to = String(s.destination?.station?.code || '').toUpperCase();
    if (!/^[A-Z]{3}$/.test(from) || !/^[A-Z]{3}$/.test(to) || !s.source?.localTime) continue;
    const carrier = String(s.carrier?.code || '').toUpperCase();
    const num = String(s.code || '').replace(/\D/g, '');
    out.push(
      segment({
        leg,
        from,
        to,
        departureTime: s.source.localTime,
        arrivalTime: s.destination?.localTime,
        airline: carrier || s.carrier?.name || '',
        flightNumber: carrier && num ? `${carrier}${num}` : '',
      }),
    );
  }
  return out;
}

function bookingUrlFor(it) {
  const edges = it.bookingOptions?.edges || [];
  const want = String(it.price?.amount || '');
  const node = (edges.find((e) => String(e?.node?.price?.amount || '') === want) || edges[0])?.node;
  const href = String(node?.bookingUrl || '');
  if (!href) return '';
  return href.startsWith('/') ? `https://www.kiwi.com${href}` : href;
}

/** Itineraries from the JSON Kiwi's results page already loaded. */
function extractKiwiUmbrella(payloads, req) {
  const out = [];
  const seen = new Set();
  for (const root of umbrellaRoots(payloads)) {
    for (const it of root.itineraries) {
      const segs = it.sector
        ? sectorSegments(it.sector, 'outbound')
        : [...sectorSegments(it.outbound, 'outbound'), ...sectorSegments(it.inbound, 'inbound')];
      if (!segs.length) continue;
      if (req.returnDate && !segs.some((s) => s.leg === 'inbound')) continue;
      const price = parseFloat(String(it.price?.amount || ''));
      if (!(price > 0)) continue;
      const bookingUrl = bookingUrlFor(it);
      const key = `${price}|${segs.map((s) => `${s.fromCode}${s.toCode}${s.departureTime}${s.flightNumber}`).join('|')}`;
      if (seen.has(key)) continue;
      seen.add(key);
      out.push(
        offerTemplate({
          origin: req.origin,
          destination: req.destination,
          price,
          currency: urlCurrency(bookingUrl) || req.currency || 'USD',
          bookingUrl,
          selfTransfer: !!it.travelHack?.isVirtualInterlining,
          segments: segs,
        }),
      );
    }
  }
  return out.sort((a, b) => a.price - b.price);
}

module.exports = { extractKiwiUmbrella, kiwiUmbrellaSettled };
