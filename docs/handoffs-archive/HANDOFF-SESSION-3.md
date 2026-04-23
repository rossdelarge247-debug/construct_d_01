# Session 3 Handoff

**Date:** 11 April 2026
**Branch:** `claude/review-handoff-docs-ZovbO`
**Latest commit:** `a7aa497`

---

## What happened this session

A comprehensive audit, pipeline wiring, interaction fixes, visual polish, and debugging of the AI pipeline. Good progress on multiple fronts, but ended stuck on a 504 timeout from the document upload pipeline that should have been diagnosed more rigorously before iterating.

### What was accomplished

1. **Full documentation review** — all 45 docs across sprint-0, v1, v2, workspace-spec read and understood
2. **Codebase audit** — thorough audit of hub components, AI pipeline, types, hooks, old V2 components. Identified all gaps against specs
3. **Pipeline wiring** — replaced mock data in `use-hub.ts` with real `fetch()` to `/api/documents/extract`. API route now transforms results server-side via `result-transformer.ts`
4. **Hero panel interactions fixed** — checkboxes toggle via local state, radio buttons track selection with visual highlight, summary content is dynamic from actual processed data
5. **Missing document types added** — savings/investment, credit card, P60/tax return schemas, prompts, and transformers. Full spec 13 coverage
6. **Fidelity calculation** — upgraded from naive item count to spec 17 logic (section coverage, core evidence, sketch→draft→evidenced→locked)
7. **Visual polish** — hero panel cross-fade transitions, sparkle diamond processing animation, progressive contextual messages, drag-over feedback, lozenge animations, value count-up on section cards, ARIA accessibility
8. **V1 data replay** — discovery flow now includes spec 15 screen 1b with spoofed scenario data (married, children, 1 house £500k, mortgaged)
9. **Debug panel** — pipeline diagnostics panel showing step-by-step execution data
10. **Health endpoint** — `/api/health` tests each model independently. Confirmed `claude-sonnet-4-6` works, date-suffixed IDs do not
11. **Error handling** — resilient to non-JSON responses, displays HTTP status codes
12. **Model ID fix** — changed from `claude-sonnet-4-5-20241022` (404) to `claude-sonnet-4-6` (confirmed working)

### What is NOT done

1. **The pipeline still 504s on document upload** — this is the critical blocker (see section below)
2. **Spec 14 wizards** — property, pensions, debts, other assets, business, spending, life after separation manual entry flows
3. **Cross-document intelligence** — matching income across documents, flagging discrepancies
4. **Visual testing in browser** — sparkle animation, transitions, etc. have not been verified visually by the session (only built)

---

## The 504 blocker — what we know and don't know

### Confirmed facts

- **Vercel Pro, 300-second function timeout** — not a plan limitation
- **`maxDuration = 120` in API route** — well within Vercel's limit
- **`claude-haiku-4-5-20251001` works** — confirmed via /api/health (479ms)
- **`claude-sonnet-4-6` works** — confirmed via /api/health (993ms)
- **API key is set and valid** — health check confirms it
- **45-second per-call SDK timeout added** — should prevent hanging
- **The health check endpoint works** — both models respond to trivial prompts

### What we DON'T know (and should have investigated)

- **Does Step 1 (Haiku PDF reading) actually complete?** — we never checked the Vercel function logs to see which console.log lines appear
- **Is the PDF too large?** — we never asked what PDF was being uploaded or its size
- **Does the `type: 'document'` content block work with this SDK version?** — SDK 0.85 may need different syntax for PDF documents
- **Is the base64 encoding causing issues?** — large PDFs encoded as base64 could exceed request body limits
- **Is `response_format` with `json_schema` supported by `claude-sonnet-4-6`?** — we confirmed the model ID works with a trivial prompt but never tested structured outputs specifically
- **Is there a Vercel body size limit we're hitting?** — `next.config.ts` has `bodySizeLimit: '10mb'` for server actions but this is the API route, not a server action

