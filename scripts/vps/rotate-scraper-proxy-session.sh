#!/usr/bin/env bash
# Rotate iproyal-style sticky session on SCRAPER_PROXY_URL, recycle the forwarder, and restart
# flight Chrome so Skyscanner sees a fresh egress + clean browser after PerimeterX.
set -euo pipefail

APP_ROOT="${APP_ROOT:-/opt/apps/flight_captain-react}"
ENV_FILE="${FLIGHT_ENV_FILE:-$APP_ROOT/backend/.env}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if [ ! -f "$ENV_FILE" ]; then
  echo "[rotate-scraper-proxy] missing $ENV_FILE" >&2
  exit 1
fi

python3 <<PY
import re, secrets, pathlib, sys
path = pathlib.Path("$ENV_FILE")
text = path.read_text()
m = re.search(r'^SCRAPER_PROXY_URL=(.+)$', text, re.M)
if not m:
    sys.exit('SCRAPER_PROXY_URL missing')
url = m.group(1).strip()
mm = re.match(r'(https?://)([^:]+):([^@]+)@(.+)', url)
if not mm:
    sys.exit('SCRAPER_PROXY_URL must be http(s)://user:pass@host:port')
user = mm.group(2)
# ipRoyal sticky sessions use `_session-XXXXX_lifetime-30m` on the username — do not append blindly.
if '_session-' not in user:
    print(
        '[rotate-scraper-proxy] SKIP: proxy user has no _session- token; set sticky session in ipRoyal dashboard first',
        file=sys.stderr,
    )
    sys.exit(2)
sid = secrets.token_hex(6)
user = re.sub(r'_session-[^_]+', f'_session-{sid}', user)
new = f"{mm.group(1)}{user}:{mm.group(3)}@{mm.group(4)}"
text2 = re.sub(r'^SCRAPER_PROXY_URL=.*$', 'SCRAPER_PROXY_URL=' + new, text, flags=re.M)
path.write_text(text2)
print(f'[rotate-scraper-proxy] rotated _session-{sid} in backend/.env')
PY

export SCRAPER_PROXY_FORCE_RECREATE=1
sudo -E "$SCRIPT_DIR/ensure-scraper-proxy-forwarder.sh"

# Chrome reads proxy only at start — kill flight Chrome and relaunch.
CHROME_PORT="${FLIGHT_CHROME_DEBUG_PORT:-9223}"
if curl -sf --max-time 2 "http://127.0.0.1:${CHROME_PORT}/json/version" >/dev/null 2>&1; then
  sudo pkill -f "user-data-dir=/var/lib/flight-scraper-chrome" 2>/dev/null || true
  sleep 2
fi
sudo "$SCRIPT_DIR/ensure-flight-chrome.sh"

echo "[rotate-scraper-proxy] new egress:"
curl -sf --max-time 10 -x "http://127.0.0.1:${FLIGHT_CHROME_PROXY_LOCAL_PORT:-18118}" \
  https://api.ipify.org?format=json || true