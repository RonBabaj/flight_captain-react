#!/usr/bin/env bash
# Headed Google Chrome on the VPS X display (:99) for Playwright CDP scraping.
# Shares the same virtual desktop as apartment-monitor (real Chrome, not Playwright bundled).
#
# Port map (important):
#   - Chrome listens on 127.0.0.1:FLIGHT_CHROME_DEBUG_PORT (default 9223)
#   - apartment-monitor-cdp-proxy owns compose-gateway:9223 → Facebook Chrome :9222
#   - This script publishes flight Chrome on compose-gateway:FLIGHT_CHROME_GATEWAY_PORT
#     (default 9224) via socat so Docker scrapers do not hit the Facebook profile.
set -euo pipefail

DISPLAY="${FB_HEADLESS_DISPLAY:-:99}"
export DISPLAY=":${DISPLAY#:}"
PORT="${FLIGHT_CHROME_DEBUG_PORT:-9223}"
GATEWAY_PORT="${FLIGHT_CHROME_GATEWAY_PORT:-9224}"
PROFILE="${FLIGHT_CHROME_PROFILE_DIR:-/var/lib/flight-scraper-chrome}"
USER_RUN="${FLIGHT_CHROME_USER:-fbmonitor}"
LOG_TAG="ensure-flight-chrome"

log() { echo "[$LOG_TAG] $*"; }

ensure_gateway_proxy() {
  local gw="$1"
  if [ -z "$gw" ]; then
    log "WARN: no proxy network gateway — containers may not reach flight CDP"
    return 0
  fi
  if [ "$GATEWAY_PORT" = "9223" ]; then
    log "ERROR: FLIGHT_CHROME_GATEWAY_PORT=9223 conflicts with apartment-monitor-cdp-proxy"
    return 1
  fi

  # If something already answers on the gateway port, accept it when healthy.
  if curl -sf --max-time 2 "http://${gw}:${GATEWAY_PORT}/json/version" >/dev/null 2>&1; then
    log "OK: gateway CDP proxy already on ${gw}:${GATEWAY_PORT} → 127.0.0.1:${PORT}"
    return 0
  fi

  # Drop stale socat listeners on the flight gateway port only.
  local pids
  pids="$(ss -ltnp 2>/dev/null | awk -v p=":${GATEWAY_PORT}" '$4 ~ p {print}' | sed -n 's/.*pid=\([0-9]*\).*/\1/p' | sort -u)"
  for pid in $pids; do
    if [ -n "$pid" ] && tr '\0' ' ' <"/proc/${pid}/cmdline" 2>/dev/null | grep -q socat; then
      log "replacing stale socat pid=${pid} on ${gw}:${GATEWAY_PORT}"
      sudo kill "$pid" 2>/dev/null || true
    fi
  done
  sleep 0.5

  sudo touch /var/log/flight-chrome-socat.log
  log "Starting socat ${gw}:${GATEWAY_PORT} → 127.0.0.1:${PORT}"
  sudo sh -c "nohup socat TCP-LISTEN:${GATEWAY_PORT},bind=${gw},reuseaddr,fork TCP:127.0.0.1:${PORT} >>/var/log/flight-chrome-socat.log 2>&1 &"
  sleep 1
  # Compose network → host gateway is filtered by UFW (9223 already allowed for apartment).
  if command -v ufw >/dev/null 2>&1; then
    if ! sudo ufw status 2>/dev/null | grep -q "${GATEWAY_PORT}/tcp"; then
      log "allowing ${gw%.*}.0/24 → :${GATEWAY_PORT} in UFW"
      sudo ufw allow from 172.16.2.0/24 to any port "${GATEWAY_PORT}" proto tcp comment "flight-scraper CDP" || true
    fi
  fi
  if curl -sf --max-time 2 "http://${gw}:${GATEWAY_PORT}/json/version" >/dev/null 2>&1; then
    log "OK: containers should use http://${gw}:${GATEWAY_PORT} for flight CDP"
  else
    log "WARN: gateway proxy on ${gw}:${GATEWAY_PORT} not reachable yet"
  fi
}

PROXY_GW="$(docker network inspect proxy --format '{{range .IPAM.Config}}{{.Gateway}}{{end}}' 2>/dev/null || true)"

if curl -sf "http://127.0.0.1:${PORT}/json/version" >/dev/null 2>&1; then
  log "OK: Chrome CDP already listening on ${PORT} (DISPLAY=${DISPLAY})"
  ensure_gateway_proxy "$PROXY_GW"
  exit 0
fi

if ! [ -S "/tmp/.X11-unix/X${DISPLAY#:}" ]; then
  log "ERROR: X display ${DISPLAY} not found (/tmp/.X11-unix/X${DISPLAY#:})"
  exit 1
fi

sudo mkdir -p "$PROFILE"
sudo chown -R "$USER_RUN:$USER_RUN" "$PROFILE"
sudo touch /var/log/flight-chrome.log /var/log/flight-chrome-socat.log
sudo chown "$USER_RUN:$USER_RUN" /var/log/flight-chrome.log 2>/dev/null || true

# Chrome CDP binds loopback on modern builds; Docker reachability is via socat on GATEWAY_PORT.
log "Starting Google Chrome on DISPLAY=${DISPLAY} port=${PORT} profile=${PROFILE}"
sudo -u "$USER_RUN" env DISPLAY="$DISPLAY" nohup google-chrome-stable \
  --remote-debugging-port="${PORT}" \
  --remote-debugging-address=127.0.0.1 \
  --user-data-dir="${PROFILE}" \
  --no-first-run \
  --no-default-browser-check \
  --disable-dev-shm-usage \
  --disable-extensions \
  --disable-background-networking \
  --disable-features=IsolateOrigins,site-per-process,ServiceWorker,InterestCohortAPI \
  --disable-blink-features=AutomationControlled \
  --window-size=1400,900 \
  about:blank \
  >>"/var/log/flight-chrome.log" 2>&1 &

for _ in $(seq 1 30); do
  if curl -sf "http://127.0.0.1:${PORT}/json/version" >/dev/null 2>&1; then
    log "OK: Chrome CDP ready on ${PORT}"
    ensure_gateway_proxy "$PROXY_GW"
    exit 0
  fi
  sleep 1
done

log "ERROR: Chrome did not open CDP on ${PORT} within 30s (see /var/log/flight-chrome.log)"
exit 1
