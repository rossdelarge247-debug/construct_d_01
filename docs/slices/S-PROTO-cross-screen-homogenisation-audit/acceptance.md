# S-PROTO-cross-screen-homogenisation-audit

**Category:** prototype

Phase 1 scope-only audit slice. Catalogues cross-screen inconsistencies across the 8 canvas-as-source pre-signup-interview screens (O1-O8) currently shipped on main. Output is a punch list of homogenisation candidates. **No implementation.** Phase 2 (user joint review) re-prioritises this list, then Phase 3 ships fixes in dedicated batches scoped by chassis surface.

Per CLAUDE.md §"Canvas-as-source (prototype default)": canvas-as-source slices don't carry `Linked canvas:`. This audit slice has no canvas anchor either; findings cite the shipped source code at `src/app/dev/proto/pre-signup-interview/`.

## What this audit covers vs doesn't

**Covered (Claude-solo, source-level):**
- Chassis-component sharing: TopBar duplicated 8× as local function · ProgressPill call-site drift · Hero/Footer duplicated 7× · `components/ScreenShell` + 6 other primitives entirely unused.
- Naming-level drift: `colors.line` vs `colors.border` · `mute` vs `muted` · local `FONT_SERIF` vs `tokens.font.serif` · local `ArrowSvg` vs shared `Arrow`.
- Value-level drift: 5 different H1/H2 sizes · 4 eyebrow letter-spacings · 5 TopBar vertical paddings · spacer 44 vs 36 · focus-visible presence/absence.
- Structural drift: `<header>` / `<footer>` / `<main>` semantic-landmark usage · `<h1>` vs `<h2>` heading levels.
- Off-palette token candidates: VIOLET_SOFT · MAGENTA_SOFT · PAPER_WARM · SOFT · SOFTMUTE · ICON_BG_UNSELECTED (flagged in SESSION-CONTEXT P3 as production-graduation candidates).

**NOT covered (Phase 2 user-walk + Phase 3 impl):**
- Visual rendering on the preview deploy. Claude can't render; user walks in Phase 2 at `https://construct-dev.vercel.app/dev/proto/pre-signup-interview`.
- The "few small visual issues" the user flagged verbally on O7 at merge time but batched into the homogenisation pass without enumeration. User re-walks O7 first in Phase 2 on the preview deploy to surface them.
- O7's mid-screen content sections (the 6 data-bound sections under `MobileReady` — substantive content audit deferred until chassis homogenises).
- Per-screen `.module.css` drift.
- Per-screen `__tests__/` drift.
- Inline-helper duplication beyond noting it exists (Chip · ChipRow · CardPlate · OptionCard · Eyebrow · MobileSectionHeader · StepRail · PlanRecall — each defined locally; consolidation is its own pass).

## Findings register

### Chassis-component sharing (CH)

**F-CH-01 — TopBar duplicated 8× as local function.** Every screen declares its own `function TopBar` (or `function MobileTopBar`) with a distinct prop signature. No shared TopBar primitive exists. The drift in TY/SM/SP/NM categories below is mostly a consequence of this.
- O1.tsx:20 — `function TopBar({ step })` (no `onBack`, no `total`)
- O2.tsx:99 — `function TopBar({ step, total = 8, onBack })`
- O3.tsx:24 — `function TopBar({ step, onBack })`
- O4.tsx:21 — `function TopBar({ step, onBack })`
- O5.tsx:23 — `function TopBar({ step, onBack })`
- O6.tsx:23 — `function TopBar({ step, onBack })`
- O7.tsx:131 — `function MobileTopBar({ step, total, remaining })` (different name + extra prop)
- O8.tsx:174 — `function TopBar({ onBack })` (no `step`)

