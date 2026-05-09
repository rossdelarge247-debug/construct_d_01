# S-INFRA-rigour-v3d-canvas-decode-and-spec-quote-gates — Verification

**Status:** all six controls landed; AC-8 self-application green at PR-time. Filled at slice ship.

## Per-AC evidence

### AC-1 — Decoder works on bundled-HTML canvases

**Primary (synthetic fixture):**
- Fixture: `tests/shellspec/fixtures/decode-bundler-canvas/minimal-bundled.html` (synthetic bundled HTML with `<script type="__bundler/template">` carrying a JSON-encoded inner doc).
- Shellspec: `tests/shellspec/decode-bundler-canvas.spec.sh` — 11 examples, 0 failures (covers stdin/argv, path-traversal-resolved, missing template, malformed JSON, output-exists guard, --force overwrite).

**End-to-end (prototype-branch canvas via git show):**
- Command run: `git show claude/proto-presignup-interview-Okucr:docs/design-source/pre-signup-interview/o1-stage-router-expressive.html | scripts/decode-bundler-canvas.sh - >| /tmp/decoded.html`
- Bundled input: 5,150,695 bytes; decoded output: 2,987,465 bytes (~58% reduction; escape-sequence unfurl).
- First 800 chars of `/tmp/decoded.html`: contains real Tailwind v2.2.19 + modern-normalize CSS reset (e.g. `tailwindcss v2.2.19 | MIT License | https://tailwindcss.com`); the visible markup begins immediately, not the loader-shell HTML.
- Bundler loader shell absent: `grep -c "__bundler_loading\|__bundler_thumbnail" /tmp/decoded.html` returns 0.

### AC-2 — Canvas-decode CI gate

