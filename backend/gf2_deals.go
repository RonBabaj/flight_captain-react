package main

import (
	"context"
	"fmt"
	"log"
	"sort"
	"strconv"
	"strings"
	"sync"
	"time"

	"flightcaptainweb/search"
)

// FullRoundTrip is a round-trip deal for /month_deals and /flights/details (backed by GF2 CombinedOption).
type FullRoundTrip struct {
	OutboundFlight map[string]interface{}
	ReturnFlight   map[string]interface{}
	CombinedOption *FlightOption `json:"-"`
	TotalCost      float64
	OutboundDate   string
	ReturnDate     string
	Dictionaries   map[string]interface{}
}

const (
	maxGF2CalendarSamples = 10 // cap RT searches per month/range request (cost control)
	// Parallel calendar probes — sequential 12× RT regularly exceeds ~90s reverse-proxy timeouts (504).
	gf2CalendarConcurrency = 4

	// Explore: fixed destination pool + 24h cache; live GF2 only for small batches per request.
	exploreLiveFetchesPerRequest    = 12 // max GF2 Search() calls per HTTP batch (each RT may do 2 upstream legs inside provider)
	exploreLiveConcurrency          = 4  // parallel explore searches per batch (bounded to reduce in-process rate-limit spikes)
	exploreMaxLiveFetchesPerSession = 36 // hard cap per explore session (~3 refresh rounds)
	exploreRateLimitRetries         = 8  // per destination: wait for GF2 token bucket
	exploreRateLimitBackoff         = 14 * time.Second
)

func outboundDatesForMonthBookable(year, month int) []string {
	tomorrow := time.Now().UTC()
	tomorrow = time.Date(tomorrow.Year(), tomorrow.Month(), tomorrow.Day(), 0, 0, 0, 0, time.UTC).AddDate(0, 0, 1)
	lastDay := time.Date(year, time.Month(month)+1, 0, 0, 0, 0, 0, time.UTC).Day()
	var out []string
	for d := 1; d <= lastDay; d++ {
		day := time.Date(year, time.Month(month), d, 0, 0, 0, 0, time.UTC)
		if day.Before(tomorrow) {
			continue
		}
		out = append(out, day.Format("2006-01-02"))
	}
	return out
}

func subsampleDatesEvenly(dates []time.Time, max int) []time.Time {
	if len(dates) == 0 || max <= 0 {
		return nil
	}
	if len(dates) <= max {
		return dates
	}
	var out []time.Time
	step := float64(len(dates)-1) / float64(max-1)
	for i := 0; i < max; i++ {
		idx := int(float64(i)*step + 0.5)
		if idx >= len(dates) {
			idx = len(dates) - 1
		}
		out = append(out, dates[idx])
	}
	// de-dupe while preserving order
	seen := make(map[string]struct{})
	var deduped []time.Time
	for _, d := range out {
		k := d.Format("2006-01-02")
		if _, ok := seen[k]; ok {
			continue
		}
		seen[k] = struct{}{}
		deduped = append(deduped, d)
	}
	return deduped
}

func totalStopsInOption(opt *FlightOption) int {
	if opt == nil {
		return 0
	}
	s := 0
	for _, leg := range opt.Legs {
		if n := len(leg.Segments); n > 0 {
			s += n - 1
		}
	}
	return s
}

func pickCheapestGF2Option(prs []search.ProviderResult) *FlightOption {
	opts := providerResultsToFlightOptions(prs)
	if len(opts) == 0 {
		return nil
	}
	sort.Slice(opts, func(i, j int) bool {
		return opts[i].Price.Amount < opts[j].Price.Amount
	})
	o := opts[0]
	return &o
}

