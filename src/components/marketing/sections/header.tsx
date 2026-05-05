import {
  ArrowRight,
  Wordmark,
} from '@/components/marketing/atoms'

const SUB = 'var(--ds-color-text-sub)'
const INK = 'var(--ds-color-ink)'

const NAV_ITEMS: ReadonlyArray<readonly [string, string]> = [
  ['The picture', '#picture'],
  ['How it works', '#journey'],
  ['Why us', '#compare'],
  ['Pricing', '#pricing'],
]

export function Header() {
  return (
    <header
      role="banner"
      className="sticky top-0 z-40"
      style={{
        height: 78,
        background: 'rgba(245, 245, 244, 0.92)',
        backdropFilter: 'blur(14px)',
        borderBottom: '1px solid transparent',
      }}
    >
      <div
        className="mx-auto h-full px-8 flex items-center justify-between"
        style={{ maxWidth: 1240 }}
      >
        <a href="#top" className="flex items-center gap-2">
          <Wordmark size={17} />
        </a>

        <nav
          aria-label="Primary"
          className="hidden md:flex items-center gap-7"
          style={{ fontSize: 13.5, color: SUB }}
        >
          {NAV_ITEMS.map(([label, href]) => (
            <a key={href} href={href} className="hover:text-[color:var(--ds-color-ink)]">
              {label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-5">
          <a href="#signin" className="text-[13.5px]" style={{ color: SUB }}>
            Sign in
          </a>
          <a
            href="/start"
            className="cta-primary inline-flex items-center gap-2 rounded-full font-medium"
            style={{
              padding: '10px 18px',
              background: INK,
              color: '#FFFFFF',
              fontSize: 13,
              border: `1px solid ${INK}`,
            }}
          >
            Start your free plan
            <ArrowRight size={13} />
          </a>
        </div>
      </div>
    </header>
  )
}
