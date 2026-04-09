'use client'

import { useState } from 'react'
import { cn } from '@/utils/cn'

type PageTab = 'preparation' | 'summary'

interface PageTabsProps {
  active: PageTab
  onChange: (tab: PageTab) => void
  preparationLabel?: string
  summaryLabel?: string
}

export function PageTabs({ active, onChange, preparationLabel = 'Preparation', summaryLabel = 'Summary' }: PageTabsProps) {
  return (
    <div className="flex gap-1 rounded-[var(--radius-md)] bg-cream-dark p-1">
      <button
        onClick={() => onChange('preparation')}
        className={cn(
          'flex-1 rounded-[var(--radius-sm)] px-6 py-3 text-sm font-bold transition-all duration-200',
          active === 'preparation'
            ? 'bg-warmth text-white shadow-[var(--shadow-sm)]'
            : 'text-ink-light hover:text-ink hover:bg-cream',
        )}
      >
        {preparationLabel}
      </button>
      <button
        onClick={() => onChange('summary')}
        className={cn(
          'flex-1 rounded-[var(--radius-sm)] px-6 py-3 text-sm font-bold transition-all duration-200',
          active === 'summary'
            ? 'bg-teal text-white shadow-[var(--shadow-sm)]'
            : 'text-ink-light hover:text-ink hover:bg-cream',
        )}
      >
        {summaryLabel}
      </button>
    </div>
  )
}
