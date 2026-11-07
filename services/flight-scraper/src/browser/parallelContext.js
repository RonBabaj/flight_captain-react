'use strict';

/**
 * While a multi-site scrape holds one CDP connection, site scrapers open pages
 * via this hook instead of connectOverCDP (which would race / close siblings).
 */
let openPageHook = null;

function runWithOpenPage(openPage, fn) {
  const prev = openPageHook;
  openPageHook = openPage;
  return Promise.resolve()
    .then(fn)
    .finally(() => {
      openPageHook = prev;
    });
}

function getOpenPageHook() {
  return openPageHook;
}

module.exports = { runWithOpenPage, getOpenPageHook };
