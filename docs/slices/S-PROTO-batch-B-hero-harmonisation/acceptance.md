# S-PROTO-batch-B-hero-harmonisation

**Category:** prototype

Phase 3 Batch B of the homogenisation programme scoped in `docs/slices/S-PROTO-cross-screen-homogenisation-audit/acceptance.md`. Extracts one shared `Hero` primitive replacing 8 local `function Hero` / `MobileHero` declarations across O1-O8, collapses 5 different H1/H2 sizes to canonical 21px serif, flips all heading elements to `<h1>` (a11y must-fix), and drops the leading-dot eyebrow decoration on O4/O5/O6/O8.

Resolves the following audit findings: F-CH-03 (Hero duplication) · F-TY-01 (H1/H2 sizes collapse to 21px) · F-TY-02 (eyebrow letter-spacing 0.04em) · F-TY-03 (eyebrow size 9.5px) · F-TY-04 (drop leading-dot decoration) · F-SP-04 (canonical Hero padding `16px 20px 12px`) · F-SP-05 (canonical H1 top-margin 8px) · F-SM-01 (`<h1>` on all 8 screens) · F-CM-01 (create `O2.module.css`) · F-CM-03 (add `.entry` to `O8.module.css` for Hero stagger parity).

**Defers to Batch C / E / F:** Footer + O7 PlanFooter rebuild (C — O7's bespoke Save-PDF + Email-link + caption chrome below the Hero typography are out of scope for B; they live in O7's local wrapper around the shared Hero until C decides their final home alongside PlanFooter) · dead-code already shipped (E — Batch E session-91) · token promotion (F — `lib/colors.ts` centralisation + FONT_SERIF/FONT_MONO consolidation stay deferred per audit Batch F).

Per CLAUDE.md §"Canvas-as-source (prototype default)": no `Linked canvas:` field — canvas-fidelity persona stays dormant.

**Eyebrow font-family decision (not pre-locked in Phase 2):** sans-serif (modal value across O3-O6). O1/O2/O8 collapse from mono. Quoting CLAUDE.md §"Visual direction" §"Preserve-and-rebuild" §"AC-as-canvas-quote" pattern is N/A here (prototype slice, no `Linked canvas:` field).

**O7 mood-band treatment decision (not pre-locked in Phase 2):** O7 retains its bespoke mood-band wrapper around the shared Hero. The wrapper renders the `EXPRESSIVE_HERO` gradient background + radial-spotlight overlay; the shared `<Hero/>` renders inside with canonical typography + padding; O7's bespoke CTAs (Save-as-PDF, Email-it-to-me) + "~5 min read" caption sit BELOW the shared Hero inside the same wrapper. Canvas-distinctive preservation honoured per Phase 2's locked "selective canvas-distinctive preservation … reserved for clearly intentional UX variance" — the mood-band gradient is the variance; typography is not.

## Acceptance criteria

**AC-1: `components/Hero.tsx` shared primitive.**

Create `src/app/dev/proto/pre-signup-interview/components/Hero.tsx` with:

```tsx
import type { ReactNode } from 'react';

interface HeroProps {
  eyebrow: string;
  eyebrowColor?: string;     // raw CSS color; defaults to var(--ds-color-text-muted)
  heading: ReactNode;        // wrapped in <h1>; screens pass plain string OR JSX fragments
  helper?: ReactNode;        // optional supporting paragraph below the heading
  helperVariant?: 'sans' | 'italic-serif';  // default 'sans'
  staggerIndex?: number;     // default 0; writes --stagger-index CSS var
  className?: string;        // typically the screen's styles.entry for animation composition
}

export function Hero(props: HeroProps): JSX.Element;
```

Behaviour:

