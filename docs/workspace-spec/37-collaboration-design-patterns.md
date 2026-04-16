# Spec 37 — Collaboration Workspace: Design Patterns & Mental Models

**Date:** 15 April 2026
**Status:** Design reference for wireframing
**Depends on:** Spec 35 (vision), Spec 36 (task flow)

## Mental models evaluated

### Google Docs (shared document)
**Strengths:** Comments, suggestion mode, version history are well-understood patterns.
**Weakness:** Real-time collaboration is dangerous in divorce — people need time to think. Freeform text becomes a vector for abuse.
**Take:** Item-level comments and suggestion/accept/reject. NOT real-time co-editing.

### Juro (contract negotiation)
**Strengths:** Version pipeline, internal/external split, in-browser redlining, threaded comments, deliberate send, immutable audit trail.
**Weakness:** B2B contract tool — no emotional awareness, no progress tracking.
**Take:** Version pipeline navigation, deliberate send model, item-level redlining. These are the core interaction patterns.

### Linear / project boards (kanban)
**Strengths:** Status-driven, progress visible at a glance, items move through stages.
**Weakness:** Can feel transactional for something this emotional.
**Take:** The progress board — items moving from disputed to agreed. But warmer than a project tracker.

### Property portals (comparison)
**Strengths:** Side-by-side comparison is instantly understood. Differences highlighted.
**Weakness:** Static — doesn't capture the time dimension of proposals evolving.
**Take:** The proposal diff view — left/right with green/amber/red highlighting.

### Social media / messaging (timeline)
**Strengths:** Chronological narrative is universally understood. Read receipts create accountability.
**Weakness:** Can feel overwhelming with high activity.
**Take:** The timeline as the story of the negotiation. Makes stalling visible. Useful for professionals.

### Figma (multiplayer canvas)
**Strengths:** Real-time presence, spatial layout, seeing others interact.
**Weakness:** Too complex for consumers. Spatial layout doesn't suit structured financial data.
**Take:** The presence concept (knowing when they've viewed something) via read receipts — NOT live cursors.

## The Juro patterns mapped to Decouple

### Version pipeline (horizontal navigation)
**Juro:** Original → External v1 → Internal → External v2 → Signed
**Decouple:**
```
[Your disclosure ✓] → [Their disclosure ✓] → [Combined ✓] → [Proposal v1] → [Counter v1] → [Agreed]
```
Always visible at the top. Click any stage to see what it looked like at that point. Each version shows: who created it, when, status badge.

### Internal/external split → Two-space model
**Juro:** Internal team edits vs external counterparty version
**Decouple:** My workspace (private — notes, solicitor comments, draft proposals) vs shared space (both parties see — financial picture, sent proposals, discussions). Toggle between them. Solicitor is a guest in your workspace. Mediator is a participant in the shared space.

### Item-level redlining → Per-item accept/counter
**Juro:** Redline specific contract clauses, not the whole document
**Decouple:** Counter specific financial items, not the whole proposal. "I accept the property split but want to change the pension percentage." Granularity reduces conflict.

### Threaded comments → Item discussions
**Juro:** Margin comments attached to specific clauses
**Decouple:** Discussion threads on specific financial items. "Why is savings £8k?" → "That's from my March statement" → evidence link. Attached to the item, not lost in email.

### Deliberate send → Review before send
**Juro:** "Send back new version" button
**Decouple:** Review screen showing exactly what you're about to send, what changed from their proposal, your reasoning. Prevents impulse responses. The product equivalent of "sleep on it."

## Key design principles

### 1. Structured interactions, not freeform messaging
Every interaction is: confirm an item, query an item, make a proposal, respond to a proposal. NOT "let me write a paragraph about why you're unfair." The structure IS the safeguard against emotional escalation.

### 2. Deliberate, not real-time
You prepare privately, review, then send. Not Google Docs real-time editing. People need time to think, consult their solicitor, and not say something in the heat of the moment.

### 3. Evidence over claims
Every figure links to its source — bank statement, uploaded document, self-declaration. The evidence basis is always visible. "Bank-evidenced" carries more weight than "self-declared." This builds trust through transparency.

### 4. Progress is always visible
The progress board is persistent — sidebar or top bar. "7 of 9 agreed. Gap: £8,400." This reframes the emotional experience from "endless conflict" to "nearly there."

### 5. Escalation is graceful, not failure
"Get help from a mediator" is a feature, not an admission of defeat. The product should know its limits and route to human support when needed — high conflict, coercive control, emotional impasse.

### 6. The product never advises, only informs
"Here's what equal division looks like for your situation" = arithmetic, acceptable. "You should accept this offer" = advice, unacceptable. The product shows ranges and context. Humans make decisions.

## Design references

| Reference | What to study | Apply to |
|---|---|---|
| **Juro** (juro.com/negotiate) | Version pipeline, redlining, threaded comments, send flow | Core negotiation UX |
| **Linear** (linear.app) | Status-driven progress, clean aesthetic | Progress board |
| **Stripe Dashboard** | Real-time calculation as inputs change | Proposal builder impact modelling |
| **GitHub PR review** | Inline comments, approve/request changes, conversation threads | Item-level discussion |
| **iMessage / WhatsApp** | Read receipts, typing indicators, chronological flow | Timeline presence and accountability |
| **Monzo / Emma** | Financial data visualisation, clean cards, progressive disclosure | Financial picture layout |

## Safeguarding design notes

- **No freeform messaging.** All communication is structured (queries, proposals, responses)
- **Cooling-off period.** After receiving a proposal, system suggests: "Take your time"
- **Coercive control detection.** If V1 flags indicators, adapt: disable direct interaction, route through mediator, "You can revoke access at any time"
- **Fairness guardrails.** If a proposal gives one party >85% of assets, flag: "This split is unusual. A court would typically query this"
- **Professional review nudge.** Before consent order: "We recommend a solicitor reviews this"
