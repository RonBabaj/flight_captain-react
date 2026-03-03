# Flight Captain – Frontend

React Native + Expo frontend for the flight search engine (Skyscanner-style). Works on web (React Native Web), iOS, and Android.

## Setup

```bash
cd frontend
npm install
```

## Run

- **Web:** `npm run web`
- **iOS:** `npm run ios`
- **Android:** `npm run android`
- **Dev server only:** `npm start`

## Backend URL

The app calls the Go backend for search sessions, results, and monthly deals. Set the base URL:

- Create `.env` in `frontend/` with:
  ```env
  EXPO_PUBLIC_API_URL=http://localhost:8080
  ```
- Or configure in your Expo / build environment. Default is `http://localhost:8080`.

## Structure

- `src/api/` – API client (search sessions, results, month deals, airports). Isolated from UI.
- `src/types/` – TypeScript types aligned with backend API contracts.
- `src/store/` – Zustand state (search, deals).
- `src/features/flight-search/` – Search form and results screens.
- `src/features/monthly-deals/` – Month calendar and day → search flow.
- `src/navigation/` – React Navigation (tabs + stack).

## Main flows

1. **Flight Search** – Origin/destination, dates (one-way or round-trip), passengers, cabin class → create session → results with progressive loading, sort (price/duration), filter (stops), expandable details.
2. **Monthly Deals** – Route + month → calendar with lowest price per day → tap day → flight search for that date (navigates to results).

Backend contract: see `backend/backend_api_contracts.md`.
