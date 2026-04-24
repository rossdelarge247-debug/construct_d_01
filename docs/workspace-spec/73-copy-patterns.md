# Spec 73 — Copy patterns

**Date:** 24 April 2026 · session 28
**Parent:** `docs/workspace-spec/68a-decisions-crosscutting.md` C-U1 (positioning lock) · `docs/workspace-spec/68g-copy-share-opens.md` C-U4 / C-U5 / C-U6 (session-28 locks)
**Status:** LIVE. Locked session 28 via slice S-C-U4-disclosure-audit.
**Companion:** `docs/slices/S-C-U4-disclosure-audit/audit-catalogue.md` (surface-by-surface catalogue feeding the worked examples below).

---

## Purpose

Decouple is **the complete settlement workspace for separating couples**, not a financial disclosure tool (spec 42). This document is the single source of truth for every word we use — replacement vocabulary, banned words, empty-state verb patterns, and tone templates — so that no team member drafting CTAs, section headings, or error messages has to ask *"is this word okay"* twice.

Four sections, per spec 68g C-U4 decision line 29 verbatim:

> *"Run a surface-by-surface copy audit before Phase C extraction. Produce a single copy pattern doc covering: (a) replacement vocabulary (picture / shared / build / reconcile / settle / finalise), (b) banned words (disclose / disclosure / position), (c) empty-state verb family (see C-U5), (d) confirmation / attention / success / error tone templates."*

- **§1 Replacement vocabulary** — the six canonical terms + the 5-phase nav labels (folds in C-U6 Lean a).
- **§2 Banned words** — the three banned branding terms + exception policy for legal-process references.
- **§3 Empty-state verb family** — resolves 68g C-U5 Lean (d).
- **§4 Tone templates** — confirmation / attention / success / error, with worked examples.

How to use: pick the section matching the decision in front of you; cite `spec 73 §N` in slice docs / PRs when applying.

---

## §1 Replacement vocabulary

