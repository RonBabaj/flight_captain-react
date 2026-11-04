#!/usr/bin/env bash
# Copy tracked NPM compose to the live stack path (data/letsencrypt stay on disk).
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
SRC="$REPO_ROOT/infra/nginx-proxy-manager/docker-compose.yml"
DST="${NPM_DIR:-/opt/stacks/nginx-proxy-manager}"

if [[ ! -f "$SRC" ]]; then
  echo "Missing $SRC"
  exit 1
fi

mkdir -p "$DST"
cp "$SRC" "$DST/docker-compose.yml"
docker network create proxy 2>/dev/null || true

echo "Synced docker-compose.yml -> $DST"
