# V2 Vertical Planning Standard Assessment

Vertical 2: Financial Picture + Evidence Layer

---

## User problem

I need to build a complete, organised, evidence-backed picture of my financial situation — income, property, pensions, savings, debts, obligations — so I can understand where I stand, prepare for disclosure, and negotiate from a position of clarity. I don't want to wrestle with spreadsheets, 28-page forms, or pay a solicitor hundreds of pounds per hour to organise my paperwork.

---

## Desk research base

**Status: ✅ Complete.** V1 broad research plus V2-specific deep dive conducted April 2026.

### Form E structure
Form E has 5 main parts, ~20 sub-sections:
- Part 1: Background (personal, relationship, children)
- Part 2: Financial details
  - 2.1-2.3: Property (owned, beneficial interest, personal contents)
  - 2.4: Bank accounts (12 months statements per account)
  - 2.5: Investments (ISAs, shares, bonds)
  - 2.6: Life insurance / endowments
  - 2.7: Pensions (CETVs required)
  - 2.8: Business interests
  - 2.9: Other assets (over £500)
  - 2.10: Liabilities (debts, loans, credit cards)
  - 2.11: Income (employment, self-employment, benefits)
  - 2.12: Expenditure
  - 2.13: Standard of living
- Part 3: Needs (housing, income requirements)
- Part 4: Narrative (changes, explanations)
- Part 5: Orders sought

### Document checklist (what people need to gather)
- 12 months bank statements per account (all accounts)
- 3 months payslips
- P60 / tax returns (last 2 years)
- Pension CETV letters (each scheme — takes 4-12 weeks, NHS/public sector longer)
- Property valuation (chartered surveyor or 3 estate agent estimates)
- Mortgage redemption statement
- Savings/investment statements
- Insurance/endowment documents
- Business accounts (if self-employed)
- Credit card / loan statements

### Key findings from research
- **40% of divorce cases have no legal representation** on either side (96% increase since 2016)
- **Pension CETVs are the biggest bottleneck** — 4-12 weeks private, months for public sector. NHS suspended CETVs entirely in 2023.
- **Common Form E mistakes**: providing 1 month not 12 months bank statements, missing pensions, guessing figures, improper redaction, not explaining departures from equality
- **Brown v Brown [2024]**: 19-day custodial sentence for persistent non-disclosure — stakes are real
- **Armalytix**: FCA-regulated fintech providing 12-month transaction summaries via open banking for Form E. Already used in family law.
- **AI extraction accuracy**: bank statements 95-99%, payslips 99%, pension letters — gap (no specialised tool)
- **LEAP software**: has integrated Form E app for solicitors (not consumer-facing)
- **NFM (National Family Mediation)**: uses simplified "Financial Mediation Pack" that mirrors Form E in plain language, producing an "Open Financial Statement"
- **No consumer tool exists** that guides users through building a complete financial picture with document support

---

## As-is journey snapshot

1. Realise they need to gather financial documents
2. Not know what documents, from where, how many months
3. Start requesting statements from banks, pension providers, mortgage lender
4. Wait weeks/months for pension CETVs
5. Receive documents in various formats (PDF, paper, online)
6. Try to make sense of it — manually entering into spreadsheets
7. Attempt Form E sections, get stuck on complexity
8. Realise they've missed things (pensions, partner's details, debts)
9. Either pay solicitor to organise or struggle through alone
10. End up with incomplete, poorly-structured financial picture

---

## Pain points

