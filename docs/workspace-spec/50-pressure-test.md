# Spec 50 — Pressure Test: End-to-End Journey

**Date:** 17 April 2026
**Purpose:** Honest assessment of the end-to-end product vision. What holds up, what's optimistic, what's missing, what assumptions need testing. This is the sanity check before prototyping.

## What holds up

- **The six-phase structure** — logically sound, maps to legal reality, matches user mental model
- **Profiling → bank connection → engine detection** — proven in V2 already
- **The unified household document concept** — strong, different, defensible
- **Item-level collaboration patterns** — Juro proves this works
- **Consent order self-submission for the standard case** — legal research supports it (spec 41)
- **The cost elimination math** — £10k-15k saved per person is real, structurally sound

## Where it's optimistic

### Time estimates

| Claim | Reality | Honest range |
|---|---|---|
| "3 minutes profiling" | People hesitate, think, get interrupted | 8-12 minutes |
| "2 minutes bank connection" | Assumes 1 bank. Most have 3-5. | 5-10 minutes |
| "10 minutes to build your picture" | Requires pausing to check things, find documents | 45-90 minutes across multiple sessions |
| "Share and reconcile 1-2 weeks" | Assumes ex engages promptly | 2-6 weeks. Mumsnet says months is normal. |
| "2-3 months total" | Only true if CETV fast, ex cooperates, court fast | 3-6 months happy path, 6-12 with friction |

### Cost claims

| Claim | Missing from the calculation |
|---|---|
| "£800-1,100 per person" | Doesn't include Decouple's own fee |
| | Doesn't include property valuation if needed (£300-600) |
| | Assumes no professional review (many will choose one) |
| | Honest range: £1,200-2,500 with realistic add-ons |

## What's missing entirely

### Critical gaps

1. **"What if my ex won't engage?"** — 15-20% of real cases. No design for: graduated escalation, timeline-as-evidence for court, transition to compelled disclosure, solo-mode value. → Addressed in spec 47.

2. **Children arrangements beyond maintenance** — Residence, contact schedule, holidays, school decisions, medical consent, travel. These are interdependent with financial decisions and part of the same consent order. → Addressed in spec 48.

3. **Interim arrangements** — Between separation and settlement (months/years): who pays mortgage, who has kids this weekend, can I access the joint account. This is where users ARE when they first arrive. → Addressed in spec 48.

4. **Safeguarding throughout** — Coercive control isn't a one-time entry gate. Can manifest during negotiation. Needs ongoing signal detection and layered response. → Addressed in spec 47.

5. **The "am I getting divorced?" user** — Many arrive undecided, exploring options. Current arrival assumes clarity. → Addressed in spec 48.

6. **Complex cases** — Shared ownership, Help to Buy, overseas property, trusts, business shareholdings, pre-marital assets, non-UK pensions. Each is edge-case; together they're 25-30% of cases. → Addressed in spec 48 (complexity detection + routing).

7. **Post-agreement implementation** — Transfer property, share pension, close accounts, update records. The "last mile" nobody guides. → Partially designed in spec 46.

### Operational gaps

8. **Commercial model** — Subscription? Per-couple? Freemium? Price points? No business model defined. → Addressed in spec 49.

9. **Legal liability** — If auto-generated consent order is rejected, who bears cost? Professional indemnity insurance? Disclaimer model? → Flagged, needs legal counsel.

10. **Regulatory positioning** — FCA for Open Banking (likely fine via Tink). SRA concerns if approaching "reserved legal activity." GDPR for sensitive data including minors. → Flagged, needs legal counsel.

11. **Mobile experience** — People deal with divorce late at night on phones. Implicitly designed for desktop. → Addressed in spec 49.

12. **Professional integration model** — "Invite as guest" for mediator/solicitor is conceptual. Permissions, billing, liability, credential verification not designed. → Addressed in spec 49.

### Verification failure modes

13. **Bank connection failures** — Tink OAuth timeout, unsupported bank, 90-day consent expiry, browser crash mid-flow.

14. **Credit check edge cases** — No credit file (young person, recent immigrant), thin file, errors on file, file reveals things user wasn't ready to disclose.

15. **Evidence document failures** — Upload fails, wrong format, unreadable scan, document doesn't match claimed values.

## Assumptions that need user testing

| Assumption | Risk if wrong | How to test |
|---|---|---|
| Users will accept bank connection for divorce | They might not trust it with such sensitive data | Prototype: show bank connection step, measure hesitation |
| The "document" mental model resonates | Users might prefer app/dashboard feel | Prototype: build both views, A/B test sharing moment |
| Async collaboration works for divorcing couples | People ghost, rage-reply, refuse structure | Prototype: simulate the reconciliation flow with real couples |
| Ex will use the platform if invited | They have no loyalty to the product | Early user research: ask separated people "would your ex use this?" |
| System context feels helpful, not prescriptive | "Typical range" might feel like the product is judging | Prototype: test progressive disclosure of context vs always-visible |
| Users can self-serve for 60% of cases | Might be 40%, might be 75% | Launch data: track where users drop off or seek professional help |
| Mediators will partner with us | They might see us as competition | Early conversations with 5-10 mediators |
| Auto-generated consent orders will be court-approved | Rejection rate matters enormously | Legal review of templates before any user testing |

## The hardest question

**What fraction of the journey are we genuinely delivering end-to-end at launch?**

| Phase | Build status | Realistic launch state |
|---|---|---|
| 1. Start | ~30% (profiling specced, not built to new design) | MVP: profiling + orientation |
| 2. Build | ~60% (engine works, needs document-mode refactor) | MVP: working but dashboard-mode, document-mode in progress |
| 3. Share | 0% | MVP: share document read-only, basic comment threads |
| 4. Agree | 0% | V1.5: structured proposals, item-level accept/counter |
| 5. Finalise | 0% | V2: consent order generation, needs legal template library |
| 6. Move On | 0% | V2: implementation checklists |

**A realistic V1 launch:** Phases 1-2 polished (document-first disclosure) + minimum viable Phase 3 (share and read, basic reconciliation). That's still disruptive — nobody else offers bank-evidenced, structured disclosure in a shareable document format.

**The end-to-end "2-3 months for £800" vision is a 2-3 year product build.** Not a 6-month sprint.

## Revised honest timeline

| What | When | What it delivers |
|---|---|---|
| **Prototype v0.1** | May-June 2026 | Test the 3 hardest screens with real users |
| **V1 launch** | Q4 2026 | Phases 1-2 + basic Phase 3 (solo disclosure + share read-only) |
| **V1.5** | Q1 2027 | Full Phase 3 (reconciliation) + Phase 4 (proposals) |
| **V2** | Q2-Q3 2027 | Phase 5 (consent order generation) + Phase 6 (implementation) |
| **V3** | 2028 | Mediator partnerships, solicitor marketplace, Scottish law |

The vision is 3 years. The first valuable product is 6-8 months.
