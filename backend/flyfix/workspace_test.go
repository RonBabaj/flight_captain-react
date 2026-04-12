package flyfix

import (
	"path/filepath"
	"testing"
)

func TestDeduplicateNestedTypeScriptWorkspaces(t *testing.T) {
	root := t.TempDir()
	inner := filepath.Join(root, "packages", "app")
	ws := []JSWorkspace{
		{Dir: root, HasTSConfig: true},
		{Dir: inner, HasTSConfig: true},
	}
	out := DeduplicateNestedTypeScriptWorkspaces(ws)
	if len(out) != 1 {
		t.Fatalf("expected 1 workspace, got %d: %#v", len(out), out)
	}
	if out[0].Dir != inner {
		t.Fatalf("expected deepest %q, got %q", inner, out[0].Dir)
	}
}
