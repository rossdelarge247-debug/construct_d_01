import { NextRequest, NextResponse } from 'next/server'
import { analyseDocument, analyseDocumentDirect } from '@/lib/ai/document-analysis'

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

    // For PDFs and images: single AI call that reads the document AND analyses it
    // This avoids the 2-call latency that causes Vercel timeouts
    if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
      const buffer = await file.arrayBuffer()
      const base64 = Buffer.from(buffer).toString('base64')

      try {
        const analysis = await analyseDocumentDirect(base64, 'application/pdf')
        console.log(`[Analysis] PDF direct: ${analysis.items.length} items, type: ${analysis.document_type}`)
        return NextResponse.json({
          analysis,
          message: analysis.items.length > 0
            ? `Found ${analysis.items.length} item${analysis.items.length !== 1 ? 's' : ''} from your ${analysis.document_type.replace(/_/g, ' ')}${analysis.provider ? ` (${analysis.provider})` : ''}.`
            : `Couldn't extract specific items from ${fileName}. You can enter details manually.`,
        })
      } catch (pdfError) {
        console.error('[PDF analysis] Error:', pdfError)
        return NextResponse.json({
          analysis: null,
          message: `Couldn't read this PDF (${fileName}). Try a digital version from your online banking, or enter details manually.`,
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
