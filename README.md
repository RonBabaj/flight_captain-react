# Fly-Fix

A Skyscanner-style flight metasearch app: **Go backend** (Google Flights via RapidAPI) + **React Native (Expo) frontend** for web, iOS, and Android.

---

## Overview

- **Backend (`backend/`)** – Go HTTP API backed by **Google Flights2** (RapidAPI). REST endpoints for flight search sessions, monthly/range deals, flight details, airport search, and affiliate booking redirects.
- **Frontend (`frontend/`)** – Expo React Native app (web + native). **Landing page** at `/`, flight search at `/search`, monthly deals at `/monthly-deals`. Top navbar (**Home | Search | Monthly Deals**), dark/light theme (indigo accent, dark default), full RTL support (Hebrew, Russian, English).

Backend and frontend are decoupled; the frontend depends only on the HTTP API contracts.

---

## Graphify (codebase knowledge graph)

This repo includes a [Graphify](https://github.com/safishamsi/graphify) knowledge graph so Cursor agents can answer architecture questions with far fewer tokens than grepping the tree.

**Committed artifacts**
- `.cursor/rules/graphify.mdc` — always-on Cursor rule (prefer `graphify query` / `path` / `explain` over memory or broad reads)
- `graphify-out/graph.json`, `GRAPH_REPORT.md`, `graph.html`, `manifest.json`
- `.gitattributes` — union-merge driver for `graphify-out/graph.json`

**One-time local setup**
```bash
pip install graphifyy
export PATH="$HOME/.local/bin:$PATH"   # if needed
graphify cursor install                # writes/refreshes .cursor/rules/graphify.mdc
graphify hook install                  # optional: rebuild graph after commits
graphify update .                      # AST rebuild (no API cost)
```

**Day-to-day**
```bash
graphify query "how does flight search work?"
graphify path "Provider" "handleCreateSession"
graphify explain "GoogleFlights2Provider"
graphify update .                      # after code changes
```

Agents should prefer the graph over conversation memory whenever this feature is present.

---

## Features

### Landing (home)
- **Route:** `/` — marketing-style hero, value props, how-it-works, and CTAs to **Search flights** and **Explore monthly deals**.
- Same design language as the app (dark/light theme, indigo accent); copy is translated (EN / HE / RU).

### Flight Search
- Flight search uses Google Flights2 (RapidAPI), with caching and a strict per-minute rate limit to control cost.
- **Round-trip support**: two separate one-way searches are made (outbound + return) and combined so every result has full route data for both legs.
- Sort by price, duration, or "best" (weighted score).
- Filter by stops count and airlines.
- Responsive three-column layout on desktop (search form | results | filters), single-column on mobile.
- Skeleton loading cards while results stream in.
- Edit search modal without leaving the results page.

### Flight Result Cards
- Skyscanner/Kiwi-inspired cards with strong hierarchy: bold departure/arrival times, prominent price, compact stops/duration badges.
- Full route path with all layover airports shown on the card (e.g. `TLV → LCA → DOH → HND`).
- Round-trip cards show both the outbound and return route paths, plus departure and return dates (e.g. `Mar 30 → Apr 7`).
- Direct flights get a green-tinted badge for quick scanning.
- Airline name, cabin class, and baggage info at a glance.
- Tap anywhere to open details; dedicated "Book now" button.

### Flight Details Modal
- Desktop: centered modal. Mobile: bottom-sheet drawer.
- Full itinerary: **all legs** (outbound and return), all segments with visual timeline (departure → duration line → arrival).
- Layover rows between segments with airport and formatted duration.
- Per-segment airline name, flight number, and cabin class.
- Cabin and baggage badges.
- "Book now" redirects to partner booking site via backend.

### Booking Redirect
- Unified `GET /api/out/booking` endpoint.
- Uses provider deep links (OTA, etc.) when available.
- Falls back to Skyscanner search URL with flight params.
- Works for both search results (with session/option) and monthly deals (params-only fallback).
- Affiliate tracking via configurable IDs and subid.

### Filters & Sorting
- **Stops filter**: "Any / Direct / 1 stop / 2+" based on max stops per leg (not total across all legs), so round-trip results filter correctly.
- **Airlines filter**: matches results where any leg includes the selected carrier (supports mixed-carrier round-trips).
- **Sort**: Price (cheapest first), Duration (fastest), Best (weighted price + duration + stops score). Active **Cheapest** / **Fastest** pills show ↑/↓ for sort direction; **Best** does not (avoids looking like a dropdown).

### Monthly Deals
- Search cheapest round-trip dates for any month.
- Controls: origin/destination, passengers, non-stop toggle, trip duration stepper, month navigator.
- **Sort bar**: Cheapest / Fastest / Best — matches the main search engine sort options.
- **Filter panel**: Stops (Any / Direct / 1 stop / 2+), Airlines, Preferred departure days (Sun–Sat), Max price — all applied client-side without re-fetching.
- Deal cards show full outbound and return route paths with layovers and departure + return dates.
- Tap a deal for the full flight details modal (same design as search results).
- "Book now" from deal details redirects directly to Skyscanner.

### Explore (Anywhere)
- From **Search** or **Monthly Deals**, choosing **Anywhere** opens the **Explore** screen: a grid of curated destinations with **from** prices, sorted cheapest-first.
- **Search mode** (`mode: 'search'`): uses fixed departure/return dates; tapping a destination starts a normal flight search session for that airport.
- **Deals mode** (`mode: 'deals'`): uses year, month, and trip duration (same semantics as Monthly Deals). Tapping a destination loads **full monthly deals** for that origin/destination via `GET /api/deals/month`, then navigates to **Monthly deals results**. The deals store is updated (route, month, duration) and loading state is cleared so the results screen does not spin forever.
- **API cost control (backend):** Explore uses a **fixed pool** of major airports (~64 IATA codes), not the full dictionary. Prices come from three layers: **(1)** in-memory **24h cache** per `{ origin, destination, trip key (dates or month/duration), currency, passengers, non-stop }`; **(2)** **live Google Flights2** only in small batches; **(3)** **distance-based estimates** when there is no cache yet (rows include `priceSource`: `live` | `cached` | `estimated`). This keeps monthly RapidAPI usage predictable versus scanning hundreds of destinations.
- **Live fetch caps:** At most **~12** GF2 round-trip probes per HTTP request that opts into live refresh, and **~36** per explore **session** (roughly three refresh rounds). Month-style explore uses a representative mid-month departure/return pair per live probe, same as before.
- **Progressive loading:** The client calls `GET /api/explore` with **`prefetch=true`** first (cache + estimates, no live GF2), then continues with **`sessionId`** and **`live=true`** in a few rounds until live quota is exhausted or the queue is empty. The summary bar can show **“Updating prices…”** while live data lands; destination cards can show an **Estimate** pill until replaced by cache or live prices.
- **UI:** Region filters reset when a new search runs; results column uses flex layout for desktop web; disclaimer copy explains fixed pool, 24h cache, and estimates.

### Cheaper departure cities (positioning optimizer)
- After results load, the app checks whether flying from a nearby hub would reduce total cost.
- **Hub airports:** ATH, VIE, BUD, FCO, MXP, SOF, OTP. Works for **any origin/destination** (no TLV-only restriction).
- Options with savings over $80 are shown in a **"Cheaper departure cities"** section: hub code, total price, savings, and per-leg prices.
- **Desktop:** section appears in the right sidebar below the filters. **Mobile:** section appears below the flight cards.
- **"View combination"** opens a modal with both legs (positioning + main flight) and a **"Book both legs"** button that opens partner booking URLs for each leg.
- **Monthly Deals parity:** Monthly Deals reuses the same `CheaperCitiesSection` UI component as the main search results.
- **Click behavior (Monthly Deals):** Clicking a hub runs the Monthly Deals flow again using the hub as an extra leg (origin → hub → destination), preserving month/duration/passenger/cabin inputs.
- **Stability:** The section is only cleared when the search session (origin/destination/year/month) actually changes, and the optimizer is resilient to intermittent API failures (module-scope promise cache + single-leg retry). Debug logs:
  - `[MONTHLY_POSITIONING] origin=... hub=... dest=... total=... savings=...`
  - `[MONTHLY_POSITIONING_RENDER] optionsCount=...`

### Loading & progress
- **Search (main form):** On "Search", a full-screen **SearchLoadingOverlay** appears with a spinner, route (e.g. TLV → HND), and **rotating status text** (e.g. "Searching hundreds of airlines…", "Comparing prices…") in the active language (EN/HE/RU).
- **Search button:** While loading, the button shows a spinner and the same rotating phrases instead of static "Searching…".
- **Results page:** While the session is PENDING/PARTIAL, a **LoadingBanner** shows an **animated progress bar** and rotating status phrases. Re-searching from the sidebar (edit-search modal) also shows the full-screen overlay.
- **Monthly deals:** Search button shows static "Searching…" while loading; the main loader shows **only** an animated progress bar and rotating text (e.g. "Finding the best dates…") below it — no duplicate spinners or duplicate rotating text.

### UI Polish
- Consistent design language across search results and monthly deals.
- Pill-shaped sort buttons, lightweight collapsible filter sidebar, compact search form.
- **Responsive layout:** Three-column desktop (hero | deals | filters), single column + bottom-sheet modals on mobile.
  - **Header:** On narrow viewports, nav collapses into a **hamburger menu** (Home / Search / Monthly deals).
  - **Results toolbar (mobile):** The **Filters** button sits on its own row **between** the sort options and the flight cards to avoid overflow.
  - **Flight details modal:** Bottom-sheet on mobile with constrained height/width so it stays within the viewport (e.g. Samsung S24 Ultra, iPhone).
- Dark and light themes with **full RTL support** (English, Hebrew, Russian): flight cards and modals swap price/info columns; sort bar and month nav flow from the correct side; main search dates show return ← departure and arrow direction in RTL; header and labels have appropriate padding/margins. **Icons** use local static SVGs (no runtime icon fonts) for reliable rendering in normal and incognito/private browsing.

### Favicon & SEO
- **Favicon:** `frontend/public/favicon.png` — paper plane in a dark purple circle with a light border (used as primary icon in `index.html`).
- **Custom `index.html`:** Favicon links, `meta` keywords and robots, **Open Graph** (og:type, title, description, image, site_name), **Twitter Card** (card, title, description). Description and theme color can be injected from `app.json` (Expo web).
- Optional: add `public/og-image.png` for social previews and `public/favicon.ico` for legacy browsers.

### AdSense & consent (CMP)
- **AdSense** script is loaded from `frontend/public/index.html` (client ID in the script `client=ca-pub-...`).
- **Consent message (Google CMP)** for EEA, UK, and Switzerland: no extra code is required. The AdSense tag automatically shows the consent message once it is created and **published** in the AdSense UI:
  1. In AdSense, go to **Privacy & messaging**.
  2. Under **European regulations**, choose **Use Google's CMP** (e.g. 2 choices: Consent + Manage options, or 3 choices with Do not consent).
  3. Create and **publish** the message; it will then appear for eligible users.
- Test the message by appending `?fc=alwaysshow&fctype=gdpr` to a page URL (see [AdSense Help](https://support.google.com/adsense/answer/10924669)).

---

## Tech Stack

- **Backend:** Go, `net/http`, Google Flights2 via RapidAPI, `godotenv`
- **Frontend:** React Native, Expo SDK 52, React Native Web, TypeScript, React Navigation, Zustand

---

## Backend

### Environment

Create `backend/.env`:

```env
GOOGLEFLIGHTS2_ENABLED=true
GOOGLEFLIGHTS2_RAPIDAPI_KEY=your_rapidapi_key
GOOGLEFLIGHTS2_RAPIDAPI_HOST=google-flights2.p.rapidapi.com

# Optional: in-process cap on GF2 Search() calls per rolling minute (default 30). Range 1–500.
# GOOGLEFLIGHTS2_RATE_LIMIT_PER_MIN=30
```

### Run the HTTP API

```bash
cd backend
go run .
```

Server listens on **http://localhost:8080**. CORS is enabled for browser clients.

### Main endpoints

- **`POST /api/search/sessions`** – Create flight search session. Returns session `id`, `status`, `params`.
- **`GET /api/search/sessions/{id}`** – Poll session status and normalized results.
- **`GET /api/deals/month`** – Monthly deals: returns `days[]` with `date` and `lowestPrice`. Identical params may be served from a **short in-memory cache** (~90s) to avoid duplicate GF2 work.
- **`GET /api/explore`** – Cheapest destinations from an origin using a **fixed airport pool**, **24h server cache**, optional **live GF2** batches, and **estimates** for gaps.  
  - **New session:** `origin`, `currency`, `adults`, optional `offset`/`limit` (limit capped at **80**). Either **fixed dates** (`departureDate`, `returnDate`) or **month** mode (`year`, `month`, `durationDays`, optional `children`, `nonStop`).  
  - **`prefetch=true`:** Return cache + estimates only (no live GF2 on that request).  
  - **Continuation:** `sessionId`, optional `offset`/`limit`; add **`live=true`** to run one live batch (~12 destinations max per call, session cap ~36 total live attempts).  
  - **Response:** `destinations[]` (`destination`, `price`, `currency`, `departureDate?`, `priceSource`), `sessionId`, `total`, `offset`, `limit`, `hasMore`, `partialResults` (any row still estimated), `liveRefreshAvailable` (more live batches allowed for this session).
- **`GET /api/flights/details`** – Flight details for a route/date/duration.
- **`GET /api/airports/search?q=...&limit=...`** – Airport/city autocomplete (empty `q` returns the first `limit` directory entries).
- **`GET /health`** – JSON for uptime/readiness: `status`, `timestamp`, `version` (from `APP_VERSION` or `dev`), and whether Google Flights2 is configured (`services.googleFlights2`).
- **`GET /api/out/booking?sessionId=...&optionId=...`** – Uniform booking redirect. Uses provider deep link or Skyscanner fallback. Also accepts `origin`, `destination`, `departureDate`, `returnDate` params for deals without a session.
- **`GET /api/affiliate/provider`** – Provider info for an option.
- **`GET /api/affiliate/outbound-link`** – Booking URL + click recording.
- **`GET /api/affiliate/redirect`** – 302 redirect to booking page.
- **`GET /api/affiliate/clicks/summary`** – Clicks report.

See **`backend/backend_api_contracts.md`** for full request/response shapes.

### Affiliate setup (optional)

Outbound booking links can include affiliate IDs and a tracking subid for commission and click/conversion tracking.

- **Env vars:** Set in `.env`: `AFFILIATE_ID` (default for all providers) and optionally `AFF_ID_OTA`, `AFF_ID_LY`, `AFF_ID_UA`, etc.
- **Link building:** Templates use `{aff_id}` and `{subid}`. The backend sets `subid` to `sessionId_optionId` for attribution.

---

## Frontend

### Environment

Create `frontend/.env` (optional; defaults to `http://localhost:8080`):

```env
EXPO_PUBLIC_API_URL=http://localhost:8080
```

### Install and run

```bash
cd frontend
npm install
npm run web    # or: npm run ios | npm run android
```

Web dev server runs at **http://localhost:8081**. Ensure the backend is running on 8080.

### Structure

- **`src/api/`** – API client (search, deals, explore, flights, airports, affiliate/booking).
- **`src/types/`** – Shared TypeScript types.
- **`src/store/`** – Zustand stores (search, deals).
- **`src/theme/`** – Theme context (dark/light, indigo accent). Dark is default.
- **`src/data/`** – Local airport dictionary, airline names, translations (en/he/ru).
- **`src/features/flight-search/`** – Search form, results screen, **Explore** (Anywhere destination picker), result cards, sort bar, filters panel, flight details modal.
- **`src/features/monthly-deals/`** – Deals search form, deals list, deal details modal with booking redirect.
- **`src/features/landing/`** – Home / landing screen (hero, features, how-it-works, footer).
- **`src/navigation/`** – Root stack (Home, Search, Monthly Deals) with shared top navbar. **Search** stack: SearchForm → Results → Explore. **Monthly Deals** stack: form → results → Explore (deals mode).

---

## Flows

1. **Home** – Optional entry at `/`: read value props → **Search flights** (`/search`) or **Explore monthly deals** (`/monthly-deals`).
2. **Flight search** – From `/search`: enter From/To (autocomplete), pick dates, passengers and cabin → Search → Results at `/search/results` with sort/filter → View details modal (outbound + return legs) → Book now (redirects to partner site). Shareable URLs keep query params (e.g. `sessionId`) on the `/search` path.
3. **Monthly deals** – From `/monthly-deals`: set route, trip duration, month → Search deals → Sort/filter by price, stops, airlines, preferred departure days → Tap deal for details modal → Book now (redirects to Skyscanner). Optional: set destination to **Anywhere** → **Explore** (deals mode) → pick a city → loads full calendar for that destination on **Monthly deals results**.
4. **Explore** – From Search or Monthly Deals with **Anywhere**: the app loads **prefetch** results (cache + estimates), then may **refresh live prices** in the background within server limits → browse destination cards → tap to open either search results (date mode) or monthly deals results (month/duration mode).

### Web routes (deep links & refresh)

| Path | Screen |
|------|--------|
| `/` | Landing |
| `/search` | Flight search form |
| `/search/results` | Search results |
| `/monthly-deals` | Monthly deals form |
| `/monthly-deals/results` | Monthly deals results |

Legacy bookmarks (Apache/LiteSpeed, optional): **`frontend/public/.htaccess`** **301**-redirects `/results` → `/search/results` and `/deals` → `/monthly-deals/` (query string preserved). With nginx/Docker, these legacy paths are handled via build-time SPA route shells (see `frontend/scripts/write-spa-fallbacks.mjs`).

---

## Production deployment (web)

- **SPA routing:** Docker/nginx serves the SPA using physical `index.html` route shells generated at build time by `frontend/scripts/write-spa-fallbacks.mjs`. `frontend/public/.htaccess` remains for legacy Apache/LiteSpeed hosting (optional).
- **Deploy:** GitHub Actions deploys the Docker stack to the VPS on every push to `main` (see `.github/workflows/deploy.yml`).
- **Legacy URLs:** **301** redirects for `/results` and `/deals` to the new paths; see **Web routes** above.

## Notes

- No authentication in this version.
- Airport autocomplete uses a frontend dictionary (`src/data/airports.ts`) with a large set of commercial airports and EN/HE/RU names; the backend `/api/airports/search` is also available.
- Theme: indigo accent, shared nav bar and radii; dark theme tuned for readability.
- RTL support: Hebrew and Russian layouts are fully mirrored.
- GF2 round-trips use two separate one-way API calls (outbound + return) combined server-side, ensuring both legs and their layover airports are always available in results and the details modal.

---

## Recent enhancements

Summary of recent changes:

| Area | Change |
|------|--------|
| **Fly-Fix: Product structure** | **`/`** = landing page (hero, features, how-it-works, CTAs). **`/search`** and **`/search/results`** = main flight search UI (unchanged behavior). **`/monthly-deals`** (+ `/monthly-deals/results`) = monthly deals. Top nav: **Home \| Search \| Monthly Deals**. React Navigation linking + optional `.htaccess` 301s from legacy `/results` and `/deals`. |
| **Explore (Anywhere)** | **Search** and **Monthly Deals** support **Anywhere** → **Explore**: fixed ~64-hub pool, **24h price cache**, **estimates** for cold cache, **incremental live GF2** (`prefetch` + `sessionId`/`live`) with per-request and per-session caps. API returns `priceSource`, `partialResults`, `liveRefreshAvailable`. **Deals Explore** still uses month/duration params; tapping a card runs **`GET /api/deals/month`** and opens **Monthly deals results** with store sync and **`setLoading(false)` in `finally`**. |
| **Explore UI** | Prefetch-first loading with chained live refresh; summary **“Updating prices…”**; **Estimate** pill on cards when `priceSource` is estimated; region filter reset; flex/ScrollView layout on desktop; i18n for disclaimer and labels (EN/HE/RU). |
| **Fly-Fix: Icons** | All UI icons use **local static SVGs** (`WebIconSvg` + `AppIcon`). No `@expo/vector-icons` or icon fonts; icons render reliably on Expo web, iOS/Android browsers, and in incognito/private mode. Icons: search, filter, calendar, close, chevrons, airplane, globe, theme, menu, etc. |
| **Fly-Fix: RTL** | **Main search:** Dates in RTL show return ← departure with right-aligned text; "Passengers & cabin" label has top/bottom margin. **Sort bar:** Uses `direction: 'rtl'` so label and pills flow from the right; pill order reversed in RTL. **Monthly Deals:** Search column (right) and filters (left) swap in RTL via parent direction; deal cards and details modal swap price/info; month nav: הבא (Next) on left, הקודם (Prev) on right, arrow after הבא and before הקודם; positioning section and filters header RTL. **Header:** Extra padding for title and action icons. |
| **Fly-Fix: Cheaper cities** | "Cheaper departure cities" only clears when the search session (origin/destination/year or month) changes, so the section stays visible on Chrome iOS and across re-renders. Monthly Deals uses the shared `CheaperCitiesSection` UI and the positioning optimizer is resilient to intermittent `/api/deals/month` failures (promise cache + single-leg retry). |
| **Fly-Fix: Production 404** | `frontend/public/.htaccess` provides an optional Apache/LiteSpeed SPA fallback by rewriting non-file requests to `/index.html`. nginx/Docker relies on build-time SPA route shells instead. |
| **Fly-Fix: Monthly Deals UX** | Loading: single rotating message below progress bar only; search button shows static "Searching…". Layout: wider search column (320px), more padding in hero and results; month nav has horizontal margins; deal cards have more padding/gap; nav buttons have no extra padding. |
| **Loading UX** | Full-screen search overlay with rotating status text (EN/HE/RU); search button shows spinner + rotating phrases; results page loading banner with animated progress bar and cycling messages; monthly deals use progress bar + single rotating text below (see Fly-Fix). |
| **Positioning optimizer** | "Cheaper departure cities" for any origin/destination; hub list ATH, VIE, BUD, FCO, MXP, SOF, OTP; UI rendered via shared `CheaperCitiesSection` on both main search and Monthly Deals; selecting a hub re-runs Monthly Deals as origin → hub → destination. Optimizer is resilient to intermittent `/api/deals/month` failures (promise cache + single-leg retry) and emits `[MONTHLY_POSITIONING]` / `[MONTHLY_POSITIONING_RENDER]` logs. |
| **Responsive** | Hamburger nav on small screens; Filters button moved to its own row between sort and cards on mobile; flight details modal sized for narrow viewports (max height/width). |
| **Favicon** | Primary favicon: PNG (paper plane in dark purple circle with light border) at `frontend/public/favicon.png`. |
| **SEO** | Custom `frontend/public/index.html` with favicon, meta keywords/robots, Open Graph, Twitter Card; `app.json` web description and theme color for injection. |
| **Passenger & cabin** | Tapping "Done" in the Passenger & cabin picker triggers a re-search with the new params (and closes the edit-search modal when opened from there). Cabin class (Economy, Premium Economy, Business, First) is respected: backend sends cabin to GF2; results keep only options with at least one segment in the requested cabin when premium is selected (no silent economy substitution). Empty state: "No flights in this cabin" + tip when there are zero results for a non-economy cabin. |
| **Price & passengers** | API price is **per passenger**. Total price = API price × passenger count (adults + children + infants). UI shows **total** as the main price and, when there is more than one passenger, a "X per passenger" line. No division of price by passenger count. When the backend provides a fare breakdown, the details modal can show separate totals for adults, children, and infants. |
| **Checked bag** | "Checked baggage" toggle removed from the search form. Searches always use base fare (no "include checked bag" filter) for simpler, comparable prices. |
| **Cabin on cards** | Result cards show the **best** cabin across all segments (e.g. First if any segment is First) instead of only the first segment, so mixed itineraries (e.g. short economy hop + long-haul business) display the premium cabin. |
| **Filters** | Stops filter: Direct = 0 stops, 1 stop = exactly 1, 2+ = at least 2 stops. Airlines filter uses a single primary carrier per result (no multi-airline match), so e.g. "SWISS only" shows only results whose primary airline is LX. |
| **Currency & airlines** | Prices use **currency symbols** ($, ₪, €, £, ¥) instead of codes (USD, ILS, EUR, …) in cards, modal, deals, and positioning section. Airline display prefers full names (e.g. Aegean for A3) via an extended IATA map and local overrides. |
