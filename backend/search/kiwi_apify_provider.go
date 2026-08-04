package search

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"net/url"
	"os"
	"strconv"
	"strings"
	"sync"
	"time"
)

const (
	kiwiCacheTTL     = 10 * time.Minute
	kiwiDefaultActor = "solidcode~kiwi-scraper"
	kiwiPollInterval = 3 * time.Second
	kiwiHTTPTimeout  = 30 * time.Second
)

// KiwiApifyProvider calls a configurable Apify Actor that scrapes Kiwi.com.
// Optional: only constructed when APIFY_API_TOKEN is set.
type KiwiApifyProvider struct {
	token   string
	actorID string
	baseURL string
	client  *http.Client
	cache   *kiwiCache
}

type kiwiCache struct {
	mu    sync.RWMutex
	items map[string]kiwiCacheEntry
}

type kiwiCacheEntry struct {
	results []ProviderResult
	expires time.Time
}

// NewKiwiApifyProvider creates a Kiwi provider when APIFY_API_TOKEN is set.
// APIFY_KIWI_ACTOR_ID defaults to solidcode~kiwi-scraper when unset.
func NewKiwiApifyProvider() *KiwiApifyProvider {
	token := strings.TrimSpace(os.Getenv("APIFY_API_TOKEN"))
	if token == "" {
		return nil
	}
	actor := strings.TrimSpace(os.Getenv("APIFY_KIWI_ACTOR_ID"))
	if actor == "" {
		actor = kiwiDefaultActor
	}
	// Accept "user/actor" and normalize to Apify API form "user~actor"
	actor = strings.ReplaceAll(actor, "/", "~")
	base := strings.TrimSpace(os.Getenv("APIFY_API_BASE_URL"))
	if base == "" {
		base = "https://api.apify.com/v2"
	}
	base = strings.TrimRight(base, "/")
	c := &kiwiCache{items: make(map[string]kiwiCacheEntry)}
	go func() {
		t := time.NewTicker(2 * time.Minute)
		defer t.Stop()
		for range t.C {
			c.evict()
		}
	}()
	return &KiwiApifyProvider{
		token:   token,
		actorID: actor,
		baseURL: base,
		client:  &http.Client{Timeout: kiwiHTTPTimeout},
		cache:   c,
	}
}

func (p *KiwiApifyProvider) Name() string { return "kiwi" }

func (c *kiwiCache) get(key string) ([]ProviderResult, bool) {
	c.mu.RLock()
	defer c.mu.RUnlock()
	e, ok := c.items[key]
	if !ok || time.Now().After(e.expires) {
		return nil, false
	}
	return e.results, true
}

func (c *kiwiCache) set(key string, results []ProviderResult) {
	c.mu.Lock()
	defer c.mu.Unlock()
	c.items[key] = kiwiCacheEntry{results: results, expires: time.Now().Add(kiwiCacheTTL)}
}

func (c *kiwiCache) evict() {
	c.mu.Lock()
	defer c.mu.Unlock()
	now := time.Now()
	for k, e := range c.items {
		if now.After(e.expires) {
			delete(c.items, k)
		}
	}
}

func (p *KiwiApifyProvider) cacheKey(req SearchRequest) string {
	cabin := req.CabinPreference
	if cabin == "" {
		cabin = req.CabinClass
	}
	bags := 0
	if req.IncludeCheckedBag {
		bags = 1
	}
	return fmt.Sprintf("%s|%s|%s|%s|%d|%d|%s|%d",
		strings.ToUpper(req.Origin), strings.ToUpper(req.Destination),
		req.DepartureDate, req.ReturnDate, req.Adults, req.Children, cabin, bags)
}

