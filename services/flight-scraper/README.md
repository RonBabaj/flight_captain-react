# Flight scraper (multisite)

Self-hosted **Playwright** service for **Kiwi**, **Skyscanner**, and **Expedia**. The Go API (`OtaScraperProvider`) calls `POST /v1/search` and merges offers with **Google Flights2 (RapidAPI)** results.

## VPS (recommended): headed Chrome on `:99`

The production VPS already runs **Xvfb `:99`** and **Google Chrome** (apartment monitor). The scraper should attach to that real browser, not a nested xvfb inside Docker.

1. Start dedicated flight Chrome:

   ```bash
   sudo scripts/vps/ensure-flight-chrome.sh
   ```

   Chrome listens on **127.0.0.1:9223**. The script also publishes it on the compose `proxy` gateway as **`:9224`** via socat. Gateway **`:9223`** is apartment-monitor’s Facebook Chrome proxy — scrapers must not use it.

2. `flight-scraper` on the `proxy` network uses `SCRAPER_CDP_URLS=http://<gateway>:9224` (entrypoint rewrites `host.docker.internal` / stale `:9223`).

3. `flyfix-api` calls `http://flight-scraper:3099`.

Playwright opens **new tabs** via CDP on the dedicated flight Chrome profile (`/var/lib/flight-scraper-chrome`). Kiwi and Skyscanner run **in parallel** on one CDP connection (set `SCRAPER_SERIAL_SITES=1` to force serial).

On process start the scraper **warms** Kiwi + Skyscanner (cookie banners, culture) and re-warms every ~15 minutes (`SCRAPER_WARM_ON_START=0` to disable). Create-session returns `PENDING` immediately; GF2 + OTAs finish together and the session flips to `COMPLETE` once.

## Run locally

```bash
cd services/flight-scraper
npm install
npm start
```

Without `SCRAPER_CDP_URL`, Playwright launches its own Chromium (optionally headed with `PLAYWRIGHT_HEADLESS=0` + `DISPLAY`).

Optional:

- `SCRAPER_DRY_RUN=1` — empty offers (smoke test)
- `SCRAPER_SESSION_RETRIES=3`
- `SCRAPER_PROXY_URL` — only if you need a different egress IP

## Docker

Built as `flight-scraper`. On VPS it joins the external `proxy` network and reaches host Chrome through the gateway CDP proxy on **9224**.
