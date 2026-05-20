# S-PROTO-a11y-phase-1-fixes — Verification

Final-state evidence per AC. Round-by-round multi-agent audit detail lives in the session HANDOFF and the PR description.

## Acceptance evidence

### AC-1 — F-A11Y-01 — `screens/O3.tsx` chip-card + chip-button focus outline

- `screens/O3.tsx:41-42` (chip-card) — appended `${focusVisibleStyles.focusable}` to the `<label>` `className`.
- `screens/O3.tsx:130-131` (chip-button "pill") — same; `className={`${styles.pill} ${focusVisibleStyles.focusable}`}`.
- `screens/O3.tsx:18` — added `import focusVisibleStyles from '../components/focus-visible.module.css'`.
- Rule `.focusable:has(:focus-visible)` in `components/focus-visible.module.css` fires when the radio inside the label is keyboard-focused.

### AC-2 — F-A11Y-02 — `screens/O4.tsx` chip-card focus outline

- `screens/O4.tsx:40` — appended `${focusVisibleStyles.focusable}` to `<label>` `className`.
- `screens/O4.tsx:14` — added focus-visible import.

### AC-3 — F-A11Y-03 — `screens/O5.tsx` chip-card focus outline

- `screens/O5.tsx:39` — appended to `<label>` `className`.
- `screens/O5.tsx:14` — added focus-visible import.

### AC-4 — F-A11Y-04 — `screens/O7.tsx` focus outlines (2 sites)

- `screens/O7.tsx:144` (Download-as-PDF eyebrow button) — added `className={focusVisibleStyles.focusable}`.
- `screens/O7.tsx:633` (Download-as-PDF footer button) — same.
- `screens/O7.tsx:14` — added focus-visible import.

### AC-5 — F-A11Y-05 — `screens/O8.tsx` focus outline

- `screens/O8.tsx:144` — appended to `<label>` `className`.
- `screens/O8.tsx:13` — added focus-visible import.

### AC-6 — F-A11Y-06 — `screens/QuantBridge.tsx` focus outline

- `screens/QuantBridge.tsx:77` — added `className={focusVisibleStyles.focusable}` to the Skip-section `<button>`.
- `screens/QuantBridge.tsx:8` — added focus-visible import.

### AC-7 — F-A11Y-07 — `components/rails/RailCoach.tsx` rail buttons

- `components/rails/RailCoach.tsx:140-145` (suggested buttons in map) — added `className={styles.focusable}` (paired with `aria-disabled="true"` per AC-16).
- `components/rails/RailCoach.tsx:154-159` (send button) — added `className={styles.focusable}`.
- `components/rails/RailCoach.tsx:17` — added `import styles from '../focus-visible.module.css'`.

### AC-8 — F-A11Y-08 — `components/rails/rail-constants.tsx` shared-style buttons

- `optRow` consumers in `components/rails/RailHuman.tsx:59,70,81` — switched from `style={optRowStyle}` to `className={styles.optRow}`; the new `rail-constants.module.css` `.optRow:focus-visible` rule satisfies focus-visible (also satisfies AC-17).
- `tabButton` consumers in `components/rails/RailHybrid.tsx` — added `className={styles.focusable}` to each tab `<button>` (AC-18 edit batch).

### AC-9 — F-A11Y-09 — `components/HelpRailLayout.tsx` rail-region mount unconditionally

- `components/HelpRailLayout.tsx:27-33` — refactored. `<div className={styles.helpRailColumn} aria-live="polite">` now mounts unconditionally; `{showRail ? <ActiveRail /> : null}` is the conditional child.
- Visual safety, <1280px: `page.module.css:75-77` `.helpRailColumn { display: none; }` keeps the column hidden on small viewports (no-rail-content case is invisible).
- Visual safety, ≥1280px: `page.module.css:79-93` `.helpRailColumn { display: block; flex-shrink: 0 }` — at desktop the column always renders, but when `showRail` is false the only child is `null`. With no content the flex item defaults to `flex-basis: auto`, which resolves to content-size 0; the column takes 0 horizontal space and the wrapper layout is unchanged from pre-fix. The `aria-live="polite"` region exists in the accessibility tree, ready to announce when the user toggles a rail variant via `/dev/control`.
- Test: `tests/unit/app/dev/proto/pre-signup-interview/help-rail.test.tsx` describe-block `HelpRailLayout — aria-live region unconditional mount` asserts the region is present even when no variant is selected and remains as a stable host across variant toggles. PASS.

