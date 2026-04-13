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
    <div
      className="animate-fade-in"
      style={{ willChange: 'opacity, transform' }}
    >
      {/* Section label */}
      <p className="text-xs font-semibold text-ink-tertiary uppercase tracking-wider mb-1">
        {data.sectionLabel}
      </p>

      {/* Heading */}
      <h3 className="text-xl font-bold text-ink mb-5">{data.heading}</h3>

      {/* Confirmed facts */}
      <div className="space-y-3">
        {data.facts.map((fact, i) => (
          <div
            key={i}
            className="animate-fade-in"
            style={{
              animationDelay: `${i * 150}ms`,
              animationFillMode: 'both',
            }}
          >
            {/* Fact row */}
            <div className="flex items-start gap-2.5">
              <div className="w-5 h-5 mt-0.5 rounded-full bg-green-600 flex items-center justify-center shrink-0">
                <Check size={11} className="text-white" strokeWidth={3} />
              </div>
              <span className="text-[15px] text-ink">{fact.label}</span>
            </div>

            {/* Gap message (spec 25: info box beneath relevant fact) */}
            {fact.gapMessage && (
              <div
                className="ml-7 mt-2 flex items-start gap-2 rounded-md bg-blue-50 px-3 py-2.5 animate-fade-in"
                style={{
                  animationDelay: `${i * 150 + 100}ms`,
                  animationFillMode: 'both',
                }}
              >
                <Info size={14} className="text-blue-600 mt-0.5 shrink-0" />
                <p className="text-sm text-ink-secondary leading-snug">{fact.gapMessage}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Calculated values */}
      {data.calculatedValues && data.calculatedValues.length > 0 && (
        <div className="mt-4 space-y-2">
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
      <div className="mt-6 flex items-center gap-4">
        <button
          onClick={onConfirm}
          className="px-5 py-2.5 bg-ink text-white text-sm font-semibold rounded-md hover:opacity-90 transition-opacity active:scale-[0.98]"
        >
          This looks correct
        </button>
        <button
          onClick={onGoBack}
          className="text-sm text-ink-tertiary hover:text-ink-secondary transition-colors"
        >
          I need to go back and review these again
        </button>
      </div>
    </div>
  )
}
