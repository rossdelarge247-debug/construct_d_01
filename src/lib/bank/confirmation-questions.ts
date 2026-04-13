// Generates confirmation questions from bank data per spec 22.
// Pure data logic — no React, no JSX.
//
// For each section (income, property, accounts, pensions, debts),
// looks at bank signals and produces the right questions + follow-ups.

import type { BankStatementExtraction } from '@/lib/ai/extraction-schemas'

// ═══ Types ═══

export type ConfirmationSectionKey = 'income' | 'property' | 'accounts' | 'pensions' | 'debts'

export interface ConfirmationOption {
  label: string
  value: string
}

export interface ConfirmationStep {
  id: string
  sectionKey: ConfirmationSectionKey
  sectionLabel: string
  type: 'question' | 'confirmation_message' | 'input'
  text: string
  subtext?: string
  options?: ConfirmationOption[]
  // For input type (property value)
  inputPrefix?: string
  inputPlaceholder?: string
  inputQualifiers?: ConfirmationOption[]
  // Show only when a previous answer matches (array = any of these values)
  showWhen?: { questionId: string; value: string | string[] }
}

export interface SectionSummaryFact {
  label: string
  source: 'bank' | 'self'
  gapMessage?: string
}

export interface SectionSummaryData {
  sectionKey: ConfirmationSectionKey
  sectionLabel: string
  heading: string
  facts: SectionSummaryFact[]
  calculatedValues?: { label: string; value: string }[]
  accordionLabel: string // e.g. "Income disclosed, ready for sharing & collaboration"
}

export const CONFIRMATION_SECTIONS: ConfirmationSectionKey[] = [
  'income', 'property', 'accounts', 'pensions', 'debts',
]

// ═══ Question generation ═══

export function generateSectionSteps(
  sectionKey: ConfirmationSectionKey,
  extractions: BankStatementExtraction[],
): ConfirmationStep[] {
  switch (sectionKey) {
    case 'income': return generateIncomeSteps(extractions)
    case 'property': return generatePropertySteps(extractions)
    case 'accounts': return generateAccountsSteps(extractions)
    case 'pensions': return generatePensionsSteps(extractions)
    case 'debts': return generateDebtsSteps(extractions)
  }
}

// ═══ Income (spec 22 §1, spec 25 screens 2c-a/b) ═══

function generateIncomeSteps(extractions: BankStatementExtraction[]): ConfirmationStep[] {
  const allIncome = extractions.flatMap((e) => e.income_deposits)
  const salary = allIncome.find((i) => i.type === 'employment')

  if (salary) {
    return [
      {
        id: 'income-salary',
        sectionKey: 'income',
        sectionLabel: 'Income',
        type: 'question',
        text: `We can see regular payments from ${salary.source}, is this your salary?`,
        options: [
          { label: 'Yes', value: 'yes' },
          { label: 'No', value: 'no' },
        ],
      },
      {
        id: 'income-salary-confirmed',
        sectionKey: 'income',
        sectionLabel: 'Income',
        type: 'confirmation_message',
        text: `OK then so your employer is ${salary.source}, you'll need to share your payslips for finalisation`,
        showWhen: { questionId: 'income-salary', value: 'yes' },
      },
      {
        id: 'income-not-salary',
        sectionKey: 'income',
        sectionLabel: 'Income',
        type: 'question',
        text: 'If these payments are not your salary, are they',
        options: [
          { label: 'Dividends from self employment', value: 'dividends' },
          { label: 'Rental income', value: 'rental' },
          { label: 'Money from family or friends', value: 'family' },
          { label: 'Other', value: 'other' },
        ],
        showWhen: { questionId: 'income-salary', value: 'no' },
      },
    ]
  }

  // No salary signal
  return [
    {
      id: 'income-none',
      sectionKey: 'income',
      sectionLabel: 'Income',
      type: 'question',
      text: "We can't see employment income. Are you currently...",
      options: [
        { label: 'Not working', value: 'not_working' },
        { label: 'Retired', value: 'retired' },
        { label: 'Paid in cash', value: 'cash' },
        { label: 'Income goes to a different account', value: 'different_account' },
      ],
    },
  ]
}

