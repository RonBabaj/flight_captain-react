# Untangle: booking + results surface

## Fixes (problems they solve)

### 1. One airline-search URL policy (registry + detectors)
Airline direct URLs are either a `URLTpl` or a named builder (Condor/BA/LH-group). Template recognition uses shared `airlineSearchTemplateHosts` + path special cases. Aegean uses live `flights.aegeanair.com` (not the 404 `/plan/booking/flights/` path).

- Per-carrier empty URLTpl + imperative builders
- `isAffiliateTemplateBookingURL` host allowlist sync
- Aegean `/plan/booking/flights/?Origin=` → 404

### 2. Prefill price is never a comparable fare
`applyAirlinePrefillPricing` always clears fare on template airline links. UI uses `formatBookingOfferPriceDisplay` (amount or `—`) on cards and the dual table.

- Missing Aegean price on DIRECT card after clearing quote
- Fake LOWEST when quote was attached
- `formatBookingOfferPriceAmount` vs badge non-comparable split

### 3. Shared booking option surface
`BookingOptionsFooter` single + dual paths both use `BookingOptionCard`; alternatives go through `BookingAlternativesList`.

- Footer inlines a duplicate card
- Alternatives duplicated pressable vs Button

### 4. Shared self-transfer notice (not a price-column hack)
`SelfTransferNotice` (Callout) sits full-width under the schedule row on the card; modal reuses it.

- Self-transfer text overlapping Direct/times in price column
- Duplicate warning markup in modal

### 5. Shared leg chrome helpers
Card already uses `legSummary`; further MonthDeals consolidation deferred (lower leverage this pass).

- Triplicated `formatDuration` / stops phrasing
