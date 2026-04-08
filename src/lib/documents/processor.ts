// Document classification and extraction using AI
// Haiku for classification (fast, cheap), Sonnet for extraction (accurate)

import { generateCompletion } from '@/lib/ai/provider'

export type DocumentType =
  | 'bank_statement'
  | 'payslip'
  | 'pension_letter'
  | 'mortgage_statement'
  | 'savings_statement'
  | 'investment_statement'
  | 'tax_return'
  | 'credit_card_statement'
  | 'loan_statement'
  | 'property_valuation'
  | 'insurance_document'
  | 'business_accounts'
  | 'p60'
  | 'unknown'

export interface ClassificationResult {
  document_type: DocumentType
  confidence: number
  provider_name: string | null
  account_type: string | null
  is_joint: boolean | null
  date_range: string | null
}

export interface ExtractionResult {
  items: ExtractedFinancialItem[]
  spending_categories: ExtractedSpendingCategory[] | null
  accounts: ExtractedAccount[]
  raw_summary: string
}

export interface ExtractedFinancialItem {
  label: string
  value: number
  period: 'monthly' | 'annual' | 'total'
  category: string
  subcategory: string
  confidence: number
  ownership_hint: 'yours' | 'joint' | 'unknown'
  source_description: string
}

export interface ExtractedSpendingCategory {
  category: string
  monthly_average: number
  transaction_count: number
  examples: string[]
}

export interface ExtractedAccount {
  provider: string
  account_type: string
  account_reference: string
  balance: number
  balance_date: string
  is_joint: boolean | null
}

export async function classifyDocument(documentText: string): Promise<ClassificationResult> {
  const response = await generateCompletion(
    `Classify this financial document. Return JSON only.

DOCUMENT TEXT (first 2000 chars):
${documentText.substring(0, 2000)}

Return:
{
  "document_type": "bank_statement|payslip|pension_letter|mortgage_statement|savings_statement|investment_statement|tax_return|credit_card_statement|loan_statement|property_valuation|insurance_document|business_accounts|p60|unknown",
  "confidence": 0.0-1.0,
  "provider_name": "name of bank/provider or null",
  "account_type": "current|savings|credit_card|mortgage|pension|investment|loan or null",
  "is_joint": true/false/null,
  "date_range": "e.g. Jan 2025 - Dec 2025 or null"
}

Return ONLY valid JSON.`,
    {
      taskType: 'document_classification',
      maxTokens: 256,
      temperature: 0.1,
    },
  )

  try {
    return JSON.parse(response.content) as ClassificationResult
  } catch {
    return {
      document_type: 'unknown',
      confidence: 0,
      provider_name: null,
      account_type: null,
      is_joint: null,
      date_range: null,
    }
  }
}

export async function extractFromDocument(
  documentText: string,
  documentType: DocumentType,
): Promise<ExtractionResult> {
  const typeSpecificPrompt = getExtractionPrompt(documentType)

  const response = await generateCompletion(
    `Extract financial data from this ${documentType.replace(/_/g, ' ')}.

${typeSpecificPrompt}

DOCUMENT TEXT:
${documentText.substring(0, 8000)}

Return ONLY valid JSON matching the structure requested above.`,
    {
      taskType: 'field_extraction',
      maxTokens: 2048,
      temperature: 0.2,
    },
  )

  try {
    return JSON.parse(response.content) as ExtractionResult
  } catch {
    return { items: [], spending_categories: null, accounts: [], raw_summary: 'Extraction failed — please enter details manually.' }
  }
}

