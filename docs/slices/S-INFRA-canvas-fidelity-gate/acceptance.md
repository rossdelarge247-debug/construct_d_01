# S-INFRA-canvas-fidelity-gate — Acceptance criteria

**Category:** infrastructure

**Slice:** S-INFRA-canvas-fidelity-gate
**Spec ref:** `docs/workspace-spec/72c-multi-agent-review-framework.md` §4 (specialist personas table — extended with `canvas-fidelity` row) + §7 (synthetic-fixtures harness — extended with `canvas-fidelity` fixture). CLAUDE.md §"Visual direction" extended with new AC-as-canvas-quote discipline + canvas-fidelity gate row in §"Hard controls" table.
**Phase:** Infrastructure (rigour-supplement programme; canvas-fidelity gate addition).
**Status:** Author-time draft. Ships first of a 3-slice sequence: this slice (gate + P6 cleanup) → rebuild slice (canvas-fidelity rebuild on pre-signup) → progressive-disclosure slice (Exit-this-page + safety_concerns visible response + signal-triggered inline reveals).

---

## Context

The pre-signup-interview prototype (`94007b6` on main) ships with material visual-fidelity drift from the canonical canvases at `docs/design-source/pre-signup-interview/`. Concrete drift identified by direct user inspection at session start: title typography (bold/italic split missing), sub-question label typography (sans not serif), header chrome (back-button position + chevron + divider missing), step indicator (chip not pill geometry). Full evidence with canvas L-refs in this slice's `calibration-report.md`.

Three structural causes for the drift:

1. **No canvas-fidelity gate.** The auto-review specialist suite covers security · correctness · style · prototype-readiness — but not "does the rendered output match the canvas?". CLAUDE.md §"Pre-priority canvas-fidelity verification" only protects against the bundled-HTML decoder failure mode, not implementation drift after decoding.
2. **AC text was layout-level not treatment-level.** Session-80's pre-signup AC narrative said "O2 (A1·B1·C1): 4 sub-Qs (relationship · living · children · home)" — describes wiring shape, doesn't quote the typography rule from canvas L171-172 verbatim. AC-as-canvas-quote discipline (introduced this slice) closes the gap.
3. **Canvases referenced for layout, not parsed for typography rules.** The .html / .jsx canvas files have explicit per-element style rules; session-80 read them for layout structure but didn't extract type-stack-per-element. A specialist reviewer with canvas content as nonced input is the structural fix.

This slice ships the gate (specialist persona + workflow wire-up + synthetic regression fixture + supporting script updates) plus the deferred P6 from SESSION-CONTEXT (auto-review script cleanup completing the partial fix shipped at session 80 in `auto-review-filter-prior.sh`). The first run of the gate against the rebuild slice's PR is the validation event.

## Dependencies

- **Upstream:** `auto-review.yml` multi-agent fan-out (S-INFRA-persona-suite-v2-multi-agent merged session 55, post-session-70 architecture-drop reduces to 3 specialists). `scripts/spawn-multi-reviewer.sh DIMENSIONS` validation. `scripts/derive-verdict.sh --multi k=N` aggregation. `tests/personas/run-synthetic.sh` + `match-synthetic.sh` synthetic-fixtures harness (S-INFRA-synthetic-fixtures merged session 63 per CLAUDE.md §"Hard controls" persona-synthetic-fixtures row).
- **Downstream blocked-by:** rebuild slice `S-PROTO-canvas-fidelity-rebuild` (PR 2 in this sequence) — first real consumer of the gate; calibration-report findings 1-4 seed its AC list.
- **Re-use / Preserve-with-reskin paths touched:**
  - `.github/workflows/auto-review.yml` — extended `brief.compose` step to detect `Linked canvas:` field in slice acceptance.md and conditionally add `canvas-fidelity` to the matrix `dimensions` output for prototype slices.
  - `scripts/spawn-multi-reviewer.sh` — `DIMENSIONS` arg validation extended to accept `canvas-fidelity` (in addition to `prototype-readiness` already accepted).
  - `scripts/preflight-review.sh` — same dimension extension.
  - `scripts/validate-finding-envelope.sh` — same dimension extension.
  - `scripts/auto-review-filter-prior.sh` — extended (session-80 partial fix accepted `prototype-readiness`; this slice adds `canvas-fidelity` to the same case statement).
