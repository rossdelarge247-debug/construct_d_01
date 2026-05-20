# S-PROTO-a11y-wcag-audit-phase-1

**Category:** prototype

## What

Phase 1 of the system-wide a11y pass (the partition labelled P1 in `docs/SESSION-CONTEXT.md`): a WCAG 2.1 AA audit walk across all prototype surfaces, producing an audit register at `docs/slices/S-PROTO-a11y-wcag-audit-phase-1/audit-register.md`. Per-finding fixes ship as follow-up sub-slices (see §"Follow-up slices" below) — this slice ships the audit register only so the follow-up work has a complete, prioritised plan to consume.

The audit register catalogues all 8 inherited deferrals from the two parent Help Rail slices plus any new findings the walk surfaces. Each register row carries a WCAG criterion + severity + disposition (`fix-this-slice` in a follow-up sub-slice · `defer-phase-2-responsive` · `defer-phase-3-sr` · `defer-phase-4-rubric` · `defer-out-of-scope`).

## In scope

- WCAG 2.1 AA audit walk across: 12 pre-signup screens (O1-O8 + Q-bridge + O6.5/6.6/6.7) + 20 shared components (chassis primitives, interactive primitives, layout) + 5 Help Rails (V1-V5)
- Audit register catalogues every finding with WCAG criterion, file + line, severity tier, disposition, and verbatim source-quote where applicable
- Full coverage of the 8 inherited deferrals (4 prototype-readiness from `docs/slices/S-PROTO-help-rail-desktop-variants/verification.md` L97 + 4 architectural from `docs/slices/S-PROTO-help-rail-V4-V5/verification.md` L97-100) — each gets an explicit register row even when disposition is `defer-out-of-scope`

## Out of scope

