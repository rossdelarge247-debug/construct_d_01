# Session 95 Pre-flight Context Block (carrying session 94 wrap delta)

## Session 94 wrap delta — read this first

Session 94 ran the recommended P1+P2 sequence cleanly.

**P1: Batch C AC-5 preview-deploy 6+1 walk.** Closed the deferred DoD item from session 93. Walked all 8 screens at `construct-dev.vercel.app/dev/proto/pre-signup-interview` per spec 72a's 6+1 dimensions. All 6 dimensions Pass; +1 visual diff N/A. `docs/slices/S-PROTO-batch-C-footer-harmonisation/verification.md` table flipped from `pending` to evidenced rows; DoD-4 closed; AC-5 row ✓. Commit `393e454`.

**P2: Density/delight Phase 1 audit slice.** New slice `S-PROTO-pre-signup-density-delight-audit` at `docs/slices/S-PROTO-pre-signup-density-delight-audit/acceptance.md` (~142 lines). Scope narrowed to a single lens (density + delight) after overlap-clarification. 10 findings: 4 density gaps (F-DEN-01..04), 3 delight gaps (F-DEL-01..03), 3 plan output gaps (F-OUT-01..03). References: V1 baseline + spec 26 §1+§5 + spec 65 + CLAUDE.md positioning. Phase 1 (audit) complete; Phase 2 (joint review) complete; Phase 3 (batch impl) deferred to session 95+. Commit `142ca52`.

**Net diff vs main:** +152 / -10 lines across 2 files. No `src/` touched. Tests + typecheck unchanged (526/526 across 79 files).

**Diagnosis trail durably captured in `docs/HANDOFF-SESSION-94.md`** — read for per-dimension walk cadence reasoning, single-lens audit framing observation (new recurrence-watch item), pre-existing provenance opportunistic cleanup observation (new recurrence-watch item), and Phase 3 batch impl groupings sketch.

## Session 95 priorities — user picks scope

The audit shipped session 94 sets up Phase 3 batch impl. Groupings sketched in audit §Workflow but TBD at impl-scoping time.

| # | Priority | Scope | Effort | Blocked? |
|---|---|---|---|---|
| 1 | **Density-entry batch impl** | Likely shape: new shared `<EntryScaffold/>` primitive on O1 covering F-DEN-02 (outcome scaffolding "in next ~3 min you'll: A, B, C") + F-DEN-03 (time-commitment) + F-DEN-04 (reassurance "you don't need to know everything"). One screen, ~50-100 added lines, new primitive + 3 copy strings. First visible "feels less basic" delta. | Light-medium | No |
| 2 | **Density-question batch impl** | Likely shape: new shared `<WhyWeAsk/>` primitive across O1-O6 with per-screen copy explaining WHY each question matters. Six screens, one new primitive, six new copy entries. F-DEN-01 only. | Light-medium | No |
| 3 | **Tone audit (Phase 1)** | Separate audit slice using session-94's structural template. Compare current copy against CLAUDE.md "warm hand on a cold day" + "stressed, often alone, often late at night" + spec 65 per-screen tone notes (O1 stage → tone variant; O3 safety woven naturally). ~30-45 min if precedent reused. | Light | No |
| 4 | **Delight batch impl** | Spec 26 §5 compliance pass: F-DEL-01 inter-screen 5-step cross-fade + F-DEL-02 `[Next]` press feedback (`scale(0.98) 100ms`) + F-DEL-03 radio-selection 150ms verification. Touches Footer.tsx + new page-transition layer. | Medium | No |
| 5 | **Output batch impl** | O7 adaptivity + confidence + reassurance. F-OUT-01+02+03. 641-line O7.tsx; needs careful scoping. | Heavy | No |
| 6 | **Adaptivity audit (Phase 1)** | Deeper than F-OUT-01 symptom finding. Tier 1/2/3/4 framework + all 8 data fields vs current branching surface. | Medium | No |
| 7 | **Spec 65 literal coverage audit (Phase 1)** | Each O-screen vs spec 65 literal copy + question pattern + options + data captured. | Medium | No |
| 8 | **Desktop graceful enhancement** | `docs/design-source/pre-signup-interview/desktop/Desktop Enhanced - Help Rail - Standalone.html`. Help Rail integration + intermediate breakpoints + extra-space utilisation above 480px mobile cap. Mobile chassis fully stable post-Batches A/B/C/D + session-94 AC-5 walk. | Heavy | No |
| 9 | **(Inherited)** spec-citation-quote-check author-time hook | Light | No |
| 10 | **(Inherited)** Comment-review hook §Status exemption fix | Light | No |
| 11 | **(Inherited)** Comment-review hook CSS-files regex tightening | Light | No |
| 12 | **(Inherited)** Spec 65 amendment for quantitative profiling data | Heavy | No |

**Recommended sequence:** P1 (density-entry batch — first visible delta from the audit) → P2 (density-question batch — extends F-DEN treatment across questions) → P3 (tone audit, leverages density+question primitives now built) as time allows.

**Scoping-discipline observations carried as recurrence-watch (not yet numbered constraints):**