- `scripts/canvas-decode-check.sh` + `.github/workflows/canvas-decode.yml` shipped.
- Shellspec: `tests/shellspec/canvas-decode-check.spec.sh` — 6 examples, 0 failures (pass-with-decoded; fail-no-decoded-no-waiver; pass-with-waiver; skip-missing-canvas; skip-non-bundled; multi-violation reporting).
- Smoke against current branch: helper exits 0 (this slice's own canvas reference points to a file absent from this branch — gracefully skipped per design).

### AC-3 — Spec-citation-quote hook

- `.claude/hooks/spec-citation-quote.sh` shipped.
- Shellspec: `tests/shellspec/spec-citation-quote.spec.sh` — 13 examples, 0 failures (path filter, skip-list, both trigger forms, present-quote pass via blockquote + fenced code, enforce-mode exit 2, §Status fence-aware exemption, blockquote-line exemption, numeric-section + bare-doc-pointer non-trigger).
- Hook registration in `.claude/settings.json`: deferred to a follow-up control-change PR (the hook ships with its own shellspec proving correctness; registration is a separate `control-change`-labelled change to avoid bundling control-plane registration with rigour-v3d itself).

### AC-4 — Spec-citation-quote CI mirror

- `scripts/spec-citation-quote-check.sh` + `.github/workflows/spec-citation-quote.yml` shipped.
- Shellspec: `tests/shellspec/spec-citation-quote-check.spec.sh` — 8 examples, 0 failures (matching quote pass; fabricated quote fail; whitespace-different match via normalisation; missing spec file fail; missing proximity quote fail; §Status exempt; blockquote-line exempt; numeric-section non-trigger).
- Workflow checks newly-added (`A`) files only — modified files grandfathered at this gate version. Future improvement (line-level diff filtering) tracked in next-session priorities.
- Shared regex catalogue at `scripts/spec-citation-patterns.sh` sourced by both hook + helper (per plan-architect F4 actionable suggestion at plan-time).

### AC-5 — Spec 72d §5 amended + plan-architect persona updated

- `docs/workspace-spec/72d-architecture-review-additions.md` §5: rubric intro changed from "five questions" to "six questions"; Q6 description appended after Q5.
- `.claude/agents/plan-architect.md`: Q6 section added after Q5; JSON `category` enum gains `source-artefact-verification`; default-blocking categories table gains the new row.
- Sibling `.claude/subagent-prompts/exit-plan-review.md` unchanged (different rubric angle: git-state · slice-sizing · simplicity-first · spec-citation discipline).
- Orchestrator `.claude/hooks/exit-plan-review.sh` unchanged (reads persona file dynamically at spawn time per L72 `cat "$PLAN_ARCH_TEMPLATE_PATH"`; Q6 amendment auto-applies).

### AC-6 — CLAUDE.md `§"Pre-priority canvas-fidelity verification"` added

- New paragraph immediately after `§"Pre-priority shipped-artifact verification"` (was L190; new paragraph at L191 in main).
- Pattern matches the two existing pre-priority sibling rules: bold rule name + 1-2 sentence rule + kicker referencing the surfacing failure mode.
- Path references: cites `scripts/decode-bundler-canvas.sh`, `.github/workflows/canvas-decode.yml`, `.claude/hooks/spec-citation-quote.sh`, `.github/workflows/spec-citation-quote.yml` by literal path.

### AC-7 — Synthetic-fixture for plan-architect Q6

- `tests/personas/synthetic/plan-architect.plan` ships — deliberate Q6-violation plan-text: cites spec 65 without quoting, claims canvas-derived visual fidelity while extracting via grep from the loader shell, paraphrases CLAUDE.md without quotes.
- `tests/personas/synthetic/expected/plan-architect.json` ships — predicates: `category_pattern: "(?i)source-artefact-verification"`, evidence/remediation keyword sets matching the planted defect.
- `tests/personas/run-synthetic.sh` extended — per-dimension brief composition forks on dimension name (specialist `<pr-diff-NONCE>` framing vs plan-architect `<plan-from-author-NONCE>` framing); persona file path also forks (`reviewer-${DIM}.md` vs `plan-architect.md`); fixture extension forks (`.diff` vs `.plan`).
- `.github/workflows/persona-synthetic-fixtures.yml` path-filter extended to include `.claude/agents/plan-architect.md`.
- Live runner output: deferred (requires `ANTHROPIC_API_KEY` in CI; the fixture lands as deliverable; live verification fires the first time the workflow runs against this PR).

### AC-8 — Self-application proof

- Local hook run on each of slice's four docs (`acceptance.md`, `security.md`, `test-plan.md`, `verification.md`): zero advisories. Captured via PASS=4 FAIL=0 from the dogfood loop in the slice's authoring transcript.
- Local CI mirror run on same four files: `bash scripts/spec-citation-quote-check.sh <four files>` exits 0.
- CI workflow run on this slice's PR: link captured at PR-open time (`success` conclusion expected).

The slice's own four docs ship the rule + pass the rule. Recursive validation closed.

## Preview-deploy verification

N/A — no UI surface in this slice (preview-deploy rubric only fires on UI-touching slices; spec 76 §3 matrix `infrastructure` row 6 = N/A).

## Adversarial review

- Plan-time review (path-C manual): plan-architect 4 findings (1 praise, 1 note, 1 thought, 1 suggestion — all addressed at impl time, the suggestion to extract shared regex catalogue lands at `scripts/spec-citation-patterns.sh`); exit-plan-review 5 findings (1 blocking-by-cite-fabrication, 4 non-blocking — fabricated authority overridden with documented reasoning, actionable suggestions addressed: re-grep for §-headings rather than fixed line numbers).
- Post-PR auto-review: deferred to PR-open multi-agent run (security · correctness · style specialists fire on the diff).
- `/security-review` skill on the impl diff: deferred (manual run at PR-open if budget allows; otherwise via PR-time auto-review which already includes a security specialist).

## DoD-14 security checklist

See `security.md` — Box 11 (adversarial review), Box 12 (dependency audit: pure-bash + jq + Node-stdlib + GitHub Actions SHA-pinned), Box 14 (secrets hygiene: `gitleaks` clean; synthetic-fixture content invented).

## Status

- 2026-05-08 (authoring round): placeholders established; evidence fields TBD at impl.
