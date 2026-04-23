# Session 2 Handoff

**Date:** 11 April 2026
**Branch:** `claude/review-handoff-docs-ZovbO`
**Latest commit:** `d85a57f`

---

## What happened this session

A comprehensive review of all documentation led to V2 desk research, a major design pivot, wireframe analysis, new specs, and the beginning of a rebuild.

### Phase 1: Documentation review and research

- Reviewed all 21 existing docs, identified gaps and inconsistencies
- Added deprecation markers, smoke test protocol, decisions register, docs index
- Conducted V2 desk research across 6 parallel streams (100+ sources):
  - Form E practice, real user pain (Mumsnet/Reddit), pension complexity (CETV/PODE/PAG2), AI extraction benchmarks, competitors (Armalytix/Splitifi/LEAP), regulatory landscape (Data Use and Access Act 2025, NCDR mandate)
- Produced research implications document reprioritising the build

### Phase 2: Design pivot

Test user feedback: "too soft, condescending, want simplicity and empowerment." Combined with research findings, this drove a fundamental architecture change:

- **5 phases → 3:** Prepare → Resolve → Formalise
- **Sidebar + tabs → Hub + hero panel:** Single page, one dynamic component
- **Warm/soft → Sophisticated/empowering:** Functional colour, high contrast, clean
- **Category tabs → Personalised section cards:** Generated from discovery dialogue
- **Generic upload → Guided evidence journey:** Hero panel state machine

### Phase 3: Specs written

| Spec | File |
|------|------|
| Design Pivot | `docs/v2/v2-design-pivot.md` |
| Discovery Flow | `docs/workspace-spec/15-discovery-configuration-flow.md` |
| Hero Panel Flow | `docs/workspace-spec/16-hero-panel-flow.md` |
| Hub Page States | `docs/workspace-spec/17-hub-page-states.md` |
| Visual Design System | `docs/workspace-spec/18-visual-design-system.md` |
| Extraction: Documents | `docs/workspace-spec/13-extraction-decision-tree-documents.md` |
| Extraction: Wizards | `docs/workspace-spec/14-extraction-decision-tree-wizard.md` |
| Full Backlog | `docs/v2/v2-backlog.md` |

### Phase 4: Build started

New hub architecture built from scratch. AI pipeline rebuilt.

---

## What's built (new code)

### Hub UI (`src/components/hub/`)

| File | What it does |
|------|-------------|
| `title-bar.tsx` | Nav bar + title with hamburger, breadcrumb, "Share & collaborate" CTA |
| `hero-panel.tsx` | 8-state machine: ready → uploading (×3) → review → auto-confirm → clarification → summary |
| `discovery-flow.tsx` | Config wizard: welcome → employment → property → pensions → savings → debts → other → summary |
| `section-cards.tsx` | Section cards with empty/estimate/partial/evidenced states |
| `evidence-lozenge.tsx` | Tri-state pill (empty/spinner/tick) with expandable document flyout |
| `fidelity-label.tsx` | Readiness indicator (sketch/draft/evidenced/locked) |

### AI Pipeline (`src/lib/ai/`)

| File | What it does |
|------|-------------|
| `pipeline.ts` | Two-step extraction: Haiku reads PDF → Sonnet analyses text with structured outputs |
| `extraction-schemas.ts` | TypeScript interfaces + JSON schemas for bank statement, payslip, mortgage, pension CETV |
| `extraction-prompts.ts` | Document-type-specific prompts grounded in decision tree spec 13 |
| `result-transformer.ts` | Transforms pipeline output into hero panel Q&A format (AutoConfirmItem[], ClarificationQuestion[]) |

### Supporting

| File | What it does |
|------|-------------|
| `types/hub.ts` | Full type system: fidelity, sections, lozenges, config, hero states, Q&A types |
| `hooks/use-hub.ts` | State management: config persistence, section derivation, hero panel transitions |
| `globals.css` | New design tokens (functional palette, legacy tokens preserved for V1) |
| `api/documents/extract/route.ts` | Updated to use new two-step pipeline |

---

## What's NOT done yet

### Immediate (to make the build testable)

1. **Wire `use-hub.ts` to real API** — currently uses mock data with `setTimeout`. Needs to call `/api/documents/extract`, receive `PipelineResult`, run through `result-transformer.ts`, and populate hero panel state.
2. **Visual polish** — components are functional but unstyled beyond basic Tailwind. Need to match spec 18 precisely: shadows, transitions, spacing, the 70% fade, processing animation.
3. **Start dev server and test in browser** — zero visual testing has been done this session.

### Near-term (from backlog items 33-44)

4. Section card "Review details" flow
5. Return visit experience (hero panel shows "still to upload")
6. Estimate supersession (evidence replaces config estimates)
7. Multi-document upload (mixed types simultaneously)
8. Statement completeness tracking (3 of 12 months)

### AI pipeline gaps

9. Structured outputs may need API version check — Anthropic's `response_format.json_schema` requires SDK ≥0.85 (we have 0.85)
10. Sonnet model ID `claude-sonnet-4-5-20241022` needs verification — previous sessions found some model IDs don't work
11. Haiku fallback in `pipeline.ts` doesn't use structured outputs (intentional — fallback should be resilient)
12. No retry logic on API failure yet
13. Document storage (Supabase Storage) not implemented — PDFs are processed but not persisted

---

## Key decisions made this session

1. **3 phases not 5** — Prepare, Resolve, Formalise
2. **Hub + hero panel, not workspace + tabs** — single page, one focal point
3. **Hero panel is a state machine** — transforms in place, user never navigates away
4. **Section cards fade 70% during hero activity** — attention management
5. **Lozenges are tri-state with flyout** — status + count + document list
6. **Discovery generates the hub** — first-time page is empty except "Get started"
7. **Config uses inline progressive disclosure** — no separate sub-flow screens
8. **Two-step AI pipeline** — Haiku reads PDF → Sonnet analyses text
9. **Structured outputs** — JSON schema constrains AI response
10. **Document-type-specific prompts** — each doc type has tailored extraction
11. **Conservative confidence thresholds** — auto ≥0.95, confirm 0.80-0.95
12. **Every question maps to Form E** — if it doesn't fill a disclosure value, don't ask
13. **Visual direction: sophisticated not soft** — functional colour, black CTAs, generous spacing, sharp corners

---

## Reading order for new session

1. **This document** — you're here
2. **`docs/README.md`** — full documentation index with reading order
3. **`docs/v2/v2-design-pivot.md`** — the architectural pivot and why
4. **`docs/workspace-spec/16-hero-panel-flow.md`** — the core interaction
5. **`docs/v2/v2-backlog.md`** — 98 items, prioritised

For research context: `docs/v2/v2-desk-research-form-e.md`, `v2-desk-research-pensions-assets.md`, `v2-desk-research-technology.md`

---

## Priority for next session

**1. Wire the pipeline to the UI and test.** The `use-hub.ts` hook needs to call the real API instead of mock data. Then start the dev server and test the full flow in a browser.

**2. Visual quality pass.** The components match the wireframe structure but need precise styling per spec 18. The 70% fade, processing animation, card shadows, button styles, spacing — all need implementation attention.

**3. Iterate on extraction quality.** Upload real documents, evaluate the questions generated, tune the prompts. This is where quality lives or dies.
