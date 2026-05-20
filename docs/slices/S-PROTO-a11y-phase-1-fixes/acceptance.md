# S-PROTO-a11y-phase-1-fixes

**Category:** prototype

## What

Ship the 18 `fix-this-slice` resolutions from `docs/slices/S-PROTO-a11y-wcag-audit-phase-1/audit-register.md` — the WCAG 2.1 AA findings catalogued by the Phase 1 audit walk. The audit register names 4 follow-up sub-slices (`S-PROTO-a11y-focus-visible-sweep` · `S-PROTO-a11y-aria-live-regions` · `S-PROTO-a11y-contrast-mute` · `S-PROTO-a11y-rail-specifics`); this slice consolidates the four into one combined ship on the back of measured fix-impl effort.

The 18 findings span 4 patterns: focus-visible coverage on inline-styled interactive elements (8 sites, WCAG 2.4.7), ARIA live-region conditional-rendering refactor (3 sites, WCAG 4.1.3), `MUTE` colour contrast on small text (4 sites with multiple lines each, WCAG 1.4.3), and 3 rail-specific fixes (WCAG 4.1.2 · 2.1.1 · WAI-ARIA Tabs APG).

## In scope

- All 18 findings (F-A11Y-01..18) from the audit register flagged `fix-this-slice`
- A shared `components/focus-visible.module.css` className wiring on every inline-styled interactive element where the inline style strips the browser's default outline
- Mount-unconditionally refactor for 3 `aria-live` regions; conditional content moves to nested child
- MUTE → SUB token swap on the 4 sites (`--ds-color-text-muted` → `--ds-color-text-sub`)
- RailCoach suggested-button semantics: add `aria-disabled="true"` and remove `cursor: 'pointer'` (no `onClick` handler present)
- `optRowStyle` CSS-module migration so `:hover` and `:focus-visible` attach declaratively
- RailHybrid V5 tab `ArrowLeft`/`ArrowRight` arrow-key navigation per WAI-ARIA Tabs APG

## Out of scope

