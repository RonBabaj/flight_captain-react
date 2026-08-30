package main

import (
	"context"
	"testing"
	"time"

	"flightcaptainweb/search"
)

func TestResolveGF2PartnerOffer_usesPersistedLegDeepLinkWithoutProvider(t *testing.T) {
	dep := time.Date(2027, 1, 7, 17, 40, 0, 0, time.UTC)
	arr := time.Date(2027, 1, 7, 20, 25, 0, 0, time.UTC)
	seg := search.CanonicalSegment{
		From: "TLV", To: "VIE",
		DepartureTime: dep, ArrivalTime: arr,
		MarketingCarrier: "OS", FlightNumber: "OS860",
	}
	it := search.CanonicalItinerary{
		Segments: []search.CanonicalSegment{seg},
		Legs:     []search.CanonicalLeg{{Segments: []search.CanonicalSegment{seg}}},
	}
	opt := &FlightOption{
		Price:        MonetaryAmount{Amount: 360, Currency: "USD"},
		LegDeepLinks: []string{"https://mytrip.com/checkout/tlv-vie", "https://mytrip.com/checkout/szg-tlv"},
		Legs: []FlightLeg{
			{Segments: []FlightSegment{{
				From: AirportLike{Code: "TLV"}, To: AirportLike{Code: "VIE"},
				DepartureTime: dep, ArrivalTime: arr,
				MarketingCarrier: Carrier{Code: "OS"}, FlightNumber: "OS860",
			}}},
			{Segments: []FlightSegment{{
				From: AirportLike{Code: "SZG"}, To: AirportLike{Code: "TLV"},
			}}},
		},
	}
	sess := &SearchSession{Params: CreateSearchSessionRequest{Currency: "USD"}}

	offer := resolveGF2PartnerOffer(context.Background(), sess, opt, it, 0, -1)
	if offer == nil || offer.URL != "https://mytrip.com/checkout/tlv-vie" {
		t.Fatalf("expected persisted leg deep link, got %+v", offer)
	}
}

func TestSearchRequestFromSession_singleLegOverride(t *testing.T) {
	dep := time.Date(2026, 9, 15, 10, 0, 0, 0, time.UTC)
	sess := &SearchSession{
		Params: CreateSearchSessionRequest{
			Origin: "TLV", Destination: "VIE",
			DepartureDate: "2026-09-15", ReturnDate: "2026-09-22",
			Adults: 2, Currency: "USD",
		},
	}
	opt := &FlightOption{
		Legs: []FlightLeg{{
			Segments: []FlightSegment{{
				From: AirportLike{Code: "TLV"}, To: AirportLike{Code: "CDG"},
				DepartureTime: dep,
			}},
		}},
	}
	req := searchRequestFromSession(sess, opt, 0, -1)
	if req.Origin != "TLV" || req.Destination != "CDG" || req.DepartureDate != "2026-09-15" {
		t.Fatalf("leg override failed: %+v", req)
	}
	if req.ReturnDate != "" {
		t.Fatalf("expected one-way leg search, got return %q", req.ReturnDate)
	}
}

func TestGF2PartnerOfferFromURL_rejectsUnsafe(t *testing.T) {
	if gf2PartnerOfferFromURL("javascript:alert(1)", "fp") != nil {
		t.Fatal("unsafe URL must be rejected")
	}
}

func TestGF2PartnerOfferFromURL_acceptsHTTPS(t *testing.T) {
	offer := gf2PartnerOfferFromURL("https://www.airfrance.com/book/checkout", "abc")
	if offer == nil {
		t.Fatal("expected offer")
	}
	if offer.VerificationStatus != "verified_exact" || offer.MatchScore < 90 {
		t.Fatalf("offer=%+v", offer)
	}
	if offer.Domain != "airfrance.com" {
		t.Fatalf("domain=%q", offer.Domain)
	}
}

func TestQuoteBindingFromOption_usesOriginalWhenEstimate(t *testing.T) {
	opt := &FlightOption{
		Price:           MonetaryAmount{Amount: 720, Currency: "USD"},
		PriceIsEstimate: true,
		OriginalPrice:   &MonetaryAmount{Amount: 600, Currency: "USD"},
		DeepLink:        "https://www.kayak.com/book",
	}
	q := quoteBindingFromOption(nil, opt, -1)
	if q.Amount != 600 || q.DeepLink == "" {
		t.Fatalf("quote=%+v", q)
	}
}

func TestQuoteBindingFromOption_usesStoredLegPrice(t *testing.T) {
	opt := &FlightOption{
		Price:     MonetaryAmount{Amount: 1000, Currency: "USD"},
		LegPrices: []float64{180, 220},
		Legs:      []FlightLeg{{}, {}},
	}
	q := quoteBindingFromOption(nil, opt, 0)
	if q.Amount != 180 {
		t.Fatalf("expected stored one-way fare 180, got %v", q.Amount)
	}
}

func TestAllocateLegQuoteAmount_splitOpenJaw(t *testing.T) {
	dep1 := time.Date(2027, 1, 7, 17, 40, 0, 0, time.UTC)
	arr1 := time.Date(2027, 1, 7, 20, 25, 0, 0, time.UTC)
	dep2 := time.Date(2027, 1, 14, 16, 45, 0, 0, time.UTC)
	arr2 := time.Date(2027, 1, 14, 17, 50, 0, 0, time.UTC)
	opt := &FlightOption{
		Price: MonetaryAmount{Amount: 1000, Currency: "ILS"},
		DurationMinutes: 600,
		Legs: []FlightLeg{
			{Segments: []FlightSegment{{DepartureTime: dep1, ArrivalTime: arr1, DurationMinutes: 165}}},
			{Segments: []FlightSegment{{DepartureTime: dep2, ArrivalTime: arr2, DurationMinutes: 65}}},
		},
	}
	leg0 := allocateLegQuoteAmount(opt, 0, opt.Price.Amount)
	leg1 := allocateLegQuoteAmount(opt, 1, opt.Price.Amount)
	if leg0 <= 0 || leg1 <= 0 || leg0+leg1 > 1000+1 {
		t.Fatalf("leg quotes=%v %v", leg0, leg1)
	}
	if leg0 <= leg1 {
		t.Fatalf("outbound leg should get larger quote share, got %v vs %v", leg0, leg1)
	}
}

func TestAttachQuotedPriceMeta_detectsMismatch(t *testing.T) {
	price := 1000.0
	resp := BookingResolveResponse{
		Found: true,
		Offer: &PublicBookingOffer{Price: &price, Currency: "USD"},
	}
	opt := &FlightOption{Price: MonetaryAmount{Amount: 600, Currency: "USD"}}
	out := attachQuotedPriceMeta(resp, nil, opt, -1, &price)
	if !out.PriceMismatch {
		t.Fatal("expected price mismatch")
	}
}
