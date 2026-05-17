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

### P2 detail — `S-PROTO-O7-quantitative-hooks` (Recommended)

**Slice candidate:** `docs/slices/S-PROTO-O7-quantitative-hooks/` (not yet scaffolded — spec 65b §Status row 9 names the slice as candidate).

**Spec anchors** (read at session start):

- `docs/workspace-spec/65b-pre-signup-quantitative-layer.md` §"Plan-output usage (O7 adaptivity extension)" — defines Dimensions 5, 6, 7 (sharing-principle weighting, consent-tier complexity, timeline pressure framing).
- `docs/workspace-spec/65b-pre-signup-quantitative-layer.md` §"Data captured (state extension)" — `preSignupState.quantitative` shape extension.
- `docs/workspace-spec/65-pre-signup-interview-reconciled.md` §"Adaptive plan shape" L149-203 — existing 4 categorical dimensions to compose alongside.
- `src/app/dev/proto/pre-signup-interview/lib/build-plan.ts` L29-90 — existing composition logic.

**First actions at session start:**

1. `ls docs/slices/ | grep S-PROTO-O7-quantitative-hooks` — expect no match (fresh slice).
2. `git log --grep="S-PROTO-O7-quantitative-hooks"` — expect no commits (confirms not shipped).
3. Read `lib/build-plan.ts` existing 4-dimension composition.
4. Read spec 65b §"Plan-output usage" + §"Data captured" verbatim.
5. Author AC + test-first per CLAUDE.md §"Engineering conventions" §"TDD where tractable".

**Spec-gate check:** `grep -n "^## \|Out of scope" docs/workspace-spec/65b-pre-signup-quantitative-layer.md` — spec 65b §"What this does NOT cover" lists out-of-scope items; none gate this slice.

**Canvas-fidelity:** N/A (logic slice, no UI surface; no `Linked canvas:` field).

### P3 detail — UI for O6.5 / O6.6 / O6.7 (Heavy)

**Slice candidates:** Possibly 1 combined slice (`S-PROTO-pre-signup-quantitative-screens`) or 3 per-screen slices — decide at scoping time.

**Spec anchors:**

- `docs/workspace-spec/65b-pre-signup-quantitative-layer.md` §"The 3 new screens" — O6.5/O6.6/O6.7 scaffolds with field sets + bucket definitions + rationale copy.
- `docs/workspace-spec/65b-pre-signup-quantitative-layer.md` §"Progressive expansion mechanics" — per-screen toggle/skip patterns.
- `docs/workspace-spec/65b-pre-signup-quantitative-layer.md` §"Placement in the existing 8 screens" — transition copy from O6.
- `src/app/dev/proto/pre-signup-interview/screens/O6.tsx` + `O7.tsx` — chassis-primitive reference patterns (TopBar / Hero / Footer / Eyebrow / SplitHeading).

**First actions at session start:**

1. `ls docs/slices/` for any `S-PROTO-O6.5` / `O6.6` / `O6.7` / `quantitative-screens` directories (expect none).
2. `ls docs/design-source/ | grep -i "pre-signup\|quantitative\|o6"` — if no canvases, prototype slice with no `Linked canvas:` field (canvas-fidelity persona dormant per CLAUDE.md §"Hard controls").
3. Read spec 65b §"The 3 new screens" + §"Progressive expansion mechanics" verbatim.
4. Read existing chassis primitives in O6.tsx for the pattern to replicate.
5. P2 should ideally have shipped first — the hooks compose on `null`-tolerant state, so P3 wiring will not crash even before users see the new screens.

**Spec-gate check:** No gating IF-clause; spec 65b §"What this does NOT cover" lists implementation deferrals (free numeric input, individual asset breakdowns, etc.) that are out-of-scope for this slice — confirm AC scope respects them.

**Canvas-fidelity:** Canvas-as-source default per CLAUDE.md §"Visual direction" §"Canvas-as-source (prototype default)" — no `Linked canvas:` field unless canvases ship before this session's scoping.

### P1 detail — Desktop graceful enhancement (Inherited)

**Slice candidate:** TBD — Help Rail integration is the headline; spec ref pending per session-101 note: *"Help Rail is the central component — spec ref pending."*

**Spec anchors:**

- *(pending)* — locate or scope a Help Rail spec at session start.
- `src/components/document-shell/` (if exists) — for breakpoint primitives.
- `docs/workspace-spec/71-rebuild-strategy.md` §4 — hexagonal architecture reference shape.

**First actions at session start:**

1. `grep -rn "help.rail\|HelpRail" docs/workspace-spec/` — locate Help Rail spec.
2. `ls src/components/help-rail/ 2>/dev/null && ls src/components/document-shell/ 2>/dev/null` — check existing scaffolds.
3. If no Help Rail spec, scope a design phase first before AC freeze.

**Spec-gate check:** Help Rail spec absent at session-103 wrap; pre-condition: a spec must exist OR be scoped in-session before this priority is treated as authorized.

**Canvas-fidelity:** TBD per spec ref.

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

Pre-priority verifications (run BEFORE treating any priority as
authorized, per CLAUDE.md §"Planning conduct"):

For P2 (`S-PROTO-O7-quantitative-hooks`, build-plan.ts impl):
- Shipped-artifact check (§"Pre-priority shipped-artifact verification"):
  `ls docs/slices/ | grep S-PROTO-O7-quantitative-hooks`
  → expect no match. If a directory exists, treat as continuation.
- Spec-gate check (§"Pre-priority spec-gate verification"):
  `grep -n "^## \|Out of scope" docs/workspace-spec/65b-pre-signup-quantitative-layer.md`
  → §"What this does NOT cover" lists exclusions; verify none gate
  this slice. Spec 65b has no gating IF-clause (new spec, no
  prerequisites).
- Canvas-fidelity check (§"Pre-priority canvas-fidelity verification"):
  N/A (logic slice, no UI surface; no `Linked canvas:` field).

For P3 (UI slice for O6.5 / O6.6 / O6.7):
- Shipped-artifact check:
  `ls docs/slices/` for `S-PROTO-O6.5` / `O6.6` / `O6.7` /
  `quantitative-screens` directories → expect none.
- Spec-gate check: spec 65b §"The 3 new screens" defines screen
  content; no gating IF-clause. Verify AC scope respects §"What this
  does NOT cover" (free numeric input out of scope, etc.).
- Canvas-fidelity check:
  `ls docs/design-source/ | grep -i "pre-signup\|quantitative\|o6"`
  → if no canvases, prototype slice ships with no `Linked canvas:`
  field. If canvases exist, decode per
  `scripts/decode-bundler-canvas.sh` BEFORE AC-quoting per
  §"Pre-priority canvas-fidelity verification".

For P1 (Desktop graceful enhancement, inherited):
- Shipped-artifact check:
  `ls src/components/help-rail/ 2>/dev/null` and
  `ls src/components/document-shell/ 2>/dev/null` → check existing
  scaffolds.
- Spec-gate check:
  `grep -rn "help.rail\|HelpRail" docs/workspace-spec/` → Help Rail
  spec ref pending per session-101 note. If no spec exists, scope a
  design phase BEFORE AC freeze.
- Canvas-fidelity check: TBD per Help Rail spec ref.

Confirm priority with user. SESSION-CONTEXT recommends either P1
(desktop graceful enhancement), P2 (`S-PROTO-O7-quantitative-hooks`
build-plan.ts impl), or P3 (UI slice for the 3 new screens) — P2 is the
lightest follow-on from session 103's spec work.
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