| Pain point | Description | How V2 addresses it |
|-----------|-------------|-------------------|
| Don't know what to gather | No clear checklist tied to their situation | Guided document checklist derived from their V1 profile |
| Document chaos | PDFs, photos, paper, different portals | Upload anything → we classify, extract, organise |
| Manual data entry | Copying numbers into spreadsheets | AI extraction from documents, review by exception |
| No structure | Everyone invents their own format | Form E-aligned categories, structured items |
| Pension complexity | CETVs take months, values misunderstood | Track CETV requests, explain CETV vs real value, flag timing |
| Incomplete picture | Don't know what they don't know | System tracks completeness, surfaces gaps, recommends next actions |
| Confidence uncertainty | What's confirmed vs estimated vs unknown | Confidence states on every item, linked to evidence |
| Cost of solicitor for admin | £200-500/hr to organise information | User does it with AI help, solicitor cost saved |
| Emotional burden of financial admin | "The worst tax return imaginable" | Calm UX, progressive disclosure, upload → we do the work |
| Partner's finances unknown | Only know one side | Explicit handling of "partner's" items, mark as unknown, resolve later |
| Open banking opportunity | Banks hold 12+ months transaction data | Potential Armalytix integration for instant bank statement equivalent |

---

## Opportunities

| Opportunity | Description |
|------------|------------|
| First consumer Form E tool | Nobody has built this — massive gap |
| Upload → extract → review | Technology-maximised, not form-filling |
| Confidence-tracked financial items | Honest about what's known vs estimated |
| Evidence linked to every claim | Every financial item traceable to a document |
| Completeness tracking | Visual progress toward disclosure-readiness |
| Guided document checklist | Tell people exactly what to gather and why |
| Pension CETV tracking | Track requests, explain values, flag timing |
| Open banking integration path | Armalytix partnership for instant bank data |
| Cost saving vs solicitor | Position as "what your solicitor would charge £2k+ to organise" |
| Basis for V3-V5 | The structured data powers everything that follows |

---

## Why this vertical exists

Without a structured financial picture, users cannot:
- Prepare for disclosure (V3)
- Share meaningfully with the other party (V4)
- Negotiate from an informed position (V4)
- Know whether a proposed settlement is fair (V4)
- Prepare consent order data (V5)

V2 is the operational foundation of the entire service. Everything downstream depends on it.

---

## Downstream value

V2 data feeds every subsequent vertical:

- **V3**: Financial items → Form E sections. Evidence → supporting documents. Confidence → what's disclosure-ready vs needs work.
- **V4**: Items → proposal building blocks. Values → negotiation positions. Gaps → open questions for other party.
- **V5**: Full picture → consent order content. Items → D81 data. Evidence → disclosure pack.

---

## User states entering V2

| State | Description | V2 handling |
|-------|-------------|-------------|
| Fresh from V1 | Has plan, pathway, confidence map, maybe some values | Pre-populate from V1 data, show what's already captured |
| Document-ready | Has already gathered documents, ready to upload | Fast track: upload → extract → review |
| Document-light | Few or no documents yet | Guide: checklist of what to gather, manual entry for now |
| One-sided knowledge | Knows own finances, not partner's | Handle partner's items as separate section, mark unknown |
| Overwhelmed | Emotionally struggling with financial admin | Extra calm UX, smaller steps, reassurance, progress celebration |

---

## Key user stories

1. As someone building my financial picture, I want to upload documents and have the system extract the numbers so I don't have to type everything manually
2. As someone who doesn't know what documents I need, I want a clear checklist tailored to my situation
3. As someone tracking my pension, I want to log that I've requested a CETV and be reminded to follow up
4. As someone who knows some things and not others, I want to mark items as known, estimated, or unknown without being blocked
5. As someone worried about completeness, I want to see how close I am to having a full picture
6. As someone who can't access partner's financial information, I want to record what I know and flag what's missing
7. As someone who entered values in V1, I want those to appear already and let me add evidence and detail
8. As someone preparing for mediation, I want a structured summary I can share or print
9. As someone concerned about cost, I want to do the organisation myself instead of paying a solicitor
10. As someone with a self-employed partner, I want the system to flag that their declared income might not reflect reality
11. As someone with multiple bank accounts, I want to upload statements for all of them and have them organised separately
12. As someone who inherited a property, I want to flag this so it's treated correctly in settlement discussions
13. As someone uploading many documents, I want to drop them all at once and come back when they're processed
14. As someone whose financial situation is changing, I want to update values and see the history of changes
15. As someone nearing disclosure readiness, I want a literal checklist of what's still missing