// ═══ Property (spec 22 §2) ═══
//
// Ladder:
//   1. Entry: mortgage detected → confirm, OR no signal → housing situation
//   2. Government scheme check (if mortgaged)
//   3. Shared ownership % (if applicable)
//   4. Sole / joint ownership
//   5. Property value
//   6. Mortgage balance (if mortgaged)
//   7. Help to Buy balance (if applicable)
//   8. Who lives there
//   9. Property status
//
// Cross-section impacts:
//   → Spending: expect council tax + buildings insurance if owns
//   → Debts: mortgage noted, don't re-ask
//   → Finalisation: mortgage statement + valuations

function generatePropertySteps(extractions: BankStatementExtraction[]): ConfirmationStep[] {
  const allPayments = extractions.flatMap((e) => e.regular_payments)
  const mortgage = allPayments.find((p) => p.likely_category === 'mortgage')
  const steps: ConfirmationStep[] = []

  // ── Entry question ──

  if (mortgage) {
    steps.push({
      id: 'property-mortgage',
      sectionKey: 'property',
      sectionLabel: 'Property',
      type: 'question',
      text: `£${mortgage.amount.toLocaleString()}/month to ${mortgage.payee}. Is this your mortgage?`,
      options: [
        { label: 'Yes, that\'s my mortgage', value: 'yes' },
        { label: 'No, I rent', value: 'rent' },
        { label: 'Something else', value: 'other' },
      ],
    })
  } else {
    steps.push({
      id: 'property-no-signal',
      sectionKey: 'property',
      sectionLabel: 'Property',
      type: 'question',
      text: "We didn't find mortgage or rent payments. What's your housing situation?",
      options: [
        { label: 'I own with a mortgage (paid elsewhere)', value: 'yes_mortgage' },
        { label: 'I own outright — no mortgage', value: 'yes_outright' },
        { label: 'I rent (paid from another account)', value: 'rent' },
        { label: 'Partner or family pays housing', value: 'partner_pays' },
        { label: 'Living with family or friends', value: 'family' },
      ],
    })
  }

  // ── Values for "owns property" condition ──
  const entryId = mortgage ? 'property-mortgage' : 'property-no-signal'
  const ownsValues = mortgage ? 'yes' : ['yes_mortgage', 'yes_outright']
  const hasMortgageValues = mortgage ? 'yes' : 'yes_mortgage'

  // ── Government scheme check (only if mortgaged) ──

  steps.push({
    id: 'property-scheme',
    sectionKey: 'property',
    sectionLabel: 'Property',
    type: 'question',
    text: 'Is there a government scheme on this property?',
    subtext: 'Help to Buy, shared ownership, and Right to Buy all affect your equity.',
    options: [
      { label: 'No, standard mortgage', value: 'standard' },
      { label: 'Help to Buy equity loan', value: 'help_to_buy' },
      { label: 'Shared ownership', value: 'shared_ownership' },
      { label: 'Right to Buy', value: 'right_to_buy' },
    ],
    showWhen: { questionId: entryId, value: hasMortgageValues },
  })

  // ── Shared ownership: what percentage do you own? ──

  steps.push({
    id: 'property-ownership-pct',
    sectionKey: 'property',
    sectionLabel: 'Property',
    type: 'question',
    text: 'What percentage of the property do you own?',
    subtext: 'This is the share you purchased — the rest is owned by the housing association.',
    options: [
      { label: '25%', value: '25' },
      { label: '40%', value: '40' },
      { label: '50%', value: '50' },
      { label: '75%', value: '75' },
      { label: 'Other', value: 'other' },
    ],
    showWhen: { questionId: 'property-scheme', value: 'shared_ownership' },
  })

  // ── Sole / joint ──

  steps.push({
    id: 'property-joint',
    sectionKey: 'property',
    sectionLabel: 'Property',
    type: 'question',
    text: 'Do you own this property...',
    options: [
      { label: 'In my name only', value: 'sole' },
      { label: 'Jointly with my partner', value: 'joint_partner' },
      { label: 'Jointly with someone else', value: 'joint_other' },
    ],
    showWhen: { questionId: entryId, value: ownsValues },
  })

  // ── Property value ──

  steps.push({
    id: 'property-value',
    sectionKey: 'property',
    sectionLabel: 'Property',
    type: 'input',
    text: 'Roughly, what is the property worth?',
    inputPrefix: '£',
    inputPlaceholder: 'e.g. 350,000',
    inputQualifiers: [
      { label: 'This is a rough estimate', value: 'estimate' },
      { label: 'Recently valued by an estate agent', value: 'valued' },
    ],
    showWhen: { questionId: entryId, value: ownsValues },
  })

  // ── Mortgage balance (only if mortgaged) ──

  steps.push({
    id: 'property-mortgage-balance',
    sectionKey: 'property',
    sectionLabel: 'Property',
    type: 'input',
    text: 'What is the outstanding mortgage balance?',
    subtext: 'An estimate is fine — we\'ll get the exact figure from a mortgage statement later.',
    inputPrefix: '£',
    inputPlaceholder: 'e.g. 220,000',
    showWhen: { questionId: entryId, value: hasMortgageValues },
  })

  // ── Help to Buy equity loan balance ──

  steps.push({
    id: 'property-htb-balance',
    sectionKey: 'property',
    sectionLabel: 'Property',
    type: 'input',
    text: 'What is the outstanding Help to Buy loan balance?',
    subtext: 'This is the government equity loan, separate from your mortgage.',
    inputPrefix: '£',
    inputPlaceholder: 'e.g. 60,000',
    showWhen: { questionId: 'property-scheme', value: 'help_to_buy' },
  })

  // ── Who lives there ──

  steps.push({
    id: 'property-occupation',
    sectionKey: 'property',
    sectionLabel: 'Property',
    type: 'question',
    text: 'Who currently lives in this property?',
    options: [
      { label: 'I do', value: 'me' },
      { label: 'My partner does', value: 'partner' },
      { label: 'We both still live there', value: 'both' },
      { label: 'Neither — it\'s empty or rented out', value: 'neither' },
    ],
    showWhen: { questionId: entryId, value: ownsValues },
  })

  // ── Property status ──

  steps.push({
    id: 'property-status',
    sectionKey: 'property',
    sectionLabel: 'Property',
    type: 'question',
    text: "What's the current situation with the property?",
    options: [
      { label: 'It\'s our family home', value: 'family_home' },
      { label: 'It\'s on the market', value: 'on_market' },
      { label: 'Sale agreed or under offer', value: 'under_offer' },
      { label: 'Being rented out since separation', value: 'rented_out' },
    ],
    showWhen: { questionId: entryId, value: ownsValues },
  })

  return steps
}

