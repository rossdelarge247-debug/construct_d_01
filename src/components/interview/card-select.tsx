'use client'

import { cn } from '@/utils/cn'

interface CardOption {
  value: string
  label: string
  description?: string
}

interface CardSelectProps {
  options: CardOption[]
  value: string | null
  onChange: (value: string) => void
  columns?: 1 | 2
}

export function CardSelect({ options, value, onChange, columns = 2 }: CardSelectProps) {
  return (
    <div className={cn(
      'grid gap-3',
      columns === 2 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1',
    )}>
      {options.map(option => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={cn(
            'rounded-[var(--radius-md)] border-2 px-5 py-4 text-left transition-all duration-200',
            value === option.value
              ? 'border-warmth bg-warmth-light/50'
              : 'border-cream-dark bg-cream hover:border-ink-faint',
          )}
        >
          <span className={cn(
            'block text-sm font-medium',
            value === option.value ? 'text-warmth-dark' : 'text-ink',
          )}>
            {option.label}
          </span>
          {option.description && (
            <span className="mt-1 block text-xs text-ink-light leading-relaxed">
              {option.description}
            </span>
          )}
        </button>
      ))}
    </div>
  )
}
