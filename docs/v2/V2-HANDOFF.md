# [SUPERSEDED] V2 Session Handoff — Build Your Picture

> **This document is superseded by [`docs/HANDOFF.md`](../HANDOFF.md) (10 April 2026), which is the canonical handoff document.** This earlier version is retained for historical context only. Where the two documents contradict, the root HANDOFF.md is authoritative.

**Date:** 9 April 2026
**Branch:** `claude/project-planning-sprint-zero-odNO5`
**Latest commit:** `6e76b15` — Fix AI analysis flow: smart dry-run, model upgrade, premium processing UI
**Deployment:** construct-dev.vercel.app

---

## 1. What We Set Out to Build

V2 is the **Build Your Picture** phase — the core financial disclosure workspace. The user uploads any financial document, AI analyses it with tiered confidence, asks the right follow-up questions, and organises everything into a structured financial picture equivalent to Form E (the court-mandated disclosure form for England & Wales).

The product thesis: *"Building your financial picture should feel like a conversation with a brilliant assistant, not filling in a 28-page form."*

---

## 2. The Journey & Key Decisions

### Design Evolution

The workspace went through significant visual iteration:

1. **Initial build** — functional but thin. Narrow borders, lightweight typography, generic colours. User feedback: "doesn't look finished", "basic", "not leaning into world-class UX."

2. **Competitor research** — studied Splitifi, Klippa, Doxis, FreeAgent, Mojo, ContentSnare, Armalytix, LEAP, Xero, Stripe. User wanted bold 2026 design language, not safe defaults.

3. **Visual redesign** — thick 2px borders (`--border-card`), bold/extrabold typography, warm colour palette (cream/warmth/sage/teal), Inter font throughout, confident spacing. User: *"I want this to look like it is designed in 2026."*

4. **Architecture redesign** — user sketched wireframes showing two-tier tabs and smart document routing. This replaced the per-category upload approach with a single intelligent upload zone.

### Architecture Decisions

| Decision | What We Chose | Why |
|---|---|---|
| **Upload model** | Single upload zone at page level, AI routes to correct category | User: "one upload slot — system detects type" |
| **Page structure** | Two-tier tabs: Preparation (working) / Summary (output) | Keeps working mode separate from review mode. See `docs/workspace-spec/12-two-tier-tabs.md` |
| **Category tabs** | Horizontal scroll with icons, within Preparation tab | User wireframe specified tabs within the upload component area |
| **AI analysis** | Tiered: auto (>=0.9) / confirm (0.7-0.9) / question (<0.7) / gaps | Minimises friction — only asks what's genuinely ambiguous. See `docs/workspace-spec/10b-ai-tiered-questions.md` |
| **First-time wizard** | 3-step: playback V1 data, category scope selection, ready | Configures disclosure scope before showing the full workspace |
| **Analysis model** | Claude Sonnet (upgraded from Haiku) | Haiku struggled with complex structured JSON output |
| **Provider abstraction** | `src/lib/ai/provider.ts` with task-type routing | Supports multiple providers, dry-run mode for dev |
| **State management** | localStorage + custom hooks (no global store) | Sufficient for current needs; Supabase persistence is wired but dormant |
| **Form E mapping** | Summary tab sections map to Form E part numbers (2.1, 2.4, etc.) | The output must eventually satisfy court requirements |

### Bugs & Fixes Along the Way

| Issue | Root Cause | Fix |
|---|---|---|
| PDF upload returning garbled text | `file.text()` can't read binary PDFs | Route PDFs to Claude Haiku as base64 documents |
| Classification returning "unknown" | Claude wrapping JSON in markdown fences | Strip code fences before JSON.parse |
| `NaN` in currency display | Extracted values arriving as strings/null | Defensive `formatCurrency` with null/NaN guards |
| Vercel serverless timeout | 3 sequential AI calls > 10s default | Added `maxDuration = 60` to API route |
| Progress tracker resetting between pages | Each page hardcoded step/total | Unified step system in interview context |
| Font-medium on headings (32 instances) | Initial build used safe font-medium | Batch-fixed to font-bold/font-semibold |
| 1px borders everywhere | Default thin borders | Batch-fixed to `border-[var(--border-card)]` (2px) |
| **AI analysis returning nothing** | `AI_DRY_RUN=true` returning unparseable string | Smart dry-run: only when no API key. Mock returns valid JSON. |
| Processing UI looking generic | Basic spinner with plain text | Premium AI thinking visual with pulsing bars and phased progress |

---

## 3. What's Built — Completion Status

### Fully Built & Functional

