import { NextRequest, NextResponse } from 'next/server'
import { extractFromPDF, extractFromImage, extractFromText } from '@/lib/ai/pipeline'
import type { PipelineResult } from '@/lib/ai/pipeline'
import { transformExtractionResult } from '@/lib/ai/result-transformer'
import type { BankStatementExtraction, DocumentClassification } from '@/lib/ai/extraction-schemas'

// Vercel Pro allows up to 300s. Two-step pipeline: Haiku PDF read (5-60s
// depending on PDF size) + Sonnet structured output (~33s) = up to ~90s.
// Set to 300s for safety — large PDFs with many pages can take longer.
export const maxDuration = 300

function buildResponse(result: PipelineResult) {
  let transformed
  try {
    transformed = transformExtractionResult(result.classification, result.extraction)
  } catch (transformError) {
    const msg = transformError instanceof Error ? transformError.message : 'Unknown transform error'
    console.error('[API] Transform error:', msg, transformError instanceof Error ? transformError.stack : '')
    transformed = { autoConfirmItems: [], questions: [], financialItems: [], processingMessages: [] }
  }

  return NextResponse.json({
    result: {
      classification: result.classification,
      rawText: result.rawText.substring(0, 5000), // Truncate to prevent large responses
      stepTimings: result.stepTimings,
      error: result.error,
    },
    transformed,
    diagnostics: result.diagnostics,
  })
}

export async function POST(request: NextRequest) {
  try {
    if (!process.env.ANTHROPIC_API_KEY) {
      console.log('[API] No ANTHROPIC_API_KEY — returning dry-run mock data')
      return buildResponse(getDryRunPipelineResult())
    }

    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ result: null, transformed: null, error: 'No file provided' }, { status: 400 })
    }

    const fileName = file.name
    const fileType = file.type
    const fileSize = file.size

    console.log(`[API] Upload: ${fileName}, type: ${fileType}, size: ${(fileSize / 1024).toFixed(0)}KB`)

    if (fileSize > 10 * 1024 * 1024) {
      return NextResponse.json({
        result: null,
        transformed: null,
        error: `File too large (${(fileSize / 1024 / 1024).toFixed(1)}MB). Please upload files under 10MB.`,
      }, { status: 400 })
    }

    // ═══ PDF documents ═══
    if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
      const buffer = await file.arrayBuffer()
      const base64 = Buffer.from(buffer).toString('base64')
      console.log(`[API] PDF: ${(base64.length / 1024).toFixed(0)}KB base64`)

      const result = await extractFromPDF(base64)

      console.log(`[API] Pipeline complete: ${result.classification.document_type}, ` +
        `step1: ${result.stepTimings.classify}ms, step2: ${result.stepTimings.extract}ms, ` +
        `error: ${result.error ?? 'none'}`)

      return buildResponse(result)
    }

    // ═══ Image documents ═══
    if (fileType.startsWith('image/')) {
      const buffer = await file.arrayBuffer()
      const base64 = Buffer.from(buffer).toString('base64')
      const mediaType = fileType as 'image/jpeg' | 'image/png' | 'image/webp'

      const result = await extractFromImage(base64, mediaType)

      console.log(`[API] Image pipeline complete: ${result.classification.document_type}, ` +
        `error: ${result.error ?? 'none'}`)

      return buildResponse(result)
    }

    // ═══ Text/CSV documents ═══
    const text = await file.text()

    if (!text || text.trim().length < 30) {
      return NextResponse.json({
        result: null,
        transformed: null,
        error: `Could not find readable content in ${fileName}. Try a digital PDF from your online banking.`,
      }, { status: 400 })
    }

    const result = await extractFromText(text)

    console.log(`[API] Text pipeline complete: ${result.classification.document_type}, ` +
      `error: ${result.error ?? 'none'}`)

    return buildResponse(result)

  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Unknown error'
    console.error('[API] Unhandled error:', msg)
    return NextResponse.json({
      result: null,
      transformed: null,
      error: `Something went wrong: ${msg.includes('API key') ? 'AI service not configured.' : 'Please try again.'}`,
    }, { status: 500 })
  }
}

/**
 * Dry-run mock: realistic BankStatementExtraction that flows through
 * the real transformExtractionResult pipeline. Tests the full downstream:
 * keyword lookup, payment aggregation, Q&A flow, section cards, category grouping.
 */
function getDryRunPipelineResult(): PipelineResult {
  const classification: DocumentClassification = {
    document_type: 'bank_statement',
    confidence: 0.97,
    provider: 'Barclays',
    description: '[DRY RUN] Mock Barclays current account statement',
  }

  const extraction: BankStatementExtraction = {
    document_type: 'bank_statement',
    provider: 'Barclays',
    account_number_last4: '8598',
    account_type: 'current',
    is_joint: false,
    joint_holder_name: null,
    statement_period_start: '2025-10-01',
    statement_period_end: '2025-10-31',
    closing_balance: 2847.63,
    income_deposits: [
      { source: 'ACME Ltd', amount: 3218, period: 'monthly', confidence: 0.97, type: 'employment' },
      { source: 'HMRC Child Benefit', amount: 96.45, period: 'monthly', confidence: 0.95, type: 'benefits' },
    ],
    regular_payments: [
      { payee: 'Halifax', amount: 1150, frequency: 'monthly', confidence: 0.96, likely_category: 'mortgage' },
      { payee: 'Vodafone', amount: 42, frequency: 'monthly', confidence: 0.80, likely_category: 'unknown' },
      { payee: 'Netflix', amount: 15.99, frequency: 'monthly', confidence: 0.70, likely_category: 'subscription' },
      { payee: 'Aviva', amount: 185, frequency: 'monthly', confidence: 0.75, likely_category: 'insurance' },
      { payee: 'PureGym', amount: 24.99, frequency: 'monthly', confidence: 0.60, likely_category: 'unknown' },
      { payee: 'Little Stars Nursery', amount: 650, frequency: 'monthly', confidence: 0.85, likely_category: 'childcare' },
      { payee: 'Thames Water', amount: 38, frequency: 'monthly', confidence: 0.92, likely_category: 'utilities' },
      { payee: 'Wandsworth Council', amount: 178, frequency: 'monthly', confidence: 0.94, likely_category: 'council_tax' },
    ],
    spending_categories: [
      { category: 'Groceries', monthly_average: 420, transaction_count: 18 },
      { category: 'Eating out', monthly_average: 95, transaction_count: 6 },
      { category: 'Transport', monthly_average: 85, transaction_count: 12 },
    ],
    notable_transactions: [],
  }

  return {
    classification,
    extraction,
    rawText: '[DRY RUN] No real PDF processed — using mock data for testing.',
    stepTimings: { classify: 0, extract: 0 },
    diagnostics: {
      step1: {
        model: 'dry-run', status: 'success',
        inputTokens: 0, outputTokens: 0, timeMs: 0, textLength: 0,
        classificationResult: 'bank_statement', error: null,
      },
      step2: {
        model: 'dry-run', status: 'success',
        inputTokens: 0, outputTokens: 0, timeMs: 0,
        promptUsed: 'dry-run', schemaUsed: 'BankStatementExtraction',
        extractionItemCount: 10, error: null,
      },
    },
    error: null,
  }
}
