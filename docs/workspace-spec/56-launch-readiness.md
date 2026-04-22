# Spec 56 — Launch Readiness: Compliance, Legal & Go-to-Market Preparation

**Date:** 17 April 2026
**Purpose:** The formal checklist for getting Decouple launch-ready. Covers legal, regulatory, security, partnerships, and commercial preparation. Each item: what it is, why it's needed, cost, lead time, status.

---

## Critical path: items that block launch

These must be complete before any user touches the live product.

### 1. GDPR & Data Protection

| # | Item | Why needed | Cost | Lead time | Status |
|---|------|-----------|------|-----------|--------|
| L1.1 | Data Protection Impact Assessment (DPIA) | Statutory requirement under GDPR Art 35 for high-risk processing (financial data, children, vulnerability indicators) | £1,500-3,000 | 3-4 weeks | ▢ Not started |
| L1.2 | ICO registration as data controller | Legal requirement | £40-60/year | 1 day | ▢ Not started |
| L1.3 | Privacy policy (GDPR-compliant, plain language) | Statutory + user trust | £500-1,500 | 1-2 weeks | ▢ Not started |
| L1.4 | Cookie policy + consent mechanism | ePrivacy Regulations | £200-500 | 1 week | ▢ Not started |
| L1.5 | Data Processing Agreements (Tink, Supabase, Vercel, any other processors) | GDPR Art 28 requirement | £500-1,000 | 2-3 weeks | ▢ Not started |
| L1.6 | Data retention policy (documented) | GDPR Art 5(1)(e) — storage limitation | Internal | 1 week | ▢ Not started |
| L1.7 | Data subject rights procedures (access, deletion, portability) | GDPR Art 15-20 | Internal | 1 week | ▢ Not started |
| L1.8 | Breach notification procedure (72-hour ICO notification) | GDPR Art 33 | Internal | 1 day | ▢ Not started |

**Total: ~£3,000-6,000 + 4-6 weeks lead time**
**Engage: GDPR consultant (freelance or firm like Evalian, DataGuard, or Privacy Compliance Hub)**

---

### 2. Legal: Terms, Disclaimers & Positioning

| # | Item | Why needed | Cost | Lead time | Status |
|---|------|-----------|------|-----------|--------|
| L2.1 | Terms of service (platform) | Legal foundation — defines us as technology platform, not legal service provider | £2,000-3,500 | 2-3 weeks | ▢ Not started |
| L2.2 | Disclaimer framework | Core legal defence — "information not advice" positioned correctly per screen type | Included in L2.1 | Included | ▢ Not started |
| L2.3 | User acknowledgements at key moments (bank connection, document generation, direct submission) | Shifts responsibility, demonstrates informed consent | Included in L2.1 | Included | ▢ Not started |
| L2.4 | Generated document disclaimers (consent order, D81, Form P) | Each generated document carries clear "auto-generated from user input" statement | Included in L2.1 | Included | ▢ Not started |
| L2.5 | Acceptable use policy | Prevents misuse, establishes grounds for account termination | £500-1,000 | 1 week | ▢ Not started |
| L2.6 | Professional review marketplace terms (for solicitor reviewers) | Contractual basis for reviewer marketplace | £1,000-2,000 | 2 weeks | ▢ Not started |

