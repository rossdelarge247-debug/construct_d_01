// Two-step AI extraction pipeline
// Step 1: Haiku reads PDF (only model that supports type: 'document') → extracts raw text + classifies
// Step 2: Sonnet analyses extracted text with document-type-specific prompt + structured output schema
//
// This replaces the single-call approach in document-analysis.ts which produced
// shallow extraction, hallucinated values, and truncated JSON.

import { CLASSIFICATION_PROMPT, getExtractionPrompt } from './extraction-prompts'
import {
  CLASSIFICATION_SCHEMA,
  BANK_STATEMENT_SCHEMA,
  PAYSLIP_SCHEMA,
  MORTGAGE_STATEMENT_SCHEMA,
  PENSION_CETV_SCHEMA,
  type DocumentClassification,
  type BankStatementExtraction,
  type PayslipExtraction,
  type MortgageStatementExtraction,
  type PensionCETVExtraction,
} from './extraction-schemas'

// Models
const HAIKU_MODEL = 'claude-haiku-4-5-20251001' // Only model confirmed working with PDF type: 'document'
const SONNET_MODEL = 'claude-sonnet-4-5-20241022' // For text analysis with structured outputs

export type ExtractionResult =
  | BankStatementExtraction
  | PayslipExtraction
  | MortgageStatementExtraction
  | PensionCETVExtraction

export interface PipelineResult {
  classification: DocumentClassification
  extraction: ExtractionResult | null
  rawText: string
  stepTimings: { classify: number; extract: number }
  error: string | null
}

/**
 * Full two-step pipeline for PDF documents.
 * Step 1: Haiku reads the PDF and extracts text + classifies document type
 * Step 2: Sonnet analyses the extracted text with a type-specific prompt and structured output
 */
