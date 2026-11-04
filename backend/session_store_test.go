package main

import (
	"encoding/json"
	"os"
	"path/filepath"
	"testing"
	"time"
)

func initTestSessionDB(t *testing.T) {
	t.Helper()
	t.Setenv("SESSION_DB_PATH", filepath.Join(t.TempDir(), "sessions.db"))
	t.Setenv("SESSION_STORE_DIR", t.TempDir()) // isolate legacy-import scan
	if sessionDB != nil {
		_ = sessionDB.Close()
		sessionDB = nil
	}
	initSessionStore()
	if sessionDB == nil {
		t.Fatal("session DB failed to initialize")
	}
	t.Cleanup(func() {
		if sessionDB != nil {
			_ = sessionDB.Close()
			sessionDB = nil
		}
	})
}

func makeSessionResp(id string, createdAt time.Time) SearchSessionResultsResponse {
	return SearchSessionResultsResponse{
		Session: SearchSession{
			ID:        id,
			Status:    StatusComplete,
			CreatedAt: createdAt,
			Params: CreateSearchSessionRequest{
				Origin:        "TLV",
				Destination:   "VIE",
				DepartureDate: "2027-01-07",
				ReturnDate:    "2027-01-14",
				Adults:        1,
			},
		},
		Version: 1,
		Results: []FlightOption{{ID: "opt_0", CanonicalFingerprint: "fp_abc"}},
	}
}

// A shared link opened on another device (or after a restart / memory TTL) must
// still resolve to the exact same result set via the database.
func TestLoadSearchSessionFallsBackToDB(t *testing.T) {
	initTestSessionDB(t)

	id := "sess_db_fallback"
	persistSearchSession(makeSessionResp(id, time.Now().UTC()))

	// Simulate a fresh process: nothing in the in-memory map.
	sessionsMu.Lock()
	delete(sessions, id)
	sessionsMu.Unlock()

	got, ok := loadSearchSession(id)
	if !ok {
		t.Fatal("expected DB fallback to find the session")
	}
	if got.Session.ID != id || len(got.Results) != 1 || got.Results[0].ID != "opt_0" {
		t.Fatalf("DB snapshot mismatch: %+v", got)
	}
	if got.Session.Params.Origin != "TLV" || got.Session.Params.ReturnDate != "2027-01-14" {
		t.Fatalf("search params not preserved: %+v", got.Session.Params)
	}
	if got.Results[0].CanonicalFingerprint != "fp_abc" {
		t.Fatalf("canonical fingerprint not preserved: %+v", got.Results[0])
	}
}

// In-memory TTL expiry must not kill shared links: the DB record outlives it.
func TestLoadSearchSessionMemoryExpiredButInDB(t *testing.T) {
	initTestSessionDB(t)

	id := "sess_mem_expired"
	old := makeSessionResp(id, time.Now().UTC().Add(-2*searchSessionTTL()))
	persistSearchSession(old)

	sessionsMu.Lock()
	sessions[id] = old
	sessionsMu.Unlock()

	if got, ok := loadSearchSession(id); !ok || got.Session.ID != id {
		t.Fatalf("expected session past memory TTL to load from DB, got ok=%v", ok)
	}
}

// Default behavior: no retention limit — even very old sessions stay retrievable.
func TestSessionsKeptForeverByDefault(t *testing.T) {
	initTestSessionDB(t)
	os.Unsetenv("SESSION_RETENTION_HOURS")

	id := "sess_ancient"
	persistSearchSession(makeSessionResp(id, time.Now().UTC().Add(-90*24*time.Hour)))

	cleanupPersistedSessions() // must be a no-op with no retention configured

	if _, ok := loadPersistedSession(id); !ok {
		t.Fatal("expected 90-day-old session to load with unlimited retention")
	}
}

// Opt-in retention: records past the window are rejected on load and purged by cleanup.
func TestOptInRetention(t *testing.T) {
	initTestSessionDB(t)
	t.Setenv("SESSION_RETENTION_HOURS", "24")

	fresh := "sess_fresh"
	stale := "sess_stale"
	persistSearchSession(makeSessionResp(fresh, time.Now().UTC()))
	persistSearchSession(makeSessionResp(stale, time.Now().UTC().Add(-48*time.Hour)))

	if _, ok := loadPersistedSession(stale); ok {
		t.Fatal("expected session past retention to be rejected on load")
	}
	if _, ok := loadPersistedSession(fresh); !ok {
		t.Fatal("expected fresh session to load")
	}

	cleanupPersistedSessions()

	var n int
	if err := sessionDB.QueryRow(`SELECT COUNT(*) FROM search_sessions`).Scan(&n); err != nil {
		t.Fatal(err)
	}
	if n != 1 {
		t.Fatalf("expected cleanup to leave 1 row, got %d", n)
	}
}

