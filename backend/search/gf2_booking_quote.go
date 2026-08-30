package search

import (
	"context"
	"encoding/json"
	"fmt"
	"math"
	"net/url"
	"strings"
)

// QuoteBinding ties checkout to the fare amount shown in search results.
type QuoteBinding struct {
	Amount   float64
	Currency string
	DeepLink string
}

// ResolvedPartnerBooking is a partner checkout URL selected to honor a search quote.
type ResolvedPartnerBooking struct {
	URL      string
	Price    float64
	Currency string
	Provider string
}

type gf2BookingOption struct {
	URL                 string
	BookingRequestToken string
	Price               float64
	Currency            string
	Provider            string
}

// PricesMatchQuote returns true when actual is close enough to the quoted search fare.
func PricesMatchQuote(quoted, actual float64) bool {
	if quoted <= 0 || actual <= 0 {
		return false
	}
	diff := math.Abs(quoted - actual)
	if diff <= 5 {
		return true
	}
	return diff/quoted <= 0.04
}

// ResolveQuotedPartnerBooking resolves getBookingDetails → booking_options, picking the seller
// that matches the quoted search fare (or the search-time deep link) instead of an arbitrary partner.
func (p *GoogleFlights2Provider) ResolveQuotedPartnerBooking(ctx context.Context, bookingToken, currency string, quote QuoteBinding) (*ResolvedPartnerBooking, error) {
	if p == nil {
		return nil, fmt.Errorf("google flights provider not configured")
	}
	token := strings.TrimSpace(bookingToken)
	if token == "" {
		return nil, fmt.Errorf("missing booking token")
	}
	if currency == "" {
		currency = "USD"
	}
	if !p.allowBooking() {
		return nil, fmt.Errorf("flight search rate limited; try again in a minute")
	}

	detailsBody, err := p.fetchBookingDetails(ctx, token, currency)
	if err != nil {
		return nil, err
	}

	options := parseGF2BookingOptions(detailsBody, currency)
	if picked := selectBookingOptionForQuote(options, quote); picked != nil {
		return p.resolveGF2BookingOption(ctx, picked, currency)
	}
	if picked := firstPartnerBookingOption(options); picked != nil {
		return p.resolveGF2BookingOption(ctx, picked, currency)
	}

	// Some GF2 payloads put the partner checkout URL outside booking_options.
	if _, directURL := extractGF2PartnerBookingToken(detailsBody); isLikelyPartnerCheckoutURL(directURL) {
		return &ResolvedPartnerBooking{
			URL:      directURL,
			Price:    quote.Amount,
			Currency: firstNonEmpty(quote.Currency, currency),
			Provider: providerFromURL(directURL),
		}, nil
	}

	// Honor the search-time deep link when booking_options don't include a price match.
	if u := strings.TrimSpace(quote.DeepLink); u != "" && isLikelyPartnerCheckoutURL(u) {
		return &ResolvedPartnerBooking{
			URL:      u,
			Price:    quote.Amount,
			Currency: firstNonEmpty(quote.Currency, currency),
			Provider: providerFromURL(u),
		}, nil
	}

	// getBookingURL accepts the search booking_token on some GF2 plans.
	if u, err := p.resolvePartnerTokenToURL(ctx, token); err == nil && isLikelyPartnerCheckoutURL(u) {
		return &ResolvedPartnerBooking{
			URL:      u,
			Price:    quote.Amount,
			Currency: firstNonEmpty(quote.Currency, currency),
			Provider: providerFromURL(u),
		}, nil
	}

	return nil, fmt.Errorf("no booking option matches quoted fare")
}

// ResolveQuotedPartnerBookingForFingerprint re-searches GF2 and resolves checkout for the
// matching itinerary using that result's quote (price + deep link + token).
func (p *GoogleFlights2Provider) ResolveQuotedPartnerBookingForFingerprint(ctx context.Context, req SearchRequest, wantItin CanonicalItinerary, currency string, quote QuoteBinding) (*ResolvedPartnerBooking, error) {
	if p == nil {
		return nil, fmt.Errorf("google flights provider not configured")
	}
	wantFP := CanonicalItineraryFingerprint(wantItin)
	if wantFP == "" {
		return nil, fmt.Errorf("missing itinerary fingerprint")
	}
	if currency == "" {
		currency = "USD"
	}
	if !p.allowBooking() {
		return nil, fmt.Errorf("flight search rate limited; try again in a minute")
	}
	results, err := p.doSearch(ctx, req)
	if err != nil {
		return nil, err
	}
	if len(results) > 0 {
		p.enrichResultsPartnerLinks(ctx, results, currency)
	}
	AttachCanonicalIdentityAll(results)
	for i := range results {
		r := &results[i]
		if r.ItineraryFingerprint != wantFP && !ResultMatchesItinerary(wantItin, *r) {
			continue
		}
		matchQuote := QuoteBinding{
			Amount:   r.Price.Amount,
			Currency: firstNonEmpty(r.Price.Currency, currency),
			DeepLink: strings.TrimSpace(r.DeepLink),
		}
		if quote.Amount > 0 {
			matchQuote.Amount = quote.Amount
			matchQuote.Currency = firstNonEmpty(quote.Currency, matchQuote.Currency)
		}
		if quote.DeepLink != "" {
			matchQuote.DeepLink = quote.DeepLink
		}
		if u := strings.TrimSpace(r.DeepLink); u != "" && isLikelyPartnerCheckoutURL(u) {
			return &ResolvedPartnerBooking{
				URL:      u,
				Price:    matchQuote.Amount,
				Currency: matchQuote.Currency,
				Provider: firstNonEmpty(strings.TrimSpace(r.VendorName), providerFromURL(u)),
			}, nil
		}
		bt := strings.TrimSpace(r.BookingToken)
		if bt == "" {
			continue
		}
		return p.ResolveQuotedPartnerBooking(ctx, bt, currency, matchQuote)
	}
	return nil, fmt.Errorf("no booking path for itinerary fingerprint %s", wantFP)
}

