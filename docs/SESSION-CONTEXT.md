# Session 103 Pre-flight Context Block (carrying session 102 wrap delta)

## Session 102 wrap delta — read this first

Session 102 closed P1 (Copy-resolver-completeness sweep) + P2 (`primaryCTA` dead-code resolution) in **one combined slice** — both priorities shared the same surface (O7 + `lib/copy/*` + `screens/*.tsx`), so bundled into a single PR.

**Squash-merge target (pending at session-102 wrap):**

| PR | Title | Head sha | State |
|---|---|---|---|
| #200 | `S-PROTO-copy-resolver-sweep · close audit-walk gap + wire primaryCTA` | `26013d9` | Open · 25/25 CI green · auto-review ✅ approve · CODEOWNERS admin-bypass merge pending |

**Detailed retro durably captured in `docs/HANDOFF-SESSION-102.md`** — mid-flight scope-expansion gate (attribute hardcodes → JSX-text hardcodes), 42-string sweep mechanics, persona findings round-by-round, retain/drop tracking progress.

**State on branch at session 102 wrap (pre-merge):**

- **42 hardcoded user-facing strings** moved from `screens/*.tsx` into `lib/copy/*.ts` resolvers (O2 + O3 + O7 + O8 surfaces; new `lib/copy/o7.ts` + `lib/copy/o8.ts` authored).
- **`primaryCTA` wired** — O7's Footer ctaLabel reads `plan.links.primaryCTA` (stage-specific per `primaryCTAForStage`). F-TONE-04 audit intent now reaches the user.
- **Regression invariant** — `tests/unit/proto-pre-signup/copy-resolver-invariant.test.ts` scans all 8 screen files for both attribute hardcodes AND JSX text content hardcodes; empty allowlist at slice ship; CI gate guards against re-introduction.
- 3 new test files added (43 new test cases); 2 pre-existing test cascades resolved (`o7-canvas-as-source` + `output-reassurance` flipped from `"What's next"` to `'Continue'` default-stage assertion).
- 673/673 tests pass on slice ship (was 632/632 at session 101 wrap).

**Pending user-actions on PR #200 before merge:**

- Mobile-viewport preview check at 375px (confirm `'See what comes next'` — stage `thinking` primaryCTA, 20 chars — renders cleanly in Footer button without overflow/wrap). Preview URL: https://construct-dev-git-claude-b3a2d3-rossdelarge247-debugs-projects.vercel.app/dev/proto/pre-signup-interview
- CODEOWNERS admin-bypass merge click (solo-operator pattern).
- Update `verification.md` mobile-viewport row from "pending" to "confirmed" with preview-deploy evidence.

## Session 103 priorities — user picks scope

PR #200 may still be open at session 103 kickoff (pending user-action above). Verify state via `mcp__github__pull_request_read` on PR #200 before treating it as merged.

| # | Priority | Scope | Effort | Blocked? |
|---|---|---|---|---|
| 1 | **(Inherited)** Desktop graceful enhancement | Help Rail integration + intermediate breakpoints + extra-space utilisation above 480px. | Heavy | No |
| 2 | **(Inherited)** Spec 65 amendment for quantitative profiling data | Capture the structured profiling rows beyond the qualitative stage axis. | Heavy | No |

P1 + P2 (copy-resolver-completeness sweep + `primaryCTA` dead-code) closed in full this session. Removed from priority list.

**Recommended:** either P1 or P2 is fine for session 103 — both Heavy items that would fit a fresh session window. P1 (desktop graceful enhancement) is the natural visual continuation now that all 8 mobile screens are tone-pass + copy-resolver-complete; P2 (spec 65 amendment) is a spec-layer task with no src/ overlap.

## Scoping-discipline observations carried as recurrence-watch (13 + 1 + 3 + 1 = 18 items, mostly one-session-observed)

**Session 102 applied:**
- Verify before planning ✓ (live grep on `screens/*.tsx` hardcodes before AC freeze; second-pass grep surfaced JSX-text-content gap that triggered scope-expansion gate).
- Mid-flight scope-expansion confirmation gate ✓ (user-confirmed Option A "full broad" before AC-3/AC-5 expanded inline; documented in `acceptance.md` as a §"Mid-flight scope-expansion note").
- Quote, don't paraphrase, when invoking a spec ✓ (acceptance.md cites CLAUDE.md §"Names carry the design" + §"Simplicity first" verbatim for both style nitpicks; verification.md cites spec 72b §"Decision criteria" row 1 verbatim for adversarial-review budget choice).
- Plan-vs-spec cross-check before the first actionable step ✓ (AC-1..AC-6 cross-checked against CLAUDE.md §"Coding conduct" + §"Engineering conventions" before any code edit).

**New observation this session (one-session; promote to numbered recurrence-watch if a second session repeats):**

- **Audit-walk regex coverage**: the original session-101 audit walked `lib/copy/*.ts` only and missed `screens/*.tsx`; session-102's slice initially also focused on attribute-style hardcodes and missed JSX text content. **Two regex passes** were needed before the sweep was complete. Pattern: audit-walk completeness is an active design surface, not a one-shot grep. Worth considering whether the invariant test pattern (regex scan over the target surface family) should also run at audit time as a discovery aid, not just as a regression guard.

**Active recurrence-watch items unchanged (carried from session 101):**
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

## Authoritative reading order at session 103 start

