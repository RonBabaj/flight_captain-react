package main

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"
	"os"
	"strconv"
	"strings"
	"sync"
)

// RuntimeConfig holds tunable timing values served to the frontend (and optionally
// read by the backend). Defaults match the previous hardcoded constants.
type RuntimeConfig struct {
	PollIntervalMs              int `json:"pollIntervalMs"`
	SlowResultsPopupDelayMs       int `json:"slowResultsPopupDelayMs"`
	PositioningBudgetMs         int `json:"positioningBudgetMs"`
	PositioningPollIntervalMs   int `json:"positioningPollIntervalMs"`
	PositioningPollMaxAttempts  int `json:"positioningPollMaxAttempts"`
	ExplorePrefetchTimeoutMs    int `json:"explorePrefetchTimeoutMs"`
	ExploreLiveTimeoutMs        int `json:"exploreLiveTimeoutMs"`
	AirportAutocompleteDebounce int `json:"airportAutocompleteDebounceMs"`
	DatePickerDuplicateTapMs    int `json:"datePickerDuplicateTapMs"`
	ResultsCacheTtlMs           int `json:"resultsCacheTtlMs"`
	ResultsStorageTtlMs         int `json:"resultsStorageTtlMs"`
	ExchangeRatesRefreshMs      int `json:"exchangeRatesRefreshMs"`
	ApiRequestDefaultTimeoutMs  int `json:"apiRequestDefaultTimeoutMs"`
	SearchSessionTtlMinutes     int `json:"searchSessionTtlMinutes"`
	MonthDealsCacheTtlMinutes   int `json:"monthDealsCacheTtlMinutes"`
}

type runtimeConfigBounds struct {
	min int
	max int
}

var runtimeConfigFieldBounds = map[string]runtimeConfigBounds{
	"pollIntervalMs":              {500, 10_000},
	"slowResultsPopupDelayMs":     {5_000, 600_000},
	"positioningBudgetMs":         {10_000, 300_000},
	"positioningPollIntervalMs":   {500, 10_000},
	"positioningPollMaxAttempts":  {1, 30},
	"explorePrefetchTimeoutMs":    {5_000, 120_000},
	"exploreLiveTimeoutMs":        {10_000, 300_000},
	"airportAutocompleteDebounceMs": {100, 2_000},
	"datePickerDuplicateTapMs":    {100, 2_000},
	"resultsCacheTtlMs":           {60_000, 86_400_000},
	"resultsStorageTtlMs":         {3_600_000, 604_800_000},
	"exchangeRatesRefreshMs":      {300_000, 86_400_000},
	"apiRequestDefaultTimeoutMs":  {30_000, 600_000},
	"searchSessionTtlMinutes":     {5, 240},
	"monthDealsCacheTtlMinutes":   {1, 240},
}

func defaultRuntimeConfig() RuntimeConfig {
	return RuntimeConfig{
		PollIntervalMs:              1500,
		SlowResultsPopupDelayMs:     60_000,
		PositioningBudgetMs:         45_000,
		PositioningPollIntervalMs:   1500,
		PositioningPollMaxAttempts:  6,
		ExplorePrefetchTimeoutMs:    15_000,
		ExploreLiveTimeoutMs:        35_000,
		AirportAutocompleteDebounce: 300,
		DatePickerDuplicateTapMs:    400,
		ResultsCacheTtlMs:           5 * 60 * 1000,
		ResultsStorageTtlMs:         24 * 60 * 60 * 1000,
		ExchangeRatesRefreshMs:      60 * 60 * 1000,
		ApiRequestDefaultTimeoutMs:  90_000,
		SearchSessionTtlMinutes:     25,
		MonthDealsCacheTtlMinutes:   15,
	}
}

var (
	runtimeConfigMu sync.RWMutex
	runtimeConfig   = defaultRuntimeConfig()
)

func initRuntimeConfigStore() {
	if sessionDB == nil {
		return
	}
	if _, err := sessionDB.Exec(`CREATE TABLE IF NOT EXISTS runtime_config (
		id   INTEGER PRIMARY KEY CHECK (id = 1),
		data TEXT NOT NULL
	)`); err != nil {
		log.Printf("[RUNTIME_CONFIG] create table failed: %v", err)
		return
	}
	var raw sql.NullString
	err := sessionDB.QueryRow(`SELECT data FROM runtime_config WHERE id = 1`).Scan(&raw)
	if err == sql.ErrNoRows {
		persistRuntimeConfigLocked()
		return
	}
	if err != nil {
		log.Printf("[RUNTIME_CONFIG] load failed: %v", err)
		return
	}
	if !raw.Valid || strings.TrimSpace(raw.String) == "" {
		return
	}
	var loaded RuntimeConfig
	if err := json.Unmarshal([]byte(raw.String), &loaded); err != nil {
		log.Printf("[RUNTIME_CONFIG] decode failed: %v", err)
		return
	}
	if err := validateRuntimeConfig(loaded); err != nil {
		log.Printf("[RUNTIME_CONFIG] stored config invalid, using defaults: %v", err)
		return
	}
	runtimeConfig = loaded
	log.Printf("[RUNTIME_CONFIG] loaded overrides from database")
}

