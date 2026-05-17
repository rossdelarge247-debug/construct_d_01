# Session 104 Pre-flight Context Block (carrying session 103 wrap delta)

## Session 103 wrap delta — read this first

Session 103 closed P2 (spec 65 amendment for quantitative profiling data) from the session-102 carry-forward. **No src/ touched** — spec-layer work only on `claude/session-103-setup-68WaJ`.

**Spec deliverables:**

- `docs/workspace-spec/65b-pre-signup-quantitative-layer.md` (new, 340L) — 3 themed screens between O6 and O7 (demographics / financials / time-intent); all-optional buckets; progressive opt-in expansion to 11 fields; Replace bridge to spec 67 (bank data overwrites buckets at Moment 3); full AI-coach access from session 1; extends O7's adaptivity model with 3 new numeric-derived dimensions composed alongside the 4 categorical dimensions.
- `docs/workspace-spec/65-pre-signup-interview-reconciled.md` (+6L) — gained §"Extensions" pointing at 65b.
- `docs/workspace-spec/67-post-signup-profiling-progress.md` (+2L) — §Gap 1 bridge-examples table gained a "See also" line referencing 65b's bucket-replacement rows.

**Branch at session 103 wrap:**

| Branch | Commits | Status |
|---|---|---|
| `claude/session-103-setup-68WaJ` | `7c3e771` + `2bd57c6` | 2 ahead / 0 behind main; PR pending at kickoff |

**Detailed retro durably captured in `docs/HANDOFF-SESSION-103.md`** — 9 architectural decisions captured via 4 AskUserQuestion rounds; spec drafted in one Write; verbatim quote discipline applied; stub-mode hook noise documented.

**Session 102 closure update:** PR #200 (`S-PROTO-copy-resolver-sweep`) merged at session-103 kickoff — sha `d13bdcf` on main.

## Session 104 priorities — user picks scope

Session 103's spec lands a Build Map's worth of follow-on:

| # | Priority | Scope | Effort | Blocked? |
|---|---|---|---|---|
| 1 | **(Inherited)** Desktop graceful enhancement | Help Rail integration + intermediate breakpoints + extra-space utilisation above 480px | Heavy | No |
| 2 | **(New from session 103)** `S-PROTO-O7-quantitative-hooks` impl | 3 new numeric-derived adaptivity dimensions in `build-plan.ts` (~75-120 LoC); composes alongside spec 65's 4 categorical hooks; degrades gracefully on `null`-tolerant bucket inputs | Medium | No |
| 3 | **(New from session 103)** UI slice for 3 new pre-signup screens (O6.5 / O6.6 / O6.7) | New screen scaffolds + state shape extension + per-screen Skip + progressive expansion toggles + bucket pickers | Heavy | Canvas-as-source if/when canvases ship |

**Recommended:** P2 (build-plan.ts hooks) is the lightest follow-on and lands the spec-65b logic without touching the UI surface. It can ship before P3, since the hooks are `null`-tolerant. P1 (desktop graceful enhancement) is still on the board if the user prefers a visual stream over a logic stream.

## Scoping-discipline observations carried as recurrence-watch (19 items)

**Session 103 applied:**
- Verify before planning — re-read spec 65 L1-244 + spec 67 §Gap 1 L84-119 before drafting 65b.
- Quote, don't paraphrase, when invoking a spec — spec 65 L151 + L174 and spec 67 L86 literal-quoted alongside the citation in each body reference.
- Plan-vs-spec cross-check — each of the 9 decisions was checked against spec 65's existing principles + spec 67's Gap 1 approach before the spec text was drafted.

**New observation this session (one-session; promote to numbered constraint if a second session repeats):**

- **Spec-only sessions don't increment v3b persona retain/drop counter** — no src/ touch → no specialist fan-out at PR time. The 3-slice evaluation window stays at 2 of 3 (S-F1 + session-102 sweep). The next src/ slice (most likely session 104 P2 or P3) will be the third; verdict recorded in that session's handoff.

**Second-session-observed (was new in session 101, repeated session 103):**

- **`spec-citation-quote` hook stub-mode noise.** Fires on `Spec X §"..."` text even when the literal sentence is in the same sentence. Substance follows the rule; stub regex is overly broad. Promote to numbered constraint if a third session confirms.

**Active recurrence-watch items unchanged (carried from session 102):**

- AC-impl cross-check at impl-time
- Sibling-wrapper diff at impl-time
- Shared-infrastructure audit at refactor-time
- In-PR scope-expansion confirmation gate
- `git push --force` after amend
- verification.md PARTIAL internal contradiction
- Read-cap accumulation during sweep cycles
- Single-lens audit framing
- Pre-existing provenance opportunistic cleanup at paragraph rewrite
- Audit findings need active-spec cross-reference at audit time
- Pre-existing CI noise should be queued, not deferred indefinitely
- Post-batch §Status sweep inline with finding-impl slice
- Documentation-meta-loop on guard-rule prose
- Skip-walk + structured retro pattern (from session 100)
- Test-description provenance anti-pattern (from session 101)
- Severity-tier collapse with strict user (from session 101)
- Per-batch test cascade pattern (from session 101)
- Audit-walk regex coverage (from session 102; one-session-observed)
- Mid-flight scope-expansion gate worked cleanly (from session 102; one-session-observed)

## Authoritative reading order at session 104 start

