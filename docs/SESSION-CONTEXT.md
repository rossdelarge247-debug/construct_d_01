# Session 97 Pre-flight Context Block (carrying session 96 wrap delta)

## Session 96 wrap delta — read this first

Session 96 closed the density/delight audit-loop to **8 of 10** findings via three substantive ships + a deep cross-spec design assessment that surfaced architectural conflicts on the remaining two findings.

**Three PRs merged:**

- **PR #175 (`05ba359`).** Walk-and-merge for the F-DEL batch — verification.md populated with comprehensive pre-walk 6+1 evidence across all six dims (golden path · edge cases · prefers-reduced-motion · keyboard-only · 375×667 mobile · screen reader). AC-6 + DoD-12 flipped to ticked. Admin-bypass merged per the prototype convention. Closes F-DEL-01 + F-DEL-02 + F-DEL-03.
- **PR #177 (`2b1a02a`).** Audit-row §Status flip — docs-only PR adding `## Status` section to the audit slice's acceptance.md with merge sha + PR refs for all 10 findings. Uses §Status hook exemption so PR/sha lineage refs are durable in lineage-purpose sections. Closes the audit-lineage gap.
- **PR #178 (`c2e2633`).** F-OUT-03 reassurance copy — new `Reassurance` component inline in O7.tsx, wired between `PersonalisedNotes` and `Footer` in `MobileReadyView` at `staggerIndex={7}`. V1 verbatim (`docs/v1/v1-wireframes.md` L301): *"You've built a strong starting position."* 2 unit tests (presence + document-order positioning); 557/557 vitest green; AC-6 pre-walk evidence populated. Closes F-OUT-03.

**F-OUT-01 + F-OUT-02 explicitly deferred** per a cross-spec design conflict surfaced at scoping time. The audit's V1-baseline framing assumed V1's Tier 1-4 plan output framework was a gap in reconciled spec 65; deep assessment showed it was **dropped intentionally** in reconciliation, with spec 67 §Gap 1 choosing a routing-not-grading post-signup architecture instead. Quoted verbatim in PR #178's acceptance.md §"Scope-conflict context". Both findings need spec 65 amendment work before slice-ready.

**Diagnosis trail durably captured in `docs/HANDOFF-SESSION-96.md`** — read for the cross-spec assessment workflow (~15 min of targeted reading produced the conflict surfacing), the npm-audit-tolerated-as-durable-carve-out anti-pattern observation (user-prompted at "why are we allowing this"), and two new recurrence-watch items.

**Net diff vs main this session:** ~140 lines of impl + ~280 lines of slice docs + ~190 lines of wrap docs (this file + HANDOFF-96). Three squash-merges + one wrap PR.

## Session 97 priorities — user picks scope

| # | Priority | Scope | Effort | Blocked? |
|---|---|---|---|---|
| 1 | **`S-INFRA-npm-audit-cleanup`** | Small slice; run `npm audit fix` (non-breaking per audit hint) to resolve protobufjs transitive; verify production build stays green; ship clean lockfile. Removes one noisy CI gate from future PRs. | Light (~15-20 min) | No |
| 2 | **Audit-text amendment** | Small docs PR amending the audit slice to reframe F-OUT-01..02 from "V1-gap" to "spec-65/67 conflict". Updates the §Status table to mark them as `blocked: spec amendment required`. Closes the audit-spec-conflict gap surfaced session 96. | Light (~20 min) | No |
| 3 | **Spec 65 amendment for F-OUT-01 + F-OUT-02 (scaffold + AC)** | Heavier; needs cross-spec design work on (a) whether pre-signup O7 needs adaptive tier framework at all, (b) what confidence-derivation source spec 67 will eventually use, (c) pre/post-signup vocab autonomy. Multi-session candidate. Session 97 likely ships scaffold + AC list; impl next. | Medium (~45-60 min for scaffold/AC) | No |
| 4 | **Tone audit Phase 1** | Alternative direction. Structural review on O1-O8 copy + visual treatments + emotional calibration vs CLAUDE.md "warm hand on a cold day" + spec 65 per-screen tone notes. Sibling to density/delight audit; different lens. Generates a downstream impl batch. | Light-medium (~30-45 min) | No |
| 5 | **Desktop graceful enhancement** | `docs/design-source/pre-signup-interview/desktop/Desktop Enhanced - Help Rail - Standalone.html`. Help Rail integration + intermediate breakpoints + extra-space utilisation above 480px mobile cap. Mobile chassis fully stable post-session-96. | Heavy | No |
| 6 | **(Inherited)** spec-citation-quote-check author-time hook | Light | No |
| 7 | **(Inherited)** Comment-review hook §Status exemption fix | Light (already working — verified session 96) | No |
| 8 | **(Inherited)** Comment-review hook CSS-files regex tightening | Light | No |
| 9 | **(Inherited)** Spec 65 amendment for quantitative profiling data | Heavy | No |

