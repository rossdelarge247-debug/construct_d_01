# Session 4 Review: Handoff Assessment & Recommendations

**Date:** 11 April 2026
**Reviewer:** Chat 4 (independent review session)
**Branch:** `claude/review-handoff-session-4-8Isd9`
**Source:** `docs/HANDOFF.md` (Session 3), `docs/v2/V2-HANDOFF.md` (Session 2)

---

## 1. Retro Verdict: The Session 3 Self-Assessment Is Accurate

The handoff's retro is honest and correct. Here's each point validated against the code:

### 1.1 "Jumped to fixes before diagnosing"

**Confirmed.** The git log tells the story:

```
888494c  Model fallback chain: sonnet-4-6 -> sonnet-4-5 -> 3-5-sonnet -> haiku
edf1788  Switch back to Haiku — Sonnet model ID was timing out
e466ddf  Correct Sonnet model ID + bump maxDuration to 120s
50af9a7  Use Haiku 4.5 (confirmed working with PDF document type)
```

Four commits trying model IDs in sequence. The console.log instrumentation was *already in the code* — `document-analysis.ts` has 11 log statements that would have shown exactly which model worked and which didn't. But nobody checked the Vercel function logs before changing code. The fix should have been: read logs, identify the exact failure line, make one change.

### 1.2 "Round-tripped through 5 deploy cycles on the model ID issue"

**Confirmed.** The commits above plus `ef8427d` (Sonnet model + sparkle animation in one commit) and `653ca08` (Haiku for Hobby timeout) show at least 6 deploy-test cycles on what was fundamentally one question: *which model ID works with PDF document type?*

The health check idea was right. A `/api/health` endpoint that calls `messages.create` with a tiny prompt and logs the model ID would have answered this in one deploy.

### 1.3 "Rebuilt the animation three times"

**Confirmed.** The sparkle/processing animation appears across multiple commits (`ef8427d`, `6e76b15`, visual polish commits). The handoff notes user feedback: "no magical sparkling that I could see." The animation is still flagged as too subtle in the known issues (HANDOFF.md, item 8).

This is a visual direction problem, not a code problem. The fix is a 2-minute conversation about what "premium AI thinking" looks like before writing CSS.

### 1.4 "Built features while the pipeline was broken"

**Confirmed.** The commit history shows feature work (first-time wizard, category tabs, CETV tracker, manual entry modal, document review modal, summary tab) interleaved with pipeline debugging. The most generous reading: the feature work was parallelizable. The honest reading: energy went into building rooms in a house with no foundation.

### 1.5 "Didn't check the handoff's known issues first"

**Confirmed.** The V2-HANDOFF.md (Session 2) explicitly lists:
- Model availability as known issue #1
- `AI_DRY_RUN` behaviour as known issue #2
- `maxDuration` as known issue #3

All three became time sinks in Session 3.

---

## 2. Current State of the Critical Path

The critical path is: **Upload PDF -> AI extracts -> Tiered questions -> User confirms -> Items in workspace**

### 2.1 What Works

| Stage | Status | Evidence |
|-------|--------|----------|
| File upload (drag/drop, file select) | Working | `document-upload.tsx` handles PDF/image/text |
| Base64 encoding & API submission | Working | `route.ts` lines 38-67, 10MB limit enforced |
| Haiku 4.5 PDF analysis | Working (quality issues) | Model `claude-haiku-4-5-20251001` confirmed |
| JSON parsing with repair fallback | Working | 3-tier repair in `document-analysis.ts` |
| Tiered question UI | Working | Step-through dialogue in `ai-analysis.tsx` |
| Auto-advance past auto items | Working | Fixed in `47c18ac` |
| Items added to workspace | Working | `handleAnalysisComplete` in `build/page.tsx` |

### 2.2 What Doesn't Work or Is Missing

| Issue | Severity | Location |
|-------|----------|----------|
| **504 on Vercel not diagnosed** | P0 | Need Vercel function logs for `/api/documents/extract` |
| Extraction quality is shallow | P1 | Haiku misses items, hallucinated a 13k asset |
| Questions are generic, not domain-aware | P1 | AI prompt doesn't use spec 11's 8-domain mapping |
| "Something wrong?" button does nothing | P2 | `ai-analysis.tsx` — button exists, no handler |
| No PDF side-by-side review | P2 | Spec 09 — not started |
| No celebration on completion | P3 | Spec 09 — no green flash, no count-up |
| No document storage | P2 | PDFs sent to AI but not persisted |
| No cross-document intelligence | P3 | Each upload analysed in isolation |

