---
name: flyfix-ui-ux
description: >-
  Fly-Fix product UI/UX language — boarding-pass color system, anti-AI-generic
  visuals, results chrome, destination mood photos, and responsive layout rules.
  Use when changing frontend design, theme tokens, landing, search, results,
  cards, sort/filter chrome, typography, or motion.
---

# Fly-Fix UI / UX

Apply this skill for any visual or interaction change in `frontend/`.

## Design north star

**Boarding-pass travel tool** — calm paper/ink surfaces, one navy action color, amber for fares, real destination photography. Feels like a modern airline product, not a neon SaaS landing page.

### Avoid (AI-vibe tells)

- Neon teal / cyan primary on charcoal dark mode as the default look
- Purple → indigo gradients, glow shadows, glassmorphism stacks
- Cream `#F4F1EA` + terracotta + display serif “editorial AI” cluster
- `rounded-full` pill forests, multi-layer drop shadows, emoji decoration
- Flat single-hue “AI dashboard” with no brand hierarchy
- Crowding the first viewport with stats, chips, and promo strips

### Prefer

- Light mode as the default experience; dark is a cabin option
- Restrained **ink navy** CTAs (`theme.primary` / `theme.buttonBg`)
- **Amber fares** via `theme.price` — prices are not the same color as CTAs
- Paper neutrals (`screenBg`, `cardBg`, hairline borders)
- Modest radii (`theme.radiusMd` ≈ 10, `radiusLg` ≈ 14)
- Outfit (display) + Source Sans 3 (body) on web
- Real destination photos for mood — see `destinationMood.ts`

## Tokens (source of truth)

`frontend/src/theme/ThemeContext.tsx`

| Token | Role |
|-------|------|
| `primary` / `buttonBg` | Actions, active segments, links |
| `price` | Money / fare emphasis only |
| `atmosphere` | Soft hero wash — not a second brand color |
| `controlBg` | Segment tracks, chips idle, inputs secondary |
| `fontDisplay` / `fontBody` | Type roles |

Do not hardcode indigo/teal hex in components. Prefer theme tokens.

## Screen rules

### Landing

- Brand-first hero: **Fly-Fix** dominates; one headline, one short line, one CTA group
- No cards in the hero; no overlay stickers on hero media
- **Get in the mood** strip below the fold — horizontal destination photos that prefill Search
- Features: one job per section, stacked rows (not a card grid)

### Search form

- When `destination` is set, show `DestinationMoodBanner` (not in compact sidebar)
- Keep form chrome quiet — mood photo carries atmosphere

### Results

- Mood banner under summary when destination is known
- Sort = **segmented control** (`SortBar`) — equal-width segments, no wrapping chips
- Mobile toolbar: sort full-width, then Nearby hubs / Filters on the next row
- Flight cards: times + route hierarchy; **Select** CTA; price uses `theme.price`
- Cheaper cities: quiet chip + folded progressive disclosure

## Responsive

`frontend/src/hooks/useResponsive.ts`

- `mobile` < 720, `tablet` < 1100, `desktop` ≥ 1100
- Prefer stacking over squeezing; never truncate sort labels

## Motion

- Short, purposeful entrance (brand fade/slide, mood fade-in)
- No perpetual glow or bounce on chrome

## Checklist before shipping UI

1. Could this first viewport belong to another brand if nav were removed? If yes, strengthen brand.
2. Are prices amber (`theme.price`) and CTAs navy/sky (`theme.buttonBg`)?
3. Any leftover teal/purple hardcoded hex?
4. Sort still one clean segment track on mobile width ~390?
5. Destination mood photo loads (Unsplash URL HEAD 200) or gradient fallback shows?
