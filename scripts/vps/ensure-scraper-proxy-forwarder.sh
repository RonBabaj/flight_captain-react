#!/usr/bin/env bash
# Local HTTP proxy on loopback so flight Chrome can use --proxy-server without embedding
# credentials (Chrome does not handle user:pass in --proxy-server reliably).
#
# Upstream: SCRAPER_PROXY_URL from backend/.env (residential EU sticky URL from your provider).
# Downstream: http://127.0.0.1:FLIGHT_CHROME_PROXY_LOCAL_PORT (default 18118) → flight Chrome.
set -euo pipefail

LOCAL_PORT="${FLIGHT_CHROME_PROXY_LOCAL_PORT:-18118}"
LOG_TAG="scraper-proxy-forwarder"
ENV_FILE="${FLIGHT_ENV_FILE:-/opt/apps/flight_captain-react/backend/.env}"

log() { echo "[$LOG_TAG] $*"; }

load_scraper_proxy_env() {
  if [ ! -f "$ENV_FILE" ]; then
    return 0
  fi
  set -a
  # shellcheck disable=SC1090
  source <(grep -E '^(SCRAPER_PROXY_URL|FLIGHT_CHROME_PROXY_LOCAL_PORT)=' "$ENV_FILE" | sed 's/\r$//')
  set +a
}

load_scraper_proxy_env
UPSTREAM="${SCRAPER_PROXY_URL:-}"

if [ -z "$UPSTREAM" ]; then
  log "SCRAPER_PROXY_URL unset — nothing to forward"
  exit 0
fi

if ! [[ "$UPSTREAM" =~ ^https?:// ]]; then
  log "ERROR: SCRAPER_PROXY_URL must be http(s)://..."
  exit 1
fi

if docker ps --format '{{.Names}}' | grep -qx scraper-proxy-forwarder; then
  if [ "${SCRAPER_PROXY_FORCE_RECREATE:-0}" != "1" ]; then
    log "OK: scraper-proxy-forwarder already running (set SCRAPER_PROXY_FORCE_RECREATE=1 to rotate upstream)"
    exit 0
  fi
  log "Recreating scraper-proxy-forwarder (SCRAPER_PROXY_FORCE_RECREATE=1)"
  docker rm -f scraper-proxy-forwarder 2>/dev/null || true
fi

GOST_IMAGE="${SCRAPER_GOST_IMAGE:-gogost/gost:latest}"

if ! docker image inspect "${GOST_IMAGE}" >/dev/null 2>&1; then
  log "Pulling gost image (${GOST_IMAGE})..."
  docker pull "${GOST_IMAGE}"
fi

log "Starting forwarder 127.0.0.1:${LOCAL_PORT} → upstream (residential)"
docker rm -f scraper-proxy-forwarder 2>/dev/null || true
docker run -d --name scraper-proxy-forwarder --restart unless-stopped \
  -p "127.0.0.1:${LOCAL_PORT}:8080" \
  "${GOST_IMAGE}" \
  -L "http://:8080" -F "${UPSTREAM}"

for _ in $(seq 1 15); do
  if curl -sf --max-time 2 -x "http://127.0.0.1:${LOCAL_PORT}" https://api.ipify.org?format=json >/dev/null 2>&1; then
    log "OK: forwarder listening on http://127.0.0.1:${LOCAL_PORT}"
    exit 0
  fi
  sleep 1
done

log "WARN: forwarder started but loopback check failed — verify SCRAPER_PROXY_URL"
exit 0