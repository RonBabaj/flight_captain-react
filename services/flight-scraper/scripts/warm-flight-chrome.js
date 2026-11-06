'use strict';

/**
 * Pre-warm OTA homepages in headed Chrome CDP (cookie banners, session trust).
 * Prefer the in-process warm loop started by `src/server.js`; this CLI is for
 * manual VPS ops: node scripts/warm-flight-chrome.js
 */
const config = require('../src/config');
const { warmAll } = require('../src/warm');

warmAll(config)
  .then((status) => {
    console.log(JSON.stringify(status, null, 2));
    process.exit(status.ok ? 0 : 1);
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
