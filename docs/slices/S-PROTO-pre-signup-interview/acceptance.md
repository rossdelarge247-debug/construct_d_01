# S-PROTO-pre-signup-interview · 8-screen interview clickable prototype

**Category:** prototype

## Status
Re-scoped 10 May 2026 for canvas-canon reconstruction. Steps 1-3 of the 4-step prototype loop are complete (dialogue · canvas prompts · canvas absorption); step 4 (construction) is in progress with reconstruction scope per canvas-overview handoff brief.

## Pre-flight
- Slice category = prototype per path-default (`src/app/dev/proto/pre-signup-interview/**`); no override needed but `**Category:** prototype` declared explicitly above for reader clarity.
- Spec 76 §3 gate calibration applies: DoD-14 short-form (items 1, 8, 12, 14 only) · TDD-guard skips · test-pain audit threshold raises to >5 mocks · preview-deploy 6-dim runs in full · `reviewer-prototype-readiness` substitutes `reviewer-correctness` post-PR.
- Adversarial budget: this slice's `acceptance.md` <300L → single-sub-spawn (spec 72b §1); no partition needed.
- Path-C plan-time-review: harness lacks plan-mode toggle on Opus 4.7; spawn `plan-architect` + `exit-plan-review` manually via `Agent` tool against `/tmp` framed plan before any `src/` touches.

## Authorisation
- Spec 65 §The 8 screens — O1 stage router · O2 your situation · O3 your ex & safety · O4 employment complexity · O5 partner finances · O6 what matters · O7 your plan · O8 what's next.
- Spec 65 §O7 — Your plan (AI generated output) — 7 sub-elements (deferred this slice).
- Spec 65 §Principle 6 — different framing per O1 stage (decided/thinking/in_process); resolver scaffold ships this slice, copy differentiation deferred.
- Spec 42 §Three positioning pillars — Shared / Evidenced / End-to-end woven into O7 (deferred this slice).
- Spec 76 §3 prototype-mode gate calibration.
- S-PROTO-hub §AC-4 stub-route precedent (status > `not-started` rows render hybrid content).
- Canvas canon: `docs/design-source/pre-signup-interview/pre-signup-canvas-overview.html` §Handoff L536-547 — locked A·B·C combos per screen, mobile-first source, style-canon-from-O1, state-shape nested, `_safetyFlag` silent in O3.
- Canvas authorial instructions: O7 lives in own workbook (deferred); O8 is placeholder ("do not lift copy or layout from the existing draft into the build pipeline" — deferred).
- User-instructed bg treatment: 3 expressive gradient options + 1 standalone option, all selectable via dev BgToggle.

## Scope

### In scope
- 8 screen route at `src/app/dev/proto/pre-signup-interview/page.tsx` rendering O1 → O8 with forward/back navigation, single-question-per-screen discipline (CLAUDE.md §Product rules "One thing at a time").
- O2-O6 full reconstruction from canvas-canon A·B·C locked combos (NOT visual polish over existing stubs):
  - **O2** (A1·B1·C1): four sub-Qs stacked (relationship · living · children · home), "Yes" inline-reveal for children count, gated CTA with "x of 4 answered" caption.
  - **O3** (A1·B1·C2): equal-weight safety option in same vertical list/tile/state, privacy preamble ("some people read these screens with a partner nearby"), privacy answer optional, silent `_safetyFlag = true if relationship === safety OR devicePrivate === notsure`.
  - **O4** (A1·B2·C3): helper caption below each option (not tooltip/popover), "How do you make money?" framing (not "Employment status"), "No, just the basics" emphasised as larger row.
  - **O5** (A3·B1·C2): one tall hairline-divided card containing all 4 options, "How much do you know about ..." neutral framing, CTA enabled after one selection (no progress dots).
  - **O6** (A1·B3·C2): two stacked multi-select cards (priorities + worries, each on own card, same shape as O2), capped at 3 each, "Pick what matters most. There's no wrong answer." soft hint, count-adaptive CTA copy.
