# Session 8 Handoff

**Date:** 2026-04-12
**Branch:** `claude/decouple-v2-workspace-fX7nK`
**Lines changed:** ~390 (docs only, no code changes)
**Type:** Planning/design session

---

## What happened

Session 8 was a planning session to design the bank-first journey redesign. Tink Open Banking was completed in session 7 — this session answers "now that we have bank data, how does the UX change?"

### Deliverable: Specs 20 + 21

**Spec 20 — Bank-First Journey** covers:
- Revised hero panel state machine with bank connect as primary action
- New State 1 wireframe: prominent bank connect card with FCA trust signals, secondary upload zone
- New State 5: targeted upload zone showing only the 3-4 specific gap documents needed
- Config flow amendments (connect CTA on summary screen)
- Lozenge system: two new states (Connected + Gap)
- Summary redesign: specific gap lists naming providers

**Spec 21 — Evidence Model** covers:
- Four-tier evidence classification: Proved / Inferred / Gap / Invisible
- Complete mapping of every Form E section to bank data signals
- Key finding: bank connection alone achieves Draft fidelity (income + spending + accounts)
- Only 3-4 document types needed to reach Evidenced: pension CETVs, property valuations, mortgage statements, payslips
- Gap analysis engine design: detection rules, priority ordering, provider-specific messages
- Section card evidence badges: Bank verified / Document / Estimate / Confirm?
- Revised fidelity thresholds: bank connection = Draft

## Key decisions

1. **Bank connect is the primary action, not upload.** The hero panel's default state leads with a prominent bank connect card. Upload is the secondary path. This inverts the current design.

2. **Bank connection alone = Draft fidelity.** A 12-month bank feed provides income, spending, and accounts — enough for a first mediation conversation. Previously Draft required uploading and processing PDF statements.

3. **Gap analysis is specific, not generic.** After bank data, the system tells users exactly which 3-4 documents they need, naming providers: "Pension CETV from Aviva" not "Upload pension details." This reframes upload from "gather 15 documents" to "fill 3-4 specific gaps."

4. **Four evidence tiers, not binary.** Proved (direct bank evidence), Inferred (strong signal, user confirms), Gap (document needed), Invisible (no signal). This drives UI decisions: proved items get "Bank verified" badges, inferred items get "Confirm?" prompts, gaps get specific upload requests.

5. **Lozenges become dynamic.** Currently generated from config answers (static). After bank connection, they're generated from bank data analysis — showing "Connected" accounts and "Gap" documents dynamically.

## What went well

- The planning brief in SESSION-CONTEXT.md was exceptionally detailed — the strategic analysis of Open Banking as evidence, the section-by-section mapping, and the specific questions to answer made the spec writing focused
- Splitting into two specs (journey + evidence model) keeps each focused and readable
- The evidence tier model (Proved/Inferred/Gap/Invisible) provides a clean framework for all downstream UI decisions

## What could improve

- The spec doesn't address multi-bank scenarios (user has Barclays + Monzo). State 5 could allow connecting additional banks before uploading documents.
- Credit card statements are in the gap list but Tink Open Banking covers credit cards too — the gap analysis should check if the credit card is already connected before flagging it.
- The config flow amendments are light — a future iteration could skip savings/debts/other config questions entirely when bank data can infer them.
