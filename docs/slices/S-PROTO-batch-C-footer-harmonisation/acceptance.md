# S-PROTO-batch-C-footer-harmonisation

**Category:** prototype

Phase 3 Batch C of the homogenisation programme scoped in `docs/slices/S-PROTO-cross-screen-homogenisation-audit/acceptance.md`. Extracts one shared sticky-cream `Footer` primitive replacing 6 local `function Footer` declarations (O2/O3/O4/O5/O6/O8) plus O1's inline-in-body footer markup, AND rebuilds O7's bespoke `PlanFooter` per the locked Phase 2 FT-04 decision (in-flow `<section>` removed; Download-PDF + Email-link CTAs move into sticky-cream chassis as secondary actions alongside "What's next" primary).

Resolves the following audit findings: F-CH-04 (Footer duplication) · F-FT-02 (canonical cream blur except O8 lighter — preserved) · F-FT-03 (canonical padding `12px 20px 16px`) · F-FT-04 (O7 PlanFooter rebuild) · F-FT-05 (canonical CTA-enabled animation = force-reflow re-add) · F-FT-06 (canonical caption typography = italic-when-enabled serif / sans-when-disabled).

**Defers to Batch F (production graduation):** `lib/colors.ts` palette centralisation + FONT_SERIF/FONT_MONO consolidation + off-palette token promotion + 44×44 tap-target sweep + `100vh` → `100dvh`.

Per CLAUDE.md §"Canvas-as-source (prototype default)": no `Linked canvas:` field — canvas-fidelity persona stays dormant.

## Session-locked sub-decisions (not pre-locked in Phase 2)

**O7 Footer chrome composition:** primary "What's next" CTA stays + Download-PDF + Email-link added as secondary actions in the same sticky chrome (Back link removed from sticky chrome — TopBar already owns Back per Batch A).

**O7 Hero CTAs (Save-as-PDF + Email-it-to-me + "~5 min read · 4 pages" caption):** stay in the mood-band Hero wrapper (Batch B) as visual statement. Not deduplicated against the Footer's Download-PDF + Email-link — the Hero CTAs are presentation chrome (mood-band aesthetic); the Footer CTAs are functional sticky chrome. Both ship.

**O7 in-flow PlanFooter `<section>`:** removed entirely. The "Take this with you" heading + helper paragraph + "Find out more about Decouple" + "pricing · how it works" links all deleted. Per Phase 2 FT-04 literal: "in-flow PlanFooter `<section>` removed".

## Acceptance criteria

**AC-1: `components/Footer.tsx` shared primitive.**

Create `src/app/dev/proto/pre-signup-interview/components/Footer.tsx` with:

```tsx
import type { ReactNode } from 'react';

interface FooterProps {
  caption?: ReactNode;
  ctaLabel: string;
  enabled?: boolean;             // default true
  onContinue: () => void;
  secondaryActions?: ReactNode;  // optional row rendered above the primary CTA
  variant?: 'cream' | 'light';   // 'cream' default; 'light' for O8 exit-screen canvas-distinctive
}

export function Footer(props: FooterProps): JSX.Element;
```

Behaviour:

- Renders a `<footer>` semantic landmark (resolves F-SM-02 portion). NOT `<div>`. Sticky positioning: `position: sticky; bottom: 0; margin-top: auto`.
- Padding `12px 20px 16px` (resolves F-FT-03 — modal: O4/O5/O6).
- Border-top `1px solid var(--ds-color-border)` (resolves F-FT-01 NM portion — single token).
- Background by variant:
  - `'cream'` (default): `background: rgba(245, 245, 244, 0.85)` + `backdrop-filter: blur(8px)` + WebKit prefix.
  - `'light'` (O8): `background: rgba(255, 255, 255, 0.62)` + `backdrop-filter: blur(10px)` + WebKit prefix. Preserves the locked Phase 2 exit-screen variance.
- Caption (when prop provided) renders inside a `<div role="status" aria-live="polite" aria-atomic="true">` above the CTA. Typography branches on `enabled`:
  - `enabled === true`: `font: italic 400 10.5px/1.35 var(--ds-font-serif)`, `color: var(--ds-color-text-sub)`. Resolves F-FT-06 (italic-when-enabled serif).
  - `enabled === false`: `font: 400 10.5px/1.35 var(--ds-font-sans)`, `color: var(--ds-color-text-muted)`. Resolves F-FT-06 (sans-when-disabled).
  - `text-align: center` + `min-height: 14px` + `margin-bottom: 10px` regardless of state.
