── Session 35 kickoff ──

Branch state to expect (verify via SessionStart hook + GitHub MCP):

  Real branch:    claude/S-TOOL-1-line-count-branch-resume
  Tip:            3e76c4f (session-34 wrap) — IF still pre-merge of PR #21
  Ahead of main:  4 commits (after PR #21 merge: 0; branch fresh off new main)
  PR:             #21 OPEN with full DoD + 10/10 CI green, 0 reviews/comments
  Status:         Awaiting reviewer sign-off + merge

If the harness lands you on a fresh suffixed branch
(`claude/<slug>-<5-char-alphanumeric>$`), the new session-start.sh
hook (PR #21) WILL surface a `### Branch-resume check` section in
the turn-0 context block IF a canonical non-suffixed branch exists
on origin. Follow the literal recipe in that block.

If the hook isn't yet active (PR #21 not merged) and you land on
an orphan, the manual recovery from sessions 33 + 34 still works:

  mcp__github__list_branches(owner=rossdelarge247-debug,
                             repo=construct_d_01)

Look for canonical match — if present at 3e76c4f or later, resume:

  git fetch origin claude/S-TOOL-1-line-count-branch-resume
  git checkout -B claude/S-TOOL-1-line-count-branch-resume \
                  origin/claude/S-TOOL-1-line-count-branch-resume
  git branch -D <orphan-suffixed-branch>

Verify:

  git log --oneline -5
  # Expect (top-down, IF pre-merge of PR #21):
  #   3e76c4f docs: refresh SESSION-CONTEXT for session 35
  #   413c547 docs: HANDOFF-SESSION-34 retro
  #   29f2119 docs(S-TOOL-1): scaffold slice + lift CLAUDE.md #12
  #   0bbba16 feat(S-TOOL-1): session-base SHA + branch-resume detection
  #   5d38f6d S-F7-α: persistence + auth abstraction (...)

  mcp__github__pull_request_read --pullNumber=21    # Confirm OPEN / MERGED / CLOSED status

  pnpm install                                       # Repo arrives without node_modules
  pnpm test                                          # Confirm 92/92 still GREEN
  git remote set-head origin main                    # Required for /security-review skill (see candidate #14)

── Read order ──

1. CLAUDE.md (auto-loaded). Session-34 lift = §Planning conduct
   "Branch-resume check" bullet (pairs with the now-automated
   session-start.sh hook detection).

2. docs/SESSION-CONTEXT.md — refreshed at session-34 wrap. Title
   "Session 35 Context Block". Rolling window now 31-34; locked
   through session 34; **6 P0 paths** (A: S-F7-β · B: S-F2 · C:
   S-CF-tail · D: S-INFRA-1 Stripe · E: candidate-lift session ·
   F: S-TOOL-2 long-prose-write hook + slash command). 4 pre-flight
   Qs; branch state + harness resync recipe; new harness-suffix
   detection note (5-char alphanumeric, hook auto-detects post-PR-#21).

3. docs/HANDOFF-SESSION-34.md — session-34 retro. Read for full
   chronology of harness recovery occurrence #2, S-TOOL-1
   adversarial review findings, the rationale behind the #12 lift,
   and the streaming-idle-timeout diagnosis that motivates Path F.

4. Tier-3 specs only as the chosen path requires. Don't batch-read.

── Pre-flight Qs (ask user before any code) ──

1. PR #21 disposition — merge first, or develop on top?
   Recommended: merge first. S-TOOL-1 is DoD-clean (10/10 CI green).
   Review window can be pre-merge. Session 35 then branches off the
   new main tip with the new hooks active.

2. Session 35 P0 — pick one of:
   a) **S-F7-β** — dev surface routes (`/app/dev/*`) + env banner
      reskin + scenario picker UI + 6 more fixture scenarios.
      Builds on α. (Recommended primary.)
   b) **S-F2** (or another F-series foundation slice). Identify
      which.
   c) **S-CF-tail** — 4-row drain (A13-A16 in `discovery-flow.tsx`,
      `constants/index.ts` ×2, `use-workspace.ts`). Fast, cleanup,
      no foundation.
   d) **S-INFRA-1** — Stripe SDK pin or upgrade. Fixes Vercel
      preview-error pattern across PRs #20 + #21. ~50-100 lines.
      Recommended alt if preview-error noise is bothering.
   e) **CLAUDE.md candidate-lift session.** #14 (origin/HEAD set
      in session-start.sh) at occurrence 2 = lift trigger.
      Re-evaluate #3 + #13 (potentially redundant after S-TOOL-1).
      ~30 lines.
   f) **S-TOOL-2** — long-prose Write hook
      (`.claude/hooks/long-prose-write-cap.sh`, blocks `.md` Writes
      >200 lines, deny message points to skeleton + Edit-append) +
      `/refresh-session-context` slash command (deterministic
      protocol for the recurring case) + lift the CLAUDE.md
      threshold rule into §"Engineering conventions" at Tier 1.
      ~80 lines bash + ~30 lines md + 4-6 vitest tests via the same
      `child_process.execSync` pattern from S-TOOL-1. Recommended alt
      if you want to keep tooling-track momentum and prevent the
      stream-timeout failure mode from recurring.

