package main

import "testing"

// makeOfferWithCarriers builds a minimal raw offer with itineraries.segments carrierCode, operating.carrierCode, and validatingAirlineCodes.
func makeOfferWithCarriers(marketing []string, operating []string, validating []string) map[string]interface{} {
	var segs []interface{}
	for i, m := range marketing {
		seg := map[string]interface{}{"carrierCode": m}
		if i < len(operating) && operating[i] != "" {
			seg["operating"] = map[string]interface{}{"carrierCode": operating[i]}
		}
		segs = append(segs, seg)
	}
	itins := []interface{}{
		map[string]interface{}{"segments": segs},
	}
	offer := map[string]interface{}{
		"itineraries": itins,
		"price":       map[string]interface{}{"total": "100.00"},
	}
	if len(validating) > 0 {
		var v []interface{}
		for _, s := range validating {
			v = append(v, s)
		}
		offer["validatingAirlineCodes"] = v
	}
	return offer
}

func TestExtractCarrierCodes(t *testing.T) {
	t.Run("marketing only", func(t *testing.T) {
		offer := makeOfferWithCarriers([]string{"BA", "AA"}, nil, nil)
		cc := ExtractCarrierCodes(offer)
		if len(cc.Marketing) != 2 || cc.Marketing[0] != "BA" || cc.Marketing[1] != "AA" {
			t.Errorf("Marketing: got %v", cc.Marketing)
		}
		if len(cc.Operating) != 0 {
			t.Errorf("Operating: got %v", cc.Operating)
		}
		if len(cc.Validating) != 0 {
			t.Errorf("Validating: got %v", cc.Validating)
		}
	})

	t.Run("marketing != operating", func(t *testing.T) {
		// First segment: marketing BA, operating AY (codeshare). Second: marketing AA, no operating.
		offer := makeOfferWithCarriers([]string{"BA", "AA"}, []string{"AY", ""}, nil)
		cc := ExtractCarrierCodes(offer)
		if len(cc.Marketing) != 2 || cc.Marketing[0] != "BA" || cc.Marketing[1] != "AA" {
			t.Errorf("Marketing: got %v", cc.Marketing)
		}
		if len(cc.Operating) != 1 || cc.Operating[0] != "AY" {
			t.Errorf("Operating: got %v", cc.Operating)
		}
	})

	t.Run("validating != marketing", func(t *testing.T) {
		offer := makeOfferWithCarriers([]string{"W6"}, nil, []string{"FR"})
		cc := ExtractCarrierCodes(offer)
		if len(cc.Marketing) != 1 || cc.Marketing[0] != "W6" {
			t.Errorf("Marketing: got %v", cc.Marketing)
		}
		if len(cc.Validating) != 1 || cc.Validating[0] != "FR" {
			t.Errorf("Validating: got %v", cc.Validating)
		}
	})
}

func TestPrimaryDisplayCarrier(t *testing.T) {
	t.Run("prefer marketing", func(t *testing.T) {
		offer := makeOfferWithCarriers([]string{"LY", "TK"}, nil, []string{"BA"})
		got := PrimaryDisplayCarrier(offer)
		if got != "LY" {
			t.Errorf("PrimaryDisplayCarrier: got %q, want LY", got)
		}
	})
	t.Run("fallback to validating when no segments", func(t *testing.T) {
		offer := map[string]interface{}{
			"itineraries": []interface{}{},
			"validatingAirlineCodes": []interface{}{"FR"},
		}
		got := PrimaryDisplayCarrier(offer)
		if got != "FR" {
			t.Errorf("PrimaryDisplayCarrier: got %q, want FR", got)
		}
	})
}
