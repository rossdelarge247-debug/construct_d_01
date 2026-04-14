# V2 Personalisation & Enhancement Opportunities — Spec 29

**Purpose:** Catalogue how V1 interview data + bank data intelligence can make V2 smarter, and prioritise the resulting backlog.

---

## 1. V1 → V2 Personalisation Matrix

### Section gating (show/hide based on V1 answers)

| V1 signal | V2 section | Behaviour |
|-----------|-----------|-----------|
| `has_children = false` | Children spending category | Hidden — never shown |
| `has_children = false` | Child Benefit in income questions | Skipped |
| `has_children = false` | Childcare in spending categorisation | Removed from categories |
| `has_children = false` | "Children's arrangements" in task list | Not shown |
| `property_status = 'rent'` | Property confirmation: mortgage Q&A | Replaced with rental questions |
| `property_status = 'rent'` | Financial summary: "Your property" card | Shows rental info, not equity |
| `relationship_status = 'cohabiting'` | Consent order references | Replaced with "separation agreement" |
| `process_status = 'formally_underway'` | Welcome carousel screen 1 | Skip or shorten intro content |

### Tone adaptation

| V1 signal | V2 tone adjustment |
|-----------|-------------------|
| `relationship_quality = 'amicable'` | Lighter, more collaborative language. "Share with your partner" not "Protect your position" |
| `relationship_quality = 'high_conflict'` | More cautious language. Emphasise documentation, evidence. "Your solicitor" not "your partner" |
| `relationship_quality = 'safety_concerns'` | Safety-first. No partner invitation prompts. Solicitor-only sharing. Exit page button visible |
| `financial_control_concerns = true` | Extra privacy messaging. "Is this device private?" checks. Session timeout warnings |

### Content prioritisation

| V1 signal | V2 prioritisation |
|-----------|------------------|
| `worries includes 'hidden_assets'` | After confirmation: "Signals we'd expect to see" checklist. Emphasise complete disclosure |
| `worries includes 'pension_loss'` | Pension section: extra education. CETV urgency messaging. PODE threshold flag |
| `worries includes 'not_enough'` | Post-spending: budget projection. "Based on your confirmed spending, you need £X/month" |
| `worries includes 'process_cost'` | Show cost savings throughout. "This step typically costs £X with a solicitor" |
| `priorities includes 'keep_home'` | Property section: affordability calculation. Mortgage capacity based on income |
| `priorities includes 'clean_break'` | Consent order education earlier. "A clean break requires a consent order" |
| `priorities includes 'children_stability'` | Children-related costs highlighted in spending. Child maintenance estimate |

### Cross-section intelligence from bank data

| Bank signal | Cross-section impact |
|-------------|---------------------|
| Child Benefit detected (HMRC) | Infer child count → calibrate children spending category → flag if no childcare detected |
| Childcare payments detected | Confirm children exist (if V1 skipped) → auto-populate spending |
| No mortgage payments found + V1 says "own" | Flag: "We can't see mortgage payments — is the property owned outright or paid from another account?" |
| Mortgage payment found + V1 says "rent" | Flag: "We found what looks like a mortgage payment to [payee]. Do you own a property?" |
| Self-employment income (HMRC SA) | Auto-trigger business section even if not detected in payee names |
| Multiple bank accounts | After accounts section: "You've connected [N] accounts. Are there any others?" |
| High savings transfers | Flag for ISA/investment classification |
| Crypto exchange payments | Auto-trigger other assets section with crypto pre-selected |

---

## 2. Smart Workspace Features (backlog)

### P1 — Enhance existing sections

| # | Feature | Description | V1 data used | Effort |
|---|---------|-------------|-------------|--------|
| 1 | **Conditional section gating** | Hide children/property sections based on V1 answers. No children = no children section ever | `has_children`, `property_status` | Small |
| 2 | **Child count inference** | Detect Child Benefit amount → calculate number of children → pre-fill | Bank data + V1 `has_children` | Small |
| 3 | **Partner awareness indicator** | Show in task list: "Your financial picture: 70% complete. Your partner's: unknown" | V1 partner awareness question | Small |
| 4 | **Contradiction detection** | V1 says "rent" but bank shows mortgage payments → gentle prompt to correct | V1 situation + bank data | Medium |
| 5 | **Missing signal prompts** | V1 says "has children" but no childcare in bank data → "Childcare paid from another account?" | V1 situation + bank data | Small |
| 6 | **Worry-driven education** | After relevant section, show targeted education based on V1 worries | V1 worries array | Small |

