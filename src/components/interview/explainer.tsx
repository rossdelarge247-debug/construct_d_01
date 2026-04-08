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
    <div className={cn('rounded-[var(--radius-sm)] border border-cream-dark', className)}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-4 py-3 text-left text-sm text-ink-light transition-colors hover:text-ink"
      >
        <span>{label}</span>
        <span className={cn(
          'text-ink-faint transition-transform duration-200',
          open && 'rotate-180',
        )}>
          &#9662;
        </span>
      </button>
      {open && (
        <div className="border-t border-cream-dark px-4 py-3 text-sm leading-relaxed text-ink-light">
          {children}
        </div>
      )}
    </div>
  )
}
