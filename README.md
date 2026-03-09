# Flight Captain

A Skyscanner-style flight metasearch app: **Go backend** (Amadeus, Duffel, Google Flights) + **React Native (Expo) frontend** for web, iOS, and Android.

---

## Overview

- **Backend (`backend/`)** – Go HTTP API aggregating results from **Amadeus**, **Duffel**, and **Google Flights** (SerpAPI). REST endpoints for flight search sessions, monthly/range deals, flight details, airport search, and affiliate booking redirects.
- **Frontend (`frontend/`)** – Expo React Native app (web + native). Top navbar (Search | Monthly Deals), dark/light theme (indigo accent, dark default), full RTL support (Hebrew, Russian, English).

Backend and frontend are decoupled; the frontend depends only on the HTTP API contracts.

---

## Features

### Flight Search
- Multi-provider search: Amadeus, Duffel, Google Flights results merged and deduplicated.
- Sort by price, duration, or "best" (weighted score).
- Filter by stops count and airlines.
- Responsive three-column layout on desktop (search form | results | filters), single-column on mobile.
- Skeleton loading cards while results stream in.
- Edit search modal without leaving the results page.

### Flight Result Cards
- Skyscanner/Kiwi-inspired cards with strong hierarchy: bold departure/arrival times, prominent price, compact stops/duration badges.
- Direct flights get a green-tinted badge for quick scanning.
- Inline layover details with airport codes and wait times.
- Airline name, cabin class, and baggage info at a glance.
- Tap anywhere to open details; dedicated "Book now" button.

### Flight Details Modal
- Desktop: centered modal. Mobile: bottom-sheet drawer.
- Full itinerary: all legs, all segments with visual timeline (departure → duration line → arrival).
- Layover rows between segments with airport and formatted duration.
- Per-segment airline name, flight number, and cabin class.
- Cabin and baggage badges.
- "Book now" redirects to partner booking site via backend.

### Booking Redirect
- Unified `GET /api/out/booking` endpoint.
- Uses provider deep links (Duffel, OTA) when available.
- Falls back to Skyscanner search URL with flight params.
- Works for both search results (with session/option) and monthly deals (params-only fallback).
- Affiliate tracking via configurable IDs and subid.

### Monthly Deals
- Search cheapest round-trip dates for any month.
- Controls: origin/destination, passengers, non-stop toggle, trip duration stepper, month navigator.
- **Preferred departure days filter** — select specific weekdays (Sun–Sat) to only see deals departing on those days.
- Deal cards show date, route, and price; tap for full flight details modal (same design as search results).
- "Book now" from deal details redirects to Skyscanner.

### UI Polish
- Consistent design language across search results and monthly deals.
- Pill-shaped sort buttons, lightweight collapsible filter sidebar, compact search form.
- Responsive layout: sidebar columns on desktop, single column + bottom-sheet modals on mobile.
- Dark and light themes with full RTL support (English, Hebrew, Russian).

---

## Tech Stack

- **Backend:** Go, `net/http`, Amadeus REST API, Duffel API, Google Flights via SerpAPI, `godotenv`
- **Frontend:** React Native, Expo SDK 52, React Native Web, TypeScript, React Navigation, Zustand

---

## Backend

### Environment

Create `backend/.env`:

```env
AMADEUS_CLIENT_ID=your_amadeus_client_id
AMADEUS_CLIENT_SECRET=your_amadeus_client_secret
DUFFEL_ACCESS_TOKEN=your_duffel_token
GOOGLEFLIGHTS2_ENABLED=true
GOOGLEFLIGHTS2_RAPIDAPI_KEY=your_rapidapi_key
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
- **`GET /api/deals/month`** – Monthly deals: returns `days[]` with `date` and `lowestPrice`.
- **`GET /api/flights/details`** – Flight details for a route/date/duration.
- **`GET /api/airports/search?q=...&limit=...`** – Airport/city autocomplete.
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

- **`src/api/`** – API client (search, deals, flights, airports, affiliate/booking).
- **`src/types/`** – Shared TypeScript types.
- **`src/store/`** – Zustand stores (search, deals).
- **`src/theme/`** – Theme context (dark/light, indigo accent). Dark is default.
- **`src/data/`** – Local airport dictionary, airline names, translations (en/he/ru).
- **`src/features/flight-search/`** – Search form, results screen, result cards, sort bar, filters panel, flight details modal.
- **`src/features/monthly-deals/`** – Deals search form, deals list, deal details modal with booking redirect.
- **`src/navigation/`** – Root stack with top navbar. Search stack: SearchForm → Results.

---

## Flows

1. **Flight search** – Enter From/To (autocomplete), pick dates, passengers and cabin → Search → Results with sort/filter → View details modal → Book now (redirects to partner site).
2. **Monthly deals** – Set route, trip duration, month, optionally filter by preferred departure days → Search deals → Tap deal for details modal → Book now (redirects to Skyscanner).

---

## Notes

- No authentication in this version.
- Airport autocomplete uses a frontend dictionary (`src/data/airports.ts`). The backend `/api/airports/search` is also available.
- Theme: indigo accent, shared nav bar and radii; dark theme tuned for readability.
- RTL support: Hebrew and Russian layouts are fully mirrored.
