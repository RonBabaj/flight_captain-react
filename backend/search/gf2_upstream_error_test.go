package search

import "testing"

func TestGf2ErrorFromHTTPBody_quotaMessage(t *testing.T) {
	body := []byte(`{"status":false,"message":"You have exceeded the MONTHLY quota for Requests"}`)
	err := gf2ErrorFromHTTPBody(200, body)
	if err == nil || !gf2MessageLooksLikeBilling(err.Error()) {
		t.Fatalf("expected billing error, got %v", err)
	}
}

func TestGf2ErrorFromHTTPBody_403(t *testing.T) {
	err := gf2ErrorFromHTTPBody(403, []byte(`{"message":"Forbidden"}`))
	if err == nil || !gf2MessageLooksLikeBilling(err.Error()) {
		t.Fatalf("got %v", err)
	}
}