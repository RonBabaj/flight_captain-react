---
name: flyfix-ui-ux
description: >-
  Fly-Fix product UI/UX language — evolved boarding-pass system, aviation navy +
  signal coral CTAs, anti-AI-generic visuals, results chrome, destination mood
  photos, and responsive layout rules. Use when changing frontend design, theme
  tokens, landing, search, results, cards, sort/filter chrome, typography, or
  motion.
---

# Fly-Fix UI / UX

Apply this skill for any visual or interaction change in `frontend/`.

For a general design-studio pass (typography, restraint, anti-template critique), also read **`.cursor/skills/frontend-design/SKILL.md`**. Fly-Fix tokens win when they conflict with generic defaults.

## Design north star

**Premium travel utility** — evolved from the boarding-pass look: **Cloud Paper** surfaces, **Aviation Navy** ink, **Signal Coral** for primary actions, **Deep Evergreen** success, real destination photography. Not neon SaaS or purple-gradient AI templates.

### Phase 0 decisions (locked)

| Topic | Choice |
|-------|--------|
| Primary CTA | Signal Coral `#FF735C` (navy label on coral for WCAG) |
| Typography | **Manrope** (display) + **Inter** (body) — full switch |
| Default theme | **Light**; ship **light + dark** in Phase 1 |
| Copy | Keep current marketing copy |
| Explore / architecture | Unchanged; hotels out of scope |
| Rebrand | Evolve boarding-pass + new palette (both, not hard swap) |

### Avoid (AI-vibe tells)

- Neon teal / cyan primary on charcoal as the default look
- Purple → indigo gradients, glow shadows, glassmorphism stacks
- Cream + terracotta + display serif “editorial AI” cluster
- `rounded-full` pill forests, multi-layer drop shadows, emoji decoration
- Crowding the first viewport with stats, chips, and promo strips

### Prefer

- Light mode as the default; dark is a paired cabin theme
- **Coral** primary actions (`theme.buttonBg`); **navy** links/headings (`theme.primary`)
- **Navy** (light) / **paper** (dark) for fares via `theme.price` — not coral
- Paper neutrals (`screenBg`, `cardBg`, hairline borders)
- Radii `theme.radiusMd` ≈ 12, `radiusLg` ≈ 16
- **Manrope** + **Inter** on web
- Real destination photos — `destinationMood.ts`

## Tokens (source of truth)

- Palette & scale: `frontend/src/theme/tokens.ts`
- Runtime themes: `frontend/src/theme/ThemeContext.tsx`
- Motion helpers: `frontend/src/theme/motion.ts`

| Token | Role |
|-------|------|
| `primary` | Brand ink, links, headings |
| `buttonBg` / `buttonText` | Primary actions (coral + navy text) |
| `price` | Money / fare emphasis only |
| `atmosphere` | Soft hero wash |
| `controlBg` | Segment tracks, chips idle |
| `fontDisplay` / `fontBody` | Type roles |

Do not hardcode legacy navy `#163A5F` or teal in components. Prefer theme tokens.

## Screen rules

(Unchanged from prior skill — landing brand-first, search mood banner, results segment sort, responsive breakpoints in `useResponsive.ts`.)

## Responsive

`frontend/src/hooks/useResponsive.ts` — `useContentGutter()`, `useIsDesktop()`, `useIsNarrowPhone()`.

- Multi-column results / month-deals sidebars at **desktop (≥1100)** only; nav drawer below desktop.
- Shared gutters 20 / 24 / 48 px from design tokens.

## Checklist before shipping UI

1. Could this first viewport belong to another brand if nav were removed? If yes, strengthen brand.
2. Are prices on `theme.price` and primary CTAs on coral (`theme.buttonBg`)?
3. Any leftover teal/purple or old Archivo-only assumptions?
4. Sort segment active state uses coral, not navy fill?
5. Destination mood photo loads or gradient fallback shows?