func (p *KiwiApifyProvider) Search(ctx context.Context, req SearchRequest) ([]ProviderResult, error) {
	if p == nil {
		return nil, fmt.Errorf("kiwi provider not configured")
	}
	key := p.cacheKey(req)
	if cached, ok := p.cache.get(key); ok {
		log.Printf("[KIWI] cacheHit=true results=%d", len(cached))
		return cached, nil
	}

	input := p.buildActorInput(req)
	runID, datasetID, err := p.startActorRun(ctx, input)
	if err != nil {
		return nil, err
	}
	log.Printf("[KIWI] actorRun started runId=%s actor=%s", runID, p.actorID)

	datasetID, err = p.waitForRun(ctx, runID, datasetID)
	if err != nil {
		return nil, err
	}
	items, err := p.fetchDatasetItems(ctx, datasetID)
	if err != nil {
		return nil, err
	}
	results := parseKiwiApifyItems(items, req)
	log.Printf("[KIWI] cacheHit=false results=%d datasetId=%s", len(results), datasetID)
	p.cache.set(key, results)
	return results, nil
}

func (p *KiwiApifyProvider) buildActorInput(req SearchRequest) map[string]interface{} {
	cabin := strings.ToUpper(strings.TrimSpace(req.CabinPreference))
	if cabin == "" {
		cabin = strings.ToUpper(strings.TrimSpace(req.CabinClass))
	}
	if cabin == "" {
		cabin = "ECONOMY"
	}
	currency := strings.ToUpper(strings.TrimSpace(req.Currency))
	if currency == "" {
		currency = "USD"
	}
	checked := "0"
	if req.IncludeCheckedBag {
		checked = "1"
	}
	input := map[string]interface{}{
		// solidcode/kiwi-scraper schema
		"origin":        strings.ToUpper(req.Origin),
		"destination":   strings.ToUpper(req.Destination),
		"departureDate": req.DepartureDate,
		"cabinClass":    cabin,
		"currency":      currency,
		"maxResults":    50,
		"checkedBags":   checked,
		"cabinBags":     "0",
		"maxStops":      "any",
		// kazadoiyul/kiwi-scraper alternate keys (ignored by solidcode if unused)
		"from":      strings.ToUpper(req.Origin),
		"to":        strings.ToUpper(req.Destination),
		"departure": req.DepartureDate,
		"oneway":    req.ReturnDate == "",
	}
	if req.ReturnDate != "" {
		input["returnDate"] = req.ReturnDate
		input["returning"] = req.ReturnDate
	}
	return input
}

func (p *KiwiApifyProvider) startActorRun(ctx context.Context, input map[string]interface{}) (runID, datasetID string, err error) {
	u := fmt.Sprintf("%s/acts/%s/runs?token=%s&waitForFinish=0",
		p.baseURL, url.PathEscape(p.actorID), url.QueryEscape(p.token))
	body, _ := json.Marshal(input)
	httpReq, err := http.NewRequestWithContext(ctx, http.MethodPost, u, bytes.NewReader(body))
	if err != nil {
		return "", "", err
	}
	httpReq.Header.Set("Content-Type", "application/json")
	resp, err := p.client.Do(httpReq)
	if err != nil {
		return "", "", fmt.Errorf("apify start run: %w", err)
	}
	defer resp.Body.Close()
	raw, _ := io.ReadAll(resp.Body)
	if resp.StatusCode < 200 || resp.StatusCode >= 300 {
		log.Printf("[KIWI] start run status=%d body=%s", resp.StatusCode, truncateStr(string(raw), 300))
		return "", "", fmt.Errorf("apify start run status %d", resp.StatusCode)
	}
	var envelope map[string]interface{}
	if err := json.Unmarshal(raw, &envelope); err != nil {
		return "", "", fmt.Errorf("apify start run parse: %w", err)
	}
	data, _ := envelope["data"].(map[string]interface{})
	if data == nil {
		data = envelope
	}
	runID = stringField(data, "id")
	datasetID = stringField(data, "defaultDatasetId")
	if runID == "" {
		return "", "", fmt.Errorf("apify start run: missing run id")
	}
	return runID, datasetID, nil
}

