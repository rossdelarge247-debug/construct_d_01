# S-INFRA-rigour-v3d-canvas-decode-and-spec-quote-gates

**Category:** infrastructure

## Status
Skeletal scoping. Full acceptance fill-in — with literal spec quotes for every citation per the rule this slice itself is creating — deferred to session 77 turn 0 after authoritative spec re-reads (72c, 72d §5, 76 §3, 71 §4, S-INFRA-rigour-v3a-foundation/acceptance.md AC-7).

## Authorisation (placeholder — quotes added at slice authoring)
- Failure analysis in `docs/HANDOFF-SESSION-76.md` §"What went wrong + corrective protocol".
- CLAUDE.md §"Planning conduct" §"Distrust your own summaries" — loaded in turn-0 context, violated in execution; needs hook+CI enforcement to bridge prose↔practice.
- CLAUDE.md §"Visual direction" — canvases are repo-committed source artefacts; "tokens via grep" is not sufficient deconstruction.
- Spec 72d §5 — current 5-question plan-architect rubric; this slice amends to 6 questions by adding source-artefact verification.

## Scope

### In scope (six controls per session-76 wrap discussion)
1. **`scripts/decode-bundler-canvas.sh`** — one-shot Node decoder. Reads a bundled-HTML canvas export, extracts the `__bundler/template` JSON-encoded inner doc, emits readable HTML+CSS to a sibling `decoded/<file>.html`.
2. **`.github/workflows/canvas-decode.yml`** — CI gate. PRs that touch `docs/slices/S-*/acceptance.md` citing a `docs/design-source/<slug>/` path with bundled-HTML format must ship the decoded sibling OR carry a waiver line in `verification.md`.
3. **`.claude/hooks/spec-citation-quote.sh`** — PostToolUse:Write|Edit on `docs/slices/S-*/*.md` and `docs/workspace-spec/*.md`. Regex-scans for `per spec N`/`spec NN §"..."` citations; requires fenced or block-quoted >=20-char literal text within 5 lines following each citation. Stub-mode advisory; live-mode (`SPEC_QUOTE_ENFORCE=1`) blocking.
4. **`.github/workflows/spec-citation-quote.yml`** — CI mirror. Stricter: fuzzy-matches the quoted text against the cited spec file. Substring mismatch fails the run.
5. **Spec 72d §5 amendment** — extend C-contract from 5 questions to 6 by adding **Q6 — Source-artefact verification**. Plan-architect persona file at `.claude/agents/plan-architect.md` updated to include Q6 in its rubric, blocking on absence of literal quotes + canvas-decoded reference.
6. **CLAUDE.md amendment** — add §"Pre-priority canvas-fidelity verification" sibling to existing pre-priority verification rules (spec-gate + shipped-artifact). Authoritative source for the canvas-decode rule the hook + CI gate enforce.

### Out of scope
- PR-DoD checklist additions — defer to a P1 follow-up; hooks + CI are sufficient pre-prevention.
- SessionStart hook spec-read-status surfacing — defer to P1.
- Discussion-turn-before-src/-writes enforcement — that's a process commitment, not a control.

## Acceptance criteria (sketch — each gets full text + literal quotes at slice authoring)

- **AC-1** · `decode-bundler-canvas.sh` works on session-76 canvases (`docs/design-source/pre-signup-interview/o1-stage-router-expressive.html` decodes to readable form).
- **AC-2** · `canvas-decode.yml` CI gate fires on a PR adding a slice that cites bundled-HTML without a decoded sibling; clears with sibling or waiver.
- **AC-3** · `spec-citation-quote.sh` hook flags missing-quote citations in stub mode (advisory) + blocks in live mode (`SPEC_QUOTE_ENFORCE=1`).
- **AC-4** · `spec-citation-quote.yml` CI mirror fuzzy-matches against cited spec file; fails on fabricated quotes.
- **AC-5** · spec 72d §5 amended to 6-question rubric with Q6 source-artefact-verification; plan-architect persona updated; existing exit-plan-review keeps its 5-question rubric (different angle).
- **AC-6** · CLAUDE.md §"Pre-priority canvas-fidelity verification" added; references the script + gate by path.
- **AC-7** · Synthetic-deliberate-injection regression fixture for plan-architect Q6 added per spec 72c §7 first-3-src-slice synthetic-fixtures pattern; wired into `tests/personas/run-synthetic.sh`.
- **AC-8** · Self-application proof — this slice's own acceptance.md, security.md, test-plan.md, verification.md pass the new spec-citation-quote hook + CI gate. The slice ships only after its own gates fire green on its own PR.

## Architectural seams (placeholder)
1. Decoder is a one-shot pure transform: input file path → output file path.
2. Hooks + CI workflows reuse existing path-filter + matrix patterns from `auto-review.yml`.
3. Spec 72d §5 amendment is a doc-only edit; plan-architect persona-prompt update is a one-line rubric injection.
4. Self-application (AC-8) is the architectural seam test — if the slice can't pass its own gates, the gates aren't right.

## Spec citations (literal text added at slice authoring)
- spec 72c — multi-agent review framework
- spec 72d §5 — architecture review additions C-contract + Q6 amendment site
- spec 76 §3 — prototype-mode rigour gate calibration
- spec 71 §4 — dev-mode pattern (referenced for hook placement)
- S-INFRA-rigour-v3a-foundation/acceptance.md AC-7 — exit-plan-review precedent this extends
- S-INFRA-rigour-v3b-subagent-suite/acceptance.md AC-1, AC-5 — multi-agent + persona organisation precedent

## Status footer
- 2026-05-08 (session 76 wrap): scoping shipped at skeletal level. Full authoring (literal spec quotes per AC-8 self-application + security checklist + test-plan + verification) is session 77 turn 0's first task — before any prototype refactor.