### P2 — New capabilities

| # | Feature | Description | V1 data used | Effort |
|---|---------|-------------|-------------|--------|
| 7 | **Budget projection** | Post-spending: "Based on confirmed spending of £X/month and income of £Y/month, here's your monthly position" | Bank data (income + spending) | Medium |
| 8 | **Child maintenance estimate** | CMS calculator: income + child count → estimated child maintenance | Bank income + V1 child count | Medium |
| 9 | **Pension priority flag** | If pension contributions detected + `pension_loss` worry → "Your pension could be your largest asset. Request a CETV now" with provider-specific guidance | Bank data + V1 worries | Small |
| 10 | **Property equity calculator** | Mortgage detected → "Your mortgage is £X/month to [provider]. What's the outstanding balance?" → equity estimate | Bank data + V1 property status | Medium |
| 11 | **Return visit experience** | When user returns: "Welcome back. Here's where you left off" with progress summary | Persisted state | Medium |
| 12 | **Solicitor cost comparison** | Throughout: "This section typically takes a solicitor 2 hours (£500-800). You've done it in 3 minutes" | Static data | Small |

### P3 — Tier 2 features (Share & Negotiate)

| # | Feature | Description | Effort |
|---|---------|-------------|--------|
| 13 | **Partner invitation** | Generate secure invite link. Partner gets their own Orientate + Prepare flow. Both sides visible to mediator | Large |
| 14 | **Mediator view** | Read-only structured summary with both parties' disclosures side by side | Large |
| 15 | **Proposal tracking** | Create proposal ("I keep the house, you keep the pension"). Counter-proposals. Track what's agreed | Large |
| 16 | **Mediation session prep** | Before mediation: "Here's what's agreed, here's what's outstanding, here are the key numbers" | Medium |

### P4 — Tier 3 features (Finalise)

| # | Feature | Description | Effort |
|---|---------|-------------|--------|
| 17 | **Structured summary export** | Plain language summary of all disclosed data, shareable with mediator/solicitor | Medium |
| 18 | **Form E equivalent** | Generate structured Form E from confirmed data. PDF export | Large |
| 19 | **D81 statement generator** | Pre/post settlement positions from agreed proposals | Large |
| 20 | **Consent order information pack** | Everything a solicitor needs to draft the consent order | Large |

---

## 3. Immediate Opportunities (this session / next session)

These can be implemented now with minimal effort:

### 3a. Conditional section gating

**What:** When V1 state is available, use it to gate workspace sections.

**Implementation:**
- Read V1 interview state from sessionStorage on workspace mount
- Pass `hasChildren`, `propertyStatus`, `relationshipQuality` as config
- In `confirmation-questions.ts`: skip children-related questions when `hasChildren = false`
- In task list: hide children task when `hasChildren = false`
- In spending categorisation: remove children category when `hasChildren = false`

### 3b. Missing signal prompts

**What:** After a section, check for contradictions between V1 answers and bank data.

**Examples:**
- V1 says children but no childcare in bank → "Is childcare paid from another account?"
- V1 says own property but no mortgage in bank → "Is the property owned outright?"
- V1 says rent but mortgage detected → "We found what looks like a mortgage payment"

**Implementation:**
- After each confirmation section summary, check V1 state against bank findings
- Add contradiction questions as additional steps at the end of relevant sections

### 3c. Partner awareness indicator

**What:** Simple visual in task list showing completeness of own vs partner picture.

**Implementation:**
- After bank connection: "Your financial picture: building..."
- After confirmation: "Your financial picture: confirmed"
- Always: "Your partner's picture: not yet shared" with Tier 2 upsell prompt

---

## 4. Design Principles for Personalisation

1. **Never ask what you already know.** If V1 says no children, don't ask about children anywhere in V2.
2. **Show, don't tell, then confirm.** Bank data first, V1 context second, direct question last resort.
3. **Contradictions are prompts, not errors.** "We noticed X but you said Y — which is right?" Not "Error: inconsistent data."
4. **Tone follows relationship quality.** Amicable → collaborative. Difficult → structured. High conflict → protective. Safety → cautious.
5. **Upsells are contextual, not interruptive.** Show Tier 2 value when partner data is missing, not as random banners.
6. **Every personalisation must be overridable.** V1 answers may be wrong or outdated. Always let the user correct.
