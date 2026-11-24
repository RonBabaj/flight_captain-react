#!/usr/bin/env bash
# Install always-on flight Chrome CDP watchdog (daemon).
set -euo pipefail

APP_ROOT="${APP_ROOT:-/opt/apps/flight_captain-react}"
SRC="$APP_ROOT/scripts/vps/flight-chrome-watchdog.sh"
DEST=/usr/local/bin/flight-chrome-watchdog.sh
STATE_DIR=/var/lib/flight-scraper

if [[ "$(id -u)" -ne 0 ]]; then
  echo "Run as root: sudo $0"
  exit 1
fi

if [[ ! -f "$SRC" ]]; then
  echo "Missing: $SRC"
  exit 1
fi

install -m 0755 "$SRC" "$DEST"
mkdir -p "$STATE_DIR"
chown deploy:deploy "$STATE_DIR" 2>/dev/null || true
touch /var/log/flight-chrome-watchdog.log
chmod 0644 /var/log/flight-chrome-watchdog.log

# Keep ensure script executable for the watchdog.
chmod +x "$APP_ROOT"/scripts/vps/ensure-flight-chrome.sh \
  "$APP_ROOT"/scripts/vps/ensure-scraper-proxy-forwarder.sh 2>/dev/null || true

cat >/etc/systemd/system/flyfix-flight-chrome-watchdog.service <<EOF
[Unit]
Description=Fly-Fix flight Chrome CDP watchdog (always on)
After=network-online.target docker.service
Wants=network-online.target
ConditionPathExists=$APP_ROOT/scripts/vps/ensure-flight-chrome.sh

[Service]
Type=simple
Environment=APP_ROOT=$APP_ROOT
Environment=FLIGHT_CHROME_WATCHDOG_INTERVAL=30
Environment=FLIGHT_CHROME_WATCHDOG_HEAL_COOLDOWN_S=60
Environment=FLIGHT_CHROME_WATCHDOG_RECYCLE_S=43200
Environment=FLIGHT_SCRAPER_STATE_DIR=$STATE_DIR
Environment=FLIGHT_CDP_HEAL_REQUEST=$STATE_DIR/cdp-heal-request
Environment=FLIGHT_SEARCH_BUSY_FLAG=$STATE_DIR/search-busy
ExecStart=$DEST daemon
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable --now flyfix-flight-chrome-watchdog.service
systemctl restart flyfix-flight-chrome-watchdog.service

echo "OK: flyfix-flight-chrome-watchdog.service enabled"
echo "  systemctl status flyfix-flight-chrome-watchdog.service"
echo "  journalctl -u flyfix-flight-chrome-watchdog.service -n 40 -f"
