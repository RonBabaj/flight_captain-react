#!/usr/bin/env bash
# Restore flight scraper desktop stack after kernel reboot.
set -euo pipefail
APP="${APP_ROOT:-/opt/apps/flight_captain-react}"
ENV_FILE="${FLIGHT_ENV_FILE:-$APP/backend/.env}"
cd "$APP"
set -a
# shellcheck disable=SC1090
[ -f "$ENV_FILE" ] && source <(grep -E '^(SCRAPER_PROXY_URL|FLIGHT_VNC_PASSWORD|FLIGHT_CHROME_PROXY_LOCAL_PORT)=' "$ENV_FILE" | sed 's/\r$//')
set +a
export FLIGHT_VNC_PASSWORD
sudo -E scripts/vps/ensure-scraper-proxy-forwarder.sh || true
sudo scripts/vps/ensure-flight-chrome.sh
sudo -E scripts/vps/ensure-flight-vnc.sh || true
docker compose up -d flyfix-api flight-scraper flyfix-frontend 2>/dev/null || docker compose up -d
echo "[after-reboot-flight] done"