Six canonical terms. Each maps to a place in the product narrative (what Sarah is doing, what she's holding, where she is in the journey). These are the words that *replace* the banned branding — the positive vocabulary downstream slices pull from.

### 1.1 `picture`

- **Meaning:** The workspace artefact Sarah and Mark are assembling — the complete settlement picture (finances, children, housing, future needs). Not "position", not "disclosure". A picture is something you *build up*, *share*, *refine together*.
- **Usage:** Nav, CTAs, section headings, dashboard cards, empty-state bodies (paired with §3 verbs), tooltip explanations.
- **Worked examples (from audit catalogue):**
  - Sidebar section "Your position" → **"Your picture"** (catalogue #4)
  - Dashboard card "View your disclosure picture" → **"View your picture"** (catalogue #12)
  - Primary CTA "Disclose your position" → **"Build your picture"** (catalogue #1)
- **Banned near-synonyms:** "position" (§2) · "statement" · "report" · "submission" (reserved for the formal Form E act — see §2 exception policy).

### 1.2 `shared`

- **Meaning:** The state of the picture when both parties see the same artefact. "Shared" is the register that separates Decouple from adversarial tools — evidenced, not asserted; shared, not hand-off (spec 42 pillars).
- **Usage:** Button states (share CTA), status chips, share-modal copy, post-share confirmation bodies.
- **Worked examples:**
  - Accordion label "Income disclosed, ready for sharing & collaboration" → **"Income captured, ready to share"** (catalogue A2)
  - Share CTA adaptive states per 68g C-S6 (pre-share / shared / pending-update / sent / in-flight / error) — §4 Tone templates cover the copy for each.
- **Banned near-synonyms:** "exchange" (implies one-for-one swap, not co-building) · "disclose to" (banned, §2).

### 1.3 `build`

- **Meaning:** The active verb for Phase 2 of the 5-phase journey. What Sarah does to her picture — assembles, evidences, fills gaps. Replaces "disclose" / "prepare your disclosure" as the canonical nav verb for this phase.
- **Usage:** Phase-2 nav label (stepper + dashboard H2 + sidebar heading), CTAs that invite action ("Build your picture", "Keep building"), empty-state CTAs for narrative sections (see §3).
- **Worked examples:**
  - Dashboard stepper step-2 "Disclose" → **"Build"** (catalogue #10)
  - Dashboard H2 "Disclosure & reconcile" → **"Build & reconcile"** (catalogue #11)
  - Sidebar heading "Prepare your disclosure" → **"Build your picture"** (catalogue #3)
- **Banned near-synonyms:** "disclose" (§2) · "prepare" (allowed only in tour-body prose, not as a phase label — see §1.7 below).

### 1.4 `reconcile`

- **Meaning:** Phase 3 verb — the joint-document phase where Sarah and Mark resolve conflicts on the shared picture. Both parties participate; the verb is cooperative, not confrontational.
- **Usage:** Phase-3 nav label (stepper + dashboard H2), task-list headings on conflict cards, conflict-resolution CTA copy.
- **Worked examples:**
  - Dashboard H2 "Disclosure & reconcile" → **"Build & reconcile"** (catalogue #11)
  - Task card "Reconcile spending categories with Mark" (net-new phrasing, pattern source for downstream slices).
- **Banned near-synonyms:** "challenge" · "dispute" · "contest" (adversarial register, violates spec 42 pillar 1).

### 1.5 `settle`

- **Meaning:** Phase 4 verb — proposal + counter-proposal on the reconciled picture. Replaces "negotiate" where negotiate would read transactional. "Settle" carries the emotional weight Sarah is looking for ("we're settling this together").
- **Usage:** Phase-4 nav label, proposal-screen headings, AI-coach framing copy (governed separately by 68d).
- **Worked examples:** Net-new — no catalogue hits (Phase-4 surfaces not yet wired in session 22).
- **Banned near-synonyms:** "negotiate" (allowed in AI-coach *body* prose per 68d, not in nav).

### 1.6 `finalise`

- **Meaning:** Phase 5 verb — consent-order generation, pre-flight, fork to DIY submission or solicitor submission, post-order implementation. The closing phase.
- **Usage:** Phase-5 nav label, generation-screen CTAs, confirmation copy after consent-order produced.
- **Worked examples:** Net-new — no catalogue hits (Phase-5 surfaces not yet wired in session 22).
- **Banned near-synonyms:** "complete" (too generic) · "submit" (reserved for the specific Form-E-submission-to-court act, not the whole finalisation phase — see §2 exception policy).

### 1.7 Fold-in: 5-phase nav labels (C-U6 Lean a)

Per 68g C-U6 Lean (a) (*"unify all — stepper + section + nav all use phase labels"*) and 68a C-N3, every navigation surface (stepper · dashboard H2s · sidebar headings · breadcrumbs) uses these five labels verbatim:

| Phase | Nav label | Used at |
|---|---|---|
| 1 | **Start** | Onboarding, pre-signup, account setup |
| 2 | **Build** | Build-your-picture phase (confirmation questions, gap-filling, bank connect) |
| 3 | **Reconcile** | Joint-document phase (conflict cards, reconciliation queue) |
| 4 | **Settle** | Proposal / counter-proposal phase (AI coach, negotiation surface) |
| 5 | **Finalise** | Consent-order generation, pre-flight, submission |

**Tour-verb labels demoted.** The session-22 tour stepper used verb-action labels *"Prepare / Share / Build / Finalise"*. Per 68g C-U6 Lean (a), verb labels are banned from nav surfaces. Verbs may live in **tour-body prose only** (e.g. "In this step you'll prepare your connected accounts" is allowed; a stepper label "Prepare" is not).

**Why.** Session-22 wires had three different labels for the same territory in one screen ("Prepare" stepper, "Preparation" section H2, "Disclose" dashboard stepper step-2). Cognitive load for the user who's already stressed. Unifying to the 5-phase label everywhere removes it — you always know where you are.

---

## §2 Banned words

Three branding terms are banned outright from UI copy — section headings, CTAs, body prose, empty states, confirmations, errors, notifications. Each traces to the 68a C-U1 positioning lock (*"never 'financial disclosure tool' framing"*) and spec 42 pillar 1 (*"Shared, not adversarial"*).

### 2.1 `disclose` / `disclosure` (as branding)

- **Why banned.** "Disclose" reframes Sarah's work as a one-way legal act, not a shared build. It casts her as a claimant making a position statement to an adversary. This is the exact frame Decouple exists to replace (spec 42).
- **Replacements (pull from §1):**
  - As a CTA verb → **build** (§1.3) or **add** / **tell us about** per §3 empty-state verb family
  - As a noun (*"your disclosure"*) → **your picture** (§1.1)
  - As a status label (*"disclosed, ready for sharing"*) → **captured, ready to share** (§1.2)
- **Narrow exception: legal-process references.** The UK matrimonial-finance system legally *is* called "financial disclosure" — Form E is the "Financial Disclosure" form, CETVs are required *for disclosure*, the MCA 1973 framework uses the term. When referring to the **underlying legal mechanism** (not the product act), "disclosure" stays. Test: *could a solicitor or judge say this exact sentence*? If yes, it's a legal-process reference (allowed). If the sentence only makes sense inside the product's brand voice (*"Complete your spending disclosure now"*), it's a branding use (banned).
  - **Allowed:** *"Form E section 2.15 requires disclosure of income"*, *"A CETV is required for financial disclosure"*, *"The formal disclosure process requires both parties to declare everything under legal oath"*.
  - **Banned:** *"Complete your spending disclosure"*, *"Prepare your disclosure"*, *"Nothing disclosed yet"*, *"View your disclosure picture"*.
- **Catalogue evidence:** 20 Category-A hits in audit catalogue Part 2 all represent the branded use and flip per §1. 14 Category-B hits are legal-process references and retained.

### 2.2 `position`

- **Why banned.** "Your position" frames the exercise as adversarial — two opposing positions to be reconciled. It's the courtroom register, not the settlement-workspace register. Spec 42 pillar 1 explicitly rejects this frame.
- **Replacements:**
  - As a user-facing noun (*"your position"*) → **your picture** (§1.1)
  - As an evaluative noun (*"stronger position for negotiation"*) → **stronger foundation** / **stronger picture going in**
  - As a verb (*"position yourself for..."*) → rewrite the sentence; don't swap in a synonym. The right frame is co-building, not positioning.
- **Narrow exception: none.** "Position" has no legitimate legal-process meaning in the matrimonial-finance context — it's purely adversarial framing. Full ban.
- **Catalogue evidence:** 1 session-22 wire surface (#4 "Your position" sidebar), 3 `src/` hits in `recommendations.ts` (A18, A19, plus narrative prose) all flip per §1.

### 2.3 Additional banned terms surfaced by the audit

The audit catalogue (Part 2 src/ grep) did not surface additional banned branding terms beyond the three above. Terms considered and **not** banned:

- **`prepare`** — allowed in tour-body prose; banned only as a nav label (see §1.7). Not a general ban.
- **`exchange`** — marginal. Avoid in nav / CTAs (connotes one-for-one swap, adversarial). Allowed in rare legal-process references where it's the precise term. If unsure, prefer **share** (§1.2).
- **`submit` / `submission`** — reserved for the specific legal act of submitting Form E to court or filing a consent-order package. Not banned; not general vocabulary. Use only where the act is literally a submission to a court or tribunal.

### 2.4 Exception policy — where banned words may appear

A banned word may appear in product-owned text only under one of these conditions:

1. **Quoted spec / legal text.** Rendering a quote from the MCA 1973 · Family Procedure Rules · Form E instructions · HMCTS guidance. Must be quoted, attributed, and visually distinct (italic + source ref) from product voice.
2. **User-authored content.** If the user types "disclose" in a free-text field, render it back verbatim. Don't auto-edit user speech.
3. **Historical audit-trail text.** Archived retro docs, frozen spec versions, session handoffs — retain historical usage; do not retrofit.
4. **Internal non-rendered code.** Variable names, type names, routing keys (`share_and_disclose`), code comments that never ship to the browser. Rename opportunistically during a future refactor; not urgent.

Any other appearance of a banned word is a bug. Downstream slices replacing catalogue Category-A strings must leave no branded banned-word usage in rendered copy.

### 2.5 Enforcement

- **Lint path (future):** a copy-lint rule scanning `.tsx` + `.ts` string literals for banned terms, with per-exception annotations (`// copy-allow: legal-process`, etc.). Not in scope for this slice; parked for S-X-copy-lint or adjacent.
- **Review path (current):** reviewers check new UI copy against §1 + §2 before approval. The copy-pattern doc is the reference.

---

## §3 Empty-state verb family (resolves 68g C-U5)

Every empty state in the workspace (section with no entries yet) uses one of two CTA verb patterns, chosen by whether the section is **narrative** or **list**. Both pair with the same body template. Per 68g C-U5 Lean (d) verbatim:

> *"(d) — narrative sections (Children / Home) use 'Tell us about your {topic}'; list sections (Debts / Other assets / Pensions) use 'Add {item}'. Empty-state body stays light: 'Nothing here yet' (per C-U4 audit, not 'Nothing disclosed yet')."*

### 3.1 Narrative CTA template

- **Template:** `Tell us about your {topic}`
- **Register:** Warm, declarative, inviting — the *warm hand on a cold day* (CLAUDE.md north star).
- **Use when:** The section captures a story or qualitative picture that isn't a list of discrete items. The user's experience in that life-area is itself the content.
- **Worked examples:**
  - Children section (empty) → **"Tell us about your children"**
  - Home section (empty, single primary residence) → **"Tell us about your home"**
  - Spending section (empty — pre-bank-connect state) → **"Tell us about your spending"** (catalogue #7 replacement)
- **Do NOT use:** In a section whose entire content is a list of discrete items with fixed fields (those use §3.2). Mixing registers mid-section breaks rhythm.

### 3.2 List CTA template

- **Template:** `Add {item}` (singular noun; the button spawns one entry)
- **Register:** Direct, action-oriented, low-friction — the user already knows what's going in the list.
- **Use when:** The section is a list of discrete items with repeatable fields (each debt / pension / asset has the same shape).
- **Worked examples:**
  - Debts section (empty) → **"Add a debt"**
  - Other assets section (empty) → **"Add an asset"**
  - Pensions section (empty) → **"Add a pension"**
  - Income (non-PAYE sources) section (empty) → **"Add an income source"**
  - Additional properties (beyond primary residence) → **"Add a property"**
- **Do NOT use:** For narrative sections (§3.1). "Add a child" reads transactional in a way "Tell us about your children" does not.

### 3.3 Empty-state body template

- **Template:** `Nothing here yet`
- **Usage:** Every empty state body, narrative or list. Replaces the banned `Nothing disclosed yet` (catalogue #6) everywhere.
- **Pairs with:** The relevant CTA from §3.1 or §3.2.
- **Worked example:**
  ```
  [illustration or quiet icon]
  Nothing here yet
  [Tell us about your children] | [Add a debt]
  ```
- **Do NOT extend:** Don't pad the body with explanatory text (*"Nothing here yet — once you start adding, we'll show a list..."*). The CTA explains what to do. Padding dilutes the warmth of the short form.

### 3.4 Section classification — which sections are narrative, which are list

Authoritative map for every workspace section with an empty state. Downstream slices should cite this table, not re-derive.

| Workspace section | Type | Empty-state CTA | Reasoning |
|---|---|---|---|
| Children | Narrative | Tell us about your children | Qualitative story (schools, arrangements, special needs) — not a fixed-field list |
| Home (primary residence) | Narrative | Tell us about your home | Single dwelling + its story (mortgage, tenure, current arrangement) |
| Spending | Narrative | Tell us about your spending | Pattern + story — bank signal clusters are the evidence, but the framing is a story of outgoings |
| Health / future needs | Narrative | Tell us about your health / Tell us about your future | If wired (per 35-collaboration-workspace-vision); same register as Children |
| Debts | List | Add a debt | Repeatable fields per debt: creditor, balance, monthly payment |
| Other assets | List | Add an asset | Repeatable: type, value, ownership |
| Pensions | List | Add a pension | Repeatable: provider, scheme type, CETV, date |
| Income (non-PAYE sources) | List | Add an income source | Repeatable: source, amount, frequency |
| Savings accounts (manual add where bank unavailable) | List | Add a savings account | Repeatable: bank, type, balance |
| Business interests | List | Add a business interest | Repeatable: company, share-%, role, valuation |
| Additional properties (rentals, BTL, 2nd home) | List | Add a property | Repeatable: address, type, value, mortgage |

Edge cases:
- **Primary residence vs additional properties.** Primary residence is narrative (there is one; its story matters). Additional properties are a list (iterate). A user with both sees two register patterns — intentional; they're cognitively distinct concerns.
- **Spending.** Signal-detected clusters populate this section once bank is connected. The empty state only fires pre-connect (rare) — still use narrative CTA.
- **Children with no children.** Sarah should not see a "Tell us about your children" empty state if she has declared no children; the section is conditionally hidden (governed elsewhere, not this doc).

### 3.5 Rejected alternatives (from 68g C-U5 Options line 34)

Per the C-U5 Options log:

> *"(a) 'Tell us about X' — warm, declarative · (b) 'Add X' — direct, action-oriented · (c) 'Get started with X' — procedural · (d) mixed per context (tell-us for narrative sections, add for list sections)."*

- **(a) All narrative — reject.** Reads warm but wrong for list sections. "Tell us about your debts" sounds like a therapist's prompt when Sarah just wants to type "Barclaycard £3,200".
- **(b) All list — reject.** Reads direct but cold for narrative sections. "Add a child" is jarring — children are not inventory.
- **(c) Procedural ("Get started with…") — reject.** Procedural register is the enemy of warmth. This is what bad legal-tech sounds like.
- **(d) Mixed per context — adopted.** Right register for the right content. Slightly higher cognitive cost (two patterns) but the patterns are legible: narrative content gets the warm verb, list content gets the direct verb.

---

## §4 Tone templates

Four tones cover every system-to-user message: **confirmation**, **attention**, **success**, **error**. All four sit under one anchor — CLAUDE.md north star, quoted verbatim:

> *"A warm hand on a cold day — compassionate, professional, never patronising."*

Sarah is stressed. She's often alone. She's often doing this at night. Every message we ship is either evidence that the product is on her side, or evidence that it isn't. Get the register right.

**Cross-tone rules (apply to all four):**
- Use **§1 vocabulary** (picture / shared / build / reconcile / settle / finalise).
- Do not use **§2 banned words** in rendered copy (legal-process exceptions permitted where the sentence passes the solicitor/judge test).
- No exclamation marks except in Success (§4.3). No all-caps.
- No emojis. Decouple's warmth is linguistic, not iconographic.
- No jargon Sarah wouldn't use with a friend — if a real sentence would say "CETV" only because it has to (legal specificity), say it and explain in-line once.
- Length cap: headline ≤ 6 words; body ≤ 2 short sentences; CTA ≤ 4 words. Over that → rewrite.

### 4.1 Confirmation tone

- **Principle.** The user just did a thing. We tell them the thing worked, in one breath, with no ceremony. Calm acknowledgement, not applause.
- **Structural shape:**
  - **Headline:** what happened (past tense, plain language).
  - **Body (optional):** one sentence of context if the user needs to know what comes next.
  - **CTA (optional):** the next useful action; never required — confirmation can stand alone.
- **Banned patterns:** "Successfully", "Congratulations", exclamation marks, "Your information has been saved" (clinical).
- **Worked examples:**
  1. Bank connected →
     **"Bank connected."**
     *Body:* "We're pulling your last 12 months of transactions — take a look in a moment."
     *CTA:* `See your picture`
  2. Answer saved inline →
     **"Saved."**
     (No body. No CTA. The inline confirmation is enough.)
  3. Profile detail added →
     **"Added to your picture."**
     *Body:* "You can edit this any time."

### 4.2 Attention tone

- **Principle.** Sarah needs to notice something, but it isn't urgent and it isn't broken. The goal is *gentle surfacing* — name the thing, say why it matters, offer the next step. Never scold. Never imply she's behind.
- **Structural shape:**
  - **Headline:** what needs attention (noun-forward, not imperative).
  - **Body:** one sentence of *why* it matters — linked to her picture, not to compliance.
  - **CTA:** the concrete next step. Direct verb (§1.3 build · §3.2 add · review · share).
- **Banned patterns:** "You need to…", "You haven't…", "Please", "Urgent", "Action required", red colour as the sole signal.
- **Worked examples:**
  1. Missing pension statement (catalogue-flagged gap) →
     **"One missing pension statement."**
     *Body:* "Your Aviva CETV is over a year old — we'll need a fresh one to finalise."
     *CTA:* `Request a CETV`
  2. Bank data getting stale →
     **"Your bank data is from 8 days ago."**
     *Body:* "A refresh keeps your picture current."
     *CTA:* `Refresh now`
  3. Mark added new categories →
     **"Mark has added to the shared picture."**
     *Body:* "Three new spending categories since you last looked."
     *CTA:* `Take a look`

### 4.3 Success tone

- **Principle.** A meaningful milestone has landed (consent order generated, picture complete, shared successfully first time). This is the *one* place where a lift in register is earned — still compassionate, still professional, but with warmth that reads as genuine relief. One exclamation mark permitted; not more.
- **Structural shape:**
  - **Headline:** the milestone, named warmly.
  - **Body:** one sentence anchoring what this means for Sarah's journey.
  - **CTA:** what she does next (review, download, share, submit).
- **Banned patterns:** "Congratulations" (hollow), "You did it" (patronising), sparkle emojis or confetti animations without `prefers-reduced-motion` fallback (spec 26 rule).
- **Worked examples:**
  1. Picture build phase complete →
     **"Your picture is built."**
     *Body:* "Every section is captured. Next, you'll reconcile it together with Mark."
     *CTA:* `Start reconciling`
  2. Consent order generated →
     **"Your consent order is ready."**
     *Body:* "We've drafted it from your settlement. Review it carefully before you submit."
     *CTA:* `Review the order`
  3. First share with Mark →
     **"Shared with Mark."**
     *Body:* "He'll see the sections you selected. You can share more any time."
     *CTA:* `Back to your picture`

### 4.4 Error tone

- **Principle.** Something went wrong. Sarah is already stressed; this is the moment the product either reassures or alienates. Name what happened in plain language, tell her it's recoverable, give her a clear next step. Never blame her (*"Invalid input"*). Never blame the abstract system (*"An error occurred"*). Always suggest what she can do next.
- **Structural shape:**
  - **Headline:** what didn't work (plain, human).
  - **Body:** one sentence — what happened + reassurance it's recoverable.
  - **CTA:** retry, try another way, or contact support — concrete verb.
  - **Reference ID:** if server-side (per spec 72 §6 logging rules), append a short reference at the end (e.g. *"ref: a4b2"*) so support can trace without surfacing internals.
- **Banned patterns:** "Error", "Oops", "Something went wrong" (generic), stack traces, HTTP status codes surfaced to the user, "Invalid input" without saying what was invalid.
- **Worked examples:**
  1. Bank reconnect failed →
     **"Couldn't reach your bank just now."**
     *Body:* "Give it another minute — we'll pick up where you left off."
     *CTA:* `Try again`
  2. File too large on upload →
     **"That file is larger than 10MB."**
     *Body:* "Try compressing it, or upload as separate pages."
     *CTA:* `Choose a different file`
  3. Session expired →
     **"You've been away a while."**
     *Body:* "Sign back in — your picture is saved."
     *CTA:* `Sign in again`

---

## Maintenance

This spec lives. When a new banned term is surfaced by the audit, a new tone case arises (e.g. coaching tone for 68d), or a vocabulary refinement lands (e.g. an alternative to "picture" emerges in user testing): amend this doc, bump the version note below, and cite the slice that triggered the amendment.

**Version:** v1 · session 28 · slice S-C-U4-disclosure-audit.

**Downstream slices** replacing catalogue Category-A strings cite `spec 73 §N` in their AC to trace each replacement to the pattern it came from.

