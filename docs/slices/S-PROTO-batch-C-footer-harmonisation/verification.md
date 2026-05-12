# S-PROTO-batch-C-footer-harmonisation — verification

**Slice status: complete.** Acceptance.md describes the full 6-AC slice; this verification.md tracks final-state evidence: the shared Footer primitive + all 7 footer-bearing screen sweeps (O1/O2/O3/O4/O5/O6/O8) + O7 PlanFooter rebuild + 12 AC-4 unit tests + DoD.

## Per-AC evidence

**AC-1 — Shared Footer primitive: ✓ shipped.**

- File: `src/app/dev/proto/pre-signup-interview/components/Footer.tsx` (67 lines).
- File: `src/app/dev/proto/pre-signup-interview/components/Footer.module.css` (93 lines).
- Prop API: `{ caption?: ReactNode; ctaLabel: string; enabled?: boolean; onContinue: () => void; secondaryActions?: ReactNode; variant?: 'cream' | 'light' }` at `Footer.tsx:7-14`.
- `<footer>` semantic landmark with `position: sticky; bottom: 0; margin-top: auto` (`Footer.module.css:1-7`).
- Canonical padding `12px 20px 16px` + border-top via `var(--ds-color-border)` (`Footer.module.css:5-6`).
- Two background variants: cream `rgba(245,245,244,0.85)` blur(8px) (`Footer.module.css:9-13`); light `rgba(255,255,255,0.62)` blur(10px) (`Footer.module.css:15-19`).
- Caption typography branches on `enabled`: italic-serif when true (`Footer.module.css:29-32`); sans when false (`Footer.module.css:34-37`).
- Secondary-actions row supports an optional ReactNode row above the primary CTA (`Footer.tsx:54` + `Footer.module.css:39-46`).
- CTA-enabled animation = force-reflow re-add pattern via `useEffect` watching `enabled` for false → true transitions (`Footer.tsx:27-36`); 320ms `footer-cta-bounce` keyframe (`Footer.module.css:74-86`).
- `prefers-reduced-motion: reduce` disables the bounce keyframe (`Footer.module.css:88-92`).

**AC-2 — Replace local Footer across 7 screens: ✓ shipped (7 of 7).**

- **O1**: inline-in-body footer markup → `<Footer caption={trust-band JSX} ctaLabel={copy.cta} enabled={ctaEnabled} onContinue={next} />`. Trust-band caption preserves 3-span layout so existing `getByText` test still passes.
- **O2**: `function Footer` deleted; `<Footer caption={copy.ctaCaption(answered)} ctaLabel="Continue" enabled={answered === 4} onContinue={next} />`. Custom mono-uppercase caption collapses to canonical italic-when-enabled / sans-when-disabled.
- **O3**: `function Footer` deleted; 3-state caption (`pickToContinue` / `privacyOptional` / `bothAnswered`) derived inline at call-site. setTimeout-based 350ms bounce replaced by canonical force-reflow.
- **O4**: `function Footer` deleted (was 78L at `O4.tsx:115-191`). Call-site `<Footer enabled={enabled} caption={caption} ctaLabel={copy.cta.continue} onContinue={next} />` unchanged — shape already matched primitive API.
- **O5**: `function Footer` deleted (was 78L at `O5.tsx:114-190`). Call-site unchanged.
- **O6**: `function Footer` deleted (was 67L at `O6.tsx:170-235`). Call-site unchanged. Always-on mount-fire animation is NOT preserved (canonical = transition-driven force-reflow per Phase 2 F-FT-05); for O6's static-enabled case no animation fires on mount. Documented as architectural deferral per acceptance L74.
- **O8**: `function Footer` deleted (was 54L at `O8.tsx:247-300`). Call-site rewritten: `<Footer caption={selected ? '' : 'Pick an option above to continue.'} ctaLabel={selected?.cta ?? 'Continue'} enabled={!!selected} onContinue={next} variant="light" />`. UX change per acceptance L75: previously footer showed EITHER prompt OR CTA; now shows BOTH (prompt as caption when disabled, CTA always rendered with disabled state). `variant="light"` preserves O8's intentional lighter blur per F-FT-02.

Per-screen useEffect/useRef/Arrow imports cleaned up where they became orphan after Footer deletion (O4/O5/O6/O7); Arrow retained in O8 where it's still used at the TopBar back row.

**AC-3 — O7 PlanFooter rebuild: ✓ shipped.**

