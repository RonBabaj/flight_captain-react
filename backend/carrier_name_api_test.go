package main

import (
	"testing"

	"flightcaptainweb/search"
)

func TestProviderResultsToFlightOptions_PreservesCarrierName(t *testing.T) {
	prs := []search.ProviderResult{{
		ID:    "t1",
		Price: search.Monetary{Currency: "USD", Amount: 297},
		Legs: []search.Leg{{
			Segments: []search.Segment{{
				From:                 "TLV",
				To:                   "VIE",
				MarketingCarrier:     "BZ",
				MarketingCarrierName: "Bluebird Airways",
				FlightNumber:         "BZ316",
				CabinClass:           "ECONOMY",
			}},
		}},
	}}
	opts := providerResultsToFlightOptions(prs)
	if len(opts) != 1 {
		t.Fatalf("len=%d", len(opts))
	}
	c := opts[0].Legs[0].Segments[0].MarketingCarrier
	if c.Code != "BZ" || c.Name != "Bluebird Airways" {
		t.Fatalf("carrier = %+v", c)
	}
}
