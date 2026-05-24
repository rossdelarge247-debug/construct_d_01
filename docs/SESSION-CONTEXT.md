# Session 121 Context Block

## Session 120 accomplishments

Session 120 built Stage 4 (post-signup onboarding) left-to-right and created the journey sequence document. Branch: `claude/intelligent-faraday-eDatJ` (5 ahead of main; PR pending).

### What shipped

| Deliverable | Tests | Key files |
|---|---|---|
| Journey sequence doc (55 flows, 9 stages) | — | `docs/journey-sequence.md` |
| S-PROTO-safeguarding-signposting | 16 | `src/app/dev/proto/safeguarding-signposting/` |
| S-PROTO-moment-1-ack | 10 | `src/app/dev/proto/moment-1-ack/` |
| S-PROTO-moment-2-profiling (8 screens) | 13 | `src/app/dev/proto/moment-2-profiling/` |
| Stage 5 reassessment (BLOCKED → READY) | — | `docs/journey-sequence.md` §Stage 5 |

976/976 full suite; typecheck clean; ESLint clean.

### Key discovery: Stage 5 is NOT blocked

User challenged the BLOCKED assessment. Audit found 3,801 lines of existing V2 Tink integration:

| File | Lines | What it does |
|---|---|---|
| `src/lib/bank/tink-client.ts` | 321 | Full Tink API client (auth, accounts, transactions, provider names) |
| `src/lib/bank/tink-transformer.ts` | 282 | Tink data → BankStatementExtraction |
| `src/lib/bank/bank-data-utils.ts` | 386 | Extraction → UI types + transaction search |
| `src/lib/bank/confirmation-questions.ts` | 1998 | Spec 22 decision trees |
| `src/lib/bank/test-scenarios.ts` | 644 | 5 synthetic scenarios for dev mode |
| `src/lib/bank/signal-rules/` | 8 files | 17 rules (income, debt, accounts, pension, property) |
| `src/app/api/bank/connect/route.ts` | 37 | Tink Link URL generation |
| `src/app/api/bank/callback/route.ts` | 133 | Full pipeline: auth → accounts → transform → postMessage |

The heavy backend is done. Prototype work: UI wrapper + test scenario loader.

## Session 121 priority: Stage 5 bank connection prototype

**User-directed.** Build the bank connection prototype as the #1 priority.

### What needs building

| Flow | Status | What exists | What's needed |
|---|---|---|---|
| Bank picker UI | READY | `/api/bank/connect` generates Tink Link URL | Prototype screen at `/dev/proto/bank-connect/` with "Connect your bank" CTA, Tink Link popup launcher, dev-mode scenario selector |
| Tink mid-flow | READY | Popup mode in callback route | Loading/waiting state while Tink Link is open |
| Callback success | READY | Full pipeline at `/api/bank/callback` | Success confirmation screen showing connected accounts, transition to hub |
| Callback error/retry | READY | `redirectWithError()` in callback route | Error state with retry CTA, human-readable error messages |
| Manual entry fallback | PARTIALLY READY | `test-scenarios.ts` provides data shape | Entry form for users who can't use Open Banking |

### Dev-mode approach

The prototype should offer two paths:
1. **Live mode** — launches Tink Link popup via `/api/bank/connect` (requires `TINK_CLIENT_ID` + `TINK_CLIENT_SECRET` env vars)
2. **Dev mode** — loads one of 5 synthetic test scenarios from `test-scenarios.ts` (no credentials needed)

Both paths converge at the same success/error UI.

### Spec sources

- Spec 67 L505-558 — P6 Other accounts heads-up + post-bank accounts section
- Spec 67 §Gap 1 L86-103 — bridge examples (what pre-signup state maps to)
- `src/lib/bank/` — existing implementation is the primary reference
- CLAUDE.md §Key files — stable libraries list confirms these are "preserve across rebuild"

### Journey wiring

Per `docs/journey-sequence.md`:
- Inbound: moment-2-profiling (P6 "Got it — let's connect" CTA)
- Outbound: hub / section-confirm (post-connect dashboard)

### Secondary priorities (if time allows)

| # | Priority | Scope | Effort |
|---|---|---|---|
| 2 | Hub stub (#19 in journey-sequence) | Minimal hub landing wiring welcome-tour → build forms | Small |
| 3 | 4 remaining bank-rec forms (#24-27) | Canvas-port from mobile-screens-v2 | Small each |
| 4 | Merge/PR management for this branch | 5+ commits; may want to squash or PR | Tiny |

## Current state

- **Branch:** `claude/intelligent-faraday-eDatJ` (5 commits ahead of main, 0 behind)
- **Test suite:** 976/976 passing
- **Registry:** 3 rows updated this session (safeguarding, moment-1, moment-2)
- **Journey sequence:** Stage 4 COMPLETE, Stage 5 READY, Stages 6-9 mixed

## Negative constraints

- Do NOT treat `src/lib/bank/` code as "discarded V2" — it is explicitly in the CLAUDE.md stable-libraries list
- Do NOT rebuild the Tink integration from scratch — wrap it in prototype UI
- Do NOT skip dev-mode path — live Tink credentials may not be available in all environments
- Do NOT change the callback route's postMessage contract — other consumers may depend on it

## Key files for next session

```
Primary build targets
src/lib/bank/tink-client.ts                         — Tink API client (PRESERVE)
src/lib/bank/tink-transformer.ts                    — Tink → extraction (PRESERVE)
src/lib/bank/test-scenarios.ts                      — 5 synthetic scenarios (USE)
src/app/api/bank/connect/route.ts                   — Tink Link URL gen (PRESERVE)
src/app/api/bank/callback/route.ts                  — Callback pipeline (PRESERVE)

New files to create
src/app/dev/proto/bank-connect/page.tsx              — Bank connection prototype
src/app/dev/proto/bank-connect/_components/          — UI components
tests/unit/proto-bank-connect/                       — Tests

Reference
docs/journey-sequence.md                             — Journey checklist (update Stage 5)
docs/workspace-spec/67-post-signup-profiling-progress.md  — Spec source (L505-558)
src/app/dev/proto/registry.ts                        — Registry updates
```
