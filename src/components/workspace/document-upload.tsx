'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/utils/cn'

interface DocumentUploadProps {
  onProcessed: (result: { classification: unknown; extraction: unknown; message: string }) => void
  prompt?: string
  hint?: string
  /** Controlled processing state — lifted to parent so tab switches don't lose it */
  isProcessing?: boolean
  onProcessingChange?: (processing: boolean) => void
  processingFileName?: string
  onFileNameChange?: (name: string | null) => void
}

const PROCESSING_PHASES = [
  { text: 'Opening your document', detail: 'Reading every page carefully', delay: 0 },
  { text: 'Identifying what this is', detail: 'Checking format, provider, and date range', delay: 2500 },
  { text: 'Extracting financial details', detail: 'Finding amounts, dates, and descriptions', delay: 5000 },
  { text: 'Categorising and cross-checking', detail: 'Matching items to your financial picture', delay: 8000 },
  { text: 'Preparing your review', detail: 'Organising what we found into clear sections', delay: 12000 },
]

export function DocumentUpload({ onProcessed, prompt, hint, isProcessing: controlledProcessing, onProcessingChange, processingFileName, onFileNameChange }: DocumentUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [internalProcessing, setInternalProcessing] = useState(false)
  const [currentPhase, setCurrentPhase] = useState(0)
  const [internalFileName, setInternalFileName] = useState<string | null>(null)
  const [pulseVisible, setPulseVisible] = useState(true)
  const inputRef = useRef<HTMLInputElement>(null)
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([])

  // Use controlled or internal state
  const isProcessing = controlledProcessing ?? internalProcessing
  const fileName = processingFileName ?? internalFileName

  const setProcessing = useCallback((v: boolean) => {
    onProcessingChange ? onProcessingChange(v) : setInternalProcessing(v)
  }, [onProcessingChange])

  const setFileName = useCallback((v: string | null) => {
    onFileNameChange ? onFileNameChange(v) : setInternalFileName(v)
  }, [onFileNameChange])

  // Gentle idle pulse
  useEffect(() => {
    if (isProcessing) return
    const interval = setInterval(() => {
      setPulseVisible(v => !v)
    }, 3000)
    return () => clearInterval(interval)
  }, [isProcessing])

  // Restart phase animation when processing starts (handles re-mount after tab switch)
  useEffect(() => {
    if (!isProcessing) {
      setCurrentPhase(0)
      return
    }
    // If we're processing (e.g. re-mounted after tab switch), restart phase timers
    timersRef.current.forEach(clearTimeout)
    timersRef.current = []
    setCurrentPhase(0)
    PROCESSING_PHASES.forEach((phase, i) => {
      if (i > 0) {
        timersRef.current.push(setTimeout(() => setCurrentPhase(i), phase.delay))
      }
    })
    return () => timersRef.current.forEach(clearTimeout)
  }, [isProcessing])

  const processFile = useCallback(async (file: File) => {
    setFileName(file.name)
    setProcessing(true)

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
      timersRef.current.forEach(clearTimeout)
      timersRef.current = []
      setProcessing(false)
      setFileName(null)
    }
  }, [onProcessed, setProcessing, setFileName])

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

  // Processing state — subtle AI sparkle thinking visual
  if (isProcessing) {
    const phase = PROCESSING_PHASES[currentPhase] || PROCESSING_PHASES[0]

    return (
      <div className="rounded-[var(--radius-lg)] border-[var(--border-card)] border-cream-dark bg-surface p-10 space-y-5">
        {/* Sparkle cluster — subtle twinkling dots */}
        <div className="flex items-center justify-center">
          <div className="relative h-10 w-10">
            {[
              { x: '50%', y: '20%', delay: '0s', size: 3 },
              { x: '80%', y: '45%', delay: '0.4s', size: 2 },
              { x: '65%', y: '75%', delay: '0.8s', size: 2.5 },
              { x: '25%', y: '60%', delay: '1.2s', size: 2 },
              { x: '35%', y: '35%', delay: '0.6s', size: 3.5 },
              { x: '70%', y: '20%', delay: '1.0s', size: 2 },
              { x: '15%', y: '30%', delay: '0.2s', size: 2 },
            ].map((dot, i) => (
              <div
                key={i}
                className="absolute rounded-full bg-warmth"
                style={{
                  left: dot.x,
                  top: dot.y,
                  width: dot.size,
                  height: dot.size,
                  animation: `sparkle 2s ease-in-out ${dot.delay} infinite`,
                }}
              />
            ))}
          </div>
        </div>

        {/* Phase text — conversational */}
        <div className="text-center space-y-1">
          <p className="text-sm font-semibold text-ink transition-all duration-500">{phase.text}</p>
          <p className="text-xs text-ink-faint transition-all duration-500">{phase.detail}</p>
        </div>

        {/* File name */}
        {fileName && (
          <p className="text-center text-[11px] text-ink-faint/60">{fileName}</p>
        )}

        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes sparkle {
            0%, 100% { opacity: 0; transform: scale(0.5); }
            50% { opacity: 1; transform: scale(1); }
          }
        `}} />
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
