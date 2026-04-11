'use client'

import { useState } from 'react'
import { ChevronDown, ChevronRight, CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react'

interface PipelineDiagnostics {
  step1: {
    model: string
    status: 'pending' | 'success' | 'error'
    inputTokens: number | null
    outputTokens: number | null
    timeMs: number | null
    textLength: number | null
    classificationResult: string | null
    error: string | null
  }
  step2: {
    model: string
    status: 'pending' | 'skipped' | 'success' | 'error'
    inputTokens: number | null
    outputTokens: number | null
    timeMs: number | null
    promptUsed: string | null
    schemaUsed: string | null
    extractionItemCount: number | null
    error: string | null
  }
}

interface DebugPanelProps {
  diagnostics: PipelineDiagnostics | null
  classification: { document_type: string; confidence: number; provider: string | null; description: string } | null
  transformedCounts: { autoConfirm: number; questions: number; financialItems: number } | null
  error: string | null
  visible: boolean
}

export function DebugPanel({ diagnostics, classification, transformedCounts, error, visible }: DebugPanelProps) {
  const [expanded, setExpanded] = useState(true)

  if (!visible) return null

  return (
    <div className="mt-4 border border-amber-600/30 bg-amber-50 rounded-md overflow-hidden text-xs">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-4 py-2 text-amber-600 font-semibold hover:bg-amber-50/80"
      >
        <span className="flex items-center gap-1.5">
          <AlertTriangle size={12} />
          Pipeline Diagnostics
        </span>
        {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
      </button>

      {expanded && (
        <div className="px-4 pb-3 space-y-3">
          {/* Overall error */}
          {error && (
            <div className="flex items-start gap-2 text-red-600">
              <XCircle size={12} className="mt-0.5 flex-shrink-0" />
              <span className="font-medium">{error}</span>
            </div>
          )}

          {/* Classification result */}
          {classification && (
            <div className="space-y-1">
              <p className="font-semibold text-ink-secondary">Classification</p>
              <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-ink-tertiary">
                <span>Type:</span>
                <span className="font-mono text-ink">{classification.document_type}</span>
                <span>Confidence:</span>
                <span className="font-mono text-ink">{(classification.confidence * 100).toFixed(0)}%</span>
                <span>Provider:</span>
                <span className="font-mono text-ink">{classification.provider || '—'}</span>
                <span>Description:</span>
                <span className="text-ink">{classification.description}</span>
              </div>
            </div>
          )}

          {/* Step 1: Haiku */}
          {diagnostics && (
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <StatusIcon status={diagnostics.step1.status} />
                <p className="font-semibold text-ink-secondary">
                  Step 1: PDF Reading ({diagnostics.step1.model})
                </p>
              </div>
              <div className="ml-5 grid grid-cols-2 gap-x-4 gap-y-0.5 text-ink-tertiary">
                <span>Status:</span>
                <span className={`font-mono ${diagnostics.step1.status === 'error' ? 'text-red-600' : 'text-ink'}`}>
                  {diagnostics.step1.status}
                </span>
                {diagnostics.step1.timeMs !== null && (
                  <>
                    <span>Time:</span>
                    <span className="font-mono text-ink">{(diagnostics.step1.timeMs / 1000).toFixed(1)}s</span>
                  </>
                )}
                {diagnostics.step1.inputTokens !== null && (
                  <>
                    <span>Tokens (in/out):</span>
                    <span className="font-mono text-ink">
                      {diagnostics.step1.inputTokens.toLocaleString()} / {diagnostics.step1.outputTokens?.toLocaleString() || '—'}
                    </span>
                  </>
                )}
                {diagnostics.step1.textLength !== null && (
                  <>
                    <span>Text extracted:</span>
                    <span className="font-mono text-ink">{diagnostics.step1.textLength.toLocaleString()} chars</span>
                  </>
                )}
                {diagnostics.step1.classificationResult && (
                  <>
                    <span>Classified as:</span>
                    <span className="font-mono text-ink">{diagnostics.step1.classificationResult}</span>
                  </>
                )}
                {diagnostics.step1.error && (
                  <>
                    <span>Error:</span>
                    <span className="text-red-600">{diagnostics.step1.error}</span>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Step 2: Sonnet */}
          {diagnostics && (
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <StatusIcon status={diagnostics.step2.status} />
                <p className="font-semibold text-ink-secondary">
                  Step 2: Analysis ({diagnostics.step2.model})
                </p>
              </div>
              <div className="ml-5 grid grid-cols-2 gap-x-4 gap-y-0.5 text-ink-tertiary">
                <span>Status:</span>
                <span className={`font-mono ${diagnostics.step2.status === 'error' ? 'text-red-600' : diagnostics.step2.status === 'skipped' ? 'text-amber-600' : 'text-ink'}`}>
                  {diagnostics.step2.status}
                </span>
                {diagnostics.step2.promptUsed && (
                  <>
                    <span>Prompt:</span>
                    <span className="font-mono text-ink">{diagnostics.step2.promptUsed}</span>
                  </>
                )}
                {diagnostics.step2.schemaUsed && (
                  <>
                    <span>Schema:</span>
                    <span className="font-mono text-ink">{diagnostics.step2.schemaUsed}</span>
                  </>
                )}
                {diagnostics.step2.timeMs !== null && (
                  <>
                    <span>Time:</span>
                    <span className="font-mono text-ink">{(diagnostics.step2.timeMs / 1000).toFixed(1)}s</span>
                  </>
                )}
                {diagnostics.step2.inputTokens !== null && (
                  <>
                    <span>Tokens (in/out):</span>
                    <span className="font-mono text-ink">
                      {diagnostics.step2.inputTokens.toLocaleString()} / {diagnostics.step2.outputTokens?.toLocaleString() || '—'}
                    </span>
                  </>
                )}
                {diagnostics.step2.extractionItemCount !== null && (
                  <>
                    <span>Items extracted:</span>
                    <span className="font-mono text-ink">{diagnostics.step2.extractionItemCount}</span>
                  </>
                )}
                {diagnostics.step2.error && (
                  <>
                    <span>Error:</span>
                    <span className="text-red-600">{diagnostics.step2.error}</span>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Transformer output */}
          {transformedCounts && (
            <div className="space-y-1">
              <p className="font-semibold text-ink-secondary">Transformer Output</p>
              <div className="ml-0 grid grid-cols-2 gap-x-4 gap-y-0.5 text-ink-tertiary">
                <span>Auto-confirm items:</span>
                <span className="font-mono text-ink">{transformedCounts.autoConfirm}</span>
                <span>Clarification questions:</span>
                <span className="font-mono text-ink">{transformedCounts.questions}</span>
                <span>Financial items created:</span>
                <span className="font-mono text-ink">{transformedCounts.financialItems}</span>
              </div>
            </div>
          )}

          {/* No diagnostics available */}
          {!diagnostics && !classification && !error && (
            <p className="text-ink-tertiary">No pipeline data yet. Upload a document to see diagnostics.</p>
          )}
        </div>
      )}
    </div>
  )
}

function StatusIcon({ status }: { status: string }) {
  switch (status) {
    case 'success':
      return <CheckCircle size={12} className="text-green-600" />
    case 'error':
      return <XCircle size={12} className="text-red-600" />
    case 'skipped':
      return <Clock size={12} className="text-amber-600" />
    default:
      return <Clock size={12} className="text-ink-tertiary" />
  }
}
