# V2 Session Handoff Document

**Date:** 10 April 2026
**Product:** Calm Separation Workspace (working title: Decouple)
**Repository:** rossdelarge247-debug/construct_d_01
**Branch:** claude/project-planning-sprint-zero-odNO5
**Deployment:** construct-dev.vercel.app (Vercel Pro)

---

## 1. What This Product Is

An applicant-first digital service for people in England and Wales navigating separation, divorce, child arrangements, and financial disentanglement. The product replaces the 28-page Form E paper process with an intelligent, document-led workspace that extracts, organises, and structures financial data through AI analysis.

Design ethos: "A warm hand on a cold day" — compassionate, professional, world-class UX. Not an MVP; a product designed to feel like it was built in 2026.

---

## 2. Build Sequence and Current Position

```
V0  Platform foundation (Next.js, Supabase, auth, design tokens)     ✅ Complete
V1  Gentle Interview (10-step onboarding, AI plan generation)         ✅ Complete
V1.5 Onboarding/billing/first-run (planned, not started)             ⬜ Future
V2  Build Your Picture (financial disclosure workspace)               🔶 In progress
V3  Share & Disclose                                                  ⬜ Future
V4  Work Through It (negotiation)                                     ⬜ Future
V5  Reach Agreement / Make It Official                                ⬜ Future
```

**V2 is the current active vertical.** This is where all development effort should go next.

---

## 3. Tech Stack

| Layer | Technology | Notes |
|-------|-----------|-------|
| Framework | Next.js 16.2 + React 19 | App Router, Server Actions |
| Language | TypeScript 5 | Strict mode |
| Styling | Tailwind CSS 4 | CSS `@theme` tokens in globals.css |
| Database | Supabase (PostgreSQL) | RLS policies, anonymous → authenticated auth |
| AI | Claude (Anthropic SDK 0.85) | Haiku 4.5 for PDF analysis, Sonnet for text analysis |
| Payments | Stripe | Test mode, not wired yet |
| Analytics | PostHog | EU-hosted, not fully wired |
| Deployment | Vercel Pro | 300s function timeout, auto-deploy on push |
| Testing | Vitest + Testing Library | Installed but no tests written yet |

---

## 4. What Has Been Built (V2)

### 4.1 Core Architecture

- **Workspace layout** with collapsible sidebar (240px ↔ 64px), numbered phase indicators, active phase highlighting
- **Two-tier tab structure**: Page-level (Preparation / Summary) + Component-level (category tabs within upload area)
- **State management**: localStorage-backed workspace hook (`useWorkspace`) with live financial summary calculation and readiness scoring
- **Readiness system**: Progress percentage with milestone labels (Getting started → Taking shape → Ready for mediator → Ready for disclosure → Complete)

### 4.2 Document Upload + AI Analysis Pipeline

**The critical path — upload → AI → tiered questions → confirm → items appear**

| Component | File | Status | Notes |
|-----------|------|--------|-------|
| Upload zone | `document-upload.tsx` | ✅ Working | Drag/drop, file select, sparkle animation |
| API route | `api/documents/extract/route.ts` | ✅ Working | PDF/image/text handling, 120s timeout |
| AI analysis | `lib/ai/document-analysis.ts` | ✅ Working | Single-call PDF analysis with Haiku 4.5 |
| Tiered questions | `ai-analysis.tsx` | ✅ Built | Step-through dialogue (one question at a time) |
| Provider layer | `lib/ai/provider.ts` | ✅ Working | Smart dry-run, mock data, task routing |

**AI analysis flow:**
1. User drops a PDF/image/text file
2. Sparkle animation plays with phased status messages
3. For PDFs: document sent as base64 to Claude Haiku 4.5 in a single call (reads + analyses)
4. AI returns structured JSON: `{ document_summary, document_type, provider, items[], gaps[], spending[] }`
5. Items are tiered by confidence: auto (≥0.9), confirm (0.7–0.9), question (<0.7)
6. Step-through dialogue shows auto items first, then walks through confirms/questions/gaps one at a time
7. On completion, items are added to workspace state and routed to the correct category tab

