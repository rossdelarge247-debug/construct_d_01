// Transforms AI pipeline extraction results into hero panel Q&A format
// Bridge between pipeline.ts (typed extraction) and use-hub.ts (UI state)
//
// Spec 13 decision tree logic lives HERE, not in the AI prompt.
// AI extracts pure financial facts. This module generates:
// - Auto-confirm items (confidence >= 0.95 and unambiguous)
// - Clarification questions (deterministic, from spec 13 signal→question map)
// - Gap detection (checks what's present vs what Form E requires)

import type {
  AutoConfirmItem,
  ClarificationQuestion,
  FinancialItem,
  SectionKey,
} from '@/types/hub'

import type {
  BankStatementExtraction,
  PayslipExtraction,
  MortgageStatementExtraction,
  PensionCETVExtraction,
  SavingsStatementExtraction,
  CreditCardStatementExtraction,
  P60Extraction,
  DocumentClassification,
} from './extraction-schemas'

import type { ExtractionResult } from './pipeline'

// Confidence thresholds (from research implications — conservative for financial disclosure)
const AUTO_CONFIRM_THRESHOLD = 0.95
const CLARIFICATION_THRESHOLD = 0.80

export interface TransformedResult {
  autoConfirmItems: AutoConfirmItem[]
  questions: ClarificationQuestion[]
  financialItems: FinancialItem[]
  processingMessages: string[]
}

export function transformExtractionResult(
  classification: DocumentClassification,
  extraction: ExtractionResult | null,
): TransformedResult {
  if (!extraction) {
    return { autoConfirmItems: [], questions: [], financialItems: [], processingMessages: [] }
  }

  switch (classification.document_type) {
    case 'bank_statement':
      return transformBankStatement(extraction as BankStatementExtraction)
    case 'payslip':
      return transformPayslip(extraction as PayslipExtraction)
    case 'mortgage_statement':
      return transformMortgageStatement(extraction as MortgageStatementExtraction)
    case 'pension_cetv':
      return transformPensionCETV(extraction as PensionCETVExtraction)
    case 'savings_statement':
      return transformSavingsStatement(extraction as SavingsStatementExtraction)
    case 'credit_card_statement':
      return transformCreditCardStatement(extraction as CreditCardStatementExtraction)
    case 'p60':
    case 'tax_return':
      return transformP60(extraction as P60Extraction)
    default:
      return transformBankStatement(extraction as BankStatementExtraction)
  }
}

// ═══ Bank statement transformer ═══

