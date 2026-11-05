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

- **Kiwi from a datacenter IP:** kiwi.com blocks headless browsers (`AppError`). Set **`KIWI_TEQUILA_API_KEY`** (free at [tequila.kiwi.com](https://tequila.kiwi.com/portal)) in `backend/.env` — the scraper uses Tequila REST instead of Playwright for the `kiwi` site.
- **Skyscanner / Expedia:** often need a residential **`SCRAPER_PROXY_URL`** or they return empty from VPS IPs.
- Allocate enough RAM for Chromium (≈1GB+ `shm`; sites run **serially** by default).
- Sites change layout often — patch `src/sites/*.js` when DOM parsers break.