// ═══ Accounts (spec 22 §3, spec 25 screen 2h) ═══

function generateAccountsSteps(extractions: BankStatementExtraction[]): ConfirmationStep[] {
  const allPayments = extractions.flatMap((e) => e.regular_payments)
  const transfers = allPayments.filter((p) => p.likely_category === 'unknown' && p.confidence < 0.9)

  if (transfers.length > 0) {
    const transfer = transfers[0]
    return [{
      id: 'accounts-transfer',
      sectionKey: 'accounts',
      sectionLabel: 'Accounts',
      type: 'question',
      text: `What are the regular payments to ${transfer.payee}?`,
      options: [
        { label: 'Savings account', value: 'savings' },
        { label: 'ISA', value: 'isa' },
        { label: 'Pension', value: 'pension' },
        { label: 'Other', value: 'other' },
      ],
    }]
  }

  // No transfers — auto-complete
  return [{
    id: 'accounts-none',
    sectionKey: 'accounts',
    sectionLabel: 'Accounts',
    type: 'confirmation_message',
    text: 'We have all the account information we need from your bank connection.',
  }]
}

// ═══ Pensions (spec 22 §4, spec 25 screen 2g) ═══

function generatePensionsSteps(extractions: BankStatementExtraction[]): ConfirmationStep[] {
  const allPayments = extractions.flatMap((e) => e.regular_payments)
  const pension = allPayments.find((p) => p.likely_category === 'pension_contribution')

  if (pension) {
    return [{
      id: 'pensions-detected',
      sectionKey: 'pensions',
      sectionLabel: 'Pensions',
      type: 'question',
      text: `£${pension.amount}/month to ${pension.payee} — is this a pension contribution?`,
      options: [
        { label: 'Yes, pension', value: 'yes' },
        { label: 'No, it\'s insurance', value: 'insurance' },
        { label: 'Not sure', value: 'unsure' },
      ],
    }]
  }

  return [{
    id: 'pensions-no-signal',
    sectionKey: 'pensions',
    sectionLabel: 'Pensions',
    type: 'question',
    text: "We didn't see any pension payments, what's your pension situation?",
    subtext: 'Workplace pensions are often deducted before pay reaches your bank.',
    options: [
      { label: 'I have at least one private pension', value: 'has_pension' },
      { label: 'No private pensions', value: 'none' },
    ],
  }]
}

