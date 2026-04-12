package flyfix

import (
	"bytes"
	"context"
	"fmt"
	"os/exec"
	"path/filepath"
	"strings"
	"time"
)

// RunTypeScriptCheck runs `npx tsc --noEmit -p <dir>` when tsconfig.json exists.
// Requires Node/npm on PATH. One invocation per unique workspace directory after deduplicating nested tsconfig roots.
// repoRoot is used only to shorten paths in Issue.File when possible.
func RunTypeScriptCheck(ctx context.Context, repoRoot string, workspaces []JSWorkspace) ([]Issue, error) {
	if ctx == nil {
		ctx = context.Background()
	}
	workspaces = DeduplicateNestedTypeScriptWorkspaces(workspaces)
	var issues []Issue
	seen := map[string]struct{}{}
	for _, w := range workspaces {
		if !w.HasTSConfig {
			continue
		}
		key := w.Dir
		if _, ok := seen[key]; ok {
			continue
		}
		seen[key] = struct{}{}
		ctxRun, cancel := context.WithTimeout(ctx, 3*time.Minute)
		cmd := exec.CommandContext(ctxRun, "npx", "--yes", "tsc", "--noEmit", "-p", w.Dir)
		var stderr bytes.Buffer
		cmd.Stderr = &stderr
		cmd.Stdout = &stderr
		err := cmd.Run()
		cancel()
		if err == nil {
			continue
		}
		ex := strings.TrimSpace(stderr.String())
		if ex == "" {
			ex = err.Error()
		}
		issues = append(issues, Issue{
			File:         relPathForDisplay(w.Dir, repoRoot),
			Severity:     "error",
			Category:     "build",
			Message:      "TypeScript check failed (tsc --noEmit)",
			Explanation:  truncateRunes(ex, 8000),
			SuggestedFix: "Fix reported TS errors, or adjust tsconfig include/exclude if third-party paths are scanned by mistake.",
		})
	}
	return issues, nil
}

// RunPlainNodeSyntaxCheck runs `node --check` only for .js files that live under a JS workspace
// without TypeScript (no tsconfig). Skips .ts, .tsx, .jsx.
func RunPlainNodeSyntaxCheck(ctx context.Context, root string, workspaces []JSWorkspace, jsFiles []string) ([]Issue, error) {
	if ctx == nil {
		ctx = context.Background()
	}
	var issues []Issue
	for _, rel := range jsFiles {
		lower := strings.ToLower(rel)
		if strings.HasSuffix(lower, ".ts") || strings.HasSuffix(lower, ".tsx") || strings.HasSuffix(lower, ".jsx") {
			continue
		}
		if !strings.HasSuffix(lower, ".js") && !strings.HasSuffix(lower, ".mjs") && !strings.HasSuffix(lower, ".cjs") {
			continue
		}
		abs := rel
		if !filepath.IsAbs(abs) {
			abs = filepath.Join(root, rel)
		}
		ctxRun, cancel := context.WithTimeout(ctx, 30*time.Second)
		cmd := exec.CommandContext(ctxRun, "node", "--check", abs)
		var stderr bytes.Buffer
		cmd.Stderr = &stderr
		cmd.Stdout = &stderr
		err := cmd.Run()
		cancel()
		if err == nil {
			continue
		}
		ex := strings.TrimSpace(stderr.String())
		if ex == "" {
			ex = err.Error()
		}
		issues = append(issues, Issue{
			File:         rel,
			Severity:     "error",
			Category:     "build",
			Message:      "JavaScript syntax check failed",
			Explanation:  truncateRunes(ex, 4000),
			SuggestedFix: "Fix the syntax error in this file.",
		})
	}
	return issues, nil
}

func relPathForDisplay(absDir, repoRoot string) string {
	if repoRoot == "" {
		return absDir
	}
	root := filepath.Clean(repoRoot)
	abs := filepath.Clean(absDir)
	rel, err := filepath.Rel(root, abs)
	if err != nil || strings.HasPrefix(rel, "..") {
		return absDir
	}
	return rel
}

func truncateRunes(s string, max int) string {
	if max <= 0 || len(s) <= max {
		return s
	}
	return s[:max] + fmt.Sprintf("\n… truncated (%d bytes total)", len(s))
}
