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

func TestPricesMatchQuote(t *testing.T) {
	if !PricesMatchQuote(600, 602) {
		t.Fatal("602 should match 600")
	}
	if !PricesMatchQuote(600, 620) {
		t.Fatal("620 within 4% should match 600")
	}
	if PricesMatchQuote(600, 1000) {
		t.Fatal("1000 must not match 600")
	}
}

func TestSelectBookingOptionForQuote_prefersPriceMatch(t *testing.T) {
	options := []gf2BookingOption{
		{URL: "https://www.lufthansa.com/book", Price: 1000, Provider: "lufthansa.com"},
		{URL: "https://www.kayak.com/book", Price: 600, Provider: "kayak.com"},
	}
	quote := QuoteBinding{Amount: 600, Currency: "USD"}
	picked := selectBookingOptionForQuote(options, quote)
	if picked == nil || picked.Price != 600 {
		t.Fatalf("expected kayak 600, got %+v", picked)
	}
}

func TestSelectBookingOptionForQuote_prefersDeepLinkHost(t *testing.T) {
	options := []gf2BookingOption{
		{URL: "https://www.expedia.com/book", Price: 610, Provider: "expedia.com"},
		{URL: "https://www.kayak.com/book", Price: 605, Provider: "kayak.com"},
	}
	quote := QuoteBinding{Amount: 600, Currency: "USD", DeepLink: "https://www.expedia.com/deep"}
	picked := selectBookingOptionForQuote(options, quote)
	if picked == nil || picked.Provider != "expedia.com" {
		t.Fatalf("expected expedia deep link match, got %+v", picked)
	}
}

func TestParseGF2BookingOptions(t *testing.T) {
	body := []byte(`{
		"data": {
			"booking_options": [
				{"booking_request_token": "tok-a", "url": "https://www.example-ota.com/book", "price": 599, "book_with": "Example OTA"},
				{"url": "https://www.airline.com/book", "price": 999}
			]
		}
	}`)
	opts := parseGF2BookingOptions(body, "USD")
	if len(opts) != 2 {
		t.Fatalf("expected 2 options, got %d", len(opts))
	}
	if opts[0].Price != 599 || opts[0].Provider != "Example OTA" {
		t.Fatalf("first option=%+v", opts[0])
	}
}

func TestFirstNonEmpty(t *testing.T) {
	if firstNonEmpty("", "  ", "x") != "x" {
		t.Fatal("expected x")
	}
}
