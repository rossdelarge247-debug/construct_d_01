# HANDOFF — Session 115

**Working branches:** `claude/session-115-kickoff-Wa3Lf` (wrap docs) · `claude/S-PROTO-journey-restore` (slice scaffold at `a35fd28`)
**PRs merged:** #221 (`S-PROTO-post-connect-dashboard-canvas-port`) at squash `f2936d5`
**PRs opened this session:** none — slice scaffold pushed but PR deferred to session 116 (incomplete)

## What happened (in order)

1. **Turn-0 verification surfaced kickoff drift.** Kickoff claimed PR #221 tip `24dbd53`; live verification showed tip `b6c1497` (one commit behind — session-114 wrap had landed on the PR branch post-kickoff). Also surfaced that HANDOFF-113 + HANDOFF-114 + the session-114 SESSION-CONTEXT refresh all lived on the PR branch, not main — the bundled-wrap-PR risk pattern (session-110 observation) re-exercised. Resolved at merge time when those docs landed via PR #221.

2. **Journey audit (user-triggered).** User asked about how prototype surfaces connected back. Honest answer: they don't. Marketing-landing CTAs were all `#hash` anchors (verified L260-279 of `src/app/dev/proto/marketing-landing/page.tsx`); welcome-tour had no outbound; pre-signup-interview O8 had no outbound; post-connect-dashboard had no inbound. Only connection was the `/dev/proto` registry hub via `_components/FlowRow.tsx:28`.