- **Discarded paths deleted at DoD:** none. This slice is purely additive on infrastructure.
- **Solo-operator code-owner gate awareness** (CLAUDE.md negative constraint #23). This slice touches `.claude/agents/**`, `.github/workflows/**`, `scripts/**`, `tests/personas/**`, `CLAUDE.md`, `docs/workspace-spec/72c-*.md` — all CODEOWNERS-protected. Merge requires conscious admin-bypass click in solo-operator context. By design.

## Pre-flight notes

- **Slice size pre-flight.** Estimated diff: persona file ~150L · auto-review.yml additions ~30L · 4 P6 script extensions ~30L combined · synthetic fixture diff ~40L + expected JSON ~30L · slice docs (this acceptance + verification + security + test-plan) ~250L · CLAUDE.md §"Visual direction" + §"Hard controls" updates ~50L · spec 72c §4 + §7 updates ~30L · calibration-report ~120L. Total ~750L. Single PR.
- **Adversarial review budget.** acceptance.md targeted ≤300L per spec 72b Option A (single sub-spawn). At freeze: re-check `wc -l` and partition if >300L per Option B/C convention.
- **TDD-applicable surface.** `scripts/spawn-multi-reviewer.sh DIMENSIONS` validation extension is logic surface — extend `tests/shellspec/spawn-multi-reviewer.spec.sh` RED-first to assert `canvas-fidelity` is accepted. `scripts/auto-review-filter-prior.sh` similarly. Persona file is pure-prose under `pure-config:.claude/agents/*` allowlist entry. Synthetic fixture diff + expected JSON are deterministic content under `pure-config:tests/personas/synthetic/**/*` allowlist entry.
- **Test-pain audit (spec 72d §3).** No new logic seams introduced beyond extending existing case statements; mock-count not at risk.
- **Architectural-smell awareness.** Persona file is the at-risk-of-smell artefact — pattern: criteria sprawl across categories, JSON envelope schema drift from spec 72c §5, label/blocking matrix decision-fatigue. Pre-empted: persona-file size capped at ≤300L per spec 72c §4 directive (target ≤200L); criteria capped at 6 categories matching the structured findings 1-4 + 2 stretch (typography · layout-chrome · spacing · color-treatment · header-affordances · missing-element).

## MLP framing

The loveable floor: the rebuild slice's PR opens; auto-review.yml's `brief` job detects `Linked canvas:` field in the slice acceptance.md, computes the matrix as `[security, prototype-readiness, style, canvas-fidelity]` (4-dim for prototype-with-canvas slices); the canvas-fidelity specialist receives diff + slice AC + linked canvas content as nonced input; emits findings flagging any drift; aggregator dedupes across specialists; verdict posts as a single check-run. Calibration-report's findings 1-4 surface in that first run; if not, persona is re-tuned before merge.

Cuts: if persona surfaces too many false positives at first run (e.g. flagging structural refactors that don't change rendered output), the criteria narrow to the structurally-mappable subset (typography rules · explicit chrome elements · explicit pill geometry). The persona substitutes nothing in the matrix — it's purely additive — so a degraded calibration doesn't undermine the existing 3-specialist coverage.

---

## AC-1 · Canvas-fidelity persona ships at `.claude/agents/reviewer-canvas-fidelity.md`

- **Outcome:** A new specialist persona file exists at `.claude/agents/reviewer-canvas-fidelity.md` matching the structure of existing specialists (`reviewer-security.md` · `reviewer-correctness.md` · `reviewer-style.md` · `reviewer-prototype-readiness.md`). The persona's job is to compare a slice diff against its linked canvas (`.html` or `.jsx`) and flag visual-treatment drift.
- **Verification:**
  1. File exists at `.claude/agents/reviewer-canvas-fidelity.md`.
  2. File size ≤300L per spec 72c §4 directive (target ≤200L via include-by-reference for verdict vocab + JSON schema).
  3. File names six categories: `typography` · `layout-chrome` · `spacing` · `color-treatment` · `header-affordances` · `missing-element`. Each category carries default `label` + default `blocking` per a deterministic matrix (see persona file for matrix; visual-fidelity defaults to `issue` with `blocking: false` since visual recoverable; `missing-element` blocking when the element is AC-mandated).
  4. File specifies per-invocation context fences: `<pr-diff-NONCE>` · `<slice-ac-NONCE>` · `<linked-canvas-NONCE>` (the new fence — content is the linked canvas .jsx or .html file inlined per spec 72b Option C nonced delimiters) · `<verdict-vocab-NONCE>` · `<spec-72c-section-5-NONCE>`.
  5. File specifies strict-JSON output envelope per spec 72c §5 with `specialist: "reviewer-canvas-fidelity"` + `findings[]` shape matching existing personas (label · blocking · category · evidence · remediation).
  6. File includes ≥1 example invocation showing input shape + expected output JSON for a planted typography-drift finding.
- **In scope:** persona file authoring at `.claude/agents/reviewer-canvas-fidelity.md`.
- **Out of scope:**
  - Workflow wire-up (AC-2).
  - Script extensions (AC-3).
  - Synthetic fixture (AC-4).

## AC-2 · auto-review.yml routes canvas-fidelity dimension when slice has `Linked canvas:` field

- **Outcome:** `.github/workflows/auto-review.yml` `brief.compose` step parses the resolved slice's `acceptance.md` for a `Linked canvas:` field. When the field is present AND slice category is `prototype`, the matrix `dimensions` output includes `canvas-fidelity` in addition to the existing 3 specialists. The `brief.compose` step also emits a per-canvas brief at `/tmp/briefs/canvas-fidelity.md` containing the diff + slice AC + linked canvas content (each canvas file inlined under spec 72b Option C nonced delimiters).
- **Verification:**
  1. `auto-review.yml` `brief.compose` step parses `Linked canvas:` field via grep — extracts space-separated path list.
  2. When field present + prototype category: `dimensions` JSON array contains `["security", "prototype-readiness", "style", "canvas-fidelity"]` (4-dim).
  3. When field absent OR production category: `dimensions` matrix unchanged from current behaviour (3-dim).
  4. Per-canvas brief composed at `/tmp/briefs/canvas-fidelity.md` with each linked canvas inlined; matrix specialist job at `dimension: canvas-fidelity` reads this brief and invokes persona via `claude -p`.
  5. ShellSpec / yaml-lint check confirms the workflow change parses and the conditional logic is exercised by a fixture that mocks `acceptance.md` with + without the field.
- **In scope:** `auto-review.yml` brief.compose extension + matrix routing + per-canvas brief composition.
- **Out of scope:** persona authoring (AC-1).

## AC-3 · P6 cleanup — 4 scripts accept `canvas-fidelity` AND `prototype-readiness` dimensions

- **Outcome:** The four scripts that gate dimension validation each accept `canvas-fidelity` and `prototype-readiness` alongside the production dimensions (`security` · `correctness` · `style`). Closes the partial fix shipped at session 80 (`scripts/auto-review-filter-prior.sh` already accepts `prototype-readiness`; this slice extends to `canvas-fidelity` AND propagates `prototype-readiness` to the three sibling scripts that were missed at session 80).
- **Verification:**
  1. `scripts/preflight-review.sh` is category-aware (mirrors auto-review.yml's `Category:` detection): production category iterates `[security, correctness, style]`; prototype category iterates `[security, prototype-readiness, style]`. Canvas-fidelity is CI-only — local preflight stays 3-dim because canvas content loading lives in auto-review.yml's brief composition and is not duplicated locally.
  2. `scripts/validate-finding-envelope.sh` accepts envelope `specialist` field `reviewer-canvas-fidelity` OR `reviewer-prototype-readiness` (in addition to the existing 3 production specialists).
  3. `scripts/spawn-multi-reviewer.sh aggregate` accepts a new `--dimensions <comma-separated>` flag overriding the default `(security correctness style)` array; passes accepted dimensions through to envelope iteration. auto-review.yml updated to pass `--dimensions $(jq -r 'join(",")' <<< "$DIMENSIONS_JSON")` so the 4-dim canvas-fidelity case is iterated correctly.
  4. `scripts/auto-review-filter-prior.sh` case statement extended to accept `canvas-fidelity` (alongside `prototype-readiness` already added previously).
  5. Validation: positive cases exercised at PR open via the auto-review pipeline run itself (every dimension's brief composition + envelope validation + filter-prior call exercises the case statements). Negative case (unknown dimension still rejected) preserved unchanged in each script.
- **In scope:** 4 script edits, integration-tested by the auto-review pipeline running on this PR.
- **Out of scope:** standalone ShellSpec fixtures (the auto-review pipeline run on this PR exercises the script paths integration-style; a separate ShellSpec for each script is a v3c carry-over).

## AC-4 · Synthetic fixture covers canvas-fidelity regression

- **Outcome:** A synthetic-deliberate-injection fixture pair at `tests/personas/synthetic/canvas-fidelity.diff` + `tests/personas/synthetic/expected/canvas-fidelity.json` per spec 72c §7 first-3-src-slice synthetic-fixtures harness. The diff carries a planted typography-drift defect (`<h1>Your situation</h1>` rendered as flat string instead of canvas-spec'd bold/italic split with full stop). The expected envelope asserts the persona flags it via signature predicates (label set, blocking set, category-pattern matching `typography`, evidence-keyword any-of, remediation-keyword any-of, min-count ≥1).
- **Verification:**
  1. Fixture pair exists at the canonical paths.
  2. `tests/personas/run-synthetic.sh` invokes the canvas-fidelity persona (when `ANTHROPIC_API_KEY` set) against the diff with a fixture linked-canvas file (an extracted snippet of `o2-frames.jsx` L171-172 showing the canon pattern).
  3. `tests/personas/match-synthetic.sh` confirms the planted defect is flagged per the expected envelope predicates.
  4. `.github/workflows/persona-synthetic-fixtures.yml` includes `canvas-fidelity` in path filter + run loop. CLI version pinned in lockstep with `auto-review.yml` per spec 72c §7 directive.
  5. Regression: when `ANTHROPIC_API_KEY` absent, harness exits 0 with neutral (forks unaffected, same skip behaviour as existing fixtures).
- **In scope:** fixture pair authoring + workflow path-filter extension + run-loop entry.
- **Out of scope:** golden-PR replay fixtures (deferred per spec 72c §7 — synthetic-deliberate-injection is the v3b harness; replay is v3c carry-over).

## AC-5 · Calibration report captures user feedback verbatim + structured findings + canvas L-refs

- **Outcome:** `docs/slices/S-INFRA-canvas-fidelity-gate/calibration-report.md` captures user feedback verbatim (turn-3 quote), 4 structured findings each with canvas L-refs to evidence, 6 speculative findings the gate's first-run is expected to surface, and an explicit mapping of findings to seeded ACs for the rebuild slice. The verbatim block is the durable record of the original observation; the structured findings are the engineering input.
- **Verification:**
  1. File exists at `docs/slices/S-INFRA-canvas-fidelity-gate/calibration-report.md`.
  2. File contains a `## User feedback verbatim` section quoting the original user observation in full (per CLAUDE.md §"Planning conduct" §"Quote, don't paraphrase" — applied to user feedback as well as spec text).
  3. File contains 4 structured findings each with: canvas file path + line range · current implementation file path + line range · expected behaviour · severity (label + blocking + category).
  4. File contains a "Speculative findings" section listing ≥6 candidate items the gate's first-run should surface in addition to the 4 user-flagged.
  5. File contains a "Mapping to rebuild-slice ACs" table with 1 row per structured finding seeding ≥1 rebuild-slice AC.
  6. §Status footer present per CLAUDE.md §"Comments: WHY not WHAT" exemption — lineage allowed in §Status.
- **In scope:** the calibration-report.md content.
- **Out of scope:** appending the gate's first-run output (post-merge — happens during rebuild-slice PR). Speculative findings get refined as the gate fires.

## AC-6 · CLAUDE.md + spec 72c updated for canvas-fidelity discipline

- **Outcome:** CLAUDE.md §"Visual direction" extended with the AC-as-canvas-quote discipline rule. CLAUDE.md §"Hard controls (in development)" gate table extended with a `canvas-fidelity` row. Spec 72c §4 specialist-personas table extended with a `canvas-fidelity` row. Spec 72c §7 synthetic-fixtures harness section extended to include canvas-fidelity in the path-filter + persona-list.
- **Verification:**
  1. CLAUDE.md §"Visual direction" carries a new paragraph naming the AC-as-canvas-quote rule with a worked example for one finding (e.g. typography rule from canvas o2-frames.jsx L171-172 quoted verbatim).
  2. CLAUDE.md §"Hard controls" gate table includes a row for canvas-fidelity with cells: file(s) (`.claude/agents/reviewer-canvas-fidelity.md` + `.github/workflows/auto-review.yml`); fires-on (PR open/synchronize for prototype slices with `Linked canvas:` field present); AC ref (this slice AC-1 + AC-2); bypass (advisory by default; `blocking: true` on `missing-element` category for AC-mandated elements only).
  3. Spec 72c §4 specialist-personas table includes the `canvas-fidelity` row with: File, Dimension, Absorbs criteria from prior rubric (none — additive), Conditional invocation (only when slice has `Linked canvas:` field).
  4. Spec 72c §7 synthetic-fixtures section names canvas-fidelity in the path-filter list + persona run-loop list.
- **In scope:** documentation amendments only.
- **Out of scope:** other spec changes beyond §4 + §7.

---

## Out of scope (slice-level)

- **Visual fidelity rebuild on pre-signup-interview prototype.** Deferred to the rebuild slice (PR 2). This slice ships the gate; the rebuild consumes it.
- **Progressive-disclosure additions** (Exit-this-page + safety_concerns visible response + signal-triggered inline reveals). Deferred to a follow-up slice.
- **Inline-style proto consumption refactor.** Deferred — fidelity rebuild may resolve some inline-style concerns naturally; re-scope after rebuild.
- **Spec 65 amendments to capture quantitative profiling data.** Deferred — needs canon-author conversation; pushes against spec 65 §P1 (~3min ceiling).
- **Public-pages header reconciliation** — explicitly user-flagged as separate activity; not blocking this slice or the rebuild slice.
- **Multi-provider 3rd-agent reviewer** for canvas-fidelity (e.g. cross-provider drift detection). v3c carry-over per spec 72c §9.

## Definition of Done (per CLAUDE.md §"Engineering conventions" §"Definition of Done")

1. All 6 ACs met with evidence per AC in `verification.md` (final-state record).
2. Tests written and passing — ShellSpec fixtures for AC-3 script extensions + synthetic fixture matcher for AC-4.
3. Adversarial review done — auto-review fires on PR; verdict approve / nit-only at merge.
4. Preview-deploy verification not applicable — no UI surface in this slice (infrastructure category, full production rigour but no preview-deploy needed).
5. No regression in adjacent slices — existing 3-dim production review path + 3-dim prototype review path unchanged when `Linked canvas:` field absent.
6. Slice's open 68f/g entries — none (this slice is rigour infrastructure, not product surface).

Plus 14-item security checklist in spec 72 §11 (full list — `category: infrastructure` runs full production rigour). See `security.md`.