- F-A11Y-19 V4 option-row `onClick` wiring — `defer-out-of-scope` per audit register; feature work, not a11y
- F-A11Y-20 D-2 canvas-literal compact V5 tab content — `defer-out-of-scope` per audit register; design decision held open for post-deploy team review
- Responsive breakpoint review (480-1280px intermediate + above-1320px utilisation) — Phase 2 of the system-wide a11y pass
- Full NVDA + VoiceOver screen-reader walk — Phase 3
- Full 6-dim preview-deploy rubric exercise across all surfaces — Phase 4 (this slice's preview-deploy verification covers the touched surfaces only)
- Dashboard surfaces — none yet on main per `docs/SESSION-CONTEXT.md`

## Acceptance criteria

Each AC maps 1:1 to one row of `audit-register.md`. Verification per AC lives in `verification.md` with file + line refs.

### Focus-visible sweep (WCAG 2.4.7)

**AC-1 — F-A11Y-01 — `screens/O3.tsx` chip-card + chip-button focus outline**

Apply `className={styles.focusable}` from `components/focus-visible.module.css` to the chip-card at L51-56 and chip-button at L139-143. Both elements retain their inline `style` props; the className adds the `:focus-visible` outline pseudo-rule.

**AC-2 — F-A11Y-02 — `screens/O4.tsx` chip-card focus outline**

Apply `className={styles.focusable}` to the chip-card at L49-53.

**AC-3 — F-A11Y-03 — `screens/O5.tsx` chip-card focus outline**

Apply `className={styles.focusable}` to the chip-card at L48-52.

**AC-4 — F-A11Y-04 — `screens/O7.tsx` focus outlines (2 sites)**

Apply `className={styles.focusable}` to both inline-styled `cursor: 'pointer'` sites at L148 and L637.

**AC-5 — F-A11Y-05 — `screens/O8.tsx` focus outline**

Apply `className={styles.focusable}` to the inline-styled `cursor: 'pointer'` site at L157.

**AC-6 — F-A11Y-06 — `screens/QuantBridge.tsx` focus outline**

Apply `className={styles.focusable}` to the inline-styled `cursor: 'pointer'` site at L87.

**AC-7 — F-A11Y-07 — `components/rails/RailCoach.tsx` rail buttons (2 sites)**

Apply `className={styles.focusable}` to both rail buttons at L46-50 (suggestionButtonStyle) and L77-83 (sendButtonStyle).

**AC-8 — F-A11Y-08 — `components/rails/rail-constants.tsx` shared-style buttons (2 sites)**

Apply `className={styles.focusable}` to the elements consuming `optRowStyle` (L62-72) and `tabButtonStyle` (L142-149). Consumers: `RailHuman` (V4) and `RailHybrid` (V5). The opt-row site is migrated to CSS module per AC-17; the className wiring follows the migration.

### ARIA live regions (WCAG 4.1.3)

**AC-9 — F-A11Y-09 — `components/HelpRailLayout.tsx` rail-region mount unconditionally**

Refactor L30-31 so the `aria-live="polite"` region mounts unconditionally; the rail-variant child is the conditional node. Visual outcome unchanged when no rail is selected (no rendered content), but the live region exists in the accessibility tree so a future content change can be announced.

**AC-10 — F-A11Y-10 — `components/Footer.tsx` caption region mount unconditionally**

Refactor L43-53 so the `[role="status"]` + `aria-live="polite"` element mounts unconditionally; the caption text is the conditional child. Test `footer.test.tsx` L38-40 (currently asserts `queryByRole('status')` returns null when no caption) flips to assert the region is always present but content is empty when caption is absent.

**AC-11 — F-A11Y-11 — `screens/O7.tsx` aria-live region (L540-542)**

Verify the live region at L540-542 mounts before its content can change. If conditionally rendered, refactor to mount-unconditionally pattern matching AC-9 + AC-10.

### Colour contrast (WCAG 1.4.3)

**AC-12 — F-A11Y-12 — `components/rails/RailGlossary.tsx` MUTE text at L133**

Swap the MUTE colour reference to SUB (`--ds-color-text-muted` → `--ds-color-text-sub`) at L133 ("NOT LEGAL ADVICE"). Verification: rendered contrast ratio ≥ 4.5:1.

**AC-13 — F-A11Y-13 — `components/rails/rail-constants.tsx` MUTE sites**

Swap MUTE → SUB at L31-37 (eyebrow), L54-60 (subheading), L99-103 (mono-footer), L116-122, L143-149. Each site's small-text size verified against the swap.

**AC-14 — F-A11Y-14 — `components/rails/RailCoach.tsx` MUTE captions**

Swap MUTE → SUB at L125-131 and L155-159.

**AC-15 — F-A11Y-15 — `components/rails/RailWhy.tsx` MUTE caption**

Swap MUTE → SUB at L49-53.

### Rail-component specifics

**AC-16 — F-A11Y-16 — `components/rails/RailCoach.tsx` suggestion-button semantics (WCAG 4.1.2)**

The suggestionButtonStyle elements (L46-50) carry `cursor: 'pointer'` without an `onClick` handler. Resolution: add `aria-disabled="true"` and remove the `cursor: 'pointer'` inline-style declaration so the visual affordance matches the absent handler. (Alternative — wire a no-op `onClick` — rejected because it would mislead users into expecting interaction; the buttons remain disabled placeholders until a V2 graduation slice wires real prompts.)

**AC-17 — F-A11Y-17 — `components/rails/rail-constants.tsx` optRowStyle CSS migration (WCAG 2.1.1)**

Migrate `optRowStyle` (L62-72) from the inline-style object to a CSS module so `:hover` and `:focus-visible` pseudo-states attach. New module `components/rails/rail-constants.module.css` carries `.optRow`, `.optRow:hover`, and `.optRow:focus-visible` rules. Consumers in `RailHuman.tsx` swap from `style={optRowStyle}` to `className={styles.optRow}` (with any per-row-position styles retained inline if they vary).

**AC-18 — F-A11Y-18 — `components/rails/RailHybrid.tsx` V5 tab arrow-key navigation (WCAG 2.1.1 · WAI-ARIA Tabs APG)**

Add an `onKeyDown` handler on the `[role="tablist"]` element capturing `ArrowLeft` and `ArrowRight`. Per the WAI-ARIA Authoring Practices `Tabs` pattern (https://www.w3.org/WAI/ARIA/apg/patterns/tabs/), the keys move focus + active state between sibling tabs; focus wraps at boundaries. Existing Tab-key navigation unchanged.

## Design decisions

### D-1 — Combined slice partition (re-partition from the 4-way named in the audit register)

The audit register names 4 follow-up sub-slices (one per WCAG category). This slice re-partitions them into one combined ship on three grounds:
1. **Measured impl effort** — total src/ delta is ~170-200L; per-slice DoD overhead at 4× would dominate the actual work.
2. **File-overlap synergy** — `rail-constants.tsx` is touched by both the focus-visible work and the opt-row CSS migration; `RailCoach.tsx` is touched by focus-visible, contrast, and button-semantics work. Sequential single-purpose slices would re-touch each file 2-3×.
3. **Single-session-budget calibration** — *"ship fix bundles as separate slices each calibrated to a single-session budget"* (audit-register guidance). One combined slice that fits a single session honours that guidance.

Trade-off: PR history loses per-WCAG-category granularity. Acceptable because the audit register preserves the categorisation in its findings-summary table and each AC carries the F-A11Y-NN ref.

### D-2 — `aria-disabled` over no-op `onClick` for RailCoach suggested buttons (AC-16)

The suggested-button rendering has no real action wired (the V2 RailCoach is canvas-source-only; click handlers belong to a feature slice that hasn't been scoped). Two options for AC-16:
- (a) `aria-disabled="true"` + remove `cursor: 'pointer'` — signals the element is non-interactive; matches reality.
- (b) Wire `onClick={() => {}}` — preserves the cursor + makes the click do nothing.

Picked (a) because (b) misleads users into expecting interaction; an explicit non-interactive state is more honest until a graduation slice ships real prompts.

### D-3 — Footer test flip (AC-10)

`tests/unit/proto-pre-signup/footer.test.tsx` L38-40 currently asserts `screen.queryByRole('status')` returns null when no caption prop. After AC-10's mount-unconditionally refactor, the region is always in the DOM with empty content when caption is absent. The test flips to assert the region mounts but its text content is empty. This is a deliberate test change required by the fix, not a regression. The pre-flip behaviour was the bug.

### D-4 — Slice category `prototype`, DoD-14 short-form

CLAUDE.md §"Slice categories" path-default applies: *"`src/app/dev/proto/<literal-slug>/**` where `<literal-slug>` is a directory whose name does NOT begin with `[` → `prototype`"*. All affected paths live under `src/app/dev/proto/pre-signup-interview/`. The matrix in spec 76 §3 reads *"prototype — UI/UX rigour preserved (preview-deploy 6-dim runs in full · `reviewer-prototype-readiness` post-PR persona substitutes `reviewer-correctness`); code rigour relaxed (TDD-guard skips · coverage excludes · test-pain audit threshold raises from >2 to >5 mocks · DoD-14 short-form to items 1, 8, 12, 14 only)"*. See `security.md` for the items-1/8/12/14 short-form.

## Pre-flight

- `acceptance.md` is under 300 lines so adversarial review runs single-turn per `docs/workspace-spec/72b-adversarial-review-budget.md` table row: *"<300 lines | any | Single-turn (status quo) | Fits in one read-cap window; no orchestration overhead."*
- Multi-agent auto-review fires on PR open via `.github/workflows/auto-review.yml`. The 3 specialists receive the slice diff + this `acceptance.md` + CLAUDE.md §"Coding conduct".
- 100% rule check: 18 fix-this-slice rows in the audit register = 18 ACs in this slice. F-A11Y-19 + F-A11Y-20 (2 defer-out-of-scope rows) listed in §"Out of scope". Σ = 20 audit-register rows accounted for ✓.

## Spec sources

- `docs/slices/S-PROTO-a11y-wcag-audit-phase-1/audit-register.md` — finding catalogue; AC-N maps 1:1 to F-A11Y-NN
- `docs/slices/S-PROTO-help-rail-desktop-variants/verification.md` L97 — verbatim source of F-A11Y-13 + F-A11Y-16 + F-A11Y-17
- `docs/slices/S-PROTO-help-rail-V4-V5/verification.md` L97-100 — verbatim source of F-A11Y-17 + F-A11Y-18
- WCAG 2.1 Quick Reference (https://www.w3.org/WAI/WCAG21/quickref/) — success-criterion reference
- WAI-ARIA Authoring Practices, Tabs Pattern (https://www.w3.org/WAI/ARIA/apg/patterns/tabs/) — arrow-key navigation reference for AC-18
- CLAUDE.md §"Slice categories" — prototype path-default + DoD-14 short-form
- CLAUDE.md §"Engineering conventions" §"Definition of Done" — 6-item DoD applies in full
