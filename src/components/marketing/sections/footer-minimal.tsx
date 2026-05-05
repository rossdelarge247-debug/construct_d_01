import { Wordmark } from '@/components/marketing/atoms'

const SUB = 'var(--ds-color-text-sub)'
const MUTE = 'var(--ds-color-text-muted)'
const BG = 'var(--ds-color-surface-page)'
const LINE = 'var(--ds-color-border)'

const LEGAL_LINKS: ReadonlyArray<readonly [string, string]> = [
  ['Privacy', '/privacy'],
  ['Terms', '/terms'],
  ['Cookies', '/cookies'],
]

export function FooterMinimal() {
  return (
    <footer
      role="contentinfo"
      style={{
        background: BG,
        borderTop: `1px solid ${LINE}`,
        padding: '60px 0 40px',
      }}
    >
      <div
        className="mx-auto px-8"
        style={{ maxWidth: 1240 }}
      >
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div>
            <Wordmark size={17} />
            <p
              className="serif"
              style={{
                fontSize: 15,
                color: SUB,
                lineHeight: 1.5,
                fontStyle: 'italic',
                maxWidth: 280,
                marginTop: 20,
              }}
            >
              The complete picture.
            </p>
            <div
              className="flex flex-col gap-2"
              style={{ fontSize: 11.5, color: MUTE, marginTop: 28 }}
            >
              <span>Decouple Ltd · London</span>
              <span>Open Banking via TrueLayer (FCA regulated)</span>
              <span
                className="mono"
                style={{ fontSize: 10.5, letterSpacing: '0.04em' }}
              >
                v1 · 2026
              </span>
            </div>
          </div>

          <nav aria-label="Legal" className="flex flex-col gap-2">
            {LEGAL_LINKS.map(([label, href]) => (
              <a
                key={href}
                href={href}
                style={{ fontSize: 13.5, color: SUB }}
              >
                {label}
              </a>
            ))}
          </nav>
        </div>

        <div
          className="mt-14 pt-6"
          style={{ borderTop: `1px solid ${LINE}` }}
        >
          <div
            className="flex items-center justify-between flex-wrap gap-3"
            style={{ fontSize: 11.5, color: MUTE }}
          >
            <span>© Decouple Ltd 2026 · All rights reserved</span>
            <span>
              Decouple is not a law firm and does not provide legal advice. We
              help you prepare a settlement; the court reviews and approves it.
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
