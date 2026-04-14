import Link from 'next/link'

const FOOTER_COLUMNS = [
  {
    title: 'Product',
    links: [
      { label: 'How it works', href: '/features' },
      { label: 'Pricing', href: '/pricing' },
      { label: 'Security', href: '/privacy' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Help Centre', href: '#' },
      { label: 'Contact us', href: '#' },
      { label: 'FAQs', href: '#' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy policy', href: '/privacy' },
      { label: 'Terms of service', href: '/terms' },
      { label: 'Cookie policy', href: '/cookies' },
    ],
  },
]

export function Footer() {
  return (
    <footer className="bg-white" style={{ borderTop: '1px solid var(--color-grey-100)' }}>
      <div className="mx-auto max-w-[1080px] px-6 py-12">
        <div className="grid gap-8 sm:grid-cols-3">
          {FOOTER_COLUMNS.map((col) => (
            <div key={col.title}>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-tertiary">
                {col.title}
              </p>
              <ul className="mt-3 space-y-2">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-[13px] text-ink-secondary transition-colors duration-200 hover:text-ink"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: '1px solid var(--color-grey-100)' }}>
        <div className="mx-auto flex max-w-[1080px] flex-col items-center justify-between gap-3 px-6 py-5 sm:flex-row">
          <p className="text-[12px] text-ink-tertiary">
            Your information is private and encrypted. Nothing is shared unless you choose to share it.
          </p>
          <p className="text-[12px] text-ink-disabled">
            &copy; Decouple 2026
          </p>
        </div>
      </div>
    </footer>
  )
}
