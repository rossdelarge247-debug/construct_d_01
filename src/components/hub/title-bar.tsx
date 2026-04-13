'use client'

import { ArrowLeft, Menu } from 'lucide-react'

interface TitleBarProps {
  title: string
  subtitle?: string
  showShareButton: boolean
  showBack?: boolean
  onBack?: () => void
}

export function TitleBar({ showBack, onBack }: TitleBarProps) {
  return (
    <header className="sticky top-0 z-30 bg-white" style={{ boxShadow: '0 1px 0 var(--color-grey-100)' }}>
      <div
        style={{ height: 'var(--title-bar-height)' }}
        className="flex items-center justify-between px-6"
      >
        {/* Left slot */}
        <div className="w-10 flex items-center">
          {showBack ? (
            <button
              onClick={onBack}
              className="p-2 -ml-2 text-ink hover:bg-grey-50 rounded-[var(--radius-md)] transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft size={20} />
            </button>
          ) : (
            <button
              className="p-2 -ml-2 text-ink hover:bg-grey-50 rounded-[var(--radius-md)] transition-colors"
              aria-label="Open navigation"
            >
              <Menu size={20} />
            </button>
          )}
        </div>

        {/* Centre — Decouple logo placeholder */}
        <span className="text-[18px] font-bold text-ink tracking-tight select-none">
          Decouple
        </span>

        {/* Right slot — reserved for future use */}
        <div className="w-10" />
      </div>
    </header>
  )
}