function transformBankStatement(data: BankStatementExtraction): TransformedResult {
  const autoConfirmItems: AutoConfirmItem[] = []
  const questions: ClarificationQuestion[] = []
  const financialItems: FinancialItem[] = []
  const now = new Date().toISOString()

  const processingMessages = [
    `Reading your ${data.provider} statement...`,
    data.income_deposits.length > 0
      ? `Found ${data.income_deposits.length} income source${data.income_deposits.length !== 1 ? 's' : ''}...`
      : 'Analysing transactions...',
    `Categorising your spending across ${data.spending_categories.length} categories...`,
  ]

  // ═══ Income: spec 13 auto-confirm rules ═══
  // Employment with named employer + consistent amount = auto-confirm
  // Benefits (HMRC/DWP) with known CB amounts = auto-confirm
  // Everything else = clarify
  for (const income of data.income_deposits) {
    const id = `income-${income.source.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}`
    const sourceDesc = `${formatCurrency(income.amount)}/${income.period} from ${income.source}`

    if (income.confidence >= AUTO_CONFIRM_THRESHOLD && (income.type === 'employment' || income.type === 'benefits')) {
      const label = income.type === 'employment'
        ? `Monthly salary: ${formatCurrency(income.amount)} net from ${income.source}`
        : `${income.source}: ${formatCurrency(income.amount)}/month`
      autoConfirmItems.push({ id, label, detail: `Form E ${income.type === 'employment' ? '2.15' : '2.15-2.20'}`, accepted: true })
      financialItems.push({
        id: `fi-${id}`, sectionKey: 'income',
        label: income.type === 'employment' ? `Salary from ${income.source}` : income.source,
        value: income.amount, period: income.period, ownership: 'yours', confidence: 'confirmed',
        sourceDocumentId: null, sourceDescription: sourceDesc,
        isInherited: false, isPreMarital: false, asAtDate: now, createdAt: now, updatedAt: now,
      })
    } else {
      // Spec 13: varying income or low confidence → clarify type
      questions.push({
        id, questionText: `We found regular deposits of ${sourceDesc}. What is this income?`,
        reasoning: null,
        options: [
          { label: 'Employment salary', value: 'employment' },
          { label: 'Self-employment income', value: 'self_employment' },
          { label: 'Benefits', value: 'benefits' },
          { label: 'Rental income', value: 'rental' },
          { label: 'Something else', value: 'other' },
        ],
        primaryOption: null, secondaryLabel: "I'm not sure", formEField: '2.15-2.20',
        answered: false, answer: null,
      })
    }
  }

  // ═══ Payments: spec 13 decision tree ═══
  for (const payment of data.regular_payments) {
    const id = `payment-${payment.payee.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}`
    const categoryLabel = CATEGORY_LABELS[payment.likely_category] || payment.likely_category
    const paymentDesc = `${formatCurrency(payment.amount)}/${payment.frequency} to ${payment.payee}`

    if (payment.confidence >= AUTO_CONFIRM_THRESHOLD) {
      // High confidence — auto-confirm (spec 13: obvious items)
      autoConfirmItems.push({ id, label: `${categoryLabel}: ${paymentDesc}`, detail: `Form E ${getFormEField(payment.likely_category)}`, accepted: true })
    } else {
      // Spec 13 decision tree: generate question based on category + signal
      const question = generatePaymentQuestion(payment)
      if (question) {
        questions.push({ id, ...question, answered: false, answer: null })
      }
    }
  }

  // ═══ Spec 13: Joint account detection ═══
  if (data.is_joint) {
    questions.push({
      id: `joint-account-${Date.now()}`,
      questionText: `This account has two names.${data.joint_holder_name ? ` (${data.joint_holder_name})` : ''} Is this a joint account with your partner?`,
      reasoning: null,
      options: [
        { label: 'Yes, joint with partner', value: 'joint_partner' },
        { label: 'No, it\'s sole', value: 'not_joint' },
      ],
      primaryOption: 'Yes, joint with partner',
      secondaryLabel: 'No, it\'s sole',
      formEField: '2.3',
      answered: false, answer: null,
    })
  }

  // ═══ Spec 13: Spending total confirmation ═══
  if (data.spending_categories.length > 0) {
    const totalSpending = data.spending_categories.reduce((sum, c) => sum + c.monthly_average, 0)
    questions.push({
      id: `spending-total-${Date.now()}`,
      questionText: `We've categorised your monthly spending as roughly ${formatCurrency(totalSpending)}. Does that feel about right?`,
      reasoning: null,
      options: [
        { label: 'That sounds right', value: 'correct' },
        { label: 'Let me review the categories', value: 'review' },
      ],
      primaryOption: 'That sounds right',
      secondaryLabel: 'Let me review the categories',
      formEField: '3.1',
      answered: false, answer: null,
    })
  }

  // ═══ Spec 13: Gap detection (app logic, not AI) ═══
  const hasEmploymentIncome = data.income_deposits.some(i => i.type === 'employment')
  const hasPensionContrib = data.regular_payments.some(p => p.likely_category === 'pension_contribution')
  const hasCouncilTax = data.regular_payments.some(p => p.likely_category === 'council_tax')

  if (hasEmploymentIncome && !hasPensionContrib) {
    questions.push({
      id: `gap-pension-${Date.now()}`,
      questionText: "We didn't find pension contributions in this account. Are they deducted from your salary before it reaches your bank?",
      reasoning: null,
      options: [
        { label: 'Yes, deducted at source', value: 'deducted' },
        { label: 'No pension', value: 'none' },
        { label: 'Paid from another account', value: 'other_account' },
        { label: "Don't know", value: 'unknown' },
      ],
      primaryOption: null, secondaryLabel: "I'll answer this later",
      formEField: '2.13', answered: false, answer: null,
    })
  }

  if (!hasCouncilTax) {
    questions.push({
      id: `gap-council-tax-${Date.now()}`,
      questionText: "We didn't find council tax payments. Do you pay this from a different account?",
      reasoning: null,
      options: [
        { label: 'Different account', value: 'other_account' },
        { label: 'Included in rent', value: 'in_rent' },
        { label: "Don't pay council tax", value: 'exempt' },
        { label: 'Partner pays', value: 'partner' },
      ],
      primaryOption: null, secondaryLabel: "I'll answer this later",
      formEField: '3.1', answered: false, answer: null,
    })
  }

  // ═══ Spec 13: Notable transaction signals ═══
  for (const notable of data.notable_transactions) {
    const flagLower = notable.reason_flagged.toLowerCase()
    if (flagLower.includes('crypto')) {
      questions.push({
        id: `notable-crypto-${Date.now()}`,
        questionText: `We found payments to ${notable.description}. Do you hold cryptocurrency?`,
        reasoning: null,
        options: [
          { label: 'Yes', value: 'yes' },
          { label: "No, I've sold it all", value: 'sold' },
          { label: "I'd rather not say right now", value: 'skip' },
        ],
        primaryOption: null, secondaryLabel: "I'll answer this later",
        formEField: '2.4/2.9', answered: false, answer: null,
      })
    }
  }

  return { autoConfirmItems, questions, financialItems, processingMessages }
}