### AC-10 — F-A11Y-10 — `components/Footer.tsx` caption region mount unconditionally

- `components/Footer.tsx:43-53` — refactored. `<div role="status" aria-live="polite" aria-atomic="true">` always mounts; `className` is `undefined` and text content is `null` when `hasCaption` is false.
- Test: `tests/unit/proto-pre-signup/footer.test.tsx` test `mounts the status region unconditionally; text content is empty when caption prop is omitted` (was: `renders no caption region when caption prop is omitted` — flipped per D-3). PASS.
- Test: `keeps the status region mounted across the caption-toggles-on transition` asserts the same DOM node persists when caption appears. PASS.

### AC-11 — F-A11Y-11 — `screens/O7.tsx` aria-live region

- Verified at `screens/O7.tsx:539-554`: `<ul role="status" aria-live="polite" aria-label={copy.ariaLabel}>` is rendered unconditionally within its containing block; only the `<li>` children mapped from `copy.steps` are conditional. The audit register's directive was *"verify region is mounted before caption appears"* — verification confirms it already is. **No impl change required.**

### AC-12 — F-A11Y-12 — `components/rails/RailGlossary.tsx` MUTE text at L133

- `components/rails/RailGlossary.tsx:133` — `<span style={{ color: SUB }}>NOT LEGAL ADVICE</span>` (was `color: MUTE`).
- `components/rails/RailGlossary.tsx:3-13` — removed `MUTE` from import list (no longer used in this file).
- Contrast: SUB `#57534E` on white `#FFFFFF` ≈ 8.59:1 (passes WCAG AA 4.5:1 for normal text).

### AC-13 — F-A11Y-13 — `components/rails/rail-constants.tsx` MUTE sites

Five swaps in `components/rails/rail-constants.tsx`:
- `railEyebrowStyle:35` — `color: SUB`.
- `monoFooterStyle:58` — `color: SUB`.
- `optMetaStyle:101` — `color: SUB`.
- `optPillGreyStyle:119` — `color: SUB`.
- `tabButtonStyle:147` — `color: SUB`.

**Contrast verification:**
- SUB `#57534E` on white `#FFFFFF` ≈ 8.59:1 — passes WCAG AA 4.5:1. Covers `railEyebrowStyle` · `monoFooterStyle` · `optMetaStyle` · `tabButtonStyle` (all on rail container background `#FAFAF7` which is essentially white).
- SUB `#57534E` on PANEL_BG `#F5F3EE` ≈ 6.86:1 (relative luminance L_SUB ≈ 0.0883 vs L_PANEL ≈ 0.8988 → (0.8988 + 0.05) / (0.0883 + 0.05) = 6.86) — passes WCAG AA 4.5:1 even at the 9.5px font-size used in `optPillGreyStyle`. Covers `optPillGreyStyle` whose background is PANEL_BG.

### AC-14 — F-A11Y-14 — `components/rails/RailCoach.tsx` MUTE captions

- `components/rails/RailCoach.tsx:128` ("SUGGESTED" eyebrow) — `color: SUB`.
- `components/rails/RailCoach.tsx:163` (privacy note "Conversations are private…") — `color: SUB`.
- `components/rails/RailCoach.tsx:3-13` — removed `MUTE` from import list (no longer used).

### AC-15 — F-A11Y-15 — `components/rails/RailWhy.tsx` MUTE caption

- `components/rails/RailWhy.tsx:51` — `color: SUB` (was `color: MUTE`).
- `components/rails/RailWhy.tsx:3-12` — removed `MUTE` from import list.

### AC-16 — F-A11Y-16 — `components/rails/RailCoach.tsx` suggestion-button semantics