export async function extractFromPDF(
  base64Data: string,
): Promise<PipelineResult> {
  const Anthropic = (await import('@anthropic-ai/sdk')).default
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

  const timings = { classify: 0, extract: 0 }

  // ═══ Step 1: Haiku reads PDF + classifies ═══
  console.log('[Pipeline] Step 1: Haiku reading PDF and classifying...')
  const step1Start = Date.now()

  let rawText: string
  let classification: DocumentClassification

  try {
    const step1Response = await client.messages.create({
      model: HAIKU_MODEL,
      max_tokens: 8192,
      messages: [{
        role: 'user',
        content: [
          {
            type: 'document',
            source: { type: 'base64', media_type: 'application/pdf', data: base64Data },
          },
          {
            type: 'text',
            text: `Read this UK financial document carefully. Do two things:

1. EXTRACT ALL TEXT from the document. Include every number, every label, every transaction. Preserve the structure (tables, columns, rows). This text will be analysed by another system, so completeness is critical.

2. CLASSIFY the document type.

Return your response in this exact format:

---CLASSIFICATION---
{classification JSON}
---TEXT---
{full extracted text}

${CLASSIFICATION_PROMPT}`,
          },
        ],
      }],
    })

    timings.classify = Date.now() - step1Start
    const step1Text = step1Response.content.find(b => b.type === 'text')?.text ?? ''

    console.log(`[Pipeline] Step 1 complete: ${step1Response.usage.input_tokens} in, ${step1Response.usage.output_tokens} out, ${timings.classify}ms`)

    // Parse the two-part response
    const classificationMatch = step1Text.match(/---CLASSIFICATION---\s*([\s\S]*?)---TEXT---/)
    const textMatch = step1Text.match(/---TEXT---\s*([\s\S]*)$/)

    if (!classificationMatch || !textMatch) {
      // Fallback: treat entire response as text, classify as unknown
      console.warn('[Pipeline] Could not parse step 1 response format, using fallback')
      rawText = step1Text
      classification = { document_type: 'unknown', confidence: 0, provider: null, description: 'Could not parse classification' }
    } else {
      const classJson = classificationMatch[1].trim()
      rawText = textMatch[1].trim()

      try {
        classification = JSON.parse(classJson.replace(/```json?\n?/g, '').replace(/```/g, '').trim())
      } catch {
        console.warn('[Pipeline] Classification JSON parse failed, attempting text extraction')
        classification = { document_type: 'unknown', confidence: 0, provider: null, description: 'Classification parse failed' }
      }
    }

    console.log(`[Pipeline] Classified as: ${classification.document_type} (confidence: ${classification.confidence}), text length: ${rawText.length} chars`)

    if (rawText.length < 50) {
      return {
        classification,
        extraction: null,
        rawText,
        stepTimings: timings,
        error: 'Could not extract readable text from this document. Try a digital PDF from your online banking.',
      }
    }
  } catch (step1Error) {
    const msg = step1Error instanceof Error ? step1Error.message : 'Unknown error'
    console.error('[Pipeline] Step 1 failed:', msg)
    return {
      classification: { document_type: 'unknown', confidence: 0, provider: null, description: 'Step 1 failed' },
      extraction: null,
      rawText: '',
      stepTimings: timings,
      error: `Could not read this document: ${msg}`,
    }
  }

  // ═══ Step 2: Sonnet analyses extracted text ═══
  console.log(`[Pipeline] Step 2: Sonnet analysing as ${classification.document_type}...`)
  const step2Start = Date.now()

  const extractionPrompt = getExtractionPrompt(classification.document_type)
  const schema = getSchemaForType(classification.document_type)

  try {
    const step2Response = await client.messages.create({
      model: SONNET_MODEL,
      max_tokens: 8192,
      system: 'You are a financial document analyst for UK divorce/separation cases. Extract data precisely from the provided text. Return structured JSON matching the required schema. Never invent values — only extract what is explicitly stated.',
      messages: [{
        role: 'user',
        content: `${extractionPrompt}\n\nDOCUMENT TEXT:\n${rawText.substring(0, 15000)}`,
      }],
      ...(schema ? {
        response_format: {
          type: 'json_schema' as const,
          json_schema: {
            name: `${classification.document_type}_extraction`,
            schema,
            strict: true,
          },
        },
      } : {}),
    })

    timings.extract = Date.now() - step2Start
    const step2Text = step2Response.content.find(b => b.type === 'text')?.text ?? ''

    console.log(`[Pipeline] Step 2 complete: ${step2Response.usage.input_tokens} in, ${step2Response.usage.output_tokens} out, ${timings.extract}ms`)

    // With structured outputs, this should always be valid JSON
    let extraction: ExtractionResult
    try {
      extraction = JSON.parse(step2Text)
    } catch (parseError) {
      // Structured outputs should prevent this, but fallback gracefully
      console.error('[Pipeline] Step 2 JSON parse failed despite structured outputs:', parseError)

      // Try cleaning markdown fences
      const cleaned = step2Text.replace(/```json?\n?/g, '').replace(/```/g, '').trim()
      try {
        extraction = JSON.parse(cleaned)
      } catch {
        return {
          classification,
          extraction: null,
          rawText,
          stepTimings: timings,
          error: 'Could not parse extraction results. Please try again.',
        }
      }
    }

    console.log(`[Pipeline] Extraction complete for ${classification.document_type}`)
    return {
      classification,
      extraction,
      rawText,
      stepTimings: timings,
      error: null,
    }
  } catch (step2Error) {
    const msg = step2Error instanceof Error ? step2Error.message : 'Unknown error'
    console.error('[Pipeline] Step 2 failed:', msg)

    // If Sonnet fails, try falling back to Haiku for analysis (lower quality but still useful)
    console.log('[Pipeline] Falling back to Haiku for analysis...')
    try {
      const fallbackResponse = await client.messages.create({
        model: HAIKU_MODEL,
        max_tokens: 8192,
        system: 'You are a financial document analyst. Extract data precisely. Return valid JSON only.',
        messages: [{
          role: 'user',
          content: `${extractionPrompt}\n\nDOCUMENT TEXT:\n${rawText.substring(0, 10000)}\n\nReturn valid JSON only. No markdown, no code fences.`,
        }],
      })

      const fallbackText = fallbackResponse.content.find(b => b.type === 'text')?.text ?? ''
      const cleaned = fallbackText.replace(/```json?\n?/g, '').replace(/```/g, '').trim()
      const extraction = JSON.parse(cleaned)

      console.log('[Pipeline] Haiku fallback succeeded')
      return {
        classification,
        extraction,
        rawText,
        stepTimings: timings,
        error: null,
      }
    } catch (fallbackError) {
      return {
        classification,
        extraction: null,
        rawText,
        stepTimings: timings,
        error: `Analysis failed: ${msg}. Please try again.`,
      }
    }
  }
}

/**
 * Pipeline for image documents (photos of statements, etc.)
 * Same two-step approach but Step 1 uses image content type
 */
