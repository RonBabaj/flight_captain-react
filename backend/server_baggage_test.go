package main

import "testing"

func makeOfferWithBags(quantities ...interface{}) map[string]interface{} {
	segments := make([]interface{}, 0, len(quantities))
	for _, q := range quantities {
		icb := map[string]interface{}{"quantity": q}
		segments = append(segments, map[string]interface{}{"includedCheckedBags": icb})
	}
	return map[string]interface{}{
		"travelerPricings": []interface{}{
			map[string]interface{}{"fareDetailsBySegment": segments},
		},
	}
}

func makeOfferWithMissingBags() map[string]interface{} {
	return map[string]interface{}{
		"travelerPricings": []interface{}{
			map[string]interface{}{
				"fareDetailsBySegment": []interface{}{
					map[string]interface{}{}, // no includedCheckedBags
				},
			},
		},
	}
}

func TestClassifyOfferBaggage(t *testing.T) {
	tests := []struct {
		name   string
		offer  map[string]interface{}
		expect string
	}{
		{
			name:   "quantity 0 -> BAG_OK",
			offer:  makeOfferWithBags(0),
			expect: BaggageOK,
		},
		{
			name:   "quantity 0 twice -> BAG_OK",
			offer:  makeOfferWithBags(0, 0),
			expect: BaggageOK,
		},
		{
			name:   "missing includedCheckedBags -> BAG_UNKNOWN",
			offer:  makeOfferWithMissingBags(),
			expect: BaggageUnknown,
		},
		{
			name:   "quantity 1 -> BAG_INCLUDED",
			offer:  makeOfferWithBags(1),
			expect: BaggageIncluded,
		},
		{
			name:   "quantity 2 -> BAG_INCLUDED",
			offer:  makeOfferWithBags(2),
			expect: BaggageIncluded,
		},
		{
			name:   "one 0 one 1 -> BAG_INCLUDED",
			offer:  makeOfferWithBags(0, 1),
			expect: BaggageIncluded,
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got := classifyOfferBaggage(tt.offer)
			if got != tt.expect {
				t.Errorf("classifyOfferBaggage() = %s, want %s", got, tt.expect)
			}
		})
	}
}

func TestApplySoftStrictBaggage(t *testing.T) {
	okOffer := makeOfferWithBags(0)
	unknownOffer := makeOfferWithMissingBags()
	includedOffer := makeOfferWithBags(1)

	// Build list with 12 BAG_OK so okCount >= minOkForStrictBags (10)
	manyOk := make([]map[string]interface{}, 0, 12)
	for i := 0; i < 12; i++ {
		o := makeOfferWithBags(0)
		manyOk = append(manyOk, o)
	}

	t.Run("includeCheckedBag true returns all", func(t *testing.T) {
		offers := []map[string]interface{}{okOffer, unknownOffer, includedOffer}
		selected, okC, unkC, incC, minOkUsed, fallback := applySoftStrictBaggage(offers, true)
		if len(selected) != 3 {
			t.Errorf("expected 3 offers when includeCheckedBag=true, got %d", len(selected))
		}
		if okC != 1 || unkC != 1 || incC != 1 {
			t.Errorf("counts: ok=%d unknown=%d included=%d", okC, unkC, incC)
		}
		if minOkUsed || fallback {
			t.Errorf("expected no minOkThresholdUsed or fallback")
		}
	})

	t.Run("ok >= MIN_OK excludes unknown and included", func(t *testing.T) {
		offers := make([]map[string]interface{}, len(manyOk))
		copy(offers, manyOk)
		offers = append(offers, unknownOffer, includedOffer)
		selected, okC, unkC, incC, minOkUsed, fallback := applySoftStrictBaggage(offers, false)
		if okC != 12 || unkC != 1 || incC != 1 {
			t.Errorf("counts: ok=%d unknown=%d included=%d", okC, unkC, incC)
		}
		if len(selected) != 12 {
			t.Errorf("expected 12 offers (only BAG_OK), got %d", len(selected))
		}
		if !minOkUsed {
			t.Errorf("expected minOkThresholdUsed=true")
		}
		if fallback {
			t.Errorf("expected no fallback")
		}
	})

	t.Run("ok < MIN_OK includes ok+unknown, excludes included", func(t *testing.T) {
		offers := []map[string]interface{}{
			okOffer, okOffer, unknownOffer, unknownOffer, includedOffer,
		}
		selected, okC, unkC, incC, minOkUsed, fallback := applySoftStrictBaggage(offers, false)
		if okC != 2 || unkC != 2 || incC != 1 {
			t.Errorf("counts: ok=%d unknown=%d included=%d", okC, unkC, incC)
		}
		if len(selected) != 4 {
			t.Errorf("expected 4 offers (ok+unknown), got %d", len(selected))
		}
		if minOkUsed {
			t.Errorf("expected minOkThresholdUsed=false")
		}
		if fallback {
			t.Errorf("expected no fallback")
		}
	})

	t.Run("zero ok+unknown triggers fallback", func(t *testing.T) {
		offers := []map[string]interface{}{includedOffer, includedOffer}
		selected, okC, unkC, incC, _, fallback := applySoftStrictBaggage(offers, false)
		if okC != 0 || unkC != 0 || incC != 2 {
			t.Errorf("counts: ok=%d unknown=%d included=%d", okC, unkC, incC)
		}
		if len(selected) != 2 {
			t.Errorf("expected 2 offers (fallback to all), got %d", len(selected))
		}
		if !fallback {
			t.Errorf("expected fallback=true")
		}
	})
}
