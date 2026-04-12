package flyfix

import (
	"io/fs"
	"os"
	"path/filepath"
	"sort"
	"strings"
)

const maxWalkDepth = 40

// JSWorkspace is a directory that owns frontend JavaScript/TypeScript (package.json present).
type JSWorkspace struct {
	Dir         string
	HasTSConfig bool
}

// FindJSWorkspaces returns each directory under root that contains package.json (deepest wins per path prefix — we collect all package.json dirs).
func FindJSWorkspaces(root string) []JSWorkspace {
	root = filepath.Clean(root)
	var out []JSWorkspace
	_ = filepath.WalkDir(root, func(path string, d fs.DirEntry, err error) error {
		if err != nil {
			return nil
		}
		if d.IsDir() {
			rel, _ := filepath.Rel(root, path)
			if rel == "." {
				return nil
			}
			if depth := strings.Count(rel, string(filepath.Separator)); depth > maxWalkDepth {
				return fs.SkipDir
			}
			base := filepath.Base(path)
			if base == "node_modules" || base == ".git" || base == "dist" || base == "build" {
				return fs.SkipDir
			}
			return nil
		}
		if d.Name() != "package.json" {
			return nil
		}
		dir := filepath.Dir(path)
		_, errTS := os.Stat(filepath.Join(dir, "tsconfig.json"))
		out = append(out, JSWorkspace{
			Dir:         dir,
			HasTSConfig: errTS == nil,
		})
		return nil
	})
	return out
}

// FindPythonManifestDir returns the first directory under root containing pyproject.toml, requirements.txt, or setup.py.
func FindPythonManifestDir(root string) string {
	root = filepath.Clean(root)
	var found string
	_ = filepath.WalkDir(root, func(path string, d fs.DirEntry, err error) error {
		if err != nil || found != "" {
			return nil
		}
		if d.IsDir() {
			base := filepath.Base(path)
			if base == "node_modules" || base == ".git" || base == ".venv" || base == "venv" {
				return fs.SkipDir
			}
			return nil
		}
		switch d.Name() {
		case "pyproject.toml", "requirements.txt", "setup.py":
			found = filepath.Dir(path)
			return fs.SkipAll
		}
		return nil
	})
	return found
}

// NearestJSWorkspace returns the workspace whose Dir is the longest prefix of filePath (filePath relative or absolute under root).
func NearestJSWorkspace(workspaces []JSWorkspace, root, filePath string) *JSWorkspace {
	absFile := filePath
	if !filepath.IsAbs(filePath) {
		absFile = filepath.Join(root, filePath)
	}
	absFile, _ = filepath.Abs(absFile)
	var best *JSWorkspace
	bestLen := -1
	for i := range workspaces {
		w := &workspaces[i]
		wAbs, err := filepath.Abs(w.Dir)
		if err != nil {
			continue
		}
		rel, err := filepath.Rel(wAbs, absFile)
		if err != nil || strings.HasPrefix(rel, "..") {
			continue
		}
		if len(wAbs) > bestLen {
			bestLen = len(wAbs)
			best = w
		}
	}
	return best
}

func isAncestorDir(ancestorAbs, descendantAbs string) bool {
	rel, err := filepath.Rel(ancestorAbs, descendantAbs)
	if err != nil {
		return false
	}
	if rel == "." {
		return false
	}
	return !strings.HasPrefix(rel, "..")
}

// DeduplicateNestedTypeScriptWorkspaces keeps leaf tsconfig workspaces: skips a directory if it is already an ancestor of a deeper workspace that was kept (deepest paths processed first).
func DeduplicateNestedTypeScriptWorkspaces(workspaces []JSWorkspace) []JSWorkspace {
	var withTS []JSWorkspace
	for _, w := range workspaces {
		if w.HasTSConfig {
			withTS = append(withTS, w)
		}
	}
	if len(withTS) <= 1 {
		return withTS
	}
	sort.Slice(withTS, func(i, j int) bool {
		return len(withTS[i].Dir) > len(withTS[j].Dir)
	})
	var out []JSWorkspace
	for _, w := range withTS {
		wAbs, err := filepath.Abs(w.Dir)
		if err != nil {
			out = append(out, w)
			continue
		}
		skip := false
		for _, kept := range out {
			kAbs, err := filepath.Abs(kept.Dir)
			if err != nil {
				continue
			}
			if isAncestorDir(wAbs, kAbs) {
				skip = true
				break
			}
		}
		if !skip {
			out = append(out, w)
		}
	}
	return out
}
