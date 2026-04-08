'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/utils/cn'

interface DocumentUploadProps {
  onProcessed: (result: { classification: unknown; extraction: unknown; message: string }) => void
  prompt?: string
  hint?: string
}

const PROCESSING_MESSAGES = [
  { text: 'Reading your document...', delay: 0 },
  { text: 'Identifying document type...', delay: 2000 },
  { text: 'Extracting financial details...', delay: 4000 },
  { text: 'Categorising transactions...', delay: 7000 },
  { text: 'Nearly there — organising everything...', delay: 10000 },
]

export function DocumentUpload({ onProcessed, prompt, hint }: DocumentUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [currentMessage, setCurrentMessage] = useState('')
  const [fileName, setFileName] = useState<string | null>(null)
  const [pulseVisible, setPulseVisible] = useState(true)
  const inputRef = useRef<HTMLInputElement>(null)

  // Gentle idle pulse
  useEffect(() => {
    if (isProcessing) return
    const interval = setInterval(() => {
      setPulseVisible(v => !v)
    }, 3000)
    return () => clearInterval(interval)
  }, [isProcessing])

  const processFile = useCallback(async (file: File) => {
    setFileName(file.name)
    setIsProcessing(true)

    // Stagger processing messages for conversational feel
    const timers: ReturnType<typeof setTimeout>[] = []
    PROCESSING_MESSAGES.forEach(msg => {
      timers.push(setTimeout(() => setCurrentMessage(msg.text), msg.delay))
    })

    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/documents/extract', {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) {
        const errorText = await res.text()
        onProcessed({
          classification: null,
          extraction: null,
          message: `Upload failed (${res.status}): ${errorText.substring(0, 200)}. Please try again or enter details manually.`,
        })
        return
      }

      const result = await res.json()
      onProcessed(result)
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error'
      console.error('[DocumentUpload] Error:', errorMsg)
      onProcessed({
        classification: null,
        extraction: null,
        message: `Connection error: ${errorMsg}. This may be a timeout — large documents can take a moment. Please try again.`,
      })
    } finally {
      timers.forEach(clearTimeout)
      setIsProcessing(false)
      setCurrentMessage('')
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

  // Processing state — conversational and calm
  if (isProcessing) {
    return (
      <div className="rounded-[var(--radius-md)] border border-warmth-light bg-warmth-light/10 p-8 text-center space-y-4">
        {/* Animated processing indicator */}
        <div className="flex justify-center">
          <div className="relative h-12 w-12">
            <div className="absolute inset-0 rounded-full border-2 border-warmth-light" />
            <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-warmth" style={{ animationDuration: '1.5s' }} />
          </div>
        </div>

        <div className="space-y-1">
          <p className="text-sm font-medium text-ink transition-all duration-300">{currentMessage}</p>
          {fileName && (
            <p className="text-xs text-ink-faint">{fileName}</p>
          )}
        </div>

        <p className="text-xs text-ink-faint">
          You can leave and come back — we&apos;ll keep working.
        </p>
      </div>
    )
  }

  // Upload state — inviting and premium
  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className={cn(
        'relative rounded-[var(--radius-md)] border-2 border-dashed p-10 text-center transition-all duration-300',
        isDragging
          ? 'border-warmth bg-warmth-light/20 scale-[1.01]'
          : 'border-cream-dark bg-cream-dark/5 hover:border-ink-faint hover:bg-cream-dark/10',
      )}
    >
      {/* Subtle pulse ring when idle */}
      <div className={cn(
        'absolute inset-0 rounded-[var(--radius-md)] border-2 border-warmth/20 transition-opacity duration-1000',
        pulseVisible && !isDragging ? 'opacity-100' : 'opacity-0',
      )} />

      <div className="relative space-y-3">
        {/* Icon */}
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-cream-dark">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-ink-light">
            <path d="M10 3v10m0-10L6 7m4-4l4 4M3 14v2a1 1 0 001 1h12a1 1 0 001-1v-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <p className="text-sm text-ink">
          {prompt || 'Drop your document here'}
        </p>
        {hint && (
          <p className="text-xs text-ink-faint leading-relaxed max-w-xs mx-auto">{hint}</p>
        )}

        <Button
          variant="secondary"
          size="sm"
          onClick={() => inputRef.current?.click()}
        >
          Choose file
        </Button>
      </div>

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
