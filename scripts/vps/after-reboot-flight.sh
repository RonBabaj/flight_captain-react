#!/usr/bin/env bash
# Restore flight scraper desktop stack after kernel reboot (alias for ensure-flight-stack).
set -euo pipefail
APP="${APP_ROOT:-/opt/apps/flight_captain-react}"
exec "$APP/scripts/vps/ensure-flight-stack.sh"