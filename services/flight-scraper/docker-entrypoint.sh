#!/bin/sh
set -eu
# Docker `host-gateway` is docker0; Chrome CDP is reachable on this compose
# network's bridge gateway (e.g. proxy → 172.16.2.1). Prefer that when unset.
if [ -z "${SCRAPER_CDP_URLS:-}" ] || echo "${SCRAPER_CDP_URLS}" | grep -q host.docker.internal; then
  GW="$(ip route 2>/dev/null | awk '/default/ {print $3; exit}')"
  if [ -n "$GW" ]; then
    export SCRAPER_CDP_URLS="http://${GW}:9223"
    echo "[flight-scraper] SCRAPER_CDP_URLS=${SCRAPER_CDP_URLS}"
  fi
fi
exec node src/server.js
