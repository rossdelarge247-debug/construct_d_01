# Spec 48 — Adaptive Design: Complexity and Edge Cases

**Date:** 17 April 2026
**Purpose:** Design proposals for complexity that breaks the standard journey — undecided users, interim urgency, children arrangements, complex assets, and jurisdictional differences.

## 1. The "am I getting divorced?" user

**Signal:** User arrives but hasn't decided. Exploring options, not executing.

**Design response — the exploration mode:**

Replace the current "I'm getting divorced" arrival with a softer entry:

```
"What stage are you at?"

○ We've decided to separate — I want to get started
○ I'm thinking about separating — I want to understand what's involved
○ We're already in the process — I need help catching up
○ We've agreed everything — I just need the legal documents
```

Each answer gates a different starting experience:

| Answer | Experience |
|---|---|
| **Decided** | Full journey: profiling → bank → build → share |
| **Thinking about it** | Exploration mode: "Here's what divorce involves financially. Build a rough picture to see where you stand — no commitment, nothing shared." Lighter profiling, optional bank connection, output is "your financial snapshot" not "your disclosure." |
| **Already in process** | Fast-track: "Upload your existing Form E or enter your current figures. We'll structure it and help you move forward." Import-first, not build-from-scratch. |
| **Already agreed** | Phase 5 direct: "Enter your agreed terms. We'll generate the consent order and D81." Skip Phases 1-4 entirely. |

**Key principle:** The product meets people where they are, not where we want them to be.

**Where it fits:** Phase 1 (Start). The arrival screen becomes a router, not a gate.

---

## 2. Interim arrangements — the urgent stuff

**Signal:** User has just separated. Needs answers NOW about bills, mortgage, children this weekend — not a 3-month settlement process.

**Design response — the "right now" layer:**

Before or alongside the full settlement journey, offer an interim arrangements module:

```
"Before we build the full picture, let's sort out
 the immediate stuff."

 Right now:
 ○ Who's paying the mortgage/rent?
 ○ Who's paying the bills?
 ○ Where are the children this week?
 ○ Can I access the joint account?
 ○ Does someone need to move out?
```

Each generates a structured interim agreement — not legally binding but clear and documented:

```
INTERIM ARRANGEMENT (agreed [date])

Mortgage: Mark continues paying from joint account
Bills: Split — Sarah pays utilities, Mark pays council tax
Children: With Sarah Mon-Fri, with Mark Sat-Sun
Joint account: Both retain access, major purchases (>£500) discussed first
Housing: Mark moves to temporary accommodation by [date]

This is a working agreement, not a legal order.
If you can't agree, a mediator can help.
```

**Where it fits:** Phase 1 (Start) — as a pre-journey module. Urgent users get immediate value. They might return for the full journey weeks or months later.

**Why it matters:** People don't arrive at the product thinking "I need a consent order." They arrive thinking "my partner left and I don't know who's paying the mortgage tomorrow." If we don't serve this moment, we lose them before they're ready for disclosure.

---

## 3. Children arrangements — full design

**Signal:** Profiling indicates children. The settlement needs children arrangements, not just child maintenance.

**Design response — the children section, expanded:**

### In Phase 2 (Build): capture current and desired arrangements

```
CURRENT ARRANGEMENTS
"What's happening now with the children?"

○ They live with me full-time
○ They live with my ex full-time
○ We share roughly equally
○ We haven't settled this yet
○ It's complicated — I need help

Contact pattern now:
○ Every other weekend with [parent]
○ Midweek overnights
○ No regular pattern yet
○ Supervised contact
○ No contact currently
```

### In Phase 4 (Propose): structured children proposal

```
PROPOSED ARRANGEMENTS

Living arrangements:
○ Primary home with [Sarah], contact with [Mark]
○ Primary home with [Mark], contact with [Sarah]
○ Shared care (roughly equal time)
○ Other [describe]

Contact schedule:
Select a pattern:
○ Every other weekend (Fri-Sun)
○ Every other weekend + 1 midweek evening
○ Shared: week on / week off
○ Shared: 2-2-3 rotation
○ Custom [build your own]

Holidays:
○ Split school holidays equally
○ Alternate Christmas/Easter each year
○ Custom [describe]

Handover arrangements:
○ School drop-off/pick-up (avoids direct handover)
○ Direct handover at [location]
○ Other

Special occasions:
○ Birthdays: children choose / alternate / both attend
○ Other

Who decides about:
  School choices    ○ Both jointly  ○ Primary carer  ○ Other
  Medical decisions ○ Both jointly  ○ Primary carer  ○ Other
  Religious matters ○ Both jointly  ○ Primary carer  ○ Other
  Travel abroad     ○ Both consent needed  ○ Primary carer decides
```

### In Phase 5 (Finalise): generates Statement of Arrangements

The children section generates a separate Statement of Arrangements or children clauses within the consent order — depending on what's needed.

**Where it fits:** Sections in Phase 2, 3 (reconciliation of children arrangements), 4 (proposals), and 5 (document generation). Children flow through the entire journey, not bolted on.

---

## 4. Complex assets — detection and routing

**Signal:** Profiling or bank data indicates complexity beyond the standard path.

