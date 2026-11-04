package search

import (
	"os"
	"strings"
	"testing"
)

func resetBudgetEnv(t *testing.T) {
	t.Helper()
	t.Cleanup(func() {
		os.Unsetenv("FLIGHT_BUDGET_MODE")
		os.Unsetenv("FLIGHT_BUDGET_KEEP_KIWI")
		os.Unsetenv("GF2_METRO_MAX_AIRPORTS")
		flightBudget = flightBudgetConfig{}
	})
}

func TestFilterProviderNamesForBudget_disablesKiwi(t *testing.T) {
	resetBudgetEnv(t)
	t.Setenv("FLIGHT_BUDGET_MODE", "1")
	t.Setenv("FLIGHT_BUDGET_KEEP_KIWI", "")
	flightBudget = flightBudgetConfig{} // reset sync.Once

	got := FilterProviderNamesForBudget([]string{"googleflights2", "kiwi"})
	if len(got) != 1 || got[0] != "googleflights2" {
		t.Fatalf("got %v", got)
	}
}

func TestGF2SearchAirports_budgetCapsMetro(t *testing.T) {
	resetBudgetEnv(t)
	t.Setenv("FLIGHT_BUDGET_MODE", "1")
	t.Setenv("GF2_METRO_MAX_AIRPORTS", "2")
	flightBudget = flightBudgetConfig{}

	got := GF2SearchAirports("TYO")
	if len(got) != 2 {
		t.Fatalf("expected 2 airports in budget cap, got %v", got)
	}
}

func TestSanitizeProviderErrorForUser(t *testing.T) {
	msg := SanitizeProviderErrorForUser("GF2 status 403")
	if strings.Contains(msg, "403") {
		t.Fatalf("should not expose status code: %q", msg)
	}
	apify := SanitizeProviderErrorForUser("Apify: payment required for actor run")
	if strings.Contains(strings.ToLower(apify), "payment required") {
		t.Fatalf("should sanitize apify billing: %q", apify)
	}
}

func TestExploreBudgetLimits_defaultsWithoutBudget(t *testing.T) {
	resetBudgetEnv(t)
	t.Setenv("FLIGHT_BUDGET_MODE", "0")
	flightBudget = flightBudgetConfig{}
	lim := ExploreBudgetLimits()
	if lim.LiveFetchesPerRequest != 12 || lim.MaxLiveFetchesPerSession != 36 {
		t.Fatalf("unexpected defaults: %+v", lim)
	}
}

func TestExploreBudgetLimits_budget(t *testing.T) {
	resetBudgetEnv(t)
	t.Setenv("FLIGHT_BUDGET_MODE", "1")
	flightBudget = flightBudgetConfig{}
	lim := ExploreBudgetLimits()
	if lim.LiveFetchesPerRequest != budgetExploreLivePerBatch {
		t.Fatalf("batch=%d want %d", lim.LiveFetchesPerRequest, budgetExploreLivePerBatch)
	}
}
