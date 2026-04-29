# S-INFRA-auto-review-resolver-parser-extract · Verification

## Per-AC verification

| AC | Status | Evidence |
|---|---|---|
| AC-1 · Slice-AC resolver extracted | PASS | 8 shellspec cases green; static grep evidence below. |
| AC-2 · Parse fallback extracted | PASS | 13 shellspec cases green (3 success-mode + 3 failure-mode classes); empty-result guard fixes a latent inline edge case. |
| AC-3 · `auto-review.yml` shrinks to thin orchestrator | PASS (static) | Inline logic removed; script calls present; -21L net. Live recursive validation pending PR open. |

## Verification commands (all green at HEAD)

```sh
# AC-1
wc -l scripts/auto-review-slice-resolve.sh                      # 33 (≤ 60) ✓
[ -x scripts/auto-review-slice-resolve.sh ] && echo executable  # ✓
grep -c 'PR #38' scripts/auto-review-slice-resolve.sh           # ≥ 1 (WHY comment present) ✓

# AC-2
wc -l scripts/auto-review-parse.sh                              # 58 (≤ 80) ✓
[ -x scripts/auto-review-parse.sh ] && echo executable          # ✓
grep -c 'parse-failed sentinel' scripts/auto-review-parse.sh    # ≥ 1 ✓

# AC-3
grep -c 'scripts/auto-review-slice-resolve.sh' .github/workflows/auto-review.yml  # ≥ 1 ✓
grep -c 'scripts/auto-review-parse.sh' .github/workflows/auto-review.yml          # ≥ 1 ✓
grep -c 'SLICE_FROM_BRANCH=' .github/workflows/auto-review.yml                    # 0 (inline resolver var removed) ✓
grep -c 'RESULT=$(jq -r' .github/workflows/auto-review.yml                        # 0 (inline parser stage 1 removed) ✓
wc -l .github/workflows/auto-review.yml                                            # 368 (was 389; -21L) ✓
python3 -c "import yaml; yaml.safe_load(open('.github/workflows/auto-review.yml'))"  # exit 0 ✓

# Tests
shellspec tests/shellspec/auto-review-slice-resolve.spec.sh tests/shellspec/auto-review-parse.spec.sh
# 21 examples, 0 failures ✓
shellspec
# 109 examples, 0 failures (88 existing + 21 new) ✓
```

## Latent edge case fixed

`scripts/auto-review-parse.sh` adds an explicit empty-`.result` guard (line 41: `if [ -z "$RESULT" ]; then echo '{}'; exit 0; fi`) that the inline code in `auto-review.yml` lines 138-150 lacked. The inline behaviour:

```bash
PERSONA_JSON=$(printf '%s' "" | jq -c '.' 2>/dev/null) \
  || PERSONA_JSON='{}'
```

`jq -c '.'` on empty stdin returns exit 0 with empty stdout (jq's documented behaviour). The `||` doesn't fire, so `PERSONA_JSON=""` (empty string) — NOT `'{}'`. Downstream verdict-derivation jq calls then crash with `set -euo pipefail` on the empty string. In production this never hit because real claude envelopes always have non-empty `.result`; but a network truncation, claude-CLI failure, or future API drift could trigger it.

The script's defensive guard catches the edge case and funnels to `'{}'` (parse-failed sentinel). Test cases 7-9 (empty object envelope · empty `.result` · empty stdin) exercise this fix.

## Diff profile

| File | Net lines | Nature |
|---|---|---|
| `scripts/auto-review-slice-resolve.sh` | +33 | new file (executable) |
| `scripts/auto-review-parse.sh` | +58 | new file (executable; closes empty-result edge case) |
| `tests/shellspec/auto-review-slice-resolve.spec.sh` | +85 | new file (8 tests) |
| `tests/shellspec/auto-review-parse.spec.sh` | +137 | new file (13 tests) |
| `.github/workflows/auto-review.yml` | -21 net (+13 / -34) | inline blocks replaced with script calls |
| `docs/slices/S-INFRA-auto-review-resolver-parser-extract/{acceptance,verification,security}.md` | new | slice docs |

## DoD per CLAUDE.md §Engineering conventions

- [x] **AC met with evidence** — AC-1/2 PASS via static + local shellspec; AC-3 PASS (static); live recursive validation on this PR.
- [x] **Tests written + passing** — 21 new shellspec cases; full suite 109/0; no regression.
- [x] **Adversarial review done** — Author reasoning over: (a) regex case-sensitivity (lowercase `s-` not matched — captured in test); (b) PR-body multi-cite first-match preserved (matches existing `head -1` behaviour); (c) empty-result guard prevents silent empty-string propagation through `set -euo pipefail`; (d) fence-stripping with leading whitespace handled (test case 3 of parse spec); (e) script invocation from workflow uses relative path — assumes `actions/checkout@v4` already ran (it has by the time these steps fire).
- [N/A] **Preview deploy verified in-browser** — No UI surface.
- [x] **No regression in adjacent slices** — `git diff origin/main` shows 5 in-scope files + 3 slice docs. Full shellspec suite green.
- [x] **Slice's open 68f/g entries resolved or deferred** — none blocked.

## Preview-deploy verification

N/A — no UI surface.
