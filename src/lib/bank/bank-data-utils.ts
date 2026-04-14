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

// ═══ Transaction search + frequency helpers (spending flow) ═══

export interface DemoTransaction {
  id: string
  payee: string
  amount: number
  date: string
  reference: string
  category: string
}

/** Search transactions by payee name (case-insensitive substring match) */
export function searchTransactionsByPayee(
  transactions: DemoTransaction[],
  query: string,
): Map<string, DemoTransaction[]> {
  if (!query || query.length < 2) return new Map()
  const q = query.toLowerCase()
  const matching = transactions.filter((t) => t.payee.toLowerCase().includes(q))
  const grouped = new Map<string, DemoTransaction[]>()
  for (const tx of matching) {
    const group = grouped.get(tx.payee) || []
    group.push(tx)
    grouped.set(tx.payee, group)
  }
  return grouped
}

/** Infer payment frequency from transaction count in a 12-month period */
export function inferPaymentFrequency(count: number): 'monthly' | 'quarterly' | 'annual' | 'one_off' {
  if (count >= 10) return 'monthly'
  if (count >= 3) return 'quarterly'
  if (count >= 2) return 'annual'
  return 'one_off'
}

/** Calculate monthly equivalent from amount + frequency */
export function toMonthly(amount: number, frequency: 'monthly' | 'quarterly' | 'annual' | 'one_off'): number {
  switch (frequency) {
    case 'monthly': return Math.round(amount)
    case 'quarterly': return Math.round(amount / 3)
    case 'annual': return Math.round(amount / 12)
    case 'one_off': return Math.round(amount / 12)
  }
}