| Component | File | Status | Notes |
|---|---|---|---|
| **Workspace layout** | `src/components/workspace/workspace-layout.tsx` | Done | Sidebar + main content area, responsive |
| **Sidebar navigation** | `src/components/workspace/sidebar.tsx` | Done | Collapsible (240px/64px), numbered phases, active state, Exit This Page |
| **Workspace home** | `src/app/workspace/page.tsx` | Done | Journey progress, financial snapshot, phase cards |
| **Build Your Picture page** | `src/app/workspace/build/page.tsx` | Done | Orchestrates wizard, upload, analysis, categories, summary |
| **First-time wizard** | `src/components/workspace/first-time-wizard.tsx` | Done | 3 steps, category scope config, localStorage persistence |
| **Page tabs** | `src/components/workspace/page-tabs.tsx` | Done | Preparation (warmth) / Summary (teal) toggle |
| **Category tabs** | `src/components/workspace/category-tabs.tsx` | Done | Icons, counts, scroll overflow, "+ Add" button |
| **Category content** | `src/components/workspace/category-content.tsx` | Done | Item list, spending breakdown (outgoings), CETV tracker (pensions), AI prompts |
| **Document upload** | `src/components/workspace/document-upload.tsx` | Done | Drag/drop, file select, premium AI thinking UI, phased messages |
| **AI analysis component** | `src/components/workspace/ai-analysis.tsx` | Done | 4 tiers: auto-confirmed, confirmations, questions, gaps. Staggered reveal. |
| **Summary tab** | `src/components/workspace/summary-tab.tsx` | Done | Form E-mapped sections, hero numbers, gaps, export buttons (visual only) |
| **Manual entry modal** | `src/components/workspace/manual-entry-modal.tsx` | Done | Category grid, guided form, confidence/ownership pills |
| **Document review modal** | `src/components/workspace/document-review-modal.tsx` | Done | Side-by-side: doc preview + editable fields |
| **Modal base** | `src/components/workspace/modal.tsx` | Done | Centred desktop, slide-up mobile, ESC, backdrop |
| **Toast system** | `src/components/workspace/toast.tsx` | Done | Context provider, auto-dismiss |
| **CETV tracker** | `src/components/workspace/cetv-tracker.tsx` | Done | Add pensions, track status, timing guidance |
| **Financial summary** | `src/components/workspace/financial-summary.tsx` | Done | Animated count-up numbers |
| **Readiness bar** | `src/components/workspace/readiness-bar.tsx` | Done | Four-tier progress |
| **Future phase pages** | `src/app/workspace/{disclose,negotiate,agree,finalise}` | Done | Educational placeholders with prerequisites and emerging data |
| **useWorkspace hook** | `src/hooks/use-workspace.ts` | Done | Items CRUD, auto-save, live summary, readiness calc |

### AI Analysis Pipeline

| Component | File | Status | Notes |
|---|---|---|---|
| **API route** | `src/app/api/documents/extract/route.ts` | Done | PDF (Haiku base64), image (Haiku vision), text. 60s timeout. |
| **Analysis prompt** | `src/lib/ai/document-analysis.ts` | Done | Tiered results, gap detection, spending categorisation |
| **Provider layer** | `src/lib/ai/provider.ts` | Done | Claude primary, smart dry-run, task routing, mock data fallback |
| **Document processor** | `src/lib/documents/processor.ts` | Done | Classification + extraction (older approach, superseded by analysis) |

### V1 (Gentle Interview) — Complete

| Component | Status |
|---|---|
| Welcome page (`/start`) | Done |
| Situation assessment (`/start/situation`) | Done — 7 sub-steps |
| Route/pathway display (`/start/route`) | Done — personalised journey |
| Children arrangements (`/start/children`) | Done |
| Home & property (`/start/home`) | Done |
| Finances & priorities (`/start/finances`) | Done |
| Confidence mapping (`/start/readiness`) | Done — 10 financial domains |
| AI plan generation (`/start/plan`) | Done — Claude narrative with fallback |
| Next steps & pricing (`/start/next-steps`) | Done |
| Interview provider & layout | Done |

### Infrastructure

| Component | Status |
|---|---|
| Supabase schema (11 tables, RLS) | Done — 2 migrations |
| Auth middleware | Done |
| Design tokens (globals.css) | Done |
| PostHog analytics | Wired (needs key) |
| Stripe integration | Stub (needs keys) |

---

## 4. What Needs Testing

The AI analysis flow is the critical path that needs end-to-end verification:

