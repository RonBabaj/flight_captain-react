package search

import (
	"context"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
	"time"
)

func TestItineraryFingerprintStable(t *testing.T) {
	dep := time.Date(2026, 8, 10, 10, 0, 0, 0, time.UTC)
	arr := time.Date(2026, 8, 10, 18, 0, 0, 0, time.UTC)
	a := ProviderResult{
		Price:  Monetary{Currency: "USD", Amount: 100},
		Source: "googleflights2",
		Legs: []Leg{{Segments: []Segment{{
			From: "TLV", To: "HND", DepartureTime: dep, ArrivalTime: arr,
			MarketingCarrier: "LY", FlightNumber: "LY081",
		}}}},
	}
	b := a
	b.Price.Amount = 90
	b.Source = "kiwi"
	if ItineraryFingerprint(a) != ItineraryFingerprint(b) {
		t.Fatal("fingerprint should ignore price/source")
	}
}

func TestDedupeKeepsCheaper(t *testing.T) {
	dep := time.Date(2026, 8, 10, 10, 0, 0, 0, time.UTC)
	arr := time.Date(2026, 8, 10, 18, 0, 0, 0, time.UTC)
	legs := []Leg{{Segments: []Segment{{
		From: "TLV", To: "HND", DepartureTime: dep, ArrivalTime: arr,
		MarketingCarrier: "LY", FlightNumber: "LY081",
	}}}}
	in := []ProviderResult{
		{ID: "a", Price: Monetary{Currency: "USD", Amount: 400}, Source: "googleflights2", Legs: legs},
		{ID: "b", Price: Monetary{Currency: "USD", Amount: 350}, Source: "kiwi", Legs: legs, SelfTransfer: true},
	}
	out := DedupeProviderResults(in)
	if len(out) != 1 {
		t.Fatalf("len=%d", len(out))
	}
	if out[0].Price.Amount != 350 {
		t.Fatalf("expected cheaper kiwi price, got %.0f", out[0].Price.Amount)
	}
	if !out[0].SelfTransfer {
		t.Fatal("self-transfer flag should survive merge")
	}
}

func TestParseKiwiApifyItemsSolidcodeShape(t *testing.T) {
	item := map[string]interface{}{
		"originCode":      "PRG",
		"destinationCode": "JFK",
		"price":           612.0,
		"currency":        "USD",
		"durationHours":   11.25,
		"selfTransfer":    true,
		"bookingUrl":      "https://www.kiwi.com/en/booking?token=test",
		"segments": []interface{}{
			map[string]interface{}{
				"leg": "outbound", "fromCode": "PRG", "toCode": "LHR",
				"departureTime": "2026-07-15T10:25:00", "arrivalTime": "2026-07-15T11:40:00",
				"airlineCode": "BA", "flightNumber": "BA851", "durationHours": 2.25,
			},
			map[string]interface{}{
				"leg": "outbound", "fromCode": "LHR", "toCode": "JFK",
				"departureTime": "2026-07-15T13:00:00", "arrivalTime": "2026-07-15T16:00:00",
				"airlineCode": "BA", "flightNumber": "BA117", "durationHours": 8.0,
			},
			map[string]interface{}{
				"leg": "inbound", "fromCode": "JFK", "toCode": "PRG",
				"departureTime": "2026-07-22T20:15:00", "arrivalTime": "2026-07-23T10:00:00",
				"airlineCode": "BA", "flightNumber": "BA112", "durationHours": 8.0,
			},
		},
	}
	out := parseKiwiApifyItems([]map[string]interface{}{item}, SearchRequest{Origin: "PRG", Destination: "JFK", Currency: "USD"})
	if len(out) != 1 {
		t.Fatalf("len=%d", len(out))
	}
	if !out[0].SelfTransfer {
		t.Fatal("expected self-transfer")
	}
	if out[0].Source != "kiwi" {
		t.Fatalf("source=%s", out[0].Source)
	}
	if len(out[0].Legs) != 2 {
		t.Fatalf("legs=%d", len(out[0].Legs))
	}
	if out[0].DeepLink == "" {
		t.Fatal("expected booking url")
	}
}

func TestParseKiwiEmptyAndInvalid(t *testing.T) {
	if got := parseKiwiApifyItems(nil, SearchRequest{}); len(got) != 0 {
		t.Fatal("nil items")
	}
	if got := parseKiwiApifyItems([]map[string]interface{}{{"price": 0}}, SearchRequest{}); len(got) != 0 {
		t.Fatal("zero price")
	}
}

func TestDetectSelfTransfer(t *testing.T) {
	if !detectSelfTransfer(map[string]interface{}{"virtualInterlining": true}) {
		t.Fatal("vi")
	}
	if detectSelfTransfer(map[string]interface{}{"price": 10}) {
		t.Fatal("should be false")
	}
}

func TestRegistrySearchAllPartialFailure(t *testing.T) {
	ok := &stubProvider{name: "ok", results: []ProviderResult{{
		ID: "1", Price: Monetary{Currency: "USD", Amount: 100}, Source: "ok",
		Legs: []Leg{{Segments: []Segment{{From: "A", To: "B", MarketingCarrier: "X", FlightNumber: "1"}}}},
	}}}
	bad := &stubProvider{name: "bad", err: context.DeadlineExceeded}
	r := &Registry{providers: []Provider{ok, bad}}
	res := r.SearchAll(context.Background(), SearchRequest{Origin: "A", Destination: "B", DepartureDate: "2026-08-01"})
	if len(res.Results) != 1 {
		t.Fatalf("results=%d", len(res.Results))
	}
	if res.AllFailed() {
		t.Fatal("should not all-fail when one provider succeeds")
	}
}

func TestKiwiApifyTimeout(t *testing.T) {
	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if strings.Contains(r.URL.Path, "/runs") && r.Method == http.MethodPost {
			_ = json.NewEncoder(w).Encode(map[string]any{"data": map[string]any{"id": "run1", "defaultDatasetId": "ds1"}})
			return
		}
		if strings.Contains(r.URL.Path, "/actor-runs/") {
			time.Sleep(50 * time.Millisecond)
			_ = json.NewEncoder(w).Encode(map[string]any{"data": map[string]any{"status": "RUNNING", "defaultDatasetId": "ds1"}})
			return
		}
		w.WriteHeader(404)
	}))
	defer srv.Close()

	p := &KiwiApifyProvider{
		token:   "test-token",
		actorID: "solidcode~kiwi-scraper",
		baseURL: srv.URL,
		client:  srv.Client(),
		cache:   &kiwiCache{items: map[string]kiwiCacheEntry{}},
	}
	ctx, cancel := context.WithTimeout(context.Background(), 80*time.Millisecond)
	defer cancel()
	_, err := p.Search(ctx, SearchRequest{Origin: "PRG", Destination: "JFK", DepartureDate: "2026-08-01"})
	if err == nil {
		t.Fatal("expected timeout/cancel error")
	}
}

type stubProvider struct {
	name    string
	results []ProviderResult
	err     error
}

func (s *stubProvider) Name() string { return s.name }
func (s *stubProvider) Search(ctx context.Context, req SearchRequest) ([]ProviderResult, error) {
	return s.results, s.err
}
