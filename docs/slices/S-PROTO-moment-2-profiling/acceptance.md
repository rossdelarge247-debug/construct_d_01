# S-PROTO-moment-2-profiling

**Category:** prototype
**Journey:** inbound from = moment-1-ack · outbound to = bank-picker (or completion-stub)

## Context

Spec 67 defines four pre-bank profiling question sets delivered as one-question-per-screen:

- **P1 Property** (L129-133) — conditional on `property_status` from pre-signup
- **P2 Self-employed** (L252-284) — conditional on `self_employment ∈ {me, both}`; 3 screens
- **P4 Pensions** (L367-415) — always asked; 2-3 screens (existence → provider → CETV nudge)
- **P6 Other accounts** (L507-524) — always; 1 priming screen before bank connect

## Acceptance criteria

**AC-1: P1 property screen renders per spec 67 L129-133.**
Conditional screen based on `property_status`:
- `mortgage` → "Who's your mortgage with?" with provider dropdown + free text
- `rent` → "Who do you pay rent to?" + amount + payment day
- `own_outright` → screen skipped
- `other` → clarifying free-text question

Prototype defaults to `mortgage` (Sarah's scenario).

**AC-2: P2 self-employed screens render per spec 67 L252-284.**
Three screens, each one question:
- P2a: "Tell us about your business" — company name + structure radio (Sole trader / Limited company / Partnership / Other)
- P2b: "How do you pay yourself?" — 5 radio options per spec 67 L267-273
- P2c: "Any other income sources from the business?" — 4 checkbox options per spec 67 L279-283

Conditional on `self_employment ∈ {me, both}`. Prototype shows via dev toggle (off by default for Sarah).

**AC-3: P4 pension screens render per spec 67 L369-413.**
- P4a: "Do you have any pensions?" — 5 radio options per spec 67 L371-377
- P4b: "Who's your pension provider?" — provider dropdown + DB-proxy checkboxes per spec 67 L386-396 (shown if P4a ≠ No)
- P4c: CETV nudge — timing explanation + "OK, add to my to-do list" / "Skip for now" per spec 67 L403-412 (shown if DB likely)

Always asked. Prototype defaults to P4a → P4b → P4c flow.

**AC-4: P6 other accounts heads-up per spec 67 L508-524.**
Single priming screen with verbatim copy per spec 67 L509-523:

> "We'll connect your main bank(s) in the next step and pull in the last 12 months of data."

Four bullet points (app-only banks, savings, joint accounts, closed accounts). CTA: "Got it — let's connect".

**AC-5: Step navigation.**
Linear stepper with progress indicator. Back button returns to previous step. Forward requires selecting an option (except P6 which is informational).

**AC-6: Dev-mode pre-signup toggles.**
Bottom panel toggles: `property_status` (mortgage/rent/own_outright/other), `self_employment` (me/both/neither). Changing toggles recalculates visible steps.

**AC-7: Registry updated.**
`registry.ts` row for `moment-2-profiling` updated: status → `prototype-built`, confidence → `medium`.

## Out of scope

- Real data persistence — prototype is static
- Post-bank Moment 3 sections (children, business depth, accounts) — separate slices
- CETV to-do list integration — requires to-do system
