# Session 27 — hook-based enforcement sprint

## Objective (met)

Ship four enforcement hooks (P0.1-P0.4) + CLAUDE.md pruning pass
(P1), per `docs/HANDOFF-SESSION-25.md` §"Session-26 brief". First
concrete step of the reboot from **rule-writing** to **rule-enforcement**
automation, following session 25's audit finding that "adding more
rules has been the failure mode."

No new CLAUDE.md rules this session (moratorium held). No slice work
(correctly deferred — shipping a slice before hooks would muddy the
reboot test).

## What shipped

**9 commits on `claude/session-27-hook-enforcement` (off `origin/main`
@ `1df3678`):**

| Commit | Artefact | Notes |
|---|---|---|
| `5409a71` | P0.1 line-count hook | PostToolUse on Write\|Edit. Stateless git-truth via `git diff --numstat origin/main`; delta state at `/tmp/claude-lines-${SESSION_ID}.txt`. Warns at 1,000 / 1,500 / 2,000. |
| `524b2d9` | P0.2 read-cap hook | PreToolUse on Read. Blocks full-file Reads of >400-line files without offset+limit; blocks Reads that would push per-turn total past 300. 45s gap heuristic for turn boundaries. |
| `73709db` | P0.3 /wrap command + helper | `.claude/commands/wrap.md` invokes `.claude/hooks/wrap-check.sh` via `!` bash inline. Checklist: tree clean · branch ahead/behind · session-N inferred · HANDOFF-SESSION-N exists · SESSION-CONTEXT refreshed · PR status. |
| `a7ce9e4` | P0.4 DoD CI gate + PR template | `.github/workflows/pr-dod.yml` fails any PR touching `src/` without `docs/slices/S-*/verification.md` reference. `.github/PULL_REQUEST_TEMPLATE.md` reproduces 6-item DoD + 13-item security checklist. |
| `a70a276` | P1-A1 CLAUDE.md prune | Line-count thresholds (§"Session discipline → Track your progress actively") collapsed: 4 bullets → 2. Net -2 lines. |
| `9bd0b56` | P1-A2 CLAUDE.md prune | Read-discipline sub-rules (§"Planning conduct") collapsed: 5 sub-rules → 1 paragraph pointing at hook. Net -5 lines. |
| `e2084ae` | P1-A3 CLAUDE.md prune | Wrap-protocol pointer: `/wrap` referenced at top of §"Wrapping up a session". 6-step list kept verbatim (slash command reproduces it). Net +1 line. |
| `cab60c8` | P1-A4 CLAUDE.md prune | DoD enforcement pointer appended: names PR template + pr-dod.yml as CI gates. Net +2 lines. |
| `b9dcf73` | P1-A5 CLAUDE.md prune | Session startup (§"Session startup (do this FIRST)") tightened. Hook pointer added to item 1. Net -3 lines. |
| `daa3bed` | CLAUDE.md Key files extension | New "Hook + CI enforcement (sessions 25 + 27)" block listing all 8 hook/CI artefacts. +10 lines. |

## Hook live-proof status

- **P0.1 line-count hook** — proved live in-session. After commit, every
  subsequent Write/Edit surfaced `Lines: +N this change · M session
  churn` in tool-result context. Final churn at wrap time: ~575 lines.
  (Session 25's caveat that mid-session `.claude/settings.json` changes
  don't activate applied only to `.claude/` being created from scratch;
  additions to existing config activate live.)
- **P0.2 read-cap hook** — six pipe tests passed pre-registration
  (tool filter · CLAUDE.md naive allow · spec 71 naive deny ·
  offset+limit bypass · same-session repeat triggers rule 2 ·
  non-existent file silent). Live firing presumed based on P0.1
  activation pattern but not independently proved — no >400-line or
  >300-turn-batch Read attempted this session.
- **P0.3 `/wrap` slash command** — helper `wrap-check.sh` dry-run
  against current tree returned correct output. The actual slash
  command invocation (`/wrap` typed by user) was not exercised
  this session. Next session is the first real invocation.
