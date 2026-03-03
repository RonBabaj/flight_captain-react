# Flight Captain Backend

HTTP API for the Flight Captain web app (flight search, deals, airport autocomplete).

## Run the web API (for local frontend development)

From this directory:

```bash
go run .
```

This starts the server on **http://localhost:8080** with routes including:

- `POST /api/search/sessions` – create search session
- `GET /api/search/sessions/{id}` – poll results
- `GET /api/deals/month` – monthly deals
- `GET /api/flights/details` – flight details
- **`GET /api/airports/search?q=...&limit=...`** – airport/city autocomplete (used by From/To fields)

Ensure the frontend is configured to use this URL (e.g. `EXPO_PUBLIC_API_URL=http://localhost:8080` in `frontend/.env`).

> **Note:** `main.go` is build-ignored (Telegram bot). Use `go run .` so the web API in `server.go` is used.
