'use strict';

const DEFAULT_SKY_WARM =
  'https://www.skyscanner.fr/transport/vols/tlv/ber/261201/261208/?adultsv2=1&cabinclass=economy&rtn=1&preferdirects=false';

const KIWI_WARM = 'https://www.kiwi.com/en/';

function envTruthy(name, defaultOn) {
  const raw = process.env[name];
  if (raw === undefined || raw === '') return defaultOn;
  return raw === '1' || /^true$/i.test(raw);
}

function skyWarmUrl() {
  const raw = String(process.env.SCRAPER_SKY_WARM_URL || DEFAULT_SKY_WARM).trim();
  return raw || DEFAULT_SKY_WARM;
}

function warmLoopIncludesSky() {
  return envTruthy('SCRAPER_WARM_LOOP_SKY', false);
}

function warmStartupIncludesSky() {
  return envTruthy('SCRAPER_WARM_SKY_ON_START', false);
}

function buildWarmUrlsForPass({ startupWarmPass, skyscannerBlockedUntil, now = Date.now() }) {
  const urls = [KIWI_WARM];
  const skyUrl = skyWarmUrl();
  const skyCooling = skyscannerBlockedUntil > now;
  const includeSky =
    !skyCooling &&
    ((startupWarmPass && warmStartupIncludesSky()) || (!startupWarmPass && warmLoopIncludesSky()));
  if (includeSky) {
    urls.push(skyUrl);
  }
  return urls;
}

module.exports = {
  KIWI_WARM,
  buildWarmUrlsForPass,
  warmLoopIncludesSky,
  warmStartupIncludesSky,
  skyWarmUrl,
};