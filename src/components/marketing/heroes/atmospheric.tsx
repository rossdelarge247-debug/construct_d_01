import { ArrowRight, Check, Lock, Shield } from '@/components/marketing/atoms'

const INK = 'var(--ds-color-ink)'
const DARK_SURFACE = '#0F0E0C'
const LIGHT_TEXT = '#FFFFFF'
const LIGHT_TEXT_DIM = 'rgba(255,255,255,0.65)'
const LIGHT_TEXT_MUTED = 'rgba(255,255,255,0.55)'
const LIGHT_TEXT_FAINT = 'rgba(255,255,255,0.45)'
const LIGHT_BORDER = 'rgba(255,255,255,0.12)'
const LIGHT_DOT = 'rgba(255,255,255,0.3)'

const BACKDROP_GRADIENT =
  'radial-gradient(circle at 70% 35%, rgba(99,76,180,0.28), transparent 50%), ' +
  'radial-gradient(circle at 30% 70%, rgba(45,80,140,0.22), transparent 55%), ' +
  'radial-gradient(circle at 80% 80%, rgba(160,80,120,0.16), transparent 60%)'

export function HeroAtmospheric({ id = 'hero' }: { id?: string } = {}) {
  return (
    <section
      id={id}
      aria-labelledby="hero-atmospheric-h1"
      className="sec-in sec-in-1"
      style={{ background: DARK_SURFACE, position: 'relative', overflow: 'hidden' }}
    >
      <div
        data-hero-backdrop
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          backgroundImage: BACKDROP_GRADIENT,
          filter: 'blur(20px)',
        }}
      />
      <div
        style={{
          position: 'relative',
          padding: '70px 64px 80px',
          maxWidth: 1100,
          color: LIGHT_TEXT,
        }}
      >
        <span
          style={{
            fontSize: 9.5,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            fontWeight: 600,
            color: LIGHT_TEXT_MUTED,
          }}
        >
          The complete settlement workspace
        </span>
        <h1
          id="hero-atmospheric-h1"
          className="serif"
          style={{
            fontSize: 80,
            fontWeight: 600,
            letterSpacing: '-0.04em',
            lineHeight: 1.0,
            marginTop: 20,
            color: LIGHT_TEXT,
            textWrap: 'balance',
          }}
        >
          Untangle{' '}
          <span style={{ fontStyle: 'italic', color: LIGHT_TEXT_DIM }}>everything</span>.
          <br />
          Move forward.
        </h1>
        <p
          className="serif italic"
          style={{
            fontSize: 17,
            lineHeight: 1.5,
            color: LIGHT_TEXT_DIM,
            marginTop: 22,
            maxWidth: 480,
          }}
        >
          Finances, children, housing — and the agreement that holds it all. Under
          £1,000. Three months. One calm workspace.
        </p>
        <div
          style={{
            marginTop: 36,
            display: 'flex',
            alignItems: 'flex-end',
            gap: 22,
            flexWrap: 'wrap',
          }}
        >
          <a
            href="/start"
            className="cta-primary inline-flex items-center gap-2 rounded-full font-medium"
            style={{
              padding: '13px 22px',
              background: LIGHT_TEXT,
              color: INK,
              fontSize: 13,
              letterSpacing: '-0.005em',
              textDecoration: 'none',
            }}
          >
            Start your free plan
            <ArrowRight size={14} sw={2} />
          </a>
          <span
            className="mono"
            style={{
              fontSize: 10,
              color: LIGHT_TEXT_FAINT,
              letterSpacing: '0.02em',
              paddingBottom: 8,
            }}
          >
            ~3 minutes · no account needed
          </span>
        </div>
        <div
          style={{
            marginTop: 44,
            paddingTop: 18,
            borderTop: `1px solid ${LIGHT_BORDER}`,
            maxWidth: 540,
            display: 'flex',
            gap: 16,
            flexWrap: 'wrap',
            fontSize: 10.5,
            color: LIGHT_TEXT_MUTED,
          }}
        >
          <span className="flex items-center gap-1.5">
            <Shield size={11} sw={1.8} />
            FCA-regulated via TrueLayer
          </span>
          <span
            aria-hidden="true"
            style={{ width: 2, height: 2, borderRadius: 99, background: LIGHT_DOT }}
          />
          <span className="flex items-center gap-1.5">
            <Lock size={11} sw={1.8} />
            Read-only access
          </span>
          <span
            aria-hidden="true"
            style={{ width: 2, height: 2, borderRadius: 99, background: LIGHT_DOT }}
          />
          <span className="flex items-center gap-1.5">
            <Check size={11} sw={2.1} />
            Free until you sign up
          </span>
        </div>
      </div>
    </section>
  )
}
