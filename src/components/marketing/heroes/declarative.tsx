import { CTAPrimary, Eyebrow } from '@/components/marketing/atoms'

const INK = 'var(--ds-color-ink)'
const SUB = 'var(--ds-color-text-sub)'
const ITALIC_ACCENT = '#3F3F3F'

export function HeroDeclarative({ id = 'hero' }: { id?: string } = {}) {
  return (
    <section
      id={id}
      aria-labelledby="hero-declarative-h1"
      className="sec-in sec-in-1"
    >
      <div style={{ padding: '70px 64px 80px', maxWidth: 1100 }}>
        <Eyebrow>Decouple · for separating couples</Eyebrow>
        <h1
          id="hero-declarative-h1"
          className="serif"
          style={{
            fontSize: 96,
            fontWeight: 600,
            letterSpacing: '-0.045em',
            lineHeight: 0.98,
            marginTop: 24,
            color: INK,
            textWrap: 'balance',
          }}
        >
          The complete
          <br />
          <span style={{ fontStyle: 'italic', color: ITALIC_ACCENT }}>separation</span>,
          <br />
          finally settled.
        </h1>
        <div
          style={{
            marginTop: 40,
            display: 'flex',
            alignItems: 'center',
            gap: 28,
            flexWrap: 'wrap',
          }}
        >
          <CTAPrimary />
          <span className="serif italic" style={{ fontSize: 15, color: SUB }}>
            Under £1,000. Three months. One workspace.
          </span>
        </div>
      </div>
    </section>
  )
}
