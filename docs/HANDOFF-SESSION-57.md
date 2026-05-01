# Session 57 — Multi-agent rigour suite efficiency layer + F5c ratchet + pre-flight

## What shipped

3 substantive PRs + 1 admin-bypass override; P3 deferred:

- **PR #63 (P0): differential-mode token-cost loop** — 4 rounds, merged at 52dd95d
- **PR #64 (P1): F5c origin/main-anchored ratchet (ESLint count + coverage thresholds)** — 2 rounds + admin-bypass override (Path A on v3a-vs-v3c scope conflict), merged at b3ecd2a
- **PR #65 (P2): pre-flight self-review (script + slash command + pre-push hook)** — 2 rounds, standard merge, merged at dae5405
- P3 (synthetic-deliberate-injection per-persona fixtures): deferred to session 58 per budget call

## Multi-agent KPI signal — n=3 calibration data points under k=2 default

Spec 72c §1 target: ≤2 rounds for equivalent finding density.

| PR | Rounds | R1 findings | R1 blocking | Final verdict | Shadow k=1 / k=3 (final round) |
|---|---|---|---|---|---|
| #63 (P0) | 4 | 6 | 2 | approve | k=1=approve / k=3=approve |
| #64 (P1) | 2 | 7 | 0 | block (k=2 fired R2) → admin-bypass | k=1=block / k=3=request-changes |
| #65 (P2) | 2 | 7 | 1 (vote-of-1) | request-changes | k=1=block / k=3=approve |

**n=3 mean rounds = 2.7.** Target = 2. PR #63's 4-round outlier was driven by a real CRITICAL protocol bug caught round 1 (`head -n 1` truncation); PRs #64 + #65 both hit 2 rounds.

**Per-PR notes recorded for future spec 72c §1 calibration:**
- #63: round-1 caught the head-n-1 truncation bug that would have shipped silently. Real value-add.
- #64: round-2 was the FIRST k=2 quorum-fire of session 57. Architecture specialist joined correctness on F5c scope-creep → block verdict. Path A override per pre-discussed scope rationale.
- #65: differential mode FIRST FIRED on round 2 in the wild. 4 of 7 round-1 findings (F1/F2/F3 + F5 rename) cleanly omitted by all specialists; 3 deferred re-emitted; 1 new finding caught (round-2-introduced doc inconsistency). Spec 72c §6 token-cost loop closed.

## Lessons learned

### Lesson 1 — Planning-conduct failure on F5c scope (P1)

Kickoff/SESSION-CONTEXT prescribed F5c as session-57 P1, paraphrasing the v3a-v1 review finding. I trusted the paraphrase and didn't cross-check the v3a-foundation slice's "Out of scope" section, which puts F5c in v3c. Reviewer caught it round 1 (1 specialist), round 2 (2 specialists → k=2 fired). Path A override.

**CLAUDE.md §Planning conduct violations:**
- "Verify before planning" — didn't grep slice files for "Out of scope" / "deferred to" entries
- "Quote, don't paraphrase, when invoking a spec" — quoted F5c finding text but not v3a's out-of-scope
- "Distrust your own summaries" — kickoff summary was navigation, not source

**Mitigation for session 58+:** before treating a kickoff item as authorized, grep canonical slice files for scope-boundary entries that contradict the kickoff.

### Lesson 2 — Pre-flight ROI proven (P1 self-experience → P2 ship)

P1's local shellspec run caught 6 failures BEFORE push (`set -euo pipefail` + grep no-match exit-1 + pipe failure interactions). Without pre-flight, those would have been auto-review round 2+ findings, each costing ~3 min CI. P2 ships the formal `/preflight` slash command + pre-push hook to automate this for future sessions.

### Lesson 3 — Differential-mode loop closed (P0 self-validation on P2 PR #65)

PR #65 round 2 was the FIRST end-to-end validation of P0's differential mode on a real PR:
- Round 1 marker comment posted with embedded `<!-- BEGIN-prior-findings-json -->` JSON
- Round 2 brief job fetched the prior comment via gh api (with author filter), extracted JSON, composed differential brief
- Personas correctly omitted 4 resolved findings, re-flagged 3 unresolved, caught 1 new

Spec 72c §6 token-cost loop functioning as designed.

### Lesson 4 — Comment anti-pattern catalogue still hard to apply at authoring time

Despite shipping the catalogue PR last session and having it fresh in CLAUDE.md §Coding conduct, I wrote 4-5 catalogue violations in P1 + P2 first drafts (sibling-step refs, "used by X", WHAT narration, slice-AC provenance citations). Reviewer caught them across rounds.

Pattern: the catalogue is easier to apply at REVIEW time than AUTHORING time. Pre-flight (P2) is one mitigation; another is rehearsing the catalogue mentally before each new persistent comment.

### Lesson 5 — Force-push ceremony (post-merge branch state)