func (p *KiwiApifyProvider) waitForRun(ctx context.Context, runID, datasetID string) (string, error) {
	deadline := time.Now().Add(3 * time.Minute)
	if dl, ok := ctx.Deadline(); ok && dl.Before(deadline) {
		deadline = dl
	}
	for {
		if err := ctx.Err(); err != nil {
			return "", fmt.Errorf("kiwi apify wait cancelled: %w", err)
		}
		if time.Now().After(deadline) {
			return "", fmt.Errorf("kiwi apify run timed out")
		}
		u := fmt.Sprintf("%s/actor-runs/%s?token=%s", p.baseURL, url.PathEscape(runID), url.QueryEscape(p.token))
		httpReq, err := http.NewRequestWithContext(ctx, http.MethodGet, u, nil)
		if err != nil {
			return "", err
		}
		resp, err := p.client.Do(httpReq)
		if err != nil {
			return "", fmt.Errorf("apify poll run: %w", err)
		}
		raw, _ := io.ReadAll(resp.Body)
		resp.Body.Close()
		if resp.StatusCode < 200 || resp.StatusCode >= 300 {
			return "", fmt.Errorf("apify poll status %d", resp.StatusCode)
		}
		var envelope map[string]interface{}
		if err := json.Unmarshal(raw, &envelope); err != nil {
			return "", err
		}
		data, _ := envelope["data"].(map[string]interface{})
		if data == nil {
			data = envelope
		}
		status := strings.ToUpper(stringField(data, "status"))
		if ds := stringField(data, "defaultDatasetId"); ds != "" {
			datasetID = ds
		}
		switch status {
		case "SUCCEEDED":
			if datasetID == "" {
				return "", fmt.Errorf("kiwi apify succeeded but missing dataset id")
			}
			return datasetID, nil
		case "FAILED", "ABORTED", "TIMED-OUT", "TIMED_OUT":
			return "", fmt.Errorf("kiwi apify run %s", strings.ToLower(status))
		}
		select {
		case <-ctx.Done():
			return "", ctx.Err()
		case <-time.After(kiwiPollInterval):
		}
	}
}

func (p *KiwiApifyProvider) fetchDatasetItems(ctx context.Context, datasetID string) ([]map[string]interface{}, error) {
	u := fmt.Sprintf("%s/datasets/%s/items?token=%s&clean=true&format=json",
		p.baseURL, url.PathEscape(datasetID), url.QueryEscape(p.token))
	httpReq, err := http.NewRequestWithContext(ctx, http.MethodGet, u, nil)
	if err != nil {
		return nil, err
	}
	resp, err := p.client.Do(httpReq)
	if err != nil {
		return nil, fmt.Errorf("apify dataset: %w", err)
	}
	defer resp.Body.Close()
	raw, _ := io.ReadAll(resp.Body)
	if resp.StatusCode < 200 || resp.StatusCode >= 300 {
		log.Printf("[KIWI] dataset status=%d body=%s", resp.StatusCode, truncateStr(string(raw), 300))
		return nil, fmt.Errorf("apify dataset status %d", resp.StatusCode)
	}
	var items []map[string]interface{}
	if err := json.Unmarshal(raw, &items); err == nil {
		return items, nil
	}
	// Some actors wrap results
	var wrap interface{}
	if err := json.Unmarshal(raw, &wrap); err != nil {
		return nil, fmt.Errorf("apify dataset parse: %w", err)
	}
	return flattenKiwiItems(wrap), nil
}

func flattenKiwiItems(v interface{}) []map[string]interface{} {
	switch x := v.(type) {
	case []interface{}:
		var out []map[string]interface{}
		for _, it := range x {
			if m, ok := it.(map[string]interface{}); ok {
				out = append(out, m)
			}
		}
		return out
	case map[string]interface{}:
		for _, key := range []string{"items", "results", "data", "flights", "options"} {
			if child, ok := x[key]; ok {
				if out := flattenKiwiItems(child); len(out) > 0 {
					return out
				}
			}
		}
	}
	return nil
}

// parseKiwiApifyItems normalizes actor dataset rows into ProviderResult.
// Resilient to solidcode/kiwi-scraper and similar schema variants.
func parseKiwiApifyItems(items []map[string]interface{}, req SearchRequest) []ProviderResult {
	now := time.Now().UTC()
	var out []ProviderResult
	for i, item := range items {
		pr := normalizeKiwiItem(item, req, i, now)
		if pr == nil || pr.Price.Amount <= 0 || len(pr.Legs) == 0 {
			continue
		}
		out = append(out, *pr)
	}
	return out
}

