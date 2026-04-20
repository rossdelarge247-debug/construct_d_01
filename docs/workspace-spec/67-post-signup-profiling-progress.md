# Spec 67 — Post-Signup Profiling: Distribution Map + Gaps 1-5 Resolved

**Date:** 20 April 2026
**Status:** IN PROGRESS. Gaps 1-5 resolved below. Gaps 6-12 pending — to be resolved in next session.
**Supersedes working document:** spec 66 (gap list)
**Related:** spec 65 (pre-signup interview — locked)

---

## The architecture (agreed)

Post-signup profiling is **distributed across the journey**, not a single block. Each question lives where it best fits — triggered by user action, pre-signup flags, or bank signals — and each produces something specific (engine context, document data, to-do list items, or proposal inputs).

## Distribution map

```
SIGN UP
  ↓
WELCOME TOUR (first-time carousel, 4 panels)
  Panel 1: Build your financial picture
  Panel 2: Share + reconcile with your ex
  Panel 3: Propose, negotiate, agree
  Panel 4: Finalise, generate docs, submit
  ↓
FIRST-TIME DASHBOARD
  → Hyper-focused on: "Build your financial picture"
  → (Dashboard spec 04 needs pressure test — deferred)
  ↓
DISCLOSURE ENTRY — explanation + bank vs manual choice
  ↓
MOMENT 2: PRE-BANK PROFILING (engine context, ~2-3 min)
  ├ P1 Housing provider (mortgage/rent)
  ├ P2 Employment details (if self-employment flagged)
  ├ P3 Vehicles + finance provider
  ├ P4 Pensions basic (type + provider)
  ├ P5 Other assets checklist
  └ P6 Other bank accounts not connected
  ↓
BANK CONNECTION + REVEAL
  ↓
MOMENT 3: SECTION-BY-SECTION CONFIRMATION (main work)
  ├ Income (matched + disambiguation)
  ├ Property details (activated by property_status from pre-signup)
  ├ Accounts (including closed + app-based prompts)
  ├ Pensions (deeper — DB/DC, CETV, multiple)
  ├ Debts (balances, sole/joint, purpose)
  ├ Vehicles & other assets (per P5 checklist)
  ├ Business section (if self-employed)
  └ Spending (6 Form E 3.1 categories)
  ↓
CHILDREN SECTION (if has_children = true)
  ├ 5 screens (C1-C5)
  └ Triggered by to-do list or CTA after spending review
  ↓
HOUSING TRANSITION SECTION
  ├ 2-3 screens (HT1-HT2)
  └ Triggered after financial picture substantially built
  ↓
FINANCIAL PICTURE READY
  ↓
VERIFICATION OPT-IN (credit check, document upload)
  ↓
REVERSE PARTNER AWARENESS (before sharing)
  ↓
SHARE WITH EX → RECONCILIATION → HOUSEHOLD PICTURE

───── line between facts and proposals ─────

PROPOSAL PHASE (future state)
  ↓
FUTURE NEEDS PROFILING (Gap 5 — MOVED HERE)
  ├ FN1 Post-separation budget
  ├ FN2 Career and income
  └ FN3 Housing plans + retirement
  → Setup for proposal builder, not disclosure
  ↓
PROPOSAL BUILDER (per item with system context)
  ↓
COUNTER → AGREE → FINALISE → SUBMIT → IMPLEMENT
```

---

## Gap 1: Data bridge from pre-signup — RESOLVED

**Approach:** Moment 1 (immediate post-signup) acknowledges what we already know. Post-signup profiling skips what's answered and goes direct to follow-ups based on pre-signup state.

**Bridge examples:**

| Pre-signup state | Moment 2 behaviour |
|---|---|
| `property_status = mortgage` | P1 asks "Who's your mortgage with?" (not "do you own or rent?") |
| `property_status = own_outright` | P1 skipped — no mortgage to match. Property section activated post-bank anyway. |
| `property_status = rent` | P1 asks rent provider + amount + day |
| `property_status = other` | P1 asks clarifying question |
| `has_children = false` | Children section hidden entirely. No to-do item. |
| `has_children = true`, count = N | Children section active, loops through N children |
| `self_employment = me/both` | P2 asks for company details (name, structure, pay method) |
| `self_employment = neither` | P2 skipped |
| `relationship_quality = safety_concerns` | Moment 1 offers discreet mode setup + specialist resources |
| `device_private = not_sure` | Moment 1 explains quick-exit feature, offers discreet mode |
| `partner_awareness = hiding` | Credit check strongly recommended later (pre-share) |

**What Moment 1 looks like:**

```
"Based on what you told us:

 • Separating, 2 children
 • Own with a mortgage
 • You're employed, your ex is self-employed
 • You know some things about their finances

 Let's go deeper so we can build your picture accurately."

 [If safety flag:] "Setting up your account safely first..."

 [Continue →]
```

---

## Gap 2: Property details — RESOLVED

**Approach:** Split by data type. Provider at pre-bank (engine needs it for matching). Everything else at post-bank (confirmation flow, in context).

