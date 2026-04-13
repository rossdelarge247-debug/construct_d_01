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

  const [extractions, setExtractions] = useState<BankStatementExtraction[]>([])
  const [accounts, setAccounts] = useState<ConnectedAccount[]>([])
  const [revealItems, setRevealItems] = useState<RevealItem[]>([])

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

  // Progressive reveal
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

  useEffect(() => {
    if (phase === 'idle') {
      setVisibleRevealItems(0)
      setProgressPercent(0)
    }
  }, [phase])

  if (phase === 'idle') return null

  return (
    <>
      {/* Dark overlay */}
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

      {/* Tink modal */}
      {phase === 'tink_modal' && (
        <TinkModal
          onComplete={() => handleTinkComplete(false)}
          onDemoComplete={() => handleTinkComplete(true)}
          onCancel={onCancel}
        />
      )}

      {/* Main content card */}
      {phase !== 'tink_modal' && phase !== 'dimming' && (
        <div className="flex items-start justify-center pt-4">
          <div
            className="w-full max-w-[var(--content-narrow)] bg-white overflow-hidden"
            style={{
              borderRadius: 'var(--radius-card)',
              boxShadow: 'var(--shadow-card)',
            }}
          >
            {/* ═══ Loader ═══ */}
            {phase === 'loader' && (
              <div className="p-8">
                <div
                  className="h-40 bg-grey-50 flex items-center justify-center mb-6"
                  style={{ borderRadius: 'var(--radius-md)' }}
                >
                  <span className="text-ink-tertiary text-[13px]">Graphic</span>
                </div>
                <h2 className="text-[22px] font-bold text-ink mb-5">
                  Connect to your bank account/s
                </h2>
                <ProgressBar percent={progressPercent} indeterminate />
              </div>
            )}

            {/* ═══ Reveal ═══ */}
            {(phase === 'reveal' || phase === 'processing') && (
              <div className="p-8">
                <h2 className="text-[22px] font-bold text-ink mb-4 animate-fade-in">
                  Connected to your bank
                </h2>
                <ProgressBar percent={progressPercent} />

                <div className="mt-8">
                  {accounts[0] && (
                    <p className="text-[13px] font-medium text-ink-secondary mb-4 animate-slide-in-left">
                      Processing {accounts[0].bankName} {accounts[0].accountType} account xxxx{accounts[0].lastFour}
                    </p>
                  )}

                  <div className="space-y-3">
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

            {/* ═══ Complete ═══ */}
            {phase === 'complete' && (
              <div className="p-8">
                <h2 className="text-[22px] font-bold text-ink mb-4">
                  Connected to your bank
                </h2>
                <ProgressBar percent={100} />

                <div className="mt-8">
                  <p className="text-[18px] font-semibold text-ink mb-5">
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
                        <p className="text-[13px] text-ink-secondary">
                          {account.monthsOfData} months of transactions
                        </p>
                      </div>
                    </div>
                  ))}

                  <button
                    onClick={() => onComplete(accounts, revealItems, extractions)}
                    className="mt-5 w-full sm:w-auto px-8 py-3.5 text-white text-[15px] font-semibold transition-colors active:scale-[0.98]"
                    style={{
                      backgroundColor: 'var(--color-red-500)',
                      borderRadius: 'var(--radius-card)',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-red-600)')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-red-500)')}
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
        <div
          className="h-full w-1/3 rounded-full animate-shimmer"
          style={{ backgroundColor: 'var(--color-red-500)' }}
        />
      ) : (
        <div
          className="h-full rounded-full transition-all"
          style={{
            width: `${percent}%`,
            backgroundColor: 'var(--color-red-500)',
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
        willChange: visible ? 'auto' : 'opacity, transform',
      }}
    >
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

function TinkModal({
  onComplete,
  onDemoComplete,
  onCancel,
}: {
  onComplete: () => void
  onDemoComplete: () => void
  onCancel: () => void
}) {
  const [loading, setLoading] = useState(true)
  const [tinkAvailable, setTinkAvailable] = useState(false)
  const [popupOpen, setPopupOpen] = useState(false)
  const [connectError, setConnectError] = useState<string | null>(null)
  const popupRef = useRef<Window | null>(null)
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Fetch Tink Link URL and open popup
  useEffect(() => {
    let cancelled = false

    fetch('/api/bank/connect', { method: 'POST' })
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return
        if (data.url && !data.error) {
          setTinkAvailable(true)
          // Open in popup window
          const popup = window.open(
            data.url,
            'tink-connect',
            'width=480,height=720,scrollbars=yes,resizable=yes',
          )
          if (popup) {
            popupRef.current = popup
            setPopupOpen(true)
          } else {
            setConnectError('Popup was blocked. Please allow popups for this site.')
          }
        } else if (data.error) {
          setConnectError(data.error)
        }
        setLoading(false)
      })
      .catch(() => {
        if (!cancelled) {
          setConnectError('Could not reach the server')
          setLoading(false)
        }
      })

    return () => { cancelled = true }
  }, [])

  // Listen for postMessage from popup callback
  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (event.data?.type === 'tink-complete') {
        if (popupRef.current && !popupRef.current.closed) {
          popupRef.current.close()
        }
        popupRef.current = null
        setPopupOpen(false)
        try {
          sessionStorage.setItem('pendingBankData', JSON.stringify(event.data.results))
        } catch { /* ignore storage errors */ }
        onComplete()
      }
      if (event.data?.type === 'tink-error') {
        if (popupRef.current && !popupRef.current.closed) {
          popupRef.current.close()
        }
        popupRef.current = null
        setPopupOpen(false)
        onCancel()
      }
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [onComplete, onCancel])

  // Poll to detect if user closed the popup manually
  useEffect(() => {
    if (!popupOpen) return
    pollRef.current = setInterval(() => {
      if (popupRef.current?.closed) {
        popupRef.current = null
        setPopupOpen(false)
        if (pollRef.current) clearInterval(pollRef.current)
        onCancel()
      }
    }, 500)
    return () => {
      if (pollRef.current) clearInterval(pollRef.current)
    }
  }, [popupOpen, onCancel])

  // Clean up popup on unmount
  useEffect(() => {
    return () => {
      if (popupRef.current && !popupRef.current.closed) {
        popupRef.current.close()
      }
    }
  }, [])

  const handleReopenPopup = useCallback(() => {
    if (popupRef.current && !popupRef.current.closed) {
      popupRef.current.focus()
    }
  }, [])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      onClick={(e) => e.stopPropagation()}
    >
      <div
        className="w-full max-w-md bg-white p-8 animate-modal-appear"
        style={{
          borderRadius: 'var(--radius-lg)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
        }}
      >
        {loading ? (
          <>
            <h3 className="text-[18px] font-bold text-ink mb-4">Connect your bank</h3>
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="h-1 w-24 bg-grey-100 rounded-full overflow-hidden mx-auto mb-3">
                  <div
                    className="h-full w-1/3 rounded-full animate-shimmer"
                    style={{ backgroundColor: 'var(--color-red-500)' }}
                  />
                </div>
                <span className="text-ink-tertiary text-[13px]">Preparing secure connection...</span>
              </div>
            </div>
          </>
        ) : popupOpen ? (
          <>
            <h3 className="text-[22px] font-bold text-ink mb-3">Complete your bank connection</h3>
            <p className="text-[15px] text-ink-secondary mb-2 leading-relaxed">
              A secure window has opened for you to connect your bank account.
            </p>
            <p className="text-[13px] text-ink-tertiary mb-6">
              Once connected, we&apos;ll automatically import your financial data.
            </p>
            <div className="flex items-center justify-center py-6">
              <div className="text-center">
                <div className="h-1 w-32 bg-grey-100 rounded-full overflow-hidden mx-auto mb-3">
                  <div
                    className="h-full w-1/3 rounded-full animate-shimmer"
                    style={{ backgroundColor: 'var(--color-red-500)' }}
                  />
                </div>
                <span className="text-ink-tertiary text-[13px]">Waiting for bank connection...</span>
              </div>
            </div>
          </>
        ) : tinkAvailable ? (
          <>
            <h3 className="text-[18px] font-bold text-ink mb-4">Connection window closed</h3>
            <p className="text-[15px] text-ink-secondary mb-6">
              The bank connection window was closed before completing.
            </p>
          </>
        ) : (
          <>
            <h3 className="text-[22px] font-bold text-ink mb-3">Try the experience</h3>
            <p className="text-[15px] text-ink-secondary mb-2 leading-relaxed">
              We&apos;ll walk you through the full journey using sample bank data — a realistic picture of what your financial disclosure will look like.
            </p>
            <p className="text-[13px] text-ink-tertiary mb-6">
              Open Banking connection will be available when we go live.
            </p>
            {connectError && (
              <p className="text-[11px] text-ink-disabled mb-4 font-mono">
                Debug: {connectError}
              </p>
            )}
          </>
        )}

        <div className="flex gap-3">
          {popupOpen && (
            <button
              onClick={handleReopenPopup}
              className="flex-1 py-3.5 text-[15px] font-medium transition-colors"
              style={{
                border: '1px solid var(--color-grey-100)',
                borderRadius: 'var(--radius-card)',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-grey-50)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              Bring window to front
            </button>
          )}
          {!tinkAvailable && !loading && (
            <button
              onClick={onDemoComplete}
              className="flex-1 py-3.5 text-white text-[15px] font-semibold transition-colors active:scale-[0.98]"
              style={{
                backgroundColor: 'var(--color-red-500)',
                borderRadius: 'var(--radius-card)',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-red-600)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-red-500)')}
            >
              Start demo walkthrough
            </button>
          )}
          <button
            onClick={() => {
              if (popupRef.current && !popupRef.current.closed) {
                popupRef.current.close()
              }
              onCancel()
            }}
            className="px-5 py-3.5 text-[15px] font-medium text-ink-secondary hover:bg-grey-50 transition-colors"
            style={{
              borderRadius: 'var(--radius-card)',
              border: '1px solid var(--color-grey-100)',
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
