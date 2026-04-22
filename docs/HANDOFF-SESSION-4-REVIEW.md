# Session 4 Review: Full Documentation Audit & Recommendations

**Date:** 11 April 2026
**Reviewer:** Chat 4 (independent review)
**Branch:** `claude/review-handoff-docs-ZovbO` (current state)
**Sources:** All docs, all specs (01-18), all source code, Session 2 + 3 handoffs

---

## 1. Session History — What Actually Happened

### Session 1 (V0 + V1)
Platform foundation, auth, design tokens, 10-step Gentle Interview, AI plan generation. No handoff document produced.

### Session 2 (V2 pivot + rebuild)
- Full doc review → V2 desk research (Form E, pensions, tech, regulatory)
- **Design pivot**: 5 phases → 3, sidebar+tabs → hub+hero panel, warm → sophisticated
- New specs 13-18 written (extraction decision trees, discovery flow, hero panel, hub states, visual design system)
- Hub UI components built, two-step AI pipeline built
- **Ended with**: pipeline wired to mock data, zero visual testing

### Session 3 (Pipeline wiring + 504 debugging)
- Wired `use-hub.ts` to real API, added result transformer
- Hero panel interactions fixed, checkboxes/radio working
- Added savings/credit card/P60 document types (7 total)
- Fidelity calculation upgraded to spec 17 logic
- Visual polish: cross-fade transitions, sparkle animation, value count-up
- Health endpoint built, confirmed `claude-sonnet-4-6` works
- **Ended with**: pipeline 504s on document upload — undiagnosed

---

## 2. Retro Validation — Session 3's Self-Assessment Is Accurate

### 2.1 "Jumped to fixes before diagnosing"

**Confirmed.** Five commits trying model IDs:
```
a380567  Try multiple model candidates
77e3656  Add timeouts and health endpoint
3f6fc30  Expand model ID list
a7aa497  Fix to confirmed working model
```

The `pipeline.ts` has `[Pipeline]` console.log breadcrumbs at every step. Reading Vercel function logs would have shown exactly which step failed. Instead, 4 deploy-test cycles were burned guessing.

### 2.2 "Built features while the pipeline was broken"

**Confirmed.** Savings/credit card/P60 schemas, visual polish, V1 replay, and the debug panel were all built while every upload returned a 504.

### 2.3 "Didn't check the handoff's known issues first"

**Confirmed.** Session 2 handoff explicitly warned: "Sonnet model ID `claude-sonnet-4-5-20241022` needs verification." This became the exact time sink.

---

## 3. Current Architecture (Post-Pivot)

### 3.1 Information Architecture

```
3 Phases (concurrent, not sequential):
  Prepare  → Build financial picture (V2 — current)
  Resolve  → Share, negotiate (V3-V4 — future)
  Formalise → Consent order, court submission (V5 — future)
```

### 3.2 Hub + Hero Panel Model

Single page (`/workspace`) with two zones:
- **Hero panel** (top): 8-state machine handling upload → processing → Q&A → summary
- **Section cards** (below): personalised financial picture, fade to 70% during hero activity

This replaces the old workspace with sidebar, two-tier tabs, and 11 category tabs.

### 3.3 AI Pipeline (Two-Step)

```
Step 1: Haiku (claude-haiku-4-5-20251001)
  → Reads PDF via type:'document', classifies, extracts text
  → 45s timeout per call

Step 2: Sonnet (claude-sonnet-4-6)
  → Analyses extracted text with structured outputs
  → Document-type-specific prompt (7 types)
  → JSON schema constrains response
  → 45s timeout per call
```

Route: `maxDuration = 120` (Vercel Pro allows 300s)

### 3.4 Fidelity Model

| Level | User has | Can do |
|-------|----------|--------|
| Sketch | Discovery estimates only | Self-assessment |
| Draft | Some documents processed | First mediation, share with solicitor |
| Evidenced | Full documents, CETVs | Formal Form E, court disclosure |
| Locked | Complete, reviewed | Consent order submission |

### 3.5 What's Built

**Hub UI** — title bar, hero panel (8 states), discovery flow, section cards, evidence lozenges, fidelity labels, debug panel

**AI Pipeline** — two-step extraction (Haiku→Sonnet), 7 document-type schemas/prompts/transformers, health endpoint

**Supporting** — hub types, use-hub hook (real API calls), localStorage persistence

### 3.6 What's Not Built

- **Pipeline 504 unresolved** — the critical blocker
- Spec 14 manual input wizards (property, pensions, debts, other, business, spending, life after separation)
- Section card "Review details" flow
- Cross-document intelligence
- Side-by-side PDF review modal
- Document storage (Supabase)
- Visual testing in browser (zero done)

---

## 4. The 504 Blocker

### What's Confirmed
- Vercel Pro, 300s function timeout — not a plan issue
- `maxDuration = 120` in route — within limits
- Haiku works (479ms on health check)
- Sonnet works (993ms on health check)
- API key is set and valid
- 45s per-call SDK timeout added
- Health endpoint works fine