**F-CH-02 — ProgressPill call-site drift.** Six screens use the shared `ProgressPill` component; two (O7, O8) replace it with inline custom progress UI.
- `step={step}` alone (relies on `total = TOTAL_STEPS` default): O1.tsx:34
- `step={step} total={total}` (variable): O2.tsx:121
- `step={step} total={8}` (hardcoded 8): O3.tsx:53, O4.tsx:51, O5.tsx:53, O6.tsx:53
- Inline custom progress bar (110×3px, includes "STEP X / Y · remaining" caption): O7.tsx:152-162
- Inline `<StepRail current={8} total={8} />` local component: O8 (StepRail defined at O8.tsx:133)

**F-CH-03 — Hero duplicated 8× as local function.** Each screen declares its own `function Hero` (O7 uses `function MobileHero`). Eight bodies, none shared.
- O1.tsx:40 · O2.tsx:127 · O3.tsx:59 · O4.tsx:57 · O5.tsx:59 · O6.tsx:59 · O7.tsx:171 (`MobileHero`) · O8.tsx:248

**F-CH-04 — Footer duplicated 7× as local function (+ 1 inlined in screen body).** No shared Footer primitive.
- O2.tsx:165 · O3.tsx:233 · O4.tsx:210 · O5.tsx:209 · O6.tsx:254 · O7.tsx:523 (`PlanFooter` — content block, not sticky) · O8.tsx:380
- O1 has NO `function Footer` declaration — the footer markup is inlined directly inside the O1 screen body (the bottom of `O1.tsx`, post-fieldset). Wrapper is `<div className="px-5 pt-3 pb-5">` styled to match a Footer chassis.

**F-CH-05 — `components/ScreenShell.tsx` (224L) is entirely unused.** Defined in `components/`; grep finds zero importers across the prototype. Dead code.

**F-CH-06 — Six more `components/` primitives are entirely unused.** Defined in `components/`, none imported by any screen:
- `RadioCard.tsx` (62L) · `RadioChips.tsx` (67L) · `CheckChips.tsx` (80L) · `SubQuestionCard.tsx` (38L) · `JourneyTimeline.tsx` (50L) · `PlanSection.tsx` (36L)
- Combined with F-CH-05: **~557L of dead-code primitives in `components/`**. Candidates for a follow-up cleanup slice.
- Evidence: `grep -rn "from '../components/(RadioCard|RadioChips|CheckChips|SubQuestionCard|JourneyTimeline|PlanSection|ScreenShell)'" screens/` returns no matches.

**F-CH-07 — Only 5 of 12 `components/` primitives are actually used.** `BrandBar` (all 8 screens), `ProgressPill` (O1-O6 only), `Arrow` (O1-O6 only), `BackgroundShell` (used by `page.tsx`), `BgToggle` (used by `page.tsx`). The shared-primitive surface is thinner than the directory suggests.

### Naming drift (NM)

**F-NM-01 — `colors.line` (O1-O4) vs `colors.border` (O5-O8).** Both map to `tokens.color.border`. **Identical value; different identifier** across the 8 local `colors` consts. Pure naming inconsistency.
- O1.tsx:17 · O2.tsx:23 · O3.tsx:20 · O4.tsx:17 — `line: tokens.color.border`
- O5.tsx:17 · O6.tsx:19 · O7.tsx:19 · O8.tsx:13 — `border: tokens.color.border`

**F-NM-02 — `colors.mute` (O2 only) vs `colors.muted` (everyone else).** O2 alone uses the singular alias.
- O2.tsx:22 — `mute: tokens.color.text.muted`

**F-NM-03 — Local `FONT_SERIF` / `FONT_MONO` constants in O7 + O8 vs `tokens.font.serif` / `tokens.font.mono` elsewhere.** Same `var(--ds-font-*)` value, different identifier path.
- O7.tsx:33-34 · O8.tsx:18-19

**F-NM-04 — Local `ArrowSvg` (O7 + O8) vs shared `Arrow` (O1-O6).** O7 + O8 redefine the arrow SVG locally as `ArrowSvg` with a `sw` prop in place of the shared component's `strokeWidth`. Same SVG shape, different prop API.
- O7.tsx:47-66 · O8 similar pattern · `components/Arrow.tsx` shared definition (31L)

