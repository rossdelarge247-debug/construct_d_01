// Transforms AI pipeline extraction results into hero panel Q&A format
// Bridge between pipeline.ts (typed extraction) and use-hub.ts (UI state)
//
// Grounded in decision tree specs 13 and 14:
// - Auto-confirm: items with confidence >= 0.95 and unambiguous category
// - Clarification: items needing user input, with reasoning shown
// - Gaps: things expected but not found

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

  // Income deposits → auto-confirm or clarify
  for (const income of data.income_deposits) {
    const id = `income-${income.source.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}`

    if (income.confidence >= AUTO_CONFIRM_THRESHOLD && income.type === 'employment') {
      autoConfirmItems.push({
        id,
        label: `Monthly salary: ${formatCurrency(income.amount)} net from ${income.source}`,
        detail: income.reasoning,
        accepted: true,
      })
      financialItems.push({
        id: `fi-${id}`,
        sectionKey: 'income',
        label: `Salary from ${income.source}`,
        value: income.amount,
        period: income.period,
        ownership: 'yours',
        confidence: 'confirmed',
        sourceDocumentId: null,
        sourceDescription: income.reasoning,
        isInherited: false,
        isPreMarital: false,
        asAtDate: now,
        createdAt: now,
        updatedAt: now,
      })
    } else if (income.confidence >= AUTO_CONFIRM_THRESHOLD && income.type === 'benefits') {
      autoConfirmItems.push({
        id,
        label: `${income.source}: ${formatCurrency(income.amount)}/month`,
        detail: income.reasoning,
        accepted: true,
      })
      financialItems.push({
        id: `fi-${id}`,
        sectionKey: 'income',
        label: income.source,
        value: income.amount,
        period: income.period,
        ownership: 'yours',
        confidence: 'confirmed',
        sourceDocumentId: null,
        sourceDescription: income.reasoning,
        isInherited: false,
        isPreMarital: false,
        asAtDate: now,
        createdAt: now,
        updatedAt: now,
      })
    } else {
      // Needs clarification
      questions.push({
        id,
        questionText: `We found regular deposits of ${formatCurrency(income.amount)}/${income.period} from ${income.source}. What is this income?`,
        reasoning: income.reasoning,
        options: [
          { label: 'Employment salary', value: 'employment' },
          { label: 'Self-employment income', value: 'self_employment' },
          { label: 'Benefits', value: 'benefits' },
          { label: 'Rental income', value: 'rental' },
          { label: 'Something else', value: 'other' },
        ],
        primaryOption: null,
        secondaryLabel: "I'm not sure",
        formEField: '2.15-2.20',
        answered: false,
        answer: null,
      })
    }
  }

  // Regular payments → auto-confirm or clarify based on decision tree
  for (const payment of data.regular_payments) {
    const id = `payment-${payment.payee.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}`

    if (!payment.needs_clarification && payment.confidence >= AUTO_CONFIRM_THRESHOLD) {
      // High confidence, no clarification needed — but still show as auto-confirmed
      const categoryLabel = CATEGORY_LABELS[payment.likely_category] || payment.likely_category
      autoConfirmItems.push({
        id,
        label: `${categoryLabel}: ${formatCurrency(payment.amount)}/${payment.frequency} to ${payment.payee}`,
        detail: payment.reasoning,
        accepted: true,
      })
    } else if (payment.needs_clarification && payment.clarification_question) {
      // Needs user input — generate question from AI's clarification data
      questions.push({
        id,
        questionText: payment.clarification_question,
        reasoning: payment.reasoning,
        options: (payment.clarification_options || []).map((opt) => ({
          label: opt,
          value: opt.toLowerCase().replace(/[^a-z0-9]+/g, '_'),
        })),
        primaryOption: payment.clarification_options?.[0] || null,
        secondaryLabel: "No it's something else",
        formEField: getFormEField(payment.likely_category),
        answered: false,
        answer: null,
      })
    }
  }

  // Joint account detection
  if (data.is_joint) {
    questions.push({
      id: `joint-account-${Date.now()}`,
      questionText: `We can see a joint account holder on this account.${data.joint_holder_name ? ` (${data.joint_holder_name})` : ''} Is this a joint account with your partner?`,
      reasoning: 'Joint accounts need to declare the ownership split for Form E disclosure.',
      options: [
        { label: 'Yes it is', value: 'joint_partner' },
        { label: "No it's something else", value: 'not_joint' },
      ],
      primaryOption: 'Yes it is',
      secondaryLabel: "No it's something else",
      formEField: '2.3',
      answered: false,
      answer: null,
    })
  }

  // Spending total confirmation
  if (data.spending_categories.length > 0) {
    const totalSpending = data.spending_categories.reduce((sum, c) => sum + c.monthly_average, 0)
    questions.push({
      id: `spending-total-${Date.now()}`,
      questionText: `We've categorised your monthly spending as roughly ${formatCurrency(totalSpending)}. Does that feel about right?`,
      reasoning: `Based on ${data.spending_categories.length} categories across your transactions.`,
      options: [
        { label: 'That sounds right', value: 'correct' },
        { label: 'Let me review the categories', value: 'review' },
      ],
      primaryOption: 'That sounds right',
      secondaryLabel: 'Let me review the categories',
      formEField: '3.1',
      answered: false,
      answer: null,
    })
  }

  // Gaps
  for (const gap of data.gaps) {
    questions.push({
      id: `gap-${gap.form_e_field.replace(/\./g, '-')}-${Date.now()}`,
      questionText: gap.question,
      reasoning: gap.description,
      options: gap.options.map((opt) => ({
        label: opt,
        value: opt.toLowerCase().replace(/[^a-z0-9]+/g, '_'),
      })),
      primaryOption: null,
      secondaryLabel: "I'll answer this later",
      formEField: gap.form_e_field,
      answered: false,
      answer: null,
    })
  }

  // Notable transactions (crypto, solicitors, etc.)
  for (const notable of data.notable_transactions) {
    if (notable.reason_flagged.toLowerCase().includes('crypto')) {
      questions.push({
        id: `notable-crypto-${Date.now()}`,
        questionText: `We found payments to what appears to be a cryptocurrency exchange (${notable.description}). Do you hold cryptocurrency?`,
        reasoning: 'Cryptocurrency is legally recognised as property and must be disclosed.',
        options: [
          { label: 'Yes', value: 'yes' },
          { label: "No, I've sold it all", value: 'sold' },
          { label: "I'd rather not say right now", value: 'skip' },
        ],
        primaryOption: null,
        secondaryLabel: "I'll answer this later",
        formEField: '2.4/2.9',
        answered: false,
        answer: null,
      })
    }
  }

  return { autoConfirmItems, questions, financialItems, processingMessages }
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

// ═══ Helpers ═══

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
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
