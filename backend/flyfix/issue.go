package flyfix

// Issue matches the fly-fix / Project Debugger JSON report shape.
type Issue struct {
	File          string `json:"file"`
	Line          *int   `json:"line,omitempty"`
	Severity      string `json:"severity"`
	Category      string `json:"category"`
	Message       string `json:"message"`
	Explanation   string `json:"explanation"`
	SuggestedFix  string `json:"suggested_fix"`
	RolledUpCount int    `json:"rolled_up_count,omitempty"`
}

// Summary counts severities after refinement.
type Summary struct {
	CriticalErrors int `json:"critical_errors"`
	Warnings       int `json:"warnings"`
	Suggestions    int `json:"suggestions"`
	TotalIssues    int `json:"total_issues"`
}

// RefinedReport is the API response for POST /api/flyfix/refine-issues.
type RefinedReport struct {
	Issues []Issue `json:"issues"`
	Summary Summary `json:"summary"`
}
