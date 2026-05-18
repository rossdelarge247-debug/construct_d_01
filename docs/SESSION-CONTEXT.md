# Session 106 Pre-flight Context Block (carrying session 105 wrap delta)

## Session 105 wrap delta — read this first

Session 105 closed P1 from session-104's carry-forward — `S-PROTO-quantitative-screens`. UI slice (prototype category) shipping the 3 new pre-signup quantitative screens (O6.5 / O6.6 / O6.7) plus a Q-bridge transition screen between O6 and O6.5. Squash-merged to main as `64918d9` via PR #204.

**Slice deliverables:**

- `src/app/dev/proto/pre-signup-interview/screens/QuantBridge.tsx` + `O6_5.tsx` + `O6_6.tsx` + `O6_7.tsx` — 4 new screens wired into the dispatcher.
- `src/app/dev/proto/pre-signup-interview/components/BucketPicker.tsx` + `MultiPicker.tsx` + `ExpansionToggle.tsx` — 3 new shared components.
- `src/app/dev/proto/pre-signup-interview/page.tsx` — dispatcher switch extended for cases 7-12 (case 7 → QuantBridge, 8 → O6_5, 9 → O6_6, 10 → O6_7, 11 → O7, 12 → O8).
- `src/app/dev/proto/pre-signup-interview/lib/types.ts` — `SCREEN_COUNT = 12` added (internal step counter); `TOTAL_STEPS = 8` preserved (pill display max).
- `src/app/dev/proto/pre-signup-interview/lib/proto-context.tsx` — clamps now use `SCREEN_COUNT`.
- `tests/unit/proto-pre-signup/quantitative-screens-state-wire.test.tsx` — 11 component tests (full proto-pre-signup suite: 329 tests pass).
- `docs/slices/S-PROTO-quantitative-screens/{acceptance,verification}.md` — 11 ACs + 9 design decisions + auto-review responses (3 fixed + 6 deferred-with-reasoning) + DoD evidence.

**Branch at session 105 wrap:**

| Branch | Status |
|---|---|
| `claude/session-105-O6-quantitative-screens` | squash-merged via PR #204; tip `87be154` on the branch ≈ main `64918d9` (stale post-merge) |
| `claude/session-105-wrap` | wrap docs branch — handoff + SESSION-CONTEXT refresh |

