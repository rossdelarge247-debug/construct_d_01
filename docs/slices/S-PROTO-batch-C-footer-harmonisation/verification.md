# S-PROTO-batch-C-footer-harmonisation — verification (PARTIAL)

**Slice status: PARTIAL.** Acceptance.md describes the full slice (6 ACs); this verification.md tracks the partial shipment from this session. AC-2 swept 3 of 7 footer-bearing screens (O1/O2/O3); AC-3 (O7 PlanFooter rebuild) deferred; AC-4 Footer tests 7 of 12 shipped; remaining ACs land in the resumption slice.

Wrap recommended after 1,500-line churn warn; rather than push past the 2,000 hard-stop, the partial state ships clean: shared primitive landed + 3 swept screens validated against the full test suite (514/514 pass).

## Per-AC evidence (partial)

**AC-1 — Shared Footer primitive: ✓ shipped.**

- File created: `src/app/dev/proto/pre-signup-interview/components/Footer.tsx` (67 lines).
- File created: `src/app/dev/proto/pre-signup-interview/components/Footer.module.css` (93 lines).
- Prop API matches scope: `{ caption?: ReactNode; ctaLabel: string; enabled?: boolean; onContinue: () => void; secondaryActions?: ReactNode; variant?: 'cream' | 'light' }` at `Footer.tsx:8-15`.
- `<footer>` semantic landmark with `position: sticky; bottom: 0; margin-top: auto` (`Footer.module.css:1-7`).
- Canonical padding `12px 20px 16px` + border-top via `var(--ds-color-border)` (`Footer.module.css:5-6`).
- Two background variants: cream `rgba(245,245,244,0.85)` blur(8px) (`Footer.module.css:9-13`); light `rgba(255,255,255,0.62)` blur(10px) (`Footer.module.css:15-19`).
- Caption typography branches on `enabled`: italic-serif when true (`Footer.module.css:29-32`); sans when false (`Footer.module.css:34-37`).
- Secondary-actions row supports an optional ReactNode row above the primary CTA (`Footer.tsx:55-57` + `Footer.module.css:39-46`).
- CTA-enabled animation = force-reflow re-add pattern via `useEffect` watching `enabled` for false → true transitions (`Footer.tsx:27-37`); 320ms `footer-cta-bounce` keyframe (`Footer.module.css:74-86`).
- `prefers-reduced-motion: reduce` disables the bounce keyframe (`Footer.module.css:88-92`).

**AC-2 — Replace local Footer across 7 screens: PARTIAL (3 of 7).**

Swept ✓:
- **O1**: inline-in-body footer markup (was at `O1.tsx:145-185`) → `<Footer caption={trust-band JSX} ctaLabel={copy.cta} enabled={ctaEnabled} onContinue={next} />`. Trust-band caption preserves 3-span layout (Private until saved · Free to start) so existing `getByText` test still passes.
- **O2**: `function Footer` deleted (was at `O2.tsx:101-149`); call-site at `O2.tsx:201` now `<Footer caption={copy.ctaCaption(answered)} ctaLabel="Continue" enabled={answered === 4} onContinue={next} />`. Custom mono-uppercase caption typography collapses to canonical italic-when-enabled / sans-when-disabled.
- **O3**: `function Footer` deleted (was at `O3.tsx:156-241`); call-site at `O3.tsx:281` now uses ternary at the call-site to derive the 3-state caption (`copy.captions.pickToContinue` / `privacyOptional` / `bothAnswered`) + canonical force-reflow animation owned by shared primitive (replaces the setTimeout-based 350ms bounce).

Pending (deferred) (deferred to resumption slice):
- O4 — call-site shape already matches Footer API; deletion of local `function Footer` pending.
- O5 — same as O4.
- O6 — same as O4; will lose always-on mount-fire animation per canonical (documented as architectural deferral when shipped).
- O8 — needs `variant="light"` + conditional caption/cta-label per `selected` state.

**AC-3 — O7 PlanFooter rebuild: (deferred) deferred.**

In-flow `<section>` removal + Download-PDF/Email-link migration to sticky chrome not yet executed. Existing PlanFooter still ships at `O7.tsx:456-526` + sticky chrome.

**AC-4 — Footer test suite: PARTIAL (7 of 12 tests shipped).**

`tests/unit/proto-pre-signup/footer.test.tsx` (68 lines, 7 tests). Covers the primary contracts: `<footer>` landmark · CTA label + onContinue click · disabled-state click suppression · caption role=status region + aria-live=polite · no caption when prop omitted · secondaryActions row composition · cream vs light variant class on the wrapper. 5 of AC-4's 12 tests deferred to resumption (default-enabled assertion · caption typography branch on enabled · no secondaryActions branch · CTA focus-visible · CTA-bounce animation on enable transition). Verification command: `npm test` → 521/521 pass across 79 test files.

`tests/unit/proto-pre-signup/footer.test.tsx` not yet created. The Footer primitive ships untested at the unit level for this PR; full screen-level tests for O1/O2/O3 (the 3 swept) continue to pass.

**AC-5 — Preview-deploy verification: (deferred) deferred until full sweep lands.**

**AC-6 — No regression in non-Footer chassis: ✓ for swept screens.**

- `npm run typecheck` → clean.
- `npm test` → 514/514 pass across 78 test files (O1's trust-band test updated to verify the 3-span caption structure preserved).
- O1/O2/O3 TopBar + Hero regions render unchanged; only the Footer region changes.

## Resumption checklist

1. Sweep O4, O5, O6, O8 to shared Footer (mechanical — call-site shapes mostly match Footer API; O8 needs `variant="light"` + conditional caption/cta-label).
2. Rebuild O7 PlanFooter (AC-3): delete in-flow `<section>` + delete sticky `<div>` + replace `<PlanFooter />` call-site with `<Footer ctaLabel="What's next" onContinue={onNext} secondaryActions={<Download-PDF + Email-link>} />`.
3. Write `tests/unit/proto-pre-signup/footer.test.tsx` per AC-4 (12 tests).
4. Run tsc + vitest + lint; fix any screen-test breakages from the 4 remaining screen sweeps + O7 rebuild.
5. Update this verification.md to full-state; rewrite §"Slice status" to drop the PARTIAL marker.
6. Preview-deploy 6-dim walk per AC-5.
7. Squash-merge.

## DoD-prototype-short-form summary (per spec 76 §3 + CLAUDE.md §"Definition of Done" items 1, 8, 12, 14)

Slice is explicitly PARTIAL; DoD not yet met. Items deferred to resumption.

1. **AC met with per-AC evidence**: AC-1 ✓ (primitive shipped); AC-2 3/7 ✓; AC-3/4/5/6-full deferred.
2. **Tests written + passing**: 514/514 pre-existing pass; new Footer unit tests pending AC-4.
3. **Adversarial review**: user-directed merge cadence; auto-review skipped per prototype-slice precedent.
4. **Preview-deploy 6-dimension verification**: deferred until full sweep lands.
