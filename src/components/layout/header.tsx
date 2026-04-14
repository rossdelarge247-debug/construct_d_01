'use client'

import Link from 'next/link'
import { APP_NAME } from '@/constants'

export function Header() {
  return (
    <header className="border-b border-cream-dark bg-cream">
      <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-6">
        <Link href="/" className="font-heading text-xl font-semibold text-ink">
          {APP_NAME}
        </Link>
        <nav className="flex items-center gap-8">
          <Link href="/features" className="text-sm text-ink-light transition-colors duration-200 hover:text-ink">
            Features
          </Link>
          <Link href="/pricing" className="text-sm text-ink-light transition-colors duration-200 hover:text-ink">
            Pricing
          </Link>
          <button
            className="rounded-[var(--radius-card)] bg-ink px-4 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-ink-secondary"
            onClick={() => {/* Auth stub — wired up when Supabase is integrated */}}
          >
            Log in
          </button>
        </nav>
      </div>
    </header>
  )
}
