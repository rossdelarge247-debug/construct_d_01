# Spec 54 — Risk Register: Technology Bets and Mitigations

**Date:** 17 April 2026
**Purpose:** Honest assessment of whether Decouple can achieve its goals via technology. For each core bet: what could go wrong, how to overcome, realistic risk level.

---

## The three core bets (user-flagged)

1. **Auto-magic evidence collection and accurate analysis/processing**
2. **Sympathetic and accurate AI-driven guidance alongside proposal negotiations (superseding lawyer/solicitor advice)**
3. **Accurate court-ready document generation**

Plus 8 additional risks surfaced in this assessment.

---

## Risk 1: Evidence collection and accurate analysis

**The bet:** Bank connection + AI classification produces an 80%+ accurate financial picture in minutes.

**What could go wrong:**
- Bank connectivity gaps (smaller building societies, business accounts, 90-day consent expiry, provider dependency)
- Classification accuracy (false positives/negatives, messy real-world descriptions, defensibility in court)
- Completeness gaps (cash, unconnected accounts, pensions, property values, pre-connected history)

**Risk level: MEDIUM.** Solvable with layered approach (bank + credit check + user confirmation + evidence badges).

**Killer scenario:** Open Banking provider (Tink) significantly increases pricing or restricts access.

**Key mitigations:** CSV/PDF upload fallback, manual entry path, credit check as anti-gaming, multi-provider strategy, continuous keyword expansion from corrections, audit trail per item.

---

## Risk 2: AI-driven guidance (the hardest bet)

**The bet:** System-generated context replaces professional advice for 60% of couples.

**What could go wrong:**
- "Typical range" claims without defensible data
- The advice vs information line (SRA-regulated territory)
- Emotional complexity AI can't handle (abuse, coercion, grief)
- Cold start — no proprietary outcome data
- Confidently wrong AI answers (more dangerous than no answer)

**Risk level: HIGH.** The narrowest legal and emotional tightrope in the product.

**Killer scenario:** User makes bad decision based on our context → Mumsnet story → trust destroyed. One high-profile case could end the product.

**Key mitigations:** Launch with arithmetic only (no ranges). Ranges earn their place with defensible sources. Legal review of every piece of system context. Always show "get professional review" option. Emotional handoff paths. Confidence transparency — show how every number was calculated.

---

## Risk 3: Court-ready document generation

**The bet:** Structured agreement data maps to legal clauses producing court-accepted consent orders.

