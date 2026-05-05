import { CTAPrimary, Eyebrow } from '@/components/marketing/atoms'

const INK = 'var(--ds-color-ink)'
const SUB = 'var(--ds-color-text-sub)'
const MUTE = 'var(--ds-color-text-muted)'
const LINE = 'var(--ds-color-border)'
const ITALIC_ACCENT = '#3F3F3F'
const START_SOFT = '#F5F3EE'

interface Phase {
  n: string
  k: string
  ink: string
  soft: string
  subtitle: string
}

const PHASES: ReadonlyArray<Phase> = [
  { n: '1', k: 'Start', ink: INK, soft: START_SOFT, subtitle: 'Free orientation' },
  {
    n: '2',
    k: 'Build',
    ink: 'var(--ds-color-phase-build)',
    soft: 'var(--ds-color-phase-build-soft)',
    subtitle: "Sarah's Picture",
  },
  {
    n: '3',
    k: 'Reconcile',
    ink: 'var(--ds-color-phase-reconcile)',
    soft: 'var(--ds-color-phase-reconcile-soft)',
    subtitle: 'Household Picture',
  },
  {
    n: '4',
    k: 'Settle',
    ink: 'var(--ds-color-phase-settle)',
    soft: 'var(--ds-color-phase-settle-soft)',
    subtitle: 'Settlement Proposal',
  },
  {
    n: '5',
    k: 'Finalise',
    ink: 'var(--ds-color-phase-finalise)',
    soft: 'var(--ds-color-phase-finalise-soft)',
    subtitle: 'Court-ready package',
  },
]

export function HeroDiagrammatic() {
  return (
    <section
      id="hero"
      aria-labelledby="hero-diagrammatic-h1"
      className="sec-in sec-in-1"
    >
      <div style={{ padding: '44px 56px 56px' }}>
        <div style={{ maxWidth: 720 }}>
          <Eyebrow>From first question to court-sealed</Eyebrow>
          <h1
            id="hero-diagrammatic-h1"
            className="serif"
            style={{
              fontSize: 50,
              fontWeight: 600,
              letterSpacing: '-0.034em',
              lineHeight: 1.02,
              marginTop: 16,
              color: INK,
              textWrap: 'balance',
            }}
          >
            One workspace.{' '}
            <span style={{ fontStyle: 'italic', color: ITALIC_ACCENT }}>Five phases.</span>
          </h1>
          <p
            style={{
              fontSize: 13.5,
              lineHeight: 1.55,
              color: SUB,
              marginTop: 14,
              maxWidth: 460,
            }}
          >
            Decouple takes you from the first awkward conversation to the agreement
            sealed by a court — in a fraction of the time, for a fraction of the cost.
          </p>
        </div>

        <div style={{ marginTop: 32, position: 'relative' }}>
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              left: 36,
              right: 36,
              top: 18,
              height: 2,
              background: `linear-gradient(90deg, ${LINE} 0%, ${INK} 100%)`,
              borderRadius: 2,
            }}
          />
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(5, 1fr)',
              gap: 14,
            }}
          >
            {PHASES.map((p) => (
              <div key={p.k} style={{ position: 'relative' }}>
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 99,
                    background: '#FFFFFF',
                    color: p.ink,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 14,
                    fontWeight: 700,
                    fontFamily: "'Source Serif 4', serif",
                    border: `1.5px solid ${p.ink}`,
                    position: 'relative',
                    zIndex: 2,
                  }}
                >
                  {p.n}
                </div>
                <div style={{ marginTop: 14, paddingRight: 12 }}>
                  <div
                    style={{
                      fontSize: 9,
                      letterSpacing: '0.14em',
                      textTransform: 'uppercase',
                      fontWeight: 600,
                      color: p.ink,
                    }}
                  >
                    {p.k}
                  </div>
                  <div
                    className="serif italic"
                    style={{
                      fontSize: 13,
                      color: INK,
                      marginTop: 4,
                      lineHeight: 1.25,
                    }}
                  >
                    {p.subtitle}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            marginTop: 32,
            display: 'flex',
            alignItems: 'flex-end',
            gap: 22,
            flexWrap: 'wrap',
          }}
        >
          <CTAPrimary />
          <span style={{ fontSize: 12, color: MUTE, paddingBottom: 8 }}>
            Free until phase 2 · pay once.
          </span>
        </div>
      </div>
    </section>
  )
}
