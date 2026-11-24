'use strict';

/**
 * Serialize all CDP work (warm + scrapes). Concurrent connectOverCDP clients on the
 * same headed Chrome close each other's pages → "Target page has been closed".
 */
let chain = Promise.resolve();
let depth = 0;

function withCdpLock(fn) {
  const run = chain.then(async () => {
    depth += 1;
    try {
      return await fn();
    } finally {
      depth -= 1;
    }
  });
  // Keep the queue alive even if a task rejects.
  chain = run.then(
    () => undefined,
    () => undefined,
  );
  return run;
}

function cdpLockBusy() {
  return depth > 0;
}

/**
 * Drop the queue after a timed-out scrape. Orphaned CDP tasks can keep holding
 * the lock forever (site budget Promise.race does not cancel Playwright work),
 * which makes every later Sky/Kiwi search return 0 via "site time budget exceeded".
 */
function resetCdpLock(reason = '') {
  if (depth > 0 || reason) {
    console.warn(
      `[flight-scraper] CDP lock reset depth=${depth}${reason ? ` reason=${reason}` : ''}`,
    );
  }
  chain = Promise.resolve();
  depth = 0;
}

module.exports = { withCdpLock, cdpLockBusy, resetCdpLock };
