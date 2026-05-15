# Session 102 Pre-flight Context Block (carrying session 101 wrap delta)

## Session 101 wrap delta — read this first

Session 101 closed P1 (Tone audit Phase 1) end-to-end. **All 14 audit findings shipped to `main`** across 8 PRs spanning the audit lifecycle: register → calibration → 5 implementation slices → 1 housekeeping.

**Squash-merge sequence:**

| PR | Title | Squash sha |
|---|---|---|
| #191 | `S-PROTO-tone-audit-phase-1` (audit register, 14 findings) | `8ff2edc` |
| #192 | `S-PROTO-tone-audit-phase-1 · Phase 2 amendment` (all → STRONG) | `7b68d4b` |
| #193 | `S-PROTO-tone-pass-positioning-batch` (F-TONE-01/02/03) | `c3ee0cc` |
| #194 | `S-PROTO-tone-pass-cta-batch` (F-TONE-04) | `917af25` |
| #195 | `S-PROTO-tone-pass-plan-output-warmth` (F-TONE-05/06/13 + F-TONE-03 cascade) | `a6401eb` |
| #196 | `S-PROTO-tone-pass-chassis-captions` (F-TONE-08/09/10 + audit-extension) | `9b8a522` |
| #197 | `S-PROTO-tone-pass-eyebrow-referent-and-o7-polish` (F-TONE-07/11/12/14 + audit-extension, bundled batches 5+6) | `d9937e4` |
| #198 | `docs(audit-register): housekeep F-TONE-07/11/12/14 sha + PR` | `ddbe040` |

**Detailed retro durably captured in `docs/HANDOFF-SESSION-101.md`** — per-PR merge sequence, what-went-well + what-could-improve (test-description provenance anti-pattern repeated across 3 batches · severity-tier collapse with strict user · per-batch test cascade pattern), key decisions, recurrence-watch hits, persona retention recommendations.

**State on `main` at session 101 wrap:**

- **14/14 audit findings shipped** with complete sha + PR provenance per row in `docs/slices/S-PROTO-tone-audit-phase-1/acceptance.md` §Status table.
- Audit register's §Severity ladder carries a "Phase 2 calibration result" annotation (all 11 initially-MILD findings upgraded by user review; lesson durably recorded for future audits).
- 5 new tests/unit/proto-pre-signup/ test files added (one per Phase 3 batch); ~35 new test cases.
- ~10 pre-existing test files updated for cascading string changes (23 assertions total).
- All 8 pre-signup interview screens (O1-O8) carry tone-pass-corrected copy. Cross-screen referent consistency: `'partner'` used pre-decision (per F-TONE-14); `'ex'` reserved for stage-specific contexts.
- Two discoveries flagged for follow-up: O2.tsx `ctaLabel="Continue"` hardcoded outside copy resolver (escaped Phase 1 audit) + `primaryCTA` dead code in `links.primaryCTA` (computed but unrendered).

**Session 101 net diff vs origin/main pre-session:** the 8 merged PRs landed ~30 LoC src/ string-literal edits + ~35 new tests + ~23 updated assertions + 5 new slice docs (acceptance + verification per batch) + 1 audit register doc + 1 audit-register §Status table populated through 14/14 + 1 HANDOFF + 1 SESSION-CONTEXT refresh.

## Session 102 priorities — user picks scope

All session-101 work is now on `main`. No carry-over in-flight PRs.

| # | Priority | Scope | Effort | Blocked? |
|---|---|---|---|---|
| 1 | **(New, from session 101 discovery)** Copy-resolver-completeness sweep | Walk all `screens/*.tsx` files for hardcoded user-facing strings outside the copy resolver. O2.tsx `ctaLabel="Continue"` is the surfaced instance (escaped Phase 1 audit because audit walked `lib/copy/*.ts` files only). Outcome: either move strings into the copy resolver OR document why they're locally-hardcoded. Could pair with P2 if user wants O7 wired or pruned in one pass. | Light-medium | No |
| 2 | **(New, optional)** `primaryCTA` dead-code resolution | `links.primaryCTA` computed by `primaryCTAForStage` and stored in `PlanContent.links` but not rendered by any screen. Decision call: wire into O7's rendering (per F-TONE-04 audit intent — `'Begin the plan'`) OR remove the dead computation + the type field. | Light | No |
| 3 | **(Inherited)** Desktop graceful enhancement | Help Rail integration + intermediate breakpoints + extra-space utilisation above 480px. | Heavy | No |
| 4 | **(Inherited)** Spec 65 amendment for quantitative profiling data | Heavy | No |

