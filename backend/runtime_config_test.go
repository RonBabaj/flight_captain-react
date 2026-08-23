package main

import "testing"

func TestValidateRuntimeConfigDefaults(t *testing.T) {
	if err := validateRuntimeConfig(defaultRuntimeConfig()); err != nil {
		t.Fatalf("defaults invalid: %v", err)
	}
}

func TestValidateRuntimeConfigRejectsOutOfRange(t *testing.T) {
	cfg := defaultRuntimeConfig()
	cfg.PollIntervalMs = 100
	if err := validateRuntimeConfig(cfg); err == nil {
		t.Fatal("expected pollIntervalMs below min to fail")
	}
}

func TestSetRuntimeConfigPersists(t *testing.T) {
	t.Setenv("SESSION_DB_PATH", t.TempDir()+"/test_sessions.db")
	initSessionStore()
	initRuntimeConfigStore()

	next := defaultRuntimeConfig()
	next.SlowResultsPopupDelayMs = 45_000
	if err := setRuntimeConfig(next); err != nil {
		t.Fatalf("setRuntimeConfig: %v", err)
	}
	got := getRuntimeConfig()
	if got.SlowResultsPopupDelayMs != 45_000 {
		t.Fatalf("got %d want 45000", got.SlowResultsPopupDelayMs)
	}

	// Simulate reload.
	runtimeConfig = defaultRuntimeConfig()
	initRuntimeConfigStore()
	got = getRuntimeConfig()
	if got.SlowResultsPopupDelayMs != 45_000 {
		t.Fatalf("after reload got %d want 45000", got.SlowResultsPopupDelayMs)
	}
}
