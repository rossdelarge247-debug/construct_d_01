# HANDOFF — Session 39

**Date:** 2026-04-27
**Branch:** `claude/S-INFRA-rigour-v3a-foundation` @ `8bf866f` · 28 ahead of `origin/main` `92f77d7`
**PR:** [#24 (draft)](https://github.com/rossdelarge247-debug/construct_d_01/pull/24)
**Outcome:** All session-37-budgeted v3a items landed PASS with PR #24 GREEN end-to-end. AC-2 part 2 (control-change-label workflow) pulled forward from session 38. v3a session-38 budget remaining: AC-1 full impl, AC-5, AC-6.

## Numbering note

HANDOFF-37 closed session 37. HANDOFF-38-PARTIAL-CRASH captured a crashed session-38 attempt that landed only `S-37-0`. Intervening recovery sessions landed `S-37-1` through `S-37-5` without producing handoffs. This session resumed from `60bede1` (S-37-5 wrap) and is numbered 39 sequentially.

## What landed this session

| Commit | Slice | What |
|---|---|---|
| `d8ecbc5` | S-37-6 | exit-plan-review hook + `git-state-verifier.sh` + nonce framing + 17 shellspec tests (AC-7) |
| `3b69b34` | S-37-6 fix | hermetic git fixture for plan-review tests — fixes CI shellspec failure on shallow detached-HEAD checkout |
| `b9ce33c` | v3b carry-over | propagate first deferred concern to v3b/acceptance.md |
| `ad497fb` | S-37-7 | `.github/workflows/control-change-label.yml` with self-inclusive path filter (AC-2 part 2, pulled forward from session 38) |
| `9490999` | S-37-7a | refactor control-change workflow from `on.paths:` to step-level path detection — branch-protection-compatible |
| `8bf866f` | S-37-8 | CLAUDE.md `## Hard controls (in development)` stub: gates table + verdict vocabulary + rollback procedure (AC-8) |

**Slice status (per `verification.md`):** AC-1 skeleton, AC-2 (both parts), AC-3, AC-4, AC-7, AC-8 all PASS. Remaining v3a session-38 items: AC-1 full impl (L67), AC-5 TDD-every-commit (L74), AC-6 coverage gate (L75).

## Live verification on PR #24

- shellspec went RED then GREEN after the fixture fix (`3b69b34`).
- Control-change check verified in **both directions** on the same PR's CI history:
  - Run `73202996782` → FAIL (no label)
  - Run `73203499127` → PASS after `labeled` event re-trigger
  - Run `73228330928` (post-S-37-7a refactor) → PASS via skip-reason path on a non-control-plane edit
- All 15 checks GREEN at HEAD `8bf866f`.

## What went well

1. **Diagnose-before-fix on the shellspec CI failure.** Read the workflow file + paid attention to GitHub Actions checkout semantics (shallow + detached-HEAD on `pull_request` events) before guessing — root-caused in one investigation pass and the hermetic-fixture refactor stuck.
2. **Adversarial-review pass surfaced two deferred concerns** that would have been silently lost (stub-mode subagent default + `git-state-verifier.sh` not in L199). Both propagated to `v3b/acceptance.md` so v3b drafters will see them.
3. **Branch-protection compatibility caught at refactor time, not deploy time.** Workflow used `on.paths:` first; recognising the "required check that never reports" trap before the user enabled the rule saved a debugging round-trip.
4. **Live two-direction proof of the control-change gate on PR #24 itself.** Same PR demonstrated fail-without-label → pass-with-label → pass-on-no-protected-paths via the workflow's actual CI history. No separate test fixture needed for the YAML gate.

## What could improve

1. **L199 protected-path enumeration is stale.** Three artefacts in `hooks-checksums.txt` baseline (`scripts/eslint-no-disable.sh`, `docs/eslint-baseline-allowlist.txt`, `scripts/git-state-verifier.sh`) are not in L199's literal text. Carried to `v3b/acceptance.md` rather than amended in v3a — but worth a real audit pass at v3b kickoff.
2. **`on.paths:` mistake on first-pass workflow.** Should have anticipated the branch-protection interaction by mirroring `pr-dod.yml`'s pattern from the start; cost one refactor commit. Note for future workflow design: **always step-level detection unless the workflow explicitly does NOT need to be a required status check**.
3. **AC-7 stub-mode subagent default may be the right answer or the wrong answer.** Deferred to v3b on grounds of LLM-call cost / latency uncertainty; we don't actually know the cost yet. v3b should measure on a sample of plans before deciding.

## Key decisions

1. **Pulled AC-2 part 2 forward from session 38 to session 37** to unblock the user's held branch-protection precondition. Spec L71's `38` is an estimate not a constraint; reordering the SAME slice's ACs is not scope creep.
2. **Used git plumbing (`commit-tree` + `update-ref`) for shellspec git fixtures** rather than `git commit` — bypasses the project's commit-signing path inside throwaway fixtures. Honest test isolation, not policy bypass; documented inline.
3. **Refactored the workflow from path-filter to step-level detection** per `pr-dod.yml`'s pattern. Same security guarantee; branch-protection-compatible.
4. **Did not re-baseline `hooks-checksums.txt` to include the new `control-change-label.yml`** — workflow files are protected via path-filter self-inclusion (L199's chosen mechanism for them), not checksum.

## Known issues / deferred concerns

Per `docs/slices/S-INFRA-rigour-v3a-foundation/verification.md` § "Adversarial review" + `docs/slices/S-INFRA-rigour-v3b-subagent-suite/acceptance.md` § "Carry-over from v3a":

1. **Stub-mode subagent default for AC-7 plan-review** (deferred to v3b — needs cost / latency measurement).
2. **Three L199 protected-path omissions** (deferred to v3b — needs spec amendment).
3. **Inherent LLM-input-separation limit** in fake-nonce containment (acknowledged in v3a verification.md; not actionable as a slice item).

## Next session first actions

1. **Verify branch state** per SessionStart hook. Expected: `claude/S-INFRA-rigour-v3a-foundation` @ `8bf866f` (or wherever subsequent pushes have moved it), 28+ ahead of main, working tree clean.
2. **Re-fetch PR #24 CI status** to confirm green carries through.
3. **Confirm with user**: are they ready to merge PR #24 (all v3a session-38 budget items complete) or pull AC-1 full impl + AC-5 + AC-6 forward into the same branch first? Per L156 PR #24 merges when external preconditions are met; user has confirmed label + branch protection setup.
4. **If continuing v3a**: begin AC-1 full impl per L67 (~100 lines). Workhorse for AC-5 + AC-6.
5. **If wrapping v3a**: confirm the merge is clean, then v3b planning per `docs/slices/S-INFRA-rigour-v3b-subagent-suite/acceptance.md` (currently a 32-line stub awaiting full draft).
