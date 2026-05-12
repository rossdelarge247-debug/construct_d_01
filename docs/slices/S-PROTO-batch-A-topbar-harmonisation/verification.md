# S-PROTO-batch-A-topbar-harmonisation — verification

Phase 3 Batch A of the homogenisation programme. Shared `TopBar` primitive extracted at `src/app/dev/proto/pre-signup-interview/components/TopBar.tsx`; all 8 screens swapped from local `function TopBar` / `MobileTopBar` to the shared primitive.

## Per-AC evidence

**AC-1 — Shared TopBar primitive.**
- File created: `src/app/dev/proto/pre-signup-interview/components/TopBar.tsx` (31 lines).
- File created: `src/app/dev/proto/pre-signup-interview/components/TopBar.module.css` (39 lines).
- Prop API matches scope: `{ step: number; total?: number; onBack?: () => void }` at `TopBar.tsx:6-10`.
- `<header>` landmark at `TopBar.tsx:15` — confirmed via `getByRole('banner')` test assertion at `tests/unit/proto-pre-signup/topbar.test.tsx:11`.
- Padding `8px 20px 12px` + border-bottom `var(--ds-color-border, #E7E5E0)` in `.topBar` class (`TopBar.module.css:1-7`).
- Back variant (`<button type="button">`): `TopBar.tsx:17-20`, font 11px sans (`TopBar.module.css:21-23`).
- Home variant (`<a href="#">`): `TopBar.tsx:22-25`, font 12px sans (`TopBar.module.css:25-27`).
- focus-visible: 2px outline + offset + border-radius 4px (`TopBar.module.css:29-33`), matching the precedent at `O5.module.css:.backLink:focus-visible`.
- ProgressPill child: `TopBar.tsx:27`.
- 36px spacer with `aria-hidden="true"`: `TopBar.tsx:28`, width owned by `.spacer` class (`TopBar.module.css:35-37`).
- Imports shared `Arrow` from `./Arrow` (`TopBar.tsx:3`) — no local ArrowSvg.

**AC-2 — Replace local TopBar usage across all 8 screens.**

Local function deletions verified via `grep -nH "^function TopBar\|^function MobileTopBar\|^function StepRail\|^function ArrowSvg" src/app/dev/proto/pre-signup-interview/screens/O*.tsx` returning empty.

Call-sites:
- O1: `<TopBar step={step} />` at `O1.tsx:159` (Home variant — no onBack).
- O2: `<TopBar step={step} onBack={back} />` at `O2.tsx:224`.
- O3: `<TopBar step={step} onBack={back} />` at `O3.tsx:328`.
- O4: `<TopBar step={step} onBack={back} />` at `O4.tsx:278`.
- O5: `<TopBar step={step} onBack={back} />` at `O5.tsx:280`.
- O6: `<TopBar step={step} onBack={back} />` at `O6.tsx:332`.
- O7: `<TopBar step={7} onBack={back} />` at `O7.tsx:581` (MobileGeneratingView) + `O7.tsx:699` (MobileReadyView). Both sub-components pull `back` from `useProto()` locally.
- O8: `<TopBar step={8} total={8} onBack={back} />` at `O8.tsx:349`. Terminal step renders ProgressPill at 100% fill (step=8, total=8).

Helper deletions:
- O7: `function MobileTopBar` (was at `O7.tsx:131-169`), `function ArrowSvg` (was at `O7.tsx:36-55`) — deleted.
- O8: `function TopBar` (was at `O8.tsx:174-205`), `function StepRail` (was at `O8.tsx:133-172`), `function ArrowSvg` (was at `O8.tsx:60-78`) — deleted.

