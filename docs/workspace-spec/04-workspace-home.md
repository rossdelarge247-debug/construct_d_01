# Workspace Design Spec — 04: Workspace Home

## URL: /workspace

## Purpose

Mission control. The user comes here to see where they are across the entire journey. Not to do work — to orient and decide what to work on next.

---

## Layout

No phase header (this is the home, not inside a phase). Clean, spacious.

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  Welcome back                                               │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                     │   │
│  │  YOUR JOURNEY                                       │   │
│  │                                                     │   │
│  │  ● Build your      ○ Share &     ○ Work       ○ ○   │   │
│  │    picture            disclose     through it        │   │
│  │    In progress        Coming next                    │   │
│  │                                                     │   │
│  │  ██████████████░░░░░░░░░░░░░░░░░░░░░░░░  20%       │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌──────────────────────┐  ┌──────────────────────┐       │
│  │  YOUR NEXT STEP      │  │  FINANCIAL SNAPSHOT   │       │
│  │                      │  │                      │       │
│  │  Continue building   │  │  Assets: £347,400    │       │
│  │  your picture.       │  │  Liabilities: £199k  │       │
│  │                      │  │  Net: £148,200       │       │
│  │  Upload your pension │  │                      │       │
│  │  CETV letter.        │  │  5 items · 3 confirmed│      │
│  │                      │  │                      │       │
│  │  [Continue →]        │  │  [View full picture] │       │
│  └──────────────────────┘  └──────────────────────┘       │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                     │   │
│  │  YOUR PHASES                                        │   │
│  │                                                     │   │
│  │  ┌───────────────┐  ┌───────────────┐              │   │
│  │  │ Build your    │  │ Share &       │              │   │
│  │  │ picture       │  │ disclose      │              │   │
│  │  │               │  │               │              │   │
│  │  │ 5/9 categories│  │ Coming next   │              │   │
│  │  │ In progress   │  │ When picture  │              │   │
│  │  │               │  │ is ready      │              │   │
│  │  │ [Continue →]  │  │ [Learn more]  │              │   │
│  │  └───────────────┘  └───────────────┘              │   │
│  │  ┌───────────────┐  ┌───────────────┐              │   │
│  │  │ Work through  │  │ Reach         │              │   │
│  │  │ it            │  │ agreement     │              │   │
│  │  │               │  │               │              │   │
│  │  │ Future        │  │ Future        │              │   │
│  │  │ [Learn more]  │  │ [Learn more]  │              │   │
│  │  └───────────────┘  └───────────────┘              │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐     │
│  │ 📎 Upload │ │ ✎ Add    │ │ 📄 Docs  │ │ 📊 Summary│    │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Sections

### 1. Welcome

Simple, personal. Not a banner — just a heading.

```
Welcome back
Your separation journey is underway. Here's where things stand.
```

If first visit after V1:
```
Welcome to your workspace
Everything from your plan is here. Let's start building the detail.
```

No full-width colour block. Just confident typography on the cream background.

### 2. Journey progress

A horizontal visual showing all 5 phases with their status. NOT the sidebar (that's navigation). This is an at-a-glance view of the whole journey.

- Current phase: warmth dot, bold label, "In progress"
- Future phases: muted dots, "Coming next" / "Future"
- Complete phases: sage dots, checkmark
- Progress bar below: fills based on overall journey completion

### 3. Two-column: Next Step + Financial Snapshot

Side by side on desktop, stacked on mobile.

**Next Step card:**
- warmth left border
- Bold: what to do next (ONE thing)
- Why it matters
- CTA button

**Financial Snapshot card (if data exists):**
- teal left border
- Hero numbers: assets, liabilities, net
- Item count and confirmation count
- CTA: "View full picture" → /workspace/build

If no financial data yet, this card shows:
- "No financial data yet"
- "Start by uploading a bank statement"
- CTA → /workspace/build

### 4. Phase cards

2x2 grid (or 2x3 if 5 phases don't fit). Each phase is a card:

**Active phase card:**
- warmth left border, surface background, shadow
- Phase name (h3, bold)
- Status summary ("5/9 categories · In progress")
- Primary CTA: "Continue →"

**Future phase cards:**
- cream-dark background, muted border
- Phase name (h3, muted)
- Brief description ("When your picture is ready, prepare for formal disclosure")
- Secondary CTA: "Learn more" → /workspace/disclose (zero state)

**Complete phase cards:**
- sage left border
- Phase name + checkmark
- Summary of what was achieved
- "Review →" link

### 5. Quick actions

Row of 4 icon buttons at the bottom. Same as current but with bolder design:
- Upload document
- Add item manually
- View documents
- View summary

---

## Empty state (first visit)

If no data exists at all (fresh from V1):

- Welcome message acknowledges V1 plan
- Journey progress shows Build Your Picture as the starting phase
- No financial snapshot card
- The "Next Step" card is the primary focus: "Let's start building your picture"
- Phase cards still show but all future
- Quick actions still visible

---

## Key principles for this page

1. **This is NOT where work happens.** This is where you see the big picture and decide what to do.
2. **ONE next step, prominently.** Not a task list. One card, one action.
3. **Financial snapshot updates in real time** as data is added elsewhere.
4. **Phase cards are clickable** — every phase goes somewhere (either the phase page or a zero state).
5. **No upload zone on this page.** Upload happens inside "Build your picture", not on the home page.
