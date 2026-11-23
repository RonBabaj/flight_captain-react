---
name: cursor-debug
description: Debug Fly-Fix production (fly-fix.com, VPS SSH, multisite scraper, Skyscanner/Kiwi, GF2). Use when search returns 0 from an OTA, PerimeterX/captcha, providerStats confuse ops, or VPS env/docker wiring is suspect.
---

# Fly-Fix production debug (cursor-debug)

## Access

Cloud agents have **`VPS_HOST` / `VPS_USER` / `VPS_SSH_KEY`** in the environment. SSH before guessing from `/health` alone.

```bash
KEY_FILE=$(mktemp); printf '%s\n' "$VPS_SSH_KEY" > "$KEY_FILE"; chmod 600 "$KEY_FILE"
ssh -i "$KEY_FILE" "${VPS_USER}@${VPS_HOST}" 'hostname'
```

App root on VPS: `/opt/apps/flight_captain-react`.

## Mental model

| Layer | What “success” means |
| --- | --- |
| `/health` | Scraper ping + configured sites — **not** “Skyscanner returned offers this search”. |
| `providerStats.multisite` | Count after Go parse **before** GF2 merge. Kiwi can succeed while Skyscanner is 0 (no top-level multisite error). |
| `results[].source` | After dedupe with GF2 — `skyscanner: 0` can be scrape failure **or** no unique itineraries. |

**Isolate GF2:** set `FLIGHT_PROVIDERS=multisite` in **both** repo-root `.env` and `backend/.env`, then `docker compose up -d --force-recreate flyfix-api`. Compose overrides `FLIGHT_PROVIDERS` from **root** `.env` only.

**Isolate Skyscanner:** from VPS, POST scraper (token in `backend/.env`):

```bash
cd /opt/apps/flight_captain-react
TOKEN=$(grep '^FLIGHT_SCRAPER_TOKEN=' backend/.env | cut -d= -f2-)
docker exec -e TOKEN="$TOKEN" flight-scraper node -e '
const http=require("http");
const body=JSON.stringify({origin:"TLV",destination:"VIE",departureDate:"2026-12-15",returnDate:"2026-12-22",adults:1,currency:"USD",sites:["skyscanner"]});
const req=http.request({hostname:"127.0.0.1",port:3099,path:"/v1/search",method:"POST",headers:{Authorization:"Bearer "+process.env.TOKEN,"Content-Type":"application/json","Content-Length":Buffer.byteLength(body)}},r=>{let b="";r.on("data",c=>b+=c);r.on("end",()=>console.log(b));});
req.setTimeout(360000);req.write(body);req.end();
'
```

Ground truth string: `skyscanner blocked (perimeterx captcha)` → **PerimeterX**, not API dedupe.

## CDP + proxy stack (VPS)

- Flight Chrome: headed on `:99`, CDP `127.0.0.1:9223`, gateway **`http://172.16.2.1:9224`** for Docker (`SCRAPER_CDP_URLS` in root `.env`).
- Residential egress: `SCRAPER_PROXY_URL` in `backend/.env` → gost **`127.0.0.1:18118`** → Chrome `--proxy-server` (set at Chrome **start**).
- `SCRAPER_PROXY_URL` inside `flight-scraper` container does **not** apply to CDP tabs.

Checks:

```bash
curl -sf -x http://127.0.0.1:18118 https://api.ipify.org?format=json   # must not be VPS host IP
curl -sf http://172.16.2.1:9224/json/version | head
docker exec flight-scraper node scripts/debug-skyscanner-live.js
```

Debug JSON: `blocked`, `captcha`, `parsedTotal`, `finalUrl` (`sttc/px/captcha-v2` = PX wall).

## Common failures

| Symptom | Likely cause | Action |
| --- | --- | --- |
| `host.docker.internal:9224` ENOTFOUND | Missing `SCRAPER_CDP_URLS` in **root** `.env` | Set `172.16.2.1:9224`, recreate `flight-scraper` |
| `407 Proxy Authentication Required` | Bad `SCRAPER_PROXY_URL` or broken username (do not append `_session-` without ipRoyal format) | Restore creds; `SCRAPER_PROXY_FORCE_RECREATE=1 scripts/vps/ensure-scraper-proxy-forwarder.sh`; restart Chrome |
| Skyscanner 0, Kiwi > 0, `perimeterx captcha` | PX wins; press-and-hold often fails under CDP automation | Tune `SCRAPER_PX_SOLVE_ATTEMPTS` / `SCRAPER_PX_HOLD_MS`; ipRoyal sticky `_session-…_lifetime-…` on username; optional VNC solve on `:99` |
| `site time budget exceeded` | Long PX burns `SCRAPER_SKY_MAX_MS` / total budget | Check Chrome/proxy first; reduce concurrent searches |

## Scripts

- **`scripts/vps/ensure-flight-stack.sh`** — after upgrade/reboot: proxy + Chrome + VNC + `docker compose up -d` (one command).
- **`sudo scripts/vps/install-flight-stack-service.sh`** — systemd oneshot + 5m timer for auto boot/heal.
- `scripts/vps/ensure-scraper-proxy-forwarder.sh` — loads `backend/.env`; `SCRAPER_PROXY_FORCE_RECREATE=1` recycles gost.
- `scripts/vps/rotate-scraper-proxy-session.sh` — rotates ipRoyal `_session-` **only if** already present in proxy username; restarts forwarder + flight Chrome.
- `scripts/vps/ensure-flight-chrome.sh` — CDP + socat gateway.

## API visibility

After multisite deploy, successful multisite search may set `providerStats[].note` like `kiwi:3; skyscanner:0 (skyscanner blocked (perimeterx captcha))`. Server logs: `[MULTISITE] site=...`.

## Workflow

1. Reproduce on prod API session; count `source` in full paginated results.
2. If needed, GF2-off test (both `.env` files).
3. Scraper-only `sites:["skyscanner"]` on VPS.
4. `debug-skyscanner-live.js` + proxy/CDP checks.
5. Fix wiring before tuning PX; document outcome in PR.

Use `graphify query` before broad code reads in this repo.