**F-NM-05 — Local `colors` const defined 8× (one per screen).** Same conceptual palette redefined 8 times with slight variations in named keys + which accent is included. Promotes the per-screen drift; centralising the palette (one shared `colors` const at module-level) would eliminate F-NM-01, F-NM-02, and dilute naming-divergence pressure.

### Typography drift (TY)

**F-TY-01 — Five different H1/H2 sizes across 8 screens.** No shared scale.
- O1: serif 30px / lh 1.08 (`<h2>`) · O2: serif 26px / lh 1.05 (`<h2>`) · O3/O4/O5/O8: serif 21px / lh 1.18 (`<h2>` for O3/O4/O5, `<h1>` for O8) · O6: serif 19px / lh 1.2 (`<h2>`) · O7: serif 38px / lh 1.04 (`<h1>`)
- Evidence: O1.tsx:62 · O2.tsx:141 · O3.tsx:91 · O4.tsx:97 · O5.tsx:99 · O6.tsx:97 · O7.tsx:191 · O8.tsx:264

**F-TY-02 — Four different eyebrow letter-spacings.**
- 0.14em: O1
- 0.1em: O2
- 0.08em: O3, O8
- 0.04em: O4, O5, O6
- O7: routed through a local `function Eyebrow` helper (O7.tsx:87) that owns letter-spacing internally

**F-TY-03 — Eyebrow font-size: O1 = 10.5px; all others = 9.5px.** O1 is the outlier.

**F-TY-04 — Eyebrow leading-dot inconsistency.** A 5×5 round colour dot renders before the eyebrow label on O4, O5, O6, O8 — but not on O1, O2, O3, O7. Two different eyebrow visual templates across the 8 screens.

### Semantic / a11y drift (SM)

**F-SM-01 — Heading level inconsistency: only O7 + O8 have an `<h1>`.** O1, O2, O3, O4, O5, O6 use `<h2>` as the highest heading on the page — pages have NO `<h1>`. Six screens fail the "every page should have one `<h1>` for screen-reader page-title comprehension" a11y heuristic.
- Evidence: per F-TY-01 lines.

**F-SM-02 — Semantic-landmark usage: only O3 uses `<header>` and `<footer>` elements.** All other 7 screens use `<div>` for TopBar and Footer regions, losing the implicit ARIA landmark role.
- Evidence: O3.tsx:69 `<header>`, O3.tsx:281 `<footer>` — others use `<div>`.

**F-SM-03 — `<main>` wrapper missing on O1 and O2.** O3-O8 wrap their content in `<main>`; O1 and O2 use plain `<div className="flex flex-col min-h-screen w-full max-w-[480px] mx-auto pt-6">`. Inconsistent landmark structure.
- Evidence: `grep -nH "^\s*<main" screens/O*.tsx` surfaces only O3-O8.

**F-SM-04 — Back element-type drift: `<a>` vs `<button>`.**
- `<a href="#">` (link element): O1 ("Home" link, top-left — note O1 is screen 1, so it's intentionally not a Back action), O7 (Home + Save chrome), O8 (Back, per session-90 AC-1 contract using `e.preventDefault() + onBack()`)
- `<button onClick={onBack}>`: O2, O3, O4, O5, O6
- Worth confirming with user: O1's "Home" link vs O2-O6's "Back" button is plausibly intentional (different action), but O8 using `<a>` for the same "Back" action that O2-O6 implement as `<button>` is unambiguous drift.

**F-SM-05 — focus-visible outline only on O2's Back button.** O2 uses Tailwind `focus-visible:outline focus-visible:outline-2 focus-visible:outline-current focus-visible:outline-offset-2`. O3-O6's Back buttons have no focus-visible treatment; O7/O8's `<a>` links have no focus-visible.
- Evidence: O2.tsx:105

### Spacing / padding drift (SP)

**F-SP-01 — Five different TopBar vertical paddings.** No shared spacing scale across the 8 TopBars.
- Tailwind `px-5 pt-4 pb-3` (16/12): O1
- Tailwind `px-5 pt-3 pb-3` (12/12): O2
- Inline `8px 20px 12px`: O3, O4, O5, O6
- Inline `16px 20px 12px`: O7
- Inline `8px 20px 10px`: O8

**F-SP-02 — TopBar right-spacer width: 44 vs 36.** O1's spacer is 44px; everyone else is 36px. Plausibly intentional (O1's left "Home" link has different glyph layout than the "Back" button family) — flag for user confirmation.
- Evidence: O1.tsx:35 (44) vs O2.tsx:122, O3.tsx:54, O4.tsx:47, O5.tsx:49, O6.tsx:49, O8.tsx:203 (all 36)

