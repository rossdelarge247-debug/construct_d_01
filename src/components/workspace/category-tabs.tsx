'use client'

import { useState, useRef, useEffect } from 'react'
import { cn } from '@/utils/cn'
import { CATEGORY_PRIORITY } from '@/types/workspace'
import type { FinancialPictureItem } from '@/types/workspace'

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
      {/* Tab bar */}
      <div
        ref={scrollRef}
        className="flex overflow-x-auto border-b-[var(--border-card)] border-cream-dark scrollbar-none"
        style={{ scrollbarWidth: 'none' }}
      >
        {categories.map(cat => {
          const isActive = cat.key === activeTab
          const status = getTabStatus(cat.key, items)

          return (
            <button
              key={cat.key}
              onClick={() => onTabChange(cat.key)}
              className={cn(
                'relative shrink-0 px-5 py-3.5 text-sm font-semibold transition-colors whitespace-nowrap',
                isActive ? 'text-warmth-dark' : 'text-ink-faint hover:text-ink-light',
              )}
            >
              {cat.label}
              {status && (
                <span className={cn('ml-1.5 text-xs font-bold', status.colour)}>
                  {status.label}
                </span>
              )}
              {/* Active indicator — bold bottom border */}
              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-[3px] rounded-t-full bg-warmth" />
              )}
            </button>
          )
        })}
      </div>

      {/* Scroll indicator */}
      {showScrollRight && (
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-cream to-transparent" />
      )}
    </div>
  )
}
