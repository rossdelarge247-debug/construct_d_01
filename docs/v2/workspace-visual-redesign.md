# Workspace Visual Redesign Direction

## The problem with what we have

The current workspace looks like a well-meaning prototype from 2018. Thin borders on cream. Shy typography. A flat top header with breadcrumbs. Category cards that all look the same. No visual hierarchy. No confidence. No warmth used boldly.

It doesn't say "we've got this" — it whispers "we tried."

## What it should say

"You're in the right place. We understand what you're going through. Everything is organised. Every step is clear. You're making progress. We're doing the hard work."

Bold. Warm. Structured. Compassionate. Modern. Connected.

---

## 1. Layout: Sidebar + Main + Context

### The structure

```
┌──────────┬────────────────────────────────────────────────┐
│          │                                                │
│ SIDEBAR  │              MAIN CONTENT                      │
│          │                                                │
│ Logo     │   Phase header (bold, full-width)              │
│          │                                                │
│ ● Build  │   Primary content area                        │
│   picture│                                                │
│ ○ Share  │                                                │
│ ○ Work   │                                                │
│ ○ Reach  │                                                │
│ ○ Make   │                                                │
│   official│                                               │
│          │                                                │
│ ──────── │                                                │
│ Documents│                                                │
│ Timeline │                                                │
│ Settings │                                                │
│          │                                                │
│          │                                                │
│ Exit ⏏   │                                                │
└──────────┴────────────────────────────────────────────────┘
```

### Why sidebar, not top nav

- Sidebar is always visible — the user never loses context of where they are in the journey
- Phase progression is vertical, which maps to the journey metaphor (going down a path)
- Active phase is visually prominent — bold, filled background, not just a text label
- Future phases visible but muted — transparent about what's ahead
- Utility items (documents, timeline, settings, exit) live at the bottom, separate from the journey
- On mobile: sidebar collapses to a bottom tab bar with icons only

### Sidebar design