export async function extractFromImage(
  base64Data: string,
  mediaType: 'image/jpeg' | 'image/png' | 'image/webp',
): Promise<PipelineResult> {
  const Anthropic = (await import('@anthropic-ai/sdk')).default
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

  const timings = { classify: 0, extract: 0 }
  const step1Start = Date.now()

  try {
    // Step 1: Haiku reads image
    const step1Response = await client.messages.create({
      model: HAIKU_MODEL,
      max_tokens: 8192,
      messages: [{
        role: 'user',
        content: [
          {
            type: 'image',
            source: { type: 'base64', media_type: mediaType, data: base64Data },
          },
          {
            type: 'text',
            text: `Read this UK financial document image carefully. Extract ALL text including numbers, labels, and table data. Then classify the document type.

Return in this format:
---CLASSIFICATION---
{"document_type": "...", "confidence": 0.0, "provider": "...", "description": "..."}
---TEXT---
[all extracted text]

${CLASSIFICATION_PROMPT}`,
          },
        ],
      }],
    })

    timings.classify = Date.now() - step1Start
    const step1Text = step1Response.content.find(b => b.type === 'text')?.text ?? ''

    const classificationMatch = step1Text.match(/---CLASSIFICATION---\s*([\s\S]*?)---TEXT---/)
    const textMatch = step1Text.match(/---TEXT---\s*([\s\S]*)$/)

    const rawText = textMatch?.[1]?.trim() ?? step1Text
    let classification: DocumentClassification

    try {
      const classJson = classificationMatch?.[1]?.trim().replace(/```json?\n?/g, '').replace(/```/g, '').trim()
      classification = classJson ? JSON.parse(classJson) : { document_type: 'unknown', confidence: 0, provider: null, description: 'Could not classify' }
    } catch {
      classification = { document_type: 'unknown', confidence: 0, provider: null, description: 'Classification parse failed' }
    }

    if (rawText.length < 50) {
      return { classification, extraction: null, rawText, stepTimings: timings, error: 'Could not read enough text from this image. Try a clearer photo or upload as PDF.' }
    }

    // Step 2: Same as PDF pipeline
    const step2Start = Date.now()
    const extractionPrompt = getExtractionPrompt(classification.document_type)
    const schema = getSchemaForType(classification.document_type)

    const step2Response = await client.messages.create({
      model: SONNET_MODEL,
      max_tokens: 8192,
      system: 'You are a financial document analyst for UK divorce/separation cases. Extract data precisely. Return structured JSON. Never invent values.',
      messages: [{
        role: 'user',
        content: `${extractionPrompt}\n\nDOCUMENT TEXT:\n${rawText.substring(0, 15000)}`,
      }],
      ...(schema ? {
        response_format: {
          type: 'json_schema' as const,
          json_schema: {
            name: `${classification.document_type}_extraction`,
            schema,
            strict: true,
          },
        },
      } : {}),
    })

    timings.extract = Date.now() - step2Start
    const step2Text = step2Response.content.find(b => b.type === 'text')?.text ?? ''
    const extraction = JSON.parse(step2Text.replace(/```json?\n?/g, '').replace(/```/g, '').trim())

    return { classification, extraction, rawText, stepTimings: timings, error: null }
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Unknown error'
    return {
      classification: { document_type: 'unknown', confidence: 0, provider: null, description: 'Failed' },
      extraction: null,
      rawText: '',
      stepTimings: timings,
      error: `Could not process image: ${msg}`,
    }
  }
}

/**
 * Pipeline for pre-extracted text (CSV, plain text)
 * Skips Step 1 — goes straight to classification + extraction
 */
export async function extractFromText(
  text: string,
): Promise<PipelineResult> {
  const Anthropic = (await import('@anthropic-ai/sdk')).default
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

  const timings = { classify: 0, extract: 0 }

  // Classify first
  const classifyStart = Date.now()
  try {
    const classifyResponse = await client.messages.create({
      model: HAIKU_MODEL,
      max_tokens: 256,
      system: 'Classify this UK financial document. Return JSON only.',
      messages: [{
        role: 'user',
        content: `${CLASSIFICATION_PROMPT}\n\nDOCUMENT TEXT:\n${text.substring(0, 2000)}`,
      }],
    })

    timings.classify = Date.now() - classifyStart
    const classText = classifyResponse.content.find(b => b.type === 'text')?.text ?? '{}'
    const classification: DocumentClassification = JSON.parse(classText.replace(/```json?\n?/g, '').replace(/```/g, '').trim())

    // Extract
    const extractStart = Date.now()
    const extractionPrompt = getExtractionPrompt(classification.document_type)
    const schema = getSchemaForType(classification.document_type)

    const extractResponse = await client.messages.create({
      model: SONNET_MODEL,
      max_tokens: 8192,
      system: 'You are a financial document analyst. Extract data precisely. Return structured JSON. Never invent values.',
      messages: [{
        role: 'user',
        content: `${extractionPrompt}\n\nDOCUMENT TEXT:\n${text.substring(0, 15000)}`,
      }],
      ...(schema ? {
        response_format: {
          type: 'json_schema' as const,
          json_schema: {
            name: `${classification.document_type}_extraction`,
            schema,
            strict: true,
          },
        },
      } : {}),
    })

    timings.extract = Date.now() - extractStart
    const extractText = extractResponse.content.find(b => b.type === 'text')?.text ?? ''
    const extraction = JSON.parse(extractText.replace(/```json?\n?/g, '').replace(/```/g, '').trim())

    return { classification, extraction, rawText: text, stepTimings: timings, error: null }
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Unknown error'
    return {
      classification: { document_type: 'unknown', confidence: 0, provider: null, description: 'Failed' },
      extraction: null,
      rawText: text,
      stepTimings: timings,
      error: `Could not process text: ${msg}`,
    }
  }
}

// ═══ Helpers ═══

function getSchemaForType(documentType: string) {
  switch (documentType) {
    case 'bank_statement': return BANK_STATEMENT_SCHEMA
    case 'payslip': return PAYSLIP_SCHEMA
    case 'mortgage_statement': return MORTGAGE_STATEMENT_SCHEMA
    case 'pension_cetv': return PENSION_CETV_SCHEMA
    default: return BANK_STATEMENT_SCHEMA // fallback to most comprehensive
  }
}
