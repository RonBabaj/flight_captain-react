package search

import (
	"testing"
)

func TestExtractGF2BookingToken(t *testing.T) {
	tok := extractGF2BookingToken(map[string]interface{}{
		"booking_token": "CjRIR2d0ABC123longtoken",
		"link":          "https://www.example.com/book",
	})
	if tok != "CjRIR2d0ABC123longtoken" {
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
	body := []byte(`{"status":true,"data":"https://www.partnerbooking.com/checkout?token=abc"}`)
	got := extractGF2BookingURL(body)
	if got != "https://www.partnerbooking.com/checkout?token=abc" {
		t.Fatalf("got %q", got)
	}
}

func TestExtractGF2PartnerBookingTokenPrefersPartnerURL(t *testing.T) {
	body := []byte(`{
		"data": {
			"booking_options": [
				{"booking_request_token": "partnerTok123456", "url": "https://www.expedia.com/book?x=1"},
				{"url": "https://www.google.com/travel/flights"}
			]
		}
	}`)
	tok, url := extractGF2PartnerBookingToken(body)
	if tok != "partnerTok123456" {
		t.Fatalf("token=%q", tok)
	}
	if url != "https://www.expedia.com/book?x=1" {
		t.Fatalf("url=%q", url)
	}
}

func TestIsLikelyPartnerCheckoutURL(t *testing.T) {
	if isLikelyPartnerCheckoutURL("https://www.google.com/travel/flights") {
		t.Fatal("google should not count as partner checkout")
	}
	if !isLikelyPartnerCheckoutURL("https://www.united.com/book") {
		t.Fatal("airline URL should count")
	}
}

func TestFirstNonEmpty(t *testing.T) {
	if firstNonEmpty("", "  ", "x") != "x" {
		t.Fatal("expected x")
	}
}