ArrowSvg → Arrow call-site migrations (rename + prop `sw` → `strokeWidth`):
- O7 `O7.tsx:600` (was `<ArrowSvg dir="left" size={12} />`) → `<Arrow dir="left" size={12} />`.
- O7 `O7.tsx:616` (was `<ArrowSvg size={13} sw={2} />`) → `<Arrow size={13} strokeWidth={2} />`.
- O8 `O8.tsx:240` (was `<ArrowSvg dir="left" size={9} sw={2} />`) → `<Arrow dir="left" size={9} strokeWidth={2} />`.
- O8 `O8.tsx:416` (was `<ArrowSvg dir="right" size={13} sw={2} />`) → `<Arrow dir="right" size={13} strokeWidth={2} />`.

Per-screen import diff:
- O1-O6: `ProgressPill` import removed; `TopBar` import added. `Arrow` import retained (other non-TopBar call-sites remain in the screen body).
- O7 + O8: `Arrow` + `TopBar` imports added (neither was previously imported).

Net per-screen diff is negative on tracked lines (delete ~25-60L of local TopBar/MobileTopBar/StepRail/ArrowSvg + supporting styling collapse; add 1-line `<TopBar />` call + 1-line `import`).

**AC-3 — Tests for the TopBar primitive.**

Test file: `tests/unit/proto-pre-signup/topbar.test.tsx` (7 tests, 56 lines).

**Path deviation flagged**: AC-3 originally specified `components/__tests__/TopBar.test.tsx`. Actual implementation follows the established project convention at `tests/unit/proto-pre-signup/` where all existing proto-prototype tests live (e.g., `progress-pill.test.tsx`, `o5-canvas-as-source.test.tsx`). The AC text was wrong; the impl follows the convention.

Test → AC-3 list mapping:
1. AC-3 #1 (`<header>` landmark): `it('renders <header> banner landmark')` at `topbar.test.tsx:7-12`. Pass.
2. AC-3 #2 (Back button + click): `it('renders Back <button> when onBack is provided and invokes onBack on click')` at `topbar.test.tsx:14-21`. Pass.
3. AC-3 #3 (Home anchor + href="#"): `it('renders Home <a> with href="#" when onBack is omitted')` at `topbar.test.tsx:23-28`. Pass.
4. AC-3 #4 (ProgressPill step + total): `it('forwards step and total to ProgressPill')` at `topbar.test.tsx:30-35`. Pass.
5. AC-3 #5 (36px spacer aria-hidden): `it('renders the aria-hidden spacer with the spacer class in the right slot')` at `topbar.test.tsx:44-49`. Pass.
6. AC-3 #6 (focus-visible class): scoped down to focusability test via `.focus()` + `document.activeElement` check at `topbar.test.tsx:51-55`. JSDOM doesn't fully implement `:focus-visible` selector matching; the CSS rule's visual rendering is captured at preview-deploy time per AC-4.
7. AC-3 #7 (`total` defaults to `TOTAL_STEPS`): `it('defaults total to TOTAL_STEPS when omitted')` at `topbar.test.tsx:37-41`. Pass.

Verification command: `npx vitest run tests/unit/proto-pre-signup/topbar.test.tsx` → 7/7 pass.

**AC-4 — Preview-deploy verification (spec 72a 6-dimension rubric).**

## Preview-deploy verification

| Dimension | Status | Evidence |
|---|---|---|
| Golden path | Pending preview-deploy | Walk all 8 screens, confirm TopBar renders identically across (modulo Back/Home left-slot variant on O1). |
| Edge cases | Pending preview-deploy | O1 Home variant (no onBack); O7 dual-state TopBar (generating + ready states); O8 terminal step (step=8, total=8 → 100% filled ProgressPill). |
| prefers-reduced-motion | Pass (trivially) | TopBar has no motion of its own. No keyframe animations or transitions in TopBar.module.css. |
| Keyboard-only | Pending preview-deploy | Tab focus order through TopBar: Back/Home → ProgressPill (skipped, not focusable) → 36px spacer (skipped). focus-visible ring renders on Back/Home only. |
| Mobile viewport (375×667) | Pending preview-deploy | TopBar fits the 480px-capped layout with no overflow. Padding 20px each side preserved. |
| Screen reader | Pending preview-deploy | `<header>` announces "banner landmark"; Back announces "button" with accessible name "Back"; Home announces "link" with accessible name "Home"; ProgressPill announces "progressbar, step X of Y". |

