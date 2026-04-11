'use client'

import { Menu } from 'lucide-react'

interface TitleBarProps {
  title: string
  subtitle?: string
  showShareButton: boolean
}

export function TitleBar({ title, subtitle, showShareButton }: TitleBarProps) {
  return (
    <div className="sticky top-0 z-30 bg-white border-b border-grey-100">
      {/* Nav bar */}
      <div className="h-12 bg-grey-50 flex items-center justify-between px-4">
        <button
          className="p-2 -ml-2 text-ink hover:bg-grey-100 rounded-sm transition-colors"
          aria-label="Open navigation"
        >
          <Menu size={20} />
        </button>
        <div className="flex items-center gap-3">
          {/* Future: notification bell, settings cog */}
        </div>
      </div>

      {/* Title bar */}
      <div className="h-14 flex items-center justify-between px-6 max-w-[var(--content-max-width)] mx-auto">
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-bold text-ink">{title}</h1>
          {subtitle && (
            <>
              <span className="text-ink-tertiary">:</span>
              <span className="text-sm text-ink-secondary">{subtitle}</span>
            </>
          )}
        </div>
        {showShareButton && (
          <button className="px-4 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded-pill hover:opacity-90 transition-opacity">
            Share &amp; collaborate
          </button>
        )}
      </div>
    </div>
  )
}
