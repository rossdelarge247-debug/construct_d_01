# Session 5 Handoff

**Date:** 11 April 2026
**Branch:** `claude/new-session-GUZLb`
**Lines changed:** ~282 (well within 2,000 limit)

---

## What happened this session

### Diagnosis: 504 root cause identified and fixed

The pipeline 504 on Vercel was caused by using the **OpenAI API format** (`response_format`) instead of the **Anthropic SDK format** (`output_config`) for structured outputs.

**The bug:** `pipeline.ts` Step 2 (Sonnet analysis) passed:
```typescript
response_format: {
  type: 'json_schema',
  json_schema: { name: '...', schema, strict: true }
}
```

**The fix:** Replaced with the correct Anthropic SDK 0.85 format:
```typescript
output_config: {
  format: {
    type: 'json_schema',
    schema,
  }
}
```

**Evidence:** Grepped the entire `@anthropic-ai/sdk` package (0.85.0) — zero references to `response_format`. The SDK exports `OutputConfig` with `format?: JSONOutputFormat` where `JSONOutputFormat` is `{ type: 'json_schema', schema: {...} }`. The `response_format` parameter is OpenAI-specific and was never supported.

**Impact:** Fixed all 3 occurrences across `extractFromPDF`, `extractFromImage`, and `extractFromText`. TypeScript compiles clean with the correct types.

### Isolation test endpoint added

Created `/api/test-pipeline` to test Step 1 (Haiku classification) and Step 2 (Sonnet structured output) independently:
- `GET /api/test-pipeline` — tests both steps with sample bank statement text
- `GET /api/test-pipeline?step=1` — tests only Haiku classification
- `GET /api/test-pipeline?step=2` — tests only Sonnet structured output with `output_config`
- `POST /api/test-pipeline` — tests Haiku PDF reading with an uploaded file

This follows Session 3's retro recommendation: "Create isolation tests for external dependencies."

### Visual quality pass started (spec 18)

1. **Processing animation replaced** — removed the purple diamond sparkle animation (whimsical, not matching spec 18). Replaced with Option C: a thin indeterminate progress line that sweeps across the hero panel. "Competent and measured, not magical or whimsical."

2. **Typography fixes:**
   - Hero heading: `text-lg` (18px) → `text-2xl` (24px) with -0.01em tracking (spec 18: hero-heading)
   - Page title: `text-lg` (18px) → `text-[28px]` with -0.02em tracking (spec 18: page-title)
   - Title bar height: `h-14` (56px) → explicit `var(--title-bar-height)` (56px)
   - Body subtitle: `text-sm` → `text-[15px]` (spec 18: body)

3. **Button fixes:**
   - Primary CTAs: `px-5 py-2.5 text-sm` → `px-6 py-3 text-[15px]` (spec 18: 12px 24px, 15px/600)
   - "Share & collaborate" pill: `text-xs px-4 py-1.5` → `text-[13px] px-5 py-2` with `rounded-[var(--radius-pill)]`
   - Links: `text-xs` → `text-[13px]` for "Manually input" and "Review details" (spec 18: small = 13px)

4. **Section card spacing:** `space-y-4` → `space-y-4 sm:space-y-8` (spec 18: 32px desktop, 16px mobile)

---

## What was NOT done

1. **Vercel deployment and end-to-end test** — the pipeline fix needs deploying to Vercel and testing with a real PDF upload. The isolation test endpoint (`/api/test-pipeline`) can verify each step independently.

2. **Full visual quality pass** — only high-impact items were fixed. Remaining spec 18 work:
   - Evidence lozenges need styling audit (slate-700 background, white text, micro 11px)
   - Discovery flow typography and spacing
   - Drag-and-drop zone min-height (200px per spec)
   - Info boxes (blue-50/amber-50 with 3px left border)
   - Radio/checkbox hit targets (44px per spec)

3. **Session 3's remaining backlog** — spec 14 wizards, section card actions, cross-document intelligence

---

## Key decisions

1. **`output_config.format` not `response_format`** — this is the correct Anthropic SDK pattern. Session 3 identified this as an unknown but never tested it in isolation.

2. **Indeterminate progress line** — chose Option C from spec 18 over typing dots (Option B). The line is minimal, competent, and doesn't compete with the contextual processing messages below it.

3. **Test endpoint kept simple** — `/api/test-pipeline` uses a hardcoded sample bank statement for GET requests. POST accepts a real file. No authentication required — this is a diagnostic endpoint.

---

## Session discipline metrics

- **Lines changed:** ~282 (36 modified + 160 new + 86 deleted)
- **Files touched:** 6 (pipeline.ts, globals.css, hero-panel.tsx, section-cards.tsx, title-bar.tsx, test-pipeline/route.ts)
- **TypeScript errors:** 0
- **Commits:** Will be 1 atomic commit

---

## Priority for next session

### P0: Deploy and verify pipeline fix

1. Push to branch, let Vercel auto-deploy
2. Hit `/api/test-pipeline` on the deployed URL — verify Step 1 and Step 2 both return `status: "ok"`
3. Hit `/api/test-pipeline?step=2` specifically — this was the broken path
4. Upload a real PDF via the workspace UI and verify the full flow works end-to-end

### P1: Complete visual quality pass

5. Evidence lozenge styling (spec 18 section 4)
6. Discovery flow typography and spacing
7. Drag-and-drop zone (200px min-height, 2px dashed grey-200 border)
8. Info boxes for advisory messages
9. Focus states and accessibility (spec 18 section 7)

### P2: Pipeline quality iteration

10. Upload real documents and evaluate extraction quality
11. Tune extraction prompts based on real output
12. Verify confidence thresholds (0.95/0.80) produce good tier splits

### P3: Section card actions

13. Wire `openManualInput` — spec 14 wizard flows
14. Wire `openSectionReview` — review details modal
15. Wire `addSection` — section picker for adding missed sections