- O1 audit + polish if drift detected against canon style atoms (canvas L545: "Style canon is inherited from O1").
- Dev-mode in-memory store with nested state shape per canvas convention `preSignup.{situation, exAndSafety, employment, partnerFinances, whatMatters, plan}`; `toFlat()` selector projects to spec 65 flat-field bridge format.
- F1 token extension: add canvas-canon values (`color.accent.violet`, `color.accent.magenta`, `color.surface.gradient.{expressive,canvasChrome,o7Surface,standalone}`, `font.serif`, `font.mono`) to `src/styles/tokens.ts` + parity-mirror in `src/app/globals.css`; CSS↔TS parity test must pass.
- Stage-tone resolver scaffold per screen at `src/app/dev/proto/pre-signup-interview/lib/copy/o{N}.ts` exporting `getCopy(stage)` — today returns identical strings across stages; future principle-6 expansion edits one function per screen, no screen rewrites.
- 4-state BgToggle (cycle or dropdown): `expressive` (default) · `canvasChrome` · `o7Surface` · `standalone`, persisting via URL query param `?bg={value}`.
- Mobile-first 375×667 layouts; desktop = same frame at 1.6× inside browser chrome (canvas authorial decision: "no separate desktop layout").
- Reuse existing `src/styles/tokens.ts` (S-F1) tokens + extend per F1 extension above.

