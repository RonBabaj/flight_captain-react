# Flight Captain

A Skyscanner-style flight search app: **Go backend** (Amadeus API) + **React Native (Expo) frontend** for web, iOS, and Android.

---

## Overview

- **Backend (`backend/`)** – Go HTTP API using the **Amadeus API**. REST endpoints for flight search sessions, monthly/range deals, flight details, and optional airport search. Also includes a Telegram bot; the web app uses only the HTTP API.
- **Frontend (`frontend/`)** – Expo React Native app (web + native). Single **top navbar** (Search | Monthly Deals), **dark/light theme** (indigo accent, dark default). **Flight Search**: origin/destination (airport autocomplete from a local dictionary), dates (one-way or round-trip calendar), passengers, cabin → search → results with sort/filter. **Monthly Deals**: route, month, trip duration → best deals list → tap deal for details → “Search these dates” to open results.

Backend and frontend are decoupled; the frontend depends only on the HTTP API contracts.

---

## Tech Stack

- **Backend:** Go, `net/http`, Amadeus REST API, `godotenv`
- **Frontend:** React Native, Expo SDK 52, React Native Web, TypeScript, React Navigation, Zustand

---

## Backend

### Environment

Create `backend/.env`:

```env
AMADEUS_CLIENT_ID=your_amadeus_client_id
AMADEUS_CLIENT_SECRET=your_amadeus_client_secret
```

### Run the HTTP API (for the frontend)

From the project root:

```bash
cd backend
go run .
```

Server listens on **http://localhost:8080**. CORS is enabled for browser clients.

### Main endpoints

- **`POST /api/search/sessions`** – Create flight search session (`origin`, `destination`, `departureDate`, optional `returnDate`, `cabinClass`, `adults`, etc.). Returns session `id`, `status`, `params`.
- **`GET /api/search/sessions/{id}`** – Poll session status and normalized results (`results[]` with price, duration, legs/segments).
- **`GET /api/deals/month`** – Monthly deals: `origin`, `destination`, `year`, `month` (or `startDate`/`endDate` for a range), optional `durationDays`. Returns `days[]` with `date` and `lowestPrice`.
- **`GET /api/flights/details`** – Flight details for a route/date/duration (e.g. for deal details modal).
- **`GET /api/airports/search?q=...&limit=...`** – Airport/city autocomplete (optional; frontend uses a local dictionary by default).
- **`GET /api/affiliate/provider?sessionId=...&optionId=...`** – Provider (airline/OTA) for an option (for “Book on …” label). No click recorded.
- **`GET /api/affiliate/outbound-link?sessionId=...&optionId=...`** – Outbound booking URL + provider; records a click. Frontend opens the URL (or falls back to Google Flights if the API is unavailable).
- **`GET /api/affiliate/redirect?sessionId=...&optionId=...`** – Same as outbound-link but returns 302 redirect.
- **`GET /api/affiliate/clicks/summary?from=...&to=...`** – Clicks report (optional).

**Note:** Affiliate routes are in the same HTTP server as search/deals. Run the backend with `go run .` from `backend/` (the default build uses `server.go`). If “Book on partner site” doesn’t open a link, ensure this server is running; the app will fall back to opening Google Flights with your search.

### Affiliate setup (optional)

Outbound booking links can include affiliate IDs and a tracking subid for commission and click/conversion tracking. **Do not commit real affiliate IDs to the repo.**

- **Env vars:** Copy `backend/.env.example` and set in `.env`: `AFFILIATE_ID` (default for all providers) and optionally `AFF_ID_OTA`, `AFF_ID_LY`, `AFF_ID_UA`, etc. OTA fallback uses `AFF_ID_OTA` or `AFFILIATE_ID`.
- **Link building:** Templates use `{aff_id}` and `{subid}`. The backend sets `subid` to `sessionId_optionId` so you can attribute clicks and conversions to a search/option.
- **Programs:** Use one global ID (e.g. Travelpayouts, Google Flights) in `AFFILIATE_ID`, or set per-airline IDs where supported.

See **`backend/backend_api_contracts.md`** for full request/response shapes.

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

Web dev server runs at **http://localhost:8081** (or next free port). Ensure the backend is running on 8080 for search and deals.

### Structure

- **`src/api/`** – API client (search, deals, flights, airports).
- **`src/types/`** – Shared TypeScript types.
- **`src/store/`** – Zustand stores (search, deals).
- **`src/theme/`** – Theme context (dark/light, indigo accent, `controlBg`, radii). Dark is default.
- **`src/data/airports.ts`** – Local airport dictionary and `searchAirportsLocal()` for From/To autocomplete (no backend call).
- **`src/features/flight-search/`** – Search form (origin, destination, date range calendar, passengers, cabin), results screen (sort/filter, expandable cards).
- **`src/features/monthly-deals/`** – Route, month, trip duration; best-deals list and “Load more”; deal details modal and “Search these dates.”
- **`src/navigation/`** – Root stack with single **top navbar** (title left, Search | Monthly Deals center, Light/Dark toggle right). Search stack: SearchForm → Results.

---

## Flows

1. **Flight search** – Enter From/To (autocomplete from local airport list), pick dates (one-way or round-trip calendar), passengers and cabin → Search → Results with sort by price/duration and stop filters. Only IATA codes (e.g. TLV, NAP) are sent to the backend.
2. **Monthly deals** – Set From/To, trip duration (days), and month → “Search deals” → list of best deals (cheapest first). Tap a deal for segment details → “Search these dates” to run a search and open Results.

---

## Notes

- No authentication in this version.
- Airport autocomplete uses a **frontend dictionary** (`src/data/airports.ts`); extend the list there. The backend `/api/airports/search` endpoint is available if you prefer server-side search.
- Theme: indigo accent, shared nav bar and radii; dark theme tuned for readability (high-contrast text).