**Design response — complexity detector with routing:**

| Complexity signal | How detected | Product response |
|---|---|---|
| **Business ownership** | Profiling Q2: self-employed/director | Enhanced self-employed path (spec 34): company name, salary vs dividends, DLA, business valuation question |
| **Multiple properties** | Profiling Q1 follow-up or bank signals (2+ mortgage payments) | Per-property card in the document. Each with value, mortgage, ownership, tenant status. |
| **Overseas property** | Profiling or user declaration | Flag: "Overseas property may have tax implications (CGT, jurisdiction). We recommend a solicitor reviews this item." Route to Tier 2. |
| **Trust structures** | Profiling Q6 or user declaration | Flag: "Trusts are complex for disclosure. We'll capture the basics, but a solicitor should review." Route to Tier 3. |
| **Pre-marital assets** | Timestamp on asset (acquired before marriage date) | Add ownership tag option: "Pre-marital." Surface in document with note: "Pre-marital assets may be treated differently." |
| **Inherited assets** | User declaration | Add ownership tag: "Inherited." Note: "Inherited assets are often treated differently, especially if kept separate from joint finances." |
| **Shared ownership** | Profiling Q1 follow-up: shared ownership scheme | Capture ownership percentage, housing association details. Document includes shared ownership equity calculation. |
| **Help to Buy** | Profiling Q1 follow-up | Capture Help to Buy loan balance. Three-way equity calculation (your share, mortgage, HTB loan). |
| **High-value business** | Self-employed + high turnover signals | "Business valuations for divorce can be complex. We'll capture the basics. For businesses worth >£100k, a professional valuation is recommended." |

### The three routing tiers

```
Tier 1 (standard — 60%):
Product handles everything. Consent order auto-generated.

Tier 2 (moderate complexity — 25%):
Product handles disclosure + negotiation. Flags specific items
for professional review. "We recommend a solicitor reviews your
overseas property and pension sharing before submission."

Tier 3 (high complexity — 15%):
Product handles disclosure (the data is still useful). Flags that
professional handling is needed. "Your situation includes trusts
and overseas assets. We recommend a solicitor handles the consent
order. Here's your complete disclosure to give them — it'll save
them 15+ hours."
```

**Key principle:** Never refuse a user. Always be useful. Even Tier 3 users get value (structured disclosure saves their solicitor time and them money). But be honest about what needs professional input.

**Where it fits:** Complexity is detected in Phase 1 (profiling) and Phase 2 (bank signals). Routing decision surfaces at Phase 5 (when generating documents) or earlier if the user asks.

---

## 5. Jurisdictional differences

**Signal:** User is in Scotland, Northern Ireland, or has cross-border elements.

**Design response:**

### Scotland
Different law entirely (Family Law (Scotland) Act 1985). Key differences:
- Matrimonial property only (not all property)
- Fair sharing principle (not needs-based like England)
- No spousal maintenance concept — "periodical allowance" is rare
- Different pension sharing rules

**Product response:** Profiling asks location. If Scotland:
- Adapt document sections (matrimonial vs non-matrimonial tags)
- Adjust system context ("In Scotland, fair sharing typically means equal division of matrimonial property")
- Generate appropriate legal documents (Minute of Agreement, not consent order)
- Flag: "Scottish family law differs from English law. Some features are adapted for your jurisdiction."

### Northern Ireland
Similar to England/Wales but different court system and some procedural differences.

### Cross-border
User in England, property in Scotland, pension in Channel Islands. Genuinely complex.
- Flag: "Your situation spans jurisdictions. We recommend professional advice on which jurisdiction applies."
- Route to Tier 2/3.

**Where it fits:** Phase 1 (profiling — location question). Adapts document structure and system context throughout.

---

## 6. The "already agreed" fast-track

**Signal:** User selects "We've agreed everything — I just need the legal documents" at arrival.

**Design response:**

Skip Phases 1-4 entirely. Go straight to structured data entry for the agreement:

```
"Enter your agreed terms"

For each section:
  Property: [what you agreed]
  Pensions: [what you agreed]
  Savings: [what you agreed]
  Children: [what you agreed]
  Maintenance: [what you agreed]

Both parties confirm the terms online.

→ Generate consent order + D81
→ Pre-flight check
→ Submit
```

This serves:
- Couples who agreed verbally / through mediation but need the paperwork
- Couples who used a mediator and have an MoU but need the consent order
- The ~25% "already aligned" segment who just need the legal wrapper

**Where it fits:** Phase 1 router sends them directly to Phase 5 with a structured input step.

---

## Summary: the adaptive product

The product isn't one rigid journey. It's a system that adapts:

| User situation | Product adapts to |
|---|---|
| Undecided | Exploration mode — rough picture, no commitment |
| Just separated | Interim arrangements first, full journey later |
| Standard case | Full six-phase journey |
| Complex assets | Detection + routing to appropriate tier |
| Already agreed | Fast-track to document generation |
| Scotland/NI | Jurisdiction-adapted sections + legal docs |
| Children involved | Full children section throughout the journey |

The arrival screen is a router. The journey flexes. The document adapts its structure. The output adapts its tier. But the spine — one document, growing through phases — stays the same.
