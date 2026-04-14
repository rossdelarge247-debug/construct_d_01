'use client'

import Link from 'next/link'

const COLUMNS = [
  {
    heading: 'Support',
    links: [
      { label: 'Help centre', href: '#' },
      { label: 'Contact us', href: '#' },
      { label: 'Speak to an advisor', href: '#' },
      { label: 'FAQs', href: '#' },
      { label: 'Find a mediator', href: '#' },
      { label: 'Find a solicitor', href: '#' },
    ],
  },
  {
    heading: 'Preparation',
    links: [],
  },
  {
    heading: 'Sharing & Collaboration',
    links: [],
  },
  {
    heading: 'Finalisation',
    links: [],
  },
]

export function MegaFooter() {
  return (
    <footer
      className="mt-16"
      style={{ borderTop: '1px solid var(--color-grey-100)' }}
    >
      <div className="mx-auto max-w-[var(--content-max-width)] px-6 pt-10 pb-6">
        {/* 4-column grid */}
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {COLUMNS.map((col) => (
            <div key={col.heading}>
              <h4 className="text-[14px] font-semibold text-ink mb-4">
                {col.heading}
              </h4>
              {col.links.length > 0 ? (
                <ul className="space-y-2.5">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-[13px] text-ink-secondary hover:text-ink transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-[12px] text-ink-disabled">Coming soon</p>
              )}
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          className="mt-10 pt-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"
          style={{ borderTop: '1px solid var(--color-grey-100)' }}
        >
          <Link
            href="/privacy"
            className="text-[12px] text-ink-tertiary hover:text-ink-secondary transition-colors"
          >
            Privacy
          </Link>
          <span className="text-[12px] text-ink-tertiary">
            Copyright Decouple 2026
          </span>
        </div>
      </div>
    </footer>
  )
}