// ═══ Spec 13 payment question generator ═══
// Deterministic: signal → question. No AI reasoning needed.

function generatePaymentQuestion(payment: { payee: string; amount: number; frequency: string; confidence: number; likely_category: string }): Omit<ClarificationQuestion, 'id' | 'answered' | 'answer'> | null {
  const amt = formatCurrency(payment.amount)

  switch (payment.likely_category) {
    case 'mortgage':
    case 'rent':
      return {
        questionText: `${amt} goes to ${payment.payee} each month. Is this your mortgage?`,
        reasoning: null,
        options: [
          { label: 'Mortgage', value: 'mortgage' },
          { label: 'Rent', value: 'rent' },
          { label: 'Something else', value: 'other' },
        ],
        primaryOption: 'Mortgage', secondaryLabel: 'Something else',
        formEField: '3.1 + 2.1',
      }

    case 'insurance':
    case 'pension_contribution':
      return {
        questionText: `${amt}/month to ${payment.payee}. Is this a pension contribution or insurance?`,
        reasoning: null,
        options: [
          { label: 'Pension', value: 'pension_contribution' },
          { label: 'Life insurance', value: 'life_insurance' },
          { label: 'Home insurance', value: 'home_insurance' },
          { label: 'Car insurance', value: 'car_insurance' },
          { label: 'Other', value: 'other' },
        ],
        primaryOption: null, secondaryLabel: 'Something else',
        formEField: payment.likely_category === 'pension_contribution' ? '2.13' : '3.1',
      }

    case 'unknown':
      // Standing order to a person — spec 13 catch-all
      return {
        questionText: `${amt} goes to ${payment.payee} each month. What is this?`,
        reasoning: null,
        options: [
          { label: 'Childcare', value: 'childcare' },
          { label: 'Rent to landlord', value: 'rent' },
          { label: 'Maintenance payment', value: 'child_maintenance' },
          { label: 'Loan repayment', value: 'loan_repayment' },
          { label: 'Something else', value: 'other' },
        ],
        primaryOption: null, secondaryLabel: 'Something else',
        formEField: '3.1',
      }

    default:
      // Below threshold but category is clear — still auto-confirm
      return null
  }
}

// ═══ Payslip transformer ═══

function transformPayslip(data: PayslipExtraction): TransformedResult {
  const autoConfirmItems: AutoConfirmItem[] = []
  const questions: ClarificationQuestion[] = []
  const financialItems: FinancialItem[] = []
  const now = new Date().toISOString()

  const processingMessages = [
    `Reading your payslip from ${data.employer}...`,
    'Extracting income details...',
  ]

  // Payslips are structured — most fields auto-confirm
  autoConfirmItems.push({
    id: `payslip-income-${Date.now()}`,
    label: `Salary from ${data.employer}: ${formatCurrency(data.gross_pay)} gross, ${formatCurrency(data.net_pay)} net`,
    detail: `Tax: ${formatCurrency(data.tax_deducted)}, NI: ${formatCurrency(data.national_insurance)}${data.tax_code ? `, Tax code: ${data.tax_code}` : ''}`,
    accepted: true,
  })

  financialItems.push({
    id: `fi-payslip-income-${Date.now()}`,
    sectionKey: 'income',
    label: `Salary from ${data.employer}`,
    value: data.net_pay,
    period: 'monthly',
    ownership: 'yours',
    confidence: 'confirmed',
    sourceDocumentId: null,
    sourceDescription: `Payslip: ${formatCurrency(data.gross_pay)} gross, ${formatCurrency(data.net_pay)} net`,
    isInherited: false,
    isPreMarital: false,
    asAtDate: now,
    createdAt: now,
    updatedAt: now,
  })

  // Pension contribution detected — link to pensions section
  if (data.pension_contribution && data.pension_contribution > 0) {
    questions.push({
      id: `payslip-pension-${Date.now()}`,
      questionText: `Your payslip shows pension contributions of ${formatCurrency(data.pension_contribution)}/month. Is this a workplace pension?`,
      reasoning: 'Pension contributions are deducted before your net pay reaches your bank account.',
      options: [
        { label: 'Yes, workplace pension', value: 'workplace' },
        { label: 'Yes, personal pension', value: 'personal' },
        { label: "I'm not sure", value: 'unsure' },
      ],
      primaryOption: 'Yes, workplace pension',
      secondaryLabel: "I'm not sure",
      formEField: '2.13',
      answered: false,
      answer: null,
    })
  }

  // Overtime/commission
  if (data.overtime_or_commission && data.overtime_or_commission > 0) {
    questions.push({
      id: `payslip-overtime-${Date.now()}`,
      questionText: `Your payslip includes ${formatCurrency(data.overtime_or_commission)} in overtime or commission. Is this a regular part of your income?`,
      reasoning: 'Courts need to understand whether variable pay is a reliable income component.',
      options: [
        { label: 'Yes, most months', value: 'regular' },
        { label: 'Sometimes', value: 'sometimes' },
        { label: 'This was unusual', value: 'unusual' },
      ],
      primaryOption: null,
      secondaryLabel: "I'm not sure",
      formEField: '2.15',
      answered: false,
      answer: null,
    })
  }

  return { autoConfirmItems, questions, financialItems, processingMessages }
}

