# Flight scraper (multisite)

Self-hosted **Playwright** service for **Kiwi**, **Skyscanner**, and **Expedia**. The Go API (`OtaScraperProvider`) calls `POST /v1/search` and merges offers with **Google Flights2 (RapidAPI)** results.

On Book, the API also calls `POST /v1/resolve-partners` so Skyscanner/Kiwi booking panels can hand off real seller checkout URLs (same role as GF2 `getBookingDetails` → `getBookingURL`).

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

`FLIGHT_SCRAPER_TOKEN` is **required** in production (process exits without it unless `SCRAPER_DRY_RUN=1` or `SCRAPER_ALLOW_INSECURE=1`). Cookie warm is **opt-in**: set `SCRAPER_WARM_ON_START=1` to warm Kiwi + Skyscanner on boot and every ~15 minutes. Create-session returns `PENDING` immediately; GF2 + OTAs finish together and the session flips to `COMPLETE` once.

## Run locally

```bash
cd services/flight-scraper
npm install
npm start
```

Without `SCRAPER_CDP_URL`, Playwright launches its own Chromium (optionally headed with `PLAYWRIGHT_HEADLESS=0` + `DISPLAY`).

Optional:

- `FLIGHT_SCRAPER_TOKEN` — shared Bearer secret (required outside dry-run/insecure)
- `SCRAPER_DRY_RUN=1` — empty offers (smoke test)
- `SCRAPER_ALLOW_INSECURE=1` — local-only: allow empty token
- `SCRAPER_WARM_ON_START=1` — enable cookie warm loop
- `SCRAPER_SESSION_RETRIES=3`
- `SCRAPER_PROXY_URL` — only if you need a different egress IP
- `SCRAPER_PX_SOLVE_ATTEMPTS` / `SCRAPER_PX_HOLD_MS` — PerimeterX press-and-hold retries (default 3 / 5200ms)
- `SCRAPER_SKY_WARM_COOLDOWN_MS` — pause Skyscanner homepage warm after a block (default 2h)

### When Skyscanner returns 0 offers

Skyscanner often serves **PerimeterX** (`/sttc/px/captcha-v2/`) to datacenter IPs and automated CDP Chrome. The scraper reads **`web-unified-search` JSON** in the browser; if the wall wins, you get **0 offers** (Google Flights still fills the session).

**Improve scrape reliability (highest impact first):**

1. **Residential egress** — set `SCRAPER_PROXY_URL` on the VPS to a mobile/residential proxy in EU (Skyscanner `.fr` matches FR geo).
2. **Warm the shared Chrome profile** — `SCRAPER_WARM_ON_START=1` (periodic Kiwi + Skyscanner.fr cookie dismiss).
3. **One manual pass on the captcha** — VNC/`DISPLAY :99` on the VPS: open the same flight Chrome profile (`scripts/vps/ensure-flight-chrome.sh`), complete Press & Hold once; cookies stick in `/var/lib/flight-scraper-chrome`.
4. **Serial sites when blocked** — `SCRAPER_SERIAL_SITES=1` reduces parallel tab pressure on PX (slower per search).
5. **Tune PX solver** — `SCRAPER_PX_SOLVE_ATTEMPTS`, `SCRAPER_PX_HOLD_MS` (headed Chrome only; no solve in headless Playwright).

Scraper errors now distinguish **`skyscanner blocked (perimeterx captcha)`** vs empty JSON/DOM parses — check `flight-scraper` logs and `docker logs flight-scraper`.

## Docker

Built as `flight-scraper`. On VPS it joins the external `proxy` network and reaches host Chrome through the gateway CDP proxy on **9224**.
