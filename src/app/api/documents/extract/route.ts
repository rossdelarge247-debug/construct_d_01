import { NextRequest, NextResponse } from 'next/server'
import { analyseDocument } from '@/lib/ai/document-analysis'

export const maxDuration = 60

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const fileName = file.name
    const fileType = file.type
    const fileSize = file.size

    if (fileSize > 10 * 1024 * 1024) {
      return NextResponse.json({
        analysis: null,
        message: `File too large (${(fileSize / 1024 / 1024).toFixed(1)}MB). Please upload files under 10MB.`,
      })
    }

    // Extract text from file
    let text: string

    if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
      const buffer = await file.arrayBuffer()
      const base64 = Buffer.from(buffer).toString('base64')

      try {
        const Anthropic = (await import('@anthropic-ai/sdk')).default
        const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

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
              text: 'Extract ALL text content from this document. Return the raw text exactly as it appears, preserving numbers, dates, names, and amounts. Do not summarise.',
            }],
          }],
        })

        const textBlock = pdfResponse.content.find(b => b.type === 'text')
        text = textBlock?.text ?? ''
      } catch (pdfError) {
        console.error('[PDF extraction] Error:', pdfError)
        return NextResponse.json({
          analysis: null,
          message: `Couldn't read this PDF (${fileName}). Try downloading a digital version from your online banking, or enter details manually.`,
        })
      }
    } else if (fileType.startsWith('image/')) {
      const buffer = await file.arrayBuffer()
      const base64 = Buffer.from(buffer).toString('base64')
      const mediaType = fileType as 'image/jpeg' | 'image/png' | 'image/webp'

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
              text: 'Extract ALL text content from this financial document. Preserve numbers, dates, names, and amounts.',
            }],
          }],
        })

        const textBlock = imgResponse.content.find(b => b.type === 'text')
        text = textBlock?.text ?? ''
      } catch {
        return NextResponse.json({
          analysis: null,
          message: `Couldn't read this image. Try a clearer photo or upload as PDF.`,
        })
      }
    } else {
      text = await file.text()
    }

    if (!text || text.trim().length < 30) {
      return NextResponse.json({
        analysis: null,
        message: `Couldn't find readable content in ${fileName}. Try a digital PDF from your online banking, or enter details manually.`,
      })
    }

    console.log(`[Analysis] Text: ${text.length} chars`)

    // Run tiered AI analysis
    const analysis = await analyseDocument(text)

    console.log(`[Analysis] Result: ${analysis.items.length} items, ${analysis.gaps.length} gaps, type: ${analysis.document_type}`)

    return NextResponse.json({
      analysis,
      message: analysis.items.length > 0
        ? `Found ${analysis.items.length} item${analysis.items.length !== 1 ? 's' : ''} from your ${analysis.document_type.replace(/_/g, ' ')}${analysis.provider ? ` (${analysis.provider})` : ''}.`
        : `Couldn't extract specific items. You can enter details manually.`,
    })
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Unknown error'
    console.error('[API] Error:', msg)
    return NextResponse.json({
      analysis: null,
      message: `Something went wrong. ${msg.includes('API key') ? 'AI service not configured.' : 'Please try again or enter details manually.'}`,
    })
  }
}