- Renders a single `<div>` wrapper with class `styles.hero` (and any `className` prop composed via space-join). `--stagger-index` CSS var written to `style` for animation delay composition with screen-owned `.entry` (resolves F-CM-01 + F-CM-03 design intent).
- Wrapper padding: **`16px 20px 12px`** (resolves F-SP-04 — modal: O3/O4/O5). No per-screen padding override.
- Eyebrow renders as a `<div>` (NOT inline-flex with a dot — dot dropped per F-TY-04). Typography: `font: 500 9.5px/1.3 var(--ds-font-sans)` + `letter-spacing: 0.04em` + `text-transform: uppercase` + color from `eyebrowColor` prop (default `var(--ds-color-text-muted)`). Resolves F-TY-02 (0.04em letter-spacing) + F-TY-03 (9.5px size) + F-TY-04 (no dot decoration).
- Heading renders as `<h1>` (resolves F-SM-01). Typography: `margin: 8px 0 0` (resolves F-SP-05) + `font: 600 21px/1.18 var(--ds-font-serif)` + `letter-spacing: -0.02em` + `color: var(--ds-color-ink)`. Resolves F-TY-01.
- Helper (when provided) renders as `<p>`:
  - `helperVariant='sans'` (default): `margin: 8px 0 0` + `font: 400 12px/1.45 var(--ds-font-sans)` + `color: var(--ds-color-text-sub)`. Matches O4/O5/O8 prior pattern.
  - `helperVariant='italic-serif'`: `margin: 12px 0 0` + `font: italic 400 14px/1.5 var(--ds-font-serif)` + `color: var(--ds-color-text-sub)`. Matches O1/O7 prior pattern.
- No inline-flex eyebrow wrapper, no `<span aria-hidden>` dot element, no per-screen heading-shape branching. Heading-shape variation (italic fragment, bold/accent, custom italic color) is handled by the SCREEN passing JSX as `heading` rather than a primitive-internal union type.

CSS-module convention: Hero styling in `components/Hero.module.css` (NEW file). Class names: `.hero`. Typography lives inline on the rendered elements (eyebrow div, h1, p) for parity with TopBar primitive's mixed approach (wrapper class + inline text styling) and to keep `style` overrides composable.

**AC-2: Replace local Hero/MobileHero usage across all 8 screens.**

For each of `screens/O{1..8}.tsx`:

- Delete the local `function Hero` (O1/O2/O3/O4/O5/O6/O8) or `function MobileHero` (O7) declaration entirely. Delete any local helpers used only by that function (e.g. O8's locally-scoped FONT_SERIF/FONT_MONO references in the deleted Hero body — these stay only if used elsewhere in the same screen).
- Replace the call-site:
  - **O1**: `<Hero eyebrow={copy.eyebrow} heading={<>{copy.heading.pre}<span style={{fontStyle:'italic',fontWeight:400}}>{copy.heading.italic}</span>{copy.heading.tail}</>} helper={copy.subStem} helperVariant="italic-serif" className={styles.entry} />` (O1 collapses 30px → 21px; eyebrow `colors.muted` → default; `subStem` becomes italic-serif helper).
  - **O2**: `<Hero eyebrow={copy.eyebrow} eyebrowColor={colors.violet} heading={...} className={styles.entry} />` (O2 collapses 26px → 21px; eyebrow stays violet; heading-shape JSX preserves the existing TitleShape union behaviour inline at call-site).
  - **O3**: `<Hero eyebrow={copy.eyebrow} eyebrowColor={colors.violet} heading={copy.heading} staggerIndex={0} className={styles.entry} />` (typography already canonical post-deletion of local `<header>` wrapper; eyebrow keeps violet accent).
  - **O4**: `<Hero eyebrow={copy.eyebrow.label} eyebrowColor={colors.indigo} heading={copy.heading} helper={copy.helper} staggerIndex={0} className={styles.entry} />` (drops the inline-flex + dot wrapper around eyebrow; eyebrow becomes plain text with indigo color).
  - **O5**: `<Hero eyebrow={copy.eyebrow.label} eyebrowColor={colors[copy.eyebrow.accent]} heading={copy.heading} helper={copy.helper} staggerIndex={0} className={styles.entry} />` (same as O4 but accent stays prop-driven via `copy.eyebrow.accent`).
  - **O6**: `<Hero eyebrow={copy.eyebrow.label} eyebrowColor={colors[copy.eyebrow.accent]} heading={copy.heading} staggerIndex={0} className={styles.entry} />` (collapses 19px → 21px; H1 top-margin 6px → 8px; no helper; drops dot).
  - **O7**: keep an O7-local wrapper component (e.g. rename `function MobileHero` to `function MoodBandHero` or inline at call-site) that renders: outer `<div style={{ background: EXPRESSIVE_HERO, borderBottom: '1px solid ' + colors.border, position: 'relative', overflow: 'hidden' }}>` + the radial-spotlight overlay `<div>` + `<Hero eyebrow="Your plan is ready" eyebrowColor={colors.violet} heading={<>Here&apos;s <span style={{fontStyle:'italic',fontWeight:400,color:colors.magenta}}>your plan</span>.</>} helper="Built from your six answers — a warm picture of where you are, what's ahead, and what your options are." helperVariant="italic-serif" />` + the bespoke CTAs/caption section `<div>` (Save-as-PDF button + Email-it-to-me link + "~5 min read · 4 pages · yours to keep"). Collapses 38px → 21px on H1 (canvas-distinctive H1 size dropped per "All screens collapse to canonical (no per-screen exceptions — O1 welcome and O7 bespoke also harmonise on padding)"); mood-band gradient + spotlight + bespoke CTAs/caption preserved.
  - **O8**: `<Hero eyebrow="What's next · take it from here" eyebrowColor={colors.magenta} heading="What would you like to do next?" helper={<>There&apos;s no wrong answer. <span style={{color:colors.muted}}>You can come back anytime.</span></>} staggerIndex={0} className={styles.entry} />` (drops the inline-flex + dot wrapper around eyebrow; H1 top-margin 6px → 8px; helper margin 6px → 8px).
- Per-screen `colors` const is preserved unchanged. The `colors.line` vs `colors.border` naming-drift (F-NM-01) stays for Batch F; Hero references go through the typed prop API.

Expected screen-level diff per screen: net negative (delete ~30-60 lines of local Hero + helpers; add 1-line `<Hero ...>` call inside a screen-specific wrapper if needed for O7, or top-level for O1-O6/O8).

**AC-3: O2 + O8 module CSS — `.entry` stagger.**

Per Phase 2 CM-01 + CM-03 (audit slice §"Phase 2 outcomes" CM):

- **Create** `screens/O2.module.css` (new file). Minimum content: `.entry` class with stagger animation matching the O3/O4 pattern (320ms ease-out animation + `--stagger-index` delay multiplier @ 80ms). Screen-scoped keyframes name `o2-entry-in` (to avoid global-keyframe collisions with O3's `o3-entry-in` etc).
- **Add** `.entry` (with screen-scoped keyframes `o8-entry-in`) to existing `screens/O8.module.css`. O8's existing class definitions stay untouched.
- Update `screens/O2.tsx` to `import styles from './O2.module.css'` and pass `className={styles.entry}` to the `<Hero />` call.
- Update `screens/O8.tsx` to pass `className={styles.entry}` to the `<Hero />` call (O8 already imports its module).

These additions satisfy Phase 2's locked CM-01 + CM-03 deliverables and make the Hero stagger animation visible on all 8 screens.

**AC-4: Tests for the `Hero` primitive.**

New file `tests/unit/proto-pre-signup/Hero.test.tsx` (matches Batch A's convention at `tests/unit/proto-pre-signup/TopBar.test.tsx`; vitest + react-testing-library). Tests:

1. Renders an `<h1>` element with the heading content passed via prop (plain string case). Assert via `getByRole('heading', { level: 1 })`.
2. Renders the heading content with JSX fragment passed (asserts the primitive preserves nested-italic markup verbatim; renders a `<span>` inside the `<h1>` when the prop contains one).
3. Renders the eyebrow text with default color (`var(--ds-color-text-muted)`) when `eyebrowColor` omitted.
4. Renders the eyebrow with overridden color when `eyebrowColor` provided (assert via `getComputedStyle` or inline-style match).
5. Helper renders with sans variant (default): asserts the `<p>` element exists with the passed text and sans font.
6. Helper renders with `helperVariant="italic-serif"`: asserts the `<p>` font-style is italic and font-family is serif.
7. No helper rendered when `helper` prop omitted (asserts no `<p>` element inside the Hero wrapper).
8. `staggerIndex={2}` writes `--stagger-index: 2` to the wrapper element's inline style.
9. `className` prop composes with the internal `styles.hero` class on the wrapper (assert wrapper element has both classes present).

No screen-level test rewrites required for Batch B. Each screen's existing `__tests__/O{N}.test.tsx` should continue to pass once the local Hero is replaced. If a screen's test asserts on local Hero internals (e.g. specific class names from the deleted local function), it gets updated to assert via the shared Hero's stable selectors instead (heading role, eyebrow text, etc).

**AC-5: Visual + a11y verification on preview deploy.**

Per spec 72a 6-dimension rubric, captured in `verification.md` §"Preview-deploy verification". Manual checks:

- **Golden path:** walk all 8 screens. Confirm: every screen has a single `<h1>` (a11y must-fix per F-SM-01). Hero typography is identical across (21px serif/1.18/-0.02em/600). Eyebrow size 9.5px / spacing 0.04em uniform. No leading-dot decoration anywhere. Hero padding `16px 20px 12px` visible consistently. O1's "welcome" feel preserved despite collapse to canonical (italic-serif subStem still renders; just smaller H1). O7's mood-band gradient + spotlight + CTAs/caption still render around the now-canonical Hero typography.
- **Edge cases:** O7's heading with magenta italic fragment renders correctly through the ReactNode passthrough. O8's helper with embedded muted-color span renders correctly.
- **prefers-reduced-motion:** Hero animation `.entry` stagger (screen-owned, 320ms ease-out + 80ms × index delay) should disable. Verify via DevTools "Emulate prefers-reduced-motion: reduce". Note: this slice does NOT introduce a `@media (prefers-reduced-motion: reduce)` block on Hero — the screen modules' `.entry` definitions are pre-existing and motion-policy follows the existing pattern. Documented as architectural deferral if no fallback present.
- **Keyboard-only:** Hero contains no interactive elements; passes trivially. Heading is reachable via screen-reader navigation (h1 jump).
- **Mobile viewport (375×667):** Hero renders within the 480px-capped layout. No overflow. Long heading text on O1 + O7 wraps gracefully (collapses to 21px from 30/38px).
- **Screen reader:** every page announces a single `<h1>` with the canonical heading content. Eyebrow text reads as a normal label (not heading). Helper paragraph reads as body text.

**AC-6: No regression in screen-level non-Hero chassis surfaces.**

Batch B is Hero-only. After the swap:
- All 8 screens' TopBar regions (Batch A primitive) render unchanged.
- All footers render unchanged for Batch C (sticky-cream on O4/O5/O6/O8 + O1 inline + O7 PlanFooter content-block).
- All content sections render unchanged.
- O7's mood-band gradient + spotlight + bespoke CTAs (Save-as-PDF + Email-it-to-me) + caption ("~5 min read · 4 pages · yours to keep") render unchanged (wrapped around the shared Hero, not inside it).
- No CSS bleed from the new `Hero.module.css` into screen modules or sibling shared primitives.

Smoke check: visit O1-O8 on preview deploy, diff visual treatment against pre-batch screenshots. Differences scoped to Hero typography (size, eyebrow font, dot removal) + heading element (`<h2>` → `<h1>`) + Hero padding only.

## Out of scope (deferred to other batches)

- **Footer / `<main>` sweep (O3-O8 already done; banner-role recovery deferred) / Dead-code / Token-promotion:** Batches C / D-deferred / E-shipped / F respectively.
- **O7's bespoke CTAs (Save-as-PDF, Email-it-to-me, caption) final home:** Batch B preserves them inside O7's mood-band wrapper. Batch C decides whether they consolidate with the sticky-Footer Download-PDF + Email-link CTAs or stay as mood-band visual statement.
- **`colors` const centralisation** (F-NM-05) + **FONT_SERIF/FONT_MONO consolidation** (F-NM-03): stay deferred to Batch F at production graduation.
- **Banner-role recovery (TopBar before `<main>`):** deferred per Batch D verification.md architectural-deferrals note.
- **O7 visual issues** flagged at PR #161 merge (session 90) but not enumerated: surface during Batch B preview-deploy walk per audit slice §"Still open". If found, capture in verification.md §"O7 visual issues" + queue for Batch C or its own micro-slice.

## Pre-flight

Adversarial-review budget (CLAUDE.md §"Engineering conventions"): this acceptance.md ~190L. Single sub-spawn covers it. User-directed "let's just merge" cadence continues for prototype slices — auto-review skipped unless explicitly invoked.

Linked canvas: **omitted** per canvas-as-source default policy. No verbatim canvas quoting required. Visual treatment of the shared Hero inherits from the canonical sub-cluster decisions made in Phase 2 (O3/O4/O5 modal values) + the two sub-decisions captured above (eyebrow font = sans; O7 mood-band = O7 wraps shared Hero).

DoD per CLAUDE.md §"Definition of Done" prototype short-form (items 1, 8, 12, 14 from spec 72 §11):
1. All 6 ACs met with evidence per AC in `verification.md`.
2. Tests written + passing (AC-4).
3. Adversarial review: user-directed merge cadence; auto-review skipped per prototype-slice precedent.
4. Preview-deploy 6-dimension verified per spec 72a (AC-5).
