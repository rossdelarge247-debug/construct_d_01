'use client';

import { type CSSProperties } from 'react';
import { tokens } from '@/styles/tokens';
import { BrandBar } from '../components/BrandBar';
import { ProgressPill } from '../components/ProgressPill';
import { useProto } from '../lib/proto-context';
import { getCopy } from '../lib/copy/o1';
import type { Stage } from '../lib/types';
import styles from './O1.module.css';

const colors = {
  ink: tokens.color.ink,
  sub: tokens.color.text.sub,
  muted: tokens.color.text.muted,
  line: tokens.color.border,
};

function Arrow({ size = 11, dir = 'left' }: { size?: number; dir?: 'left' | 'right' }) {
  const points = dir === 'left' ? '7,2 3,5.5 7,9' : '4,2 8,5.5 4,9';
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 11 11"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points={points} />
    </svg>
  );
}

function TopBar({ step }: { step: number }) {
  return (
    <div
      className="px-5 pt-4 pb-3 flex items-center justify-between"
      style={{ borderBottom: `1px solid ${colors.line}` }}
    >
      <a
        href="#"
        className="inline-flex items-center gap-1.5"
        style={{ color: colors.sub, fontSize: 12 }}
      >
        <Arrow dir="left" size={11} />
        <span>Home</span>
      </a>
      <ProgressPill step={step} />
      <div style={{ width: 44 }} aria-hidden="true" />
    </div>
  );
}

function Hero({
  eyebrow,
  heading,
  subStem,
}: {
  eyebrow: string;
  heading: { pre: string; italic: string; tail: string };
  subStem: string;
}) {
  return (
    <div className={`px-5 pt-5 pb-4 ${styles.entry}`}>
      <div
        style={{
          color: colors.muted,
          fontSize: 10.5,
          fontFamily: tokens.font.mono,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
        }}
      >
        {eyebrow}
      </div>
      <h2
        style={{
          fontFamily: tokens.font.serif,
          fontSize: 30,
          lineHeight: 1.08,
          letterSpacing: '-0.02em',
          fontWeight: 600,
          margin: '12px 0 0 0',
          color: colors.ink,
        }}
      >
        {heading.pre}
        <span style={{ fontStyle: 'italic', fontWeight: 400 }}>{heading.italic}</span>
        {heading.tail}
      </h2>
      <p
        style={{
          fontFamily: tokens.font.serif,
          fontStyle: 'italic',
          fontSize: 14,
          lineHeight: 1.5,
          color: colors.sub,
          marginTop: 12,
        }}
      >
        {subStem}
      </p>
    </div>
  );
}

function RadioCard({
  value,
  label,
  sub,
  selected,
  onChange,
}: {
  value: Stage;
  label: string;
  sub: string;
  selected: boolean;
  onChange: (v: Stage) => void;
}) {
  return (
    <label
      className={`${styles.card} ${selected ? styles.cardSelected : ''} block relative cursor-pointer`}
      style={{
        background: '#FFFFFF',
        border: `${selected ? 2 : 1}px solid ${selected ? colors.ink : colors.line}`,
        borderRadius: 12,
        padding: '14px 14px',
        minHeight: 68,
      }}
    >
      <div className="flex items-start gap-3">
        <span className="relative shrink-0 mt-0.5">
          <input
            type="radio"
            name="o1-stage"
            value={value}
            checked={selected}
            onChange={() => onChange(value)}
            className="sr-only"
          />
          <span
            aria-hidden="true"
            style={{
              display: 'inline-block',
              width: 18,
              height: 18,
              borderRadius: '50%',
              border: `${selected ? 6 : 1.5}px solid ${selected ? colors.ink : '#B8B4AC'}`,
              background: '#FFFFFF',
              boxSizing: 'border-box',
            }}
          />
        </span>
        <span className="flex-1 min-w-0">
          <span
            style={{
              display: 'block',
              fontFamily: tokens.font.serif,
              fontSize: 15,
              fontWeight: 600,
              lineHeight: 1.25,
              color: colors.ink,
            }}
          >
            {label}
          </span>
          <span
            style={{
              display: 'block',
              marginTop: 4,
              fontSize: 12,
              color: colors.sub,
              lineHeight: 1.4,
            }}
          >
            {sub}
          </span>
        </span>
      </div>
    </label>
  );
}

export function O1() {
  const { answers, setAnswer, next, step } = useProto();
  const stage = answers.stage;
  const copy = getCopy(stage ?? 'thinking');
  const ctaEnabled = Boolean(stage);

  return (
    <div className="flex flex-col min-h-screen w-full max-w-[480px] mx-auto pt-6">
      <BrandBar />
      <TopBar step={step} />
      <Hero eyebrow={copy.eyebrow} heading={copy.heading} subStem={copy.subStem} />
      <fieldset
        aria-labelledby="o1-legend"
        className="px-5 mt-5 space-y-2.5 flex-1"
        style={{ border: 'none' }}
      >
        <legend id="o1-legend" className="sr-only">
          Tell us where you&apos;re at.
        </legend>
        {copy.options.map((opt, i) => (
          <div
            key={opt.value}
            className={styles.entry}
            style={{ '--stagger-index': i + 1 } as CSSProperties}
          >
            <RadioCard
              value={opt.value}
              label={opt.label}
              sub={opt.sub}
              selected={stage === opt.value}
              onChange={(v) => setAnswer('stage', v)}
            />
          </div>
        ))}
      </fieldset>
      <div
        className="px-5 pt-3 pb-5"
        style={{
          borderTop: `1px solid ${colors.line}`,
          background: 'rgba(245,245,244,0.85)',
          backdropFilter: 'blur(8px)',
        }}
      >
        <div
          className="flex items-center justify-center gap-2 mb-2.5 flex-wrap"
          style={{ color: colors.muted, fontSize: 10.5 }}
        >
          <span>{copy.trustBand.left}</span>
          <span style={{ color: '#C9C5BD' }}>·</span>
          <span>{copy.trustBand.right}</span>
        </div>
        <button
          type="button"
          disabled={!ctaEnabled}
          onClick={next}
          className={`${styles.cta}${ctaEnabled ? ' ' + styles.ctaEnabled : ''}`}
          style={{
            width: '100%',
            background: ctaEnabled ? colors.ink : colors.line,
            color: ctaEnabled ? '#FFFFFF' : '#9A968E',
            padding: '14px 18px',
            borderRadius: 999,
            fontSize: 14,
            fontWeight: 600,
            border: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            cursor: ctaEnabled ? 'pointer' : 'not-allowed',
          }}
        >
          <span>{copy.cta}</span>
          <Arrow dir="right" size={13} />
        </button>
      </div>
    </div>
  );
}
