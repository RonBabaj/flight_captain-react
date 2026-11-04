package search

import (
	"log"
	"os"
	"strconv"
	"strings"
	"sync"
	"time"
)

// Budget defaults when FLIGHT_BUDGET_MODE is on (overridable via env).
const (
	budgetGF2CacheTTLMin       = 45
	budgetKiwiCacheTTLMin      = 45
	budgetGF2RateLimitPerMin   = 15
	budgetMetroMaxAirports     = 2
	budgetMetroConcurrency     = 1
	budgetExploreLivePerBatch  = 6
	budgetExploreConcurrency   = 2
	budgetExploreMaxPerSession = 18
	budgetCalendarSamples      = 6
	budgetSearchTransientRetry = 1
)

type flightBudgetConfig struct {
	once sync.Once
	cfg  budgetRuntime
}

type budgetRuntime struct {
	enabled            bool
	disableKiwi        bool
	gf2CacheTTL        time.Duration
	kiwiCacheTTL       time.Duration
	gf2RateLimitPerMin int // 0 = leave NewGoogleFlights2Provider defaults
	metroMaxAirports   int // 0 = no cap
	metroConcurrency   int // 0 = use code default (3)
	skipRTEnrich       bool
	exploreLiveBatch   int
	exploreConcurrency int
	exploreMaxSession  int
	calendarSamples    int
	transientRetries   int
}

var flightBudget flightBudgetConfig

func loadBudgetConfig() budgetRuntime {
	enabled := envTruthy(os.Getenv("FLIGHT_BUDGET_MODE"))
	disableKiwi := enabled
	if enabled {
		if envTruthy(os.Getenv("FLIGHT_BUDGET_KEEP_KIWI")) {
			disableKiwi = false
		}
	} else if v := strings.TrimSpace(os.Getenv("FLIGHT_BUDGET_DISABLE_KIWI")); v != "" {
		disableKiwi = envTruthy(v)
	}

	gf2TTL := durationFromEnvMin("GOOGLEFLIGHTS2_CACHE_TTL_MIN", 0)
	if gf2TTL == 0 {
		if enabled {
			gf2TTL = time.Duration(budgetGF2CacheTTLMin) * time.Minute
		} else {
			gf2TTL = gf2CacheTTL
		}
	}

	kiwiTTL := durationFromEnvMin("KIWI_CACHE_TTL_MIN", 0)
	if kiwiTTL == 0 {
		if enabled {
			kiwiTTL = time.Duration(budgetKiwiCacheTTLMin) * time.Minute
		} else {
			kiwiTTL = kiwiCacheTTL
		}
	}

	gf2Rate := 0
	if s := strings.TrimSpace(os.Getenv("GOOGLEFLIGHTS2_RATE_LIMIT_PER_MIN")); s != "" {
		if v, err := strconv.Atoi(s); err == nil && v >= 1 {
			gf2Rate = v
		}
	} else if enabled {
		gf2Rate = budgetGF2RateLimitPerMin
	}

	metroMax := intFromEnv("GF2_METRO_MAX_AIRPORTS", 0)
	if metroMax == 0 && enabled {
		metroMax = budgetMetroMaxAirports
	}
	metroConc := intFromEnv("GF2_METRO_CONCURRENCY", 0)
	if metroConc == 0 && enabled {
		metroConc = budgetMetroConcurrency
	}

	skipRT := enabled
	if v := strings.TrimSpace(os.Getenv("FLIGHT_BUDGET_RT_ENRICH")); v != "" {
		skipRT = !envTruthy(v)
	} else if v := strings.TrimSpace(os.Getenv("FLIGHT_BUDGET_SKIP_RT_ENRICH")); v != "" {
		skipRT = envTruthy(v)
	}

	exploreBatch := intFromEnv("EXPLORE_LIVE_FETCHES_PER_REQUEST", 0)
	if exploreBatch == 0 {
		if enabled {
			exploreBatch = budgetExploreLivePerBatch
		} else {
			exploreBatch = 12
		}
	}
	exploreConc := intFromEnv("EXPLORE_LIVE_CONCURRENCY", 0)
	if exploreConc == 0 {
		if enabled {
			exploreConc = budgetExploreConcurrency
		} else {
			exploreConc = 4
		}
	}
	exploreMax := intFromEnv("EXPLORE_MAX_LIVE_FETCHES_PER_SESSION", 0)
	if exploreMax == 0 {
		if enabled {
			exploreMax = budgetExploreMaxPerSession
		} else {
			exploreMax = 36
		}
	}
	calSamples := intFromEnv("GF2_CALENDAR_MAX_SAMPLES", 0)
	if calSamples == 0 {
		if enabled {
			calSamples = budgetCalendarSamples
		} else {
			calSamples = 10
		}
	}

	retries := intFromEnv("FLIGHT_SEARCH_TRANSIENT_RETRIES", 0)
	if retries == 0 {
		if enabled {
			retries = budgetSearchTransientRetry
		} else {
			retries = 2
		}
	}

	cfg := budgetRuntime{
		enabled:            enabled,
		disableKiwi:        disableKiwi,
		gf2CacheTTL:        gf2TTL,
		kiwiCacheTTL:       kiwiTTL,
		gf2RateLimitPerMin: gf2Rate,
		metroMaxAirports:   metroMax,
		metroConcurrency:   metroConc,
		skipRTEnrich:       skipRT,
		exploreLiveBatch:   exploreBatch,
		exploreConcurrency: exploreConc,
		exploreMaxSession:  exploreMax,
		calendarSamples:    calSamples,
		transientRetries:   retries,
	}
	if enabled {
		log.Printf("[BUDGET] FLIGHT_BUDGET_MODE on: disableKiwi=%t gf2Cache=%s gf2Rate=%d/min metroMax=%d metroConc=%d skipRTEnrich=%t exploreBatch=%d",
			disableKiwi, gf2TTL, gf2Rate, metroMax, metroConc, skipRT, exploreBatch)
	}
	return cfg
}

