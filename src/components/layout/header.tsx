import Link from 'next/link'
import { APP_NAME } from '@/constants'

export function Header() {
  return (
    <header className="border-b border-slate-100 bg-white">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="text-lg font-semibold text-slate-900">
          {APP_NAME}
        </Link>
        <nav className="flex items-center gap-6">
          <Link href="/features" className="text-sm text-slate-500 transition-colors hover:text-slate-900">
            Features
          </Link>
          <Link href="/pricing" className="text-sm text-slate-500 transition-colors hover:text-slate-900">
            Pricing
          </Link>
        </nav>
      </div>
    </header>
  )
}
