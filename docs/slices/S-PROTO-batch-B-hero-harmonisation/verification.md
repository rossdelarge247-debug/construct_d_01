# S-PROTO-batch-B-hero-harmonisation — verification

Phase 3 Batch B of the homogenisation programme. Shared `Hero` primitive extracted at `src/app/dev/proto/pre-signup-interview/components/Hero.tsx`; all 8 screens swapped from local `function Hero` / `MobileHero` declarations; heading element flipped from `<h2>` to `<h1>` on all 8 (resolves F-SM-01 a11y must-fix); 5 different H1/H2 sizes collapsed to canonical 21px serif/1.18/-0.02em/600; leading-dot eyebrow decoration dropped on O4/O5/O6/O8.

## Per-AC evidence

**AC-1 — Shared Hero primitive.**

- File created: `src/app/dev/proto/pre-signup-interview/components/Hero.tsx` (73 lines).
- File created: `src/app/dev/proto/pre-signup-interview/components/Hero.module.css` (3 lines — `.hero { padding: 16px 20px 12px }` only).
- Prop API matches scope: `{ eyebrow: string; eyebrowColor?: string; heading: ReactNode; helper?: ReactNode; helperVariant?: 'sans' | 'italic-serif'; staggerIndex?: number; className?: string }` at `Hero.tsx:7-15`.
- Wrapper `<div>` with `styles.hero` class composed with passed `className` via space-join (`Hero.tsx:25,28`).
- `--stagger-index` CSS var written via inline `style` from `staggerIndex` prop (`Hero.tsx:30`).
- Canonical Hero padding `16px 20px 12px` lives in `.hero` class (`Hero.module.css:1-3`) — resolves F-SP-04.
- Eyebrow `<div>` typography: `font: 500 9.5px/1.3 ${tokens.font.sans}` + `letter-spacing: 0.04em` + `text-transform: uppercase` + `color: eyebrowColor ?? 'var(--ds-color-text-muted)'` at `Hero.tsx:33-39` — resolves F-TY-02 + F-TY-03 + F-TY-04 (no dot decoration in markup).
- Heading `<h1>` (NOT `<h2>`) typography: `margin: '8px 0 0'` + `font: 600 21px/1.18 ${tokens.font.serif}` + `letter-spacing: '-0.02em'` + `color: 'var(--ds-color-ink)'` at `Hero.tsx:43-49` — resolves F-TY-01 + F-SP-05 + F-SM-01.
- Helper variant branching at `Hero.tsx:55-67`: `'sans'` default uses `font: 400 12px/1.45 ${tokens.font.sans}` + `margin: 8px 0 0`; `'italic-serif'` uses `font: italic 400 14px/1.5 ${tokens.font.serif}` + `margin: 12px 0 0`. Helper omitted when prop is `undefined`/`null`/`''` (truthy guard at `Hero.tsx:53`).

**AC-2 — Replace local Hero/MobileHero usage across all 8 screens.**

Local function deletions verified via `grep -n "^function Hero\b" src/app/dev/proto/pre-signup-interview/screens/O*.tsx` returning empty. Only `function MobileHero` remains at `O7.tsx:113` — this is the canvas-distinctive mood-band WRAPPER per the locked decision in `acceptance.md` §"O7 mood-band treatment decision" (O7 wraps shared Hero).