// gf2OneRoundTrip runs one GF2 round-trip search and returns a FullRoundTrip with CombinedOption set.
// When ensureLegs is true, missing return segment data triggers an extra one-way fetch (needed for flight details).
// Calendar/month deals should pass ensureLegs=false — price is already combined by searchRoundTrip.
func gf2OneRoundTrip(ctx context.Context, p *search.GoogleFlights2Provider, origin, destination, outStr, retStr, currency string, adults, children int, cabinPref string, includeBag bool, nonStop bool, ensureLegs bool) (*FullRoundTrip, error) {
	if p == nil {
		return nil, fmt.Errorf("google flights provider not configured")
	}
	sreq := search.SearchRequest{
		Origin:            origin,
		Destination:       destination,
		DepartureDate:     outStr,
		ReturnDate:        retStr,
		CabinClass:        cabinPref,
		CabinPreference:   cabinPref,
		IncludeCheckedBag: includeBag,
		Adults:            adults,
		Children:          children,
		Currency:          currency,
	}
	prs, err := p.Search(ctx, sreq)
	if err != nil {
		return nil, err
	}
	if len(prs) == 0 {
		return nil, nil
	}
	opt := pickCheapestGF2Option(prs)
	if opt == nil {
		return nil, nil
	}
	if ensureLegs {
		opt = ensureRoundTripLegs(ctx, p, opt, origin, destination, retStr, currency, adults, children, cabinPref, includeBag)
	}
	if nonStop && totalStopsInOption(opt) > 0 {
		return nil, nil
	}
	cost := opt.Price.Amount
	return &FullRoundTrip{
		CombinedOption: opt,
		TotalCost:      cost,
		OutboundDate:   outStr,
		ReturnDate:     retStr,
	}, nil
}

// ensureRoundTripLegs appends a return leg when GF2 only returned outbound segment data.
// Price is left unchanged: Search() with a return date already returns the round-trip total
// (combined OW+OW in searchRoundTrip, or a native RT fare). Adding the return one-way fare
// here double-counted (month-deals card showed the true RT total, e.g. ₪592, while flight
// details inflated it to ₪1356 after attaching the return leg).
func ensureRoundTripLegs(ctx context.Context, p *search.GoogleFlights2Provider, opt *FlightOption, origin, destination, returnDate, currency string, adults, children int, cabinPref string, includeBag bool) *FlightOption {
	if opt == nil || len(opt.Legs) >= 2 || returnDate == "" || p == nil {
		return opt
	}
	log.Printf("[GF2_RT] option %s has %d leg(s); fetching return one-way %s→%s on %s (display only, price kept at %.2f)", opt.ID, len(opt.Legs), destination, origin, returnDate, opt.Price.Amount)
	returnReq := search.SearchRequest{
		Origin:            destination,
		Destination:       origin,
		DepartureDate:     returnDate,
		CabinClass:        cabinPref,
		CabinPreference:   cabinPref,
		IncludeCheckedBag: includeBag,
		Adults:            adults,
		Children:          children,
		Currency:          currency,
	}
	prs, err := p.Search(ctx, returnReq)
	if err != nil || len(prs) == 0 {
		log.Printf("[GF2_RT] return leg search failed: err=%v results=%d", err, len(prs))
		return opt
	}
	retOpt := pickCheapestGF2Option(prs)
	if retOpt == nil || len(retOpt.Legs) == 0 {
		return opt
	}
	attachReturnLegKeepPrice(opt, retOpt.Legs[0])
	return opt
}

// attachReturnLegKeepPrice adds return segment data for the details UI without changing fare.
// Clears BookingToken because one-way tokens are invalid once a separate return leg is stitched.
func attachReturnLegKeepPrice(opt *FlightOption, retLeg FlightLeg) {
	if opt == nil {
		return
	}
	opt.Legs = append(opt.Legs, retLeg)
	opt.BookingToken = ""
}

func gf2SearchDealsRange(ctx context.Context, p *search.GoogleFlights2Provider, origin, destination string, startDate, endDate time.Time, durationDays int, currency string, adults, children int, nonStop bool, cabinPref string, includeBag bool) ([]FullRoundTrip, error) {
	var days []time.Time
	for d := startDate; !d.After(endDate); d = d.AddDate(0, 0, 1) {
		days = append(days, d)
	}
	days = subsampleDatesEvenly(days, maxGF2CalendarSamples)
	return gf2SearchDealsOnDates(ctx, p, origin, destination, days, durationDays, currency, adults, children, nonStop, cabinPref, includeBag)
}

