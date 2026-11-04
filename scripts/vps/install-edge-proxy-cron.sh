#!/usr/bin/env bash
# Install systemd service (boot) + timer (every 5 min) for nginx-proxy-manager edge guard.
set -euo pipefail

SCRIPT_SRC="$(cd "$(dirname "$0")" && pwd)/ensure-edge-proxy.sh"
SCRIPT_DST="/usr/local/bin/ensure-edge-proxy.sh"

if [[ "$(id -u)" -ne 0 ]]; then
  echo "Run as root: sudo $0"
  exit 1
fi

install -m 0755 "$SCRIPT_SRC" "$SCRIPT_DST"

cat >/etc/systemd/system/ensure-edge-proxy.service <<'EOF'
[Unit]
Description=Ensure nginx-proxy-manager edge proxy is up
After=docker.service network-online.target
Wants=network-online.target

[Service]
Type=oneshot
ExecStart=/usr/local/bin/ensure-edge-proxy.sh

[Install]
WantedBy=multi-user.target
EOF

cat >/etc/systemd/system/ensure-edge-proxy.timer <<'EOF'
[Unit]
Description=Periodic edge proxy health check

[Timer]
OnBootSec=90sec
OnUnitActiveSec=5min
Persistent=true

[Install]
WantedBy=timers.target
EOF

systemctl daemon-reload
systemctl enable ensure-edge-proxy.service
systemctl enable --now ensure-edge-proxy.timer
systemctl start ensure-edge-proxy.service

echo "Installed ensure-edge-proxy.service (boot) + timer (every 5m, first run 90s after boot)."
