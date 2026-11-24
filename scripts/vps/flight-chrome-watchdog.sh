#!/usr/bin/env bash
# Keep flight Chrome answering CDP on 127.0.0.1:9223 (+ gateway :9224 for Docker).
#
# Failure mode we hit in prod: Chrome dies or DevTools wedges → Playwright
# connectOverCDP ECONNRESET → Sky/Kiwi return 0 while GF2 still works.
#
#   flight-chrome-watchdog.sh once     # one-shot heal (deploy / manual)
#   flight-chrome-watchdog.sh daemon   # systemd Type=simple loop
set -euo pipefail

APP_ROOT="${APP_ROOT:-/opt/apps/flight_captain-react}"
ENSURE="${APP_ROOT}/scripts/vps/ensure-flight-chrome.sh"
PORT="${FLIGHT_CHROME_DEBUG_PORT:-9223}"
GATEWAY_PORT="${FLIGHT_CHROME_GATEWAY_PORT:-9224}"
PROFILE="${FLIGHT_CHROME_PROFILE_DIR:-/var/lib/flight-scraper-chrome}"
STATE_DIR="${FLIGHT_SCRAPER_STATE_DIR:-/var/lib/flight-scraper}"
HEAL_REQUEST="${FLIGHT_CDP_HEAL_REQUEST:-${STATE_DIR}/cdp-heal-request}"
BUSY_FLAG="${FLIGHT_SEARCH_BUSY_FLAG:-${STATE_DIR}/search-busy}"
INTERVAL="${FLIGHT_CHROME_WATCHDOG_INTERVAL:-30}"
HEAL_COOLDOWN_S="${FLIGHT_CHROME_WATCHDOG_HEAL_COOLDOWN_S:-120}"
RECYCLE_EVERY_S="${FLIGHT_CHROME_WATCHDOG_RECYCLE_S:-86400}"
LOG="${FLIGHT_CHROME_WATCHDOG_LOG:-/var/log/flight-chrome-watchdog.log}"
USER_RUN="${FLIGHT_CHROME_USER:-fbmonitor}"
RESTARTED_AT="${FLIGHT_CHROME_RESTARTED_AT:-${STATE_DIR}/chrome-restarted-at}"

LAST_HEAL_EPOCH=0
LAST_RECYCLE_EPOCH="$(date +%s)"

MODE="${1:-once}"
case "$MODE" in
  once | daemon) ;;
  -h | --help)
    echo "Usage: $0 [once|daemon]" >&2
    exit 0
    ;;
  *)
    echo "unknown mode: $MODE (use once|daemon)" >&2
    exit 2
    ;;
esac

mkdir -p "$STATE_DIR" 2>/dev/null || true
touch "$LOG" 2>/dev/null || LOG="/tmp/flight-chrome-watchdog.log"

log() {
  echo "$(date -Is) flight-chrome-watchdog: $*" | tee -a "$LOG" >/dev/null 2>&1 || \
    echo "$(date -Is) flight-chrome-watchdog: $*" >&2
}

proxy_gateway() {
  docker network inspect proxy --format '{{range .IPAM.Config}}{{.Gateway}}{{end}}' 2>/dev/null || true
}

cdp_http_ok() {
  curl -sf --max-time 3 "http://127.0.0.1:${PORT}/json/version" >/dev/null 2>&1 \
    && curl -sf --max-time 5 "http://127.0.0.1:${PORT}/json/list" >/dev/null 2>&1
}

gateway_ok() {
  local gw
  gw="$(proxy_gateway)"
  [[ -n "$gw" ]] || return 0
  curl -sf --max-time 3 "http://${gw}:${GATEWAY_PORT}/json/version" >/dev/null 2>&1
}

# Cheap stdlib WS handshake against the browser websocketDebuggerUrl.
cdp_ws_ok() {
  python3 - "$PORT" <<'PY' >/dev/null 2>&1
import json, sys, urllib.request
try:
    import websocket  # optional
except ImportError:
    websocket = None
port = sys.argv[1]
try:
    with urllib.request.urlopen(f"http://127.0.0.1:{port}/json/version", timeout=4) as r:
        data = json.load(r)
except Exception:
    sys.exit(1)
ws_url = data.get("webSocketDebuggerUrl") or ""
if not ws_url:
    sys.exit(1)
if websocket is None:
    # Fallback: TCP connect to WS port is enough when HTTP already works.
    import socket, urllib.parse
    u = urllib.parse.urlparse(ws_url)
    host = u.hostname or "127.0.0.1"
    p = u.port or 9223
    s = socket.create_connection((host, p), timeout=4)
    s.close()
    sys.exit(0)
try:
    ws = websocket.create_connection(ws_url, timeout=6)
    ws.close()
except Exception:
    sys.exit(1)
sys.exit(0)
PY
}

