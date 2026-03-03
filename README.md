# Flight Captain – Flight Search Engine

A Skyscanner-style flight search engine: **Go backend** (Amadeus API) + **React Native (Expo) frontend** with web, iOS, and Android support.

---

## Overview

- **Backend (`backend/`)** – Go HTTP API that talks to the **Amadeus Live API**. Exposes REST endpoints for flight search sessions and for monthly/short-range deals. Also contains a Telegram bot; the web frontend only uses the HTTP API.
- **Frontend (`frontend/`)** – Expo React Native app (web + native). Flight search with a small calendar showing prices by date, and a Monthly Deals screen that lists the best deals for a month with “load more.”

Backend and frontend are decoupled: the frontend only depends on the HTTP API contracts.

---

## Tech Stack

- **Backend:** Go 1.x, `net/http`, Amadeus REST API, `github.com/joho/godotenv`
- **Frontend:** React Native, Expo SDK 52, React Native Web, TypeScript, React Navigation, Zustand

---

## Backend

### Environment

Create `backend/.env`:

```env
AMADEUS_CLIENT_ID=your_amadeus_client_id
AMADEUS_CLIENT_SECRET=your_amadeus_client_secret
TELEGRAM_BOT_TOKEN=your_telegram_token   # optional; not needed for HTTP API
```

### Run the HTTP API (for the frontend)

From the project root:

```bash
cd backend
go run .
```

Listens on **`http://localhost:8080`**. CORS is enabled for browser requests.

### Main Endpoints

- **`POST /api/search/sessions`** – Create a flight search session.  
  Body: `origin`, `destination`, `departureDate`, optional `returnDate`, `cabinClass`, `adults`, `children`, `infants`, `currency`, `locale`.  
  Returns session `id`, `status`, `createdAt`, `params`.

- **`GET /api/search/sessions/{id}`** – Get session status and normalized flight results (session + `version` + `results[]` with `price`, `durationMinutes`, `legs` with `segments`).

- **`GET /api/deals/month`** – Two modes:
  - **Full month:** `origin`, `destination`, `year`, `month`, optional `durationDays` (default 7).  
    Returns `route`, `year`, `month`, `currency`, `days[]` with `date` and optional `lowestPrice`.
  - **Short range (for calendar):** `origin`, `destination`, `startDate`, `endDate` (YYYY-MM-DD), optional `durationDays`.  
    Same response shape; `days` only in the given range (lighter on the backend).

See **`backend/backend_api_contracts.md`** for full request/response shapes.

---

## Frontend

### Environment

Create `frontend/.env`:

```env
EXPO_PUBLIC_API_URL=http://localhost:8080
```

### Install and run

```bash
cd frontend
npm install
npm run web    # or: npm run ios | npm run android
```

Web dev server runs at **`http://localhost:8081`** (or the next free port).

### Structure

- **`src/api/`** – API client (`client`, `search`, `deals`, `airports`).
- **`src/types/`** – Shared TypeScript types (session, flight option, segment, day deal, etc.).
- **`src/store/`** – Zustand stores for search and deals.
- **`src/features/flight-search/`** – Search form (with stay-duration picker and 14-day calendar with prices), results screen (sort/filter, expandable cards).
- **`src/features/monthly-deals/`** – Route + month + duration picker, best-deals list (first 10, then “Load more”).
- **`src/navigation/`** – Bottom tabs (Search, Monthly Deals) and stack (SearchForm → Results).

---

## Flows

1. **Search flights** – User enters origin/destination, picks stay duration and a date (calendar or manual), then searches. Frontend creates a session and navigates to Results, which polls for results and supports sort/filter and expandable details.
2. **Monthly deals** – User picks route, trip duration (days), and month. Sees a sorted list of best deals (cheapest first); first 10 shown, “Load more” for the rest. Tapping a deal starts a search for that date and opens Results.

---

## Notes

- No authentication in this version.
- Origin/destination are plain IATA codes; airport autocomplete can be wired later via `src/api/airports.ts`.
- Backend supports both full-month and short date-range deals so the calendar can show a small window (e.g. 14 days) without heavy load.

This README describes the **initial publishable version** of the project.
