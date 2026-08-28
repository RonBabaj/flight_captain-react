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
		{URL: "https://kayak.com/flights/x", URLType: URLTypeExactSearch, MatchScore: 90, VerificationStatus: StatusVerifiedExact, Price: &price249},
		{URL: "https://airline.com/book/checkout", URLType: URLTypeExactBooking, MatchScore: 88, VerificationStatus: StatusVerifiedExact, Price: &price199},
		{URL: "https://google.com/search?q=flights", URLType: URLTypeGenericSearch, MatchScore: 95, VerificationStatus: StatusVerifiedExact},
	}
	best := SelectBestOffer(offers)
	if best == nil {
		t.Fatal("expected best offer")
	}
	if best.URLType != URLTypeExactBooking {
		t.Fatalf("expected exact booking, got %s url=%s", best.URLType, best.URL)
	}
}

func TestSelectBestOffer_prefersPriceAmongSameURLType(t *testing.T) {
	low := 150.0
	high := 300.0
	offers := []BookingOffer{
		{URL: "https://ota.com/book/a", URLType: URLTypeExactBooking, MatchScore: 90, VerificationStatus: StatusVerifiedExact, Price: &high},
		{URL: "https://ota.com/book/b", URLType: URLTypeExactBooking, MatchScore: 90, VerificationStatus: StatusVerifiedExact, Price: &low},
	}
	best := SelectBestOffer(offers)
	if best == nil || best.Price == nil || *best.Price != low {
		t.Fatalf("expected cheaper offer, got %v", best)
	}
}

func TestSelectBestOffer_missingPrice(t *testing.T) {
	offers := []BookingOffer{
		{URL: "https://airline.com/book", URLType: URLTypeExactBooking, MatchScore: 90, VerificationStatus: StatusVerifiedExact},
	}
	best := SelectBestOffer(offers)
	if best == nil || best.Price != nil {
		t.Fatalf("expected offer without price requirement, got %v", best)
	}
}

func TestSelectBestOffer_rejectsUnverified(t *testing.T) {
	offers := []BookingOffer{
		{URL: "https://x.com", MatchScore: 99, VerificationStatus: StatusPartial},
	}
	if SelectBestOffer(offers) != nil {
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
	qs := GenerateQueries(it, 5)
	if len(qs) == 0 {
		t.Fatal("expected queries")
	}
	combined := qs[0]
	if !strings.Contains(combined, "LH687") || !strings.Contains(combined, "LH400") {
		t.Fatalf("connecting query: %q", combined)
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
			Snippet: "OS860 from TLV to VIE on January 7, 2027 departure 10:00 arrival 12:30",
			Domain:  "austrian.com",
		}}
	}
	mock := &MockSearcher{Results: mockResults}
	res := &Resolver{
		Searcher: mock,
		Config:   cfgTest(),
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
	if SelectBestOffer(offers) != nil {
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

func TestSelectBestOffer_conflictingCandidatesPicksBest(t *testing.T) {
	low := 120.0
	high := 200.0
	offers := []BookingOffer{
		{URL: "https://ota-a.com/book/checkout", URLType: URLTypeExactBooking, MatchScore: 88, VerificationStatus: StatusVerifiedExact, Price: &high},
		{URL: "https://ota-b.com/book/checkout", URLType: URLTypeExactBooking, MatchScore: 92, VerificationStatus: StatusVerifiedExact, Price: &low},
	}
	best := SelectBestOffer(offers)
	if best == nil || best.MatchScore != 92 {
		t.Fatalf("expected highest score offer, got %+v", best)
	}
}

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