// Booking tokens/deeplinks must survive persist → DB reload. json:"-" on those
// fields made open-jaw booking unfixable: every replica, restart, or TTL miss
// loaded a session with no checkout identity.
func TestPersistSearchSessionKeepsBookingTokens(t *testing.T) {
	initTestSessionDB(t)

	id := "sess_booking_tokens"
	resp := makeSessionResp(id, time.Now().UTC())
	resp.Results[0].BookingToken = "tok-full"
	resp.Results[0].LegBookingTokens = []string{"tok-leg0", "tok-leg1"}
	resp.Results[0].LegDeepLinks = []string{"https://ota.example/out", "https://ota.example/ret"}
	resp.Results[0].BookingURL = "https://ota.example/out"
	resp.Results[0].DeepLink = "https://ota.example/full"
	persistSearchSession(resp)

	sessionsMu.Lock()
	delete(sessions, id)
	sessionsMu.Unlock()

	got, ok := loadSearchSession(id)
	if !ok {
		t.Fatal("expected persisted session to load")
	}
	opt := got.Results[0]
	if opt.BookingToken != "tok-full" {
		t.Fatalf("BookingToken=%q", opt.BookingToken)
	}
	if len(opt.LegBookingTokens) != 2 || opt.LegBookingTokens[0] != "tok-leg0" || opt.LegBookingTokens[1] != "tok-leg1" {
		t.Fatalf("LegBookingTokens=%v", opt.LegBookingTokens)
	}
	if len(opt.LegDeepLinks) != 2 || opt.LegDeepLinks[0] != "https://ota.example/out" {
		t.Fatalf("LegDeepLinks=%v", opt.LegDeepLinks)
	}
	if opt.BookingURL != "https://ota.example/out" || opt.DeepLink != "https://ota.example/full" {
		t.Fatalf("urls booking=%q deep=%q", opt.BookingURL, opt.DeepLink)
	}

	public := sanitizeSessionForClient(got)
	if public.Results[0].BookingToken != "" || len(public.Results[0].LegBookingTokens) != 0 ||
		len(public.Results[0].LegDeepLinks) != 0 || public.Results[0].BookingURL != "" {
		t.Fatalf("client snapshot leaked booking internals: %+v", public.Results[0])
	}
	if public.Results[0].DeepLink != "https://ota.example/full" {
		t.Fatalf("public deepLink=%q", public.Results[0].DeepLink)
	}
	if got.Results[0].BookingToken != "tok-full" {
		t.Fatal("sanitizeSessionForClient must not mutate the stored session")
	}
}

// Re-persisting the same id must update the stored snapshot (upsert).
func TestPersistSearchSessionUpserts(t *testing.T) {
	initTestSessionDB(t)

	id := "sess_upsert"
	first := makeSessionResp(id, time.Now().UTC())
	persistSearchSession(first)

	second := first
	second.Version = 2
	second.Results = []FlightOption{{ID: "opt_0"}, {ID: "opt_1"}}
	persistSearchSession(second)

	got, ok := loadPersistedSession(id)
	if !ok {
		t.Fatal("expected upserted session to load")
	}
	if got.Version != 2 || len(got.Results) != 2 {
		t.Fatalf("expected latest snapshot, got version=%d results=%d", got.Version, len(got.Results))
	}
}

// Records written by the previous JSON-file store are imported on startup so
// links shared while it was live keep working.
func TestLegacyJSONImport(t *testing.T) {
	legacyDir := t.TempDir()
	id := "sess_legacy"
	resp := makeSessionResp(id, time.Now().UTC())
	data, err := json.Marshal(resp)
	if err != nil {
		t.Fatal(err)
	}
	if err := os.WriteFile(filepath.Join(legacyDir, id+".json"), data, 0o644); err != nil {
		t.Fatal(err)
	}

	t.Setenv("SESSION_DB_PATH", filepath.Join(t.TempDir(), "sessions.db"))
	t.Setenv("SESSION_STORE_DIR", legacyDir)
	if sessionDB != nil {
		_ = sessionDB.Close()
		sessionDB = nil
	}
	initSessionStore()
	if sessionDB == nil {
		t.Fatal("session DB failed to initialize")
	}
	t.Cleanup(func() {
		if sessionDB != nil {
			_ = sessionDB.Close()
			sessionDB = nil
		}
	})

	got, ok := loadPersistedSession(id)
	if !ok || got.Session.ID != id {
		t.Fatalf("expected legacy record to be imported, ok=%v", ok)
	}
	if _, err := os.Stat(filepath.Join(legacyDir, id+".json")); !os.IsNotExist(err) {
		t.Fatal("expected legacy file to be removed after import")
	}
}
