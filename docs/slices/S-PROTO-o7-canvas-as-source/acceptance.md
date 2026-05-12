# S-PROTO-o7-canvas-as-source

**Category:** prototype

Migrate pre-signup interview step 7 ("Your plan") from legacy `PlanSection`-stacked stub (`src/app/dev/proto/pre-signup-interview/screens/O7.tsx`, 70L) to canvas-as-source impl per the canonical canvas at `docs/design-source/pre-signup-interview/jsx/o7-plan-page.jsx`.

The canvas resolves O7 as a two-state screen: **MobileGenerating** (the "warm hand on a cold day" generating moment with BreathingHalo + progressive-disclosure micro-steps + violet→pink gradient) auto-transitions to **MobileReady** (full plan render: situation echoes + journey + tailored steps + conventional path + decouple helps + personalised notes + sticky What's next CTA).

Canvas-as-source default per CLAUDE.md §"Canvas-as-source (prototype default)": no `Linked canvas:` field; canvas-fidelity persona stays dormant; per-AC evidence cites canvas inline without verbatim quoting requirement. Companion canvas o7-page.jsx (973L, EmailModal + PlanActions variant) is NOT the canonical target — that's a post-signup-territory variant and out of scope.

## Acceptance criteria

**AC-1: Page chassis + state machine.**
- `O7.tsx` replaces legacy stub entirely; `lib/build-plan.ts` `plan` object remains the data source (re-targeted through canvas treatment, not from scratch).
- `<main>` wrapper matches sibling-screen pattern: `width: '100%'`, `maxWidth: 480`, `margin: '0 auto'`, `paddingTop: 24` for non-generating state; `minHeight: '100vh'`; flex column; NO background (inherits page-shell expressive gradient).
- Internal `useState<'generating' | 'ready'>('generating')` drives state. Auto-transitions to `'ready'` after **3000ms** via `setTimeout` on mount. No persistence; refresh starts at `'generating'` again. Aligns with prototype-only UX simulation of AI generation.
- BrandBar renders at top across both states (consistent with O1-O6 cross-screen chassis).
- Evidence: o7-plan-page.jsx L498-514 (MobileReady) + L520-581 (MobileGenerating) + sibling wrapper pattern from O5.tsx + O6.tsx; CLAUDE.md §"Canvas-as-source" Step 4 (Next.js wrapping).

**AC-2: MobileGenerating state.**
- Renders when state === 'generating':
  - **TopBar variant**: step 7 / total 8 indicator + "just a moment" right-aligned remaining text (canvas L528: `<MobileTopBar step={6} total={8} remaining="just a moment"/>` — step retargeted to 7 to match prototype O7 position).
  - **BreathingHalo** centred (size 180): SVG circle with CSS-driven pulse animation. Implementation per canvas o7-plan-components.jsx L238-268; sized 180×180; violet→pink radial; pulse 2-3s ease-in-out infinite; honours `prefers-reduced-motion: reduce` (static at base scale).
  - **Eyebrow** `"Building your plan"` in VIOLET; **H2** `"Take a"` `<span italic 400 color=MAGENTA>breath</span>` `"."` (serif 28px lh 1.1 letterSpacing -0.02em fw 600 per canvas L536-538).
  - **Helper copy** italic serif 14px: `"We're shaping this around the six things you've told us. There's no clock here — we'll be ready when you are."` (canvas L539-541, verbatim).
  - **5-step progressive disclosure list** with mixed done/pending state (3 done · 1 "working…" · 1 pending per canvas L546-570). Visual: 14×14 round bullets (violet fill + checkmark when done; 1.5px MUTE border when not). Working indicator: VIOLET mono "working…" right-aligned. Static list at v1; no dynamic progression timer beyond the 3000ms reveal.
  - **Background gradient** `linear-gradient(180deg, #F3EEFE 0%, #FCE7F3 360px, #FBFAF6 720px)` at the state-level absolute positioned div (canvas L525).
  - **Footer attribution** italic serif 12.5px MUTE: `"A warm hand on a cold day."` (canvas L575) — literal CLAUDE.md product positioning quote.
- Evidence: o7-plan-page.jsx L520-581 (entire MobileGenerating body) + o7-plan-components.jsx L238-268 (BreathingHalo) + L127-145 (MobileTopBar).

**AC-3: MobileReady state — content sections render.**
- Renders when state === 'ready':
  - **TopBar** step 7 / total 8 + `"~30s remaining"` right-text per canvas L127 default (the post-generating ready state).
  - **MobileHero** renders eyebrow + serif H2 + helper sub-stem per canvas o7-plan-components.jsx L148-189.
  - **6 content sections render in order** sourced from `plan` data object (lib/build-plan.ts):
    1. `SituationSummary` — explicit echoes of user answers per canvas o7-plan-page.jsx L26-92.
    2. `DivorceJourney` — timeline of stages with current marker per L106-167.
    3. `WhatNeedsToHappen` — tailored next-steps list per L206-243.
    4. `ConventionalPath` — solicitor-led comparison frame per L249-307.
    5. `DecoupleHelps` — pillar-based decouple value frame per L318-379.
    6. `PersonalisedNotes` — personalised note cards per L402-435.
- Each section component lives inside `O7.tsx` (inlined canvas helpers per CLAUDE.md §"Canvas-as-source" Step 5) OR extracted to `screens/o7/` subdirectory IF section exceeds ~80L (judgement call at impl-time per "Small, single-purpose functions").
- Section copy is data-driven where the canvas's STATE/ANSWERS constants represent the same data shape as `plan` (lib/build-plan.ts); literal canvas copy used elsewhere.
- Evidence: o7-plan-page.jsx L500-510 (MobileReady composition) + per-section L:line refs above.

**AC-4: PlanFooter sticky dual-CTA.**
- Renders as the last child of MobileReady (canvas L510: `<PlanFooter sticky/>`):
  - Upper non-sticky region: serif H2 `"Take this with you"` (magenta-italic "with you" span); italic-serif sub-helper; two pill buttons stacked: outline `"Download your plan as PDF"` (Download icon) + transparent underline `"Email me the link instead"` (Mail icon).
  - Lower "Find out more about Decouple" link + "pricing · how it works" affordance.
  - **Sticky bottom CTA chassis** (`position: sticky; bottom: 0; rgba(255,255,255,0.92) + blur(10px) + 1px LINE top-border`) containing: left underlined `"Back"` ArrowLeft link + right dark pill `"What's next"` ArrowRight CTA (flex: 1 justify center).
- Download / Email / Find-out-more are non-functional links at v1 (prototype default — copy + visual treatment ship; routing deferred).
- "What's next" CTA navigates to step 8 (O8) via existing proto-router state pattern (no new wiring needed beyond `useProto().setStep(8)` or equivalent).
- Evidence: o7-plan-page.jsx L439-493 (entire PlanFooter body).

**AC-5: Motion, a11y, reduced-motion.**
- **Section entry stagger** on MobileReady mount: each top-level section reveals via `--stagger-index` opacity-up + 12px translate-up, 240ms ease-out, 80ms delay between siblings. Pattern matches the O5.module.css / O6.module.css template (opacity override scoped to `.entry` only, NOT `.chip` — applying it to chip class breaks chip transitions under reduced-motion).
- **State-transition fade**: when state transitions `'generating' → 'ready'`, MobileGenerating fades out (200ms opacity 1→0) before MobileReady fades in (300ms opacity 0→1). Suppressed under `prefers-reduced-motion: reduce` (instant swap).
- **BreathingHalo pulse**: 2.4s ease-in-out infinite scale 1 → 1.08 → 1. Suppressed under reduced-motion (static at base).
- **Semantic structure**: each MobileReady section uses `<section>` element with section-heading via canvas `MobileSectionHeader` eyebrow + h2 pair; one `<h1>` (or `<h1 className="sr-only">`) for screen title. TopBar Back link is `<a>` with visible label + arrow. PlanFooter CTAs are `<button>` (visual) or `<a>` (navigational). Disclosure-list `<ul>` with `<li>` per micro-step.
- **Keyboard**: all interactive elements (Back, Download, Email, Find-out-more, What's next) reachable via Tab in DOM order; focus-visible ring inherits page-level treatment.
- Evidence: O5.module.css / O6.module.css templates; canvas o7-plan-page.jsx + components.jsx (semantic structure); CLAUDE.md §"Visual direction" §"Canvas-as-source" Step 5.

## Out of scope (deferred)

- **DesktopAdaptation** (canvas o7-plan-page.jsx L586-690). Two-column compressed desktop variant. Defers to spec 70 §"P3 desktop-enhanced graceful enhancement" — needs all 8 mobile screens shipped first (constraint #41).
- **Canvas-local token promotions** for VIOLET_SOFT (`#F3EEFE`), MAGENTA_SOFT (`#FCE7F3`), SOFTMUTE (`#9A968E`), PAPER_WARM (`#FBFAF6`), SOFT (`#FAFAF7`), and an INDIGO-dark shade (`#4338CA` — distinct from the existing `tokens.color.accent.indigo` at `#4F46E5`). Used inline; promotion deferred to a follow-up token-sweep slice when 2+ screens reference each.
- **Dynamic generating-step progression**. Canvas shows a static snapshot (3 done · 1 working · 1 pending). Animating the bullets through `pending → working → done` over the 3000ms is out of scope — visually rich enough as static; defer if user feedback requests it.
- **Functional Download / Email actions** (PlanFooter buttons). Prototype-only; routing + PDF generation + email-send are post-MLP concerns.
- **O8** (next-screen migration). Out of scope for this slice; ships as its own unit.

## Pre-flight

Adversarial-review budget (CLAUDE.md §"Engineering conventions" §"Adversarial review gate"): this acceptance.md ~140L; single sub-spawn covers it. Auto-review will fan out 3 specialists (security · correctness · style per spec 72c §4 architecture-drop) at PR open.

Linked canvas: **omitted** per canvas-as-source default policy (CLAUDE.md §"Canvas-as-source" §"Slice convention"). Canvas-fidelity persona stays dormant.
