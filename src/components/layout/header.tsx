'use client'

import Link from 'next/link'
import { APP_NAME } from '@/constants'

export function Header() {
  return (
    <header className="sticky top-0 z-30 bg-white" style={{ boxShadow: '0 1px 0 var(--color-grey-100)' }}>
      <div className="mx-auto flex items-center justify-between px-6" style={{ height: '64px' }}>
        {/* Left — nav links */}
        <nav className="flex items-center gap-6">
          <Link href="/features" className="text-[13px] font-medium text-ink-secondary transition-colors duration-200 hover:text-ink">
            Features
          </Link>
          <Link href="/pricing" className="text-[13px] font-medium text-ink-secondary transition-colors duration-200 hover:text-ink">
            Pricing
          </Link>
        </nav>

        {/* Centre — logo */}
        <Link href="/" className="absolute left-1/2 -translate-x-1/2 text-[18px] font-bold text-ink tracking-tight select-none">
          {APP_NAME}
        </Link>

        {/* Right — login stub */}
        <button
          className="rounded-[var(--radius-card)] bg-ink px-4 py-2 text-[13px] font-medium text-white transition-colors duration-200 hover:opacity-90"
          onClick={() => {/* Auth stub — wired up when Supabase is integrated */}}
        >
          Log in
        </button>
      </div>
    </header>
  )
}
