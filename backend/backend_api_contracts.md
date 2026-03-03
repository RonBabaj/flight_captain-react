### Backend HTTP API Contracts (Go ↔ React Native)

This document specifies the HTTP-facing contracts that the Go backend should expose for the new React Native / React Native Web frontend. It reuses the existing Amadeus integration and Telegram bot logic conceptually, but presents a **clean, session-oriented HTTP API** suitable for a Skyscanner-like UI.

The backend remains the single source of truth for all flight data and never exposes raw Amadeus details directly to the frontend.

---

### 1. Flight Search Sessions

#### 1.1 Create Search Session

- **Method**: `POST`
- **Path**: `/api/search/sessions`
- **Description**: Start a new flight search session. The backend immediately queues work to fetch results from Amadeus and normalizes them into a frontend-friendly structure. Results are retrieved progressively via polling (or streaming in a future iteration).

**Request body (JSON)**

```json
{
  "origin": "TLV",
  "destination": "HND",
  "departureDate": "2026-04-15",
  "returnDate": "2026-04-22",
  "cabinClass": "ECONOMY",
  "adults": 1,
  "children": 0,
  "infants": 0,
  "currency": "USD",
  "locale": "en-US"
}
```

**Semantic rules**

- `origin` / `destination`: airport IATA or city code. Backend is responsible for resolving to exact search parameters.
- `departureDate`: required, `YYYY-MM-DD`.
- `returnDate`: optional; when omitted, the search is one-way.
- Passenger counts: `adults >= 1`. `children` and `infants` default to `0` if omitted.
- `currency` and `locale` are hints; backend resolves to supported values.

**Example Go structs**

```go
// Search session creation payload.
type CreateSearchSessionRequest struct {
	Origin        string `json:"origin"`                  // IATA or city code
	Destination   string `json:"destination"`             // IATA or city code
	DepartureDate string `json:"departureDate"`           // YYYY-MM-DD
	ReturnDate    string `json:"returnDate,omitempty"`    // YYYY-MM-DD
	CabinClass    string `json:"cabinClass"`              // ECONOMY, PREMIUM_ECONOMY, BUSINESS, FIRST
	Adults        int    `json:"adults"`                  // >= 1
	Children      int    `json:"children,omitempty"`      // >= 0
	Infants       int    `json:"infants,omitempty"`       // >= 0
	Currency      string `json:"currency,omitempty"`      // e.g. USD
	Locale        string `json:"locale,omitempty"`        // e.g. en-US
}

type SearchSessionStatus string

const (
	SearchStatusPending  SearchSessionStatus = "PENDING"
	SearchStatusPartial  SearchSessionStatus = "PARTIAL"
	SearchStatusComplete SearchSessionStatus = "COMPLETE"
	SearchStatusFailed   SearchSessionStatus = "FAILED"
)

type SearchSession struct {
	ID        string              `json:"id"`
	Status    SearchSessionStatus `json:"status"`
	CreatedAt time.Time           `json:"createdAt"`
	Params    CreateSearchSessionRequest `json:"params"`
	ExpiresAt *time.Time          `json:"expiresAt,omitempty"`
}
```

**Response (JSON)**

```json
{
  "id": "sess_abc123",
  "status": "PENDING",
  "createdAt": "2026-04-01T12:34:56Z",
  "params": { /* echoed sanitized request */ },
  "expiresAt": "2026-04-01T13:34:56Z"
}
```

---

#### 1.2 Get Search Session Status & Results

- **Method**: `GET`
- **Path**: `/api/search/sessions/{id}`
- **Query params**:
  - `sinceVersion` (optional, integer) – if provided, backend MAY return only newer results.

**Response shape**

```json
{
  "session": {
    "id": "sess_abc123",
    "status": "PARTIAL",
    "createdAt": "2026-04-01T12:34:56Z",
    "params": { /* CreateSearchSessionRequest */ },
    "expiresAt": "2026-04-01T13:34:56Z"
  },
  "version": 3,
  "results": [
    {
      "id": "opt_1",
      "price": { "currency": "USD", "amount": 845.25 },
      "durationMinutes": 840,
      "legs": [
        { "segments": [ /* FlightSegment */ ] },
        { "segments": [ /* return leg for round-trip */ ] }
      ],
      "score": 0.91,
      "provider": "Amadeus"
    }
  ]
}
```

