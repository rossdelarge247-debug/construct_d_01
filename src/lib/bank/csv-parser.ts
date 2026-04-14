// Parses bank statement CSVs into BankStatementExtraction shape.
// Supports: Monzo, Barclays, Starling, generic (auto-detected from headers).
// Used in dev mode to load real bank data without Tink credentials.

import type {
  BankStatementExtraction,
  ExtractedIncome,
  DetectedPayment,
  SpendingCategory,
} from '@/lib/ai/extraction-schemas'

// ═══ Format detection ═══

type BankFormat = 'monzo' | 'barclays' | 'starling' | 'generic'

interface ParsedTransaction {
  date: string
  description: string
  amount: number // positive = credit, negative = debit
  category?: string
}

function detectFormat(headers: string[]): BankFormat {
  const h = headers.map((s) => s.toLowerCase().trim())
  if (h.includes('emoji') || (h.includes('money out') && h.includes('money in'))) return 'monzo'
  if (h.includes('subcategory') && h.includes('memo')) return 'barclays'
  if (h.includes('counter party') && h.includes('spending category')) return 'starling'
  return 'generic'
}

// ═══ CSV parsing ═══

function parseCSVLine(line: string): string[] {
  const result: string[] = []
  let current = ''
  let inQuotes = false
  for (const ch of line) {
    if (ch === '"') {
      inQuotes = !inQuotes
    } else if (ch === ',' && !inQuotes) {
      result.push(current.trim())
      current = ''
    } else {
      current += ch
    }
  }
  result.push(current.trim())
  return result
}

function parseDate(dateStr: string): string {
  // Handle DD/MM/YYYY and YYYY-MM-DD
  const ddmmyyyy = dateStr.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/)
  if (ddmmyyyy) return `${ddmmyyyy[3]}-${ddmmyyyy[2].padStart(2, '0')}-${ddmmyyyy[1].padStart(2, '0')}`
  const iso = dateStr.match(/^\d{4}-\d{2}-\d{2}/)
  if (iso) return iso[0]
  return dateStr
}

function parseMonzo(headers: string[], rows: string[][]): ParsedTransaction[] {
  const idx = (name: string) => headers.findIndex((h) => h.toLowerCase().trim() === name.toLowerCase())
  const dateIdx = idx('Date')
  const nameIdx = idx('Name')
  const amountIdx = idx('Amount')
  const categoryIdx = idx('Category')
  const moneyOutIdx = idx('Money Out')
  const moneyInIdx = idx('Money In')

  return rows.map((row) => {
    let amount: number
    if (amountIdx >= 0 && row[amountIdx]) {
      amount = parseFloat(row[amountIdx].replace(/[£,]/g, ''))
    } else {
      const out = parseFloat((row[moneyOutIdx] || '0').replace(/[£,]/g, ''))
      const inc = parseFloat((row[moneyInIdx] || '0').replace(/[£,]/g, ''))
      amount = inc > 0 ? inc : -out
    }
    return {
      date: parseDate(row[dateIdx] || ''),
      description: row[nameIdx] || '',
      amount,
      category: row[categoryIdx] || undefined,
    }
  }).filter((t) => !isNaN(t.amount) && t.amount !== 0)
}

function parseBarclays(headers: string[], rows: string[][]): ParsedTransaction[] {
  const idx = (name: string) => headers.findIndex((h) => h.toLowerCase().trim() === name.toLowerCase())
  const dateIdx = idx('Date')
  const amountIdx = idx('Amount')
  const memoIdx = idx('Memo')
  const subcatIdx = idx('Subcategory')

  return rows.map((row) => ({
    date: parseDate(row[dateIdx] || ''),
    description: row[memoIdx] || '',
    amount: parseFloat((row[amountIdx] || '0').replace(/[£,]/g, '')),
    category: row[subcatIdx] || undefined,
  })).filter((t) => !isNaN(t.amount) && t.amount !== 0)
}

