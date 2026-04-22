import { NextRequest, NextResponse } from 'next/server'

// Isolation test endpoint for the two-step pipeline.
// Tests Step 1 (Haiku PDF read) and Step 2 (Sonnet structured output) independently.
// GET  /api/test-pipeline              — test both steps with a minimal text payload
// GET  /api/test-pipeline?step=1       — test only Step 1 (Haiku classification)
// GET  /api/test-pipeline?step=2       — test only Step 2 (Sonnet structured output)
// POST /api/test-pipeline              — test Step 1 with an uploaded PDF

export const maxDuration = 120

const HAIKU_MODEL = 'claude-haiku-4-5-20251001'
const SONNET_MODEL = 'claude-sonnet-4-6'

const SAMPLE_BANK_TEXT = `Barclays Bank Current Account
Account number: ****4532
Statement period: 1 March 2026 - 31 March 2026

Date        Description                    Debit      Credit     Balance
01/03/2026  Opening Balance                                      £2,341.56
01/03/2026  ACME LTD - SALARY                         £3,218.00  £5,559.56
03/03/2026  HALIFAX MORTGAGE               £1,150.00              £4,409.56
05/03/2026  COUNCIL TAX DD                 £185.00               £4,224.56
07/03/2026  TESCO SUPERSTORE               £87.42                £4,137.14
10/03/2026  BRITISH GAS DD                 £95.00                £4,042.14
15/03/2026  AVIVA PENSION CONTRIB          £200.00               £3,842.14
28/03/2026  SKY DIGITAL DD                 £43.00                £3,799.14
31/03/2026  Closing Balance                                      £3,799.14`

import { BANK_STATEMENT_SCHEMA } from '@/lib/ai/extraction-schemas'

export async function GET(request: NextRequest) {
  const step = request.nextUrl.searchParams.get('step') ?? 'both'

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: 'ANTHROPIC_API_KEY not set' }, { status: 503 })
  }

  const Anthropic = (await import('@anthropic-ai/sdk')).default
  const client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
    timeout: 45_000,
  })

  const results: Record<string, unknown> = { timestamp: new Date().toISOString(), step }

  // ═══ Step 1: Haiku classification ═══
  if (step === '1' || step === 'both') {
    const start = Date.now()
    try {
      const response = await client.messages.create({
        model: HAIKU_MODEL,
        max_tokens: 256,
        system: 'Classify this UK financial document. Return JSON only.',
        messages: [{
          role: 'user',
          content: `Determine the document type. Return JSON: {"document_type": "...", "confidence": 0.0, "provider": "...", "description": "..."}\n\nDOCUMENT TEXT:\n${SAMPLE_BANK_TEXT.substring(0, 2000)}`,
        }],
      })
      const elapsed = Date.now() - start
      const text = response.content.find(b => b.type === 'text')?.text ?? ''
      results.step1 = {
        status: 'ok',
        model: HAIKU_MODEL,
        timeMs: elapsed,
        inputTokens: response.usage.input_tokens,
        outputTokens: response.usage.output_tokens,
        rawResponse: text.substring(0, 500),
        parsed: (() => { try { return JSON.parse(text.replace(/```json?\n?/g, '').replace(/```/g, '').trim()) } catch { return null } })(),
      }
    } catch (error) {
      results.step1 = { status: 'error', model: HAIKU_MODEL, timeMs: Date.now() - start, error: error instanceof Error ? error.message : String(error) }
    }
  }

  // ═══ Step 2: Sonnet structured output ═══
  if (step === '2' || step === 'both') {
    const start = Date.now()
    try {
      const response = await client.messages.create({
        model: SONNET_MODEL,
        max_tokens: 4096,
        system: 'You are a financial document analyst. Extract data precisely. Return structured JSON. Never invent values.',
        messages: [{
          role: 'user',
          content: `Extract financial data from this UK bank statement.\n\nDOCUMENT TEXT:\n${SAMPLE_BANK_TEXT}`,
        }],
        output_config: {
          format: {
            type: 'json_schema',
            schema: BANK_STATEMENT_SCHEMA,
          },
        },
      })
      const elapsed = Date.now() - start
      const text = response.content.find(b => b.type === 'text')?.text ?? ''
      let parsed = null
      try { parsed = JSON.parse(text) } catch { /* ignore */ }
      results.step2 = {
        status: 'ok',
        model: SONNET_MODEL,
        timeMs: elapsed,
        inputTokens: response.usage.input_tokens,
        outputTokens: response.usage.output_tokens,
        responseLength: text.length,
        parsed,
      }
    } catch (error) {
      results.step2 = { status: 'error', model: SONNET_MODEL, timeMs: Date.now() - start, error: error instanceof Error ? error.message : String(error) }
    }
  }

  return NextResponse.json(results)
}

export async function POST(request: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: 'ANTHROPIC_API_KEY not set' }, { status: 503 })
  }

  const formData = await request.formData()
  const file = formData.get('file') as File | null
  if (!file) {
    return NextResponse.json({ error: 'No file provided. POST with multipart form data containing a "file" field.' }, { status: 400 })
  }

  const Anthropic = (await import('@anthropic-ai/sdk')).default
  const client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
    timeout: 45_000,
  })

  const buffer = await file.arrayBuffer()
  const base64 = Buffer.from(buffer).toString('base64')

  const start = Date.now()
  try {
    const response = await client.messages.create({
      model: HAIKU_MODEL,
      max_tokens: 8192,
      messages: [{
        role: 'user',
        content: [
          {
            type: 'document',
            source: { type: 'base64', media_type: 'application/pdf', data: base64 },
          },
          {
            type: 'text',
            text: 'Read this document. Extract ALL text. Then classify the document type.\n\nReturn:\n---CLASSIFICATION---\n{JSON}\n---TEXT---\n[all text]',
          },
        ],
      }],
    })

    const elapsed = Date.now() - start
    const text = response.content.find(b => b.type === 'text')?.text ?? ''
    const hasClassification = text.includes('---CLASSIFICATION---')
    const hasText = text.includes('---TEXT---')

    return NextResponse.json({
      status: 'ok',
      model: HAIKU_MODEL,
      fileSize: `${(file.size / 1024).toFixed(0)}KB`,
      base64Size: `${(base64.length / 1024).toFixed(0)}KB`,
      timeMs: elapsed,
      inputTokens: response.usage.input_tokens,
      outputTokens: response.usage.output_tokens,
      responseLength: text.length,
      hasClassificationSection: hasClassification,
      hasTextSection: hasText,
      preview: text.substring(0, 1000),
    })
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      model: HAIKU_MODEL,
      timeMs: Date.now() - start,
      error: error instanceof Error ? error.message : String(error),
    }, { status: 500 })
  }
}
