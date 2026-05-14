# Session 99 Pre-flight Context Block (carrying session 98 wrap delta)

## Session 98 wrap delta — read this first

Session 98 over-delivered the recommended P1 (spec 65 amendment scaffold). Kickoff scoped scaffold + AC list only with impl deferring to session 99+; session 98 instead carried through the full design conversation across 7 commits and shipped the actual spec 65 §O7 amendment text. Slice `S-65-amendment-F-OUT-01-02` reaches Stage 3 of its downstream landing plan (amendment shipped); Stage 4 (impl) is the next session's natural priority.

**Branch state:** `claude/S-65-amendment-F-OUT-01-02` @ `c84689e` (7 commits ahead of `main`; not yet merged at wrap time — see PR question below).

**Seven commits this session (ordered):**

- **`67565aa`** scaffold + 8-AC frame — cross-spec conflict statement (4 verbatim sources) + 8 ACs.
- **`c1deb0e`** scaffold tighten + AC-2 RESOLVED → (c) — added spec 74 §"Free-plan framing" L30-55 as 5th load-bearing source (surfaced by archive-sweep agent); softened "deliberately-dropped" framing (no recorded decision-log); reframed AC-3 from confidence-derivation to adaptivity-dimensions.
- **`c2eedbf`** AC-3 Q1+Q3+Q4 RESOLVED — 4-dim shortlist locked + 3-dim V1.5 deferrals + no-new-data-collection. Schema verification surfaced 3 corrections (Stage 3-valued not 5; partner-finances on O5 not O6; example anchoring is descriptive-labels-only no names).
- **`f523fee`** AC-3 Q2 partial (Stage + Partner-finances mappings) — bundled wrap-up of two dimensions with existing build-plan.ts partial wires (~15-25 LoC combined).
- **`54b1d61`** AC-3 Q2 full close (Example anchoring + Lead-ordering mappings) — locked per 5 tactical decisions. AC-3 fully closed.
- **`5bae7d6`** AC-4 RESOLVED — 4 boundary conditions verified ✓ against locked AC-3 mappings.
- **`c84689e`** AC-5 RESOLVED — spec 65 §O7 amendment shipped (3 new sub-sections; +54 lines into spec 65). Impl slice provisional name `S-PROTO-O7-adaptive-hooks` (~75-120 LoC scope).

**Slice acceptance.md status:**

| AC | Status |
|---|---|
| AC-1 | drafted ✓ (6 quoted sources) |
| AC-2 | RESOLVED → (c) ✓ |
| AC-3 | RESOLVED ✓ (Q1+Q2+Q3+Q4 all closed) |
| AC-4 | RESOLVED ✓ |
| AC-5 | RESOLVED ✓ (amendment landed) |
| AC-6 | PROVISIONAL (impl slice scope locked) |
| AC-7 | OPEN — happens at impl ship |
| AC-8 | ✓ for current scope |

Slice's downstream landing plan: Stage 3 (Amendment-text) complete. Stage 4 (Impl) is next session's primary work.

**Diagnosis trail durably captured in `docs/HANDOFF-SESSION-98.md`** — read for the archive-sweep finding (spec 74 surfacing), the 3 schema-verification bugs caught pre-ship, the existing-infra finding that course-corrected mapping-conversation sequencing, and per-commit narrative.

**Net diff vs main this session:** ~234 lines slice docs + 54 lines spec 65 amendment-text.

## Session 99 priorities — user picks scope

| # | Priority | Scope | Effort | Blocked? |
|---|---|---|---|---|
| 1 | **Impl slice `S-PROTO-O7-adaptive-hooks`** (Stage 4 of `S-65-amendment-F-OUT-01-02`) | Implements the 4 dimension mappings locked in AC-3 → ~75-120 LoC across `src/app/dev/proto/pre-signup-interview/lib/build-plan.ts`. Extensions of existing `composeXXX` functions; no infrastructure changes; no `PlanContent` shape change. Trigger copy strings for new `personalisedNotes` triggers (`partner-finance-full` / `partner-finance-some` / `priority-{value}` / `worry-{value}`) drafted at impl time. + AC-7 audit-slice §F-OUT-01/02 §Status flip inline with this PR (per session 97 recurrence-watch). | Medium (~60-90 min impl + verification) | No |
| 2 | **Tone audit Phase 1** | Same as session 98's P2 (deferred). Structural review on O1-O8 copy + visual treatments + emotional calibration vs CLAUDE.md "warm hand on a cold day". | Light-medium | No |
| 3 | **Desktop graceful enhancement** | Same as session 98's P3 (deferred). Help Rail integration + intermediate breakpoints + extra-space utilisation above 480px. | Heavy | No |
| 4 | **(Inherited)** spec-citation-quote-check author-time hook | Light | No |
| 5 | **(Inherited)** Comment-review hook CSS-files regex tightening | Light | No |
| 6 | **(Inherited)** Spec 65 amendment for quantitative profiling data | Heavy | No |