- **P0.4 DoD CI gate** — YAML valid via `yq` + `python yaml.safe_load`.
  Regex unit-tested against 6 sample PR bodies (3 valid pass, 3
  invalid fail). Not yet exercised in a real CI run — **will fire
  for the first time on the session-27 wrap PR**, which is the first
  PR against main since the workflow landed.

## Key decisions

1. **Stateless git-truth for line counting.** Instead of maintaining a
   separate counter incremented per-edit (fragile across restarts),
   compute churn on demand via `git diff --numstat origin/main` +
   untracked `wc -l`. Delta is inferred from a trivial per-session
   previous-total state file. Robust against Write tool overwrites of
   same file multiple times (numstat gives end-state vs branch base).

2. **45-second gap heuristic for read-cap turn boundaries.** The
   "per-turn" concept has no first-class hook-observable signal.
   Parallel tool calls within a single turn cluster in time (<5s
   apart); cross-turn gaps include user + model think (>>45s). Chose
   45s as the boundary — heuristic, but matches observed cadence.
   Documented in `read-cap.sh` comments. If session-28 or later hits
   an edge case, tune or replace.

3. **Per-section P1 commits.** User opted for 5 separate commits on
   CLAUDE.md rather than one batched commit. Makes each prune visible
   on the log and independently revertable. Worth the extra git noise.

4. **Honest mid-session corrections over silent rewrites.** Three
   times in this session I surfaced corrections rather than quietly
   fixing:
   - Kickoff's "session 27" framing failed live-state verification;
     stopped before branching, asked user, confirmed yes session 27
     (user had run a mini CI-triage session without writing a handoff).
   - P1 savings estimate revised mid-session from ~40 lines down to
     ~7 once drafts were concrete.
   - Final P1 commit message claimed "231 → 223, -8 net" but the
     actual final was "231 → 226, -5 net." Flagged at the time
     rather than amending (amend policy). Correction recorded here.

5. **Retroactive `HANDOFF-SESSION-26.md` stub.** Session 26 (the
   CI-triage mini-session between session 25 and session 27) never
   produced a retro doc. Wrote a brief one during session-27 wrap
   to keep the HANDOFF trail unbroken. Lesson captured:
   document every session that touches shared state.

## What went well

- **Live-proof of P0.1 within the session.** Pipe-tests covered the
  edge cases; live firing via real Write/Edit proved end-to-end.
  The in-context `<system-reminder>` blocks showing hook output made
  activation visible rather than theoretical.
- **Pipe-tests before registration.** For both P0.1 and P0.2, tested
  the script via `echo '{...}' | script` before wiring into
  `settings.json`. Cheap insurance against bricking tool access
  with a buggy hook — especially valuable for read-cap, where a
  bug would have denied legitimate Reads.
- **Planning conduct applied at session start.** SessionStart hook
  surfaced live branch state at turn 0; verified it against kickoff
  claims; caught that kickoff's "P0.0 closed" + "session 27" framing
  needed user confirmation (PR #10 merged but SESSION-CONTEXT still
  "Session 26"). Cost: ~5 minutes of verification round-trips.
  Saved: one or more hours of downstream confusion.
- **Scope held.** Target ≤1,500 lines; finished ~575 churn. Hook
  infrastructure is denser than slice code; came in comfortably under.
- **CLAUDE.md pruning matched user triage.** Proposed 3-pile
  classification; user approved; executed per-section with
  replacement text reviewed before edit. No surprises.

## What could improve

- **Line-savings estimate was optimistic.** Initial pitch of ~40-50
  line savings on CLAUDE.md was wrong — actual was -5 on P1 alone,
  and +5 once Key files extension is included. The pruning was still
  worthwhile (rules replaced with pointers; pointers explain
  enforcement), but the "CLAUDE.md will be shorter" headline didn't
  hold once Key files grew. Next time: draft before estimating.
- **Read-cap 45s gap heuristic untested under real traffic.** A
  single-turn batch that spans >45s of model think would falsely
  reset the counter. Unlikely in normal use; plausible in slow
  multi-agent work. Flag for session 28 observation: if a Read ever
  fires that "should have" been blocked, investigate timing.
