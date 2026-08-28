package bookingmatch

// SearchCandidate is a web search hit before itinerary verification.
type SearchCandidate struct {
	URL     string
	Title   string
	Snippet string
	Domain  string
	Query   string // search query that surfaced this result
	// PageText is optional fetched body text used for deeper verification.
	PageText string
}
