package main

import "testing"

// TestPickCheapestOffer verifies that pickCheapestOffer returns the offer
// with the lowest price based on the price.total field.
func TestPickCheapestOffer(t *testing.T) {
	offers := []map[string]interface{}{
		{
			"price": map[string]interface{}{
				"total": "300.27",
			},
		},
		{
			"price": map[string]interface{}{
				"total": "150.61",
			},
		},
		{
			"price": map[string]interface{}{
				"total": "220.00",
			},
		},
	}

	cheapest := pickCheapestOffer(offers)
	if cheapest == nil {
		t.Fatalf("expected a cheapest offer, got nil")
	}

	price := extractRawPrice(cheapest)
	if price != 150.61 {
		t.Fatalf("expected cheapest price 150.61, got %.2f", price)
	}
}

