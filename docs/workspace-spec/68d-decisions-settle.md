# Spec 68d — Settle Phase Decisions Locked

**Date:** 21 April 2026
**Parent:** spec 68 (synthesis hub)
**Scope:** Decisions for the Settle phase — proposal drafting, AI coach, counter-proposal response, settlement progress board, and the agreed-and-signed artefact.

---

## S-D Settlement proposal document

**S-D1 Proposal renders as a document — LOCKED.**
Same three-column shell as Sarah's Picture and Our Household Picture. Legal-document styling. Seven §-numbered sections (one per settlement area — may vary by case, see S-D3).

**S-D2 Doc title + states — LOCKED.**
- Draft: *"Your settlement proposal · V1 · DRAFT"*, body heading *"My opening position"*
- Ready to send (pre-send review): *"Your settlement proposal · V1 · READY TO SEND"*, body heading *"Read over your proposal. Then send it when you're ready."*
- Counter received: *"Mark's counter-proposal · V2 · N TO RESPOND"*
- Settlement progress: *"Settlement progress · Vn · {X of Y agreed}"*
- Agreed: *"Settlement agreement · V5 · AGREED"* + lock icon + "SIGNED · FINAL" chip

**S-D3 Section set — LOCKED (core) / VARIABLE (per case).**
Core sections: The home · Pensions · Savings · Vehicles · Debts · Children · Spousal maintenance. Cases with business, housing transition, or other assets add conditional sections. Sections in the proposal mirror the ES2 structure applied in Build / Reconcile.

**S-D4 Autosave + last-saved stamp — LOCKED.**
*"Autosaved · 2 min ago"* in top bar. Continuous persistence; no explicit save button while drafting.

---

## S-R Running split dashboard

**S-R1 Running split banner at top of draft — LOCKED.**
Above the first section. Template: *"RUNNING SPLIT · DRAFT · Sarah 70% £311,472 · Mark 30% £132,000"* with progress bar visualisation. Updates as sections are drafted.

**S-R2 Totals alongside — LOCKED.**
*"6/7 drafted · Total net £443k"* — confirms scope of what's proposed and remaining sections.

**S-R3 Post-send banner — LOCKED.**
Review state shows *"UNDER THIS PROPOSAL · Sarah 73% · Mark 27% · Total net household £443,472"*. Once sent, this header carries into Mark's view.

---

## S-P Proposal option cards

**S-P1 Each section offers option cards — LOCKED.**
Per-section, the proposal surface is a set of radio-like option cards. User selects one to populate the proposal section.

**S-P2 Option card structure — LOCKED.**
- Title (e.g. *"Sell the home, split equity 50/50"*)
- Sarah's £ impact (S avatar + +£115,000)
- Mark's £ impact (M avatar + +£115,000)
- One-line descriptor (*"Clean break · neither keeps the family home"*)
- Optional secondary note (e.g. *"Requires Sarah to refinance · £230k mortgage capacity"*)
- Radio control with selected-state highlight

**S-P3 Option examples (property) — LOCKED as reference set.**
Sell + split 50/50 · Sarah keeps + buys out Mark's share · Mark keeps + buys out Sarah's share · Defer sale until youngest child is 18 (Mesher order). AI may surface additional options based on case.

**S-P4 Summary context line above options — LOCKED.**
Brief AI-generated situational framing. Example: *"Halifax mortgage £220k on £450k valuation"*. Grounds the option evaluation in the agreed facts.

**S-P5 Custom / free-text fallback — OPEN (see 68f S-2).**
Whether user can write their own option outside the presented set. Lean: yes, with warning that the AI coach's reasonableness check applies.

---

## S-A AI coach right rail

**S-A1 Right rail tabs — LOCKED.**
Three tabs: **Comments** · **AI coach** · **Activity**. AI coach default in Settle phase.

**S-A2 Coach card taxonomy — LOCKED.**
Four card types (per 68a C-A2):
- **Court reasonableness** (red flag if risk — e.g. *"No pension sharing is unusually weak"*)
- **Fairness check** (amber notice — e.g. *"3-year spousal is on the longer end"*)
- **Coaching** (green positive — e.g. *"Your home split is clean"*)
- **On this comment** (contextual response to a thread)

**S-A3 Summary banner per coach panel — LOCKED.**
Decouple-AI-styled intro paragraph framing the draft. Template: *"Your draft sits at 54/46 to you. That's within normal court range, but two items will likely be challenged — here's what to expect."* + *"N FLAG · M NOTICE"* count badges.

**S-A4 Show reasoning — LOCKED.**
Each coach card has a collapsible *"SHOW REASONING"* affordance. Keeps the panel scannable; deep context on tap.

**S-A5 Fallback positions surface — LOCKED.**
Within a coach card, an *"FALLBACK POSITIONS"* sub-section offers 1-3 alternative proposals with one-line rationale each (e.g. *"Open with 20% share · £36,082 to Mark · likely middle ground"*, *"Offset against home equity · Keep pension, Mark takes more of home"*). User can one-tap adopt.