Call-sites (shared `<Hero/>` per screen):
- **O1**: `<Hero ... className={styles.entry} />` at `O1.tsx:108` — eyebrow default muted; heading is JSX fragment with italic span; helper italic-serif from `copy.subStem`. Collapses 30px → 21px h1, 10.5px → 9.5px eyebrow, 0.14em → 0.04em letter-spacing, padding 20/20/16 → 16/20/12.
- **O2**: `<Hero ... eyebrowColor={colors.violet} className={styles.entry} />` at `O2.tsx:189` — heading is inline ternary preserving TitleShape kind discriminator. Collapses 26px → 21px h1, 9.5px eyebrow + 0.1em → 0.04em letter-spacing, padding 20/16/8 → 16/20/12.
- **O3**: `<Hero ... eyebrowColor={colors.violet} staggerIndex={0} className={styles.entry} />` at `O3.tsx:287` — eyebrow now plain text (sans 9.5px / 0.04em / no dot); letterSpacing -0.015em → -0.02em on h1.
- **O4**: `<Hero ... eyebrowColor={colors.indigo} ... className={styles.entry} />` at `O4.tsx:220` — eyebrow lost its leading-dot decoration (5×5 indigo circle dropped per F-TY-04); helper sans variant preserved.
- **O5**: `<Hero ... eyebrowColor={colors[copy.eyebrow.accent]} ... className={styles.entry} />` at `O5.tsx:222` — accent stays prop-driven via `copy.eyebrow.accent`; dot dropped.
- **O6**: `<Hero ... eyebrowColor={colors[copy.eyebrow.accent]} className={styles.entry} />` at `O6.tsx:285` — collapses 19px → 21px h1, 1.2 → 1.18 line-height, h1 top-margin 6px → 8px, padding 12/20/8 → 16/20/12; dot dropped.
- **O7**: `<Hero ... eyebrowColor={colors.violet} helperVariant="italic-serif" />` at `O7.tsx:128` — inside O7-local `function MobileHero` wrapper which keeps the mood-band `EXPRESSIVE_HERO` gradient + radial-spotlight overlay (canvas-distinctive preservation). Collapses 38px → 21px h1, 1.04 → 1.18 line-height, -0.025em → -0.02em letter-spacing. The bespoke CTAs (Save-as-PDF + Email-it-to-me) + "~5 min read · 4 pages · yours to keep" caption move from inside the deleted inline `<h1>+<p>` block to a dedicated `<div style={{ padding: '8px 20px 22px' }}>` BELOW the shared `<Hero/>` inside the same wrapper.
- **O8**: `<Hero ... eyebrowColor={colors.magenta} ... className={styles.entry} />` at `O8.tsx:312` — eyebrow lost its leading-dot decoration; h1 top-margin 6px → 8px; helper margin 6px → 8px; helper is JSX fragment preserving the muted-color span on "You can come back anytime."

Per-screen import diff: `Hero` import added on all 8 screens (after `BrandBar`, before `TopBar` in alphabetical order). O2 additionally gains `import styles from './O2.module.css'` (new file). No `tokens` or `CSSProperties` orphan imports — verified via `grep -c "tokens\." src/app/dev/proto/pre-signup-interview/screens/O*.tsx` returning ≥5 refs on every screen.

**AC-3 — O2 + O8 module CSS — `.entry` stagger.**

- **O2.module.css created** (new file, 21 lines): `.entry` class with 320ms ease-out animation matching the O3 pattern; screen-scoped `@keyframes o2-entry-in`; `@media (prefers-reduced-motion: reduce)` fallback disabling animation. Wired via `import styles from './O2.module.css'` at `O2.tsx:7`. Resolves F-CM-01.
- **O8.module.css **already had** `.entry`** (pre-Batch-B at `O8.module.css:51-56` with `@keyframes o8-entry`) and a `prefers-reduced-motion` fallback at `O8.module.css:92-106`. The audit Phase 2 CM-03 deliverable "add `.entry` to O8.module.css" was already satisfied prior to Batch B; Batch B only needed to wire O8's `<Hero/>` call-site to pass `className={styles.entry}` (done at `O8.tsx:312`). Phase 2 CM-03 intent (Hero stagger parity) is achieved by the call-site wiring, not by a CSS edit.

**AC-4 — Tests for the Hero primitive.**

Test file: `tests/unit/proto-pre-signup/hero.test.tsx` (85 lines, 9 tests).

