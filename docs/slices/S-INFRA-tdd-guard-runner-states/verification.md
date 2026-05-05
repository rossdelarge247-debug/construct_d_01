# S-INFRA-tdd-guard-runner-states — verification

## Status

✅ MET (slice ship state).

## AC table

| AC | Description | Status | Evidence |
|---|---|---|---|
| AC-1 | DEGRADED state passes through with `npm install` note | ✅ MET | `.claude/hooks/tdd-guard.sh` L207-217 inserts a degraded-runner branch ahead of the RED block; detects `RC == 127` OR "vitest: not found" / "command not found: vitest" in `$TMP_OUT`; emits "vitest not installed; skipping for <path>" + `npm install` recommendation; exits 0. Verified by Fixture 9 in `tests/shellspec/tdd-guard.spec.sh`. |
| AC-2 | `TDD_GUARD_REDGREEN_OVERRIDE=1` env hatch allows RED | ✅ MET | `.claude/hooks/tdd-guard.sh` L231-244 inserts an env-hatch branch between the first-creation chicken-and-egg branch and the RED block; only the literal value "1" bypasses (`"${TDD_GUARD_REDGREEN_OVERRIDE:-}" = "1"`); emits advisory note recommending vitest re-run after the batch; exits 0. BLOCKED-message §Actionable alternatives updated at L259-260 to surface the override. Verified by Fixture 10 (positive: env=1 → success) + Fixture 11 (defensive: env=0 still blocks). |

## Test results

- `shellspec tests/shellspec/tdd-guard.spec.sh` — **13/13 GREEN** (was 10/10 pre-PR; +3 from new fixtures 9-11)
- `shellspec` (full suite) — see PR test plan for final count

## Surface

- `.claude/hooks/tdd-guard.sh` — +33 lines (degraded-runner branch + env-hatch branch + BLOCKED-message update)
- `tests/shellspec/tdd-guard.spec.sh` — +73 lines (3 new fixtures)
- `docs/slices/S-INFRA-tdd-guard-runner-states/acceptance.md` — new (~95 lines)
- `docs/slices/S-INFRA-tdd-guard-runner-states/verification.md` — this file

## Sign-off

Slice ships behaviour: hook now distinguishes 4 runner states (GREEN /
RED / DEGRADED / OVERRIDE) where it previously distinguished 2
(GREEN / non-zero-exit-treated-as-RED). DEGRADED handling unsticks
the recurring turn-0 friction (vitest absent in fresh `node_modules`
state); OVERRIDE handling provides a one-shot escape for cases where
the allowlist mechanism is too heavyweight.

## Status footer

- Created: at slice ship
- AC scope locked at acceptance.md authoring; impl matches AC text
- v3b AC-6 reference (extended; v3b stays closed)
