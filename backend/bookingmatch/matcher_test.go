package bookingmatch

import (
	"context"
	"strings"
	"testing"
	"time"

	"flightcaptainweb/search"
)

func testItineraryOS860() search.CanonicalItinerary {
	dep := time.Date(2027, 1, 7, 10, 0, 0, 0, time.UTC)
	arr := time.Date(2027, 1, 7, 12, 30, 0, 0, time.UTC)
	seg := search.CanonicalSegment{
		From: "TLV", To: "VIE",
		DepartureTime: dep, ArrivalTime: arr,
		MarketingCarrier: "OS", FlightNumber: "OS860",
	}
	return search.CanonicalItinerary{
		Segments: []search.CanonicalSegment{seg},
		Legs:     []search.CanonicalLeg{{Segments: []search.CanonicalSegment{seg}}},
		Price:    search.Monetary{Currency: "USD", Amount: 220},
		Source:   "googleflights2",
	}
}

func testConnectingTLVJFK() search.CanonicalItinerary {
	dep1 := time.Date(2026, 11, 1, 8, 0, 0, 0, time.UTC)
	arr1 := time.Date(2026, 11, 1, 12, 0, 0, 0, time.UTC)
	dep2 := time.Date(2026, 11, 1, 14, 0, 0, 0, time.UTC)
	arr2 := time.Date(2026, 11, 1, 20, 0, 0, 0, time.UTC)
	s1 := search.CanonicalSegment{From: "TLV", To: "FRA", DepartureTime: dep1, ArrivalTime: arr1, MarketingCarrier: "LH", FlightNumber: "LH687"}
	s2 := search.CanonicalSegment{From: "FRA", To: "JFK", DepartureTime: dep2, ArrivalTime: arr2, MarketingCarrier: "LH", FlightNumber: "LH400"}
	return search.CanonicalItinerary{
		Segments: []search.CanonicalSegment{s1, s2},
		Legs:     []search.CanonicalLeg{{Segments: []search.CanonicalSegment{s1, s2}}},
	}
}

func cfgTest() Config {
	return Config{VerifyThreshold: 85, MaxQueries: 5, MaxCandidates: 20}
}

// testPriceNormalizer converts EUR/GBP to USD for deterministic test comparisons.
func testPriceNormalizer(amount float64, from, to string) (float64, string) {
	if to != "USD" {
		return amount, from
	}
	switch from {
	case "EUR":
		return amount * 1.1, "USD"
	case "GBP":
		return amount * 1.25, "USD"
	default:
		return amount, from
	}
}

func TestExtractPrice_euroPrefixNotArrivalTime(t *testing.T) {
	snippet := "OS860 TLV to VIE January 7, 2027 10:00 12:30 €137"
	amount, cur, ok := extractPrice(snippet)
	if !ok || cur != "EUR" || amount != 137 {
		t.Fatalf("expected €137, got ok=%v amount=%v cur=%s", ok, amount, cur)
	}
}

func TestVerifyCandidate_exactFlightMatch(t *testing.T) {
	it := testItineraryOS860()
	c := SearchCandidate{
		URL:     "https://www.austrian.com/book/OS860",
		Title:   "Book OS860 Tel Aviv to Vienna",
		Snippet: "OS860 TLV to VIE on January 7, 2027 departs 10:00 arrives 12:30. Price $199.",
		Domain:  "austrian.com",
	}
	offer := VerifyCandidate(it, c, cfgTest())
	if offer.VerificationStatus != StatusVerifiedExact {
		t.Fatalf("status=%s score=%d reason=%s", offer.VerificationStatus, offer.MatchScore, offer.RejectionReason)
	}
	if offer.MatchScore < 85 {
		t.Fatalf("score=%d", offer.MatchScore)
	}
	if offer.URLType != URLTypeExactBooking {
		t.Fatalf("urlType=%s", offer.URLType)
	}
}

func TestVerifyCandidate_sameRouteDifferentFlightNumber(t *testing.T) {
	it := testItineraryOS860()
	c := SearchCandidate{
		URL:     "https://kayak.com/flights/TLV-VIE",
		Snippet: "OS862 TLV to Vienna January 7, 2027 10:00 — from $180",
		Domain:  "kayak.com",
	}
	offer := VerifyCandidate(it, c, cfgTest())
	if offer.VerificationStatus == StatusVerifiedExact {
		t.Fatal("wrong flight number must not verify as exact")
	}
}

