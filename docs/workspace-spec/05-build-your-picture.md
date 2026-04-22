# [SUPERSEDED] Workspace Design Spec — 05: Build Your Picture

> **This spec is superseded by [`05b-build-your-picture-revised.md`](./05b-build-your-picture-revised.md), which is the current build spec.** This earlier version is retained for historical context. The revised spec introduces the two-tier tab structure and single-page architecture that replaced the original layout.

## URL: /workspace/build

## Purpose

The operational hub for the first phase. This is where the work happens — uploading documents, reviewing extractions, tracking progress, seeing what's done and what's next.

---

## Layout

Phase header (warmth) at the top of the main content. Below: two zones — the upload/action zone and the category status zone.

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  BUILD YOUR PICTURE                                         │
│  Bring everything together — finances, property, pensions.  │
│  Upload documents and we do the heavy lifting.              │
│                                                             │
│  ───────────────────────────────────────────────────────    │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                     │   │
│  │  ┌─────────────────────────────────────────────┐   │   │
│  │  │                                             │   │   │
│  │  │     📎 Drop any financial document here     │   │   │
│  │  │                                             │   │   │
│  │  │     Bank statements · Payslips · Pension    │   │   │
│  │  │     letters · Mortgage · Valuations         │   │   │
│  │  │                                             │   │   │
│  │  │     [Choose file]  or drag and drop         │   │   │
│  │  │                                             │   │   │
│  │  └─────────────────────────────────────────────┘   │   │
│  │                                                     │   │
│  │  Or: [Enter details manually]                       │   │
│  │                                                     │   │
│  │  💡 Start with your current account — one document  │   │
│  │  gives us income AND spending.                      │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ───────────────────────────────────────────────────────    │
│                                                             │
│  CATEGORIES                        7 of 9 areas started     │
│                                                             │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐     │
│  │ Income   │ │ Savings  │ │ Property │ │ Pensions │     │
│  │ ✓ £3,218 │ │ ✓ £12.4k │ │ ◐ £320k │ │ ⏳ CETV  │     │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘     │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐                   │
│  │ Debts    │ │ Outgoings│ │ Other    │                   │
│  │ ✓ £4,200 │ │ ✓ £2,450 │ │ ○ Start │                   │
│  └──────────┘ └──────────┘ └──────────┘                   │
│                                                             │
│  ───────────────────────────────────────────────────────    │
│                                                             │
│  READINESS                                                  │
│  Ready to share with a mediator  ████████████░░░░  55%     │
│  Next: Ready for formal disclosure                          │
│                                                             │
│  ───────────────────────────────────────────────────────    │
│                                                             │
│  💡 AI INSIGHT                                              │
│  Your pension is unknown and often the largest asset.       │
│  Request a CETV now — it takes up to 3 months.             │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Sections

### 1. Phase header

Warmth background block. Bold.

```
BUILD YOUR PICTURE
Bring everything together — finances, property, pensions. Upload documents and we do the heavy lifting.
```

**NOT** a thin text heading. A full-width warmth-coloured block with white text. 28-32px heading.

### 2. Upload zone — ALWAYS VISIBLE

This is the most important element on this page. It should be:
- Large (at least 200px tall)
- Visually prominent — thick dashed border (3px), rounded corners (16px)
- The border should use `warmth` colour, dashed, with generous spacing between dashes
- Inside: upload icon (large, 32px), primary text, supporting text, button
- Drag state: border goes solid warmth, background shifts to warmth-light, subtle scale up
- Below the zone: "Or: Enter details manually" as a text link
- Below that: an AI tip in a warmth-light card about which document to start with

**When a document is being processed:**
The upload zone transforms inline — no page change. Shows the processing animation, conversational messages, and when complete, the review UI appears below or replaces the zone temporarily.

### 3. Categories grid

Cards showing each financial category and its status. 4 columns on desktop, 2 on tablet, 1 on mobile.

Each card:
- Category name (h3, bold)
- Status icon + value (if captured)
- Visual status: left border colour + background
- Click → /workspace/build/{category}

Card widths should be equal. The grid should look like a dashboard, not a list.

### 4. Readiness bar

Full-width progress bar with milestone labels.

```
Ready to share with a mediator  ████████████░░░░  55%
Next milestone: Ready for formal disclosure
```

Bold percentage. Bar uses warmth colour for filled portion. Milestones labelled in plain language.

### 5. AI insight

A warmth-light card with a single, contextual insight. Changes based on what the system observes about the financial picture.

---

## "Enter details manually"

This should open as a **modal**, not navigate to a new page.

The modal:
- Full-screen on mobile, centred large panel on desktop (max-width 560px)
- Category selector at top
- Guided fields: label, value, confidence, ownership
- Save → adds item, closes modal, category card updates
- Cancel → closes modal

This keeps the user on the "Build your picture" page. No navigation disruption.

---

## When a document is uploaded and processed

The review flow happens INLINE on this page:

1. User drops a document on the upload zone
2. Zone transforms to processing state (animation, conversational messages)
3. When extraction completes, a review panel appears BELOW the upload zone
4. User reviews extracted items (confirm/reject)
5. On confirm: items are added, review panel closes, category cards update, upload zone returns to idle
6. User can immediately upload another document

No page changes. The entire upload → process → review → confirm cycle happens on /workspace/build.

---

## If the user has NO data yet (first visit)

The upload zone is the hero. The category grid is there but all cards show "Not started." The readiness bar shows 0%.

Additional content for first visit:
- "From your plan" card (teal, showing V1 estimates)
- "How this works" 3-step explainer below the category grid
- The AI tip specifically guides to current account first

---

## Key principles for this page

1. **Upload zone is never hidden.** Always visible, always inviting.
2. **No page changes for upload/review.** Everything inline.
3. **Manual entry via modal.** Not a page.
4. **Category cards are the dashboard.** Visual, status-differentiated, clickable.
5. **One AI insight.** Contextual, helpful, not a list.
6. **Readiness is prominent.** The user always knows how close they are.
