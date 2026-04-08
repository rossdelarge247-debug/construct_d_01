# V1 Workspace Concept — Iterated

Replaces the original Compass Workspace concept from v1-wireframes.md.

---

## Design principles

1. **Always explain why.** Every task connects to what it builds toward. Not chores — context.
2. **No vanity.** No gamification, no unnecessary progress percentages. Only show progress when it genuinely helps the user understand where they are.
3. **Every path works without evidence.** Documents make it faster and richer. But manual entry, estimates, unknowns, and skips always work. No dead ends.
4. **Draft-first, refine later.** The system always generates the best output it can from whatever the user has provided. Caveats and confidence indicators keep it honest.
5. **AI recommendations throughout.** The system observes what's there and what's missing, and offers intelligent, contextual guidance. Not prescriptive. Helpful.
6. **The journey is always visible.** The user can always answer: Where am I? What am I building? Why does this matter? What comes next?
7. **Technology-maximised.** The system does the heavy lifting. Upload → extract → classify → organise → link. The user reviews and confirms, manages by exception.
8. **Topics, not tracks.** Finances and children are content areas within phases, not separate workstreams. They appear on the same mediation agenda. They progress together.

---

## Structure

### The divorce status

A simple status indicator. Not a detailed clock — that comes in later verticals.

- "Divorce: Not yet applied"
- "Divorce: Applied, waiting period"
- "Divorce: Conditional order granted"

Provides temporal context without dominating the workspace. Detail deferred to later verticals.

### The phase bar

Five phases, shown as a horizontal progression:

```
Build your ──→ Share & ──→ Work ──→ Reach ──→ Make it
picture         disclose    through   agreement  official
```

One phase is active. Others are explorable (not locked). Each phase shows:
- What it involves (plain English)
- Why the previous phase builds to this one
- What you'll need to have ready

Future phases show **zero-data states** that educate and reduce anxiety — not empty placeholders but genuine explanations of what's coming and why.

### Phase labels

Derived from real user language, not product/legal terminology:

| Phase | What the user is doing |
|-------|----------------------|
| Build your picture | Bringing together finances, children's arrangements, evidence |
| Share & disclose | Putting it all on the table with the other party |
| Work through it | Proposals, counter-proposals, mediation, negotiation |
| Reach agreement | Resolving remaining disputes, capturing final positions |
| Make it official | Drafting court documents, submission, formalisation |

### Topic areas within phases

Finances and Children appear as **content areas within the active phase**, not as separate tracks. Their content shifts per phase:

**Build your picture:**
- Finances: items, values, evidence, gaps
- Children: arrangements, needs, plans

**Share & disclose:**
- Finances: what to share, Form E sections, open questions
- Children: proposed arrangements, what to share

**Work through it:**
- Finances: proposals, counter-proposals, disputed items
- Children: proposals, counter-proposals, adjustments

**Reach agreement:**
- Finances: agreed positions, remaining disputes
- Children: agreed arrangements

**Make it official:**
- Finances: consent order content, D81 data
- Children: consent order content or parenting plan

### The task layer

Tasks are intelligent, contextual, and always explain why:

- **System tasks**: things the system needs from the user (review extracted items, confirm values, fill gaps)
- **Guided actions**: things the user needs to do externally with guidance (request pension CETV, get property valuation)
- **AI recommendations**: things the system suggests based on what it observes ("Your pension is marked as unknown. This is often one of the largest assets...")

Tasks are NOT a static checklist. They adapt based on:
- What the user has provided
- What the system has extracted
- What gaps remain
- What's urgent (time-dependent like CETVs)
- What's needed for the next phase

Every task supports:
- **Do it now** → guided flow
- **Skip for now** → marked as pending, no penalty
- **I don't have this** → marked with confidence state, system adjusts recommendations
- **Add manually** → simple input, no evidence required

### The timeline

A chronological feed at the bottom of the workspace. Auto-populated, AI-enriched.

**Not called "journal"** — it's the case timeline. The user doesn't need to think about writing in it. It captures:

**Automatic entries:**
- Documents uploaded, classified, and what was extracted
- Financial items created or changed (old value → new value)
- Confidence states changed
- Proposals created or updated
- Items shared with others
- Phase transitions

**AI-enriched entries:**
- Mediation email/summary uploaded → AI extracts: date, discussion points, what was agreed, what's disputed, action items, suggested amendments to current position
- Solicitor letter uploaded → key points extracted, action items flagged
- Counter-proposal uploaded → compared to current position, changes highlighted

**Manual entries:**
- User can add notes at any time
- Taggable by topic
- Linkable to specific items or documents

The timeline becomes the **negotiation memory** — the living record of the entire case.

### Technology-maximised approach to building the financial picture

The workspace does NOT present tasks as chores ("upload 12 months bank statements"). Instead:

**Step 1: Upload anything**
"Drop any financial documents — bank statements, payslips, pension letters, mortgage statements, tax returns. We'll read them, extract the numbers, and organise everything automatically."