3. **Plan-history audit (user-triggered).** User asked whether a structured plan existed for working through the 62 registry flows as journeys. Audit of `docs/HANDOFF-SESSION-74.md` L9-10 + L80-82 surfaced the 3-phase post-audit plan + Phase 3 sequence (hub → pre-signup-interview → section-confirm → ai-coach → share-flow). Compared against shipped slices 74-114: P1 (pre-signup-interview) advanced through deepening; P2+ (section-confirm / ai-coach / share-flow) never started; sessions 112-114 ran off-sequence canvas-ports of §1/§3/§5 surfaces. Registry rows for shipped surfaces (#216, #217, #218, #219, #220, #221) all stayed at `lastTouched: session 74` / `status: canvas-drafted` — the registry-as-tracker discipline lapsed after session 80.

4. **Scope lock for restoration slice.** User accepted recommendations: do as one slice; correct journey ordering (welcome-tour is §3 post-signup, NOT post-marketing or pre-interview); enshrine the process via codified gates. Two open questions answered: (a) merge PR #221 first → then slice off updated main; (b) AC-2 wires real routes for top-level destinations only (Start CTA, Pricing nav), keeps hashes for intra-page scroll sections.

5. **PR #221 merged.** Via `mcp__github__merge_pull_request` squash. New main tip `f2936d5`. Resync via `git fetch origin main` + `git checkout -B claude/session-115-kickoff-Wa3Lf origin/main`.

6. **Slice scaffold drafted.** Created branch `claude/S-PROTO-journey-restore`; wrote `docs/slices/S-PROTO-journey-restore/acceptance.md` (118L) with 6 ACs covering registry refresh · marketing-landing CTA wiring · pre-signup-interview O8 outbound + sign-up shell stub · DoD item 7 registry-update gate · `**Journey:**` field convention + author-time hook · Phase 3 sequence anchored in always-loaded CLAUDE.md. Committed at `a35fd28`, pushed to origin.

7. **Line-count hook STOP at turn 7.** Hook reported 3,677L session churn (+3416/-143 tracked, +118 untracked). The +3416/-143 was PR #221's merge tree-state delta, not session writes — line-count attribution false-positive on post-merge tree delta. Real session write was the single 118L acceptance.md. Honoured STOP and pivoted to wrap.

## What went well

- **Live-source verification at turn 0** caught kickoff drift cleanly (PR tip stale by one commit; HANDOFF-113/114 on PR branch not main). The "Verify before planning" rule earned its keep again.
- **Two-question scope lock** — `AskUserQuestion`-style framing on (a) merge order and (b) hash-vs-route disposition produced a tight 6-AC plan with no rework.
- **Plan-history audit returned actionable evidence.** Quoting HANDOFF-74 L9-10 + L80-82 verbatim (per CLAUDE.md §"Planning conduct" §"Quote, don't paraphrase") gave the user a concrete diagnostic of the drift, not a vague "I think we missed something."
- **Merge → resync → branch creation sequence worked first time.** No fetch failures, no conflicts, branch tracking set correctly.

## What could improve

- **Session churn hit STOP before any impl code was written.** Root cause: line-count hook attributing PR #221's merge tree-state delta to my session. The hook saw +3416/-143 from the merge bringing in new files; my real writes were 118L (acceptance.md). The slice was scaffold-only at STOP. **Lesson:** when a session begins with a merge that brings substantial new content to main, the line-count budget is consumed before any work begins. Mitigations to consider: (a) line-count hook to compute delta against `origin/main` at session start rather than working-tree state, ignoring inbound merge content; (b) explicit `MERGE_BASELINE_RESET` env var or `.claude/state/baseline-sha` file the hook can read.
- **Comment-review hook stub-mode false-positive on slice References.** `acceptance.md` §"Why" and §"References" cite `HANDOFF-SESSION-74.md` by filename plus quote-verbatim historical plan text — exactly what CLAUDE.md §"Planning conduct" §"Quote, don't paraphrase" requires. Regex matched "SESSION-74" and flagged "temporal provenance". CLAUDE.md exempts §Status footers ("lineage IS the section's purpose"); slice References sections are analogous but absent from the hook's skip-list. **Lesson:** extend `.claude/hooks/comment-review.sh` skip-list to cover `docs/slices/**/acceptance.md` content within `^## (References|Why)` blocks, OR refine regex to skip on citation-style path-references (e.g. `HANDOFF-SESSION-\d+\.md`).
- **Bundled-wrap-PR risk re-exercised.** Session-110 documented this; sessions 113 + 114 bundled their wrap docs into the impl PR. Worked cleanly here (everything merged together via #221), but kept SESSION-CONTEXT stale until the merge. A separate-wrap-PR convention would have made main reflect the work-completed state earlier; the trade-off is more PRs / more merge cost. No action this session; observation carries forward.

## Key decisions

| # | Decision | Rationale |
|---|---|---|
| 1 | Merge PR #221 first, then start journey-restore slice off updated main | Avoids `hub-day-7-state-f` registry update racing the merge; clean main baseline. User-confirmed. |
| 2 | One slice for all 6 ACs (not split into registry-refresh + journey-wiring) | User explicitly chose "do as one". Reduces PR count + lets the enshrining gates ship atomically with the registry/wiring work. |
| 3 | Real routes for top-level destinations + hashes for in-page scroll | User-confirmed. Preserves marketing-landing's single-page scroll while wiring the actual journey hops. |
| 4 | Sign-up shell as journey-end stub at O8 outbound | Cheapest registers "orphan-with-stub" instead of "orphan-with-dead-anchor". Mirrors how-it-works/pricing/faq-trust shell pattern. |
| 5 | Three enshrining mechanisms (hard CI gate + always-loaded discipline + author-time hook) | Defence in depth — DoD item 7 catches at PR time; `**Journey:**` field + Phase 3 sequence in CLAUDE.md catch at planning time; hook catches at author time. Single mechanism would have a single failure mode. |
| 6 | Honour line-count STOP despite false-positive attribution | Per CLAUDE.md threshold rule "stop at 2,000 ('stop writing code and wrap')". Wrap docs are not code; impl is. Slice resumes session 116. |

## New constraints discovered

| # | Constraint | Why it matters |
|---|---|---|
| (obs) | **Post-merge tree-state delta over-counts session churn.** Hook attributes merge contents to session's first subsequent Write. Distinct from session-114's "branch-checkout content inflates churn" — that was checkout of pre-existing commits; this is merge of new commits. Same hook surface, different trigger. | One-session-observed; promote to numbered constraint if session 116 hits the same pattern. |
| (obs) | **Comment-review hook flags legitimate plan-history citations in slice References sections.** CLAUDE.md exempts §Status footers but not slice References — collision between §"Quote, don't paraphrase" requirement and §"no temporal provenance" rule. | One-session-observed; promote at second observation. |

## Persona findings (none invoked this session)

Session 115 did not spawn any persona reviews — no impl code was written. The 6-AC scaffold sits in `acceptance.md` only; PR-time auto-review fires at session 116's PR-open moment.

## Bugs found + how they were fixed

None — session was diagnostic + planning + a merge + a scaffold write. No code-level bugs surfaced.

## Next session priorities

**P1 (firm):** Complete `S-PROTO-journey-restore` per the locked 6-AC scope in `docs/slices/S-PROTO-journey-restore/acceptance.md`. Branch `claude/S-PROTO-journey-restore` already has scaffold at `a35fd28`. Order per SESSION-CONTEXT §"Implementation order": slice docs first (verification.md + security.md + test-plan.md) → AC-1 (schema + registry) → AC-3 (shell + O8 edit) → AC-2 (marketing-landing 2 hrefs) → AC-4 (PR template + workflow) → AC-5 (hook + CLAUDE.md sub-section + shellspec) → AC-6 (CLAUDE.md top-level section). Tests where tractable. Open PR with all 6 ACs at slice end.

**P2 (next after P1):** `S-PROTO-section-confirm` — the actual Phase 3 P2 slice per HANDOFF-74 L80-82. The post-journey-restore re-anchored sequence target.

See `docs/SESSION-CONTEXT.md` §"Session 116 priorities" for the full priorities table + the paste-ready kickoff prompt.