3. Slice-prefix decision: codify `S-TOOL-N` as non-catalogue prefix
   family (S-TOOL-1 done, S-TOOL-2 planned for Path F, etc.), or
   keep tooling work as `claude/session-N-tooling` going forward?

4. CLAUDE.md candidate #14 (origin/HEAD set) — second occurrence
   this session = lift trigger. Bundle the lift + 5-line
   `session-start.sh` patch into the next slice (most likely S-TOOL-2
   if Path F chosen, or Path E candidate-lift session), or defer?

── Carry-forward parked CLAUDE.md candidates (8 total, after
   session-34 #12 lift) ──

  AUX-3 PWR drift check (HANDOFF-31)
  #3  line-count.sh refined model (now potentially redundant after
      S-TOOL-1 — re-evaluate; the deeper baseline bug it was blocked
      on is fixed)
  #7  tdd-guard hook spec
  #9  vitest version-quirks (jsdom non-configurable + reporter
      rename — also relevant to the new hook tests' fixture pattern)
  #10 lockfile policy
  #11 compile-time RED pattern
  #13 PR-by-session-end-or-resume-doc (now potentially redundant
      after #12 lift — re-evaluate; the harness-resume hook
      auto-mitigates the underlying problem)
  #14 origin/HEAD set as session-start prereq (occurrence 2 = lift
      trigger)

Lift discipline: capture now, lift after 2 clean uses. Don't
ad-hoc within a slice session.

── Negative constraints (restated; full list in CLAUDE.md +
   SESSION-CONTEXT) ──

- Don't frame Decouple as "financial disclosure tool" (spec 42).
- Don't re-introduce wiped V1 files.
- Don't re-open 68a-e locked decisions.
- Don't read pre-pivot specs (03-06, 11, 12).
- Verify-before-planning: kickoff facts rot. Always live-verify
  branch tips, file contents, PR status before building on them.
- Read discipline: 300-line per-turn cap (hook-enforced); grep/ls/
  wc-l before Read; announce expected combined lines before
  parallel-batch.
- **Long-prose Writes: skeleton + Edit-append for docs >~200 lines**
  (threshold raised from 150 after session-34 evidence; HANDOFF-34
  at 106 lines + hooks-session-start.test.ts at 183 lines wrote
  cleanly; SESSION-CONTEXT at 270 lines failed twice with stream
  idle timeout). Path F (S-TOOL-2) lands the hook-enforced version.

── Begin ──

1. Confirm SessionStart hook fired.
2. Run the verify block above.
3. AskUserQuestion the 4 pre-flight items.
4. Proceed per chosen path.
