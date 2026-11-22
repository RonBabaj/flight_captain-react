#!/usr/bin/env bash
# Probe RapidAPI google-flights2 from the VPS (uses backend/.env). Safe to log headers; never print the API key.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
ENV_FILE="${GF2_ENV_FILE:-$ROOT/backend/.env}"
if [[ ! -f "$ENV_FILE" ]]; then
  echo "Missing $ENV_FILE — run on the VPS or set GF2_ENV_FILE"
  exit 1
fi
set -a
# shellcheck disable=SC1090
source "$ENV_FILE"
set +a
KEY="${GOOGLEFLIGHTS2_RAPIDAPI_KEY:-}"
HOST="${GOOGLEFLIGHTS2_RAPIDAPI_HOST:-google-flights2.p.rapidapi.com}"
PATH_PART="${GOOGLEFLIGHTS2_ENDPOINT_PATH:-/api/v1/searchFlights}"
if [[ -z "$KEY" ]]; then
  echo "GOOGLEFLIGHTS2_RAPIDAPI_KEY is empty in $ENV_FILE"
  exit 1
fi
ORIGIN="${1:-TLV}"
DEST="${2:-JFK}"
DATE="${3:-2026-06-15}"
URL="https://${HOST}${PATH_PART}?departure_id=${ORIGIN}&arrival_id=${DEST}&outbound_date=${DATE}&travel_class=ECONOMY&adults=1&currency=USD&language_code=en-US&country_code=US&show_hidden=1"
HDR="$(mktemp)"
BODY="$(mktemp)"
trap 'rm -f "$HDR" "$BODY"' EXIT
HTTP_CODE=$(curl -sS -o "$BODY" -D "$HDR" -w '%{http_code}' \
  -H "x-rapidapi-key: ${KEY}" \
  -H "x-rapidapi-host: ${HOST}" \
  "$URL")
echo "HTTP $HTTP_CODE"
grep -iE '^(x-ratelimit|x-rate-limit|retry-after)' "$HDR" || true
echo "--- body (first 500 chars) ---"
head -c 500 "$BODY"
echo ""
if [[ "$HTTP_CODE" == "402" || "$HTTP_CODE" == "403" || "$HTTP_CODE" == "429" ]]; then
  echo "LIKELY RAPIDAPI BILLING / QUOTA ISSUE"
  exit 2
fi
if grep -qiE 'quota|subscription|exceeded|payment required' "$BODY"; then
  echo "BODY SUGGESTS QUOTA OR SUBSCRIPTION LIMIT"
  exit 2
fi
echo "OK (no obvious quota error — if body has no itineraries, check parser or plan limits in RapidAPI dashboard)"