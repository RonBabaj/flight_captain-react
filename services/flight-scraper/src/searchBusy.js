'use strict';

const { setSearchBusyFlag } = require('./browser/cdpHeal');

/** True while /v1/search is running — warm must not steal the CDP lock. */
let busy = 0;

function beginSearch() {
  busy += 1;
  setSearchBusyFlag(true);
}

function endSearch() {
  busy = Math.max(0, busy - 1);
  if (busy === 0) setSearchBusyFlag(false);
}

function isSearchBusy() {
  return busy > 0;
}

module.exports = { beginSearch, endSearch, isSearchBusy };
