import { CTAPrimary, Eyebrow } from '@/components/marketing/atoms'

const INK = 'var(--ds-color-ink)'
const SUB = 'var(--ds-color-text-sub)'
const MUTE = 'var(--ds-color-text-muted)'
const LINE = 'var(--ds-color-border)'
const CANVAS = 'var(--ds-color-surface-canvas)'
const ITALIC_ACCENT = '#3F3F3F'
const QUOTE_GLYPH = '#E5E3DC'

interface Byline {
  who: string
  detail: string
}

const COMPACT_BYLINES: ReadonlyArray<Byline> = [
  { who: 'James, Bristol', detail: 'Settled in 9 weeks · 2 children' },
  { who: 'Priya, London', detail: 'Pension share, no court hearing' },
]

export function HeroEmpathetic({ id = 'hero' }: { id?: string } = {}) {
  return (
    <section
      id={id}
      aria-labelledby="hero-empathetic-h1"
      className="sec-in sec-in-1"
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1.05fr 0.95fr',
          padding: '44px 56px 80px',
          gap: 48,
        }}
      >
        <div>
          <Eyebrow>You don&apos;t have to figure this out alone</Eyebrow>
          <h1
            id="hero-empathetic-h1"
            className="serif"
            style={{
              fontSize: 46,
              fontWeight: 600,
              letterSpacing: '-0.032em',
              lineHeight: 1.04,
              marginTop: 18,
              color: INK,
              textWrap: 'balance',
            }}
          >
            A calmer way to{' '}
            <span style={{ fontStyle: 'italic', color: ITALIC_ACCENT }}>separate</span>.
          </h1>
          <p
            className="serif italic"
            style={{
              fontSize: 16,
              lineHeight: 1.5,
              color: SUB,
              marginTop: 16,
              maxWidth: 380,
            }}
          >
            Built with people who&apos;ve been through it. For under £1,000, in three
            months — not £15,000 over eighteen.
          </p>
          <div style={{ marginTop: 26 }}>
            <CTAPrimary />
          </div>
        </div>

        <div style={{ alignSelf: 'center', paddingTop: 8 }}>
          <div
            style={{
              background: '#FFFFFF',
              border: `1px solid ${LINE}`,
              borderRadius: 14,
              padding: '22px 24px 20px',
              boxShadow: '0 14px 36px rgba(0,0,0,0.06)',
              position: 'relative',
            }}
          >
            <div
              aria-hidden="true"
              className="serif"
              style={{
                fontSize: 64,
                lineHeight: 0.6,
                color: QUOTE_GLYPH,
                position: 'absolute',
                top: 18,
                left: 22,
                fontStyle: 'italic',
              }}
            >
              &ldquo;
            </div>
            <p
              className="serif"
              style={{
                fontSize: 17,
                lineHeight: 1.42,
                color: INK,
                paddingLeft: 26,
                marginTop: 4,
                letterSpacing: '-0.005em',
                textWrap: 'pretty',
              }}
            >
              We spent two months avoiding the conversation. Decouple gave us a place
              to actually have it — calmly, in writing, without anyone going first.
            </p>
            <div
              style={{
                marginTop: 16,
                paddingTop: 14,
                borderTop: `1px solid ${LINE}`,
                display: 'flex',
                alignItems: 'center',
                gap: 10,
              }}
            >
              <div
                aria-hidden="true"
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 99,
                  background: 'var(--ds-color-phase-reconcile-soft)',
                  color: 'var(--ds-color-phase-reconcile)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 11,
                  fontWeight: 600,
                }}
              >
                R
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11.5, fontWeight: 600, color: INK }}>
                  Rachel · Manchester
                </div>
                <div style={{ fontSize: 10.5, color: MUTE, marginTop: 1 }}>
                  Settled in 11 weeks · saved an estimated £11,800
                </div>
              </div>
              <span
                className="mono"
                style={{ fontSize: 10, color: MUTE, letterSpacing: '0.04em' }}
              >
                Mar &apos;26
              </span>
            </div>
          </div>

          <div
            style={{
              marginTop: 12,
              display: 'flex',
              gap: 8,
              flexWrap: 'wrap',
            }}
          >
            {COMPACT_BYLINES.map((t) => (
              <div
                key={t.who}
                style={{
                  flex: '1 1 0',
                  background: CANVAS,
                  border: `1px solid ${LINE}`,
                  borderRadius: 10,
                  padding: '10px 12px',
                }}
              >
                <div style={{ fontSize: 10.5, fontWeight: 600, color: INK }}>
                  {t.who}
                </div>
                <div style={{ fontSize: 10, color: MUTE, marginTop: 2 }}>
                  {t.detail}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
