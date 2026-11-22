package search

import (
	"os"
	"strconv"
	"strings"
	"time"
)

// UnifiedSearchFastProviderDelay sleeps fast providers (GF2) before Search when slow OTA scrapers
// are also enabled, so multisite often finishes first and clients see PARTIAL with OTA cards earlier.
// Set UNIFIED_SEARCH_FAST_DELAY_MS (default 0). Production recommendation: 55000–75000.
func UnifiedSearchFastProviderDelay() time.Duration {
	raw := strings.TrimSpace(os.Getenv("UNIFIED_SEARCH_FAST_DELAY_MS"))
	if raw == "" {
		return 0
	}
	ms, err := strconv.Atoi(raw)
	if err != nil || ms < 0 {
		return 0
	}
	if ms > 120_000 {
		ms = 120_000
	}
	return time.Duration(ms) * time.Millisecond
}