import { NextRequest, NextResponse } from 'next/server'
import { classifyDocument, extractFromDocument } from '@/lib/documents/processor'

// Extend Vercel serverless timeout — PDF processing + 3 AI calls needs time
export const maxDuration = 60

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({
        classification: null,
        extraction: null,
        message: 'No file was received. Please try again.',
      }, { status: 400 })
    }

    const fileName = file.name
    const fileType = file.type
    const fileSize = file.size

    // Size check
    if (fileSize > 10 * 1024 * 1024) {
      return NextResponse.json({
        classification: null,
        extraction: null,
        message: `This file is too large (${(fileSize / 1024 / 1024).toFixed(1)}MB). Please upload files under 10MB, or split large statements into separate files.`,
      })
    }

    // Read file content
    let text: string

    if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
      // For PDFs: read as base64 and send to Claude for text extraction
      const buffer = await file.arrayBuffer()
      const base64 = Buffer.from(buffer).toString('base64')

      // Use Claude to read the PDF content
      const Anthropic = (await import('@anthropic-ai/sdk')).default
      const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

      try {
        const pdfResponse = await client.messages.create({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 4096,
          messages: [{
            role: 'user',
            content: [{
              type: 'document',
              source: { type: 'base64', media_type: 'application/pdf', data: base64 },
            }, {
              type: 'text',
              text: 'Extract ALL text content from this document. Return the raw text exactly as it appears, preserving numbers, dates, names, and amounts. Do not summarise or interpret — just extract the text.',
            }],
          }],
        })

        const textBlock = pdfResponse.content.find(b => b.type === 'text')
        text = textBlock?.text ?? ''
      } catch (pdfError) {
        console.error('[PDF extraction] Error:', pdfError)
        return NextResponse.json({
          classification: null,
          extraction: null,
          message: `We couldn't read this PDF (${fileName}). It might be password-protected or scanned. Try downloading a digital version from your online banking, or enter details manually.`,
        })
      }
    } else if (fileType.startsWith('image/') || fileName.match(/\.(jpg|jpeg|png|webp)$/i)) {
      // For images: read as base64 and send to Claude vision
      const buffer = await file.arrayBuffer()
      const base64 = Buffer.from(buffer).toString('base64')
      const mediaType = fileType.startsWith('image/') ? fileType as 'image/jpeg' | 'image/png' | 'image/webp' : 'image/jpeg'

      try {
        const Anthropic = (await import('@anthropic-ai/sdk')).default
        const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

        const imgResponse = await client.messages.create({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 4096,
          messages: [{
            role: 'user',
            content: [{
              type: 'image',
              source: { type: 'base64', media_type: mediaType, data: base64 },
            }, {
              type: 'text',
              text: 'Extract ALL text content from this financial document image. Return the raw text exactly as it appears, preserving numbers, dates, names, and amounts.',
            }],
          }],
        })

        const textBlock = imgResponse.content.find(b => b.type === 'text')
        text = textBlock?.text ?? ''
      } catch (imgError) {
        console.error('[Image extraction] Error:', imgError)
        return NextResponse.json({
          classification: null,
          extraction: null,
          message: `We couldn't read this image (${fileName}). Try a clearer photo with good lighting, or upload the document as a PDF instead.`,
        })
      }
    } else {
      // Text-based files (CSV, TXT)
      text = await file.text()
    }

    if (!text || text.trim().length < 30) {
      return NextResponse.json({
        classification: { document_type: 'unknown', confidence: 0 },
        extraction: null,
        message: `We couldn't find enough readable content in ${fileName}. This sometimes happens with scanned documents or password-protected PDFs. Try downloading a digital version from your online banking, or enter details manually.`,
      })
    }

    console.log(`[Extract] Text extracted: ${text.length} chars. First 200: ${text.substring(0, 200)}`)

    // Step 1: Classify the document
    const classification = await classifyDocument(text)
    console.log(`[Extract] Classification: ${classification.document_type}, confidence: ${classification.confidence}`)

    // Step 2: Extract data — attempt even at lower confidence
    let extraction = null
    if (classification.confidence >= 0.3 && classification.document_type !== 'unknown') {
      extraction = await extractFromDocument(text, classification.document_type)
    } else if (classification.document_type === 'unknown') {
      // Try extraction anyway with a generic prompt — the document might still contain useful data
      extraction = await extractFromDocument(text, 'unknown')
    }

    console.log(`[Extract] Extraction: ${extraction?.items.length ?? 0} items found`)

    // Build user-friendly message
    let message: string
    if (extraction && extraction.items.length > 0) {
      const docName = classification.document_type !== 'unknown'
        ? classification.document_type.replace(/_/g, ' ')
        : 'document'
      const provider = classification.provider_name ? ` (${classification.provider_name})` : ''
      message = `Found ${extraction.items.length} item${extraction.items.length !== 1 ? 's' : ''} from your ${docName}${provider}.`
    } else if (classification.document_type !== 'unknown') {
      message = `We identified this as a ${classification.document_type.replace(/_/g, ' ')} but couldn't extract specific values. You can enter the details manually or try uploading a clearer version.`
    } else {
      message = `We couldn't identify this document type. This can happen with scanned documents or unusual formats. You can enter the details manually — we'll link this document as evidence.`
    }

    return NextResponse.json({
      classification,
      extraction,
      message,
      debug: {
        text_length: text.length,
        text_preview: text.substring(0, 200),
        classification_raw: classification,
        extraction_items: extraction?.items?.length ?? 0,
        extraction_summary: extraction?.raw_summary ?? null,
      },
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('[API /documents/extract] Error:', errorMessage)

    return NextResponse.json({
      classification: null,
      extraction: null,
      message: `Something went wrong processing your document. ${errorMessage.includes('API key') ? 'The AI service is not configured yet.' : 'Please try again or enter details manually.'}`,
    }, { status: 200 })
  }
}