Each PR squash-merge auto-deletes the remote head branch. Local cache lags. `git push --force-with-lease` fails with "stale info" until `git remote prune origin` clears the stale ref. Routine pattern across all 3 P-PRs this session.

**Resync recipe (now-canonical for session-58+):**
```
git fetch origin main
git remote prune origin
git checkout -B <branch> origin/main
git push -u origin <branch>     # fresh push; no force needed
```

### Lesson 6 — Override discipline (Path A/B/C pattern)

The F5c scope-creep override (PR #64) was the first admin-bypass of session 57. Process:
1. Surface the architectural ambiguity to user (Path A / B / C with trade-offs in plain language)
2. User picks (A in this case)
3. Document the rationale in commit messages + HANDOFF
4. Address non-blocking findings in same PR (catalogue self-application + tech-debt fix)

This pattern preserves human judgement on scope questions while keeping the bot's structural review visible.

### Lesson 7 — Hard-cap convergence at round 4 (P0)

PR #63 hit the 4-round hard cap. Sequence:
- Round 1: block (6 findings) — head-n-1 bug + security + style
- Round 2: block (10 findings) — escalating; security findings tightening (SHA validation + size cap)
- Round 3: request-changes (4 findings) — repeats (3 false positives + 1 new SHA-256 forward-compat)
- Round 4: approve — addressed the SHA-256 forward-compat suggestion

Without round 4 widening, would have shipped at request-changes (still mergeable). Round 4 was a "demonstrate convergence" round per spec 72c §1 KPI tracking.

## v3c carry-overs (still pending after session 57)

Per session-56 §"v3c carry-overs" + spec 72c §9 + this session's deferrals:

| Item | Effort | Rationale |
|---|---|---|
| Synthetic-deliberate-injection per-persona fixtures (P3) | M (~200L) | Closes per-persona regression-detection gap. v3c §7 hybrid. |
| AC-3 per-specialist prompt-side wiring | M (~150L) | P0 ships brief-job + aggregator sides; per-specialist post-round-N differential filter still mechanically separate from `was_in_prior` |
| F5c follow-up: v3a-foundation slice "Out of scope" cleanup | S (~10L) | Doc consistency with the shipped P1 work; resolves the open scope-conflict from the P1 admin-bypass |
| npx version pin (auto-review.yml + preflight-review.sh) | S (~30L) | Supply-chain hardening per OWASP A08:2021. Both invocation sites should pin together. |
| Pre-flight self-test (dogfood /preflight on its own changes) | S (~20L) | Meta-test to validate the new infrastructure |
| Live persona drift detection (quarterly cron) | M | Recurring API budget; spec 72c §9 |
| Multi-provider 3rd-agent reviewer | L | Cross-provider diversity; spec 72c §"Out of scope" |

## Persona findings recorded

Session 57 didn't ship `src/` slices (still pre-S-F1). Per v3b AC-4 the retain/drop measurement clock activates from S-F1 onwards. No retain/drop verdict emitted this session.

## Branch state at session-57 wrap

- Current branch: `claude/decouple-session-57-wyXVq` (auto-deleted from remote after each P-PR merge; recreated for the wrap PR)
- Main HEAD: `dae5405` = PR #65 (P2) merge
- Prior: `b3ecd2a` = PR #64 (P1) merge
- Prior: `52dd95d` = PR #63 (P0) merge
- Prior: `77272ec` = session 56 wrap

## Next-session priority recommendations

Ranked picks for session 58:

1. **🥇 P3 (deferred from session 57): synthetic-deliberate-injection per-persona fixtures.** M (~200L) + 2-3 review rounds. Closes per-persona regression-detection. The v3c §7 hybrid pick — unlocks per-persona drift detection that golden-replay alone can't isolate.
2. **🥈 npx version pin (both invocation sites).** S (~30L). Supply-chain hardening; addresses P2 round-1 F4. Cheap, high-symbolic value.
3. **🥉 F5c follow-up: v3a-foundation slice "Out of scope" cleanup.** S (~10L). Resolves the doc-vs-code drift introduced by P1's admin-bypass. Closes the loose end from this session.
4. **AC-3 per-specialist prompt-side wiring.** M (~150L). Continues the v3c efficiency layer; deferred from session 56 as separable from the brief-job side P0 shipped.
5. **S-F1 first `src/` slice.** L (~400-600L). Strategically still deferred for n>=3 calibration via the now-more-efficient pipeline.

## Wrap-pattern observations (session-58 carry-over)

- Sequential single-branch pattern continues to work (sessions 54-57 all used same branch across all session PRs).
- After each squash-merge: `git fetch origin main && git remote prune origin && git checkout -B <branch> origin/main` is the canonical resync.
- Pre-flight (P2 ship this session) is now part of the toolkit — should be exercised at least once in session 58 to validate the in-the-wild path.