func gf2SearchMonthDeals(ctx context.Context, p *search.GoogleFlights2Provider, origin, destination string, month time.Time, durationDays int, currency string, adults, children int, nonStop bool, cabinPref string, includeBag bool) ([]FullRoundTrip, error) {
	firstOfMonth := time.Date(month.Year(), month.Month(), 1, 0, 0, 0, 0, time.UTC)
	tomorrow := time.Now().UTC().Truncate(24*time.Hour).AddDate(0, 0, 1)
	start := firstOfMonth
	if tomorrow.After(firstOfMonth) {
		start = tomorrow
	}
	if start.Month() != month.Month() {
		return nil, nil
	}
	lastDay := time.Date(month.Year(), month.Month()+1, 0, 0, 0, 0, 0, time.UTC).Day()
	var days []time.Time
	for d := 1; d <= lastDay; d++ {
		day := time.Date(month.Year(), month.Month(), d, 0, 0, 0, 0, time.UTC)
		if day.Before(start) {
			continue
		}
		if day.Month() != month.Month() {
			break
		}
		days = append(days, day)
	}
	days = subsampleDatesEvenly(days, maxGF2CalendarSamples)
	return gf2SearchDealsOnDates(ctx, p, origin, destination, days, durationDays, currency, adults, children, nonStop, cabinPref, includeBag)
}

// gf2SearchDealsOnDates probes sampled departure dates in parallel (bounded concurrency).
// ensureLegs is false: calendar cards only need combined price + best-effort meta.
func gf2SearchDealsOnDates(ctx context.Context, p *search.GoogleFlights2Provider, origin, destination string, days []time.Time, durationDays int, currency string, adults, children int, nonStop bool, cabinPref string, includeBag bool) ([]FullRoundTrip, error) {
	if len(days) == 0 {
		return nil, nil
	}
	type result struct {
		trip *FullRoundTrip
		err  error
		day  string
	}
	workers := gf2CalendarConcurrency
	if workers > len(days) {
		workers = len(days)
	}
	jobs := make(chan time.Time, len(days))
	out := make(chan result, len(days))
	var wg sync.WaitGroup
	for i := 0; i < workers; i++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			for day := range jobs {
				if ctx.Err() != nil {
					return
				}
				outStr := day.Format("2006-01-02")
				retStr := day.AddDate(0, 0, durationDays).Format("2006-01-02")
				trip, err := gf2OneRoundTrip(ctx, p, origin, destination, outStr, retStr, currency, adults, children, cabinPref, includeBag, nonStop, false)
				out <- result{trip: trip, err: err, day: outStr}
			}
		}()
	}
	for _, day := range days {
		jobs <- day
	}
	close(jobs)
	go func() {
		wg.Wait()
		close(out)
	}()

	var trips []FullRoundTrip
	for r := range out {
		if r.err != nil {
			log.Printf("[GF2_DEALS] %s: %v", r.day, r.err)
			continue
		}
		if r.trip != nil {
			trips = append(trips, *r.trip)
		}
	}
	sort.Slice(trips, func(i, j int) bool {
		return trips[i].OutboundDate < trips[j].OutboundDate
	})
	return trips, nil
}

type exploreDestRow struct {
	destination   string
	price         float64
	departureDate string
	priceSource   string // live | cached | estimated
}

func isGF2RateLimitErr(err error) bool {
	if err == nil {
		return false
	}
	return strings.Contains(strings.ToLower(err.Error()), "rate limit")
}

// gf2ExploreResolveDeps returns departure/return dates used for GF2 explore searches.
func gf2ExploreResolveDeps(departureDate, returnDate string, useMonthSample bool, year, month, durationDays int) (dep, ret string, monthEmpty bool) {
	if useMonthSample {
		dates := outboundDatesForMonthBookable(year, month)
		if len(dates) == 0 {
			return "", "", true
		}
		mid := dates[len(dates)/2]
		dep = mid
		if t, err := time.Parse("2006-01-02", mid); err == nil {
			ret = t.AddDate(0, 0, durationDays).Format("2006-01-02")
		}
		return dep, ret, false
	}
	dep = departureDate
	ret = returnDate
	if dep == "" {
		dep = time.Now().UTC().AddDate(0, 0, 14).Format("2006-01-02")
	}
	return dep, ret, false
}

func exploreDestRowsToMaps(rows []exploreDestRow, currency string) []map[string]interface{} {
	out := make([]map[string]interface{}, 0, len(rows))
	for _, r := range rows {
		m := map[string]interface{}{
			"destination":   r.destination,
			"price":         strconv.FormatFloat(r.price, 'f', 2, 64),
			"currency":      currency,
			"departureDate": r.departureDate,
			"priceSource":   r.priceSource,
		}
		out = append(out, m)
	}
	return out
}