**F-SP-03 — TopBar right-spacer element: `<div>` vs `<span>`.** O1/O2/O3/O8 use `<div>`; O4/O5/O6 use `<span aria-hidden="true" style={{display: 'inline-block'}}>`. Functionally equivalent for layout; cosmetic naming drift.

**F-SP-04 — Hero padding: six different patterns across 8 screens.**
- Tailwind `px-5 pt-5 pb-4`: O1
- Tailwind `px-5 pt-4 pb-2`: O2
- Inline `16px 20px 12px`: O3, O4, O5
- Inline `12px 20px 8px`: O6
- Inline `26px 20px 22px`: O7 (heavier; bespoke hero with gradient)
- Inline `12px 20px 10px`: O8

**F-SP-05 — H2 top-margin in Hero: 12px (O1), 8px (O2/O3/O4/O5), 6px (O6/O8), 12px (O7 `<h1>`).** Three different values for what is conceptually the same eyebrow-to-heading gap.

### Mobile-cap impl drift (LM)

**F-LM-01 — Mobile-cap (480px) implementation differs across screens.**
- Tailwind `max-w-[480px] mx-auto`: O1 (O1.tsx:177), O2 (O2.tsx:250)
- Inline `maxWidth: 480, margin: '0 auto'`: O3 (O3.tsx:354), O4 (O4.tsx:305), O5 (O5.tsx:307), O6 (O6.tsx:359)
- **Not found** in O7 or O8's `<main>` styles. The cap is presumably applied via `BackgroundShell` or `page.tsx` for those two screens — needs verification. If unintentional, O7/O8 may render edge-to-edge on viewports wider than 480px.

### Footer drift (FT)

**F-FT-01 — Footer-border token: `colors.line` (O2/O3/O4) vs `colors.border` (O5/O6/O7/O8).** Same naming-drift class as F-NM-01; same underlying `tokens.color.border` value. (Note O7's `PlanFooter` uses `colors.border` for its top border, but it's a content-block `<section>` not a sticky footer — see F-FT-04.)

**F-FT-02 — Footer background opacity + blur: `rgba(245,245,244,0.85)` blur(8px) (O1/O2/O4/O5/O6) vs `rgba(255,255,255,0.62)` blur(10px) (O8).** Different cream-vs-white base + different opacity + different blur radius.
- Evidence: O1.tsx ~L199, O2.tsx:181, O4.tsx:238, O5.tsx:237, O6.tsx:275, O8.tsx:386

**F-FT-03 — Footer wrapper padding: four different patterns.**
- Tailwind `px-5 pt-3 pb-5`: O1, O2
- Inline `12px 20px 16px`: O4, O5, O6
- Inline `10px 20px 14px`: O8
- Inline `40px 20px 28px` (content section, not chrome): O7

**F-FT-04 — O7 has no sticky footer; its `PlanFooter` is a content-block `<section>` at the bottom of the scroll surface.** Two CTAs ("Download your plan as PDF" + "Email me the link instead") inside the section. Different chassis pattern from the sticky-cream footer in O4/O5/O6/O8.

