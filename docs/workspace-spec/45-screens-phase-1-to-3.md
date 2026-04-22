# Spec 45 — Key Screens: Phases 1-3 (Start, Build, Share)

**Date:** 17 April 2026
**Purpose:** Screen-by-screen design for the first half of the journey — from "I'm getting divorced" to "the ex has joined and the household document is emerging."

## Phase 1: START (5 minutes)

### S1.1 — Welcome

```
┌───────────────────────────────────────────────────┐
│                                                    │
│  Let's sort this out together.                    │
│                                                    │
│  We'll help you build a complete picture of your  │
│  finances, your children, your home, and what     │
│  comes next. Then we'll help you agree a          │
│  settlement with your ex.                         │
│                                                    │
│  Most people finish in 2-3 months. Cost: £593     │
│  court fee. No £15,000 solicitor bills.           │
│                                                    │
│  [Get started]                                    │
│                                                    │
│  • Fully private until you choose to share        │
│  • You can stop and come back any time            │
│                                                    │
└───────────────────────────────────────────────────┘
```

### S1.2 — How are you doing?

```
┌───────────────────────────────────────────────────┐
│                                                    │
│  First things first — how are you?                │
│                                                    │
│  This can be an overwhelming time. We're here to  │
│  help you take it one step at a time.             │
│                                                    │
│  ○ I'm managing — let's begin                     │
│  ○ I'm finding this hard                          │
│  ○ I need safety support right now                │
│                                                    │
│  [Continue]                                       │
│                                                    │
└───────────────────────────────────────────────────┘
```

"Finding this hard" → gentle pacing, more check-ins.
"Safety support" → immediate resources, Women's Aid / Men's Advice Line, option to use the product discreetly.

### S1.3 — What's your situation?

Profiling questions (from spec 34), 6 screens, one question each with inline follow-ups:

- Q1: Housing + who's the mortgage/rent with
- Q2: Employment + business details if self-employed
- Q3: Vehicles + finance provider
- Q4: Children count + ages
- Q5: Pensions + provider
- Q6: Other assets checklist

As each answer is given, a tiny document preview in the corner grows — shows the user their picture forming.

### S1.4 — Let's build your picture

```
┌───────────────────────────────────────────────────┐
│                                                    │
│  ✓ Got it. Based on what you've told us:          │
│                                                    │
│  • You own your home with a mortgage              │
│  • You're employed                                │
│  • You have a car on finance                      │
│  • You have 2 children                            │
│  • You have a workplace pension                   │
│  • You might have savings                         │
│                                                    │
│  We'll now help you build a complete picture.     │
│  Starts with connecting your bank — takes 2 mins. │
│                                                    │
│  [Connect your bank]                              │
│                                                    │
└───────────────────────────────────────────────────┘
```

---

## Phase 2: BUILD (30 minutes, optionally across sessions)

### S2.1 — Bank connection & reveal

Standard Tink flow. Afterward:

```
┌───────────────────────────────────────────────────┐
│                                                    │
│  We found:                                        │
│                                                    │
│  ✓ Your mortgage with Halifax — £1,150/mo         │
│  ✓ Your salary — £2,400/mo                        │
│  ✓ Your car finance with BMW — £485/mo            │
│  ✓ 3 insurance payments (we'll ask about these)   │
│  ✓ Child Benefit — confirms 2 children            │
│  ✓ Council tax, utilities, regular spending       │
│                                                    │
│  [See what else we need to clarify]               │
│                                                    │
│  📄 Your document is 40% complete                 │
│  [View document]                                  │
│                                                    │
└───────────────────────────────────────────────────┘
```

Matching contextual reveal — each item animates in as the system matches profile to bank data.

### S2.2 — Phase A: tier-based confirmation

Three screen patterns (from spec 34):

**Matched items (Tier 1) — batch confirm:**

```
┌───────────────────────────────────────────────────┐
│  INCOME                                           │
│                                                    │
│  ✓  Salary from ACME Corp                         │
│     £2,400/month  [Not right?]                    │
│                                                    │
│  ✓  Child Benefit (HMRC)                          │
│     £96 every 4 weeks — 2 children  [Not right?]  │
│                                                    │
│  [Looks right — continue]                         │
│                                                    │
└───────────────────────────────────────────────────┘
```

**Disambiguation (Tier 2):**

```
┌───────────────────────────────────────────────────┐
│  You have 3 insurance payments. Match them.       │
│                                                    │
│  £42/mo — Admiral Insurance                       │
│  ○ Car  ● Home  ○ Life  ○ Other                   │
│                                                    │
│  £65/mo — Legal & General                         │
│  ○ Car  ○ Home  ● Life  ○ Other                   │
│                                                    │
│  £28/mo — Aviva                                   │
│  ● Car  ○ Home  ○ Life  ○ Other                   │
│                                                    │
│  [Continue]                                       │
│                                                    │
└───────────────────────────────────────────────────┘
```