- **All fixes** — every finding flagged `fix-this-slice` ships in a follow-up sub-slice (see §"Follow-up slices"). This slice ships the catalogue, not the resolutions.
- Responsive breakpoint review (480-1280px intermediate + above-1320px utilisation) — deferred to Phase 2 of the system-wide a11y pass
- Full NVDA + VoiceOver screen-reader walk — deferred to Phase 3
- Full 6-dim preview-deploy rubric exercise across all surfaces — deferred to Phase 4
- V4 option-row `onClick` wiring (parent V4-V5 slice's deferral 3) — feature work, not a11y; wires when a variant graduates to a fuller surface
- D-2 canvas-literal compact V5 tab content (parent V4-V5 slice's deferral 4) — design decision, held open for post-deploy team review
- Dashboard surfaces — none yet on main per `docs/SESSION-CONTEXT.md` § "Current pre-signup prototype URL"

## Acceptance criteria

### AC-1 — WCAG 2.1 AA audit register

Produce `docs/slices/S-PROTO-a11y-wcag-audit-phase-1/audit-register.md` with one row per finding across all prototype surfaces (12 screens + 20 components + 5 rails). Each row carries:

- Finding ID (`F-A11Y-NN`)
- WCAG 2.1 success criterion reference (`1.4.3 Contrast (Minimum)`, `2.4.7 Focus Visible`, `4.1.2 Name, Role, Value`, etc.)
- File + line range
- Severity tier (`A` blocking · `AA` blocking · `AAA` recommended)
- Disposition (`fix-this-slice` · `defer-phase-2-responsive` · `defer-phase-3-sr` · `defer-phase-4-rubric` · `defer-out-of-scope`)
- Verbatim quote of the offending pattern where applicable

The audit covers all 4 categories from the parent slices' deferral lists so each carries an explicit register row even if the disposition is "non-a11y feature work, defer-out-of-scope". The register surfaces new findings the walk identifies.

## Follow-up slices

Each finding in the audit register routes to one of the planned follow-up sub-slices. Names are scaffolding — adjust at scope time:

- **`S-PROTO-a11y-focus-visible-sweep`** — addresses F-A11Y-01..08 (focus-visible coverage on inline-styled interactive elements; WCAG 2.4.7). Apply shared `components/focus-visible.module.css` or migrate to CSS modules per finding.
- **`S-PROTO-a11y-aria-live-regions`** — addresses F-A11Y-09..11 (ARIA live-region conditional-rendering refactor; WCAG 4.1.3). Mount live regions unconditionally; nest conditional content as child.
- **`S-PROTO-a11y-contrast-mute`** — addresses F-A11Y-12..15 (`MUTE` colour contrast on small text; WCAG 1.4.3). Decide per-site between font-size bump and colour shift.
- **`S-PROTO-a11y-rail-specifics`** — addresses F-A11Y-16..18 (RailCoach suggested-button semantics + `opt-row` hover CSS migration + V5 tab arrow-key navigation; WCAG 4.1.2 · 2.1.1 · WAI-ARIA Tabs APG).

## Design decisions

### D-1 — Audit-only slice partition

The system-wide a11y pass (P1 in SESSION-CONTEXT) was partitioned at session start into 4 phases: Phase 1 = WCAG audit + targeted fixes; Phase 2 = responsive review; Phase 3 = SR walk; Phase 4 = 6-dim rubric. Mid-session, audit-walk depth + finding-quote rigour put the slice close to the session line-count threshold before any fix-impl. Re-scoped to audit-register-only ship so the catalogue is complete, prioritised, and consumable by follow-up sub-slices without partial-state risk.

The trade-off: the user signed up for "WCAG audit + targeted fixes". Honest re-scope (per CLAUDE.md §"Engineering conventions" §"Definition of Done": *"A partially-done slice is not shipped; it's re-scoped and re-planned"*) ships the audit as a standalone deliverable. Follow-up sub-slices have unambiguous inputs from the register's per-finding rows.

### D-2 — Two parent-slice deferrals are not a11y

V4 option-row `onClick` (the parent V4-V5 slice's deferral 3) and D-2 canvas-literal compact V5 tab content (the parent slice's deferral 4) are not WCAG findings — they're feature wiring and design-decision deferrals respectively. The audit register includes both with `defer-out-of-scope` disposition + the rationale recorded inline.

### D-3 — Slice category `prototype`, DoD-14 short-form

Per CLAUDE.md §"Slice categories" path-default for `src/app/dev/proto/**`. Security DoD short-form items 1, 8, 12, 14 only — see `security.md`. The audit slice itself produces no `src/` touch; the inherited preview-deploy deferral applies trivially.

## Pre-flight

- `acceptance.md` is under 300 lines so adversarial review runs single-turn per `docs/workspace-spec/72b-adversarial-review-budget.md` table row: *"<300 lines | any | Single-turn (status quo) | Fits in one read-cap window; no orchestration overhead."* Multi-agent auto-review fires on PR open via `.github/workflows/auto-review.yml`.

## Spec sources

- `docs/SESSION-CONTEXT.md` §"P1 detail — System-wide preview-deploy + accessibility pass" + §"Inputs" — partition justification + 8 inherited deferrals listed
- `docs/slices/S-PROTO-help-rail-desktop-variants/verification.md` §"Architectural deferrals" L97 — verbatim prototype-readiness deferrals from the parent slice
- `docs/slices/S-PROTO-help-rail-V4-V5/verification.md` §"Architectural deferrals" L97-100 — verbatim architectural deferrals from the parent V4-V5 slice
- `docs/workspace-spec/72a-preview-deploy-rubric.md` — 6-dim rubric scope reference (Phase 2-4 partition source)
- WCAG 2.1 Quick Reference (https://www.w3.org/WAI/WCAG21/quickref/) — success-criterion reference for audit register
- WAI-ARIA Authoring Practices, Tabs Pattern (https://www.w3.org/WAI/ARIA/apg/patterns/tabs/) — arrow-key navigation reference for the follow-up rail-specifics slice
- CLAUDE.md §"Slice categories" — prototype path-default + DoD-14 short-form
- CLAUDE.md §"Engineering conventions" §"Definition of Done" — the re-scope rationale for D-1
