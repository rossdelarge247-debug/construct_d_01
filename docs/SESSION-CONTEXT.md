# Session 105 Pre-flight Context Block (carrying session 104 wrap delta)

## Session 104 wrap delta — read this first

Session 104 closed P2 from session-103's carry-forward — `S-PROTO-O7-quantitative-hooks`. Logic-only slice (prototype category) extending `build-plan.ts` with 3 numeric-derived adaptivity dimensions composing alongside the existing 4 categorical hooks. Squash-merged to main as `464b943` via PR #202.

**Slice deliverables:**

- `src/app/dev/proto/pre-signup-interview/lib/types.ts` — `Quantitative` interface + 12 bucket type aliases + optional `Answers.quantitative?` field. Backward-compatible.
- `src/app/dev/proto/pre-signup-interview/lib/build-plan.ts` — 3 derive functions (`deriveSharingWeight`, `deriveConsentTier`, `deriveTimelineFraming`) + `composeQuantitativeNotes` + 3 NOTES constant maps; `buildPlanFromAnswers` concats quantitative notes after categorical.
- `tests/unit/proto-pre-signup/build-plan-quantitative.test.ts` (new, 29 tests) + existing `build-plan.test.ts` unchanged (42 tests). 71 total pass.
- `docs/slices/S-PROTO-O7-quantitative-hooks/{acceptance,verification}.md` — 9 ACs + 5 design decisions + DoD evidence.
- `docs/workspace-spec/65b-pre-signup-quantitative-layer.md` — paired patch on §"AI-coach integration" `ex_age_relative` row dropping promise-without-delivery wording.

**Branch at session 104 wrap:**

| Branch | Status |
|---|---|
| `claude/session-104-O7-quantitative-hooks` | squash-merged via PR #202; tip `9ec06ff` on the branch = same content as main `464b943` |
| `claude/session-104-wrap` | wrap docs branch — handoff + SESSION-CONTEXT refresh |

**Detailed retro captured in `docs/HANDOFF-SESSION-104.md`** — 2 AskUserQuestion rounds locking D5 trigger scope + tie-break ordering; 1 auto-review round on PR #202 with 8 findings (6 actionable, all addressed in `9ec06ff`); persona retain/drop verdict for the 3rd `src/` slice rendered (all 4 active personas retained).

**Persona findings:** `reviewer-prototype-readiness` caught 2 actionable issues main missed (D7 mid-range AC gap + D6 property_equity AC gap). `reviewer-style` caught 4 issues main missed (test-description AC ref + 2 naming nitpicks + 1 dead guard). `reviewer-security` returned praise only. `reviewer-correctness` returned no findings this slice (small sample; retained provisionally).

## Session 105 priorities — user picks scope

Session 104 closed P2; P3 carried forward as session 105's recommended priority.

| # | Priority | Scope | Effort | Blocked? |
|---|---|---|---|---|
| 1 | **(Carried + re-prioritised)** UI slice for 3 new pre-signup screens (O6.5 / O6.6 / O6.7) | New screen scaffolds + per-screen Skip + progressive expansion toggles + bucket pickers; wires `Quantitative` state (now on main from session 104) | Heavy | No |
| 2 | **(Inherited)** Desktop graceful enhancement — Help Rail integration + intermediate breakpoints + extra-space utilisation above 480px | Heavy | No (but Help Rail spec ref still pending per session-101 note) |

**Recommended:** P1 (UI slice). The state shape + plan-engine hooks landed in session 104; the UI is the final piece to make spec 65b user-visible. User confirmed at session-104 wrap that no canvases exist for these screens — build will be spec-only from spec 65b §"The 3 new screens" L60-208 (no `Linked canvas:` field; canvas-fidelity persona stays dormant).

### P1 detail — UI for O6.5 / O6.6 / O6.7 (Heavy; spec-only build)

**Slice candidates:** Possibly 1 combined slice (`S-PROTO-pre-signup-quantitative-screens`) or 3 per-screen slices — decide at scoping time. Combined likely easier given shared chassis patterns (TopBar / Hero / Footer / Skip mechanic / expansion toggle).

**Spec anchors** (read at session start):

