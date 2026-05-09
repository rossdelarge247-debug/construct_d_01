# S-INFRA-rigour-v3d-canvas-decode-and-spec-quote-gates — Test plan

**Status:** authoring round; tests written + executed at slice impl.

This slice ships infrastructure: a decoder script, two hooks, two CI workflows, a spec amendment, a persona update, a CLAUDE.md amendment, and a synthetic-fixture extension. Test approach varies per surface; consolidated below per AC.

## Test-pain audit

Spec 72d §3 mock-count threshold applies (CLAUDE.md §"Engineering conventions" §"Test-pain audit" — references spec 72d §3). Infrastructure category → production threshold (>2 mocks per unit test triggers seam reconsideration). Decoder script is a pure transform; hook scripts isolate via stdin/env-var injection — no mocked collaborators expected. If any unit test in this slice surfaces >2 mock setups, step back and re-evaluate the seam before continuing.

## Per-AC test approach

### AC-1 — Decoder script

**Unit test:** `tests/shellspec/decode-bundler-canvas.spec.sh`. Cases:
1. Synthetic fixture (`tests/decoder-fixtures/minimal-bundled.html`): one `<script type="__bundler/template">` containing JSON-encoded inner HTML. Decoder produces `tests/decoder-fixtures/decoded/minimal-bundled.html` containing the literal inner-doc markup, not the bundler loader shell.
2. Stdin input (`-` argument): same fixture piped via stdin; decoder writes to `/tmp/decoded.html`.
3. Path-traversal: input path containing `..` resolves to its real-path before output composition; output never escapes the intended sibling directory.
4. Missing `<script type="__bundler/template">`: decoder exits non-zero with diagnostic naming the input file (no inner-content leak).
5. Malformed JSON inside template: decoder exits non-zero with diagnostic; no partial output written.
6. Output sibling already exists: decoder exits non-zero unless `--force` passed; no overwrite.

**End-to-end check:** `verification.md` records the output of:
```
git show claude/proto-presignup-interview-Okucr:docs/design-source/pre-signup-interview/o1-stage-router-expressive.html | scripts/decode-bundler-canvas.sh - >| /tmp/decoded.html
```
First 800 chars of `/tmp/decoded.html` pasted into `verification.md` to demonstrate real Tailwind classes + visible markup, not the bundler loader shell.

### AC-2 — Canvas-decode CI gate

**Workflow validation:** `actionlint .github/workflows/canvas-decode.yml` clean.

**Manual-trigger test:** open a draft PR adding a slice that cites `docs/design-source/<slug>/<file>.html` without a sibling `decoded/<file>.html`; verify the workflow fails with diagnostic listing the missing sibling. Then add either the decoded sibling OR a waiver line `^- canvas-decode-waiver: ...` to `verification.md`; verify the workflow passes.

**Skip-list test:** PR touching only the workflow file itself doesn't recursively re-trigger.

### AC-3 — Spec-citation-quote hook

**Unit test:** `tests/shellspec/spec-citation-quote.spec.sh`. Cases:
1. **Path filter.** Hook on a file outside `docs/slices/S-*/` and `docs/workspace-spec/`: exits 0 silently, no advisory.
2. **Skip-list.** Hook on a `docs/HANDOFF-SESSION-*.md` glob match or `docs/SESSION-CONTEXT.md`: exits 0 silently. (Real glob-named fixture path under `tests/shellspec/fixtures/spec-citation-quote/handoff-skip.md` — already excluded from `comment-review.sh` skip-list-based scan via `tests/*/fixtures/*` rule.)
3. **Trigger + missing quote (per-cite form).** Content with the literal pattern `per spec NN` (where NN is a digit-letter id like 72d): hook emits advisory naming the citation; exits 0 (stub mode).
4. **Trigger + missing quote (sectioned-with-quoted-name form).** Content with the literal pattern `spec NN §"Section name"`: hook emits advisory; exits 0.
5. **Trigger + present quote.** Content with the citation followed within 5 lines by `> *"some quoted text ≥20 chars"*`: hook exits 0 silently.
6. **Live mode.** Content with un-quoted citation + env `SPEC_QUOTE_ENFORCE=1`: hook emits advisory + exits 2.
7. **§Status fence-aware exemption.** Content with citation inside a `^## §?Status` block: hook exits 0 silently; `## §Status` block ends at next `^## ` heading.
8. **Blockquote-line exemption.** Content where the citation appears on a line starting with `>`: hook exits 0 silently (quoted source material, not author claim).
9. **Numeric-section reference doesn't trigger.** Content `"spec 72d §5 amendment"` (no quoted section name): hook exits 0 silently.
10. **Bare doc-pointer doesn't trigger.** Content `"spec 72d covers..."` (no `per`, no §): hook exits 0 silently.

