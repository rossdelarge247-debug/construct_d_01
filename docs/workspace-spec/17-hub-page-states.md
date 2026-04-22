# Hub Page — States & Section Cards

**Purpose:** The hub is the single page for the Prepare phase. This spec defines every state the page can be in and how section cards render at each fidelity level.

---

## Page structure

```
┌─────────────────────────────────────────────────┐
│ ☰  Overview                    [TITLE BAR]  [?] │ ← Hamburger nav, page title, optional CTA
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌─────────────────────────────────────────┐    │
│  │          HERO PANEL                     │    │ ← Dynamic component (see spec 16)
│  │                                         │    │
│  └─────────────────────────────────────────┘    │
│                                                 │
│  Financial picture summary    [fidelity label]  │ ← Section heading + readiness indicator
│                                                 │
│  ┌─────────────────────────────────────────┐    │
│  │  Income                  Manually input │    │ ← Section card
│  │  [content based on state]               │    │
│  └─────────────────────────────────────────┘    │
│  ┌─────────────────────────────────────────┐    │
│  │  Accounts                Manually input │    │ ← Section card
│  │  [content based on state]               │    │
│  └─────────────────────────────────────────┘    │
│  ┌─────────────────────────────────────────┐    │
│  │  Spending                Manually input │    │
│  │  [content based on state]               │    │
│  └─────────────────────────────────────────┘    │
│  ┌─────────────────────────────────────────┐    │
│  │  Property                Manually input │    │
│  │  [content based on state]               │    │
│  └─────────────────────────────────────────┘    │
│  ┌─────────────────────────────────────────┐    │
│  │  Other assets            Manually input │    │
│  │  [content based on state]               │    │
│  └─────────────────────────────────────────┘    │
│                                                 │
│  ┌─────────────────────────────────────────┐    │
│  │         + More to disclose              │    │ ← Add sections missed in config
│  └─────────────────────────────────────────┘    │
│                                                 │
│  ┌─────────────────────────────────────────┐    │
│  │  Your children                          │    │ ← Separated from financial sections
│  │  [content]                              │    │
│  │  [Begin plan]                           │    │
│  └─────────────────────────────────────────┘    │
│                                                 │
│  Life after separation    [fidelity gate label] │ ← Shown but gated until Draft
│  ┌─────────────────────────────────────────┐    │
│  │  [placeholder / locked content]         │    │
│  └─────────────────────────────────────────┘    │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

## Hub page states

### State A: First time — pre-configuration

The user has never visited the workspace. Redirect to the discovery/configuration flow (spec 15). The hub page is not shown until configuration is complete.

### State B: Post-configuration — no evidence yet (Screen 1 in wireframes)

**Title bar:** "Overview" + [TITLE BAR]

**Hero panel:** State 1 (ready for upload) — heading, lozenges, drag-and-drop zone.

**Fidelity label:** "Not yet ready for first mediation conversation"

**Section cards:** Personalised based on config. Three possible states per card:
1. **Has estimate from config** — shows the value with "(Your estimate)" label
2. **No data** — shows "Nothing to show yet, upload your evidence to quickly build your picture"
3. **Not relevant** — not shown (was not triggered by config)

**"Share & collaborate" button:** Not shown in title bar — fidelity too low.

### State C: Active upload/review — hero panel working (Screens 2a–4 in wireframes)

**Title bar:** "Overview : Preparation" — breadcrumb indicates active sub-state

**Hero panel:** States 2a through 4 (see spec 16 for full detail)

**Section cards:** **Faded to 70% opacity.** Visible but clearly secondary. Data does not update during the Q&A flow — only after the user completes the flow and clicks "Finished for now."

### State D: Post-upload — data populated (Screen 5 in wireframes)

**Title bar:** "Overview" + **"Share & collaborate"** button appears (if fidelity threshold reached)

**Hero panel:** Returns to State 1 (return visit variant):
- Heading: "Upload more evidence to complete your preparation"
- Lozenges: updated (ticks on uploaded, remaining still empty)
- Drag-and-drop zone: ready for next upload
- Info box: fidelity message if threshold reached

**Fidelity label:** Updated to reflect current state (e.g., "Ready for first mediation conversation" or "Not yet ready for first mediation conversation" depending on coverage)

**Section cards:** Full opacity, updated with confirmed data from Q&A flow.

### State E: Return visit — partial picture

Same as State D but the user is arriving fresh (new browser session). Hub loads with cumulative data from all previous sessions. Hero panel shows "Still to be uploaded" variant with remaining lozenges.

### State F: Fully evidenced — disclosure ready

All evidence uploaded and confirmed. All sections populated with evidenced data.

**Hero panel:** Lozenges all show ticks. Upload zone may still be present (user can always add more) but the primary message shifts:
> "Your financial picture is ready for formal disclosure. You can continue to refine or export now."

**Fidelity label:** "Ready for formal disclosure" or "Complete"

**"Share & collaborate" button:** Prominent in title bar.

**Export CTA:** Available — generates Form E-equivalent document at current fidelity.

---

## Section card anatomy

Every section card follows the same structure:

```
┌─────────────────────────────────────────────────┐
│  [Section name]                  [Manually input]│
│                                                  │
│  [Content — varies by state and fidelity]        │
│                                                  │
│  [CTA — varies by state]                         │
└─────────────────────────────────────────────────┘
```

### Section card content by state

**Empty (no data, no estimate):**
```
Income                               Manually input
Nothing to show yet, upload your evidence to quickly build your picture
```

**Estimate only (from config):**
```
Income                               Manually input
£3,200 gross per/month (Your estimate)
```

**Partial evidence (some data confirmed, gaps remain):**
```
Income                               Manually input
£3,218 net/month from ACME Ltd (Barclays statements, 2 of 12 months)
Child Benefit: £96.25/month from HMRC
                                     [Review details →]
