# S-PROTO-o8-canvas-as-source

**Category:** prototype

Migrate pre-signup interview step 8 ("What's next") from legacy 29L stub (`src/app/dev/proto/pre-signup-interview/screens/O8.tsx`) to canvas-as-source impl per the canonical canvas at `docs/design-source/pre-signup-interview/jsx/o8-frames.jsx`.

O8 is the **exit screen** of the pre-signup interview — a single radio question with four legitimate exit paths. The canvas resolves three design decisions verbatim in the header: *"Resolved: A1 · B2 · C1"* — A1 (equal option visual weight; no primary/secondary distinction), B2 (tiny plan-recall chip between TopBar and Hero), C1 (no empty-state default selection). The screen must NOT push toward signup; visual subtlety is fine, copy pressure is not.

Canvas-as-source default per CLAUDE.md §"Canvas-as-source (prototype default)": no `Linked canvas:` field; canvas-fidelity persona stays dormant; per-AC evidence cites canvas inline without verbatim quoting requirement.

## Acceptance criteria

**AC-1: Page chassis + TopBar.**
- `O8.tsx` replaces the legacy 29L stub entirely; no shared infra from prior versions retained.
- `<main>` wrapper matches sibling-screen pattern: `width: '100%'`, `maxWidth: 480`, `margin: '0 auto'`, `paddingTop: 24`, `minHeight: '100vh'`, flex column, NO background (inherits page-shell expressive gradient).
- BrandBar renders at top (consistent with O1-O7 cross-screen chassis).
- Bespoke TopBar: left Back link (`<a>` with left-arrow + "Back" text) → centred StepRail showing "Step 8 / 8" + 96×3px bar fully filled (terminal step indicator) → right 36px spacer to balance the layout (canvas o8-frames.jsx L184). Bottom 1px `LINE` border.
- Evidence: o8-frames.jsx L129-187 (StepRail + TopBar definitions).

**AC-2: PlanRecall chip (B2 variant).**
- Rendered between TopBar and Hero (canvas L196-229).
- Pill `<a>` chip: `rgba(255,255,255,0.7)` background, 1px LINE border, 999 border-radius, `5px 11px 5px 9px` padding, 11px font, INK text, `backdrop-filter: blur(6px)`.
- Content (left → right): 14×14 round violet-soft badge with mini-checkmark SVG (VIOLET stroke 1.6px) → "Your plan is ready" (fontWeight 500) → "·" MUTE divider → "← back to plan" (MUTE 10.5px with `dir="left"` arrow size 9 stroke 2).
- Non-functional `href="#"` for prototype (links to the plan would route to O7 — defer routing wiring).
- Evidence: canvas L196-229 (PlanRecall B2 branch).

**AC-3: Hero.**
- Magenta-dot eyebrow row: 5×5 MAGENTA dot + 9.5px label-xs MAGENTA text *"What's next · take it from here"* (canvas L278-281).
- Serif H2: *"What would you like to do next?"* — 21px / lineHeight 1.18 / letterSpacing -0.02em / fontWeight 600 / `marginTop: 6` (canvas L282-284).
- Helper: 12px SUB *"There's no wrong answer."* + MUTE-coloured continuation *" You can come back anytime."* (canvas L285-287).
- Evidence: canvas L275-289 (Hero definition).

**AC-4: 4 OptionCards (A1 equal-weight treatment).**
- Single `<fieldset>` (`sr-only` legend "What would you like to do next?") containing 4 native `<input type="radio" name="o8-next-step">` styled as cards.
- Card data sourced from `OPTIONS` constant inlined from canvas o8-frames.jsx L37-66:
  1. `signup` — *"Create a free account and start building my picture"* / *"Free to start; no card needed."* / CTA *"Create my account"* / icon `IconWorkspace`
  2. `download` — *"Download my plan and come back later"* / *"We'll keep your answers for 30 days if you want to come back."* / CTA *"Download my plan"* / icon `IconDownload`
  3. `conventional` — *"I want to go the conventional route"* / *"We'll point you to good starting places."* / CTA *"See helpful links"* / icon `IconExternal`
  4. `support` — *"I need to talk to someone first"* / *"Here are people who can help."* / CTA *"See support resources"* / icon `IconSupport`