- **AC-impl cross-check at impl-time** (introduced session 90) — N/A session 94 (no AC impl).
- **Sibling-wrapper diff at impl-time** (carried session 88) — N/A session 94.
- **Shared-infrastructure audit at refactor-time** (carried session 87) — N/A session 94.
- **In-PR scope-expansion confirmation gate** (carried session 87) — N/A; scope narrowing happened pre-impl mid-AskUserQuestion.
- **`git push --force` after amend** (carried session 91) — not triggered session 94.
- **verification.md PARTIAL internal contradiction** (carried session 93) — N/A session 94 (verification.md update was a status-flip on an already-complete slice).
- **Read-cap accumulation during sweep cycles** (carried session 93) — not surfaced session 94. Mitigations applied successfully (offset+limit reads + bash grep/sed substitutes).
- **NEW session 94 — Single-lens audit framing.** When a multi-lens audit menu is offered and the user picks a single-lens scope, the slice name + framing should match the chosen scope. Session 94 named correctly first try. Promotion threshold: future audit slice shipping under a multi-lens name but covering single-lens scope.
- **NEW session 94 — Pre-existing provenance opportunistic cleanup at paragraph rewrite.** Comment-review hook flags fresh introductions of `PR #N` / `session N` / `slice S-XX AC-N` provenance but doesn't fire on pre-existing markers carried through a rewrite. Pattern: when editing a paragraph for unrelated reasons, scan its existing content for previously-permitted provenance and remove during the rewrite. Session 94 example: verification.md L76 intro paragraph carried `PR #169` from session 92's draft; AC-5 closure rewrote the paragraph and removed the reference. Promotion threshold: a second session surfacing pre-existing provenance carried untouched through a paragraph rewrite where opportunistic cleanup would have been right.

## Authoritative reading order at session 95 start

1. This file (you are here).
2. `docs/HANDOFF-SESSION-94.md` (session 94's retro — P1 + P2 deliverables + 2 new recurrence-watch observations + Phase 3 batch impl sketch).
3. `docs/HANDOFF-SESSION-93.md` (session 93's retro — Batch C resumption + full-slice ship).
4. **For P1 (density-entry batch impl):** read `docs/slices/S-PROTO-pre-signup-density-delight-audit/acceptance.md` §F-DEN-02..04 + `docs/v1/v1-wireframes.md` L150-181 (V1 Welcome baseline) + `docs/workspace-spec/65-pre-signup-interview-reconciled.md` §O1.
5. **For P2 (density-question batch impl):** read audit §F-DEN-01 + v1-wireframes L196-203 (V1 Why-we-ask pattern).
6. **For P3 (tone audit Phase 1) or other audits:** use session-94 audit slice as structural precedent.

## Session 95 kickoff prompt (paste-ready)

```
Kick off session 95.

Read this file (SESSION-CONTEXT.md) first.

Turn-0 verification:
- SessionStart hook surfaces live branch state.
- Branch convention: harness-suffixed (claude/<scope>-XXXXX) OR
  per-batch sub-branch off latest main.
- Session 94 shipped 2 commits: P1 verification.md update (393e454)
  + P2 density/delight Phase 1 audit slice (142ca52); session-94 wrap
  PR pending or just-merged.
- If the harness landed you on a different base, follow CLAUDE.md
  §"Branch-resume check": git fetch origin main → git checkout -B
  <branch> origin/main.

Read at session start (Tier 2 + Tier 3, in order):
1. docs/SESSION-CONTEXT.md (this file).
2. docs/HANDOFF-SESSION-94.md.
3. docs/HANDOFF-SESSION-93.md.
4. For P1 (density-entry batch impl): docs/slices/S-PROTO-pre-signup-
   density-delight-audit/acceptance.md §F-DEN-02..04 + docs/v1/
   v1-wireframes.md L150-181 (V1 Welcome baseline) + docs/workspace-
   spec/65-pre-signup-interview-reconciled.md §O1.
5. For P2 (density-question batch impl): audit §F-DEN-01 + v1-
   wireframes L196-203.

Confirm priority with user. SESSION-CONTEXT recommends P1 (density-
entry batch — first visible delta from the density/delight audit;
light-medium effort) followed by P2 (density-question batch) as time
allows.

Per CLAUDE.md §"AC-impl cross-check at impl-time" (recurrence-watch
session 90): before pushing impl, re-read each AC's verbatim wording
and grep impl for the structural elements named in AC.

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

Next.js 14 (app router) + TypeScript · Tailwind v4 via CSS variables · S-F1 token system at `src/styles/tokens.ts` (76 tokens) · Tink for bank connect · Anthropic SDK for AI extraction · Vercel previews per branch, production at `construct-dev.vercel.app`. Shared chassis primitives all landed: `components/TopBar.tsx` (Batch A) · `components/Hero.tsx` (Batch B) · `components/Footer.tsx` (Batch C, AC-5 preview-deploy walk evidenced session 94).

## Branch

Session 95 branch: harness-suffixed off clean main, OR scope-named sub-branch per the established pattern. Session 94 shipped 2 commits + session-94 wrap PR bundling HANDOFF-94 + new SESSION-CONTEXT refresh.

## Negative constraints (preserve)

#1-#41 from prior sessions. **No new numbered constraints surfaced session 94.** Nine scoping-discipline observations on recurrence-watch (7 carried + 2 new). Promote to numbered constraint if a third session surfaces similar recurrence for any one of them.

## Scope ceiling

Session 95 is most likely **P1 (density-entry batch impl — first visible delta from the density/delight audit)** followed by **P2 (density-question batch impl)** if budget permits. Out of scope unless explicitly added: P4 desktop · P5+ inherited side-quests · Welcome Tour · Marketing Landing · Post-connect Dashboard · `Decouple.zip` unpacking · Mobile Screens v2 · authenticated-screens header work.

## Current pre-signup prototype URL

- Production: `https://construct-dev.vercel.app/dev/proto/pre-signup-interview`
- Per-PR preview: surfaced as Vercel comment on each PR.
- All 8 screens (O1-O8) are canvas-as-source on main, three shared chassis primitives landed (TopBar + Hero + Footer) + dead-code cleaned + O1/O2 root `<main>` + O7 PlanFooter `<section>` removed + Batch C AC-5 preview-deploy walk evidenced. Density + delight Phase 1 audit catalogued (10 findings; Phase 3 batch impl pending).