**F-FT-05 — CTA-enabled animation drift.** Three different patterns for the same animation slot.
- O3: `useEffect` adds `styles.ctaEnabled` on enable, `setTimeout 350ms` removes it (bounce-and-clear) (O3.tsx:241-251)
- O4 + O5: `useEffect` force-reflow remove/re-add (`void node.offsetWidth`) on enable transition (O4.tsx:218-228, O5.tsx:217-227)
- O6: `useEffect` always-on (fires on mount, no `enabled` dependency) (O6.tsx:262-269)

**F-FT-06 — Footer-caption typography: four different patterns.**
- O2: mono 10.5px / uppercase / tracked-out 0.08em
- O3: conditional (sans muted when disabled, serif italic when privacy-optional, varies further)
- O4 + O5: italic-when-enabled serif, sans-when-disabled (per-state typography switch)
- O6: always-sans (no conditional)
- O7 / O8: no caption-above-CTA slot (different chassis pattern)

### CSS-module presence (CM)

**F-CM-01 — O2 is the only screen without a CSS-module file.** O1, O3, O4, O5, O6, O7, O8 all import `./O{N}.module.css`. O2 does not — all its styling is either Tailwind classes or inline styles.

**F-CM-02 — `styles.backLink` CSS-module class only on O4/O5/O6 Back buttons.** Three screens reuse the back-link CSS-module class for the Back button typography; the other Back-button screens (O2, O3) use inline styles only. O7/O8's `<a>` links use inline styles.

**F-CM-03 — `styles.entry` Hero/PlanFooter stagger class usage.** O1 (Hero), O3 (Hero `<header>`), O4 (Hero), O5 (Hero), O6 (Hero), O7 (PlanFooter `<section>`) use `className={styles.entry}` for stagger-on-mount animation. O2 (Hero) and O8 (Hero) don't. Implies O2 + O8 Heroes have no entry-stagger animation — verify against design intent.

### Inline-style density (IS)

**F-IS-01 — Inline-style site count per screen.** Rough indicator of how much each screen leans on inline styles vs CSS modules.
- O1: 17 · O2: 13 · O3: 23 · O4: 19 · O5: 23 · O6: 18 · O7: **78** (~4× any other) · O8: 32 (~2×)
- High inline-style density on O7/O8 correlates with their bespoke-chassis pattern (no shared module classes for the bespoke surfaces).

### Off-palette token candidates (TK)

Already flagged in SESSION-CONTEXT P3 as production-graduation candidates; this audit confirms they're still raw constants in O7 + O8.

