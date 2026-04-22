# Spec 58 — Flow Map 2: Profiling (Pre-Bank-Connection)

**Date:** 17 April 2026
**Purpose:** The 6 profiling questions, their follow-ups, forks, and routes. Complete explicit question inventory for the onboarding setup stage.

**Entry:** From 2.2 Stage router (via "decided to separate" or similar paths)
**Exit:** To bank connection (3.1)

---

## Profiling structure

Each question is one screen. Progress stepper (1 of 6) at top. Inline follow-up on some selections. Each screen has [Save & continue later].

---

## Screen 3.1 — Q1: Housing

**Question:** "Do you own your home or rent?"

**Answers:**
| Answer | Follow-up |
|---|---|
| Own with a mortgage | 3.1a "Who is your mortgage with?" |
| Own outright (no mortgage) | None → next |
| Rent | 3.1b "Who do you pay rent to?" |
| Living with family or friends | None → next |
| Other | 3.1c "Tell us briefly" (text) |

**Follow-up 3.1a:** Dropdown with common UK lenders + free text
- Halifax, Nationwide, Santander, NatWest, HSBC, Barclays, TSB, Lloyds, Yorkshire BS, Coventry BS, Virgin Money, Metro Bank, Accord, Kensington, other

**Follow-up 3.1b:** Free text (letting agent or landlord name)

**Follow-up 3.1c:** Short free text description

**Gates:**
- Owner → property section active, expect mortgage/council tax
- Renter → property section simplified, expect rent
- Family → property section minimal, no housing signal
- Owner outright → expect no mortgage signal; property value prompt

---

## Screen 3.2 — Q2: Employment

**Question:** "What's your employment situation?"

**Answers:**
| Answer | Follow-up |
|---|---|
| Employed (PAYE) | None → next |
| Self-employed or company director | 3.2a Enhanced self-employment path |
| Part-time employed | None → next |
| Retired | None → next |
| Not currently working | None → next |
| Full-time parent or carer | None → next |

**Follow-up 3.2a (Self-employed enhanced):**
- Q: Company name — free text
- Q: Structure — radio (sole trader / limited company / partnership)
- Q: How do you pay yourself — checkboxes (salary / dividends / both / drawings)

**Gates:**
- PAYE → expect salary signal, workplace pension at source
- Self-employed → business section unlocked, DLA prompt, HMRC SA expected, tax return needed
- Retired → pension income expected, no salary expected
- Not working → no income signal is normal
- Carer → no income signal normal

---

## Screen 3.3 — Q3: Vehicles

**Question:** "Do you have any vehicles?"

**Answers:**
| Answer | Follow-up |
|---|---|
| Yes, one | 3.3a "Finance details?" |
| Yes, more than one | 3.3a for each vehicle |
| No | None → next |

**Follow-up 3.3a (Per vehicle):**
- Q: Is there any finance on your vehicle? — radio (yes / no — owned outright / not sure)
- If yes: "Who is the finance with?" — common providers + free text
  - Common: BMW Financial, VW Finance, Black Horse, Motonovo, Startline, PCP, HP, Blue Motor, Moneybarn, Hitachi, Creation, Novuna

**Gates:**
- Yes + finance → pre-link loan signal to vehicle
- Yes + outright → car is pure asset
- No → skip vehicle questions, large payments less likely to be car

---

## Screen 3.4 — Q4: Children

**Question:** "Do you have children under 18?"

**Answers:**
| Answer | Follow-up |
|---|---|
| No | None → next |
| Yes | 3.4a Count |

**Follow-up 3.4a:**
- Q: How many? — radio (1 / 2 / 3 / 4+)

**Gates:**
- Children declared → validates Child Benefit inference, childcare category expected, children section active
- No children → skip children spending section, no child maintenance prompt

**Potential future follow-up (not in MVP):**
- Q: Ages (to inform maintenance and arrangement discussions)

---

## Screen 3.5 — Q5: Pensions

**Question:** "Do you have any pensions?"

**Answers:**
| Answer | Follow-up |
|---|---|
| Yes, workplace pension | 3.5a "Provider?" (optional) |
| Yes, personal/private pension | 3.5a |
| Yes, more than one | 3.5a |
| Already drawing a pension | None → next |
| Not sure | None → next |
| No | None → next |

**Follow-up 3.5a:**
- Q: Do you know who your pension is with? — optional free text
- Note: "Skip if unsure"

**Gates:**
- Workplace → "no pension visible" becomes expected (at source)
- Personal → expect visible pension contribution
- Drawing → pension as income, not asset
- Provider known → potential disambiguation aid (e.g. Aviva = pension vs insurance)

---

## Screen 3.6 — Q6: Other assets checklist

**Question:** "Do you have any of these? Tick all that apply."

**Checkboxes:**
- Savings accounts or ISAs
- Investments (stocks, funds, bonds)
- Cryptocurrency
- Life insurance policies
- Valuable items worth over £500 (jewellery, watches, art)
- Money someone owes you
- None of these

**Gates:**
- Each ticked → relevant section active in confirmation flow
- Unticked → section skipped (no false-positive questions)
- Life insurance → insurance disambiguation includes "life" as option
- Crypto → even if no exchange detected, ask for holdings value

---

## Screen 3.7 — Profiling complete, transition

**Content:** "Got it. Based on what you've told us..."
Shows summary of profile answers + "Now let's connect your bank..."

**Actions:**
- [Connect your bank →] → 4.1 Bank selection (covered in spec 59)
- [Prefer not to connect? Enter details manually] → 4.2 Manual entry path
- [Save and continue later] → saves state

---

## Forks in profiling

The flow is mostly linear (6 sequential questions) but with inline follow-ups. Key branching:

| Profile answer combination | Downstream effect |
|---|---|
| Self-employed + "dividends" | Enhanced income flow in Phase A (salary vs dividends disambiguation) |
| Multiple vehicles | Multiple vehicle cards in the document |
| "No" to everything in Q6 | Other assets section hidden throughout |
| "Not sure" on pensions | Default pension discovery flow (no profile context) |
| Family or "other" housing | Housing section minimal, no mortgage/rent signals expected |

---

## Explicit question inventory for this phase

Total questions: **6 primary + up to 7 follow-ups = 13 distinct questions**

| # | Question | Type | Required? | Has follow-up? |
|---|---|---|---|---|
| Q1 | Do you own your home or rent? | Radio | Yes | Conditional |
| Q1a | Who is your mortgage with? | Dropdown + text | If owns with mortgage | — |
| Q1b | Who do you pay rent to? | Text | If rents | — |
| Q1c | Tell us briefly [other] | Text | If other | — |
| Q2 | What's your employment situation? | Radio | Yes | Conditional |
| Q2a | Company name | Text | If self-employed | — |
| Q2a | Business structure | Radio | If self-employed | — |
| Q2a | How do you pay yourself? | Checkboxes | If self-employed | — |
| Q3 | Do you have any vehicles? | Radio | Yes | Conditional |
| Q3a | Finance on vehicle? Provider? | Radio + dropdown | Per vehicle | — |
| Q4 | Do you have children under 18? | Radio | Yes | Conditional |
| Q4a | How many? | Radio | If yes | — |
| Q5 | Do you have any pensions? | Radio | Yes | Conditional |
| Q5a | Who is your pension with? | Text (optional) | If yes | — |
| Q6 | Asset checklist | Checkboxes | Yes | — |

---

## Total screens: ~7 (with inline follow-ups, not separate screens)

Fast-pace design: no screen should take >30 seconds. Target total time: 3 minutes happy path, 5-6 minutes with considered answers and follow-ups.
