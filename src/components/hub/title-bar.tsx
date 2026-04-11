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

      {/* Title bar — spec 18: 56px height, 28px/700 page title */}
      <div style={{ height: 'var(--title-bar-height)' }} className="flex items-center justify-between px-6 max-w-[var(--content-max-width)] mx-auto">
        <div className="flex items-center gap-2">
          <h1 className="text-[28px] font-bold text-ink" style={{ letterSpacing: '-0.02em', lineHeight: '1.2' }}>{title}</h1>
          {subtitle && (
            <>
              <span className="text-ink-tertiary">:</span>
              <span className="text-[15px] text-ink-secondary">{subtitle}</span>
            </>
          )}
        </div>
        {showShareButton && (
          <button className="px-5 py-2 bg-blue-600 text-white text-[13px] font-semibold rounded-[var(--radius-pill)] hover:opacity-90 transition-opacity">
            Share &amp; collaborate
          </button>
        )}
      </div>
    </div>
  )
}
