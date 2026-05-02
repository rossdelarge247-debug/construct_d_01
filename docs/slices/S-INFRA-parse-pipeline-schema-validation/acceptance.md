# S-INFRA-parse-pipeline-schema-validation — Acceptance criteria

**Slice:** S-INFRA-parse-pipeline-schema-validation
**Spec ref:** session-58 PR #71 §"Why no integration into parse pipeline (yet)" (the explicit follow-up handoff this slice closes) + spec 72c §5 (envelope contract) + CLAUDE.md §Hard controls §"Auto-review on PR" gate row
**Phase(s):** Infra (rigour-pivot programme; v3c carry-over closure)
**Status:** Draft

---

## Context

Session-58 PR #71 shipped `schemas/finding-envelope.schema.json` + `scripts/validate-finding-envelope.sh` + 16 shellspec cases — the canonical pre-aggregation envelope contract — but deliberately did not wire validation into the parse pipeline. PR #71 §"Why no integration into parse pipeline (yet)" verbatim:

> *"Wiring strict schema validation into the parse pipeline would gate brief-job specialist invocations on schema validity — useful but a separate AC, with its own choices about graceful degradation when a specialist emits a slightly-off envelope (parse-failed cascade vs warn + accept). That work belongs in a follow-up PR under the existing `scripts/auto-review-parse.sh` ownership."*

This slice closes that follow-up. The choice between "parse-failed cascade" and "warn + accept" lands on **warn + accept**: stdout behaviour is unchanged (the parser still emits the persona JSON or the `'{}'` sentinel exactly as before), and a new stderr warning channel surfaces schema-invalidity without cascading to the merge-gate. Rationale: the existing `parse-failed → merge-gate failure` path (CLAUDE.md §"Hard controls" §"Check-run conclusion mapping") is reserved for envelope-extraction failure (missing/empty `.result`, malformed body, invalid envelope JSON). Schema-invalidity is a weaker signal — the body parses, the keys are mostly right, and the orchestrator can still derive a verdict best-effort. Strict-mode parse-failed cascade is out of scope for this slice and can be added as an opt-in CLI flag later if the empirical pattern justifies it.

## Dependencies

- **Upstream:** PR #76 (S-INFRA-reviewer-comment) merged + PR #77 (S-INFRA-tdd-guard-first-creation) merged. `claude/decouple-session-60-TT3BF` resynced to `origin/main` at `1624991`.
- **Open decisions required:** none.
- **Re-use / Preserve-with-reskin paths touched:** `scripts/auto-review-parse.sh` (existing; adding a `validate_warn` helper + two call sites alongside the existing parse branches) · `scripts/validate-finding-envelope.sh` (existing; not modified — invoked as a subprocess) · `tests/shellspec/auto-review-parse.spec.sh` (existing; adding 3 cases alongside the 12 v3c-prior ones).
- **Discarded paths deleted at DoD:** none.

## Pre-flight notes

- **Adversarial review budget (per spec 72b).** acceptance.md `<300L` ⇒ Single-turn (status quo) per spec 72b §"Decision criteria" verbatim row: *"<300 lines | any | Single-turn (status quo) | Fits in one read-cap window; no orchestration overhead."* Live auto-review (4 specialists · k=2) fires on PR open.
- **TDD exemption.** Hook + shellspec are bash; tdd-guard scope is `src/**.{ts,tsx}` per its glob — its own changes do not self-trigger.
- **Stdout invariant.** All 12 existing shellspec cases must continue passing without modification — the validator hooks in AFTER the existing parse branches succeed and never alters `$PERSONA_JSON`. Only stderr is augmented.
- **`'{}'` sentinel skip.** Schema validation is skipped when the parser falls through to the `'{}'` parse-failed sentinel. Otherwise the validator would always fail on the sentinel (no required keys), creating noise on every legitimate parse-failure.
- **CODEOWNERS.** Touches `scripts/**` + `tests/shellspec/**` + `docs/slices/**` — admin-bypass merge expected per solo-operator pattern (CLAUDE.md negative constraint #25).

## MLP framing

The loveable floor: when a specialist persona drifts (extra key, missing key, wrong-type field) the parse pipeline emits a one-line stderr advisory naming the violation alongside the still-emitted JSON; CI keeps running, the orchestrator still derives a verdict best-effort, but the `auto-review · compose briefs` job log now carries the signal that schema drift has occurred. A future operator triaging a flaky verdict has the breadcrumb in the same job output where the parse already happens, instead of having to manually feed the captured envelope into the validator.

---

## AC-1 · `auto-review-parse.sh` runs `validate-finding-envelope.sh` and warns on schema-invalidity

- **Outcome:** After the existing `try-direct-jq → fence-strip-jq → '{}'` parse chain produces a non-empty `$PERSONA_JSON` that is NOT the `'{}'` sentinel, the parser pipes the JSON through `scripts/validate-finding-envelope.sh`. On validator exit-0, no stderr output. On validator exit-1, the parser emits a single stderr line of the form `auto-review-parse: schema-invalid persona envelope (proceeding): <validator error message>` and continues to stdout the JSON unchanged. Always exits 0 (preserving the existing contract).
- **Verification:**
  1. `grep -nE "validate-finding-envelope.sh" scripts/auto-review-parse.sh` returns at least one hit (the call site).
  2. Existing shellspec cases (12 cases pre-slice in `tests/shellspec/auto-review-parse.spec.sh`) keep passing without modification — the `output should equal` assertions for stdout are unchanged.
  3. Three new shellspec cases (AC-2) cover: valid envelope → no warning; missing-key envelope → warning + JSON still emitted; extra-key envelope → warning + JSON still emitted.
- **In scope:** Validator subprocess invocation + stderr warning emission + `'{}'` sentinel skip-guard.
- **Out of scope:** Strict-mode CLI flag that escalates schema-invalid to parse-failed cascade (future slice if empirical pattern justifies); validator extensions for the aggregate envelope's looser shape (unchanged from PR #71 §scope).

## AC-2 · Three new shellspec cases for the warn-on-schema-invalid path

- **Outcome:** `tests/shellspec/auto-review-parse.spec.sh` gains a `Describe 'schema validation (warn-on-invalid)'` block with three It-blocks:
  - **valid:** envelope with all required keys + Conventional Comments label + non-empty strings → stdout matches the JSON, stderr is empty.
  - **missing-key:** envelope without `.summary` (a required field per the schema) → stdout still matches the JSON, stderr contains `auto-review-parse: schema-invalid`.
  - **extra-key:** envelope with an additional root-level property → stdout still matches the JSON, stderr contains `auto-review-parse: schema-invalid`.
- **Verification:**
  1. `grep -cE "^[[:space:]]*It '" tests/shellspec/auto-review-parse.spec.sh` returns `15` (was `12` pre-slice — 3 new cases).
  2. CI shellspec runs all 15 cases via `.github/workflows/shellspec.yml`.
  3. Manual smoke harness (3-case loop) replicates the same assertions in this sandbox.
- **In scope:** Three cases above + a small fixture envelope JSON inline per case.
- **Out of scope:** Replicating the validator's own 16 shellspec cases (those live at `tests/shellspec/validate-finding-envelope.spec.sh` and are unchanged).

---

## Review log

| Date | Reviewer | Outcome | Notes |
|---|---|---|---|
| 2026-05-02 | Author (session 60) | Draft | 2 ACs covering parser integration + shellspec coverage |
| | User | | AC frozen — implementation may begin |
| | Live auto-review (4 specialists · k=2) | | Fires on PR open |

**AC is the contract.** Change requests after freeze roll into re-drafting AC + re-slicing, not mid-slice scope shifts.
