# Results

- Skeleton cards mirror `FlightResultCard` + `TicketStub` layout (stable min heights).
- **Cards:** `AirportRouteTimeline` + `LayoverChips` for scannable hops; Outbound/Return labels on RT.
- **Header:** `SearchSummaryBar` `tone="plain"` on mobile; mood `compact` strip (not full photo rail).
- **Trust:** provider warnings stay in `SearchSourcesBanner` box; pagination count is inline text only.
- Desktop: filters in sidebar; list gutter from `useContentGutter()`.
- Fare emphasis: `theme.price` (navy), Book: coral only on card CTA; secondary **View details** in card footer.