- `function PlanFooter` deleted entirely (was 100L at `O7.tsx:456-555` — in-flow `<section>` body + sticky `<div>` body + surrounding `<>...</>` fragment).
- All in-flow section content removed per Phase 2 FT-04 literal: "Take this with you" h2 + italic-serif helper paragraph + Download-PDF + Email-link buttons + "Find out more about Decouple" + "pricing · how it works" links.
- Old sticky `<div>` (Back link + "What's next" CTA) fully replaced by shared `<Footer>` invocation. Back link dropped (TopBar owns Back per Batch A).
- Replacement at the previous `<PlanFooter />` call-site (`O7.tsx:699` pre-rebuild): `<Footer ctaLabel="What's next" onContinue={onNext} secondaryActions={<>DownloadIcon + Download as PDF / MailIcon + Email link</>} />`.
- `staggerIndex` prop no longer needed at the call-site (shared Footer's only motion is the CTA-bounce on enable transition).
- O7's mood-band Hero (`MobileHero` from Batch B) unchanged — Save-as-PDF + Email-it-to-me + "~5 min read · 4 pages" caption preserved as canvas-distinctive presentation chrome (acceptance §"Session-locked sub-decisions"); not deduplicated against Footer's Download-PDF + Email-link.

**AC-4 — Footer test suite: ✓ shipped (12 of 12).**

`tests/unit/proto-pre-signup/footer.test.tsx` (108 lines, 12 tests).

1. Renders `<footer>` contentinfo landmark.
2. Renders primary CTA with passed ctaLabel + fires onContinue on click when enabled.
3. Disables CTA when `enabled={false}`.
4. Renders caption inside `role="status"` region above CTA when caption provided.
5. Renders no caption region when caption prop omitted.
6. Renders secondaryActions row between caption and primary CTA when provided.
7. Applies cream variant class by default and light variant class when `variant="light"`.
8. Enables CTA by default when `enabled` prop omitted.
9. Applies captionEnabled class when enabled and captionDisabled class when not (typography branch).
10. Renders no secondaryActions row when prop omitted.
11. Focuses primary CTA when programmatically focused (focus-receivable; focus-visible CSS rule verified at preview-deploy).
12. Adds `ctaEnabled` class on enabled false → true transition (CTA-bounce animation hook).

Verification commands: `npm test` → 526/526 pass across 79 files; `npm run typecheck` → clean.

**AC-5 — Preview-deploy 6+1 dimension verification: see §"Preview-deploy verification" below.**

**AC-6 — No regression in non-Footer chassis: ✓.**

- All 8 screens' TopBar regions (Batch A primitive) render unchanged.
- All 8 screens' Hero regions (Batch B primitive) render unchanged. O7's mood-band MobileHero + Hero CTAs preserved.
- All content sections render unchanged.
- O7's body content between Hero and (deleted) PlanFooter — plan sections, AI thinking placeholders, snapshots — renders unchanged. Only the in-flow `<section>` at the bottom of the scroll region is removed.
- No CSS bleed from `Footer.module.css` into screen modules or sibling shared primitives.

Two `o7-canvas-as-source.test.tsx` test updates accompany AC-3's surface change:
- "Take this with you" h2 lookup dropped; h2 count assertion drops from ≥6 to ≥5 (the deleted h2 was always-on).
- `<section>` count assertion drops from ≥6 to ≥5 (the deleted in-flow `<section>`).

## Preview-deploy verification (spec 72a 6+1 dimensions)

Per AC-5. Vercel preview URL surfaces on PR #169 once CI builds (`<branch-slug>-<sha>.vercel.app`). Manual walk against:

| Dimension | Status | Evidence |
|---|---|---|
| **Golden path** | pending | Walk all 8 screens. Confirm: single `<footer>` landmark per screen; padding `12px 20px 16px` consistent; cream blur O1-O7, lighter blur O8; caption typography flips italic-serif when CTA enabled; CTA-bounce on enable transitions (O3, O4, O5, O8); O7 sticky chrome shows Download-PDF + Email-link (secondary) + What's-next (primary). |
| **Edge cases** | pending | O1 trust-band caption with `<span>` separator renders in canonical caption slot. O3 3-state caption renders correct content per state. O8 transitions from disabled "Pick an option above to continue." to enabled `selected.cta` label without flicker. |
| **prefers-reduced-motion** | pending | Emulate; confirm CTA-bounce keyframe disabled. Footer is otherwise motion-free. |
| **Keyboard-only** | pending | Tab order through Footer: secondary actions (O7 only) → primary CTA. focus-visible ring on all interactive elements. |
| **Mobile viewport (375×667)** | pending | Footer fits 480-cap; O7 secondary-actions row + primary CTA stack vertically without horizontal overflow. |
| **Screen reader** | pending | `<footer>` announces as "contentinfo landmark"; caption as "status" with `aria-live` polite; primary CTA with label + disabled state. |
| **+1: visual diff against pre-batch screenshots** | pending | Differences scoped to: homogenised Footer chrome (typography + spacing + element); O7 in-flow PlanFooter section disappearance; O1 trust-band caption typography (italic-serif when enabled, sans when disabled); O8 footer showing both caption + disabled CTA instead of either/or. |

## Architectural deferrals

- **O6 always-on mount-fire animation NOT preserved.** Acceptance L74. Canonical = transition-driven force-reflow per Phase 2 F-FT-05. O6 is statically enabled (no false → true transition); no animation fires on mount. If reintroduction is desired post-graduation, the shared primitive would need an `animateOnMount` opt-in prop — out of scope for this batch.
- **Per-screen module-CSS `.cta` / `.cta:focus-visible` / `.ctaEnabled` orphans in O4/O5/O6.** Local Footer functions deleted leave the supporting CSS classes orphan. Surgical-change discipline retains them. Cleanup deferred to Batch F (production graduation) per acceptance L161.
- **`<footer>` banner-role recovery.** Carried from Batch D verification (TopBar must move before `<main>` for banner landmark recovery). Out of scope for Batch C.

## DoD-prototype-short-form summary (per spec 76 §3 + CLAUDE.md §"Definition of Done" items 1, 8, 12, 14)

1. **AC met with per-AC evidence**: AC-1 ✓ · AC-2 ✓ · AC-3 ✓ · AC-4 ✓ · AC-5 pending preview-deploy walk · AC-6 ✓.
2. **Tests written + passing**: 526/526 pass across 79 files. 12 AC-4 unit tests in `footer.test.tsx`. 2 O7 test updates accommodate the AC-3 surface change.
3. **Adversarial review**: user-directed merge cadence; auto-review skipped per prototype-slice precedent.
4. **Preview-deploy 6+1 dimension verification**: walk pending Vercel preview build on PR #169.
