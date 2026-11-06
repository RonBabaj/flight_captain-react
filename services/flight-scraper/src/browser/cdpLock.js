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

module.exports = { withCdpLock, cdpLockBusy };
