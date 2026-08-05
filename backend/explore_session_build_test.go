package main

import "testing"

func TestExploreBuildRowsAndQueue_ColdCacheQueuesWithoutEstimateRows(t *testing.T) {
	// Cold cache: no placeholder estimate cards; liveQueue ordered by cheapest heuristic.
	origin := "TLV"
	dep, ret := "2026-07-10", "2026-07-17"
	rows, liveQ := exploreBuildRowsAndQueue(origin, dep, ret, false, 0, 0, 7, "USD", 1, 0, false)
	if len(rows) != 0 {
		t.Fatalf("cold cache: expected 0 visible rows, got %d", len(rows))
	}
	if len(liveQ) == 0 {
		t.Fatal("expected non-empty live queue")
	}
	for i := 1; i < len(liveQ); i++ {
		prev := exploreEstimateInCurrency(origin, liveQ[i-1], dep, "USD")
		cur := exploreEstimateInCurrency(origin, liveQ[i], dep, "USD")
		if prev > cur {
			t.Fatalf("liveQ not cheapest-first at %d: %s (%.0f) before %s (%.0f)", i, liveQ[i-1], prev, liveQ[i], cur)
		}
		if prev == cur && liveQ[i-1] > liveQ[i] {
			t.Fatalf("liveQ destination tie-break at %d: %s before %s", i, liveQ[i-1], liveQ[i])
		}
	}
}

func TestExploreBuildRowsAndQueue_FreshCacheNotQueued(t *testing.T) {
	origin := "TLV"
	dest := "ATH"
	dep, ret := "2026-08-10", "2026-08-17"
	currency := "USD"
	key := explorePriceCacheKey(origin, dest, currency, false, 0, 0, 7, 1, 0, false, dep, ret)
	explorePriceCachePut(key, 199.0, dep)
	t.Cleanup(func() {
		explorePriceCacheMu.Lock()
		delete(explorePriceCache, key)
		explorePriceCacheMu.Unlock()
	})

	rows, liveQ := exploreBuildRowsAndQueue(origin, dep, ret, false, 0, 0, 7, currency, 1, 0, false)
	found := false
	for _, r := range rows {
		if r.destination == dest {
			found = true
			if r.priceSource != "cached" {
				t.Fatalf("priceSource=%s want cached", r.priceSource)
			}
			if r.price != 199.0 {
				t.Fatalf("price=%v want 199", r.price)
			}
		}
	}
	if !found {
		t.Fatal("expected ATH in cached rows")
	}
	for _, d := range liveQ {
		if d == dest {
			t.Fatal("fresh cache destination should not be in live queue")
		}
	}
}
