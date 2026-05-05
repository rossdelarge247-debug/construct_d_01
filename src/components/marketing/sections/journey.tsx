import { Eyebrow } from '@/components/marketing/atoms'

const INK = 'var(--ds-color-ink)'
const SUB = 'var(--ds-color-text-sub)'
const MUTE = 'var(--ds-color-text-muted)'
const LINE = 'var(--ds-color-border)'
const PANEL = 'var(--ds-color-surface-panel)'

const PHASE = {
  start: { ink: '#1A1A1A', soft: '#F5F3EE', num: '#78716C' },
  build: { ink: '#4338CA', soft: '#EEF2FF', num: '#4338CA' },
  reconcile: { ink: '#9D174D', soft: '#FCE7F3', num: '#9D174D' },
  settle: { ink: '#0369A1', soft: '#E0F2FE', num: '#0369A1' },
  finalise: { ink: '#166534', soft: '#DCFCE7', num: '#166534' },
} as const

interface PhaseCard {
  n: string
  k: string
  accent: typeof PHASE[keyof typeof PHASE]
  doc: string
  copy: string
}

const PHASES: ReadonlyArray<PhaseCard> = [
  {
    n: '1',
    k: 'Start',
    accent: PHASE.start,
    doc: 'Free orientation',
    copy: 'Free 3-minute orientation. We surface your likely journey. AI plan you can keep — whether you go further or not.',
  },
  {
    n: '2',
    k: 'Build',
    accent: PHASE.build,
    doc: "Sarah's Picture",
    copy: 'Connect your bank, confirm what we found, fill 3–4 specific gaps. Your private financial side of the settlement.',
  },
  {
    n: '3',
    k: 'Reconcile',
    accent: PHASE.reconcile,
    doc: 'Our Household Picture',
    copy: 'Invite your ex. Compare side-by-side. Resolve differences, one card at a time.',
  },
  {
    n: '4',
    k: 'Settle',
    accent: PHASE.settle,
    doc: 'The Settlement Proposal',
    copy: 'Build proposals covering finances, children, housing, future. AI coach checks fairness. Counter or accept.',
  },
  {
    n: '5',
    k: 'Finalise',
    accent: PHASE.finalise,
    doc: 'Court-ready package',
    copy: 'Consent order, D81, pension annex auto-generated. Submit direct or via solicitor. We track judicial review.',
  },
]

export function Journey() {
  return (
    <section
      id="journey"
      aria-labelledby="journey-h"
      data-marketing-section="journey"
      style={{ paddingTop: 100, paddingBottom: 96 }}
    >
      <div className="mx-auto px-8" style={{ maxWidth: 1240 }}>
        <div className="sec-in sec-in-1" style={{ maxWidth: 880 }}>
          <Eyebrow>How it works</Eyebrow>
          <h2
            id="journey-h"
            className="serif"
            style={{
              fontSize: 40,
              fontWeight: 600,
              letterSpacing: '-0.022em',
              lineHeight: 1.1,
              textWrap: 'balance',
              marginTop: 16,
              color: INK,
            }}
          >
            One workspace. Four documents.{' '}
            <span style={{ fontStyle: 'italic', color: SUB }}>
              Five phases — from first question to court-sealed agreement.
            </span>
          </h2>
        </div>

        <div
          className="mt-14 grid gap-4"
          style={{ gridTemplateColumns: 'repeat(5, minmax(0, 1fr))' }}
        >
          {PHASES.map((p, i) => (
            <article
              key={p.k}
              className={'sec-in sec-in-' + Math.min(i + 1, 4)}
              style={{
                background: PANEL,
                border: `1px solid ${LINE}`,
                borderRadius: 14,
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div
                style={{
                  background: p.accent.soft,
                  padding: '18px 18px 16px',
                  borderBottom: `1px solid ${LINE}`,
                }}
              >
                <div className="flex items-center justify-between">
                  <span
                    className="inline-flex items-center gap-2 rounded-full"
                    style={{
                      background: '#FFFFFF',
                      padding: '3px 10px 3px 4px',
                      border: `1px solid ${LINE}`,
                    }}
                  >
                    <span
                      className="inline-flex items-center justify-center"
                      style={{
                        width: 18,
                        height: 18,
                        borderRadius: 99,
                        background: p.accent.num,
                        color: '#FFFFFF',
                        fontSize: 10.5,
                        fontWeight: 700,
                      }}
                    >
                      {p.n}
                    </span>
                    <span
                      className="label-xs"
                      style={{ color: p.accent.ink, fontSize: 9.5 }}
                    >
                      {p.k}
                    </span>
                  </span>
                </div>
                <div
                  className="serif"
                  style={{
                    fontSize: 30,
                    fontWeight: 600,
                    lineHeight: 1,
                    letterSpacing: '-0.025em',
                    color: p.accent.ink,
                    marginTop: 28,
                  }}
                >
                  {p.n}
                </div>
                <div
                  className="serif"
                  style={{
                    fontSize: 14,
                    color: INK,
                    lineHeight: 1.3,
                    fontStyle: 'italic',
                    marginTop: 8,
                  }}
                >
                  {p.doc}
                </div>
              </div>
              <div style={{ padding: '16px 18px 20px', flex: 1 }}>
                <p style={{ fontSize: 12.5, lineHeight: 1.55, color: SUB }}>
                  {p.copy}
                </p>
              </div>
            </article>
          ))}
        </div>

        <div
          className="mt-10 flex items-center justify-center gap-2"
          style={{ color: MUTE }}
        >
          <span style={{ fontSize: 12 }}>
            Free up to your AI plan in phase 1.
          </span>
          <span style={{ fontSize: 12 }}>Press</span>
          <span className="kbd">→</span>
          <span style={{ fontSize: 12 }}>to walk through each phase.</span>
        </div>
      </div>
    </section>
  )
}