- Width: 240px desktop, collapsible to 64px (icon-only)
- Background: `depth` colour (#3D4F5F) — the warm navy from our palette. NOT black. NOT pure dark. Warm depth.
- Text: cream on depth background
- Active phase: warmth-coloured pill/highlight (like Splitifi's orange Dashboard button)
- Phase icons: simple, clear, meaningful
- Logo: Decouple in cream, top of sidebar
- Exit this page: bottom of sidebar, always accessible

---

## 2. Colour: Bold, not shy

### The shift

Current: cream background everywhere, warmth only on buttons, everything feels the same.

New: **use colour to create zones, hierarchy, and meaning.**

### Colour zones

| Zone | Colour | Where |
|------|--------|-------|
| Sidebar | `depth` (#3D4F5F) | Persistent navigation |
| Phase header | `warmth` (#C67D5A) as gradient or solid block | Top of main content, announces the current phase |
| Main background | `cream` (#FAF6F1) | Primary content area |
| Cards — active/important | White (#FEFDFB) with warmth left-border | Items needing attention, active tasks |
| Cards — complete | `sage-light` (#E4EDE5) fill | Confirmed items, completed sections |
| Cards — awaiting | `amber-light` (#F5ECD4) fill | Pending items, CETV requests |
| Cards — empty | `cream-dark` (#F0EBE3) fill | Not started, placeholder |
| AI insights | `warmth-light` (#F0DDD2) fill with warmth left-border | Recommendations, smart prompts |
| Alerts/warnings | Solid warmth or amber block | Important callouts |
| Stats/numbers | Large, bold, `ink` on contrasting backgrounds | Financial summaries, readiness |

### The rule

**Every section of the page should have a clear visual identity.** No more "everything is a cream card with a cream-dark border." Cards should look different based on their status. Sections should have background colour shifts that create visual rhythm as you scroll.

---

## 3. Typography: Confident, not whispering

### The shift

Current: 11px labels, 14px body, 20px headings. Everything feels the same size.

New: **dramatic scale. Headings own the page. Numbers are heroes. Labels are clear.**

### New scale

| Element | Font | Size | Weight |
|---------|------|------|--------|
| Phase title (in header block) | Lora | 32-40px | 600 |
| Section heading | Lora | 24px | 500 |
| Card title | Inter | 16-18px | 600 |
| Body text | Inter | 15-16px | 400 |
| Hero numbers (financial summary) | Inter | 36-48px | 700 |
| Supporting numbers | Inter | 20-24px | 600 |
| Labels / metadata | Inter | 12-13px | 500 |
| Micro labels | Inter | 11px | 500 uppercase tracking |

### The rule

**If you squint, you should still understand the page.** The hierarchy should be visible from across the room. Big numbers, clear headings, obvious structure.

---

## 4. Information architecture: Connected, not fragmented

### The dashboard philosophy

Inspired by Splitifi's layout but adapted for our context:

**The workspace home is not a list of categories. It's a mission control for your separation.**

It should show:
1. **Where you are** — current phase, prominently
2. **Your financial picture at a glance** — the hero numbers (assets, liabilities, net, income, outgoings)
3. **What needs attention right now** — ONE primary action, not a list
4. **Your progress** — visual, satisfying, specific
5. **Quick access** — to the things you do most (upload, add item, view documents)

### Information grouping on the workspace home

```
┌──────────────────────────────────────────────────────────┐
│                                                          │
│  BUILD YOUR PICTURE                          Phase 1/5   │
│  ════════════════════════════════════════════════════════ │
│  (warmth gradient header — bold, full-width)              │
│                                                          │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐       │
│  │  ASSETS     │ │ LIABILITIES │ │ NET          │       │
│  │  £347,400   │ │  £199,200   │ │ £148,200     │       │
│  │             │ │             │ │              │       │
│  └─────────────┘ └─────────────┘ └─────────────┘       │
│  ┌──────────────────────┐ ┌──────────────────────┐      │
│  │ INCOME    £3,218/mo  │ │ OUTGOINGS  £2,450/mo │      │
│  └──────────────────────┘ └──────────────────────┘      │
│                                                          │
│  ─── YOUR NEXT STEP ─────────────────────────────────── │
│                                                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │  ⚠️ Request your pension valuations              │   │
│  │  This takes up to 3 months — starting now means  │   │
│  │  it's ready when you need it.                    │   │
│  │                                [Get started →]    │   │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
│  ─── CATEGORIES ─────────────────────────────────────── │
│                                                          │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │
│  │ Income   │ │ Savings  │ │ Property │ │ Pensions │  │
│  │ ✓ Done   │ │ ✓ Done   │ │ ◐ Est.  │ │ ⏳ Wait  │  │
│  │ £3,218   │ │ £12,400  │ │ £320k   │ │ —        │  │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘  │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐               │
│  │ Debts    │ │ Outgoings│ │ Other    │               │
│  │ ✓ Done   │ │ ✓ Auto   │ │ ○ Start │               │
│  │ £4,200   │ │ £2,450   │ │ —       │               │
│  └──────────┘ └──────────┘ └──────────┘               │
│                                                          │
│  ─── READINESS ──────────────────────────────────────── │
│                                                          │
│  Ready to share with a mediator                          │
│  ██████████████░░░░░░░░░░  55%                          │
│  Next milestone: Ready for formal disclosure             │
│                                                          │
│  ─── AI INSIGHT ─────────────────────────────────────── │
│                                                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │  💡 Your pension is marked as unknown. Pensions  │   │
│  │  are often the largest asset — sometimes worth    │   │
│  │  more than the home.                              │   │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
│  ─── QUICK ACTIONS ──────────────────────────────────── │
│                                                          │
│  [📎 Upload]  [✎ Add item]  [📄 Documents]  [📊 Summary]│
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### Category cards — visual differentiation by status

Cards look DIFFERENT based on their state:

**Complete (confirmed with evidence):**
- White background, sage left border (4px), value bold and large
- Status badge: green "✓ Confirmed"

**Estimated (value entered, no evidence):**
- Cream-dark background, amber left border
- Status badge: amber "◐ Estimated"

**Awaiting (external action needed):**
- Amber-light background, amber left border
- Status badge: amber "⏳ Awaiting CETV"

**Not started:**
- Cream-dark background, no left border
- Muted text, "○ Start" as CTA

**Needs attention (items to review):**
- White background, warmth left border
- Badge: warmth "● 3 to review"

---

## 5. Category detail pages: Sidebar context + focused work

When you drill into a category, the sidebar stays. The main area adapts:

```
┌──────────┬────────────────────────────────────────────────┐
│          │                                                │
│ SIDEBAR  │  ← Back to overview                           │
│          │                                                │
│ ● Build  │  PENSIONS                        ⏳ Awaiting   │
│   picture│  ══════════════════════════════════════════     │
│   │      │                                                │
│   ├ Income│  Your pensions need attention. CETV requests  │
│   ├ Savings│ take up to 3 months — track them here.       │
│   ├ Property│                                             │
│   ├ Pensions│ ┌──────────────────────────────────────┐   │
│   │  ← here │ │  Workplace pension · Aviva           │   │
│   ├ Debts │ │  ⏳ CETV requested 14 Mar · 26 days   │   │
│   └ Other │ │  [Chase provider]  [I've received it]  │   │
│          │  └──────────────────────────────────────┘   │
│ ○ Share  │                                                │
│ ○ Work   │  [📎 Upload pension document]                 │
│          │  [✎ Add another pension]                       │
│          │                                                │
└──────────┴────────────────────────────────────────────────┘
```

The sidebar shows sub-navigation within the current phase — the categories within "Build your picture" — so you can jump between them without going back to the hub.

---

## 6. The upload/review flow: Full-width, focused

When uploading and reviewing extracted data, the main content goes full-focus:

- Upload zone: large, prominent, with bold messaging
- Processing: centred, calm, conversational stages
- Review: extracted items appear with staggered animation
- Side-by-side (when viewing document): split view — PDF left, extracted data right

The sidebar stays for navigation context, but the main area commands attention.

---

## 7. Mobile: Bottom tabs + full-screen content

On mobile (< 768px):

- Sidebar becomes a bottom tab bar: 5 icons (Build, Share, Work, Reach, Official)
- Active tab highlighted with warmth
- Main content goes full-width
- Category sub-nav becomes a horizontal scrollable pill bar at top of content
- Upload/review is full-screen

---

## 8. Micro-interactions and motion

### What should animate:

- Financial summary numbers count up when values change
- Category cards stagger in on page load
- Status transitions (not started → in progress → complete) have smooth colour transitions
- Upload drop zone pulses gently when idle
- Processing stages change with smooth text transitions
- Extracted items animate in one by one during review
- Readiness bar fills smoothly when progress changes
- Sidebar active state transitions smoothly between phases

### What should NOT animate:

- Navigation clicks — instant
- Page transitions — fast, no elaborate animations
- Form interactions — immediate feedback
- Back navigation — instant

---

## 9. Design tokens update

### Additions to globals.css

```
/* New tokens for workspace */
--color-surface: #FEFDFB;         /* White-warm for elevated cards */
--color-surface-muted: #F7F4EF;   /* Slightly darker than cream for sections */

/* Sidebar */
--sidebar-width: 240px;
--sidebar-width-collapsed: 64px;
--sidebar-bg: var(--color-depth);

/* Typography scale */
--text-hero: 48px;
--text-display: 36px;
--text-heading: 24px;
--text-subheading: 18px;
--text-body: 15px;
--text-small: 13px;
--text-micro: 11px;

/* Left-border accent widths */
--border-accent: 4px;
```

---

## 10. What this means for the V1 interview

The V1 interview keeps its current intimate, single-column feel. It's a different mode — a private conversation, not a workspace. The visual redesign applies to:

- The workspace layout (sidebar + main)
- The workspace hub
- All category detail pages
- The document upload/review flow
- The readiness tracking
- The financial summary
- The landing page header/footer (lighter touch)

The interview stays narrow, focused, and gentle. The workspace is where we get bold.

---

## Summary: Before vs After

| Element | Before | After |
|---------|--------|-------|
| Layout | Top header + breadcrumbs | Sidebar nav + main content |
| Colour | Cream everywhere, thin borders | Colour zones, filled cards, bold accents |
| Typography | Small, uniform, shy | Large headings, hero numbers, clear hierarchy |
| Cards | All identical thin-bordered cream | Status-differentiated with coloured left borders |
| Numbers | 14px, mixed with text | 36-48px heroes, prominent and counted-up |
| Navigation | Flat phase labels in header | Sidebar with phase + sub-category navigation |
| Empty states | "Not started" text | Warm illustrations, bold CTAs, guidance |
| AI insights | Below the fold | Prominent cards with warmth backgrounds |
| Progress | Thin bar | Bold bar with milestone labels and percentages |
| Overall feel | Polite prototype | Confident, warm, modern product |