// ═══ Debts (spec 22 §5, spec 25 screen 2h) ═══

function generateDebtsSteps(extractions: BankStatementExtraction[]): ConfirmationStep[] {
  const allPayments = extractions.flatMap((e) => e.regular_payments)
  const debts = allPayments.filter((p) =>
    p.likely_category === 'loan_repayment'
  )

  if (debts.length > 0) {
    const debt = debts[0]
    return [{
      id: 'debts-detected',
      sectionKey: 'debts',
      sectionLabel: 'Debts',
      type: 'question',
      text: `£${debt.amount}/month to ${debt.payee}. Is this...`,
      options: [
        { label: 'Personal loan', value: 'personal_loan' },
        { label: 'Car finance', value: 'car_finance' },
        { label: 'Student loan', value: 'student_loan' },
        { label: 'Something else', value: 'other' },
      ],
    }]
  }

  return [{
    id: 'debts-no-signal',
    sectionKey: 'debts',
    sectionLabel: 'Debts',
    type: 'question',
    text: "We didn't see any obvious loan or credit card payments, do you have any debts?",
    options: [
      { label: 'Yes', value: 'yes' },
      { label: 'No', value: 'no' },
    ],
  }]
}

// ═══ Mini-summary generation ═══

export function generateSectionSummary(
  sectionKey: ConfirmationSectionKey,
  answers: Record<string, string>,
  extractions: BankStatementExtraction[],
): SectionSummaryData {
  switch (sectionKey) {
    case 'income': return generateIncomeSummary(answers, extractions)
    case 'property': return generatePropertySummary(answers, extractions)
    case 'accounts': return generateAccountsSummary(extractions)
    case 'pensions': return generatePensionsSummary(answers)
    case 'debts': return generateDebtsSummary(answers)
  }
}

function generateIncomeSummary(
  answers: Record<string, string>,
  extractions: BankStatementExtraction[],
): SectionSummaryData {
  const salary = extractions.flatMap((e) => e.income_deposits).find((i) => i.type === 'employment')
  const facts: SectionSummaryFact[] = []

  if (salary && answers['income-salary'] === 'yes') {
    facts.push({
      label: `You are employed by ${salary.source}`,
      source: 'bank',
    })
    facts.push({
      label: `You receive £${salary.amount.toLocaleString()} net monthly salary`,
      source: 'bank',
      gapMessage: 'When we get to finalisation, we will need your payslips and P60 for gross pay breakdown. We will add an action to your task list.',
    })
  }

  const benefits = extractions.flatMap((e) => e.income_deposits).filter((i) => i.type === 'benefits')
  for (const b of benefits) {
    facts.push({ label: `You receive £${b.amount}/month in ${b.source}`, source: 'bank' })
  }

  return {
    sectionKey: 'income',
    sectionLabel: 'Income',
    heading: "That's it for income",
    facts,
    accordionLabel: 'Income disclosed, ready for sharing & collaboration',
  }
}

