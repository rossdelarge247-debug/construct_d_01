# Workspace Design Spec — 05b: Build Your Picture (Revised)

## Replaces: 05-build-your-picture.md

## URL: /workspace/build

## Core concept

One page. Three zones stacked vertically:

1. **Phase header** — title, subtitle, progress bar along the edge
2. **Tabbed work area** — the active category capture/review component
3. **Live financial picture** — the growing summary of everything captured

No page navigation between categories. Tabs switch the work area content. The financial picture below updates in real time as you add data.

---

## Layout

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  ← Back to workspace                                        │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ BUILD YOUR PICTURE                                   │   │
│  │ Bring everything together — finances, property,      │   │
│  │ pensions. Upload documents and we do the heavy       │   │
│  │ lifting.                                             │   │
│  │                                ██████████░░░░  55%   │   │
│  │                                                      │   │
│  │  Ready to share with a mediator ──────────────────   │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ [How this works — dismissable first-visit panel]     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Current  │ Savings │ Property│ Pensions│ Debts │ ··· → │
│  │ account  │         │         │         │       │       │
│  │ 3 items  │         │         │  ⏳     │       │       │
│  ├──────────┴─────────┴─────────┴─────────┴───────┤       │
│  │                                                 │       │
│  │  CURRENT ACCOUNT                                │       │
│  │                                                 │       │
│  │  ┌──────────────────────────────────────────┐  │       │
│  │  │                                          │  │       │
│  │  │  📎 Drop your current account statement  │  │       │
│  │  │     here                                 │  │       │
│  │  │                                          │  │       │
│  │  │  [Upload your current account]           │  │       │
│  │  │                                          │  │       │
│  │  └──────────────────────────────────────────┘  │       │
│  │                                                 │       │
│  │  Or [Enter details manually]                    │       │
│  │                                                 │       │
│  │  ── ITEMS CAPTURED ───────────────────────────  │       │
│  │                                                 │       │
│  │  ┌──────────────────────────────────────────┐  │       │
│  │  │ Monthly salary    Yours  Known  £3,218   │  │       │
│  │  │ From: payslip_mar.pdf     [Edit] [View]  │  │       │
│  │  └──────────────────────────────────────────┘  │       │
│  │  ┌──────────────────────────────────────────┐  │       │
│  │  │ Child benefit     Yours  Known  £96/mo   │  │       │
│  │  │ From: bank statement       [Edit] [View] │  │       │
│  │  └──────────────────────────────────────────┘  │       │
│  │                                                 │       │
│  │  💡 Any bonuses, overtime, or rental income?   │       │
│  │     [Add another income source]                 │       │
│  │                                                 │       │
│  └─────────────────────────────────────────────────┘       │
│                                                             │
│  ───────────────────────────────────────────────────────    │
│                                                             │
│  YOUR FINANCIAL PICTURE                                     │
│                                                             │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐                   │
│  │ ASSETS   │ │ LIABIL.  │ │ NET      │                   │
│  │ £347,400 │ │ £199,200 │ │ £148,200 │                   │
│  └──────────┘ └──────────┘ └──────────┘                   │
│                                                             │
│  Income     ✓ £3,218/mo  │  Outgoings  ✓ £2,450/mo       │
│  Savings    ✓ £12,400    │  Debts      ✓ £4,200          │
│  Property   ◐ £320,000   │  Pensions   ⏳ CETV awaiting   │
│  Other      ○ Not started │  Children   ○ Not started      │
│                                                             │
│  💡 Your pension is unknown and often the largest asset.   │
│  Request a CETV now — takes up to 3 months.                │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Zone 1: Phase header

A warmth-coloured block with:
- Phase title: "BUILD YOUR PICTURE" (h1, white, bold)
- Subtitle: "Bring everything together..." (white/80)
- **Progress bar along the bottom edge** of the block, showing readiness 0-100%
- When progress hits a milestone (e.g., "Ready to share with a mediator"), this is labelled on the bar
- The bar colour transitions: warmth (in progress) → sage (reached milestone)

---

## Zone 2: Tabbed work area

### The tab bar

A horizontal row of category tabs. Scrollable on mobile.

```
[Current account] [Savings & accounts] [Property] [Pensions] [Debts & liabilities] [Other income] [Other assets] [Business] [Outgoings] [Budget] [Children] →
```

**Tab design:**
- Active tab: bold text, warmth bottom border (3px), surface background
- Tabs with data: show status indicator below the label ("3 items", "✓", "⏳")
- Empty tabs: muted text, no indicator
- Tab hover: cream-dark background
- Scrollable: horizontal scroll on mobile/tablet, scroll indicators (→) when overflow
- Tab bar has a bottom border (2px cream-dark) that the active tab's warmth border sits on top of

