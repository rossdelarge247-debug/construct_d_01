import {
  ArrowDown,
  Check,
  CTAPrimary,
  Eyebrow,
  PlaceholderTag,
  TrustBand,
} from '@/components/marketing/atoms'

const INK = 'var(--ds-color-ink)'
const SUB = 'var(--ds-color-text-sub)'
const MUTE = 'var(--ds-color-text-muted)'
const LINE = 'var(--ds-color-border)'
const CANVAS = 'var(--ds-color-surface-canvas)'

const AREAS: ReadonlyArray<readonly [string, string, string]> = [
  ['§1', 'Finances', '#4338CA'],
  ['§2', 'Children', '#9D174D'],
  ['§3', 'Housing', '#0369A1'],
  ['§4', 'Future needs', '#166534'],
]

interface OrbitCard {
  label: string
  accent: string
  x: number
  y: number
  rot: number
  w: number
  title: string
  rows: ReadonlyArray<readonly [string, string]>
}

const ORBIT_CARDS: ReadonlyArray<OrbitCard> = [
  {
    label: 'Area 01',
    accent: '#4338CA',
    x: -30,
    y: 20,
    rot: -5,
    w: 185,
    title: 'Finances',
    rows: [
      ['Assets', '£612,400'],
      ['Pensions', '£148,200'],
      ['Debts', '£42,180'],
    ],
  },
  {
    label: 'Area 02',
    accent: '#9D174D',
    x: 310,
    y: 0,
    rot: 4,
    w: 180,
    title: 'Children',
    rows: [
      ['Living', 'Shared 60/40'],
      ['Holidays', 'Alternating'],
      ['Schools', 'Continued'],
    ],
  },
  {
    label: 'Area 03',
    accent: '#0369A1',
    x: -12,
    y: 340,
    rot: 3,
    w: 175,
    title: 'Housing',
    rows: [
      ['Family home', 'Sarah stays'],
      ['Move date', '12 months'],
      ['Mortgage', 'Refinanced'],
    ],
  },
  {
    label: 'Area 04',
    accent: '#166534',
    x: 300,
    y: 360,
    rot: -3,
    w: 195,
    title: 'Future needs',
    rows: [
      ['Maintenance', '£1,200/mo · 5y'],
      ['Career restart', 'Funded'],
      ['Pension share', '32%'],
    ],
  },
]

