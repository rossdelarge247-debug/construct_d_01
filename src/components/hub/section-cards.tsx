'use client'

import type { SectionData, SectionKey } from '@/types/hub'

interface SectionCardsProps {
  sections: SectionData[]
  onManualInput: (sectionKey: SectionKey) => void
  onReviewSection: (sectionKey: SectionKey) => void
}

export function SectionCards({ sections, onManualInput, onReviewSection }: SectionCardsProps) {
  const visibleSections = sections.filter((s) => s.visible)

  return (
    <div className="space-y-4">
      {visibleSections.map((section) => (
        <SectionCard
          key={section.key}
          section={section}
          onManualInput={() => onManualInput(section.key)}
          onReview={() => onReviewSection(section.key)}
        />
      ))}
    </div>
  )
}

interface SectionCardProps {
  section: SectionData
  onManualInput: () => void
  onReview: () => void
}

function SectionCard({ section, onManualInput, onReview }: SectionCardProps) {
  const hasContent = section.status !== 'not_started' || section.estimateFromConfig
  const isEstimateOnly = section.status === 'estimate_only' || (!section.items.length && section.estimateFromConfig)

  return (
    <div className="bg-white border border-grey-100 rounded-md p-6">
      <div className="flex items-start justify-between">
        <h3 className="text-base font-semibold text-ink">{section.label}</h3>
        <button
          onClick={onManualInput}
          className="text-xs text-blue-600 hover:underline"
        >
          Manually input
        </button>
      </div>

      <div className="mt-2">
        {hasContent ? (
          <div>
            {section.estimateFromConfig && section.items.length === 0 && (
              <p className="text-sm text-ink-secondary">
                {section.estimateFromConfig}
                <span className="ml-1 text-amber-600 text-xs">(Your estimate)</span>
              </p>
            )}

            {section.items.map((item) => (
              <div key={item.id} className="mt-1">
                <p className="text-sm font-medium text-ink">
                  {item.label}: {item.value !== null ? formatValue(item.value, item.period) : 'Unknown'}
                  {item.confidence === 'estimated' && (
                    <span className="ml-1 text-amber-600 text-xs">(Your estimate)</span>
                  )}
                </p>
                {item.sourceDescription && (
                  <p className="text-xs text-ink-tertiary">{item.sourceDescription}</p>
                )}
              </div>
            ))}

            {section.evidenceSummary && (
              <p className="mt-2 text-xs text-ink-tertiary">{section.evidenceSummary}</p>
            )}

            {section.items.length > 0 && (
              <button
                onClick={onReview}
                className="mt-3 text-xs text-blue-600 hover:underline"
              >
                Review details →
              </button>
            )}
          </div>
        ) : (
          <p className="text-sm text-ink-tertiary">
            Nothing to show yet, upload your evidence to quickly build your picture
          </p>
        )}
      </div>
    </div>
  )
}

function formatValue(value: number, period: string | null): string {
  const formatted = new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)

  if (period === 'monthly') return `${formatted}/month`
  if (period === 'annual') return `${formatted}/year`
  return formatted
}
