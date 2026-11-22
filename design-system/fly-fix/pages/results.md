# Results

- Skeleton cards mirror `FlightResultCard` + `TicketStub` layout (stable min heights).
- **Cards:** `JourneyRouteBar` + `LayoverChips` for scannable hops; Outbound/Return labels on RT.
- **Header:** `SearchSummaryBar` `tone="plain"` on mobile; mood `compact` strip (not full photo rail).
- **Trust:** provider warnings in compact `SearchSourcesBanner` (per-provider chips, no ops dump); pagination count is inline text only.
- Desktop: filters in sidebar; list uses `layout.resultsGutterDesktop` (28px) and full results-column width (no 960px cap).
- Destination mood on results: always `compact` variant (not full photo rail).
- Fare emphasis: `theme.price` (navy), Book: coral only on card CTA; secondary **View details** in card footer.