**Example Go structs**

```go
type MonetaryAmount struct {
	Currency string  `json:"currency"`
	Amount   float64 `json:"amount"`
}

type Carrier struct {
	Code string `json:"code"`           // IATA/ICAO
	Name string `json:"name,omitempty"` // Human readable
}

type AirportLike struct {
	Code        string `json:"code"`                  // IATA
	CityCode    string `json:"cityCode,omitempty"`
	Name        string `json:"name,omitempty"`
	CityName    string `json:"cityName,omitempty"`
	CountryCode string `json:"countryCode,omitempty"`
}

type FlightSegment struct {
	From            AirportLike `json:"from"`
	To              AirportLike `json:"to"`
	DepartureTime   time.Time   `json:"departureTime"`
	ArrivalTime     time.Time   `json:"arrivalTime"`
	MarketingCarrier Carrier    `json:"marketingCarrier"`
	OperatingCarrier *Carrier   `json:"operatingCarrier,omitempty"`
	FlightNumber    string      `json:"flightNumber"`
	DurationMinutes int         `json:"durationMinutes"`
	CabinClass      string      `json:"cabinClass"`
	BookingClass    string      `json:"bookingClass,omitempty"`
}

type FlightLeg struct {
	Segments []FlightSegment `json:"segments"`
}

type FlightOption struct {
	ID              string         `json:"id"`
	Price           MonetaryAmount `json:"price"`
	DurationMinutes int            `json:"durationMinutes"`
	Legs            []FlightLeg    `json:"legs"`
	Score           float64        `json:"score,omitempty"`
	Provider        string         `json:"provider,omitempty"`
}

type SearchSessionResultsResponse struct {
	Session SearchSession  `json:"session"`
	Version int64          `json:"version"`
	Results []FlightOption `json:"results"`
}
```

**Progressive results behavior**

- Immediately after session creation, `GET /api/search/sessions/{id}` returns `status = PENDING` and an empty `results` array.
- As results are discovered from Amadeus, the backend:
  - Updates its internal store (`flightStore`-equivalent keyed by session id).
  - Increments `version`.
  - Adds/updates `FlightOption` items.
- The frontend **polls every 1–2 seconds** until `status` becomes `COMPLETE` or `FAILED`.
- In the future, this can be extended with:
  - `GET /api/search/sessions/{id}/stream` using SSE or websockets, keeping the same `FlightOption` shape.

---

#### 1.3 Cancel Search Session (Optional, MVP+)

- **Method**: `POST`
- **Path**: `/api/search/sessions/{id}/cancel`
- **Behavior**:
  - Mark the session as cancelled.
  - Stop background Amadeus polling (if any).
  - Future calls to `GET /api/search/sessions/{id}` return `status = FAILED` or `CANCELLED`.

---

### 2. Monthly Deals API

The existing `/month_deals` Telegram command becomes a proper HTTP endpoint that returns **cheapest prices per day** for a given month and fixed stay duration, normalized into lightweight frontend-friendly JSON.

#### 2.1 Get Monthly Deals

- **Method**: `GET`
- **Path**: `/api/deals/month`
- **Query parameters**:
  - `origin`: airport or city code (e.g. `TLV`).
  - `destination`: airport or city code (e.g. `HND`).
  - `year`: integer (e.g. `2026`).
  - `month`: integer `1-12`.
  - `durationDays` (optional, default e.g. `7`): stay length in days.

**Response**

```json
{
  "route": {
    "origin": { "code": "TLV", "cityCode": "TLV", "name": "Ben Gurion Intl" },
    "destination": { "code": "HND", "cityCode": "TYO", "name": "Tokyo Haneda" }
  },
  "year": 2026,
  "month": 4,
  "currency": "USD",
  "days": [
    {
      "date": "2026-04-01",
      "lowestPrice": { "currency": "USD", "amount": 845.25 }
    },
    {
      "date": "2026-04-02"
      // No price field means no flights / not available
    }
  ]
}
```

**Example Go structs**

