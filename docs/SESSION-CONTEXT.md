# Session 107 Pre-flight Context Block (carrying session 106 wrap delta)

## Session 106 wrap delta — read this first

Session 106 closed P4 + P5 from session-105's priority list — `S-INFRA-rigour-hook-fixes-prototype-aware`. Infrastructure slice (control-change category) shipping two prototype-awareness fixes to existing hooks. Squash-merged to main as `2a72185` via PR #207.

**Slice deliverables:**

- `.claude/hooks/tdd-first-every-commit.sh` — prototype path-default skip via regex `^src/app/dev/proto/[^/[]+/.+\.(ts|tsx)$` (mirrors tdd-guard.sh L85 verbatim).
- `.claude/hooks/comment-review.sh` — §Status awk regex changed from `/^## §?Status/` to `/^## (§)?Status/` (groups the multi-byte UTF-8 sequence so the `?` quantifier applies to the whole group).
- `docs/workspace-spec/76-prototype-mode-rigour.md` §2 L41 + §6 L84 — implementation lists add `tdd-first-every-commit.sh` (constraint #38 sweep-discipline self-application).
- `CLAUDE.md` L281 — Sweep-discipline paragraph implementing-files list adds the hook.
- `tests/shellspec/tdd-first-every-commit.spec.sh` + `comment-review.spec.sh` — +5 new It blocks total. 37/37 examples pass at CI.
- `docs/slices/S-INFRA-rigour-hook-fixes-prototype-aware/{acceptance,verification,security}.md` — full slice docs.

**Branch at session 106 wrap:**

| Branch | Status |
|---|---|
| `claude/session-106-hook-fixes` | squash-merged via PR #207; tip `5fce092` ≈ main `2a72185` (stale post-merge) |
| `claude/session-106-wrap` | wrap docs branch — handoff + SESSION-CONTEXT refresh |

**Detailed retro captured in `docs/HANDOFF-SESSION-106.md`** — 0 AskUserQuestion rounds (slice scope unambiguous from kickoff); 2 auto-review rounds (round 1 request-changes with 4 non-blocking findings, round 2 approve after fix-commit); 3 new recurrence-watch entries (bracket-glob shellspec gotcha · indented-blockquote escape via doc-pointer · AC-vs-impl-path drift); 2 prior recurrence-watch entries RESOLVED by this slice (TDD-guard not category-aware · §Status awk-strip literal-§ requirement); persona retain/drop verdicts unchanged — `reviewer-correctness` upgraded to **strong retain** based on this slice's 4/4 main-missed catches.

**Persona findings:** `reviewer-correctness` caught 4 actionable ac-gap issues main missed (scenario 4 test missing · AC-1 path drift · In scope mis-reference · ac-gap re-naming). `reviewer-style` caught 1 WHAT-narration comment line in `.claude/hooks/tdd-first-every-commit.sh`. `reviewer-security` returned 0 findings. UI personas (`ux-polish-reviewer`, `reviewer-prototype-readiness`) dormant — infrastructure slice has no UI surface.

## Session 107 priorities — user picks scope

**P1 DEFERRED (session 107 in-session decision).** Per-prototype-slice rubric exercises (reduced-motion · mobile viewport · screen-reader · console-error check) defer to a single system-wide accessibility + responsive + SR pass post-prototype-lock-down. Reasoning: prototype journeys still in flux; interest-payment quality work compounds badly when applied per-slice across an iterating prototype. Future prototype slices' DoD-4 (preview-deploy verification) + DoD-14 (rubric) inherit this deferral by reference. Wrap will fully refresh SESSION-CONTEXT for session 108.

**P3 active.** `S-PROTO-quantitative-screens-polish` — bundles all 4 deferred items from session 105 auto-review (focus-visible · roving tabindex · SkipScreenButton extract · useQuantitativeUpdate helper).

Session 106 closed P4 + P5; session 107 follows on with P3 polish after deferring P1.

| # | Priority | Scope | Effort | Blocked? |
|---|---|---|---|---|
| 1 | **(Inherited from session 105)** Preview-deploy hands-on review of the quant screens | DoD-12 + DoD-14 closure: 6-dim rubric spot-check on Vercel preview (golden path + edge cases + reduced-motion + keyboard-only + mobile viewport 375×667 + screen-reader) | Light | No |
| 2 | **(Inherited from sessions 101-106)** Desktop graceful enhancement — Help Rail integration + intermediate breakpoints + extra-space utilisation above 480px | Heavy | Yes (Help Rail spec ref still pending — would need a scoping design phase before AC freeze) |
| 3 | **(Inherited from session 105)** Quant-screens polish — focus-visible CSS module · roving tabindex on BucketPicker · SkipScreenButton extraction · update-helper hook | Medium | No |

**Active:** P3 (quant-screens polish). P1 deferred this session per note above; wrap will refresh recommendation for session 108.

### P1 detail — Preview-deploy hands-on review (Light)

**Slice candidate:** No new slice needed; sign off the remaining `docs/slices/S-PROTO-quantitative-screens/verification.md` §"Preview-deploy verification" rows by updating `Status: PENDING` → `Status: ✓` with brief evidence per row.

**Rubric anchors:**

- `docs/workspace-spec/72a-preview-deploy-rubric.md` §"Dimensions" — 6 rows (golden path · edge cases · prefers-reduced-motion · keyboard-only · mobile viewport · screen-reader).
- `docs/slices/S-PROTO-quantitative-screens/verification.md` §"Preview-deploy verification" — the table to fill in.

**First actions at session start:**

1. Confirm Vercel preview URL: `construct-dev.vercel.app/dev/proto/pre-signup-interview` should show the merged tip.
2. Walk the 6-dim rubric on the live preview, marking each row Status + Evidence.
3. Commit the verification.md update under a single doc-only commit; PR with `no-slice-required` label OR fold into a wrap commit.

### P2 detail — Desktop graceful enhancement (Heavy, blocked)

**Slice candidate:** TBD — Help Rail integration is the headline; spec ref still pending per sessions 101→106 carry-over.

**Spec anchors:**

- *(pending)* — locate or scope a Help Rail spec at session start.
- `src/components/document-shell/` — existing scaffold (3 files: DocumentShell.tsx + index.ts + types.ts).
- `docs/workspace-spec/71-rebuild-strategy.md` §4 — hexagonal architecture reference shape.

**First actions at session start:**

1. `grep -rn "help.rail\|HelpRail" docs/workspace-spec/` — locate Help Rail spec.
2. If no Help Rail spec, scope a design phase first before AC freeze (AskUserQuestion round on visual + interaction shape).

**Spec-gate check:** Help Rail spec absent at session-106 wrap; pre-condition unchanged from session-105 carry-forward.

### P3 detail — Quant-screens polish (Medium)

**Slice candidate:** `S-PROTO-quantitative-screens-polish`. Bundles the 4 deferred items from session 105 auto-review:

- `:focus-visible` CSS module + className refactor on BucketPicker / MultiPicker / ExpansionToggle / Skip buttons.
- Roving tabindex on BucketPicker (or migrate to native `<input type='radio'>` in fieldset/legend).
- `SkipScreenButton.tsx` extraction (single component, 3 call sites collapse to 1-line each).
- `useQuantitativeUpdate` hook or module-level helper (3 call sites collapse).

Triggers naturally if a 4th quant screen ships. Otherwise can ship as cleanup whenever convenient.

## Scoping-discipline observations carried as recurrence-watch (26 items)

**Session 106 applied:**

- Verify before planning — pre-priority verifications (spec-gate for AC-1 + AC-2, shipped-artifact for slice folder) all cleared at turn 0.
- Quote, don't paraphrase — verbatim quotes from spec 76 §2 + CLAUDE.md §"Hard controls" at AC scoping; no paraphrase drift.
- Plan-vs-spec cross-check — re-read spec 76 §2 path-default-skip pattern + CLAUDE.md §Status exemption rule verbatim before AC freeze.

**New observations this session (one-session-observed; promote to numbered constraint if a second session repeats):**

- **Bracket-glob shellspec gotcha.** `The stderr should match pattern '*[slug]*'` interprets `[slug]` as a glob char class (matches 's'/'l'/'u'/'g' as single chars). Use `should include 'src/app/dev/proto/[slug]/page.tsx'` for paths with `[` or `]`.
- **Indented-blockquote escape via doc-pointer.** `scripts/spec-citation-quote-check.sh` requires column-0 `^>` for the proximity-quote check. Indented blockquotes under list items fail. Fix per script's own escape (line 118 suggestion): rephrase trigger as doc-pointer ("spec NN §X states:" not "per spec NN §X:") and keep verbatim italic quote inline.
- **AC-vs-impl-path drift.** Naming a test file in AC §Evidence text before the file is written invites `ac-gap` auto-review findings if the actual file ends up named differently. Write AC evidence paths after the test file is created, or use generic phrasing until it exists.

**RESOLVED session 106** (no longer on watch — fixed by this slice's deliverables):

- ~~TDD-guard hook not category-aware~~ — fixed by AC-1.
- ~~`§Status` awk-strip works only with literal `## §Status`, not `## Status`~~ — fixed by AC-2.

**Second-session-observed (was new in session 104, repeated session 105 in the prevention shape; sessions 106 did not exercise the multi-screen AC freeze pattern, so neither promoted nor reset; promote to numbered constraint at session 107+ if a third session demonstrates the prevention shape):**

- **Sibling-spec-discrepancy batching at AC freeze.** Session 104 surfaced as a missed-opportunity (D6 property_equity silently-decided); session 105 applied as prevention (D-5/D-6/D-7/D-9 group surfaced and silent-decided at AC scoping, before any PR-review round); session 106 did not exercise (single-spec slice).

**Second-session-observed promotion eligible (carried from session 103, now repeated at session 106):**

- **`spec-citation-quote` author-time stub vs CI gate strictness.** Session 103 surfaced this; session 106 confirmed it again (3 acceptance.md hits caught at CI not at author-time hook). Now second-session-observed; promote to numbered constraint at session 107+ if a third session demonstrates the same author-time-stub-misses pattern.

**Carried unchanged from session 105:**

- PR body edits don't re-run all CI workflows (one-session-observed; did not recur session 106 since no PR-body-only edits made)

**Carried unchanged from session 104:**

- `spec-citation-quote` same-PR replacement edge case (one-session-observed → no recurrence; stays one-session)
- Author-time comment-review stub doesn't catch AC refs in test `describe` strings (one-session-observed → did not surface sessions 105 or 106)
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

## Authoritative reading order at session 107 start

1. This file (you are here).
2. `docs/HANDOFF-SESSION-106.md` (session 106's retro — P4+P5 ship + 2 prior recurrence-watch resolved + 3 new observations).
3. `docs/HANDOFF-SESSION-105.md` (session 105's retro — quant screens ship; useful context for P1 since P1 closes that slice's DoD).
4. **For P1 (preview-deploy review):** `docs/workspace-spec/72a-preview-deploy-rubric.md` for the 6-dim rubric; `docs/slices/S-PROTO-quantitative-screens/verification.md` §"Preview-deploy verification" for the table to fill in.
5. **For P2 (desktop graceful enhancement):** Help Rail spec ref pending — locate or scope at session start.
6. **For P3:** session-105 HANDOFF §"Next session priorities" + the relevant file paths therein.

## Session 107 kickoff prompt (paste-ready)

```
Kick off session 107.

Read this file (SESSION-CONTEXT.md) first.

Turn-0 verification:
- SessionStart hook surfaces live branch state.
- Branch convention: harness-suffixed off clean main, OR scope-named
  sub-branch (e.g. claude/session-107-preview-deploy-review for P1).
- Session 106 wrap squash-merged P4+P5 as `2a72185` on main. Verify
  state via `git log --oneline origin/main | head -3` if uncertain.
- If the harness landed you on a different base, follow CLAUDE.md
  §"Branch-resume check": git fetch / git checkout -B.

Read at session start (Tier 2 + Tier 3, in order):
1. docs/SESSION-CONTEXT.md (this file).
2. docs/HANDOFF-SESSION-106.md.
3. docs/HANDOFF-SESSION-105.md.

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

Confirm priority with user. SESSION-CONTEXT recommends P1
(preview-deploy hands-on review) — closes the remaining DoD rows
for the slice shipped session 105.
```

## Product positioning (preserve across sessions)

Decouple is the **complete settlement workspace for separating couples**. NOT a financial disclosure tool. NOT a Form E alternative. Tagline: *"Decouple — the complete picture."*

## Stack

Next.js 14 (app router) + TypeScript · Tailwind v4 via CSS variables · S-F1 token system at `src/styles/tokens.ts` (76 tokens) · Tink for bank connect · Anthropic SDK for AI extraction · Vercel previews per branch, production at `construct-dev.vercel.app`. Pre-signup-interview prototype: **12 screens** on main (O1-O8 + Q-bridge + O6.5 + O6.6 + O6.7) with shared chassis primitives (TopBar / Hero / Footer) + density-entry + density-question + delight (spec-26 compliance) + output-reassurance + 4-categorical-dim + 3-quantitative-dim adaptive plan + tone-pass + 14-finding cross-screen tone audit Phase 1 + 42-string copy-resolver-completeness sweep + primaryCTA wire + invariant test (session 102, PR #200) + spec 65b drafted (session 103, PR #201) + plan-engine hooks for 3 numeric-derived dimensions (session 104, PR #202) + UI for the 3 new pre-signup screens + Q-bridge (session 105, PR #204 merged as `64918d9`). Two existing hooks prototype-awareness-fixed session 106 (PR #207 merged as `2a72185`). The spec-65b user-visible flow is now complete on main; the rigour-rig is now consistent on category-awareness across the hook surface.

## Branch

Session 107 branch: harness-suffixed off clean main, OR scope-named sub-branch (e.g. `claude/session-107-preview-deploy-review` for P1 scope).

## Negative constraints (preserve)

#1-#41 from prior sessions. **No new numbered constraints surfaced session 106.** Twenty-six scoping-discipline observations on recurrence-watch (3 new session 106 — bracket-glob shellspec gotcha; indented-blockquote escape via doc-pointer; AC-vs-impl-path drift; all one-session-observed). Two prior watch entries RESOLVED session 106 (TDD-guard category-awareness · §Status awk-strip). Two second-session-observed patterns (sibling-spec-discrepancy batching; spec-citation-quote stub-vs-CI strictness) eligible for promotion at session 107+ if confirmed.

**Active pre-existing CI failures (carry forward):**

- None at session-106 wrap. Final auto-review on `5fce092` was approve (all 3 specialists green). All 25 / 25 active CI checks green on the latest tip.

## Scope ceiling

Session 107 is most likely **either P1 (preview-deploy review — Light), P2 (desktop graceful enhancement — Heavy + blocked), or P3 (quant polish — Medium)**. P1 is the recommended path — closes the DoD rows for the slice shipped session 105 cleanly. Out of scope unless explicitly added: post-signup work · Welcome Tour · Marketing Landing · Post-connect Dashboard · `Decouple.zip` unpacking · Mobile Screens v2 · authenticated-screens header work.

## Current pre-signup prototype URL

- Production: `https://construct-dev.vercel.app/dev/proto/pre-signup-interview`
- Per-PR preview: surfaced as Vercel comment on each PR.
- All 12 screens (O1-O8 + Q-bridge + O6.5 + O6.6 + O6.7) on main. Shared chassis primitives + density-entry + density-question + delight compliance + output-reassurance + 4-categorical + 3-quantitative adaptive plan all merged. Density + delight + output-reassurance audit findings closed (10 of 10). Cross-screen tone audit Phase 1 closed (14 of 14, session 101). Copy-resolver-completeness sweep + primaryCTA wire + invariant test merged (session 102, PR #200). Spec 65b drafted (session 103, PR #201). Spec 65b plan-engine layer landed (session 104, PR #202). UI for the 3 new pre-signup screens + Q-bridge merged session 105, PR #204 as `64918d9` — the spec-65b user-visible flow is complete on main. Two hook fixes (prototype path-default + §Status awk) merged session 106, PR #207 as `2a72185`.