### 2.3 The 504 Question

The handoff's top recommendation is correct: **check Vercel function logs before touching code.**

The console.log statements in the pipeline will reveal exactly where the function dies:

```
[Upload] File: ${fileName}, type: ${fileType}, size: ${size}KB     <- route.ts:29
[Upload] PDF base64: ${base64Size}KB                                <- route.ts:43
[AI Direct Analysis] Using claude-haiku-4-5-20251001                <- document-analysis.ts:134
[AI Direct Analysis] Tokens: ${in} in, ${out} out                  <- document-analysis.ts:149
[Analysis] PDF direct: ${items.length} items                        <- route.ts:47
```

If the logs show the function reaching `[AI Direct Analysis] Using...` but never reaching `Tokens:`, the Anthropic API call is timing out. If it never reaches `[Upload] PDF base64:`, the file encoding is the problem. If it reaches `Tokens:` but not `PDF direct:`, JSON parsing is failing.

**Do not guess. Read the logs.**

---

## 3. Architecture Assessment

### 3.1 Strengths

1. **Single-call PDF analysis** — sending base64 directly to Claude avoids multi-call timeout risk. This was the right call.
2. **Provider abstraction** — `provider.ts` cleanly separates model routing from business logic. Supports future two-step (Haiku reads, Sonnet analyses).
3. **Smart dry-run** — only activates when `AI_DRY_RUN=true` AND no API key. Won't accidentally mock on production.
4. **JSON repair strategy** — 3-tier fallback for truncated responses is defensive and practical.
5. **Controlled component state** — `analysisResultRef` prevents state loss on tab switches. Good React pattern.
6. **Comprehensive logging** — 11 log statements in the AI pipeline. The debugging infrastructure exists; it just wasn't used.

### 3.2 Risks

1. **No SDK-level timeout** — Anthropic SDK defaults to ~5 minutes, but Vercel kills at 120s. Adding `timeout: 90000` to the SDK client would give a clean error instead of a 504.
2. **4096 max_tokens cap** — sufficient for 20-30 items but will truncate complex documents. The repair logic handles this, but raising to 8192 (with the repair as safety net) would be safer.
3. **No streaming** — full response must complete before anything shows. For a 3-8s Haiku call this is fine, but a two-step Haiku+Sonnet approach (15-30s) would benefit from streaming to show progressive results.
4. **localStorage only** — fine for now, but data loss on browser clear. The Supabase schema is ready; wiring it in is medium effort.
5. **Zero tests** — Vitest installed, zero test files. The pipeline's JSON parsing and repair logic are prime candidates for unit tests.

### 3.3 Spec Coverage

| Spec | Implementation | Gap |
|------|---------------|-----|
| 05b (Build Your Picture) | 90% | Upload at page level vs per-tab (deliberate, arguably better) |
| 09 (Upload & Review) | 30% | Review panel, per-item confirm, celebration, PDF modal all missing |
| 10 (AI-Led Analysis) | 20% | Domain-first architecture absent; flat tiered items instead |
| 10b (Tiered Questions) | 85% | Core flow works; correction button is a stub |
| 11 (AI Question Mapping) | 5% | 8-domain intelligence exists on paper, not in the AI prompt |
| 12 (Two-Tier Tabs) | 95% | Working well |

**The biggest gap is between specs 10/11 and the implementation.** The specs describe a domain-aware AI that reasons like a financial analyst. The implementation sends a generic prompt and gets generic results. This is the root cause of the "shallow extraction" and "basic questions" quality issues.

---

## 4. Recommendations for Session 5

### Phase 1: Diagnose Before Fixing (30 minutes)

1. **Check Vercel function logs** for the `/api/documents/extract` endpoint. Look for the console.log breadcrumbs. Identify exactly which line the 504 dies at.
2. **Check the Anthropic API key** is set in Vercel environment variables. The code logs `[API] ANTHROPIC_API_KEY is not set` if it's missing — look for this.
3. **Upload a small test PDF** (1-2 pages) to the deployed site and watch the logs in real time.