function HeroComposition() {
  return (
    <div className="relative" style={{ height: 560 }}>
      <div className="absolute" style={{ right: 0, top: -10 }}>
        <PlaceholderTag>EDITORIAL · not a literal screenshot</PlaceholderTag>
      </div>

      {/* Central document spine */}
      <div
        className="absolute"
        style={{
          left: '50%',
          top: 60,
          transform: 'translateX(-50%)',
          width: 220,
          height: 460,
          background: '#FFFFFF',
          border: `1px solid ${LINE}`,
          borderRadius: 12,
          boxShadow:
            '0 18px 42px rgba(26, 26, 26, 0.07), 0 2px 6px rgba(26, 26, 26, 0.04)',
        }}
      >
        <div className="px-5 pt-6">
          <div className="label-xs" style={{ color: MUTE, fontSize: 9.5 }}>
            One document
          </div>
          <div
            className="serif"
            style={{
              fontSize: 17,
              fontWeight: 600,
              lineHeight: 1.2,
              letterSpacing: '-0.01em',
              marginTop: 6,
            }}
          >
            The Settlement
          </div>
          <div
            className="serif"
            style={{
              fontSize: 12.5,
              color: SUB,
              fontStyle: 'italic',
              marginTop: 4,
            }}
          >
            covering all four areas
          </div>
        </div>

        <div className="mx-5 mt-5 space-y-2.5">
          {AREAS.map(([n, t, c]) => (
            <div
              key={t}
              className="flex items-center gap-2.5 py-1.5 px-2 rounded-md"
              style={{ background: CANVAS, border: `1px solid ${LINE}` }}
            >
              <span
                className="mono"
                style={{ fontSize: 10, color: c, fontWeight: 600 }}
              >
                {n}
              </span>
              <span style={{ fontSize: 12, color: INK, flex: 1 }}>{t}</span>
              <Check size={11} sw={2.4} style={{ color: c }} />
            </div>
          ))}
        </div>

        <div
          className="mx-5 mt-5 pt-4"
          style={{ borderTop: `1px solid ${LINE}` }}
        >
          <div
            className="flex items-center justify-between"
            style={{ fontSize: 10.5, color: MUTE }}
          >
            <span>Court-ready</span>
            <span className="mono">v1 · draft</span>
          </div>
          <div className="mt-3 flex items-center gap-1.5">
            {Array.from({ length: 14 }).map((_, i) => (
              <span
                key={i}
                style={{
                  flex: 1,
                  height: 3,
                  borderRadius: 2,
                  background: i < 9 ? INK : 'var(--ds-color-border)',
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Four orbiting cards */}
      {ORBIT_CARDS.map((card) => (
        <div
          key={card.label}
          className="absolute"
          style={{
            left: card.x,
            top: card.y,
            width: card.w,
            transform: `rotate(${card.rot}deg)`,
          }}
        >
          <div
            className="rounded-xl"
            style={{
              background: '#FFFFFF',
              border: `1px solid ${LINE}`,
              boxShadow:
                '0 12px 28px rgba(26, 26, 26, 0.06), 0 2px 6px rgba(26, 26, 26, 0.04)',
              padding: 14,
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <span
                style={{
                  display: 'inline-block',
                  width: 7,
                  height: 7,
                  borderRadius: 99,
                  background: card.accent,
                }}
              />
              <span
                className="label-xs"
                style={{ color: MUTE, fontSize: 9.5 }}
              >
                {card.label}
              </span>
            </div>
            <div
              className="serif"
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: INK,
                lineHeight: 1.25,
              }}
            >
              {card.title}
            </div>
            <div className="mt-2 space-y-1.5">
              {card.rows.map(([k, v]) => (
                <div
                  key={k}
                  className="flex items-center justify-between"
                  style={{ fontSize: 11, color: SUB }}
                >
                  <span>{k}</span>
                  <span
                    className="mono tabular"
                    style={{ color: INK, fontSize: 10.5 }}
                  >
                    {v}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export function HeroEditorial() {
  return (
    <section
      id="hero"
      aria-labelledby="hero-h"
      data-marketing-section="hero"
      className="relative"
      style={{ paddingTop: 72, paddingBottom: 96 }}
    >
      <div
        className="mx-auto px-8 grid gap-x-12"
        style={{
          maxWidth: 1240,
          gridTemplateColumns: 'minmax(0, 1.05fr) minmax(0, 0.95fr)',
        }}
      >
        {/* Left column: copy */}
        <div className="sec-in sec-in-1" style={{ paddingTop: 12 }}>
          <Eyebrow>The complete settlement workspace for separating couples</Eyebrow>
          <h1
            id="hero-h"
            className="serif"
            style={{
              fontSize: 76,
              fontWeight: 600,
              letterSpacing: '-0.035em',
              lineHeight: 1.02,
              color: INK,
              textWrap: 'balance',
              marginTop: 28,
            }}
          >
            Sort out your<br />
            complete separation —{' '}
            <span style={{ fontStyle: 'italic', color: '#3F3F3F' }}>
              together
            </span>
            .
          </h1>
          <p
            className="serif"
            style={{
              fontSize: 23,
              lineHeight: 1.45,
              fontStyle: 'italic',
              color: SUB,
              maxWidth: 560,
              fontWeight: 400,
              letterSpacing: '-0.005em',
              marginTop: 28,
            }}
          >
            Sort out finances, children, housing — all of it — for under £1,000
            and in 3 months. Instead of £15,000 and 18 months.
          </p>
          <div className="mt-10 flex items-end gap-7 flex-wrap">
            <CTAPrimary />
            <a
              href="#journey"
              className="inline-flex items-center gap-1.5 pb-1"
              style={{
                fontSize: 14,
                color: INK,
                borderBottom: `1px solid ${INK}`,
                marginBottom: 8,
              }}
            >
              How it works
              <ArrowDown size={14} />
            </a>
          </div>
          <div
            className="mt-12 pt-7"
            style={{ borderTop: `1px solid ${LINE}`, maxWidth: 620 }}
          >
            <TrustBand />
          </div>
        </div>

        {/* Right column: editorial composition */}
        <div className="sec-in sec-in-2 relative" style={{ paddingTop: 30 }}>
          <HeroComposition />
        </div>
      </div>
    </section>
  )
}