function parseStarling(headers: string[], rows: string[][]): ParsedTransaction[] {
  const idx = (name: string) => headers.findIndex((h) => h.toLowerCase().trim() === name.toLowerCase())
  const dateIdx = idx('Date')
  const counterPartyIdx = idx('Counter Party')
  const amountIdx = idx('Amount (GBP)')
  const categoryIdx = idx('Spending Category')

  return rows.map((row) => ({
    date: parseDate(row[dateIdx] || ''),
    description: row[counterPartyIdx] || '',
    amount: parseFloat((row[amountIdx] || '0').replace(/[£,]/g, '')),
    category: row[categoryIdx] || undefined,
  })).filter((t) => !isNaN(t.amount) && t.amount !== 0)
}

function parseGeneric(headers: string[], rows: string[][]): ParsedTransaction[] {
  // Try to find date, description, and amount columns by name
  const h = headers.map((s) => s.toLowerCase().trim())
  const dateIdx = h.findIndex((s) => s.includes('date'))
  const descIdx = h.findIndex((s) => s.includes('description') || s.includes('memo') || s.includes('name') || s.includes('reference'))
  const amountIdx = h.findIndex((s) => s.includes('amount') || s.includes('value'))

  if (dateIdx < 0 || amountIdx < 0) return []

  return rows.map((row) => ({
    date: parseDate(row[dateIdx] || ''),
    description: row[descIdx >= 0 ? descIdx : 0] || '',
    amount: parseFloat((row[amountIdx] || '0').replace(/[£,]/g, '')),
  })).filter((t) => !isNaN(t.amount) && t.amount !== 0)
}

// ═══ Transaction → Extraction ═══

function groupByPayee(transactions: ParsedTransaction[], isCredit: boolean): Map<string, ParsedTransaction[]> {
  const groups = new Map<string, ParsedTransaction[]>()
  const filtered = transactions.filter((t) => isCredit ? t.amount > 0 : t.amount < 0)
  for (const tx of filtered) {
    const key = tx.description.toLowerCase().replace(/\b(dd|so|s\/o|d\/d|ref:?\s*\w+)\b/gi, '').trim()
    if (!key) continue
    const group = groups.get(key) || []
    group.push(tx)
    groups.set(key, group)
  }
  return groups
}

function identifyIncomeFromCSV(credits: Map<string, ParsedTransaction[]>): ExtractedIncome[] {
  const result: ExtractedIncome[] = []
  for (const [, group] of credits) {
    if (group.length < 2) continue
    const amounts = group.map((t) => t.amount)
    const avg = Math.round(amounts.reduce((a, b) => a + b, 0) / amounts.length)
    const source = group[0].description
    const variation = amounts.length > 1
      ? (Math.max(...amounts) - Math.min(...amounts)) / avg
      : 0
    result.push({
      source,
      amount: avg,
      period: 'monthly',
      confidence: variation < 0.05 ? 0.95 : variation < 0.15 ? 0.85 : 0.75,
      type: inferIncomeType(source),
    })
  }
  return result.sort((a, b) => b.amount - a.amount)
}

function inferIncomeType(source: string): ExtractedIncome['type'] {
  const s = source.toLowerCase()
  if (s.includes('hmrc') || s.includes('dwp') || s.includes('universal credit') || s.includes('child benefit')) return 'benefits'
  if (s.includes('pension') || s.includes('retirement')) return 'pension_income'
  if (s.includes('rent')) return 'rental'
  return 'employment'
}

const CATEGORY_KEYWORDS: Record<DetectedPayment['likely_category'], string[]> = {
  mortgage: ['mortgage', 'halifax', 'nationwide bs', 'building society'],
  rent: ['rent', 'letting', 'openrent'],
  insurance: ['insurance', 'admiral', 'aviva', 'direct line', 'axa'],
  pension_contribution: ['pension', 'nest', 'aviva pension'],
  childcare: ['childcare', 'nursery', 'after school'],
  loan_repayment: ['loan', 'finance', 'klarna', 'afterpay'],
  child_maintenance: ['cms', 'child maintenance', 'csa'],
  utilities: ['gas', 'electric', 'water', 'british gas', 'eon', 'edf', 'octopus'],
  council_tax: ['council tax', 'council'],
  subscription: ['netflix', 'spotify', 'amazon prime', 'disney', 'sky', 'bt ', 'vodafone', 'ee ', 'o2 ', 'three'],
  unknown: [],
}

function inferCategory(description: string): DetectedPayment['likely_category'] {
  const d = description.toLowerCase()
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (category === 'unknown') continue
    if (keywords.some((kw) => d.includes(kw))) return category as DetectedPayment['likely_category']
  }
  return 'unknown'
}