```

**Fully evidenced:**
```
Income                               Manually input
£3,218 net/month (£4,100 gross) from ACME Ltd
Confirmed from: 12 months Barclays statements + 3 payslips + P60
Child Benefit: £96.25/month
                                     [Review details →]
```

### Section-specific content examples

**Accounts — post first upload:**
```
Accounts                             Manually input
Barclays joint current ****4521: £1,842 (2 of 12 months provided)
                                     [Review details →]
```

**Spending — post first upload:**
```
Spending                             Manually input
~£2,450/month across 8 categories (from 2 months of statements)
More months = more accurate averages
                                     [Review categories →]
```

**Property — estimate from config:**
```
Property                             Manually input
£500,000 property estimated
Mortgage: unknown — upload your mortgage statement
                                     [Add details →]
```

**Pensions — estimate with CETV tracking:**
```
Your pensions                        Manually input
Workplace pension (ACME Ltd scheme): ~£45,000 (Your estimate)
CETV requested: waiting (requested 3 April 2026)
                                     [Review details →]
```

---

## Fidelity label logic

The fidelity label appears next to "Financial picture summary" and on gated sections.

| Condition | Label |
|-----------|-------|
| Config only, no evidence, maybe some estimates | "Not yet ready for first mediation conversation" |
| At least one document processed, core sections have some data (income + spending or income + accounts) | "Ready for first mediation conversation" |
| Most sections evidenced, 6+ months of statements, pension CETV requested or provided | "Ready for formal disclosure (some items outstanding)" |
| All sections evidenced, 12 months statements, CETVs provided, all questions answered | "Complete — ready for consent order" |

The exact thresholds are configurable — these are indicative. The label should feel honest and specific, not gamified.

---

## "Share & collaborate" button logic

The button appears in the title bar when fidelity reaches "Ready for first mediation conversation" or above. Before that, the title bar shows only "Overview" and the hamburger menu.

When the button appears, it should feel like an achievement — the user has reached a meaningful milestone. The info box in the hero panel reinforces this: "You have enough to now share via the collaboration feature."

---

## "Life after separation" section

This section is always visible on the page but **gated** until Draft fidelity:

**Before Draft fidelity:**
```
Life after separation    Not yet ready for first mediation conversation
┌──────────────────────────────────────────────┐
│  ....                                        │
│  ....                                        │
└──────────────────────────────────────────────┘
```

Content is placeholder/locked. The fidelity label acts as the gate.

**After Draft fidelity:**
The section unlocks with a prompt:
> "Now that we can see your income and spending, we can help you think about what life looks like after separation."
> [Start this section →]

Clicking the CTA opens the wizard flow from spec 14 (Section 7: Life after separation).

---

## "Your children" section

Separated from the financial sections. Has its own CTA pattern:

**No data:**
```
Your children
Nothing to show yet, start building your financial picture now..
[Begin plan]
```

"Begin plan" opens a dedicated flow for children's arrangements — this is not a financial section, it's a parallel concern that feeds into V3/V4.

---

## "+ More to disclose"

A persistent button between the financial section cards and the children section. Handles cases where the user needs to add something not covered by config:

- Forgotten pension from old employer
- Recently discovered crypto holdings
- Asset they didn't think was relevant
- Newly acquired asset

Clicking opens a simple selector: "What would you like to add?" with the section types not currently shown on the hub. Adding a section creates a new card in the appropriate position.

---

## Responsive behaviour

**Desktop (>1024px):** Full-width layout as wireframed. Hero panel and section cards span the content area.

**Tablet (768–1024px):** Same layout, slightly compressed. Hero panel remains full-width.

**Mobile (<768px):** 
- Hero panel remains full-width, is the primary interaction surface
- Section cards stack vertically (already the case in the wireframes)
- Lozenges may wrap to multiple rows
- Drag-and-drop zone may need larger touch targets
- "Upload" link should be prominent since drag-and-drop is less natural on mobile