- Secondary actions row (when prop provided) renders between caption and primary CTA. Flex layout `display: flex; align-items: center; justify-content: center; gap: 12px; margin-bottom: 10px`. Used by O7 to host Download-PDF + Email-link.
- Primary CTA renders as `<button type="button" disabled={!enabled} onClick={onContinue}>` with the `ctaLabel` text + `<Arrow dir="right" size={13} strokeWidth={2} />`. Styling:
  - `width: 100%`, `padding: 13px 18px`, `border-radius: 999px`, `font: 600 14px/1 var(--ds-font-sans)`, `display: inline-flex; align-items: center; justify-content: center; gap: 8px`.
  - Enabled: `background: var(--ds-color-ink)`, `color: #FFFFFF`, `cursor: pointer`.
  - Disabled: `background: #E5E3DC`, `color: #A8A29E`, `cursor: not-allowed`.
  - `focus-visible: outline 2px solid var(--ds-color-ink); outline-offset: 2px`.
- CTA-enabled animation (resolves F-FT-05): a `useEffect` observes the `enabled` prop. On a `false → true` transition, removes `styles.ctaEnabled` class from the button ref, forces reflow via `void node.offsetWidth`, re-adds the class. The class triggers a 320ms `cta-bounce` keyframe (`translateY(0) → -1px → 0`). Transition-driven only — mounts with `enabled === true` do NOT fire the animation (matches O4/O5 canonical pattern from Phase 2; O6's always-on variant is intentionally NOT canonical).
- `prefers-reduced-motion: reduce` disables the `cta-bounce` keyframe (resolves AC-5 dimension).

CSS-module convention: Footer styling in `components/Footer.module.css` (NEW file). Class names: `.footer`, `.footerCream`, `.footerLight`, `.captionEnabled`, `.captionDisabled`, `.secondaryRow`, `.cta`, `.ctaEnabled`.

**AC-2: Replace local Footer usage across O1-O6 + O8 (7 screens).**

For each footer-bearing screen:

- **O1**: delete the inline-in-body footer markup (currently at `O1.tsx:145-185` — the `<div className="px-5 pt-3 pb-5" style={{...}}>...trustBand + button...</div>` block). Replace with `<Footer caption={<>{copy.trustBand.left} <span style={{color:'#C9C5BD'}}>·</span> {copy.trustBand.right}</>} ctaLabel={copy.cta} enabled={ctaEnabled} onContinue={next} />`. Trust-band caption typography becomes canonical italic-when-enabled / sans-when-disabled (per Phase 2 collapse — accepts state-driven visual shift on O1 as the cost of homogenisation).
- **O2**: delete `function Footer` (O2.tsx:101-149). Replace `<Footer answered={...} total={...} ctaCaption={...} onContinue={next} />` call with `<Footer caption={copy.cta.caption} ctaLabel="Continue" enabled={answered === total} onContinue={next} />`. The custom mono-uppercase 10.5px caption typography collapses to canonical italic-when-enabled / sans-when-disabled.
- **O3**: delete `function Footer` (O3.tsx:156-241). Replace call at `O3.tsx:381` with `<Footer caption={captionContent} ctaLabel="Continue" enabled={enabled} onContinue={next} />` where `captionContent` is the existing 3-state conditional ReactNode (`copy.captions.pickToContinue` / `copy.captions.privacyOptional` / `copy.captions.bothAnswered`) constructed inline at the call-site. The old setTimeout-based bounce animation is replaced by the canonical force-reflow re-add (owned by the shared primitive).
- **O4**: delete `function Footer` (O4.tsx:115-200). Replace `<Footer enabled={enabled} caption={caption} ctaLabel={copy.cta.continue} onContinue={next} />` (same call-site shape — props match Footer API). Custom force-reflow animation moves to shared primitive.
- **O5**: delete `function Footer` (O5.tsx:114-199). Same as O4 — call-site shape already matches. Custom force-reflow animation moves to shared primitive.
- **O6**: delete `function Footer` (O6.tsx:170-237). Replace `<Footer caption={caption} ctaLabel={copy.cta.label} onContinue={next} />` with `<Footer caption={caption} ctaLabel={copy.cta.label} onContinue={next} />` (call-site shape unchanged; `enabled` defaults to `true`). The always-on mount-fire animation is NOT preserved (canonical is transition-driven force-reflow per Phase 2 F-FT-05). Animation will fire on mount only if `enabled` transitions from initial false to true via state; for O6's static-enabled case, no animation fires on mount. Documented as architectural-deferral in verification.md.
- **O8**: delete `function Footer` (O8.tsx:247-291). Replace call at `O8.tsx:336` with `<Footer caption={selected ? '' : 'Pick an option above to continue.'} ctaLabel={selected?.cta ?? 'Continue'} enabled={!!selected} onContinue={next} variant="light" />`. UX change: previously the footer showed EITHER the prompt OR the CTA; now it shows BOTH (prompt as caption when disabled, CTA always rendered with disabled state when no selection). Phase 2 locked O8's lighter blur as canvas-distinctive — preserved via `variant="light"`.

Expected per-screen diff: net negative (delete 40-90L of local Footer body; add 1-line `<Footer ...>` call).

**AC-3: O7 PlanFooter rebuild (F-FT-04).**

- Delete `function PlanFooter` entirely (`O7.tsx:456-526` — the in-flow `<section>` body — `+` the sticky `<div>` body `+` the surrounding `<>...</>` fragment).
- Delete the "Take this with you" `<h2>` + italic-serif helper `<p>` + "Find out more about Decouple" + "pricing · how it works" links from the in-flow `<section>`. ALL in-flow section content removed per Phase 2 FT-04 literal "in-flow PlanFooter `<section>` removed".
- The replacement at the previous `<PlanFooter />` call-site (`O7.tsx:699`) becomes:
  ```tsx
  <Footer
    ctaLabel="What's next"
    onContinue={onNext}
    secondaryActions={
      <>
        <button type="button" style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '10px 14px', borderRadius: 999,
          background: '#FFFFFF', color: colors.ink, border: `1px solid ${colors.ink}`,
          fontSize: 12.5, fontWeight: 600, cursor: 'pointer',
        }}>
          <DownloadIcon size={12} />
          <span>Download as PDF</span>
        </button>
        <a href="#" style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          fontSize: 12.5, padding: '6px 8px', color: colors.sub, textDecoration: 'none',
        }}>
          <MailIcon size={11} />
          <span style={{ textDecoration: 'underline', textUnderlineOffset: 4 }}>Email link</span>
        </a>
      </>
    }
  />
  ```
- The old sticky `<div>` (formerly L527-560 inside PlanFooter) — containing Back link + "What's next" CTA — is fully replaced by the shared `<Footer>` invocation. Back link is dropped (TopBar owns Back per Batch A).
- The `staggerIndex` prop that the old PlanFooter accepted is no longer needed at the call-site (the shared Footer doesn't have a stagger animation — its motion is the CTA-bounce on enable transition only).
- O7's mood-band Hero (`function MobileHero` shipped in Batch B) is unchanged — keeps its Save-as-PDF + Email-it-to-me + "~5 min read · 4 pages" CTAs/caption as canvas-distinctive presentation chrome.

**AC-4: Tests for the `Footer` primitive.**

New file `tests/unit/proto-pre-signup/footer.test.tsx` (vitest + react-testing-library). Tests:

1. Renders `<footer>` semantic landmark. Assert via `screen.getByRole('contentinfo')` (implicit role of `<footer>` when not nested inside `<article>` / `<aside>` / `<main>` / `<nav>` / `<section>`).
2. With default `variant`: renders cream background. Assert via class name match or computed style on the wrapper.
3. With `variant="light"`: renders lighter background. Assert via class name match.
4. Renders the primary `<button>` CTA with the passed `ctaLabel`. Assert via `getByRole('button', { name: <ctaLabel> })`.
5. CTA is disabled when `enabled={false}`. Assert `button.disabled === true`.
6. CTA is enabled by default (when `enabled` prop omitted). Assert `button.disabled === false`.
7. `onContinue` callback fires on click when enabled. Assert `vi.fn()` called once after `fireEvent.click`.
8. Caption (when provided) renders inside a `role="status"` region above the CTA.
9. Caption typography branches on `enabled`: italic-serif when true, sans when false. Assert via inline-style or class match.
10. No caption rendered when `caption` prop omitted.
11. Secondary actions row (when provided) renders between caption and primary CTA.
12. No secondary actions row rendered when `secondaryActions` prop omitted.

No screen-level test rewrites required for AC-4 itself. Screen tests may need minor updates if they assert local-Footer internals (e.g. specific class names from the deleted local function); update to assert via the shared Footer's stable selectors (`role="contentinfo"`, primary CTA button, caption region).

**AC-5: Visual + a11y verification on preview deploy.**

Per spec 72a 6-dimension rubric, captured in `verification.md` §"Preview-deploy verification". Manual checks:

- **Golden path:** walk all 8 screens. Confirm: every footer-bearing screen has a single `<footer>` landmark (a11y win); padding `12px 20px 16px` consistent across; cream blur on O1-O7 (O7 uses cream too, not the old PlanFooter custom blur); lighter blur on O8 (preserved per F-FT-02). Caption typography flips italic-serif when CTA enabled. CTA-bounce animation fires on enable transitions (O3, O4, O5, O8). O7's sticky chrome contains Download-PDF + Email-link (secondary) + What's-next (primary).
- **Edge cases:** O1 trust-band caption with embedded `<span>` separator renders inside the canonical caption slot. O3's 3-state caption (disabled / privacy-optional / both-answered) renders the correct content per state. O8 transitions from disabled "Pick an option above to continue." caption to enabled `selected.cta` label without flicker.
- **prefers-reduced-motion:** CTA-bounce keyframe disabled when emulated. Footer is otherwise motion-free.
- **Keyboard-only:** Tab focus order through Footer: caption (skipped, not focusable) → secondary actions buttons/links (focusable on O7 only) → primary CTA. focus-visible ring on all interactive elements.
- **Mobile viewport (375×667):** Footer fits the 480px-capped layout. O7's secondary-actions row + primary CTA stacks vertically without horizontal overflow.
- **Screen reader:** `<footer>` announces as "contentinfo landmark"; caption announces as "status" with `aria-live` polite (caption content updates announced); primary CTA announces with its label + disabled state.

**AC-6: No regression in screen-level non-Footer chassis surfaces.**

Batch C is Footer-only (plus O7 PlanFooter rebuild). After the swap:
- All 8 screens' TopBar regions (Batch A primitive) render unchanged.
- All 8 screens' Hero regions (Batch B primitive) render unchanged. O7's mood-band wrapper + Hero CTAs preserved.
- All content sections render unchanged.
- O7's body content between Hero and (deleted) PlanFooter — plan sections, AI thinking placeholders, snapshots — renders unchanged. Only the in-flow `<section>` at the bottom of the scroll region is removed.
- No CSS bleed from the new `Footer.module.css` into screen modules or sibling shared primitives.

Smoke check: visit O1-O8 on preview deploy, diff visual treatment against pre-batch screenshots. Differences scoped to:
- Footer sticky chrome (homogenised typography + spacing + element)
- O7 in-flow PlanFooter section disappearance
- O1's trust-band caption typography (italic-serif when enabled, sans when disabled — minor state-driven shift)
- O8's footer now showing both caption + disabled CTA instead of either/or

## Out of scope (deferred to other batches)

- **Batch F (production graduation):** `lib/colors.ts` palette centralisation + FONT_SERIF/FONT_MONO consolidation + off-palette token promotion + 44×44 tap-target sweep + `100vh` → `100dvh`.
- **Banner-role recovery** (TopBar before `<main>`): carried from Batch D verification.md.
- **O7 visual issues** flagged verbally on a prior merge but not enumerated: surface during Batch C preview-deploy walk; capture in verification.md §"O7 visual issues" if found.
- **O6 always-on mount-fire animation:** intentionally NOT preserved (canonical is transition-driven per Phase 2 F-FT-05). Documented as architectural deferral.

## Pre-flight

Adversarial-review budget (CLAUDE.md §"Engineering conventions"): this acceptance.md ~210L. Single sub-spawn covers it. User-directed "let's just merge" cadence continues for prototype slices.

Linked canvas: **omitted** per canvas-as-source default policy.

DoD per CLAUDE.md §"Definition of Done" prototype short-form (items 1, 8, 12, 14 from spec 72 §11):
1. All 6 ACs met with evidence per AC in `verification.md`.
2. Tests written + passing (AC-4).
3. Adversarial review: user-directed merge cadence; auto-review skipped per prototype-slice precedent.
4. Preview-deploy 6-dimension verified per spec 72a (AC-5).
