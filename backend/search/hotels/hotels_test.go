package hotels

import (
	"encoding/json"
	"testing"
	"time"
)

func TestNightsBetween(t *testing.T) {
	if got := NightsBetween("2026-08-01", "2026-08-06"); got != 5 {
		t.Fatalf("expected 5 nights, got %d", got)
	}
	if got := NightsBetween("bad", "2026-08-06"); got != 0 {
		t.Fatalf("expected 0 for bad date, got %d", got)
	}
}

func TestMapFlightToStayDatesRoundTrip(t *testing.T) {
	stay := MapFlightToStayDates(nil, "2026-08-01", "2026-08-06", "FCO")
	if !stay.Eligible {
		t.Fatalf("expected eligible stay, got %#v", stay)
	}
	if stay.CheckIn != "2026-08-01" || stay.CheckOut != "2026-08-06" {
		t.Fatalf("unexpected dates: %#v", stay)
	}
}

func TestMapFlightToStayDatesOneWay(t *testing.T) {
	stay := MapFlightToStayDates(nil, "2026-08-01", "", "FCO")
	if stay.Eligible {
		t.Fatalf("one-way should be ineligible")
	}
	if stay.Reason == "" {
		t.Fatalf("expected reason")
	}
}

func TestMapFlightToStayDatesMultiCity(t *testing.T) {
	legs := []FlightLegSummary{
		{DestinationCode: "FCO", ArrivalDate: "2026-08-01", DepartureDate: "2026-08-03"},
		{DestinationCode: "ATH", ArrivalDate: "2026-08-03", DepartureDate: "2026-08-06"},
	}
	stay := MapFlightToStayDates(legs, "2026-08-01", "2026-08-06", "FCO")
	if stay.Eligible {
		t.Fatalf("multi-city should be ineligible")
	}
}

func TestMapFlightToStayDatesUsesLegArrival(t *testing.T) {
	legs := []FlightLegSummary{
		{DestinationCode: "FCO", ArrivalDate: "2026-08-02", DepartureDate: "2026-08-07"},
		{DestinationCode: "FCO", ArrivalDate: "2026-08-07", DepartureDate: "2026-08-07"},
	}
	stay := MapFlightToStayDates(legs, "2026-08-01", "2026-08-08", "FCO")
	if !stay.Eligible {
		t.Fatalf("expected eligible: %#v", stay)
	}
	if stay.CheckIn != "2026-08-02" {
		t.Fatalf("expected check-in from arrival date, got %s", stay.CheckIn)
	}
	if stay.CheckOut != "2026-08-07" {
		t.Fatalf("expected check-out from return departure, got %s", stay.CheckOut)
	}
}

func TestDeduplicateStayKeys(t *testing.T) {
	keys := []string{"a", "b", "a", "", "c", "b"}
	got := DeduplicateStayKeys(keys)
	if len(got) != 3 || got[0] != "a" || got[1] != "b" || got[2] != "c" {
		t.Fatalf("unexpected dedupe: %#v", got)
	}
}

func TestEstimateCacheKeyStable(t *testing.T) {
	a := EstimateCacheKey("FCO", "2026-08-01", "2026-08-06", "EUR", 1, 2, "fc")
	b := EstimateCacheKey("FCO", "2026-08-01", "2026-08-06", "EUR", 1, 2, "fc")
	c := EstimateCacheKey("FCO", "2026-08-01", "2026-08-06", "EUR", 1, 3, "fc")
	if a != b {
		t.Fatalf("keys should match")
	}
	if a == c {
		t.Fatalf("keys should differ for guest count")
	}
}

func TestTTLCache(t *testing.T) {
	c := NewTTLCache(time.Hour)
	c.Set("k", 42)
	v, ok := c.Get("k")
	if !ok || v.(int) != 42 {
		t.Fatalf("cache miss")
	}
}

func TestNormalizeSERPHotels(t *testing.T) {
	freeBefore := "2026-07-20T00:00:00"
	raw := []rhHotel{
		{
			ID:  "aloft_palm_jumeirah",
			HID: 8746275,
			Rates: []rhRate{
				{
					Meal:      "nomeal",
					MealData:  &rhMealData{Value: "breakfast", HasBreakfast: true},
					RoomName:  "Deluxe",
					Allotment: 3,
					Amenities: []string{"wifi"},
					PaymentOptions: &rhPaymentOptions{
						PaymentTypes: []rhPaymentType{
							{
								ShowAmount:       "500.00",
								ShowCurrencyCode: "EUR",
								CancellationPenalties: &rhCancelPenalties{
									FreeCancellationBefore: &freeBefore,
								},
							},
						},
					},
				},
			},
		},
	}
	req := HotelSearchRequest{CheckIn: "2026-08-01", CheckOut: "2026-08-06", DestinationQuery: "DXB", Currency: "EUR"}
	offers := normalizeSERPHotels(raw, req, 5, PriceEstimated)
	if len(offers) != 1 {
		t.Fatalf("expected 1 offer, got %d", len(offers))
	}
	o := offers[0]
	if o.Name != "Aloft Palm Jumeirah" {
		t.Fatalf("unexpected name: %s", o.Name)
	}
	if o.TotalPrice.Amount != 500 {
		t.Fatalf("unexpected total: %v", o.TotalPrice)
	}
	if o.PricePerNight.Amount != 100 {
		t.Fatalf("unexpected per night: %v", o.PricePerNight)
	}
	if o.PriceStatus != PriceEstimated {
		t.Fatalf("expected estimated status")
	}
	if !o.Refundable || !o.HasBreakfast {
		t.Fatalf("expected refundable breakfast offer: %#v", o)
	}
}

