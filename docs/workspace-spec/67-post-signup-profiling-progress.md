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

## Gap 8: Verification opt-in placement — PENDING

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
