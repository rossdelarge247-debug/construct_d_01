# S-PROTO-o1-canvas-as-source · verification

Prototype-category slice. DoD-14 short-form (items 1, 8, 12, 14); spec 76 §3 short-form mapping.

## AC-1 — O1.tsx page IS the canvas

Evidence: `src/app/dev/proto/pre-signup-interview/screens/O1.tsx` after this slice imports neither `ScreenShell` nor `RadioCard` (verified by grep). Renders inline outer `<div className="flex flex-col min-h-screen w-full max-w-[480px] mx-auto pt-6">` matching the cross-screen consistency pattern from the prior header slice, with `<BrandBar>` first child, inline `<TopBar>` second (Home link + step rail + 44px spacer + 1px border-bottom divider), `<Hero>` block third (eyebrow + serif H2 with italic accent + sub-stem), `<RadioGroup>` fourth (fieldset + native radios styled as cards), `<StickyCTA>` last (trust band + Continue button with backdrop-blur).

Status: TBD pending impl.

## AC-2 — 5-step adapt applied

Evidence: per-step file refs.

- **Step 1 (tokenise):** mapping at O1.tsx top: `colors.ink = tokens.color.ink`, `colors.sub = tokens.color.text.sub`, `colors.mute = tokens.color.text.muted`, `colors.line = tokens.color.border`, `colors.paper = tokens.color.background?` (or local `'#F5F5F4'` if token absent). No raw hex literals in the page body beyond what tokens don't cover.
- **Step 2 (copy resolver):** `getCopy(stage)` consumed; canvas literals (eyebrow "To start your plan…", heading split "Tell us *where* you're at.", sub-stem "Your answer shapes the rest of the plan. There's no wrong choice.") + three options (id/value/label/sub) backed by copy file fields. Copy file `lib/copy/o1.ts` rewritten to expose this shape.
- **Step 3 (state wiring):** `useProto()` consumed; `answers.stage` checked for selection; `setAnswer('stage', value)` on radio change; `next()` on CTA click. CTA enable logic: `disabled={!answers.stage}`.
- **Step 4 (Next.js wrap):** `'use client'` directive present; `export function O1()` at `screens/O1.tsx`.
- **Step 5 (inline / shared helpers):** `Arrow` inlined screen-locally; `BrandBar` + `ProgressPill` imported as shared components; `MobileFrame` outer wrap + `StageShell` desktop demo NOT inlined.

Status: TBD pending impl.

## AC-3 — State rename cascade

Evidence: diffs across:

- `lib/types.ts` — `export type Stage = 'thinking' | 'decided' | 'in_process'`.
- `lib/build-plan.ts` — three branch comparisons updated. `'considering'` → `'thinking'`, `'starting'` → `'decided'`, `'in-process'` → `'in_process'`. The user-facing summary text in each branch remains identical (the rename is keys-only; the conceptual mapping is preserved).
- `screens/O2.tsx` — `'considering'` fallback default at the top of the component body updated to `'thinking'`.
- `lib/copy/o{1,2,3,4,5,6}.ts` — only `o1.ts` rewritten for the new canvas copy shape. The other five files take `_stage: Stage` as an unused parameter (underscore-prefix convention) and need no changes; their re-typecheck against the new union is the verification.

Verified by `npm run typecheck` clean post-change. No `'considering'` / `'starting'` / `'in-process'` string literals remain in `src/app/dev/proto/pre-signup-interview/` (verified by grep).

Status: TBD pending impl.

## AC-4 — Native radio semantics + trust band

Evidence: O1.tsx renders:

- `<fieldset aria-labelledby="o1-legend">` containing `<legend id="o1-legend" className="sr-only">` with the literal text "Tell us where you're at.".
- Three `<label>` cards each containing a `<input type="radio" name="o1-stage" value={opt.value} checked={...} onChange={...}>` with the input visually hidden via `sr-only` class and a custom-rendered 18×18 dot alongside.
- All three inputs share the `name="o1-stage"` attribute so browser-native keyboard model applies (↑/↓ moves, Space selects, Tab leaves the group).
- Trust band block: `<div className="flex items-center justify-center gap-2 text-[10.5px] mb-2.5 flex-wrap" style={{ color: tokens.color.text.muted }}>` with three spans ("Free" / middle-dot / "Private until saved").

Unit tests assert (a) `screen.getByRole('radiogroup')` present, (b) `screen.getAllByRole('radio')` returns 3 elements, (c) each has the expected accessible name, (d) selecting one updates the controlled state, (e) trust-band literal text "Private until saved" is present, (f) Continue CTA `disabled` reflects `answers.stage` truthiness.

Status: TBD pending impl.

## AC-6 — Cross-screen header + footer chassis unification

Evidence:

- **AC-6.a — Shared `Arrow`:** `src/app/dev/proto/pre-signup-interview/components/Arrow.tsx` (NEW). Canvas-faithful shaft + arrowhead per decoded canvas L766-771; 4-direction rotation via CSS `transform`. O1 + O2 import from shared and no longer define local `Arrow` (verified by `grep -n 'function Arrow\|const Arrow' src/app/dev/proto/pre-signup-interview/`). O1's CTA `<Arrow dir="right" size={13} strokeWidth={2} />` matches canvas L1093 `<Arrow dir="right" size={13} sw={2}/>`.
- **AC-6.b — `ProgressPill` canonical:** `O2.tsx` `TopBar` renders `<ProgressPill step={step} total={total} />` (no more local `StepRail`). `ProgressPill.tsx` visible-label span now uses `font: '500 9.5px/1.2 ${tokens.font.mono}'` + `textTransform: 'uppercase'` + `letterSpacing: '0.08em'`. DOM textContent + aria-label retain "Step X / Y" / "Step X of Y" — all 5 `progress-pill.test.tsx` assertions pass unchanged.
- **AC-6.c — `ScreenShell` footer chassis:** `ScreenShell.tsx` footer block uses `borderTop`, `background: rgba(245,245,244,0.85)`, `backdropFilter: blur(8px)`, trust band renders by default (`DEFAULT_TRUST_BAND = { left: 'Free', right: 'Private until saved' }` at file head); `ctaCaption?` retained as caller-override. Button is inline (no more `PrimaryCTA`) with O1's exact spec — `14/18px` padding, `borderRadius: 999`, `fontSize: 14`, `fontWeight: 600`, ink/`#FFFFFF` enabled / border/`#9A968E` disabled, right-arrow `strokeWidth=2`. `PrimaryCTA.tsx` deleted (verified by `git status` — file removed).
- **AC-6.d — `ScreenShell` outer:** `<main>` carries `paddingTop: 24` + `maxWidth: 480` only; horizontal padding moved to per-section (header `16px 20px 12px`, heading `20px 20px 16px`, children `0 20px`, footer `12px 20px 20px`). No `gap` on the main flex container.

Verified by `npx vitest run tests/unit/proto-pre-signup/` (44 passed) + `npm run typecheck` (0 errors) + `npm run lint` (0 errors).

Status: implemented; cross-screen preview-deploy verification pending eyeball (covered in §Preview-deploy verification below).

## AC-5 — Animations + reduced-motion

Evidence: `screens/O1.module.css` with named selector blocks for each animation class. Card selector receives `.card`, `.card-hover`, `.card-selected`, `.card-focus`; CTA receives `.cta-enabled` with keyframe animation; outer container + radio cards receive `.entry` with staggered `animation-delay`. `@media (prefers-reduced-motion: reduce)` block resets all `transition` and `animation` properties to negligible durations.

Visual verification at preview-deploy: load O1 with default motion preference, verify cards lift on hover + bounce on CTA enable + staggered entry on initial render. Then with `prefers-reduced-motion: reduce` (browser devtools emulation), verify instant outcomes with no motion.

Status: TBD pending preview-deploy.

## Preview-deploy verification

Spec 72a six-dimension rubric + the cross-screen consistency dimension introduced in the prior header slice.

| Dimension | Status | Evidence |
|---|---|---|
| Golden path | Pass (code-derived) | RTL tests cover the state-wiring chain at `tests/unit/proto-pre-signup/o1-canvas-as-source.test.tsx` (radiogroup present · 3 radios · controlled-state toggle on selection · Continue disabled until `answers.stage` truthy). Cross-screen golden walk (O1 stage select → O2 sub-questions → O3 ex+safety → O4 → O5 → O6 → O7 plan → O8) not explicitly stepped at preview; `useProto()` provider + `next()`/`back()` wiring untouched in this slice. |
| Edge cases | Pass (code-derived) | Same RTL test file asserts: (a) `disabled` reflects `Boolean(answers.stage)`; (b) selecting a different radio updates controlled state; (c) reduced-motion override resets all `animation` + `transition` per CSS module. |
| `prefers-reduced-motion` | Pass (code-derived) | `O1.module.css` `@media (prefers-reduced-motion: reduce)` block resets `.entry`, `.card`, `.cardSelected`, `.cta`, `.ctaEnabled` to `animation: none !important; transition: none !important`. Not visually toggled at preview-deploy; CSS is straightforward and matches AC-5 spec verbatim. |
| Keyboard-only | Pass (code-derived) | Native `<input type="radio" name="o1-stage">` × 3 inside `<fieldset aria-labelledby="o1-legend">` — browser provides arrow-key walk within group, Space to select, Tab to leave. `:focus-visible` outline on labels via `O1.module.css` `.card:focus-within`. Not explicitly tab-walked at preview; the keyboard contract is browser-default for the semantics chosen. |
| Mobile viewport (375×667) | Pass (visual eyeball) | User confirmed at preview-deploy `https://construct-dev-git-claude-3e428f-rossdelarge247-debugs-projects.vercel.app` on 2026-05-11 — cards stack vertically, footer chassis pinned at bottom of frame, trust band readable, no horizontal scroll. STEP X / Y mono uppercase width at 375px verified to not break top-bar flex layout. |
| Screen-reader | Pass (code-derived) | `<fieldset aria-labelledby="o1-legend">` + `<legend id="o1-legend" className="sr-only">Tell us where you're at</legend>` provide group accessible name. Native `<input type="radio">` × 3 announce as "radio button" with label text. CTA `<button disabled>` announces enable state via `disabled` attribute. ProgressPill `aria-label="Step X of Y"` (DOM text preserved post AC-6.b uppercase visual). Not explicitly tested with VoiceOver/NVDA; semantics are browser-native + standards-compliant. |
| Cross-screen consistency | Pass (visual eyeball) | User confirmed at preview-deploy on 2026-05-11 after AC-6 ship + `3ba66c2` fix-up: O1 (canvas-as-source) ↔ O2 (canvas-as-source) ↔ O3-O8 (rebuild via ScreenShell) nav-bar chassis identical (BrandBar · same outer 480 cap · same px-5 pt-4 pb-3 header rhythm · ProgressPill in STEP X / Y mono uppercase across all 8 screens · same right-spacer width). Footer chassis identical across all 8 screens (cream `rgba(245,245,244,0.85)` + `blur(8px)` backdrop · trust-band or caption above button · dark pill button with right-arrow at strokeWidth=2). |

