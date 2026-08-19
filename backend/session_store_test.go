package main

import (
	"os"
	"path/filepath"
	"testing"
	"time"
)

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
// still resolve to the exact same result set via the disk store.
func TestLoadSearchSessionFallsBackToDisk(t *testing.T) {
	t.Setenv("SESSION_STORE_DIR", t.TempDir())

	id := "sess_disk_fallback"
	resp := makeSessionResp(id, time.Now().UTC())
	persistSearchSession(resp)

	// Simulate a fresh process: nothing in the in-memory map.
	sessionsMu.Lock()
	delete(sessions, id)
	sessionsMu.Unlock()

	got, ok := loadSearchSession(id)
	if !ok {
		t.Fatal("expected disk fallback to find the session")
	}
	if got.Session.ID != id || len(got.Results) != 1 || got.Results[0].ID != "opt_0" {
		t.Fatalf("disk snapshot mismatch: %+v", got)
	}
	if got.Session.Params.Origin != "TLV" || got.Session.Params.ReturnDate != "2027-01-14" {
		t.Fatalf("search params not preserved: %+v", got.Session.Params)
	}
	if got.Results[0].CanonicalFingerprint != "fp_abc" {
		t.Fatalf("canonical fingerprint not preserved: %+v", got.Results[0])
	}
}

// In-memory TTL expiry must no longer kill shared links: the disk record outlives it.
func TestLoadSearchSessionMemoryExpiredButOnDisk(t *testing.T) {
	t.Setenv("SESSION_STORE_DIR", t.TempDir())

	id := "sess_mem_expired"
	old := makeSessionResp(id, time.Now().UTC().Add(-2*searchSessionTTL))
	persistSearchSession(old)

	sessionsMu.Lock()
	sessions[id] = old
	sessionsMu.Unlock()

	got, ok := loadSearchSession(id)
	if !ok {
		t.Fatal("expected session past memory TTL to load from disk")
	}
	if got.Session.ID != id {
		t.Fatalf("wrong session: %+v", got.Session)
	}
}

// Records past the retention window are gone — this is the genuinely-expired case
// the frontend surfaces as "shared link expired".
func TestLoadSessionFromDiskRespectsRetention(t *testing.T) {
	dir := t.TempDir()
	t.Setenv("SESSION_STORE_DIR", dir)

	id := "sess_retention"
	stale := makeSessionResp(id, time.Now().UTC().Add(-sessionDiskRetention()-time.Hour))
	persistSearchSession(stale)

	if _, ok := loadSearchSession(id); ok {
		t.Fatal("expected session past retention to be rejected")
	}
	if _, err := os.Stat(filepath.Join(dir, id+".json")); !os.IsNotExist(err) {
		t.Fatal("expected stale record to be deleted on access")
	}
}

func TestSessionFilePathRejectsUnsafeIDs(t *testing.T) {
	for _, id := range []string{"", "../etc/passwd", "sess/../x", "sess x", "a/b"} {
		if _, ok := sessionFilePath(id); ok {
			t.Fatalf("expected unsafe id %q to be rejected", id)
		}
	}
	if _, ok := sessionFilePath("sess_Abc123-_"); !ok {
		t.Fatal("expected normal session id to be accepted")
	}
}

func TestCleanupSessionDisk(t *testing.T) {
	dir := t.TempDir()
	t.Setenv("SESSION_STORE_DIR", dir)

	fresh := makeSessionResp("sess_fresh", time.Now().UTC())
	persistSearchSession(fresh)
	stale := makeSessionResp("sess_stale", time.Now().UTC().Add(-sessionDiskRetention()-time.Hour))
	persistSearchSession(stale)
	stalePath := filepath.Join(dir, "sess_stale.json")
	oldTime := time.Now().Add(-sessionDiskRetention() - time.Hour)
	if err := os.Chtimes(stalePath, oldTime, oldTime); err != nil {
		t.Fatal(err)
	}

	cleanupSessionDisk()

	if _, err := os.Stat(filepath.Join(dir, "sess_fresh.json")); err != nil {
		t.Fatalf("fresh record should survive cleanup: %v", err)
	}
	if _, err := os.Stat(stalePath); !os.IsNotExist(err) {
		t.Fatal("stale record should be removed by cleanup")
	}
}
