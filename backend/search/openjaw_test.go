package search

import "testing"

func TestResolveReturnAirports_classic(t *testing.T) {
	o, d := ResolveReturnAirports(SearchRequest{Origin: "TLV", Destination: "CDG"})
	if o != "CDG" || d != "TLV" {
		t.Fatalf("classic return = %s→%s, want CDG→TLV", o, d)
	}
}

func TestResolveReturnAirports_openJaw(t *testing.T) {
	o, d := ResolveReturnAirports(SearchRequest{
		Origin: "TLV", Destination: "CDG",
		ReturnOrigin: "LHR", ReturnDestination: "TLV",
	})
	if o != "LHR" || d != "TLV" {
		t.Fatalf("open-jaw return = %s→%s, want LHR→TLV", o, d)
	}
}

func TestIsOpenJaw(t *testing.T) {
	classic := SearchRequest{Origin: "TLV", Destination: "CDG", ReturnDate: "2026-12-20"}
	if IsOpenJaw(classic) {
		t.Fatal("classic RT should not be open-jaw")
	}
	oj := SearchRequest{
		Origin: "TLV", Destination: "CDG", ReturnDate: "2026-12-20",
		ReturnOrigin: "LHR", ReturnDestination: "TLV",
	}
	if !IsOpenJaw(oj) {
		t.Fatal("LHR return from CDG outbound should be open-jaw")
	}
	oneWay := SearchRequest{Origin: "TLV", Destination: "CDG"}
	if IsOpenJaw(oneWay) {
		t.Fatal("one-way should not be open-jaw")
	}
}

func TestSanitizeStandardSearchRequest(t *testing.T) {
	staleClassic := SearchRequest{
		Origin: "TLV", Destination: "VIE",
		DepartureDate: "2027-01-07", ReturnDate: "2027-01-14",
		ReturnOrigin: "VIE", ReturnDestination: "TLV",
	}
	got := SanitizeStandardSearchRequest(staleClassic)
	if got.ReturnOrigin != "" || got.ReturnDestination != "" {
		t.Fatalf("expected redundant classic fields stripped, got %+v", got)
	}
	if IsOpenJaw(got) {
		t.Fatal("sanitized classic RT must not be open-jaw")
	}

	openJaw := SearchRequest{
		Origin: "TLV", Destination: "VIE",
		DepartureDate: "2027-01-07", ReturnDate: "2027-01-14",
		ReturnOrigin: "SZG", ReturnDestination: "TLV",
	}
	if SanitizeStandardSearchRequest(openJaw).ReturnOrigin != "SZG" {
		t.Fatal("open-jaw params must be preserved")
	}
}
