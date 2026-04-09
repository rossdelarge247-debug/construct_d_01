# Workspace Design Spec — 02: Page Map

## Overview

The workspace has a clear page hierarchy. Every page has a purpose, a URL, and a defined relationship to other pages.

---

## Page hierarchy

```
/workspace                         ← Workspace Home (mission control)
│
├── /workspace/build               ← Build Your Picture (phase detail)
│   │
│   ├── /workspace/build/income    ← Category: Income
│   ├── /workspace/build/savings   ← Category: Savings & accounts
│   ├── /workspace/build/property  ← Category: Property
│   ├── /workspace/build/pensions  ← Category: Pensions
│   ├── /workspace/build/debts     ← Category: Debts & liabilities
│   ├── /workspace/build/outgoings ← Category: Outgoings review
│   ├── /workspace/build/other     ← Category: Other assets
│   ├── /workspace/build/business  ← Category: Business (if relevant)
│   ├── /workspace/build/children  ← Category: Children (if relevant)
│   ├── /workspace/build/budget    ← Post-separation budget
│   └── /workspace/build/summary   ← Financial picture summary (printable)
│
├── /workspace/disclose            ← Share & Disclose (future — zero state)
├── /workspace/negotiate           ← Work Through It (future — zero state)
├── /workspace/agree               ← Reach Agreement (future — zero state)
└── /workspace/finalise            ← Make It Official (future — zero state)
```

Note: URL structure changed from `/workspace/picture` to `/workspace/build` — shorter, clearer, matches the phase name.

---

## Page purposes

### /workspace — Workspace Home

**The mission control view.** Shows the entire journey at a glance.

NOT the same as "Build your picture." This page shows:
- Welcome/greeting (personalised)
- Journey progress across ALL phases (visual timeline or card view)
- The current active phase with a summary of its status
- Key numbers (if any financial data exists)
- The single most important next action
- Quick links to common tasks

The user comes here to orient. They go INTO a phase to work.

### /workspace/build — Build Your Picture

**The phase detail view.** Where the actual work of building the financial picture happens.

Shows:
- Phase header (what this phase is about)
- Inline upload zone (drag/drop, always visible)
- Category progress cards
- Items captured so far (summary per category)
- Readiness toward disclosure
- Guided next action within this phase

### /workspace/build/{category} — Category Detail

**Drill-in to a specific financial category.** Upload documents for this category, review extracted items, add manually.

The upload flow happens HERE, not on a separate page. Upload → extract → review all happens inline within the category.

### /workspace/disclose, /negotiate, /agree, /finalise — Future Phases

**Zero-data states** with:
- What this phase involves (education)
- What you need to have done before entering it
- Any data that's already emerging from earlier phases
- How the paid service helps at this stage
- CTA to continue building (if not ready) or enter this phase (if ready)

---

## Key principle: No unnecessary page transitions

| Action | Current (wrong) | Correct |
|--------|----------------|---------|
| Upload a document | Click "Upload" → navigate to /picture → upload | Upload zone is inline on /workspace/build. Drop it right there. |
| View a category | Click card → navigate to /picture/{cat} | Click card → expand inline OR navigate to /workspace/build/{cat} |
| Add item manually | Click "Enter manually" → navigate to /picture/manual | Modal or inline form within the category view |
| Go back | Browser back / text link | Sidebar always shows where you are. Click sidebar to navigate. |
| Switch categories | Back to hub → click different category | Sidebar sub-items let you jump directly between categories |

The rule: **if an action can happen without a page change, it should.** Page changes are for moving between fundamentally different views (home → phase, phase → category). Not for opening an upload dialog.

---

## URL → Page → Sidebar state mapping

| URL | Page title | Sidebar active | Sidebar sub-items |
|-----|-----------|---------------|-------------------|
| /workspace | Home | None (or subtle home indicator) | Journey phases only |
| /workspace/build | Build your picture | "Build your picture" highlighted | Category list |
| /workspace/build/income | Income | "Build your picture" highlighted, "Income" sub-highlighted | Category list |
| /workspace/build/pensions | Pensions | "Build your picture" highlighted, "Pensions" sub-highlighted | Category list |
| /workspace/disclose | Share & disclose | "Share & disclose" highlighted | None (zero state) |

---

## Navigation patterns

### Primary navigation: Sidebar

The sidebar is the persistent navigation anchor. The user should NEVER need to use the browser back button.

### Within a phase: Sidebar sub-items

When inside "Build your picture", the sidebar shows category sub-items. Click any to jump directly. No need to go "back" to the phase hub — just click a different category.

### Back to workspace home

The logo "Decouple" in the sidebar always links to /workspace. Clicking it from any depth returns to mission control.

### Breadcrumbs

NOT needed in the sidebar model. The sidebar already shows context:
- Which phase you're in (highlighted)
- Which category you're in (sub-highlighted)

If we show breadcrumbs at all, it's a simple "← Back to overview" text link at the top of category detail pages. Not a hierarchical breadcrumb trail.