---

## Key outcomes

By the end of V2, the user should have:

1. A structured financial picture organised by Form E-equivalent categories
2. Evidence documents uploaded, classified, and linked to financial items
3. Key values extracted from documents and confirmed by the user
4. Clear visibility of what's complete, what's estimated, and what's missing
5. A guided path for items that need external action (CETV requests, valuations)
6. Enough structure to begin disclosure preparation (V3)
7. A sense of "I'm on top of this" — control instead of chaos

---

## North-star UX

A user arrives with a pile of documents and fragmented knowledge. Within a few sessions, they have a clean, structured financial picture — every item categorised, valued, and linked to evidence. They can see exactly what's complete and what's missing. The system did the heavy lifting. It feels like having a brilliant, tireless assistant who reads every document, organises everything, and tells you what's still needed.

---

## Magic moments

1. "I uploaded a bank statement and it found all my accounts, balances, and categorised my spending automatically"
2. "I can see my entire financial picture on one screen — I've never had that before"
3. "It told me my pension CETV is still missing and exactly how to request it"
4. "It detected a joint account and split it automatically — I just had to confirm"
5. "It calculated my monthly outgoings across 10 categories from 12 months of statements"
6. "It showed me a projected post-separation budget and flagged that I might need child maintenance"
7. "I can see exactly what's ready for disclosure and what still needs work — four clear levels"
8. "The children's arrangements section let me plan Christmas and birthdays — things I hadn't even thought about yet"

---

## Interaction model

**The workspace "Build your picture" phase.** This is the first phase users enter after saving their workspace. The primary activity: building out financial items by uploading documents or entering manually, section by section.

The interaction should be:
- **Upload-first** — "Drop anything here" is always the primary action
- **Section-guided** — categories (income, property, pensions, etc.) provide structure but don't force linear completion
- **Review by exception** — system extracts, user confirms. Not data entry.
- **Progress-visible** — completeness per category, overall readiness
- **Always skippable** — no dead ends, unknowns are valid

---

## Technology opportunities

| Opportunity | Technology | V2 implementation |
|------------|-----------|------------------|
| Document classification | AI (Claude/Haiku) | Classify upload as bank statement, payslip, pension letter, etc. |
| Value extraction | AI (Claude) + parsers | Extract key values from documents into structured fields |
| Bank statement parsing | Specialised parsers + AI | Transaction categorisation, balance extraction |
| Open banking | Armalytix partnership | Instant 12-month bank data (future enhancement) |
| Completeness scoring | Rules engine | Track which Form E sections have sufficient data |
| Gap identification | Rules + AI | Compare what's captured vs what's needed for disclosure |
| Pension tracking | Workflow | CETV request tracking with reminders and guidance |
| Evidence linking | Data model | Every financial item linked to source documents |

---

## Confidence/follow-up logic in V2

V2 deepens the confidence model from V1:

**Confidence states** remain: Known, Estimated, Unknown

**V2 adds evidence grounding:**
- Known + document = strongest position (green)
- Known + no document = needs evidence (amber)
- Estimated + document = needs review (amber)
- Estimated + no document = weakest known position (amber)
- Unknown = gap to address (grey)

**Follow-up states** become more operational:
- Fine for now → item is sufficient for current phase
- Needs evidence → value entered but no supporting document
- Needs confirmation → extracted value not yet reviewed
- Needs external action → CETV requested, valuation needed, etc.
- Ready for disclosure → item is complete with evidence

---

## Design principles

