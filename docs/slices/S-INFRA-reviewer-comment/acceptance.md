# S-INFRA-reviewer-comment — Acceptance criteria

**Slice:** S-INFRA-reviewer-comment
**Spec ref:** CLAUDE.md §Coding conduct §"Comments: WHY not WHAT, no temporal provenance" (anti-pattern catalogue at L215-222) + CLAUDE.md §"Subagent file locations" + spec 72c §5 (Conventional Comments envelope)
**Phase(s):** Infra (rigour-pivot programme; author-time review-flow extension)
**Status:** Draft

---

## Context

CLAUDE.md ships an explicit catalogue of comment anti-patterns at L215-222 (PR/session/slice provenance · sibling-step references · WHAT-narration · hard-coded historical counts · code lineage). Multiple recent sessions confirmed the catalogue is harder to apply at AUTHOR time than at REVIEW time — the same author who shipped the catalogue has been flagged for the same anti-patterns by the post-PR style specialist. Author-time mental rehearsal alone is empirically insufficient; the review-flow needs an author-time gate that runs the catalogue against a write before the change reaches commit.

Architecture mirrors `.claude/hooks/exit-plan-review.sh` (PreToolUse:ExitPlanMode plan-review): a hook reads tool input from stdin, frames the diff for a fresh-context subagent persona, and surfaces verdict findings. Differences vs. the plan-review hook: PostToolUse instead of PreToolUse (the write has already happened — author iterates rather than re-attempts); non-blocking advisory exit (CLAUDE.md anti-pattern catalogue is defended at PR-review time by `reviewer-style.md` for blocking; this hook is just-in-time advisory).

## Dependencies

- **Upstream:** PR #75 (session-59 wrap) merged. SessionStart hook verified `claude/decouple-session-60-TT3BF` at HEAD of `origin/main` (`953a468`).
- **Open decisions required:** none.
- **Re-use / Preserve-with-reskin paths touched:** `.claude/agents/reviewer-style.md` (persona-shape reference, not modified) · `.claude/hooks/exit-plan-review.sh` (hook-shape reference, not modified) · `.claude/hooks/line-count.sh` (PostToolUse JSON-emit pattern, not modified) · `.claude/settings.json` (PostToolUse:Write|Edit registration extends the existing entry for `line-count.sh`).
- **Discarded paths deleted at DoD:** none.

## Pre-flight notes

