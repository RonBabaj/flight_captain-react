package search

import "testing"

func TestIsValidSkyscannerDeeplink(t *testing.T) {
	valid := "https://www.skyscanner.net/transport_deeplink/4.0/IL/en/USD/air/de/flights?itinerary=tlv-sju"
	if !IsValidSkyscannerDeeplink(valid) {
		t.Fatalf("expected valid deeplink")
	}
	if IsValidSkyscannerDeeplink("https://www.skyscanner.net/transport_deeplink/4.0/IL/en/USD/air/de/flights") {
		t.Fatalf("missing itinerary must be invalid")
	}
	if IsValidSkyscannerDeeplink("https://www.skyscanner.com/") {
		t.Fatalf("non-deeplink must be invalid")
	}
}