**Step 2: System extracts and classifies**
AI classifies documents, extracts key values, creates financial items, links evidence to items, tags confidence as Known (from document).

**Step 3: User reviews by exception**
Extracted items presented for accept/edit/reject. Not a form to fill — a review of what the system already did.

**Step 4: Gaps surfaced intelligently**
"We found income, savings, and mortgage details. We didn't find: property value, debts, partner's finances." Each gap offers: add manually, upload more documents, mark as unknown, skip for now.

**Step 5: AI recommendations**
"Your pension is marked as unknown. Pensions are often one of the largest assets — sometimes worth more than the home. We'd recommend requesting a CETV. Here's exactly how."

**No-evidence path:**
User can skip uploads entirely. Manual entry for every item. Estimates and unknowns accepted everywhere. The system still generates the best output it can, with honest caveats.

---

## Zero-data states for future phases

Each future phase shows a helpful explanation, not an empty screen:

### Example: "Share & disclose" (when user is in "Build your picture")

```
SHARE & DISCLOSE

When your picture is complete, this is where you prepare
to share it with the other party.

What happens here:
· Your financial information gets structured into a
  disclosure-ready format
· You choose what to share and with whom
· The other party can share theirs back
· Open questions get raised and tracked

What you need first:
· Your key financial items confirmed or evidenced
· Children's arrangements shaped
· Main gaps addressed or acknowledged

You're making good progress on building your picture.
When you're ready, we'll help you prepare to share.
```

---

## Wireframe — desktop

```
┌──────────────────────────────────────────────────────────────────┐
│  Decouple                                         Profile  ⚙    │
├──────────────────────────────────────────────────────────────────┤
│  Divorce: Not yet applied                                        │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Build your ──→ Share & ──→ Work ──→ Reach ──→ Make it           │
│  picture ●      disclose    through   agreement  official        │
│                                                                  │
│  BUILD YOUR PICTURE                                              │
│  Bringing together your finances, children's arrangements,       │
│  and supporting evidence. This becomes the foundation for        │
│  sharing, negotiation, and formalisation.                        │
│                                                                  │
│  Finances                                          7 of 12 items │
│  Children                                          3 of 8 items  │
│  Documents & evidence                              8 uploaded    │
│                                                                  │
│  WHAT TO DO NEXT                                                 │
│                                                                  │
│  ⚠️ Request your pension valuation (CETV)                       │
│     Pensions are often the largest asset in a settlement.        │
│     This request takes up to 3 months — starting now means       │
│     it's ready when you need it. [Get started →]                 │
│                                                                  │
│  📎 Add more documents                                          │
│     Drop any financial documents and we'll extract, organise,    │
│     and link them automatically. [Upload →]                      │
│                                                                  │
│  ? 3 items need your input                                      │
│     We couldn't find these in your documents: property value,    │
│     debts, partner's finances. [Review gaps →]                   │
│                                                                  │
│  ✓ 2 extracted items to confirm                                 │
│     We found these in your uploads. Check they look right.       │
│     [Review →]                                                   │
│                                                                  │
│  ─── TIMELINE ───────────────────────────── [View all] [Add] ─── │
│                                                                  │
│  Today · Extracted 4 items from mortgage_stmt.pdf                │
│          Mortgage: £195,000 · Monthly: £890                      │
│                                                                  │
│  Yesterday · 3 documents uploaded                                │
│              2 bank statements, 1 payslip                        │
│              Income: £3,200/mo · Savings: £12,400                │
│                                                                  │
│  5 Apr · Workspace created from your plan                        │
│          3 areas started · 4 unknowns identified                 │
│                                                                  │
│  [Add a note]                                                    │
│                                                                  │
│  YOUR PLAN [View] [PDF]                                          │
│                                                                  │
├──────────────────────────────────────────────────────────────────┤
│  Privacy · Terms · Support · Exit this page                      │
└──────────────────────────────────────────────────────────────────┘
```

## Wireframe — mobile

```
┌──────────────────────────┐
│ Decouple          ☰  👤  │
├──────────────────────────┤
│ Divorce: Not applied     │
│ ● Build your picture     │
├──────────────────────────┤
│                          │
│ Finances        7 of 12  │
│ Children        3 of 8   │
│ Documents       8 files  │
│                          │
│ WHAT TO DO NEXT          │
│                          │
│ ⚠️ Request pension CETV │
│ Takes ~3 months.         │
│ [Get started →]          │
│                          │
│ 📎 Add documents        │
│ We'll extract and        │
│ organise automatically.  │
│ [Upload →]               │
│                          │
│ ? 3 gaps to review       │
│ ✓ 2 items to confirm    │
│                          │
│ ── TIMELINE ──────────── │
│ Today · Extracted 4      │
│ items from mortgage PDF  │
│                          │
│ [Add a note]             │
│ [Your Plan]              │
│                          │
│ Exit this page           │
└──────────────────────────┘
```