Preview-deploy walk occurs after PR is opened and Vercel preview is live. Status table updated post-walk.

**AC-5 — No regression in screen-level chassis surfaces (Hero, Footer, content area).**

Test-suite check: `npx vitest run tests/unit/proto-pre-signup/` → 116/116 tests pass across 13 test files. Includes:
- O2/O3/O4/O5/O6/O7/O8 canvas-as-source screen-level tests (all assertions against Hero, Footer, content area still pass).
- ProgressPill primitive tests.
- BrandBar primitive tests (if any — implicit through screen tests).
- TopBar primitive tests (new — AC-3).

One test required updating to match the Phase 2 SM-04 contract: `tests/unit/proto-pre-signup/o8-canvas-as-source.test.tsx:15` previously asserted `screen.getByRole('link', { name: /Back/ })` (the prior O8 contract used an `<a>` element); updated to `screen.getByRole('button', { name: /Back/ })` to match Phase 2 SM-04 (Back action standardises to `<button>` on O2-O8).

Typecheck: `npx tsc --noEmit` returns empty output (clean compile).

## Architectural deferrals

- **Per-screen `colors` const NM-05 centralisation**: each screen retains its local `colors` const. After Batch A, the `line`/`border` key in each is unused for the TopBar's bottom-border (which is owned by the shared primitive) but stays in the const because Hero (Batch B) and Footer (Batch C) still consume border tokens. Full centralisation deferred to Batch F at production graduation per audit slice.
- **`styles.backLink` CSS-module class cleanup** in O4.module.css / O5.module.css / O6.module.css: the class is now orphaned (the shared TopBar uses its own `TopBar.module.css :: .backButton` class). Defer deletion to Batch B or a dedicated CSS sweep to avoid scope expansion.
- **44×44 tap-target sweep** on Back button and Home link: production-graduation backlog per audit slice. Current Back/Home tap surfaces are 11-12px font size with small clickable area; padding could be expanded but deferring to keep Batch A scope tight.
- **O8 PlanRecall chip + Footer CTA** still use inline-style `<a>` and `<button>` patterns — these remain owned by O8 until Batch C (Footer) ships.
- **Sub-component refactor in O7**: `MobileGeneratingView` and `MobileReadyView` each call `useProto().back` independently. Cleaner pattern (passing `back` as a prop or lifting state) deferred — pulling from context inside each sub-component is idiomatic React + minimal blast radius.

## Smoke checks performed

- `npx vitest run tests/unit/proto-pre-signup/` → 116/116 pass.
- `npx tsc --noEmit` → clean.
- `grep -nH "^function TopBar\|^function MobileTopBar\|^function StepRail\|^function ArrowSvg" src/app/dev/proto/pre-signup-interview/screens/O*.tsx` → empty (all local helpers deleted).
- `grep -nH "<TopBar " src/app/dev/proto/pre-signup-interview/screens/O*.tsx` → 9 call-sites (one per screen, except O7 which has 2 — generating + ready states).
- `grep -nH "<ArrowSvg\b" src/app/dev/proto/pre-signup-interview/screens/O*.tsx` → empty (all ArrowSvg call-sites migrated to shared Arrow).

## DoD-prototype-short-form summary (per spec 76 §3 + CLAUDE.md §"Definition of Done" items 1, 8, 12, 14)

1. **AC met with per-AC evidence**: all 5 ACs ✓ (AC-4 preview-deploy walk pending post-PR).
2. **Tests written + passing**: 7 new TopBar primitive tests + 116/116 cross-suite pass (incl. 1 updated o8-canvas-as-source test to match Phase 2 SM-04 contract).
3. **Adversarial review**: pending PR-open multi-agent review (auto-review.yml fans out 3 specialists).
4. **Preview-deploy 6-dimension verification**: pending post-PR Vercel preview.
