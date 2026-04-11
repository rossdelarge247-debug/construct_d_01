# V2 Design Pivot — From Workspace to Guided Preparation

**Date:** 10 April 2026
**Status:** Active — this document supersedes the previous workspace architecture
**Driven by:** V2 desk research findings, test user feedback, wireframe exploration

---

## 1. Why the pivot

### Test user feedback

The existing V2 build (sidebar + two-tier tabs + category tabs + upload zone) was shown to test users. Feedback:

- "Doesn't feel modern, empowering, or seemingly magical enough"
- "Too soft — feels like a condescending hug, not sophisticated"
- "Want simplicity — stripping the noise away, question and answer, guided"

### Research findings that reinforce the pivot

- **Form E is administrative pain, not intellectual challenge.** Users don't need a workspace with tools — they need a guide that does the work for them.
- **"Where do I even start?"** is the #1 question across all forums. The previous design answered this with a workspace full of categories. The new design answers it with a conversation.
- **The TurboTax pattern** (one question per screen, live output updating) is proven for exactly this type of complex, intimidating multi-section document.
- **The GOV.UK Task List pattern** (non-linear hub with per-section status) is the most rigorously tested model for multi-session complex tasks.
- **96% increase in self-representation** means these users need more guidance, not more tools.

### What was wrong with the previous architecture

| Previous | Problem |
|----------|---------|
| Sidebar with 5 phases | Visual noise before the user has done anything |
| Two-tier tabs (Preparation/Summary + categories) | Too much interface, too many navigation decisions |
| Upload zone as one component among many | Upload competes for attention with categories, summary, readiness bar |
| Category tabs (11 categories) | Overwhelming — looks like Form E in disguise |
| First-time wizard (3 steps) | Too shallow — asks which categories are relevant without asking what the user actually has |

---

## 2. The new information architecture

### From 5 phases to 3

The previous 5-phase model assumed linearity: Build → Share → Negotiate → Agree → Formalise. The research shows reality is concurrent: preparation and collaboration overlap, and agreement and formalisation are one continuous action.

| Previous | New | Rationale |
|----------|-----|-----------|
| Build Your Picture | **Prepare** | Building your disclosure — ongoing, returnable, iterative |
| Share & Disclose | **Resolve** | Sharing, comparing, negotiating — concurrent with Prepare |
| Work Through It | *(merged into Resolve)* | Negotiation is part of resolution, not a separate phase |
| Reach Agreement | **Formalise** | Agreement → consent order → court submission → tracking |
| Make It Official | *(merged into Formalise)* | Making it official IS formalising |

### Navigation model

- **Hamburger menu** triggers a left-hand nav panel
- The nav is an **empty shell** until the full IA is validated — shows the three phases but doesn't build Phase 2/3 yet
- Within Phase 1 (Prepare), everything happens on **one page** — the hub
- No sidebar, no persistent phase navigation cluttering the main content

### The hub as the single page

Everything in the Prepare phase lives on one page: the **Overview hub**. It has two zones:

1. **Hero panel** (top) — the dynamic, multi-purpose component that handles upload, processing, clarification, and guidance
2. **Section cards** (below) — the financial picture summary, updating as evidence is confirmed

The user never navigates away from this page during the preparation phase. The hero panel transforms in place.

---

## 3. Fidelity levels

The financial picture exists on a continuum, not as draft/final binary. Each level is named and independently useful:

| Level | What the user has | What they can do with it | Export format |
|-------|------------------|------------------------|--------------|
| **Sketch** | Estimates from discovery dialogue only | Understand own position, first self-assessment | Plain language summary with gaps marked |
| **Draft** | Some documents processed, some estimates | First mediation conversation, share with solicitor, NFM Open Financial Statement | Structured summary with evidence status per item |
| **Evidenced** | Full documents (12 months statements, CETVs, valuations), confirmed values | Formal Form E, court disclosure, Express Pilot first hearing | Form E equivalent with supporting document list |
| **Locked** | Complete, reviewed, no outstanding items | Consent order submission, D81 | Court-ready Form E + D81 data + document bundle |

**The picture is always previewable and exportable at every level.** A Sketch export says "Draft — based on estimates only" with gaps clearly marked. An Evidenced export is a formal disclosure document. No fidelity threshold gates access to viewing or sharing.

