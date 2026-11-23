#!/usr/bin/env bash
# Install systemd oneshot + timer so flight proxy, Chrome CDP, VNC, and docker compose
# come back after reboot and self-heal every few minutes.
set -euo pipefail

APP_ROOT="${APP_ROOT:-/opt/apps/flight_captain-react}"
STACK_SCRIPT="$APP_ROOT/scripts/vps/ensure-flight-stack.sh"

if [[ "$(id -u)" -ne 0 ]]; then
  echo "Run as root: sudo $0"
  exit 1
fi

if [ ! -x "$STACK_SCRIPT" ]; then
  echo "Missing or not executable: $STACK_SCRIPT"
  exit 1
fi

chmod +x "$APP_ROOT"/scripts/vps/ensure-flight-stack.sh \
  "$APP_ROOT"/scripts/vps/ensure-flight-chrome.sh \
  "$APP_ROOT"/scripts/vps/ensure-scraper-proxy-forwarder.sh \
  "$APP_ROOT"/scripts/vps/ensure-flight-vnc.sh 2>/dev/null || true

cat >/etc/systemd/system/fly-fix-flight-stack.service <<EOF
[Unit]
Description=Fly-Fix flight scraper stack (proxy, Chrome CDP, VNC, compose)
After=docker.service network-online.target
Wants=network-online.target
# Apartment / Xvfb :99 often starts in the same boot wave
After=apartment-monitor.service
ConditionPathExists=$APP_ROOT/docker-compose.yml

[Service]
Type=oneshot
Environment=APP_ROOT=$APP_ROOT
Environment=FLIGHT_VNC_ENABLE=1
ExecStart=$STACK_SCRIPT
RemainAfterExit=yes
TimeoutStartSec=300

[Install]
WantedBy=multi-user.target
EOF

cat >/etc/systemd/system/fly-fix-flight-stack.timer <<'EOF'
[Unit]
Description=Periodic Fly-Fix flight stack health pass

[Timer]
OnBootSec=120sec
OnUnitActiveSec=5min
Persistent=true

[Install]
WantedBy=timers.target
EOF

systemctl daemon-reload
systemctl enable fly-fix-flight-stack.service
systemctl enable --now fly-fix-flight-stack.timer
systemctl start fly-fix-flight-stack.service

echo "OK: fly-fix-flight-stack.service + timer enabled"
echo "  sudo systemctl status fly-fix-flight-stack.service"
echo "  sudo journalctl -u fly-fix-flight-stack.service -n 30"