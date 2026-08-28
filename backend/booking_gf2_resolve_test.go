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