**F-TK-01 — Soft-tint colour candidates as raw hex.** In O7 + O8:
- `VIOLET_SOFT = '#F3EEFE'` (O7.tsx:23 + O8.tsx:15)
- `MAGENTA_SOFT = '#FCE7F3'` (O7.tsx:24)
- `PAPER_WARM = '#FBFAF6'` (O7.tsx:25)
- `SOFT = '#FAFAF7'` (O7.tsx:26)
- `SOFTMUTE = '#9A968E'` (O7.tsx:27)
- `ICON_BG_UNSELECTED = '#FAFAF7'` (O8.tsx:16; identical value to O7's `SOFT`, different identifier — naming-drift within the off-palette set)
- `'#A8A29E'` (O2.tsx:24 — hardcoded `disabled` colour, not via token)
- `'#C9C5BD'` (O1.tsx ~L210 — hardcoded trust-band divider colour)

**F-TK-02 — INDIGO token reconciliation.** Per SESSION-CONTEXT: canvas O7 uses `#4338CA` for indigo accent; existing `tokens.color.accent.indigo` is `#4F46E5`. Pre-existing known drift; flagged for production graduation.

**F-TK-03 — Gradient backgrounds in O7.** `EXPRESSIVE_HERO` and `GENERATING_BG` are O7-only inline gradient constants (O7.tsx:30-31). If any other screen ships a similar mood-band hero, the gradient pattern would need design-system promotion.

## For Phase 2 (user joint review)

The user reviews this findings register and:

1. **Validates** each finding — real drift vs intentional canvas variance vs false positive.
2. **Adds** items I missed. **Highest priority for the joint walk:** the "few small visual issues" the user flagged verbally on O7 at merge time but batched without enumeration. User re-walks O7 first on the preview deploy to surface these.
3. **Re-prioritises** — must-fix-before-production-graduation vs nice-to-have vs correct-as-shipped vs token-sweep-slice candidates.
4. **Groups** findings into Phase 3 impl batches. Suggested batch shape:
   - **Batch A — TopBar harmonisation:** F-CH-01 + F-NM-01/02 + F-SP-01/02/03 + F-SM-04/05 + F-CM-02 + F-FT-01 (the border-token-naming portion). Extracts one shared `TopBar` primitive with consistent prop API.
   - **Batch B — Hero harmonisation:** F-CH-03 + F-TY-01/02/03/04 + F-SP-04/05 + F-SM-01 (h1 vs h2 a11y) + F-CM-03 (stagger consistency). Extracts one shared `Hero` primitive.
   - **Batch C — Footer harmonisation:** F-CH-04 + F-FT-01/02/03/05/06. Extracts one shared `Footer` primitive (sticky-cream chassis); O7's `PlanFooter` content-block stays bespoke.
   - **Batch D — Semantic landmarks + a11y:** F-SM-02 + F-SM-03 (add `<header>` / `<main>` / `<footer>` consistently). Could fold into A/B/C above.
   - **Batch E — Dead-code cleanup:** F-CH-05 + F-CH-06 (delete ScreenShell + 6 unused primitives; ~557L).
   - **Batch F — Token promotion (production-graduation timing):** F-TK-01/02/03 + F-NM-03 (FONT_SERIF/FONT_MONO consolidation) + F-NM-05 (collapse 8 `colors` consts into one shared palette). Per SESSION-CONTEXT P3, bundle for the `/dev/proto/` exit moment.

## Out of scope (deferred)

- **All implementation.** This slice is acceptance.md only. Phase 3 ships changes via dedicated slices.
- **Inline-helper homogenisation** (Chip, ChipRow, CardPlate, OptionCard, Eyebrow, MobileSectionHeader, StepRail, PlanRecall). Chassis-surface homogenisation is the priority; content-area helper consolidation is its own pass if/when worth doing.
- **Per-screen `.module.css` audit.** Drift within module CSS files not catalogued here.
- **Test-suite drift.** Each screen's `__tests__/` shape not catalogued.
- **Canvas-fidelity claims.** This is a canvas-as-source surface; no `Linked canvas:` field; no fidelity gating.
- **Visual rendering on the preview deploy.** Claude can't render; user walks in Phase 2.
- **O7 mid-screen content sections.** The 6 data-bound sections under `MobileReady` (built from `buildPlanFromAnswers`) — substantive content audit deferred until chassis homogenises.

## Pre-flight

Adversarial-review budget (CLAUDE.md §"Engineering conventions" §"Adversarial review gate"): this acceptance.md is ~200L. Per `docs/workspace-spec/72b-adversarial-review-budget.md`, single sub-spawn budget covers it (<300L). Auto-review will fan out 3 specialists (security · correctness · style — spec 72c §4 architecture-drop) at PR open. Findings register is the primary deliverable; correctness specialist may flag inconsistencies in my cataloguing.

Linked canvas: **omitted** per canvas-as-source default policy (CLAUDE.md §"Canvas-as-source" §"Slice convention"). No visual-fidelity claims in this audit slice — findings cite shipped source code, not canvas anchors.

No `verification.md` — scope-only audit slice ships the punch list itself as the deliverable. Phase 3 batch slices each carry their own verification.md per DoD-prototype-short-form.