// ═══ Mortgage statement transformer ═══

function transformMortgageStatement(data: MortgageStatementExtraction): TransformedResult {
  const autoConfirmItems: AutoConfirmItem[] = []
  const questions: ClarificationQuestion[] = []
  const financialItems: FinancialItem[] = []
  const now = new Date().toISOString()

  const processingMessages = [
    `Reading your mortgage statement from ${data.lender}...`,
    'Extracting property and debt details...',
  ]

  // Mortgage details are structured — auto-confirm most fields
  const parts = data.multiple_parts && data.parts.length > 1
    ? ` (${data.parts.length} parts)`
    : ''
  const rateInfo = data.interest_rate ? ` at ${data.interest_rate}%` : ''

  autoConfirmItems.push({
    id: `mortgage-balance-${Date.now()}`,
    label: `Mortgage with ${data.lender}: ${formatCurrency(data.outstanding_balance)} outstanding${rateInfo}${parts}`,
    detail: `Monthly payment: ${formatCurrency(data.monthly_payment)}${data.term_end_date ? `, term ends ${data.term_end_date}` : ''}`,
    accepted: true,
  })

  financialItems.push({
    id: `fi-mortgage-${Date.now()}`,
    sectionKey: 'property',
    label: `Mortgage with ${data.lender}`,
    value: data.outstanding_balance,
    period: 'total',
    ownership: data.is_joint ? 'joint' : 'yours',
    confidence: 'confirmed',
    sourceDocumentId: null,
    sourceDescription: `${data.lender} mortgage statement: ${formatCurrency(data.outstanding_balance)} at ${data.interest_rate ?? '?'}%`,
    isInherited: false,
    isPreMarital: false,
    asAtDate: now,
    createdAt: now,
    updatedAt: now,
  })

  // Joint mortgage confirmation
  if (data.is_joint) {
    questions.push({
      id: `mortgage-joint-${Date.now()}`,
      questionText: `This mortgage is in joint names. Is this correct?`,
      reasoning: 'Joint mortgages affect how the property equity is divided.',
      options: [
        { label: 'Yes, joint with partner', value: 'joint' },
        { label: 'No, it\'s in my name only', value: 'sole' },
      ],
      primaryOption: 'Yes, joint with partner',
      secondaryLabel: "No it's something else",
      formEField: '2.1',
      answered: false,
      answer: null,
    })
  }

  // ERC flag
  if (data.early_repayment_charge && data.early_repayment_charge > 0) {
    autoConfirmItems.push({
      id: `mortgage-erc-${Date.now()}`,
      label: `Early repayment charge: ${formatCurrency(data.early_repayment_charge)}${data.erc_end_date ? ` until ${data.erc_end_date}` : ''}`,
      detail: 'This is relevant if the property might be sold or remortgaged.',
      accepted: true,
    })
  }

  // Arrears flag
  if (data.arrears && data.arrears > 0) {
    autoConfirmItems.push({
      id: `mortgage-arrears-${Date.now()}`,
      label: `Mortgage arrears: ${formatCurrency(data.arrears)}`,
      detail: 'This is a liability that needs to be disclosed.',
      accepted: true,
    })
  }

  return { autoConfirmItems, questions, financialItems, processingMessages }
}

// ═══ Pension CETV transformer ═══