**Pre-bank (P1):**
- `mortgage` → "Who's your mortgage with?" (dropdown + free text)
- `own_outright` → skip
- `rent` → "Who do you pay rent to?" + amount + day (helps pattern-matching)
- `other` → clarifying question

**Post-bank (Moment 3 Property section):**
- Property value (estimated or valued)
- Mortgage balance (estimate fine)
- Government scheme (HTB / shared ownership / Right to Buy / none)
- Shared ownership % (if applicable)
- Ownership structure (sole / joint / tenancy-in-common)
- Occupation (who lives there now)
- Current status (family home / on market / under offer / rented out)

**Edge case:** If `own_outright`, property section activates post-bank (triggered by pre-signup flag, not bank signal). Asks value, ownership, occupation, status — skips mortgage/scheme.

---

## Gap 3: Children depth — RESOLVED

**Approach:** 5-screen section, activated by `has_children = true`, triggered by to-do list or CTA after spending review confirms childcare costs.

**Screens:**

**C1 — Introduction**
Acknowledges care needed. Explains what we'll ask. Skip-able.

**C2 — Per child (loops from pre-signup count)**
- Name or nickname
- Age (not DOB)
- School: state / private (with approx fees + "is continued private school agreed?") / not in school / home educated / other
- Special needs: checkbox → progressive disclosure with structured selectors (SEN support, medical condition, specific dietary needs, disability, other)

**C3 — Current living arrangements**
- Primary care: with me / with ex / equal shared care (children rotate) / set pattern / roughly shared / not settled
- If pattern: split percentage
- Current contact pattern with other parent

**C4 — Childcare**
- Paid childcare? (yes types / no)
- Auto-populated if bank data detected childcare

**C5 — Summary**
Recap, contributes to document Section 1.

**Child Benefit recipient** — captured in income section (not children), as it's a benefit classification.

**What this produces:**
- Document Section 1 (The children)
- Validates Child Benefit detection
- Primary carer factor for proposals
- Special needs context for proposals

**What it doesn't capture:**
- Future arrangements (proposal phase)
- Child maintenance amount (proposal phase)
- Decision-making arrangements (proposal phase)

---

## Gap 4: Housing transition — RESOLVED

**Approach:** 2-3 screens, triggered after financial picture substantially built. To-do item / CTA from financial summary.

**Distinction from property details:**
- Property section (Moment 3): financial data (value, balance, ownership, scheme)
- Housing transition: life situation data (who lives where, future intent, interim arrangements)

**Screens:**

**HT1 — Current living**
- Who lives in the family home now (including "equal shared care — children rotate, parents alternate" as explicit option)
- Who's paying mortgage/rent right now
- Who's paying bills right now

**HT2 — Future intent**
- Sell and split / one stays (who buys out who) / deferred sale / haven't decided / already agreed
- Timeline if agreed

**What this produces:**
- Document housing section
- Pre-seeds proposal builder (property option pre-selected based on intent)
- Spending context (if one person paying full costs but lower income — maintenance argument)

**Edge case — "equal shared care with rotation":** Explicit option. Has major financial implications (two housing costs, not one). Flagged for downstream proposal logic.

---

## Gap 5: Future needs — RESOLVED (MOVED TO PROPOSAL PHASE)

**Key decision:** Future needs is NOT part of disclosure. It's future state — opinion and projection, not fact. It belongs as setup for the proposal builder, not as part of the financial picture.

**Placement:** First step of the proposal phase, after the household picture is locked (v3.0 FACTS AGREED).

**Structure:** 3 screens (FN1-FN3)

**FN1 — Post-separation budget**
Start-from-current or blank-slate option. 6 Form E 3.1 categories.

**FN2 — Career and income**
Likely changes, career plans (retraining, returning to work, retirement, etc.)

**FN3 — Housing plans + retirement (if property sold/undecided)**
Buy/rent plans, rough budget, mortgage needs, retirement concerns.

**What this produces:**
- Document "Future needs" section
- Proposal maintenance calculation (income gap, duration needs)
- Proposal reasoning (career context, housing context, retirement argument)
- Property option pre-selection (if housing plans are clear)

**Rationale for move:** The financial picture is about "what IS." Proposals are about "what SHOULD BE." Future needs is clearly the latter. Keeping them separate:
- Makes the disclosure cleaner (just facts)
- Makes proposals richer (informed by declared future needs)
- Matches user mental model — "build picture" then "discuss future"

---

## Gap 6: Self-employed details — sequencing — RESOLVED

**Approach:** Basics pre-bank (engine needs them for classification). Depth post-bank in a dedicated Business section (user has cognitive momentum after seeing classified business credits).

**Moment 2 (pre-bank) — P2 Self-employed basics** *(only if `self_employment ∈ {me, both}`)*

Three screens, one question per screen.

**P2a — Business identity**
```
"Tell us about your business"

Company / trading name: [___________]
Structure: ○ Sole trader  ○ Limited company  ○ Partnership  ○ Other
```

