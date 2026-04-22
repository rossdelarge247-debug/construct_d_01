# Spec 52 — Product Canvas

**Date:** 17 April 2026
**Status:** Structured overview. The single page that explains the whole product.
**Audience:** Strategic decision-makers, partners, senior hires.

---

## Jobs-to-be-done

What users hire Decouple to do for them:

| # | Job | When it happens |
|---|-----|-----------------|
| **J1** | Help me understand what I'm dealing with | Arrival — overwhelmed, uncertain |
| **J2** | Build my financial picture | Early phase — gathering, disclosing |
| **J3** | Share and align with my ex | Mid phase — collaborative reconciliation |
| **J4** | Negotiate a fair settlement | Mid-late phase — proposing and agreeing |
| **J5** | Generate legally valid documents | Late phase — formalising |
| **J6** | Implement what we agreed | Post-agreement — moving forward |
| **J7** | Stay safe throughout | Cross-cutting — always |

---

## Users

### Primary users
- **Person A** — the first partner to engage with Decouple
- **Person B** — invited by A, becomes a co-user of the shared document

### Secondary users
- **Mediator** — participant in the shared document (Phase 3+)
- **Solicitor (reviewer)** — on-demand reviewer at Phase 5
- **Solicitor (representative)** — Tier 3 complex cases

### User segments (both parties across spectrum)
| Segment | % | How they use Decouple |
|---|---|---|
| Already aligned | 25% | Fast-track through full journey, one-round proposals |
| Need a nudge | 35% | Full journey, 2-4 proposal rounds, progress board keeps momentum |
| High conflict | 25% | Parallel mode, mediator-facilitated, evidence reduces arguments |
| Won't engage | 15% | Solo mode, timeline becomes court evidence |

---

## Phases (the journey)

```
1. START   → 2. BUILD   → 3. SHARE   → 4. AGREE   → 5. FINAL   → 6. FORWARD
5 min        30 min       1-2 weeks    2-4 weeks    1 week       ongoing
             (A alone)    (B joins,    (proposals,  (docs,       (implement)
                          reconcile)   agreement)   submit)
```

The document grows through each phase. One artefact, six states.

---

## Capabilities (what the product does)

### Disclosure engine
- Profiling (context before detection)
- Open Banking classification (17 signal rules, 20 categories)
- Tier-based confirmation (matched / expected / unknown)
- Credit verification layer
- Document evidence upload
- Trust badges per item

### Shared document
- Unified household picture (one list, ownership tags per item)
- Version pipeline (v0.x → v7.x, with immutable snapshots)
- Item-level discussion threads
- Progressive reconciliation
- Async collaboration with graceful degradation

### Settlement workspace
- Private workspace (fallback positions, notes, solicitor comments)
- Structured proposal builder (per item, with system context)
- Redline-model counter-proposals
- Progress board with convergence tracking
- Multiple collaboration modes (collaborative / mediated / parallel)

### Legal generation
- Consent order from structured agreement data
- D81 with auto-populated Section 10 (reasoning trail)
- Pension sharing annex (Form P)
- Parenting plan (Statement of Arrangements)
- Pre-flight quality check
- Court submission guidance

### Implementation support
- Post-order checklist per agreed action
- Template letters to providers
- Long-running task tracking
- Records update guidance

### Safety & adaptation
- Coercive control signal detection
- Graduated response to non-engagement
- Solo-mode value preservation
- Jurisdictional adaptation (Scotland, NI)
- Complexity routing (Tier 1 / 2 / 3)

---

## Outcomes

### For couples
- Settled in 2-3 months (vs 12-18)
- £800-1,100 per person (vs £14,561)
- Evidence-based agreements (vs claims and counter-claims)
- Lower emotional cost (structured process reduces conflict)

### For mediators
- 2-3 sessions per case (vs 5-8)
- More cases per month at the same fee
- Higher client satisfaction
- Professional document output they can stand behind

### For solicitors (review tier)
- On-demand income stream at fixed fees
- No admin burden
- Focus on legal judgment only

### For the system
- First-submission consent order approval rates higher than current industry norm
- D81 Section 10 reliably completed (addresses #1 reason for court rejections)
- Evidence trail reduces appeals and set-aside applications

---

## Business model

### Consumer (direct)
**Free-to-build, pay-to-share** model recommended for testing:

- **Free** — build your financial picture (Phase 1-2)
- **£149** — share with your ex (Phase 3)
- **£299** — full proposals and agreement (Phase 4)
- **£99 add-on** — consent order + D81 generation (Phase 5)

### Professional marketplace
- **Solicitor review** — £250-500 fixed fee, Decouple takes 20%
- **Mediator case licence** — £50/case or white-label option
- **Tier 3 solicitor referral** — no platform fee, relationship value

### Defer pricing decisions until prototype validation.

---

## The moat

Five things no competitor has in combination:

1. **Consumer-first** — not B2B (Quantum Cloud, Armalytix)
2. **Bank-evidenced** — not self-declared (standard Form E)
3. **Collaborative** — not adversarial (current solicitor process)
4. **End-to-end** — not just disclosure (Armalytix stops at analysis)
5. **Consent order self-submission** — not just prep (amicable drafts for you)

The structured, evidenced, shared document is the primitive. Once we own that primitive, we can extend in any direction — children, implementation, post-divorce financial planning.

---

## The disruption

**We eliminate the four-party chain.** Every proposal letter, every questionnaire round, every solicitor-to-solicitor email disappears. Communication goes from £200/letter to free. Time goes from weeks-per-round to days.

**We make disclosure evidence-based.** Bank connection + credit verification > self-declaration + solicitor review. Our disclosure is structurally more reliable than what £1,500 of solicitor time produces today.

**We automate the 80% that's administrative.** Leaves the 20% that's genuinely legal judgment to humans, on demand, at fixed fees.

This is a category reframe, not a feature improvement.
