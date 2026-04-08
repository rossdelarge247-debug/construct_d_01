import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-cream-dark py-10">
      <div className="mx-auto max-w-4xl px-6">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <nav className="flex gap-8">
            <Link href="/privacy" className="text-sm text-ink-faint transition-colors duration-200 hover:text-ink-light">
              Privacy
            </Link>
            <Link href="/terms" className="text-sm text-ink-faint transition-colors duration-200 hover:text-ink-light">
              Terms
            </Link>
            <Link href="/cookies" className="text-sm text-ink-faint transition-colors duration-200 hover:text-ink-light">
              Cookies
            </Link>
          </nav>
          <p className="text-sm text-ink-faint">
            Your information is private and encrypted.
          </p>
        </div>
      </div>
    </footer>
  )
}
