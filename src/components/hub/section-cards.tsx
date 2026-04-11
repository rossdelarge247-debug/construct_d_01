'use client'

import { useCountUp } from '@/hooks/use-count-up'
import type { SectionData, SectionKey, FinancialItem } from '@/types/hub'

interface SectionCardsProps {
  sections: SectionData[]
  onManualInput: (sectionKey: SectionKey) => void
  onReviewSection: (sectionKey: SectionKey) => void
}

export function SectionCards({ sections, onManualInput, onReviewSection }: SectionCardsProps) {
  const visibleSections = sections.filter((s) => s.visible)

  return (
    <div className="space-y-4 sm:space-y-8">
      {visibleSections.map((section, index) => (
        <SectionCard
          key={section.key}
          section={section}
          index={index}
          onManualInput={() => onManualInput(section.key)}
          onReview={() => onReviewSection(section.key)}
        />
      ))}
    </div>
  )
}

interface SectionCardProps {
  section: SectionData
  index: number
  onManualInput: () => void
  onReview: () => void
}

function SectionCard({ section, index, onManualInput, onReview }: SectionCardProps) {
  const hasContent = section.status !== 'not_started' || section.estimateFromConfig

  return (
    <div
      className="bg-white border border-grey-100 rounded-md p-6 transition-shadow duration-200 hover:shadow-sm"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="flex items-start justify-between">
        <h3 className="text-base font-semibold text-ink">{section.label}</h3>
        <button
          onClick={onManualInput}
          className="text-[13px] text-blue-600 hover:underline flex-shrink-0"
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
                <span className="ml-1 text-amber-600 text-xs font-medium">(Your estimate)</span>
              </p>
            )}

            {section.items.map((item) => (
              <AnimatedItem key={item.id} item={item} />
            ))}

            {section.evidenceSummary && (
              <p className="mt-2 text-xs text-ink-tertiary">{section.evidenceSummary}</p>
            )}

            {section.items.length > 0 && (
              <button
                onClick={onReview}
                className="mt-3 text-[13px] text-blue-600 hover:underline"
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

function AnimatedItem({ item }: { item: FinancialItem }) {
  const animatedValue = useCountUp(item.value ?? 0)

  return (
    <div className="mt-1.5 animate-value-enter">
      <p className="text-sm font-medium text-ink">
        {item.label}:{' '}
        <span className="tabular-nums">
          {item.value !== null
            ? formatAnimatedValue(animatedValue, item.period)
            : 'Unknown'
          }
        </span>
        {item.confidence === 'estimated' && (
          <span className="ml-1 text-amber-600 text-xs font-medium">(Your estimate)</span>
        )}
      </p>
      {item.sourceDescription && (
        <p className="text-xs text-ink-tertiary mt-0.5">{item.sourceDescription}</p>
      )}
    </div>
  )
}

function formatAnimatedValue(value: number, period: string | null): string {
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