function transformPensionCETV(data: PensionCETVExtraction): TransformedResult {
  const autoConfirmItems: AutoConfirmItem[] = []
  const questions: ClarificationQuestion[] = []
  const financialItems: FinancialItem[] = []
  const now = new Date().toISOString()

  const processingMessages = [
    `Reading your pension letter from ${data.provider}...`,
    'Extracting CETV and scheme details...',
  ]

  const typeLabel = data.pension_type === 'defined_benefit' ? 'Defined benefit'
    : data.pension_type === 'defined_contribution' ? 'Defined contribution'
    : data.pension_type === 'sipp' ? 'SIPP'
    : 'Pension'

  autoConfirmItems.push({
    id: `pension-cetv-${Date.now()}`,
    label: `${data.scheme_name}: CETV ${formatCurrency(data.cetv_value)}`,
    detail: `${typeLabel} pension with ${data.provider}${data.cetv_date ? `, valued ${data.cetv_date}` : ''}`,
    accepted: true,
  })

  financialItems.push({
    id: `fi-pension-${Date.now()}`,
    sectionKey: 'pensions',
    label: `${data.scheme_name} (${typeLabel})`,
    value: data.cetv_value,
    period: 'total',
    ownership: 'yours',
    confidence: 'confirmed',
    sourceDocumentId: null,
    sourceDescription: `CETV: ${formatCurrency(data.cetv_value)} from ${data.provider}${data.cetv_date ? ` as at ${data.cetv_date}` : ''}`,
    isInherited: false,
    isPreMarital: false,
    asAtDate: data.cetv_date || now,
    createdAt: now,
    updatedAt: now,
  })

  // DB pension warning — CETV may understate value
  if (data.pension_type === 'defined_benefit') {
    const annualPensionInfo = data.annual_pension_at_retirement
      ? ` Your annual pension at retirement would be ${formatCurrency(data.annual_pension_at_retirement)}/year.`
      : ''

    questions.push({
      id: `pension-db-warning-${Date.now()}`,
      questionText: `This is a defined benefit pension with a CETV of ${formatCurrency(data.cetv_value)}.${annualPensionInfo} CETVs often understate the true value of defined benefit pensions. Would you like to understand why?`,
      reasoning: 'A DB pension provides guaranteed income for life, inflation-linked. The CETV is a lump-sum estimate that may not reflect this guarantee.',
      options: [
        { label: 'Tell me more', value: 'learn_more' },
        { label: 'I understand', value: 'understood' },
        { label: 'Skip for now', value: 'skip' },
      ],
      primaryOption: null,
      secondaryLabel: 'Skip for now',
      formEField: '2.13',
      answered: false,
      answer: null,
    })
  }

  // PODE recommendation for high-value pensions
  if (data.cetv_value >= 100000) {
    questions.push({
      id: `pension-pode-${Date.now()}`,
      questionText: `Your pension CETV is ${formatCurrency(data.cetv_value)}. For pensions of this value, a specialist pension report (PODE) is usually recommended to ensure fair treatment in settlement. These typically cost £1,500–£3,000, shared between parties.`,
      reasoning: 'The PAG2 guidance (2024) recommends specialist pension advice for CETVs above £100,000.',
      options: [
        { label: 'Tell me more', value: 'learn_more' },
        { label: "I'll consider this", value: 'noted' },
        { label: 'Not now', value: 'skip' },
      ],
      primaryOption: null,
      secondaryLabel: 'Not now',
      formEField: '2.13',
      answered: false,
      answer: null,
    })
  }

  // CETV age check
  if (data.cetv_date) {
    const cetvDate = new Date(data.cetv_date)
    const monthsOld = Math.floor((Date.now() - cetvDate.getTime()) / (1000 * 60 * 60 * 24 * 30))
    if (monthsOld > 12) {
      questions.push({
        id: `pension-cetv-age-${Date.now()}`,
        questionText: `This CETV is from ${data.cetv_date} — over 12 months ago. You'll need an updated one for formal disclosure.`,
        reasoning: 'Form E requires CETV statements dated within 12 months.',
        options: [
          { label: "I'll request a new one", value: 'will_request' },
          { label: 'I have a newer one', value: 'have_newer' },
        ],
        primaryOption: "I'll request a new one",
        secondaryLabel: 'I have a newer one',
        formEField: '2.13',
        answered: false,
        answer: null,
      })
    }
  }

  // Pre-marital membership
  if (data.membership_start_date) {
    questions.push({
      id: `pension-premarital-${Date.now()}`,
      questionText: `You joined this pension scheme on ${data.membership_start_date}. Was this before your marriage?`,
      reasoning: 'The pre-marital portion of a pension may be treated differently in settlement (Standish v Standish [2025]).',
      options: [
        { label: 'Yes, before marriage', value: 'pre_marital' },
        { label: 'No, during marriage', value: 'during_marriage' },
        { label: "I'm not sure", value: 'unsure' },
      ],
      primaryOption: null,
      secondaryLabel: "I'm not sure",
      formEField: '2.13 + Part 4',
      answered: false,
      answer: null,
    })
  }

  return { autoConfirmItems, questions, financialItems, processingMessages }
}

// ═══ Savings statement transformer ═══