### AC-4 — Spec-citation-quote CI mirror

**Workflow validation:** `actionlint .github/workflows/spec-citation-quote.yml` clean.

**Fixture test:** workflow run script invoked locally against:
1. Slice doc with citation + matching quote (substring present in cited spec): script exits 0.
2. Slice doc with citation + fabricated quote (substring NOT in cited spec): script exits non-zero, diagnostic identifies citation + cited spec + missing-quote excerpt.
3. Slice doc with citation + correct quote in different whitespace form: script normalises (lowercase + collapse whitespace + strip italic markers) and matches; exits 0.

### AC-5 — Spec 72d §5 amendment + plan-architect persona

**Doc validation:** spec 72d §5 contains the new Q6 description with verbatim Q1-Q5 carry-over (no Q1-Q5 text changed). Plan-architect persona file contains the new `### 6.` section + new row in default-blocking categories table + `source-artefact-verification` in JSON output schema enum.

**Schema validation:** `node -e "JSON.parse(require('fs').readFileSync('.claude/agents/plan-architect.md').toString().match(/```json\n([\s\S]*?)\n```/)[1])"` — JSON schema in persona file parses without error.

**Behavioural test:** AC-7 synthetic-fixture (below) is the live signal that Q6 fires correctly.

### AC-6 — CLAUDE.md amendment

**Doc validation:** `grep -nE "^\*\*Pre-priority canvas-fidelity verification\*\*\." CLAUDE.md` returns exactly one match, immediately following `^\*\*Pre-priority shipped-artifact verification\*\*` paragraph.

**Path-reference validation:** new paragraph references `scripts/decode-bundler-canvas.sh` + `.github/workflows/canvas-decode.yml` by literal path; both files exist in the same PR.

### AC-7 — Synthetic-fixture for plan-architect Q6

**Runner test:** `ANTHROPIC_API_KEY=$KEY tests/personas/run-synthetic.sh plan-architect` exits 0 against the new `tests/personas/synthetic/plan-architect.plan` fixture (planted Q6 violation flagged by the live persona).

**Fixture test:** `bash tests/personas/match-synthetic.sh tests/personas/synthetic/expected/plan-architect.json <fixed-envelope-fixture>` matches the predicates (label_in / blocking_in / category_pattern / evidence_must_contain_any_of / remediation_must_contain_any_of / min_findings_count).

**Workflow validation:** `actionlint .github/workflows/persona-synthetic-fixtures.yml` clean after path-filter extension.

### AC-8 — Self-application proof

**Hook self-run:** PostToolUse Write event on this slice's own `acceptance.md` does not trigger any advisory from `spec-citation-quote.sh` in stub mode. Captured via shellspec `Run hook against acceptance.md` case + manual transcript.

**CI self-run:** the rigour-v3d PR's own CI run includes `spec-citation-quote.yml` against the slice's own four docs; workflow conclusion is `success`. Captured via `verification.md` link to the workflow run.

## Test execution sequence

1. **Decoder unit + e2e** (AC-1) — first; foundational.
2. **Hook unit** (AC-3) + **CI mirror script unit** (AC-4) — second; both share regex catalogue.
3. **CI workflow validations** (AC-2, AC-4, AC-7 workflow extension) — third; `actionlint` runs.
4. **Doc validations** (AC-5, AC-6) — fourth; pure-grep checks.
5. **Synthetic-fixture runner** (AC-7) — fifth; requires `ANTHROPIC_API_KEY`.
6. **Self-application** (AC-8) — last; gated by all above passing.

## Bail-out criteria

If any AC-3 or AC-8 case surfaces a regex over-trigger or under-trigger that the slice's authored docs hit, the regex is wrong: re-design before continuing impl. The slice's own docs are the live calibration set.

## Status

- 2026-05-08 (session 77 P0 authoring): test plan drafted alongside acceptance + security; execution begins after plan-time review at impl phase.