func TestVerifyCandidate_wrongDate(t *testing.T) {
	it := testItineraryOS860()
	c := SearchCandidate{
		URL:     "https://expedia.com/flight/OS860",
		Snippet: "OS860 TLV VIE January 8, 2027 dep 10:00",
		Domain:  "expedia.com",
	}
	offer := VerifyCandidate(it, c, cfgTest())
	if offer.VerificationStatus == StatusVerifiedExact {
		t.Fatal("wrong date must not verify exact")
	}
}

func TestVerifyCandidate_wrongDestination(t *testing.T) {
	it := testItineraryOS860()
	c := SearchCandidate{
		URL:     "https://booking.com/flight",
		Snippet: "OS860 TLV to Berlin January 7, 2027 10:00",
		Domain:  "booking.com",
	}
	offer := VerifyCandidate(it, c, cfgTest())
	if offer.VerificationStatus == StatusVerifiedExact {
		t.Fatal("wrong destination must not verify exact")
	}
}

func TestVerifyCandidate_connectingOneWrongSegment(t *testing.T) {
	it := testConnectingTLVJFK()
	c := SearchCandidate{
		URL:     "https://lufthansa.com/book",
		Snippet: "LH687 TLV-FRA and LH401 FRA-JFK Nov 1 2026",
		Domain:  "lufthansa.com",
	}
	offer := VerifyCandidate(it, c, cfgTest())
	if offer.VerificationStatus == StatusVerifiedExact {
		t.Fatal("LH401 vs LH400 should not verify exact")
	}
}

func TestSelectBestOffer_multipleMatching(t *testing.T) {
	price199 := 199.0
	price249 := 249.0
	offers := []BookingOffer{
		{URL: "https://kayak.com/flights/x", URLType: URLTypeExactSearch, MatchScore: 90, VerificationStatus: StatusVerifiedExact, Price: &price249, Currency: "USD"},
		{URL: "https://airline.com/book/checkout", URLType: URLTypeExactBooking, MatchScore: 88, VerificationStatus: StatusVerifiedExact, Price: &price199, Currency: "USD"},
		{URL: "https://google.com/search?q=flights", URLType: URLTypeGenericSearch, MatchScore: 95, VerificationStatus: StatusVerifiedExact, Price: floatPtr(99)},
	}
	best := SelectBestOffer(offers, testPriceNormalizer, nil)
	if best == nil {
		t.Fatal("expected best offer")
	}
	if best.URL != "https://airline.com/book/checkout" {
		t.Fatalf("expected cheapest offer, got url=%s price=%v", best.URL, best.Price)
	}
}

func TestSelectBestOffer_prefersPriceAmongSameURLType(t *testing.T) {
	low := 150.0
	high := 300.0
	offers := []BookingOffer{
		{URL: "https://ota.com/book/a", URLType: URLTypeExactBooking, MatchScore: 90, VerificationStatus: StatusVerifiedExact, Price: &high},
		{URL: "https://ota.com/book/b", URLType: URLTypeExactBooking, MatchScore: 90, VerificationStatus: StatusVerifiedExact, Price: &low},
	}
	best := SelectBestOffer(offers, testPriceNormalizer, nil)
	if best == nil || best.Price == nil || *best.Price != low {
		t.Fatalf("expected cheaper offer, got %v", best)
	}
}

func TestSelectBestOffer_missingPrice(t *testing.T) {
	offers := []BookingOffer{
		{URL: "https://airline.com/book", URLType: URLTypeExactBooking, MatchScore: 90, VerificationStatus: StatusVerifiedExact, Domain: "airline.com"},
	}
	best := SelectBestOffer(offers, testPriceNormalizer, nil)
	if best == nil || best.Domain != "airline.com" {
		t.Fatalf("expected verified offer without extracted price as fallback, got %v", best)
	}
}

func TestSelectBestOffer_prefersQuoteMatchingPrice(t *testing.T) {
	cheapMismatch := 100.0
	expensiveMatch := 200.0
	quote := QuoteBinding{Amount: 198, Currency: "USD"}
	offers := []BookingOffer{
		{Domain: "cheap.com", URL: "https://cheap.com/book", URLType: URLTypeExactBooking, MatchScore: 90, VerificationStatus: StatusVerifiedExact, Price: &cheapMismatch, Currency: "USD"},
		{Domain: "matched.com", URL: "https://matched.com/book", URLType: URLTypeExactBooking, MatchScore: 88, VerificationStatus: StatusVerifiedExact, Price: &expensiveMatch, Currency: "USD"},
	}
	best := SelectBestOffer(offers, testPriceNormalizer, &quote)
	if best == nil || best.Domain != "matched.com" {
		t.Fatalf("expected quote-matching offer, got %+v", best)
	}
}