- Each card: icon (18×18 line-weight 1.6 from `ICONS[option.id]`) → title (serif fontWeight 600) → sub (SUB 12px). Plus circular radio indicator at right (INK-filled when selected; outlined LINE when not).
- A1 equal-weight: ALL 4 cards share identical visual weight — no primary/secondary distinction, no emphasised styling on any single option (per canvas header decision "Resolved: A1").
- Selected state: white background + 1.5px INK border + filled INK radio indicator. Unselected: PAPER-like background + LINE border + empty radio.
- Inlined icon components: `IconWorkspace`, `IconDownload`, `IconExternal`, `IconSupport` from canvas L83-117 (line-weight 1.6, viewBox 24×24).
- Evidence: canvas L37-124 (OPTIONS + ICONS + 4 SVG icon defs), L297+ (OptionCard render).

**AC-5: Footer (sticky CTA reflecting selected option).**
- Sticky bottom-fixed footer (`rgba(255,255,255,0.62)` + `backdrop-filter: blur(10px)` + 1px LINE top-border + `paddingTop: 10`, `paddingBottom: 14`) matches the O5/O6 cream-blur chassis convention.
- Footer holds a `minHeight: 46` flex row containing EITHER (a) the CTA button OR (b) the empty-state caption — never both.
- **C1 empty-state behaviour** (per canvas o8-frames.jsx L420-422): when no option is selected, the CTA is hidden; in its place renders an 11px MUTE-coloured centred caption *"Pick an option above to continue."*
- **Post-selection behaviour**: full-width dark pill CTA, label is the selected option's `cta` field (e.g., *"Create my account"* / *"Download my plan"* / *"See helpful links"* / *"See support resources"*) + right-arrow strokeWidth=2 (matches O5/O6 footer chassis).
- CTA mount animation: `o8-cta-in 220ms ease-out` opacity-in (canvas L449); suppressed under `prefers-reduced-motion: reduce`.
- CTA `onClick` invokes `useProto().next` for routing visibility — at v1 step 8 is the end of the interview, so `next` is a no-op (TOTAL_STEPS=8 cap); functional routing to signup/download/conventional/support flows is out of scope.
- Evidence: canvas L417-462 (Footer definition).

**AC-6: Motion + a11y + reduced-motion.**
- Card entry stagger on mount via `--stagger-index` opacity-up + 12px translate-up, 240ms ease-out, 80ms delay between siblings (4 cards = 4 staggered reveals). Pattern matches O5/O6 module.css template (opacity override scoped to `.entry` only, NOT `.chip` — applying it to chip class breaks chip transitions under reduced-motion).
- Card selection transitions: background + border-color 120ms ease-out (`background, border-color, padding` per canvas treatment).
- `@media (prefers-reduced-motion: reduce)`: stagger suppressed (instant reveal); card-selection transitions suppressed.
- Semantic structure: `<fieldset><legend className="sr-only">` for radio group; native `<input type="radio">` for each card; H1 (or sr-only H1) for screen title; PlanRecall chip is `<a>` with descriptive label; TopBar Back is `<a>` with visible label + arrow; footer CTA is `<button>`.
- Keyboard: arrow keys cycle through radio cards (native behaviour); Tab moves through Back → PlanRecall chip → cards (treated as a group) → CTA; focus-visible ring inherits page-level treatment.
- Evidence: o5/o6 module.css templates; canvas o8-frames.jsx semantic structure.

## Out of scope (deferred)

- **Post-continue Option 2 ("Email + come back later") variant** (canvas L543-651): an alternate footer state showing an email-capture form after the user picks the `download` option. Defers to a follow-up slice — adds form-validation surface that prototype v1 doesn't need.
- **Functional routing** for any of the 4 exit CTAs (PDF generation · external-links page · support resources · signup flow). Prototype-only visual treatment; routing wires at production graduation.
- **Canvas-local token promotions** for VIOLET_SOFT, MAGENTA_SOFT, etc. — used inline; promotion deferred to a follow-up token-sweep slice.
- **Cross-screen homogenisation** of TopBar/Hero/Footer patterns across O1-O8: deferred to a dedicated homogenisation slice after all 8 canvases land.

## Pre-flight

Adversarial-review budget (CLAUDE.md §"Engineering conventions" §"Adversarial review gate"): this acceptance.md ~120L; single sub-spawn covers it. Auto-review will fan out 3 specialists (security · correctness · style — spec 72c §4 architecture-drop) at PR open.

Linked canvas: **omitted** per canvas-as-source default policy (CLAUDE.md §"Canvas-as-source" §"Slice convention"). Canvas-fidelity persona stays dormant.