function transformSavingsStatement(data: SavingsStatementExtraction): TransformedResult {
  const autoConfirmItems: AutoConfirmItem[] = []
  const questions: ClarificationQuestion[] = []
  const financialItems: FinancialItem[] = []
  const now = new Date().toISOString()

  const typeLabel = ACCOUNT_TYPE_LABELS[data.account_type] || 'Savings account'

  // Savings statements are structured — auto-confirm balance
  autoConfirmItems.push({
    id: `savings-balance-${Date.now()}`,
    label: `${typeLabel} with ${data.provider}: ${formatCurrency(data.current_balance)}`,
    detail: `Balance: ${formatCurrency(data.current_balance)}`,
    accepted: true,
  })

  financialItems.push({
    id: `fi-savings-${Date.now()}`,
    sectionKey: 'accounts',
    label: `${typeLabel} — ${data.provider}`,
    value: data.current_balance,
    period: 'total',
    ownership: data.is_joint ? 'joint' : 'yours',
    confidence: 'confirmed',
    sourceDocumentId: null,
    sourceDescription: `${typeLabel} with ${data.provider}`,
    isInherited: false,
    isPreMarital: false,
    asAtDate: null,
    createdAt: now,
    updatedAt: now,
  })

  // Clarify: ownership if unclear
  if (data.is_joint) {
    questions.push({
      id: `savings-joint-${Date.now()}`,
      questionText: `Is this ${typeLabel} a joint account with your partner?`,
      reasoning: null,
      options: [
        { label: 'Yes, joint with partner', value: 'joint' },
        { label: 'No, it\'s in my name only', value: 'sole' },
      ],
      primaryOption: 'Yes, joint with partner',
      secondaryLabel: 'No, it\'s in my name only',
      formEField: '2.3',
      answered: false,
      answer: null,
    })
  }

  // Clarify: large recent withdrawals
  for (const withdrawal of data.large_recent_withdrawals) {
    questions.push({
      id: `savings-withdrawal-${Date.now()}-${withdrawal.amount}`,
      questionText: `There's been a withdrawal of ${formatCurrency(withdrawal.amount)} recently. Has this been spent or moved to another account?`,
      reasoning: null,
      options: [
        { label: 'Spent', value: 'spent' },
        { label: 'Moved to another account', value: 'moved' },
        { label: 'Separation costs', value: 'separation' },
        { label: 'Other', value: 'other' },
      ],
      primaryOption: null,
      secondaryLabel: 'I\'d rather not say',
      formEField: '2.3',
      answered: false,
      answer: null,
    })
  }

  // Clarify: ISA type if unclear
  if (data.account_type === 'other') {
    questions.push({
      id: `savings-type-${Date.now()}`,
      questionText: 'Is this a Cash ISA or Stocks & Shares ISA?',
      reasoning: null,
      options: [
        { label: 'Cash ISA', value: 'cash_isa' },
        { label: 'Stocks & Shares ISA', value: 'stocks_and_shares_isa' },
        { label: 'Lifetime ISA', value: 'lifetime_isa' },
        { label: 'Regular savings', value: 'savings' },
        { label: 'Not sure', value: 'unknown' },
      ],
      primaryOption: null,
      secondaryLabel: 'Not sure',
      formEField: '2.3 / 2.4',
      answered: false,
      answer: null,
    })
  }

  const processingMessages = [
    `Found ${typeLabel} with ${data.provider}`,
    `Balance: ${formatCurrency(data.current_balance)}`,
  ]

  return { autoConfirmItems, questions, financialItems, processingMessages }
}

// ═══ Credit card statement transformer ═══