- `docs/workspace-spec/65b-pre-signup-quantitative-layer.md` §"The 3 new screens" L60-208 — O6.5/O6.6/O6.7 scaffolds with field sets + bucket definitions + rationale copy.
- `docs/workspace-spec/65b-pre-signup-quantitative-layer.md` §"Progressive expansion mechanics" L209-220 — per-screen toggle/skip patterns.
- `docs/workspace-spec/65b-pre-signup-quantitative-layer.md` §"Placement in the existing 8 screens" L30-58 — transition copy from O6.
- `src/app/dev/proto/pre-signup-interview/screens/O6.tsx` + `O7.tsx` — chassis-primitive reference patterns (TopBar / Hero / Footer / Eyebrow / SplitHeading).
- `src/app/dev/proto/pre-signup-interview/lib/types.ts` — `Quantitative` interface (now on main; defines bucket types for picker components).

**First actions at session start:**

1. `ls docs/slices/` for any `S-PROTO-O6.5` / `O6.6` / `O6.7` / `quantitative-screens` directories (expect none).
2. `ls docs/design-source/ | grep -i "pre-signup\|quantitative\|o6"` — confirm no canvases per session-104 wrap call; prototype slice ships with no `Linked canvas:` field.
3. Read spec 65b §"The 3 new screens" + §"Progressive expansion mechanics" verbatim (use offset + limit; the spec is 346L).
4. Read existing chassis primitives in O6.tsx for the pattern to replicate.
5. Author AC + design decisions for partition (1 vs 3 slices) + state-wire approach + bucket-picker component reuse.

**Spec-gate check:** Spec 65b §"What this does NOT cover" L333-343 lists implementation deferrals (free numeric input, individual asset breakdowns, validation logic, partner-disclosed quantitative, A/B testing of expansion uptake). Confirm AC scope respects them.

**Canvas-fidelity:** Dormant — no `Linked canvas:` field. Canvas-as-source default per CLAUDE.md §"Visual direction" if canvases ship mid-session.

### P2 detail — Desktop graceful enhancement (Inherited)

**Slice candidate:** TBD — Help Rail integration is the headline; spec ref pending per session-101 note: *"Help Rail is the central component — spec ref pending."*

**Spec anchors:**

- *(pending)* — locate or scope a Help Rail spec at session start.
- `src/components/document-shell/` (if exists) — for breakpoint primitives.
- `docs/workspace-spec/71-rebuild-strategy.md` §4 — hexagonal architecture reference shape.

**First actions at session start:**

1. `grep -rn "help.rail\|HelpRail" docs/workspace-spec/` — locate Help Rail spec.
2. `ls src/components/help-rail/ 2>/dev/null && ls src/components/document-shell/ 2>/dev/null` — check existing scaffolds.
3. If no Help Rail spec, scope a design phase first before AC freeze.

**Spec-gate check:** Help Rail spec absent at session-104 wrap; pre-condition: a spec must exist OR be scoped in-session before this priority is treated as authorized.

**Canvas-fidelity:** TBD per spec ref.

## Scoping-discipline observations carried as recurrence-watch (22 items)

**Session 104 applied:**

- Verify before planning — re-read spec 65b L221-346 + build-plan.ts L1-232 before AC freeze.
- Quote, don't paraphrase — spec 65b §"Plan-output usage" L259-281 + §"Data captured" L226-246 literal-blockquoted in acceptance.md's §"Spec sources".
- Plan-vs-spec cross-check — D5 + cap rule ambiguities surfaced via AskUserQuestion (2 rounds) BEFORE AC freeze, not silent-decided.

**New observations this session (one-session-observed; promote to numbered constraint if a second session repeats):**