function identifyPaymentsFromCSV(debits: Map<string, ParsedTransaction[]>): DetectedPayment[] {
  const result: DetectedPayment[] = []
  for (const [, group] of debits) {
    if (group.length < 2) continue
    const amounts = group.map((t) => Math.abs(t.amount))
    const avg = Math.round(amounts.reduce((a, b) => a + b, 0) / amounts.length)
    const payee = group[0].description
    const dates = group.map((t) => new Date(t.date).getTime()).sort()
    const gaps = dates.slice(1).map((d, i) => (d - dates[i]) / (24 * 60 * 60 * 1000))
    const avgGap = gaps.length > 0 ? gaps.reduce((a, b) => a + b, 0) / gaps.length : 30
    result.push({
      payee,
      amount: avg,
      frequency: avgGap < 10 ? 'weekly' : avgGap < 45 ? 'monthly' : avgGap < 120 ? 'quarterly' : 'annual',
      confidence: 0.85,
      likely_category: inferCategory(payee),
    })
  }
  return result.sort((a, b) => b.amount - a.amount)
}

function aggregateSpending(transactions: ParsedTransaction[]): SpendingCategory[] {
  const debits = transactions.filter((t) => t.amount < 0)
  const categories = new Map<string, { total: number; count: number }>()
  for (const tx of debits) {
    const cat = tx.category || inferCategory(tx.description) || 'Other'
    const existing = categories.get(cat) || { total: 0, count: 0 }
    existing.total += Math.abs(tx.amount)
    existing.count += 1
    categories.set(cat, existing)
  }
  const dates = debits.map((t) => t.date).sort()
  const months = dates.length > 1
    ? Math.max(1, Math.round(
        (new Date(dates[dates.length - 1]).getTime() - new Date(dates[0]).getTime()) / (30 * 24 * 60 * 60 * 1000)
      ))
    : 1

  return Array.from(categories.entries())
    .map(([category, { total, count }]) => ({
      category,
      monthly_average: Math.round(total / months),
      transaction_count: count,
    }))
    .sort((a, b) => b.monthly_average - a.monthly_average)
}

// ═══ Main export ═══

export interface CSVParseResult {
  extraction: BankStatementExtraction
  format: BankFormat
  transactionCount: number
  provider: string
}

export function parseCSVToExtraction(csvText: string, fileName?: string): CSVParseResult {
  const lines = csvText.split(/\r?\n/).filter((l) => l.trim())
  if (lines.length < 2) throw new Error('CSV must have at least a header row and one data row.')

  const headers = parseCSVLine(lines[0])
  const rows = lines.slice(1).map(parseCSVLine)

  const format = detectFormat(headers)

  let transactions: ParsedTransaction[]
  switch (format) {
    case 'monzo': transactions = parseMonzo(headers, rows); break
    case 'barclays': transactions = parseBarclays(headers, rows); break
    case 'starling': transactions = parseStarling(headers, rows); break
    default: transactions = parseGeneric(headers, rows); break
  }

  if (transactions.length === 0) throw new Error('No valid transactions found in CSV.')

  // Derive provider from format or filename
  const provider = format !== 'generic'
    ? format.charAt(0).toUpperCase() + format.slice(1)
    : (fileName?.replace(/[._-]/g, ' ').replace(/\.(csv)$/i, '').trim() || 'Imported bank')

  const credits = groupByPayee(transactions, true)
  const debits = groupByPayee(transactions, false)
  const dates = transactions.map((t) => t.date).filter(Boolean).sort()

  const extraction: BankStatementExtraction = {
    document_type: 'bank_statement',
    provider,
    account_number_last4: null,
    account_type: 'current',
    is_joint: false,
    joint_holder_name: null,
    statement_period_start: dates[0] || null,
    statement_period_end: dates[dates.length - 1] || null,
    closing_balance: Math.round(transactions.reduce((sum, t) => sum + t.amount, 0)),
    income_deposits: identifyIncomeFromCSV(credits),
    regular_payments: identifyPaymentsFromCSV(debits),
    spending_categories: aggregateSpending(transactions),
    notable_transactions: [],
  }

  return {
    extraction,
    format,
    transactionCount: transactions.length,
    provider,
  }
}