/** Generate demo transactions for the search feature */
export function createDemoTransactions(): DemoTransaction[] {
  return [
    // Housing
    { id: 'tx-1', payee: 'Halifax', amount: 1680, date: '2026-03-01', reference: 'mortgage payment', category: 'housing' },
    { id: 'tx-2', payee: 'Halifax', amount: 1680, date: '2026-02-01', reference: 'mortgage payment', category: 'housing' },
    { id: 'tx-3', payee: 'Halifax', amount: 1680, date: '2026-01-01', reference: 'mortgage payment', category: 'housing' },
    { id: 'tx-4', payee: 'Derby Property Management Ltd', amount: 450, date: '2026-01-12', reference: 'reference xcc4ww', category: 'housing' },
    { id: 'tx-5', payee: 'Derby Property Management Ltd', amount: 450, date: '2025-10-12', reference: 'reference fetlba4w', category: 'housing' },
    { id: 'tx-6', payee: 'Derby Property Management Ltd', amount: 450, date: '2025-07-12', reference: 'reference fgtxs0f', category: 'housing' },
    { id: 'tx-7', payee: 'Derby Property Management Ltd', amount: 1450, date: '2025-07-12', reference: 'deposit payment', category: 'housing' },
    { id: 'tx-8', payee: 'Derby Property Lettings Ltd', amount: 250, date: '2026-03-05', reference: 'reference xcc4wee', category: 'housing' },
    { id: 'tx-9', payee: 'Council Tax', amount: 120, date: '2026-03-15', reference: 'council tax', category: 'housing' },
    { id: 'tx-10', payee: 'Council Tax', amount: 120, date: '2026-02-15', reference: 'council tax', category: 'housing' },
    { id: 'tx-11', payee: 'Council Tax', amount: 120, date: '2026-01-15', reference: 'council tax', category: 'housing' },
    // Utilities
    { id: 'tx-20', payee: 'British Gas', amount: 120, date: '2026-03-10', reference: 'energy', category: 'utilities' },
    { id: 'tx-21', payee: 'British Gas', amount: 120, date: '2026-02-10', reference: 'energy', category: 'utilities' },
    { id: 'tx-22', payee: 'British Gas', amount: 120, date: '2026-01-10', reference: 'energy', category: 'utilities' },
    { id: 'tx-23', payee: 'T-Mobile', amount: 42, date: '2026-03-18', reference: 'mobile', category: 'utilities' },
    { id: 'tx-24', payee: 'T-Mobile', amount: 42, date: '2026-02-18', reference: 'mobile', category: 'utilities' },
    { id: 'tx-25', payee: 'EE Broadband', amount: 70, date: '2026-03-05', reference: 'broadband', category: 'utilities' },
    { id: 'tx-26', payee: 'EE Broadband', amount: 70, date: '2026-02-05', reference: 'broadband', category: 'utilities' },
    { id: 'tx-27', payee: 'Utility Warehouse', amount: 200, date: '2026-01-01', reference: 'quarterly', category: 'utilities' },
    { id: 'tx-28', payee: 'Utility Warehouse', amount: 200, date: '2025-10-01', reference: 'quarterly', category: 'utilities' },
    { id: 'tx-29', payee: 'Amazon Prime', amount: 20, date: '2026-03-01', reference: 'subscription', category: 'utilities' },
    { id: 'tx-30', payee: 'Amazon Prime', amount: 20, date: '2026-02-01', reference: 'subscription', category: 'utilities' },
    // Transport
    { id: 'tx-40', payee: 'Shell', amount: 65, date: '2026-03-08', reference: 'fuel', category: 'transport' },
    { id: 'tx-41', payee: 'Shell', amount: 58, date: '2026-02-22', reference: 'fuel', category: 'transport' },
    { id: 'tx-42', payee: 'Shell', amount: 72, date: '2026-02-05', reference: 'fuel', category: 'transport' },
    { id: 'tx-43', payee: 'Admiral Insurance', amount: 42, date: '2026-03-01', reference: 'car insurance', category: 'transport' },
    { id: 'tx-44', payee: 'Admiral Insurance', amount: 42, date: '2026-02-01', reference: 'car insurance', category: 'transport' },
    // Personal
    { id: 'tx-50', payee: 'Tesco', amount: 85, date: '2026-03-12', reference: 'groceries', category: 'personal' },
    { id: 'tx-51', payee: 'Tesco', amount: 92, date: '2026-03-05', reference: 'groceries', category: 'personal' },
    { id: 'tx-52', payee: 'Sainsburys', amount: 67, date: '2026-03-09', reference: 'groceries', category: 'personal' },
    { id: 'tx-53', payee: 'Boots', amount: 24, date: '2026-03-15', reference: 'toiletries', category: 'personal' },
    // Children
    { id: 'tx-60', payee: 'Little Stars Nursery', amount: 600, date: '2026-03-01', reference: 'childcare', category: 'children' },
    { id: 'tx-61', payee: 'Little Stars Nursery', amount: 600, date: '2026-02-01', reference: 'childcare', category: 'children' },
    { id: 'tx-62', payee: 'Little Stars Nursery', amount: 600, date: '2026-01-01', reference: 'childcare', category: 'children' },
    // Leisure
    { id: 'tx-70', payee: 'Netflix', amount: 16, date: '2026-03-01', reference: 'subscription', category: 'leisure' },
    { id: 'tx-71', payee: 'Netflix', amount: 16, date: '2026-02-01', reference: 'subscription', category: 'leisure' },
    { id: 'tx-72', payee: 'PureGym', amount: 25, date: '2026-03-01', reference: 'gym', category: 'leisure' },
    { id: 'tx-73', payee: 'PureGym', amount: 25, date: '2026-02-01', reference: 'gym', category: 'leisure' },
  ]
}

/** Get auto-detected spending items per sub-category from bank extractions */
export function getDetectedSpendingItems(
  extractions: BankStatementExtraction[],
): Record<string, { payee: string; amount: number; frequency: string }[]> {
  const result: Record<string, { payee: string; amount: number; frequency: string }[]> = {}
  const payments = extractions.flatMap((e) => e.regular_payments)

  const categoryMap: Record<string, string> = {
    mortgage: 'housing', rent: 'housing', council_tax: 'housing',
    utilities: 'utilities', subscription: 'utilities',
    insurance: 'transport',
    childcare: 'children', child_maintenance: 'children',
    pension_contribution: 'other',
  }

  for (const p of payments) {
    const cat = categoryMap[p.likely_category] ?? 'personal'
    if (cat === 'other') continue
    if (!result[cat]) result[cat] = []
    result[cat].push({
      payee: p.payee,
      amount: p.amount,
      frequency: p.frequency,
    })
  }
  return result
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
