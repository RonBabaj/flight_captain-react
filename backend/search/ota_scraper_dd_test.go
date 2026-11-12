package search

import (
	"context"
	"encoding/json"
	"io"
	"net/http"
	"net/http/httptest"
	"strings"
	"sync/atomic"
	"testing"
	"time"
)

func TestDynamicDestinationOneWayRequests_openJaw(t *testing.T) {
	req := SearchRequest{
		Origin: "TLV", Destination: "VIE",
		DepartureDate: "2027-01-07", ReturnDate: "2027-01-14",
		ReturnOrigin: "SZG", ReturnDestination: "TLV",
		Adults: 1, Currency: "USD", CabinClass: "ECONOMY",
	}
	steps := dynamicDestinationOneWayRequests(req)
	if len(steps) != 2 {
		t.Fatalf("steps=%d want 2", len(steps))
	}
	if steps[0].Origin != "TLV" || steps[0].Destination != "VIE" || steps[0].ReturnDate != "" {
		t.Fatalf("outbound=%+v", steps[0])
	}
	if steps[1].Origin != "SZG" || steps[1].Destination != "TLV" || steps[1].ReturnDate != "" {
		t.Fatalf("return=%+v", steps[1])
	}
	if IsOpenJaw(steps[0]) || HasExtraLegs(steps[0]) {
		t.Fatal("one-way steps must not remain open-jaw")
	}
}

func TestDynamicDestinationOneWayRequests_extraLegs(t *testing.T) {
	req := SearchRequest{
		Origin: "TLV", Destination: "BER",
		DepartureDate: "2027-01-07", ReturnDate: "2027-01-20",
		ExtraLegs: []ExtraLeg{{Origin: "BER", Destination: "PRG", Date: "2027-01-12"}},
		Adults: 1,
	}
	steps := dynamicDestinationOneWayRequests(req)
	if len(steps) != 3 {
		t.Fatalf("steps=%d want 3", len(steps))
	}
	if steps[1].Origin != "BER" || steps[1].Destination != "PRG" {
		t.Fatalf("extra=%+v", steps[1])
	}
	if steps[2].Origin != "PRG" || steps[2].Destination != "TLV" {
		// return defaults to last extra dest → origin when ReturnOrigin unset
		retO, retD := ResolveReturnAirports(req)
		if steps[2].Origin != retO || steps[2].Destination != retD {
			t.Fatalf("return=%+v want %s→%s", steps[2], retO, retD)
		}
	}
}

func TestMultisiteSoftTimeoutFor_scalesOpenJaw(t *testing.T) {
	classic := SearchRequest{Origin: "TLV", Destination: "VIE", DepartureDate: "2027-01-07", ReturnDate: "2027-01-14"}
	oj := classic
	oj.ReturnOrigin = "SZG"
	base := multisiteSoftTimeout()
	got := multisiteSoftTimeoutFor(oj)
	if got < 2*base {
		t.Fatalf("open-jaw soft=%v want at least 2×%v", got, base)
	}
	if gotClassic := multisiteSoftTimeoutFor(classic); gotClassic != base {
		t.Fatalf("classic soft=%v want %v", gotClassic, base)
	}
}

func TestOtaScraperProvider_openJawScrapesBothLegs(t *testing.T) {
	var hits atomic.Int32
	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		hits.Add(1)
		raw, _ := io.ReadAll(r.Body)
		var body otaScraperSearchRequest
		_ = json.Unmarshal(raw, &body)
		if body.ReturnDate != "" {
			t.Errorf("expected one-way scrape, got returnDate=%q", body.ReturnDate)
		}
		offer := map[string]any{
			"originCode": body.Origin, "destinationCode": body.Destination,
			"price": 100.0, "currency": "USD",
			"deepLink": "https://www.example-ota.com/book/" + body.Origin + "-" + body.Destination,
			"segments": []map[string]any{{
				"leg": "outbound", "fromCode": body.Origin, "toCode": body.Destination,
				"departureTime": body.DepartureDate + "T10:00:00Z",
				"arrivalTime":   body.DepartureDate + "T14:00:00Z",
				"airlineCode": "XX", "flightNumber": "XX1",
			}},
		}
		_ = json.NewEncoder(w).Encode(map[string]any{
			"sites": []map[string]any{{
				"site": "kiwi", "offers": []map[string]any{offer},
			}},
		})
	}))
	defer srv.Close()

	p := &OtaScraperProvider{
		baseURL: srv.URL,
		sites:   []string{"kiwi"},
		client:  srv.Client(),
		cache:   &otaScraperCache{items: map[string]otaScraperCacheEntry{}, ttl: time.Minute},
	}
	req := SearchRequest{
		Origin: "TLV", Destination: "VIE",
		DepartureDate: "2027-01-07", ReturnDate: "2027-01-14",
		ReturnOrigin: "SZG", ReturnDestination: "TLV",
		Adults: 1, Currency: "USD", CabinClass: "ECONOMY",
	}
	res, err := p.Search(context.Background(), req)
	if err != nil {
		t.Fatalf("Search: %v", err)
	}
	if hits.Load() != 2 {
		t.Fatalf("expected 2 one-way scrapes, got %d", hits.Load())
	}
	if len(res) == 0 {
		t.Fatal("expected combined open-jaw results")
	}
	if len(res[0].Legs) != 2 {
		t.Fatalf("legs=%d want 2", len(res[0].Legs))
	}
	if !strings.HasPrefix(res[0].ID, "otaoj_") {
		t.Fatalf("id=%q want otaoj_ prefix", res[0].ID)
	}
}

func TestOtaScraperProvider_openJawNoLongerSkipped(t *testing.T) {
	// Ensure we do not short-circuit with ErrProviderSkipped before attempting scrapes.
	p := &OtaScraperProvider{
		baseURL: "http://127.0.0.1:1", // connection refused → error, not skip
		sites:   []string{"kiwi"},
		client:  &http.Client{Timeout: 200 * time.Millisecond},
		cache:   &otaScraperCache{items: map[string]otaScraperCacheEntry{}, ttl: time.Minute},
	}
	req := SearchRequest{
		Origin: "TLV", Destination: "VIE",
		DepartureDate: "2027-01-07", ReturnDate: "2027-01-14",
		ReturnOrigin: "SZG", ReturnDestination: "TLV",
		Adults: 1,
	}
	_, err := p.Search(context.Background(), req)
	if err == nil {
		t.Fatal("expected scrape error")
	}
	if err == ErrProviderSkipped || strings.Contains(err.Error(), ErrProviderSkipped.Error()) {
		t.Fatalf("open-jaw must not be skipped anymore, got %v", err)
	}
}