func normalizeKiwiItem(item map[string]interface{}, req SearchRequest, idx int, fetchedAt time.Time) *ProviderResult {
	if item == nil {
		return nil
	}
	price := firstFloat(item, "price", "priceUsd", "priceEUR", "priceEur", "totalPrice", "amount")
	currency := firstString(item, "currency", "currencyCode", "priceCurrency")
	if currency == "" {
		currency = req.Currency
	}
	if currency == "" {
		currency = "USD"
	}
	deepLink := firstString(item, "bookingUrl", "booking_url", "deepLink", "deep_link", "url", "link")
	selfTransfer := detectSelfTransfer(item)

	legs := extractKiwiLegs(item, req)
	if len(legs) == 0 {
		return nil
	}
	durMin := int(firstFloat(item, "durationMinutes", "duration_minutes"))
	if durMin <= 0 {
		if hours := firstFloat(item, "durationHours", "duration_hours", "duration"); hours > 0 {
			if hours < 100 { // likely hours not minutes
				durMin = int(hours * 60)
			} else {
				durMin = int(hours)
			}
		}
	}
	if durMin <= 0 {
		durMin = sumLegDurations(legs)
	}
	carriers := collectCarriers(legs)
	primary := ""
	if len(carriers) > 0 {
		primary = carriers[0]
	}
	meta := map[string]interface{}{}
	if v, ok := item["priceEur"]; ok {
		meta["priceEur"] = v
	}
	if v, ok := item["layoverNights"]; ok {
		meta["layoverNights"] = v
	}
	if v, ok := item["airlines"]; ok {
		meta["airlines"] = v
	}
	pr := &ProviderResult{
		ID:                    fmt.Sprintf("kiwi_%d", idx),
		Price:                 Monetary{Currency: currency, Amount: price},
		DurationMinutes:       durMin,
		Stops:                 TotalStops(ProviderResult{Legs: legs}),
		Legs:                  legs,
		ValidatingAirlines:    carriers,
		PrimaryDisplayCarrier: primary,
		Source:                "kiwi",
		DeepLink:              deepLink,
		VendorName:            "Kiwi.com",
		SelfTransfer:          selfTransfer,
		FetchedAt:             fetchedAt,
		Metadata:              meta,
		BaggageClass:          "BAG_UNKNOWN",
	}
	if selfTransfer {
		pr.FareConditions = "Self-transfer — separate tickets may be required"
	}
	return pr
}

func detectSelfTransfer(item map[string]interface{}) bool {
	for _, key := range []string{
		"selfTransfer", "self_transfer", "isSelfTransfer", "is_self_transfer",
		"virtualInterlining", "virtual_interlining", "viFlight", "bagsRecheckRequired",
	} {
		if b, ok := item[key].(bool); ok && b {
			return true
		}
		if s, ok := item[key].(string); ok {
			s = strings.ToLower(strings.TrimSpace(s))
			if s == "true" || s == "yes" || s == "1" {
				return true
			}
		}
	}
	// Nested quality/flags objects used by some Kiwi dumps
	for _, nestKey := range []string{"quality", "flags", "meta", "extras"} {
		if m, ok := item[nestKey].(map[string]interface{}); ok && detectSelfTransfer(m) {
			return true
		}
	}
	return false
}

