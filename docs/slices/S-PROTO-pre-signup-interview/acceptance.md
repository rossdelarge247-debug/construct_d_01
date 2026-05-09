# S-PROTO-pre-signup-interview · 8-screen interview clickable prototype

**Category:** prototype

## Status
Authoring. First prototype slice under spec 76 §3 category=prototype calibration. Steps 1-3 of the 4-step prototype loop are complete (dialogue · canvas prompts · canvas absorption); step 4 (construction) is in progress.

## Pre-flight
- Slice category = prototype per path-default (`src/app/dev/proto/pre-signup-interview/**`); no override needed but `**Category:** prototype` declared explicitly above for reader clarity.
- Spec 76 §3 gate calibration applies: DoD-14 short-form (items 1, 8, 12, 14 only) · TDD-guard skips · test-pain audit threshold raises to >5 mocks · preview-deploy 6-dim runs in full · `reviewer-prototype-readiness` substitutes `reviewer-correctness` post-PR.
- Adversarial budget: this slice's `acceptance.md` <300L → single-sub-spawn (spec 72b §1); no partition needed.
- Path-C plan-time-review: harness lacks plan-mode toggle on Opus 4.7; spawn `plan-architect` + `exit-plan-review` manually via `Agent` tool against `/tmp` framed plan before any `src/` touches.

## Authorisation
- Spec 65 §The 8 screens — O1 stage router · O2 living arrangement · O3 children · O4 ex-partner relationship · O5 employment · O6 partner finance + priorities + worries · O7 your plan · O8 next steps.
- Spec 65 §O7 — Your plan (AI generated output) — 7 sub-elements (situation summary · journey timeline · what needs to happen · conventional path · how Decouple helps · personalised notes · links + CTA).
- Spec 76 §3 prototype-mode gate calibration.
- S-PROTO-hub §AC-4 stub-route precedent (status > `not-started` rows render hybrid content).
- User-instructed bg treatment: expressive bg primary across the prototype, with a dev toggle to standalone bg.

## Scope

### In scope
- 8 screen route at `src/app/dev/proto/pre-signup-interview/page.tsx` rendering O1 → O8 with forward/back navigation, single-question discipline (CLAUDE.md §Product rules "One thing at a time").
- Dev-mode in-memory store for cross-screen state (no persistence beyond page-refresh; aligns with spec 71 dev-mode pattern).
- Expressive background as default; standalone background toggle visible in `/dev/proto/*` only, persisting via URL query param `?bg=standalone`.
- Mobile-first 375×667 layouts + desktop adaptation.
- O7 AI-plan rendering from a template populated by user's O1-O6 answers (no real LLM call — prototype templates the personalisation).
- Reuse of `src/styles/tokens.ts` (S-F1) tokens for ink/text/border/surface/phase colours; prototype-local CSS variables for expressive-only additions.

### Out of scope
- Real auth / real backend / real LLM call (prototype is static-data only (spec 76 §3) prototype category).
- Promotion of expressive-only colours to global F1 tokens (prototype validates first; promotion is a separate slice if expressive becomes the production direction).
- Form-validation rigour (prototype accepts any input; production-grade validation is post-prototype).
- Test coverage on prototype components (spec 76 §3: TDD-guard skips, coverage excludes for `/dev/proto/<literal>/**`).

## Design tokens absorbed from canvas

### Reused from S-F1 (`src/styles/tokens.ts`)
| Canvas hex | F1 token | Use |
|---|---|---|
| `#1A1A1A` | `color.ink` | Body text, headings |
| `#57534E` | `color.text.sub` | Secondary text |
| `#78716C` | `color.text.muted` | Muted captions |
| `#E5E3DC` | `color.border` | Card outlines, dividers |
| `#FFFFFF` | `color.surface.panel` | Card / input backgrounds |
| `#F5F5F4` | `color.surface.page` | Standalone-bg fallback gradient stop |
| `#4338CA` | `color.phase.build.accent` | Selected-state accent on radio-cards |
| `#FCE7F3` | `color.phase.reconcile.soft` | Expressive gradient mid-stop |

### Prototype-local extensions (defined in `src/app/dev/proto/pre-signup-interview/page.tsx` scope only)
| Hex | Local var | Use |
|---|---|---|
| `#7C3AED` | `--proto-accent-purple` | Primary CTA fill, link hover |
| `#F3EEFE` | `--proto-bg-soft-purple` | Expressive gradient top-stop |
| `#F5F1F8` | `--proto-bg-soft-lavender` | Card hover states |
| `#BE185D` | `--proto-accent-pink` | O7 conventional-path data emphasis |
| `#faf9f5` | `--proto-bg-cream` | Standalone toggle bg |

### Background treatments
- **Expressive (default):** `background: linear-gradient(180deg, #F3EEFE 0%, #FCE7F3 55%, #F5F5F4 100%);` — extracted from O7 thumbnail SVG gradient.
- **Standalone (toggle):** `background: #faf9f5;` — Decouple's cream brand bg.

## Acceptance criteria

