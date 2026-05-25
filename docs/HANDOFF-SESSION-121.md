# HANDOFF-SESSION-121

**Date:** 2026-05-24
**Branch:** `claude/intelligent-faraday-eDatJ`
**Commits:** 21 ahead of main (59ad397..9625651)
**Tests:** 1037/1037 passing, typecheck clean

## What happened

Major session building the end-to-end signed-in prototype journey from safeguarding through to Your Picture, plus wiring the full dynamic data pipeline.

### Screens built (11 new pages)

1. **Safeguarding signposting** — crisis helplines (spec 67 L813-845)
2. **Moment 1 acknowledgement** — post-signup recap (spec 67 L86-121)
3. **Moment 2 profiling** — 8-screen pre-bank flow (property, self-employment, pensions, CETV)
4. **Bank connect** — Tink Link + 5 dev-mode test scenarios + data source picker
5. **Extraction results** — "Here's what we found" with 7 spec-22 sections, confidence badges
6. **Section-confirm hub** — 7-section layout with dynamic question counts
7. **Dynamic /section-confirm/[section]** — real ConfirmationStep questions per section
8. **4 bank-rec form patterns** — manual-entry, resolve-duplicate, split, balance-check
9. **Your Picture** — 3-column layout (TOC + §-numbered body + snapshot/data/todos rails)
10. **Analysing animation** — 5-step AI processing between bank connect and extraction results

### Architecture delivered

- **BankDataProvider context** — stores scenario/extraction data, generates section steps + summaries from `confirmation-questions.ts` and `bank-data-utils.ts`
- **ProfilingProvider context** — stores moment-2 answers, feeds into confirmation engine (business section skipped when selfEmployment=neither)
- **Live Tink wiring** — `loadExtractions()` accepts raw `BankStatementExtraction[]` from Tink postMessage handler
- **showWhen filtering** — 46 conditional questions now branch correctly based on user answers
- **Dynamic data flow** — all 5 test scenarios + live Tink produce different extraction results, confirmation questions, and Your Picture data

### Journey wiring

```
welcome-tour → safeguarding → moment-1 → moment-2 → bank-connect
  → analysing animation → extraction-results → section-confirm hub
  → /section-confirm/[section] (dynamic per section) → your-picture
  → share-flow
```

### Fixes applied

- Removed stale "not yet built" stub on bank-connect
- Section-confirm forms made responsive (mobile-only → desktop-friendly)
- Confirm-recurring data: Octopus Energy → Halifax Mortgage (Sarah scenario)
- Categorise data: amount corrected, AI tip references Barclays + Jack
- Hub nav updated with correct flow order
- Registry + journey-sequence updated (64 rows, build section: 11)

## What went well

- The existing bank libraries (`confirmation-questions.ts`, `bank-data-utils.ts`, `signal-rules/`, `test-scenarios.ts`) are production-quality and wired in cleanly — no new logic needed, pure plumbing
- `showWhen` filtering fixed a fundamental UX bug where all 46 conditional questions showed linearly
- 5 test scenarios provide genuinely different flows (Sarah=employed homeowner, Marcus=self-employed renter, etc.)

## What could improve

- The individual form pattern pages (categorise, confirm-recurring, etc.) at static routes still exist with semi-hardcoded data — they're now redundant since `/section-confirm/[section]` handles the real flow. Could remove or demote to a "pattern library" section
- AI tips in section-confirm forms are still hardcoded strings (tracked as E-10)
- Profiling context stores answers but only the business-section-skip is wired as engine behaviour — more profiling→engine bridges could be added (mortgage provider matching, pension provider pre-fill)

## Key decisions

- **Dynamic routes over static forms** — `/section-confirm/[section]` reads real `ConfirmationStep` data from context instead of 6 separate hardcoded form pages
- **Context-driven data** — all downstream pages (extraction-results, section-confirm, your-picture) derive from `BankDataProvider` rather than hardcoded constants
- **ProfilingProvider wraps BankDataProvider** in layout — profiling answers available to the engine before bank data arrives

## Bugs found and fixed

- **showWhen conditions ignored** — all questions showed regardless of prior answers; fixed with `shouldShow()` filter + answer tracking
- **Bank-connect stub text** — "This flow is not yet built" persisted after extraction-results was built; removed
- **Section-confirm forms mobile-only** — `height: 100vh` + `overflow: hidden` broke desktop; switched to `minHeight: 100vh`
- **Registry count mismatch** — tests expected 63 rows but extraction-results added a 64th; updated

## Files changed (key)

```
New files:
  src/app/dev/proto/_context/bank-data-context.tsx
  src/app/dev/proto/_context/profiling-context.tsx
  src/app/dev/proto/layout.tsx
  src/app/dev/proto/extraction-results/page.tsx
  src/app/dev/proto/section-confirm/[section]/page.tsx
  src/app/dev/proto/your-picture/page.tsx
  src/app/dev/proto/safeguarding-signposting/page.tsx
  src/app/dev/proto/moment-1-ack/page.tsx
  src/app/dev/proto/moment-2-profiling/page.tsx
  src/app/dev/proto/bank-connect/page.tsx (rewritten)

Modified:
  src/app/dev/proto/section-confirm/page.tsx (refactored to 7-section hub)
  src/app/dev/proto/page.tsx (hub nav)
  src/app/dev/proto/registry.ts (64 rows)
  docs/journey-sequence.md (updated statuses + E-10)
```

## Next session priorities

1. **Test the full flow end-to-end** in browser with different scenarios (Marcus, Jean, Aisha) — verify showWhen branching works for each persona
2. **CP-1: Sign-up canvas-port** — the gap before welcome-tour in the journey
3. **CP-2: Hub stub** — minimal hub landing with section links
4. **Consider removing static form pages** — categorise, confirm-recurring etc. at static routes are now redundant
5. **Deepen profiling→engine bridges** — mortgage provider matching, pension provider pre-fill from moment-2 answers
