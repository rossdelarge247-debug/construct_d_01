# Workspace Design Spec — 10b: Tiered Question UX

## Replaces the flat question approach in spec 10

---

## The problem with the original design

The full question mapping (spec 11) identifies ~30 possible signal-question pairs for a current account alone. Showing all of these would be overwhelming and feel like a form, not an intelligent assistant.

## The principle

**Confirm what's obvious. Only ask what's genuinely ambiguous.**

The AI should do 90% of the work. The user handles the remaining 10%.

---

## Four tiers

### Tier 1: Auto-confirmed (no interaction needed)

High-confidence findings (90%+) presented as a resolved list. The user glances at them.

```
HERE'S WHAT WE FOUND

✓ Employment income: £3,218/mo from ACME Corp
✓ Joint current account with Barclays (****4521)
✓ Council tax: £185/mo
✓ Child benefit: £96/mo from HMRC
✓ Monthly outgoings: £2,450 across 6 categories
✓ Account balance: £1,842

Something wrong? [Correct an item]
```

**Design:**
- Staggered reveal (each line fades in, 100ms between)
- Green checkmarks
- Clean list, not cards — this should feel effortless
- "Something wrong?" is small, muted — escape hatch, not a prompt
- Clicking "Correct an item" expands inline editing

**Volume:** 6-15 items typically. User scans in 5 seconds.

### Tier 2: Quick confirmations (one tap)

Medium-confidence findings (70-90%) that need a simple yes/no.

```
A FEW THINGS TO CONFIRM

Your largest payment is £2,150/mo — this looks like a mortgage payment.
[That's right ✓]  [It's rent]

This appears to be a joint account (two names on the statement).
[Yes, it's joint ✓]  [No, it's mine only]
```

**Design:**
- Each confirmation is a card with the finding + two button options
- One tap resolves it — card transitions to confirmed state
- Selected option fills warmth, unselected fades
- 200ms transition
- Resolved cards collapse slightly (not disappear — user can still see)

**Volume:** 1-3 items typically. User resolves in 10-15 seconds.

### Tier 3: Genuine questions (needs thought)

Low-confidence or genuinely ambiguous findings. The AI can't determine the answer.

```
ONE THING WE NEED YOUR HELP WITH

We noticed a £5,000 transfer on 15 March to an account we haven't seen before.

What was this?
[Transfer to my savings]
[Payment for something specific]
[Gift or loan to someone]
[I'd rather not say]
[I don't know]
```

**Design:**
- Prominent card with warmth left border
- Question in bold
- Options as large, tappable buttons (not small pills)
- Always includes an escape option ("I don't know" / "I'd rather not say")
- Answering may trigger ONE follow-up, maximum

**Volume:** 0-2 items typically. Most documents have none.

### Tier 4: Gap prompts (optional, skippable)

Things the AI DIDN'T find but should surface.

```
A COUPLE OF THINGS TO THINK ABOUT

💡 We didn't see pension contributions in this account.
   Do you have a workplace pension?
   [Yes, deducted from salary]  [Yes, different account]  [No]  [Skip]

💡 No savings transfers detected.
   Do you have savings or ISA accounts?
   [Yes, I'll upload those next]  [No]  [Skip]
```

**Design:**
- Lighter styling than Tier 3 — teal-light background, not warmth
- "Skip" is always an option and is prominent, not hidden
- These are prompts, not requirements
- Skipped prompts don't block anything

**Volume:** 1-3 items. All skippable.

---

## The complete flow after upload

```
UPLOAD → AI THINKING → RESULTS:

┌─────────────────────────────────────────┐
│                                         │
│  HERE'S WHAT WE FOUND                   │  ← Tier 1: auto-confirmed
│  ✓ Employment income: £3,218/mo         │     (staggered reveal)
│  ✓ Joint account, Barclays              │
│  ✓ Balance: £1,842                      │
│  ✓ Monthly outgoings: £2,450            │
│  ✓ Child benefit: £96/mo               │
│  Something wrong? [Correct an item]     │
│                                         │
│  ─────────────────────────────────────  │
│                                         │
│  A FEW THINGS TO CONFIRM                │  ← Tier 2: quick confirms
│                                         │     (1-3 items, one tap each)
│  £2,150/mo looks like a mortgage.       │
│  [That's right ✓]  [It's rent]          │
│                                         │
│  ─────────────────────────────────────  │
│                                         │
│  A COUPLE OF THINGS TO THINK ABOUT      │  ← Tier 4: gap prompts
│                                         │     (optional, skippable)
│  💡 No pension contributions seen.      │
│  [Yes, from salary] [Different acc] [Skip] │
│                                         │
│  ─────────────────────────────────────  │
│                                         │
│  ✓ 12 items added to your picture       │  ← Summary + done
│  [Upload another document]              │
│                                         │
└─────────────────────────────────────────┘
```

Note: Tier 3 (genuine questions) only appears when needed. Most documents won't trigger any.

---

## Interaction count

For a typical current account statement:

| Tier | Items | Interactions needed |
|------|-------|-------------------|
| Auto-confirmed | 8-12 | 0 (glance only) |
| Quick confirms | 2-3 | 2-3 taps |
| Genuine questions | 0-1 | 0-1 choice |
| Gap prompts | 1-2 | 0-2 taps (or skip all) |
| **Total** | **12-18 findings** | **3-5 taps** |

The user does 3-5 taps. The AI does everything else.

---

## "Something wrong?" correction flow

When a user clicks "Correct an item" on an auto-confirmed finding:

1. The list becomes editable — each item gets a small edit icon
2. Clicking edit on an item expands it inline:
   - Value becomes editable
   - Confidence toggle appears
   - Ownership selector appears
   - "This isn't right — remove" option
3. Save → item updates, list collapses back

This should be rare — the AI got most things right. But the escape is always available.

---

## Section labels — human, not technical

| Technical | Human |
|-----------|-------|
| "Extraction review" | "Here's what we found" |
| "Medium confidence items" | "A few things to confirm" |
| "Low confidence items" | "One thing we need your help with" |
| "Gap analysis" | "A couple of things to think about" |
| "All confirmed" | "✓ [X] items added to your picture" |

---

## AI prompt implications

The AI response needs to include a confidence score per item so the frontend can tier them:

```json
{
  "items": [
    { "label": "Employment income", "value": 3218, "confidence": 0.95, "tier": "auto" },
    { "label": "Housing payment", "value": 2150, "confidence": 0.80, "tier": "confirm",
      "confirm_question": "Is this your mortgage or rent?",
      "confirm_options": ["Mortgage", "Rent"] },
    { "label": "Large transfer", "value": 5000, "confidence": 0.30, "tier": "question",
      "question": "What was this £5,000 transfer?",
      "options": ["Savings", "Payment", "Gift", "Don't know"] }
  ],
  "gaps": [
    { "domain": "pensions", "prompt": "No pension contributions detected. Do you have a workplace pension?",
      "options": ["Yes, from salary", "Different account", "No", "Skip"] }
  ]
}
```