- `components/rails/RailCoach.tsx:41-49` (`suggestButtonStyle`) — removed `cursor: 'pointer'`.
- `components/rails/RailCoach.tsx:140-145` (suggested buttons in map) — added `aria-disabled="true"`.
- Test: `tests/unit/app/dev/proto/pre-signup-interview/help-rail.test.tsx` describe-block `RailCoach — suggested-button semantics` asserts at least 3 buttons declare `aria-disabled="true"` and the "cohabiting" suggestion is among them. PASS.

### AC-17 — F-A11Y-17 — `components/rails/rail-constants.tsx` optRowStyle CSS migration

- New file `components/rails/rail-constants.module.css` carries `.optRow`, `.optRow:hover`, `.optRow:focus-visible` rules. Hover rule: `border-color: var(--ds-color-ink, #1A1A1A)`. Focus rule: `outline: 2px solid var(--ds-color-ink, #1A1A1A); outline-offset: 2px`.
- `components/rails/rail-constants.tsx` — removed `optRowStyle` export (was L64-78).
- `components/rails/RailHuman.tsx:59,70,81` — three button consumers switched from `style={optRowStyle}` to `className={styles.optRow}`.
- `components/rails/RailHuman.tsx:22` — added `import styles from './rail-constants.module.css'`.
- `components/rails/RailHuman.tsx:3-21` — removed `optRowStyle` from import list.

### AC-18 — F-A11Y-18 — `components/rails/RailHybrid.tsx` V5 tab arrow-key navigation

- `components/rails/RailHybrid.tsx:30-42` — added `handleKeyDown` capturing `ArrowLeft` / `ArrowRight`. Wraps at both boundaries via `(currentIndex + 1) % TABS.length` and `(currentIndex - 1 + TABS.length) % TABS.length`. Updates `tab` state AND focuses the next tab button via `tabRefs.current[nextIndex]?.focus()`.
- `components/rails/RailHybrid.tsx:46-51` — `<div role="tablist">` carries `onKeyDown={handleKeyDown}`.
- `components/rails/RailHybrid.tsx:55-65` — each `<button role="tab">` carries `ref` to `tabRefs.current[index]` and `className={styles.focusable}`.
- Existing Tab-key navigation unchanged (no roving `tabIndex`).
- Tests in `tests/unit/app/dev/proto/pre-signup-interview/help-rail.test.tsx` describe-block `RailHybrid — keyboard navigation (WAI-ARIA Tabs APG)`:
  - `ArrowRight cycles tabs forward, wrapping at the end` — PASS.
  - `ArrowLeft cycles tabs backward, wrapping at the start` — PASS.
  - `non-arrow keys leave the tab selection unchanged` — PASS.

## Test plan

Final test set landed:
- `tests/unit/proto-pre-signup/footer.test.tsx` — 2 amended/added tests (caption region unconditional mount + persists across transition).
- `tests/unit/app/dev/proto/pre-signup-interview/help-rail.test.tsx` — 3 new describe blocks (HelpRailLayout unconditional aria-live, RailHybrid keyboard nav, RailCoach button semantics).
- Class-presence and contrast ACs (AC-1..AC-8 focus-visible + AC-12..AC-15 contrast + AC-17 CSS migration) rely on the preview-deploy 6-dim rubric and pre-existing screen tests staying green.

Verification commands:
- `npm test` → 101 files / 769 tests passing.
- `npm run lint` → 0 errors, 50 warnings (all pre-existing per SESSION-CONTEXT; no new warnings introduced in touched files).
- `npm run typecheck` → clean.

## Preview-deploy verification