**Known model constraints:**
- `claude-haiku-4-5-20251001` is the only model confirmed working with `type: 'document'` PDF content blocks
- `claude-3-5-sonnet-20241022` does NOT support PDF document type (returns error/timeout)
- `claude-sonnet-4-5-20241022` and `claude-sonnet-4-6` either don't exist in the API or aren't available on this key
- **Upgrade path**: Use Haiku for PDF text extraction, then pipe extracted text to Sonnet for richer analysis (two-step approach). This is the top priority for improving extraction quality.

**Current quality issues with Haiku (observed in testing):**
- Extraction can be shallow — misses items like rent payments that should be detected
- May hallucinate values not present in the document (e.g. invented £13k assets)
- Questions can feel basic/generic rather than intelligent and contextual
- Anti-hallucination prompt rules added but not yet verified with Sonnet-quality model
- The two-step approach (Haiku reads PDF → Sonnet analyses text) should resolve all of these

### 4.2.1 Known Issues: Extraction, Analysis & Presentation

This is the most fragile area of the product. The pipeline technically works end-to-end (upload → AI → items appear) but the quality, intelligence, and UX do not yet match the design specs. Below is an explicit list of every observed issue.

**Extraction issues (what the AI finds):**
- Shallow extraction: Haiku misses items a human would catch — e.g. regular rent payments visible in transaction history, standing orders, direct debits
- Hallucinated values: AI invented a £13k asset that was not in the uploaded document at all. Anti-hallucination prompt added but untested with a stronger model
- Incomplete spending categorisation: bank statement transactions not fully categorised into the spending breakdown (housing, groceries, transport etc.)
- Single-document limitation: each upload is analysed in isolation. No cross-document intelligence (e.g. spotting the same account across two statements, or noticing missing months)
- Source descriptions may be vague ("Regular payment detected") rather than specific ("£1,150 standing order to Halifax on 1st of each month, page 2")

**Analysis issues (how the AI reasons):**
- Questions feel basic/generic rather than intelligent and contextual. The AI should reason like a financial analyst: "This £2,150 going out on the 1st looks like a mortgage or rent — which is it?" Instead it asks shallow confirm questions
- Gap detection is weak: should notice missing pensions, savings accounts not referenced, partner income unknown — but gaps returned are generic
- Confidence scoring may be inaccurate: items marked as "auto" (≥0.9 confidence) may not warrant that confidence level
- No domain-specific intelligence per spec 11 (ai-question-mapping.md): the 8-domain signal→question mapping is specified but not yet driving the AI prompt. The prompt is generic rather than domain-aware
- Tier assignments may be wrong: items that should be "confirm" end up as "auto", missing opportunities to ask the user about ambiguous items

**Presentation issues (what the user sees):**
- Processing animation (sparkle dots) too subtle to notice — user reported "no magical sparkling that I could see". Needs to be more visible while remaining elegant
- Step-through dialogue had a dead-end bug (now fixed in `47c18ac`): after auto items revealed, nothing appeared next. Needs end-to-end verification with real data
- After completing the dialogue and clicking "Add items", confirmed items should appear in the correct category tab with count updates and toast notification — this flow needs testing
- No celebration moment after items are added (spec 09 calls for green flash, count-up animation, toast)
- Auto-confirmed items list shows values but no way to correct them — "Something wrong? Correct an item" button exists but does nothing
- No "Confirm all" bulk action as specified in spec 09
- Items added to workspace may not map to the correct category/subcategory — the `DOC_TYPE_TO_CATEGORY` mapping in `build/page.tsx` is basic
- Spending breakdown appears in auto-confirmed section but may not flow through to the outgoings category tab
- No indication of which document an item came from (no source document linking)