func extractKiwiLegs(item map[string]interface{}, req SearchRequest) []Leg {
	// Preferred: segments[] with leg=outbound|inbound
	if segsRaw, ok := item["segments"].([]interface{}); ok && len(segsRaw) > 0 {
		var outSegs, inSegs []Segment
		for _, sAny := range segsRaw {
			s, _ := sAny.(map[string]interface{})
			if s == nil {
				continue
			}
			seg := kiwiSegmentFromMap(s, req.CabinPreference)
			if seg == nil {
				continue
			}
			legKind := strings.ToLower(firstString(s, "leg", "direction", "route"))
			switch {
			case strings.Contains(legKind, "in") || strings.Contains(legKind, "return"):
				inSegs = append(inSegs, *seg)
			default:
				outSegs = append(outSegs, *seg)
			}
		}
		var legs []Leg
		if len(outSegs) > 0 {
			legs = append(legs, Leg{Segments: outSegs})
		}
		if len(inSegs) > 0 {
			legs = append(legs, Leg{Segments: inSegs})
		}
		if len(legs) > 0 {
			return legs
		}
	}

	// Alternate: route / flights arrays
	if route, ok := item["route"].([]interface{}); ok && len(route) > 0 {
		var segs []Segment
		for _, sAny := range route {
			s, _ := sAny.(map[string]interface{})
			if seg := kiwiSegmentFromMap(s, req.CabinPreference); seg != nil {
				segs = append(segs, *seg)
			}
		}
		if len(segs) > 0 {
			return splitKiwiRouteByReturn(segs, req)
		}
	}
	if outArr, ok := asArray(item["outbound"], item["outboundSegments"], item["out"]); ok {
		inArr, _ := asArray(item["inbound"], item["inboundSegments"], item["return"], item["returnSegments"])
		var legs []Leg
		if segs := mapsToSegments(outArr, req.CabinPreference); len(segs) > 0 {
			legs = append(legs, Leg{Segments: segs})
		}
		if segs := mapsToSegments(inArr, req.CabinPreference); len(segs) > 0 {
			legs = append(legs, Leg{Segments: segs})
		}
		if len(legs) > 0 {
			return legs
		}
	}

	// Minimal fallback: single synthetic segment from top-level fields
	from := firstString(item, "originCode", "origin", "flyFrom", "from")
	to := firstString(item, "destinationCode", "destination", "flyTo", "to")
	if from == "" {
		from = req.Origin
	}
	if to == "" {
		to = req.Destination
	}
	dep := parseFlexibleTime(firstString(item, "departureTime", "departure", "dTimeUTC", "dTime"))
	arr := parseFlexibleTime(firstString(item, "arrivalTime", "arrival", "aTimeUTC", "aTime"))
	if from != "" && to != "" && !dep.IsZero() {
		cabin := req.CabinPreference
		if cabin == "" {
			cabin = "ECONOMY"
		}
		return []Leg{{Segments: []Segment{{
			From: from, To: to, DepartureTime: dep, ArrivalTime: arr,
			MarketingCarrier: firstString(item, "airlineCode", "airline"),
			FlightNumber:     firstString(item, "flightNumber", "flight_no"),
			CabinClass:       cabin,
		}}}}
	}
	return nil
}

func splitKiwiRouteByReturn(segs []Segment, req SearchRequest) []Leg {
	if req.ReturnDate == "" || len(segs) < 2 {
		return []Leg{{Segments: segs}}
	}
	// Split when destination of a segment returns toward origin (heuristic)
	dest := strings.ToUpper(req.Destination)
	for i := 1; i < len(segs); i++ {
		if strings.EqualFold(segs[i-1].To, dest) || strings.EqualFold(segs[i].From, dest) {
			return []Leg{
				{Segments: append([]Segment{}, segs[:i]...)},
				{Segments: append([]Segment{}, segs[i:]...)},
			}
		}
	}
	return []Leg{{Segments: segs}}
}

