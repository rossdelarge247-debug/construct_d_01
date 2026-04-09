import { NextRequest, NextResponse } from 'next/server'
import { analyseDocument, analyseDocumentDirect } from '@/lib/ai/document-analysis'

export const maxDuration = 120

export async function POST(request: NextRequest) {
  try {
    // Pre-flight: check API key is configured
    if (!process.env.ANTHROPIC_API_KEY) {
      console.error('[API] ANTHROPIC_API_KEY is not set')
      return NextResponse.json({
        analysis: null,
        message: 'AI service not configured. Please add your Anthropic API key in Vercel environment variables.',
        debug: 'ANTHROPIC_API_KEY missing',
      })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const fileName = file.name
    const fileType = file.type
    const fileSize = file.size

    console.log(`[Upload] File: ${fileName}, type: ${fileType}, size: ${(fileSize / 1024).toFixed(0)}KB`)

    if (fileSize > 10 * 1024 * 1024) {
      return NextResponse.json({
        analysis: null,
        message: `File too large (${(fileSize / 1024 / 1024).toFixed(1)}MB). Please upload files under 10MB.`,
      })
    }

    // For PDFs and images: single AI call that reads the document AND analyses it
    // This avoids the 2-call latency that causes Vercel timeouts
    if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
      const buffer = await file.arrayBuffer()
      const base64 = Buffer.from(buffer).toString('base64')
      console.log(`[Upload] PDF base64: ${(base64.length / 1024).toFixed(0)}KB`)

      try {
        const analysis = await analyseDocumentDirect(base64, 'application/pdf')
        console.log(`[Analysis] PDF direct: ${analysis.items.length} items, type: ${analysis.document_type}`)
        if (analysis.items.length === 0) {
          console.warn(`[Analysis] Zero items. Summary: ${analysis.document_summary}, type: ${analysis.document_type}`)
        }
        return NextResponse.json({
          analysis,
          message: analysis.items.length > 0
            ? `Found ${analysis.items.length} item${analysis.items.length !== 1 ? 's' : ''} from your ${analysis.document_type.replace(/_/g, ' ')}${analysis.provider ? ` (${analysis.provider})` : ''}.`
            : `Couldn't extract specific items from ${fileName}. ${analysis.document_summary !== 'Could not analyse this document automatically.' ? `We identified this as: ${analysis.document_summary}` : 'The AI could not parse the document.'} You can enter details manually.`,
        })
      } catch (pdfError) {
        const errMsg = pdfError instanceof Error ? pdfError.message : 'Unknown error'
        console.error('[PDF analysis] Error:', errMsg)
        return NextResponse.json({
          analysis: null,
          message: errMsg.includes('API key') || errMsg.includes('authentication')
            ? 'AI service authentication failed. Check your Anthropic API key.'
            : `Couldn't analyse this PDF (${fileName}). ${errMsg.includes('timeout') ? 'The request timed out — try a smaller file.' : 'Try a digital version from your online banking, or enter details manually.'}`,
        })
      }
    }

    if (fileType.startsWith('image/')) {
      const buffer = await file.arrayBuffer()
      const base64 = Buffer.from(buffer).toString('base64')
      const mediaType = fileType as 'image/jpeg' | 'image/png' | 'image/webp'

      try {
        const analysis = await analyseDocumentDirect(base64, mediaType)
        console.log(`[Analysis] Image direct: ${analysis.items.length} items, type: ${analysis.document_type}`)
        return NextResponse.json({
          analysis,
          message: analysis.items.length > 0
            ? `Found ${analysis.items.length} item${analysis.items.length !== 1 ? 's' : ''} from your ${analysis.document_type.replace(/_/g, ' ')}${analysis.provider ? ` (${analysis.provider})` : ''}.`
            : `Couldn't extract specific items. Try a clearer photo, or enter details manually.`,
        })
      } catch {
        return NextResponse.json({
          analysis: null,
          message: `Couldn't read this image. Try a clearer photo or upload as PDF.`,
        })
      }
    }

    // For text/CSV files: extract text then analyse
    const text = await file.text()

    if (!text || text.trim().length < 30) {
      return NextResponse.json({
        analysis: null,
        message: `Couldn't find readable content in ${fileName}. Try a digital PDF from your online banking, or enter details manually.`,
      })
    }

    console.log(`[Analysis] Text file: ${text.length} chars`)
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
