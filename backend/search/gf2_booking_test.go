package search

import (
	"testing"
)

func TestExtractGF2BookingToken(t *testing.T) {
	const fakeToken = "test-booking-token-001"
	tok := extractGF2BookingToken(map[string]interface{}{
		"booking_token": fakeToken,
		"link":          "https://www.example.com/book",
	})
	if tok != fakeToken {
		t.Fatalf("got %q", tok)
	}
	if extractGF2BookingToken(map[string]interface{}{"token": "https://evil.com"}) != "" {
		t.Fatal("should skip URL-shaped tokens")
	}
	if extractGF2BookingToken(map[string]interface{}{"token": "short"}) != "" {
		t.Fatal("should skip short generic token")
	}
}

func TestExtractGF2BookingURL(t *testing.T) {
	body := []byte(`{"status":true,"data":"https://www.example.com/checkout?ref=test"}`)
	got := extractGF2BookingURL(body)
	if got != "https://www.example.com/checkout?ref=test" {
		t.Fatalf("got %q", got)
	}
}

func TestExtractGF2PartnerBookingTokenPrefersPartnerURL(t *testing.T) {
	const fakePartnerToken = "test-partner-token-001"
	body := []byte(`{
		"data": {
			"booking_options": [
				{"booking_request_token": "test-partner-token-001", "url": "https://www.example-ota.com/book?x=1"},
				{"url": "https://www.google.com/travel/flights"}
			]
		}
	}`)
	tok, url := extractGF2PartnerBookingToken(body)
	if tok != fakePartnerToken {
		t.Fatalf("token=%q", tok)
	}
	if url != "https://www.example-ota.com/book?x=1" {
		t.Fatalf("url=%q", url)
	}
}

func TestIsLikelyPartnerCheckoutURL(t *testing.T) {
	if isLikelyPartnerCheckoutURL("https://www.google.com/travel/flights") {
		t.Fatal("google should not count as partner checkout")
	}
	if !isLikelyPartnerCheckoutURL("https://www.example-airline.com/book") {
		t.Fatal("airline URL should count")
	}
}

func TestFirstNonEmpty(t *testing.T) {
	if firstNonEmpty("", "  ", "x") != "x" {
		t.Fatal("expected x")
	}
}