**Tab visibility:**
- Tabs are adaptive based on V1 data. If no children → children tab hidden. If not self-employed → business tab hidden.
- Core tabs always visible: Current account, Savings, Property, Pensions, Debts
- Optional tabs: Other income, Other assets, Business, Outgoings, Budget, Children

### Content area below tabs

Each tab has its own content that renders when selected. Tab switches are instant — no page load, no animation delay. Content just swaps.

**Content structure per tab:**

1. **Upload zone** — contextual to this category
   - "Drop your current account statement here"
   - "Upload your pension letter"
   - Each tab knows what document is most relevant

2. **"Enter details manually" link** → opens modal

3. **Items captured so far** — list of confirmed/estimated items for this category
   - If no items: encouraging zero state ("No income items yet. Upload a payslip or bank statement, or enter details manually.")
   - Items show: label, value, confidence, ownership, source, edit/remove actions

4. **AI prompt** — contextual question for this category
   - "Any bonuses, overtime, or rental income?"
   - "Any old workplace pensions from previous employers?"
   - With CTA: "Add another [category] source"

5. **Category-specific components:**
   - Pensions tab: CETV tracker component
   - Outgoings tab: spending category breakdown with expandable transactions
   - Children tab: arrangements planner
   - Budget tab: post-separation projection

### Upload + review within the tab

When a document is uploaded in a tab:
1. Upload zone transforms to processing state (inline, within the tab content)
2. Processing completes → review panel appears within the tab content (pushes items list down)
3. User reviews and confirms
4. Items are added to this tab's item list
5. Upload zone returns to idle
6. Financial picture below updates in real time

**The entire upload → process → review → confirm cycle happens within the tab.** No modals, no page changes. The tab content expands and contracts as needed.

---

## Zone 3: Live financial picture

Below the tabbed work area, a summary section that builds as data is captured.

### Empty state (first visit)

```
YOUR FINANCIAL PICTURE

We'll build your picture here as you add information above.
Start with your current account — it tells us the most.

[Light illustration or warm empty state graphic]
```

Sympathetic, not clinical. Not just "nothing here yet" — warm, encouraging, clear about what will appear.

### Populated state

**Hero numbers row:**
Three cards: Assets, Liabilities, Net position. Large numbers (hero size). Count-up animation when values change.

**Category summary grid:**
Two columns on desktop, stacked on mobile. Each row:
- Category name
- Status icon (✓ sage, ◐ amber, ⏳ amber, ○ muted)
- Value or status text
- Click → scrolls up to that tab and selects it

**AI insight:**
One contextual recommendation based on what's captured and what's missing. Changes as the picture builds.

---

## The "How this works" panel

First-visit only. Dismissable (click ✕, persisted in localStorage).

```
┌─────────────────────────────────────────────────────────┐
│  HOW THIS WORKS                                    ✕    │
│                                                         │
│  1  Upload a document — we read, extract, and           │
│     categorise everything automatically                 │
│                                                         │
│  2  Review what we found and confirm or correct         │
│                                                         │
│  3  Your financial picture builds as you go              │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

Clean, three-step, warm background (teal-light or cream-dark). Numbered steps with bold numbers. Dismisses with animation (collapses up, 200ms).

---

## Progress bar behaviour

The progress bar on the phase header edge:

- 0%: empty, cream-dark bar
- 1-30%: warmth fill, label: "Getting started"
- 31-55%: warmth fill, label: "Taking shape"
- 55%: **MILESTONE** — bar pulses briefly, label changes to "Ready to share with a mediator"
- 56-80%: continues filling, label: "Building toward disclosure"
- 80%: **MILESTONE** — "Ready for formal disclosure"
- 81-95%: continues, label: "Almost complete"
- 95-100%: "Complete — ready for formalisation"

When a milestone is first reached, a brief celebration:
- Bar flashes sage
- A toast notification appears
- The milestone label is prominent for the rest of the session

---

## Key changes from previous spec

| Previous | Revised |
|----------|---------|
| Upload on a separate page (/workspace/picture) | Upload inline within tabbed work area |
| Categories as card grid you click into | Categories as tabs you switch between |
| Category detail as a separate page | Category content renders within the tab |
| Sidebar sub-items for category nav | Tab bar replaces sidebar sub-items |
| Manual entry on separate page | Manual entry via modal |
| Financial picture as a separate summary page | Live financial picture below the tabs, always visible |

---

## Sidebar implications

The sidebar no longer needs category sub-items within "Build your picture." It just shows:

```
● Build your picture  (warmth pill)
○ Share & disclose
○ Work through it
○ Reach agreement
○ Make it official
```

The tab bar within the page handles category switching. The sidebar stays simple — phases only.
