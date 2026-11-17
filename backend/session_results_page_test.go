package main

import (
	"net/http/httptest"
	"strconv"
	"testing"
	"time"
)

func TestPageSearchSessionForClient(t *testing.T) {
	resp := SearchSessionResultsResponse{
		Results: make([]FlightOption, 120),
	}
	for i := range resp.Results {
		resp.Results[i] = FlightOption{ID: "opt-" + strconv.Itoa(i)}
	}

	page := pageSearchSessionForClient(resp, 0, 50)
	if page.TotalResults != 120 || len(page.Results) != 50 || !page.HasMore || page.Offset != 0 || page.Limit != 50 {
		t.Fatalf("first page: total=%d len=%d hasMore=%v", page.TotalResults, len(page.Results), page.HasMore)
	}

	page2 := pageSearchSessionForClient(resp, 50, 50)
	if len(page2.Results) != 50 || !page2.HasMore || page2.Offset != 50 {
		t.Fatalf("second page: len=%d hasMore=%v offset=%d", len(page2.Results), page2.HasMore, page2.Offset)
	}

	page3 := pageSearchSessionForClient(resp, 100, 50)
	if len(page3.Results) != 20 || page3.HasMore {
		t.Fatalf("tail page: len=%d hasMore=%v", len(page3.Results), page3.HasMore)
	}
}

func TestHandleGetSessionPaginationQuery(t *testing.T) {
	id := "sess_page_test"
	resp := SearchSessionResultsResponse{
		Session: SearchSession{ID: id, Status: StatusComplete, CreatedAt: time.Now().UTC()},
		Results: make([]FlightOption, 75),
	}
	sessionsMu.Lock()
	sessions[id] = resp
	sessionsMu.Unlock()
	t.Cleanup(func() {
		sessionsMu.Lock()
		delete(sessions, id)
		sessionsMu.Unlock()
	})

	req := httptest.NewRequest("GET", "/api/search/sessions/"+id+"?offset=50&limit=25", nil)
	rr := httptest.NewRecorder()
	handleGetSession(rr, req)
	if rr.Code != 200 {
		t.Fatalf("status=%d body=%s", rr.Code, rr.Body.String())
	}
}