1. This file (you are here).
2. `docs/HANDOFF-SESSION-103.md` (session 103's retro — spec 65b drafting + 9-decision capture + verbatim quote discipline).
3. `docs/HANDOFF-SESSION-102.md` (session 102's retro — copy-resolver sweep + primaryCTA wire).
4. **Before treating session-103 PR as merged:** verify state via `mcp__github__pull_request_read` on the session-103 PR; if `merged: false`, session 104 work can either (a) start from the same branch (continuation), (b) start from main (parallel work), or (c) wait for merge.
5. **For P2 (spec-65b impl):** `docs/workspace-spec/65b-pre-signup-quantitative-layer.md` §"Plan-output usage" for the 3 new dimensions; `src/app/dev/proto/pre-signup-interview/lib/build-plan.ts` for the existing 4-dimension composition logic.
6. **For P3 (UI slice for 3 new screens):** `docs/workspace-spec/65b-pre-signup-quantitative-layer.md` §"The 3 new screens" for the screen scaffolds; spec 65 existing screens for chassis primitive patterns.

## Session 104 kickoff prompt (paste-ready)

```
Kick off session 104.

Read this file (SESSION-CONTEXT.md) first.

Turn-0 verification:
- SessionStart hook surfaces live branch state.
- Branch convention: harness-suffixed off clean main, OR scope-named
  sub-branch (e.g. claude/session-104-O7-quantitative-hooks for P2).
- Session 103 wrap closed P2 (spec 65b drafted); PR may still be open
  at kickoff — verify via mcp__github__pull_request_read before
  treating as on main.
- If the harness landed you on a different base, follow CLAUDE.md
  §"Branch-resume check": git fetch / git checkout -B.

Read at session start (Tier 2 + Tier 3, in order):
1. docs/SESSION-CONTEXT.md (this file).
2. docs/HANDOFF-SESSION-103.md.
3. docs/HANDOFF-SESSION-102.md.

Confirm priority with user. SESSION-CONTEXT recommends either P1
(desktop graceful enhancement), P2 (spec 65b impl — build-plan.ts
hooks), or P3 (UI slice for the 3 new screens) — P2 is the lightest
follow-on from session 103's spec work.
```

## Product positioning (preserve across sessions)

Decouple is the **complete settlement workspace for separating couples**. NOT a financial disclosure tool. NOT a Form E alternative. Tagline: *"Decouple — the complete picture."*

## Stack

Next.js 14 (app router) + TypeScript · Tailwind v4 via CSS variables · S-F1 token system at `src/styles/tokens.ts` (76 tokens) · Tink for bank connect · Anthropic SDK for AI extraction · Vercel previews per branch, production at `construct-dev.vercel.app`. Pre-signup-interview prototype: 8 canvas-as-source screens (O1-O8) on main with shared chassis primitives (TopBar / Hero / Footer) + density-entry + density-question + delight (spec-26 compliance) + output-reassurance + spec 65 §O7 *"Adaptive plan shape"* amendment + 4-dimension adaptive-plan impl + tone-pass on `build-plan.ts` + 14-finding cross-screen Tone audit Phase 1 + 42-string copy-resolver-completeness sweep + primaryCTA wire + invariant test (session 102, PR #200 merged on main as `d13bdcf`). **Session 103 adds the spec layer for 3 new quantitative screens (O6.5 / O6.6 / O6.7) and 3 new numeric-derived plan-output dimensions — impl pending.**

## Branch

Session 104 branch: harness-suffixed off clean main once session-103 PR lands, OR scope-named sub-branch (e.g. `claude/session-104-O7-quantitative-hooks` for P2 scope).

## Negative constraints (preserve)

#1-#41 from prior sessions. **No new numbered constraints surfaced session 103.** Nineteen scoping-discipline observations on recurrence-watch (1 new from session 103 — spec-only sessions don't increment persona retain/drop counter; one-session-observed; promote to numbered constraint if a second session surfaces the same recurrence).

**Active pre-existing CI failures (carry forward):**

- `spec-citation-quote-check` — fires on Added files; second-session limitation observed (fires on `Spec X §"..."` patterns even with verbatim quote attached). Pragmatic carry; session 103's commits passed despite stub-mode false positives at author time.

## Scope ceiling

Session 104 is most likely **either P1 (desktop graceful enhancement), P2 (spec 65b impl — build-plan.ts hooks), or P3 (UI slice for the 3 new pre-signup screens)** alone. P2 is the lightest (~75-120 LoC); P1 + P3 are Heavy. Out of scope unless explicitly added: post-signup work · Welcome Tour · Marketing Landing · Post-connect Dashboard · `Decouple.zip` unpacking · Mobile Screens v2 · authenticated-screens header work.

## Current pre-signup prototype URL

- Production: `https://construct-dev.vercel.app/dev/proto/pre-signup-interview`
- Per-PR preview: surfaced as Vercel comment on each PR.
- All 8 screens (O1-O8) canvas-as-source on main. All chassis primitives + density-entry + density-question + delight compliance + output-reassurance + 4-dimension adaptive plan all merged. Density + delight + output-reassurance audit findings closed (10 of 10). Cross-screen tone audit Phase 1 closed (14 of 14, session 101). Copy-resolver-completeness sweep + primaryCTA wire + invariant test merged on main (session 102, PR #200). **Spec 65b drafted (session 103) but not yet implemented — 3 new screens (O6.5 / O6.6 / O6.7) + 3 new numeric-derived plan-output dimensions pending impl.**
