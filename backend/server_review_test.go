package main

import (
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
	"time"
)

func TestSegmentMatchesCabinClass(t *testing.T) {
	seg := FlightSegment{CabinClass: "  "}
	if !segmentMatchesCabinClass(seg, "ECONOMY") {
		t.Fatal("empty cabin should match ECONOMY")
	}
	if segmentMatchesCabinClass(seg, "BUSINESS") {
		t.Fatal("empty cabin must not match premium")
	}
	seg.CabinClass = "business"
	if !segmentMatchesCabinClass(seg, "BUSINESS") {
		t.Fatal("equal fold")
	}
}

func TestLoadSearchSession_Expiry(t *testing.T) {
	sessionsMu.Lock()
	clear(sessions)
	id := "sess_ttl_test"
	sessions[id] = SearchSessionResultsResponse{
		Session: SearchSession{ID: id, CreatedAt: time.Now().Add(-2 * searchSessionTTL())},
		Version: 1,
	}
	sessionsMu.Unlock()

	_, ok := loadSearchSession(id)
	if ok {
		t.Fatal("expected expired session to be gone")
	}
	sessionsMu.Lock()
	_, still := sessions[id]
	sessionsMu.Unlock()
	if still {
		t.Fatal("expected lazy delete")
	}
}

func TestGetSessionAndOption_MissingOption(t *testing.T) {
	sessionsMu.Lock()
	clear(sessions)
	sid := "sess_opt_test"
	sessions[sid] = SearchSessionResultsResponse{
		Session: SearchSession{ID: sid, CreatedAt: time.Now()},
		Results: []FlightOption{{ID: "opt_0"}},
	}
	sessionsMu.Unlock()
	defer func() {
		sessionsMu.Lock()
		delete(sessions, sid)
		sessionsMu.Unlock()
	}()

	resp, opt := GetSessionAndOption(sid, "opt_999")
	if resp == nil || opt != nil {
		t.Fatalf("want session, no option: resp=%v opt=%v", resp != nil, opt)
	}
	resp2, opt2 := GetSessionAndOption(sid, "opt_0")
	if resp2 == nil || opt2 == nil || opt2.ID != "opt_0" {
		t.Fatal("expected hit")
	}
}

func TestHandleFlyFixRefineIssues_Smoke(t *testing.T) {
	body := `{"issues":[{"file":"x.py","severity":"error","category":"unused_var","message":"Unused variable a","explanation":"e","suggested_fix":"s","line":1}],"repo_root":"","run_tsc":false}`
	req := httptest.NewRequest(http.MethodPost, "/api/flyfix/refine-issues", strings.NewReader(body))
	req.Header.Set("Content-Type", "application/json")
	rec := httptest.NewRecorder()
	handleFlyFixRefineIssues(rec, req)
	if rec.Code != http.StatusOK {
		t.Fatalf("status %d body %s", rec.Code, rec.Body.String())
	}
}