1. **Upload a PDF bank statement** → Should show premium AI thinking visual (pulsing bars, phased messages) → Should transition to tiered analysis UI
2. **Tiered analysis UI** → Auto-confirmed items appear with green checks → Confirmation cards show binary choices → Question cards show multiple choice → Gap prompts appear with skip option
3. **Complete analysis** → Click "Add X items to your picture" → Items appear in correct category tab → Toast confirms addition
4. **Category tabs** → Items grouped correctly → Edit/remove works → Manual entry modal works
5. **Summary tab** → Shows all captured data → Sections map to Form E numbers → Zero-data state is informative

### Vercel Environment Checklist

- `ANTHROPIC_API_KEY` — **must be set** for real AI analysis. Without it, dry-run returns mock data.
- `AI_DRY_RUN` — should be `false` or unset in production. Smart logic now bypasses dry-run if API key is present.
- `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` — for auth/persistence.

---

## 5. What's Left to Do

### Critical (Must-Have for V2 Completion)

1. **Verify AI analysis works end-to-end on Vercel** — confirm `ANTHROPIC_API_KEY` is set, upload real documents, observe tiered UI
2. **V1 data wiring** — real interview session data should flow into workspace (currently uses localStorage, no cross-session persistence)
3. **Supabase persistence** — workspace items currently saved to localStorage only. The `workspace-store.ts` has Supabase stubs that need activating.
4. **PDF/email export from Summary tab** — buttons exist but are visual only

### Important (Should-Have)

5. **Post-separation budget projection** — AI-guided budget building based on captured spending data
6. **Maintenance intelligence** — CMS calculator estimates, spousal maintenance flags based on income disparity
7. **Self-employment detection** — adapted flow for business owners (different disclosure requirements)
8. **Document versioning** — handle updated documents replacing earlier versions
9. **Inconsistency detection** — flag when uploaded data contradicts earlier entries
10. **Safeguarding continuity** — carry coercive control screening from V1 into workspace behaviour

### Future Phases (V3–V5)

11. **V1.5** — onboarding, billing, first-run experience (post-V2)
12. **V3 — Disclose** — share financial picture with other party, formal disclosure exchange
13. **V4 — Negotiate** — proposal builder, comparison tools, mediation support
14. **V5 — Formalise** — consent order generation, court submission guidance

### Polish & Enhancement

15. **Enhanced AI thinking messages** — reference detected content during processing (e.g. "Found a Barclays statement from January...")
16. **Children detail path** — week planner, holiday schedule, birthday tracking
17. **Mobile optimisation pass** — sidebar behaviour on small screens, touch targets
18. **Accessibility audit** — keyboard navigation, screen reader testing, WCAG compliance

---

## 6. Design Documents Index

All design documentation lives in `/docs/`. Here is the complete reference:

### Sprint 0 — Foundation

| Doc | Path | Purpose |
|---|---|---|
| Decisions Register | `docs/sprint-0/decisions.md` | Founding product decisions, tech stack, principles |
| V0 Platform Plan | `docs/sprint-0/v0-platform-plan.md` | Technical backbone deliverables |

### V1 — Gentle Interview

| Doc | Path | Purpose |
|---|---|---|
| Vertical Assessment | `docs/v1/v1-vertical-assessment.md` | Problem definition, research base |
| Desk Research | `docs/v1/v1-desk-research.md` | Sources: GOV.UK, mediators, forums, competitors |
| Research Implications | `docs/v1/v1-research-implications.md` | How research changed the design |
| Concept Decision | `docs/v1/v1-concept-decision.md` | Hybrid: Gentle Interview + Compass Workspace |
| Flow Spec | `docs/v1/v1-flow-spec.md` | Step-by-step interview specification |
| Screen Map | `docs/v1/v1-screen-map.md` | All V1 URLs and page hierarchy |
| Wireframes | `docs/v1/v1-wireframes.md` | Mermaid flowcharts of user journey |
| Adaptive Output | `docs/v1/v1-adaptive-output.md` | Four-tier output scaling model |
| Visual Design | `docs/v1/v1-visual-design.md` | Colour palette, typography, visual principles |
| Workspace Iterated | `docs/v1/v1-workspace-iterated.md` | Workspace concept and 8 design principles |

### V2 — Build Your Picture

| Doc | Path | Purpose |
|---|---|---|
| Vertical Assessment | `docs/v2/v2-vertical-assessment.md` | Form E mapping, disclosure requirements |
| Concept | `docs/v2/v2-concept.md` | Guided Picture Builder — three-layer structure |
| Service Problem Space | `docs/v2/service-problem-space.md` | V2–V5 service mapping, pain points |
| Visual Redesign | `docs/v2/workspace-visual-redesign.md` | Bold 2026 direction, layout principles |