- **Adversarial review budget (per spec 72b).** acceptance.md `<300L` ⇒ single review session per spec 72b §Use when. Live auto-review (4 specialists · k=2 · differential mode + per-specialist filter) fires on PR open.
- **TDD exemption.** Hook + persona are bash-script + prompt-template (not src/.{ts,tsx}); tdd-guard.sh scope is `src/**.{ts,tsx}` per its glob — shellspec tests serve as the test surface and run via `tests/shellspec/comment-review.spec.sh`.
- **Self-fire avoidance.** The hook MUST skip writes to its own persona file (`.claude/agents/reviewer-comment.md`) and to its own shellspec test (`tests/shellspec/comment-review.spec.sh`) — both contain anti-pattern strings as legitimate fixtures (the persona quotes catalogue examples; the spec passes flagged strings as Data inputs). Without the skip, registration would create a noise loop on the very files the slice ships. Skip-list is part of AC-2.
- **CODEOWNERS.** Touches `.claude/**` + `tests/shellspec/**` + `CLAUDE.md` — admin-bypass merge expected per solo-operator pattern (CLAUDE.md negative constraint #25).
- **Stub-vs-live.** Default mode is deterministic regex (`COMMENT_REVIEW_SPAWN` unset). Live LLM mode (`COMMENT_REVIEW_SPAWN=1`) requires `claude` CLI on PATH and authenticated. Stub mode covers four catalogue items via regex (provenance · sibling-step refs · code lineage · historical counts); WHAT-narration is non-tractable via regex and only covered in live mode — documented in the persona §Out of scope.

## MLP framing

The loveable floor: a future Claude session running this hook gets a one-line `[anti-pattern]` advisory in the systemMessage stream the moment a flagged comment lands on disk, with file path + matched string + catalogue-item reference. The author corrects in the same turn rather than waiting for PR-review-round-3 self-inflicted recurrence. Author-time loop closes; the review-flow becomes monotonic.

---

## AC-1 · `reviewer-comment` persona file at `.claude/agents/reviewer-comment.md`

- **Outcome:** A persona file matching the §"Subagent file locations" convention exists at `.claude/agents/reviewer-comment.md`. Body declares the four catalogue-item targets verbatim from CLAUDE.md L215-222, an output envelope shape compatible with spec 72c §5 (Conventional Comments labels + `blocking` boolean), and an §Out of scope section declaring what this persona does NOT cover (architectural · correctness · security · UI polish).
- **Verification:**
  1. `test -f .claude/agents/reviewer-comment.md` succeeds.
  2. `grep -c "PR.*session.*slice provenance\|Sibling-step\|Narration of WHAT\|Code lineage" .claude/agents/reviewer-comment.md` returns `>= 4` — all four primary targets named.
  3. Persona output shape includes `specialist`, `summary`, `findings[]` keys; finding shape includes `label` (Conventional Comments enum), `blocking` (boolean), `category`, `evidence`, `remediation`. Validated by spec 72c §5 envelope.
- **In scope:** Persona file body covering the four primary targets + envelope spec + minimal example invocations (one flagged input, one clean input).
- **Out of scope:** Live-mode end-to-end test against `claude -p` (live mode is pluggable — gating happens at hook invocation; persona body is the prompt material).

## AC-2 · `comment-review.sh` PostToolUse:Write|Edit hook

- **Outcome:** A bash hook at `.claude/hooks/comment-review.sh` reads JSON tool input from stdin, exits 0 silently for non-`Write|Edit` tools, applies a path skip-list (`.claude/agents/**`, `.claude/subagent-prompts/**`, `tests/shellspec/**`, `tests/**/fixtures/**`, `*.lock`, `*.json`, `*.yaml`, `*.yml`, binary extensions), and runs the four-pattern stub-mode regex check on the new content (Write → `.tool_input.content`; Edit → `.tool_input.new_string`). On findings, emits a JSON object via `jq -n` with a `systemMessage` field describing each flagged match (file_path + first matched line + catalogue-item label) and exits 0. On no findings, exits 0 silently. Live LLM mode is a pluggable opt-in via `COMMENT_REVIEW_SPAWN=1` — when set, frames the persona prompt with a per-invocation nonce and pipes to `claude -p`; if `claude` is absent, falls back to stub mode without erroring.
- **Verification:**
  1. `test -x .claude/hooks/comment-review.sh` succeeds (executable bit set).
  2. `tests/shellspec/comment-review.spec.sh` runs ≥6 cases, all pass: clean diff (no findings) · provenance hit · sibling-step hit · lineage hit · historical-count hit · skip-path early-exit · non-Write/Edit tool early-exit.
  3. Hook never exits non-zero in stub mode (advisory-only contract).
- **In scope:** Stub-mode regex for four catalogue items + path skip-list + JSON systemMessage emission + pluggable live-mode invocation (without changing the default).
- **Out of scope:** Block-on-findings behavior (advisory only this slice; blocking variant deferred — would re-frame as a PreToolUse hook). Differential mode (rounds 2+ — author-time has only one round per Write/Edit).

## AC-3 · `tests/shellspec/comment-review.spec.sh`

- **Outcome:** Shellspec describes `scripts/.claude/hooks/comment-review.sh` (or path-as-existing) covering: happy-path clean diff, four anti-pattern detection cases (one per stub-mode regex), one path-filter skip case, one non-`Write|Edit` early-exit case. All 7 cases pass locally and in CI under `.github/workflows/shellspec.yml`.
- **Verification:**
  1. `shellspec tests/shellspec/comment-review.spec.sh` reports `7/7` pass `0/7` fail in stub mode.
  2. Each detection case asserts `.systemMessage` content includes the matched catalogue label (e.g. `provenance`, `sibling-step`, `lineage`, `historical-count`).
  3. Skip-path case asserts hook exits 0 with no JSON emitted (silent skip).
- **In scope:** Stub-mode-only test cases (live mode requires network + auth out of CI scope).
- **Out of scope:** Live-mode integration test (deferred — same envelope as the existing pluggable pattern in `exit-plan-review.spec.sh`).

## AC-4 · `.claude/settings.json` registration

- **Outcome:** `comment-review.sh` is registered as a PostToolUse hook with `matcher: "Write|Edit"` alongside the existing `line-count.sh` registration in `.claude/settings.json`. Timeout matches `line-count.sh` (10s) for stub mode; live-mode timeout is internal to the hook (it falls back to stub on `claude -p` timeout).
- **Verification:**
  1. `jq '.hooks.PostToolUse[] | select(.matcher == "Write|Edit") | .hooks | length' .claude/settings.json` returns `2` (was `1` before the slice).
  2. `jq '.hooks.PostToolUse[] | select(.matcher == "Write|Edit") | .hooks | map(.command)' .claude/settings.json` lists both `.claude/hooks/line-count.sh` and `.claude/hooks/comment-review.sh`.
  3. Hook fires on a probe Write to a sample file (verified at slice wrap by an intentional flagged-comment write to a scratch file, then immediately reverted).
- **In scope:** Single-line additions to the existing PostToolUse:Write|Edit hooks array.
- **Out of scope:** Adjusting line-count.sh registration; widening matcher to other tools.

## AC-5 · CLAUDE.md §"Hard controls (in development)" gate row

- **Outcome:** The Hard controls table at CLAUDE.md L258 gains a row for `comment-review.sh`. Row columns: Gate name · File(s) · Fires on · AC · Bypass. A short prose paragraph follows the table summarising the advisory-vs-blocking distinction (the hook surfaces; PR-time `reviewer-style.md` blocks).
- **Verification:**
  1. `grep -c "comment-review.sh" CLAUDE.md` returns `>=1` in §"Hard controls".
  2. New row matches the existing table column layout (5 columns, pipe-separated).
  3. Bypass column documents that advisory exit means no formal bypass needed; live-mode opt-out is `COMMENT_REVIEW_SPAWN` unset (default).
- **In scope:** One table row + one short prose paragraph.
- **Out of scope:** Re-ordering existing rows; renaming gate categories.

---

## Review log

| Date | Reviewer | Outcome | Notes |
|---|---|---|---|
| 2026-05-02 | Author (session 60) | Draft | 5 ACs covering persona · hook · test · registration · CLAUDE.md gate row |
| | User | | AC frozen — implementation may begin |
| | Live auto-review (4 specialists · k=2) | | Fires on PR open |

**AC is the contract.** Change requests after freeze roll into re-drafting AC + re-slicing, not mid-slice scope shifts.