**Unknown (Tier 3):**

```
┌───────────────────────────────────────────────────┐
│  We found regular payments to Hargreaves Lansdown │
│  £300/month. What is this?                        │
│                                                    │
│  ○ Stocks & shares ISA                            │
│  ○ General investment account                     │
│  ○ Pension (SIPP)                                 │
│  ○ I've closed this                               │
│  ○ Something else                                 │
│                                                    │
└───────────────────────────────────────────────────┘
```

### S2.3 — The four content areas in sequence

The document has Finances, Children, Housing, Future sections. Each gets a brief flow:

**Children section (S2.3a)**
```
┌───────────────────────────────────────────────────┐
│  Your children                                    │
│                                                    │
│  You have 2 children. Help us with the details.   │
│                                                    │
│  Child 1                                          │
│   Name:          [__________]                     │
│   Age:           [____]                           │
│   School:        [__________] (optional)          │
│                                                    │
│  Child 2                                          │
│   Name:          [__________]                     │
│   Age:           [____]                           │
│                                                    │
│  [Continue]                                       │
│                                                    │
└───────────────────────────────────────────────────┘
```

Then:
- Current living arrangement (who they live with now)
- Current contact pattern with the other parent
- School / childcare costs (links to spending section)

**Housing section (S2.3b)**
- Current home details (value, mortgage, ownership)
- Current living (both parties? one has moved out?)
- Future intent (sell / one stays / deferred sale)
- Any second property

**Future needs section (S2.3c)**
- Post-separation budget estimate
- Income projections
- Career / retraining needs
- Retirement implications

### S2.4 — Spending review (Phase B)

Existing V2 spending flow retained (spec 25). Walk-through of 6 Form E categories:
- Housing
- Utilities
- Personal
- Transport
- Children
- Leisure

Each category: show detected items → gap question → search → sub-summary.

### S2.5 — Evidence & verification

```
┌───────────────────────────────────────────────────┐
│  Strengthen your picture                          │
│                                                    │
│  Your document is 85% evidenced. Want to make it  │
│  even stronger?                                   │
│                                                    │
│  ✓ Bank connection — 12 months of data            │
│  ○ Credit check — catches anything unconnected    │
│    (free, takes 2 min)                            │
│  ○ Property valuation — Zoopla indicative figures │
│  ○ Upload supporting documents                    │
│                                                    │
│  [Add credit check]  [Skip for now]               │
│                                                    │
└───────────────────────────────────────────────────┘
```

### S2.6 — Your document is ready (v1.0)

```
┌───────────────────────────────────────────────────┐
│                                                    │
│  🎉 Your financial picture is ready.              │
│                                                    │
│  The document                                     │
│  • Finances — 18 items (15 bank-evidenced)        │
│  • Children — 2 children, arrangements captured   │
│  • Housing — current home + future intent         │
│  • Future needs — budget + projections            │
│                                                    │
│  You can:                                         │
│  [Review the document]                            │
│  [Share with your ex]                             │
│  [Come back later]                                │
│                                                    │
│  📄 v1.0 — Generated just now                     │
│                                                    │
└───────────────────────────────────────────────────┘
```

### S2.7 — Document mode (review)

When user taps "Review the document" — they see the ES2-style view:

```
┌───────────────────────────────────────────────────┐
│  SARAH JOHNSON — FINANCIAL PICTURE v1.0           │
│  Generated 17 April 2026                          │
│                                                    │
│  THE CHILDREN                                     │
│  ─────────────                                    │
│  Emma (7) and Jake (4). Primary care with Sarah.  │
│  Contact with Mark: to be agreed.                 │
│  School: St Mary's Primary (£0 fees).             │
│                                                    │
│  THE HOME                                         │
│  ─────────                                        │
│  12 Oak Road, Exeter                              │
│    Value           £450,000    (estimated)        │
│    Mortgage       (£220,000)   (Halifax) 📎       │
│    Net equity      £230,000                       │
│    Held            Jointly                        │
│                                                    │
│  PENSIONS                                         │
│  ─────────                                        │
│  NHS Pension (workplace)                          │
│    CETV            £180,000 📎 (statement)        │
│    Type            Defined Benefit                │
│                                                    │
│  [... continues through all sections ...]         │
│                                                    │
│  [Edit section] [Print] [Export PDF] [Share]      │
│                                                    │
└───────────────────────────────────────────────────┘
```

Printable / exportable / shareable. Any section can be tapped to edit (back to edit mode).

---

## Phase 3: SHARE (1-2 weeks async)

### S3.1 — Ready to share

