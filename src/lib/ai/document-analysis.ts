// AI Analysis — returns tiered results (auto/confirm/question/gap)
// This replaces the flat extraction approach

import { generateCompletion } from '@/lib/ai/provider'

export interface AnalysisItem {
  id: string
  label: string
  value: number
  period: 'monthly' | 'annual' | 'total'
  confidence: number
  tier: 'auto' | 'confirm' | 'question'
  category: string
  subcategory: string
  ownership_hint: 'yours' | 'joint' | 'unknown'
  source_description: string
  confirm_question?: string
  confirm_options?: string[]
  question?: string
  options?: string[]
}

export interface GapPrompt {
  id: string
  domain: string
  prompt: string
  options: string[]
}

export interface AnalysisResult {
  document_summary: string
  document_type: string
  provider: string | null
  items: AnalysisItem[]
  gaps: GapPrompt[]
  spending?: { category: string; monthly_average: number; transaction_count: number }[]
}

export async function analyseDocument(documentText: string): Promise<AnalysisResult> {
  const response = await generateCompletion(
    `You are analysing a UK financial document for someone going through separation/divorce. Your job is to extract financial data AND assess what needs clarification.

DOCUMENT TEXT:
${documentText.substring(0, 10000)}

Return a JSON object with this EXACT structure:

{
  "document_summary": "One sentence describing what this document is",
  "document_type": "bank_statement|savings_statement|payslip|pension_letter|mortgage_statement|credit_card_statement|other",
  "provider": "Bank/provider name or null",
  "items": [
    {
      "id": "unique_id",
      "label": "Human-readable label",
      "value": 1234.56,
      "period": "monthly|annual|total",
      "confidence": 0.0 to 1.0,
      "tier": "auto|confirm|question",
      "category": "income|asset|liability|pension|property|other",
      "subcategory": "employment|savings|current_account|mortgage|debt|etc",
      "ownership_hint": "yours|joint|unknown",
      "source_description": "Where this value came from in the document",
      "confirm_question": "Only if tier=confirm: one-sentence question",
      "confirm_options": ["Option 1", "Option 2"],
      "question": "Only if tier=question: the question to ask",
      "options": ["Option 1", "Option 2", "Option 3", "I don't know"]
    }
  ],
  "gaps": [
    {
      "id": "gap_1",
      "domain": "pensions|savings|partner|other",
      "prompt": "Question about something not found in the document",
      "options": ["Yes", "No", "Skip"]
    }
  ],
  "spending": [
    {
      "category": "housing|insurance|utilities|groceries|transport|subscriptions|personal|eating_out|children|other",
      "monthly_average": 123.45,
      "transaction_count": 5
    }
  ]
}

TIER RULES:
- "auto" (confidence >= 0.9): You are very confident. Label, value, and category are clear from the document. Examples: regular salary deposits, account balances, named direct debits.
- "confirm" (confidence 0.7-0.9): You're fairly sure but need one simple confirmation. Provide confirm_question and confirm_options (2 choices max). Examples: "This £2,150 payment looks like a mortgage — is that right?" with options ["Yes, it's my mortgage", "No, it's rent"].
- "question" (confidence < 0.7): You genuinely can't determine from the document. Provide question and options (2-4 choices plus "I don't know"). Examples: large unusual transfers, ambiguous income sources.

GAP RULES:
- Only include 1-3 gaps maximum
- Only ask about things genuinely not found in the document
- Always include a "Skip" option
- Common gaps: pension contributions not visible, savings accounts not referenced, partner's income unknown

SPENDING RULES:
- Only include if this is a bank statement with transaction history
- Categorise into the standard categories listed above
- Calculate monthly averages from the statement period
- If the statement covers less than a month, extrapolate carefully

IMPORTANT:
- Extract ALL financial items you can find, not just a summary
- For bank statements: extract income deposits, account balances, spending categories, regular commitments
- For payslips: extract gross pay, net pay, tax, NI, pension contributions
- For pension letters: extract CETV value, provider, scheme type
- For mortgage statements: extract balance, monthly payment, interest rate
- Be generous with extraction — more items with high confidence is better than fewer
- Return ONLY valid JSON. No markdown, no code fences.`,
    {
      taskType: 'field_extraction',
      maxTokens: 3000,
      temperature: 0.3,
      systemPrompt: 'You are a financial document analyst for UK divorce/separation cases. Return structured JSON analysis with tiered confidence items. Always return valid JSON.',
    },
  )

  try {
    let content = response.content.trim()

    if (response.dryRun) {
      console.log('[AI Analysis] Running in DRY RUN mode — returning mock data')
    }

    // Strip markdown code fences if present
    if (content.startsWith('```')) {
      content = content.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim()
    }

    // Try to extract JSON if there's surrounding text
    if (!content.startsWith('{')) {
      const jsonMatch = content.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        content = jsonMatch[0]
      }
    }

    const result = JSON.parse(content) as AnalysisResult

    // Ensure all items have IDs
    result.items = (result.items || []).map((item, i) => ({
      ...item,
      id: item.id || `item_${i}_${Date.now()}`,
    }))
    result.gaps = (result.gaps || []).map((gap, i) => ({
      ...gap,
      id: gap.id || `gap_${i}_${Date.now()}`,
    }))

    console.log(`[AI Analysis] Parsed OK: ${result.items.length} items, ${result.gaps.length} gaps, dry_run: ${response.dryRun}`)
    return result
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown parse error'
    console.error(`[AI Analysis] Parse failed: ${errorMsg}`)
    console.error(`[AI Analysis] Raw content (first 500 chars): ${response.content.substring(0, 500)}`)
    console.error(`[AI Analysis] Was dry run: ${response.dryRun}`)
    return {
      document_summary: 'Could not analyse this document automatically.',
      document_type: 'other',
      provider: null,
      items: [],
      gaps: [],
    }
  }
}