### AC-1 · Eight-screen flow renders end-to-end
`/dev/proto/pre-signup-interview` mounts an 8-screen flow corresponding to spec 65 §The 8 screens: O1 → O8. Each screen renders one decision (CLAUDE.md §Product rules "One thing at a time"). Forward navigation enabled by valid input; back navigation always available. State persists across screens within the session (page refresh resets — by design for prototype).

### AC-2 · Expressive bg primary; standalone toggle present
Expressive gradient renders as default page background. Dev-only toggle (top-right corner of viewport, visible in `/dev/proto/*` routes only) flips to standalone cream bg. Toggle state persists via URL query param `?bg=standalone` (no param = expressive). Round-trip preserves bg state when navigating between screens. Both treatments preserve WCAG AA text contrast on body copy.

### AC-3 · Design tokens reused from S-F1; local extensions scoped
All ink/text/border/surface colours consume `tokens.color.*` from `src/styles/tokens.ts`. Prototype-local CSS variables for expressive-only colours scoped to the page component. No global token additions in this slice. Mapping table in this slice's `verification.md` §Design tokens matches the table above.

### AC-4 · Visual fidelity to canvas exports
- **O1 stage router** mobile-first layout matches `o1-stage-router-expressive.html`: header with progress affordance · primary question · 3 stage options as radio-cards · primary CTA in thumb-zone.
- **O7 your plan** renders the 7 sub-elements (spec 65) in order, mobile-first, matching the visual vibe of `o7-your-plan-expressive.html`. Three loveability decisions per `o7-canvas-prompt.md` §Three loveability decisions committed (canvas's chosen treatment carries forward; if canvas is ambiguous, fallback choice recorded in `verification.md`).
- **O2-O6, O8** inherit O1's form-screen pattern with screen-specific content.

### AC-5 · Microcopy compliance with product positioning
- No screen frames Decouple as "financial disclosure tool" or "Form E alternative".
- O5 (employment) does not fish for income detail; O6 (partner finance) is gentle and non-presumptive ("how much do you know about ..." not "what is their income").
- O7 contains the unique-claim framing ("the only place where both parties build one evidence-backed shared picture") exactly once.
- All copy uses agency-preserving language ("you can", "many people choose") not prescriptive ("you must", "you need to").
- O7 conventional-path framing commits to one of C1/C2/C3 per `o7-canvas-prompt.md`; choice recorded in `verification.md`.

### AC-6 · Mobile-first 375×667 + desktop adaptation
Primary viewport 375×667 (iPhone SE) — single column, thumb-zone CTAs, no horizontal scroll. Desktop centers content with comfortable max-width inheriting `tokens.layout.maxNarrow` (760px). Acceptable rendering at 768 (tablet) and 1280 (desktop) viewports.

### AC-7 · Preview-deploy 6-dim verification (spec 72a)
`verification.md` §Preview-deploy verification populated for all six dimensions (spec 72a §Six dimensions):
- Golden path (O1 → O8 happy path)
- Edge cases (back-nav from O7 · refresh on O5 · toggle expressive↔standalone mid-flow)
- `prefers-reduced-motion` (no flashy transitions on a sensitive moment)
- Keyboard-only navigation (Tab to options, Enter to select, Tab to CTA, Enter to advance)
- Mobile viewport (375×667 thumb-zone reachability)
- Screen reader (primary CTA reachable, headings announce in order)

## Architectural seams

1. **State propagation across screens.** In-memory store (`useState` lifted to page-component or a tiny `Zustand`-like dev-store at `src/lib/dev/proto-store.ts`). No persistence beyond page-refresh. Each screen reads/writes its slice. O7 reads all slices to template the plan output.

2. **Toggle propagation.** URL query-param `?bg=standalone` parsed in the page component; passed to a `<BackgroundShell>` wrapper that applies the chosen bg class. Toggle button updates the URL via `router.replace` to preserve back-nav.

3. **O7 plan templating.** A pure function `buildPlanFromAnswers(answers): PlanContent` lives at `src/app/dev/proto/pre-signup-interview/lib/build-plan.ts` (or co-located). Pure logic, no side effects (CLAUDE.md §Coding conduct §Effects behind interfaces). Inputs: typed `Answers` record from the store. Output: typed `PlanContent` with the 7 sub-elements populated.

4. **Screen modularity.** Each screen is a small component under `src/app/dev/proto/pre-signup-interview/screens/o{N}.tsx` exporting a default render-fn. Page component switches by current step.

## Spec citations
- Spec 65 §The 8 screens — screen inventory + content scope
- Spec 65 §O7 — Your plan (AI generated output) — 7 sub-elements
- Spec 76 §3 — prototype-category gate calibration
- Spec 71 §4 — dev-mode pattern (lib/dev/* path; no real auth/store)
- Spec 72a — 6-dimension preview-deploy rubric
- CLAUDE.md §Product positioning — no "financial disclosure tool" framing
- CLAUDE.md §Product rules — "warm hand on a cold day", "one thing at a time", agency-preserving language
- CLAUDE.md §Coding conduct §Effects behind interfaces — `buildPlanFromAnswers` pure logic seam

## Status footer
- 2026-05-08: slice authored; canvas prompts (O7) shipped at `o7-canvas-prompt.md`; canvases absorbed (3 files, design tokens digested above); construction begins next turn after Path-C plan-time review.
