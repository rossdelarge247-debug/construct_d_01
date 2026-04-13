// Converts BankStatementExtraction → UI types (RevealItem, ConnectedAccount)
// Also provides a demo extraction factory for when Tink credentials aren't configured.

import type { BankStatementExtraction } from '@/lib/ai/extraction-schemas'
import type { ConnectedAccount, RevealItem } from '@/types/hub'

// ═══ BankStatementExtraction → ConnectedAccount ═══

export function extractionsToConnectedAccounts(
  extractions: BankStatementExtraction[],
): ConnectedAccount[] {
  return extractions.map((ext, i) => ({
    id: `acc-${i + 1}`,
    bankName: ext.provider,
    accountType: ext.account_type === 'savings' ? 'savings' : 'current',
    lastFour: ext.account_number_last4 ?? '0000',
    monthsOfData: getMonthsCovered(ext.statement_period_start, ext.statement_period_end),
  }))
}

function getMonthsCovered(start: string | null, end: string | null): number {
  if (!start || !end) return 12
  const ms = new Date(end).getTime() - new Date(start).getTime()
  return Math.max(1, Math.round(ms / (30 * 24 * 60 * 60 * 1000)))
}

// ═══ BankStatementExtraction → RevealItem[] ═══
// Generates the tick items shown during the progressive reveal animation.
// Each item corresponds to a financial signal found in the bank data.

export function extractionsToRevealItems(
  extractions: BankStatementExtraction[],
): RevealItem[] {
  const items: RevealItem[] = []
  let id = 0

  for (let i = 0; i < extractions.length; i++) {
    const ext = extractions[i]
    const accountId = `acc-${i + 1}`

    // Income
    const employment = ext.income_deposits.filter((d) => d.type === 'employment')
    if (employment.length > 0) {
      const primary = employment[0]
      items.push({
        id: `r${++id}`,
        accountId,
        label: 'Income identified',
        detail: `£${primary.amount.toLocaleString()}/month from ${primary.source}`,
        icon: 'income',
      })
    }

    // Spending
    if (ext.spending_categories.length > 0) {
      const totalMonthly = ext.spending_categories.reduce((s, c) => s + c.monthly_average, 0)
      items.push({
        id: `r${++id}`,
        accountId,
        label: 'Spending mapped',
        detail: `£${totalMonthly.toLocaleString()}/month, ${ext.spending_categories.length} categories`,
        icon: 'spending',
      })
    }

    // Mortgage
    const mortgage = ext.regular_payments.find((p) => p.likely_category === 'mortgage')
    if (mortgage) {
      items.push({
        id: `r${++id}`,
        accountId,
        label: 'Mortgage found',
        detail: `£${mortgage.amount.toLocaleString()}/month to ${mortgage.payee}`,
        icon: 'mortgage',
      })
    }

    // Account balance
    if (ext.closing_balance !== null) {
      items.push({
        id: `r${++id}`,
        accountId,
        label: 'Account balance',
        detail: `${ext.provider} ${ext.account_type}, £${ext.closing_balance.toLocaleString()}`,
        icon: 'balance',
      })
    }

    // Regular commitments
    if (ext.regular_payments.length > 0) {
      items.push({
        id: `r${++id}`,
        accountId,
        label: 'Regular commitments',
        detail: `${ext.regular_payments.length} payments identified`,
        icon: 'commitments',
      })
    }

    // Pension contributions
    const pension = ext.regular_payments.find((p) => p.likely_category === 'pension_contribution')
    if (pension) {
      items.push({
        id: `r${++id}`,
        accountId,
        label: 'Pension contributions',
        detail: `£${pension.amount.toLocaleString()}/month to ${pension.payee}`,
        icon: 'pension',
      })
    }
  }

  return items
}

// ═══ Demo data factory ═══
// Generates a realistic BankStatementExtraction for the "Continue with demo data" fallback.
// Matches the wireframe copy closely so the reveal feels real.

export function createDemoExtractions(): BankStatementExtraction[] {
  return [
    {
      document_type: 'bank_statement',
      provider: 'Barclays',
      account_number_last4: '2392',
      account_type: 'current',
      is_joint: false,
      joint_holder_name: null,
      statement_period_start: '2025-04-09',
      statement_period_end: '2026-04-09',
      closing_balance: 1842,
      income_deposits: [
        { source: 'Acme Ltd', amount: 3400, period: 'monthly', confidence: 0.97, type: 'employment' },
        { source: 'HMRC Child Benefit', amount: 120, period: 'monthly', confidence: 0.98, type: 'benefits' },
      ],
      regular_payments: [
        { payee: 'Halifax', amount: 1150, frequency: 'monthly', confidence: 0.95, likely_category: 'mortgage' },
        { payee: 'Aviva', amount: 200, frequency: 'monthly', confidence: 0.92, likely_category: 'pension_contribution' },
        { payee: 'Council Tax', amount: 185, frequency: 'monthly', confidence: 0.96, likely_category: 'council_tax' },
        { payee: 'British Gas', amount: 120, frequency: 'monthly', confidence: 0.90, likely_category: 'utilities' },
        { payee: 'Sky', amount: 45, frequency: 'monthly', confidence: 0.93, likely_category: 'subscription' },
        { payee: 'Vodafone', amount: 35, frequency: 'monthly', confidence: 0.95, likely_category: 'subscription' },
        { payee: 'Admiral Insurance', amount: 42, frequency: 'monthly', confidence: 0.88, likely_category: 'insurance' },
        { payee: 'HL Savings', amount: 300, frequency: 'monthly', confidence: 0.85, likely_category: 'unknown' },
      ],
      spending_categories: [
        { category: 'Housing', monthly_average: 1150, transaction_count: 12 },
        { category: 'Groceries', monthly_average: 480, transaction_count: 48 },
        { category: 'Transport', monthly_average: 175, transaction_count: 24 },
        { category: 'Utilities', monthly_average: 210, transaction_count: 12 },
        { category: 'Dining & entertainment', monthly_average: 220, transaction_count: 36 },
        { category: 'Childcare', monthly_average: 600, transaction_count: 12 },
        { category: 'Subscriptions', monthly_average: 85, transaction_count: 12 },
        { category: 'Insurance', monthly_average: 120, transaction_count: 6 },
      ],
      notable_transactions: [],
    },
    {
      document_type: 'bank_statement',
      provider: 'Barclays',
      account_number_last4: '2657',
      account_type: 'savings',
      is_joint: false,
      joint_holder_name: null,
      statement_period_start: '2025-04-09',
      statement_period_end: '2026-04-09',
      closing_balance: 8450,
      income_deposits: [],
      regular_payments: [],
      spending_categories: [],
      notable_transactions: [],
    },
  ]
}
