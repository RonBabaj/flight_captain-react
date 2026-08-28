package bookingmatch

import (
	"fmt"
	"net"
	"net/url"
	"strings"
)

var allowedBookingSchemes = map[string]struct{}{
	"https": {},
	"http":  {},
}

// ValidateBookingURL ensures externally discovered URLs are safe to return to clients.
// Only http(s) schemes are allowed; localhost and private IPs are rejected.
func ValidateBookingURL(raw string) error {
	raw = strings.TrimSpace(raw)
	if raw == "" {
		return fmt.Errorf("empty URL")
	}
	parsed, err := url.Parse(raw)
	if err != nil {
		return fmt.Errorf("malformed URL: %w", err)
	}
	scheme := strings.ToLower(parsed.Scheme)
	if _, ok := allowedBookingSchemes[scheme]; !ok {
		return fmt.Errorf("disallowed URL scheme %q", parsed.Scheme)
	}
	host := strings.ToLower(parsed.Hostname())
	if host == "" {
		return fmt.Errorf("missing URL host")
	}
	if host == "localhost" || strings.HasSuffix(host, ".localhost") {
		return fmt.Errorf("localhost URLs are not allowed")
	}
	if ip := net.ParseIP(host); ip != nil {
		if ip.IsLoopback() || ip.IsPrivate() || ip.IsLinkLocalUnicast() || ip.IsLinkLocalMulticast() || ip.IsUnspecified() {
			return fmt.Errorf("non-public IP URLs are not allowed")
		}
	}
	return nil
}
