package main

import (
	"testing"
	"time"
)

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
	req := searchRequestFromSession(sess, opt, 0)
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

func TestAttachQuotedPriceMeta_detectsMismatch(t *testing.T) {
	price := 1000.0
	resp := BookingResolveResponse{
		Found: true,
		Offer: &PublicBookingOffer{Price: &price, Currency: "USD"},
	}
	opt := &FlightOption{Price: MonetaryAmount{Amount: 600, Currency: "USD"}}
	out := attachQuotedPriceMeta(resp, nil, opt, -1)
	if !out.PriceMismatch {
		t.Fatal("expected price mismatch")
	}
}