Test → AC-4 list mapping:
1. AC-4 #1 (renders `<h1>` with plain string heading): `it('renders an <h1> with the heading text when heading is a plain string')` at `hero.test.tsx:6-11`. Pass.
2. AC-4 #2 (JSX fragment heading preserves nested span): `it('renders heading content with JSX fragment passed (preserves nested italic span)')` at `hero.test.tsx:13-29`. Pass.
3. AC-4 #3 (default eyebrow color): `it('renders eyebrow text with default muted color when eyebrowColor is omitted')` at `hero.test.tsx:31-35`. Pass.
4. AC-4 #4 (eyebrow color override): `it('renders eyebrow with overridden color when eyebrowColor is provided')` at `hero.test.tsx:37-41`. Pass.
5. AC-4 #5 (sans helper variant default): `it('renders helper paragraph with sans variant (default) when helper provided')` at `hero.test.tsx:43-48`. Pass.
6. AC-4 #6 (italic-serif helper variant): `it('renders helper paragraph with italic-serif variant when helperVariant set')` at `hero.test.tsx:50-61`. Pass.
7. AC-4 #7 (helper omitted): `it('renders no <p> helper when helper prop is omitted')` at `hero.test.tsx:63-66`. Pass.
8. AC-4 #8 (staggerIndex writes CSS var): `it('writes --stagger-index CSS var to wrapper from staggerIndex prop')` at `hero.test.tsx:68-74`. Pass.
9. AC-4 #9 (className composition): `it('composes className prop with internal styles.hero class on wrapper')` at `hero.test.tsx:76-83`. Pass.

Cross-screen test updates: 6 of the 8 screen tests (`o1`/`o2`/`o3`/`o4`/`o5`/`o6` canvas-as-source tests) had their Hero-heading assertion flipped from `getByRole('heading', { level: 2 })` to `getByRole('heading', { level: 1 })` to match the new shared primitive contract (`<h1>` per AC-1 + F-SM-01). O7 + O8 tests required no edit — both screens already used `<h1>` for the Hero pre-Batch-B.

Verification command: `npm test` → 514/514 pass across 78 test files (was 505/505 across 77 pre-Hero-test-suite addition).

**AC-5 — Preview-deploy verification (spec 72a 6-dimension rubric).**

## Preview-deploy verification

| Dimension | Status | Evidence |
|---|---|---|
| Golden path | Pending preview-deploy | Walk all 8 screens, confirm every page has a single `<h1>` (a11y must-fix); Hero typography uniform across screens (21px serif/1.18/-0.02em/600); eyebrow 9.5px / 0.04em / sans / uppercase / no leading-dot anywhere; Hero padding `16px 20px 12px`. O1's italic-serif `subStem` helper still renders; O7's mood-band gradient + spotlight + CTAs + "~5 min read" caption still render around the now-canonical Hero. |
| Edge cases | Pending preview-deploy | O7 heading with magenta italic fragment ("Here's *your plan*.") renders correctly through `heading: ReactNode` passthrough; O8 helper with muted-color span ("...You can come back anytime.") renders correctly. O2's TitleShape ternary (plain vs split kind) renders both variants. |
| prefers-reduced-motion | Pass (architecturally — each screen module owns its `.entry` animation, all 8 have `@media (prefers-reduced-motion: reduce)` blocks that disable it; verify visually on preview-deploy with DevTools emulation) | `grep -l "prefers-reduced-motion" src/app/dev/proto/pre-signup-interview/screens/*.module.css` returns all 8 (O1-O8); new `O2.module.css` includes the fallback at `O2.module.css:17-21`. |
| Keyboard-only | Pass (trivially) | Hero contains no interactive elements; passes trivially. Heading reachable via screen-reader h1 jump. |
| Mobile viewport (375×667) | Pending preview-deploy | Hero renders within 480px-capped layout. No overflow. Long heading text on O1 ("Tell us where you're at.") + O7 ("Here's your plan.") wraps gracefully at 21px (collapsed from 30/38px). |
| Screen reader | Pending preview-deploy | Every page announces a single `<h1>` with the canonical heading content. Eyebrow div reads as a normal label (not heading). Helper `<p>` reads as body text. |

Preview-deploy walk occurs after PR opens and Vercel preview is live. Status table updated post-walk.

**AC-6 — No regression in screen-level non-Hero chassis surfaces.**

Test-suite check: `npm test` → 514/514 pass across 78 test files. The 6 screen-level test updates (level: 2 → level: 1) are the expected contract change from F-SM-01; all other screen-test assertions (TopBar, Footer, content area, chips, cards, fieldsets) continue to pass unchanged.

Typecheck: `npm run typecheck` (`tsc --noEmit`) returns empty output.

Lint: `npm run lint` returns 0 errors, 42 pre-existing warnings — all in files unrelated to Batch B (e.g., `src/lib/store/dev-store.ts`, `src/app/api/*`). No new warnings introduced by Batch B changes.

