package main

import (
	"encoding/json"
	"net/http"
	"strings"

	"flightcaptainweb/flyfix"
)

type flyfixRefineRequest struct {
	RepoRoot string           `json:"repo_root"`
	Issues   []flyfix.Issue   `json:"issues"`
	Insights *flyfixInsights  `json:"insights"`
	RunTSC   bool             `json:"run_tsc"`
}

type flyfixInsights struct {
	Errors      []flyfix.Issue `json:"errors"`
	Warnings    []flyfix.Issue `json:"warnings"`
	Suggestions []flyfix.Issue `json:"suggestions"`
}

// handleFlyFixRefineIssues POST /api/flyfix/refine-issues — dedupe analyzer noise; optional tsc per workspace under repo_root.
func handleFlyFixRefineIssues(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodOptions {
		writeOptionsNoContent(w)
		return
	}
	if r.Method != http.MethodPost {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}
	var req flyfixRefineRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid JSON"})
		return
	}
	var issues []flyfix.Issue
	issues = append(issues, req.Issues...)
	if req.Insights != nil {
		issues = append(issues, req.Insights.Errors...)
		issues = append(issues, req.Insights.Warnings...)
		issues = append(issues, req.Insights.Suggestions...)
	}
	repoRoot := strings.TrimSpace(req.RepoRoot)
	if req.RunTSC && repoRoot != "" {
		ws := flyfix.FindJSWorkspaces(repoRoot)
		tscIssues, err := flyfix.RunTypeScriptCheck(r.Context(), repoRoot, ws)
		if err != nil {
			writeJSON(w, http.StatusInternalServerError, map[string]string{"error": err.Error()})
			return
		}
		issues = append(issues, tscIssues...)
	}
	refined := flyfix.RefineIssues(issues, flyfix.RefineOptions{RepoRoot: repoRoot})
	rep := flyfix.RefinedReport{
		Issues:  refined,
		Summary: flyfix.Summarize(refined),
	}
	writeJSON(w, http.StatusOK, rep)
}
