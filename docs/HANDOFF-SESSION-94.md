# Session 94 retro — Batch C AC-5 walk closure + density/delight Phase 1 audit

## What happened

Session 94 ran the recommended P1+P2 sequence cleanly.

**P1: Batch C AC-5 preview-deploy 6+1 walk.** Closed the deferred DoD item carried from session 93. Walked all 8 screens at `construct-dev.vercel.app/dev/proto/pre-signup-interview` per spec 72a's 6+1 dimensions (golden path · edge cases · prefers-reduced-motion · keyboard-only · 375×667 mobile · screen reader · +1 visual diff). Workflow: per-dimension report cadence (one dimension across all 8 screens at a time). All 6 dimensions Pass; +1 visual diff N/A per spec 72a §Out of scope (no baseline tooling). Updated `docs/slices/S-PROTO-batch-C-footer-harmonisation/verification.md` table from `pending` rows to evidenced rows; DoD-4 closed; AC-5 row flipped from `pending preview-deploy walk` to ✓. Same edit stripped the existing `PR #169` provenance reference at L76 (caught by author-time discipline reading the diff, not by the hook — the hook only flags fresh introductions). Commit `393e454`.

**P2: Density/delight Phase 1 audit slice.** New slice `S-PROTO-pre-signup-density-delight-audit` at `docs/slices/S-PROTO-pre-signup-density-delight-audit/acceptance.md` (~142 lines). Scope narrowed from the SESSION-CONTEXT-listed six lenses to a single lens (density + delight, combined) after the user re-picked post overlap-clarification. 10 findings catalogued across 3 categories: 4 density gaps (F-DEN-01..04 — no Why-we-ask callouts · no outcome scaffolding · no time-commitment · no reassurance), 3 delight gaps (F-DEL-01..03 — no inter-screen cross-fade · no `[Next]` press feedback · radio-selection 150ms needs verification), 3 plan output gaps (F-OUT-01..03 — adaptive Tier 1/2/3/4 framework unimplemented · confidence indicators absent · reassurance footer copy absent on O7). References: V1 baseline (Welcome screen L150-181 · Interview step L183-213 · Adaptive output decision flow L40-56 · Your Plan full tier L255-305), spec 26 §1 + §5, spec 65, CLAUDE.md positioning + north star + product rules. Joint review approved all 10 findings as drafted; meta-finding option declined. Commit `142ca52`.

**Net session deliverable:** 2 commits, +152 / -10 lines (10 doc lines for verification.md flip + 142 new audit lines). No `src/` touched. Tests + typecheck unchanged from session 93 (526/526 across 79 files; tsc clean).

## What went well

- **Tightened audit scope after overlap-clarification.** Initial AskUserQuestion offered four broad audit-lens options; user requested a clarification mid-question ("how does spec 65 coverage differ from other recommended lenses, or do they overlap?"); re-asked after an explicit overlap-matrix explanation; user narrowed to a single lens. Resulted in 10 focused findings rather than the 30+ finding sprawl a broad-first-cut approach would have produced. Discipline learned: when a user clarification request signals scope confusion mid-question, re-ask after explaining, don't push past it.
- **Negative grep evidence carried high signal.** Four density findings (F-DEN-01..04) cite negative grep across all 8 screens as primary evidence. The ABSENCE of certain phrases ("why we ask", "you'll", "minute", "don't need") is the finding; no file-body read needed. Cheap, repeatable, copy-pasteable evidence pattern.
- **Workflow precedent reuse.** `S-PROTO-cross-screen-homogenisation-audit` (session 91) provided the exact structural template — frontmatter + scope-in/out + findings register with category prefixes + workflow + out-of-scope sections. Read only the first 80L of precedent to confirm shape, then drafted in the same shape; ~30 min from "start drafting" to commit.
- **Per-dimension walk cadence.** P1 walk ran one dimension across all 8 screens at a time (vs per-screen or single-batch). Each dimension was a single user message ("all good"/"agreed"/etc.) and a single Claude response. Tight feedback loop, low token churn, easy verification.md update at the end.