**What could go wrong:**
- Legal language precision (one wrong word = unenforceable)
- Template coverage (combinatorial space of settlement patterns)
- D81 Section 10 quality (#1 reason courts reject orders)
- Pension sharing annex complexity (provider-specific requirements)
- Liability when things go wrong
- PI insurance unavailability

**Risk level: HIGH but solvable.**

**Killer scenario:** PI insurers refuse to cover auto-generated consent orders → forced to always recommend review → "you still need a solicitor" narrative weakens disruption thesis.

**Key mitigations:** Commission family law firm to draft/vet templates. Start with 5 most common patterns (~70% coverage). AI-assisted Section 10 enhancement from reasoning trails. Pension specialist partnership. Launch Tier 2 default (review recommended), earn Tier 1 (direct submission) through proven approval rates.

---

## Risk 4a: Data security and breach exposure

**The bet:** Users trust us with the most sensitive data imaginable.

**What could go wrong:**
- One breach ends the company
- Long-term retention of sensitive material
- Multi-party access complexity
- Open Banking consent access risk
- GDPR right-to-erasure with shared data ownership

**Risk level: HIGH.** Not technically hard — catastrophically damaging if wrong.

**Killer scenario:** Breach exposing combined financial + relationship + safeguarding data.

**Key mitigations:** Encryption at rest/transit, data segregation, minimal retention (90 days post-case), penetration testing, ISO 27001 path, audit logging, DPIA, cyber insurance from day 1.

---

## Risk 4b: Adversarial use

**The bet:** The product handles when one party acts in bad faith.

**What could go wrong:**
- Gaming the profiling (hidden assets)
- Coercion pressuring acceptance
- Evidence manipulation (clean bank account tactic)
- Account takeover by abusive ex
- Weaponising the timeline (stalling)
- Product itself exposes vulnerable users

**Risk level: HIGH.** Moral as well as product risk.

**Killer scenario:** Product used to facilitate financial abuse; safeguarding failure leads to physical harm.

**Key mitigations:** Ongoing coercive control signal detection, 24hr cooling-off on proposal acceptance, pause/lockdown button, discreet-use mode, mandatory 2FA, session anomaly detection, credit check as anti-gaming, mandatory review triggers for risk indicators, clear escalation to specialist services.

---

## Risk 4c: Handoff to professionals

**The bet:** Product handles 60%, humans handle 40% — handoff is graceful.

**What could go wrong:**
- Product reaches limits mid-journey
- Users don't know when they need a human
- Specialist handoff is expensive
- Professionals can't ingest our output
- Wrong routing erodes trust

**Risk level: MEDIUM.**

**Killer scenario:** Users trapped in product when they need professional help, or spending money on review they didn't need.

**Key mitigations:** Complexity detection at profiling AND signal levels, tier recommendation transparency, "export everything" structured package for professionals, mid-journey escape hatches, pre-launch partnerships with 3-5 family law firms, re-entry paths after professional handoff.

---

## Risk 4d: Regulatory and professional opposition

**The bet:** Regulators see us as legitimate infrastructure, not unauthorised practice.

**What could go wrong:**
- SRA complaint from disgruntled solicitor
- Law Society lobbying for restrictions
- Judicial hostility
- FCA boundary complexity
- Consumer rights backlash
- Law Commission reform going wrong direction
- PI insurance blocks

**Risk level: MEDIUM-HIGH.** Political risk, not technology risk.

**Killer scenario:** SRA opens investigation or Law Commission reform restricts non-solicitor automated legal services.

**Key mitigations:** Pre-launch SRA engagement, regulatory-experienced legal counsel, "information tool not advice" positioning vetted per screen, partnership with regulated law firm for Tier 2 cover, Resolution membership, Law Commission monitoring, published outcome data for defence, judicial relationship-building.

---

## Risk 4e: Cold-start data problem

**The bet:** System context is defensible enough to replace advice.

**What could go wrong:**
- No proprietary outcome data at launch
- Published judicial guidance is thin (family law is discretionary)
- Hand-coded "typical ranges" are effectively guesses
- Users anchor on our ranges — systemic skew
- Can't A/B test settlement outcomes ethically

**Risk level: MEDIUM.**

**Killer scenario:** Our "typical ranges" prove systematically wrong; settlements skew; academic or judicial pushback.

**Key mitigations:** Phase 1 launch with arithmetic only (no ranges). Phase 2 add published sources (Resolution guides, Duxbury tables, CMS calculator). Phase 3 anonymised own outcomes. Never show a range without sourced basis. Academic partnerships for methodology validation. Feedback loops on context usefulness.

---

## Risk 4f: Accessibility and financial literacy

**The bet:** Users can understand their financial situation well enough to decide.

**What could go wrong:**
- Financial illiteracy (one partner managed money)
- Jargon opacity (CETV, clean break, dismissal)
- Cognitive overload under stress (impaired executive function)
- Digital exclusion (older users, Open Banking discomfort)
- Language barriers
- Disability access (screen readers, colour-only indicators)

**Risk level: MEDIUM.**

**Killer scenario:** Product works for tech-comfortable professionals but fails real users in distress.

**Key mitigations:** Plain language throughout (every term explained inline), contextual education (not glossary pages), one thing at a time (already designed), "what does this mean for me?" translation, progress saving always, phone/chat support for technical help, WCAG 2.1 AA compliance, Welsh language support for Welsh courts.

---

## Risk 4g: Long-running process reliability

**The bet:** System maintains integrity across 2-6 month case lifecycle.

**What could go wrong:**
- Session state loss between sessions
- Open Banking consent expiry (90 days)
- Data staleness (values drift over months)
- Mid-process life changes (new job, new home)
- Cross-device state sync
- Concurrent editing conflicts
- Notification fatigue
- Third-party dependency changes
- Orphaned cases (abandoned free-tier accounts)

**Risk level: MEDIUM.** Engineering discipline problem.

**Killer scenario:** Data loss or corruption mid-case — imagine losing someone's pension details.

**Key mitigations:** Server-side state (Supabase), cache classified data permanently, staleness indicators per item, "update your picture" flows on return, optimistic locking for concurrent edits, designed notification cadence, external dependency monitoring, orphan cleanup policy, idempotent operations throughout.

---

## Risk 4h: Second-party adoption (the silent killer)

**The bet:** When invited, the other party actually uses the product.

**What could go wrong:**
- Ex doesn't trust a product chosen by their estranged partner
- Their solicitor advises against engagement
- Tech comfort gap
- Positioned as "her product, not ours"
- Low adoption degrades product to solo disclosure tool

**Risk level: HIGH.** Arguably the single biggest product risk.

**Killer scenario:** Second-party join rate below 30% — the entire collaboration thesis fails.

**Key mitigations:** Neutral invitation framing ("our household document"), equal status architecture (not "Sarah's workspace that Mark joined"), standalone value for Mark (review without full build), solicitor-friendly invite option, friction-free entry (30-second account creation via magic link), "fairness" badge addressing trust asymmetry, obsessive tracking of second-party join rate.

**The single most important launch metric: second-party join rate.** Above 50% = collaboration product. Below 30% = disclosure tool.

---

## Summary: the three that could kill the product

| Risk | Why it's existential |
|---|---|
| **4h. Second-party adoption** | If Mark won't use it, nothing else matters |
| **2. AI guidance liability** | One bad outcome story destroys trust irreversibly |
| **4d. Regulatory opposition** | SRA or judicial hostility could shut us down regardless of quality |

## The three that are solvable with discipline

| Risk | Why it's manageable |
|---|---|
| **1. Evidence collection** | Layered verification, fallback paths |
| **4e. Cold-start data** | Arithmetic first, ranges earn their place |
| **4g. Long-running reliability** | Standard SaaS engineering practices |

---

## Risk posture at launch

**What we accept:**
- Some classification errors (mitigated by user confirmation)
- Some percentage of cases will need Tier 2 or Tier 3 routing
- Range features not yet available — defer until defensible data exists

**What we cannot accept:**
- Data breach of any scale
- Safeguarding failure (coercive control case going wrong)
- Consent order being sealed with material legal defect
- Second-party join rate below 40%

**What we monitor obsessively:**
- Second-party join rate (weekly)
- Consent order first-submission approval rate (per submission)
- User-reported bad outcomes (Trustpilot, Mumsnet, support)
- Complexity routing accuracy (are we sending the right cases to Tier 2/3?)
- Coercive control signals triggering appropriately (safeguarding review)