**Recommended:** P1 (impl slice `S-PROTO-O7-adaptive-hooks`) as the natural next step. The spec 65 §O7 amendment landed on the `claude/S-65-amendment-F-OUT-01-02` branch session 98; the impl slice closes the loop by making the AI plan output actually adaptive per the dimensions specced. AC-6 + AC-7 close inline with the impl PR. Alternative: P2 (tone audit Phase 1) if user wants a different lens before impl-loop closure.

## Scoping-discipline observations carried as recurrence-watch (12 items)

All 12 from session 97 carried forward + 0 new this session.

**Session 98 applied:**
- Pre-priority spec-gate verification ✓ (cross-spec citations verbatim throughout).
- Quote-don't-paraphrase ✓ (every cross-spec citation in amendment text carries verbatim text + file:line refs).
- Schema-verify-before-planning ✓ (caught 3 dimension-description bugs).
- Existing-infra check before scoping mapping work ✓ (read build-plan.ts before drafting mapping decisions; course-corrected sequencing).

**Active recurrence-watch items unchanged:**
- AC-impl cross-check at impl-time (session 90).
- Sibling-wrapper diff at impl-time (session 88).
- Shared-infrastructure audit at refactor-time (session 87).
- In-PR scope-expansion confirmation gate (session 87).
- `git push --force` after amend (session 91).
- verification.md PARTIAL internal contradiction (session 93).
- Read-cap accumulation during sweep cycles (session 93).
- Single-lens audit framing (session 94).
- Pre-existing provenance opportunistic cleanup at paragraph rewrite (session 94) — session 98 example: comment-review hook flagged "session-19" in `c1deb0e` edit; corrected inline before commit.
- Audit findings need active-spec cross-reference at audit time (session 96).
- Pre-existing CI noise should be queued, not deferred indefinitely (session 96).
- Post-batch §Status sweep inline with finding-impl slice (session 97) — will apply session 99 P1 (audit-slice §F-OUT-01/02 flip MUST land inline with impl PR).

## Authoritative reading order at session 99 start

