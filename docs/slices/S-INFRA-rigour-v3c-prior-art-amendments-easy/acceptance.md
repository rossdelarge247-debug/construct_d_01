# S-INFRA-rigour-v3c-prior-art-amendments-easy

**STATUS: in-progress** — AC-1 through AC-4 ship in this PR; AC-5 through AC-7 carry scope-marker only (full AC draft lands when each sub-slice begins).

**Scope marker** (per `.claude/agents/slice-reviewer.md` criterion 2 §Exception (b) — deferred-slice scope-marker update):

- **AC-1 through AC-4** — citation + "100% rule" rename — IN SCOPE for this PR
- **AC-5 through AC-7** — Conventional Comments verbatim · ESLint `--suppress-all` migration · jest-axe + axe-playwright + Storybook test-runner — DEFERRED to follow-on PRs (each requires design + multi-file changes; some carry control-plane risk requiring `control-change` label)
- **3 simplifications** (CODEOWNERS migration · pre-commit-verify deprecation · arch-smell reframe) — explicitly out-of-scope per `docs/SESSION-CONTEXT.md` §"Session 50 priorities §P0b-structural"

## Background

Session-49 prior-art audit (research subagent #2) scanned 15 controls A-O of the rigour suite against industry prior art. Reading list shipped via spec 72c §10 (commit `79014a3`, PR #37). Audit findings split as 5 enhancements + 3 simplifications + 4 citations across the 15 controls.

The audit's enhancement framing for items D and E overlaps with the citation framing — collapsed to single ACs in this slice (7 unique ACs total: 4 IN-SCOPE + 3 DEFERRED).

| Audit ID | AC in this slice | Status |
|---|---|---|
| A (citation) | AC-1 | IN SCOPE |
| D (citation + enhancement; same target) | AC-2 | IN SCOPE |
| E (citation + enhancement-rename) | AC-3 | IN SCOPE |
| F (citation) | AC-4 | IN SCOPE |
| N (enhancement) | AC-5 | DEFERRED |
| I (enhancement) | AC-6 | DEFERRED |
| O (enhancement) | AC-7 | DEFERRED |

## Acceptance criteria

### AC-1 (audit-A — citation): TDD where tractable cites Hillel Wayne — IN SCOPE

`CLAUDE.md` §"Engineering conventions" §"TDD where tractable" appends citation to [Hillel Wayne, "I have complicated feelings about TDD"](https://buttondown.com/hillelwayne/archive/i-have-complicated-feelings-about-tdd-8403/).

**Rationale**: Wayne's framing — "TDD is a calibration tool for your sense of code, not a universal mandate" — matches CLAUDE.md's bail-out categories (`pure-visual-ui`, `pure-rename`, `pure-config`) which encode "good for some code, bad for others."

**Verification**:
- `grep -c "Hillel Wayne" CLAUDE.md` ≥ 1
- `grep -c "buttondown.com/hillelwayne" CLAUDE.md` ≥ 1

### AC-2 (audit-D — citation + enhancement, collapsed): Snapshot before refactor cites Mikado — IN SCOPE

`CLAUDE.md` §"Engineering conventions" §"Snapshot before refactor" appends citation to the [Mikado method](https://understandlegacycode.com/blog/a-process-to-do-safe-changes-in-a-complex-codebase/).

**Rationale**: Mikado is prepare-and-revert-on-failure discipline for safe legacy changes. CLAUDE.md's snapshot-before-refactor applies the same checkpoint discipline to single-PR refactors (>~50 lines or 2+ files).

**Verification**:
- `grep -c "Mikado" CLAUDE.md` ≥ 1
- `grep -c "understandlegacycode.com" CLAUDE.md` ≥ 1

### AC-3 (audit-E — citation + enhancement-rename, collapsed): "AC arithmetic check" → "100% rule (AC arithmetic)" + PMI WBS cite — IN SCOPE

`CLAUDE.md` §"Engineering conventions" §"AC arithmetic check" renamed to §"100% rule (AC arithmetic)" with citation to the [PMI WBS 100% rule](https://www.workbreakdownstructure.com/100-percent-rule-work-breakdown-structure).

**Rationale**: PMI WBS 100% rule — every WBS element accounts for 100% of the work, not 90%, not 110%. CLAUDE.md's `Σ in-scope rows = total rows` constraint applies the same principle to AC slicing.

**Forward-only rename**: Historical references to the old name in `docs/HANDOFF-SESSION-30.md`, `docs/HANDOFF-SESSION-31.md`, `docs/slices/S-INFRA-rigour-v3b-subagent-suite/audit-findings.md`, and `docs/slices/S-F7-alpha-contracts-dev-mode/acceptance.md` (4 occurrences total) are intentionally **left unchanged** per CLAUDE.md §"Surgical changes" — historical handoffs and dated slice docs accurately reflect the rule's name at time-of-writing; retroactive rename would falsify the historical record.

**Verification**:
- `grep -c "100% rule" CLAUDE.md` ≥ 1
- `grep -c "workbreakdownstructure.com" CLAUDE.md` ≥ 1
- `grep -c "AC arithmetic check" CLAUDE.md` = 0 (renamed)
- `grep -rn "AC arithmetic check" docs/HANDOFF-SESSION-30.md docs/HANDOFF-SESSION-31.md docs/slices/` returns the 4 expected historical hits (forward-only rename intent honoured)

### AC-4 (audit-F — citation): Plan-vs-spec cross-check cites Cline Plan/Act + Ronacher Plan Mode — IN SCOPE

`CLAUDE.md` §"Planning conduct" §"Plan-vs-spec cross-check before executing" appends citation to [Cline Plan/Act mode](https://docs.cline.bot/features/plan-and-act) + [Armin Ronacher, "What is Plan Mode?"](https://lucumr.pocoo.org/2025/12/17/what-is-plan-mode/).

**Rationale**: Both prior-art sources document explicit plan-then-execute separation. CLAUDE.md's plan-vs-spec cross-check (prompt-discipline at L180) + the Hard-controls Plan-time-review gate (L249) together implement the same idea — cross-check is the prompt-time half; the gate is the subagent-enforced half.

**Verification**:
- `grep -c "Cline" CLAUDE.md` ≥ 1
- `grep -c "Plan Mode" CLAUDE.md` ≥ 1
- `grep -c "lucumr.pocoo.org" CLAUDE.md` ≥ 1

### AC-5 (audit-N — enhancement): Conventional Comments verbatim — DEFERRED (scope-marker only)

**Scope marker only — full AC draft lands when this AC begins (separate PR).**

Replace the verdict vocabulary at `CLAUDE.md` §"Verdict vocabulary" — currently `approve / nit-only / request-changes / block × architectural / logic / style / none` — with [Conventional Comments verbatim](https://conventionalcomments.org/): `praise / nitpick / suggestion / issue / question / thought × (blocking)`.

**Touches**:
- `CLAUDE.md` §"Verdict vocabulary" (~10L)
- `.claude/agents/slice-reviewer.md` (output schema)
- `.claude/agents/acceptance-gate.md` (output schema)
- `.claude/agents/ux-polish-reviewer.md` (output schema)
- `docs/workspace-spec/72c-multi-agent-review-framework.md` §5 (verdict-aggregation rule)

**Risk**: Control-plane (`.claude/agents/`) → `control-change` label required. Persona-prompt rewrites need verdict-coercion fixture refresh. Spec 72c §5 aggregation logic (`max(severity)`) needs re-design under Conventional Comments' `(blocking)` tag instead of severity scale.

### AC-6 (audit-I — enhancement): ESLint `--suppress-all` + `eslint-suppressions.json` — DEFERRED (scope-marker only)

**Scope marker only — full AC draft lands when this AC begins (separate PR).**

Migrate `scripts/eslint-no-disable.sh` + `docs/eslint-baseline-allowlist.txt` to native ESLint 9.x [`--suppress-all` + `eslint-suppressions.json`](https://eslint.org/docs/latest/use/suppressions). Ships with ESLint 9.24+ (released 2025).

**Touches**: removes `scripts/eslint-no-disable.sh`, `docs/eslint-baseline-allowlist.txt`, `.github/workflows/eslint-no-disable.yml`; adds `eslint-suppressions.json` + `package.json` script. CLAUDE.md §"Hard controls" table row `ESLint zero-new-disables` rewritten.

**Risk**: Mechanical migration; main risk is preserving exact baseline-suppression semantics across the format change. Forward-only — no backwards-compat needed.

### AC-7 (audit-O — enhancement): jest-axe + axe-playwright + Storybook test-runner — DEFERRED (scope-marker only)

**Scope marker only — full AC draft lands when this AC begins (separate PR).**

Add automated a11y testing to `docs/workspace-spec/72a-preview-deploy-rubric.md` 6-dim rubric (currently checklist-only). [jest-axe](https://github.com/nickcolley/jest-axe) + [axe-playwright](https://github.com/abhinaba-ghosh/axe-playwright) + [Storybook test-runner](https://storybook.js.org/docs/writing-tests/test-runner) automate roughly 33-40% of WCAG 2.1 AA criteria.

**Touches**: spec 72a (add `## Automated a11y` section); `package.json` (devDeps + scripts); persona `ux-polish-reviewer.md` (rubric input now includes axe report); CI workflow (run jest-axe + axe-playwright on `src/` PRs).

**Risk**: Activation gated on first `src/` UI slice (S-F1+). Currently dormant per CLAUDE.md L290 ("Active from S-F1 onwards"). Implementation deferred until S-F1 lands — no point seeding a11y tests with no UI surface.

## Out of scope (P0b-structural — separate slice)

Three simplifications carried to a future slice (`S-INFRA-rigour-v3c-prior-art-amendments-structural`):

- **(audit H+G)** CODEOWNERS migration replaces `.claude/hooks-checksums.txt` + `.github/workflows/control-change-label.yml` + session-start warn with a single `.github/CODEOWNERS` requiring `@admin` review on `.claude/hooks/**` + `scripts/**`. Three controls collapse to one. Audit verdict: we're re-implementing CODEOWNERS. Needs explicit rollback procedure.
- **(audit G)** `.claude/hooks/pre-commit-verify.sh` deprecation question — pre-commit is universally for fast checks (format, lint-staged); CI required-checks (`pr-dod.yml`) is the industry pattern for completeness. Decide: keep both layers (defensible: fail-fast local), CI-only (audit recommendation), or hybrid.
- **(audit B)** Reframe arch-smell trigger as prompt rule, not gate — round-counting incentivises gaming. Cunningham/Fowler treat smell as judgement, not metric. Touches `CLAUDE.md` §"Engineering conventions" §"Architectural-smell trigger".

Each requires explicit design + rollback procedure; not appropriate for citation-style slice.

## Pre-flight notes

- This slice ships **AC-1 through AC-4 inline** — 4 small CLAUDE.md edits totalling ~8 added lines.
- **AC-5 through AC-7 carry scope markers only** per `.claude/agents/slice-reviewer.md` criterion 2 §Exception (b) (deferred-slice scope-marker update). Each will land as a separate sub-slice PR when its turn arrives.
- **No `control-change` label required**: `CLAUDE.md` is at repo-root and is NOT in `.claude/hooks-checksums.txt` baseline scope. The 4 inline edits touch CLAUDE.md only — clean ship.
- **Adversarial review**: single-turn citation-style; expected `approve` or `nit-only` verdict. Spec 72b §"Use when" applies (acceptance.md is well under 300L; Option C inline-content single-spawn).
- **Auto-review.yml** will fire on this PR. Per `.claude/agents/slice-reviewer.md` criterion 2 §Exceptions:
  - The 4 IN-SCOPE CLAUDE.md edits are scope-aligned ACs (no §Exception needed; they ARE the slice's stated work).
  - The 3 DEFERRED scope markers fall under §Exception (b) — diff confined to scope-marker / status-header / candidate-section ranges of an AC carrying `STATUS: deferred`.
  - Recursive precedent: PR #37 validated §Exceptions on a comparable diff profile.

## References

- Session-49 prior-art audit: `docs/HANDOFF-SESSION-49.md` §"Prior-art audit"
- Reading list (spec 72c §10): shipped via commit `79014a3` in PR #37
- Audit framing (5 enhancements + 3 simplifications + 4 citations across 15 controls A-O): `docs/SESSION-CONTEXT.md` §"Session 50 priorities §P0b"
- Sibling-slice precedent (single-AC citation slice): PR #37 `S-INFRA-v3c-rubric-extension/{acceptance,verification}.md`
- Slice-reviewer rubric (criterion 2 §Exceptions a-d): `.claude/agents/slice-reviewer.md`
- Adversarial review budget: `docs/workspace-spec/72b-adversarial-review-budget.md` §"Use when" (Option C inline-content single-spawn)
- Multi-agent review framework (post-amendments): `docs/workspace-spec/72c-multi-agent-review-framework.md` §5 (verdict aggregation) + §10 (pattern lineage + reading list)