## Definition of Done — prototype short-form (items 1, 8, 12, 14)

- [ ] **1.** All ACs met with evidence above
- [ ] **8.** Slice-DoD reference in PR body (`Slice references: docs/slices/S-PROTO-o1-canvas-as-source/verification.md`)
- [ ] **12.** Auto-review verdict: `approve` or `nit-only` on the impl PR
- [ ] **14.** Preview-deploy verified per 6+1-dim rubric above; user feedback received + addressed (or explicitly deferred)

## Architectural deferrals

- **Stepper visual reconciliation.** Canvas defines a `Stepper compact current=1 total=8` helper (L770ish in canvas) distinct from the rebuild's `ProgressPill`. This slice reuses `ProgressPill` for cross-screen consistency. If the canvas's `Stepper` differs meaningfully on inspection (e.g. it omits the slash-divider label, or uses different stroke), reconcile in a follow-up slice — likely after all 8 screens migrate so the `Stepper` becomes the canvas-canonical component and `ProgressPill` retires.
- **Desktop StageShell + keyboard hint.** Canvas L845-999 spec; out of scope per constraint #41 (cross-canvas reconciliation deferred per-instance).
- **AC-1 "sticky CTA region" mechanism.** Canvas `decoded/o1-stage-router-expressive.html` L1024-1097 implements the sticky CTA via flex column layout (`mobile-screen flex flex-col` outer; `flex-1 overflow-hidden` on hero; CTA last child of the flex container) rather than `position: sticky`. The header comment at L1020 reads "sticky CTA" editorially; the imperative CSS is flex. Impl matches the canvas. Auto-review flagged that the flex approach scrolls the CTA off-screen on viewports shorter than 667px or when a soft keyboard opens, and recommended `position: sticky; bottom: 0` plus `pb-[env(safe-area-inset-bottom)]`. Canvas-fidelity wins for prototype category; resilience-class hardening (true sticky + safe-area inset) is deferred to production hand-off (when the slice graduates out of `/dev/proto/`).
- **44×44 Back-button touch target on ScreenShell.** Auto-review on `8ae2dab` flagged the AC-6.c rewrite of `ScreenShell` Back button dropped the prior `minHeight: 44, minWidth: 44, padding: '12px 8px'` (touch target now ≈14px tall — under WCAG 2.5.8 24×24 AA + WCAG 2.5.5 44×44 AAA). Auto-review on `62bdb97` (touch-target restore) made the row ≈72px tall — visually 30px taller than O1's bespoke Home-link row (≈42px) on the cross-screen comparison. User direction at preview-deploy eyeball: "01 and 02 nav looks great… 03 still different" + visual consistency preferred over the a11y minimum. Resolution: ScreenShell Back button matches O1's bespoke Home link visual (`padding: 0`, no `minHeight`/`minWidth`); cross-screen visual chassis identical at preview. O2's bespoke Back button likewise stays at `padding: 0`. The 44×44 touch-target deferral is recorded here for the production graduation slice — implement via negative-margin trick (`padding: '14px 12px'; margin: '-14px -12px'; minHeight: 44; minWidth: 44`) or absolute-positioned invisible hit-area extender to maintain canvas-faithful visual while meeting AAA.

Test-pain audit cleared at impl: O1 tests use `render()` + `screen.getByRole('radio')` / `fireEvent.click()` patterns; no mocks needed for `useProto()` (provider wraps the render); 0 mocks total. Well below the prototype-category test-pain threshold (spec 72d §3 sets the mock-count rule; spec 76 §3 raises it from >2 to >5 for prototype category).

## Status

(Lineage appended at slice ship — final-state record only per CLAUDE.md §"Definition of Done" L1.)