function generatePropertySummary(
  answers: Record<string, string>,
  extractions: BankStatementExtraction[],
): SectionSummaryData {
  const mortgage = extractions.flatMap((e) => e.regular_payments).find((p) => p.likely_category === 'mortgage')
  const facts: SectionSummaryFact[] = []
  const calculated: { label: string; value: string }[] = []

  // ── Determine ownership from either entry path ──
  const ownsProperty =
    answers['property-mortgage'] === 'yes' ||
    answers['property-no-signal'] === 'yes_mortgage' ||
    answers['property-no-signal'] === 'yes_outright'
  const isRenting =
    answers['property-mortgage'] === 'rent' ||
    answers['property-no-signal'] === 'rent'

  const jointAnswer = answers['property-joint']
  const isJoint = jointAnswer === 'joint_partner'
  const scheme = answers['property-scheme']
  const ownershipPct = answers['property-ownership-pct'] ? parseInt(answers['property-ownership-pct'], 10) : null
  const propertyValue = answers['property-value'] ? parseInt(answers['property-value'].replace(/,/g, ''), 10) : null
  const mortgageBalance = answers['property-mortgage-balance'] ? parseInt(answers['property-mortgage-balance'].replace(/,/g, ''), 10) : null
  const htbBalance = answers['property-htb-balance'] ? parseInt(answers['property-htb-balance'].replace(/,/g, ''), 10) : null
  const occupation = answers['property-occupation']
  const status = answers['property-status']

  if (isRenting) {
    facts.push({ label: 'You rent your home — no property to disclose', source: 'self' })
    return {
      sectionKey: 'property',
      sectionLabel: 'Property',
      heading: "That's it for property",
      facts,
      accordionLabel: 'No property to disclose',
    }
  }

  if (!ownsProperty) {
    const situation = answers['property-no-signal']
    if (situation === 'partner_pays') {
      facts.push({ label: 'Your partner or family pays your housing costs', source: 'self' })
    } else if (situation === 'family') {
      facts.push({ label: 'You\'re living with family or friends', source: 'self' })
    }
    return {
      sectionKey: 'property',
      sectionLabel: 'Property',
      heading: "That's it for property",
      facts: facts.length > 0 ? facts : [{ label: 'No property to disclose', source: 'self' }],
      accordionLabel: 'No property to disclose',
    }
  }

  // ── Owns property ──

  // Ownership type
  const ownershipLabel = jointAnswer === 'sole' ? 'own' : jointAnswer === 'joint_partner' ? 'jointly own with your partner' : 'jointly own'
  const schemeLabel = scheme === 'shared_ownership' && ownershipPct ? ` (${ownershipPct}% shared ownership)` : scheme === 'help_to_buy' ? ' (Help to Buy)' : scheme === 'right_to_buy' ? ' (Right to Buy)' : ''
  const valueLabel = propertyValue ? `, estimated value £${propertyValue.toLocaleString()}` : ''
  facts.push({ label: `You ${ownershipLabel} a property${schemeLabel}${valueLabel}`, source: 'self' })

  // Mortgage balance
  if (mortgageBalance) {
    facts.push({ label: `Outstanding mortgage balance: £${mortgageBalance.toLocaleString()}`, source: mortgage ? 'bank' : 'self' })
  }

  // Help to Buy balance
  if (htbBalance) {
    facts.push({ label: `Outstanding Help to Buy loan: £${htbBalance.toLocaleString()}`, source: 'self' })
  }

  // Joint ownership note
  if (isJoint) {
    facts.push({ label: 'Jointly owned — the starting position in marriage is 50/50', source: 'self' })
  }

  // Occupation
  if (occupation === 'me') facts.push({ label: 'You currently live in the property', source: 'self' })
  else if (occupation === 'partner') facts.push({ label: 'Your partner currently lives in the property', source: 'self' })
  else if (occupation === 'both') facts.push({ label: 'You both currently live in the property', source: 'self' })
  else if (occupation === 'neither') facts.push({ label: 'The property is currently empty or rented out', source: 'self' })

  // Status
  if (status === 'on_market') facts.push({ label: 'The property is currently on the market', source: 'self' })
  else if (status === 'under_offer') facts.push({ label: 'Sale agreed or under offer', source: 'self' })
  else if (status === 'rented_out') facts.push({ label: 'The property is being rented out since separation', source: 'self' })

  // ── Equity calculation ──
  if (propertyValue) {
    let equity: number

    if (scheme === 'shared_ownership' && ownershipPct) {
      // Shared ownership: your share of value minus your mortgage
      const yourShare = Math.round(propertyValue * (ownershipPct / 100))
      equity = yourShare - (mortgageBalance ?? 0)
      calculated.push({
        label: `Your ${ownershipPct}% share is worth £${yourShare.toLocaleString()}, equity £${equity.toLocaleString()}`,
        value: `£${equity.toLocaleString()}`,
      })
    } else if (scheme === 'help_to_buy' && htbBalance) {
      // Help to Buy: value minus mortgage minus equity loan
      equity = propertyValue - (mortgageBalance ?? 0) - htbBalance
      calculated.push({
        label: `Estimated equity: £${equity.toLocaleString()} (after mortgage and Help to Buy loan)`,
        value: `£${equity.toLocaleString()}`,
      })
    } else if (mortgageBalance) {
      // Standard: value minus mortgage
      equity = propertyValue - mortgageBalance
      const label = equity >= 0
        ? `Estimated equity: £${equity.toLocaleString()}${isJoint ? ` — £${Math.round(equity / 2).toLocaleString()} each` : ''}`
        : `Negative equity: the mortgage exceeds the property value by £${Math.abs(equity).toLocaleString()}`
      calculated.push({ label, value: `£${equity.toLocaleString()}` })
    } else {
      // Own outright — full value is equity
      equity = propertyValue
      calculated.push({
        label: `No mortgage — full equity £${equity.toLocaleString()}${isJoint ? ` — £${Math.round(equity / 2).toLocaleString()} each` : ''}`,
        value: `£${equity.toLocaleString()}`,
      })
    }
  }

  // ── Gap messages ──
  if (mortgage) {
    facts.push({
      label: `Mortgage with ${mortgage.payee}`,
      source: 'bank',
      gapMessage: 'For finalisation, we\'ll need a mortgage statement for exact balance and terms. This estimate is fine for mediation.',
    })
  }

  if (answers['property-value-qualifier'] === 'estimate') {
    facts.push({
      label: 'Property value is an estimate',
      source: 'self',
      gapMessage: 'For finalisation, we\'ll need 3 estate agent valuations. This estimate is fine for mediation.',
    })
  }

  return {
    sectionKey: 'property',
    sectionLabel: 'Property',
    heading: "That's it for property",
    facts,
    calculatedValues: calculated.length > 0 ? calculated : undefined,
    accordionLabel: ownsProperty ? 'Property disclosed, ready for sharing & collaboration' : 'No property to disclose',
  }
}