1. This file (you are here).
2. `docs/HANDOFF-SESSION-98.md` (session 98's retro — 7 shipped commits + archive-sweep finding + schema-verification corrections + course-corrected mapping sequencing).
3. `docs/HANDOFF-SESSION-97.md` (session 97's retro for prior context).
4. **For P1 (impl slice):**
   - `docs/slices/S-65-amendment-F-OUT-01-02/acceptance.md` §AC-3 mappings (the spec for impl).
   - `docs/workspace-spec/65-pre-signup-interview-reconciled.md` §O7 *"Adaptive plan shape"* (amendment lives there from L149+).
   - `src/app/dev/proto/pre-signup-interview/lib/build-plan.ts` (existing 101 LoC infrastructure to extend; `composeXXX` functions).
   - `src/app/dev/proto/pre-signup-interview/lib/types.ts` (schema).
   - `docs/slices/S-PROTO-pre-signup-density-delight-audit/acceptance.md` §F-OUT-01 + §F-OUT-02 (audit-slice rows to flip inline with impl PR).
5. **For P2 (tone audit Phase 1):** as session 98's reading order.

## Session 99 kickoff prompt (paste-ready)

```
Kick off session 99.

Read this file (SESSION-CONTEXT.md) first.

Turn-0 verification:
- SessionStart hook surfaces live branch state.
- Branch convention: harness-suffixed (claude/<scope>-XXXXX) OR
  per-slice sub-branch (claude/S-PROTO-O7-adaptive-hooks for P1).
- The claude/S-65-amendment-F-OUT-01-02 branch is 7 commits ahead
  of main (session 98 amendment work). PR open or pending per
  session 98 wrap.
- If the harness landed you on a different base, follow CLAUDE.md
  §"Branch-resume check": git fetch / git checkout -B / per per-slice
  branch resume.

Read at session start (Tier 2 + Tier 3, in order):
1. docs/SESSION-CONTEXT.md (this file).
2. docs/HANDOFF-SESSION-98.md.
3. For P1 (impl slice S-PROTO-O7-adaptive-hooks):
   - docs/slices/S-65-amendment-F-OUT-01-02/acceptance.md §AC-3
   - docs/workspace-spec/65-pre-signup-interview-reconciled.md §O7
     "Adaptive plan shape" (from L149)
   - src/app/dev/proto/pre-signup-interview/lib/build-plan.ts
   - src/app/dev/proto/pre-signup-interview/lib/types.ts

Confirm priority with user. SESSION-CONTEXT recommends P1 (impl slice)
as the natural Stage 4 of the spec 65 amendment landing plan, which
closes F-OUT-01 + F-OUT-02 from the density/delight audit slice.

Per CLAUDE.md §"AC-impl cross-check at impl-time" (recurrence-watch
session 90): before pushing impl, re-read each AC-3 dimension mapping's
verbatim wording and grep impl for the structural elements named in
the mapping.

Per CLAUDE.md §"Quote, don't paraphrase, when invoking a spec":
amendment cross-refs in code comments use file:line refs.

Per CLAUDE.md §"Post-batch §Status sweep inline with finding-impl slice"
(recurrence-watch session 97): the audit slice §F-OUT-01/02 §Status
flip MUST land inline with the impl PR — not in a separate docs PR.

Definition of Done (CLAUDE.md §"Definition of Done", prototype short-
form items 1, 8, 12, 14 from spec 76 §3):
- Slice acceptance.md + verification.md
- Tests written + passing
- Preview-deploy verified across spec 72a 6+1 dimensions (UI surface
  applies — O7 renders different content per dimension state)
- User feedback received + addressed (or explicitly deferred)
```

## Product positioning (preserve across sessions)

Decouple is the **complete settlement workspace for separating couples**. NOT a financial disclosure tool. NOT a Form E alternative. Tagline: *"Decouple — the complete picture."*

## Stack

Next.js 14 (app router) + TypeScript · Tailwind v4 via CSS variables · S-F1 token system at `src/styles/tokens.ts` (76 tokens) · Tink for bank connect · Anthropic SDK for AI extraction · Vercel previews per branch, production at `construct-dev.vercel.app`. Shared chassis primitives all landed (TopBar / Hero / Footer) + density-entry (EntryScaffold on O1) + density-question (WhyWeAsk on O1-O6) + delight (spec-26 compliance pass) + output-reassurance (Reassurance on O7) all merged to main. Spec 65 §O7 *"Adaptive plan shape"* amendment shipped session 98 (on branch `claude/S-65-amendment-F-OUT-01-02`; not yet merged at session 98 wrap).

## Branch

Session 99 branch: harness-suffixed off clean main, OR scope-named sub-branch (`claude/S-PROTO-O7-adaptive-hooks` for P1, `claude/session-99-tone-audit` for P2, etc).

## Negative constraints (preserve)

#1-#41 from prior sessions. **No new numbered constraints surfaced session 98.** Twelve scoping-discipline observations on recurrence-watch (all carried from session 97). Promote to numbered constraint if a second session surfaces the same recurrence for any new item.

**Active pre-existing CI failures (carry forward):**
- `spec-citation-quote-check` — fires on newly-added slice docs; gate workflow's comment acknowledges *"Pragmatic scope: gate fires on Added files, not Modified. Pre-existing per-cite citations across the corpus would block every spec-modifying PR otherwise."* Acceptable carry; track for eventual line-level diff filtering improvement.

## Scope ceiling

Session 99 is most likely **P1 (impl slice `S-PROTO-O7-adaptive-hooks`)** alone given its medium size + AC-7 audit-slice-flip inline. Out of scope unless explicitly added: P2-6 alternative directions · Welcome Tour · Marketing Landing · Post-connect Dashboard · `Decouple.zip` unpacking · Mobile Screens v2 · authenticated-screens header work.

## Current pre-signup prototype URL

- Production: `https://construct-dev.vercel.app/dev/proto/pre-signup-interview`
- Per-PR preview: surfaced as Vercel comment on each PR.
- All 8 screens (O1-O8) are canvas-as-source on main. Three shared chassis primitives (TopBar + Hero + Footer) + EntryScaffold (O1) + WhyWeAsk (O1-O6) + spec-26 delight compliance + Reassurance (O7) all merged. Density + delight + output-reassurance audit findings closed (8 of 10); F-OUT-01 + F-OUT-02 explicitly blocked pending spec amendment → **amendment shipped session 98** on branch `claude/S-65-amendment-F-OUT-01-02` (impl + audit-flip in session 99).