func TestSelectBestOffer_rejectsUnverified(t *testing.T) {
	offers := []BookingOffer{
		{URL: "https://x.com", MatchScore: 99, VerificationStatus: StatusPartial},
	}
	if SelectBestOffer(offers, testPriceNormalizer, nil) != nil {
		t.Fatal("unverified must not be selected")
	}
}

func TestGenerateQueries_direct(t *testing.T) {
	it := testItineraryOS860()
	qs := GenerateQueries(it, 5)
	if len(qs) == 0 {
		t.Fatal("expected queries")
	}
	found := false
	for _, q := range qs {
		if strings.Contains(q, "OS860") && strings.Contains(q, "TLV") && strings.Contains(q, "VIE") {
			found = true
		}
	}
	if !found {
		t.Fatalf("missing core query, got %v", qs)
	}
}

func TestGenerateQueries_gf2AirlineNameIdentity(t *testing.T) {
	dep := time.Date(2026, 9, 15, 16, 30, 0, 0, time.UTC)
	arr := time.Date(2026, 9, 15, 20, 10, 0, 0, time.UTC)
	seg := search.CanonicalSegment{
		From: "TLV", To: "CDG",
		DepartureTime: dep, ArrivalTime: arr,
		MarketingCarrier: "AF", FlightNumber: "AF963",
	}
	it := search.CanonicalItinerary{Segments: []search.CanonicalSegment{seg}}
	qs := GenerateQueries(it, 5)
	found := false
	for _, q := range qs {
		if strings.Contains(q, "AF963") {
			found = true
		}
		if strings.Contains(q, "AIR FRANCE") {
			t.Fatalf("query must not contain full airline name: %q", q)
		}
	}
	if !found {
		t.Fatalf("expected AF963 in queries, got %v", qs)
	}
}

func TestGenerateQueries_connecting(t *testing.T) {
	it := testConnectingTLVJFK()
	qs := GenerateQueries(it, 8)
	if len(qs) == 0 {
		t.Fatal("expected queries")
	}
	foundCombined := false
	for _, q := range qs {
		if strings.Contains(q, "LH687") && strings.Contains(q, "LH400") {
			foundCombined = true
			break
		}
	}
	if !foundCombined {
		t.Fatalf("expected combined flight-number query in set, got %v", qs)
	}
}

func TestResolver_pipeline_exactMatch(t *testing.T) {
	it := testItineraryOS860()
	queries := GenerateQueries(it, 5)
	if len(queries) == 0 {
		t.Fatal("no queries")
	}
	mockResults := map[string][]SearchCandidate{}
	for _, q := range queries {
		mockResults[q] = []SearchCandidate{{
			URL:     "https://www.austrian.com/en/book-flight/checkout",
			Title:   "Austrian OS860 TLV Vienna",
			Snippet: "OS860 from TLV to VIE on January 7, 2027 departure 10:00 arrival 12:30 €158",
			Domain:  "austrian.com",
		}}
	}
	mock := &MockSearcher{Results: mockResults}
	res := &Resolver{
		Searcher:        mock,
		Config:          cfgTest(),
		PriceNormalizer: testPriceNormalizer,
	}
	result, err := res.Match(context.Background(), it)
	if err != nil {
		t.Fatal(err)
	}
	if result.BestOffer == nil {
		t.Fatalf("no best offer; log=%v offers=%+v", result.Log, result.Offers)
	}
	if result.BestOffer.VerificationStatus != StatusVerifiedExact {
		t.Fatalf("status=%s score=%d reason=%s", result.BestOffer.VerificationStatus, result.BestOffer.MatchScore, result.BestOffer.RejectionReason)
	}
}

