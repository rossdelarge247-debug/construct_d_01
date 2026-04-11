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
        className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-slate-700 text-white text-xs font-medium rounded-pill transition-opacity hover:opacity-90"
        aria-expanded={flyoutOpen}
      >
        {lozenge.status === 'uploading' && (
          <Loader2 size={12} className="animate-spin" />
        )}
        {lozenge.status === 'uploaded' && (
          <Check size={12} />
        )}
        {lozenge.count > 0 && (
          <span>{lozenge.count}</span>
        )}
        <span>{lozenge.label}</span>
        {lozenge.status === 'uploaded' && hasDocuments && (
          <ChevronDown
            size={12}
            className={`transition-transform ${flyoutOpen ? 'rotate-180' : ''}`}
          />
        )}
      </button>

      {flyoutOpen && hasDocuments && (
        <div className="absolute top-full left-0 mt-1 z-10 bg-white border border-grey-100 rounded-md shadow-sm py-2 px-3 min-w-[220px]">
          {lozenge.documents.map((doc) => (
            <div key={doc.id} className="py-1 text-xs text-ink-secondary">
              {doc.description}
            </div>
          ))}
          {lozenge.documents[0]?.monthsRequired > 0 && (
            <div className="pt-1 mt-1 border-t border-grey-50 text-xs text-ink-tertiary">
              {lozenge.documents.reduce((sum, d) => sum + d.monthsCovered, 0)} of{' '}
              {lozenge.documents[0].monthsRequired} months provided
            </div>
          )}
        </div>
      )}
    </div>
  )
}
