'use strict';

/** Canonical offer shape consumed by flyfix-api (Go parseOtaOffers). */
function offerTemplate(params) {
  return {
    originCode: params.origin,
    destinationCode: params.destination,
    price: params.price,
    currency: params.currency || 'USD',
    bookingUrl: params.bookingUrl || '',
    durationHours: params.durationHours,
    selfTransfer: !!params.selfTransfer,
    segments: params.segments || [],
  };
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

module.exports = { offerTemplate, segment };
