#!/usr/bin/env bash
# Headed Google Chrome on the VPS X display (:99) for Playwright CDP scraping.
# Shares the same virtual desktop as apartment-monitor (real Chrome, not Playwright bundled).
set -euo pipefail

DISPLAY="${FB_HEADLESS_DISPLAY:-:99}"
export DISPLAY=":${DISPLAY#:}"
PORT="${FLIGHT_CHROME_DEBUG_PORT:-9223}"
PROFILE="${FLIGHT_CHROME_PROFILE_DIR:-/var/lib/flight-scraper-chrome}"
USER_RUN="${FLIGHT_CHROME_USER:-fbmonitor}"
LOG_TAG="ensure-flight-chrome"

log() { echo "[$LOG_TAG] $*"; }

if curl -sf "http://127.0.0.1:${PORT}/json/version" >/dev/null 2>&1; then
  log "OK: Chrome CDP already listening on ${PORT} (DISPLAY=${DISPLAY})"
  exit 0
fi

if ! [ -S "/tmp/.X11-unix/X${DISPLAY#:}" ]; then
  log "ERROR: X display ${DISPLAY} not found (/tmp/.X11-unix/X${DISPLAY#:})"
  exit 1
fi

sudo mkdir -p "$PROFILE"
sudo chown -R "$USER_RUN:$USER_RUN" "$PROFILE"

log "Starting Google Chrome on DISPLAY=${DISPLAY} port=${PORT} profile=${PROFILE}"
sudo -u "$USER_RUN" env DISPLAY="$DISPLAY" nohup google-chrome-stable \
  --remote-debugging-port="${PORT}" \
  --remote-debugging-address=0.0.0.0 \
  --user-data-dir="${PROFILE}" \
  --no-first-run \
  --no-default-browser-check \
  --disable-dev-shm-usage \
  --window-size=1400,900 \
  about:blank \
  >>"/var/log/flight-chrome.log" 2>&1 &

for _ in $(seq 1 30); do
  if curl -sf "http://127.0.0.1:${PORT}/json/version" >/dev/null 2>&1; then
    log "OK: Chrome CDP ready on ${PORT}"
    exit 0
  fi
  sleep 1
done

log "ERROR: Chrome did not open CDP on ${PORT} within 30s (see /var/log/flight-chrome.log)"
exit 1
