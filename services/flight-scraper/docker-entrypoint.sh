#!/bin/sh
set -eu
# Docker `host-gateway` is docker0; Chrome CDP is reachable on this compose
# network's bridge gateway (e.g. proxy → 172.16.2.1). Prefer that when unset.
# Port 9224 = dedicated flight Chrome (9223 on the gateway is apartment-monitor → Facebook).
CDP_PORT="${FLIGHT_CHROME_GATEWAY_PORT:-9224}"
if [ "$CDP_PORT" = "9223" ]; then
  # Refuse apartment conflict even if misconfigured.
  CDP_PORT=9224
fi

# Hard rule: gateway :9223 is Facebook Chrome. Rewrite even when `ip` is missing
# from the image (common on slim Node images).
if [ -n "${SCRAPER_CDP_URLS:-}" ] && echo "${SCRAPER_CDP_URLS}" | grep -qE ':9223([/,[:space:]]|$)'; then
  SCRAPER_CDP_URLS="$(printf '%s' "$SCRAPER_CDP_URLS" | sed -E 's/:9223([/,[:space:]]|$)/:9224\1/g')"
  export SCRAPER_CDP_URLS
  echo "[flight-scraper] rewrote CDP :9223 → :9224 → ${SCRAPER_CDP_URLS}"
fi

if [ -z "${SCRAPER_CDP_URLS:-}" ] || echo "${SCRAPER_CDP_URLS}" | grep -qE 'host\.docker\.internal'; then
  GW=""
  if command -v ip >/dev/null 2>&1; then
    GW="$(ip route 2>/dev/null | awk '/default/ {print $3; exit}')"
  fi
  if [ -z "$GW" ] && [ -r /etc/resolv.conf ]; then
    # Fallback: first nameserver is often the bridge gateway in Docker.
    GW="$(awk '/^nameserver / {print $2; exit}' /etc/resolv.conf)"
  fi
  if [ -n "$GW" ]; then
    export SCRAPER_CDP_URLS="http://${GW}:${CDP_PORT}"
    echo "[flight-scraper] SCRAPER_CDP_URLS=${SCRAPER_CDP_URLS}"
  fi
fi
exec node src/server.js
