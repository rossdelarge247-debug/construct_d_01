'use client';

import { useState } from 'react';
import Link from 'next/link';
import { tokens } from '@/styles/tokens';

/* Phase tints — used only where we reference the phases themselves */
const PHASE = {
  start:     { ink: '#1A1A1A', soft: '#F5F3EE', num: '#78716C' },
  build:     { ink: '#4338CA', soft: '#EEF2FF', num: '#4338CA' },
  reconcile: { ink: '#9D174D', soft: '#FCE7F3', num: '#9D174D' },
  settle:    { ink: '#0369A1', soft: '#E0F2FE', num: '#0369A1' },
  finalise:  { ink: '#166534', soft: '#DCFCE7', num: '#166534' },
} as const;

type IcProps = {
  children: React.ReactNode;
  size?: number;
  sw?: number;
  style?: React.CSSProperties;
};

function Ic({ children, size = 16, sw = 1.75, style }: IcProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={sw}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={style}
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

type IconProps = { size?: number; sw?: number; style?: React.CSSProperties };

const ArrowRight = (p: IconProps) => (
  <Ic {...p}>
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="13 6 19 12 13 18" />
  </Ic>
);
const ArrowDown = (p: IconProps) => (
  <Ic {...p}>
    <line x1="12" y1="5" x2="12" y2="19" />
    <polyline points="6 13 12 19 18 13" />
  </Ic>
);
const Plus = (p: IconProps) => (
  <Ic {...p}>
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </Ic>
);
const Shield = (p: IconProps) => (
  <Ic {...p}>
    <path d="M12 3l8 3v6c0 5-3.5 8.5-8 9-4.5-.5-8-4-8-9V6z" />
  </Ic>
);
const Lock = (p: IconProps) => (
  <Ic {...p}>
    <rect x="4" y="11" width="16" height="10" rx="2" />
    <path d="M8 11V7a4 4 0 0 1 8 0v4" />
  </Ic>
);
const Check = (p: IconProps) => (
  <Ic {...p}>
    <polyline points="5 12 10 17 19 7" />
  </Ic>
);
const Coins = (p: IconProps) => (
  <Ic {...p}>
    <circle cx="9" cy="9" r="6" />
    <path d="M15 8a6 6 0 1 1 0 8" />
  </Ic>
);
const Children = (p: IconProps) => (
  <Ic {...p}>
    <circle cx="12" cy="6" r="2.5" />
    <path d="M7 22v-7l-2-3 4-3 3 3 3-3 4 3-2 3v7" />
  </Ic>
);
const Home = (p: IconProps) => (
  <Ic {...p}>
    <path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z" />
  </Ic>
);
const Compass = (p: IconProps) => (
  <Ic {...p}>
    <circle cx="12" cy="12" r="9" />
    <polygon points="15 9 11 13 9 15 13 11" />
  </Ic>
);
const ArrowUpRight = (p: IconProps) => (
  <Ic {...p}>
    <line x1="7" y1="17" x2="17" y2="7" />
    <polyline points="9 7 17 7 17 15" />
  </Ic>
);

function Wordmark({ size = 18 }: { size?: number }) {
  return (
    <div className="flex items-center gap-2 select-none" aria-label="Decouple">
      <div className="relative" style={{ width: size + 4, height: size + 4 }} aria-hidden>
        <div className="absolute inset-0 rounded-full" style={{ background: '#111' }} />
        <div
          className="absolute rounded-full"
          style={{ left: '42%', top: 0, width: '58%', height: '100%', background: tokens.color.surface.page }}
        />
        <div
          className="absolute rounded-full"
          style={{ left: '45%', top: '12%', width: '10%', height: '76%', background: '#111' }}
        />
      </div>
      <span style={{ fontSize: size, letterSpacing: '-0.01em', fontWeight: 600, color: '#111' }}>
        Decouple.
      </span>
    </div>
  );
}

type CTAPrimaryProps = {
  label?: string;
  time?: string;
  href?: string;
  size?: 'lg' | 'md';
  inverse?: boolean;
};

function CTAPrimary({
  label = 'Start your free plan',
  time = '~3 minutes · no account needed',
  href = '#start',
  size = 'lg',
  inverse = false,
}: CTAPrimaryProps) {
  const padY = size === 'lg' ? 16 : 12;
  const padX = size === 'lg' ? 26 : 20;
  const fs = size === 'lg' ? 15 : 13.5;
  return (
    <div className="inline-flex flex-col items-start gap-2">
      <a
        href={href}
        className="cta-primary inline-flex items-center gap-2.5 rounded-full font-medium"
        style={{
          padding: `${padY}px ${padX}px`,
          background: inverse ? tokens.color.surface.panel : tokens.color.ink,
          color: inverse ? tokens.color.ink : tokens.color.surface.panel,
          border: `1px solid ${tokens.color.ink}`,
          fontSize: fs,
          letterSpacing: '-0.005em',
        }}
      >
        {label}
        <ArrowRight size={fs + 2} sw={2} />
      </a>
      <div className="flex items-center gap-2 pl-1" style={{ color: tokens.color.text.muted }}>
        <span className="mono tabular" style={{ fontSize: 11, letterSpacing: '0.02em' }}>
          {time}
        </span>
        <span className="kbd" style={{ marginLeft: 4 }}>
          ↵
        </span>
      </div>
    </div>
  );
}

function TrustBand() {
  return (
    <div
      className="flex items-center justify-center gap-x-5 gap-y-2 flex-wrap text-[12.5px]"
      style={{ color: tokens.color.text.sub }}
    >
      <span className="flex items-center gap-2">
        <Shield size={13} sw={1.8} style={{ color: tokens.color.text.muted }} />
        FCA-regulated bank connection via TrueLayer
      </span>
      <span
        style={{ width: 3, height: 3, borderRadius: 99, background: '#D6D3CC' }}
        aria-hidden
      />
      <span className="flex items-center gap-2">
        <Lock size={13} sw={1.8} style={{ color: tokens.color.text.muted }} />
        Read-only · we can&apos;t move money
      </span>
      <span
        style={{ width: 3, height: 3, borderRadius: 99, background: '#D6D3CC' }}
        aria-hidden
      />
      <span className="flex items-center gap-2" style={{ color: tokens.color.ink, fontWeight: 500 }}>
        <Check size={13} sw={2.1} style={{ color: '#166534' }} />
        Free until you choose to sign up
      </span>
    </div>
  );
}

function Eyebrow({
  children,
  color = tokens.color.text.muted,
}: {
  children: React.ReactNode;
  color?: string;
}) {
  return (
    <div className="label-xs" style={{ color }}>
      {children}
    </div>
  );
}

function PlaceholderTag({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="mono"
      style={{
        fontSize: 10.5,
        letterSpacing: '0.04em',
        color: tokens.color.text.muted,
        background: 'rgba(255,255,255,0.85)',
        padding: '3px 7px',
        borderRadius: 4,
        border: `1px solid ${tokens.color.border}`,
      }}
    >
      {children}
    </span>
  );
}

function Header() {
  return (
    <header
      role="banner"
      className="sticky top-0 z-40 transition-all duration-200 ease-out"
      style={{
        height: 78,
        background: 'rgba(245,245,244,0.92)',
        backdropFilter: 'blur(14px)',
        borderBottom: '1px solid transparent',
      }}
    >
      <div className="mx-auto h-full px-8 flex items-center justify-between" style={{ maxWidth: 1240 }}>
        <a href="#top" className="flex items-center gap-2">
          <Wordmark size={17} />
        </a>

        <nav
          aria-label="Primary"
          className="hidden md:flex items-center gap-7"
          style={{ fontSize: 13.5, color: tokens.color.text.sub }}
        >
          <a href="#picture" className="hover:text-[#1A1A1A]">
            The picture
          </a>
          <a href="#journey" className="hover:text-[#1A1A1A]">
            How it works
          </a>
          <a href="#compare" className="hover:text-[#1A1A1A]">
            Why us
          </a>
          <Link href="/dev/proto/pricing" className="hover:text-[#1A1A1A]">
            Pricing
          </Link>
        </nav>

        <div className="flex items-center gap-5">
          {/* TODO(journey): route to /dev/proto/sign-in once that surface ships. */}
          <a href="#signin" className="text-[13.5px]" style={{ color: tokens.color.text.sub }}>
            Sign in
          </a>
          <Link
            href="/dev/proto/pre-signup-interview"
            className="cta-primary inline-flex items-center gap-2 rounded-full font-medium"
            style={{
              padding: '10px 18px',
              background: tokens.color.ink,
              color: '#FFF',
              fontSize: 13,
              border: `1px solid ${tokens.color.ink}`,
            }}
          >
            Start your free plan
            <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section
      id="hero"
      aria-labelledby="hero-h"
      className="relative"
      style={{ paddingTop: 72, paddingBottom: 96 }}
    >
      <div
        className="mx-auto px-8 grid gap-x-12"
        style={{ maxWidth: 1240, gridTemplateColumns: 'minmax(0, 1.05fr) minmax(0, 0.95fr)' }}
      >
        {/* LEFT: copy */}
        <div className="sec-in sec-in-1" style={{ paddingTop: 12 }}>
          <Eyebrow>The complete settlement workspace for separating couples</Eyebrow>

          <h1
            id="hero-h"
            className="serif mt-7"
            style={{
              fontSize: 76,
              fontWeight: 600,
              letterSpacing: '-0.035em',
              lineHeight: 1.02,
              color: tokens.color.ink,
              textWrap: 'balance',
            }}
          >
            Sort out your
            <br />
            complete separation —{' '}
            <span style={{ fontStyle: 'italic', color: '#3F3F3F' }}>together</span>.
          </h1>

          <p
            className="serif mt-7"
            style={{
              fontSize: 23,
              lineHeight: 1.45,
              fontStyle: 'italic',
              color: tokens.color.text.sub,
              maxWidth: 560,
              fontWeight: 400,
              letterSpacing: '-0.005em',
            }}
          >
            Sort out finances, children, housing — all of it — for under £1,000 and in 3 months.
            Instead of £15,000 and 18 months.
          </p>

          <div className="mt-10 flex items-end gap-7 flex-wrap">
            <CTAPrimary />
            <a
              href="#journey"
              className="inline-flex items-center gap-1.5 pb-1"
              style={{
                fontSize: 14,
                color: tokens.color.ink,
                borderBottom: `1px solid ${tokens.color.ink}`,
                marginBottom: 8,
              }}
            >
              How it works
              <ArrowDown size={14} />
            </a>
          </div>

          <div
            className="mt-12 pt-7"
            style={{ borderTop: `1px solid ${tokens.color.border}`, maxWidth: 620 }}
          >
            <TrustBand />
          </div>
        </div>

        {/* RIGHT: editorial product preview, offset right */}
        <div className="sec-in sec-in-2 relative" style={{ paddingTop: 30 }}>
          <HeroComposition />
        </div>
      </div>
    </section>
  );
}

type CardProps = {
  label: string;
  sub: { title: string; rows: [string, string][] };
  x: number;
  y: number;
  rot: number;
  w?: number;
  accent: string;
};

const Card = ({ label, sub, x, y, rot, w = 180, accent }: CardProps) => (
  <div className="absolute" style={{ left: x, top: y, width: w, transform: `rotate(${rot}deg)` }}>
    <div
      className="rounded-xl bg-white"
      style={{
        border: `1px solid ${tokens.color.border}`,
        boxShadow: '0 12px 28px rgba(26,26,26,0.06), 0 2px 6px rgba(26,26,26,0.04)',
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
            background: accent,
          }}
        />
        <span className="label-xs" style={{ color: tokens.color.text.muted, fontSize: 9.5 }}>
          {label}
        </span>
      </div>
      <div
        className="serif"
        style={{ fontSize: 14, fontWeight: 600, color: tokens.color.ink, lineHeight: 1.25 }}
      >
        {sub.title}
      </div>
      <div className="mt-2 space-y-1.5">
        {sub.rows.map((r, i) => (
          <div
            key={i}
            className="flex items-center justify-between"
            style={{ fontSize: 11, color: tokens.color.text.sub }}
          >
            <span>{r[0]}</span>
            <span className="mono tabular" style={{ color: tokens.color.ink, fontSize: 10.5 }}>
              {r[1]}
            </span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

function HeroComposition() {
  return (
    <div className="relative" style={{ height: 560 }}>
      {/* annotation */}
      <div className="absolute" style={{ right: 0, top: -10 }}>
        <PlaceholderTag>EDITORIAL · not a literal screenshot</PlaceholderTag>
      </div>

      {/* central document spine */}
      <div
        className="absolute"
        style={{
          left: '50%',
          top: 60,
          transform: 'translateX(-50%)',
          width: 220,
          height: 460,
          background: tokens.color.surface.panel,
          border: `1px solid ${tokens.color.border}`,
          borderRadius: 12,
          boxShadow: '0 18px 42px rgba(26,26,26,0.07), 0 2px 6px rgba(26,26,26,0.04)',
        }}
      >
        <div className="px-5 pt-6">
          <div className="label-xs" style={{ color: tokens.color.text.muted, fontSize: 9.5 }}>
            One document
          </div>
          <div
            className="serif mt-1.5"
            style={{ fontSize: 17, fontWeight: 600, lineHeight: 1.2, letterSpacing: '-0.01em' }}
          >
            The Settlement
          </div>
          <div className="serif italic mt-1" style={{ fontSize: 12.5, color: tokens.color.text.sub }}>
            covering all four areas
          </div>
        </div>

        <div className="mx-5 mt-5 space-y-2.5">
          {(
            [
              ['§1', 'Finances', '#4338CA'],
              ['§2', 'Children', '#9D174D'],
              ['§3', 'Housing', '#0369A1'],
              ['§4', 'Future needs', '#166534'],
            ] as const
          ).map(([n, t, c]) => (
            <div
              key={t}
              className="flex items-center gap-2.5 py-1.5 px-2 rounded-md"
              style={{ background: tokens.color.surface.canvas, border: `1px solid ${tokens.color.border}` }}
            >
              <span className="mono" style={{ fontSize: 10, color: c, fontWeight: 600 }}>
                {n}
              </span>
              <span style={{ fontSize: 12, color: tokens.color.ink, flex: 1 }}>{t}</span>
              <Check size={11} sw={2.4} style={{ color: c }} />
            </div>
          ))}
        </div>

        <div
          className="mx-5 mt-5 pt-4"
          style={{ borderTop: `1px solid ${tokens.color.border}` }}
        >
          <div
            className="flex items-center justify-between"
            style={{ fontSize: 10.5, color: tokens.color.text.muted }}
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
                  background: i < 9 ? tokens.color.ink : tokens.color.border,
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* four interdependent cards orbiting */}
      <Card
        label="Area 01"
        accent="#4338CA"
        x={-30}
        y={20}
        rot={-5}
        w={185}
        sub={{
          title: 'Finances',
          rows: [
            ['Assets', '£612,400'],
            ['Pensions', '£148,200'],
            ['Debts', '£42,180'],
          ],
        }}
      />
      <Card
        label="Area 02"
        accent="#9D174D"
        x={310}
        y={0}
        rot={4}
        w={180}
        sub={{
          title: 'Children',
          rows: [
            ['Living', 'Shared 60/40'],
            ['Holidays', 'Alternating'],
            ['Schools', 'Continued'],
          ],
        }}
      />
      <Card
        label="Area 03"
        accent="#0369A1"
        x={-12}
        y={340}
        rot={3}
        w={175}
        sub={{
          title: 'Housing',
          rows: [
            ['Family home', 'Sarah stays'],
            ['Move date', '12 months'],
            ['Mortgage', 'Refinanced'],
          ],
        }}
      />
      <Card
        label="Area 04"
        accent="#166534"
        x={300}
        y={360}
        rot={-3}
        w={195}
        sub={{
          title: 'Future needs',
          rows: [
            ['Maintenance', '£1,200/mo · 5y'],
            ['Career restart', 'Funded'],
            ['Pension share', '32%'],
          ],
        }}
      />

      {/* faint connection lines */}
      <svg
        className="absolute inset-0 pointer-events-none"
        width="100%"
        height="100%"
        aria-hidden
      >
        <defs>
          <pattern id="dots" width="2" height="2" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="0.5" fill="#A8A29E" />
          </pattern>
        </defs>
      </svg>
    </div>
  );
}

function PictureBand() {
  const cards = [
    {
      icon: Coins,
      label: 'Finances',
      copy: 'Assets, debts, pensions, income, spending — auto-populated from your bank.',
    },
    {
      icon: Children,
      label: 'Children',
      copy: 'Living arrangements, contact, holidays, schools — central, not a footnote.',
    },
    {
      icon: Home,
      label: 'Housing',
      copy: 'Who stays, who leaves, when. Interim arrangements. Future housing affordability.',
    },
    {
      icon: Compass,
      label: 'Future needs',
      copy: 'Post-separation budgets. Career restart. Pension implications. Maintenance.',
    },
  ];
  return (
    <section
      id="picture"
      aria-labelledby="picture-h"
      style={{
        paddingTop: 96,
        paddingBottom: 96,
        background: tokens.color.surface.panel,
        borderTop: `1px solid ${tokens.color.border}`,
        borderBottom: `1px solid ${tokens.color.border}`,
      }}
    >
      <div className="mx-auto px-8" style={{ maxWidth: 1240 }}>
        <div className="sec-in sec-in-1">
          <Eyebrow>The complete picture</Eyebrow>
          <h2
            id="picture-h"
            className="serif mt-4"
            style={{
              fontSize: 40,
              fontWeight: 600,
              letterSpacing: '-0.022em',
              lineHeight: 1.1,
              maxWidth: 820,
              textWrap: 'balance',
            }}
          >
            A divorce settlement covers four interdependent areas.{' '}
            <span style={{ fontStyle: 'italic', color: tokens.color.text.sub }}>
              Decouple covers all of them.
            </span>
          </h2>
        </div>

        <div
          className="mt-14 grid gap-5"
          style={{ gridTemplateColumns: 'repeat(4, minmax(0, 1fr))' }}
        >
          {cards.map((c, i) => {
            const Icon = c.icon;
            return (
              <div
                key={c.label}
                className={'sec-in sec-in-' + Math.min(i + 1, 4)}
                style={{
                  background: tokens.color.surface.canvas,
                  border: `1px solid ${tokens.color.border}`,
                  borderRadius: 14,
                  padding: '26px 24px 28px',
                  boxShadow: '0 1px 0 rgba(26,26,26,0.02)',
                }}
              >
                <div
                  className="flex items-center justify-center"
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 9,
                    background: tokens.color.surface.panel,
                    border: `1px solid ${tokens.color.border}`,
                    color: tokens.color.ink,
                  }}
                >
                  <Icon size={17} sw={1.6} />
                </div>
                <div
                  className="serif mt-5"
                  style={{
                    fontSize: 22,
                    fontWeight: 600,
                    letterSpacing: '-0.015em',
                    color: tokens.color.ink,
                  }}
                >
                  {c.label}
                </div>
                <p
                  className="mt-3"
                  style={{ fontSize: 13.5, lineHeight: 1.55, color: tokens.color.text.sub }}
                >
                  {c.copy}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function JourneyBand() {
  const phases = [
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
  ];
  return (
    <section
      id="journey"
      aria-labelledby="journey-h"
      style={{ paddingTop: 100, paddingBottom: 96 }}
    >
      <div className="mx-auto px-8" style={{ maxWidth: 1240 }}>
        <div className="sec-in sec-in-1" style={{ maxWidth: 880 }}>
          <Eyebrow>How it works</Eyebrow>
          <h2
            id="journey-h"
            className="serif mt-4"
            style={{
              fontSize: 40,
              fontWeight: 600,
              letterSpacing: '-0.022em',
              lineHeight: 1.1,
              textWrap: 'balance',
            }}
          >
            One workspace. Four documents.{' '}
            <span style={{ fontStyle: 'italic', color: tokens.color.text.sub }}>
              Five phases — from first question to court-sealed agreement.
            </span>
          </h2>
        </div>

        <div className="mt-14 grid gap-4" style={{ gridTemplateColumns: 'repeat(5, minmax(0, 1fr))' }}>
          {phases.map((p, i) => (
            <article
              key={p.k}
              className={'sec-in sec-in-' + Math.min(i + 1, 4)}
              style={{
                background: tokens.color.surface.panel,
                border: `1px solid ${tokens.color.border}`,
                borderRadius: 14,
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {/* tinted top — colour wash */}
              <div
                style={{
                  background: p.accent.soft,
                  padding: '18px 18px 16px',
                  borderBottom: `1px solid ${tokens.color.border}`,
                }}
              >
                <div className="flex items-center justify-between">
                  <span
                    className="inline-flex items-center gap-2 rounded-full"
                    style={{
                      background: tokens.color.surface.panel,
                      padding: '3px 10px 3px 4px',
                      border: `1px solid ${tokens.color.border}`,
                    }}
                  >
                    <span
                      className="inline-flex items-center justify-center"
                      style={{
                        width: 18,
                        height: 18,
                        borderRadius: 99,
                        background: p.accent.num,
                        color: tokens.color.surface.panel,
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
                  className="serif mt-7"
                  style={{
                    fontSize: 30,
                    fontWeight: 600,
                    lineHeight: 1,
                    letterSpacing: '-0.025em',
                    color: p.accent.ink,
                  }}
                >
                  {p.n}
                </div>
                <div
                  className="serif italic mt-2"
                  style={{ fontSize: 14, color: tokens.color.ink, lineHeight: 1.3 }}
                >
                  {p.doc}
                </div>
              </div>

              {/* body */}
              <div style={{ padding: '16px 18px 20px', flex: 1 }}>
                <p style={{ fontSize: 12.5, lineHeight: 1.55, color: tokens.color.text.sub }}>
                  {p.copy}
                </p>
              </div>
            </article>
          ))}
        </div>

        {/* Subtle keyboard affordance */}
        <div className="mt-10 flex items-center justify-center gap-2" style={{ color: tokens.color.text.muted }}>
          <span style={{ fontSize: 12 }}>Free up to your AI plan in phase 1.</span>
          <span style={{ fontSize: 12 }}>Press</span>
          <span className="kbd">→</span>
          <span style={{ fontSize: 12 }}>to walk through each phase.</span>
        </div>
      </div>
    </section>
  );
}

function CompareBand() {
  return (
    <section
      id="compare"
      aria-labelledby="compare-h"
      style={{
        paddingTop: 100,
        paddingBottom: 100,
        background: tokens.color.surface.panel,
        borderTop: `1px solid ${tokens.color.border}`,
        borderBottom: `1px solid ${tokens.color.border}`,
      }}
    >
      <div className="mx-auto px-8" style={{ maxWidth: 1240 }}>
        <div className="sec-in sec-in-1" style={{ maxWidth: 820 }}>
          <Eyebrow>Why us</Eyebrow>
          <h2
            id="compare-h"
            className="serif mt-4"
            style={{
              fontSize: 40,
              fontWeight: 600,
              letterSpacing: '-0.022em',
              lineHeight: 1.1,
              textWrap: 'balance',
            }}
          >
            Built to replace the{' '}
            <span style={{ fontStyle: 'italic' }}>£14,561</span> solicitor-led divorce.
          </h2>
        </div>

        <div className="mt-14 grid gap-6" style={{ gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
          {/* Conventional */}
          <div
            className="sec-in sec-in-2"
            aria-label="Conventional path: £14,561 average, 18 months, 20+ hours of paperwork, two solicitors"
            style={{
              background: tokens.color.surface.canvas,
              border: `1px solid ${tokens.color.border}`,
              borderRadius: 14,
              padding: '32px 32px 28px',
            }}
          >
            <Eyebrow color={tokens.color.text.muted}>Conventional path</Eyebrow>
            <div
              className="serif mt-3"
              style={{
                fontSize: 56,
                fontWeight: 600,
                letterSpacing: '-0.03em',
                lineHeight: 1,
                color: '#A8A29E',
              }}
            >
              £14,561
            </div>
            <div style={{ fontSize: 13, color: tokens.color.text.muted, marginTop: 6 }}>
              average all-in cost
            </div>

            <div className="mt-8 grid gap-4" style={{ gridTemplateColumns: '1fr 1fr' }}>
              {(
                [
                  ['Time', '18 months'],
                  ['Paperwork', '20+ hours'],
                  ['Pictures', 'Two — never reconciled'],
                  ['Workspace', 'Email + Word + post'],
                ] as const
              ).map(([k, v]) => (
                <div key={k} style={{ borderTop: `1px solid ${tokens.color.border}`, paddingTop: 10 }}>
                  <div className="label-xs" style={{ color: tokens.color.text.muted, fontSize: 9.5 }}>
                    {k}
                  </div>
                  <div className="mt-1" style={{ fontSize: 14, color: tokens.color.text.sub }}>
                    {v}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Decouple */}
          <div
            className="sec-in sec-in-3"
            aria-label="Decouple: £800 to £1,100 all-in, 3 months typical, 15 minutes to a full picture, one shared workspace"
            style={{
              background: tokens.color.surface.panel,
              border: `1.5px solid ${tokens.color.ink}`,
              borderRadius: 14,
              padding: '32px 32px 28px',
              boxShadow: '0 8px 24px rgba(26,26,26,0.06)',
            }}
          >
            <div className="flex items-center justify-between">
              <Eyebrow color={tokens.color.ink}>Decouple</Eyebrow>
              <span className="label-xs" style={{ color: '#166534', fontSize: 9.5 }}>
                ·  All-in
              </span>
            </div>
            <div
              className="serif mt-3"
              style={{
                fontSize: 56,
                fontWeight: 600,
                letterSpacing: '-0.03em',
                lineHeight: 1,
                color: tokens.color.ink,
              }}
            >
              £800–£1,100
            </div>
            <div style={{ fontSize: 13, color: tokens.color.text.sub, marginTop: 6 }}>
              including consent order generation
            </div>

            <div className="mt-8 grid gap-4" style={{ gridTemplateColumns: '1fr 1fr' }}>
              {(
                [
                  ['Time', '3 months typical'],
                  ['To full picture', '15 minutes'],
                  ['Picture', 'One — shared, evidenced'],
                  ['Workspace', 'Decouple'],
                ] as const
              ).map(([k, v]) => (
                <div key={k} style={{ borderTop: `1px solid ${tokens.color.border}`, paddingTop: 10 }}>
                  <div className="label-xs" style={{ color: tokens.color.text.muted, fontSize: 9.5 }}>
                    {k}
                  </div>
                  <div
                    className="mt-1"
                    style={{ fontSize: 14, color: tokens.color.ink, fontWeight: 500 }}
                  >
                    {v}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 label-xs" style={{ color: tokens.color.text.muted, fontSize: 10 }}>
          Sources: Resolution / Citizens Advice cost surveys, 2024. Decouple pricing is all-inclusive
          of consent order generation.
        </div>
      </div>
    </section>
  );
}

function TrustCardsBand() {
  const cards = [
    {
      icon: Shield,
      label: 'Regulated',
      copy: 'Bank connection is FCA-regulated via TrueLayer. We can read transactions but cannot move money. Read-only. Disconnect anytime.',
    },
    {
      icon: Compass,
      label: 'Built with experts',
      copy: 'Designed alongside separating couples, family lawyers, and mediators. Reviewed for legal accuracy. Pre-flight checked against court requirements.',
    },
    {
      icon: Lock,
      label: 'Your data, your control',
      copy: 'End-to-end encryption. Granular sharing — you decide what your ex sees. Deletable on request.',
    },
  ];
  return (
    <section aria-labelledby="trust-h" style={{ paddingTop: 100, paddingBottom: 100 }}>
      <div className="mx-auto px-8" style={{ maxWidth: 1240 }}>
        <h2 id="trust-h" className="sr-only">
          Trust
        </h2>
        <div className="grid gap-5" style={{ gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' }}>
          {cards.map((c, i) => {
            const Icon = c.icon;
            return (
              <div
                key={c.label}
                className={'sec-in sec-in-' + Math.min(i + 1, 4)}
                style={{
                  background: tokens.color.surface.panel,
                  border: `1px solid ${tokens.color.border}`,
                  borderRadius: 14,
                  padding: '26px 26px 28px',
                }}
              >
                <div
                  className="flex items-center justify-center"
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 9,
                    background: tokens.color.surface.canvas,
                    border: `1px solid ${tokens.color.border}`,
                    color: tokens.color.ink,
                  }}
                >
                  <Icon size={17} sw={1.7} />
                </div>
                <div
                  className="serif mt-5"
                  style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.015em' }}
                >
                  {c.label}
                </div>
                <p
                  className="mt-3"
                  style={{ fontSize: 13.5, lineHeight: 1.6, color: tokens.color.text.sub }}
                >
                  {c.copy}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function PricingTeaser() {
  return (
    <section
      id="pricing"
      aria-labelledby="pricing-h"
      style={{ paddingTop: 60, paddingBottom: 60 }}
    >
      <div className="mx-auto px-8" style={{ maxWidth: 920 }}>
        <div
          className="sec-in sec-in-1 text-center"
          style={{
            background: tokens.color.surface.panel,
            border: `1px solid ${tokens.color.border}`,
            borderRadius: 16,
            padding: '44px 36px 40px',
          }}
        >
          <Eyebrow>Pricing</Eyebrow>
          <h2
            id="pricing-h"
            className="serif mt-4"
            style={{
              fontSize: 34,
              fontWeight: 600,
              letterSpacing: '-0.022em',
              lineHeight: 1.15,
              textWrap: 'balance',
            }}
          >
            <span style={{ fontStyle: 'italic' }}>£800–£1,100</span> all-in for the complete
            settlement journey — including consent order generation.
          </h2>
          <p
            className="mt-4 mx-auto"
            style={{ fontSize: 15, color: tokens.color.text.sub, lineHeight: 1.55, maxWidth: 540 }}
          >
            Free up to your AI plan. Pay only when you decide to build.
          </p>
          <div className="mt-7 flex items-center justify-center gap-3">
            <a
              href="#pricing-detail"
              className="inline-flex items-center gap-1.5 pb-1"
              style={{
                fontSize: 14,
                color: tokens.color.ink,
                borderBottom: `1px solid ${tokens.color.ink}`,
              }}
            >
              See pricing detail
              <ArrowUpRight size={14} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

const FAQS = [
  {
    q: 'Is this legal? Will the court accept it?',
    a: "Yes. Decouple produces the same documents your solicitor would — Form D81, the consent order, and supporting disclosure — formatted to court requirements. We pre-flight every package against the rules a district judge applies. The court reviews and seals the order; you can also have a solicitor sign off before submission if you'd prefer.",
  },
  {
    q: "What if my ex won't cooperate?",
    a: "You can build your own picture privately first — there's no requirement for your ex-partner to be involved at that stage. When you invite them, they see only what you choose to share. If they don't engage, your picture and the orientation plan are still yours to keep, and you can take them to a mediator or solicitor without losing the work.",
  },
  {
    q: 'How is Decouple different from mediation or a solicitor?',
    a: 'Mediation is a conversation; a solicitor writes the documents. Decouple is the workspace where the picture, the negotiation, and the documents live in one place — at consumer-software cost. Mediation and a final solicitor sign-off both still fit alongside Decouple. We make either of them shorter and cheaper, not redundant.',
  },
  {
    q: 'What if our finances are complicated — self-employed, foreign assets, trusts?',
    a: "We handle most consumer cases end-to-end — including self-employment, multiple pensions, and second properties. For genuinely complex situations (offshore trusts, business valuations, contested non-matrimonial assets), Decouple still produces the picture and disclosure bundle; we'll flag clearly where a specialist solicitor or accountant is the right next step.",
  },
  {
    q: "Can I use this if I'm not sure I want to separate yet?",
    a: 'Yes — and many people do. The free orientation produces a picture you can hold privately. Some people use it to think things through; some discover it gives them clarity to stay; some use it later if they decide to separate. Whatever you do next, the picture is yours.',
  },
  {
    q: 'Is my data safe if my ex has access to my devices?',
    a: "Decouple supports a discreet mode: no email notifications, no app on the home screen, a private passcode separate from your device PIN, and one-tap exit. We can also send a paper copy of your picture to a different address. If safety is a concern, please tell us — we'll route you to the right support before going further.",
  },
];

function FAQBand() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  return (
    <section
      id="faq"
      aria-labelledby="faq-h"
      style={{ paddingTop: 60, paddingBottom: 100 }}
    >
      <div className="mx-auto px-8" style={{ maxWidth: 920 }}>
        <div className="sec-in sec-in-1">
          <Eyebrow>Common questions</Eyebrow>
          <h2
            id="faq-h"
            className="serif mt-4"
            style={{
              fontSize: 34,
              fontWeight: 600,
              letterSpacing: '-0.022em',
              lineHeight: 1.15,
            }}
          >
            What people ask first.
          </h2>
        </div>

        <div className="mt-10" style={{ borderTop: `1px solid ${tokens.color.border}` }}>
          {FAQS.map((f, i) => {
            const open = openIndex === i;
            return (
              <div
                key={i}
                style={{ borderBottom: `1px solid ${tokens.color.border}` }}
              >
                <button
                  onClick={() => setOpenIndex(open ? null : i)}
                  aria-expanded={open}
                  aria-controls={`faq-panel-${i}`}
                  className="w-full flex items-center justify-between gap-6 text-left"
                  style={{
                    padding: '22px 4px',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  <span
                    className="serif"
                    style={{
                      fontSize: 19,
                      fontWeight: 600,
                      letterSpacing: '-0.012em',
                      color: tokens.color.ink,
                      lineHeight: 1.3,
                    }}
                  >
                    {f.q}
                  </span>
                  <span
                    className="flex-shrink-0"
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 99,
                      border: `1px solid ${tokens.color.border}`,
                      background: tokens.color.surface.panel,
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: tokens.color.ink,
                      transform: open ? 'rotate(45deg)' : 'rotate(0deg)',
                      transition: 'transform 240ms ease',
                    }}
                  >
                    <Plus size={14} sw={2} />
                  </span>
                </button>
                <div
                  id={`faq-panel-${i}`}
                  style={{
                    maxHeight: open ? 400 : 0,
                    opacity: open ? 1 : 0,
                    overflow: 'hidden',
                    transition:
                      'max-height 280ms ease-out, opacity 200ms ease-out, padding 280ms ease-out',
                    paddingBottom: open ? 22 : 0,
                    paddingRight: 56,
                  }}
                >
                  <p style={{ fontSize: 15, lineHeight: 1.65, color: tokens.color.text.sub }}>
                    {f.a}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ClosingCTA() {
  return (
    <section
      aria-labelledby="closing-h"
      style={{
        paddingTop: 110,
        paddingBottom: 110,
        background: tokens.color.surface.panel,
        borderTop: `1px solid ${tokens.color.border}`,
      }}
    >
      <div className="mx-auto px-8 text-center" style={{ maxWidth: 760 }}>
        <div className="sec-in sec-in-1">
          <Eyebrow>The free plan is yours to keep</Eyebrow>
          <h2
            id="closing-h"
            className="serif mt-5"
            style={{
              fontSize: 52,
              fontWeight: 600,
              letterSpacing: '-0.03em',
              lineHeight: 1.05,
              textWrap: 'balance',
            }}
          >
            Whether you&apos;re ready{' '}
            <span style={{ fontStyle: 'italic', color: tokens.color.text.sub }}>
              or just looking
            </span>
            , the free plan is yours to keep.
          </h2>

          <div className="mt-10 flex items-center justify-center">
            <CTAPrimary />
          </div>

          <div
            className="mt-12 pt-6"
            style={{
              borderTop: `1px solid ${tokens.color.border}`,
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <a
              href="#invited"
              style={{
                fontSize: 13.5,
                color: tokens.color.text.sub,
                borderBottom: `1px solid ${tokens.color.border}`,
                paddingBottom: 1,
              }}
            >
              I&apos;m the partner who&apos;s been invited →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  const cols = [
    {
      h: 'Product',
      links: ['How it works', 'Pricing', 'For mediators', 'For solicitors', 'Help centre'],
    },
    {
      h: 'Trust',
      links: ['Privacy', 'Terms', 'Safeguarding', 'Data & deletion', 'Open Banking'],
    },
    { h: 'Company', links: ['About', 'Press', 'Contact', 'Careers'] },
  ];
  return (
    <footer
      role="contentinfo"
      style={{
        background: tokens.color.surface.page,
        borderTop: `1px solid ${tokens.color.border}`,
        padding: '60px 0 40px',
      }}
    >
      <div
        className="mx-auto px-8 grid gap-12"
        style={{ maxWidth: 1240, gridTemplateColumns: '1.4fr 1fr 1fr 1fr' }}
      >
        <div>
          <Wordmark size={17} />
          <p
            className="serif italic mt-5"
            style={{ fontSize: 15, color: tokens.color.text.sub, lineHeight: 1.5, maxWidth: 280 }}
          >
            The complete picture.
          </p>
          <div className="mt-7 flex flex-col gap-2" style={{ fontSize: 11.5, color: tokens.color.text.muted }}>
            <span>Decouple Ltd · London</span>
            <span>Open Banking via TrueLayer (FCA regulated)</span>
            <span className="mono" style={{ fontSize: 10.5, letterSpacing: '0.04em' }}>
              v1 · 2026
            </span>
          </div>
        </div>

        {cols.map((col) => (
          <div key={col.h}>
            <Eyebrow>{col.h}</Eyebrow>
            <ul
              className="mt-4 flex flex-col gap-2.5"
              style={{ listStyle: 'none', padding: 0, margin: 0 }}
            >
              {col.links.map((l) => (
                <li key={l}>
                  <a href="#" style={{ fontSize: 13.5, color: tokens.color.text.sub }}>
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div
        className="mx-auto px-8 mt-14 pt-6"
        style={{ maxWidth: 1240, borderTop: `1px solid ${tokens.color.border}` }}
      >
        <div
          className="flex items-center justify-between flex-wrap gap-3"
          style={{ fontSize: 11.5, color: tokens.color.text.muted }}
        >
          <span>© Decouple Ltd 2026 · All rights reserved</span>
          <span>
            Decouple is not a law firm and does not provide legal advice. We help you prepare a
            settlement; the court reviews and approves it.
          </span>
        </div>
      </div>
    </footer>
  );
}

export default function MarketingLandingPage() {
  return (
    <>
      <a href="#main" className="skip">
        Skip to content
      </a>
      <Header />
      <main id="main" role="main">
        <Hero />
        <PictureBand />
        <JourneyBand />
        <CompareBand />
        <TrustCardsBand />
        <PricingTeaser />
        <FAQBand />
        <ClosingCTA />
      </main>
      <Footer />
    </>
  );
}
