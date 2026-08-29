package bookingmatch

import (
	"fmt"
	"strings"
	"time"

	"flightcaptainweb/search"
)

const maxQueriesDefault = 5

// airportCityNames maps IATA codes to city names for richer search queries.
var airportCityNames = map[string]string{
	"TLV": "Tel Aviv", "VIE": "Vienna", "JFK": "New York", "LHR": "London",
	"CDG": "Paris", "FCO": "Rome", "BCN": "Barcelona", "ATH": "Athens",
	"FRA": "Frankfurt", "AMS": "Amsterdam", "MAD": "Madrid", "BER": "Berlin",
	"DXB": "Dubai", "SIN": "Singapore", "HND": "Tokyo", "NRT": "Tokyo",
	"LAX": "Los Angeles", "ORD": "Chicago", "MIA": "Miami", "BOS": "Boston",
	"ZRH": "Zurich", "MUC": "Munich", "CPH": "Copenhagen", "OSL": "Oslo",
	"IST": "Istanbul", "CAI": "Cairo", "BKK": "Bangkok", "SYD": "Sydney",
}

// GenerateQueries builds targeted web search queries from a canonical itinerary.
func GenerateQueries(it search.CanonicalItinerary, maxQueries int) []string {
	if maxQueries <= 0 {
		maxQueries = maxQueriesDefault
	}
	segs := it.Segments
	if len(segs) == 0 {
		return nil
	}

	var queries []string
	seen := map[string]struct{}{}
	add := func(q string) {
		q = strings.TrimSpace(q)
		if q == "" {
			return
		}
		if _, ok := seen[q]; ok {
			return
		}
		seen[q] = struct{}{}
		queries = append(queries, q)
	}

	if len(segs) == 1 {
		for _, q := range directFlightQueries(segs[0]) {
			add(q)
		}
	} else {
		for _, q := range connectingFlightQueries(segs) {
			add(q)
		}
	}

	out := queries
	if len(out) > maxQueries {
		out = out[:maxQueries]
	}
	return out
}

func directFlightQueries(seg search.CanonicalSegment) []string {
	carrier, fn := segmentIdentity(seg)
	from := search.NormalizeAirportCode(seg.From)
	to := search.NormalizeAirportCode(seg.To)
	date := segmentDateISO(seg)

	var qs []string
	addQuoted := func(parts ...string) string {
		var b strings.Builder
		for _, p := range parts {
			p = strings.TrimSpace(p)
			if p == "" {
				continue
			}
			if b.Len() > 0 {
				b.WriteByte(' ')
			}
			fmt.Fprintf(&b, "%q", p)
		}
		return b.String()
	}

	qs = append(qs, addQuoted(fn, from, to))
	if cityFrom, ok := airportCityNames[from]; ok {
		if cityTo, ok2 := airportCityNames[to]; ok2 {
			qs = append(qs, addQuoted(fn, cityFrom, cityTo))
		}
	}
	if date != "" {
		qs = append(qs, addQuoted(fn, from, to, date))
	}
	if carrier != "" && carrier != fn {
		qs = append(qs, addQuoted(carrier, fn, from, to, "book flight"))
	}
	return qs
}

func connectingFlightQueries(segs []search.CanonicalSegment) []string {
	if len(segs) == 0 {
		return nil
	}
	first := segs[0]
	last := segs[len(segs)-1]
	from := search.NormalizeAirportCode(first.From)
	to := search.NormalizeAirportCode(last.To)
	date := segmentDateISO(first)

	var flightNums []string
	for _, s := range segs {
		_, fn := segmentIdentity(s)
		if fn != "" {
			flightNums = append(flightNums, fn)
		}
	}

	addQuoted := func(parts ...string) string {
		var b strings.Builder
		for _, p := range parts {
			p = strings.TrimSpace(p)
			if p == "" {
				continue
			}
			if b.Len() > 0 {
				b.WriteByte(' ')
			}
			fmt.Fprintf(&b, "%q", p)
		}
		return b.String()
	}

	var qs []string
	parts := append(append([]string{}, flightNums...), from, to)
	qs = append(qs, addQuoted(parts...))
	if date != "" {
		partsWithDate := append(append([]string{}, flightNums...), from, to, date)
		qs = append(qs, addQuoted(partsWithDate...))
	}
	if len(segs) == 2 {
		_, fn1 := segmentIdentity(segs[0])
		_, fn2 := segmentIdentity(segs[1])
		mid := search.NormalizeAirportCode(segs[0].To)
		if fn1 != "" && fn2 != "" && mid != "" {
			qs = append(qs, addQuoted(fn1, fn2, from, mid, to))
		}
	}
	return qs
}

func segmentIdentity(seg search.CanonicalSegment) (carrier, flightNum string) {
	op := search.NormalizeCarrierCode(seg.OperatingCarrier)
	mkt := search.NormalizeCarrierCode(seg.MarketingCarrier)
	if op != "" {
		carrier = op
		if seg.OperatingFlightNumber != "" {
			flightNum = search.NormalizeFlightNumber(op, seg.OperatingFlightNumber)
		} else {
			flightNum = search.NormalizeFlightNumber(op, seg.FlightNumber)
		}
		return
	}
	carrier = mkt
	flightNum = search.NormalizeFlightNumber(mkt, seg.FlightNumber)
	return
}

func segmentDateISO(seg search.CanonicalSegment) string {
	if seg.DepartureTime.IsZero() {
		return ""
	}
	return seg.DepartureTime.UTC().Format("2006-01-02")
}

// segmentDateVariants returns common date strings that may appear in snippets.
func segmentDateVariants(seg search.CanonicalSegment) []string {
	if seg.DepartureTime.IsZero() {
		return nil
	}
	t := seg.DepartureTime
	iso := t.UTC().Format("2006-01-02")
	variants := []string{
		iso,
		t.Format("2 Jan 2006"),
		t.Format("Jan 2, 2006"),
		t.Format("January 2, 2006"),
		t.Format("01/02/2006"),
		t.Format("02/01/2006"),
	}
	return variants
}

func segmentDepTimeVariants(seg search.CanonicalSegment) []string {
	if seg.DepartureTime.IsZero() {
		return nil
	}
	t := seg.DepartureTime
	return []string{
		t.Format("15:04"),
		t.Format("3:04 PM"),
		t.Format("3:04PM"),
		fmt.Sprintf("%d:%02d", t.Hour(), t.Minute()),
	}
}

func segmentArrTimeVariants(seg search.CanonicalSegment) []string {
	if seg.ArrivalTime.IsZero() {
		return nil
	}
	t := seg.ArrivalTime
	return []string{
		t.Format("15:04"),
		t.Format("3:04 PM"),
		t.Format("3:04PM"),
		fmt.Sprintf("%d:%02d", t.Hour(), t.Minute()),
	}
}

// minutesOfDay returns minutes since midnight UTC for time comparison.
func minutesOfDay(t time.Time) int {
	if t.IsZero() {
		return -1
	}
	t = t.UTC()
	return t.Hour()*60 + t.Minute()
}