// gf2ExploreSearchOneDestination runs one GF2 RT search for explore; returns nil if no price.
func gf2ExploreSearchOneDestination(ctx context.Context, p *search.GoogleFlights2Provider, sess *exploreSession, dest string) *exploreDestRow {
	sreq := search.SearchRequest{
		Origin:            sess.Origin,
		Destination:       dest,
		DepartureDate:     sess.Dep,
		ReturnDate:        sess.Ret,
		CabinClass:        sess.CabinPref,
		CabinPreference:   sess.CabinPref,
		IncludeCheckedBag: sess.IncludeBag,
		Adults:            sess.Adults,
		Children:          sess.Children,
		Currency:          sess.Currency,
	}
	var prs []search.ProviderResult
	var err error
	for attempt := 0; attempt < exploreRateLimitRetries; attempt++ {
		if ctx.Err() != nil {
			return nil
		}
		prs, err = p.Search(ctx, sreq)
		if err == nil {
			break
		}
		if isGF2RateLimitErr(err) {
			select {
			case <-time.After(exploreRateLimitBackoff):
			case <-ctx.Done():
				return nil
			}
			continue
		}
		break
	}
	if err != nil || len(prs) == 0 {
		return nil
	}
	opt := pickCheapestGF2Option(prs)
	if opt == nil {
		return nil
	}
	if sess.NonStop && totalStopsInOption(opt) > 0 {
		return nil
	}
	return &exploreDestRow{
		destination:   dest,
		price:         opt.Price.Amount,
		departureDate: sess.Dep,
		priceSource:   "live",
	}
}

// exploreRunLiveBatch runs up to exploreLiveFetchesPerRequest live GF2 calls for the next slice of LiveQueue.
func exploreRunLiveBatch(ctx context.Context, p *search.GoogleFlights2Provider, sess *exploreSession) error {
	if p == nil {
		return nil
	}
	sess.mu.Lock()
	if sess.LiveInFlight {
		sess.mu.Unlock()
		return nil
	}
	if sess.LiveFetchAttempts >= exploreMaxLiveFetchesPerSession {
		sess.mu.Unlock()
		return nil
	}
	start := sess.LiveQueueCursor
	if start >= len(sess.LiveQueue) {
		sess.mu.Unlock()
		return nil
	}
	room := exploreMaxLiveFetchesPerSession - sess.LiveFetchAttempts
	max := exploreLiveFetchesPerRequest
	if max > room {
		max = room
	}
	end := start + max
	if end > len(sess.LiveQueue) {
		end = len(sess.LiveQueue)
	}
	batch := append([]string(nil), sess.LiveQueue[start:end]...)
	// Claim the batch but only commit the cursor after work finishes so a timed-out
	// HTTP handler does not permanently skip destinations that never merged.
	sess.LiveInFlight = true
	sess.mu.Unlock()
	defer func() {
		sess.mu.Lock()
		sess.LiveInFlight = false
		sess.mu.Unlock()
	}()

	var incoming []exploreDestRow
	var incomingMu sync.Mutex
	var wg sync.WaitGroup
	sem := make(chan struct{}, exploreLiveConcurrency)
	for _, dest := range batch {
		if ctx.Err() != nil {
			break
		}
		dest := dest
		wg.Add(1)
		go func() {
			defer wg.Done()
			select {
			case sem <- struct{}{}:
				defer func() { <-sem }()
			case <-ctx.Done():
				return
			}
			if ctx.Err() != nil {
				return
			}
			row := gf2ExploreSearchOneDestination(ctx, p, sess, dest)
			sess.mu.Lock()
			sess.LiveFetchAttempts++
			sess.mu.Unlock()
			if row == nil {
				return
			}
			key := explorePriceCacheKey(sess.Origin, dest, sess.Currency, sess.UseMonth, sess.Year, sess.Month, sess.DurationDays, sess.Adults, sess.Children, sess.NonStop, sess.Dep, sess.Ret)
			explorePriceCachePut(key, row.price, row.departureDate)
			incomingMu.Lock()
			incoming = append(incoming, *row)
			incomingMu.Unlock()
		}()
	}
	wg.Wait()

	sess.mu.Lock()
	// Advance past this batch only after work completes (even if some dests returned nil).
	sess.LiveQueueCursor = end
	sess.Rows = mergeExplorePriceRows(sess.Rows, incoming)
	attempts := sess.LiveFetchAttempts
	sess.mu.Unlock()
	log.Printf("[EXPLORE_LIVE] batchDests=%d mergedLive=%d totalAttempts=%d", len(batch), len(incoming), attempts)
	return nil
}
