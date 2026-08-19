package main

import (
	"database/sql"
	"encoding/json"
	"log"
	"os"
	"path/filepath"
	"strconv"
	"strings"
	"time"

	_ "modernc.org/sqlite"
)

// Durable SQLite-backed store for search session snapshots.
//
// The in-memory `sessions` map is a hot cache with a short TTL (searchSessionTTL).
// That alone made shared URLs break: a sessionId in a link opened on another
// device, after 25 minutes, or after a server restart hit a map miss and 404ed.
//
// This store makes the sessionId in a shared URL a durable public identifier:
// every session snapshot is written to the database when created, and
// loadSearchSession falls back to it on a memory miss. Any browser, device, or
// app context can GET the exact same result set with no client-side state
// involved — and, unlike the earlier JSON-file store, records are kept FOREVER
// by default. Retention is opt-in via SESSION_RETENTION_HOURS.
//
// Config:
//   SESSION_DB_PATH         — SQLite file location (default data/sessions.db)
//   SESSION_RETENTION_HOURS — optional; when > 0, records older than this are
//                             purged by the periodic cleanup. Unset/0 = keep all.
//   SESSION_STORE_DIR       — legacy JSON-file store location; any records found
//                             there are imported into the database on startup.

var sessionDB *sql.DB

func sessionDBPath() string {
	if p := os.Getenv("SESSION_DB_PATH"); p != "" {
		return p
	}
	return filepath.Join("data", "sessions.db")
}

// sessionRetention returns how long persisted snapshots are kept.
// Zero means unlimited (the default).
func sessionRetention() time.Duration {
	if raw := os.Getenv("SESSION_RETENTION_HOURS"); raw != "" {
		if h, err := strconv.Atoi(raw); err == nil && h > 0 {
			return time.Duration(h) * time.Hour
		}
	}
	return 0
}

// initSessionStore opens (or creates) the session database. Failures are logged
// and non-fatal: the API keeps working from the in-memory cache alone.
func initSessionStore() {
	path := sessionDBPath()
	if dir := filepath.Dir(path); dir != "." {
		if err := os.MkdirAll(dir, 0o755); err != nil {
			log.Printf("[SESSION_DB] mkdir %s failed: %v", dir, err)
			return
		}
	}
	// WAL allows the HTTP handlers to read while a search persists a new row;
	// busy_timeout avoids spurious SQLITE_BUSY under concurrent writes.
	db, err := sql.Open("sqlite", path+"?_pragma=journal_mode(WAL)&_pragma=busy_timeout(5000)")
	if err != nil {
		log.Printf("[SESSION_DB] open %s failed: %v", path, err)
		return
	}
	if _, err := db.Exec(`CREATE TABLE IF NOT EXISTS search_sessions (
		id         TEXT PRIMARY KEY,
		created_at INTEGER NOT NULL, -- unix seconds
		data       TEXT NOT NULL     -- SearchSessionResultsResponse JSON
	)`); err != nil {
		log.Printf("[SESSION_DB] create table failed: %v", err)
		_ = db.Close()
		return
	}
	if _, err := db.Exec(`CREATE INDEX IF NOT EXISTS idx_search_sessions_created_at
		ON search_sessions (created_at)`); err != nil {
		log.Printf("[SESSION_DB] create index failed: %v", err)
	}
	sessionDB = db
	importLegacyJSONSessions()
}

// importLegacyJSONSessions migrates records written by the previous JSON-file
// store (one .json per session under SESSION_STORE_DIR) into the database, so
// links shared while that store was live keep working. Files are removed after
// a successful import; the whole step is a no-op when the directory is absent.
func importLegacyJSONSessions() {
	dir := os.Getenv("SESSION_STORE_DIR")
	if dir == "" {
		dir = filepath.Join("data", "sessions")
	}
	entries, err := os.ReadDir(dir)
	if err != nil {
		return
	}
	imported := 0
	for _, e := range entries {
		if e.IsDir() || !strings.HasSuffix(e.Name(), ".json") {
			continue
		}
		p := filepath.Join(dir, e.Name())
		data, err := os.ReadFile(p)
		if err != nil {
			continue
		}
		var resp SearchSessionResultsResponse
		if err := json.Unmarshal(data, &resp); err != nil || resp.Session.ID == "" {
			continue
		}
		if _, err := sessionDB.Exec(
			`INSERT OR IGNORE INTO search_sessions (id, created_at, data) VALUES (?, ?, ?)`,
			resp.Session.ID, resp.Session.CreatedAt.Unix(), string(data),
		); err != nil {
			log.Printf("[SESSION_DB] legacy import %s failed: %v", e.Name(), err)
			continue
		}
		_ = os.Remove(p)
		imported++
	}
	if imported > 0 {
		log.Printf("[SESSION_DB] imported %d legacy JSON session(s) from %s", imported, dir)
	}
}

// persistSearchSession upserts the session snapshot. Failures are logged and
// non-fatal: the API still serves the session from memory.
func persistSearchSession(resp SearchSessionResultsResponse) {
	if sessionDB == nil || resp.Session.ID == "" {
		return
	}
	data, err := json.Marshal(resp)
	if err != nil {
		log.Printf("[SESSION_DB] marshal %s failed: %v", resp.Session.ID, err)
		return
	}
	if _, err := sessionDB.Exec(
		`INSERT OR REPLACE INTO search_sessions (id, created_at, data) VALUES (?, ?, ?)`,
		resp.Session.ID, resp.Session.CreatedAt.Unix(), string(data),
	); err != nil {
		log.Printf("[SESSION_DB] persist %s failed: %v", resp.Session.ID, err)
	}
}

// loadPersistedSession returns the stored snapshot for id, if any. When a
// retention window is configured, records past it are treated as gone.
func loadPersistedSession(id string) (SearchSessionResultsResponse, bool) {
	if sessionDB == nil || id == "" {
		return SearchSessionResultsResponse{}, false
	}
	var data string
	var createdAt int64
	err := sessionDB.QueryRow(
		`SELECT data, created_at FROM search_sessions WHERE id = ?`, id,
	).Scan(&data, &createdAt)
	if err != nil {
		if err != sql.ErrNoRows {
			log.Printf("[SESSION_DB] load %s failed: %v", id, err)
		}
		return SearchSessionResultsResponse{}, false
	}
	if r := sessionRetention(); r > 0 && time.Since(time.Unix(createdAt, 0)) > r {
		return SearchSessionResultsResponse{}, false
	}
	var resp SearchSessionResultsResponse
	if err := json.Unmarshal([]byte(data), &resp); err != nil || resp.Session.ID != id {
		return SearchSessionResultsResponse{}, false
	}
	return resp, true
}

// cleanupPersistedSessions purges records older than the retention window.
// With no retention configured (the default) nothing is ever deleted.
func cleanupPersistedSessions() {
	if sessionDB == nil {
		return
	}
	r := sessionRetention()
	if r <= 0 {
		return
	}
	cutoff := time.Now().Add(-r).Unix()
	if _, err := sessionDB.Exec(
		`DELETE FROM search_sessions WHERE created_at < ?`, cutoff,
	); err != nil {
		log.Printf("[SESSION_DB] cleanup failed: %v", err)
	}
}
