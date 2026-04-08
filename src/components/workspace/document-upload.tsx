'use client'

import { useState, useCallback, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/utils/cn'

interface DocumentUploadProps {
  onProcessed: (result: { classification: unknown; extraction: unknown; message: string }) => void
  prompt?: string
  hint?: string
}

export function DocumentUpload({ onProcessed, prompt, hint }: DocumentUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingMessage, setProcessingMessage] = useState('')
  const [fileName, setFileName] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const processFile = useCallback(async (file: File) => {
    setFileName(file.name)
    setIsProcessing(true)
    setProcessingMessage('Reading your document...')

    try {
      const formData = new FormData()
      formData.append('file', file)

      setProcessingMessage('Classifying document type...')

      const res = await fetch('/api/documents/extract', {
        method: 'POST',
        body: formData,
      })

      setProcessingMessage('Extracting financial data...')

      const result = await res.json()
      onProcessed(result)
    } catch {
      onProcessed({
        classification: null,
        extraction: null,
        message: 'Something went wrong. Please try again or enter details manually.',
      })
    } finally {
      setIsProcessing(false)
      setProcessingMessage('')
      setFileName(null)
    }
  }, [onProcessed])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) processFile(file)
  }, [processFile])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) processFile(file)
  }, [processFile])

  if (isProcessing) {
    return (
      <div className="rounded-[var(--radius-md)] border border-warmth-light bg-warmth-light/10 p-6 text-center space-y-3">
        <div className="flex items-center justify-center gap-3">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-warmth-light border-t-warmth" />
          <p className="text-sm text-ink">{processingMessage}</p>
        </div>
        {fileName && (
          <p className="text-xs text-ink-faint">{fileName}</p>
        )}
        <p className="text-xs text-ink-faint">You can leave and come back. We&apos;ll keep processing.</p>
      </div>
    )
  }

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className={cn(
        'rounded-[var(--radius-md)] border-2 border-dashed p-8 text-center transition-all duration-200',
        isDragging ? 'border-warmth bg-warmth-light/20' : 'border-cream-dark bg-cream-dark/10',
      )}
    >
      <p className="text-sm text-ink">
        {prompt || 'Drop your document here'}
      </p>
      {hint && (
        <p className="mt-1 text-xs text-ink-faint">{hint}</p>
      )}
      <Button
        variant="secondary"
        className="mt-3"
        onClick={() => inputRef.current?.click()}
      >
        Choose file
      </Button>
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.jpg,.jpeg,.png,.csv,.txt"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  )
}
