# Session 11 Handoff — Visual Design Pass + Screen 2j

**Date:** 13 April 2026
**Branch:** `claude/decouple-v2-financial-8RxiM`
**Lines changed:** ~822 net (1,379 added, 557 removed) across 11 files + 1 new spec doc

---

## What happened

### 1. Visual direction synthesis

User provided screenshots from Airbnb (5 screenshots), Emma app (5 screenshots), and Habito mortgage flow (4 screenshots). We discussed what to take from each:

- **Airbnb:** Shadow-based card separation, generous whitespace, pill CTAs, minimal borders
- **Emma:** Financial values as hero elements, restrained colour, content brevity
- **Habito:** Full-width radio cards with black inversion on selection, bold progress bar, one question per screen

Synthesised into `docs/workspace-spec/27-visual-direction-session11.md` — a comprehensive design direction doc covering surfaces, typography, colour, layout, buttons, Q&A pattern, animations, and what changed from spec 18.

**Key design decisions made with user:**
- Decouple red accent `#E5484D` — introduced as the brand action colour (like Airbnb's pink-red)
- Explicit "Continue" button kept (not auto-advance) — needed for progressive disclosure when "Other" selected
- Page width widened to 1080px (from 720px) with 600px form column
- Centred "Decouple" logo in header
- Hamburger menu always left (never replaced by back arrow), with Airbnb-style flyout
- Bell + cog placeholder icons on right

### 2. Visual pass across all screens

Applied the design direction to every component:
- `globals.css` — new tokens: red accent, shadow-card, 12px radius, 1080px width, 64px header
- `title-bar.tsx` — complete rewrite: centred logo, hamburger with flyout, bell/cog icons
- `welcome-carousel.tsx` — shadow card, red CTA, updated typography
- `task-list-home.tsx` — shadow cards, red CTA, wider layout
- `bank-connection-flow.tsx` — shadow cards, red progress bar, red CTAs
- `confirmation-flow.tsx` — Habito radio cards (black inversion), red Continue, 22px questions
- `progress-stepper.tsx` — red fill, "N of M" counter, thicker bar
- `section-mini-summary.tsx` — red CTA, updated spacing
- `financial-summary-page.tsx` — shadow cards, wider layout, source badges

### 3. Post-connection task list (screen 2j)

Built the dynamic task list matching the wireframe exactly:
- **Preparation tasks:** CETV (conditional on pension), children outline, budgetary needs, divorce application, MIAM booking
- **Sharing & collaboration tasks:** Invite ex-partner, mediator, solicitor
- **Finalisation:** Numbered upload tasks (property valuation, mortgage statement, payslips, pension CETV), generate final docs
- All three phases unlock after confirmation
- Button styles differentiated: filled (dark) for action tasks, outlined+chevron for "Take action" dropdowns

### 4. Bug fixes

- Removed duplicate completed sections list from FinalSummary (was showing both in accordion AND below stepper)
- Added [Edit] links to accordion completed section items
- Fixed "Your estimate" badge → "Self disclosed" per spec
- Fixed progress stepper: bar now matches "N of M" counter (current segment was at 0.5 opacity)
- Fixed header: hamburger always present (was being replaced by back arrow on financial summary)
- Task list copy aligned exactly to wireframe

## What went well

- Screenshot-driven design discussion was very productive — gave concrete visual targets
- The Airbnb/Emma/Habito synthesis created a clear, implementable direction
- User caught several wire accuracy issues that improved fidelity
- Build passed on every commit — no regressions

## What could improve

- Should have read the wireframe more carefully before building screen 2j — several copy and button style differences needed fixing
- The "always show CETV" vs "conditional on pension" went back and forth — should have checked the demo flow behaviour first

## Key decisions

1. **Red accent colour:** `#E5484D` (Radix Red 9) — confident but not aggressive
2. **Keep explicit submit:** Auto-advance rejected — progressive disclosure needs a commit step
3. **Shadow over borders:** All cards separated by shadow, not border lines
4. **12px radius:** Up from 6px — softer, more modern
5. **Hamburger persists:** Never replaced by back arrow; back navigation is in-page content
6. **Badge labels:** "Bank confirmed" (green) / "Self disclosed" (orange)
7. **Button hierarchy:** Red for primary CTA, dark for action buttons (Start outline, Upload, Invite), outlined for Take action dropdowns

## Tink status

Tink iframe code is unchanged functionally. It works when `TINK_CLIENT_ID` and `TINK_CLIENT_SECRET` are set (on Vercel production). Branch needs merging to main for the production URL callback to work. Demo data fallback works when credentials aren't set.