**S-A6 Court-reasonableness is always advisory — LOCKED.**
Footer copy (per 68a C-A3): *"AI suggestions are guidance based on typical court outcomes for cases like yours. Not a substitute for legal advice."* Shown at the bottom of the AI coach panel.

---

## S-C Counter-proposal response

**S-C1 Counter-proposal summary header — LOCKED.**
When Mark returns a counter, top banner: *"Mark accepted {X} of {Y} sections. He'd like to discuss {Z} — {section names}."* Subtitle: *"Read each change, then choose how you'd like to respond. Your response becomes v{N+1}."*

**S-C2 Counter-proposal section view — LOCKED.**
For each contested section:
- Header: *"§{N} {Section name} · MARK CHANGED THIS · NEEDS RESPONSE"* chip
- Split columns: *"YOUR V1 · {date}"* on left with your values + *"MARK'S COUNTER · {date}"* on right with his values
- Mark's reasoning in an authored-reasoning block below (prose from him)
- Response controls (S-C3)

**S-C3 Response controls per section — LOCKED.**
Three-button row: **Discuss** · **Counter** · **Accept**. Plus a free-text *"What's your response?"* input for attached reasoning.

**S-C4 Send response action — LOCKED.**
Top-right adaptive button: *"Send response (v{N+1})"*, enabled when all contested sections have a response. Triggers next round.

---

## S-B Settlement progress board

**S-B1 Progress board is a distinct view — LOCKED.**
Surfaces when the parties are multiple rounds deep. Not the same as the draft/counter views. Left rail changes to a minimal "Settlement sections" summary; middle column shows:

**S-B2 Convergence chart — LOCKED.**
Line chart: *"GAP BETWEEN POSITIONS"* · X axis = version (V1, V2, V3, …) · Y axis = £ gap between positions. Annotation: *"Started £72,000 apart. Closed to zero across four rounds."* Colour transitions to green as gap closes. End-state shows *"CONVERGED"*.

**S-B3 Version history timeline — LOCKED.**
Horizontal timeline of version markers. Each marker: avatar (S or M) + version label (V1 · 3 MAY) + action (*"Sarah's opening"* / *"Mark's counter"* / etc.). Last marker may be "?" if waiting on response.

**S-B4 Still-open section card — LOCKED.**
At the bottom: the remaining unresolved section, shown as a focused card with micro-version history of just that section's rounds (S · v1 → M · v2 → S · v3).

**S-B5 Agreed sections list — LOCKED.**
Below the open section: *"AGREED · N SECTIONS"* with per-section one-line agreement summary and ✓ chip.

**S-B6 Top-right status — LOCKED.**
Adaptive: *"Waiting on Mark · 48h"* (with expected response window) or *"Preview agreement →"* (when ready).

---

## S-U Unlock to Finalise

**S-U1 Finalise unlocks when all sections agreed AND both parties signed — LOCKED.**
Signed = explicit signature action captured in the agreement artefact (S-G2). Not "both parties have agreed on all sections" — needs the deliberate sign step for legal weight.

**S-U2 Pre-reconciliation proposal drafting — DEFERRED (see 68f S-1).**
Lean: no — prevents proposal-built-on-stale-facts trap. Lock when 68f resolves.

**S-U3 Stuck-rounds escape hatch — LOCKED (per 68a C-E2).**
After X rounds with no convergence, prominent CTA: *"Sometimes you need extra help — export ES2 and take to a mediator."* User retains all data; mediator path supported.

---

## S-G Settlement agreement (final artefact)

**S-G1 "You've reached a settlement" headline — LOCKED.**
On acceptance of the final version. Body: *"Both of you have signed. This document now stands as the agreed financial arrangement between {Sarah full name} and {Mark full name}."*

**S-G2 Signature capture — LOCKED (shape) / OPEN on mechanism (see 68f S-3).**
Both parties must explicitly sign the agreement before it locks. Sign action records timestamp + identity attestation. Mechanism (e-sign provider / in-product / uploaded scan) is open.

**S-G3 "How you got here" retrospective chart — LOCKED.**
Convergence chart with version markers labelled (Sarah's opening · Mark's counter · Sarah's response · Mark accepts · Agreed & signed) + gap £ per version. Preserved in the artefact as a record of good-faith negotiation.

**S-G4 Agreed overall split visualisation — LOCKED.**
Big visual: *"Sarah {X}%"* · *"Mark {Y}%"* · of £{total} net · horizontal split bar. Anchored in the agreement artefact.

**S-G5 "Agreed terms" formal section list — LOCKED.**
Below the visualisation: §-numbered agreed terms per section, ready to carry into the Finalise phase document generation.

**S-G6 Top-bar agreed state — LOCKED.**
*"V5 · AGREED"* chip + *"SIGNED · FINAL"* badge + *"Download PDF"* action. The agreement artefact is exportable from this moment forward.

---

## Applicability

These decisions cover the full Settle phase arc (draft → review → counter → progress → agreed). The downstream phase-detail spec (spec 72+ "Settle flow") translates into interaction details. AI coach pattern cross-references 68a C-A.