The fidelity level is communicated on the hub via a label: "Not yet ready for first mediation conversation" → "Ready for first mediation conversation" → "Ready for formal disclosure" → "Complete — ready for consent order."

---

## 4. Visual direction shift

### From warm and soft to sophisticated and empowering

The "warm hand on a cold day" thesis remains correct for **content and tone** — compassionate, never clinical. But the visual execution must shift:

| Previous | New direction |
|----------|-------------|
| Cream backgrounds everywhere | Clean whites and purposeful contrast |
| Warmth/sage/amber palette as atmosphere | Colour used sparingly — for status, action, emphasis only |
| Rounded, relaxed, generous spacing | Structured density — information-rich but never cluttered |
| Sparkle animations | Smooth, purposeful transitions that communicate state changes |
| "Gentle" feel throughout | "Confident" feel — the product knows what it's doing |

**The principle:** Warmth stays in the words. Confidence lives in the interface. Think: a brilliant financial adviser who happens to be kind, not a kind person who happens to know about finances.

### Reference products for visual direction

- **Stripe Dashboard** — information-dense, clean, confident
- **Linear** — sophisticated, structured, modern
- **Better.com** — financial product that feels premium and trustworthy
- **GOV.UK** — clean, purposeful, no decoration for decoration's sake

---

## 5. Section categories — human language, Form E underneath

Sections shown on the hub are personalised based on the discovery dialogue. Human language on the surface, Form E mapping internal.

### Always visible (everyone has these)

| User sees | Form E sections |
|-----------|----------------|
| **Income** | 2.15–2.20 |
| **Spending** | 3.1 (Expenditure) |
| **Accounts** | 2.3 (Bank accounts), 2.4 (Investments) |

### Shown if relevant (triggered by discovery)

| User sees | Triggered by | Form E sections |
|-----------|-------------|----------------|
| **Your home** | Owns property | 2.1 |
| **Other property** | Owns additional property | 2.2 |
| **Your pensions** | Has pension(s) | 2.13 |
| **What you owe** | Has debts | 2.14 |
| **Your business** | Self-employed or director | 2.10, 2.11, 2.16 |
| **Other assets** | Has vehicles, crypto, valuables, overseas assets, life insurance | 2.4–2.9 |
| **Your children** | Children exist (from V1 or discovery) | Part 1.5, feeding V3/V4 |

### Shown later (prompted at fidelity thresholds)

| User sees | When | Form E sections |
|-----------|------|----------------|
| **Life after separation** | Draft fidelity reached | Part 3 (Income needs), Part 4 (Standard of living) |

### Always available

**"+ More to disclose"** — handles cases where something was missed in discovery (forgotten pension, newly remembered asset, etc.)

---

## 6. Key design decisions

### D1. One page, one focal point

The hub is the only page in the Prepare phase. The hero panel is the only interaction point for upload and review. Section cards are the passive scorecard. No modals, no separate pages, no tab switching.

### D2. The hero panel is a state machine

The hero panel transforms through states within the same physical area of the page:

| State | Hero panel shows |
|-------|-----------------|
| Ready for upload | Title, evidence lozenges, drag-and-drop zone |
| Uploading | AI animation, contextual messages, lozenge spinners |
| Analysing | Lozenge ticks, "processing transactions..." |
| Ready for review | "100% complete", review/upload-more choice |
| Auto-confirm | "Easy ones" with batch accept |
| Clarification | One question at a time with reasoning |
| Summary | Achievements, todo list, continue/finish choice |
| Return visit | "Still to be uploaded" with remaining lozenges |

### D3. Section cards fade during hero panel activity

When the hero panel is in upload/processing/clarification mode, section cards fade to 70% opacity. This directs all attention to the hero panel. When the flow completes (user clicks "Finished for now"), section cards return to full opacity with updated data.

### D4. Lozenges are tri-state with expandable detail

Evidence lozenges (Current account, Pensions, Mortgage details, etc.) serve three functions:

- **Status:** Empty (not uploaded) → Spinner (uploading) → Tick (uploaded/processed)
- **Count:** "1 Current account", "2 Other assets" — updates as documents are classified
- **Detail:** Chevron expands a flyout showing exactly what was received (e.g., "June 2026 Barclays statement, July 2026 Barclays statement"). On return visits, this shows cumulative uploads and completeness (e.g., "4 of 12 months provided").

