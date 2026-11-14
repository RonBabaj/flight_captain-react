'use strict';

/** Canonical offer shape consumed by flyfix-api (Go parseOtaOffers). */
function offerTemplate(params) {
  const out = {
    originCode: params.origin,
    destinationCode: params.destination,
    price: params.price,
    currency: params.currency || 'USD',
    bookingUrl: params.bookingUrl || '',
    durationHours: params.durationHours,
    selfTransfer: !!params.selfTransfer,
    segments: params.segments || [],
  };
  if (params.stopsHint != null && params.stopsHint > 0) {
    out.stopsHint = params.stopsHint;
  }
  if (params.vendor) out.vendorName = params.vendor;
  return out;
}

function segment(params) {
  return {
    leg: params.leg || 'outbound',
    fromCode: params.from,
    toCode: params.to,
    departureTime: params.departureTime,
    arrivalTime: params.arrivalTime,
    airlineCode: params.airline || '',
    flightNumber: params.flightNumber || '',
    durationHours: params.durationHours,
  };
}

/**
 * Build outbound (+ inbound when returnDate + second clock pair exist) segments
 * from local HH:MM pairs scraped off result cards.
 */
function segmentsFromRoundTripClocks(req, clocks, extras = {}) {
  const { localHmToIso } = require('./localTime');
  if (!clocks?.outbound?.depHm || !clocks?.outbound?.arrHm) return [];
  const origin = String(extras.origin || req.origin || '').toUpperCase();
  const destination = String(extras.destination || req.destination || '').toUpperCase();
  const airline = extras.airline || undefined;
  const segs = [
    segment({
      leg: 'outbound',
      from: origin,
      to: destination,
      departureTime: localHmToIso(req.departureDate, clocks.outbound.depHm, { airport: origin }),
      arrivalTime: localHmToIso(req.departureDate, clocks.outbound.arrHm, {
        afterHm: clocks.outbound.depHm,
        airport: destination,
      }),
      airline,
    }),
  ];
  if (
    req.returnDate &&
    clocks.inbound?.depHm &&
    clocks.inbound?.arrHm &&
    segs[0].departureTime &&
    segs[0].arrivalTime
  ) {
    const retDep = localHmToIso(req.returnDate, clocks.inbound.depHm, { airport: destination });
    const retArr = localHmToIso(req.returnDate, clocks.inbound.arrHm, {
      afterHm: clocks.inbound.depHm,
      airport: origin,
    });
    if (retDep && retArr) {
      segs.push(
        segment({
          leg: 'inbound',
          from: destination,
          to: origin,
          departureTime: retDep,
          arrivalTime: retArr,
          airline: extras.inboundAirline || airline,
        }),
      );
    }
  }
  if (!segs[0].departureTime || !segs[0].arrivalTime) return [];
  return segs;
}

module.exports = { offerTemplate, segment, segmentsFromRoundTripClocks };