```go
type DayDeal struct {
	Date        string          `json:"date"`                  // YYYY-MM-DD
	LowestPrice *MonetaryAmount `json:"lowestPrice,omitempty"` // nil if no flights that day
	SampleID    string          `json:"sampleOptionId,omitempty"`
}

type MonthDealsResponse struct {
	Route struct {
		Origin      AirportLike `json:"origin"`
		Destination AirportLike `json:"destination"`
	} `json:"route"`
	Year     int        `json:"year"`
	Month    int        `json:"month"` // 1–12
	Currency string     `json:"currency"`
	Days     []DayDeal  `json:"days"`
}
```

**Implementation notes**

- Reuse `SearchMonthDeals` in `amadeus_api.go` to generate `FullRoundTrip` items.
- For each outbound date within the month:
  - Assess combined round-trip price using `extractRawPrice`.
  - Fill `DayDeal.LowestPrice` with the minimum encountered `TotalCost`.
- Cache results per `(origin, destination, year, month, durationDays)` to avoid hitting Amadeus excessively.

---

### 3. Airport & City Autocomplete

This endpoint powers the origin/destination pickers in the frontend. It may be backed by:
- Amadeus locations API.
- A static / semi-static airport dataset.
- A mix plus in-memory cache.

#### 3.1 Search Airports & Cities

- **Method**: `GET`
- **Path**: `/api/airports/search`
- **Query parameters**:
  - `q`: search query (partial name, airport code, or city).
  - `limit` (optional): maximum number of items to return (default e.g. 10–20).

**Response**

```json
{
  "items": [
    {
      "id": "TLV",
      "type": "AIRPORT",
      "airportCode": "TLV",
      "cityCode": "TLV",
      "name": "Ben Gurion Intl",
      "cityName": "Tel Aviv",
      "countryCode": "IL"
    },
    {
      "id": "TYO",
      "type": "CITY",
      "cityCode": "TYO",
      "name": "Tokyo",
      "countryCode": "JP"
    }
  ]
}
```

**Example Go structs**

```go
type AirportCityType string

const (
	AirportType AirportCityType = "AIRPORT"
	CityType    AirportCityType = "CITY"
)

type AirportCityResult struct {
	ID          string          `json:"id"`
	Type        AirportCityType `json:"type"`
	AirportCode string          `json:"airportCode,omitempty"`
	CityCode    string          `json:"cityCode,omitempty"`
	Name        string          `json:"name"`
	CityName    string          `json:"cityName,omitempty"`
	CountryCode string          `json:"countryCode,omitempty"`
}

type AirportCitySearchResponse struct {
	Items []AirportCityResult `json:"items"`
}
```

---

### 4. High-Level Handler Layout (Go)

For clarity, the Go HTTP server might expose handlers along these lines, wrapping the existing Amadeus client and bot-centric logic:

```go
func main() {
	// Existing Telegram bot startup stays (or is gradually retired).
	// Add an HTTP server (can run on a separate port/process) exposing the new APIs.

	mux := http.NewServeMux()

	mux.HandleFunc("/api/search/sessions", handleSearchSessions)          // POST create, GET list (future)
	mux.HandleFunc("/api/search/sessions/", handleSearchSessionByID)     // GET status/results, POST cancel
	mux.HandleFunc("/api/deals/month", handleMonthDeals)                 // GET monthly deals
	mux.HandleFunc("/api/airports/search", handleAirportCitySearch)      // GET autocomplete

	log.Fatal(http.ListenAndServe(":8080", mux))
}
```

The actual router choice is up to you (standard library, chi, gin, etc.), but the public **paths and JSON shapes above should remain stable** so the React Native frontend can rely on them as a contract.

---

### 5. Guarantees to the Frontend

- **Stability**: Once these endpoints are live, any breaking JSON/schema changes should be versioned (e.g. `/api/v2/...`).
- **Normalization**: Backend always normalizes Amadeus responses into:
  - `FlightOption`, `FlightLeg`, `FlightSegment`, `AirportLike`, `Carrier`, `MonetaryAmount`.
- **Session semantics**:
  - A `SearchSession` is immutable in its parameters after creation.
  - Results may grow over time (PENDING → PARTIAL → COMPLETE).
  - Sessions may expire; expired sessions MUST return clear `status = FAILED` or HTTP `410 Gone`.
- **Caching**:
  - Month deals and possibly search results may be cached internally, but the cache layer is invisible to the client.

These contracts are the foundation for the React Native + Web frontend to behave like a proper client-side flight search engine while keeping the Go backend authoritative and future-proof.

