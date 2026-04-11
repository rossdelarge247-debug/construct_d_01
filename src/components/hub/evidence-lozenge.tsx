'use client'

import { useState } from 'react'
import { Check, Loader2, ChevronDown } from 'lucide-react'
import type { EvidenceLozenge as LozengeType } from '@/types/hub'

interface EvidenceLozengeProps {
  lozenge: LozengeType
}

export function EvidenceLozenge({ lozenge }: EvidenceLozengeProps) {
  const [flyoutOpen, setFlyoutOpen] = useState(false)
  const hasDocuments = lozenge.documents.length > 0

  return (
    <div className="relative">
      <button
        onClick={() => hasDocuments && setFlyoutOpen(!flyoutOpen)}
        className={`inline-flex items-center gap-1.5 px-4 py-1.5 text-white text-xs font-medium rounded-pill transition-all duration-200 ${
          lozenge.status === 'uploaded'
            ? 'bg-slate-700 hover:opacity-90 cursor-pointer'
            : lozenge.status === 'uploading'
              ? 'bg-slate-700/80'
              : 'bg-slate-700/60'
        }`}
        aria-expanded={flyoutOpen}
        aria-label={`${lozenge.label}: ${lozenge.status === 'uploaded' ? 'uploaded' : lozenge.status === 'uploading' ? 'processing' : 'not yet uploaded'}`}
      >
        {/* Status icon with transitions (spec 18 line 268: 150ms fade) */}
        {lozenge.status === 'uploading' && (
          <Loader2 size={12} className="animate-spin" />
        )}
        {lozenge.status === 'uploaded' && (
          <Check size={12} className="animate-fade-in-scale text-green-400" />
        )}
        {lozenge.count > 0 && (
          <span className="tabular-nums">{lozenge.count}</span>
        )}
        <span>{lozenge.label}</span>
        {lozenge.status === 'uploaded' && hasDocuments && (
          <ChevronDown
            size={12}
            className={`transition-transform duration-200 ${flyoutOpen ? 'rotate-180' : ''}`}
          />
        )}
      </button>

      {/* Flyout: document list */}
      {flyoutOpen && hasDocuments && (
        <div
          className="absolute top-full left-0 mt-1.5 z-10 bg-white border border-grey-100 rounded-md py-2 px-3 min-w-[240px] animate-value-enter"
          style={{ boxShadow: 'var(--shadow-sm)' }}
        >
          {lozenge.documents.map((doc) => (
            <div key={doc.id} className="py-1.5 text-xs text-ink-secondary flex items-center gap-2">
              <Check size={10} className="text-green-600 flex-shrink-0" />
              {doc.description}
            </div>
          ))}
          {lozenge.documents[0]?.monthsRequired > 0 && (
            <div className="pt-1.5 mt-1 border-t border-grey-100 text-xs text-ink-tertiary">
              {lozenge.documents.reduce((sum, d) => sum + d.monthsCovered, 0)} of{' '}
              {lozenge.documents[0].monthsRequired} months provided
            </div>
          )}
        </div>
      )}
    </div>
  )
}
