import { NextRequest, NextResponse } from 'next/server'
import { classifyDocument, extractFromDocument } from '@/lib/documents/processor'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Read file content as text
    // For PDFs, we'd need a PDF parser in production. For now, handle text-based content.
    const text = await file.text()

    if (!text || text.trim().length < 50) {
      return NextResponse.json({
        classification: { document_type: 'unknown', confidence: 0 },
        extraction: null,
        message: 'Could not read document content. Try uploading a text-based PDF or enter details manually.',
      })
    }

    // Step 1: Classify the document
    const classification = await classifyDocument(text)

    // Step 2: Extract data if classification is confident enough
    let extraction = null
    if (classification.confidence >= 0.5 && classification.document_type !== 'unknown') {
      extraction = await extractFromDocument(text, classification.document_type)
    }

    return NextResponse.json({
      classification,
      extraction,
      message: extraction
        ? `Found ${extraction.items.length} items from your ${classification.document_type.replace(/_/g, ' ')}.`
        : 'We couldn\'t extract data automatically. You can enter details manually.',
    })
  } catch (error) {
    console.error('[API /documents/extract] Error:', error)
    return NextResponse.json({
      classification: null,
      extraction: null,
      message: 'Something went wrong processing this document. Please try again or enter details manually.',
    }, { status: 200 }) // 200 not 500 — graceful degradation
  }
}