- **`spec-citation-quote` gate's same-PR replacement edge case.** When a paired spec patch in the SAME PR removes the OLD text that the AC quotes verbatim, the gate's fuzzy-match against the (now-patched) spec content fails. Fix: blockquote the NEW (in-spec) text as the proximity quote; move OLD text to inline prose. Author-time stub passes per-file but doesn't catch this; merge-time CI gate does.
- **Sibling spec discrepancies should be batched at AC freeze.** When one spec ambiguity surfaces (e.g. D5 "+ ages"), scan for siblings before AC freeze. Session 104 surfaced D5 to user via AskUserQuestion but silently-decided D6's `property_equity` under the same precedent; reviewer-prototype-readiness flagged at PR time. Offer a "scan-for-siblings" round when one spec ambiguity surfaces.
- **Author-time comment-review stub doesn't catch AC refs in test `describe` strings.** Regex catalogue covers persistent prose anti-patterns but not slice-ID/AC-ID in test names. Reviewer-style catches at PR time. Stub-extension candidate: extend regex with `describe\(['"][^'"]*(AC-\d|S-[A-Z])` pattern.

**Second-session-observed (was new in session 103, repeated session 104 in a different shape; promote to numbered constraint after one more repetition):**

- **`spec-citation-quote` author-time stub vs CI gate strictness.** The author-time stub is more permissive than the merge-time CI gate. Session 103: inline-italic vs blockquote markup. Session 104: same-PR spec patch removing the OLD quoted text. Both show: slice authors should run `bash scripts/spec-citation-quote-check.sh` locally before push (NOT relying on hook-stub feedback alone).

**Carried unchanged from session 103:**

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
- Spec-only sessions don't increment v3b persona retain/drop counter (from session 103; one-session-observed — but session 104 was an `src/` session so the counter advanced)

## Authoritative reading order at session 105 start

1. This file (you are here).
2. `docs/HANDOFF-SESSION-104.md` (session 104's retro — P2 ship + auto-review findings + persona retain/drop verdict).
3. `docs/HANDOFF-SESSION-103.md` (session 103's retro — spec 65b drafting + 9 decisions + verbatim quote discipline).
4. **For P1 (UI slice for 3 new screens):** `docs/workspace-spec/65b-pre-signup-quantitative-layer.md` §"The 3 new screens" for the screen scaffolds; spec 65 existing screens + `src/app/dev/proto/pre-signup-interview/screens/O6.tsx` for chassis primitive patterns; `src/app/dev/proto/pre-signup-interview/lib/types.ts` for the `Quantitative` shape now on main.
5. **For P2 (Desktop graceful enhancement):** Help Rail spec ref pending — locate or scope at session start.

## Session 105 kickoff prompt (paste-ready)

```
Kick off session 105.

Read this file (SESSION-CONTEXT.md) first.

Turn-0 verification:
- SessionStart hook surfaces live branch state.
- Branch convention: harness-suffixed off clean main, OR scope-named
  sub-branch (e.g. claude/session-105-O6-quantitative-screens for P1).
- Session 104 wrap squash-merged P2 as `464b943` on main. Verify
  state via `git log --oneline origin/main | head -3` if uncertain.
- If the harness landed you on a different base, follow CLAUDE.md
  §"Branch-resume check": git fetch / git checkout -B.

Read at session start (Tier 2 + Tier 3, in order):
1. docs/SESSION-CONTEXT.md (this file).
2. docs/HANDOFF-SESSION-104.md.
3. docs/HANDOFF-SESSION-103.md.

Pre-priority verifications (run BEFORE treating any priority as
authorized, per CLAUDE.md §"Planning conduct"):

For P1 (UI slice for O6.5 / O6.6 / O6.7):
- Shipped-artifact check (§"Pre-priority shipped-artifact verification"):
  `ls docs/slices/` for `S-PROTO-O6.5` / `O6.6` / `O6.7` /
  `quantitative-screens` directories → expect none.
- Spec-gate check (§"Pre-priority spec-gate verification"):
  Spec 65b §"The 3 new screens" defines screen content; no gating
  IF-clause. Verify AC scope respects §"What this does NOT cover"
  L333-343 (free numeric input out of scope, validation logic out of
  scope, etc.).
- Canvas-fidelity check (§"Pre-priority canvas-fidelity verification"):
  `ls docs/design-source/ | grep -i "pre-signup\|quantitative\|o6"`
  → user confirmed at session-104 wrap that no canvases exist;
  prototype slice ships with no `Linked canvas:` field. If canvases
  HAVE shipped between sessions, decode per
  `scripts/decode-bundler-canvas.sh` BEFORE AC-quoting.

For P2 (Desktop graceful enhancement, inherited):
- Shipped-artifact check:
  `ls src/components/help-rail/ 2>/dev/null` and
  `ls src/components/document-shell/ 2>/dev/null` → check existing
  scaffolds.