**P2b — Pay method**
```
"How do you pay yourself?"

○ Salary only (PAYE through the company)
○ Dividends only
○ Salary and dividends
○ Drawings / ad hoc
○ Not sure / varies
```

**P2c — Other income channels**
```
"Any other income sources from the business?"

□ Client payments direct to me
□ Rental income through the company
□ Other
□ None — it's all through the above
```

Rationale: platforms like Stripe, GoCardless, or direct client transfers land in the bank account and need Tier 1 classification pre-bank, not Tier 3 "what is this?" post-bank.

**Moment 3 (post-bank) — Business section** *(slotted into section-by-section confirmation after Income review)*

**B1 — Income confirmation (enhanced)**
Shown alongside detected credits from the company:
```
"£2,800/mo on 28th, consistent"  → [Salary] [Dividend] [Other]
"£5,000 on varying dates"         → [Salary] [Dividend] [Other]
"£1,200 from Stripe"              → [Client payments] [Other]
```

**B2 — Business value**
```
"What's the approximate value of the business?"
[________]  + "Skip if unsure — we can come back to this"

In-screen guidance: "Your accountant can give you this. For Ltd
companies, it's usually net assets on the last balance sheet plus
goodwill. For sole traders, it's tools, stock, and goodwill."
```
If skipped, adds "Get business valuation" to to-do list.

**B3 — Shareholding** *(Ltd only)*
```
"Do you hold shares in the company?"
○ Yes, 100%
○ Yes, jointly with my spouse/partner
○ Yes, with other shareholders → "What percentage is yours?" [___%]
○ No — I'm a director but not a shareholder
```
Auto-hidden if structure ≠ Ltd. For partnerships, becomes "What's your partnership share?" [___%].

**B4 — Director's loan account** *(Ltd only)*
```
"Do you have a director's loan account?"
○ Yes → "Roughly, what's the balance?" [______]
        "Is the company owing you (credit) or are you owing the
         company (debit)?"  ○ Company owes me  ○ I owe the company
○ No
○ Not sure → shown message: "DLAs are the most commonly missed
             item on Form E. Ask your accountant before sharing."
```

**B5 — Accountant + documents**
```
"Do you have an accountant?"
○ Yes → Name + firm (optional)
        "We'll need your last 2 years' tax returns (SA302) and the
         most recent company accounts. We've added these to your
         to-do list."
○ No — I do my own → "OK. SA302 available from HMRC online,
                      accounts via Companies House."
```

**To-do items generated:**
- SA302 last 2 years (auto-added)
- Most recent company accounts (auto-added)
- Business valuation (if B2 skipped)
- Accountant letter (if needed for sharing)

**Edge cases:**
- `self_employment = ex` → P2 skipped entirely for this user. Business section runs on the invited party's journey (Gap 7).
- `self_employment = both` → P2 and B1-B5 run for each party separately.
- "Not sure / varies" on pay method → engine falls back to Tier 3 per-credit classification in B1.
- Sole trader → B3, B4 auto-hidden. B2 reframed ("tools, stock, goodwill").
- Dormant / ceased Ltd → B2 guidance adds "enter £0 or book value if dormant." B1 still runs for historic credits.

**What this produces:**
- Document business subsection (structure, shareholding, DLA, estimated value, accountant)
- Engine Tier 1 matches for company name across all credit patterns
- To-do items for SA302 / accounts / valuation — parallel treatment to CETV for timeline pressure
- Verification flags (business value = self-declared until documents land)

---

## Gap 10: Pension depth — DB vs DC, CETV status — RESOLVED

**Approach:** Don't ask DB vs DC at profiling — users can't classify. Ask existence + provider + a quiet DB-proxy (public-sector / legacy-corporate). Fire CETV nudge immediately for DB-likely users to start the 6-12 week clock on day 1. DB/DC vocabulary surfaces only in post-bank confirmation, with examples and pre-selection from profile heuristics.

**Key move:** CETV request lands on the to-do list at pre-bank, before bank connection. This is the single biggest timeline win in the product — 6-12 weeks saved.

**Moment 2 (pre-bank) — P4 Pensions basic** *(always asked)*

**P4a — Existence**
```
"Do you have any pensions?"

○ Yes, one
○ Yes, more than one
○ I'm already drawing a pension
○ Not sure — maybe from old jobs
○ No
```

Avoids workplace/personal/private distinctions. "Not sure" honoured.

**P4b — Provider + DB proxy** *(shown if P4a ≠ No)*
```
"Who's your pension provider?"

Provider 1: [Aviva        ▾]  ← dropdown of UK providers + free text
[+ Add another pension]

"Which of these best describe you or your employer?"
□ Current or former public sector worker (NHS, GP or other
  health service, teacher, civil servant, police, armed
  forces, firefighter, local authority)
□ Current or former large corporate (banking, utilities,
  manufacturer) — you joined before 2012
□ None of these / not sure
```

Second question is the quiet DB detector. User never sees "DB" or "DC."

