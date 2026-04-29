# S-INFRA-rigour-parse-failed-pipeline-crashed-merge-gate · Verification

## Per-AC verification

| AC | Status | Evidence |
|---|---|---|
| AC-1 · Promote parse-failed + pipeline-crash to `failure`; preserve secret-missing → `neutral` | PASS (static) | Verification points 1-9 below — workflow YAML valid; greps confirm the value flips landed; CLAUDE.md L251 row updated; secret-missing path untouched. Points 10-11 (recursive auto-review + recursive merge-gate test) gated on this PR's own auto-review run. |

## Verification commands (static — all green at HEAD)

```sh
# Verdict-mapping case statement
grep -cE 'parse-failed\)\s+CONCLUSION="failure"' .github/workflows/auto-review.yml         # expect: 1
grep -cE 'parse-failed\)\s+CONCLUSION="neutral"' .github/workflows/auto-review.yml         # expect: 0

# Failure-fallback step jq input
grep -c 'conclusion: "failure", output: {title: "Review pipeline crashed' .github/workflows/auto-review.yml   # expect: 1
grep -c 'conclusion: "neutral", output: {title: "Review pipeline crashed' .github/workflows/auto-review.yml   # expect: 0

# Secret-missing path unchanged
grep -c 'conclusion: "neutral", output: {title: "Skipped — ANTHROPIC_API_KEY' .github/workflows/auto-review.yml  # expect: 1

# CLAUDE.md gate-table row
grep -c 'partially merge-gating' CLAUDE.md                                                  # expect: 1
grep -c 'informational at v3b ship; verdict posts as check run (no merge gate)' CLAUDE.md   # expect: 0

# YAML valid
python3 -c "import yaml; yaml.safe_load(open('.github/workflows/auto-review.yml'))"         # expect: exit 0

# File size sanity
wc -l .github/workflows/auto-review.yml                                                     # expect: ≤ 410
```

## Live recursive re-test

This PR's own auto-review fires on `pull_request:opened`. Two distinct things get tested simultaneously:

1. **Persona reviews the diff.** The slice-reviewer reads the workflow comment expansions + 2 `CONCLUSION` value flips + 2 `conclusion:` JSON value flips + CLAUDE.md L251 row + slice docs. Expected verdict: `approve` or `nit-only` (pure value-flip refactor; behaviour change is documented in acceptance.md AC-1 `In scope`).

2. **The new failure-gate behaviour takes effect on this commit.** If the persona output parses cleanly (which it should, per session-51 verdict-coercion fixture coverage), the check-run conclusion is derived from the verdict's findings array — NOT from the parse-failed sentinel. So the new `parse-failed → failure` mapping is not exercised at runtime on this PR; it's exercised the next time persona output ever malforms (a real test that requires a malfunction event to trigger).

   Pipeline-crash → `failure` *would* be exercised on this PR if any earlier workflow step fails (`if: failure()` branch), but the workflow is well-tested and unlikely to crash on a YAML-comment-and-value-flip diff.

**Expected outcome:**
- Check-run conclusion: `success` (`approve` derived) — diff is a small refactor + doc updates; all changes documented in AC-1 §In scope.
- The recursive validation is structural (does the YAML still parse, does the workflow still execute end-to-end) rather than behavioural (was the new gating triggered).

If recursive re-test surfaces:
- **Verdict `parse-failed` on this PR's own diff** → meta-validation: the new failure-gate would block its own merge. That's the intended behaviour BUT also the canary; investigate the persona malfunction (probably a transient SDK issue) and re-run the workflow.
- **Workflow YAML syntax error** → caught by static verification point 8 (`yaml.safe_load`); not expected here.
- **Persona flags an undeclared-scope finding for the `CLAUDE.md` L251 edit** → AC-1 §In scope explicitly lists "CLAUDE.md line 251 (gate-table row)"; the persona should map the diff to the listing.

## Diff profile (against `f423322` main)

| File | Net lines | Nature |
|---|---|---|
| `.github/workflows/auto-review.yml` | +20 / -7 net | header comment expanded; verdict-mapping comment block expanded; `parse-failed` value flip neutral→failure; failure-fallback step comment + jq conclusion + comment-body framing updated |
| `CLAUDE.md` | +1 / -1 net | gate-table row L251 rewritten to describe partial-promotion |
| `docs/slices/S-INFRA-rigour-parse-failed-pipeline-crashed-merge-gate/acceptance.md` | new | this slice's contract (1 AC) |
| `docs/slices/S-INFRA-rigour-parse-failed-pipeline-crashed-merge-gate/security.md` | new | 13-item security checklist + promotion-specific risk analysis |
| `docs/slices/S-INFRA-rigour-parse-failed-pipeline-crashed-merge-gate/verification.md` | new | this file |

