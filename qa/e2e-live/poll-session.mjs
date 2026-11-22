#!/usr/bin/env node
const API = process.env.FLYFIX_API || 'https://api.fly-fix.com';
const body = JSON.parse(process.argv[2] || '{"origin":"TLV","destination":"LHR","departureDate":"2026-05-12","cabinClass":"ECONOMY","adults":1,"currency":"USD"}');

const createRes = await fetch(`${API}/api/search/sessions`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body),
});
const created = await createRes.json();
const sid = created.id || created.session?.id;
console.log('session', sid);

let sawPartial = false;
for (let i = 1; i <= 40; i++) {
  const res = await fetch(`${API}/api/search/sessions/${sid}`);
  const j = await res.json();
  const st = j.session?.status;
  const n = j.results?.length ?? 0;
  const prog = j.searchProgress;
  console.log(`[${i}] ${st} results=${n} progress=${prog?.providersDone}/${prog?.providersTotal} phase=${prog?.phase}`);
  if (st === 'PARTIAL') {
    sawPartial = true;
    console.log('PARTIAL snapshot', { n, stats: j.providerStats });
  }
  if (st === 'COMPLETE' || st === 'FAILED') {
    console.log('FINAL', JSON.stringify({ stats: j.providerStats, n }, null, 2));
    break;
  }
  await new Promise((r) => setTimeout(r, 3000));
}
console.log('sawPartial', sawPartial);
process.exit(sawPartial ? 0 : 1);