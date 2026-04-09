'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Explainer } from '@/components/interview/explainer'
import { cn } from '@/utils/cn'

export interface CetvRequest {
  id: string
  provider: string
  type: 'workplace' | 'personal' | 'sipp' | 'other'
  ownership: 'yours' | 'partners'
  requested_date: string | null
  status: 'not_requested' | 'requested' | 'chasing' | 'received'
  value: number | null
  notes: string | null
}

interface CetvTrackerProps {
  requests: CetvRequest[]
  onAdd: (request: CetvRequest) => void
  onUpdate: (id: string, updates: Partial<CetvRequest>) => void
}

const STATUS_LABELS: Record<CetvRequest['status'], { label: string; colour: string }> = {
  not_requested: { label: 'Not yet requested', colour: 'text-ink-faint bg-cream-dark' },
  requested: { label: 'Requested', colour: 'text-amber bg-amber-light' },
  chasing: { label: 'Chasing', colour: 'text-warmth-dark bg-warmth-light' },
  received: { label: 'Received', colour: 'text-sage-dark bg-sage-light' },
}

function daysSince(dateStr: string): number {
  return Math.floor((Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24))
}

export function CetvTracker({ requests, onAdd, onUpdate }: CetvTrackerProps) {
  const [showAddForm, setShowAddForm] = useState(false)
  const [newProvider, setNewProvider] = useState('')
  const [newOwnership, setNewOwnership] = useState<'yours' | 'partners'>('yours')

  function handleAdd() {
    if (!newProvider.trim()) return
    onAdd({
      id: crypto.randomUUID(),
      provider: newProvider,
      type: 'workplace',
      ownership: newOwnership,
      requested_date: null,
      status: 'not_requested',
      value: null,
      notes: null,
    })
    setNewProvider('')
    setShowAddForm(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-heading text-lg font-semibold text-ink">Pension valuations</h3>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="text-xs text-warmth-dark hover:text-warmth transition-colors"
        >
          + Add pension
        </button>
      </div>

      <p className="text-sm text-ink-light leading-relaxed">
        A CETV (Cash Equivalent Transfer Value) is what your pension is &quot;worth&quot; for settlement purposes. Requesting one is free but takes up to 3 months.
      </p>

      {/* Existing requests */}
      {requests.length > 0 && (
        <div className="space-y-3">
          {requests.map(req => {
            const status = STATUS_LABELS[req.status]
            const days = req.requested_date ? daysSince(req.requested_date) : 0
            const shouldChase = req.status === 'requested' && days > 42 // 6 weeks

            return (
              <div key={req.id} className="rounded-[var(--radius-md)] border-[var(--border-card)] border-cream-dark p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-ink">{req.provider}</p>
                    <p className="text-xs text-ink-faint">{req.ownership === 'yours' ? 'Your pension' : 'Partner\'s pension'}</p>
                  </div>
                  <span className={cn('rounded-full px-2.5 py-0.5 text-xs font-medium', status.colour)}>
                    {status.label}
                  </span>
                </div>

                {req.status === 'not_requested' && (
                  <div className="space-y-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => onUpdate(req.id, { status: 'requested', requested_date: new Date().toISOString() })}
                    >
                      Mark as requested
                    </Button>
                    <Explainer label="How to request a CETV">
                      <div className="space-y-2">
                        <p>Contact {req.provider} directly — by phone, email, or through their online portal.</p>
                        <p>Ask for a &quot;Cash Equivalent Transfer Value&quot; or &quot;CETV&quot; for divorce/dissolution purposes.</p>
                        <p>It&apos;s free. They must provide it within 3 months by law, but many respond within 4-8 weeks.</p>
                      </div>
                    </Explainer>
                  </div>
                )}

                {req.status === 'requested' && (
                  <div className="space-y-2">
                    <p className="text-xs text-ink-light">
                      Requested {days} days ago.
                      {days < 28 && ' Most providers respond within 4-8 weeks.'}
                      {days >= 28 && days < 56 && ' It\'s been a few weeks — still within normal timeframes.'}
                      {days >= 56 && ' It\'s been a while. Consider following up.'}
                    </p>
                    {shouldChase && (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => onUpdate(req.id, { status: 'chasing' })}
                      >
                        Mark as chasing
                      </Button>
                    )}
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        const value = prompt('Enter the CETV value (numbers only):')
                        if (value) {
                          onUpdate(req.id, { status: 'received', value: parseFloat(value.replace(/[^0-9.]/g, '')) })
                        }
                      }}
                    >
                      I&apos;ve received it
                    </Button>
                  </div>
                )}

                {req.status === 'chasing' && (
                  <div className="space-y-2">
                    <p className="text-xs text-ink-light">
                      You&apos;re following up with {req.provider}. They&apos;re legally required to respond within 3 months of your request.
                    </p>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        const value = prompt('Enter the CETV value (numbers only):')
                        if (value) {
                          onUpdate(req.id, { status: 'received', value: parseFloat(value.replace(/[^0-9.]/g, '')) })
                        }
                      }}
                    >
                      I&apos;ve received it
                    </Button>
                  </div>
                )}

                {req.status === 'received' && req.value && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-sage-dark">
                      CETV: {new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 }).format(req.value)}
                    </p>
                    <Explainer label="What does this CETV mean?">
                      <div className="space-y-2">
                        <p>The CETV is the cash value your pension provider would pay to transfer your pension elsewhere. It&apos;s used in divorce to put a value on the pension for settlement calculations.</p>
                        <p>For defined benefit pensions (like NHS or teachers&apos;), the CETV often understates the real value of the retirement income. A pension specialist (PODE) can give a more accurate picture.</p>
                        <p>You can upload the CETV letter as evidence to strengthen this item.</p>
                      </div>
                    </Explainer>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Add form */}
      {showAddForm && (
        <div className="rounded-[var(--radius-md)] border border-warmth-light bg-warmth-light/10 p-4 space-y-3">
          <input
            type="text"
            value={newProvider}
            onChange={(e) => setNewProvider(e.target.value)}
            placeholder="Pension provider name (e.g. Aviva, NHS Pensions)"
            className="w-full rounded-[var(--radius-sm)] border-[var(--border-card)] border-cream-dark bg-cream px-3 py-2.5 text-sm text-ink placeholder:text-ink-faint/50 focus:border-warmth focus:outline-none"
          />
          <div className="flex gap-2">
            <button
              onClick={() => setNewOwnership('yours')}
              className={cn('rounded-full px-3 py-1.5 text-xs font-medium transition-all', newOwnership === 'yours' ? 'bg-warmth text-cream' : 'bg-cream text-ink-faint hover:bg-cream-dark')}
            >
              My pension
            </button>
            <button
              onClick={() => setNewOwnership('partners')}
              className={cn('rounded-full px-3 py-1.5 text-xs font-medium transition-all', newOwnership === 'partners' ? 'bg-warmth text-cream' : 'bg-cream text-ink-faint hover:bg-cream-dark')}
            >
              Partner&apos;s pension
            </button>
          </div>
          <div className="flex gap-2">
            <Button size="sm" onClick={handleAdd} disabled={!newProvider.trim()}>Add</Button>
            <Button variant="ghost" size="sm" onClick={() => setShowAddForm(false)}>Cancel</Button>
          </div>
        </div>
      )}

      {requests.length === 0 && !showAddForm && (
        <div className="rounded-[var(--radius-md)] border-[var(--border-card)] border-cream-dark p-5 text-center space-y-2">
          <p className="text-sm text-ink-light">No pensions tracked yet.</p>
          <p className="text-xs text-ink-faint">Pensions are often the largest asset in a settlement. Add yours to start tracking.</p>
        </div>
      )}
    </div>
  )
}
