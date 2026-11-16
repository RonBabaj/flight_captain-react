#!/usr/bin/env bash
# Local HTTP proxy on loopback so flight Chrome can use --proxy-server without embedding
# credentials (Chrome does not handle user:pass in --proxy-server reliably).
#
# Upstream: SCRAPER_PROXY_URL from backend/.env (residential EU sticky URL from your provider).
# Downstream: http://127.0.0.1:FLIGHT_CHROME_PROXY_LOCAL_PORT (default 18118) → flight Chrome.
set -euo pipefail

LOCAL_PORT="${FLIGHT_CHROME_PROXY_LOCAL_PORT:-18118}"
UPSTREAM="${SCRAPER_PROXY_URL:-}"
LOG_TAG="scraper-proxy-forwarder"

log() { echo "[$LOG_TAG] $*"; }

if [ -z "$UPSTREAM" ]; then
  log "SCRAPER_PROXY_URL unset — nothing to forward"
  exit 0
fi

if ! [[ "$UPSTREAM" =~ ^https?:// ]]; then
  log "ERROR: SCRAPER_PROXY_URL must be http(s)://..."
  exit 1
fi

if docker ps --format '{{.Names}}' | grep -qx scraper-proxy-forwarder; then
  log "OK: scraper-proxy-forwarder already running"
  exit 0
fi

if ! docker image inspect ghcr.io/go-gost/gost:latest >/dev/null 2>&1; then
  log "Pulling gost image..."
  docker pull ghcr.io/go-gost/gost:latest
fi

log "Starting forwarder 127.0.0.1:${LOCAL_PORT} → upstream (residential)"
docker rm -f scraper-proxy-forwarder 2>/dev/null || true
docker run -d --name scraper-proxy-forwarder --restart unless-stopped \
  -p "127.0.0.1:${LOCAL_PORT}:8080" \
  ghcr.io/go-gost/gost:latest \
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