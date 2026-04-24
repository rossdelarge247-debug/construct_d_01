# S-C-U4 · Disclosure-language audit catalogue

**Slice:** S-C-U4-disclosure-audit
**Status:** Complete · session 28
**Companion:** `docs/workspace-spec/73-copy-patterns.md` (the replacement pattern doc)

---

## How to read this catalogue

Two parts:

1. **Session-22 wire surfaces** — the 14 enumerated leaks in spec 68g C-U4 Context lines 15–28. Design-side; not yet in `src/`. These are the primary audit targets and feed Phase C extraction.
2. **`src/` implementation leaks** — banned-word hits across the active codebase, classified by whether they need replacement or are legitimate uses of "disclosure" / "position" in a non-branded sense.

**Classification scheme for `src/` hits:**

- **A · Branded UI copy** (replace in downstream slice) — the word appears as rendered product copy in a position, empty state, heading, CTA, accordion label, etc. These are the leaks C-U4 targets.
- **B · Legal-process reference** (keep) — "disclosure" refers to the UK matrimonial-finance legal mechanism (Form E, CETV requirements, "formal disclosure process"). The legal term stays; the *branding* we never adopt as UI voice.
- **C · Design-pattern terminology** (keep) — "Progressive disclosure" as a UX pattern name. Industry term, not product positioning.
- **D · Internal identifier / comment** (keep unless rendered) — `key: 'share_and_disclose'`, TODO comments, type-level docstrings. Not user-facing; flip only if a future slice renders them.

Replacement decisions against `src/` live code do NOT ship in this slice — they roll into per-surface slices (Build Map input). This catalogue is the decision record those slices will cite.

---

## Part 1 · Session-22 wire surfaces (spec 68g C-U4 lines 15–28)

All 14 are Category A (branded UI copy). Location: session 22 wires, not yet in `src/`. Pattern-doc section `§1` = replacement vocabulary, `§2` = banned words, `§3` = empty-state verbs, `§4` = tone.

| # | Surface | Current string (verbatim from spec) | Replacement | Pattern §  | Notes |
|---|---|---|---|---|---|
| 1 | Primary CTA | `Disclose your position` | `Build your picture` | §1 (picture · build) | Canonical replacement term "picture" — the workspace artefact Sarah is assembling |
| 2 | Dropdown item | `Disclose your position` | `Build your picture` | §1 | Same string twice (duplicate) — unify |
| 3 | Sidebar heading | `Prepare your disclosure` | `Build your picture` | §1 | Nav surface — uses 5-phase label convention per C-U6 |
| 4 | Sidebar section | `Your position` | `Your picture` | §1 (picture) | "Position" → "picture" direct swap |
| 5 | Breadcrumb | `Prepare your picture (disclosure)` | `Build your picture` | §1 | Parenthetical clarifier removed — ambiguity was the bug |
| 6 | Empty-state body (×5 per screen) | `Nothing disclosed yet` | `Nothing here yet` | §3 (empty-state body template) | Direct quote from spec 68g C-U5 Lean (d) line 35 |
| 7 | Empty-state CTA (Spending section) | `Complete your spending disclosure` | `Tell us about your spending` | §3 (narrative CTA template) | Spending is a narrative section (story-of-outgoings), not a list section |
| 8 | Attention callout | `Complete your spending disclosure based on your real banking transaction data now` | `We've pulled your spending from your bank — take a look and confirm the picture` | §4 (attention tone) | Shifts from imperative to connect-first framing per "show, don't ask" rule |
| 9 | Carousel headline | `Prepare your disclosure` | `Build your picture` | §1 | Same as #3 — nav consistency |
| 10 | Dashboard stepper label | `Disclose` (step 2) | `Build` | §1 (5-phase: Start / Build / Reconcile / Settle / Finalise) | Per 68g C-U6 Lean (a) — stepper uses phase labels |
| 11 | Dashboard H2 | `Disclosure & reconcile` | `Build & reconcile` | §1 | Phase-label pair |
| 12 | Dashboard card label | `View your disclosure picture` / `Next disclosure tasks` | `View your picture` / `Next tasks` | §1 | "Disclosure" dropped as adjective — redundant with section context |
| 13 | Footer column | `Sharing & Collaboation` [sic] | `Sharing & Collaboration` | §1 (spelling fix) + §2 | Typo correction — not a banned-word fix; catalogued so downstream slice picks it up in the same pass |
| 14 | Private-doc version chip | `V1 Last updated 21/04/2026` | (remove chip entirely) | Cross-ref to 68b B-V1 | Spec 68g C-U4 line 28 flags conflict with 68b B-V1 which drops version chips. This audit records the flag; the chip-removal decision lives with B-V1 |

