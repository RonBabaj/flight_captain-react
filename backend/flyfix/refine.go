package flyfix

import (
	"fmt"
	"path/filepath"
	"strings"
)

// RefineOptions configures post-processing of analyzer output.
type RefineOptions struct {
	// RepoRoot is the unpacked repository root. When set, structure false positives are corrected
	// and Python class-field unused-variable noise is filtered using on-disk sources.
	RepoRoot string
}

// RefineIssues deduplicates toolchain false positives and rolls up noisy repeated findings.
func RefineIssues(issues []Issue, opts RefineOptions) []Issue {
	out := append([]Issue(nil), issues...)
	out = collapseTSNodeCheckFalsePositives(out)
	out = rollupDeeplyNestedPath(out)
	out = fixStructureManifestIssues(opts.RepoRoot, out)
	if opts.RepoRoot != "" {
		out = filterPythonModelFieldFalsePositives(opts.RepoRoot, out)
	}
	return out
}

// Summarize counts issues by severity string.
func Summarize(issues []Issue) Summary {
	var s Summary
	for _, iss := range issues {
		switch iss.Severity {
		case "error":
			s.CriticalErrors++
		case "warning":
			s.Warnings++
		case "suggestion":
			s.Suggestions++
		}
	}
	s.TotalIssues = len(issues)
	return s
}

func collapseTSNodeCheckFalsePositives(issues []Issue) []Issue {
	var tsxUnknown []Issue
	var tsUnknown []Issue
	var tsUnexpectedColon []Issue
	var rest []Issue
	for _, iss := range issues {
		if iss.Category != "build" || iss.Message != "JavaScript compile check failed" {
			rest = append(rest, iss)
			continue
		}
		ex := iss.Explanation
		if strings.Contains(ex, "ERR_UNKNOWN_FILE_EXTENSION") && strings.Contains(ex, ".tsx") {
			tsxUnknown = append(tsxUnknown, iss)
			continue
		}
		if strings.Contains(ex, "ERR_UNKNOWN_FILE_EXTENSION") && strings.Contains(ex, ".ts\"") {
			tsUnknown = append(tsUnknown, iss)
			continue
		}
		if strings.Contains(ex, "Unexpected token ':'") && strings.HasSuffix(strings.ToLower(iss.File), ".ts") {
			tsUnexpectedColon = append(tsUnexpectedColon, iss)
			continue
		}
		rest = append(rest, iss)
	}
	if len(tsxUnknown) > 0 {
		rest = append(rest, syntheticTSSkippedIssue(
			"tsx",
			len(tsxUnknown),
			"Node.js --check was run on .tsx files; Node does not parse TypeScript or TSX. Use the TypeScript compiler (tsc --noEmit) or your bundler instead.",
		))
	}
	if len(tsUnknown) > 0 {
		rest = append(rest, syntheticTSSkippedIssue(
			"ts",
			len(tsUnknown),
			"Node.js --check was run on .ts files without stripping types. Use tsc --noEmit (or eslint with @typescript-eslint/parser), not raw node --check.",
		))
	}
	if len(tsUnexpectedColon) > 0 {
		rest = append(rest, Issue{
			File:         ".",
			Severity:     "error",
			Category:     "build",
			Message:      "TypeScript syntax checked as plain JavaScript",
			Explanation:  fmt.Sprintf("%d file(s) failed Node syntax check on TypeScript-only syntax (e.g. type annotations). Run `tsc --noEmit` from the package root instead of `node --check`.", len(tsUnexpectedColon)),
			SuggestedFix: "Configure the analyzer to run tsc when tsconfig.json is present; use node --check only for plain .js.",
		})
	}
	return rest
}

func syntheticTSSkippedIssue(kind string, n int, detail string) Issue {
	return Issue{
		File:          ".",
		Severity:      "error",
		Category:      "build",
		Message:       "Incorrect JavaScript compile check for TypeScript sources",
		Explanation:   fmt.Sprintf("Consolidated %d duplicate issues: %s", n, detail),
		SuggestedFix:  "Skip node --check for .ts/.tsx when tsconfig.json exists; run `npx tsc --noEmit -p <path>` once per package.",
		RolledUpCount: n,
	}
}

func rollupDeeplyNestedPath(issues []Issue) []Issue {
	const msg = "Deeply nested file path"
	var group []Issue
	var rest []Issue
	for _, iss := range issues {
		if iss.Category == "structure" && iss.Message == msg {
			group = append(group, iss)
			continue
		}
		rest = append(rest, iss)
	}
	if len(group) <= 1 {
		return issues
	}
	examples := make([]string, 0, 3)
	for _, g := range group {
		if len(examples) < 3 && g.File != "" && g.File != "." {
			examples = append(examples, g.File)
		}
	}
	ex := fmt.Sprintf("Rolled up %d files flagged with the same suggestion.", len(group))
	if len(examples) > 0 {
		ex += " Examples: " + strings.Join(examples, "; ")
	}
	rest = append(rest, Issue{
		File:          ".",
		Severity:      "suggestion",
		Category:      "structure",
		Message:       msg,
		Explanation:   ex,
		SuggestedFix:  "Consider flattening the deepest feature folders or accept feature-based nesting as a convention.",
		RolledUpCount: len(group),
	})
	return rest
}

func fixStructureManifestIssues(repoRoot string, issues []Issue) []Issue {
	if repoRoot == "" {
		return issues
	}
	repoRoot = filepath.Clean(repoRoot)
	js := FindJSWorkspaces(repoRoot)
	pyDir := FindPythonManifestDir(repoRoot)
	var out []Issue
	for _, iss := range issues {
		if iss.Category != "structure" {
			out = append(out, iss)
			continue
		}
		if iss.File == "." && strings.Contains(iss.Message, "package.json") && strings.Contains(iss.Message, "missing") {
			if len(js) > 0 {
				// Monorepo / nested frontend: manifest exists under a subdirectory.
				paths := make([]string, 0, len(js))
				for _, w := range js {
					rel, err := filepath.Rel(repoRoot, w.Dir)
					if err != nil {
						rel = w.Dir
					}
					paths = append(paths, rel)
				}
				out = append(out, Issue{
					File:         ".",
					Line:         nil,
					Severity:     "suggestion",
					Category:     "structure",
					Message:      "JavaScript package manifest location",
					Explanation:  fmt.Sprintf("No package.json at the archive root, but one exists under: %s. Point the analyzer workspace root at the JS package or treat this as a monorepo.", strings.Join(paths, ", ")),
					SuggestedFix: "Detect the nearest package.json to analyzed files instead of requiring it at the extract root.",
				})
				continue
			}
		}
		if iss.File == "." && strings.Contains(strings.ToLower(iss.Message), "python") && strings.Contains(strings.ToLower(iss.Message), "manifest") {
			if pyDir != "" {
				rel, err := filepath.Rel(repoRoot, pyDir)
				if err != nil {
					rel = pyDir
				}
				out = append(out, Issue{
					File:         ".",
					Severity:     "suggestion",
					Category:     "structure",
					Message:      "Python dependency manifest location",
					Explanation:  fmt.Sprintf("A Python manifest was found under %q; the repository root check was a false positive for nested layouts.", rel),
					SuggestedFix: "Walk subdirectories for pyproject.toml / requirements.txt before reporting a missing manifest.",
				})
				continue
			}
		}
		out = append(out, iss)
	}
	return out
}
