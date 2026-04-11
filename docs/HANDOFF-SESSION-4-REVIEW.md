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

## 2. Full Documentation Audit

I've read every document in the `docs/` directory. Here are the findings that change or deepen the picture.

### 2.1 Spec Evolution: The Page Model Has Been Revised Three Times

The workspace page model evolved through three specs, and the older ones were never formally deprecated:

| Spec | Model | Status |
|------|-------|--------|
| **05** (Build Your Picture) | Card grid of categories, click to navigate to `/workspace/build/{category}` | **Superseded by 05b** |
| **05b** (Revised) | Tabbed interface, all work happens inline within tabs, no page navigation | **Current design** |
| **12** (Two-Tier Tabs) | Adds page-level tabs (Preparation/Summary) above the category tabs | **Latest refinement** |

**Spec 06 (Category Detail)** describes a `/workspace/build/{category}` detail page that is now unnecessary under the tabbed model. It should be considered obsolete.

**The implementation follows 05b + 12** — this is correct. But anyone reading the docs linearly will be confused by the superseded specs.

### 2.2 Spec 10 vs 10b: Two Competing Analysis Models

These specs directly contradict each other:

- **Spec 10** describes domain-by-domain analysis with staggered domain cards, branching questions, and ~30 signal-question pairs per document type. This is ambitious and complex.
- **Spec 10b** describes tiered confidence (auto/confirm/question/gap) with only 3-5 user taps per document. This is pragmatic and buildable.

**10b explicitly calls out 10's problems**: the domain approach risks "overwhelming, feels like a form." The implementation correctly follows 10b. Spec 10 should be archived.

However, **spec 11 (AI Question Mapping) feeds into both**. The 8-domain intelligence and ~30 signal-question pairs from spec 11 should drive the AI prompt that generates the tiered results for 10b. The domain reasoning happens server-side in the prompt; the user sees the simplified 10b UI. This is the right architecture — it just hasn't been built yet.

### 2.3 Design System Drift: Serif Headings Were Dropped

The V1 visual design spec (`v1-visual-design.md`) specifies **Lora serif** for headings and Inter for body text. The handoff says the implementation uses **Inter only (no serif)**. This appears to be a deliberate decision during the V2 build ("bold 2026 aesthetic"), but it contradicts the original design direction. Worth confirming with the user whether the serif/sans split was intentionally abandoned.

### 2.4 The Confidence Model Is More Nuanced Than the Code Implements

The V1 specs define a four-state confidence model: **Known / Estimated / Unsure / Unknown**. Each state has distinct visual treatment and follow-up behaviour:

- **Known**: Sage green, no follow-up needed
- **Estimated**: Warm amber, confirm later
- **Unsure**: Soft lavender, priority to confirm
- **Unknown**: Muted grey, must be resolved before disclosure

The V2 workspace type system (`types/workspace.ts`) simplifies this to `'known' | 'estimated'` — losing the Unsure/Unknown distinction. This matters because the readiness scoring and Form E completeness checking should differentiate between "I gave a rough number" (Estimated) and "I have no idea" (Unknown).

### 2.5 Safeguarding Carries Through — But Isn't Wired

The desk research (`v1-desk-research.md`) found:
- 95% of domestic abuse cases involve economic abuse
- 72% of Refuge users report tech-facilitated abuse
- Post-separation financial abuse is common

V1 captures safeguarding flags (coercive control indicators, financial abuse indicators, device safety). The V2 specs say these should inform workspace behaviour — e.g. suppressing collaboration language, adjusting mediation recommendations, surfacing safety resources. **None of this wiring exists in V2 yet.** The flags are captured in V1 but not consumed in V2.

### 2.6 V1-to-V2 Data Flow Is Underspecified

Multiple documents reference the V1→V2 handoff:
- Vertical assessment: "V1 data import — pre-populate from interview session values and confidence map"
- v2-concept: "From your plan" card shows V1 estimates, user confirms or corrects
- 05b: First-time wizard includes "V1 playback" step

But **no spec details the actual field mapping** between V1 session data and V2 workspace items. How does a V1 "property value: Estimated" become a V2 financial item? Which V1 confidence states map to which V2 categories? This needs an implementation spec before the wiring can be built.

### 2.7 The Service Problem Space Document Is Critical Context

`docs/v2/service-problem-space.md` maps the entire as-is journey (7 stages) against pain points. Its key insight: **V2's data model is the foundation for everything downstream.** V3 (Disclose) consumes V2 data for Form E structure. V4 (Negotiate) consumes V2+V3 for proposals. V5 (Formalise) consumes all of it for consent orders.

If V2's data model is wrong — wrong categories, wrong confidence granularity, wrong item structure — every downstream vertical breaks. This elevates the importance of getting the `types/workspace.ts` data model right before building persistence.

### 2.8 Tensions and Open Questions in the Specs