**Detailed retro captured in `docs/HANDOFF-SESSION-105.md`** — 3 AskUserQuestion rounds (priority + partition+transition + pill-behavior); sibling-spec-discrepancy batching applied per session-104 retro lesson; 2 auto-review rounds (round 1 request-changes with 9 findings, round 2 nit-only after fixes); 3 new recurrence-watch entries (TDD-guard not category-aware · §Status awk-strip literal-§ requirement · PR-body-edit doesn't re-run all CI workflows); persona retain/drop verdict for the 4th `src/` slice rendered (all 4 active personas retained, prototype-readiness flagged as strong-retain).

**Persona findings:** `reviewer-prototype-readiness` caught 6 actionable issues main missed (5 WCAG-citable accessibility issues + 1 D-9 ac-gap suggestion). `reviewer-style` caught 2 simplicity nitpicks main missed (Skip button + update helper 3-way duplication). `reviewer-security` returned 1 informational note (data-classification flag for production-promotion). `reviewer-correctness` returned no findings this slice.

## Session 106 priorities — user picks scope

Session 105 closed P1; P2 (desktop graceful enhancement) inherited as carry-forward. Several new priorities surfaced from session 105 deferrals.

| # | Priority | Scope | Effort | Blocked? |
|---|---|---|---|---|
| 1 | **(New from session 105)** Preview-deploy hands-on review of the new quant screens | DoD-12 + DoD-14 closure: 6-dim rubric spot-check on Vercel preview (golden path + edge cases + reduced-motion + keyboard-only + mobile viewport 375×667 + screen-reader) | Light | No |
| 2 | **(Inherited from sessions 101-105)** Desktop graceful enhancement — Help Rail integration + intermediate breakpoints + extra-space utilisation above 480px | Heavy | Yes (Help Rail spec ref still pending — would need a scoping design phase before AC freeze) |
| 3 | **(New from session 105)** Address deferred items from S-PROTO-quantitative-screens if they accumulate | focus-visible CSS module · roving tabindex on BucketPicker · SkipScreenButton extraction · update-helper hook | Medium | No |
| 4 | **(New from session 105)** TDD-guard category-awareness fix | Hook should honor CLAUDE.md §"Slice categories" matrix and skip on prototype paths | Light | No (control-change-label slice) |
| 5 | **(New from session 105)** §Status awk-strip pattern fix | Either fix the awk regex or update CLAUDE.md to document `## §Status` as the required literal | Light | No (control-change-label slice) |

**Recommended:** P1 (preview-deploy hands-on review). Lightest follow-on; closes the remaining DoD rows for S-PROTO-quantitative-screens cleanly. Surfaces any UX/a11y issues that the prototype-readiness persona may have missed (e.g. visual regressions on mobile, screen-reader announcement quality). The Vercel preview URL for the merged tip is reachable at `construct-dev.vercel.app/dev/proto/pre-signup-interview`.

### P1 detail — Preview-deploy hands-on review (Light)

**Slice candidate:** No new slice needed; sign off the remaining `docs/slices/S-PROTO-quantitative-screens/verification.md` §"Preview-deploy verification" rows by updating `Status: PENDING` → `Status: ✓` with brief evidence per row.

**Rubric anchors:**

- `docs/workspace-spec/72a-preview-deploy-rubric.md` §"Dimensions" — 6 rows (golden path · edge cases · prefers-reduced-motion · keyboard-only · mobile viewport · screen-reader).
- `docs/slices/S-PROTO-quantitative-screens/verification.md` §"Preview-deploy verification" — the table to fill in.

**First actions at session start:**

1. Confirm Vercel preview URL: `construct-dev.vercel.app/dev/proto/pre-signup-interview` should now show the merged tip.
2. Walk the 6-dim rubric on the live preview, marking each row Status + Evidence.
3. Commit the verification.md update under a single doc-only commit; PR with `no-slice-required` label OR fold into a wrap commit.

### P2 detail — Desktop graceful enhancement (Heavy, blocked)

**Slice candidate:** TBD — Help Rail integration is the headline; spec ref still pending per sessions 101→102→103→104→105 carry-over.

**Spec anchors:**

- *(pending)* — locate or scope a Help Rail spec at session start.
- `src/components/document-shell/` — existing scaffold (3 files: DocumentShell.tsx + index.ts + types.ts).
- `docs/workspace-spec/71-rebuild-strategy.md` §4 — hexagonal architecture reference shape.

**First actions at session start:**

1. `grep -rn "help.rail\|HelpRail" docs/workspace-spec/` — locate Help Rail spec.
2. If no Help Rail spec, scope a design phase first before AC freeze (AskUserQuestion round on visual + interaction shape).

**Spec-gate check:** Help Rail spec absent at session-105 wrap; pre-condition unchanged from session-104 carry-forward.

### P3 detail — Quant-screens polish (Medium)

**Slice candidate:** `S-PROTO-quantitative-screens-polish`. Bundles the 4 deferred items from session 105 auto-review:

- `:focus-visible` CSS module + className refactor on BucketPicker / MultiPicker / ExpansionToggle / Skip buttons.
- Roving tabindex on BucketPicker (or migrate to native `<input type='radio'>` in fieldset/legend).
- `SkipScreenButton.tsx` extraction (single component, 3 call sites collapse to 1-line each).
- `useQuantitativeUpdate` hook or module-level helper (3 call sites collapse).

Triggers naturally if a 4th quant screen ships. Otherwise can ship as cleanup whenever convenient.

### P4 + P5 detail — Rigour hook fixes (Light each)

**P4:** Add prototype category-awareness to `.claude/hooks/tdd-first-every-commit.sh`. Re-use the path-detection pattern already documented in `docs/workspace-spec/76-prototype-mode-rigour.md` §3 (path-default `src/app/dev/proto/<literal-slug>/**` → prototype). Hook should skip the gate when ALL staged src/ paths are prototype-category. Control-change label required.

**P5:** Fix `.claude/hooks/comment-review.sh` awk pattern OR update CLAUDE.md §"Hard controls" §"Comments: WHY not WHAT" to document that the §Status footer exemption requires the literal `## §Status` header (with §). Two paths:

- Doc-only fix: update CLAUDE.md to clarify the literal-§ requirement. Trivial.
- Hook fix: change `/^## §?Status/` to `/^## (§ )?Status/` or `/^## (§)?Status/`. Test with `awk` to confirm cross-platform behavior.

Either path needs control-change label.

## Scoping-discipline observations carried as recurrence-watch (25 items)

**Session 105 applied:**

- Verify before planning — pre-priority verifications (shipped-artifact, spec-gate, canvas-fidelity) all cleared at turn 0.
- Sibling-spec-discrepancy batching — 4 sibling discrepancies (D-5/D-6/D-7/D-9) surfaced at AC scoping rather than at PR-review time. Session-104 retro lesson worked as prevention.
- Plan-vs-spec cross-check — re-read spec 65b §"The 3 new screens" + §"Progressive expansion mechanics" verbatim before AC freeze; no paraphrase drift.

**New observations this session (one-session-observed; promote to numbered constraint if a second session repeats):**

- **TDD-guard hook not category-aware.** `.claude/hooks/tdd-first-every-commit.sh` blocks any src/ commit without tests/ co-commit regardless of slice category. CLAUDE.md §"Slice categories" §"prototype" matrix says "TDD-guard skips" for prototype, but the hook doesn't honor that. Workaround: add a meaningful test assertion alongside the src/ change.
- **`§Status` awk-strip works only with literal `## §Status`, not `## Status`.** CLAUDE.md documents the exemption pattern as `^## §?Status` (§ optional). Testing in session 105 confirmed `## Status` does NOT match `^## §?Status` due to awk's multi-byte-char `?` quantifier quirk. Workaround: use `## §Status` (with § prefix) explicitly. Doc-vs-impl mismatch.
- **PR body edits don't re-run all CI workflows.** Workflows triggered on `pull_request:opened/synchronize` (e.g. pr-dod.yml) don't fire on `pull_request:edited`. Body-only fixes for CI-readable PR-body checks create a misleading state where the stale failure stays in the check-runs list alongside the new success.

**Second-session-observed (was new in session 104, repeated session 105 in the prevention shape; promote to numbered constraint at session 107 if a third session demonstrates the pattern):**

- **Sibling-spec-discrepancy batching at AC freeze.** Session 104 surfaced as a missed-opportunity (D6 property_equity silently-decided); session 105 applied as prevention (D-5/D-6/D-7/D-9 group surfaced and silent-decided at AC scoping, before any PR-review round). Pattern works; needs one more session demonstrating it to promote.

**Carried unchanged from session 104:**

- `spec-citation-quote` gate's same-PR replacement edge case (one-session-observed → no recurrence; stays one-session)
- Author-time comment-review stub doesn't catch AC refs in test `describe` strings (one-session-observed → did not surface session 105; the "test descriptions are behavioural" guidance applied)
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
- Spec-only sessions don't increment v3b persona retain/drop counter (from session 103; one-session-observed)

**Second-session-observed (carried from session 103):**

- `spec-citation-quote` author-time stub vs CI gate strictness — DID NOT recur this session. Stays second-session-observed; could downgrade if session 106 also stays clean.

## Authoritative reading order at session 106 start

1. This file (you are here).
2. `docs/HANDOFF-SESSION-105.md` (session 105's retro — P1 ship + auto-review responses + persona retain/drop verdict).
3. `docs/HANDOFF-SESSION-104.md` (session 104's retro — plan-engine hooks shipped; useful context for the now-completed spec-65b user-visible flow).
4. **For P1 (preview-deploy review):** `docs/workspace-spec/72a-preview-deploy-rubric.md` for the 6-dim rubric; `docs/slices/S-PROTO-quantitative-screens/verification.md` §"Preview-deploy verification" for the table to fill in.
5. **For P2 (desktop graceful enhancement):** Help Rail spec ref pending — locate or scope at session start.
6. **For P3/P4/P5:** session-105 HANDOFF §"Next session priorities" + the relevant hook/file paths therein.

## Session 106 kickoff prompt (paste-ready)

```
Kick off session 106.

Read this file (SESSION-CONTEXT.md) first.

Turn-0 verification:
- SessionStart hook surfaces live branch state.
- Branch convention: harness-suffixed off clean main, OR scope-named
  sub-branch (e.g. claude/session-106-preview-deploy-review for P1).
- Session 105 wrap squash-merged P1 as `64918d9` on main. Verify
  state via `git log --oneline origin/main | head -3` if uncertain.
- If the harness landed you on a different base, follow CLAUDE.md
  §"Branch-resume check": git fetch / git checkout -B.

Read at session start (Tier 2 + Tier 3, in order):
1. docs/SESSION-CONTEXT.md (this file).
2. docs/HANDOFF-SESSION-105.md.
3. docs/HANDOFF-SESSION-104.md.

Pre-priority verifications (run BEFORE treating any priority as
authorized, per CLAUDE.md §"Planning conduct"):

For P1 (preview-deploy hands-on review):
- Shipped-artifact check: `grep -c "PENDING" docs/slices/S-PROTO-quantitative-screens/verification.md`
  → expect 4 (DoD-12 + DoD-14 row group). If zero, P1 is already
  closed by a prior session; pick a different priority.
- Vercel preview check: confirm preview URL is reachable for the
  current main tip — Vercel may have garbage-collected branch
  previews; production URL `construct-dev.vercel.app/dev/proto/pre-signup-interview`
  is the fallback.

For P2 (desktop graceful enhancement, inherited):
- Spec-gate check:
  `grep -rn "help.rail\|HelpRail" docs/workspace-spec/` → Help Rail
  spec ref still pending. If no spec exists, scope a design phase
  BEFORE AC freeze.

For P3 (quant-screens polish):
- Shipped-artifact check: `ls docs/slices/ | grep quant-polish` →
  expect none.
- Trigger check: only worth doing if a 4th quant screen is in
  scope, OR as scheduled cleanup. Confirm with user.

For P4/P5 (rigour hook fixes):
- Both are control-change-label slices. Surface to user as
  small/light cleanup options.

Confirm priority with user. SESSION-CONTEXT recommends P1
(preview-deploy hands-on review) — closes the remaining DoD rows
for the slice shipped this turn.
```

## Product positioning (preserve across sessions)

Decouple is the **complete settlement workspace for separating couples**. NOT a financial disclosure tool. NOT a Form E alternative. Tagline: *"Decouple — the complete picture."*

## Stack

Next.js 14 (app router) + TypeScript · Tailwind v4 via CSS variables · S-F1 token system at `src/styles/tokens.ts` (76 tokens) · Tink for bank connect · Anthropic SDK for AI extraction · Vercel previews per branch, production at `construct-dev.vercel.app`. Pre-signup-interview prototype: **12 screens** on main (O1-O8 + Q-bridge + O6.5 + O6.6 + O6.7) with shared chassis primitives (TopBar / Hero / Footer) + density-entry + density-question + delight (spec-26 compliance) + output-reassurance + 4-categorical-dim + 3-quantitative-dim adaptive plan + tone-pass + 14-finding cross-screen tone audit Phase 1 + 42-string copy-resolver-completeness sweep + primaryCTA wire + invariant test (session 102, PR #200) + spec 65b drafted (session 103, PR #201) + plan-engine hooks for 3 numeric-derived dimensions (session 104, PR #202) + **UI for the 3 new pre-signup screens + Q-bridge (session 105, PR #204 merged as `64918d9`)**. The spec-65b user-visible flow is now complete on main.

## Branch

Session 106 branch: harness-suffixed off clean main, OR scope-named sub-branch (e.g. `claude/session-106-preview-deploy-review` for P1 scope).

## Negative constraints (preserve)

#1-#41 from prior sessions. **No new numbered constraints surfaced session 105.** Twenty-five scoping-discipline observations on recurrence-watch (3 new from session 105 — TDD-guard not category-aware; §Status awk-strip literal-§ requirement; PR-body-edit doesn't re-run all CI workflows; all one-session-observed). One second-session-observed pattern (sibling-spec-discrepancy batching) ready for promotion at session 107 if confirmed.

**Active pre-existing CI failures (carry forward):**

- None at session-105 wrap. Final auto-review on `87be154` was nit-only (all advisory; no actionable issues). All 24 / 25 active CI checks green on the latest tip; 1 stale failure entry from the pre-PR-body-update run was superseded by the post-update success.

## Scope ceiling

Session 106 is most likely **either P1 (preview-deploy review — Light), P2 (desktop graceful enhancement — Heavy + blocked), P3 (quant polish — Medium), or P4+P5 (rigour hook fixes — Light each)**. P1 is the recommended path — closes the DoD rows for the slice shipped session 105 cleanly. P4 + P5 could be bundled if the user wants a small control-change-label cleanup round. Out of scope unless explicitly added: post-signup work · Welcome Tour · Marketing Landing · Post-connect Dashboard · `Decouple.zip` unpacking · Mobile Screens v2 · authenticated-screens header work.

## Current pre-signup prototype URL

- Production: `https://construct-dev.vercel.app/dev/proto/pre-signup-interview`
- Per-PR preview: surfaced as Vercel comment on each PR.
- All 12 screens (O1-O8 + Q-bridge + O6.5 + O6.6 + O6.7) on main. Shared chassis primitives + density-entry + density-question + delight compliance + output-reassurance + 4-categorical + 3-quantitative adaptive plan all merged. Density + delight + output-reassurance audit findings closed (10 of 10). Cross-screen tone audit Phase 1 closed (14 of 14, session 101). Copy-resolver-completeness sweep + primaryCTA wire + invariant test merged (session 102, PR #200). Spec 65b drafted (session 103, PR #201). Spec 65b plan-engine layer landed (session 104, PR #202). **UI for the 3 new pre-signup screens + Q-bridge merged session 105, PR #204 as `64918d9` — the spec-65b user-visible flow is now complete on main.**
