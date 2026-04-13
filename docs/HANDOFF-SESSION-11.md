# Session 11 Handoff — Visual Design Pass + Screen 2j

**Date:** 13 April 2026
**Branch:** `claude/decouple-v2-financial-8RxiM` → merged to `main`
**Lines changed:** ~870 net (1,541 added, 668 removed) across 14 files
**Commits:** 10 (1 design pass, 1 screen 2j, 8 bug fixes)

---

## What happened

### 1. Visual direction synthesis

User provided 14 screenshots across three reference apps. We discussed each batch and what to take:

- **Airbnb (5 screenshots):** Shadow-based card separation, generous whitespace, minimal borders, full-width CTAs, pill-shaped elements, login modal generosity
- **Emma web + app (6 screenshots):** Financial values as hero elements, restrained colour (only for values), card treatment (almost invisible containers), content brevity, scannable rows. Dark palette explicitly rejected — light theme only.
- **Habito (4 screenshots):** Full-width radio cards with black inversion on selection, bold progress bar with step counter, one question per screen, helper text hierarchy

Synthesised into `docs/workspace-spec/27-visual-direction-session11.md`.

**Key design decisions made with user:**
- Decouple red accent `#E5484D` — the ONE brand colour, used for all primary CTAs
- Explicit "Continue" button (not auto-advance) — needed for progressive disclosure
- Page width 1080px (from 720px), 600px form column
- 12px card radius (from 6px), shadow separation (no borders)
- Centred "Decouple" logo in header
- Hamburger always left with Airbnb-style flyout, bell + cog right
- All filled buttons are red — no black/ink filled buttons (late fix from user)

### 2. Visual pass — all screens

Applied to every component: globals.css, title-bar, carousel, task list, bank connection, confirmation flow, progress stepper, mini-summary, financial summary.

### 3. Post-connection task list (screen 2j)

Built dynamic task list matching wireframe:
- **Preparation:** CETV (conditional on pension), children outline, budgetary needs, divorce application (with "for guidance click here" link), MIAM booking
- **Sharing:** Invite ex-partner, mediator, solicitor
- **Finalisation:** Numbered upload tasks (property valuation, mortgage statement, payslips, pension CETV), generate final docs
- Button styles differentiated: red filled for actions, outlined+chevron for "Take action" dropdowns

### 4. Bug fixes (7)

1. Removed duplicate completed sections list from FinalSummary
2. Added [Edit] links to accordion items
3. "Your estimate" → "Self disclosed" badge label
4. Progress stepper bar matches "N of M" counter
5. Hamburger always present (was replaced by back arrow)
6. Task list copy/buttons aligned exactly to wireframe
7. All filled buttons changed from black to red

## What went well

- Screenshot-driven design discussion was highly productive
- Airbnb/Emma/Habito synthesis created a clear, implementable direction
- User caught wire accuracy issues quickly — improved fidelity
- Build passed on every commit
- Clean merge to main

## What could improve

- Should have matched wireframe copy more carefully on first pass of screen 2j
- Button colour hierarchy (red not black) should have been caught in the design direction doc
- The CETV conditional logic caused a brief back-and-forth — should have tested the demo flow first

## Key decisions

| Decision | Choice | Rationale |
|---|---|---|
| Accent colour | `#E5484D` (Radix Red 9) | Confident but not aggressive, like Airbnb's pink-red |
| Auto-advance | No — explicit Continue | Progressive disclosure needs commit step |
| Card separation | Shadow, no borders | Airbnb pattern — cleaner, more modern |
| Card radius | 12px (from 6px) | Softer, matches Airbnb/Emma |
| Page width | 1080px (from 720px) | Airbnb-level breathing room |
| Hamburger | Always left, never replaced | Back navigation stays in page content |
| Badge labels | "Bank confirmed" / "Self disclosed" | Clearer than "Connected" / "Your estimate" |
| Button hierarchy | Red for ALL filled buttons | One colour hierarchy, no black CTAs |
| CETV task | Conditional on pension answer | Correctly hidden when no pensions |

## Tink status

Code unchanged. Works on production (`construct-dev.vercel.app`) where env vars are set. Branch merged to main — Tink test bank should work on next deploy. Demo data fallback works when credentials not set.
