# HANDOFF — Session 35

**Session focus:** S-INFRA-1 (Stripe SDK lockfile sync + apiVersion alignment) → PR #21 (S-TOOL-1) update + merge → S-F7-β scaffold + AC freeze (Path A).

**Slice state:** S-INFRA-1 GREEN — PR #22 merged at `ba8db5e`. S-TOOL-1 GREEN — PR #21 merged at `c43ca2f`. S-F7-β AC frozen, scaffold pushed at `0d4094f`; implementation deferred to session 36.

## What happened

Session opened on harness suffix-orphan `claude/resume-line-count-tool-DKGg7` at `5d38f6d` (= main tip pre-#21-merge), 0 ahead. **Branch-resume occurrence #3** across sessions 33/34/35 — the same footgun the new `session-start.sh` hook from PR #21 will mitigate, but the hook isn't yet on main at this point (PR #21 still open). Manual recovery per kickoff recipe: `git fetch origin claude/S-TOOL-1-line-count-branch-resume` → `git checkout -B` → `git branch -D` orphan. `origin/HEAD` set to `main` (occurrence #2 of CLAUDE.md candidate #14 — lift trigger fired).

4 pre-flight Qs answered all-recommended:
1. Merge PR #21 first ✓
2. Path A — S-F7-β ✓
3. Codify S-TOOL-N family ✓
4. Bundle #14 lift into chosen P0 slice ✓

**But before merging PR #21**, live-verify caught a kickoff fact in flight: PR #21's combined commit-status was `failure` (Vercel preview deploy red), not the kickoff-claimed "10/10 CI green" (which was true for GHA check_runs only). Surfaced the dual-lockfile root cause to the user; user pivoted to Path D first (S-INFRA-1) before merging #21.

**S-INFRA-1 ship sequence:** Diagnosed Vercel failure via `pnpm exec tsc --noEmit` reproducing `TS2322 at src/lib/stripe/client.ts:25` (`'2025-03-31.basil'` not assignable to `'2026-04-22.dahlia'`). Root cause: `package-lock.json` pinned `stripe@22.0.0` (older typed `LatestApiVersion` accepts `'2025-03-31.basil'`); `pnpm-lock.yaml` pinned `stripe@22.1.0` (narrowed type accepts only `'2026-04-22.dahlia'`); CI used npm so Type-check passed; Vercel auto-detected pnpm-lock so `next build`'s post-compile typecheck failed. User picked Option B (sync both lockfiles + update apiVersion literal). Branched `claude/S-INFRA-1-stripe-sdk-pin` off main → wrote `acceptance.md` (3 ACs) + `verification.md` (no test-plan.md needed; security N/A by infra-scope rule, justified inline) → `npm install stripe@22.1.0` (bumped `package.json` range `^22.0.0` → `^22.1.0` + lockfile pin) → updated apiVersion literal → `pnpm install` synced pnpm-lock → verified all green (`pnpm tsc`, `pnpm build`, `pnpm test 81/81`, `npm run typecheck` CI parity) → adversarial review (6 concerns + N/A justification) → committed at `5cb311c` → opened PR #22 → 10/10 GHA + Vercel green on first run → squash-merged → new main tip `ba8db5e`.

**PR #21 update sequence:** `mcp__github__update_pull_request_branch` to merge new main into PR #21's branch → head moved `0d98393` → `598e859` → CI re-ran with new base → 10/10 GHA + Vercel green → squash-merged → new main tip `c43ca2f`.

**S-F7-β scaffold:** Branched `claude/S-F7-beta-dev-surface` off `c43ca2f` → grep'd spec-71 §4 + spec-70 S-F7 slice-card + spec-71 §8 boundaries → read targeted sections (~100 lines combined, within 300L cap) → drafted `acceptance.md` (7 ACs covering routes + picker + inspector + workbench-move + banner + 6 scenarios + #14 lift; MLP framing; cut paths to S-F7-γ for AC-3 + AC-4) → user froze all 7 ACs → drafted `verification.md` (full UI template — golden path 6 steps + 9 edge cases + a11y + viewports + cross-browser + regression + adversarial) → drafted `security.md` skeleton (13-item per-slice checklist binding per spec 72 §11; no N/A escape on this slice) → committed at `0d4094f` → pushed.

Total session churn: ~290 lines (well under 1500 warn). Two PRs shipped + merged + one slice scaffold pushed in one session.
## What went well

- **Verify-before-planning saved the merge order.** Kickoff said "PR #21 OPEN with full DoD + 10/10 CI green" — true for check_runs, false for combined commit-status (Vercel red). `mcp__github__pull_request_read --method=get_status` surfaced the divergence in 1 call. Pivot to Path D before #21 merge avoided shipping the broken Vercel pattern forward.
- **Diagnosis-before-fix held end-to-end.** Reproduced TS2322 locally before writing any code; grep'd `getStripeClient`/`getStripeStatus` callers (zero) to verify zero behaviour blast radius before changing the literal; checked both lockfiles + CI workflow + npm script to identify the root cause as dual-lockfile divergence rather than a single-file fix.
- **Slice template held under pressure.** S-INFRA-1 shipped with `acceptance.md` (3 ACs, MLP framing, dependencies, review log) + `verification.md` (AC sign-off table, regression surfaces, adversarial run with 6 concerns + N/A justification) — full DoD walked even on a 4-file infra slice.
- **`update_pull_request_branch` was the right call.** Cleaner than rebase + force-push on a published branch; no destructive operation needed; CI auto-re-ran on the new HEAD; no merge conflict (S-INFRA-1 + S-TOOL-1 touched disjoint surfaces).
- **AC drafting held the slice template precedent.** S-F7-β `acceptance.md` follows `_template/acceptance.md` exactly: 7 ACs each with Outcome / Verification / In-scope / Out-of-scope / Opens-blocked / Loveable check / Evidence row + cut paths documented for AC-3 + AC-4. MLP framing names the loveable floor explicitly.
- **Read discipline held.** All targeted reads used offset/limit when the file was >400 lines (spec 71 §4 + §8 sections, not full 518L file). Combined per-turn line counts stayed under 300L cap.
- **Hook-surfaced churn now reads accurately.** PostToolUse line-count.sh from S-TOOL-1 reported per-edit + cumulative session churn correctly (28 / 65 / 60 / 13 / 1 / 1 / etc.). The session-base SHA fix from S-TOOL-1 paid off immediately on its first session post-merge — measure-vs-main inflation is gone.
## What could improve

- **Branch-resume occurrence #3 — hook didn't fire because hook wasn't merged yet.** Sessions 33/34/35 all opened on suffix-orphans; the resume hook from PR #21 is on main from session 36 onward. Session 36 will be the first natural test of automated detection. If recurrence #4 happens session 36, **and** the hook still doesn't fire, escalate.
- **Stream-idle-timeout on long Write recurred.** SESSION-CONTEXT line 277 says ">~200 lines: skeleton + Edit-append." Tried to single-Write HANDOFF-35 (~120 lines target) — within the 200L threshold but the partial response still timed out. **Threshold may be lower than 200 in practice.** Path F (S-TOOL-2) hook would have caught this; until that ships, defensive default is "skeleton + Edit-append for any prose Write >100 lines, not 200." Update SESSION-CONTEXT line 277 + acceptance criteria for S-TOOL-2 if it ships.
- **Pre-merge verify caught Vercel-red, but kickoff still claimed 10/10 green.** The kickoff facts rotted between session-34 wrap and session-35 start. Even with the live-verify discipline, **the wording "10/10 CI green" is ambiguous** — it can mean "10/10 GHA check_runs green" (the kickoff intent) OR "10/10 PR-checks-panel green including Vercel" (a reader's natural assumption). Future kickoffs should disambiguate explicitly: "10/10 GHA check_runs green; Vercel deploy red (known infra)" or similar.
- **Session 35 didn't ship Path F (long-prose Write hook).** Path A was the recommended pick; path F was the alternate. Long-prose discipline still depends on manual habit (which slipped this turn). If session 36 hits another stream-idle-timeout on a Write, lift Path F's priority above further S-F7-β work.
- **SESSION-CONTEXT.md continues to be the file that keeps failing on Write.** This session's wrap will rebuild it — must use skeleton + Edit-append from the first byte, not as a recovery fallback.
- **AC-7 (#14 lift) bundled but not implemented this session.** The lift trigger fired (occurrence #2 of `git remote set-head origin main` need), and AC-7 documents the bundling intent into S-F7-β, but the actual hook patch + CLAUDE.md bullet land in session 36's impl. If session 36 carves AC-7 off (e.g. ships separately as a tooling commit before β impl), document it in HANDOFF-36.
## Key decisions

- **Path D before Path A** (re-order from kickoff). Vercel red on PR #21 made the original "merge #21 first → start Path A" sequence ship a known-broken state forward. Pivoted to: ship S-INFRA-1 first → re-base #21 onto fixed main → then merge #21 → then Path A. Cost: ~30 min extra. Benefit: main never red post-#21-merge.
- **Option B for Stripe fix** (sync both lockfiles + update apiVersion literal). Rejected Option D (type-cast escape) and Option C (drop package-lock.json + switch CI to pnpm). Option C overlaps CLAUDE.md candidate #10 (lockfile policy) and was correctly out-of-scope for S-INFRA-1. Option B is the principled minimum: aligns lockfiles, aligns SDK type expectation, no CI workflow change.
- **Squash-merge convention preserved** for both #22 + #21. PRs #14/#16/#17/#18/#19/#20 all squash-merged on this repo; consistency held.
- **`update_pull_request_branch` over local rebase + force-push** for PR #21's main-pickup. Force-push is destructive on a published branch; merge-from-base is safe + atomic + auto-triggers CI. Convention going forward for similar PR-update scenarios.
- **All 7 S-F7-β ACs frozen as-drafted.** No carving, no scope deferral pre-emptively. AC-3 + AC-4 carry documented cut paths to S-F7-γ in case mid-impl scope stress emerges, but β goes in with full ambition.
- **Bundle CLAUDE.md candidate #14 lift into S-F7-β AC-7** rather than ship as standalone tooling commit. User picked "Bundle into chosen P0 slice" at kickoff. Lift trigger fired this session (occurrence #2 of `git remote set-head origin main` need). Patch lands with β's first impl commit in session 36.
- **Codify `S-TOOL-N` family** as non-catalogue prefix for tooling slices going forward. Treated as first-class alongside S-F-N / S-B-N / S-CF-N. S-TOOL-1 done; S-TOOL-2 (long-prose hook) is Path F's still-parked candidate.
- **No mid-session CLAUDE.md updates this session.** Material rule changes deferred to lift-bundle commits per "Lift discipline" — capture now, lift after 2 clean uses, don't ad-hoc within a slice session. The #14 lift bundles into S-F7-β impl per AC-7.
- **Wrap session 35 at scaffold-pushed gate** rather than push into β implementation this session. β is ~900-1100 lines impl across many discrete units; session 36 starts fresh with the AC contract frozen + the new hooks active on main. Cleaner restart point than mid-impl wrap.
## Bugs / surprises

- **Stripe SDK type-narrowing across patch versions.** `stripe@22.0.0` typed `LatestApiVersion` as a wider union including `'2025-03-31.basil'`; `stripe@22.1.0` narrowed it to only `'2026-04-22.dahlia'`. A patch-version bump of an SDK should not break consumer code, but Stripe's typing model treats the API-version literal as a moving target. Future Stripe bumps will likely repeat this pattern. CLAUDE.md candidate #10 (lockfile policy) is the durable fix; S-INFRA-1 is the one-shot.
- **`npm install` (no args) didn't update the lockfile pin.** Despite `package.json` range allowing 22.1.0, `npm install` with no args + a present lockfile is conservative — it keeps the pinned version. Required `npm install stripe@22.1.0` to force the bump. Worth flagging if this pattern recurs.
- **Stream-idle-timeout on attempted single Write of HANDOFF-35.** ~120-line target Write returned partial response. Below the documented 200L threshold yet still triggered. Threshold appears empirically lower; defensive default for prose is "skeleton + Edit-append from the start" not "200L ceiling."
- **PR #21 rebuild emitted 9 check_runs first, then a 10th late.** "Dev-mode leak scan" lagged ~25s behind the other 9. Common pattern (saw the same on PR #22). Worth knowing: if 9/10 are green, give it ~30s before declaring complete.
- **Two MCP servers reconnected mid-session.** `PushNotification` was deferred-then-disconnected. No impact on flow; just noise in the system-reminder stream.
- **The hook's "session churn" tracking shows tracked vs untracked split.** After a commit, tracked drops to 0 (committed = no longer "session-pending"), and the next Write/Edit shows up as untracked again. Working as designed — cumulative session churn = tracked + untracked = total prose-and-code authored this session.
## CLAUDE.md candidates surfaced / progressed

**Lifted this session:** none (Path F deferred; #14 bundles into S-F7-β AC-7, lifts at impl in session 36).

**Trigger fired:**
- **#14 origin/HEAD set as session-start prereq** — occurrence #2 (manual `git remote set-head origin main` needed at session start). Bundle into S-F7-β AC-7 per user decision; lift lands with β's first impl commit.

**New candidate surfaced:**
- **Stream-idle-timeout threshold for prose Write.** Empirical evidence: ~120-line single-Write of HANDOFF-35 timed out. SESSION-CONTEXT line 277 currently says ">~200 lines"; reality is closer to ~100. Until Path F (S-TOOL-2) lands a hook-enforced version, defensive default should be "skeleton + Edit-append for any prose Write >100 lines." Worth a 1-line update to SESSION-CONTEXT line 277 + acceptance criteria for S-TOOL-2 if/when it ships.

**Carry-forward (still parked):**
- AUX-3 PWR drift check
- **#3 line-count.sh refined model** — *now demonstrated working correctly post-S-TOOL-1.* The session-base SHA fix paid off this session immediately. Re-evaluate: is the refined-model upgrade still wanted? Provisional close.
- #7 tdd-guard hook spec
- #9 vitest version-quirks
- #10 lockfile policy — *partially addressed by S-INFRA-1 (lockfiles now pinned to same Stripe version), but the underlying dual-lockfile-divergence pattern persists. Full lift = adopt single lockfile (pnpm-only) + switch CI to pnpm-frozen-install.* Still parked.
- #11 compile-time RED pattern
- **#13 PR-by-session-end-or-resume-doc** — practiced cleanly this session (PR #21 + #22 both shipped + merged within session). Re-evaluate: redundant after #12 hook lift? Provisional close.
- **#14 origin/HEAD set** — bundling into S-F7-β AC-7 (session 36 impl).
## For session 36

**Branch state (verified at session-35 wrap, before wrap commits):**
- Branch: `claude/S-F7-beta-dev-surface`
- HEAD: `0d4094f` (will move forward by 1-2 wrap commits)
- 1 commit ahead of main (will be 2-3 after wrap commits)
- PR for branch: not yet opened (recommended at wrap to surface AC contract for review pre-impl)

**Decision before session 36 starts: open PR for `claude/S-F7-beta-dev-surface` at session 35 wrap?**
- Recommended: **yes**. Surfaces the frozen AC contract + scaffold for review independent of code; lets reviewers comment on the AC before implementation makes diff harder to read. PR title: "S-F7-β: dev surface routes + env banner reskin (scaffold — AC frozen)". PR body should call out: scaffold-only, no `src/` changes, AC frozen 2026-04-26, full impl planned for session 36.

**Session 36 P0:**

**Implement S-F7-β per frozen AC.** No re-scoping at the start of session 36 — AC is the contract. Order of implementation (dependency-respecting):

1. **AC-7 first** (smallest, lowest risk, lift trigger fired): patch `.claude/hooks/session-start.sh` with `git remote set-head origin main 2>/dev/null || true` near top; add CLAUDE.md bullet under §Planning conduct; extend `tests/unit/hooks-session-start.test.ts` with idempotency assertion. ~30 lines + 1 commit. Verifies S-TOOL-1's hook-test pattern still works post-merge.
2. **AC-1** route group + dashboard: `src/app/dev/layout.tsx` (notFound on prod) + `src/app/dev/page.tsx` (dashboard). ~150 lines + 1 commit.
3. **AC-5** env banner reskin: `src/components/layout/env-banner.tsx` + integration into `(authed)` layout. ~80 lines + 1 commit.
4. **AC-6** 6 fixture scenarios: `src/lib/store/scenarios/{sarah-connected,sarah-complete,sarah-shared-mark-invited,sarah-reconcile-in-progress,sarah-settle,sarah-finalise}.json` + scenarioLoader extension if α used closed enum. ~200 lines + 1 commit.
5. **AC-2** scenario picker + reset: `src/components/dev/scenario-picker.tsx`, `src/app/dev/scenarios/page.tsx`, `src/app/dev/reset/page.tsx`. ~150 lines + 1 commit.
6. **AC-3** state inspector: `src/components/dev/state-inspector.tsx`, `src/app/dev/state-inspector/page.tsx`. ~120 lines + 1 commit. Cut to read-only if scope stress.
7. **AC-4** engine workbench move: `src/app/dev/engine-workbench/page.tsx` (preserve existing logic) + delete `src/app/workspace/engine-workbench/page.tsx`. ~50 lines + 1 commit.

Total estimated impl churn: ~780 lines + tests + verification.md fills + adversarial review pass = ~1100 lines total session 36 churn. Within 1500 warn.

**Pre-flight Qs for session 36:**
1. Open PR for the scaffold at session 35 wrap, or wait until impl complete?
2. Confirm AC order above, or re-prioritise (e.g. AC-1 + AC-5 first to get visible UI sooner)?
3. Any AC carving requested before impl begins (AC-3 read-only · AC-4 deferred)?
4. Should AC-7 (#14 lift) ship as a standalone tooling commit ahead of β's main impl, or bundle inside β's first commit per current plan?

**Session 36 pre-flight verify:**
```
git fetch origin
git log origin/main -1                                  # confirm c43ca2f stable
git log -10 --oneline                                   # confirm session 35's commits present
mcp__github__list_pull_requests --head=claude/S-F7-beta-dev-surface
mcp__github__list_branches                              # confirm branch state
pnpm install                                            # repo arrives without node_modules
pnpm test                                               # confirm 92/92 baseline (S-TOOL-1 tests on main)
```

If harness lands on a suffixed branch (recurrence #4 if it happens): the now-merged `session-start.sh` from PR #21 should surface the resync recipe at turn 0 automatically. Read the warning, verify via `mcp__github__list_branches`, follow the literal three-command recipe, delete the orphan. **First natural test of the automated detection** — if it doesn't fire, escalate (hook bug or harness behaviour change).