function transformCreditCardStatement(data: CreditCardStatementExtraction): TransformedResult {
  const autoConfirmItems: AutoConfirmItem[] = []
  const questions: ClarificationQuestion[] = []
  const financialItems: FinancialItem[] = []
  const now = new Date().toISOString()

  // Credit card statements are structured — auto-confirm balance
  const balanceDetail = [
    `Balance: ${formatCurrency(data.outstanding_balance)}`,
    data.credit_limit ? `Credit limit: ${formatCurrency(data.credit_limit)}` : null,
    data.interest_rate_apr ? `APR: ${data.interest_rate_apr}%` : null,
  ].filter(Boolean).join('. ')

  autoConfirmItems.push({
    id: `cc-balance-${Date.now()}`,
    label: `${data.provider} credit card: ${formatCurrency(data.outstanding_balance)} outstanding`,
    detail: balanceDetail,
    accepted: true,
  })

  financialItems.push({
    id: `fi-cc-${Date.now()}`,
    sectionKey: 'debts',
    label: `${data.provider} credit card`,
    value: data.outstanding_balance,
    period: 'total',
    ownership: data.is_joint ? 'joint' : 'yours',
    confidence: 'confirmed',
    sourceDocumentId: null,
    sourceDescription: balanceDetail,
    isInherited: false,
    isPreMarital: false,
    asAtDate: null,
    createdAt: now,
    updatedAt: now,
  })

  // If minimum payment exists, add as expenditure item
  if (data.minimum_payment) {
    financialItems.push({
      id: `fi-cc-payment-${Date.now()}`,
      sectionKey: 'spending',
      label: `${data.provider} credit card payment`,
      value: data.minimum_payment,
      period: 'monthly',
      ownership: data.is_joint ? 'joint' : 'yours',
      confidence: 'estimated',
      sourceDocumentId: null,
      sourceDescription: 'Minimum payment — actual payment may be higher',
      isInherited: false,
      isPreMarital: false,
      asAtDate: null,
      createdAt: now,
      updatedAt: now,
    })
  }

  // Clarify: ownership
  if (data.is_joint) {
    questions.push({
      id: `cc-joint-${Date.now()}`,
      questionText: `Is this ${data.provider} credit card in joint names with your partner?`,
      reasoning: null,
      options: [
        { label: 'Yes, joint', value: 'joint' },
        { label: 'No, it\'s mine only', value: 'sole' },
        { label: 'It\'s my partner\'s', value: 'partners' },
      ],
      primaryOption: null,
      secondaryLabel: 'It\'s my partner\'s',
      formEField: '2.14',
      answered: false,
      answer: null,
    })
  }

  // Clarify: high balance
  if (data.outstanding_balance > 5000) {
    questions.push({
      id: `cc-highbalance-${Date.now()}`,
      questionText: `This card has a balance of ${formatCurrency(data.outstanding_balance)}. Is this typical, or has spending increased recently?`,
      reasoning: null,
      options: [
        { label: 'Normal for me', value: 'normal' },
        { label: 'Increased due to separation', value: 'separation' },
        { label: 'Increased for other reasons', value: 'other' },
      ],
      primaryOption: null,
      secondaryLabel: 'I\'d rather not say',
      formEField: '2.14',
      answered: false,
      answer: null,
    })
  }

  const processingMessages = [
    `Found ${data.provider} credit card statement`,
    `Outstanding balance: ${formatCurrency(data.outstanding_balance)}`,
  ]

  return { autoConfirmItems, questions, financialItems, processingMessages }
}

// ═══ P60 / Tax return transformer ═══

