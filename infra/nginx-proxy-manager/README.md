# nginx-proxy-manager (VPS edge)

Single entry point for **HTTPS** on the VPS: Fly-Fix, API, rongurfinkel.com, SpeechInsight, etc.

## On the server

| Path | Purpose |
|------|---------|
| `/opt/stacks/nginx-proxy-manager/` | Running stack (`docker compose up -d`) |
| `./data/` | NPM SQLite DB + generated nginx config (**backup**, not in git) |
| `./letsencrypt/` | Certificate material managed by NPM |

## First-time / recovery

```bash
sudo mkdir -p /opt/stacks/nginx-proxy-manager
sudo cp infra/nginx-proxy-manager/docker-compose.yml /opt/stacks/nginx-proxy-manager/
cd /opt/stacks/nginx-proxy-manager
sudo docker network create proxy 2>/dev/null || true
sudo docker compose up -d
sudo /path/to/flight_captain-react/scripts/vps/install-edge-proxy-cron.sh
```

Admin UI: `http://<vps-ip>:81` (credentials in your password manager / NPM data backup).

## Deploy sync

Each Fly-Fix deploy copies this compose file to `/opt/stacks/nginx-proxy-manager/` and runs `ensure-edge-proxy.sh` so the edge stays aligned with git.