func TestResolver_pipeline_cheapestVerifiedOffer(t *testing.T) {
	it := testItineraryOS860()
	queries := GenerateQueries(it, 5)
	if len(queries) == 0 {
		t.Fatal("no queries")
	}
	candidates := []SearchCandidate{
		{
			URL:     "https://www.trip.com/flights/book/OS860",
			Title:   "Trip.com OS860 TLV Vienna",
			Snippet: "OS860 TLV to VIE January 7, 2027 10:00 12:30 €137",
			Domain:  "trip.com",
		},
		{
			URL:     "https://www.expedia.com/flights/OS860",
			Title:   "Expedia OS860",
			Snippet: "OS860 Tel Aviv Vienna January 7, 2027 dep 10:00 arr 12:30 €145",
			Domain:  "expedia.com",
		},
		{
			URL:     "https://www.austrian.com/en/book-flight/checkout",
			Title:   "Austrian OS860",
			Snippet: "OS860 from TLV to VIE on January 7, 2027 departure 10:00 arrival 12:30 €158",
			Domain:  "austrian.com",
		},
	}
	mockResults := map[string][]SearchCandidate{}
	for _, q := range queries {
		mockResults[q] = candidates
	}
	res := &Resolver{
		Searcher:        &MockSearcher{Results: mockResults},
		Config:          cfgTest(),
		PriceNormalizer: testPriceNormalizer,
	}
	result, err := res.Match(context.Background(), it)
	if err != nil {
		t.Fatal(err)
	}
	if len(result.Queries) == 0 {
		t.Fatal("expected search queries")
	}
	if result.CandidatesConsidered < 3 {
		t.Fatalf("expected multiple candidates, got %d log=%v", result.CandidatesConsidered, result.Log)
	}
	if result.BestOffer == nil {
		t.Fatalf("expected cheapest verified offer; log=%v offers=%+v", result.Log, result.Offers)
	}
	if result.BestOffer.Domain != "trip.com" {
		t.Fatalf("expected trip.com, got %s (%v %s) log=%v",
			result.BestOffer.Domain, result.BestOffer.Price, result.BestOffer.Currency, result.Log)
	}
	if result.BestOffer.Price == nil || *result.BestOffer.Price != 137 {
		t.Fatalf("expected €137, got %v", result.BestOffer.Price)
	}
	t.Logf("pipeline log:\n%s", strings.Join(result.Log, "\n"))
}

func TestClassifyURLType_genericVsExact(t *testing.T) {
	if classifyURLType("https://www.google.com/search?q=flights") != URLTypeGenericSearch {
		t.Fatal("expected generic search")
	}
	if classifyURLType("https://www.austrian.com/en/book-flight/checkout") != URLTypeExactBooking {
		t.Fatal("expected exact booking")
	}
	if classifyURLType("https://www.google.com/travel/flights?q=OS860") != URLTypeExactSearch {
		t.Fatal("expected exact search")
	}
}

func TestSelectBestOffer_rejectsGenericSearchURL(t *testing.T) {
	offers := []BookingOffer{
		{URL: "https://google.com/search?q=flights", URLType: URLTypeGenericSearch, MatchScore: 99, VerificationStatus: StatusVerifiedExact},
	}
	if SelectBestOffer(offers, testPriceNormalizer, nil) != nil {
		t.Fatal("generic search URL must not be selected")
	}
}

func TestVerifyCandidate_missingFlightNumberRequiresRouteAndDate(t *testing.T) {
	dep := time.Date(2027, 1, 7, 10, 0, 0, 0, time.UTC)
	seg := search.CanonicalSegment{
		From: "TLV", To: "VIE",
		DepartureTime: dep,
		MarketingCarrier: "OS", FlightNumber: "",
	}
	it := search.CanonicalItinerary{Segments: []search.CanonicalSegment{seg}}
	c := SearchCandidate{
		URL:     "https://ota.com/book",
		Snippet: "Tel Aviv to Vienna January 7, 2027 morning flight",
	}
	offer := VerifyCandidate(it, c, cfgTest())
	if offer.VerificationStatus == StatusVerifiedExact {
		t.Fatal("missing flight number with weak snippet must not verify exact")
	}
}

func TestVerifyCandidate_mandatoryDate(t *testing.T) {
	it := testItineraryOS860()
	c := SearchCandidate{
		URL:     "https://ota.com/book",
		Snippet: "OS860 TLV VIE dep 10:00 arr 12:30",
	}
	offer := VerifyCandidate(it, c, cfgTest())
	if offer.VerificationStatus == StatusVerifiedExact {
		t.Fatal("date is mandatory for exact match")
	}
}