- Spec-gate check:
  `grep -rn "help.rail\|HelpRail" docs/workspace-spec/` → Help Rail
  spec ref pending per session-101 note. If no spec exists, scope a
  design phase BEFORE AC freeze.
- Canvas-fidelity check: TBD per Help Rail spec ref.

Confirm priority with user. SESSION-CONTEXT recommends P1 (UI slice
for the 3 new pre-signup screens) — completes the spec-65b user-
visible flow; the state shape + plan-engine hooks already landed in
session 104.
```

## Product positioning (preserve across sessions)

Decouple is the **complete settlement workspace for separating couples**. NOT a financial disclosure tool. NOT a Form E alternative. Tagline: *"Decouple — the complete picture."*

## Stack

Next.js 14 (app router) + TypeScript · Tailwind v4 via CSS variables · S-F1 token system at `src/styles/tokens.ts` (76 tokens) · Tink for bank connect · Anthropic SDK for AI extraction · Vercel previews per branch, production at `construct-dev.vercel.app`. Pre-signup-interview prototype: 8 canvas-as-source screens (O1-O8) on main with shared chassis primitives (TopBar / Hero / Footer) + density-entry + density-question + delight (spec-26 compliance) + output-reassurance + spec 65 §O7 *"Adaptive plan shape"* amendment + 4-dimension adaptive-plan impl + tone-pass on `build-plan.ts` + 14-finding cross-screen Tone audit Phase 1 + 42-string copy-resolver-completeness sweep + primaryCTA wire + invariant test (session 102, PR #200 merged as `d13bdcf`) + spec 65b §"Pre-signup quantitative layer" drafted (session 103) + **3 numeric-derived plan-output dimensions impl + paired spec 65b §AI-coach patch (session 104, PR #202 merged as `464b943`)**. **UI for the 3 new screens (O6.5 / O6.6 / O6.7) still pending — session 105 P1.**

## Branch

Session 105 branch: harness-suffixed off clean main, OR scope-named sub-branch (e.g. `claude/session-105-O6-quantitative-screens` for P1 scope).

## Negative constraints (preserve)

#1-#41 from prior sessions. **No new numbered constraints surfaced session 104.** Twenty-two scoping-discipline observations on recurrence-watch (3 new from session 104 — spec-citation-quote same-PR replacement edge case; sibling spec discrepancy batching; author-time stub missing test-description AC refs; all one-session-observed; promote to numbered constraint if a second session surfaces the same recurrence).

**Active pre-existing CI failures (carry forward):**

- None at session-104 wrap. Last CI run on `9ec06ff` was 25/25 green; merge clean. Spec-citation-quote gate behavior documented in recurrence-watch (second-session-observed).

## Scope ceiling

Session 105 is most likely **either P1 (UI slice for the 3 new pre-signup screens) or P2 (desktop graceful enhancement)** alone. P1 is Heavy (3 screens + state-wire + bucket pickers + skip/expansion mechanics) and is the recommended path. P2 is Heavy + spec-blocked pending Help Rail location. Out of scope unless explicitly added: post-signup work · Welcome Tour · Marketing Landing · Post-connect Dashboard · `Decouple.zip` unpacking · Mobile Screens v2 · authenticated-screens header work.

## Current pre-signup prototype URL

- Production: `https://construct-dev.vercel.app/dev/proto/pre-signup-interview`
- Per-PR preview: surfaced as Vercel comment on each PR.
- All 8 screens (O1-O8) canvas-as-source on main. All chassis primitives + density-entry + density-question + delight compliance + output-reassurance + 4-dimension adaptive plan all merged. Density + delight + output-reassurance audit findings closed (10 of 10). Cross-screen tone audit Phase 1 closed (14 of 14, session 101). Copy-resolver-completeness sweep + primaryCTA wire + invariant test merged on main (session 102, PR #200). Spec 65b drafted (session 103, PR #201). **Spec 65b's plan-engine layer landed (session 104, PR #202) — `Quantitative` type + 3 derive functions + cap-ordering composition all on main. UI for O6.5 / O6.6 / O6.7 still pending — session 105 P1.**
