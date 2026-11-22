# Live & local search verification

## Quick checks (no credentials)

```bash
./scripts/partial-search-verify.sh
```

## Production smoke (read-only API + Playwright UI)

Requires network access to `api.fly-fix.com` and `fly-fix.com`.

```bash
cd qa/e2e-live
npm install
node poll-session.mjs '{"origin":"TLV","destination":"JFK","departureDate":"2026-06-15","cabinClass":"ECONOMY","adults":1,"currency":"USD","locale":"he"}'
node flyfix-ui-quick.mjs
```

`poll-session.mjs` exits `0` when it observes at least one `PARTIAL` snapshot with results.

## Playwright MCP (local Cursor)

Add to Cursor **Settings → MCP**:

```bash
npx -y @playwright/mcp@latest --headless
```

Or use the repo file `.cursor/mcp.json` (Cloud Agents cannot attach MCP servers mid-run).