func persistRuntimeConfigLocked() {
	if sessionDB == nil {
		return
	}
	raw, err := json.Marshal(runtimeConfig)
	if err != nil {
		log.Printf("[RUNTIME_CONFIG] encode failed: %v", err)
		return
	}
	_, err = sessionDB.Exec(
		`INSERT INTO runtime_config (id, data) VALUES (1, ?)
		 ON CONFLICT(id) DO UPDATE SET data = excluded.data`,
		string(raw),
	)
	if err != nil {
		log.Printf("[RUNTIME_CONFIG] persist failed: %v", err)
	}
}

func getRuntimeConfig() RuntimeConfig {
	runtimeConfigMu.RLock()
	defer runtimeConfigMu.RUnlock()
	return runtimeConfig
}

func setRuntimeConfig(next RuntimeConfig) error {
	if err := validateRuntimeConfig(next); err != nil {
		return err
	}
	runtimeConfigMu.Lock()
	runtimeConfig = next
	persistRuntimeConfigLocked()
	runtimeConfigMu.Unlock()
	return nil
}

func validateRuntimeConfig(cfg RuntimeConfig) error {
	check := func(name string, value int) error {
		b, ok := runtimeConfigFieldBounds[name]
		if !ok {
			return nil
		}
		if value < b.min || value > b.max {
			return errConfigOutOfRange(name, value, b.min, b.max)
		}
		return nil
	}
	checks := []struct {
		name  string
		value int
	}{
		{"pollIntervalMs", cfg.PollIntervalMs},
		{"slowResultsPopupDelayMs", cfg.SlowResultsPopupDelayMs},
		{"positioningBudgetMs", cfg.PositioningBudgetMs},
		{"positioningPollIntervalMs", cfg.PositioningPollIntervalMs},
		{"positioningPollMaxAttempts", cfg.PositioningPollMaxAttempts},
		{"explorePrefetchTimeoutMs", cfg.ExplorePrefetchTimeoutMs},
		{"exploreLiveTimeoutMs", cfg.ExploreLiveTimeoutMs},
		{"airportAutocompleteDebounceMs", cfg.AirportAutocompleteDebounce},
		{"datePickerDuplicateTapMs", cfg.DatePickerDuplicateTapMs},
		{"resultsCacheTtlMs", cfg.ResultsCacheTtlMs},
		{"resultsStorageTtlMs", cfg.ResultsStorageTtlMs},
		{"exchangeRatesRefreshMs", cfg.ExchangeRatesRefreshMs},
		{"apiRequestDefaultTimeoutMs", cfg.ApiRequestDefaultTimeoutMs},
		{"searchSessionTtlMinutes", cfg.SearchSessionTtlMinutes},
		{"monthDealsCacheTtlMinutes", cfg.MonthDealsCacheTtlMinutes},
	}
	for _, c := range checks {
		if err := check(c.name, c.value); err != nil {
			return err
		}
	}
	return nil
}

type configRangeError struct {
	field string
	value int
	min   int
	max   int
}

func errConfigOutOfRange(field string, value, min, max int) error {
	return &configRangeError{field: field, value: value, min: min, max: max}
}

func (e *configRangeError) Error() string {
	return e.field + " must be between " + strconv.Itoa(e.min) + " and " + strconv.Itoa(e.max)
}

func adminTokenConfigured() bool {
	return strings.TrimSpace(os.Getenv("ADMIN_TOKEN")) != ""
}

func adminTokenFromHeader(r *http.Request) string {
	return strings.TrimSpace(r.Header.Get("X-Admin-Token"))
}

func handleGetRuntimeConfig(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		writeJSON(w, http.StatusMethodNotAllowed, map[string]string{"error": "method not allowed"})
		return
	}
	writeJSON(w, http.StatusOK, getRuntimeConfig())
}

func handleAdminVerify(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		writeJSON(w, http.StatusMethodNotAllowed, map[string]string{"error": "method not allowed"})
		return
	}
	// Legacy shared-token verify (deprecated — prefer POST /api/auth/login).
	if adminTokenConfigured() {
		var body struct {
			Token string `json:"token"`
		}
		if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
			writeJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid JSON body"})
			return
		}
		expected := strings.TrimSpace(os.Getenv("ADMIN_TOKEN"))
		if strings.TrimSpace(body.Token) == expected {
			writeJSON(w, http.StatusOK, map[string]any{"ok": true, "role": "admin"})
			return
		}
	}
	writeJSON(w, http.StatusUnauthorized, map[string]any{"ok": false, "role": "guest"})
}

func handleAdminRuntimeConfig(w http.ResponseWriter, r *http.Request) {
	if !adminAccessConfigured() {
		writeJSON(w, http.StatusServiceUnavailable, map[string]string{"error": "admin access is not configured on this server"})
		return
	}
	switch r.Method {
	case http.MethodGet:
		if !isAdminRequest(r) {
			writeJSON(w, http.StatusUnauthorized, map[string]string{"error": "unauthorized"})
			return
		}
		writeJSON(w, http.StatusOK, getRuntimeConfig())
	case http.MethodPut:
		if !isAdminRequest(r) {
			writeJSON(w, http.StatusUnauthorized, map[string]string{"error": "unauthorized"})
			return
		}
		var next RuntimeConfig
		if err := json.NewDecoder(r.Body).Decode(&next); err != nil {
			writeJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid JSON body"})
			return
		}
		if err := setRuntimeConfig(next); err != nil {
			writeJSON(w, http.StatusBadRequest, map[string]string{"error": err.Error()})
			return
		}
		writeJSON(w, http.StatusOK, getRuntimeConfig())
	default:
		writeJSON(w, http.StatusMethodNotAllowed, map[string]string{"error": "method not allowed"})
	}
}
