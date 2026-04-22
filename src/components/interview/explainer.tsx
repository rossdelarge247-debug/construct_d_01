'use client'

import { useState } from 'react'
import { cn } from '@/utils/cn'

interface ExplainerProps {
  label: string
  children: React.ReactNode
  className?: string
}

export function Explainer({ label, children, className }: ExplainerProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className={cn('rounded-[var(--radius-card)] bg-white', className)} style={{ boxShadow: 'var(--shadow-card)' }}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-5 py-3.5 text-left text-[13px] text-ink-secondary transition-colors hover:text-ink"
      >
        <span>{label}</span>
        <span className={cn(
          'text-ink-tertiary transition-transform duration-200',
          open && 'rotate-180',
        )}>
          &#9662;
        </span>
      </button>
      {open && (
        <div className="px-5 pb-4 text-[13px] leading-relaxed text-ink-secondary" style={{ borderTop: '1px solid var(--color-grey-100)' }}>
          <div className="pt-3">{children}</div>
        </div>
      )}
    </div>
  )
}
