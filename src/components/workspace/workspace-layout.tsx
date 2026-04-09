'use client'

import { type ReactNode, useState, useEffect } from 'react'
import { Sidebar, MobileBottomTabs } from '@/components/workspace/sidebar'
import type { WorkspacePhase } from '@/types'

interface WorkspaceLayoutProps {
  children: ReactNode
  activePhase: WorkspacePhase | null
}

export function WorkspaceLayout({ children, activePhase }: WorkspaceLayoutProps) {
  // Track sidebar collapsed state to offset main content
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  useEffect(() => {
    const stored = localStorage.getItem('sidebar_collapsed')
    if (stored === 'true') setSidebarCollapsed(true)

    // Listen for sidebar state changes
    const observer = new MutationObserver(() => {
      const stored = localStorage.getItem('sidebar_collapsed')
      setSidebarCollapsed(stored === 'true')
    })
    // Poll instead — simpler than MutationObserver for localStorage
    const interval = setInterval(() => {
      const stored = localStorage.getItem('sidebar_collapsed')
      setSidebarCollapsed(stored === 'true')
    }, 200)
    return () => { observer.disconnect(); clearInterval(interval) }
  }, [])

  return (
    <div className="min-h-screen bg-cream">
      {/* Sidebar — desktop only */}
      <Sidebar activePhase={activePhase} />

      {/* Main content — offset by sidebar width */}
      <div
        className="transition-[margin] duration-200 md:ml-[var(--sidebar-width)]"
        style={{ marginLeft: undefined }}
        data-sidebar-collapsed={sidebarCollapsed}
      >
        <div className={`hidden md:block transition-[margin] duration-200 ${sidebarCollapsed ? 'md:ml-[var(--sidebar-collapsed)]' : 'md:ml-[var(--sidebar-width)]'}`} style={{ position: 'absolute' }} />
        <main className={`min-h-screen pb-20 md:pb-0 transition-[margin-left] duration-200 ${sidebarCollapsed ? 'md:ml-[64px]' : 'md:ml-[240px]'}`}>
          {children}
        </main>
      </div>

      {/* Mobile bottom tabs */}
      <MobileBottomTabs activePhase={activePhase} />
    </div>
  )
}