```
┌───────────────────────────────────────────────────┐
│  Share with your ex                               │
│                                                    │
│  You're about to invite Mark to see your          │
│  financial picture and build the household        │
│  version together.                                │
│                                                    │
│  What they'll see:                                │
│  • Everything you've added to the document        │
│  • Your items, ready for them to confirm          │
│  • Blanks for their own information               │
│                                                    │
│  They won't see:                                  │
│  • Your private notes                             │
│  • Any draft positions or fallbacks               │
│                                                    │
│  Mark's email: [_________________________]        │
│                                                    │
│  [Preview what they'll see] [Send invitation]     │
│                                                    │
└───────────────────────────────────────────────────┘
```

### S3.2 — Mark receives & onboards

Email: *"Sarah has shared her financial picture with you."*

Mark's first screen:

```
┌───────────────────────────────────────────────────┐
│                                                    │
│  Sarah has shared her financial picture           │
│                                                    │
│  Together, you'll build one complete picture of   │
│  your household — then agree how to divide it.    │
│                                                    │
│  First: we'll walk you through your own picture   │
│  (about 30 minutes). Then we'll show you Sarah's  │
│  and you can review, confirm, or query each item. │
│                                                    │
│  [Start — review Sarah's overview first]          │
│  [Start — build mine first]                       │
│                                                    │
│  ✓ Fully private until you're ready               │
│  ✓ You can stop and come back                     │
│                                                    │
└───────────────────────────────────────────────────┘
```

Mark gets the same V2 journey Sarah did — profiling, bank connection, Phase A, Phase B, the four content areas. Timeline event on Sarah's side: "Mark joined. Building his picture."

### S3.3 — Reconciliation screen (Mark's pass)

After Mark completes his own picture, he's invited to review Sarah's items:

```
┌───────────────────────────────────────────────────┐
│  Sarah declared these. What do you know?          │
│                                                    │
│  ┌─────────────────────────────────────────────┐  │
│  │ Family home — 12 Oak Road, £450,000         │  │
│  │ Sarah: joint ownership, mortgage £220k      │  │
│  │                                              │  │
│  │ ● Yes, I know about this ← Mark's answer    │  │
│  │ ○ I'd value this differently                │  │
│  │ ○ I don't know about this                   │  │
│  └─────────────────────────────────────────────┘  │
│                                                    │
│  ┌─────────────────────────────────────────────┐  │
│  │ Joint savings (Barclays) — £12,000          │  │
│  │ Sarah: bank statement 31 March              │  │
│  │                                              │  │
│  │ ○ Yes, I know about this                    │  │
│  │ ● I'd value this differently                │  │
│  │   [My value: £8,000]                        │  │
│  │   [Why? I saw the balance was £8k...]       │  │
│  │ ○ I don't know about this                   │  │
│  └─────────────────────────────────────────────┘  │
│                                                    │
│  [Continue — 3 more items to review]              │
│                                                    │
└───────────────────────────────────────────────────┘
```

### S3.4 — Unified household document emerges (v2.0)

Both users see the same screen:

```
┌───────────────────────────────────────────────────┐
│  OUR HOUSEHOLD PICTURE v2.0                       │
│                                                    │
│  Reconciliation status                            │
│  ────────────────────                             │
│  ✓  17 items confirmed by both                    │
│  ⚠️   2 items need agreement (values differ)       │
│  •   3 items unique to one of you                 │
│  ?   1 potential gap                              │
│                                                    │
│  [Work through disagreements]                     │
│  [View full document]                             │
│                                                    │
└───────────────────────────────────────────────────┘
```

### S3.5 — Item-level discussion (Juro pattern)

Click a contested item → opens discussion thread:

```
┌───────────────────────────────────────────────────┐
│  Joint savings (Barclays)                         │
│                                                    │
│  ⚠️ Values differ                                  │
│                                                    │
│  Sarah says: £12,000 📎                           │
│  Evidence: Bank statement 31 March 2026           │
│                                                    │
│  Mark says: £8,000                                │
│  "I checked the app and saw £8k. Not sure why"    │
│                                                    │
│  ─── Discussion ───                               │
│  Sarah (31 March): Here's the statement           │
│  [📎 statement.pdf]                                │
│  Mark (1 April): Looks like £4k was taken out     │
│  for tax — I'd forgotten. Let's use £8k.          │
│                                                    │
│  [Accept £8,000]  [Discuss further]               │
│                                                    │
└───────────────────────────────────────────────────┘
```

### S3.6 — Facts agreed (v3.0)

```
┌───────────────────────────────────────────────────┐
│                                                    │
│  🎉 Your household picture is complete.           │
│                                                    │
│  All 20 items agreed ✓                            │
│  95% bank-evidenced                               │
│  Both of you have signed off on the facts.        │
│                                                    │
│  Next: decide how to divide things.               │
│                                                    │
│  [Start a proposal]                               │
│  [Invite a mediator to help]                      │
│  [Come back later]                                │
│                                                    │
│  📄 v3.0 — Household picture, facts agreed        │
│                                                    │
└───────────────────────────────────────────────────┘
```

This is the threshold from Facts to Settlement — continued in spec 46.
