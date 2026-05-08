# S-INFRA-rigour-v3d-canvas-decode-and-spec-quote-gates — Verification

**Status:** placeholders at authoring round; evidence filled at slice impl + slice ship.

Per CLAUDE.md §"Engineering conventions" §"Definition of Done" item 1: "All acceptance criteria met, with evidence per AC in `verification.md` (final-state record assembled at slice ship; round-by-round multi-agent audit detail belongs in HANDOFF or PR description, not in `verification.md` itself)".

## Per-AC evidence

### AC-1 — Decoder works on bundled-HTML canvases

**Status:** TBD at AC-1 impl.

**Primary (synthetic fixture):**
- Fixture file: `tests/decoder-fixtures/minimal-bundled.html` — TBD
- Decoder run: `scripts/decode-bundler-canvas.sh tests/decoder-fixtures/minimal-bundled.html` produces `tests/decoder-fixtures/decoded/minimal-bundled.html`.
- Output snippet (first 200 chars): TBD
- Shellspec output: TBD

**End-to-end (prototype-branch canvas via git show):**
- Command: `git show claude/proto-presignup-interview-Okucr:docs/design-source/pre-signup-interview/o1-stage-router-expressive.html | scripts/decode-bundler-canvas.sh - >| /tmp/decoded.html`
- Output snippet (first 800 chars of `/tmp/decoded.html`): TBD
- Real Tailwind classes observed: TBD (e.g. `class="bg-gradient-to-br from-...`)
- Bundler loader shell absent: TBD (no `__bundler_loading` / `__bundler_thumbnail` in decoded output)

### AC-2 — Canvas-decode CI gate fires on missing decoded sibling

**Status:** TBD at AC-2 impl.

- `actionlint .github/workflows/canvas-decode.yml` clean: TBD
- Failing-case workflow run (PR adds slice citing bundled-HTML without sibling): TBD link
- Passing-case workflow run (sibling added): TBD link
- Waiver-line passing-case workflow run (verification.md `^- canvas-decode-waiver:` line): TBD link

### AC-3 — Spec-citation-quote hook fires on missing-quote citations

**Status:** TBD at AC-3 impl.

- Shellspec output covering all 10 cases per `test-plan.md` AC-3: TBD
- Hook self-run on this slice's `acceptance.md` (stub mode): TBD (no advisory expected)
- Hook self-run on this slice's `acceptance.md` (live mode `SPEC_QUOTE_ENFORCE=1`): TBD (exit 0; no advisory)

### AC-4 — Spec-citation-quote CI mirror fuzzy-matches against cited spec

**Status:** TBD at AC-4 impl.

- `actionlint .github/workflows/spec-citation-quote.yml` clean: TBD
- Fixture-match passing case: TBD
- Fixture-mismatch failing case: TBD (diagnostic should identify citation + cited spec + missing-quote excerpt)

### AC-5 — Spec 72d §5 amended + plan-architect persona updated

**Status:** TBD at AC-5 impl.

- Diff of `docs/workspace-spec/72d-architecture-review-additions.md` §5: TBD
- Diff of `.claude/agents/plan-architect.md`: TBD
- JSON schema `category` enum includes `source-artefact-verification`: TBD
- AC-7 synthetic-fixture run confirms Q6 fires: TBD

### AC-6 — CLAUDE.md §"Pre-priority canvas-fidelity verification" added

**Status:** TBD at AC-6 impl.

- Diff of CLAUDE.md L190 area: TBD
- `grep -nE "^\*\*Pre-priority canvas-fidelity verification\*\*\." CLAUDE.md` shows exactly one match: TBD
- Path references: TBD (script + workflow paths present in the new paragraph)

### AC-7 — Synthetic-fixture for plan-architect Q6

**Status:** TBD at AC-7 impl.

- `tests/personas/synthetic/plan-architect.plan` (planted Q6 violation): TBD
- `tests/personas/synthetic/expected/plan-architect.json`: TBD
- `tests/personas/run-synthetic.sh` extension: TBD
- `.github/workflows/persona-synthetic-fixtures.yml` path-filter extension: TBD
- Live runner output (`ANTHROPIC_API_KEY` set): TBD

### AC-8 — Self-application proof

**Status:** TBD at AC-8 impl.

- Local hook run on `acceptance.md`: TBD (no advisory)
- Local hook run on `security.md`: TBD (no advisory)
- Local hook run on `test-plan.md`: TBD (no advisory)
- Local hook run on `verification.md`: TBD (no advisory)
- CI mirror workflow run on this slice's PR: TBD link (`success` conclusion)

## Preview-deploy verification

N/A — no UI surface in this slice (per spec 72a preview-deploy rubric scope; spec 76 §3 matrix `infrastructure` row 6 = N/A).

## Adversarial review

**Status:** TBD at slice-wrap.

- `/security-review` skill output on slice diff: TBD
- `/review` skill output on slice diff: TBD
- Concerns addressed or deferred with reasoning: TBD

## DoD-14 security checklist

See `security.md` — Box 11 + 12 + 14 substantive evidence captured at slice ship.

## Status

- 2026-05-08 (authoring round): placeholders established; evidence fields TBD at impl.