func kiwiSegmentFromMap(s map[string]interface{}, cabin string) *Segment {
	if s == nil {
		return nil
	}
	from := firstString(s, "fromCode", "flyFrom", "from", "origin", "originCode", "cityFrom")
	to := firstString(s, "toCode", "flyTo", "to", "destination", "destinationCode", "cityTo")
	if from == "" || to == "" {
		return nil
	}
	dep := parseFlexibleTime(firstString(s, "departureTimeUtc", "departureTime", "dTimeUTC", "dTime", "local_departure", "utc_departure"))
	arr := parseFlexibleTime(firstString(s, "arrivalTimeUtc", "arrivalTime", "aTimeUTC", "aTime", "local_arrival", "utc_arrival"))
	carrier := firstString(s, "airlineCode", "airline", "carrier", "operatingAirline")
	flightNum := firstString(s, "flightNumber", "flight_no", "flightNo", "number")
	dur := int(firstFloat(s, "durationMinutes"))
	if dur <= 0 {
		if h := firstFloat(s, "durationHours", "duration"); h > 0 {
			if h < 100 {
				dur = int(h * 60)
			} else {
				dur = int(h)
			}
		}
	}
	if cabin == "" {
		cabin = firstString(s, "cabinClass", "cabin")
	}
	if cabin == "" {
		cabin = "ECONOMY"
	}
	return &Segment{
		From:             strings.ToUpper(from),
		To:               strings.ToUpper(to),
		DepartureTime:    dep,
		ArrivalTime:      arr,
		MarketingCarrier: strings.ToUpper(carrier),
		FlightNumber:     flightNum,
		DurationMinutes:  dur,
		CabinClass:       cabin,
	}
}

func mapsToSegments(arr []interface{}, cabin string) []Segment {
	var segs []Segment
	for _, sAny := range arr {
		s, _ := sAny.(map[string]interface{})
		if seg := kiwiSegmentFromMap(s, cabin); seg != nil {
			segs = append(segs, *seg)
		}
	}
	return segs
}

func asArray(vals ...interface{}) ([]interface{}, bool) {
	for _, v := range vals {
		if arr, ok := v.([]interface{}); ok && len(arr) > 0 {
			return arr, true
		}
	}
	return nil, false
}

func sumLegDurations(legs []Leg) int {
	total := 0
	for _, leg := range legs {
		for _, s := range leg.Segments {
			total += s.DurationMinutes
		}
	}
	return total
}

func collectCarriers(legs []Leg) []string {
	seen := map[string]bool{}
	var out []string
	for _, leg := range legs {
		for _, s := range leg.Segments {
			c := strings.ToUpper(strings.TrimSpace(s.MarketingCarrier))
			if c == "" || seen[c] {
				continue
			}
			seen[c] = true
			out = append(out, c)
		}
	}
	return out
}

func firstString(m map[string]interface{}, keys ...string) string {
	for _, k := range keys {
		if v, ok := m[k]; ok {
			switch x := v.(type) {
			case string:
				if strings.TrimSpace(x) != "" {
					return strings.TrimSpace(x)
				}
			case float64:
				return strconv.FormatInt(int64(x), 10)
			}
		}
	}
	return ""
}

func firstFloat(m map[string]interface{}, keys ...string) float64 {
	for _, k := range keys {
		if v, ok := m[k]; ok {
			switch x := v.(type) {
			case float64:
				return x
			case int:
				return float64(x)
			case string:
				f, _ := strconv.ParseFloat(strings.TrimSpace(strings.ReplaceAll(x, ",", "")), 64)
				return f
			}
		}
	}
	return 0
}

func parseFlexibleTime(s string) time.Time {
	s = strings.TrimSpace(s)
	if s == "" {
		return time.Time{}
	}
	// Unix seconds as string
	if n, err := strconv.ParseInt(s, 10, 64); err == nil && n > 1_000_000_000 {
		return time.Unix(n, 0).UTC()
	}
	formats := []string{
		time.RFC3339,
		"2006-01-02T15:04:05Z",
		"2006-01-02T15:04:05",
		"2006-01-02 15:04:05",
		"2006-01-02 15:04",
		"2006-01-02T15:04",
	}
	for _, f := range formats {
		if t, err := time.Parse(f, s); err == nil {
			return t.UTC()
		}
		if t, err := time.ParseInLocation(f, s, time.UTC); err == nil {
			return t
		}
	}
	return time.Time{}
}

func stringField(m map[string]interface{}, key string) string {
	if m == nil {
		return ""
	}
	switch v := m[key].(type) {
	case string:
		return v
	case float64:
		return strconv.FormatInt(int64(v), 10)
	default:
		return ""
	}
}

func truncateStr(s string, n int) string {
	if len(s) <= n {
		return s
	}
	return s[:n] + "..."
}