**Recommended sequence:** P1 (npm-audit cleanup — removes CI noise + tightens security) → P2 (audit-text amendment — closes audit-spec-conflict gap) as low-effort openers that pair well within one session. Then P3 or P4 depending on user appetite for spec amendment vs new audit work.

## Scoping-discipline observations carried as recurrence-watch (not yet numbered constraints)

- **AC-impl cross-check at impl-time** (introduced session 90) — applied successfully session 96 on PR #178 (every AC traced to in-tree evidence pre-push; verbatim quote sources verified).
- **Sibling-wrapper diff at impl-time** (carried session 88) — N/A session 96.
- **Shared-infrastructure audit at refactor-time** (carried session 87) — N/A session 96.
- **In-PR scope-expansion confirmation gate** (carried session 87) — applied implicitly when F-OUT batch narrowed to F-OUT-03 only; user-confirmed Path A at scope-decision moment.
- **`git push --force` after amend** (carried session 91) — not triggered session 96.
- **verification.md PARTIAL internal contradiction** (carried session 93) — N/A session 96 (verification.md update was a status-flip on PR #175 + a fresh-write on PR #178).
- **Read-cap accumulation during sweep cycles** (carried session 93) — not surfaced session 96. Read budget on the deep cross-spec assessment was ~130 lines combined; well within cap.
- **Single-lens audit framing** (carried session 94) — N/A session 96.
- **Pre-existing provenance opportunistic cleanup at paragraph rewrite** (carried session 94) — applied: the comment-review hook flagged fresh "session-22" + "session 95" provenance introductions inline; removed before commit.
- **NEW session 96 — Audit findings need active-spec cross-reference at audit time.** When cataloguing findings as gaps vs a baseline (V1, prior canvas, prior spec), audit slice authors should pre-check whether the active spec suite (sessions 23+) deliberately dropped or reframed the baseline element before listing it as a "gap". Surfaced when F-OUT-01..02 framing assumed V1 baseline rather than spec 65 §O7 reconciliation decision. Promotion threshold: a second audit slice ships finding-as-gap framing where deep assessment surfaces "spec deliberately chose otherwise".
- **NEW session 96 — Pre-existing CI noise should be queued, not deferred indefinitely.** The kickoff's "negative constraint" mechanism (`npm audit` + `spec-citation-quote-check` declared as non-blockers) was used across many sessions without queueing follow-up cleanup work. Both checks fail with addressable underlying causes. Promotion threshold: a third session declaring the same pre-existing CI failure as non-blocker without queueing actual remediation.

## Authoritative reading order at session 97 start

1. This file (you are here).
2. `docs/HANDOFF-SESSION-96.md` (session 96's retro — three shipped PRs + cross-spec assessment workflow + two new recurrence-watch items).
3. `docs/HANDOFF-SESSION-95.md` (session 95's retro — F-DEN batches + F-DEL slice scaffolds).
4. **For P1 (npm-audit cleanup):** read `.github/workflows/ci.yml` L185-205 (npm audit job def) + `npm audit --omit=dev --audit-level=high` local output. Verify `npm audit fix` is genuinely non-breaking for protobufjs before commit.
5. **For P2 (audit-text amendment):** read `docs/slices/S-PROTO-pre-signup-density-delight-audit/acceptance.md` §F-OUT-01 + §F-OUT-02 + the new §Status section. The amendment reframes the "Effect:" paragraphs in F-OUT-01..02 to acknowledge the spec 65/67 conflict + updates §Status rows to `blocked: spec amendment required`.
6. **For P3 (spec 65 amendment scaffold):** read spec 65 §O7 (L138-148) + spec 67 §Distribution (L14-83) + §Gap 1 (L84-122) + spec 34 §Tier 1-3 (L188-237) before drafting amendment scope.

## Session 97 kickoff prompt (paste-ready)

```
Kick off session 97.

Read this file (SESSION-CONTEXT.md) first.

Turn-0 verification:
- SessionStart hook surfaces live branch state.
- Branch convention: harness-suffixed (claude/<scope>-XXXXX) OR
  per-batch sub-branch off latest main.
- Session 96 shipped 3 PRs (#175, #177, #178) + session-96 wrap PR;
  HANDOFF-96 captures the cross-spec design conflict that deferred
  F-OUT-01 + F-OUT-02.
- If the harness landed you on a different base, follow CLAUDE.md
  §"Branch-resume check": git fetch origin main → git checkout -B
  <branch> origin/main.

Read at session start (Tier 2 + Tier 3, in order):
1. docs/SESSION-CONTEXT.md (this file).
2. docs/HANDOFF-SESSION-96.md.
3. docs/HANDOFF-SESSION-95.md (if context on prior F-DEN/F-DEL batches needed).
4. For P1 (npm-audit cleanup): .github/workflows/ci.yml L185-205 + local audit output.
5. For P2 (audit-text amendment): audit slice §F-OUT-01..02 + §Status.
6. For P3 (spec 65 amendment scaffold): spec 65 §O7 + spec 67 §Distribution + §Gap 1.

Confirm priority with user. SESSION-CONTEXT recommends P1 (npm-audit
cleanup — removes CI noise + tightens security; small) followed by
P2 (audit-text amendment — closes the audit-spec-conflict gap; small)
as a paired light-scope opener.

Per CLAUDE.md §"AC-impl cross-check at impl-time" (recurrence-watch
session 90): before pushing impl, re-read each AC's verbatim wording
and grep impl for the structural elements named in AC.

Per CLAUDE.md §"Pre-priority spec-gate verification": before treating
priority labelled "per spec X §Y" as authorised, grep that section's
gating IF-clauses verbatim. Session 96 surfaced the inverse case
(spec 65 + 67 + 34 deliberately diverged from V1; audit slice missed
the cross-check). Apply same discipline going forward.

Definition of Done (CLAUDE.md §"Definition of Done", prototype short-
form items 1, 8, 12, 14 from spec 76 §3):
- Slice acceptance.md + verification.md
- Tests written + passing
- Preview-deploy verified across spec 72a 6+1 dimensions
- User feedback received + addressed (or explicitly deferred)
```

## Product positioning (preserve across sessions)

Decouple is the **complete settlement workspace for separating couples**. NOT a financial disclosure tool. NOT a Form E alternative. Tagline: *"Decouple — the complete picture."*

## Stack

Next.js 14 (app router) + TypeScript · Tailwind v4 via CSS variables · S-F1 token system at `src/styles/tokens.ts` (76 tokens) · Tink for bank connect · Anthropic SDK for AI extraction · Vercel previews per branch, production at `construct-dev.vercel.app`. Shared chassis primitives all landed (TopBar / Hero / Footer) + density-entry (EntryScaffold on O1) + density-question (WhyWeAsk on O1-O6) + delight (spec-26 compliance pass) + output-reassurance (Reassurance on O7) all merged to main.

## Branch

Session 97 branch: harness-suffixed off clean main, OR scope-named sub-branch per the per-slice convention (`claude/S-INFRA-npm-audit-cleanup` for P1, `claude/session-97-audit-text-amendment` for P2, etc).

## Negative constraints (preserve)

#1-#41 from prior sessions. **No new numbered constraints surfaced session 96.** Eleven scoping-discipline observations on recurrence-watch (9 carried + 2 new — audit-spec-cross-reference + CI-noise-queue-not-defer). Promote to numbered constraint if a third session surfaces similar recurrence for any one of them.

**Active pre-existing CI failures (carry forward, but queue for cleanup):**
- `npm audit (high + critical)` — `S-INFRA-npm-audit-cleanup` priority 1 session 97.
- `spec-citation-quote-check` — fires on newly-added slice docs; gate workflow's comment acknowledges *"Pragmatic scope: gate fires on Added files, not Modified. Pre-existing per-cite citations across the corpus would block every spec-modifying PR otherwise."* Acceptable carry; track for eventual line-level diff filtering improvement.

## Scope ceiling

Session 97 is most likely **P1 (npm-audit cleanup) + P2 (audit-text amendment)** as a light-paired session, or **P3 (spec 65 amendment scaffold)** alone if user prefers structural work. Out of scope unless explicitly added: P5 desktop · P6-9 inherited side-quests · Welcome Tour · Marketing Landing · Post-connect Dashboard · `Decouple.zip` unpacking · Mobile Screens v2 · authenticated-screens header work.

## Current pre-signup prototype URL

- Production: `https://construct-dev.vercel.app/dev/proto/pre-signup-interview`
- Per-PR preview: surfaced as Vercel comment on each PR.
- All 8 screens (O1-O8) are canvas-as-source on main. Three shared chassis primitives (TopBar + Hero + Footer) + EntryScaffold (O1) + WhyWeAsk (O1-O6) + spec-26 delight compliance + Reassurance (O7) all merged. Density + delight + output-reassurance audit findings closed (8 of 10); F-OUT-01 + F-OUT-02 deferred per spec-65/67 conflict.
