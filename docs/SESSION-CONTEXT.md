# Session 122 Context Block

## Session 121 accomplishments

Session 121 built the full signed-in prototype journey from safeguarding through to Your Picture, plus wired the dynamic data pipeline connecting profiling → bank connect → extraction → confirmation → picture. Branch: `claude/intelligent-faraday-eDatJ` (21 ahead of main).

### What shipped

| Deliverable | Tests | Key files |
|---|---|---|
| Bank connect (5 scenarios + live Tink + data source picker) | 12 | `src/app/dev/proto/bank-connect/page.tsx` |
| Analysing animation (5-step AI processing) | — | bank-connect AnalysingView |
| Extraction results ("Here's what we found", 7 sections) | 6 | `src/app/dev/proto/extraction-results/page.tsx` |
| Section-confirm hub (7-section, dynamic question counts) | 6 | `src/app/dev/proto/section-confirm/page.tsx` |
| Dynamic /section-confirm/[section] with showWhen filtering | 4 | `src/app/dev/proto/section-confirm/[section]/page.tsx` |
| 4 bank-rec form patterns (manual-entry, resolve-duplicate, split, balance-check) | 18 | `src/app/dev/proto/section-confirm/*/page.tsx` |
| Your Picture (3-column, dynamic from context) | 5 | `src/app/dev/proto/your-picture/page.tsx` |
| BankDataProvider context (5 scenarios + Tink) | 6 | `src/app/dev/proto/_context/bank-data-context.tsx` |
| ProfilingProvider context (moment-2 → engine) | 4 | `src/app/dev/proto/_context/profiling-context.tsx` |
| Proto layout (providers wrapping all pages) | 2 | `src/app/dev/proto/layout.tsx` |
| Responsive fixes on all 6 section-confirm forms | — | `src/app/dev/proto/section-confirm/*/page.tsx` |
| Journey wiring end-to-end | — | All proto pages + hub nav |

1037/1037 full suite; typecheck clean.

### Architecture delivered

- **BankDataProvider** — stores scenario/extraction data, calls `generateSectionSteps()` + `generateSectionSummary()` from existing stable bank libraries
- **ProfilingProvider** — stores moment-2 answers (property, self-employment, pensions), feeds into confirmation engine
- **showWhen filtering** — 46 conditional questions branch correctly based on user answers
- **Live Tink** — `loadExtractions()` accepts raw `BankStatementExtraction[]` from postMessage handler
- **5 test scenarios** produce different flows: Sarah (employed homeowner), Marcus (self-employed renter), Jean (retired), Aisha (part-time benefits), David (high earner)

### Full journey chain

```
welcome-tour → safeguarding → moment-1 → moment-2 → bank-connect
  → analysing animation → extraction-results → section-confirm hub
  → /section-confirm/[section] → your-picture → share-flow
```

## Current state

- Branch `claude/intelligent-faraday-eDatJ`, 21 ahead of main, tree clean
- 1037 tests across 137 files
- Registry: 64 rows across 11 sections
- Data flows end-to-end: profiling → bank connect → extraction → confirm → picture
- Tink integration live (requires env vars in Vercel)

## Prioritised deliverables for next session

1. **Browser test the full flow** with different scenarios (Marcus, Jean, Aisha) — verify showWhen branching + different data per persona
2. **CP-1: Sign-up canvas-port (#7)** — gap before welcome-tour in the journey
3. **CP-2: Hub stub (#19)** — minimal hub landing with section links
4. **Consider removing static form pages** — categorise, confirm-recurring etc. at static routes are redundant since /section-confirm/[section] handles real flow
5. **Deepen profiling→engine bridges** — mortgage provider matching, pension provider pre-fill

## Enhancement backlog

| # | What | Effort |
|---|------|--------|
| E-1–E-9 | Canvas-ports (FAQ, sign-in, todos), joint doc, settlement redline, pre-flight, trust band, reconcile states | Small–Medium |
| E-10 | Live AI tips in section-confirm forms (Anthropic API) | Medium |

## Negative constraints

- Do NOT delete the 6 static form pattern pages without user approval — they may serve as a pattern library
- AI tips remain hardcoded strings (E-10 backlog)
- ProfilingProvider only wires business-section-skip so far — more bridges deferred

## Key files

```
Context + layout
src/app/dev/proto/_context/bank-data-context.tsx    — BankDataProvider (scenarios + Tink + engine)
src/app/dev/proto/_context/profiling-context.tsx     — ProfilingProvider (moment-2 answers)
src/app/dev/proto/layout.tsx                         — Wraps all proto pages with both providers

Journey pages (in order)
src/app/dev/proto/safeguarding-signposting/page.tsx
src/app/dev/proto/moment-1-ack/page.tsx
src/app/dev/proto/moment-2-profiling/page.tsx
src/app/dev/proto/bank-connect/page.tsx
src/app/dev/proto/extraction-results/page.tsx
src/app/dev/proto/section-confirm/page.tsx           — 7-section hub
src/app/dev/proto/section-confirm/[section]/page.tsx — Dynamic confirmation per section
src/app/dev/proto/your-picture/page.tsx              — 3-column financial picture

Stable bank libraries (unchanged, wired in)
src/lib/bank/confirmation-questions.ts               — 1998 lines, spec 22 decision trees
src/lib/bank/bank-data-utils.ts                      — Extraction → UI types
src/lib/bank/test-scenarios.ts                        — 5 scenarios
src/lib/bank/signal-rules/                            — 17 rules

Tracking
docs/journey-sequence.md                              — 64-row checklist + E-10 backlog
```

## Branch

`claude/intelligent-faraday-eDatJ` — 21 ahead of main