P1 (tone audit Phase 1) closed this session in full. Removed from priority list.

**Recommended:** P1 (copy-resolver-completeness sweep) as the natural next move — closes the audit-walk gap exposed by session 101's batch 2 discovery. Could pair with P2 if user wants the same surface (O7 + `primaryCTA`) addressed in one pass.

## Scoping-discipline observations carried as recurrence-watch (13 + 1 + 3 = 17 items, mostly one-session-observed)

**Session 101 applied:**
- Verify before planning ✓ (live-state grep on `lib/copy/*.ts` literals before each batch's AC freeze).
- Quote, don't paraphrase, when invoking a spec ✓ (every audit register row carried the BEFORE literal as a verbatim quote; every batch's AC carried the BEFORE/AFTER pair verbatim).
- Plan-vs-spec cross-check before the first actionable step ✓ (each batch's acceptance.md cross-checked against the audit register's row).
- Path options carry spec refs ✓ (batch 4 audit-extension call cited CLAUDE.md §"Surgical changes" tension explicitly).
- Think before coding (name uncertainty) ✓ (F-TONE-13 label register call escalated to user before commit when persona finding hit; user-confirmed `'us'` positioning lean).
- AC-impl cross-check at impl-time ✓ (each batch's AC quoted BEFORE/AFTER verbatim).
- In-PR scope-expansion confirmation gate ✓ (audit-extensions in batches 2/4/5 all named in §AC rationale).
- Audit findings need active-spec cross-reference at audit time ✓.
- Post-batch §Status sweep inline with finding-impl slice ✓ (5/5 Phase 3 batches inline; #198 closed final-batch residual).

**New observations this session (one-session; promote to numbered recurrence-watch if a second session repeats):**

- **Test-description provenance anti-pattern**: across 5 Phase 3 slices, finding-IDs + slice-names + temporal-project-state landed in describe + it text on 3 of them, even after auto-review style persona flagged it on the first one. Pattern: persona findings on common anti-patterns aren't one-PR lessons; they're rules to lift into subsequent batches. Likely candidate for promotion given the failure-mode pattern (rule clarity ≠ rule internalisation).
- **Severity-tier collapse with strict user**: Phase 2 calibration upgraded all 11 MILD to STRONG. The MILD severity tier wasn't carrying value for this product's quality bar. Future audits should default STRONG when in doubt; MILD reserved for surfaces that meet the bar but could be sharpened. Documented in audit register's §Severity ladder annotation.
- **Per-batch test cascade pattern**: when copy-only batches edit string literals referenced by existing screen tests, expect 3-8 pre-existing assertions to break per batch. Test cascade is part of the batch scope, not surprise work. Budget that into the batch.

**Active recurrence-watch items unchanged:**
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
- Skip-walk + structured retro pattern (from session 100; one-session-observed)

## Authoritative reading order at session 102 start

1. This file (you are here).
2. `docs/HANDOFF-SESSION-101.md` (session 101's retro — 8-PR audit lifecycle).
3. `docs/HANDOFF-SESSION-100.md` (session 100's retro — merge closure + tone-pass slice that surfaced 4 mild findings feeding into Phase 1 audit).
4. **For P1 (copy-resolver-completeness sweep):** start with `grep -rn "ctaLabel\|aria-label\|placeholder" src/app/dev/proto/pre-signup-interview/screens/*.tsx` to enumerate hardcoded strings. Audit walked `lib/copy/*.ts` only; the sweep extends to JSX-embedded strings.
5. **For P2 (`primaryCTA` cleanup):** `src/app/dev/proto/pre-signup-interview/lib/build-plan.ts:57-64` (function) + `lib/types.ts:81` (type field) + `screens/O7.tsx` (no current usage to remove — would need to add usage to keep the field).

## Session 102 kickoff prompt (paste-ready)

```
Kick off session 102.

Read this file (SESSION-CONTEXT.md) first.

Turn-0 verification:
- SessionStart hook surfaces live branch state.
- Branch convention: harness-suffixed off clean main, OR scope-named
  sub-branch (e.g. claude/session-102-copy-resolver-sweep for P1).
- Session 101 wrap closed all 8 PRs. No carry-over in-flight PRs
  into session 102.
- If the harness landed you on a different base, follow CLAUDE.md
  §"Branch-resume check": git fetch / git checkout -B / per per-slice
  branch resume.

Read at session start (Tier 2 + Tier 3, in order):
1. docs/SESSION-CONTEXT.md (this file).
2. docs/HANDOFF-SESSION-101.md.
3. docs/HANDOFF-SESSION-100.md.

Confirm priority with user. SESSION-CONTEXT recommends P1
(copy-resolver-completeness sweep) as the natural next move — closes
the audit-walk gap exposed by session 101's batch 2 discovery.
```

## Product positioning (preserve across sessions)

Decouple is the **complete settlement workspace for separating couples**. NOT a financial disclosure tool. NOT a Form E alternative. Tagline: *"Decouple — the complete picture."*

## Stack

Next.js 14 (app router) + TypeScript · Tailwind v4 via CSS variables · S-F1 token system at `src/styles/tokens.ts` (76 tokens) · Tink for bank connect · Anthropic SDK for AI extraction · Vercel previews per branch, production at `construct-dev.vercel.app`. Pre-signup-interview prototype: 8 canvas-as-source screens (O1-O8) on main with shared chassis primitives (TopBar / Hero / Footer) + density-entry (EntryScaffold on O1) + density-question (WhyWeAsk on O1-O6) + delight (spec-26 compliance) + output-reassurance (Reassurance on O7) + spec 65 §O7 *"Adaptive plan shape"* amendment + 4-dimension adaptive-plan impl + tone-pass on `build-plan.ts` copy strings (5 fixes from session 100) + **14-finding cross-screen Tone audit Phase 1 fully shipped (session 101: 14/14 findings closed)**.

## Branch

Session 102 branch: harness-suffixed off clean main, OR scope-named sub-branch (e.g. `claude/session-102-copy-resolver-sweep` for P1 scope).

## Negative constraints (preserve)

#1-#41 from prior sessions. **No new numbered constraints surfaced session 101.** Thirteen-plus-four scoping-discipline observations on recurrence-watch (all from earlier sessions plus 3 new from session 101). Promote to numbered constraint if a second session surfaces the same recurrence for any item.

**Active pre-existing CI failures (carry forward):**
- `spec-citation-quote-check` — fires on newly-added slice docs; gate workflow's comment acknowledges *"Pragmatic scope: gate fires on Added files, not Modified. Pre-existing per-cite citations across the corpus would block every spec-modifying PR otherwise."* Acceptable carry; track for eventual line-level diff filtering improvement. Session 101 found two further hook-regex limitations worth noting: (a) indented blockquotes inside list-item continuations don't satisfy the `^>` regex; (b) the hook flags `per spec X` patterns even when the literal sentence appears in an adjacent file (the regex doesn't follow cross-file references). Workaround: outdent block-quote or drop spec attribution.

## Scope ceiling

Session 102 is most likely **P1 (copy-resolver-completeness sweep)** alone given its light-medium size + surface-walk nature. Could pair with P2 (`primaryCTA` dead-code resolution) if user wants to address all O7 surface gaps in one pass. Out of scope unless explicitly added: post-signup work · Welcome Tour · Marketing Landing · Post-connect Dashboard · `Decouple.zip` unpacking · Mobile Screens v2 · authenticated-screens header work.

## Current pre-signup prototype URL

- Production: `https://construct-dev.vercel.app/dev/proto/pre-signup-interview`
- Per-PR preview: surfaced as Vercel comment on each PR.
- All 8 screens (O1-O8) canvas-as-source on main. All chassis primitives + density-entry + density-question + delight compliance + output-reassurance + 4-dimension adaptive plan all merged. Density + delight + output-reassurance audit findings closed (10 of 10). **Cross-screen tone audit Phase 1 closed (14 of 14, session 101).**
