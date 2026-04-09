'use client'

import { useRef, useEffect, useState } from 'react'
import { cn } from '@/utils/cn'
import { CATEGORY_PRIORITY } from '@/types/workspace'
import type { FinancialPictureItem } from '@/types/workspace'

const CATEGORY_ICONS: Record<string, string> = {
  current_account: '🏦',
  savings: '💰',
  property: '🏠',
  pensions: '📊',
  debts: '💳',
  other_income: '📥',
  other_assets: '🚗',
  business: '💼',
  outgoings: '📉',
  budget: '📋',
  children: '👶',
}

interface CategoryTabsProps {
  activeTab: string
  onTabChange: (tab: string) => void
  items: FinancialPictureItem[]
  visibleCategories: string[]
}

function getTabStatus(key: string, items: FinancialPictureItem[]): { label: string; colour: string } | null {
  const catItems = items.filter(i =>
    i.category === key || i.subcategory === key ||
    (key === 'current_account' && (i.category === 'income' || i.subcategory === 'current_account'))
  )
  if (catItems.length === 0) return null

  const confirmed = catItems.filter(i => i.status === 'confirmed').length
  const awaiting = catItems.some(i => i.status === 'awaiting')

  if (awaiting) return { label: '⏳', colour: 'text-amber' }
  if (confirmed === catItems.length) return { label: `✓ ${confirmed}`, colour: 'text-sage-dark' }
  return { label: `${catItems.length}`, colour: 'text-warmth-dark' }
}

export function CategoryTabs({ activeTab, onTabChange, items, visibleCategories }: CategoryTabsProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [showScrollRight, setShowScrollRight] = useState(false)

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const check = () => setShowScrollRight(el.scrollWidth > el.clientWidth + el.scrollLeft + 10)
    check()
    el.addEventListener('scroll', check)
    window.addEventListener('resize', check)
    return () => { el.removeEventListener('scroll', check); window.removeEventListener('resize', check) }
  }, [])

  const categories = CATEGORY_PRIORITY.filter(c => visibleCategories.includes(c.key))

  return (
    <div className="relative">
      <div
        ref={scrollRef}
        className="flex overflow-x-auto border-b-[var(--border-card)] border-cream-dark scrollbar-none"
        style={{ scrollbarWidth: 'none' }}
      >
        {categories.map(cat => {
          const isActive = cat.key === activeTab
          const status = getTabStatus(cat.key, items)
          const icon = CATEGORY_ICONS[cat.key] || '📁'

          return (
            <button
              key={cat.key}
              onClick={() => onTabChange(cat.key)}
              className={cn(
                'relative shrink-0 flex items-center gap-2 px-4 py-3.5 text-sm font-semibold transition-colors whitespace-nowrap',
                isActive ? 'text-warmth-dark' : 'text-ink-faint hover:text-ink-light',
              )}
            >
              <span className="text-base">{icon}</span>
              <span>{cat.label}</span>
              {status && (
                <span className={cn('text-xs font-bold', status.colour)}>
                  {status.label}
                </span>
              )}
              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-[3px] rounded-t-full bg-warmth" />
              )}
            </button>
          )
        })}

        {/* Add category button */}
        <button
          className="shrink-0 flex items-center gap-1 px-4 py-3.5 text-xs font-semibold text-ink-faint hover:text-warmth-dark transition-colors whitespace-nowrap"
        >
          <span>+</span>
          <span>Add</span>
        </button>
      </div>

      {showScrollRight && (
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-surface to-transparent" />
      )}
    </div>
  )
}