func budgetCfg() budgetRuntime {
	flightBudget.once.Do(func() {
		flightBudget.cfg = loadBudgetConfig()
	})
	return flightBudget.cfg
}

// BudgetModeEnabled reports whether cost-saving defaults are active.
func BudgetModeEnabled() bool {
	return budgetCfg().enabled
}

// FilterProviderNamesForBudget removes expensive optional providers when configured.
func FilterProviderNamesForBudget(names []string) []string {
	if !budgetCfg().disableKiwi {
		return names
	}
	var out []string
	for _, n := range names {
		switch n {
		case "kiwi", "kiwi_apify", "apify":
			log.Printf("[BUDGET] skipping provider %q (Apify/Kiwi disabled — set FLIGHT_BUDGET_KEEP_KIWI=1 to allow in budget mode)", n)
			continue
		default:
			out = append(out, n)
		}
	}
	return out
}

// GF2EffectiveCacheTTL returns in-process GF2 search cache duration.
func GF2EffectiveCacheTTL() time.Duration {
	return budgetCfg().gf2CacheTTL
}

// KiwiEffectiveCacheTTL returns in-process Kiwi cache duration.
func KiwiEffectiveCacheTTL() time.Duration {
	return budgetCfg().kiwiCacheTTL
}

// GF2EffectiveRateLimitPerMin returns 0 when the provider should use its built-in default.
func GF2EffectiveRateLimitPerMin() int {
	return budgetCfg().gf2RateLimitPerMin
}

// GF2MetroMaxAirports caps metro fan-out (0 = unlimited).
func GF2MetroMaxAirports() int {
	return budgetCfg().metroMaxAirports
}

// GF2MetroConcurrency limits parallel GF2 calls during metro fan-out (0 = default 3).
func GF2MetroConcurrency() int {
	return budgetCfg().metroConcurrency
}

// GF2SkipRoundTripEnrich skips extra return-leg GF2 searches on classic RT.
func GF2SkipRoundTripEnrich() bool {
	return budgetCfg().skipRTEnrich
}

// ExploreLimits holds explore/month-deals live GF2 caps.
type ExploreLimits struct {
	LiveFetchesPerRequest    int
	LiveConcurrency          int
	MaxLiveFetchesPerSession int
	CalendarMaxSamples       int
}

// ExploreBudgetLimits returns explore-related cost caps.
func ExploreBudgetLimits() ExploreLimits {
	c := budgetCfg()
	return ExploreLimits{
		LiveFetchesPerRequest:    c.exploreLiveBatch,
		LiveConcurrency:          c.exploreConcurrency,
		MaxLiveFetchesPerSession: c.exploreMaxSession,
		CalendarMaxSamples:       c.calendarSamples,
	}
}

// SearchTransientRetryMax is how many extra SearchAll attempts run on transient all-provider failure.
func SearchTransientRetryMax() int {
	return budgetCfg().transientRetries
}

func envTruthy(v string) bool {
	switch strings.ToLower(strings.TrimSpace(v)) {
	case "1", "true", "yes", "on":
		return true
	default:
		return false
	}
}

func durationFromEnvMin(key string, fallback time.Duration) time.Duration {
	s := strings.TrimSpace(os.Getenv(key))
	if s == "" {
		return fallback
	}
	v, err := strconv.Atoi(s)
	if err != nil || v < 1 {
		return fallback
	}
	return time.Duration(v) * time.Minute
}

func intFromEnv(key string, fallback int) int {
	s := strings.TrimSpace(os.Getenv(key))
	if s == "" {
		return fallback
	}
	v, err := strconv.Atoi(s)
	if err != nil || v < 1 {
		return fallback
	}
	return v
}
