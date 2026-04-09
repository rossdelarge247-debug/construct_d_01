'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { APP_NAME, EXIT_PAGE_URL } from '@/constants'
import { cn } from '@/utils/cn'
import type { WorkspacePhase } from '@/types'

const PHASES: { key: WorkspacePhase; label: string; shortLabel: string; href: string }[] = [
  { key: 'build_your_picture', label: 'Build your picture', shortLabel: 'Build', href: '/workspace/build' },
  { key: 'share_and_disclose', label: 'Share & disclose', shortLabel: 'Share', href: '/workspace/disclose' },
  { key: 'work_through_it', label: 'Work through it', shortLabel: 'Work', href: '/workspace/negotiate' },
  { key: 'reach_agreement', label: 'Reach agreement', shortLabel: 'Agree', href: '/workspace/agree' },
  { key: 'make_it_official', label: 'Make it official', shortLabel: 'Finalise', href: '/workspace/finalise' },
]

const UTILITY: { label: string; icon: string; href: string }[] = [
  { label: 'Documents', icon: '📄', href: '#' },
  { label: 'Timeline', icon: '📋', href: '#' },
  { label: 'Settings', icon: '⚙', href: '#' },
]

export function Sidebar({ activePhase }: { activePhase: WorkspacePhase | null }) {
  const pathname = usePathname()
  const activeIndex = activePhase ? PHASES.findIndex(p => p.key === activePhase) : -1

  // Collapse state — persisted
  const [collapsed, setCollapsed] = useState(false)
  useEffect(() => {
    const stored = localStorage.getItem('sidebar_collapsed')
    if (stored === 'true') setCollapsed(true)
  }, [])
  const toggleCollapse = () => {
    const next = !collapsed
    setCollapsed(next)
    localStorage.setItem('sidebar_collapsed', String(next))
  }

  const width = collapsed ? 'w-[var(--sidebar-collapsed)]' : 'w-[var(--sidebar-width)]'

  return (
    <aside className={cn(
      'fixed left-0 top-0 z-30 hidden h-screen flex-col bg-cream-dark border-r-[var(--border-card)] border-cream-dark/80 transition-all duration-200 md:flex',
      width,
    )}>
      {/* Logo + collapse toggle */}
      <div className={cn('flex items-center border-b border-cream-dark/60 px-4 py-4', collapsed ? 'justify-center' : 'justify-between')}>
        {!collapsed && (
          <Link href="/workspace" className="text-xl font-bold tracking-tight text-ink transition-colors hover:text-warmth">
            {APP_NAME}
          </Link>
        )}
        {collapsed && (
          <Link href="/workspace" className="text-xl font-bold text-ink">
            D
          </Link>
        )}
        <button
          onClick={toggleCollapse}
          className="flex h-7 w-7 items-center justify-center rounded-[var(--radius-sm)] text-xs text-ink-faint transition-colors hover:bg-cream-dark hover:text-ink"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? '»' : '«'}
        </button>
      </div>

      {/* Journey phases */}
      <nav className="flex-1 overflow-y-auto px-2 py-4">
        {!collapsed && (
          <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.15em] text-ink-faint">
            Your journey
          </p>
        )}

        <div className="space-y-1">
          {PHASES.map((phase, i) => {
            const isActive = phase.key === activePhase
            const isComplete = i < activeIndex
            const isFuture = i > activeIndex

            return (
              <Link
                key={phase.key}
                href={phase.href}
                title={collapsed ? phase.label : undefined}
                className={cn(
                  'group flex items-center gap-3 rounded-[var(--radius-sm)] transition-all duration-150',
                  collapsed ? 'justify-center px-2 py-3' : 'px-3 py-2.5',
                  isActive && 'bg-warmth text-white font-semibold shadow-[var(--shadow-sm)]',
                  isComplete && 'text-sage-dark hover:bg-sage-light/30',
                  isFuture && 'text-ink-faint hover:bg-cream-dark/60 hover:text-ink-light',
                  !isActive && !isComplete && !isFuture && 'text-ink-light hover:bg-cream-dark/60',
                )}
              >
                {/* Phase indicator */}
                <span className={cn(
                  'flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors',
                  isActive && 'bg-white/20 text-white',
                  isComplete && 'bg-sage-light text-sage-dark',
                  isFuture && 'bg-cream-dark text-ink-faint group-hover:bg-cream-dark/80',
                )}>
                  {isComplete ? '✓' : i + 1}
                </span>

                {/* Label */}
                {!collapsed && (
                  <span className="text-sm">{phase.label}</span>
                )}
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Utility */}
      <div className="border-t border-cream-dark/60 px-2 py-3">
        {UTILITY.map(item => (
          <Link
            key={item.label}
            href={item.href}
            title={collapsed ? item.label : undefined}
            className={cn(
              'flex items-center gap-3 rounded-[var(--radius-sm)] transition-colors hover:bg-cream-dark/60',
              collapsed ? 'justify-center px-2 py-2.5' : 'px-3 py-2',
            )}
          >
            <span className="text-base">{item.icon}</span>
            {!collapsed && <span className="text-[13px] text-ink-faint">{item.label}</span>}
          </Link>
        ))}
      </div>

      {/* Exit this page */}
      <div className="border-t border-cream-dark/60 px-2 py-3">
        <button
          onClick={() => {
            document.body.innerHTML = '<div style="position:fixed;inset:0;background:white;z-index:99999"></div>'
            setTimeout(() => window.location.replace(EXIT_PAGE_URL), 50)
          }}
          title={collapsed ? 'Exit this page' : undefined}
          className={cn(
            'flex w-full items-center gap-3 rounded-[var(--radius-sm)] transition-colors hover:bg-warmth-light/30 hover:text-warmth-dark',
            collapsed ? 'justify-center px-2 py-2.5 text-ink-faint' : 'px-3 py-2 text-ink-faint',
          )}
        >
          <span className="text-base">⏏</span>
          {!collapsed && <span className="text-[13px]">Exit this page</span>}
        </button>
      </div>
    </aside>
  )
}

/* ═══ Mobile bottom tabs ═══ */
export function MobileBottomTabs({ activePhase }: { activePhase: WorkspacePhase | null }) {
  const activeIndex = activePhase ? PHASES.findIndex(p => p.key === activePhase) : -1

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 flex items-center justify-around border-t-[var(--border-card)] border-cream-dark bg-cream px-1 py-1.5 md:hidden">
      {PHASES.map((phase, i) => {
        const isActive = phase.key === activePhase
        const isComplete = i < activeIndex

        return (
          <Link
            key={phase.key}
            href={phase.href}
            className={cn(
              'flex flex-col items-center gap-0.5 rounded-[var(--radius-sm)] px-2 py-1.5 transition-colors',
              isActive && 'text-warmth',
              isComplete && 'text-sage',
              !isActive && !isComplete && 'text-ink-faint',
            )}
          >
            <span className={cn(
              'flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold',
              isActive && 'bg-warmth text-white',
              isComplete && 'bg-sage-light text-sage-dark',
              !isActive && !isComplete && 'bg-cream-dark text-ink-faint',
            )}>
              {isComplete ? '✓' : i + 1}
            </span>
            <span className="text-[9px] font-semibold">{phase.shortLabel}</span>
          </Link>
        )
      })}
    </nav>
  )
}
