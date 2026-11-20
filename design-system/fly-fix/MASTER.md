# Fly-Fix Design System (Master)

> Page overrides: `design-system/fly-fix/pages/[page].md` win over this file.

**Product:** Premium travel utility — evolved boarding pass, not generic OTA blue.

## Color (implementation: `frontend/src/theme/tokens.ts`)

| Role | Hex | Use |
|------|-----|-----|
| Aviation Navy | `#172A40` | Brand ink, headings, nav, **fare prices** |
| Cloud Paper | `#F6F5F1` | Screen background (light) |
| Signal Coral | `#FF735C` | **Primary actions only** (Search, Book CTA) |
| Mist | `#DFE8E8` | Dividers, secondary surfaces |
| Deep Evergreen | `#263B37` | Success, deals badges |
| White | `#FFFFFF` | Cards, dialogs |

**Do not** use sky-blue primary or purple gradients as the product default.

## Typography

- **Display:** Manrope (`theme.fontDisplay`)
- **Body:** Inter (`theme.fontBody`)
- Tabular numbers for prices and times

## Signature

- `TicketStub` — search form, result cards, page headers
- Destination mood photography — landing, search ticket top
- Coral = action; Navy = money and links

## Motion

- Durations: 180 / 220 / 320ms (`theme/motion.ts`)
- Respect `prefers-reduced-motion`
- List entrance: subtle opacity stagger, max ~6 items

## Patterns

- **Landing:** Search-first marketplace hero
- **Results:** Journey ledger cards; sources trust strip
- **Booking:** Partner vs airline **comparison** + payment disclaimer
- **Loading:** Step indicator on long searches; skeleton matches card geometry

## Anti-patterns

- Glassmorphism stacks, neon teal primaries, pill forests
- Coral on fare amounts
- Emoji as icons

## Checklist

- [ ] 4.5:1 text contrast (light + dark cabin)
- [ ] Visible keyboard focus on buttons/links (web)
- [ ] `aria-busy` on loading regions
- [ ] Responsive 375 / 768 / 1280