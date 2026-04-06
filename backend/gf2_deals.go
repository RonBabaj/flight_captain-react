package main

import (
	"context"
	"fmt"
	"log"
	"sort"
	"strconv"
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
	maxGF2CalendarSamples     = 12 // cap RT searches per month/range request (cost control)
	maxExploreGF2Destinations = 24 // cap destinations per /api/explore (cost control)
	exploreGF2Concurrency     = 2  // parallel explore workers (RapidAPI GF2 is rate-limited)
)

// anywhereDestinations is a curated list of major airports for /api/explore (GF2 one search per destination).
var anywhereDestinations = []string{
	"LHR", "LGW", "STN", "MAN", "EDI", "BHX",
	"CDG", "ORY", "NCE", "LYS", "MRS",
	"FCO", "MXP", "VCE", "NAP", "BLQ",
	"AMS", "BRU", "LUX",
	"MAD", "BCN", "VLC", "AGP", "PMI", "SVQ",
	"LIS", "OPO",
	"FRA", "MUC", "BER", "HAM", "DUS", "STR",
	"ZRH", "GVA",
	"VIE",
	"CPH", "OSL", "ARN", "HEL", "KEF", "RKV",
	"WAW", "KRK", "GDN",
	"PRG", "BUD", "BTS",
	"BEG", "SKP", "TGD",
	"ATH", "SKG", "HER", "RHO",
	"SOF", "OTP", "CLJ",
	"DUB", "SNN",
	"DXB", "AUH", "DOH", "KWI", "BAH", "MCT",
	"IST", "SAW",
	"AMM", "BEY", "RUH", "JED",
	"CAI", "HRG", "SSH",
	"NBO", "JNB", "CPT", "DUR",
	"CMN", "TUN", "ALG",
	"ADD", "ACC", "LOS", "ABV", "DKR",
	"DAR", "EBB",
	"DEL", "BOM", "MAA", "BLR", "HYD", "CCU",
	"CMB", "KTM", "DAC",
	"BKK", "DMK", "KBV",
	"SIN",
	"KUL", "PEN",
	"CGK", "DPS",
	"MNL",
	"SGN", "HAN",
	"REP",
	"RGN",
	"HKG",
	"TPE",
	"ICN", "PUS",
	"HND", "NRT", "KIX", "NGO", "FUK", "CTS",
	"PVG", "PEK", "CAN", "CTU", "WUH", "SZX",
	"SYD", "MEL", "BNE", "PER", "ADL",
	"AKL", "CHC",
	"MLE",
	"JFK", "EWR", "LGA", "BOS", "PHL", "DCA",
	"ATL", "MCO", "MIA", "FLL", "TPA",
	"ORD", "MDW", "DTW", "MSP", "CLE",
	"DFW", "IAH", "AUS", "SAT",
	"DEN", "PHX", "LAS", "SLC",
	"LAX", "SFO", "SEA", "PDX", "SAN",
	"YYZ", "YUL", "YVR", "YYC",
	"MEX", "GDL", "MTY", "CUN",
	"PTY",
	"BOG", "MDE",
	"LIM",
	"GRU", "GIG", "BSB", "SSA",
	"EZE", "COR",
	"SCL",
	"UIO", "GYE",
	"CCS",
	"HAV",
}

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
func gf2OneRoundTrip(ctx context.Context, p *search.GoogleFlights2Provider, origin, destination, outStr, retStr, currency string, adults, children int, cabinPref string, includeBag bool, nonStop bool) (*FullRoundTrip, error) {
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

func gf2SearchDealsRange(ctx context.Context, p *search.GoogleFlights2Provider, origin, destination string, startDate, endDate time.Time, durationDays int, currency string, adults, children int, nonStop bool, cabinPref string, includeBag bool) ([]FullRoundTrip, error) {
	var days []time.Time
	for d := startDate; !d.After(endDate); d = d.AddDate(0, 0, 1) {
		days = append(days, d)
	}
	days = subsampleDatesEvenly(days, maxGF2CalendarSamples)
	var trips []FullRoundTrip
	for _, day := range days {
		outStr := day.Format("2006-01-02")
		retStr := day.AddDate(0, 0, durationDays).Format("2006-01-02")
		trip, err := gf2OneRoundTrip(ctx, p, origin, destination, outStr, retStr, currency, adults, children, cabinPref, includeBag, nonStop)
		if err != nil {
			log.Printf("[GF2_DEALS] range %s: %v", outStr, err)
			continue
		}
		if trip != nil {
			trips = append(trips, *trip)
		}
	}
	return trips, nil
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
	var trips []FullRoundTrip
	for _, day := range days {
		outStr := day.Format("2006-01-02")
		retStr := day.AddDate(0, 0, durationDays).Format("2006-01-02")
		trip, err := gf2OneRoundTrip(ctx, p, origin, destination, outStr, retStr, currency, adults, children, cabinPref, includeBag, nonStop)
		if err != nil {
			log.Printf("[GF2_DEALS] month %s: %v", outStr, err)
			continue
		}
		if trip != nil {
			trips = append(trips, *trip)
		}
	}
	return trips, nil
}

type exploreDestRow struct {
	destination   string
	price         float64
	departureDate string
}

// gf2ExploreDestinations runs GF2 searches for a capped subset of anywhereDestinations.
func gf2ExploreDestinations(ctx context.Context, p *search.GoogleFlights2Provider, origin, departureDate, returnDate, currency string, adults, children int, nonStop bool, cabinPref string, includeBag bool, useMonthSample bool, year, month, durationDays int) ([]map[string]interface{}, error) {
	if p == nil {
		return nil, fmt.Errorf("google flights provider not configured")
	}
	var dep, ret string
	if useMonthSample {
		dates := outboundDatesForMonthBookable(year, month)
		if len(dates) == 0 {
			return []map[string]interface{}{}, nil
		}
		mid := dates[len(dates)/2]
		dep = mid
		if t, err := time.Parse("2006-01-02", mid); err == nil {
			ret = t.AddDate(0, 0, durationDays).Format("2006-01-02")
		}
	} else {
		dep = departureDate
		ret = returnDate
	}
	if dep == "" {
		dep = time.Now().UTC().AddDate(0, 0, 14).Format("2006-01-02")
	}

	destList := make([]string, 0, len(anywhereDestinations))
	for _, d := range anywhereDestinations {
		if d != origin {
			destList = append(destList, d)
		}
	}
	if len(destList) > maxExploreGF2Destinations {
		destList = destList[:maxExploreGF2Destinations]
	}

	sem := make(chan struct{}, exploreGF2Concurrency)
	type jobRes struct {
		row exploreDestRow
		ok  bool
	}
	resCh := make(chan jobRes, len(destList))
	var wg sync.WaitGroup
	for _, dest := range destList {
		dest := dest
		wg.Add(1)
		go func() {
			defer wg.Done()
			sem <- struct{}{}
			defer func() { <-sem }()

			sreq := search.SearchRequest{
				Origin:            origin,
				Destination:       dest,
				DepartureDate:     dep,
				ReturnDate:        ret,
				CabinClass:        cabinPref,
				CabinPreference:   cabinPref,
				IncludeCheckedBag: includeBag,
				Adults:            adults,
				Children:          children,
				Currency:          currency,
			}
			prs, err := p.Search(ctx, sreq)
			if err != nil || len(prs) == 0 {
				return
			}
			opt := pickCheapestGF2Option(prs)
			if opt == nil {
				return
			}
			if nonStop && totalStopsInOption(opt) > 0 {
				return
			}
			resCh <- jobRes{row: exploreDestRow{destination: dest, price: opt.Price.Amount, departureDate: dep}, ok: true}
		}()
	}
	go func() {
		wg.Wait()
		close(resCh)
	}()

	var all []exploreDestRow
	for r := range resCh {
		if r.ok {
			all = append(all, r.row)
		}
	}
	sort.Slice(all, func(i, j int) bool { return all[i].price < all[j].price })

	out := make([]map[string]interface{}, 0, len(all))
	for _, r := range all {
		out = append(out, map[string]interface{}{
			"destination":   r.destination,
			"price":         strconv.FormatFloat(r.price, 'f', 2, 64),
			"currency":      currency,
			"departureDate": r.departureDate,
		})
	}
	return out, nil
}