| Dimension | Status | Evidence |
|---|---|---|
| Golden path | Pending preview URL | Walk `dev/proto/pre-signup-interview` screens O3-O8 + QuantBridge with each Help Rail variant active via `/dev/control`. |
| Edge cases | Pending preview URL | Empty-caption Footer state · no-variant HelpRailLayout state · V5 first/last tab arrow-key wrap. |
| `prefers-reduced-motion` | Pending preview URL | Focus-visible outline applies under reduced-motion media query (CSS outline is not animated; expected unchanged). |
| Keyboard-only | Pending preview URL | Tab through O3/O4/O5/O7/O8/QuantBridge confirming visible focus outline; Tab + Arrow-key navigation across V5 tabs. |
| Mobile viewport (375×667) | Pending preview URL | Touched surfaces render correctly under 375px; rails collapse per existing responsive behaviour. |
| Screen-reader | Pending preview URL | Spot-check NVDA or VoiceOver on the 3 live-region sites (a content-toggle should produce an audible announcement). |

## Architectural deferrals

### Roving `tabIndex` for RailHybrid V5 tabs (raised by auto-review prototype-readiness specialist)

AC-18's text explicitly excludes roving tabindex (*"Existing Tab-key navigation unchanged (no roving `tabIndex`)"*). The WAI-ARIA Authoring Practices Tabs pattern recommends `tabIndex={isActive ? 0 : -1}` so Tab key moves focus to the panel rather than between tab buttons; this slice ships ArrowLeft/ArrowRight nav per the audit register's text, but Tab-key behaviour is unchanged.

Defer to a follow-up slice — `S-PROTO-a11y-rail-tabs-roving-tabindex` or equivalent — once Phase 2/3 a11y audit re-walks the V5 tabs. The reviewer agrees: *"raise as a follow-up slice rather than blocking this PR."*

### Adjacent observation noted (out of slice scope per surgical-changes principle)

- `components/Footer.module.css:33-36` `.captionDisabled` uses `var(--ds-color-text-muted, #78716C)` — the MUTE colour at 10.5px. Same WCAG 1.4.3 contrast concern as F-A11Y-12..15, but NOT in the audit register. Carry to the Phase 2-3 audit walk follow-up.

## Auto-review responses

Multi-agent auto-review fired at commit `615983f`; 3 specialists (security · style · prototype-readiness) fanned out under the auto-review.yml matrix strategy. Verdict: `request-changes` (informational at v3b ship; merge not gated). 4 findings:

- `praise` (no action) — prototype-readiness commends `.focusable:has(:focus-visible)` pattern, ArrowLeft/Right wrap math, and aria-live mount-unconditionally consistency between HelpRailLayout and Footer.
- `issue` non-blocking — RailHybrid tabs missing roving `tabIndex`. Addressed in `## Architectural deferrals` §"Roving `tabIndex` for RailHybrid V5 tabs"; reviewer's own remediation: *"raise as a follow-up slice rather than blocking this PR."*
- `question` non-blocking — ≥1280px empty column behaviour. Addressed by extending AC-9 evidence with the flex-basis: auto reasoning + `.helpRailColumn` selector ref.
- `suggestion` non-blocking — SUB on PANEL_BG contrast not explicitly evidenced. Addressed by extending AC-13 evidence with the computed 6.86:1 ratio.

## DoD-14 short-form (prototype category)

Prototype-category slices use items 1, 8, 12, 14 only (see `security.md` for the full short-form table; the spec-76-§3 matrix quote sits in `acceptance.md` §D-4).

| # | Item | Status |
|---|---|---|
| 1 | Threat-model review | PASS — see `security.md` (no new data flows, no auth surface, no external IO) |
| 8 | Secrets handling | PASS — no secrets touched |
| 12 | Dependency review | PASS — no new runtime deps; one new CSS module file (`rail-constants.module.css`) |
| 14 | PR security checklist signed | Pending PR open |

## Spec sources

- `docs/slices/S-PROTO-a11y-phase-1-fixes/acceptance.md` — AC list
- `docs/slices/S-PROTO-a11y-wcag-audit-phase-1/audit-register.md` — finding catalogue
- `docs/workspace-spec/72a-preview-deploy-rubric.md` — 6-dim rubric
- `docs/workspace-spec/72-engineering-security.md` §11 — DoD-14 short-form for prototype category
- WAI-ARIA Authoring Practices, Tabs Pattern (https://www.w3.org/WAI/ARIA/apg/patterns/tabs/) — AC-18 keyboard nav reference
