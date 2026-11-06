'use strict';

const {
  skyscannerUrl,
  urlMissingSearchDates,
  flightsSegmentForHost,
} = require('../src/sites/skyscanner');

const req = {
  origin: 'TLV',
  destination: 'BER',
  departureDate: '2027-03-15',
  returnDate: '2027-03-22',
  adults: 1,
};

const com = skyscannerUrl(req);
const fr = skyscannerUrl(req, 'www.skyscanner.fr');

if (!com.includes('/flights/tlv/ber/270315/270322/')) {
  throw new Error(`unexpected .com url: ${com}`);
}
if (!fr.includes('/vols/tlv/ber/270315/270322/')) {
  throw new Error(`unexpected .fr url: ${fr}`);
}
if (flightsSegmentForHost('www.skyscanner.de') !== 'fluege') {
  throw new Error('de segment');
}
if (!urlMissingSearchDates('https://www.skyscanner.fr/transport/vols/tlv/ber/?oym=2611')) {
  throw new Error('expected missing dates');
}
if (urlMissingSearchDates(fr)) {
  throw new Error('fr dated should not be missing');
}

console.log('skyscanner url helpers ok');
