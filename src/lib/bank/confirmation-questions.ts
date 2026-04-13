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
  // Show only when a previous answer matches
  showWhen?: { questionId: string; value: string }
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

// ═══ Property (spec 22 §2, spec 25 screens 2e-a/b/c, 2f, 2g) ═══

function generatePropertySteps(extractions: BankStatementExtraction[]): ConfirmationStep[] {
  const allPayments = extractions.flatMap((e) => e.regular_payments)
  const mortgage = allPayments.find((p) => p.likely_category === 'mortgage')
  const steps: ConfirmationStep[] = []

  if (mortgage) {
    // Strong signal — known lender
    steps.push({
      id: 'property-mortgage',
      sectionKey: 'property',
      sectionLabel: 'Property',
      type: 'question',
      text: `£${mortgage.amount.toLocaleString()} goes to ${mortgage.payee} on the 1st of each month. Is this your mortgage?`,
      options: [
        { label: 'Yes', value: 'yes' },
        { label: 'No, I rent', value: 'rent' },
        { label: 'Something else', value: 'other' },
      ],
    })
  } else {
    // No signal
    steps.push({
      id: 'property-no-signal',
      sectionKey: 'property',
      sectionLabel: 'Property',
      type: 'question',
      text: "We didn't detect anything that looked like a mortgage payment, do you own any property?",
      options: [
        { label: 'Yes', value: 'yes' },
        { label: 'No', value: 'no' },
      ],
    })
  }

  // Follow-ups if mortgage/ownership confirmed
  const mortgageQuestionId = mortgage ? 'property-mortgage' : 'property-no-signal'

  steps.push({
    id: 'property-joint',
    sectionKey: 'property',
    sectionLabel: 'Property',
    type: 'question',
    text: 'Do you jointly own your property with your spouse/partner?',
    options: [
      { label: 'Yes', value: 'yes' },
      { label: 'No', value: 'no' },
    ],
    showWhen: { questionId: mortgageQuestionId, value: 'yes' },
  })

  steps.push({
    id: 'property-value',
    sectionKey: 'property',
    sectionLabel: 'Property',
    type: 'input',
    text: 'What is the current market value of your property?',
    inputPrefix: '£',
    inputPlaceholder: 'e.g. 500,000',
    inputQualifiers: [
      { label: 'This is an estimate', value: 'estimate' },
      { label: 'I recently had my property valued by an estate agent', value: 'valued' },
    ],
    showWhen: { questionId: mortgageQuestionId, value: 'yes' },
  })

  steps.push({
    id: 'property-mortgage-balance',
    sectionKey: 'property',
    sectionLabel: 'Property',
    type: 'input',
    text: 'What is your estimated outstanding mortgage balance?',
    inputPrefix: '£',
    inputPlaceholder: 'e.g. 320,000',
    showWhen: { questionId: mortgageQuestionId, value: 'yes' },
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

  const ownsProperty = answers['property-mortgage'] === 'yes' || answers['property-no-signal'] === 'yes'
  const isJoint = answers['property-joint'] === 'yes'
  const propertyValue = answers['property-value'] ? parseInt(answers['property-value'].replace(/,/g, ''), 10) : null
  const mortgageBalance = answers['property-mortgage-balance'] ? parseInt(answers['property-mortgage-balance'].replace(/,/g, ''), 10) : null

  if (ownsProperty) {
    const jointLabel = isJoint ? 'jointly own' : 'own'
    const valueLabel = propertyValue ? ` estimated value £${propertyValue.toLocaleString()}` : ''
    facts.push({ label: `You ${jointLabel} a property${valueLabel}`, source: 'self' })
  }

  if (mortgageBalance) {
    facts.push({
      label: `You have an estimated mortgage balance of £${mortgageBalance.toLocaleString()}`,
      source: 'self',
    })
    if (isJoint) {
      facts.push({ label: 'You share the ownership of this property, the starting position for marriage is 50/50', source: 'self' })
    }
  }

  if (mortgage) {
    facts.push({
      label: `You have a mortgage with ${mortgage.payee}`,
      source: 'bank',
      gapMessage: 'When we get to finalisation, we will need a mortgage statement for the exact balance and terms, but this estimate is fine for the mediation process. We will add an action to your task list.',
    })
  }

  if (propertyValue && mortgageBalance) {
    const estimatedEquity = propertyValue - mortgageBalance
    if (estimatedEquity > 0) {
      const perPerson = isJoint ? Math.round(estimatedEquity / 2) : estimatedEquity
      calculated.push({
        label: `Your property has an estimated equity value of £${estimatedEquity.toLocaleString()}${isJoint ? ` — £${perPerson.toLocaleString()} each` : ''}`,
        value: `£${estimatedEquity.toLocaleString()}`,
      })
    }
  }

  if (propertyValue && answers['property-value-qualifier'] === 'estimate') {
    facts.push({
      label: 'Property value is an estimate',
      source: 'self',
      gapMessage: 'When we get to finalisation, we will need ideally 3 separate property valuations from different estate agents. This estimate is fine for mediation, we will add an action to your task list.',
    })
  }

  return {
    sectionKey: 'property',
    sectionLabel: 'Property',
    heading: "That's it for property",
    facts,
    calculatedValues: calculated.length > 0 ? calculated : undefined,
    accordionLabel: 'Property disclosed, ready for sharing & collaboration',
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
