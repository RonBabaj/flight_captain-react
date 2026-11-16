#!/usr/bin/env bash
# Share Xvfb :99 (flight Chrome) over localhost:5900 for SSH-tunneled VNC clients.
# Run on the VPS as deploy (uses sudo -u fbmonitor).
set -euo pipefail

DISPLAY_NUM="${FB_HEADLESS_DISPLAY:-:99}"
DISPLAY_NUM="${DISPLAY_NUM#:}"
RFB_PORT="${FLIGHT_VNC_PORT:-5900}"
VNC_USER="${FLIGHT_CHROME_USER:-fbmonitor}"
AUTH_FILE="/home/${VNC_USER}/.vnc/flight-scraper.pass"
LOG_TAG="ensure-flight-vnc"

log() { echo "[$LOG_TAG] $*"; }

if ! command -v x11vnc >/dev/null; then
  log "Installing x11vnc..."
  sudo DEBIAN_FRONTEND=noninteractive apt-get install -y x11vnc
fi

if ! [ -S "/tmp/.X11-unix/X${DISPLAY_NUM}" ]; then
  log "ERROR: display :${DISPLAY_NUM} not running (start Xvfb / apartment stack first)"
  exit 1
fi

sudo mkdir -p "/home/${VNC_USER}/.vnc"
sudo chown "${VNC_USER}:${VNC_USER}" "/home/${VNC_USER}/.vnc"

if [ -n "${FLIGHT_VNC_PASSWORD:-}" ]; then
  log "Updating VNC password from FLIGHT_VNC_PASSWORD"
  echo "${FLIGHT_VNC_PASSWORD}" | sudo -u "${VNC_USER}" x11vnc -storepasswd "/dev/stdin" "${AUTH_FILE}" >/dev/null
elif [ ! -f "${AUTH_FILE}" ]; then
  FLIGHT_VNC_PASSWORD="$(openssl rand -base64 12 | tr -d '/+=' | head -c 12)"
  echo "${FLIGHT_VNC_PASSWORD}" | sudo -u "${VNC_USER}" x11vnc -storepasswd "/dev/stdin" "${AUTH_FILE}" >/dev/null
  log "Created VNC password (store in secrets): ${FLIGHT_VNC_PASSWORD}"
fi

sudo chmod 600 "${AUTH_FILE}"
sudo chown "${VNC_USER}:${VNC_USER}" "${AUTH_FILE}"

pkill -u "${VNC_USER}" -f "x11vnc.*:${DISPLAY_NUM}" 2>/dev/null || true
sleep 1

log "Starting x11vnc :${DISPLAY_NUM} on 127.0.0.1:${RFB_PORT} (SSH tunnel required)"
sudo -u "${VNC_USER}" nohup x11vnc \
  -display ":${DISPLAY_NUM}" \
  -rfbport "${RFB_PORT}" \
  -localhost \
  -forever \
  -shared \
  -nowf \
  -rfbauth "${AUTH_FILE}" \
  -noxdamage \
  >>"/home/${VNC_USER}/.vnc/x11vnc.log" 2>&1 &

for _ in $(seq 1 10); do
  if ss -ltn | grep -q "127.0.0.1:${RFB_PORT}"; then
    log "OK: connect from your Mac with:"
    log "  ssh -N -L 5900:127.0.0.1:5900 YOUR_USER@YOUR_VPS"
    log "  open vnc://127.0.0.1:5900"
    log "  password: ${AUTH_FILE} or FLIGHT_VNC_PASSWORD in backend/.env"
    exit 0
  fi
  sleep 0.5
done

log "WARN: x11vnc port not listening; see /home/${VNC_USER}/.vnc/x11vnc.log"
exit 1