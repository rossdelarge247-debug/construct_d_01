'use client'

import { useState, useCallback } from 'react'
import { ChevronDown, ChevronRight, AlertTriangle, CheckCircle, XCircle, Loader2 } from 'lucide-react'

const STORAGE_KEY = 'decouple-tink-debug-visible'

interface TinkTestResult {
  status: 'ok' | 'error' | 'not_configured'
  message: string
  clientIdPrefix?: string
  tokenObtained?: boolean
  responseTimeMs?: number
  clientIdPresent?: boolean
  clientSecretPresent?: boolean
}

interface BankDiagnostics {
  accountsFound: number
  providers: string[]
  autoConfirmItems: number
  questions: number
  financialItems: number
}

interface TinkDebugPanelProps {
  bankDiagnostics: BankDiagnostics | null
}

export function TinkDebugPanel({ bankDiagnostics }: TinkDebugPanelProps) {
  const [visible, setVisible] = useState(() => {
    if (typeof window === 'undefined') return false
    return localStorage.getItem(STORAGE_KEY) === 'true'
  })
  const [expanded, setExpanded] = useState(true)
  const [testResult, setTestResult] = useState<TinkTestResult | null>(null)
  const [testing, setTesting] = useState(false)
  const [connectUrl, setConnectUrl] = useState<string | null>(null)
  const [connectDebug, setConnectDebug] = useState<Record<string, unknown> | null>(null)

  const toggleVisible = useCallback(() => {
    setVisible((prev) => {
      const next = !prev
      localStorage.setItem(STORAGE_KEY, String(next))
      return next
    })
  }, [])

  const runTest = useCallback(async () => {
    setTesting(true)
    setTestResult(null)
    try {
      const res = await fetch('/api/bank/test', { method: 'POST' })
      const data = await res.json()
      setTestResult(data)
    } catch (error) {
      setTestResult({
        status: 'error',
        message: error instanceof Error ? error.message : 'Network error',
      })
    }
    setTesting(false)
  }, [])

  const testConnect = useCallback(async () => {
    setConnectUrl(null)
    setConnectDebug(null)
    try {
      const res = await fetch('/api/bank/connect', { method: 'POST' })
      const data = await res.json()
      if (data.debug) setConnectDebug(data.debug)
      if (data.url) {
        setConnectUrl(data.url)
      } else {
        setConnectUrl(`Error: ${data.error || 'No URL returned'}`)
      }
    } catch (error) {
      setConnectUrl(`Error: ${error instanceof Error ? error.message : 'Network error'}`)
    }
  }, [])

  // Toggle button — always visible
  if (!visible) {
    return (
      <button
        onClick={toggleVisible}
        className="mt-4 text-xs text-ink-tertiary hover:text-ink-secondary transition-colors"
      >
        Show Tink debug panel
      </button>
    )
  }

  return (
    <div className="mt-4 border border-blue-600/30 bg-blue-50 rounded-md overflow-hidden text-xs">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-4 py-2 text-blue-600 font-semibold hover:bg-blue-50/80"
      >
        <span className="flex items-center gap-1.5">
          <AlertTriangle size={12} />
          Tink Open Banking — Debug
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); toggleVisible() }}
            className="text-blue-600/60 hover:text-blue-600 underline"
          >
            hide
          </button>
          {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-3 space-y-4">
          {/* Credential test */}
          <div className="space-y-2">
            <p className="font-semibold text-ink-secondary">1. Credential Test</p>
            <div className="flex items-center gap-2">
              <button
                onClick={runTest}
                disabled={testing}
                className="px-3 py-1.5 bg-blue-600 text-white rounded text-xs font-medium hover:bg-blue-700 disabled:opacity-50 flex items-center gap-1.5"
              >
                {testing && <Loader2 size={10} className="animate-spin" />}
                {testing ? 'Testing...' : 'Test Tink Credentials'}
              </button>
            </div>
            {testResult && (
              <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-ink-tertiary ml-0">
                <span>Status:</span>
                <span className="flex items-center gap-1">
                  {testResult.status === 'ok' ? (
                    <CheckCircle size={10} className="text-green-600" />
                  ) : (
                    <XCircle size={10} className="text-red-600" />
                  )}
                  <span className={`font-mono ${testResult.status === 'ok' ? 'text-green-600' : 'text-red-600'}`}>
                    {testResult.status}
                  </span>
                </span>
                <span>Message:</span>
                <span className="text-ink">{testResult.message}</span>
                {testResult.clientIdPrefix && (
                  <>
                    <span>Client ID:</span>
                    <span className="font-mono text-ink">{testResult.clientIdPrefix}</span>
                  </>
                )}
                {testResult.responseTimeMs !== undefined && (
                  <>
                    <span>Response time:</span>
                    <span className="font-mono text-ink">{testResult.responseTimeMs}ms</span>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Connect flow test */}
          <div className="space-y-2">
            <p className="font-semibold text-ink-secondary">2. Connect Flow</p>
            <div className="flex items-center gap-2">
              <button
                onClick={testConnect}
                className="px-3 py-1.5 bg-blue-600 text-white rounded text-xs font-medium hover:bg-blue-700"
              >
                Generate Tink Link URL
              </button>
            </div>
            {connectUrl && (
              <div className="space-y-1">
                {connectUrl.startsWith('Error') ? (
                  <p className="text-red-600">{connectUrl}</p>
                ) : (
                  <>
                    <p className="text-green-600 flex items-center gap-1">
                      <CheckCircle size={10} /> Tink Link URL generated
                    </p>
                    <p className="font-mono text-ink break-all bg-white/60 p-2 rounded border border-blue-600/10">
                      {connectUrl}
                    </p>
                    <a
                      href={connectUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block px-3 py-1.5 bg-ink text-white rounded text-xs font-medium hover:opacity-90"
                    >
                      Open Tink Link in new tab
                    </a>
                  </>
                )}
              </div>
            )}
            {connectDebug && (
              <div className="mt-1">
                <p className="text-ink-tertiary font-semibold">Server response:</p>
                <pre className="font-mono text-ink text-[10px] bg-white/60 p-2 rounded border border-blue-600/10 overflow-x-auto whitespace-pre-wrap">
                  {JSON.stringify(connectDebug, null, 2)}
                </pre>
              </div>
            )}
          </div>

          {/* Bank data diagnostics */}
          <div className="space-y-2">
            <p className="font-semibold text-ink-secondary">3. Last Bank Data</p>
            {bankDiagnostics ? (
              <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-ink-tertiary">
                <span>Accounts found:</span>
                <span className="font-mono text-ink">{bankDiagnostics.accountsFound}</span>
                <span>Providers:</span>
                <span className="font-mono text-ink">{bankDiagnostics.providers.join(', ') || '—'}</span>
                <span>Auto-confirm items:</span>
                <span className="font-mono text-ink">{bankDiagnostics.autoConfirmItems}</span>
                <span>Questions generated:</span>
                <span className="font-mono text-ink">{bankDiagnostics.questions}</span>
                <span>Financial items:</span>
                <span className="font-mono text-ink">{bankDiagnostics.financialItems}</span>
              </div>
            ) : (
              <p className="text-ink-tertiary">No bank data yet. Connect a bank to see diagnostics.</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
