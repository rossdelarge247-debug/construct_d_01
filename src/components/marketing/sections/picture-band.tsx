import { Eyebrow, Coins, ChildrenIcon, Home, Compass } from '@/components/marketing/atoms'

const INK = 'var(--ds-color-ink)'
const SUB = 'var(--ds-color-text-sub)'
const LINE = 'var(--ds-color-border)'
const PANEL = 'var(--ds-color-surface-panel)'
const CANVAS = 'var(--ds-color-surface-canvas)'

interface PillarCard {
  Icon: (p: { size?: number; sw?: number }) => React.JSX.Element
  label: string
  copy: string
}

const PILLARS: ReadonlyArray<PillarCard> = [
  {
    Icon: Coins,
    label: 'Finances',
    copy: 'Assets, debts, pensions, income, spending — auto-populated from your bank.',
  },
  {
    Icon: ChildrenIcon,
    label: 'Children',
    copy: 'Living arrangements, contact, holidays, schools — central, not a footnote.',
  },
  {
    Icon: Home,
    label: 'Housing',
    copy: 'Who stays, who leaves, when. Interim arrangements. Future housing affordability.',
  },
  {
    Icon: Compass,
    label: 'Future needs',
    copy: 'Post-separation budgets. Career restart. Pension implications. Maintenance.',
  },
]

export function PictureBand() {
  return (
    <section
      id="picture"
      aria-labelledby="picture-h"
      data-marketing-section="picture"
      style={{
        paddingTop: 96,
        paddingBottom: 96,
        background: PANEL,
        borderTop: `1px solid ${LINE}`,
        borderBottom: `1px solid ${LINE}`,
      }}
    >
      <div className="mx-auto px-8" style={{ maxWidth: 1240 }}>
        <div className="sec-in sec-in-1">
          <Eyebrow>The complete picture</Eyebrow>
          <h2
            id="picture-h"
            className="serif"
            style={{
              fontSize: 40,
              fontWeight: 600,
              letterSpacing: '-0.022em',
              lineHeight: 1.1,
              maxWidth: 820,
              textWrap: 'balance',
              marginTop: 16,
              color: INK,
            }}
          >
            A divorce settlement covers four interdependent areas.{' '}
            <span style={{ fontStyle: 'italic', color: SUB }}>
              Decouple covers all of them.
            </span>
          </h2>
        </div>

        <div
          className="mt-14 grid gap-5"
          style={{ gridTemplateColumns: 'repeat(4, minmax(0, 1fr))' }}
        >
          {PILLARS.map(({ Icon, label, copy }, i) => (
            <div
              key={label}
              className={'sec-in sec-in-' + Math.min(i + 1, 4)}
              style={{
                background: CANVAS,
                border: `1px solid ${LINE}`,
                borderRadius: 14,
                padding: '26px 24px 28px',
              }}
            >
              <div
                className="flex items-center justify-center"
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 9,
                  background: '#FFFFFF',
                  border: `1px solid ${LINE}`,
                  color: INK,
                }}
              >
                <Icon size={17} sw={1.6} />
              </div>
              <div
                className="serif"
                style={{
                  fontSize: 22,
                  fontWeight: 600,
                  letterSpacing: '-0.015em',
                  color: INK,
                  marginTop: 20,
                }}
              >
                {label}
              </div>
              <p
                style={{
                  fontSize: 13.5,
                  lineHeight: 1.55,
                  color: SUB,
                  marginTop: 12,
                }}
              >
                {copy}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