## What could improve

- **Comment-review hook didn't fire on pre-existing provenance during a paragraph rewrite.** When editing verification.md L76 intro paragraph for AC-5 closure, the existing "PR #169" reference was within the cut range. My rewrite removed it without the hook firing (the hook flags fresh introductions of provenance, not pre-existing). Pattern worth carrying: when editing a paragraph for unrelated reasons, scan the existing content for previously-permitted provenance markers being overwritten; opportunistic cleanup is the right discipline. Promotion threshold: a second session surfacing pre-existing provenance carried untouched through a paragraph rewrite where opportunistic cleanup would have been right.
- **AskUserQuestion overlap-explanation could be inline up-front.** Lens descriptions in the initial AskUserQuestion didn't include reciprocal-overlap framing. User had to ask for it; required a second AskUserQuestion to land the scope. For next-audit framing: always pair lens descriptions with their relationship to neighbouring lenses (overlap matrix or short comparison) in the FIRST AskUserQuestion, not after the user surfaces confusion.

## Key decisions

- **Audit scope = density/delight only (one lens), not 2-3.** User's actual concern (per session 91+92 framing) was "feels basic"; after overlap-matrix explanation, density/delight was the single-lens fit. Three other lenses (gentle-interview tone · deeper adaptivity beyond F-OUT-01 · spec 65 literal coverage) deferred to separate Phase 1 audit slices if pursued.
- **Single-lens slice name matches single-lens scope.** Slice named `S-PROTO-pre-signup-density-delight-audit` rather than the SESSION-CONTEXT-flagged `S-PROTO-pre-signup-spec-pressure-test`. Reflects actual scope; lower-confusion handoff. Discipline candidate (new this session, recurrence-watch below).
- **+1 visual-diff dimension marked N/A rather than skipped or backfilled.** User picked the recommended "mark N/A with reasoning (no baseline tooling per spec 72a §Out of scope)" over capturing-screenshots-as-new-baseline or running canvas-level eyeballing. Reasoning recorded in verification.md cell + DoD-4. If visual-regression tooling lands (v3c per spec 72a §Out of scope), future batches populate this dimension genuinely.
- **Phase 3 batch impl groupings sketched, not locked.** Audit §Workflow proposes four likely batches (density-entry · density-question · delight · output) but explicitly TBD at impl-scoping time. Keeps future sessions free to re-group based on Phase 3 scoping discoveries.
- **Meta-finding declined.** Joint review offered an optional META-01 finding calling out the cross-cutting pattern (V1 framing/scaffolding/reassurance systematically dropped in spec 65 reconciliation while questions preserved). User picked "ship as drafted" over "add meta-finding". Pattern observation stays as session-94 wrap-prose only.

## Scoping-discipline observations on recurrence-watch

Carrying from prior sessions + adding session-94 observation:

