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

## Gaps 6-12 — PENDING (next session)

| Gap | Short description |
|---|---|
| 6 | Self-employed details — sequencing (what's Moment 2 vs Moment 3) |
| 7 | Invited party (Mark) profiling variant |
| 8 | Verification opt-in placement |
| 9 | Account structure capture |
| 10 | Pension depth — DB vs DC, CETV status |
| 11 | Safeguarding carry-through |
| 12 | Reverse partner awareness |

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

**Start with:** Gap 6 (self-employed details sequencing)

**Following order:** 6 → 10 → 9 → 8 → 12 → 11 → 7 (invited party last, as it depends on the other variants being locked)

**Then:**
- Update spec 66 to mark all gaps resolved
- Write definitive post-signup profiling spec (spec 68 or update 34)
- Move on to Action 2 (Claude Design work capture)
