# S-INFRA-spec-citation-quote-hook-register

**Category:** infrastructure

Register the existing `.claude/hooks/spec-citation-quote.sh` author-time hook in `.claude/settings.json` so it fires at Write/Edit time on slice docs + workspace specs. Closes SESSION-CONTEXT P4 inherited side-quest.

## Purpose

The hook script + dependency scripts + CI workflow + shellspec tests for `spec-citation-quote-check` all exist on `main`:

- Hook: `.claude/hooks/spec-citation-quote.sh` (84 lines; stub-mode default; live-mode via `SPEC_QUOTE_ENFORCE=1`).
- Patterns shared lib: `scripts/spec-citation-patterns.sh`.
- CI mirror script: `scripts/spec-citation-quote-check.sh` (invoked by workflow).
- CI workflow: `.github/workflows/spec-citation-quote.yml`.
- Shellspec tests: `tests/shellspec/spec-citation-quote.spec.sh` + `tests/shellspec/spec-citation-quote-check.spec.sh`.

What's missing: the hook is not listed under `PostToolUse:Write|Edit` in `.claude/settings.json`. So it never fires at author-time. Authors get spec-citation-quote feedback only at merge time via CI — which is the late-warning path the author-time hook was designed to replace.

CLAUDE.md §"Hard controls" §"Author-time comment review" §sibling-row already references the pattern: *"`.claude/hooks/comment-review.sh` … PostToolUse:Write|Edit (advisory)"*. The new hook fits the same row.

## In scope

- Single-line registration in `.claude/settings.json` under the existing `PostToolUse` → `matcher: "Write|Edit"` → `hooks` array (after `line-count.sh` + `comment-review.sh`).
- Slice docs (this file + `verification.md`).

## Out of scope

- Hook script changes (already shipped on `main`).
- Live-mode default flip (stays stub; `SPEC_QUOTE_ENFORCE=1` opt-in per the hook's self-documented mode flag).
- CI workflow changes (paired CI mirror unchanged).
- Modified-file gate-widening of CI workflow (called out in workflow comment L48 as a future improvement; this slice doesn't open it).
- New shellspec tests (existing `tests/shellspec/spec-citation-quote.spec.sh` covers the hook surface).

## Acceptance criteria

**AC-1: Hook registered in `.claude/settings.json` under `PostToolUse:Write|Edit`.**

Insert a third `command`-type hook entry after the existing `line-count.sh` + `comment-review.sh` entries. Timeout `30` (matching `comment-review.sh`'s scan-budget; the hook does a regex scan + proximity-window check, comparable surface).

Verbatim from hook self-doc at `.claude/hooks/spec-citation-quote.sh` L2-9: *"PostToolUse:Write|Edit author-time advisory + opt-in enforcement for spec-citation quote discipline. Catches `per spec NN` and `spec NN §\"...\"` claim citations that lack a literal-text quote within 5 lines after the citation. Runs against slice docs (`docs/slices/S-*/*.md`) and workspace specs (`docs/workspace-spec/*.md`). Stub-mode default: emit advisory + exit 0. Live-mode (`SPEC_QUOTE_ENFORCE=1`): emit advisory + exit 2 to block the Write/Edit."*

**AC-2: JSON valid.**

`jq -e . .claude/settings.json` exits 0. `jq` listing of PostToolUse hook chain returns three commands in order: `line-count.sh` · `comment-review.sh` · `spec-citation-quote.sh`.

**AC-3: Existing shellspec tests pass.**

The hook's behavioural correctness is already gated by `tests/shellspec/spec-citation-quote.spec.sh` on CI (`shellspec` workflow at `.github/workflows/shellspec.yml`). Registration is config-only; no new test fixture is needed. CI shellspec gate green = AC-3 satisfied.

**AC-4: No regression to existing PostToolUse hooks.**

`line-count.sh` + `comment-review.sh` continue to fire alongside the new hook (per the harness's documented behaviour: every hook in a `hooks: []` array runs for matching events). No matcher change; no precedence change.

## References

- `.claude/hooks/spec-citation-quote.sh` — hook (already shipped on `main`)
- `.claude/settings.json` — registration target
- `.github/workflows/spec-citation-quote.yml` — paired CI mirror
- `tests/shellspec/spec-citation-quote.spec.sh` — existing hook tests
- CLAUDE.md §"Planning conduct" §"Quote, don't paraphrase, when invoking a spec" — rule the hook enforces
- CLAUDE.md §"Hard controls" §"Author-time comment review" — sibling hook pattern row
- SESSION-CONTEXT P4 — inherited side-quest origin
