#!/usr/bin/env bash
# Idempotent Fly-Fix flight-search stack on the VPS: proxy forwarder, headed Chrome CDP,
# optional VNC, and docker compose services. Safe to run after apt upgrade, reboot, or deploy.
set -euo pipefail

APP_ROOT="${APP_ROOT:-/opt/apps/flight_captain-react}"
ENV_FILE="${FLIGHT_ENV_FILE:-$APP_ROOT/backend/.env}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LOG_TAG="ensure-flight-stack"

log() { echo "[$LOG_TAG] $*"; }

if [ ! -d "$APP_ROOT" ]; then
  log "ERROR: APP_ROOT missing: $APP_ROOT"
  exit 1
fi

cd "$APP_ROOT"

load_env() {
  if [ ! -f "$ENV_FILE" ]; then
    return 0
  fi
  set -a
  # shellcheck disable=SC1090
  source <(
    grep -E '^(SCRAPER_PROXY_URL|FLIGHT_VNC_PASSWORD|FLIGHT_CHROME_PROXY_LOCAL_PORT)=' "$ENV_FILE" | sed 's/\r$//'
  )
  set +a
  export FLIGHT_VNC_PASSWORD
}

load_env

log "proxy forwarder"
sudo -E "$SCRIPT_DIR/ensure-scraper-proxy-forwarder.sh" || true

log "flight Chrome (CDP :9223 / gateway :9224)"
sudo "$SCRIPT_DIR/ensure-flight-chrome.sh"

if [ "${FLIGHT_VNC_ENABLE:-1}" != "0" ]; then
  log "VNC :5900 on localhost (SSH tunnel)"
  sudo -E "$SCRIPT_DIR/ensure-flight-vnc.sh" || true
fi

log "docker compose (api, scraper, frontend)"
docker compose up -d flyfix-api flight-scraper flyfix-frontend 2>/dev/null || docker compose up -d

# Best-effort smoke (do not fail the unit if one check flakes)
if curl -sf --max-time 5 -x "http://127.0.0.1:${FLIGHT_CHROME_PROXY_LOCAL_PORT:-18118}" \
  https://api.ipify.org?format=json >/dev/null 2>&1; then
  log "OK: residential proxy egress"
else
  log "WARN: proxy loopback check failed (SCRAPER_PROXY_URL / forwarder)"
fi

PROXY_GW="$(docker network inspect proxy --format '{{range .IPAM.Config}}{{.Gateway}}{{end}}' 2>/dev/null || true)"
CDP_GW="${SCRAPER_CDP_URLS:-http://172.16.2.1:9224}"
CDP_GW="${CDP_GW%% *}"
CDP_GW="${CDP_GW#http://}"
CDP_GW="${CDP_GW#https://}"
CDP_HOST="${CDP_GW%%:*}"
if [ -n "$PROXY_GW" ]; then
  CDP_HOST="${PROXY_GW}"
fi
if curl -sf --max-time 3 "http://${CDP_HOST}:9224/json/version" >/dev/null 2>&1; then
  log "OK: flight CDP gateway"
else
  log "WARN: CDP gateway not reachable at ${CDP_HOST}:9224"
fi

log "done"