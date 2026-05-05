import { CTAPrimary, Eyebrow } from '@/components/marketing/atoms'

const INK = 'var(--ds-color-ink)'
const SUB = 'var(--ds-color-text-sub)'
const ITALIC_ACCENT = '#3F3F3F'

export function HeroTypographic() {
  return (
    <section
      id="hero"
      aria-labelledby="hero-typographic-h1"
      className="sec-in sec-in-1"
      style={{ background: 'var(--ds-color-surface-canvas)' }}
    >
      <div
        style={{
          minHeight: 600,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '64px 64px 80px',
        }}
      >
        <Eyebrow>The complete settlement workspace</Eyebrow>
        <h1
          id="hero-typographic-h1"
          className="serif text-center"
          style={{
            fontSize: 110,
            fontWeight: 600,
            letterSpacing: '-0.05em',
            lineHeight: 0.95,
            marginTop: 24,
            color: INK,
            maxWidth: 1000,
            textWrap: 'balance',
          }}
        >
          Decouple,
          <br />
          <span style={{ fontStyle: 'italic', color: ITALIC_ACCENT }}>together</span>.
        </h1>
        <p
          className="serif italic text-center"
          style={{
            fontSize: 18,
            color: SUB,
            marginTop: 30,
            maxWidth: 580,
            lineHeight: 1.45,
          }}
        >
          A single workspace for finances, children, housing — and the agreement
          that holds it all.
        </p>
        <div style={{ marginTop: 40 }}>
          <CTAPrimary />
        </div>
      </div>
    </section>
  )
}