| Tension | Between | Impact |
|---------|---------|--------|
| Upload location | Spec 09 (inline) vs implementation (page-level) | Low — page-level with smart routing is arguably better |
| Financial picture visibility | Spec 05b (always visible below) vs Spec 12 (Summary tab, separate mode) | Medium — should users see live updates while working? |
| Liability framing | "We organise, not verify" vs "brilliant assistant" language | Medium — user expectations vs legal exposure |
| Self-employment flow | Flagged in multiple specs, never detailed | High for affected users, low frequency |
| Mobile experience | Mentioned everywhere, specified nowhere in detail | Medium — needs a mobile spec pass |
| Async processing | "Upload in bulk, leave, come back" vs in-app-only notifications | Medium — how does user know extraction is done? |

### 2.9 Superseded Specs That Should Be Marked

| Spec | Superseded By | Action Needed |
|------|--------------|---------------|
| 05 (Build Your Picture) | 05b (Revised) | Add "SUPERSEDED" header |
| 06 (Category Detail) | 05b + 12 (tabbed inline model) | Add "SUPERSEDED" header |
| 10 (AI Analysis Flow) | 10b (Tiered Questions) | Add "SUPERSEDED" header |

---

## 3. Current State of the Critical Path

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

### Phase 6: Data Model Review (before Supabase persistence)

The documentation audit reveals the data model needs attention before persisting to Supabase:

1. **Restore the full confidence model**: `types/workspace.ts` only has `'known' | 'estimated'`. The specs define four states: Known / Estimated / Unsure / Unknown. The readiness scoring, Form E completeness, and V3+ disclosure all depend on distinguishing "rough estimate" from "no idea."

2. **Verify category alignment with Form E**: The `DOC_TYPE_TO_CATEGORY` mapping in `build/page.tsx` is basic. Cross-reference against the Form E section mapping in `v2-vertical-assessment.md` to ensure items will route correctly for disclosure output.

3. **Add source document linking**: Items need to reference which document they came from. This is prerequisite for the side-by-side review modal (spec 09) and for cross-document intelligence later.

### Do NOT Do Yet

- **PDF side-by-side modal** (spec 09) — requires document storage, PDF viewer component, significant effort. Park it.
- **Supabase persistence** — localStorage is fine for now, and the data model needs the fixes above first. Don't persist a wrong schema.
- **V1 data wiring** — V2 needs to work standalone first, and the V1→V2 field mapping needs an implementation spec.
- **Cross-document intelligence** — single-document quality must improve first.
- **More animation work** — agree on visual direction before building.
- **Mobile experience** — the specs don't detail mobile interactions enough. Needs a design pass before building.
- **Self-employment flow** — flagged in specs but never detailed. Needs a spec before building.
- **Safeguarding wiring** (V1 flags → V2 behaviour) — important but not blocking the critical path. Add after the pipeline is solid.

---

## 6. File Quick Reference

### Must-read files for the next session

```
src/app/api/documents/extract/route.ts        <- API entry point (120s timeout, 11 console.logs)
src/lib/ai/document-analysis.ts                <- AI prompt + JSON repair (the code to upgrade)
src/lib/ai/provider.ts                         <- Model routing (add SDK timeout here)
src/app/workspace/build/page.tsx               <- Page orchestrator (category mapping)
src/types/workspace.ts                         <- Data model (confidence states need expanding)
docs/workspace-spec/11-ai-question-mapping.md  <- 8-domain intelligence spec (not yet in code)
docs/workspace-spec/10b-ai-tiered-questions.md <- Tiered UI spec (mostly implemented)
```

### Context files (read if you need the "why")

```
docs/v2/service-problem-space.md               <- Why V2's data model is foundation for V3-V5
docs/v2/v2-concept.md                          <- UX thesis, entry paths, spending presentation
docs/v1/v1-desk-research.md                    <- Safeguarding findings, pension blindness, user voice
docs/v1/v1-flow-spec.md                        <- V1 interview structure (needed for V1→V2 wiring)
docs/v2/workspace-visual-redesign.md           <- Visual direction ("bold 2026")
```

### Don't-need-to-read files

V1 interview components, sidebar implementation, future phase pages, and most workspace UI components are stable and working. The following specs are superseded and should not guide new work:
- `docs/workspace-spec/05-build-your-picture.md` (superseded by 05b)
- `docs/workspace-spec/06-category-detail.md` (superseded by tabbed model)
- `docs/workspace-spec/10-ai-analysis-flow.md` (superseded by 10b)

---

## 7. Summary

The Session 3 retro is accurate and self-aware. The project has a solid architecture, good logging infrastructure, and an exceptionally thorough documentation set. The problems are process problems, not code problems:

1. **The pipeline wasn't diagnosed before being "fixed"** — resulting in 5+ wasted deploy cycles
2. **Features were built on an unverified foundation** — the AI pipeline should have been proven working end-to-end before building the wizard, CETV tracker, etc.
3. **The AI prompt is generic** — the detailed 8-domain intelligence spec (11) exists but isn't driving the code
4. **The specs evolved but weren't curated** — three specs are superseded without being marked, creating confusion for new sessions
5. **The data model simplified too much** — losing the Unsure/Unknown confidence states will cause problems downstream

The path forward is clear:
1. Diagnose the 504 from Vercel logs (not guessing)
2. Make one informed fix
3. Upgrade to two-step Haiku+Sonnet with the domain-aware prompt from spec 11
4. Fix the confidence model before persisting to Supabase
5. Mark superseded specs to prevent future confusion

Everything else is polish on top of a working, quality pipeline.
