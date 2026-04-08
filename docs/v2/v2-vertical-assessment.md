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

1. "I uploaded a bank statement and it found all my accounts and balances automatically"
2. "I can see my entire financial picture on one screen — I've never had that before"
3. "It told me my pension CETV is still missing and exactly how to request it"
4. "I entered a rough estimate for the property and it flagged that I need a proper valuation"
5. "I can see exactly what's ready for disclosure and what still needs work"

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

## Launch implementation

V2 launch should include:

1. **Workspace shell** — phase bar, "Build your picture" as active phase
2. **Category-based sections** — matching Form E structure in user-friendly language
3. **Document upload** — drag and drop, multi-file, any format
4. **AI classification** — automatic document type detection
5. **AI extraction** — key values pulled from documents
6. **Review flow** — accept/edit/reject extracted values
7. **Manual entry** — add items without documents
8. **V1 data import** — populate from interview session values
9. **Completeness dashboard** — per-category and overall progress
10. **Gap identification** — what's missing, what to do about it
11. **CETV tracking** — log requests, reminders, guidance
12. **Evidence linking** — every item connected to its source
13. **Summary view** — structured financial picture overview

---

## Spike questions / unknowns

| Question | Impact | Status |
|----------|--------|--------|
| Which AI model for document extraction? | Accuracy, cost, speed | Open — test Claude Haiku vs specialised parsers |
| Open banking integration timing? | Feature richness, partnership dependency | Deferred — V2 enhancement, not launch |
| How granular should categories be? | UX complexity vs Form E alignment | Open — test user-friendly grouping vs Form E sections |
| How to handle joint vs individual accounts? | Data model, disclosure logic | Open — needs design |
| PDF parsing quality for UK bank statements? | Core feature reliability | Open — prototype with real documents |
| How to handle scanned/photographed documents? | Accessibility, extraction quality | Open — OCR layer needed |
| What's the right completeness threshold? | When to encourage V3 progression | Open — test with users |

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
| Key user stories | ✅ 9 stories |
| Key outcomes | ✅ 7 outcomes |
| North-star UX | ✅ Clear |
| Magic moments | ✅ 5 moments |
| Interaction model | ✅ Upload-first, review-by-exception |
| Technology opportunities | ✅ 8 mapped |
| Confidence/follow-up logic | ✅ Extended with evidence grounding |
| Launch implementation | ✅ 13 components |
| Spike questions | ✅ 7 identified |
| Trust/risk considerations | ✅ 7 with mitigations |
| Auth/conversion/monetisation | ✅ Paywall position defined |
| Enhancement path | ✅ 6 identified |
| Success metrics | ✅ Comprehensive |

**All 21 items complete.** Ready for concept design.
