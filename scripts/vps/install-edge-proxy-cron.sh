#!/usr/bin/env bash
# Install systemd timer to re-check NPM every 15 minutes (cert renewal + crash recovery).
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
EOF

cat >/etc/systemd/system/ensure-edge-proxy.timer <<'EOF'
[Unit]
Description=Periodic edge proxy health check

[Timer]
OnBootSec=2min
OnUnitActiveSec=15min
Persistent=true

[Install]
WantedBy=timers.target
EOF

systemctl daemon-reload
systemctl enable --now ensure-edge-proxy.timer
systemctl start ensure-edge-proxy.service

echo "Installed ensure-edge-proxy.timer (every 15m + 2m after boot)."