- **AC-impl cross-check at impl-time** (introduced session 90) — N/A session 94 (no AC impl; both deliverables docs).
- **Sibling-wrapper diff at impl-time** (carried session 88) — N/A session 94.
- **Shared-infrastructure audit at refactor-time** (carried session 87) — N/A session 94.
- **In-PR scope-expansion confirmation gate** (carried session 87) — N/A; scope narrowing happened pre-impl mid-AskUserQuestion, not in a PR cycle.
- **`git push --force` after amend** (carried session 91) — not triggered session 94. Single occurrence at session 91 still standing.
- **verification.md PARTIAL internal contradiction** (carried session 93) — N/A session 94 (verification.md update was a status-flip on an already-complete slice, not a PARTIAL drafting cycle).
- **Read-cap accumulation during sweep cycles** (carried session 93) — not surfaced session 94. Mitigations applied successfully: offset+limit reads for the audit-precedent acceptance.md (read first 80L only); bash grep/sed substituted for full-file reads in the spot-audit phase; v1-wireframes sections read via `sed -n`. Read budget stayed comfortably under cap on every turn.
- **NEW session 94 — Single-lens audit framing.** When a multi-lens audit menu is offered and the user picks a single-lens scope, the slice name + framing should match the chosen scope rather than the original menu-level framing. Session 94 named correctly first try (`S-PROTO-pre-signup-density-delight-audit` rather than the SESSION-CONTEXT-suggested `S-PROTO-pre-signup-spec-pressure-test`). Promotion threshold: any future audit slice shipping under a multi-lens name but covering single-lens scope.
- **NEW session 94 — Pre-existing provenance opportunistic cleanup at paragraph rewrite.** Hook flags fresh introductions; pre-existing markers carried through a paragraph rewrite slip past. Pattern: when editing a paragraph for unrelated reasons, scan its existing content for previously-permitted provenance and remove during the rewrite. Session 94 example: verification.md L76 intro paragraph carried "PR #169" from session 92's draft; AC-5 closure rewrote the paragraph and removed the reference. Promotion threshold: a second session surfacing pre-existing provenance carried untouched through a paragraph rewrite where opportunistic cleanup would have been right.

## Next session (95) priorities

| # | Priority | Effort |
|---|---|---|
| 1 | **Density-entry batch impl** — likely shape: shared `<EntryScaffold/>` primitive on O1 covering F-DEN-02 (outcome scaffolding) + F-DEN-03 (time-commitment) + F-DEN-04 (reassurance). One screen, ~50-100 added lines, new primitive + 3 copy strings. First visible "feels less basic" delta after first session ship. | Light-medium |
| 2 | **Density-question batch impl** — shared `<WhyWeAsk/>` primitive across O1-O6 with per-screen copy. Six screens, one new primitive, six new copy entries. F-DEN-01 only. | Light-medium |
| 3 | **Tone audit (Phase 1)** — separate audit slice using session-94's structural template. CLAUDE.md positioning + spec 65 per-screen tone notes. ~30-45 min if precedent reused. | Light |
| 4 | **Delight batch impl** — spec 26 §5 compliance pass: F-DEL-01 (inter-screen transition) + F-DEL-02 ([Next] press feedback) + F-DEL-03 (radio-selection 150ms verification). Touches Footer.tsx + new page-transition layer. | Medium |
| 5 | **Output batch impl** — O7 adaptivity + confidence + reassurance. F-OUT-01..03. 641-line O7.tsx; needs careful scoping. | Heavy |
| 6 | **Adaptivity audit (Phase 1)** — deeper than F-OUT-01 symptom finding. Tier 1/2/3/4 framework + all 8 data fields vs current branching surface. | Medium |
| 7 | **Spec 65 literal coverage audit (Phase 1)** — each O-screen vs spec 65 literal copy + question pattern + options + data captured. | Medium |
| 8 | **Desktop graceful enhancement** — Help Rail integration. Mobile chassis fully stable. | Heavy |
| 9 | **(Inherited)** spec-citation-quote-check author-time hook | Light |
| 10 | **(Inherited)** Comment-review hook §Status exemption fix | Light |
| 11 | **(Inherited)** Comment-review hook CSS-files regex tightening | Light |
| 12 | **(Inherited)** Spec 65 amendment for quantitative profiling data | Heavy |

**Recommended sequence:** P1 (density-entry batch — first visible delta from the audit) → P2 (density-question batch — extends F-DEN treatment across questions) → P3 (tone audit, leverages density+question primitives now built) as time allows.

## Session 94 ledger

- Branch worked: `claude/session-94-setup-G7yV5` (harness-suffixed).
- Commits: `393e454` (P1 verification.md update) + `142ca52` (P2 audit slice).
- Net diff: +152 / -10 lines across 2 files.
- Tests: 526/526 pass (unchanged). Typecheck: clean.
- Wrap PR: created post-handoff-docs commit; pending merge.