**Surface count:** 14 · **Distinct replacement strings:** 11 (#1/#2/#3/#9 resolve to same "Build your picture", #6 is unique, etc.)

---

## Part 2 · `src/` implementation leaks

Grep signature used (case-insensitive, word-boundary on "your position"):

```
grep -riEn "[Dd]isclos(e|ure)|\byour [Pp]osition\b" src/
```

Run on branch `claude/S-C-U4-disclosure-audit` at commit `ae7f94b`. Results classified A/B/C/D.

### Category A · Branded UI copy (banned — replace in downstream slice)

| # | File : line | Current string (excerpt) | Replacement guidance | Pattern § |
|---|---|---|---|---|
| A1 | `src/lib/bank/confirmation-questions.ts` : 46 (type comment) | `// e.g. "Income disclosed, ready for sharing & collaboration"` | Update comment to reflect new accordion-label pattern ("Income captured, ready to share") | §1 (captured) |
| A2 | `src/lib/bank/confirmation-questions.ts` : 1250 | `'Income disclosed, ready for sharing & collaboration'` | `'Income captured, ready to share'` | §1 |
| A3 | `src/lib/bank/confirmation-questions.ts` : 1282 | `'You rent your home — no property to disclose'` | `'You rent your home — no property to add'` | §1 + §3 |
| A4 | `src/lib/bank/confirmation-questions.ts` : 1288, 1303, 1304 | `'No property to disclose'` (×3) | `'No property to add'` | §3 (list-section empty-state) |
| A5 | `src/lib/bank/confirmation-questions.ts` : 1401 | `'Property disclosed, ready for sharing & collaboration'` / `'No property to disclose'` | `'Property captured, ready to share'` / `'No property to add'` | §1 + §3 |
| A6 | `src/lib/bank/confirmation-questions.ts` : 1433–1435, 1449 | `'{type} disclosed...'` accordion labels (savings / ISA / investment / app-based) | `'{type} captured, ready to share'` pattern | §1 |
| A7 | `src/lib/bank/confirmation-questions.ts` : 1474 | `'Accounts disclosed, ready for sharing & collaboration'` | `'Accounts captured, ready to share'` | §1 |
| A8 | `src/lib/bank/confirmation-questions.ts` : 1492, 1499, 1514 | `'No pensions to disclose'` / `'Pension(s) to disclose'` | `'No pensions to add'` / `'Pension(s) to add'` | §3 |
| A9 | `src/lib/bank/confirmation-questions.ts` : 1547 | `'${sourceLabel} disclosed, ready for sharing & collaboration'` | `'${sourceLabel} captured, ready to share'` | §1 |
| A10 | `src/lib/bank/confirmation-questions.ts` : 1629, 1637 | `'No debts to disclose'` / `'Debts disclosed, ready for sharing & collaboration'` | `'No debts to add'` / `'Debts captured, ready to share'` | §1 + §3 |
| A11 | `src/lib/bank/confirmation-questions.ts` : 1801, 1809 | `'No business interests to disclose'` / `'Business interests disclosed...'` | `'No business interests to add'` / `'Business interests captured...'` | §1 + §3 |
| A12 | `src/lib/bank/confirmation-questions.ts` : 1954, 1996 | `'No other assets to disclose'` / `'Other assets disclosed, ready for sharing & collaboration'` | `'No other assets to add'` / `'Other assets captured, ready to share'` | §1 + §3 |
| A13 | `src/components/hub/discovery-flow.tsx` : 158 | Narrative body: `"...preparing your disclosure picture. We will guide you..."` | `"...building your picture together. We will guide you..."` | §1 |
| A14 | `src/constants/index.ts` : 14 | `label: 'Share & disclose'` | `label: 'Share your picture'` | §1 |
| A15 | `src/constants/index.ts` : 15 | `description: 'Preparing to share your picture and exchange disclosure with the other party.'` | `description: 'Sharing your picture with the other party and reconciling it together.'` | §1 |
| A16 | `src/hooks/use-workspace.ts` : 132 | `label: 'Ready for formal disclosure', description: 'Your picture is comprehensive enough for formal financial exchange'` | `label: 'Ready for Form E submission', description: 'Your picture is comprehensive enough to submit as formal financial disclosure'` | §2 exception (legal-process context) |
| A17 | `src/lib/recommendations.ts` : 163 | `"You're concerned about hidden assets... thorough disclosure..."` | Retain "thorough disclosure" as legal-process reference (Category B boundary case); reframe narrative so "disclosure" reads as process not brand | §2 exception |
| A18 | `src/lib/recommendations.ts` : 166 | `"...a much stronger position for any negotiation or disclosure."` | `"...a much stronger foundation for any negotiation or submission."` | §1 (position → foundation) |
| A19 | `src/lib/recommendations.ts` : 196 | `"...the stronger your position in any discussion or mediation."` | `"...the stronger your picture going into any discussion or mediation."` | §1 |
| A20 | `src/lib/recommendations.ts` : 215 | `"We help you prepare for mediation — organising your disclosure..."` | `"We help you prepare for mediation — organising your Form E submission..."` | §2 exception |

**Category A count:** 20 rows across 5 files.

### Category B · Legal-process reference (keep — UK matrimonial-finance legal mechanism)

| File : line | String (excerpt) | Why it stays |
|---|---|---|
| `src/lib/bank/confirmation-questions.ts` : 642, 667 | `"must be disclosed"`, `"Form E requires disclosure..."` | Form E is literally the "Financial Disclosure" form; the term is the legal process name |
| `src/lib/bank/confirmation-questions.ts` : 827 | `"It's required for financial disclosure"` (CETV) | CETV is a statutory requirement for pension disclosure under MCA 1973 |
| `src/lib/bank/confirmation-questions.ts` : 1532 | `"required for disclosure"` (CETV request) | As above |
| `src/lib/bank/confirmation-questions.ts` : 1740 | `"...it must be disclosed."` (DLA) | Form E section 2.11 requirement |
| `src/lib/ai/result-transformer.ts` : 31 | `// conservative for financial disclosure` (code comment) | Describes the *legal* threshold context |
| `src/lib/ai/result-transformer.ts` : 337, 1362 | `"treated differently... for disclosure"` (dividends) | Tax/disclosure treatment is a legal distinction |
| `src/lib/ai/result-transformer.ts` : 430 | `"...remaining for full disclosure"` (months countdown) | "Full disclosure" = Form E completion |
| `src/lib/ai/result-transformer.ts` : 921 | `"This is a liability that needs to be disclosed."` | Form E requirement framing |
| `src/lib/ai/result-transformer.ts` : 1021 | `"You'll need an updated one for formal disclosure."` (CETV > 12mo) | Statutory requirement |
| `src/lib/ai/extraction-prompts.ts` : 52, 175 | Prompt text: `"Form E section 2.15"`, `"key Form E disclosure value"` | AI extraction prompts referencing legal form fields |
| `src/lib/recommendations.ts` : 60 | `"The formal disclosure process requires both parties..."` | Describing the legal process itself — exactly when "disclosure" is the correct word |
| `src/lib/bank/signal-rules/debt-rules.ts` : 66, 89, 93 | `"disclosure context"` in gambling rule metadata | Internal rule-engine reasoning about legal-process relevance |

**Category B count:** 14 distinct hits. All retained.

### Category C · Design-pattern terminology (keep — industry UX term)

| File : line | String (excerpt) | Why it stays |
|---|---|---|
| `src/components/hub/hero-panel.tsx` : 15, 508, 573 | `// Progressive disclosure options...` | "Progressive disclosure" is the canonical UX pattern name (Nielsen-Norman) |
| `src/lib/ai/result-transformer.ts` : 303 | `// provide progressive disclosure for less common income types` | Same UX pattern |

**Category C count:** 4 hits. All retained.

### Category D · Internal identifier / comment (keep unless rendered)

| File : line | String (excerpt) | Why it stays |
|---|---|---|
| `src/constants/index.ts` : 13 | `key: 'share_and_disclose'` | Internal routing key; not rendered; downstream slice may rename for internal hygiene but no user-visible churn |
| `src/lib/recommendations.ts` : 214 | `serviceLink: 'share_and_disclose'` | Same — internal link ID |
| `src/hooks/use-hub.ts` : 530 | `// TODO: show section picker for "+ More to disclose"` | Code comment; TODO roll into downstream slice when the section picker ships |

**Category D count:** 3 hits. All retained pending downstream slice.

---

## Summary

| Part | Rows | Category-A (replace) | Stays (B/C/D) |
|---|---|---|---|
| Part 1 · Session-22 wires | 14 | 14 | 0 |
| Part 2 · `src/` leaks | 41 | 20 | 21 |
| **Total** | **55** | **34** | **21** |

**Rollout:** 34 Category-A replacements roll into per-surface downstream slices. Per-file clustering: `src/lib/bank/confirmation-questions.ts` holds 12 of the 20 `src/` Category-A rows — the natural unit for one downstream slice. `src/constants/index.ts` + `src/hooks/use-workspace.ts` + `src/lib/recommendations.ts` form a second cluster (copy touches across routing + status + recommendations). `src/components/hub/discovery-flow.tsx` is a standalone touch.

**Residual risk / known unknowns:**
- Grep scoped to `src/`. Any future additions during Phase C extraction must re-run the grep on merge.
- "Progressive disclosure" (Category C) could still appear as user-visible text if a tooltip or help doc renders the internal comment. Downstream slice should verify no Category-C strings leak to rendered copy.
- Category-B/A boundary (e.g. A17 in `recommendations.ts`) is judgement-dependent. The replacement in §2 banned-words (narrow exception for legal-process references) is the arbiter; borderline rows should be reviewed against §2 during downstream slice review.
