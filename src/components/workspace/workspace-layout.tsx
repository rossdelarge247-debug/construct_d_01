'use client'

import { type ReactNode } from 'react'
import Link from 'next/link'
import { APP_NAME } from '@/constants'
import { cn } from '@/utils/cn'
import type { WorkspacePhase } from '@/types'

interface WorkspaceLayoutProps {
  children: ReactNode
  activePhase: WorkspacePhase
  breadcrumb?: { label: string; href: string }[]
}

const PHASES: { key: WorkspacePhase; label: string; isWaypoint: boolean }[] = [
  { key: 'build_your_picture', label: 'Build your picture', isWaypoint: false },
  { key: 'share_and_disclose', label: 'Share & disclose', isWaypoint: false },
  { key: 'work_through_it', label: 'Work through it', isWaypoint: false },
  { key: 'reach_agreement', label: 'Reach agreement', isWaypoint: false },
  { key: 'make_it_official', label: 'Make it official', isWaypoint: false },
]

export function WorkspaceLayout({ children, activePhase, breadcrumb }: WorkspaceLayoutProps) {
  const activeIndex = PHASES.findIndex(p => p.key === activePhase)

  return (
    <div className="flex min-h-screen flex-col bg-cream">
      {/* Header */}
      <header className="border-b border-cream-dark px-6 py-4">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <Link href="/workspace" className="font-heading text-lg font-medium text-ink">
            {APP_NAME}
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-xs text-ink-faint">Workspace</span>
          </div>
        </div>
      </header>

      {/* Phase bar */}
      <div className="border-b border-cream-dark bg-cream px-6 py-3">
        <div className="mx-auto max-w-4xl">
          {/* Progress */}
          <div className="h-1 overflow-hidden rounded-full bg-cream-dark">
            <div
              className="h-full rounded-full bg-warmth transition-all duration-500 ease-out"
              style={{ width: `${((activeIndex + 1) / PHASES.length) * 100}%` }}
            />
          </div>

          {/* Phase labels */}
          <div className="mt-2 flex items-center justify-between">
            {PHASES.map((phase, i) => (
              <span
                key={phase.key}
                className={cn(
                  'text-[11px] transition-colors duration-300',
                  i < activeIndex && 'text-sage',
                  i === activeIndex && 'font-medium text-warmth-dark',
                  i > activeIndex && 'text-ink-faint',
                )}
              >
                {phase.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      {breadcrumb && breadcrumb.length > 0 && (
        <div className="px-6 pt-4">
          <div className="mx-auto max-w-4xl">
            <nav className="flex items-center gap-2 text-xs text-ink-faint">
              <Link href="/workspace" className="hover:text-ink transition-colors">Workspace</Link>
              {breadcrumb.map((crumb, i) => (
                <span key={i} className="flex items-center gap-2">
                  <span>›</span>
                  {i === breadcrumb.length - 1 ? (
                    <span className="text-ink-light">{crumb.label}</span>
                  ) : (
                    <Link href={crumb.href} className="hover:text-ink transition-colors">{crumb.label}</Link>
                  )}
                </span>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* Content */}
      <main className="flex-1 px-6 py-6">
        <div className="mx-auto max-w-4xl">
          {children}
        </div>
      </main>
    </div>
  )
}
