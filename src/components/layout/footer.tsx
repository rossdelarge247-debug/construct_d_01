import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-slate-100 bg-white py-8">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <nav className="flex gap-6">
            <Link href="/privacy" className="text-sm text-slate-400 transition-colors hover:text-slate-600">
              Privacy
            </Link>
            <Link href="/terms" className="text-sm text-slate-400 transition-colors hover:text-slate-600">
              Terms
            </Link>
            <Link href="/cookies" className="text-sm text-slate-400 transition-colors hover:text-slate-600">
              Cookies
            </Link>
          </nav>
          <p className="text-sm text-slate-400">
            Your information is private and encrypted.
          </p>
        </div>
      </div>
    </footer>
  )
}
