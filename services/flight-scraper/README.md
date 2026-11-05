# Flight scraper (multisite)

Self-hosted **Playwright** service for **Kiwi**, **Skyscanner**, and **Expedia**. The Go API (`OtaScraperProvider`) calls `POST /v1/search` and merges offers with **Google Flights2 (RapidAPI)** results.

## VPS (recommended): headed Chrome on `:99`

The production VPS already runs **Xvfb `:99`** and **Google Chrome** (apartment monitor). The scraper should attach to that real browser, not a nested xvfb inside Docker.

1. Start dedicated flight Chrome (CDP port **9223**):

   ```bash
   sudo scripts/vps/ensure-flight-chrome.sh
   ```

2. `flight-scraper` uses **`network_mode: host`** + `SCRAPER_CDP_URL=http://127.0.0.1:9223` + `DISPLAY=:99` (see root `docker-compose.yml`).

3. `flyfix-api` calls `http://host.docker.internal:3099`.

Playwright opens **new tabs/contexts** via CDP — same headed Chrome session as a normal desktop.

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

Built as `flight-scraper`. On VPS, **host networking** is required so CDP can reach `127.0.0.1:9223` on the host.