func TestVerifyCandidate_otaRouteDateTimeWithoutFlightNumber(t *testing.T) {
	dep := time.Date(2027, 1, 7, 17, 40, 0, 0, time.UTC)
	arr := time.Date(2027, 1, 7, 20, 25, 0, 0, time.UTC)
	seg := search.CanonicalSegment{
		From: "TLV", To: "VIE",
		DepartureTime: dep, ArrivalTime: arr,
		MarketingCarrier: "OS", FlightNumber: "OS860",
	}
	it := search.CanonicalItinerary{Segments: []search.CanonicalSegment{seg}}
	c := SearchCandidate{
		URL:     "https://www.trip.com/flights/tlv-vie",
		Snippet: "Tel Aviv to Vienna January 7, 2027 departs 17:40 arrives 20:25 from ₪450",
		Domain:  "trip.com",
	}
	offer := VerifyCandidate(it, c, cfgTest())
	if offer.VerificationStatus != StatusVerifiedExact {
		t.Fatalf("expected verified exact via route+date+time, got %s reason=%s score=%d",
			offer.VerificationStatus, offer.RejectionReason, offer.MatchScore)
	}
}

func TestFlightNumbersEquivalent_leadingZeros(t *testing.T) {
	if !flightNumbersEquivalent("OS860", "OS0860") {
		t.Fatal("leading zero variants should match")
	}
	if flightNumbersEquivalent("OS860", "OS861") {
		t.Fatal("different numbers must not match")
	}
}

func TestGenerateQueries_prioritizesEndToEndLegRoute(t *testing.T) {
	it := testConnectingTLVJFK()
	qs := GenerateQueries(it, 8)
	if len(qs) == 0 {
		t.Fatal("expected queries")
	}
	if !strings.Contains(qs[0], "TLV") || !strings.Contains(qs[0], "JFK") {
		t.Fatalf("first query should be end-to-end leg route, got %q", qs[0])
	}
	if strings.Contains(qs[0], "LH687") {
		t.Fatalf("leg route query should not lead with segment flight number, got %q", qs[0])
	}
}

func TestVerifyCandidate_connectingLegEndToEnd(t *testing.T) {
	dep1 := time.Date(2027, 1, 7, 18, 20, 0, 0, time.UTC)
	arr1 := time.Date(2027, 1, 7, 21, 50, 0, 0, time.UTC)
	dep2 := time.Date(2027, 1, 8, 12, 40, 0, 0, time.UTC)
	arr2 := time.Date(2027, 1, 8, 14, 0, 0, 0, time.UTC)
	s1 := search.CanonicalSegment{
		From: "TLV", To: "ZRH",
		DepartureTime: dep1, ArrivalTime: arr1,
		MarketingCarrier: "LY", FlightNumber: "LY343",
	}
	s2 := search.CanonicalSegment{
		From: "ZRH", To: "VIE",
		DepartureTime: dep2, ArrivalTime: arr2,
		MarketingCarrier: "OS", FlightNumber: "OS134",
	}
	it := search.CanonicalItinerary{Segments: []search.CanonicalSegment{s1, s2}}
	c := SearchCandidate{
		URL:     "https://www.trip.com/flights/tlv-vie",
		Snippet: "Tel Aviv to Vienna January 7, 2027 departs 18:20 arrives 14:00 via Zurich",
		Domain:  "trip.com",
	}
	offer := VerifyCandidate(it, c, cfgTest())
	if offer.VerificationStatus != StatusVerifiedExact {
		t.Fatalf("expected connecting leg end-to-end verify, got %s reason=%s score=%d",
			offer.VerificationStatus, offer.RejectionReason, offer.MatchScore)
	}
}

func TestGenerateQueries_includesRouteDateBookQuery(t *testing.T) {
	it := testItineraryOS860()
	qs := GenerateQueries(it, 10)
	found := false
	for _, q := range qs {
		if strings.Contains(q, "TLV") && strings.Contains(q, "VIE") && strings.Contains(q, "book flight") && !strings.Contains(q, "OS860") {
			found = true
		}
	}
	if !found {
		t.Fatalf("expected route+date book query without flight number, got %v", qs)
	}
}

func TestVerifyCandidate_codeshareOperatingNumber(t *testing.T) {
	dep := time.Date(2027, 1, 7, 10, 0, 0, 0, time.UTC)
	arr := time.Date(2027, 1, 7, 12, 30, 0, 0, time.UTC)
	seg := search.CanonicalSegment{
		From: "TLV", To: "VIE",
		DepartureTime: dep, ArrivalTime: arr,
		MarketingCarrier: "LH", FlightNumber: "LH9600",
		OperatingCarrier: "OS", OperatingFlightNumber: "OS860",
	}
	it := search.CanonicalItinerary{Segments: []search.CanonicalSegment{seg}}
	c := SearchCandidate{
		URL:     "https://austrian.com/book",
		Snippet: "OS860 TLV Vienna January 7, 2027 10:00 12:30",
	}
	offer := VerifyCandidate(it, c, cfgTest())
	if offer.VerificationStatus != StatusVerifiedExact {
		t.Fatalf("operating flight number should verify: status=%s reason=%s", offer.VerificationStatus, offer.RejectionReason)
	}
}