1. This file (you are here).
2. `docs/HANDOFF-SESSION-102.md` (session 102's retro — copy-resolver sweep + primaryCTA wire + persona round-by-round).
3. `docs/HANDOFF-SESSION-101.md` (session 101's retro — 8-PR tone-audit lifecycle).
4. **Before treating PR #200 as merged:** verify state via `mcp__github__pull_request_read` (method `get`); if `merged: false`, session 103 work must NOT collide with the unmerged surface (O7 + O8 + `lib/copy/o7.ts` + `lib/copy/o8.ts` + 3 new test files + 2 cascade-updated test files).
5. **For P1 (desktop graceful enhancement):** start with `docs/workspace-spec/` for any existing desktop-shell specs; spec 71 §4 hexagonal architecture; `src/components/document-shell/` for breakpoint primitives. Help Rail is the central component — spec ref pending.
6. **For P2 (spec 65 amendment):** `docs/workspace-spec/65-pre-signup-interview-reconciled.md` for the existing reconciled doc; quantitative profiling rows complement the qualitative stage axis already captured.

## Session 103 kickoff prompt (paste-ready)

```
Kick off session 103.

Read this file (SESSION-CONTEXT.md) first.

Turn-0 verification:
- SessionStart hook surfaces live branch state.
- Branch convention: harness-suffixed off clean main, OR scope-named
  sub-branch (e.g. claude/session-103-desktop-enhancement for P1).
- Session 102 wrap closed P1 + P2; PR #200 may or may not be merged
  at kickoff — verify via mcp__github__pull_request_read before
  treating as on main.
- If the harness landed you on a different base, follow CLAUDE.md
  §"Branch-resume check": git fetch / git checkout -B.

Read at session start (Tier 2 + Tier 3, in order):
1. docs/SESSION-CONTEXT.md (this file).
2. docs/HANDOFF-SESSION-102.md.
3. docs/HANDOFF-SESSION-101.md.

Confirm priority with user. SESSION-CONTEXT recommends either P1
(desktop graceful enhancement) or P2 (spec 65 amendment) — both
Heavy, both fresh-session-sized.
```

## Product positioning (preserve across sessions)

Decouple is the **complete settlement workspace for separating couples**. NOT a financial disclosure tool. NOT a Form E alternative. Tagline: *"Decouple — the complete picture."*

## Stack

Next.js 14 (app router) + TypeScript · Tailwind v4 via CSS variables · S-F1 token system at `src/styles/tokens.ts` (76 tokens) · Tink for bank connect · Anthropic SDK for AI extraction · Vercel previews per branch, production at `construct-dev.vercel.app`. Pre-signup-interview prototype: 8 canvas-as-source screens (O1-O8) on main with shared chassis primitives (TopBar / Hero / Footer) + density-entry (EntryScaffold on O1) + density-question (WhyWeAsk on O1-O6) + delight (spec-26 compliance) + output-reassurance (Reassurance on O7) + spec 65 §O7 *"Adaptive plan shape"* amendment + 4-dimension adaptive-plan impl + tone-pass on `build-plan.ts` copy strings (5 fixes from session 100) + **14-finding cross-screen Tone audit Phase 1 fully shipped (session 101)** + **42-string copy-resolver-completeness sweep + primaryCTA wire + invariant test (session 102, PR #200 pending merge)**.

## Branch

Session 103 branch: harness-suffixed off clean main once PR #200 lands, OR scope-named sub-branch (e.g. `claude/session-103-desktop-enhancement` for P1 scope).

## Negative constraints (preserve)

#1-#41 from prior sessions. **No new numbered constraints surfaced session 102.** Eighteen scoping-discipline observations on recurrence-watch (1 new from session 102 — audit-walk regex coverage; promote to numbered constraint if a second session surfaces the same recurrence).

**Active pre-existing CI failures (carry forward):**
- `spec-citation-quote-check` — fires on newly-added slice docs; gate workflow's comment acknowledges *"Pragmatic scope: gate fires on Added files, not Modified. Pre-existing per-cite citations across the corpus would block every spec-modifying PR otherwise."* Acceptable carry; session 102's PR #200 passed the gate cleanly. Session 101 found two further hook-regex limitations: (a) indented blockquotes inside list-item continuations don't satisfy the `^>` regex; (b) the hook flags `per spec X` patterns even when the literal sentence appears in an adjacent file. Workaround: outdent block-quote or drop spec attribution.

## Scope ceiling

Session 103 is most likely **either P1 (desktop graceful enhancement) OR P2 (spec 65 amendment)** alone given the Heavy effort tier of both. Both fit a fresh session window. Out of scope unless explicitly added: post-signup work · Welcome Tour · Marketing Landing · Post-connect Dashboard · `Decouple.zip` unpacking · Mobile Screens v2 · authenticated-screens header work.

## Current pre-signup prototype URL

- Production: `https://construct-dev.vercel.app/dev/proto/pre-signup-interview`
- Per-PR preview: surfaced as Vercel comment on each PR.
- All 8 screens (O1-O8) canvas-as-source on main. All chassis primitives + density-entry + density-question + delight compliance + output-reassurance + 4-dimension adaptive plan all merged. Density + delight + output-reassurance audit findings closed (10 of 10). **Cross-screen tone audit Phase 1 closed (14 of 14, session 101).** **Copy-resolver-completeness sweep + primaryCTA wire (session 102, PR #200 pending merge).**
