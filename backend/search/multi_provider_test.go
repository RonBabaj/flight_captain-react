package search

import (
	"context"
	"encoding/json"
	"fmt"
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

func TestParseOtaOffersSolidcodeShape(t *testing.T) {
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
	out := parseOtaOffers([]map[string]interface{}{item}, SearchRequest{Origin: "PRG", Destination: "JFK", Currency: "USD"}, "kiwi")
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

func TestParseOtaOffers_dropsSkyscannerMetaDeepLink(t *testing.T) {
	item := map[string]interface{}{
		"price":    390.0,
		"currency": "USD",
		"bookingUrl": "https://www.skyscanner.net/transport/flights/tlv/ber/260401/",
		"segments": []interface{}{
			map[string]interface{}{
				"leg": "outbound", "fromCode": "TLV", "toCode": "BER",
				"departureTime": "2026-04-01T10:00:00", "arrivalTime": "2026-04-01T14:00:00",
				"airlineCode": "LY", "flightNumber": "LY385", "durationHours": 4.0,
			},
		},
	}
	out := parseOtaOffers([]map[string]interface{}{item}, SearchRequest{Origin: "TLV", Destination: "BER", Currency: "USD"}, "skyscanner")
	if len(out) != 1 {
		t.Fatalf("len=%d", len(out))
	}
	if out[0].DeepLink != "" {
		t.Fatalf("meta-search DeepLink must be cleared, got %q", out[0].DeepLink)
	}
}

func TestParseOtaOffersEmptyAndInvalid(t *testing.T) {
	if got := parseOtaOffers(nil, SearchRequest{}, "kiwi"); len(got) != 0 {
		t.Fatal("nil items")
	}
	if got := parseOtaOffers([]map[string]interface{}{{"price": 0}}, SearchRequest{}, "kiwi"); len(got) != 0 {
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

func TestRegistrySearchAll_openJawGF2FailNotMaskedByKiwiSkip(t *testing.T) {
	gf2 := &stubProvider{name: "googleflights2", err: fmt.Errorf("no flights found for return SZG→TLV")}
	kiwi := &stubProvider{name: "kiwi", err: ErrProviderSkipped}
	r := &Registry{providers: []Provider{gf2, kiwi}}
	req := SearchRequest{
		Origin: "TLV", Destination: "VIE",
		DepartureDate: "2027-01-07", ReturnDate: "2027-01-14",
		ReturnOrigin: "SZG", ReturnDestination: "TLV",
	}
	res := r.SearchAll(context.Background(), req)
	if len(res.Results) != 0 {
		t.Fatalf("results=%d", len(res.Results))
	}
	if !res.AllFailed() {
		t.Fatal("GF2 failure must not be masked by Kiwi skip")
	}
	msg := res.FailureMessage()
	if !strings.Contains(msg, "SZG") {
		t.Fatalf("expected leg detail in message, got %q", msg)
	}
}

func TestRegistryFailureMessage_transientOutbound(t *testing.T) {
	res := MultiSearchResult{
		Stats: []ProviderSearchStats{{
			Provider: "googleflights2",
			Err:      "outbound search failed: flight search rate limited; try again in a minute",
		}},
	}
	if !res.IsTransientFailure() {
		t.Fatal("expected transient outbound failure")
	}
	msg := res.FailureMessage()
	if strings.Contains(msg, "No flights found for the outbound leg") {
		t.Fatalf("transient failure must not claim no flights, got %q", msg)
	}
	if !strings.Contains(msg, "try again") {
		t.Fatalf("expected retry hint, got %q", msg)
	}
}

func TestOtaScraperProviderSearch(t *testing.T) {
	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path == "/v1/search" && r.Method == http.MethodPost {
			_ = json.NewEncoder(w).Encode(map[string]any{
				"sites": []map[string]any{{
					"site": "kiwi",
					"offers": []map[string]any{{
						"originCode": "PRG", "destinationCode": "JFK", "price": 400.0, "currency": "USD",
						"segments": []map[string]any{{
							"leg": "outbound", "fromCode": "PRG", "toCode": "JFK",
							"departureTime": "2026-08-01T10:00:00Z", "arrivalTime": "2026-08-01T18:00:00Z",
							"airlineCode": "BA", "flightNumber": "BA117",
						}},
					}},
				}},
			})
			return
		}
		w.WriteHeader(404)
	}))
	defer srv.Close()

	p := &OtaScraperProvider{
		baseURL: srv.URL,
		sites:   []string{"kiwi"},
		client:  srv.Client(),
		cache:   &otaScraperCache{items: map[string]otaScraperCacheEntry{}},
	}
	out, err := p.Search(context.Background(), SearchRequest{Origin: "PRG", Destination: "JFK", DepartureDate: "2026-08-01"})
	if err != nil {
		t.Fatal(err)
	}
	if len(out) != 1 || out[0].Source != "kiwi" {
		t.Fatalf("got %+v", out)
	}
}

type stubProvider struct {
	name    string
	results []ProviderResult
	err     error
	delay   time.Duration
}

func (s *stubProvider) Name() string { return s.name }
func (s *stubProvider) Search(ctx context.Context, req SearchRequest) ([]ProviderResult, error) {
	if s.delay > 0 {
		select {
		case <-ctx.Done():
			return nil, ctx.Err()
		case <-time.After(s.delay):
		}
	}
	return s.results, s.err
}