func TestVerifyCandidate_unsafeURLRejected(t *testing.T) {
	it := testItineraryOS860()
	c := SearchCandidate{
		URL:     "javascript:alert(1)",
		Snippet: "OS860 TLV VIE January 7, 2027 10:00 12:30",
	}
	offer := VerifyCandidate(it, c, cfgTest())
	if offer.VerificationStatus != StatusRejected {
		t.Fatalf("expected rejected, got %s", offer.VerificationStatus)
	}
}

func TestVerifyCandidate_staleWrongFlightInSnippet(t *testing.T) {
	it := testItineraryOS860()
	c := SearchCandidate{
		URL:     "https://ota.com/book",
		Snippet: "OS860 and OS862 TLV VIE January 7, 2027 10:00 12:30",
	}
	offer := VerifyCandidate(it, c, cfgTest())
	if offer.VerificationStatus == StatusVerifiedExact && strings.Contains(offer.RejectionReason, "") {
		// OS860 matches — conflicting OS862 mention is ok if primary fn matches
	}
	if offer.VerificationStatus != StatusVerifiedExact {
		t.Fatalf("primary flight match should still verify: %s %s", offer.VerificationStatus, offer.RejectionReason)
	}
}

func TestSelectBestOffer_conflictingCandidatesPicksCheapest(t *testing.T) {
	low := 120.0
	high := 200.0
	offers := []BookingOffer{
		{URL: "https://ota-a.com/book/checkout", URLType: URLTypeExactBooking, MatchScore: 88, VerificationStatus: StatusVerifiedExact, Price: &high, Currency: "USD"},
		{URL: "https://ota-b.com/book/checkout", URLType: URLTypeExactBooking, MatchScore: 92, VerificationStatus: StatusVerifiedExact, Price: &low, Currency: "USD"},
	}
	best := SelectBestOffer(offers, testPriceNormalizer, nil)
	if best == nil || best.Price == nil || *best.Price != low {
		t.Fatalf("expected cheapest offer, got %+v", best)
	}
}

func TestSelectBestOffer_cheapestOTAOverAirline(t *testing.T) {
	trip := 137.0
	expedia := 145.0
	austrian := 158.0
	offers := []BookingOffer{
		{Domain: "trip.com", URL: "https://www.trip.com/flights/book/OS860", URLType: URLTypeExactBooking, MatchScore: 90, VerificationStatus: StatusVerifiedExact, Price: &trip, Currency: "EUR"},
		{Domain: "expedia.com", URL: "https://www.expedia.com/flights/OS860", URLType: URLTypeExactBooking, MatchScore: 91, VerificationStatus: StatusVerifiedExact, Price: &expedia, Currency: "EUR"},
		{Domain: "austrian.com", URL: "https://www.austrian.com/en/book-flight/checkout", URLType: URLTypeExactBooking, MatchScore: 95, VerificationStatus: StatusVerifiedExact, Price: &austrian, Currency: "EUR"},
	}
	best := SelectBestOffer(offers, testPriceNormalizer, nil)
	if best == nil {
		t.Fatal("expected best offer")
	}
	if best.Domain != "trip.com" {
		t.Fatalf("expected trip.com cheapest, got %s price=%v", best.Domain, best.Price)
	}
	if best.Price == nil || *best.Price != trip {
		t.Fatalf("expected €137, got %v", best.Price)
	}
}

func floatPtr(v float64) *float64 { return &v }

func TestVerifyCandidate_differentPricesSameItinerary(t *testing.T) {
	it := testItineraryOS860()
	c1 := SearchCandidate{URL: "https://a.com/book", Snippet: "OS860 TLV VIE January 7, 2027 10:00 12:30 $199"}
	c2 := SearchCandidate{URL: "https://b.com/book", Snippet: "OS860 TLV VIE January 7, 2027 10:00 12:30 €350"}
	o1 := VerifyCandidate(it, c1, cfgTest())
	o2 := VerifyCandidate(it, c2, cfgTest())
	if o1.ItineraryFingerprint != o2.ItineraryFingerprint {
		t.Fatal("fingerprint should match itinerary")
	}
	if o1.VerificationStatus != StatusVerifiedExact || o2.VerificationStatus != StatusVerifiedExact {
		t.Fatalf("both should verify: %s %s", o1.VerificationStatus, o2.VerificationStatus)
	}
}
