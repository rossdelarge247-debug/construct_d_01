'use client'

import { Check, Info } from 'lucide-react'
import type { SectionSummaryData } from '@/lib/bank/confirmation-questions'

interface SectionMiniSummaryProps {
  data: SectionSummaryData
  onConfirm: () => void
  onGoBack: () => void
}

export function SectionMiniSummary({ data, onConfirm, onGoBack }: SectionMiniSummaryProps) {
  return (
    <div className="animate-fade-in" style={{ willChange: 'opacity, transform' }}>
      {/* Section label */}
      <p className="text-[12px] font-semibold text-ink-tertiary uppercase tracking-wider mb-2">
        {data.sectionLabel}
      </p>

      {/* Heading */}
      <h3 className="text-[22px] font-bold text-ink mb-6">{data.heading}</h3>

      {/* Confirmed facts */}
      <div className="space-y-4">
        {data.facts.map((fact, i) => (
          <div
            key={i}
            className="animate-fade-in"
            style={{
              animationDelay: `${i * 150}ms`,
              animationFillMode: 'both',
            }}
          >
            <div className="flex items-start gap-2.5">
              <div className="w-5 h-5 mt-0.5 rounded-full bg-green-600 flex items-center justify-center shrink-0">
                <Check size={11} className="text-white" strokeWidth={3} />
              </div>
              <span className="text-[15px] text-ink">{fact.label}</span>
            </div>

            {fact.gapMessage && (
              <div
                className="ml-7 mt-2 flex items-start gap-2.5 px-4 py-3 animate-fade-in"
                style={{
                  backgroundColor: 'var(--color-blue-50)',
                  borderRadius: 'var(--radius-md)',
                  animationDelay: `${i * 150 + 100}ms`,
                  animationFillMode: 'both',
                }}
              >
                <Info size={14} className="text-blue-600 mt-0.5 shrink-0" />
                <p className="text-[13px] text-ink-secondary leading-snug">{fact.gapMessage}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Calculated values */}
      {data.calculatedValues && data.calculatedValues.length > 0 && (
        <div className="mt-5 space-y-3">
          {data.calculatedValues.map((cv, i) => (
            <div key={i} className="flex items-start gap-2.5">
              <div className="w-5 h-5 mt-0.5 rounded-full bg-green-600 flex items-center justify-center shrink-0">
                <Check size={11} className="text-white" strokeWidth={3} />
              </div>
              <span className="text-[15px] font-medium text-ink">{cv.label}</span>
            </div>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="mt-8 flex items-center gap-4">
        <button
          onClick={onConfirm}
          className="px-8 py-3.5 text-white text-[15px] font-semibold transition-colors active:scale-[0.98]"
          style={{
            backgroundColor: 'var(--color-red-500)',
            borderRadius: 'var(--radius-card)',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-red-600)')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-red-500)')}
        >
          This looks correct
        </button>
        <button
          onClick={onGoBack}
          className="text-[13px] text-ink-tertiary hover:text-ink-secondary transition-colors"
        >
          Go back and review
        </button>
      </div>
    </div>
  )
}