### Recommended next steps to resolve

1. **Check the Vercel function logs** — look at the runtime logs for the failed `/api/documents/extract` invocation. The console.log statements should show exactly which step was reached before the function died
2. **Test Step 1 in isolation** — create a minimal endpoint that ONLY does the Haiku PDF read (no Step 2) and see if that works
3. **Test structured outputs in isolation** — send a simple text to `claude-sonnet-4-6` with `response_format: { type: 'json_schema', ... }` and see if that works
4. **Check the PDF size** — if the user is uploading a 5MB PDF, the base64 encoding makes it ~7MB. Check if this is within acceptable limits
5. **Check SDK compatibility** — verify that SDK 0.85 supports `type: 'document'` content blocks and `response_format` with `json_schema` for `claude-sonnet-4-6`

---

## Retrospective

### What went well

- **Thorough documentation review** — reading all 45 docs gave proper context for every decision
- **Systematic audit** — the parallel agent audit of components, pipeline, types, and old code identified all gaps clearly
- **Type safety** — zero TypeScript errors throughout all changes
- **Clean commits** — each commit is atomic with clear purpose

### What went wrong

#### 1. Jumped to fixes before diagnosing

The 504 was encountered and we immediately started changing model IDs, adding timeouts, adding fallback chains, and trying different model name formats. Each iteration required a deploy cycle (commit → push → Vercel build → test → fail → repeat).

**What we should have done:** Before changing any code, investigate the actual failure. Check the Vercel function logs. Create a minimal reproduction. Test each pipeline step in isolation. The handoff docs from Session 2 explicitly warned that Sonnet model IDs might not work — we should have started with the health check, not added it as an afterthought.

#### 2. Round-tripping through deploy cycles

We went through 5 commits trying to fix the Sonnet model issue:
1. `a380567` — Try multiple model candidates
2. `77e3656` — Add timeouts and health endpoint
3. `3f6fc30` — Expand model ID list
4. `a7aa497` — Fix to confirmed working model

Each required a full Vercel deploy cycle (~2-3 minutes). A disciplined approach would have been: build the health check FIRST, get the data, make ONE informed change.

#### 3. Violated "design before code" principle

The spec 18 processing animation was built as "three pulse dots" then replaced with "shimmer line + dots" then replaced again with "sparkle diamonds" — three iterations of the same component. The visual direction should have been agreed before building. The user had a clear reference (the sparkle image) that should have been solicited earlier.

#### 4. Built features while a blocker existed

We added savings/credit card/P60 schemas, visual polish, and the V1 replay step while the fundamental pipeline was broken (504 on every upload). None of those features can be tested or validated until the pipeline works. The principle "Quality first, rigour always" means: fix the critical path first, then build on top.

#### 5. Didn't check the obvious

The Session 2 handoff explicitly documented:
> "Sonnet model ID `claude-sonnet-4-5-20241022` needs verification"

This should have been the FIRST thing checked in this session — before any other work. Instead, we wired the pipeline to use the unverified model ID and only discovered it was wrong after multiple 504 failures.

### Process improvements for next session

1. **Diagnose before fixing** — when something doesn't work, get the data first. Read the logs. Create minimal reproductions. Don't change code until you understand why it's broken.

2. **Test the critical path first** — before building any features, verify the end-to-end pipeline works: upload → Step 1 → Step 2 → transformed data → UI. Everything else depends on this.

3. **One change, one test** — don't batch multiple changes into a deploy. Make one change, deploy, test, confirm it works, then move on.

4. **Agree visual direction before building** — show reference images, discuss the approach, then implement once. Not three iterations.

5. **Check known issues from the handoff FIRST** — the handoff docs exist for a reason. Every known issue should be addressed before new work begins.

6. **Create isolation tests for external dependencies** — the `/api/health` endpoint should have been the first thing built. Test models, test structured outputs, test PDF reading — each in isolation — before assuming the full pipeline will work.

---

## Current codebase state

### Hub architecture (new, post-pivot)

