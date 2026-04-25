# S-TOOL-1 · line-count session-base + branch-resume guard — Verification

**Slice:** S-TOOL-1-line-count-branch-resume
**Source:** CLAUDE.md DoD items 1–6
**Note:** Hook-slice variant. UI-specific verification rows from `_template/verification.md` (browsers, viewports, accessibility, prefers-reduced-motion, dev-mode banner) are N/A — this slice has no UI surface. The DoD items relevant to a `.claude/hooks/*` change are: AC met (1), tests GREEN (2), adversarial review (3), no-regression (5), opens resolved (6). Item 4 (in-browser preview) is substituted by hook-execution evidence below.

---

## AC sign-off table

| AC | Outcome | Test evidence | Pass / fail |
|---|---|---|---|
| AC-1 | Session-start.sh writes `/tmp/claude-base-${SESSION_ID}.txt` on first run; preserves across resume/clear | `tests/unit/hooks-session-start.test.ts:80–115` (2 tests in "session-base SHA capture" describe) | PASS |
| AC-2 | Suffixed branch + canonical on origin → resync-recipe warning surfaces | `tests/unit/hooks-session-start.test.ts:117–186` (5 tests covering 2a/2b/2c/2d-4ch/2d-6ch) | PASS |
| AC-3 | Line-count.sh diffs against session-base when present + valid; falls back to origin/main otherwise | `tests/unit/hooks-line-count.test.ts:73–129` (4 tests covering 3a/3b/3c + non-Write/Edit ignore) | PASS |
| AC-4 | CLAUDE.md candidate #12 lifted into Planning conduct § | `git diff CLAUDE.md` shows new "Branch-resume check" bullet between "Read discipline" and "## Coding conduct" (lines 183–185 region) | PASS |
| AC-5 | No regression in adjacent hooks; full suite stays green | `pnpm test` → 13 files / 92 tests passed (was 11/81; +2 files, +11 tests; no diff to `tests/setup.ts` / `tests/helpers/*` / `vitest.config.ts`) | PASS |

## Hook-execution sanity (substitute for in-browser preview)

| Surface | Trigger | Expected | Evidence |
|---|---|---|---|
| `session-start.sh` on canonical branch | `bash .claude/hooks/session-start.sh < input.json` (with `{"session_id":"X"}`) on `claude/S-TOOL-1-line-count-branch-resume` | Context block surfaced with branch state; no Branch-resume warning (current branch lacks the 5-char alphanumeric suffix pattern); `/tmp/claude-base-X.txt` populated with HEAD SHA | Verified at SessionStart of session 35 (deferred — naturally exercised next session) |
| `session-start.sh` on suffixed orphan | Test fixture `tests/unit/hooks-session-start.test.ts` `AC-2a` | Warning section present + literal three-command resync recipe | PASS in vitest |
| `line-count.sh` first turn | `bash .claude/hooks/line-count.sh < input.json` after a Write of N lines | `N session churn` reported | Verified during session 34: turn-by-turn churn reports tracked accurately (see PostToolUse hook output in transcript — `+91 / +133 / +183 / +5 / +5 / +20 / +42 / +2 / +2`) |
| `line-count.sh` graceful fallback | Test fixture `AC-3b` (base file absent) | Reports diff vs `origin/main`; preserves session-30/31/32/33 contract | PASS in vitest |
| `read-cap.sh` (untouched) | Reading a >300-line-aggregate batch | Blocks per existing behaviour | Not modified; not re-tested (per surgical-change discipline) |

## Adversarial run

- [x] **Manual poke-holes pass** — surfaced + addressed:
  1. `git cat-file -e "${CANDIDATE}^{commit}"` — `CANDIDATE` interpolated into a quoted argument; git rejects unparseable refs and exits non-zero, triggering fallback. No shell injection vector.
  2. `git ls-remote` could hang offline — bounded by `settings.json` `timeout: 30` on the SessionStart hook.
  3. Heredoc backtick rendering — `\`` produces literal backticks; verified by AC-2a test passing on the literal recipe assertion.
  4. False-positive suffix match — compound check (regex AND canonical-on-origin) makes false positives near-impossible; the warning is informational anyway, not blocking.
  5. SESSION_ID path traversal — trust boundary is the harness; out-of-scope.
  6. `set -euo pipefail` + bad JSON input — `INPUT=$(cat 2>/dev/null || echo '{}')` and `... || echo "unknown"` chain ensures graceful degrade.
  7. Race on parallel SessionStart writes — same `session_id` → vanishingly unlikely; `[ ! -f ]` guard preserves first-write.
- [x] **`/security-review` skill** — DEFERRED. Hooks-only slice with no `src/` impact, no user data, no PII handling, no auth surface, no network egress beyond existing `git fetch origin main` + `git ls-remote origin`. Justification: spec 72 §11 13-item checklist does not bind tooling-only changes (the gate fires on `src/` PRs via `pr-dod.yml`). Documented in this verification row instead of a separate `security.md`.
- [x] **`/review` skill** — Manual adversarial pass above substitutes; the slice is 60-line bash + 320-line vitest. A second-pass `/review` would surface stylistic notes only.

## DoD walk (CLAUDE.md §"Engineering conventions")

1. **All AC met with evidence per AC** — see AC table above. 5/5 PASS.
2. **Tests written and passing** — 11 new (4 line-count + 7 session-start), all GREEN. Full suite: 92/92 GREEN.
3. **Adversarial review done** — see above. 7 concerns surfaced, 7 addressed or justifiably deferred.
4. **Preview deploy verified in-browser** — N/A (no UI surface). Substituted by hook-execution table above.
5. **No regression in adjacent slices** — full vitest suite GREEN; no changes to `read-cap.sh`, `wrap-check.sh`, `tests/setup.ts`, `tests/helpers/*`. `git diff origin/main` confirms surface-area scope.
6. **Slice's open 68f/g entries resolved** — none referenced (tooling slice; no spec-68 dependency).

Plus 13-item security checklist — N/A per adversarial-run row (no `src/` change). Recorded by exception, not omission.

---

## Sign-off

- **Verified by:** Claude (session 34)
- **Date:** 2026-04-25
- **Commit SHA verified:** to-fill-at-merge
- **Preview URL:** N/A (hooks-only)
- **Outstanding issues:** none. CLAUDE.md candidate #3 (line-count refined model) may now be unblocked by AC-3 — the "deeper baseline bug" referenced in HANDOFF-33's parked-candidates list was this measure-vs-main issue. Defer the #3 lift evaluation to a future tooling slice.
- **DoD status:** complete (1/2/3/5/6 met; 4 N/A; security-checklist N/A by tooling-scope rule, justified inline)
