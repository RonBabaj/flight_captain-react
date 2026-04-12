package flyfix

import (
	"bufio"
	"bytes"
	"os"
	"path/filepath"
	"regexp"
	"strings"
)

// pyAnnotatedField matches common class-level type annotations (Pydantic/dataclass/TypedDict style).
var pyAnnotatedField = regexp.MustCompile(`^\s*[a-zA-Z_][a-zA-Z0-9_]*\s*:\s*`)

// filterPythonModelFieldFalsePositives drops "unused variable" linter noise on annotated class fields.
// Tab-indented files are skipped: tab/space mixing makes line-based class detection unreliable.
func filterPythonModelFieldFalsePositives(repoRoot string, issues []Issue) []Issue {
	if repoRoot == "" {
		return issues
	}
	repoRoot = filepath.Clean(repoRoot)
	var kept []Issue
	for _, iss := range issues {
		if !shouldDropPythonUnusedVar(repoRoot, iss) {
			kept = append(kept, iss)
		}
	}
	return kept
}

func shouldDropPythonUnusedVar(repoRoot string, iss Issue) bool {
	if iss.Category != "unused_var" {
		return false
	}
	if !strings.HasSuffix(iss.File, ".py") {
		return false
	}
	if iss.Line == nil {
		return false
	}
	if !strings.Contains(iss.Message, "Unused variable") && !strings.Contains(iss.Message, "unused variable") {
		return false
	}
	abs := iss.File
	if !filepath.IsAbs(abs) {
		abs = filepath.Join(repoRoot, iss.File)
	}
	raw, err := os.ReadFile(abs)
	if err != nil {
		return false
	}
	if bytes.Contains(raw, []byte{'\t'}) {
		return false
	}
	sc := bufio.NewScanner(bytes.NewReader(raw))
	lineNo := 0
	inClass := false
	classIndent := -1
	for sc.Scan() {
		lineNo++
		line := sc.Text()
		if lineNo == *iss.Line {
			if !inClass {
				return false
			}
			indent := leadingSpaceLen(line)
			if indent <= classIndent {
				return false
			}
			return pyAnnotatedField.MatchString(line)
		}
		trim := strings.TrimSpace(line)
		if strings.HasPrefix(trim, "class ") {
			inClass = true
			classIndent = leadingSpaceLen(line)
			continue
		}
		if inClass && trim != "" {
			ind := leadingSpaceLen(line)
			if ind <= classIndent && !strings.HasPrefix(trim, "#") {
				inClass = false
			}
		}
	}
	return false
}

func leadingSpaceLen(s string) int {
	n := 0
	for _, r := range s {
		if r == ' ' {
			n++
			continue
		}
		if r == '\t' {
			n += 4
			continue
		}
		break
	}
	return n
}