func TestBuildTripDealEstimated(t *testing.T) {
	flight := Monetary{Currency: "EUR", Amount: 180}
	hotelTotal := Monetary{Currency: "EUR", Amount: 240}
	est := &HotelEstimate{
		Available:   true,
		TotalPrice:  &hotelTotal,
		PriceStatus: PriceEstimated,
		Provider:    "ratehawk",
	}
	td := BuildTripDeal("1", "Rome Getaway", "ROM", "2026-08-01", "2026-08-06", "f1", flight, est, nil)
	if td.EstimatedTotal == nil || td.EstimatedTotal.Amount != 420 {
		t.Fatalf("expected estimated total 420, got %#v", td.EstimatedTotal)
	}
	if td.LiveTotal != nil {
		t.Fatalf("live total should be nil for estimates")
	}
	if td.TotalPriceStatus != PriceEstimated {
		t.Fatalf("status should be estimated")
	}
}

func TestBuildTripDealUnavailable(t *testing.T) {
	flight := Monetary{Currency: "EUR", Amount: 180}
	est := &HotelEstimate{Available: false, Message: "Hotel prices unavailable", PriceStatus: PriceEstimated}
	td := BuildTripDeal("1", "Rome Getaway", "ROM", "2026-08-01", "2026-08-06", "f1", flight, est, nil)
	if td.EstimatedTotal != nil {
		t.Fatalf("no total when hotel unavailable")
	}
	if td.Message != "Hotel prices unavailable" {
		t.Fatalf("unexpected message: %s", td.Message)
	}
}

func TestBuildTripDealLive(t *testing.T) {
	flight := Monetary{Currency: "EUR", Amount: 180}
	offer := &HotelOffer{
		TotalPrice:  Monetary{Currency: "EUR", Amount: 240},
		PriceStatus: PriceLive,
		Provider:    "ratehawk",
	}
	td := BuildTripDeal("1", "Rome Getaway", "ROM", "2026-08-01", "2026-08-06", "f1", flight, nil, offer)
	if td.LiveTotal == nil || td.LiveTotal.Amount != 420 {
		t.Fatalf("expected live total 420, got %#v", td.LiveTotal)
	}
	if td.EstimatedTotal != nil {
		t.Fatalf("estimated should be nil when live")
	}
}

func TestSortHotels(t *testing.T) {
	offers := []HotelOffer{
		{Name: "B", TotalPrice: Monetary{Amount: 200}, GuestRating: 9, StarRating: 4, ReviewCount: 10},
		{Name: "A", TotalPrice: Monetary{Amount: 100}, GuestRating: 7, StarRating: 3, ReviewCount: 100},
		{Name: "C", TotalPrice: Monetary{Amount: 150}, GuestRating: 8, StarRating: 5, ReviewCount: 50},
	}
	SortHotels(offers, "cheapest")
	if offers[0].Name != "A" {
		t.Fatalf("cheapest should be A")
	}
	SortHotels(offers, "highest_rated")
	if offers[0].Name != "B" {
		t.Fatalf("highest rated should be B")
	}
	SortHotels(offers, "most_popular")
	if offers[0].Name != "A" {
		t.Fatalf("most popular should be A by review count")
	}
}

func TestAPIResponseOK(t *testing.T) {
	raw := []byte(`{"data":{"hotels":[]},"status":"ok","error":null}`)
	var resp rhAPIResponse
	if err := json.Unmarshal(raw, &resp); err != nil {
		t.Fatal(err)
	}
	if err := resp.asError(); err != nil {
		t.Fatalf("ok response should not error: %v", err)
	}
}

func TestAPIResponseAuthError(t *testing.T) {
	resp := rhAPIResponse{Status: "error", Error: "unauthorized"}
	err := resp.asError()
	if err == nil || err.Error() != "ratehawk authentication failed" {
		t.Fatalf("unexpected: %v", err)
	}
}

func TestHumanizeHotelID(t *testing.T) {
	if got := humanizeHotelID("aloft_palm_jumeirah"); got != "Aloft Palm Jumeirah" {
		t.Fatalf("got %q", got)
	}
}

func TestApplyClientFilters(t *testing.T) {
	offers := []HotelOffer{
		{Name: "x", TotalPrice: Monetary{Amount: 100}, Refundable: false, HasBreakfast: false},
		{Name: "y", TotalPrice: Monetary{Amount: 200}, Refundable: true, HasBreakfast: true},
	}
	filtered := applyClientFilters(offers, HotelSearchRequest{FreeCancellation: true, BreakfastIncluded: true})
	if len(filtered) != 1 || filtered[0].Name != "y" {
		t.Fatalf("unexpected filter result: %#v", filtered)
	}
}

func TestNewRateHawkProviderDisabled(t *testing.T) {
	t.Setenv("RATEHAWK_ENABLED", "false")
	if p := NewRateHawkProvider(); p != nil {
		t.Fatalf("expected nil when disabled")
	}
}