function getExtractionPrompt(type: DocumentType): string {
  switch (type) {
    case 'bank_statement':
      return `Extract ALL of the following:

1. Account details (provider, account number/reference, is it joint?)
2. Account balance and date
3. Regular income deposits (salary, benefits, etc.) with monthly amounts
4. Spending categorised into: housing, utilities, groceries, transport, insurance, children, subscriptions, personal, eating_out, debt_payments, other
5. Any other accounts referenced in transfers

Return:
{
  "items": [
    { "label": "Monthly salary", "value": 3200, "period": "monthly", "category": "income", "subcategory": "employment", "confidence": 0.95, "ownership_hint": "yours", "source_description": "Regular deposit from EMPLOYER NAME" }
  ],
  "spending_categories": [
    { "category": "housing", "monthly_average": 890, "transaction_count": 12, "examples": ["MORTGAGE PAYMENT"] },
    { "category": "groceries", "monthly_average": 420, "transaction_count": 48, "examples": ["TESCO", "SAINSBURY"] }
  ],
  "accounts": [
    { "provider": "Barclays", "account_type": "current", "account_reference": "****4521", "balance": 1842, "balance_date": "2026-03-15", "is_joint": true }
  ],
  "raw_summary": "Joint current account with Barclays. Regular salary deposits of £3,218/mo. 11 months of transactions analysed."
}`

    case 'payslip':
      return `Extract:
1. Employer name
2. Gross pay
3. Net pay (take-home)
4. Tax deducted
5. National Insurance
6. Pension contribution (if shown)
7. Pay period and date

Return:
{
  "items": [
    { "label": "Gross salary", "value": 4200, "period": "monthly", "category": "income", "subcategory": "employment", "confidence": 0.99, "ownership_hint": "yours", "source_description": "Payslip from EMPLOYER" },
    { "label": "Net salary", "value": 3218, "period": "monthly", "category": "income", "subcategory": "employment_net", "confidence": 0.99, "ownership_hint": "yours", "source_description": "Take-home pay" },
    { "label": "Pension contribution", "value": 168, "period": "monthly", "category": "pension", "subcategory": "contribution", "confidence": 0.95, "ownership_hint": "yours", "source_description": "Employee pension contribution 4%" }
  ],
  "spending_categories": null,
  "accounts": [],
  "raw_summary": "Payslip from EMPLOYER NAME, March 2026. Gross £4,200, net £3,218."
}`

    case 'pension_letter':
      return `Extract:
1. Pension provider name
2. Pension type (defined benefit / defined contribution / SIPP / personal)
3. CETV value if stated
4. Annual pension amount if stated
5. Retirement date if stated
6. Any transfer value

Return:
{
  "items": [
    { "label": "Pension CETV", "value": 87000, "period": "total", "category": "pension", "subcategory": "workplace", "confidence": 0.9, "ownership_hint": "yours", "source_description": "CETV from PROVIDER as at DATE" }
  ],
  "spending_categories": null,
  "accounts": [],
  "raw_summary": "Pension statement from PROVIDER. CETV: £87,000 as at DATE."
}`

    case 'mortgage_statement':
      return `Extract:
1. Lender name
2. Outstanding balance
3. Monthly payment
4. Interest rate
5. Remaining term
6. Property address if shown
7. Joint/sole names

Return:
{
  "items": [
    { "label": "Mortgage balance", "value": 195000, "period": "total", "category": "liability", "subcategory": "mortgage", "confidence": 0.95, "ownership_hint": "joint", "source_description": "Outstanding balance with LENDER" },
    { "label": "Monthly mortgage payment", "value": 890, "period": "monthly", "category": "outgoings", "subcategory": "housing", "confidence": 0.95, "ownership_hint": "joint", "source_description": "Monthly payment to LENDER" }
  ],
  "spending_categories": null,
  "accounts": [],
  "raw_summary": "Mortgage with LENDER. Balance: £195,000. Monthly: £890."
}`

    default:
      return `Extract all financial values you can find. For each item provide:
- label (what it is)
- value (number)
- period (monthly/annual/total)
- category (income/asset/liability/pension/property/outgoings)
- subcategory (more specific type)
- confidence (0-1)
- ownership_hint (yours/joint/unknown)
- source_description (where this value came from)

Return:
{
  "items": [...],
  "spending_categories": null,
  "accounts": [],
  "raw_summary": "Brief summary of what was found."
}`
  }
}