**Architecture issues (how the pipeline works):**
- Single model constraint: only Haiku 4.5 works with PDF `type: 'document'`. Two-step approach (Haiku reads → Sonnet analyses) is the fix but not yet implemented
- JSON truncation risk: if AI generates more than 4096 tokens of JSON, response gets cut off. Repair logic exists (3-tier: parse → repair brackets → extract partial items) but it's a workaround, not a solution
- No streaming: the entire AI response must complete before anything shows to the user. Streaming would allow progressive reveal of results
- No retry on failure: if the AI call fails, user sees an error and must manually retry
- Uploaded documents are not stored: the PDF is sent to the AI but not persisted. Can't be reviewed later in the side-by-side modal (spec 09)

**What the specs call for vs what exists:**

| Spec requirement | Status | Gap |
|-----------------|--------|-----|
| Auto-confirmed items with staggered reveal (10b) | ✅ Built | Works but quality depends on model |
| Quick confirmations one at a time (10b) | ✅ Built | Step-through dialogue implemented |
| Genuine questions with context (10b) | 🔶 Partial | Questions lack domain-specific intelligence |
| Gap prompts (10b) | 🔶 Partial | Gaps are generic, not document-aware |
| "Something wrong?" correction flow (10b) | ❌ Not built | Button exists, does nothing |
| PDF side-by-side review (09) | ❌ Not built | Needs document storage + PDF viewer |
| Celebration on completion (09) | ❌ Not built | No green flash, no count-up |
| Confirm all bulk action (09) | ❌ Not built | Only individual item addition |
| Conversational processing messages (09) | 🔶 Partial | Messages exist but not specific to detected content |
| Domain-aware AI questioning (11) | ❌ Not built | 8-domain mapping specified but not in prompt |
| Cross-document intelligence | ❌ Not built | Each document analysed in isolation |

### 4.3 Workspace Components

| Component | File | Status | Notes |
|-----------|------|--------|-------|
| First-time wizard | `first-time-wizard.tsx` | ✅ Built | 3-step: playback → category selection → ready |
| Category tabs | `category-tabs.tsx` | ✅ Built | Icons, item counts, scroll overflow |
| Category content | `category-content.tsx` | ✅ Built | Item cards, spending breakdown, CETV tracker, AI prompts |
| Summary tab | `summary-tab.tsx` | ✅ Built | Form E mapping, hero numbers, gaps section |
| Manual entry modal | `manual-entry-modal.tsx` | ✅ Built | Category grid, guided form with confidence/ownership |
| Document review modal | `document-review-modal.tsx` | ✅ Built | Edit fields: label, value, period, confidence, ownership, split, flags |
| CETV tracker | `cetv-tracker.tsx` | ✅ Built | Pension tracking: request → chase → received |
| Toast system | `toast.tsx` | ✅ Built | Provider context, auto-dismiss |
| Page tabs | `page-tabs.tsx` | ✅ Built | Preparation (warmth) / Summary (teal) |
| Financial summary | `financial-summary.tsx` | ✅ Built | Animated count-up numbers |
| Readiness bar | `readiness-bar.tsx` | ✅ Built | Four-tier progress |
| Future phase pages | `future-phase-page.tsx` | ✅ Built | Educational zero-data states for V3–V5 |

### 4.4 V1 (Gentle Interview) — Complete

10-step interview flow: Welcome → Situation → Route/Pathway → Children → Home → Finances → Readiness → Plan → Next Steps → Save. AI-generated plan narrative with fallback content. Adaptive output based on completion depth.

### 4.5 Design System

Defined in `src/app/globals.css` using Tailwind CSS 4 `@theme` syntax:

- **Palette**: Cream (#FAF6F1), Ink (#2D2926), Warmth (#C67D5A), Teal (#5B8A8A), Sage (#7A9E7E), Amber (#D4A84B), Depth (#3D4F5F)
- **Font**: Inter only (no serif). Bold headings (-0.02em tracking), relaxed body text
- **Borders**: 2px card borders, 5px accent borders. Warm shadows with rgba(45,41,38,x)
- **Radius**: 8px (sm), 12px (md), 16px (lg)
- **Sidebar**: 240px expanded, 64px collapsed. Persists collapse state

---

## 5. Key Decisions Made

### Architecture
1. **Single upload zone at page level** — not per-category. AI detects document type and routes to correct tab.
2. **localStorage for V2 state** — Supabase persistence deferred until auth upgrade path is built. Workspace hook auto-saves with debounce.
3. **Single-call PDF analysis** — sends base64 PDF directly to Claude, which reads AND analyses in one pass. Avoids two-call latency.
4. **Provider abstraction** — `lib/ai/provider.ts` supports Claude/Gemini/OpenAI routing by task type with dry-run mode for development.

### UX
5. **Tiered question UI** — AI handles 90% automatically; user does 3-5 taps. Four tiers: auto-confirmed, quick confirms, genuine questions, gap prompts.
6. **Step-through dialogue** — questions presented one at a time (not a list dump). Answering auto-advances.
7. **Two-tier tabs** — Page level (Preparation/Summary) + component level (category tabs). Keeps everything on one page.
8. **First-time wizard** — configures which disclosure categories are relevant before showing the workspace. Persists to localStorage.

### Visual
9. **2026 aesthetic** — bold colour blocks, thick borders, confident typography. Inter font throughout. No serif, no thin lines, no clinical greys.
10. **Sparkle processing animation** — subtle twinkling dots (not a spinner or progress bars). Magic wand feel.

### AI
11. **Anti-hallucination prompt rules** — strict: "ONLY extract values EXPLICITLY STATED in the document", source_description must reference specific location, never invent or estimate.
12. **Haiku for PDF analysis** — only model confirmed working with PDF document type. Quality controlled via prompt.
13. **Truncated JSON repair** — 3-tier fallback: parse as-is → repair truncated JSON by closing open brackets → extract partial items array.

---

## 6. What Is NOT Built Yet

### Critical for V2 completion

| Feature | Spec reference | Complexity | Notes |
|---------|---------------|------------|-------|
| **PDF side-by-side review modal** | `09-upload-review-flow.md` §Side-by-side | High | Split view: PDF viewer left, editable extracted data right. The Dext pattern. Needs PDF storage + viewer component. |
| **Sonnet-quality analysis** | — | Medium | Two-step approach: Haiku extracts text from PDF, Sonnet analyses the text. Haiku alone is shallow. |
| **"Something wrong?" correction flow** | `10b-ai-tiered-questions.md` §Correction | Medium | Clicking "Correct an item" makes auto-confirmed list editable inline. Currently the button exists but does nothing. |
| **Confirmation celebration** | `09-upload-review-flow.md` §Celebration | Low | Green flash, count updates, toast on item confirmation. Partially implemented. |
| **Document storage** | — | Medium | Uploaded PDFs need to be stored (Supabase Storage) for later review in the side-by-side modal. Currently not persisted. |
| **Supabase persistence** | — | Medium | Replace localStorage with Supabase. Requires auth upgrade path (anonymous → authenticated). |

### V1 → V2 gaps

| Feature | Notes |
|---------|-------|
| V1 data wiring | Session data from Gentle Interview should flow into workspace (pre-populate categories, readiness) |
| Safeguarding continuity | DA/coercive control flags from V1 should carry through to workspace |
| Self-employment detection | Adapted flow for business assets, director's loans, SIPP |

### Future verticals (V3–V5)

| Phase | URL | Status |
|-------|-----|--------|
| Share & Disclose | `/workspace/disclose` | Placeholder page with educational content |
| Work Through It | `/workspace/negotiate` | Placeholder page |
| Reach Agreement | `/workspace/agree` | Placeholder page |
| Make It Official | `/workspace/finalise` | Placeholder page |

### Other planned features

- Post-separation budget projection (AI-guided)
- Maintenance intelligence (CMS estimates, spousal maintenance flags)
- Children detail path (week planner, holidays, birthdays)
- PDF/email generation from Summary tab
- Document versioning and inconsistency detection
- V1.5: onboarding, billing, first-run experience

---

## 7. Design Documents

All specs are in `docs/` and should be treated as the source of truth for UX decisions.

### Sprint 0
- `docs/sprint-0/decisions.md` — Foundational product and architecture decisions
- `docs/sprint-0/v0-platform-plan.md` — V0 technical foundation plan

### V1 (Gentle Interview)
- `docs/v1/v1-concept-decision.md` — Why hybrid approach (interview + workspace)
- `docs/v1/v1-flow-spec.md` — Step-by-step interview specification
- `docs/v1/v1-visual-design.md` — Colour palette, typography, design thesis
- `docs/v1/v1-adaptive-output.md` — How output scales based on completion
- `docs/v1/v1-wireframes.md` — Mermaid flowcharts of user journey
- `docs/v1/v1-screen-map.md` — All V1 URLs and page hierarchy
- `docs/v1/v1-desk-research.md` — Research findings across 10+ source categories
- `docs/v1/v1-research-implications.md` — How research changed the design
- `docs/v1/v1-workspace-iterated.md` — Iterated workspace concept with 8 design principles
- `docs/v1/v1-vertical-assessment.md` — V1 planning and scope assessment

### V2 (Financial Picture)
- `docs/v2/v2-vertical-assessment.md` — V2 scope, Form E mapping, desk research
- `docs/v2/v2-concept.md` — The Guided Picture Builder concept
- `docs/v2/service-problem-space.md` — As-is journey and pain points (V2–V5)
- `docs/v2/workspace-visual-redesign.md` — Bold visual direction critique and principles

### Workspace UI/UX Specs (the detailed build specs)
- `docs/workspace-spec/01-design-system.md` — Typography scale, spacing, rhythm
- `docs/workspace-spec/02-page-map.md` — Workspace URL hierarchy
- `docs/workspace-spec/03-sidebar-navigation.md` — Sidebar structure and status indicators
- `docs/workspace-spec/04-workspace-home.md` — Mission control page
- `docs/workspace-spec/05-build-your-picture.md` — Original Build page spec
- `docs/workspace-spec/05b-build-your-picture-revised.md` — Revised with tabs (supersedes 05)
- `docs/workspace-spec/06-category-detail.md` — Category deep-dive pages
- `docs/workspace-spec/07-future-phases.md` — Placeholder pages for V3–V5
- `docs/workspace-spec/08-interaction-patterns.md` — When to use modals vs inline vs navigation
- **`docs/workspace-spec/09-upload-review-flow.md`** — Upload zone design, review panel, side-by-side PDF modal, celebration pattern. **Key unbuilt spec.**
- **`docs/workspace-spec/10-ai-analysis-flow.md`** — AI-led analysis replacing generic extraction. **Core to V2.**
- **`docs/workspace-spec/10b-ai-tiered-questions.md`** — Four-tier question UX with interaction counts. **Now implemented as step-through dialogue.**
- `docs/workspace-spec/11-ai-question-mapping.md` — Signal→question mapping across 8 domains
- `docs/workspace-spec/12-two-tier-tabs.md` — Page tabs + category tabs architecture

---

## 8. Database Schema

`supabase/migrations/001_initial_schema.sql` — 11 core tables:
- users, cases, participants, proposals
- financial_items, documents, extracted_fields
- questions, outputs, timeline_events, permissions

`supabase/migrations/002_fix_rls_policies.sql` — RLS policy fixes (no recursive joins)

**Currently not used at runtime** — workspace state lives in localStorage. Schema is ready for when auth upgrade is implemented.

---

## 9. Known Issues and Gotchas

1. **Model availability**: Only `claude-haiku-4-5-20251001` is confirmed working with PDF `type: 'document'`. Sonnet models either don't support it or use wrong model IDs. Upgrade path: two-step (Haiku reads PDF → Sonnet analyses text).

2. **AI_DRY_RUN**: `.env.local` has `AI_DRY_RUN=true` and empty `ANTHROPIC_API_KEY`. The provider layer now only activates dry-run when the flag is set AND no API key exists. If both are present, real AI runs.

3. **`maxDuration`**: Set to 120s in the API route. Vercel Pro allows up to 300s. Haiku typically completes in 3-8s; Sonnet would take 15-30s.

4. **No tests**: Vitest and Testing Library are installed but zero test files exist. The codebase is untested.

5. **No auth in workspace**: Everything is anonymous/localStorage. The Supabase auth upgrade path (anonymous → email/Google) is designed but not implemented.

6. **Staggered reveal hook**: `useStaggeredReveal` fires on mount regardless of whether the component is visible. Works fine currently but would need attention if components are conditionally rendered differently.

7. **Step-through dialogue auto-advance**: Fixed in final commit (`47c18ac`). After auto-confirmed items reveal, a `useEffect` now advances `currentStep` from 0 to 1 so confirms/questions/complete button appear. Without this, the UI dead-ends after showing auto items.

8. **Sparkle animation visibility**: The sparkle/twinkle dots in the processing screen may be too subtle on some displays. User feedback: "no magical sparkling that I could see." May need larger dots, higher contrast, or a different animation approach (e.g. a shimmer gradient or animated SVG constellation).

---

## 10. Environment Variables (Vercel)

| Variable | Required | Notes |
|----------|----------|-------|
| `ANTHROPIC_API_KEY` | Yes | Claude API key. Must be set for AI analysis. |
| `AI_DRY_RUN` | No | Set to `true` only for local dev without API key. Returns mock data. |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anonymous key |
| `STRIPE_SECRET_KEY` | No | Not used yet |
| `NEXT_PUBLIC_POSTHOG_KEY` | No | Not fully wired |

---

## 11. Git History Summary (80 commits)

The build progressed through clear phases:

1. **Foundation** (commits 1–12): Sprint 0 decisions, V0 platform, database schema, auth, middleware
2. **V1 Interview** (commits 13–31): Welcome → Situation → Route → Children → Home → Finances → Readiness → Plan → Next Steps. AI plan generation. Progress tracker iterations.
3. **V2 Planning** (commits 32–40): Vertical assessment, concept design, workspace shell, category system
4. **V2 Build** (commits 41–60): Upload pipeline, extraction, review, manual entry, CETV tracker, visual redesign, sidebar, design specs
5. **V2 Rebuild** (commits 61–70): Two-tier tabs, AI analysis, Summary tab, first-time wizard, smart routing
6. **AI Debugging** (commits 71–80): Dry-run fix, model fallback chain, truncated JSON repair, timeout management, sparkle animation, step-through dialogue

---

## 12. Immediate Next Session Priorities

### P0 — Must fix first

1. **Two-step Sonnet upgrade** — Haiku extraction quality is insufficient (shallow, hallucinated values, missed items like rent). Implement: Haiku reads PDF text → Sonnet (`claude-3-5-sonnet-20241022`) analyses extracted text (no PDF document type needed). Vercel Pro 300s timeout gives plenty of room for two sequential calls.

2. **Processing animation** — Current sparkle dots are too subtle to notice. Replace with a more visible but still elegant animation (shimmer gradient, animated SVG constellation, or larger/brighter twinkle pattern). Reference emergent 2026 AI design patterns.

3. **Verify step-through dialogue works end-to-end** — The auto-advance bug was fixed (`47c18ac`) but the full flow (auto items → confirms → questions → gaps → "Add items" button → items appear in category tabs) needs testing with a real document.

### P1 — Core V2 features

4. **"Something wrong?" correction flow** (spec 10b) — Make the auto-confirmed items list editable when the user clicks "Correct an item". Currently the button exists but does nothing.

5. **PDF side-by-side review modal** (spec 09) — Store uploaded PDFs in Supabase Storage. Build split-view modal with PDF viewer left, editable extracted data right. The Dext pattern. This is the biggest unbuilt feature.

6. **Celebration pattern** (spec 09) — Green flash, count-up animations on category cards, toast on confirmation completion.

### P2 — Completeness

7. **V1 → V2 data wiring** — Pipe interview session data into workspace to pre-populate categories and readiness state.

8. **Supabase persistence** — Replace localStorage with Supabase. Requires auth upgrade path.

9. **PDF/email export from Summary tab** — Form E equivalent structured output.