### D5. Questions always show reasoning

Every clarification question explains why the system is asking. Not just "Is this your mortgage?" but "£1,150 goes to Halifax on the 1st of each month. When we see a regular payment to a building society for this sort of amount each month we assume it might be a mortgage payment." The system is transparent about its logic.

### D6. Collaboration unlocks at Draft fidelity

A "Share & collaborate" button appears in the title bar when the picture reaches Draft fidelity ("ready for first mediation conversation"). This isn't a hard gate — but the button's appearance signals a meaningful threshold.

### D7. Every section card has a "Manually input" option

Users who prefer to type (or have no documents) can bypass the upload flow entirely and enter data directly into any section card via "Manually input" links.

---

## 7. What this supersedes

| Previous document | Status |
|------------------|--------|
| `workspace-spec/05b-build-your-picture-revised.md` | **Superseded** — two-tier tab architecture replaced by hub + hero panel |
| `workspace-spec/12-two-tier-tabs.md` | **Superseded** — no longer using page-level or category-level tabs |
| `workspace-spec/03-sidebar-navigation.md` | **Superseded** — sidebar replaced by hamburger + left nav panel |
| `v2/workspace-visual-redesign.md` | **Partially superseded** — visual direction shifting from warm/soft to sophisticated/empowering. Colour tokens and layout principles still relevant but visual execution changing. |
| `workspace-spec/04-workspace-home.md` | **Superseded** — workspace home replaced by hub page |
| `workspace-spec/09-upload-review-flow.md` | **Partially superseded** — upload zone concept validated but implementation changing to hero panel state machine. Side-by-side PDF review pattern still planned as future enhancement. |

Documents that remain current:
- `workspace-spec/01-design-system.md` — typography and spacing principles still apply (visual execution updating)
- `workspace-spec/08-interaction-patterns.md` — modal/navigation principles still relevant
- `workspace-spec/10-ai-analysis-flow.md` — AI analysis concept still valid
- `workspace-spec/10b-ai-tiered-questions.md` — tiered confidence model still valid, now expressed through hero panel states
- `workspace-spec/13-extraction-decision-tree-documents.md` — current, drives hero panel Q&A
- `workspace-spec/14-extraction-decision-tree-wizard.md` — current, drives manual input flows

---

## 8. Build implications

### What can be reused from the current codebase

- **AI provider layer** (`lib/ai/provider.ts`) — still needed
- **Document analysis** (`lib/ai/document-analysis.ts`) — needs updating for structured outputs and document-type-specific prompts, but core approach valid
- **API route** (`api/documents/extract/route.ts`) — still needed, needs structured output upgrade
- **Workspace hook** (`hooks/use-workspace.ts`) — state management approach reusable, data model needs updating
- **Type definitions** (`types/workspace.ts`) — needs updating for new section categories and fidelity model
- **Design tokens** (`globals.css`) — palette partially reusable, visual execution updating

### What needs rebuilding from scratch

- **Page layout** — no sidebar, no tabs. Single page hub with hero panel + section cards
- **Hero panel component** — new. The state machine with upload/processing/clarification/summary states
- **Section cards** — new. Simpler than category tabs, with fidelity indicators and evidence status
- **Discovery dialogue** — new. Configuration wizard (replaces first-time wizard)
- **Navigation** — new. Hamburger menu + left nav panel
- **Evidence lozenges** — new. Tri-state with expandable flyout

### Recommended build sequence

1. **Hub page shell** — layout with hero panel zone + section cards zone
2. **Discovery dialogue** — config flow that generates personalised sections and evidence checklist
3. **Hero panel: upload + processing states** — drag/drop, file handling, AI processing animation
4. **Hero panel: clarification states** — Q&A flow driven by extraction decision trees (specs 13/14)
5. **Hero panel: summary state** — achievements, todo list, continue/finish
6. **Section cards** — rendering extracted data, estimates, evidence status, manual input
7. **Fidelity system** — calculating and displaying readiness level, unlocking collaboration CTA
8. **Export** — generating structured summary at current fidelity level
