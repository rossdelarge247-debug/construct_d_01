import { CTAPrimary, Eyebrow } from '@/components/marketing/atoms'

const INK = 'var(--ds-color-ink)'
const SUB = 'var(--ds-color-text-sub)'
const MUTE = 'var(--ds-color-text-muted)'
const LINE = 'var(--ds-color-border)'
const CANVAS = 'var(--ds-color-surface-canvas)'
const ITALIC_ACCENT = '#3F3F3F'
const HEADER_STRIP = '#FAFAF7'
const GAP_DOT = '#B45309'

type RowState = 'agreed' | 'evidence' | 'gap' | 'ask'

interface PensionRow {
  name: string
  v: string
  state: RowState
}

const PENSION_ROWS: ReadonlyArray<PensionRow> = [
  { name: 'Aviva workplace pension', v: '£82,400', state: 'agreed' },
  { name: 'NHS pension (10y)', v: '£41,200', state: 'evidence' },
  { name: 'Nest auto-enrol', v: '£24,600', state: 'gap' },
  { name: 'Old Standard Life', v: '—', state: 'ask' },
]

const STATE_LABELS: Record<RowState, string> = {
  agreed: 'Agreed',
  evidence: 'Add evidence',
  gap: 'Gap',
  ask: 'Ask later',
}

const STATE_BG: Record<RowState, string> = {
  agreed: '#DCFCE7',
  evidence: '#EEF2FF',
  gap: '#FEF7E7',
  ask: '#F5F3EE',
}

const STATE_FG: Record<RowState, string> = {
  agreed: '#166534',
  evidence: '#4338CA',
  gap: '#92400E',
  ask: MUTE,
}

export function HeroProductForward({ id = 'hero' }: { id?: string } = {}) {
  return (
    <section
      id={id}
      aria-labelledby="hero-product-forward-h1"
      className="sec-in sec-in-1"
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '0.85fr 1.15fr',
          padding: '44px 56px 80px',
          gap: 36,
        }}
      >
        <div>
          <Eyebrow>What you actually get</Eyebrow>
          <h1
            id="hero-product-forward-h1"
            className="serif"
            style={{
              fontSize: 44,
              fontWeight: 600,
              letterSpacing: '-0.032em',
              lineHeight: 1.02,
              marginTop: 16,
              color: INK,
              textWrap: 'balance',
            }}
          >
            Your full picture.{' '}
            <span style={{ fontStyle: 'italic', color: ITALIC_ACCENT }}>In 15 minutes.</span>
          </h1>
          <p
            style={{
              fontSize: 13.5,
              lineHeight: 1.55,
              color: SUB,
              marginTop: 18,
              maxWidth: 320,
            }}
          >
            Connect your bank, confirm what we found, share with your ex. One workspace
            from first question to court-sealed agreement.
          </p>
          <div style={{ marginTop: 26 }}>
            <CTAPrimary size="lg" />
          </div>
        </div>

        <div
          style={{
            background: '#FFFFFF',
            border: `1px solid ${LINE}`,
            borderRadius: 12,
            boxShadow:
              '0 24px 60px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.04)',
            overflow: 'hidden',
            alignSelf: 'start',
            marginTop: 4,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 16px',
              height: 32,
              borderBottom: `1px solid ${LINE}`,
              background: HEADER_STRIP,
            }}
          >
            <span style={{ fontSize: 10.5, color: INK, fontWeight: 600 }}>
              Sarah&apos;s picture · Pensions
            </span>
            <span
              style={{
                padding: '2px 8px',
                borderRadius: 999,
                background: 'var(--ds-color-phase-build-soft)',
                color: 'var(--ds-color-phase-build)',
                fontSize: 9,
                fontWeight: 600,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
              }}
            >
              Private
            </span>
          </div>
          <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {PENSION_ROWS.map((r) => (
              <div
                key={r.name}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '10px 12px',
                  background: CANVAS,
                  borderRadius: 8,
                  border: `1px solid ${LINE}`,
                  position: 'relative',
                }}
              >
                {r.state === 'gap' && (
                  <span
                    aria-hidden="true"
                    style={{
                      position: 'absolute',
                      left: 4,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: 4,
                      height: 4,
                      borderRadius: 99,
                      background: GAP_DOT,
                    }}
                  />
                )}
                <span style={{ fontSize: 11, flex: 1, color: INK, fontWeight: 500 }}>
                  {r.name}
                </span>
                <span className="mono" style={{ fontSize: 10.5, color: INK }}>
                  {r.v}
                </span>
                <span
                  style={{
                    padding: '2px 7px',
                    borderRadius: 999,
                    fontSize: 8.5,
                    fontWeight: 600,
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                    background: STATE_BG[r.state],
                    color: STATE_FG[r.state],
                  }}
                >
                  {STATE_LABELS[r.state]}
                </span>
              </div>
            ))}
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 16px',
              borderTop: `1px solid ${LINE}`,
              background: HEADER_STRIP,
            }}
          >
            <span style={{ fontSize: 10, color: MUTE }}>
              23 of 127 transactions reviewed
            </span>
            <span style={{ fontSize: 10, color: INK, fontWeight: 500 }}>Continue →</span>
          </div>
        </div>
      </div>
    </section>
  )
}
