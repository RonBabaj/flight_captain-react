package main

import "testing"

func TestExploreBuildRowsAndQueue_LiveQueueMatchesPriceSort(t *testing.T) {
	// Cold cache: every destination needs live; liveQueue should follow row order (cheapest heuristic first).
	origin := "TLV"
	dep, ret := "2026-07-10", "2026-07-17"
	rows, liveQ := exploreBuildRowsAndQueue(origin, dep, ret, false, 0, 0, 7, "USD", 1, 0, false)
	if len(rows) == 0 {
		t.Fatal("expected rows")
	}
	if len(liveQ) != len(rows) {
		t.Fatalf("cold cache: liveQ len %d want %d", len(liveQ), len(rows))
	}
	for i := range liveQ {
		if liveQ[i] != rows[i].destination {
			t.Fatalf("liveQ[%d]=%s rows[%d].destination=%s", i, liveQ[i], i, rows[i].destination)
		}
	}
}
