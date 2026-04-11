import { NextRequest, NextResponse } from 'next/server'
import { extractFromPDF, extractFromImage, extractFromText } from '@/lib/ai/pipeline'
import type { PipelineResult } from '@/lib/ai/pipeline'
import { transformExtractionResult } from '@/lib/ai/result-transformer'

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
      console.error('[API] ANTHROPIC_API_KEY is not set')
      return NextResponse.json({
        result: null,
        transformed: null,
        error: 'AI service not configured. Please add your Anthropic API key.',
      }, { status: 503 })
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