1. **User-friendly surface, Form E underneath** — plain language categories, Form E mapping internal
2. **Upload-first, review-by-exception** — system does work, user confirms
3. **Ownership on every item** — Yours / Joint / Partner's / Unknown — auto-detected where possible
4. **Joint items show notional share** — full value visible, 50% default, editable 0-100% for negotiation
5. **Distribution tracks over time** — "Original 50/50 → Proposal 60/40 → Agreed 58/42"
6. **Four-tier readiness** — first draft (share with mediator) → disclosure (exchange) → final draft (minor items outstanding) → formalisation (locked)
7. **Every transaction categorised and mapped** — ~10 groups, drillable sub-categories, monthly averages
8. **Post-separation budget projection** — AI-guided when current picture sufficient
9. **Maintenance intelligence** — CMS estimates, spousal maintenance flags, based on captured data
10. **Children depth is user's choice** — lightweight default, deeper path with week planner, holidays, birthdays, special occasions
11. **Feedback loop** — corrections improve extraction over time
12. **Respondent pre-population** — joint items carry over when partner joins in V4
13. **Self-employment handled pragmatically** — capture business details, accounts, tax returns, flag income vs profit discrepancy, SIPP contributions, signal when forensic accountant needed. Don't attempt business valuation.
14. **Inherited and pre-marital assets flagged** — ownership tag extended with "Inherited" and "Pre-marital" markers, as courts may treat these differently
15. **Multiple items per category** — support multiple properties, multiple pensions, multiple bank accounts. Not just one per type.
16. **Date sensitivity on values** — every value has an "as at" date. System flags stale data ("This balance is 6 months old — do you have a more recent statement?")
17. **Document versioning** — newer documents for the same account/asset supersede older ones, with history preserved
18. **Inconsistency detection** — AI flags mismatches (income vs deposits, outgoings vs income, duplicate items)
19. **"What do I still need?" checklist** — literal actionable list of outstanding documents, separate from readiness dashboard
20. **Async document processing** — upload in bulk, leave, come back. Notifications when extraction complete.
21. **Safeguarding continuity** — soft check-ins from V1 safeguarding flags carried into V2
22. **Disputed values supported** — data model supports two values on same item (yours and partner's) for V4 negotiation
23. **Come and go** — designed for interrupted sessions. Nobody completes this in one sitting. Remember where they left off, show what's done at a glance, never guilt for not finishing, celebrate what's been added.
24. **No onboarding dependency** — V2 builds the workspace. Onboarding, billing, and first-run tour are V1.5 (built after V2 exists).

---

## Launch implementation

V2 launch should include:

1. **Workspace shell** — phase bar, timeline, "Build your picture" as active phase
2. **Category-based sections** — user-friendly language mapping to Form E structure:
   - Income (employment, self-employment, benefits) → Form E 2.11
   - Property (homes, land) → Form E 2.1-2.3
   - Bank accounts & savings → Form E 2.4
   - Investments (ISAs, shares, bonds) → Form E 2.5
   - Pensions → Form E 2.7
   - Debts & liabilities → Form E 2.10
   - Outgoings / expenditure → Form E 2.12
   - Other assets (vehicles, valuables, crypto, digital) → Form E 2.9
   - Life insurance & endowments → Form E 2.6
   - Self-employment & business interests → Form E 2.8
   - Standard of living narrative → Form E 2.13
   - Significant changes & expectations (inheritance, redundancy, health) → Form E Part 4
   - Children's arrangements (optional depth)
3. **Document upload** — drag and drop, multi-file, any format, low-quality guidance
4. **AI classification** — Haiku classifies document type automatically
5. **AI extraction** — Sonnet extracts key values, transactions, categories
6. **Transaction categorisation** — auto-assign to expenditure groups, monthly averages
7. **Ownership detection** — auto-detect joint/individual from documents, user confirms
8. **Review flow** — accept/edit/reject extracted values, ownership tags
9. **Manual entry** — add items without documents, estimates accepted
10. **V1 data import** — pre-populate from interview session values and confidence map
11. **Four-tier readiness dashboard** — visual progress toward each tier
12. **Gap identification** — what's missing per category, guidance on what to do
13. **CETV tracking** — log requests, reminders, explain CETV vs real value
14. **Evidence linking** — every item connected to source documents
15. **Post-separation budget** — prompted when current picture sufficient, AI projections
16. **Maintenance intelligence** — CMS estimate, spousal maintenance flag based on income data
17. **Children detail path** — optional deeper section (week planner, holidays, birthdays, occasions)
18. **Summary view** — structured financial picture overview, shareable, printable

---

## Spike questions / unknowns

| Question | Impact | Status |
|----------|--------|--------|
| Which AI model for document extraction? | Accuracy, cost, speed | **Resolved** — Haiku for classification, Sonnet for extraction |
| Open banking integration timing? | Feature richness, partnership dependency | **Resolved** — deferred. PDF upload + AI extraction for launch. Open banking as enhancement when user volume justifies |
| How granular should categories be? | UX complexity vs Form E alignment | **Resolved** — user-friendly surface (~10 groups), Form E structure underneath, drillable sub-categories |
| How to handle joint vs individual accounts? | Data model, disclosure logic | **Resolved** — ownership tag (Yours/Joint/Partner's/Unknown), auto-detect from documents, joint items show 50% notional share default, distribution editable 0-100% for negotiation tracking |
| PDF parsing quality for UK bank statements? | Core feature reliability | Open — prototype with real documents. Feedback loop from corrections to improve over time |
| How to handle scanned/photographed documents? | Accessibility, extraction quality | **Resolved** — accept all, flag low confidence, offer guidance for better results, manual entry fallback |
| What's the right completeness threshold? | When to encourage V3 progression | **Resolved** — four-tier readiness: first draft → disclosure → final draft → formalisation ready |
| Children's arrangements depth? | UX scope | **Resolved** — lightweight default, optional deeper path including typical week, holidays, birthdays/Christmas, special occasions |
| Post-separation budget projection? | Feature scope | **Resolved** — included in V2, prompted when current picture sufficient, AI-guided with maintenance intelligence |
| Maintenance intelligence? | AI complexity, legal sensitivity | **Resolved** — CMS estimate from income data, spousal maintenance flagged on income disparity, framed as estimates not advice |
| Variable asset distribution? | Data model, negotiation tracking | **Resolved** — every shared item has editable split (0-100), tracks changes over time for negotiation history |
| Self-employment handling? | Scope, accuracy, liability | **Resolved** — capture business details/accounts/tax returns, flag income vs profit, SIPP contributions. Don't attempt valuation. Recommend specialist. |
| Multiple properties / complex assets? | Data model | **Resolved** — support multiple items per category, inherited/pre-marital flags |
| Document versioning? | Data integrity | **Resolved** — newer supersedes older, history preserved |
| Disputed values in negotiation? | Data model, V4 dependency | **Resolved** — support two values per item (yours + partner's) from V2 data model |

---

## Trust/risk considerations

| Risk | Mitigation |
|------|-----------|
| Incorrect extraction | All extracted values require user review/confirmation before being treated as final |
| Sensitive financial data security | Encrypted storage, RLS, no data shared without explicit consent |
| User enters wrong values | System flags inconsistencies (income vs expenditure, values vs evidence) |
| Documents contain sensitive info beyond finances | Document storage encrypted, classification helps route appropriately |
| Overconfidence in AI output | Always show source document alongside extracted value, never auto-finalise |
| Missing items user doesn't know about | Completeness checklist based on Form E requirements surfaces likely gaps |
| Brown v Brown precedent | Emphasise that disclosure must be complete and accurate — explain consequences |
| Data accuracy liability | Clear: user is responsible for accuracy of their disclosure, not the service. We organise, not verify |
| Partial disclosure risk | System actively asks "Do you have any other accounts not shown here?" — not just passive gap tracking |
| Safeguarding continuity | V1 flags carried into V2. Periodic soft check-in: "Has anything changed in your safety situation?" |
| Self-employment complexity | Capture and structure available data, flag issues, but explicitly recommend specialist for business valuation |
| Stale data risk | "As at" dates on values, flag data older than 3 months, prompt for updated statements |

---

## Auth/conversion/monetisation implications

V2 is the first paid vertical. The paywall sits at the workspace entry:

- **Free**: V1 guided interview + pathway + plan + PDF download + workspace save
- **Paid (Standard)**: V2 onwards — building the full picture, document upload, extraction, completeness tracking

The transition should feel like a natural continuation, not a hard gate:
- User saves workspace from V1
- Enters workspace for the first time
- Sees "Build your picture" as the active phase
- Sees V1 data already populated
- Tries to upload a document or add detail → paywall prompt
- Positioned as: "Continue building with the full service"

---

## Enhancement path

| Enhancement | When | Dependency |
|------------|------|-----------|
| Open banking via Armalytix | Post-V2 launch | Partnership, FCA considerations |
| Deeper pension analysis (PODE-level insight) | V3+ | Domain expertise, actuary integration |
| Expenditure tracking / budgeting for two households | V2 enhancement | User demand signal |
| Property valuation integration (Zoopla/Rightmove API) | V2 enhancement | API access |
| Self-employment / business asset handling | V2 enhancement | Complexity assessment |
| Multi-currency assets | V2 enhancement | User demand signal |

---

## Success metrics

**Product metrics:**
- First document upload rate (within session 1)
- Documents uploaded per user
- Extraction acceptance rate (accept vs edit vs reject)
- Financial items per case (completeness proxy)
- Categories with at least one item
- Confidence state distribution (known vs estimated vs unknown)
- Evidence linking rate (items with documents vs without)
- Completeness score progression over time
- Time from workspace entry to "disclosure-ready" threshold

**User-value metrics:**
- Self-reported organisation improvement
- Time spent vs equivalent solicitor cost
- Completeness at point of V3 entry

**Strategic metrics:**
- Conversion rate from free (V1) to paid (V2)
- Retention through V2 (do people complete the picture?)
- Drop-off points within V2
- Which categories are hardest / most abandoned

---

## Overall assessment

| Planning standard item | Status |
|-----------------------|--------|
| User problem | ✅ Well-defined |
| Desk research base | ✅ Complete (Form E structure, document checklist, Armalytix, AI extraction, user pain) |
| As-is journey snapshot | ✅ Documented across 10 steps |
| Pain points | ✅ 11 identified with V2 responses |
| Opportunities | ✅ 10 identified including first consumer Form E tool |
| Why this vertical exists | ✅ Foundation for V3-V5 |
| Downstream value | ✅ Explicit data flow to V3, V4, V5 |
| User states | ✅ 5 states with handling |
| Key user stories | ✅ 15 stories |
| Key outcomes | ✅ 7 outcomes |
| North-star UX | ✅ Clear |
| Magic moments | ✅ 8 moments |
| Interaction model | ✅ Upload-first, review-by-exception |
| Technology opportunities | ✅ 8 mapped |
| Confidence/follow-up logic | ✅ Extended with evidence grounding |
| Launch implementation | ✅ 18 components + self-employment + life insurance |
| Spike questions | ✅ 15 (11 resolved, 1 open) |
| Trust/risk considerations | ✅ 12 with mitigations |
| Auth/conversion/monetisation | ✅ Paywall position defined |
| Enhancement path | ✅ 6 identified |
| Success metrics | ✅ Comprehensive |

**All 21 items complete.** Pressure-tested against full Form E structure, real-world scenarios (self-employment, inheritance, multiple properties, overseas assets, crypto), process edge cases (document versioning, stale data, disputed values, bulk upload), and AI intelligence opportunities (inconsistency detection, duplicate detection, temporal analysis). Ready for concept design.
