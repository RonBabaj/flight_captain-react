# Flight scraper (multisite)

Self-hosted **Playwright** service for **Kiwi**, **Skyscanner**, and **Expedia**. The Go API (`OtaScraperProvider`) calls `POST /v1/search` and merges offers with **Google Flights2 (RapidAPI)** results.

## Run locally

```bash
cd services/flight-scraper
npm install
npm start
```

Optional:

- `SCRAPER_DRY_RUN=1` — return empty offers (smoke test wiring)
- `FLIGHT_SCRAPER_SITES=kiwi,skyscanner,expedia`
- `SCRAPER_SESSION_RETRIES=3` — fresh browser context per attempt (helps PerimeterX)
- `SCRAPER_PROXY_URL=http://user:pass@host:port` — **residential sticky proxy** (required for reliable Skyscanner/Expedia from a VPS)
- `PLAYWRIGHT_HEADLESS=0` — headed Chromium (sometimes passes bot checks; Docker needs xvfb)
- `KIWI_USE_TEQUILA=1` + `KIWI_TEQUILA_API_KEY` — optional REST fallback (not used by default)

## Docker

Built by root `docker-compose.yml` as `flight-scraper`. The API uses `FLIGHT_SCRAPER_URL=http://flight-scraper:3099`.

## VPS notes

OTAs run **PerimeterX / bot checks** on datacenter IPs. The scraper uses homepage warmup, stealth init scripts, JSON capture, DOM fallbacks, and **3 session retries** (Chromium then Firefox). That is still not enough for Skyscanner on most VPS IPs — use a **residential `SCRAPER_PROXY_URL`** (sticky session per search).

Allocate enough RAM for Chromium (≈1GB+ `shm`; sites run **serially** by default).

Sites change layout often — patch `src/sites/*.js` when DOM parsers break.
