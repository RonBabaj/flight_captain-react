#!/bin/sh
set -eu
# Docker `host-gateway` is docker0; Chrome CDP is reachable on this compose
# network's bridge gateway (e.g. proxy → 172.16.2.1). Prefer that when unset.
# Port 9224 = dedicated flight Chrome (9223 on the gateway is apartment-monitor → Facebook).
CDP_PORT="${FLIGHT_CHROME_DEBUG_PORT:-9224}"
if [ -z "${SCRAPER_CDP_URLS:-}" ] || echo "${SCRAPER_CDP_URLS}" | grep -qE 'host\.docker\.internal|:9223'; then
  GW="$(ip route 2>/dev/null | awk '/default/ {print $3; exit}')"
  if [ -n "$GW" ]; then
    export SCRAPER_CDP_URLS="http://${GW}:${CDP_PORT}"
    echo "[flight-scraper] SCRAPER_CDP_URLS=${SCRAPER_CDP_URLS}"
  fi
fi
exec node src/server.js