heal_requested() {
  [[ -f "$HEAL_REQUEST" ]]
}

consume_heal_request() {
  rm -f "$HEAL_REQUEST" 2>/dev/null || true
}

in_heal_cooldown() {
  local now
  now="$(date +%s)"
  (( now - LAST_HEAL_EPOCH < HEAL_COOLDOWN_S ))
}

search_busy() {
  [[ -f "$BUSY_FLAG" ]] || return 1
  local age
  age=$(( $(date +%s) - $(stat -c %Y "$BUSY_FLAG" 2>/dev/null || echo 0) ))
  # Ignore stale flags (>2h) so a crashed scraper cannot block forever.
  (( age >= 0 && age < 7200 ))
}

recycle_due() {
  local now
  now="$(date +%s)"
  (( RECYCLE_EVERY_S > 0 && now - LAST_RECYCLE_EPOCH >= RECYCLE_EVERY_S ))
}

kill_flight_chrome() {
  # Only the flight profile — never touch Facebook Chrome on :9222.
  pkill -f -- "--user-data-dir=${PROFILE}" 2>/dev/null || true
  pkill -f -- "--remote-debugging-port=${PORT}" 2>/dev/null || true
  sleep 1
}

mark_chrome_restarted() {
  mkdir -p "$(dirname "$RESTARTED_AT")" 2>/dev/null || true
  date -Is >"$RESTARTED_AT" 2>/dev/null || true
}

run_ensure() {
  if ! sudo -n "$ENSURE" 2>&1 | tee -a "$LOG" >/dev/null; then
    if ! "$ENSURE" 2>&1 | tee -a "$LOG" >/dev/null; then
      return 1
    fi
  fi
  return 0
}

# Soft path: Chrome still answering HTTP — only refresh gateway/socat. Never kill.
soft_heal_gateway() {
  log "soft heal (keep Chrome session) — refresh gateway only"
  run_ensure || true
  consume_heal_request
}

restart_chrome() {
  local reason="$1"
  local force="${2:-0}"

  # Never kill a live browser under an in-flight search — that re-triggers PerimeterX
  # and cascades ECONNRESET into the next site (Sky fail → heal → Kiwi reset).
  if search_busy; then
    log "skip restart (search busy) reason=${reason}"
    # Drop stale heal spam so we do not kill the moment search ends.
    if [[ "$reason" == "heal_request" ]]; then
      consume_heal_request
    fi
    return 0
  fi
  if in_heal_cooldown && [[ "$reason" != "down" ]]; then
    log "skip restart (cooldown) reason=${reason}"
    consume_heal_request
    return 0
  fi
  if [[ ! -x "$ENSURE" ]]; then
    log "ERROR: missing ensure script $ENSURE"
    return 1
  fi
  log "restarting flight Chrome reason=${reason} force=${force}"
  if [[ "$force" == "1" ]]; then
    kill_flight_chrome
  fi
  if ! run_ensure; then
    log "ERROR: ensure-flight-chrome failed"
    return 1
  fi
  LAST_HEAL_EPOCH="$(date +%s)"
  if [[ "$reason" == "recycle" ]]; then
    LAST_RECYCLE_EPOCH="$LAST_HEAL_EPOCH"
  fi
  consume_heal_request
  if cdp_http_ok; then
    mark_chrome_restarted
    log "OK: CDP up after ${reason}"
    return 0
  fi
  log "ERROR: CDP still down after ${reason}"
  return 1
}

check_once() {
  local http_ok=0
  local ws_ok=0
  cdp_http_ok && http_ok=1
  if (( http_ok )); then
    cdp_ws_ok && ws_ok=1
  fi

  # Gateway-only: Chrome alive, Docker path broken — never kill profile.
  if (( http_ok )) && ! gateway_ok; then
    soft_heal_gateway
  fi

  # Scraper heal spam while CDP is healthy = transient client disconnect, not a dead browser.
  # Killing here was re-arming PerimeterX on every auto-recovery.
  if heal_requested && (( http_ok )); then
    log "heal request ignored (CDP HTTP healthy) — keep signed-in session"
    consume_heal_request
  fi

  if ! (( http_ok )); then
    restart_chrome "down" 0 || true
    return 0
  fi

  if ! (( ws_ok )); then
    if search_busy; then
      log "WS wedge but search busy — defer kill"
    else
      restart_chrome "ws_wedge" 1 || true
    fi
    return 0
  fi

  if recycle_due && ! search_busy; then
    restart_chrome "recycle" 1 || true
  fi
}

if [[ "$MODE" == "once" ]]; then
  check_once
  exit 0
fi

log "daemon start interval=${INTERVAL}s port=${PORT} gateway=${GATEWAY_PORT}"
while true; do
  check_once || true
  sleep "$INTERVAL"
done
