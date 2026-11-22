# Fly-Fix RTL / bidirectional text

Use when Hebrew (`locale: he`) UI shows reversed arrows, scrambled IATA codes, or wrong time order on flight cards.

## Rules

1. **Never flip route/time arrows for RTL** — travel is always origin → destination. Use `→` and `›`, not `←` or `‹`.
2. **Mirror layout, not data** — `justifyContent: 'flex-end'` / `textAlign: 'right'`, not `flexDirection: 'row-reverse'` on airport timelines or time rows.
3. **Isolate Latin in RTL** — wrap times and IATA strings with `isolateLTR()`, `formatFlightTimeRange()`, or `formatAirportPath()` from `frontend/src/utils/bidi.ts` (Unicode LRI/PDI).
4. **Mixed strings** — Hebrew labels + Latin codes: put Hebrew in RTL flow; codes in `isolateLTR()` or separate `<Text>` nodes.

## Do not

- Join routes with `isRTL ? ' ← ' : ' → '`.
- Reverse airport chip order on connecting flights.

## Verify

Hebrew results: TLV › FRA › KIN reads left-to-right inside the isolated span, aligned to the right edge of the card.