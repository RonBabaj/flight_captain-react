---
name: flyfix-redesign-playbook
description: >-
  Fly-Fix full-product redesign phases (audit → tokens → pages → responsive →
  motion → critique → QA). Use when executing the premium travel utility visual
  identity. Pair with flyfix-ui-ux until tokens are officially migrated.
---

# Fly-Fix — Design System & Cursor Redesign Playbook

**Project:** Fly-Fix  
**Design direction:** Premium travel utility  
**Scope:** Entire website  
**Objective:** Distinctive, polished visual identity; preserve all product functionality.

This file is the canonical phase playbook. **Do not skip Phase 0** before token work. **Do not change APIs or mock data** during visual passes.

For day-to-day Results/Search polish before a full token migration, also read **`.cursor/skills/flyfix-ui-ux/SKILL.md`** and **`.cursor/skills/frontend-design/SKILL.md`**.

---

## 1. Product and brand direction

Fly-Fix: precise, modern, approachable flight discovery.

Brand principles: Clarity, Character, Precision, Trust, Consistency.

Visual vocabulary: route lines, airport codes, structured grids, selective destination photography — not generic travel SaaS.

Suggested line (optional): *Find your way out there.*

---

## 2. Design tokens (proposed starting values)

| Token | Hex | Use |
|--------|-----|-----|
| Aviation Navy | #172A40 | Brand, headings, nav |
| Cloud Paper | #F6F5F1 | Page background |
| Signal Coral | #FF735C | Primary actions, selected |
| Mist | #DFE8E8 | Secondary surfaces, dividers |
| Deep Evergreen | #263B37 | Success, deals |
| Pure White | #FFFFFF | Cards, dialogs |

Typography: **Manrope** (headings), **Inter** (body). Tabular nums for prices/times.

Spacing: 4px scale (4, 8, 16, 24, 32, 48, 64, 96). Max width ~1280px.

**Phase 1 implementation** (in progress): `frontend/src/theme/tokens.ts` + `ThemeContext.tsx` — Aviation Navy, Cloud Paper, Signal Coral CTAs, Manrope + Inter. Light default, dark paired. Marketing copy unchanged; Explore architecture unchanged; hotels out of scope.

**Phase 0 decisions (user):** Coral CTAs OK; full font switch; light-first with both themes; keep copy; keep explore; no hotels; evolve boarding-pass + new palette.

---

## 3. Core product patterns

A. Flight search (cohesive form)  
B. Flight result cards (journey / characteristics / commercial)  
C. Itinerary timeline (details modal)  
D. Destination discovery (Explore, mood strip)  
E. Hotel deals — **not in repo today**; skip or future scope  
F. Shared navigation (`TopNavMenu`)

---

## 4. Motion

150–220ms standard; respect `prefers-reduced-motion`. No scroll-jacking.

---

## 5. Cursor workflow phases

| Phase | Action |
|-------|--------|
| **0** | Audit only — **no code** |
| **1** | Tokens + shared components in `ThemeContext` / `src/ui/` |
| **2** | Page-by-page apply (landing, search form, results, explore, monthly deals, auth/settings — coral selections + CTAs, navy fares/links) |
| **3** | Responsive pass (320–1280+): gutters, desktop-only multi-column, drawer nav &lt;1100 |
| **4** | Motion polish — `theme/motion.ts`, reduced-motion, token durations |
| **5** | Critique fixes — a11y chip, dead props, tabular fares, legal/explore gutters |
| **6** | Regression QA, build, a11y smoke, **single PR** |

Commit after each phase. Open **one PR after Phase 6**, not per phase.

---

## 6. Non-negotiable constraints

Never change API contracts, booking redirects, or real data for cosmetics. Preserve routes, query params, SEO in `public/index.html`.

---

## 7. Working method

Run 0 → approve direction → 1 → 2 in page groups → 3–6.

**Definition of done:** One coherent product on desktop and mobile.

---

_Full playbook text provided by product owner; this skill is the operational summary for agents._