## Adversarial review pre-flight

Per CLAUDE.md §"Engineering conventions" §"Adversarial review gate". Concerns considered:

- **Q: Could a transient Claude API outage block all merges during the outage window?** A: Yes for any PR whose auto-review fires during the window. Mitigation: re-running the workflow is a one-click recovery; the next run's verdict supersedes the failure check on the same head SHA. Bounded blast radius. Same recovery path that already existed at v3b for any flaky CI step.
- **Q: Does the failure-fallback step's `if: failure()` correctly fire when a *deliberate* `block` verdict produces an exit-status != 0 from `derive-verdict.sh`?** A: No — `derive-verdict.sh` exits 0 even on `block` (per `docs/slices/S-INFRA-derive-verdict-script-extract/acceptance.md` AC-1: "Exit code 0 on any output"). The verdict is read from stdout, not exit status. So `block` flows through the verdict-mapping case statement and the failure-fallback step does NOT fire. Only genuine workflow-step crashes (npx, claude, jq, gh api) trigger the fallback.
- **Q: Could an attacker DoS a PR by pushing prompt-injection content that triggers parse-failed?** A: Bounded — every push triggers a fresh auto-review on the new head SHA; if the attacker keeps pushing parse-failed-triggering content, the maintainer sees the pattern and intervenes (close PR, ban contributor). Not a new attack surface; pre-promotion the same content produced `neutral` checks the maintainer could ignore — post-promotion they're forced to investigate, which is the intended escalation.
- **Q: Why isn't there a workflow-level admin-bypass label (e.g. `auto-review-bypass`)?** A: Out of scope this slice. If a legitimate need to override the new failure-gate emerges (e.g. a stuck-flaky-period during an SDK upgrade window), a follow-up slice can add the label-based bypass. Deferred per simplicity-first.
- **Q: Does CLAUDE.md L251 still parse cleanly as a markdown table row?** A: Yes — single-row replacement preserves the column structure (id / file paths / fires-on / AC ref / bypass description). Pipe-character count unchanged.
- **Q: Recursive validation — what if THIS PR's auto-review parse-fails because of the workflow change itself?** A: Logically not possible: the workflow change is a value-flip (`"neutral"` → `"failure"` in two locations) plus comment-block expansions. The persona-invocation path (npx + claude + jq) is unchanged. If parse-failed fires on this PR, the cause is the same SDK/network/runner flake that would have caused it pre-promotion; the only difference is the maintainer now has to re-run instead of merging-anyway. That's the desired behaviour.

No findings deferred; all concerns addressed in this slice or marked Out of scope in `acceptance.md`.

## Definition of Done (per CLAUDE.md §"Engineering conventions" §"Definition of Done")

1. **All ACs met with evidence.** ✅ AC-1 verification points 1-9 green at HEAD.
2. **Tests written and passing.** ✅ No new tests required (value-flip in YAML; behaviour gated by existing 16-case verdict-coercion shellspec contract per `docs/slices/S-INFRA-derive-verdict-script-extract/`). YAML validity verified by `yaml.safe_load`.
3. **Adversarial review done; concerns addressed or explicitly deferred.** ✅ See §"Adversarial review pre-flight" above (6 concerns considered).
4. **Preview deploy verified in-browser if UI.** N/A — no `src/` touched; no UI surface.
5. **No regression in adjacent slices.** ✅ Per AC-1 `In scope`, only `auto-review.yml` value flips + CLAUDE.md L251 + slice docs. The verdict-derivation contract (16-case shellspec) is unchanged; the failure-fallback `if: failure()` semantics unchanged; secret-missing skip path unchanged.
6. **Slice's open 68f/g entries resolved or explicitly deferred.** N/A — slice does not touch product surface.

Plus 13-item security checklist (spec 72 §11): per `security.md` — 4 PASS / 1 MEANINGFUL-NEUTRAL / 8 N/A / 0 FAIL. The MEANINGFUL-NEUTRAL is the new bounded DoS surface (re-run-superseded), explicitly recorded for operational vigilance.
