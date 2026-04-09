'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { APP_NAME, EXIT_PAGE_URL } from '@/constants'
import { cn } from '@/utils/cn'
import type { WorkspacePhase } from '@/types'

interface SidebarProps {
  activePhase: WorkspacePhase
  subItems?: { label: string; href: string; status?: 'done' | 'active' | 'pending' }[]
}

const PHASES: { key: WorkspacePhase; label: string; icon: string; href: string }[] = [
  { key: 'build_your_picture', label: 'Build your picture', icon: '◉', href: '/workspace' },
  { key: 'share_and_disclose', label: 'Share & disclose', icon: '◎', href: '#' },
  { key: 'work_through_it', label: 'Work through it', icon: '◎', href: '#' },
  { key: 'reach_agreement', label: 'Reach agreement', icon: '◎', href: '#' },
  { key: 'make_it_official', label: 'Make it official', icon: '◎', href: '#' },
]

const UTILITY_ITEMS = [
  { label: 'Documents', icon: '📄', href: '#' },
  { label: 'Timeline', icon: '📋', href: '#' },
  { label: 'Settings', icon: '⚙', href: '#' },
]

export function Sidebar({ activePhase, subItems }: SidebarProps) {
  const pathname = usePathname()
  const activeIndex = PHASES.findIndex(p => p.key === activePhase)

  return (
    <aside className="fixed left-0 top-0 z-30 hidden h-screen w-[var(--sidebar-width)] flex-col border-r border-cream-dark bg-cream-dark/50 md:flex">
      {/* Logo */}
      <div className="px-5 py-5">
        <Link href="/workspace" className="font-heading text-xl font-semibold text-ink">
          {APP_NAME}
        </Link>
      </div>

      {/* Journey phases */}
      <nav className="flex-1 px-3 py-2">
        <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-widest text-ink-faint">
          Your journey
        </p>

        <div className="space-y-1">
          {PHASES.map((phase, i) => {
            const isActive = phase.key === activePhase
            const isComplete = i < activeIndex
            const isFuture = i > activeIndex

            return (
              <div key={phase.key}>
                <Link
                  href={phase.href}
                  className={cn(
                    'flex items-center gap-3 rounded-[var(--radius-sm)] px-3 py-2.5 text-sm transition-all duration-200',
                    isActive && 'bg-warmth text-white font-medium shadow-[var(--shadow-sm)]',
                    isComplete && 'text-sage-dark hover:bg-sage-light/30',
                    isFuture && 'text-ink-faint cursor-default',
                    !isActive && !isFuture && 'hover:bg-cream-dark',
                  )}
                >
                  <span className={cn(
                    'text-xs',
                    isActive && 'text-white',
                    isComplete && 'text-sage',
                    isFuture && 'text-ink-faint',
                  )}>
                    {isComplete ? '✓' : phase.icon}
                  </span>
                  {phase.label}
                </Link>

                {/* Sub-items for active phase */}
                {isActive && subItems && subItems.length > 0 && (
                  <div className="ml-5 mt-1 space-y-0.5 border-l-2 border-warmth-light pl-3">
                    {subItems.map(item => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          'flex items-center gap-2 rounded-[var(--radius-sm)] px-2 py-1.5 text-xs transition-colors',
                          pathname === item.href ? 'text-warmth-dark font-medium bg-warmth-light/30' : 'text-ink-light hover:text-ink hover:bg-cream-dark',
                        )}
                      >
                        <span className={cn(
                          'h-1.5 w-1.5 rounded-full',
                          item.status === 'done' ? 'bg-sage' :
                          item.status === 'active' ? 'bg-warmth' :
                          'bg-ink-faint',
                        )} />
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </nav>

      {/* Utility items */}
      <div className="border-t border-cream-dark px-3 py-3">
        {UTILITY_ITEMS.map(item => (
          <Link
            key={item.label}
            href={item.href}
            className="flex items-center gap-3 rounded-[var(--radius-sm)] px-3 py-2 text-xs text-ink-faint transition-colors hover:text-ink-light hover:bg-cream-dark"
          >
            <span>{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </div>

      {/* Exit this page */}
      <div className="border-t border-cream-dark px-3 py-3">
        <button
          onClick={() => window.location.replace(EXIT_PAGE_URL)}
          className="flex w-full items-center gap-3 rounded-[var(--radius-sm)] px-3 py-2 text-xs text-ink-faint transition-colors hover:text-warmth-dark hover:bg-warmth-light/20"
        >
          <span>⏏</span>
          Exit this page
        </button>
      </div>
    </aside>
  )
}

/* Mobile bottom tabs */
export function MobileBottomTabs({ activePhase }: { activePhase: WorkspacePhase }) {
  const activeIndex = PHASES.findIndex(p => p.key === activePhase)

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 flex items-center justify-around border-t border-cream-dark bg-cream px-2 py-2 md:hidden">
      {PHASES.map((phase, i) => {
        const isActive = phase.key === activePhase
        const isComplete = i < activeIndex

        return (
          <Link
            key={phase.key}
            href={phase.href}
            className={cn(
              'flex flex-col items-center gap-1 rounded-[var(--radius-sm)] px-3 py-1.5 transition-colors',
              isActive && 'text-warmth',
              isComplete && 'text-sage',
              !isActive && !isComplete && 'text-ink-faint',
            )}
          >
            <span className="text-lg">{isComplete ? '✓' : phase.icon}</span>
            <span className="text-[9px] font-medium">{phase.label.split(' ')[0]}</span>
          </Link>
        )
      })}
    </nav>
  )
}