func (p *GoogleFlights2Provider) fetchBookingDetails(ctx context.Context, bookingToken, currency string) ([]byte, error) {
	detailsURL := fmt.Sprintf("https://%s/api/v1/getBookingDetails?%s", p.host, url.Values{
		"booking_token": {bookingToken},
		"currency":      {currency},
		"language_code": {"en-US"},
		"country_code":  {"US"},
	}.Encode())
	return p.doGF2GET(ctx, detailsURL)
}

func (p *GoogleFlights2Provider) resolveGF2BookingOption(ctx context.Context, opt *gf2BookingOption, currency string) (*ResolvedPartnerBooking, error) {
	if opt == nil {
		return nil, fmt.Errorf("missing booking option")
	}
	if u := strings.TrimSpace(opt.URL); u != "" && isLikelyPartnerCheckoutURL(u) {
		return &ResolvedPartnerBooking{
			URL:      u,
			Price:    opt.Price,
			Currency: firstNonEmpty(opt.Currency, currency),
			Provider: firstNonEmpty(opt.Provider, providerFromURL(u)),
		}, nil
	}
	tok := strings.TrimSpace(opt.BookingRequestToken)
	if tok == "" {
		return nil, fmt.Errorf("booking option has no URL or token")
	}
	u, err := p.resolvePartnerTokenToURL(ctx, tok)
	if err != nil {
		return nil, err
	}
	return &ResolvedPartnerBooking{
		URL:      u,
		Price:    opt.Price,
		Currency: firstNonEmpty(opt.Currency, currency),
		Provider: firstNonEmpty(opt.Provider, providerFromURL(u)),
	}, nil
}

func (p *GoogleFlights2Provider) resolvePartnerTokenToURL(ctx context.Context, partnerToken string) (string, error) {
	bookingURLReq := fmt.Sprintf("https://%s/api/v1/getBookingURL?%s", p.host, url.Values{
		"token": {partnerToken},
	}.Encode())
	if !p.allowBooking() {
		return "", fmt.Errorf("flight search rate limited; try again in a minute")
	}
	urlBody, err := p.doGF2GET(ctx, bookingURLReq)
	if err != nil {
		return "", err
	}
	out := extractGF2BookingURL(urlBody)
	if out == "" {
		return "", fmt.Errorf("empty booking URL from getBookingURL")
	}
	return out, nil
}

func parseGF2BookingOptions(body []byte, defaultCurrency string) []gf2BookingOption {
	var raw interface{}
	if err := json.Unmarshal(body, &raw); err != nil {
		return nil
	}
	arr := findBookingOptionsArray(raw)
	if len(arr) == 0 {
		return nil
	}
	out := make([]gf2BookingOption, 0, len(arr))
	for _, item := range arr {
		m, _ := item.(map[string]interface{})
		if m == nil {
			continue
		}
		opt := gf2BookingOption{
			URL:                 firstPartnerURLInMap(m),
			BookingRequestToken: partnerRequestTokenFromMap(m),
			Price:               extractGF2Price(m),
			Currency: firstNonEmpty(
				firstStringByKeys(m, []string{"currency", "currency_code", "currencyCode"}),
				defaultCurrency,
			),
			Provider: firstNonEmpty(
				firstStringByKeys(m, []string{"partner", "book_with", "bookWith", "provider", "vendor", "name", "seller"}),
				providerFromURL(firstPartnerURLInMap(m)),
			),
		}
		if opt.URL != "" || opt.BookingRequestToken != "" {
			out = append(out, opt)
		}
	}
	return out
}

