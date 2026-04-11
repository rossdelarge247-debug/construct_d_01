# Session 5 Handoff

**Date:** 11 April 2026
**Branch:** `claude/new-session-GUZLb`
**Commits:** 9
**Lines changed:** ~890 code + ~275 spec/docs

---

## What happened this session

### The pipeline blocker (Sessions 3-4) is resolved

The two-step AI pipeline (Haiku reads PDF → Sonnet analyses text) now works end-to-end with real PDFs on Vercel. A real bank statement was uploaded, processed, and items appeared in section cards.

### Root causes found and fixed

**504 #1 — Wrong API parameter:**
`response_format` (OpenAI API pattern) was used instead of `output_config` (Anthropic SDK 0.85). Grepped the entire SDK — zero references to `response_format`. Fixed across all 3 pipeline paths.

**504 #2 — Schema validation:**
Anthropic's structured outputs require `additionalProperties: false` on every `type: 'object'` in the JSON schema. Added to all 18 object definitions.

**504 #3 — Timeouts too aggressive:**
SDK timeout was 45s per call — real PDFs take 30-60s for Haiku to read. Route `maxDuration` was 120s — total pipeline time is ~80s for a real PDF. Fixed: SDK 90s, route 300s.

**500 — Transform crash:**
After pipeline succeeded, `transformExtractionResult` could crash and Vercel returned HTML 500 instead of JSON. Added defensive try/catch with stack trace logging.

**200 but unparseable — Stream consumed:**
Client called `response.json()` which consumed the body stream. On failure, `response.text()` returned empty. Fixed: read as text first, then `JSON.parse`.

**Section cards empty — Two bugs:**
1. `acceptAutoConfirm` matched items by label text (which differed). Fixed: match by ID prefix.
2. Transformer only created `financialItems` for income, not payments or accounts. Fixed: all auto-confirmed data now creates section card items.

### Performance improvement

Removed AI-generated reasoning, clarification questions, and gap analysis from the extraction schema. These are now generated deterministically by app code using spec 13 decision trees.

| Metric | Before | After |
|--------|--------|-------|
| Step 2 output tokens | 989 | 435 |
| Step 2 latency | 70s | 33s |
| Step 2 input tokens | 1,940 | 1,610 |
| Question generation | AI (variable) | App code (deterministic) |

### Real PDF test results

Uploaded a real NatWest Premier current account statement:
- Step 1 (Haiku): 52.9s, 23,866 input / 5,805 output tokens, 16,774 chars extracted
- Step 2 (Sonnet): 26.7s, 6,944 input / 1,718 output tokens, 27 items extracted
- 5 auto-confirm items, 12 clarification questions, financial items created
- Section cards populated with income, accounts, spending data

### Visual quality pass (spec 18)

- Processing animation: sparkle diamonds → indeterminate progress line
- Hero heading: 18px → 24px, page title: 18px → 28px
- Primary CTA padding: 10px/20px → 12px/24px
- Section card gap: 16px → 32px desktop
- Link text: 12px → 13px
- Lozenge flyout: raw AI description → clean summary

### Spec 19 written

Based on real testing feedback, spec'd three improvements:
1. Keyword lookup table — match payee names to Form E categories
2. Payment aggregation — group multiple payments from same source
3. Progressive category dropdown — Form E budget categories for unknowns

---

## Retrospective

### What went well

- **Diagnose before fixing worked.** Grepping the SDK for `response_format` found the root cause in minutes. Previous sessions spent 5 deploy cycles guessing model IDs.
- **Test endpoint paid off.** `/api/test-pipeline` isolated Step 1 and Step 2 independently, confirming the `additionalProperties` fix before touching the full pipeline.
- **Schema slimming was the right call.** 52% latency reduction by removing fields the app generates better than the AI.
- **Real PDF testing found real bugs.** Section cards empty, lozenge verbosity, detail text repetition — none visible without a real document.

### What could improve

- **Should have tested with a real PDF earlier.** The test endpoint uses sample text — the real PDF path had different failure modes (large base64, long Haiku processing, transform crashes).
- **The response parsing bug was avoidable.** `response.json()` consuming the stream is a known fetch API gotcha — should have used text-first parsing from the start.
- **Transform error handling should have been defensive from day one.** A try/catch around `transformExtractionResult` would have shown the actual error instead of Vercel's generic 500.

---

## Key decisions

1. **`output_config.format` not `response_format`** — Anthropic SDK 0.85 pattern
2. **AI extracts facts, app generates questions** — spec 13 decision trees in result-transformer.ts
3. **90s SDK timeout, 300s maxDuration** — real PDFs need this headroom
4. **Read response as text first, then JSON.parse** — avoids stream-consumed bug
5. **Financial items created for ALL auto-confirmed data** — not just income

---

## Priority for next session

1. **P0: Keyword lookup table** — string match in transformer, ~100 lines
2. **P1: Payment aggregation** — group by normalised payee, ~150 lines
3. **P3: Answered questions → financial items** — complete the data flow
4. **P2: Progressive category dropdown** — new component for unknowns
5. **P4: Visual quality pass** — remaining spec 18 items
