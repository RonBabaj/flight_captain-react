'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const {
  urlIsCaptchaHardWall,
  urlLooksLikeSkyResults,
  textLooksLikePxChallenge,
} = require('./browser/botWall');

test('hard wall URLs', () => {
  assert.equal(
    urlIsCaptchaHardWall('https://www.skyscanner.fr/sttc/px/captcha-v2/index.html?url=Lw=='),
    true,
  );
  assert.equal(
    urlLooksLikeSkyResults('https://www.skyscanner.fr/sttc/px/captcha-v2/index.html'),
    false,
  );
});

test('results URL is not a hard wall', () => {
  const u =
    'https://www.skyscanner.fr/transport/vols/tlv/vie/261210/261217/?adultsv2=1&cabinclass=economy&rtn=1';
  assert.equal(urlIsCaptchaHardWall(u), false);
  assert.equal(urlLooksLikeSkyResults(u), true);
});

test('challenge copy detection', () => {
  assert.equal(textLooksLikePxChallenge('Please Press & Hold to confirm'), true);
  assert.equal(textLooksLikePxChallenge('Appuyer et maintenir'), true);
  assert.equal(textLooksLikePxChallenge('Vols Tel-Aviv – Vienne pas chers'), false);
});