package flyfix

import (
	"os"
	"path/filepath"
	"strings"
	"testing"
)

func TestCollapseTSNodeCheckFalsePositives(t *testing.T) {
	issues := []Issue{
		{File: "a.tsx", Severity: "error", Category: "build", Message: "JavaScript compile check failed", Explanation: `ERR_UNKNOWN_FILE_EXTENSION ".tsx"`},
		{File: "b.tsx", Severity: "error", Category: "build", Message: "JavaScript compile check failed", Explanation: `ERR_UNKNOWN_FILE_EXTENSION ".tsx"`},
		{File: "c.ts", Severity: "error", Category: "build", Message: "JavaScript compile check failed", Explanation: `ERR_UNKNOWN_FILE_EXTENSION ".ts" for /tmp/c.ts`},
		{File: "d.ts", Severity: "error", Category: "build", Message: "JavaScript compile check failed", Explanation: "Unexpected token ':'"},
		{File: "real.js", Severity: "error", Category: "build", Message: "JavaScript compile check failed", Explanation: "Unexpected identifier"},
	}
	out := collapseTSNodeCheckFalsePositives(issues)
	var tsxRoll, tsRoll, colonRoll, real int
	for _, iss := range out {
		switch iss.Message {
		case "Incorrect JavaScript compile check for TypeScript sources":
			if strings.Contains(iss.Explanation, ".tsx") {
				tsxRoll++
			}
			if strings.Contains(iss.Explanation, ".ts files") {
				tsRoll++
			}
		case "TypeScript syntax checked as plain JavaScript":
			colonRoll++
		case "JavaScript compile check failed":
			if iss.File == "real.js" {
				real++
			}
		}
	}
	if tsxRoll != 1 {
		t.Fatalf("expected 1 tsx rollup, got %d: %#v", tsxRoll, out)
	}
	if tsRoll != 1 {
		t.Fatalf("expected 1 ts unknown rollup, got %d", tsRoll)
	}
	if colonRoll != 1 {
		t.Fatalf("expected 1 colon rollup for .ts syntax-as-JS, got %d", colonRoll)
	}
	if real != 1 {
		t.Fatalf("expected to keep 1 real js error, got %d", real)
	}
}

func TestRollupDeeplyNestedPath(t *testing.T) {
	issues := []Issue{
		{File: "a/x.tsx", Severity: "suggestion", Category: "structure", Message: "Deeply nested file path"},
		{File: "b/x.tsx", Severity: "suggestion", Category: "structure", Message: "Deeply nested file path"},
		{File: "c.tsx", Severity: "warning", Category: "code_smell", Message: "other"},
	}
	out := rollupDeeplyNestedPath(issues)
	var nested int
	for _, iss := range out {
		if iss.Message == "Deeply nested file path" {
			nested++
		}
	}
	if nested != 1 {
		t.Fatalf("expected 1 rolled nested issue, got %d: %#v", nested, out)
	}
	last := out[len(out)-1]
	if last.RolledUpCount != 2 {
		t.Fatalf("expected RolledUpCount 2, got %v", last.RolledUpCount)
	}
}

func TestFixStructureMonorepoJS(t *testing.T) {
	root := t.TempDir()
	frontend := filepath.Join(root, "frontend")
	if err := os.MkdirAll(frontend, 0o755); err != nil {
		t.Fatal(err)
	}
	if err := os.WriteFile(filepath.Join(frontend, "package.json"), []byte("{}\n"), 0o644); err != nil {
		t.Fatal(err)
	}

	issues := []Issue{
		{File: ".", Severity: "error", Category: "structure", Message: "package.json missing at repository root"},
	}
	out := fixStructureManifestIssues(root, issues)
	if len(out) != 1 {
		t.Fatalf("expected 1 issue, got %d: %#v", len(out), out)
	}
	if out[0].Severity != "suggestion" {
		t.Fatalf("expected demoted suggestion, got %q", out[0].Severity)
	}
}