### What's Unknown
- Does Step 1 (Haiku PDF reading) actually complete? → **Check Vercel logs**
- Is the PDF too large? → **Check uploaded file size**
- Does `type: 'document'` work with SDK 0.85? → **Test in isolation**
- Does `response_format` with `json_schema` work with Sonnet? → **Test in isolation**
- Is there a Vercel body size limit for API routes (vs server actions)? → **Check**

### Console.log Breadcrumbs (pipeline.ts)

```
[Pipeline] Step 1: Haiku reading PDF and classifying...
[Pipeline] Step 1 complete: ${in} in, ${out} out, ${ms}ms
[Pipeline] Classified as: ${type} (confidence: ${conf}), text: ${len} chars
[Pipeline] Step 2: claude-sonnet-4-6 analysing as ${type}...
[Pipeline] Step 2 complete: ${in} in, ${out} out, ${ms}ms
[Pipeline] Extraction complete for ${type}
```

Read the Vercel logs. The breadcrumbs will show exactly where it dies.

---

## 5. Spec Audit — What's Active vs Superseded

### Active Specs (post-pivot)

| Spec | Purpose | Built? |
|------|---------|--------|
| **v2-design-pivot.md** | Architecture pivot rationale | N/A (design doc) |
| **13** (Extraction: Documents) | Decision trees for 7 doc types, Form E mapping | Pipeline built, prompts built |
| **14** (Extraction: Wizards) | Manual input flows per section | Not built (TODO stubs) |
| **15** (Discovery Flow) | First-time config, 10 screens | Built |
| **16** (Hero Panel) | 8-state machine, Q&A flow | Built |
| **17** (Hub Page States) | Section cards, fidelity, page states | Built |
| **18** (Visual Design System) | Functional palette, typography, components | Tokens in CSS, components unstyled |

### Superseded Specs (pre-pivot, retained for history)

| Spec | Superseded By |
|------|--------------|
| 03 (Sidebar) | Hamburger + left nav |
| 04 (Workspace Home) | Hub page (spec 17) |
| 05, 05b (Build Your Picture) | Hub + hero panel |
| 06 (Category Detail) | Section card review flow |
| 11 (AI Question Mapping) | Specs 13 + 14 (decision trees) |
| 12 (Two-Tier Tabs) | Hub single-page model |

### Partially Relevant (concepts carry forward)

| Spec | What carries forward |
|------|---------------------|
| 01 (Design System) | Typography/spacing principles (visual tokens updated in 18) |
| 07 (Future Phases) | Placeholder approach valid, phase count changed |
| 08 (Interaction Patterns) | Modal/navigation principles still apply |
| 09 (Upload & Review) | Upload concept → now via hero panel |
| 10, 10b (AI Analysis/Tiered) | Confidence model → expressed through hero panel states |

---

## 6. Recommendations for Session 5

### Phase 1: Diagnose the 504 (30 min)

1. Check Vercel function logs for `/api/documents/extract`
2. Look for `[Pipeline]` and `[API]` breadcrumbs — identify which step dies
3. Test Step 1 in isolation (Haiku PDF read, no Step 2)
4. Test structured outputs in isolation (Sonnet with `response_format.json_schema`)
5. Check SDK 0.85 compatibility with `type: 'document'` content blocks

### Phase 2: Fix Based on Evidence (1 hour)

One targeted fix. Not guessing. Based on what the logs show.

### Phase 3: Visual Testing in Browser (1 hour)

Zero visual testing has been done. Start the dev server. Walk through:
1. Discovery flow → hub populates with sections
2. Upload a document → hero panel state transitions
3. Auto-confirm → clarification → summary
4. Section cards update with confirmed data

### Phase 4: Visual Quality Pass (2-3 hours)

Components match wireframe structure but need spec 18 styling:
- 70% opacity fade during hero activity
- Processing animation (sophisticated, not whimsical)
- Card shadows, button styles, spacing
- Evidence lozenge transitions

### Do NOT Do Yet

- More document type schemas (7 is enough until pipeline works)
- Spec 14 wizards (manual input) — pipeline must work first
- Supabase persistence — localStorage fine for now
- Cross-document intelligence — single doc quality first
- Side-by-side PDF modal — needs document storage

---

## 7. Key Files

### Must-read for Session 5

```
docs/HANDOFF-SESSION-3.md              ← Session 3 retro + 504 analysis
docs/README.md                          ← Documentation index + reading order
src/lib/ai/pipeline.ts                  ← Two-step extraction (the 504 lives here)
src/app/api/documents/extract/route.ts  ← API entry point
src/app/api/health/route.ts             ← Model availability checker
src/hooks/use-hub.ts                    ← Hub state + hero panel state machine
```

### Active specs (post-pivot)

```
docs/v2/v2-design-pivot.md
docs/workspace-spec/13-extraction-decision-tree-documents.md
docs/workspace-spec/14-extraction-decision-tree-wizard.md
docs/workspace-spec/15-discovery-configuration-flow.md
docs/workspace-spec/16-hero-panel-flow.md
docs/workspace-spec/17-hub-page-states.md
docs/workspace-spec/18-visual-design-system.md
```