- **P0.3 `/wrap` slash command not invoked live.** Only the helper
  was dry-run. The first real `/wrap` invocation is a session-28
  moment. If the slash command UX is wrong (e.g. response formatting),
  iterate then.
- **P0.4 CI gate first test is the wrap PR itself.** Ironic but
  unavoidable — this PR is the first PR touching any files after
  the workflow landed. If the gate false-fails on this PR (we're
  not touching `src/`, so the gate should skip), that reveals a bug
  at exactly the wrong time. Monitor PR checks after open.
- **Final P1 commit message carried bad arithmetic.** Claimed 223 lines
  / -8 net; actual 226 / -5. Amend policy (per CLAUDE.md git safety)
  means the incorrect message stays in the log. Corrected here.

## Open loops (for session 28)

| Loop | Source | Resolution path |
|---|---|---|
| Claude AI Design source files | Session 22 · session 24 · session 27 | User unblocks when ready; S-F1 design-token slice depends on this. Kickoff user direction: "I'm not going anywhere near that until I feel it is safe to do so." |
| `/wrap` slash command first live use | Session 27 P0.3 | This session's wrap. If output formatting is awkward, iterate in session 28. |
| PR DoD gate first live activation | Session 27 P0.4 | Session-27 wrap PR. Gate should *skip* (no src/ touch); if it fails, bug. |
| Read-cap 45s gap heuristic calibration | Session 27 P0.2 | Observe in session 28+; tune if edge case surfaces. |
| CLAUDE.md line-net-growth after Key files add | Session 27 wrap | Accept for now — the 10-line Key files addition is load-bearing for discoverability. If future sessions deem it too verbose, consider moving Key files to a separate `docs/KEY-FILES.md` (would need wrap-protocol update). |
| HANDOFF-26 stub | Session 27 wrap | Done this session as a retroactive commit. |
| S-F1 or C-U4 as first enforcement-test slice | Session 27 deferred | User chose: C-U4 first (no asset dep), then S-F1 once Claude AI Design files released. |

## Session 28 priorities (headline)

1. **P0 — C-U4 disclosure-language audit** (session-25 P1, deferred).
   No asset dependency. First slice under new enforcement; real test
   of the hook/CI stack:
     - PR template exercised
     - pr-dod.yml gate exercised (C-U4 touches `docs/` probably, but
       if any `src/` touches — e.g. error message strings in
       `src/lib/` — the gate will fire)
     - 6-item DoD walked (including adversarial review)
     - `/wrap` run at session end
2. **P1 — S-F1 design system tokens** (if Claude AI Design source
   files unlocked). First visual slice; exercise token pipeline +
   prefers-reduced-motion pathway.
3. **P2 — hook calibration pass.** Observe any read-cap false
   positives / negatives, line-count edge cases. Not expected to
   need changes; flagged for attention.

## Session 28 negative constraints (new)

- **Do NOT** bypass a denied Read by disabling the hook.
  Per-session hook disable is a legitimate debugging option only
  if the user explicitly requests it; otherwise treat deny as
  signal, restructure the read.
- **DoD CI gate enforcement starts on session-28 PRs.** The
  `no-slice-required` label exists for truly trivial cases; use it
  sparingly. A PR that can't name a slice probably shouldn't be
  touching `src/`.

## Session-final totals

- **Session churn:** ~575 lines (well under 1,500 soft-warn; 2,000 stop)
- **Commits:** 10 on the session branch (9 feature/refactor + this
  wrap commit when it lands)
- **Files created:** 8 (hooks × 4, PR template × 1, CI workflow × 1,
  slash command × 1, HANDOFF-26 stub × 1, HANDOFF-27 × 1)
- **Files modified:** 2 (CLAUDE.md, `.claude/settings.json`)
- **CLAUDE.md size:** 231 → 236 lines (+5 net: P1 pruning -5, Key
  files +10)

---

_Branch: `claude/session-27-hook-enforcement` → PR to `main` at wrap.
Next session branches off the merged session-27 tip per spec 71 §7a
single-branch-main._