**Total: ~£3,500-6,500 + 3-4 weeks lead time**
**Engage: Tech/commercial lawyer with consumer platform experience (not a family law firm — they'll focus on the wrong things)**

---

### 3. Regulatory Positioning

| # | Item | Why needed | Cost | Lead time | Status |
|---|------|-----------|------|-----------|--------|
| L3.1 | SRA consultation (2 hours) | Confirm "information tool" positioning is defensible. Get written opinion on file. | £400-800 | 2 weeks to schedule | ▢ Not started |
| L3.2 | FCA positioning review | Confirm Open Banking via Tink doesn't require our own FCA authorisation | Included in L3.1 or separate £400-600 | 1-2 weeks | ▢ Not started |
| L3.3 | Reserved legal activity analysis | Written confirmation that consent order generation from templates doesn't constitute a reserved activity under Legal Services Act 2007 | Included in L3.1 | Included | ▢ Not started |
| L3.4 | Document: "Our regulatory position" (internal) | File note capturing all legal opinions for future defence | Internal | 1 day after L3.1 | ▢ Not started |

**Total: ~£800-1,400 + 2-3 weeks lead time**
**Engage: SRA-experienced solicitor (Resolution member, ideally) — ask for 2-hour focused consultation covering all three points**

---

### 4. Insurance

| # | Item | Why needed | Cost | Lead time | Status |
|---|------|-----------|------|-----------|--------|
| L4.1 | Cyber insurance (starter policy) | Protection against data breach. Investors will require. | £1,000-3,000/year | 1-2 weeks | ▢ Not started |
| L4.2 | Professional indemnity insurance (platform errors & omissions) | Protection against claims from defective auto-generated documents | £1,000-3,000/year | 2-3 weeks | ▢ Not started |
| L4.3 | Public liability insurance | General business requirement | £300-500/year | 1 week | ▢ Not started |
| L4.4 | Directors & officers insurance | If incorporated | £500-1,000/year | 1 week | ▢ Not started |

**Total: ~£2,800-7,500/year + 2-3 weeks lead time**
**Engage: Tech startup insurance broker (Superscript, Embroker, or specialist) — bundle all policies for discount**

---

### 5. Security

| # | Item | Why needed | Cost | Lead time | Status |
|---|------|-----------|------|-----------|--------|
| L5.1 | Penetration test (pre-launch) | Identifies vulnerabilities before go-live. Required for cyber insurance. | £2,000-5,000 | 2-3 weeks (test + remediation) | ▢ Not started |
| L5.2 | Encryption at rest | Supabase default + verify configuration | Engineering time | 1 day | ▢ Not started |
| L5.3 | Encryption in transit (TLS 1.3) | Vercel default + verify configuration | Engineering time | 1 day | ▢ Not started |
| L5.4 | 2FA implementation | Mandatory for all accounts processing sensitive data | Engineering time | 1-2 weeks | ▢ Not started |
| L5.5 | Audit logging | Every sensitive read/write logged with actor, timestamp, context | Engineering time | 1-2 weeks | ▢ Not started |
| L5.6 | Access controls (employee access, role-based) | Prevent internal data exposure | Engineering time | 1 week | ▢ Not started |
| L5.7 | Secure session management | Token expiry, refresh, secure cookies | Engineering time | Included in auth | ▢ Not started |
| L5.8 | Vulnerability disclosure policy | Published policy for security researchers | Internal | 1 day | ▢ Not started |

**Total: ~£2,000-5,000 external + 4-6 weeks engineering**

---

### 6. Partnerships (pre-launch)

| # | Item | Why needed | Cost | Lead time | Status |
|---|------|-----------|------|-----------|--------|
| L6.1 | Partner with 1 family law firm for Tier 2 review | Provides professional cover for reviewed orders + credibility + feedback loop | Relationship (no cash cost, revenue share) | 4-8 weeks to find + agree | ▢ Not started |
| L6.2 | Resolution membership (associate/affiliate) | Professional body alignment, signals legitimacy to users and professionals | £100-500/year | 1-2 weeks | ▢ Not started |
| L6.3 | Tink commercial agreement (production terms) | Dev → production upgrade for Open Banking | Variable (transaction-based) | 2-4 weeks | ▢ Not started |
| L6.4 | Pension specialist relationship (for Form P templates) | Pension sharing annex requires specialist knowledge | Relationship + template commission £2-5k | 4-8 weeks | ▢ Not started |

**Total: ~£2,100-5,500 + 4-8 weeks lead time**
**Note: L6.1 and L6.4 are relationship work — start early, they take longest**

---

### 7. Legal Templates (consent order generation)

| # | Item | Why needed | Cost | Lead time | Status |
|---|------|-----------|------|-----------|--------|
| L7.1 | Commission consent order template library (5 core patterns) | The actual legal clause templates that generate court-ready orders | £3,000-8,000 | 4-6 weeks | ▢ Not started |
| L7.2 | Commission D81 template (all sections including Section 10 structure) | The statement of information template | Included in L7.1 | Included | ▢ Not started |
| L7.3 | Commission pension sharing annex template (Form P) | Provider-specific requirements | £1,000-3,000 (via pension specialist L6.4) | 4-6 weeks | ▢ Not started |
| L7.4 | Legal review of template logic (mapping rules) | Verify that data → clause mapping is legally sound | £1,000-2,000 | 2 weeks after templates | ▢ Not started |
| L7.5 | User testing of generated documents (show to family law practitioners) | Validate output quality before launch | Relationship (ask L6.1 firm) | 2 weeks | ▢ Not started |

**Total: ~£5,000-13,000 + 6-8 weeks lead time**
**Engage: Family law firm (different from regulatory — this is drafting, not advice)**
**Note: This is the most expensive single item but also the most commercially valuable. Good templates = high court approval rate = the product works.**

---

## Important but not launch-blocking

These should be done near launch but won't prevent going live if slightly delayed.

### 8. Commercial Setup

| # | Item | Why needed | Cost | Lead time | Status |
|---|------|-----------|------|-----------|--------|
| L8.1 | Stripe integration (payment processing) | Users need to pay at the Share/Settle gate | Engineering time + Stripe fees | 1-2 weeks | ▢ Not started |
| L8.2 | Pricing decision (validated by prototype testing) | Need a number before launch | Internal decision | Ongoing | ▢ Not started |
| L8.3 | Company incorporation (if not already) | Formal business entity | £12-50 (Companies House) | 1 day | ▢ Check status |
| L8.4 | Business bank account | Receive payments, pay suppliers | Free-£30/mo | 1-2 weeks | ▢ Not started |
| L8.5 | Accounting setup | MTD compliance, VAT registration if revenue >£90k | £500-1,500/year | 2-4 weeks | ▢ Not started |

### 9. Go-to-Market Preparation

| # | Item | Why needed | Cost | Lead time | Status |
|---|------|-----------|------|-----------|--------|
| L9.1 | Landing page live (public website) | Users need to find us | Engineering time (existing work) | 2-4 weeks | ⚠ Partially exists (V1) |
| L9.2 | SEO foundation | Long-term organic acquisition | Internal (content + technical) | 4-8 weeks to index | ▢ Not started |
| L9.3 | Content strategy (blog, guides, "how divorce works") | Trust building + SEO + user education | Internal | Ongoing | ▢ Not started |
| L9.4 | Trustpilot / review presence | Social proof | Free to set up | 1 day | ▢ Not started |
| L9.5 | Support infrastructure (email, chat, knowledge base) | Users need help | £50-200/mo (Intercom/Crisp) | 1-2 weeks | ▢ Not started |
| L9.6 | Beta user recruitment (5-10 couples) | First real cases through the system | Outreach (Mumsnet, Reddit, personal network) | 2-4 weeks | ▢ Not started |
| L9.7 | Analytics setup (PostHog or similar) | Track the metrics that matter (especially second-party join rate) | Free tier available | 1-2 days | ▢ Not started |
| L9.8 | Monitoring and alerting (uptime, errors) | Know when things break | Free tier (Sentry, Vercel analytics) | 1-2 days | ▢ Not started |

### 10. Operational Readiness

| # | Item | Why needed | Cost | Lead time | Status |
|---|------|-----------|------|-----------|--------|
| L10.1 | Incident response plan | What happens when something goes wrong (breach, outage, complaint) | Internal document | 1 day | ▢ Not started |
| L10.2 | Complaint handling procedure | Users will complain. Professional response needed. | Internal document | 1 day | ▢ Not started |
| L10.3 | Safeguarding policy | How we handle coercive control indicators, safety concerns, at-risk users | Internal document | 1-2 days | ▢ Not started |
| L10.4 | User-facing help documentation | FAQ, guides, "what happens when" explanations | Internal content | 2-4 weeks | ▢ Not started |
| L10.5 | Court fee handling (pass-through or collect?) | Decision on whether we collect the £593 or guide the user to pay directly | Policy decision | 1 day | ▢ Not started |

---

## Timeline: the critical path to launch

Assumes prototype validation complete and decision to build has been made.

```
WEEK 1-2:  Engage consultants (GDPR, tech lawyer, SRA solicitor)
           Start partnership outreach (law firm, Resolution)
           Start pension specialist search
           Company incorporation if needed

WEEK 2-4:  DPIA in progress
           ToS + disclaimers being drafted
           SRA consultation complete → file note written
           Template library commission begins
           ICO registration
           Resolution membership

WEEK 4-6:  DPIA complete
           ToS + disclaimers reviewed and finalised
           Insurance quotes obtained and policies bound
           Template library first draft delivered
           Security: 2FA implemented, audit logging, encryption verified

WEEK 6-8:  Penetration test conducted
           Remediation of any findings
           Template library legally reviewed
           Template output tested with L6.1 law firm
           Stripe integration
           Support infrastructure live

WEEK 8-10: All legal documents signed off
           All policies published (privacy, cookies, ToS, AUP)
           All insurance policies bound
           Beta users recruited (5-10 couples)
           Analytics + monitoring live

WEEK 10-12: Beta launch (private)
            First real cases through the system
            Monitor: second-party join rate, classification accuracy,
            document generation quality, user feedback

WEEK 12+:  Iterate on beta feedback
            Public launch when metrics are acceptable
```

---

## Total launch preparation cost

| Category | Cost range |
|---|---|
| GDPR & data protection | £3,000-6,000 |
| Legal: terms, disclaimers | £3,500-6,500 |
| Regulatory positioning | £800-1,400 |
| Insurance (year 1) | £2,800-7,500 |
| Security (penetration test) | £2,000-5,000 |
| Partnerships | £2,100-5,500 |
| Legal templates | £5,000-13,000 |
| **Total** | **£19,200-44,900** |

Plus ongoing: ~£5,000-14,000/year (insurance + subscriptions + Resolution + retained lawyer)

**This is the cost of launching responsibly.** Not the cost of building the product — that's engineering time. This is the cost of ensuring you can operate legally, safely, and defensibly from day 1.

---

## The one-page launch readiness dashboard

When tracking progress, this is what "ready" looks like:

```
LEGAL & REGULATORY
  ✓ DPIA completed and filed
  ✓ ICO registered
  ✓ Privacy policy published
  ✓ Terms of service published
  ✓ SRA positioning confirmed (file note on record)
  ✓ FCA positioning confirmed
  ✓ Disclaimer framework implemented in product

INSURANCE
  ✓ Cyber insurance bound
  ✓ Professional indemnity bound
  ✓ D&O insurance bound

SECURITY
  ✓ Penetration test passed (or issues remediated)
  ✓ 2FA implemented
  ✓ Encryption verified (at rest + transit)
  ✓ Audit logging active
  ✓ Breach notification procedure documented

PARTNERSHIPS
  ✓ One law firm signed for Tier 2 review
  ✓ Resolution membership active
  ✓ Tink production agreement signed
  ✓ Pension specialist engaged for templates

TEMPLATES
  ✓ 5 consent order patterns drafted and legally reviewed
  ✓ D81 template complete (including Section 10 structure)
  ✓ Pension sharing annex template complete
  ✓ Output tested with practising solicitor

COMMERCIAL
  ✓ Stripe payment processing live
  ✓ Pricing set
  ✓ Company incorporated

OPERATIONAL
  ✓ Support channel live
  ✓ Incident response plan documented
  ✓ Safeguarding policy documented
  ✓ Analytics and monitoring live
  ✓ Beta users recruited

METRICS INFRASTRUCTURE
  ✓ Second-party join rate tracking
  ✓ Consent order approval rate tracking
  ✓ Classification accuracy tracking
  ✓ User-reported outcome tracking
```

When all items show ✓: clear to launch.