### Phase 2: One Targeted Fix (1-2 hours)

Based on what the logs show:

- **If the API key is missing/wrong**: Set it in Vercel, redeploy, done.
- **If the Anthropic call times out**: Add `timeout: 90000` to the SDK client in `provider.ts`. This gives a clean error at 90s instead of a Vercel 504 at 120s.
- **If JSON parsing fails**: The repair logic should handle this — check if it's being reached. May need to bump `max_tokens` from 4096.
- **If the function never starts**: Check Vercel function size limits, cold start times.

### Phase 3: Quality Upgrade — Two-Step Analysis (2-3 hours)

Once the pipeline reliably returns results:

1. **Step 1**: Haiku reads the PDF and extracts raw text + structure (what it's good at)
2. **Step 2**: Sonnet analyses the extracted text using the domain-aware prompt from spec 11

This is the single highest-impact change for extraction quality. Haiku is fast but shallow. Sonnet can't read PDFs directly but can reason deeply about text. Together they solve both problems.

Implementation sketch:
```
route.ts:
  1. Send PDF to Haiku with "extract all text and structure" prompt
  2. Take Haiku's text output
  3. Send text to Sonnet with the full domain-aware analysis prompt
  4. Return Sonnet's structured JSON
```

The 120s Vercel timeout gives room for both calls (Haiku: 3-8s, Sonnet: 15-30s).

### Phase 4: Domain-Aware Prompt (2-3 hours)

Rewrite the analysis prompt in `document-analysis.ts` to incorporate spec 11's 8-domain mapping:

- Income signals -> income questions
- Account structure -> account questions
- Spending patterns -> spending questions
- Commitments -> commitment questions
- Property indicators -> property questions
- Pension references -> pension questions
- Debt signals -> debt questions
- Anomalies -> targeted follow-ups

This transforms the AI from "extract some numbers" to "reason like a financial analyst about what this document reveals."

### Phase 5: Write Tests for the Pipeline (1 hour)

Priority test targets:
- `parseAnalysisResponse()` — test with valid JSON, truncated JSON, markdown-wrapped JSON
- `repairTruncatedJson()` — test with various truncation points
- `DOC_TYPE_TO_CATEGORY` mapping — test all document types route correctly
- Mock API responses to test the full upload->parse->display flow

### Do NOT Do Yet

- PDF side-by-side modal (spec 09) — requires document storage, PDF viewer component, significant effort. Park it.
- Supabase persistence — localStorage is fine for now. Don't add complexity while the pipeline is unstable.
- V1 data wiring — V2 needs to work standalone first.
- Cross-document intelligence — single-document quality must improve first.
- More animation work — agree on visual direction before building.

---

## 5. File Quick Reference

### Must-read files for the next session

```
src/app/api/documents/extract/route.ts      <- API entry point (120s timeout, 11 console.logs)
src/lib/ai/document-analysis.ts              <- AI prompt + JSON repair (the code to upgrade)
src/lib/ai/provider.ts                       <- Model routing (add SDK timeout here)
src/app/workspace/build/page.tsx             <- Page orchestrator (category mapping)
docs/workspace-spec/11-ai-question-mapping.md <- 8-domain intelligence spec (not yet in code)
```

### Don't-need-to-read files

The V1 interview flow, design system, sidebar, future phase pages, and most workspace UI components are stable and working. Don't read them unless specifically debugging a UI issue.

---

## 6. Summary

The Session 3 retro is accurate and self-aware. The project has a solid architecture, good logging infrastructure, and well-written specs. The problems are process problems, not code problems:

1. **The pipeline wasn't diagnosed before being "fixed"** — resulting in 5+ wasted deploy cycles
2. **Features were built on an unverified foundation** — the AI pipeline should have been proven working end-to-end before building the wizard, CETV tracker, etc.
3. **The AI prompt is generic** — the detailed 8-domain intelligence spec (11) exists but isn't driving the code

The path forward is clear: diagnose the 504 from logs, make one informed fix, then upgrade to two-step (Haiku+Sonnet) with the domain-aware prompt. Everything else is polish on top of a working pipeline.
