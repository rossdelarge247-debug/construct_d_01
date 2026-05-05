# S-INFRA-tdd-guard-runner-states — acceptance

## Status

In progress. Extends `.claude/hooks/tdd-guard.sh` (v3b AC-6) with two
runner-state branches that today are conflated with the RED verdict.

## Why

`tdd-guard.sh` exits 2 ("BLOCKED — RED test") whenever `npx vitest run`
returns non-zero. That conflates three distinct states:

1. **GREEN** — test passes; allow the edit.
2. **RED** — test exists, ran, failed an assertion; block the edit.
3. **DEGRADED** — runner is unavailable (vitest binary missing because
   `node_modules/` is empty at turn-0). Today this exits 127 with
   "vitest: not found" in stderr and the hook treats it as RED.
4. **OVERRIDE** — author has a known-good reason to proceed past a RED
   (lint-fix-refactor batch + mid-rename atomic patterns). Today the
   only escape is a `docs/tdd-exemption-allowlist.txt` entry under
   `control-change` label, which is heavyweight for a one-shot.

States 3 + 4 deserve their own treatment. AC-1 covers DEGRADED; AC-2
covers OVERRIDE.

## Acceptance criteria

### AC-1 — DEGRADED state passes through with `npm install` note

When `npx vitest` exits 127 OR stderr contains "vitest: not found" /
"command not found: vitest", the hook MUST exit 0 with a one-line
note pointing the author at `npm install`. The note MUST NOT use the
"BLOCKED" header (which signals a RED verdict — distinct from a
runner-unavailable state).

**In scope:**
- Detect `RC == 127` (POSIX "command not found" exit code)
- Detect "vitest: not found" / "command not found: vitest" anywhere in
  the captured `$TMP_OUT` (covers shells that emit these via stderr
  but exit with a different code)
- Emit a clear note: `tdd-guard: vitest not installed; skipping for <path>.`
- Exit 0 (allow the edit; no further gate logic in this branch)

**Out of scope:**
- Auto-running `npm install` from the hook (heavy side effect; author
  decides; hook surfaces the cause + remediation only)
- Detecting other runner failures (e.g. node version mismatch, missing
  package.json) — those still flow to the RED branch and are surfaced
  via the existing `tail -n 40 "$TMP_OUT"` output

### AC-2 — `TDD_GUARD_REDGREEN_OVERRIDE=1` env hatch allows RED

When the env var `TDD_GUARD_REDGREEN_OVERRIDE` is set to the literal
string `1`, the hook MUST exit 0 with an advisory note instead of the
BLOCKED RED message.

**In scope:**
- Only the literal value `1` bypasses; all other values (`0`, `yes`,
  unset, empty string) keep the gate active (defensive against
  accidental truthy-coercion via shell quoting)
- Note format: `tdd-guard: TDD_GUARD_REDGREEN_OVERRIDE=1 set; allowing RED test for <path>.`
- Note SHOULD recommend re-running `npx vitest run <test-file>` after
  to confirm GREEN once the batch lands
- Hook's BLOCKED-message §Actionable alternatives MUST surface the
  override (so authors discover it without grepping the hook)

**Out of scope:**
- Logging override usage to a tally file (deferred; if abuse becomes a
  pattern, add at that point — measure first per CLAUDE.md "Goal-
  driven execution")
- Per-path override scope (env var applies to the current invocation
  only; covers the common case)

## Verification

3 new shellspec fixtures in `tests/shellspec/tdd-guard.spec.sh`:

- **Fixture 9** — DEGRADED: vitest stub exits 127 → hook exits 0 with
  "vitest not installed" note; no BLOCKED message
- **Fixture 10** — OVERRIDE positive: env=1 + RED stub → hook exits 0
  with override note; no BLOCKED message
- **Fixture 11** — OVERRIDE negative defensive: env=0 + RED stub → hook
  exits 2 with BLOCKED message (only literal "1" bypasses)

Plus existing 13 fixtures remain GREEN (1-8 numbered + 2 out-of-scope).

## Out of scope

- Lint-fix-refactor case detection (the env hatch addresses this; no
  separate detection needed)
- Mid-rename atomic-rewrite case detection (covered by the env hatch
  for the cases where the Bash python escape isn't viable; the python
  escape remains the documented preferred pattern)

## Status footer

- Owner: hook author
- Slice opens against: v3b AC-6 (extended; v3b stays closed)
- DoD checklist: applies at slice ship; verification.md tracks final-state