### Workspace Specification — Detailed UI/UX

| Doc | Path | Purpose |
|---|---|---|
| 01 Design System | `docs/workspace-spec/01-design-system.md` | Typography scale, spacing rhythm, visual philosophy |
| 02 Page Map | `docs/workspace-spec/02-page-map.md` | Complete workspace URL hierarchy |
| 03 Sidebar Navigation | `docs/workspace-spec/03-sidebar-navigation.md` | Sidebar spec: width, phases, status indicators |
| 04 Workspace Home | `docs/workspace-spec/04-workspace-home.md` | Mission control page design |
| 05 Build Your Picture | `docs/workspace-spec/05-build-your-picture.md` | Original BYP layout (superseded by 05b) |
| 05b Build Your Picture (Revised) | `docs/workspace-spec/05b-build-your-picture-revised.md` | **Current spec**: one page, three stacked zones |
| 06 Category Detail | `docs/workspace-spec/06-category-detail.md` | Per-category deep dive layout |
| 07 Future Phases | `docs/workspace-spec/07-future-phases.md` | Placeholder pages for V3–V5 |
| 08 Interaction Patterns | `docs/workspace-spec/08-interaction-patterns.md` | Modals vs navigation, click reduction |
| 09 Upload & Review Flow | `docs/workspace-spec/09-upload-review-flow.md` | Drop → AI reads → structured data → confirm |
| 10 AI Analysis Flow | `docs/workspace-spec/10-ai-analysis-flow.md` | Domain reasoning, staggered reveal, conversation feel |
| 10b Tiered Questions | `docs/workspace-spec/10b-ai-tiered-questions.md` | **Key spec**: four confidence tiers, question UX |
| 11 AI Question Mapping | `docs/workspace-spec/11-ai-question-mapping.md` | Domain-by-domain extraction and signal logic |
| 12 Two-Tier Tabs | `docs/workspace-spec/12-two-tier-tabs.md` | Preparation/Summary + category tabs within |

---

## 7. Key File Reference

For quick orientation, here are the files a new session should read first:

```
# Architecture & state
src/app/workspace/build/page.tsx          — Main orchestrator (320 lines)
src/hooks/use-workspace.ts                — State management (159 lines)
src/types/workspace.ts                    — Data model (103 lines)

# AI pipeline
src/lib/ai/provider.ts                   — Provider abstraction (188 lines)
src/lib/ai/document-analysis.ts           — Analysis prompt & parsing (167 lines)
src/app/api/documents/extract/route.ts    — Upload API (128 lines)

# Core UI
src/components/workspace/ai-analysis.tsx  — Tiered question UI (265 lines)
src/components/workspace/document-upload.tsx — Upload + processing UI (207 lines)
src/components/workspace/category-content.tsx — Item display (154 lines)
src/components/workspace/summary-tab.tsx  — Form E output (281 lines)

# Design
src/app/globals.css                       — Design tokens (111 lines)
docs/workspace-spec/10b-ai-tiered-questions.md — Core UX spec
docs/workspace-spec/05b-build-your-picture-revised.md — Page layout spec
```

---

## 8. Technical Notes

- **Next.js 16.2.2** with App Router, React 19, TypeScript strict
- **Tailwind CSS 4** — uses `@theme` in CSS, not `tailwind.config.js`
- **Supabase** — 11 tables with RLS. Auth middleware in place. Workspace persistence is localStorage-only currently.
- **Claude AI** — Sonnet for analysis/plans, Haiku for PDF text extraction and classification
- **No `vercel.json`** — uses Next.js defaults. API route has `maxDuration = 60`.
- **No test suite yet** — Vitest is configured but no tests written
- The `src/lib/documents/processor.ts` file contains an older classification+extraction approach that is now superseded by `document-analysis.ts`. It can be removed or left as fallback.

---

## 9. Product Context

The product is called **Decouple** (working title: Calm Separation Workspace). It serves people in England and Wales going through separation, divorce, or financial disentanglement.

**Design ethos:** *"A warm hand on a cold day"* — compassionate but professional, never patronising, never clinical.

**Five phases:**
1. Build Your Picture (V2 — current)
2. Share & Disclose (V3)
3. Work Through It (V4)
4. Reach Agreement (V4)
5. Make It Official (V5)

The V1 Gentle Interview feeds into V2 by establishing the user's situation, priorities, and confidence levels. V2 then builds the complete financial picture that becomes the foundation for disclosure and negotiation in V3–V5.
