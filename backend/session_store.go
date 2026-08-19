package main

import (
	"encoding/json"
	"log"
	"os"
	"path/filepath"
	"regexp"
	"strconv"
	"time"
)

// Durable, disk-backed store for search session snapshots.
//
// The in-memory `sessions` map is a hot cache with a short TTL (searchSessionTTL).
// That alone made shared URLs break: a sessionId in a link opened on another
// device, after 25 minutes, or after a server restart hit a map miss and 404ed.
//
// This store makes the sessionId in a shared URL a durable public identifier:
// every session snapshot is persisted to disk when created, and loadSearchSession
// falls back to disk on a memory miss. Any browser, device, or app context can
// GET the exact same result set for the retention window with no client-side
// state involved. Existing URLs keep working unchanged (same id, same endpoint).

const defaultSessionRetention = 7 * 24 * time.Hour

// Session ids are randomID("sess_") — letters/digits/underscore. The pattern also
// guards against path traversal since the id becomes a file name.
var sessionIDPattern = regexp.MustCompile(`^[A-Za-z0-9_-]{1,80}$`)

func sessionStoreDir() string {
	if dir := os.Getenv("SESSION_STORE_DIR"); dir != "" {
		return dir
	}
	return filepath.Join("data", "sessions")
}

// sessionDiskRetention returns how long persisted snapshots stay retrievable.
// Configurable via SESSION_RETENTION_HOURS; defaults to 7 days.
func sessionDiskRetention() time.Duration {
	if raw := os.Getenv("SESSION_RETENTION_HOURS"); raw != "" {
		if h, err := strconv.Atoi(raw); err == nil && h > 0 {
			return time.Duration(h) * time.Hour
		}
	}
	return defaultSessionRetention
}

func sessionFilePath(id string) (string, bool) {
	if !sessionIDPattern.MatchString(id) {
		return "", false
	}
	return filepath.Join(sessionStoreDir(), id+".json"), true
}

// persistSearchSession writes the session snapshot atomically (tmp file + rename).
// Failures are logged and non-fatal: the API keeps serving from memory.
func persistSearchSession(resp SearchSessionResultsResponse) {
	path, ok := sessionFilePath(resp.Session.ID)
	if !ok {
		return
	}
	if err := os.MkdirAll(sessionStoreDir(), 0o755); err != nil {
		log.Printf("[SESSION_STORE] mkdir %s failed: %v", sessionStoreDir(), err)
		return
	}
	data, err := json.Marshal(resp)
	if err != nil {
		log.Printf("[SESSION_STORE] marshal %s failed: %v", resp.Session.ID, err)
		return
	}
	tmp := path + ".tmp"
	if err := os.WriteFile(tmp, data, 0o644); err != nil {
		log.Printf("[SESSION_STORE] write %s failed: %v", tmp, err)
		return
	}
	if err := os.Rename(tmp, path); err != nil {
		log.Printf("[SESSION_STORE] rename %s failed: %v", path, err)
	}
}

// loadSessionFromDisk returns the persisted snapshot when it exists and is
// within the retention window. Records past retention are deleted on access.
func loadSessionFromDisk(id string) (SearchSessionResultsResponse, bool) {
	path, ok := sessionFilePath(id)
	if !ok {
		return SearchSessionResultsResponse{}, false
	}
	data, err := os.ReadFile(path)
	if err != nil {
		return SearchSessionResultsResponse{}, false
	}
	var resp SearchSessionResultsResponse
	if err := json.Unmarshal(data, &resp); err != nil || resp.Session.ID != id {
		return SearchSessionResultsResponse{}, false
	}
	if time.Since(resp.Session.CreatedAt) > sessionDiskRetention() {
		_ = os.Remove(path)
		return SearchSessionResultsResponse{}, false
	}
	return resp, true
}

// cleanupSessionDisk removes persisted snapshots older than the retention window.
// Snapshots are written once at creation, so file mtime ≈ session CreatedAt.
func cleanupSessionDisk() {
	entries, err := os.ReadDir(sessionStoreDir())
	if err != nil {
		return
	}
	cutoff := time.Now().Add(-sessionDiskRetention())
	for _, e := range entries {
		if e.IsDir() || filepath.Ext(e.Name()) != ".json" {
			continue
		}
		info, err := e.Info()
		if err != nil {
			continue
		}
		if info.ModTime().Before(cutoff) {
			_ = os.Remove(filepath.Join(sessionStoreDir(), e.Name()))
		}
	}
}
