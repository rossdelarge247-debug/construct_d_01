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
      'grid gap-2',
      columns === 2 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1',
    )}>
      {options.map(option => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={cn(
            'rounded-[var(--radius-card)] px-5 py-4 text-left transition-all duration-200',
            value === option.value
              ? 'bg-ink text-white'
              : 'bg-white text-ink hover:bg-[var(--color-grey-50)]',
          )}
          style={{
            boxShadow: value === option.value
              ? 'none'
              : 'var(--shadow-card)',
            border: value === option.value
              ? '1px solid var(--color-ink)'
              : '1px solid var(--color-grey-100)',
          }}
        >
          <span className={cn(
            'block text-[15px] font-medium',
            value === option.value ? 'text-white' : 'text-ink',
          )}>
            {option.label}
          </span>
          {option.description && (
            <span className={cn(
              'mt-1 block text-[13px] leading-relaxed',
              value === option.value ? 'text-white/70' : 'text-ink-secondary',
            )}>
              {option.description}
            </span>
          )}
        </button>
      ))}
    </div>
  )
}