### Out of scope
- **O7 (Your plan) reconstruction** — canvas explicitly silos to its own workbook ("renders on a dedicated workbook to keep this canvas light"); deferred to follow-up slice. **Asset preservation:** `docs/design-source/pre-signup-interview/jsx/o7-{page,components,plan-page,plan-components}.jsx` (4 files, ~117KB total) + `o7-your-plan-expressive{,-source}.html` (2 files, 456L total) preserved on disk via commit `c56d377`.
- **O8 (What's next) reconstruction** — canvas instructs "treat this slot as TBD — do not lift copy or layout from the existing draft into the build pipeline" until canon authors lock the framing; deferred to follow-up slice. **Asset preservation:** `o8-frames.jsx` + `o8-whats-next-expressive.html` (552L) preserved on disk.
- Stage-tone copy differentiation per spec 65 §Principle 6 — resolver scaffold ships this slice, per-stage copy differentiation deferred until canon authors specify per-stage tone.
- Mark's mirror journey (spec 67 §Gap 7 IS1-IS6) — post-signup spec, separate entry point, not in this slice.
- Real auth / real backend / real LLM call (prototype is static-data only per spec 76 §3).
- Form-validation rigour (prototype accepts any input; production-grade validation is post-prototype).
- Test coverage on prototype components (spec 76 §3: TDD-guard skips, coverage excludes for `/dev/proto/<literal>/**`).

## Design tokens

### Reused from S-F1 (`src/styles/tokens.ts`, pre-existing)
| Canvas hex | F1 token | Use |
|---|---|---|
| `#1A1A1A` | `color.ink` | Body text, headings |
| `#57534E` | `color.text.sub` | Secondary text |
| `#78716C` | `color.text.muted` | Muted captions |
| `#E5E3DC` | `color.border` | Card outlines, dividers |
| `#FFFFFF` | `color.surface.panel` | Card / input backgrounds |
| `#F5F5F4` | `color.surface.page` | Plate background, standalone-bg fallback stop |

### F1 extensions added in this slice
Rationale for promotion (was scoped out original authoring): the canvas-overview shipped 9 May 2026 is now authoritative locked design canon (CLAUDE.md §Visual direction: *"Canonical source: the Claude AI Design tool outputs"*). The validate-first uncertainty that gated the original out-of-scope ruling has resolved — these are no longer prototype-exploration values, they're the design system.

| Canvas hex / value | New F1 token | Use |
|---|---|---|
| `#7C3AED` | `color.accent.violet` | Eyebrow labels, primary CTA fill, link emphasis |
| `#BE185D` | `color.accent.magenta` | Italic-display emphasis (e.g. O7 "opens in its own canvas" treatment) |
| Source Serif Pro | `font.serif` | H1 headings, display text, italic accents |
| JetBrains Mono | `font.mono` | Eyebrow labels (label-xs uppercase), monospace chips |

### F1 surface gradients added in this slice (4 BgToggle options)
| Gradient option | New F1 token | Source | Query param |
|---|---|---|---|
| Expressive (default) | `color.surface.gradient.expressive` | Slice's existing extracted from O7 thumbnail SVG (`#F3EEFE → #FCE7F3 → #F5F5F4`) | `?bg=expressive` (or omit) |
| Canvas chrome | `color.surface.gradient.canvasChrome` | canvas-overview L156 (`#EFE7F8 → #F5F1F8 → #EFEEE9`) | `?bg=canvasChrome` |
| O7 surface | `color.surface.gradient.o7Surface` | canvas-overview L205 (`#F3EEFE → #FAF6F0 → #F5F5F4`) | `?bg=o7Surface` |
| Standalone | `color.surface.gradient.standalone` | Slice's existing cream brand bg (`#faf9f5`) | `?bg=standalone` |

(Three expressive variants + one standalone; designer can flip in `/dev/proto/*` to compare.)

## Acceptance criteria

### AC-1 · Eight-screen flow renders end-to-end
`/dev/proto/pre-signup-interview` mounts an 8-screen flow corresponding to spec 65 §The 8 screens: O1 → O8. Each screen renders its specified canvas-canon decision (one-thing-at-a-time per CLAUDE.md §Product rules). Forward navigation enabled by valid input; back navigation always available. State persists across screens within the session (page refresh resets — by design for prototype). O7 + O8 render deferred-placeholder screens with explicit "deferred — canon authoring in progress" banners; the flow does NOT crash on these screens.

### AC-2 · 4-state background toggle (3 expressive + 1 standalone)
Expressive gradient renders as default page background. Dev-only toggle visible in `/dev/proto/*` routes only cycles through 4 options (`expressive` · `canvasChrome` · `o7Surface` · `standalone`). Toggle state persists via URL query param `?bg={value}` (no param = expressive). Round-trip preserves bg state when navigating between screens. All four options preserve WCAG AA text contrast on body copy.

### AC-3 · F1 tokens extended with canvas-canon values; CSS↔TS parity preserved
F1 tokens (`src/styles/tokens.ts` + `src/app/globals.css`) extended with new canvas-canon values: `color.accent.{violet,magenta}`, `color.surface.gradient.{expressive,canvasChrome,o7Surface,standalone}`, `font.{serif,mono}`. CSS↔TS parity test passes. All ink/text/border/surface/accent colours consume `tokens.color.*`; gradients consume `tokens.color.surface.gradient.*`; fonts consume `tokens.font.*`. Mapping table in this slice's `verification.md` §Design tokens matches the table above. No hex literals scattered across components — all reference token paths.

### AC-4 · Visual fidelity to canvas exports
- **O1 stage router** mobile-first layout audited against `o1-stage-router-expressive.html`; polish applied if drift detected against canon style atoms (canvas L545: "Style canon is inherited from O1").
- **O2** matches canvas A1·B1·C1: 4 stacked cards · "Yes" inline-reveals count chips · gated CTA with "x of 4 answered".
- **O3** matches canvas A1·B1·C2: equal-weight safety option · privacy preamble · privacy optional · `_safetyFlag` set silently (no modal, no banner).
- **O4** matches canvas A1·B2·C3: helper caption below each option · "How do you make money?" framing · "No, just the basics" emphasised as larger row.
- **O5** matches canvas A3·B1·C2: one tall hairline-divided card · "How much do you know about ..." neutral framing · CTA enabled after one selection.
- **O6** matches canvas A1·B3·C2: two stacked cards (priorities + worries each on own card) · "Pick what matters most. There's no wrong answer." soft hint · CTA copy adapts to count answered.
- **O7** renders deferred placeholder screen with explicit deferred banner pointing to `docs/design-source/pre-signup-interview/jsx/o7-*.jsx` for canon. Reconstruction in follow-up slice.
- **O8** renders deferred placeholder screen with explicit deferred banner per canvas instruction "do not lift". Reconstruction when canon authors lock framing.

### AC-5 · Microcopy compliance + stage-tone resolver scaffold
- No screen frames Decouple as "financial disclosure tool" or "Form E alternative".
- All copy uses agency-preserving language ("you can", "many people choose") not prescriptive ("you must", "you need to").
- O3 safety + O5 partner-finance framing matches canvas-canon (neutral, non-presumptive — `_safetyFlag` silent, no judgement language on "may be hiding things").
- Each O1-O6 screen consumes copy via `lib/copy/o{N}.ts` exporting `getCopy(stage: Stage)`. Today: function returns identical strings across all stages. Future principle-6 work edits the function body — no screen rewrites required to differentiate.
- Stage-tone resolver scaffold present in code even though copy differentiation is deferred. Resolver type + presence verified in `verification.md` §Stage-tone scaffold.

### AC-6 · Mobile-first 375×667 + scaled-up desktop
Primary viewport 375×667 (iPhone SE) — single column, thumb-zone CTAs, no horizontal scroll. Desktop = mobile frame at 1.6× inside browser chrome wrapper (canvas authorial: *"no separate desktop layout yet; the mobile frame is the source"*). Acceptable rendering at 768 (tablet) and 1280 (desktop) viewports per scaled-up convention.

### AC-7 · Preview-deploy 6-dim verification (spec 72a)
`verification.md` §Preview-deploy verification populated for all six dimensions (spec 72a §Six dimensions):
- Golden path (O1 → O6 happy path; O7+O8 deferred placeholders render without crash)
- Edge cases (back-nav from O6 · refresh on O5 · cycle BgToggle through all 4 options mid-flow · O7+O8 deferred-banner state)
- `prefers-reduced-motion` (no flashy transitions on a sensitive moment; respect user setting)
- Keyboard-only navigation (Tab to options, Enter to select, Tab to CTA, Enter to advance)
- Mobile viewport (375×667 thumb-zone reachability)
- Screen reader (primary CTA reachable, headings announce in order, deferred-banner announced as such)

## Architectural seams

1. **State propagation across screens — nested by canvas convention.** In-memory store at `src/app/dev/proto/pre-signup-interview/lib/proto-context.ts`. State shape: `preSignup.{situation, exAndSafety, employment, partnerFinances, whatMatters, plan}` (canvas-overview L546 convention). Each screen reads/writes its own slice. `toFlat()` selector projects to spec 65 flat-field shape (`relationship_status`, `living_together`, `has_children`, `children_count`, `property_status`, `relationship_quality`, `device_private`, `self_employment`, `partner_awareness`, `priorities[]`, `worries[]`, `stage`) for any post-signup bridge or PDF export. No persistence beyond page-refresh.

2. **Stage-tone resolver per screen.** Each O1-O6 screen consumes copy via a co-located `lib/copy/o{N}.ts` module exporting `getCopy(stage: Stage)`. Today the function returns identical strings across all `stage` values; future principle-6 work edits the function body to switch on stage. Pattern lets us ship one-tone today + extend later by editing one function per screen, no screen rewrites required (CLAUDE.md §Coding conduct §Effects behind interfaces — copy is an effect, hidden behind interface).

3. **BgToggle propagation — 4-state.** URL query-param `?bg={value}` parsed in the page component; passed to a `<BackgroundShell>` wrapper that applies the chosen gradient via `tokens.color.surface.gradient.*`. BgToggle button cycles or dropdowns through 4 options. Updates the URL via `router.replace` to preserve back-nav.

4. **Screen modularity.** Each screen is a small component under `src/app/dev/proto/pre-signup-interview/screens/O{N}.tsx` exporting a default render-fn. Page component switches by current step. O7 + O8 render deferred-placeholder shells.

5. **(Deferred) O7 plan templating.** A pure function `buildPlanFromAnswers(answers): PlanContent` is **not** built in this slice. Will live at `src/app/dev/proto/pre-signup-interview/lib/build-plan.ts` when O7 reconstructs. Pure logic, no side effects (CLAUDE.md §Coding conduct §Effects behind interfaces). Inputs: typed `Answers` record from the store. Output: typed `PlanContent` with the 7 sub-elements populated.

## Spec citations
- Spec 65 §The 8 screens — screen inventory + content scope
- Spec 65 §O7 — Your plan (AI generated output) — 7 sub-elements (deferred this slice)
- Spec 65 §Principle 6 — stage-tone differentiation (resolver scaffold this slice, differentiation deferred)
- Spec 42 §Three positioning pillars — shared / evidenced / end-to-end (woven into O7, deferred)
- Spec 76 §3 — prototype-category gate calibration
- Spec 71 §4 — dev-mode pattern (lib/dev/* path; no real auth/store)
- Spec 72a — 6-dimension preview-deploy rubric
- Canvas: `docs/design-source/pre-signup-interview/pre-signup-canvas-overview.html` §Handoff L536-547 — claude-code authorial brief
- Canvas archive: per-screen locked A·B·C combos (canvas-overview L274-360)
- CLAUDE.md §Product positioning — no "financial disclosure tool" framing
- CLAUDE.md §Product rules — "warm hand on a cold day", "one thing at a time", agency-preserving language
- CLAUDE.md §Visual direction — "Canonical source: the Claude AI Design tool outputs"
- CLAUDE.md §Coding conduct §Effects behind interfaces — `buildPlanFromAnswers` pure logic seam (deferred); stage-tone resolver applied here

## Status footer
- 2026-05-08: slice authored; canvas prompts (O7) shipped at `o7-canvas-prompt.md`; canvases absorbed (3 files, design tokens digested); construction begins next turn after Path-C plan-time review.
- 2026-05-10: AC re-scoped for canvas-canon reconstruction; F1 token extension authorised (validate-first uncertainty resolved); O7 + O8 deferred with asset preservation; nested state shape adopted per canvas convention; stage-tone resolver scaffold added; 4-state BgToggle replaces binary expressive↔standalone.
