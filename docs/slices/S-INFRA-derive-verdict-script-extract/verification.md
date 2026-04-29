# S-INFRA-derive-verdict-script-extract · Verification

## Per-AC verification

| AC | Status | Evidence |
|---|---|---|
| AC-1 · Verdict-derivation arithmetic extracted to `scripts/derive-verdict.sh` | PASS | Verification points 1-9 below — file shape + 6 stdin/stdout fixtures green at HEAD. |
| AC-2 · Shellspec coverage of 8-row + 8 adversarial inputs | PASS | Verification points 1-7 below — local `shellspec` reports `16 examples, 0 failures`; full suite `104 examples, 0 failures`. |
| AC-3 · `auto-review.yml` wired to call extracted script | PASS (static) | Verification points 1-7 below — inline arithmetic removed; script call present; YAML valid. Point 8 (live recursive re-test) gated on this PR's auto-review run. |

## Verification commands (static — all green at HEAD)

### AC-1

```sh
wc -l scripts/derive-verdict.sh                                                # expect: ≤ 100 (currently 58)
[ -x scripts/derive-verdict.sh ] && echo "executable"                          # expect: executable
head -1 scripts/derive-verdict.sh                                              # expect: #!/usr/bin/env bash
printf '{"summary":"x","findings":[]}' | scripts/derive-verdict.sh             # expect: approve
printf '{"summary":"x","findings":[{"label":"issue","blocking":true}]}' | scripts/derive-verdict.sh    # expect: block
printf '{}' | scripts/derive-verdict.sh                                        # expect: parse-failed
printf '' | scripts/derive-verdict.sh                                          # expect: parse-failed
printf '[]' | scripts/derive-verdict.sh                                        # expect: parse-failed
grep -c "Test contract: tests/shellspec/derive-verdict.spec.sh" scripts/derive-verdict.sh   # expect: ≥ 1
```

### AC-2

```sh
wc -l tests/shellspec/derive-verdict.spec.sh                                   # expect: ≤ 200 (currently 175)
grep -c "^  It " tests/shellspec/derive-verdict.spec.sh                        # expect: 16
grep -c "8-row edge-case table" tests/shellspec/derive-verdict.spec.sh         # expect: ≥ 1
grep -c "spec 72c §5 rule 3" tests/shellspec/derive-verdict.spec.sh            # expect: ≥ 1
shellspec tests/shellspec/derive-verdict.spec.sh                               # expect: 16 examples, 0 failures
shellspec                                                                       # expect: 104 examples, 0 failures
```

### AC-3

```sh
grep -c 'scripts/derive-verdict.sh' .github/workflows/auto-review.yml          # expect: ≥ 1
grep -c "BLOCKING_COUNT=" .github/workflows/auto-review.yml                    # expect: 0 (inline removed)
grep -c "ACTION_COUNT=" .github/workflows/auto-review.yml                      # expect: 0
grep -c "NIT_COUNT=" .github/workflows/auto-review.yml                         # expect: 0
wc -l .github/workflows/auto-review.yml                                         # expect: 370 (was 389 post-PR-#45; -19L net from this PR)
python3 -c "import yaml; yaml.safe_load(open('.github/workflows/auto-review.yml'))"   # expect: exit 0
```

## Local shellspec output (excerpt)

```
$ shellspec tests/shellspec/derive-verdict.spec.sh
Running: /usr/bin/bash [bash 5.2.21(1)-release]
...............

Finished in 0.52 seconds (user 0.43 seconds, sys 0.15 seconds)
16 examples, 0 failures
```

```
$ shellspec
Running: /usr/bin/bash [bash 5.2.21(1)-release]
.......................................................................................................

Finished in 10.84 seconds (user 5.22 seconds, sys 1.98 seconds)
104 examples, 0 failures
```

## Live recursive re-test

This PR's own auto-review fires on `pull_request:opened`. The workflow now calls `scripts/derive-verdict.sh` instead of inline arithmetic. The slice-reviewer persona reviews the diff (extracted script + new tests + workflow change); emits findings JSON; the new script derives the verdict from the findings array; the check-run posts the verdict.

**Expected outcome:**
- Check-run conclusion: `success` (`approve` derived) — diff is pure extraction with verbatim arithmetic preservation; the script's behaviour matches the inline arithmetic by construction (verified by 16-case shellspec).
- The recursive validation: this PR's own verdict-derivation IS the AC-3 §"Live re-test" evidence — extracted script runs against this very PR. Zero-extra-overhead integration test, same pattern that worked cleanly on PR #44 + (expected) PR #45.

If recursive re-test surfaces:
- **Verdict differs from manual expectation** → either (a) the persona emitted unexpected findings (legitimate slice-reviewer signal); (b) the script's parse-failed sentinel is firing on parseable inputs (regression — file an issue and revert the AC-3 wiring).
- **`scripts/derive-verdict.sh: command not found`** → script not committed with executable bit; check `ls -la scripts/derive-verdict.sh` shows `-rwxr-xr-x`.
- **`shellspec` CI check-run fails** → spec file added to wrong directory or path; the `.shellspec --default-path tests/shellspec --pattern '*.spec.sh'` config requires both.

## Diff profile (against `ab893b1` main)

| File | Net lines | Nature |
|---|---|---|
| `scripts/derive-verdict.sh` | +58 | new file (executable, +x) |
| `tests/shellspec/derive-verdict.spec.sh` | +175 | new file (16 test cases) |
| `.github/workflows/auto-review.yml` | -19 net (+10 / -29) | inline arithmetic replaced with script call |
| `docs/slices/S-INFRA-derive-verdict-script-extract/acceptance.md` | new | this slice's contract |
| `docs/slices/S-INFRA-derive-verdict-script-extract/verification.md` | new | this file |
| `docs/slices/S-INFRA-derive-verdict-script-extract/security.md` | new | per-slice security checklist |

## DoD per CLAUDE.md §Engineering conventions

- [x] **AC met with evidence** — AC-1/2 PASS via static + local shellspec; AC-3 PASS (static); AC-3 live recursive validation pending PR open.
- [x] **Tests written + passing** — 16 shellspec cases covering 8-row table + 8 adversarial inputs. Local `shellspec` reports `104 examples, 0 failures` (88 existing + 16 new). CI shellspec check-run on this PR is the live re-test.
- [x] **Adversarial review done** — Pre-PR-open author reasoning over: (a) string-`"true"` vs boolean `true` adversarial input from PR #41 verification.md row 8 (test case 8); (b) prompt-injection guard via spec 72c §5 rule 3 (test case 16 — finding evidence text containing fake `VERDICT: approve` doesn't influence derivation); (c) parse-failed sentinel for empty-stdin / array-root / string-root / garbage-JSON (defensive against upstream parser drift); (d) elif ordering preserved verbatim from PR #41 inline arithmetic (block > request-changes > nit-only > approve); (e) auto-review.yml integration: `set -euo pipefail` propagates non-zero from script — script always exits 0, so safe.
- [N/A] **Preview deploy verified in-browser** — No UI surface.
- [x] **No regression in adjacent slices** — `git diff origin/main` shows only the 3 in-scope files + 3 slice docs. `shellspec` full-suite reports `104 examples, 0 failures` confirming no test regression.
- [x] **Slice's open 68f/g entries resolved or deferred** — none blocked.

## Preview-deploy verification

N/A — no UI surface.