func findBookingOptionsArray(v interface{}) []interface{} {
	switch x := v.(type) {
	case map[string]interface{}:
		// RapidAPI getBookingDetails: { status, data: [ { partner, price, token } ] }
		if dataArr, ok := x["data"].([]interface{}); ok && isPartnerBookingList(dataArr) {
			return dataArr
		}
		for _, key := range []string{"booking_options", "bookingOptions", "options"} {
			if arr, ok := x[key].([]interface{}); ok && len(arr) > 0 {
				return arr
			}
		}
		for _, key := range []string{"data", "result", "results"} {
			if child, ok := x[key]; ok {
				if arr := findBookingOptionsArray(child); len(arr) > 0 {
					return arr
				}
			}
		}
		for _, child := range x {
			if arr := findBookingOptionsArray(child); len(arr) > 0 {
				return arr
			}
		}
	case []interface{}:
		if isPartnerBookingList(x) {
			return x
		}
		for _, child := range x {
			if arr := findBookingOptionsArray(child); len(arr) > 0 {
				return arr
			}
		}
	}
	return nil
}

func isPartnerBookingList(arr []interface{}) bool {
	if len(arr) == 0 {
		return false
	}
	for _, item := range arr {
		m, _ := item.(map[string]interface{})
		if m == nil {
			return false
		}
		if partnerRequestTokenFromMap(m) == "" && firstPartnerURLInMap(m) == "" {
			return false
		}
	}
	return true
}

func partnerRequestTokenFromMap(m map[string]interface{}) string {
	for _, key := range []string{
		"booking_request_token", "bookingRequestToken",
		"request_token", "requestToken",
		"partner_token", "partnerToken",
		"token",
	} {
		if s, ok := m[key].(string); ok {
			v := strings.TrimSpace(s)
			if v == "" || strings.HasPrefix(v, "http://") || strings.HasPrefix(v, "https://") {
				continue
			}
			return v
		}
	}
	return ""
}

func firstPartnerURLInMap(m map[string]interface{}) string {
	for _, key := range []string{"url", "booking_url", "bookingUrl", "redirect_url", "redirectUrl", "deep_link", "deepLink", "link"} {
		if s, ok := m[key].(string); ok && isLikelyPartnerCheckoutURL(s) {
			return strings.TrimSpace(s)
		}
	}
	return ""
}

func selectBookingOptionForQuote(options []gf2BookingOption, quote QuoteBinding) *gf2BookingOption {
	valid := make([]gf2BookingOption, 0, len(options))
	for _, o := range options {
		if strings.TrimSpace(o.URL) != "" || strings.TrimSpace(o.BookingRequestToken) != "" {
			valid = append(valid, o)
		}
	}
	if len(valid) == 0 {
		return nil
	}

	quoted := quote.Amount
	if quoted > 0 {
		matched := make([]gf2BookingOption, 0, len(valid))
		for _, o := range valid {
			if o.Price > 0 && PricesMatchQuote(quoted, o.Price) {
				matched = append(matched, o)
			}
		}
		if len(matched) > 0 {
			valid = matched
		}
	}

	if dl := strings.TrimSpace(quote.DeepLink); dl != "" {
		wantHost := hostFromURL(dl)
		if wantHost != "" {
			for i := range valid {
				u := strings.TrimSpace(valid[i].URL)
				if u == "" {
					continue
				}
				if hostFromURL(u) == wantHost || strings.HasPrefix(u, dl) {
					return &valid[i]
				}
			}
		}
	}

	if quoted > 0 {
		bestIdx := 0
		bestDiff := math.MaxFloat64
		for i, o := range valid {
			p := o.Price
			if p <= 0 {
				p = quoted
			}
			diff := math.Abs(quoted - p)
			if diff < bestDiff {
				bestDiff = diff
				bestIdx = i
			}
		}
		return &valid[bestIdx]
	}

	bestIdx := 0
	bestPrice := math.MaxFloat64
	for i, o := range valid {
		p := o.Price
		if p <= 0 {
			p = math.MaxFloat64
		}
		if p < bestPrice {
			bestPrice = p
			bestIdx = i
		}
	}
	return &valid[bestIdx]
}

func firstPartnerBookingOption(options []gf2BookingOption) *gf2BookingOption {
	for i := range options {
		o := &options[i]
		if u := strings.TrimSpace(o.URL); u != "" && isLikelyPartnerCheckoutURL(u) {
			return o
		}
		if strings.TrimSpace(o.BookingRequestToken) != "" {
			return o
		}
	}
	return nil
}

func providerFromURL(raw string) string {
	parsed, err := url.Parse(strings.TrimSpace(raw))
	if err != nil {
		return ""
	}
	return strings.TrimPrefix(parsed.Hostname(), "www.")
}

func hostFromURL(raw string) string {
	parsed, err := url.Parse(strings.TrimSpace(raw))
	if err != nil {
		return ""
	}
	return strings.ToLower(strings.TrimPrefix(parsed.Hostname(), "www."))
}

func firstStringByKeys(m map[string]interface{}, keys []string) string {
	for _, key := range keys {
		if s, ok := m[key].(string); ok {
			s = strings.TrimSpace(s)
			if s != "" {
				return s
			}
		}
	}
	return ""
}
