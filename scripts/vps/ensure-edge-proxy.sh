#!/usr/bin/env bash
# Keep nginx-proxy-manager (TLS + reverse proxy for all public sites) running.
# Host nginx must NOT bind :80/:443 — it prevents NPM from restarting after reboot.
set -euo pipefail

NPM_DIR="${NPM_DIR:-/opt/stacks/nginx-proxy-manager}"
LOG_TAG="ensure-edge-proxy"

log() { echo "[$LOG_TAG] $*"; }

if [[ "$(id -u)" -ne 0 ]]; then
  log "Run as root (sudo)."
  exit 1
fi

# Host nginx must never bind 80/443 — NPM is the only public edge. `disable` is not
# enough (apt/postinst or a manual enable can turn it back on); `mask` blocks start.
if systemctl is-enabled nginx 2>/dev/null | grep -qv masked; then
  log "Disabling host nginx (ports 80/443 belong to nginx-proxy-manager)."
  systemctl stop nginx 2>/dev/null || true
  systemctl disable nginx 2>/dev/null || true
  systemctl mask nginx 2>/dev/null || true
fi

if [[ ! -d "$NPM_DIR" ]]; then
  log "NPM directory missing: $NPM_DIR"
  exit 1
fi

cd "$NPM_DIR"
if ! docker compose ps --status running 2>/dev/null | grep -q nginx-proxy-manager; then
  log "Starting nginx-proxy-manager..."
  docker compose up -d
fi

# rongurfinkel frontend must share the "proxy" network with NPM (502 if only on npm_default).
if docker ps --format '{{.Names}}' | grep -qx 'rongurfinkel-frontend'; then
  if ! docker network inspect proxy --format '{{range .Containers}}{{.Name}} {{end}}' 2>/dev/null | grep -q 'rongurfinkel-frontend'; then
    log "Connecting rongurfinkel-frontend to docker network proxy."
    docker network connect proxy rongurfinkel-frontend 2>/dev/null || true
  fi
fi

if ! ss -tln | grep -q ':443'; then
  log "ERROR: nothing listening on 443 after NPM start."
  exit 1
fi

log "OK: edge proxy listening on 80/443."