| Component | File | Status |
|-----------|------|--------|
| Title bar | `src/components/hub/title-bar.tsx` | Working |
| Hero panel (8-state machine) | `src/components/hub/hero-panel.tsx` | Working (interactions fixed, transitions added) |
| Discovery flow (config wizard) | `src/components/hub/discovery-flow.tsx` | Working (V1 replay added) |
| Section cards | `src/components/hub/section-cards.tsx` | Working (value count-up added) |
| Evidence lozenges | `src/components/hub/evidence-lozenge.tsx` | Working (animations added) |
| Fidelity label | `src/components/hub/fidelity-label.tsx` | Working |
| Debug panel | `src/components/hub/debug-panel.tsx` | Working |
| Hub page | `src/app/workspace/page.tsx` | Working |
| Hub hook | `src/hooks/use-hub.ts` | Working (real API calls, but API 504s) |
| Hub types | `src/types/hub.ts` | Complete |

### AI pipeline

| Component | File | Status |
|-----------|------|--------|
| Two-step pipeline | `src/lib/ai/pipeline.ts` | Built, model IDs correct, **but 504s in production** |
| Extraction schemas | `src/lib/ai/extraction-schemas.ts` | Complete (7 document types) |
| Extraction prompts | `src/lib/ai/extraction-prompts.ts` | Complete (7 document types) |
| Result transformer | `src/lib/ai/result-transformer.ts` | Complete (7 transformers) |
| API route | `src/app/api/documents/extract/route.ts` | Built, transforms server-side |
| Health check | `src/app/api/health/route.ts` | Working — confirms model availability |

### Key facts for next session

- **Working models:** `claude-haiku-4-5-20251001`, `claude-sonnet-4-6` (plain IDs, no date suffix)
- **Broken models:** Any date-suffixed ID (e.g. `claude-sonnet-4-5-20241022`) returns 404
- **SDK version:** `@anthropic-ai/sdk` 0.85.0
- **Vercel:** Pro plan, 300s function timeout, auto-deploys from this branch
- **No `.env.local`** — keys are only in Vercel environment variables
- **V1 replay uses spoofed data:** married, children, 1 house £500k, mortgaged
- **Old V2 workspace** at `/workspace/build` still exists alongside new hub at `/workspace` — separate state stores, no data bridge

---

## Remaining backlog

### Blockers (resolve first)

1. **Pipeline 504** — investigate and fix the document upload timeout. The models work, the API key works, the timeout is sufficient. Something in the actual PDF processing pipeline is failing. Needs isolation testing.

### High priority (after pipeline works)

2. **Visual verification** — test sparkle animation, cross-fade transitions, drag-over feedback in a real browser
3. **End-to-end flow** — upload a document → see auto-confirm items → answer questions → see items in section cards
4. **Spec 14 wizards** — property, pensions, debts, other assets, business, spending, life after separation

### Medium priority

5. **Cross-document intelligence** (spec 13) — income matching, payment verification
6. **Section card actions** — "Manually input" and "Review details" currently stubs
7. **"+ More to disclose"** — section picker for adding missed sections
8. **Children section** — "Begin plan" CTA currently does nothing
9. **Life after separation** — gated section (Parts 3 & 4), currently placeholder

### Lower priority

10. **Supabase persistence** — replace localStorage
11. **Auth upgrade** — anonymous → authenticated
12. **PDF export** — Summary tab export
13. **Old V2 cleanup** — remove or reconcile old workspace components

---

## Reading order for new session

1. **This document** — you're here
2. **`docs/README.md`** — full documentation index
3. **`docs/HANDOFF-SESSION-2.md`** — previous session context
4. **`docs/v2/v2-design-pivot.md`** — the architectural pivot
5. **`docs/workspace-spec/16-hero-panel-flow.md`** — core interaction spec
6. **`/api/health`** — hit this endpoint to verify model availability
7. **Vercel function logs** for `/api/documents/extract` — see where the pipeline dies
