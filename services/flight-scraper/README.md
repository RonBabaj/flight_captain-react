# Flight scraper (multisite)

Self-hosted Playwright service for **Kiwi**, **Skyscanner**, and **Expedia**. The Go API (`OtaScraperProvider`) calls `POST /v1/search` and merges offers with **Google Flights2 (RapidAPI)** results.

## Run locally

```bash
cd services/flight-scraper
npm install
npm start
```

Optional:

- `SCRAPER_DRY_RUN=1` — return empty offers (smoke test wiring)
- `FLIGHT_SCRAPER_SITES=kiwi,skyscanner` — default all three
- `FLIGHT_SCRAPER_TOKEN=secret` — require `Authorization: Bearer secret`

## Docker

Built by root `docker-compose.yml` as `flight-scraper`. The API uses `FLIGHT_SCRAPER_URL=http://flight-scraper:3099`.

## VPS notes

- Allocate enough RAM for Chromium (≈1–2GB per concurrent site; sites run in parallel per request).
- Sites change layout often — expect to patch `src/sites/*.js` when parsers break (same as the apartment monitor model).