function transformP60(data: P60Extraction): TransformedResult {
  const autoConfirmItems: AutoConfirmItem[] = []
  const questions: ClarificationQuestion[] = []
  const financialItems: FinancialItem[] = []
  const now = new Date().toISOString()

  const yearLabel = data.tax_year ? ` (${data.tax_year})` : ''

  // P60/SA302 are structured — auto-confirm income
  autoConfirmItems.push({
    id: `p60-income-${Date.now()}`,
    label: `Annual income${yearLabel}: ${formatCurrency(data.total_pay)} gross from ${data.employer_or_source}`,
    detail: `Tax: ${formatCurrency(data.total_tax_deducted)}${data.total_ni ? `, NI: ${formatCurrency(data.total_ni)}` : ''}`,
    accepted: true,
  })

  financialItems.push({
    id: `fi-p60-income-${Date.now()}`,
    sectionKey: 'income',
    label: `Annual income — ${data.employer_or_source}`,
    value: data.total_pay,
    period: 'annual',
    ownership: 'yours',
    confidence: 'confirmed',
    sourceDocumentId: null,
    sourceDescription: `${data.document_type === 'p60' ? 'P60' : 'Tax return'}${yearLabel}`,
    isInherited: false,
    isPreMarital: false,
    asAtDate: null,
    createdAt: now,
    updatedAt: now,
  })

  // Self-employment profit
  if (data.self_employment_profit != null && data.self_employment_profit > 0) {
    autoConfirmItems.push({
      id: `p60-selfempl-${Date.now()}`,
      label: `Self-employment profit${yearLabel}: ${formatCurrency(data.self_employment_profit)}`,
      detail: 'Net profit after expenses, from tax return',
      accepted: true,
    })

    financialItems.push({
      id: `fi-p60-selfempl-${Date.now()}`,
      sectionKey: 'income',
      label: 'Self-employment profit',
      value: data.self_employment_profit,
      period: 'annual',
      ownership: 'yours',
      confidence: 'confirmed',
      sourceDocumentId: null,
      sourceDescription: `SA302${yearLabel}`,
      isInherited: false,
      isPreMarital: false,
      asAtDate: null,
      createdAt: now,
      updatedAt: now,
    })

    // Clarify: is this still current?
    questions.push({
      id: `p60-selfempl-current-${Date.now()}`,
      questionText: `Your tax return shows self-employment profit of ${formatCurrency(data.self_employment_profit)}. Is this still your current income level?`,
      reasoning: 'Courts need to understand maintainable income — whether this figure is likely to continue.',
      options: [
        { label: 'Yes, roughly the same', value: 'same' },
        { label: 'It\'s increased', value: 'increased' },
        { label: 'It\'s decreased', value: 'decreased' },
        { label: 'I\'ve stopped self-employment', value: 'stopped' },
      ],
      primaryOption: null,
      secondaryLabel: 'I\'m not sure',
      formEField: '2.16',
      answered: false,
      answer: null,
    })
  }

  // Dividend income
  if (data.dividend_income != null && data.dividend_income > 0) {
    autoConfirmItems.push({
      id: `p60-dividends-${Date.now()}`,
      label: `Dividend income${yearLabel}: ${formatCurrency(data.dividend_income)}`,
      detail: 'From tax return',
      accepted: true,
    })

    questions.push({
      id: `p60-dividend-source-${Date.now()}`,
      questionText: `Your tax return shows dividend income of ${formatCurrency(data.dividend_income)}. Is this from your own company?`,
      reasoning: 'Dividends from your own company are treated differently from investment dividends for disclosure.',
      options: [
        { label: 'Yes, my company', value: 'own_company' },
        { label: 'No, investments', value: 'investments' },
        { label: 'Both', value: 'both' },
      ],
      primaryOption: null,
      secondaryLabel: 'I\'m not sure',
      formEField: '2.16 or 2.4',
      answered: false,
      answer: null,
    })
  }

  // Rental income
  if (data.rental_income != null && data.rental_income > 0) {
    autoConfirmItems.push({
      id: `p60-rental-${Date.now()}`,
      label: `Rental income${yearLabel}: ${formatCurrency(data.rental_income)}`,
      detail: 'From tax return',
      accepted: true,
    })

    financialItems.push({
      id: `fi-p60-rental-${Date.now()}`,
      sectionKey: 'income',
      label: 'Rental income',
      value: data.rental_income,
      period: 'annual',
      ownership: 'yours',
      confidence: 'confirmed',
      sourceDocumentId: null,
      sourceDescription: `Tax return${yearLabel}`,
      isInherited: false,
      isPreMarital: false,
      asAtDate: null,
      createdAt: now,
      updatedAt: now,
    })
  }

  // Multiple income sources
  if (data.other_income.length > 0) {
    questions.push({
      id: `p60-multiple-${Date.now()}`,
      questionText: `Your tax return shows income from ${data.other_income.length + 1} sources. Are all of these current?`,
      reasoning: 'Courts need to know your current income, not just historical.',
      options: [
        { label: 'Yes, all current', value: 'all_current' },
        { label: 'Some have changed', value: 'changed' },
      ],
      primaryOption: 'Yes, all current',
      secondaryLabel: 'Some have changed',
      formEField: '2.15–2.16',
      answered: false,
      answer: null,
    })
  }

  const processingMessages = [
    `Found ${data.document_type === 'p60' ? 'P60' : 'tax return'} from ${data.employer_or_source}`,
    `Annual income: ${formatCurrency(data.total_pay)}`,
  ]

  return { autoConfirmItems, questions, financialItems, processingMessages }
}

// ═══ Helpers ═══

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

const ACCOUNT_TYPE_LABELS: Record<string, string> = {
  savings: 'Savings account',
  cash_isa: 'Cash ISA',
  stocks_and_shares_isa: 'Stocks & Shares ISA',
  lifetime_isa: 'Lifetime ISA',
  investment_fund: 'Investment fund',
  premium_bonds: 'Premium Bonds',
  other: 'Savings / investment account',
}

const CATEGORY_LABELS: Record<string, string> = {
  mortgage: 'Mortgage payment',
  rent: 'Rent',
  insurance: 'Insurance',
  pension_contribution: 'Pension contribution',
  childcare: 'Childcare',
  loan_repayment: 'Loan repayment',
  child_maintenance: 'Child maintenance',
  utilities: 'Utilities',
  council_tax: 'Council tax',
  subscription: 'Subscription',
  unknown: 'Regular payment',
}

function getFormEField(category: string): string {
  switch (category) {
    case 'mortgage': return '2.1 + 3.1'
    case 'rent': return '3.1'
    case 'insurance': return '3.1'
    case 'pension_contribution': return '2.13'
    case 'childcare': return '3.1'
    case 'loan_repayment': return '2.14 + 3.1'
    case 'child_maintenance': return '3.1'
    case 'utilities': return '3.1'
    case 'council_tax': return '3.1'
    default: return '3.1'
  }
}
