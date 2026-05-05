import { CTAPrimary, Eyebrow } from '@/components/marketing/atoms'

const INK = 'var(--ds-color-ink)'
const SUB = 'var(--ds-color-text-sub)'
const LINE = 'var(--ds-color-border)'
const CANVAS = 'var(--ds-color-surface-canvas)'
const ITALIC_ACCENT = '#3F3F3F'
const SIDE_NEUTRAL_BG = '#FAFAF7'

interface SideAccent {
  ink: string
  soft: string
}

const SARAH_ACCENT: SideAccent = {
  ink: 'var(--ds-color-phase-build)',
  soft: 'var(--ds-color-phase-build-soft)',
}

const MARK_ACCENT: SideAccent = {
  ink: 'var(--ds-color-phase-reconcile)',
  soft: 'var(--ds-color-phase-reconcile-soft)',
}

interface SideRow {
  k: string
  v: string
}

const SARAH_ROWS: ReadonlyArray<SideRow> = [
  { k: 'Family home', v: '£510,000' },
  { k: 'Joint savings', v: '£42,000' },
  { k: 'Aviva pension', v: '£82,400' },
  { k: 'Estimated debts', v: '£7,200' },
]

const MARK_ROWS: ReadonlyArray<SideRow> = [
  { k: 'Family home', v: '£485,000' },
  { k: 'Joint savings', v: '£42,000' },
  { k: 'Aviva pension', v: '—' },
  { k: 'Estimated debts', v: '£11,400' },
]

interface ReconciliationTag {
  text: string
  bg: string
  fg: string
}

const RECONCILIATION_TAGS: ReadonlyArray<ReconciliationTag> = [
  { text: '▲ Differs · Family home', bg: '#FEF7E7', fg: '#92400E' },
  { text: '✓ Agreed · Joint savings', bg: '#DCFCE7', fg: '#166534' },
  { text: '◇ Mark missing · Aviva pension', bg: '#EEF2FF', fg: '#4338CA' },
  { text: '▲ Differs · Debts', bg: '#FEF7E7', fg: '#92400E' },
]

interface SideProps {
  label: string
  accent: SideAccent
  items: ReadonlyArray<SideRow>
  you?: boolean
}

function Side({ label, accent, items, you = false }: SideProps) {
  return (
    <div
      style={{
        flex: 1,
        padding: '20px 18px',
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        background: you ? '#FFFFFF' : SIDE_NEUTRAL_BG,
        borderRight: you ? `1px solid ${LINE}` : 'none',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <span style={{ fontSize: 10, color: INK, fontWeight: 600 }}>{label}</span>
        <span
          style={{
            padding: '2px 7px',
            borderRadius: 999,
            background: accent.soft,
            color: accent.ink,
            fontSize: 8.5,
            fontWeight: 600,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
          }}
        >
          {you ? 'Yours' : 'Theirs'}
        </span>
      </div>
      {items.map((it) => (
        <div
          key={it.k}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '7px 9px',
            background: you ? CANVAS : '#FFFFFF',
            border: `1px solid ${LINE}`,
            borderRadius: 6,
          }}
        >
          <span style={{ fontSize: 9.5, color: INK }}>{it.k}</span>
          <span
            className="mono"
            style={{ fontSize: 9.5, color: INK, fontWeight: 500 }}
          >
            {it.v}
          </span>
        </div>
      ))}
    </div>
  )
}

export function HeroTwoColumn({ id = 'hero' }: { id?: string } = {}) {
  return (
    <section
      id={id}
      aria-labelledby="hero-two-column-h1"
      className="sec-in sec-in-1"
    >
      <div
        style={{
          padding: '44px 56px 0',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 48,
        }}
      >
        <div>
          <Eyebrow>Two pictures, finally reconciled</Eyebrow>
          <h1
            id="hero-two-column-h1"
            className="serif"
            style={{
              fontSize: 46,
              fontWeight: 600,
              letterSpacing: '-0.032em',
              lineHeight: 1.02,
              marginTop: 16,
              color: INK,
              textWrap: 'balance',
            }}
          >
            You and them.{' '}
            <span style={{ fontStyle: 'italic', color: ITALIC_ACCENT }}>One workspace.</span>
          </h1>
          <p
            className="serif italic"
            style={{
              fontSize: 15,
              lineHeight: 1.45,
              color: SUB,
              marginTop: 16,
              maxWidth: 380,
            }}
          >
            You build privately. They build privately. Decouple reconciles the
            differences in plain language.
          </p>
          <div style={{ marginTop: 26 }}>
            <CTAPrimary />
          </div>
        </div>

        <div
          style={{
            background: '#FFFFFF',
            border: `1px solid ${LINE}`,
            borderRadius: 12,
            boxShadow: '0 16px 40px rgba(0,0,0,0.06)',
            overflow: 'hidden',
            display: 'flex',
            marginTop: 4,
          }}
        >
          <Side label="Sarah" accent={SARAH_ACCENT} items={SARAH_ROWS} you />
          <Side label="Mark" accent={MARK_ACCENT} items={MARK_ROWS} />
        </div>
      </div>

      <div style={{ padding: '16px 56px 80px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            flexWrap: 'wrap',
            fontSize: 10,
            color: SUB,
          }}
        >
          {RECONCILIATION_TAGS.map((tag) => (
            <span
              key={tag.text}
              style={{
                padding: '2px 8px',
                borderRadius: 999,
                background: tag.bg,
                color: tag.fg,
                fontWeight: 600,
              }}
            >
              {tag.text}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
