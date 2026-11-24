'use strict';

const fs = require('fs');
const path = require('path');

/**
 * Ask the host flight-chrome-watchdog to recycle CDP when connectOverCDP fails.
 * Path is a bind-mount shared with the VPS (/var/lib/flight-scraper).
 */
function healRequestPath() {
  return (
    process.env.SCRAPER_CDP_HEAL_REQUEST ||
    process.env.FLIGHT_CDP_HEAL_REQUEST ||
    '/var/lib/flight-scraper/cdp-heal-request'
  );
}

function busyFlagPath() {
  return (
    process.env.SCRAPER_SEARCH_BUSY_FLAG ||
    process.env.FLIGHT_SEARCH_BUSY_FLAG ||
    '/var/lib/flight-scraper/search-busy'
  );
}

function requestCdpHeal(reason = '') {
  const file = healRequestPath();
  try {
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(
      file,
      `${new Date().toISOString()} ${String(reason || 'cdp_fail').slice(0, 200)}\n`,
      'utf8',
    );
    console.warn(`[flight-scraper] CDP heal requested reason=${String(reason).slice(0, 120)}`);
  } catch (err) {
    console.warn(
      `[flight-scraper] CDP heal request failed: ${String(err.message || err).slice(0, 120)}`,
    );
  }
}

function setSearchBusyFlag(busy) {
  const file = busyFlagPath();
  try {
    fs.mkdirSync(path.dirname(file), { recursive: true });
    if (busy) {
      fs.writeFileSync(file, `${Date.now()}\n`, 'utf8');
    } else {
      fs.unlinkSync(file);
    }
  } catch {
    // Host mount may be missing in local/dev — ignore.
  }
}

function chromeRestartedAtPath() {
  return (
    process.env.SCRAPER_CHROME_RESTARTED_AT ||
    process.env.FLIGHT_CHROME_RESTARTED_AT ||
    '/var/lib/flight-scraper/chrome-restarted-at'
  );
}

/** True when host watchdog restarted Chrome recently (cold session → PX risk). */
function chromeRecentlyRestarted(withinMs = 15 * 60 * 1000) {
  try {
    const raw = fs.readFileSync(chromeRestartedAtPath(), 'utf8').trim();
    const ts = Date.parse(raw) || Number(raw) || 0;
    if (!ts) return false;
    return Date.now() - ts < withinMs;
  } catch {
    return false;
  }
}

module.exports = {
  requestCdpHeal,
  setSearchBusyFlag,
  healRequestPath,
  busyFlagPath,
  chromeRecentlyRestarted,
  chromeRestartedAtPath,
};
