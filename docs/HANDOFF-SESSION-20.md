# Session 20 Handoff — Post-signup profiling gaps 6-12 + clean-build stock-take

**Date:** 20 April 2026
**Branch:** `claude/decouple-financial-workspace-oXXQ7`
**Scope:** Design session only — no code changes
**Commits:** 7 (one per resolved gap + wrap-up)

## What happened

### All 12 post-signup profiling gaps resolved (or parked)

Session 19 resolved gaps 1-5 (spec 67). This session completed the remaining work:

- **Gap 6 (self-employed sequencing):** basics pre-bank (P2a/b/c), depth post-bank (B1-B5). SA302s and accounts auto-added to to-do list; business valuation added if skipped.
- **Gap 10 (pension depth, CETV):** don't ask DB/DC at profiling (users can't classify). Use a "quiet DB proxy" — public-sector / legacy-corporate checkboxes — to drive the CETV nudge. CETV request lands on to-do list at pre-bank, starting the 6-12 week clock on day 1.
- **Gap 9 (account structure):** light pre-bank priming (P6) rather than a checklist. Real capture post-bank using bank evidence — AC3 "we noticed a transfer to account 4521" is more powerful than cold memory. Engine dependency flagged: matching layer must expose outbound transfer destinations.
- **Gap 8 (verification placement):** three placements — inline during confirmation, consolidated pre-share (credit check recommended), always-available hub (dashboard widget + dedicated page). Identity verification deferred to consent-order stage.
- **Gap 12 (reframed):** original "reverse partner awareness" question dropped as tautological. Replaced with **pre-share commonly-missed-items checklist** (jewellery, TVs, cash, money owed, crypto, foreign assets, etc.). Surprise management moves to reconciliation flow.
- **Gap 11 (safeguarding V1 pragmatic):** universal baseline (quick-exit, neutral emails, pause) + triggered signposting to Women's Aid / Refuge / NDAH. Full adaptive safeguarding (coercive control detection, mediator routing, decoy mode) deferred to V1.5 backlog. Grounded in v1 desk research — 30% of DA deaths in first month of separation, 72% tech-facilitated abuse, Women's Aid oppose tools claiming DA capability without infrastructure.
- **Gap 7 (invited party Mark variant):** core direction agreed — Mark as builder not verifier, abbreviated pre-signup inheriting shared context with dispute-capture on corrections, own bank connection, own picture. Five specific decisions **PARKED** for return after Claude AI Design reconciliation (see spec 67 for the list).

### Product positioning preserved in CLAUDE.md

Added a durable "Product positioning" section at the top of CLAUDE.md. Decouple is the **complete settlement workspace for separating couples** — finances, children, housing, future needs, through to consent order and post-order implementation. It is NOT a financial disclosure tool. Three pillars: shared-not-adversarial, evidenced-not-asserted, end-to-end-not-hand-off. Tagline: "Decouple — the complete picture." This framing is load-bearing and must be preserved across sessions.

### Stock-take — the architectural drift

Honest assessment surfaced in-session:
- **Built code** reflects session 11-17 thinking (V2 financial disclosure workspace)
- **Specs** reflect session 19+ thinking (complete settlement workspace, 6 phases, document-as-spine)
- **Drift is real.** Continuing to evolve the current /src tree would compound the mismatch.
- Claude AI Design prototype work (user's off-session design) not yet shared — will inform reconciliation.

### Recommended path forward

1. Pause new spec work
2. User shares Claude AI Design prototypes
3. Reconciliation session: specs ↔ prototypes
4. Produce "Complete Settlement Workspace Build Map" mapping every phase to components, data model, engine dependencies, design references
5. Start clean rebuild in the same repo — hybrid preservation: keep stable libs (engine, bank, AI, decision trees), rebuild app/components around the 6-phase model
6. Lock Gap 7 parked decisions once design work is reconciled
7. Pressure-test dashboard spec 04 against 6-phase model
8. Write definitive post-signup profiling spec (spec 68)

### Key insights / decisions made

1. **The CETV clock starts at pre-bank.** Biggest single timeline win — 6-12 weeks moved earlier, saved for every DB-likely user.
2. **Users can't classify DB vs DC.** Use role-context proxies instead. Introduce DB/DC vocabulary only in confirmation with examples and pre-selection.
3. **Reverse partner awareness is tautological** (if disclosed, ex knows; if hidden, we don't know to ask). Surprise management belongs in reconciliation flow, not pre-share reflection. Completeness checklist is the real value pre-share.
4. **Decouple is not a DA service.** Signpost honestly to Women's Aid / Refuge / NDAH. Preserve autonomy, don't overclaim capability. Universal privacy baseline (exit button, neutral emails) covers exit-prep users without flagging.
5. **Verification is three placements, not one.** Inline during confirmation, consolidated pre-share, always-available hub.
6. **Mark is a builder, not a verifier.** Disputes captured on corrections, never silent overwrite. Joint items merge by sort code + account number.

## What went well

- Pressure-testing framework caught Gap 12 (user correctly challenged reverse-partner-awareness as having no actionable answer)
- Gap 11 safeguarding — user's V1 pragmatic instinct aligned with desk research; good collaborative refinement
- Product positioning correction caught in real time (Gap 11 signposting copy) and durably recorded in CLAUDE.md
- One commit per resolved gap kept git history clean and each decision reviewable
- Parking Gap 7 rather than forcing resolution preserved quality — five decisions that deserve design-work reconciliation first

## What could improve

- Earlier stock-take — the architectural drift between built code and specs has been accumulating across 3+ sessions without explicit acknowledgement. Should surface meta-health check at session start, not just at wrap.
- Session length — this covered a lot; the stock-take question emerged late when context was already thick.
- Spec 67 has grown long (~700+ lines now). At some point it should be split or consolidated into spec 68.

## Bugs / issues found

None in code (design-only session). Process improvements captured above.

## Files changed

```
docs/workspace-spec/67-post-signup-profiling-progress.md   (+650 lines, all gap resolutions)
docs/SESSION-CONTEXT.md                                     (rewritten for session 21)
docs/HANDOFF-SESSION-20.md                                  (this file, new)
CLAUDE.md                                                    (product positioning added, branch updated)
```

No /src changes. No tests added. No deploys triggered.

## Next session

See `docs/SESSION-CONTEXT.md` for full context. In short:

- User to share Claude AI Design prototype work
- Reconciliation session: specs ↔ prototypes
- Build Map produced
- Clean rebuild initiated
