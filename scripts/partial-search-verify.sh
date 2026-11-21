#!/usr/bin/env bash
# Local verification for partial search streaming (no live GF2/scraper required).
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

echo "== backend/search: partial stream + multi-provider =="
(cd backend && go test ./search -run 'PartialStream|SearchAllWithProgress|MergeProvider' -count=1 -v)

echo "== frontend: loading phrase copy =="
(cd frontend && npx --yes tsx src/components/search/searchLoadingPhrases.test.ts)

echo "== frontend: production build =="
(cd frontend && npm run build)

echo ""
echo "Manual stack (optional, needs backend/.env with GF2 + scraper):"
echo "  docker compose up flyfix-api flyfix-frontend flight-scraper"
echo "Run a search and watch GET /api/search/sessions/:id flip PENDING → PARTIAL → COMPLETE."
echo "PARTIAL should arrive while multisite scrape is still running."
echo ""
echo "All automated partial-search checks passed."