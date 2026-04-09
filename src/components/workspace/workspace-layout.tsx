'use client'

import { type ReactNode, useState, useEffect } from 'react'
import { Sidebar, MobileBottomTabs } from '@/components/workspace/sidebar'
import type { WorkspacePhase } from '@/types'

interface WorkspaceLayoutProps {
  children: ReactNode
  activePhase: WorkspacePhase | null
}

export function WorkspaceLayout({ children, activePhase }: WorkspaceLayoutProps) {
  const [collapsed, setCollapsed] = useState(false)

  useEffect(() => {
    const check = () => setCollapsed(localStorage.getItem('sidebar_collapsed') === 'true')
    check()
    const interval = setInterval(check, 300)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-cream">
      <Sidebar activePhase={activePhase} />

      <main
        className="min-h-screen pb-20 transition-[margin-left] duration-200 md:pb-0"
        style={{ marginLeft: collapsed ? 64 : 240 }}
      >
        {children}
      </main>

      <MobileBottomTabs activePhase={activePhase} />
    </div>
  )
}
