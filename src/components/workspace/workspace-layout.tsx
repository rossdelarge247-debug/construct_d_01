'use client'

import { type ReactNode } from 'react'
import { Sidebar, MobileBottomTabs } from '@/components/workspace/sidebar'
import type { WorkspacePhase } from '@/types'

interface WorkspaceLayoutProps {
  children: ReactNode
  activePhase: WorkspacePhase
  phaseTitle?: string
  phaseSubtitle?: string
  breadcrumb?: { label: string; href: string }[]
  sidebarSubItems?: { label: string; href: string; status?: 'done' | 'active' | 'pending' }[]
}

export function WorkspaceLayout({
  children,
  activePhase,
  phaseTitle,
  phaseSubtitle,
  sidebarSubItems,
}: WorkspaceLayoutProps) {
  return (
    <div className="min-h-screen bg-cream">
      {/* Sidebar — desktop */}
      <Sidebar activePhase={activePhase} subItems={sidebarSubItems} />

      {/* Main content — offset by sidebar width */}
      <div className="md:ml-[var(--sidebar-width)]">
        {/* Phase header — bold colour block */}
        {phaseTitle && (
          <div className="bg-warmth px-8 py-6">
            <h1 className="font-heading text-3xl font-semibold text-white">
              {phaseTitle}
            </h1>
            {phaseSubtitle && (
              <p className="mt-1 text-sm text-white/80">{phaseSubtitle}</p>
            )}
          </div>
        )}

        {/* Content area */}
        <main className="px-6 py-6 pb-24 md:px-8 md:pb-8">
          <div className="mx-auto max-w-4xl">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile bottom tabs */}
      <MobileBottomTabs activePhase={activePhase} />
    </div>
  )
}