O7 mood-band wrapper preserved: `grep -n "EXPRESSIVE_HERO\|radial-gradient" src/app/dev/proto/pre-signup-interview/screens/O7.tsx` confirms gradient background + radial spotlight intact at `O7.tsx:117,123`. O7 bespoke CTAs preserved: `grep -n "Save as PDF\|Email it to me\|~5 min read" src/app/dev/proto/pre-signup-interview/screens/O7.tsx` confirms both CTAs + caption render at `O7.tsx:151,158,163` (below the shared `<Hero/>` inside the same wrapper). O8 Footer's lighter blur preserved (untouched by Batch B).

## Architectural deferrals

- **Per-screen `colors` const NM-05 centralisation**: each screen retains its local `colors` const. The Hero primitive accepts raw CSS color strings via the `eyebrowColor` prop, decoupling the primitive from the palette source. Full centralisation deferred to Batch F at production graduation per audit slice.
- **`styles.backLink` orphan in O4-O6 module CSS** (carried over from Batch A): still orphaned. Defer to Batch C or a dedicated CSS sweep.
- **Hero stagger animation owned by screen module, NOT Hero.module.css**: Hero.module.css currently only owns the `.hero` padding wrapper. Animation lives in each screen's `.entry` class (passed as `className` prop). Rationale: respects Phase 2 CM-01/CM-03 literal direction ("Add `.entry` to O2/O8 modules") + keeps per-screen animation timing controllable independently. Alternative (Hero owns animation in Hero.module.css) was considered and rejected to avoid coupling the primitive's motion policy to all 8 screen contexts at once.
- **O7 mood-band wrapper `function MobileHero`**: stays as an O7-local helper rather than being lifted to a shared "MoodBandHero" component. Only O7 has a mood-band hero; lifting prematurely would invent a shared primitive for a single consumer.
- **O7 bespoke CTAs (Save-as-PDF + Email-it-to-me + "~5 min read · 4 pages" caption) inside the mood-band wrapper**: stay inside the wrapper for Batch B. Batch C decides whether they consolidate with the sticky-Footer Download-PDF + Email-link CTAs (substantive UX choice) or stay as mood-band visual statement.
- **`prefers-reduced-motion` policy in `Hero.module.css`**: the file currently only owns the `.hero` padding wrapper, which has no motion. The animation lives in each screen module's `.entry`, which already has `prefers-reduced-motion` fallbacks. No new motion was introduced by the Hero primitive itself; therefore no new `@media (prefers-reduced-motion: reduce)` rule was added to Hero.module.css.

## Smoke checks performed

- `npm test` → 514/514 pass across 78 files.
- `npm run typecheck` → clean.
- `npm run lint` → 0 errors, 42 pre-existing warnings (no new warnings introduced).
- `grep -n "^function Hero\b" src/app/dev/proto/pre-signup-interview/screens/O*.tsx` → empty (only O7's `function MobileHero` wrapper remains, as designed).
- `grep -n "<Hero " src/app/dev/proto/pre-signup-interview/screens/O*.tsx` → 8 call-sites (one per screen). O1:108, O2:189, O3:287, O4:220, O5:222, O6:285, O7:128, O8:312.
- `grep -n "<h2 \|<h2$" src/app/dev/proto/pre-signup-interview/screens/O*.tsx` → 2 remaining h2s, both in O7 (`O7.tsx:177` + `O7.tsx:463`). These are SECTION HEADINGS within O7's body (not Hero), correctly preserved.
- `grep -nE "fontSize: (19|26|30|38)" src/app/dev/proto/pre-signup-interview/screens/O*.tsx` → empty (all 5 non-canonical Hero sizes collapsed).

## DoD-prototype-short-form summary (per spec 76 §3 + CLAUDE.md §"Definition of Done" items 1, 8, 12, 14)

1. **AC met with per-AC evidence**: all 6 ACs ✓ (AC-5 preview-deploy walk pending post-PR; AC-6 regression checks complete via test-suite + grep).
2. **Tests written + passing**: 9 new Hero primitive tests + 514/514 cross-suite pass (incl. 6 screen-test updates to match the `<h1>` contract).
3. **Adversarial review**: prototype-slice precedent — auto-review skipped per user-directed merge cadence.
4. **Preview-deploy 6-dimension verification**: pending post-PR Vercel preview.