function generateAccountsSummary(extractions: BankStatementExtraction[]): SectionSummaryData {
  const facts: SectionSummaryFact[] = []

  for (const ext of extractions) {
    facts.push({
      label: `${ext.provider} ${ext.account_type} account xxxx${ext.account_number_last4 ?? '****'}, balance £${(ext.closing_balance ?? 0).toLocaleString()}`,
      source: 'bank',
    })
  }

  return {
    sectionKey: 'accounts',
    sectionLabel: 'Accounts',
    heading: "That's it for accounts",
    facts,
    accordionLabel: 'Accounts disclosed, ready for sharing & collaboration',
  }
}

function generatePensionsSummary(answers: Record<string, string>): SectionSummaryData {
  const hasPension = answers['pensions-detected'] === 'yes' || answers['pensions-no-signal'] === 'has_pension'
  const facts: SectionSummaryFact[] = []

  if (hasPension) {
    facts.push({
      label: 'You have at least one private pension',
      source: 'self',
      gapMessage: 'You will need to request a CETV (Cash Equivalent Transfer Value) from your pension provider. This can take 6-8 weeks, so we recommend starting now. We will add an action to your task list.',
    })
  } else {
    facts.push({ label: 'No private pensions to disclose', source: 'self' })
  }

  return {
    sectionKey: 'pensions',
    sectionLabel: 'Pensions',
    heading: "That's it for pensions",
    facts,
    accordionLabel: hasPension ? 'Pensions disclosed, ready for sharing & collaboration' : 'No private pensions to disclose',
  }
}

function generateDebtsSummary(answers: Record<string, string>): SectionSummaryData {
  const hasDebts = answers['debts-detected'] !== undefined || answers['debts-no-signal'] === 'yes'
  const facts: SectionSummaryFact[] = []

  if (hasDebts) {
    facts.push({
      label: 'You have debts to disclose',
      source: 'self',
      gapMessage: 'When we get to finalisation, we will need statements showing the outstanding balance for each debt. We will add an action to your task list.',
    })
  } else {
    facts.push({ label: 'No debts to disclose', source: 'self' })
  }

  return {
    sectionKey: 'debts',
    sectionLabel: 'Debts',
    heading: "That's it for debts",
    facts,
    accordionLabel: hasDebts ? 'Debts disclosed, ready for sharing & collaboration' : 'No debts to disclose',
  }
}
