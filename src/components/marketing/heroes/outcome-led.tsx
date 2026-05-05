import { CTAPrimary, Eyebrow } from '@/components/marketing/atoms'

const INK = 'var(--ds-color-ink)'
const SUB = 'var(--ds-color-text-sub)'
const MUTE = 'var(--ds-color-text-muted)'
const LINE = 'var(--ds-color-border)'
const ITALIC_ACCENT = '#3F3F3F'
const SEAL_RED = '#B91C1C'
const SEAL_BACKDROP = 'rgba(255,255,255,0.92)'

const ORDER_LINES: ReadonlyArray<string> = [
  "1. The applicant's claims for financial provision are dismissed save as below.",
  '2. The respondent shall transfer to the applicant the property at 14 Linden Road…',
  "3. Pension sharing order over the respondent's Aviva pension at 32%.",
  '4. Periodical payments to the applicant of £1,200 pcm for 60 months.',
  '5. Lump sum of £24,000 in two tranches…',
]

export function HeroOutcomeLed({ id = 'hero' }: { id?: string } = {}) {
  return (
    <section
      id={id}
      aria-labelledby="hero-outcome-led-h1"
      className="sec-in sec-in-1"
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          padding: '44px 56px 80px',
          gap: 56,
        }}
      >
        <div>
          <Eyebrow>The end you&apos;re working toward</Eyebrow>
          <h1
            id="hero-outcome-led-h1"
            className="serif"
            style={{
              fontSize: 50,
              fontWeight: 600,
              letterSpacing: '-0.034em',
              lineHeight: 1.0,
              marginTop: 18,
              color: INK,
              textWrap: 'balance',
            }}
          >
            A consent order,{' '}
            <span style={{ fontStyle: 'italic', color: ITALIC_ACCENT }}>sealed</span> by the court.
          </h1>
          <p
            style={{
              fontSize: 14,
              lineHeight: 1.55,
              color: SUB,
              marginTop: 18,
              maxWidth: 360,
            }}
          >
            Decouple takes you the whole way — from the first awkward conversation to
            the court-sealed agreement that legally ends your financial ties. Under
            £1,000. Three months.
          </p>
          <div style={{ marginTop: 28 }}>
            <CTAPrimary />
          </div>
        </div>

        <div style={{ position: 'relative', paddingTop: 8 }}>
          <div
            style={{
              width: '100%',
              maxWidth: 360,
              aspectRatio: '1 / 1.32',
              background: '#FFFFFF',
              border: `1px solid ${LINE}`,
              borderRadius: 4,
              boxShadow:
                '0 30px 60px rgba(0,0,0,0.10), 0 4px 12px rgba(0,0,0,0.04)',
              padding: '30px 32px',
              position: 'relative',
              margin: '0 auto',
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <div
                className="mono"
                style={{ fontSize: 7.5, color: MUTE, letterSpacing: '0.18em' }}
              >
                FORM A · CONSENT ORDER
              </div>
              <div
                className="serif"
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  marginTop: 10,
                  letterSpacing: '-0.005em',
                }}
              >
                In the Family Court at London
              </div>
              <div
                className="serif italic"
                style={{ fontSize: 9, color: SUB, marginTop: 4 }}
              >
                Between Sarah Hayes &amp; Mark Hayes
              </div>
            </div>

            <div style={{ marginTop: 22 }}>
              {ORDER_LINES.map((line, i) => (
                <div
                  key={line.slice(0, 4)}
                  style={{
                    fontSize: 7.5,
                    color: SUB,
                    lineHeight: 1.6,
                    marginTop: i === 0 ? 0 : 6,
                  }}
                >
                  {line}
                </div>
              ))}
            </div>

            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                right: -14,
                top: 100,
                transform: 'rotate(8deg)',
                width: 84,
                height: 84,
                borderRadius: 99,
                border: `2px solid ${SEAL_RED}`,
                color: SEAL_RED,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: SEAL_BACKDROP,
              }}
            >
              <span
                className="serif"
                style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.06em' }}
              >
                SEALED
              </span>
              <span className="mono" style={{ fontSize: 7, marginTop: 2 }}>
                14 · APR · 2026
              </span>
              <span
                className="mono"
                style={{ fontSize: 6.5, marginTop: 1, color: SEAL_RED, opacity: 0.8 }}
              >
                FAMILY COURT
              </span>
            </div>

            <div
              style={{
                position: 'absolute',
                bottom: 24,
                left: 32,
                right: 32,
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: 8,
                color: MUTE,
              }}
            >
              <span>Issued via Decouple</span>
              <span className="mono">Case No. FA-26-0418</span>
            </div>
          </div>
          <div style={{ textAlign: 'center', marginTop: 12 }}>
            <span
              className="serif italic"
              style={{ fontSize: 12, color: MUTE }}
            >
              The end you&apos;re working toward.
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
