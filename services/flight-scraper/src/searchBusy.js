'use strict';

/** True while /v1/search is running — warm must not steal the CDP lock. */
let busy = 0;

function beginSearch() {
  busy += 1;
}

function endSearch() {
  busy = Math.max(0, busy - 1);
}

function isSearchBusy() {
  return busy > 0;
}

module.exports = { beginSearch, endSearch, isSearchBusy };
