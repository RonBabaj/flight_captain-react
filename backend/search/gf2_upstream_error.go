package search

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strings"
)

// gf2ErrorFromHTTPBody maps RapidAPI / GF2 JSON error payloads before itinerary parse.
func gf2ErrorFromHTTPBody(statusCode int, body []byte) error {
	if statusCode == 429 {
		return fmt.Errorf("GF2 status 429 rapidapi rate limit or quota")
	}
	if statusCode == 402 {
		return fmt.Errorf("GF2 status 402 payment required rapidapi subscription")
	}
	if statusCode == 403 {
		return fmt.Errorf("GF2 status 403 rapidapi forbidden subscription")
	}
	if statusCode != http.StatusOK {
		return nil
	}
	var raw map[string]interface{}
	if err := json.Unmarshal(body, &raw); err != nil {
		return nil
	}
	if st, ok := raw["status"].(bool); ok && !st {
		if msg := gf2MessageFromMap(raw); msg != "" {
			return fmt.Errorf("GF2 upstream: %s", msg)
		}
		return fmt.Errorf("GF2 upstream: status false")
	}
	// status=true but no data — still surface non-Success messages when present
	if msg := gf2MessageFromMap(raw); msg != "" && gf2MessageLooksLikeBilling(msg) {
		return fmt.Errorf("GF2 upstream: %s", msg)
	}
	return nil
}

func gf2MessageFromMap(raw map[string]interface{}) string {
	for _, key := range []string{"message", "error", "msg", "detail"} {
		if v, ok := raw[key].(string); ok && strings.TrimSpace(v) != "" {
			return strings.TrimSpace(v)
		}
		if arr, ok := raw[key].([]interface{}); ok && len(arr) > 0 {
			return gf2FormatMessageArray(arr)
		}
	}
	if data, ok := raw["data"].(map[string]interface{}); ok {
		for _, key := range []string{"message", "error"} {
			if v, ok := data[key].(string); ok && strings.TrimSpace(v) != "" {
				return strings.TrimSpace(v)
			}
		}
	}
	return ""
}

func gf2FormatMessageArray(arr []interface{}) string {
	parts := make([]string, 0, len(arr))
	for _, item := range arr {
		switch v := item.(type) {
		case string:
			if s := strings.TrimSpace(v); s != "" {
				parts = append(parts, s)
			}
		case map[string]interface{}:
			for k, val := range v {
				parts = append(parts, fmt.Sprintf("%s: %v", k, val))
			}
		default:
			parts = append(parts, fmt.Sprintf("%v", item))
		}
	}
	return strings.Join(parts, "; ")
}

func gf2MessageLooksLikeBilling(msg string) bool {
	lower := strings.ToLower(msg)
	return strings.Contains(lower, "quota") ||
		strings.Contains(lower, "limit") && strings.Contains(lower, "exceed") ||
		strings.Contains(lower, "subscription") ||
		strings.Contains(lower, "payment") ||
		strings.Contains(lower, "not subscribed")
}

// gf2RapidAPIDiag logs rate-limit headers when present (RapidAPI standard headers).
func gf2RapidAPIDiag(headers map[string][]string) string {
	if headers == nil {
		return ""
	}
	parts := []string{}
	for _, key := range []string{
		"X-Ratelimit-Requests-Remaining",
		"X-Ratelimit-Requests-Limit",
		"X-RateLimit-Requests-Remaining",
		"X-RateLimit-Requests-Limit",
	} {
		for hk, vals := range headers {
			if strings.EqualFold(hk, key) && len(vals) > 0 {
				parts = append(parts, key+"="+vals[0])
			}
		}
	}
	return strings.Join(parts, " ")
}