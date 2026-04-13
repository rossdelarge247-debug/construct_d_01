'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { Check } from 'lucide-react'
import type { BankConnectionPhase, ConnectedAccount, RevealItem } from '@/types/hub'
import type { BankStatementExtraction } from '@/lib/ai/extraction-schemas'
import {
  extractionsToConnectedAccounts,
  extractionsToRevealItems,
  createDemoExtractions,
} from '@/lib/bank/bank-data-utils'

interface BankConnectionFlowProps {
  phase: BankConnectionPhase
  onPhaseChange: (phase: BankConnectionPhase) => void
  onComplete: (accounts: ConnectedAccount[], revealItems: RevealItem[], extractions: BankStatementExtraction[]) => void
  onCancel: () => void
}

export function BankConnectionFlow({
  phase,
  onPhaseChange,
  onComplete,
  onCancel,
}: BankConnectionFlowProps) {
  const [visibleRevealItems, setVisibleRevealItems] = useState<number>(0)
  const [progressPercent, setProgressPercent] = useState(0)
  const revealTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Bank data state — populated from real Tink data or demo fallback
  const [extractions, setExtractions] = useState<BankStatementExtraction[]>([])
  const [accounts, setAccounts] = useState<ConnectedAccount[]>([])
  const [revealItems, setRevealItems] = useState<RevealItem[]>([])

  // Hydrate bank data from a list of extractions (real or demo)
  const hydrateBankData = useCallback((exts: BankStatementExtraction[]) => {
    setExtractions(exts)
    setAccounts(extractionsToConnectedAccounts(exts))
    setRevealItems(extractionsToRevealItems(exts))
  }, [])

  // Auto-advance: loader → dimming → tink_modal
  useEffect(() => {
    if (phase === 'loader') {
      setProgressPercent(10)
      const t = setTimeout(() => onPhaseChange('dimming'), 1500)
      return () => clearTimeout(t)
    }
    if (phase === 'dimming') {
      const t = setTimeout(() => onPhaseChange('tink_modal'), 600)
      return () => clearTimeout(t)
    }
  }, [phase, onPhaseChange])

  // Tink completion — read real data from sessionStorage or use demo
  const handleTinkComplete = useCallback((useDemoData: boolean) => {
    let exts: BankStatementExtraction[]

    if (useDemoData) {
      exts = createDemoExtractions()
    } else {
      try {
        const raw = sessionStorage.getItem('pendingBankData')
        if (raw) {
          const parsed = JSON.parse(raw) as { extraction?: BankStatementExtraction }[]
          exts = parsed.map((r) => r.extraction).filter(Boolean) as BankStatementExtraction[]
          sessionStorage.removeItem('pendingBankData')
        } else {
          exts = createDemoExtractions()
        }
      } catch {
        exts = createDemoExtractions()
      }
    }

    hydrateBankData(exts)
    onPhaseChange('reveal')
    setProgressPercent(15)
  }, [onPhaseChange, hydrateBankData])

  // Progressive reveal: stagger tick items per spec 26
  useEffect(() => {
    if (phase !== 'reveal') return
    if (revealItems.length === 0) return
    if (visibleRevealItems >= revealItems.length) {
      const t = setTimeout(() => {
        setProgressPercent(100)
        onPhaseChange('complete')
      }, 800)
      return () => clearTimeout(t)
    }

    // Stagger delays: 0, 400, 600, 800, 1000, 1200 (spec 26)
    const delays = [0, 400, 600, 800, 1000, 1200]
    const delay = delays[visibleRevealItems] ?? 400

    revealTimerRef.current = setTimeout(() => {
      setVisibleRevealItems((n) => n + 1)
      setProgressPercent(15 + ((visibleRevealItems + 1) / revealItems.length) * 80)
    }, delay)

    return () => {
      if (revealTimerRef.current) clearTimeout(revealTimerRef.current)
    }
  }, [phase, visibleRevealItems, revealItems.length, onPhaseChange])

  // Reset when phase goes back to idle
  useEffect(() => {
    if (phase === 'idle') {
      setVisibleRevealItems(0)
      setProgressPercent(0)
    }
  }, [phase])

  if (phase === 'idle') return null

  return (
    <>
      {/* Dark overlay for dimming/modal phases (spec 26: 300ms fade) */}
      {(phase === 'dimming' || phase === 'tink_modal') && (
        <div
          className="fixed inset-0 z-40 transition-colors"
          style={{
            backgroundColor:
              phase === 'tink_modal' ? 'rgba(0,0,0,0.6)' : 'rgba(0,0,0,0.3)',
            transitionDuration: '300ms',
            transitionTimingFunction: 'ease',
          }}
          onClick={phase === 'tink_modal' ? onCancel : undefined}
        />
      )}

      {/* Tink modal — iframe drop-in mode (screen 3c) */}
      {phase === 'tink_modal' && (
        <TinkModal
          onComplete={() => handleTinkComplete(false)}
          onDemoComplete={() => handleTinkComplete(true)}
          onCancel={onCancel}
        />
      )}

      {/* Main content card — loader, reveal, and complete screens */}
      {phase !== 'tink_modal' && phase !== 'dimming' && (
        <div className="flex items-start justify-center pt-12 px-6">
          <div className="w-full max-w-[560px] bg-white rounded-lg border border-grey-100 shadow-sm overflow-hidden">
            {/* ═══ Screen 3: Loader ═══ */}
            {phase === 'loader' && (
              <div className="p-5 sm:p-8">
                <div className="h-40 bg-grey-50 rounded-md flex items-center justify-center mb-6">
                  <span className="text-ink-tertiary text-sm">Graphic</span>
                </div>
                <h2 className="text-xl font-bold text-ink mb-4">
                  Connect to your bank account/s
                </h2>
                <ProgressBar percent={progressPercent} indeterminate />
              </div>
            )}

            {/* ═══ Screen 3d: Reveal ═══ */}
            {(phase === 'reveal' || phase === 'processing') && (
              <div className="p-5 sm:p-8">
                <h2
                  className="text-xl font-bold text-ink mb-3 animate-fade-in"
                >
                  Connected to your bank
                </h2>
                <ProgressBar percent={progressPercent} />

                <div className="mt-6">
                  {/* Per-account processing block */}
                  {accounts[0] && (
                    <p
                      className="text-sm font-medium text-ink-secondary mb-3 animate-slide-in-left"
                    >
                      Processing {accounts[0].bankName} {accounts[0].accountType} account xxxx{accounts[0].lastFour}
                    </p>
                  )}

                  {/* Tick items — staggered reveal */}
                  <div className="space-y-2">
                    {revealItems.map((item, i) => (
                      <RevealTickItem
                        key={item.id}
                        item={item}
                        visible={i < visibleRevealItems}
                        index={i}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ═══ Screen 3e: Complete ═══ */}
            {phase === 'complete' && (
              <div className="p-5 sm:p-8">
                <h2 className="text-xl font-bold text-ink mb-3">
                  Connected to your bank
                </h2>
                <ProgressBar percent={100} />

                <div className="mt-6">
                  <p className="text-lg font-semibold text-ink mb-4">
                    We have finished having a look
                  </p>

                  {accounts.map((account) => (
                    <div key={account.id} className="flex items-start gap-3 mb-4">
                      <div className="w-5 h-5 mt-0.5 rounded-full bg-green-600 flex items-center justify-center shrink-0">
                        <Check size={12} className="text-white" strokeWidth={3} />
                      </div>
                      <div>
                        <p className="text-[15px] font-medium text-ink">
                          1 {account.bankName} {account.accountType} account xxxx{account.lastFour}
                        </p>
                        <p className="text-sm text-ink-secondary">
                          {account.monthsOfData} months of transactions
                        </p>
                      </div>
                    </div>
                  ))}

                  <button
                    onClick={() => onComplete(accounts, revealItems, extractions)}
                    className="mt-4 px-6 py-3 bg-ink text-white text-sm font-semibold rounded-md hover:opacity-90 transition-opacity active:scale-[0.98]"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}

// ═══ Sub-components ═══

function ProgressBar({ percent, indeterminate }: { percent: number; indeterminate?: boolean }) {
  return (
    <div className="h-1.5 w-full bg-grey-100 rounded-full overflow-hidden">
      {indeterminate ? (
        <div className="h-full w-1/3 bg-ink rounded-full animate-shimmer" />
      ) : (
        <div
          className="h-full bg-ink rounded-full transition-all"
          style={{
            width: `${percent}%`,
            transitionDuration: '500ms',
            transitionTimingFunction: 'ease',
          }}
        />
      )}
    </div>
  )
}

function RevealTickItem({
  item,
  visible,
  index,
}: {
  item: RevealItem
  visible: boolean
  index: number
}) {
  return (
    <div
      className="flex items-start gap-2.5 transition-all"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(8px)',
        transitionDuration: '250ms',
        transitionTimingFunction: 'ease-out',
        // GPU acceleration per spec 26
        willChange: visible ? 'auto' : 'opacity, transform',
      }}
    >
      {/* Tick appears first (spec 26: tick then text 50ms later) */}
      <div
        className="w-5 h-5 mt-0.5 rounded-full bg-green-600 flex items-center justify-center shrink-0 transition-all"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'scale(1)' : 'scale(0)',
          transitionDuration: '200ms',
          transitionDelay: '0ms',
          transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
      >
        <Check size={11} className="text-white" strokeWidth={3} />
      </div>
      <div
        className="transition-opacity"
        style={{
          opacity: visible ? 1 : 0,
          transitionDuration: '200ms',
          transitionDelay: '50ms',
        }}
      >
        <span className="text-[15px] font-medium text-ink">{item.label}</span>
        <span className="text-[15px] text-ink-secondary"> — {item.detail}</span>
      </div>
    </div>
  )
}

/**
 * Tink modal — supports two modes:
 * 1. Iframe mode: loads the Tink Link URL in an iframe, listens for postMessage completion
 * 2. Simulation mode (dev): shows a placeholder with a simulate button
 *
 * The iframe receives the callback URL which now posts a message to parent
 * window instead of redirecting, keeping the user in the app context.
 */
function TinkModal({
  onComplete,
  onDemoComplete,
  onCancel,
}: {
  onComplete: () => void
  onDemoComplete: () => void
  onCancel: () => void
}) {
  const [tinkUrl, setTinkUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [tinkAvailable, setTinkAvailable] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  // Fetch Tink Link URL on mount
  useEffect(() => {
    let cancelled = false

    fetch('/api/bank/connect', { method: 'POST' })
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return
        if (data.url && !data.error) {
          setTinkUrl(data.url)
          setTinkAvailable(true)
        }
        setLoading(false)
      })
      .catch(() => {
        if (!cancelled) setLoading(false)
      })

    return () => { cancelled = true }
  }, [])

  // Listen for postMessage from iframe callback
  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (event.data?.type === 'tink-complete') {
        try {
          sessionStorage.setItem('pendingBankData', JSON.stringify(event.data.results))
        } catch { /* ignore storage errors */ }
        onComplete()
      }
      if (event.data?.type === 'tink-error') {
        onCancel()
      }
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [onComplete, onCancel])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-5 sm:p-8 animate-modal-appear">
        <h3 className="text-lg font-bold text-ink mb-2">Connect your bank</h3>

        {/* Iframe area — real Tink Link or loading state */}
        <div className="h-80 bg-grey-50 rounded-lg flex items-center justify-center mb-6 overflow-hidden">
          {loading ? (
            <div className="text-center">
              <div className="h-1 w-24 bg-grey-100 rounded-full overflow-hidden mx-auto mb-3">
                <div className="h-full w-1/3 bg-ink rounded-full animate-shimmer" />
              </div>
              <span className="text-ink-tertiary text-sm">Preparing secure connection...</span>
            </div>
          ) : tinkUrl ? (
            <iframe
              ref={iframeRef}
              src={tinkUrl}
              className="w-full h-full border-0 rounded-lg"
              title="Connect your bank securely"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-top-navigation"
            />
          ) : (
            <div className="text-center px-6">
              <p className="text-sm text-ink-secondary mb-1">
                Open Banking is not configured yet.
              </p>
              <p className="text-xs text-ink-tertiary">
                Tink credentials need to be added to connect a real bank account.
              </p>
            </div>
          )}
        </div>

        <div className="flex gap-3">
          {/* In production: user completes in iframe, this area just has Cancel.
              Without Tink configured: show demo button to test the rest of the flow. */}
          {!tinkAvailable && !loading && (
            <button
              onClick={onDemoComplete}
              className="flex-1 py-3 bg-ink text-white text-sm font-semibold rounded-md hover:opacity-90 transition-opacity active:scale-[0.98]"
            >
              Continue with demo data
            </button>
          )}
          <button
            onClick={onCancel}
            className={`py-3 text-sm font-medium rounded-md transition-colors ${
              tinkAvailable
                ? 'flex-1 bg-grey-50 text-ink-secondary hover:bg-grey-100'
                : 'px-5 text-ink-secondary border border-grey-100 hover:bg-grey-50'
            }`}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