**P4c — CETV nudge** *(shown if DB likely — i.e. either checkbox ticked)*
```
"A quick note about timing"

"Some pensions (especially from public sector jobs or older
 corporate schemes) need a special valuation called a CETV.
 Your pension provider has to calculate it — it typically takes
 6-12 weeks, and we can't avoid that wait.

 We'll add this to your to-do list so you can start early. The
 valuation will be ready when you need to share your picture."

[OK, add to my to-do list]    [Skip for now]
```

Dedicated screen. Timeline message deserves its own beat. For DC-only users, P4c is skipped entirely.

**Engine use of P4:**
- Provider names → Tier 1 match (disambiguates Aviva pension vs Aviva insurance)
- Public-sector / legacy-corporate flag → `expect_DB_pension: likely`, drives CETV-now nudge
- "Drawing a pension" → classify pension credits as `pension_income`
- "Not sure" → don't block; detect in confirmation

**Moment 3 (post-bank) — Pension section**

**PN1 — Review what we found**
```
✓ Aviva — £185/mo contribution matched to your workplace pension
✓ Scottish Widows — no contributions visible (likely workplace,
   deducted at source)
? Hargreaves Lansdown — £300/mo — is this a pension (SIPP) or
   an investment account?
```

**PN2 — Per-pension DB/DC** *(loops per pension, first use of DB/DC vocabulary)*
```
"Aviva — tell us more"

○ You pay in (and your employer pays in) and it builds up a pot
  → "defined contribution" pension. Modern private-sector norm.

○ You get a guaranteed income for life based on your salary
  and years worked
  → "defined benefit" pension. Public sector and older corporate.

○ Not sure
```
Pre-selected from P4b signal + provider heuristics (Teachers' Pensions = DB, Nest = DC). User can correct. "Not sure" treated as DB (conservative).

**PN3 — Value + CETV status**

DC path:
```
"What's the approximate value?"
[______]  + "This is on your latest statement or online portal."
○ I don't know — add to my to-do list

"How recent is this figure?"
○ Less than 3 months  ○ 3-12 months  ○ Over a year
```

DB path:
```
"Have you requested your CETV yet?"
○ Yes — it's on the way
  → "When did you request it?" [date] → countdown shown
○ Yes — I have it already
  → CETV value [______]
  → Date of valuation [______]
○ No, not yet
  → CTA: "Request CETV now" + how-to + to-do item with target date
```

Public sector → PN3 help text includes McCloud note: "If your scheme is affected by the McCloud judgment, your CETV may be estimated or delayed."

**PN4 — If drawing a pension**
- Monthly amount (bank auto-detected, user confirms)
- Provider / scheme name
- Start date of drawdown
- Annuity or drawdown
- Any lump sum taken in last 12 months

**Edge cases:**
- Forgotten old-job pensions → "not sure" keeps door open. Engine detects contributions. Pension Tracing Service nudge deferred to later (share-readiness, not profiling).
- SIPPs → PN1 Tier 2 disambiguation (SIPP or investment?). If SIPP → DC downstream.
- Multiple pensions → PN2/PN3 loop, each with its own to-do item.
- Drawn + still contributing → PN4 for drawn, PN2/PN3 for remaining pots.
- Complex pension sharing → flag PODE (Pension on Divorce Expert) for on-demand professional review (spec 42).

**To-do items generated:**
- CETV request (auto-added for DB-likely, target date set)
- Pension statement upload (for DC, if value unknown or stale)
- Scheme summary / TVC request (for DB if complex, at share-readiness)

**What this produces:**
- Document pensions section (per-pension type, provider, value, CETV status)
- Earliest-possible CETV request (day 1, not day 30)
- Engine Tier 1 classification of pension providers
- Trust signals (CETV-with-date = evidenced; pot value = self-declared until statement)
- Proposal inputs (pension sharing feasibility, PODE flag when complex)

---

## Gap 9: Account structure — RESOLVED

**Approach:** Two touches. Light priming pre-bank (P6 heads-up, no data capture). Full capture post-bank in the Accounts section using detected evidence — specific transfer destinations beat cold checklists.

**Moment 2 (pre-bank) — P6 Other accounts heads-up** *(one screen)*
```
"Before we connect, a heads-up"

"We'll connect your main bank(s) in the next step and pull in the
 last 12 months of data. That covers most people. A few things to
 have in mind:

 • App-only banks like Monzo, Revolut, Starling, Chase — we can
   connect these too if you have them
 • Savings accounts with providers like NS&I, Marcus, Chip, Atom —
   bring their most recent statements
 • Joint accounts — connect the one you have access to
 • Closed accounts in the last 12 months — we'll ask about these
   after we see what you connect"

[Got it — let's connect →]
```

Deliberately not a checklist. Primes attention; capture happens post-bank where evidence can drive it.

**Moment 3 (post-bank) — Accounts section**

**AC1 — Connected accounts review**
```
"Here are the accounts we connected"

HSBC — Current account (sole) — connected 20 Apr
HSBC — Savings (sole) — connected 20 Apr
Barclays — Joint current account — connected 20 Apr

  [+ Connect another bank]
```
Soft prompt if only one institution connected.

Soft line (not a separate screen): *"Any joint accounts with your spouse/ex you can't log into? Add them when they join."*

**AC2 — App-based / other providers**
Reduced chip list:
```
"Do you have accounts with any of these?" (tap all that apply)

[Monzo]  [Revolut]  [Starling]  [Chase]  [Other savings provider]
```
Per tapped:
- Connect now (if Tink supports), OR
- Upload statement → to-do item, OR
- "Linked pot of my main account" (no separate balance)

**AC3 — Transfers to unknown accounts** *(engine-driven)*

**Dependency:** requires the matching layer to detect outbound transfers to destination accounts (by sort code + account number or name) and identify those NOT among connected accounts. This is a requirement for the engine — capture in the post-bank classification enhancement spec.

```
"We noticed regular transfers to an account that isn't connected"

Account ending 4521 — £500/mo — possibly a savings account?

○ That's my own account — let's connect it
○ That's my own account — I'll upload statements
○ That's my spouse/ex's account
○ That's someone else's account → [who?]
○ I don't recognise this → flag for review
```

Powerful anti-hidden-accounts safeguard. Completion = trust signal at share time.

**AC4 — Closed accounts in last 12 months**
```
"Any accounts closed in the last 12 months?"

Form E requires statements from accounts open in the last 12 months,
even if closed now.

○ Yes → loop per account (provider, type, approx closure date,
        sole/joint, approx final balance, statements?)
○ No
○ Not sure → to-do item
```

**AC5 — Business accounts** *(self-employed only, pointer to Business section)*
```
"We'll cover business accounts in the business section."
```

**Edge cases:**
- Linked pots (Monzo pots, Starling spaces) — don't duplicate; AC2 has the "linked pot" option.
- Crypto exchanges — out of scope here; covered in other-assets. AC3 catches untagged Coinbase transfers as cross-check.
- Dormant savings forgotten — AC4 partially covers; share-readiness gap check surfaces again.
- Revolut/Wise multi-currency wallets — treat as one account.
- NS&I Premium Bonds — investments section, not AC.
- Recently-opened accounts (<30 days) — engine handles without separate capture.
- Dormant (no 12-month transactions) — captured via AC2 "other provider" with statement upload.

**Engine dependency (to capture in a separate spec):**
The matching layer must expose outbound transfer destinations and flag those not covered by any connected account. AC3 hinges on this.

**What this produces:**
- Document accounts section (connected + app-based + closed)
- Engine enrichment (fewer Tier 3 unknowns once destinations are tagged)
- To-do items (statement uploads, closed-account statements)
- Trust signals (AC3 complete → "no unexplained outbound transfers" badge)
- Reconciliation prep (joint-not-primary flagged for ex's side)

---

## Gap 8: Verification opt-in placement — RESOLVED

**Approach:** Three placements, not one. No pre-bank friction. Inline document uploads during confirmation. Consolidated credit-check + remaining-documents moment pre-share. Always-available verification hub (dashboard widget + dedicated page). Identity verification deferred to consent-order stage (end of journey, when documents need signing).

**(c) Inline during confirmation — document upload affordances**

Every evidenceable assertion gets a light "upload / later" control. Skip auto-adds to to-do list. Each upload lifts trust level from self-declared → document-evidenced.

Slots include:
- Property → valuation or Zoopla estimate (future: Zoopla integration pre-fills)
- Mortgage → statement
- Pension CETV → letter when it arrives
- Pension DC → latest statement
- Business → company accounts, SA302s
- Closed account → final statement
- Salary → payslips (only if bank data ambiguous)

Never a blocker. Always skippable.

**(d) Pre-share verification moment — dedicated screen**

Triggered when picture is substantially built (post-spending, post-children, post-housing transition), before "share with ex" action.

```
"Your picture is ready. One last step — let's strengthen it."

"Before your ex sees your picture, we can add verification layers
 that make it harder to dispute and easier to trust."

┌─ Credit check (recommended) ─────────────────────────────┐
│  We'll check your credit file with Experian.             │
│  This catches debts or credit agreements the bank data   │
│  didn't show. Takes 2 minutes. Soft check — no impact    │
│  on your score.                                          │
│                                                          │
│  [Run credit check]    [Skip — self-declared only]       │
└──────────────────────────────────────────────────────────┘

┌─ Documents you haven't uploaded yet ─────────────────────┐
│  • Property valuation                                    │
│  • CETV letter (requested — arriving approx 3 weeks)     │
│  • Company accounts (added to to-do list)                │
│                                                          │
│  [Upload what you have]    [Continue without]            │
└──────────────────────────────────────────────────────────┘
```

Credit check is recommended-by-default (2-min soft check, no downside, measurable trust upside). Identity verification is NOT offered here — it waits until consent-order stage when document signing actually needs it.

**"Partner awareness: hiding" variant:**
```
"You mentioned at signup that you're worried your partner might
 be hiding things. The credit check catches exactly this — debts,
 credit cards, or agreements that aren't in their bank data.

 When they go through their picture, they'll do this too.

 [Run my credit check]"
```

**(e) Verification hub — always available**

Both a dashboard widget AND a dedicated page (detailed with dashboard pressure-test later).
- Each major item with current trust level
- What would raise it (run credit check, upload X)
- What's in-flight (CETV requested N weeks ago)
- Asymmetry surface: at reconciliation, each side sees the *trust level of each item* (not "did X run a check") — framed as evidence strength, not what the person refused.

**Identity verification — deferred to consent-order stage**

Not at pre-share. Not during profiling. Introduced at the end of the journey when the user is about to sign and submit legal documents. Different mental model: "this is for the court, not for your ex."

**Edge cases:**
- User refuses credit check → not forced. At reconciliation, ex sees each item's trust level (non-credit-checked items show as "self-declared + bank-evidenced" rather than "+ credit-verified"). Ex can request one themselves.
- Credit check returns new debts → engine surfaces: "we found these — add to your picture?" User confirms or flags as "error on file — I'll dispute" (dispute path logged).
- Document upload fails / poor quality → hub shows "uploaded but couldn't extract" → re-upload or flag for professional review (spec 42 on-demand).
- Self-employed pre-share → missing company accounts / SA302s prominently flagged (self-employed disclosures get scrutinised harder).
- Reconciliation asymmetry → gentle nudge: "Your ex has evidenced their debts with a credit check. Want to add one too?" Non-shaming frame.
- Safeguarding (safety_concerns flag) → credit check offered without strong framing. Document uploads fine. Identity deferred to absolute last moment (less digital footprint).

**What this produces:**
- Three discrete placements (inline, pre-share consolidated, always-available hub)
- Trust level per item (self-declared / bank-evidenced / credit-verified / document-evidenced / both-party-agreed / court-sealed — per spec 42)
- Gap surfacing at peak motivation (just before share)
- Never gated. Always opt-in.
- Asymmetry visibility as accountability mechanism — transparency not policing

**Engine / product dependencies:**
- Credit check integration (Experian / ClearScore — pick provider)
- Document upload pipeline with extraction + trust-level update
- Trust-level taxonomy wired to every item type
- Dashboard widget + verification page (awaits dashboard pressure-test)
- Identity verification flow (awaits consent-order stage spec)

---

## Gap 12: Reverse partner awareness — RESOLVED (REFRAMED)

**Decision:** The original question — "what does your partner know about your finances?" — is dropped. It has no actionable answer: if the user discloses an item, the ex will know by definition; if they don't disclose, we don't know to ask. The middle-ground "surprise" scenarios are natural territory for reconciliation flow in the proposal phase, not pre-share preparation.

**What replaces it:** A pre-share **commonly-missed-items checklist**. Completeness is what actually matters at this moment — consent orders require full disclosure; an undisclosed asset surfacing later can unwind the whole agreement.

**Placement:** Pre-share, after verification (Gap 8d), before the invite-ex action.
```
picture built → verification → COMPLETENESS CHECKLIST → share
```

**CL1 — One last check**
```
"One last check — have we captured everything?"

"Some things are easy to forget. Tap anything that applies —
 we'll add it before you share."

Household & valuables
  □ Jewellery, watches, wedding/engagement rings
  □ TV, audio, gaming consoles
  □ Art, prints, antiques
  □ Tools, equipment (work or hobby)
  □ Collectibles (stamps, coins, wine, memorabilia)
  □ Musical instruments
  □ Designer clothes, handbags, shoes over £500

Money matters
  □ Cash at home over £500
  □ Money someone owes me
  □ Money I owe someone (not a bank/credit card)
  □ Endowment or life insurance with a cash-in value
  □ Compensation or inheritance due to me

Other
  □ Crypto not yet declared
  □ Foreign property or bank accounts
  □ Timeshare
  □ Horses, livestock, or pets of significant value

[I've got everything →]
```

Per-tick → mini-form (description + approx value + optional photo/receipt).

**CL2 — Encouragement (always shown)**
```
"Thanks for double-checking."

"Disclosing everything — including small items — is what makes
 a settlement enforceable. If an undisclosed asset emerges later,
 the whole agreement can be re-opened. Better to include a £400
 ring than leave it out."

[Share with my ex →]
```

Completeness framed as self-protection, not bureaucracy.

**Edge cases:**
- Many items ticked → mini-forms batched, deferrable ("I'll add later" → to-do item).
- Item already declared → "this is already in your picture" with link to its section.
- High-value late addition → "this materially changes your picture — review before sharing?" prompt.
- Nothing ticked → proceed directly to share.
- Safeguarding — same checklist, no tonal change. Completeness protects everyone.
- Late-valued items → photo / receipt upload can be deferred; value self-declared until evidenced.

**What this produces:**
- Legally-stronger disclosure (spec 41 enforceability research)
- Completeness trust badge on user's side of picture
- Fewer late-reconciliation surprises
- Reconciliation-phase relief (ex sees complete picture)

**What stays:** Pre-signup O5 ("what do you know about your partner's finances") is unchanged. Different question, different job — gates messaging, flags hidden-assets pathway, emphasises credit check.

**Surprise management lives in reconciliation flow** (proposal phase), not here. Per-item "discuss this" affordances, one-at-a-time surfacing, dispute paths — all already specced for agreement phase.

---

## Gap 11: Safeguarding carry-through — RESOLVED

**V1 approach:** Universal baseline + triggered signposting + basic privacy defaults. Full adaptive safeguarding architecture (coercive control detection, mediator routing, decoy mode, adaptive pacing) deferred to V1.5 backlog.

**Rationale** (grounded in v1-desk-research.md):
- 30% of DA deaths occur in the first month of separation; 70% within first year
- 95% of DA cases involve economic abuse
- 72% of Refuge service users report tech-facilitated abuse
- Women's Aid oppose tools that claim to serve DA victims without proper infrastructure
- Victims of coercive control cannot negotiate freely — a financial negotiation tool is not a refuge
- Survivors DO plan finances in secret as part of exit preparation — universal privacy baseline serves them honestly

**Position:** Decouple is the complete settlement workspace for separating couples — finances, children, housing, legal documents. It is NOT a domestic abuse service. For V1, we signpost honestly and preserve autonomy rather than pretending capability we don't have.

**Universal baseline (all users, no flag required)**
- GOV.UK "Exit this page" component top-right on every screen → redirects to BBC News
- Neutral email subjects ("Your account has an update")
- No financial content in email body
- No push notifications by default
- Non-descript browser tab titles ("Dashboard" not "My divorce — Decouple")
- Pause account — archives state, hides from dashboard, user can return (never delete — evidence preserved)
- Safety & support resources in nav footer, always accessible

**Triggered response — when `relationship_quality = safety_concerns` OR `device_private = not_sure`**

Dedicated signposting screen before Moment 1 standard acknowledgement:

```
"Before we go further — something important"

"You told us there are safety concerns. We want to be honest
 about where we fit.

 Decouple helps separating couples build a complete settlement —
 finances, children, housing, and the path through to a legal
 agreement. It's not a domestic abuse service. For what you
 might be facing right now, these services are built for exactly
 that:

 Women's Aid — 0808 2000 247 (24/7)
 National Domestic Abuse Helpline — 0808 2000 247 (24/7)
 Men's Advice Line — 0808 8010 327
 Refuge — refuge.org.uk
 Surviving Economic Abuse — survivingeconomicabuse.org
 Samaritans — 116 123 (24/7)

 If you're in immediate danger, call 999.

 Decouple can still help once you're safe — building your
 picture privately, preparing the financial side, planning
 how to move forward. Come back when the time is right.

 What would you like to do?"

 [Continue — I'm safe to]
 [Exit to a safe site now]
 [Show me more support services]
```

Autonomy preserved — user can proceed. But we don't claim to be what we're not.

**Additional V1 baseline for flagged users**
- Direct-share to ex is OFF by default; active opt-in required with "double-check this is safe" warning
- Time-limited share links (7 days default)
- Account recovery via user-nominated phone number
- "Revoke access" one tap from any screen

**V1.5 / V2 backlog — nice-to-haves**

Captured here; to be cross-referenced into the v2-backlog.md:
- Coercive control behavioural detection (spec 47 Levels 1-3 — pressure-test spec 47 as part of V1.5 design)
- Mediator-routing as share default for flagged users
- Decoy mode / alternate bookmark labels / favicon swap
- Adaptive pacing (progress bar without count, check-in prompts, no time-pressure language)
- Coercive control evidence documentation affordance
- Fairness guardrails wired into proposal phase (flag extreme splits)
- IDVA letter integration for legal aid evidence
- Shared-device-specific features (shorter inactivity timeout, no browser storage, decoy mode)
- Adaptive safeguarding re-evaluation (gentle offer to update settings after no-sensitive-activity period)

**What this produces for V1:**
- Honest positioning — Decouple does not overclaim
- Universal privacy baseline covers exit-prep users without flags
- Clear signposting for flagged users to appropriate specialist services
- Autonomy preserved — users can proceed if they choose
- ~1 week of engineering vs months for full safeguarding architecture
- Foundation for V1.5 enrichment informed by real usage data and Women's Aid / SafeLives partnerships

**Why V1.5 is the right home for richer features:**
- Building coercive control detection creates a duty of care V1 infrastructure can't meet
- Usage data + specialist partnerships will inform richer second iteration
- Better than building speculatively without real signal
- V1.5 gives time to form the right partnerships (Women's Aid, SafeLives, Surviving Economic Abuse)

---

## Gap 7: Invited party (Mark) profiling variant — SPECCED, DECISIONS PARKED

**Status:** Design direction agreed. Five open decisions parked — to be revisited after user reconciles Claude AI Design prototype work and we do the joint stock-take.

### Core design direction (AGREED)

Mark is a **builder**, not a verifier. He has his own account, his own financial picture, his own AI plan. Shared context (children count, property type, joint accounts) is inherited from Sarah with correction rights — but every correction is captured as a **dispute item**, never silent overwrite. Joint items merge in the household picture; sole items live on each party's side. Safeguarding flags are per-party (Mark's own device privacy, relationship quality, safety concerns).

### Mark's journey outline

1. **Invitation link** → IN1 invited-party landing
2. **Abbreviated pre-signup** (IS1-IS6):
   - IS1: "Here's what we know so far" — inherited context (relationship status, cohabiting, children, property) with correction buttons. Corrections → dispute items.
   - IS2: Stage (Mark's own — may differ from Sarah's)
   - IS3: Your ex and safety (Mark's own view)
   - IS4: What you know about Sarah's finances (mirror of O5)
   - IS5-IS6: Priorities, worries (Mark's own — generates his own AI plan)
3. **IS-Plan**: Mark's own AI plan output (parallel to O7)
4. **IS-Next**: continue into workspace
5. **Moment 1 (Mark variant)**: Welcome acknowledging shared context + Mark's own flagged state
6. **Moment 2**: Mark's own pre-bank profiling (self-employment if flagged for him, joint mortgage confirmed, vehicles / pensions / accounts all fresh)
7. **Bank connection**: Mark's own banks — Sarah's data not visible to Mark
8. **Moment 3**: Section-by-section confirmation on Mark's bank data
   - Joint account recognition by sort code + account number — merge, not duplicate
   - Children section: light confirm if Sarah already did depth; Mark's view of care arrangements captured (possible dispute)
   - Housing transition HT1/HT2: Mark's own view
9. **Verification, pre-share completeness** (same as Sarah)
10. **Reconciliation flow** — where the two pictures meet
11. **Proposal phase** — Mark's own future needs; proposals negotiated together

### Shared context vs personal — reference

**Inherited from Sarah (Mark can correct, corrections = disputes):**
- Relationship status, cohabiting status, children count/names/ages, property type, joint mortgage provider, children's schools (from Sarah's Gap 3 capture)

**Mark answers fresh:**
- Stage, relationship quality, device privacy, self-employment, partner awareness (O5 inverted), priorities, worries, all of Moment 2, all of Moment 3 on his bank data, his future needs

### Edge cases covered in design

- Mark before Sarah ready to share
- Mark refuses to sign up → spec 47 non-engagement paths
- Mark finds Sarah-picture inaccuracies → reconciliation surfaces
- Mark self-employed (Sarah's not) → full P2 + Moment 3 business section
- Mark has children Sarah didn't mention → Mark-side additions
- Sarah pre-signup inaccuracies → reconciliation prompt
- Mark in safety_concerns (Sarah wasn't) → Mark gets signposting screen, his flags private
- Reconciliation asymmetry on trust levels visible to both (Gap 8)
- Invitation link expiry default 14 days
- Mark doesn't want to use platform → export Sarah's picture as PDF, go conventional

### FIVE OPEN DECISIONS — PARKED FOR RETURN

1. **IS1 (shared context confirmation) placement** — pre-signup screen vs inline on Moment 1. Current proposal: pre-signup (reduces friction by showing Mark how much work is done before account creation). **Needs decision.**

2. **Priorities/worries in IS5/IS6 vs inheriting from Sarah vs skipping** — current proposal: Mark answers his own, generates his own AI plan. Alternative: inherit Sarah's (assume similar), or skip for invited users. **Needs decision.**

3. **Invitation link expiry** — current proposal: 14 days default. Alternatives: 7 (shorter urgency) or 30 (longer runway). **Needs decision.**

4. **"Mark corrects Sarah" treatment** — current proposal: full dispute-capture on every correction. Alternative: silent merge for trivial items (misspellings, age off by 1), dispute only for material differences. **Needs decision.**

5. **AI plan output for Mark** — current proposal: same O7 structure with Mark's context. Alternative: lighter "you've been invited, here's what's ahead" summary. **Needs decision — weak opinion; suggest deferring until real user feedback.**

### What needs to happen before finalising Gap 7

- User to reconcile Claude AI Design prototype work with this direction (invited party onboarding screens may already have design thinking applied)
- Joint stock-take on session state (what's built, what's specced, clean-build decision)
- Decisions 1-5 above to be locked
- Then spec 68 (definitive post-signup profiling) writes up Gap 7 alongside gaps 1-12

---

Plus design debt items to revisit:
- Dashboard pressure test (spec 04) against latest thinking
- Welcome tour (4-panel carousel) design
- Distribution map as visual diagram (for flow tool)

---

## For the next session

**Read first:**
1. spec 65 (pre-signup interview — locked)
2. spec 67 (this document — distribution map + gaps 1-5)
3. spec 66 (original gaps list, now superseded for 1-5, still valid for 6-12)

**Next:** Gap 10 (pension depth)

**Remaining order:** 10 → 9 → 8 → 12 → 11 → 7 (invited party last, as it depends on the other variants being locked)

**Then:**
- Update spec 66 to mark all gaps resolved
- Write definitive post-signup profiling spec (spec 68 or update 34)
- Move on to Action 2 (Claude Design work capture)
