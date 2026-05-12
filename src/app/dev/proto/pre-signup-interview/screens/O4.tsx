'use client';

import { useEffect, useRef, type CSSProperties } from 'react';
import { tokens } from '@/styles/tokens';
import { Arrow } from '../components/Arrow';
import { BrandBar } from '../components/BrandBar';
import { TopBar } from '../components/TopBar';
import { useProto } from '../lib/proto-context';
import { getCopy, type O4Option } from '../lib/copy/o4';
import type { EmploymentAnswers, SelfEmployment } from '../lib/types';
import styles from './O4.module.css';

const colors = {
  ink: tokens.color.ink,
  sub: tokens.color.text.sub,
  muted: tokens.color.text.muted,
  line: tokens.color.border,
  indigo: tokens.color.accent.indigo,
};

function Hero({
  eyebrow,
  heading,
  helper,
}: {
  eyebrow: { label: string; accent: 'indigo' };
  heading: string;
  helper: string;
}) {
  const accentColor = colors.indigo;
  return (
    <div
      className={styles.entry}
      style={{ padding: '16px 20px 12px', '--stagger-index': 0 } as CSSProperties}
    >
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          font: `500 9.5px/1 ${tokens.font.sans}`,
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
          color: accentColor,
        }}
      >
        <span
          aria-hidden="true"
          style={{
            width: 5,
            height: 5,
            borderRadius: 999,
            background: accentColor,
            display: 'inline-block',
          }}
        />
        <span>{eyebrow.label}</span>
      </div>
      <h2
        style={{
          margin: '8px 0 0',
          font: `600 21px/1.18 ${tokens.font.serif}`,
          letterSpacing: '-0.015em',
          color: colors.ink,
        }}
      >
        {heading}
      </h2>
      <p
        style={{
          margin: '8px 0 0',
          font: `400 12px/1.45 ${tokens.font.sans}`,
          color: colors.sub,
        }}
      >
        {helper}
      </p>
    </div>
  );
}

function OptionRow({
  opt,
  selected,
  onChange,
  staggerIndex,
}: {
  opt: O4Option;
  selected: boolean;
  onChange: () => void;
  staggerIndex: number;
}) {
  const emphasised = Boolean(opt.emphasised);
  const verticalPad = emphasised ? 18 : 14;
  const fontSize = emphasised ? 15 : 14;
  return (
    <label
      className={`${styles.entry} ${styles.card}${emphasised ? ` ${styles.cardEmphasised}` : ''}${selected ? ` ${styles.cardSelected}` : ''}`}
      style={
        {
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          width: '100%',
          background: selected ? colors.ink : '#FFFFFF',
          border: `1px solid ${selected ? colors.ink : colors.line}`,
          borderRadius: 14,
          padding: `${verticalPad}px 14px`,
          cursor: 'pointer',
          '--stagger-index': staggerIndex,
        } as CSSProperties
      }
    >
      <input
        type="radio"
        name="o4-self-employment"
        value={opt.value}
        checked={selected}
        onChange={onChange}
        className="sr-only"
      />
      <span
        aria-hidden="true"
        style={{
          flex: 'none',
          width: 18,
          height: 18,
          borderRadius: 999,
          border: `1.5px solid ${selected ? '#FFFFFF' : '#C9C5BD'}`,
          background: selected ? colors.ink : '#FFFFFF',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {selected ? (
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: 999,
              background: '#FFFFFF',
            }}
          />
        ) : null}
      </span>
      <span style={{ flex: 1, lineHeight: 1.25 }}>
        <span
          style={{
            display: 'block',
            font: `600 ${fontSize}px/1.25 ${tokens.font.sans}`,
            color: selected ? '#FFFFFF' : colors.ink,
          }}
        >
          {opt.primary}
          {opt.detail ? (
            <span
              style={{
                font: `400 ${fontSize}px/1.25 ${tokens.font.serif}`,
                fontStyle: 'italic',
                color: selected ? 'rgba(255,255,255,0.7)' : colors.sub,
                marginLeft: 6,
              }}
            >
              — {opt.detail}
            </span>
          ) : null}
        </span>
      </span>
    </label>
  );
}

function Footer({
  enabled,
  caption,
  ctaLabel,
  onContinue,
}: {
  enabled: boolean;
  caption: string;
  ctaLabel: string;
  onContinue: () => void;
}) {
  const ctaRef = useRef<HTMLButtonElement>(null);
  const prevEnabledRef = useRef(enabled);

  useEffect(() => {
    const node = ctaRef.current;
    if (!node) return;
    if (!prevEnabledRef.current && enabled) {
      node.classList.remove(styles.ctaEnabled);
      void node.offsetWidth;
      node.classList.add(styles.ctaEnabled);
    }
    prevEnabledRef.current = enabled;
  }, [enabled]);

  return (
    <div
      style={{
        padding: '12px 20px 16px',
        borderTop: `1px solid ${colors.line}`,
        background: 'rgba(245,245,244,0.85)',
        backdropFilter: 'blur(8px)',
      }}
    >
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        style={{
          textAlign: 'center',
          font: enabled
            ? `italic 400 10.5px/1.35 ${tokens.font.serif}`
            : `400 10.5px/1.35 ${tokens.font.sans}`,
          color: enabled ? colors.sub : colors.muted,
          marginBottom: 10,
          minHeight: 14,
        }}
      >
        {caption}
      </div>
      <button
        ref={ctaRef}
        type="button"
        onClick={onContinue}
        disabled={!enabled}
        className={`${styles.cta}${enabled ? ` ${styles.ctaEnabled}` : ''}`}
        style={{
          width: '100%',
          background: enabled ? colors.ink : '#E5E3DC',
          color: enabled ? '#FFFFFF' : '#A8A29E',
          padding: '13px 18px',
          borderRadius: 999,
          font: `600 14px/1 ${tokens.font.sans}`,
          border: 'none',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          cursor: enabled ? 'pointer' : 'not-allowed',
        }}
      >
        <span>{ctaLabel}</span>
        <Arrow dir="right" size={13} strokeWidth={2} />
      </button>
    </div>
  );
}

export function O4() {
  const { answers, setAnswer, next, back, step } = useProto();
  const stage = answers.stage ?? 'thinking';
  const copy = getCopy(stage);
  const emp: EmploymentAnswers = answers.employment ?? {};

  const update = (value: SelfEmployment) => {
    setAnswer('employment', { ...emp, selfEmployment: value });
  };

  const enabled = Boolean(emp.selfEmployment);
  const caption = enabled ? copy.captions.oneAnswered : copy.captions.pickToContinue;

  return (
    <main
      style={{
        width: '100%',
        maxWidth: 480,
        margin: '0 auto',
        paddingTop: 24,
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <BrandBar />
      <TopBar step={step} onBack={back} />
      <Hero eyebrow={copy.eyebrow} heading={copy.heading} helper={copy.helper} />
      <fieldset
        aria-labelledby="o4-emp-legend"
        style={{
          border: 'none',
          margin: 0,
          padding: '4px 20px 12px',
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
        }}
      >
        <legend id="o4-emp-legend" className="sr-only">
          {copy.heading}
        </legend>
        {copy.options.map((opt, i) => (
          <OptionRow
            key={opt.value}
            opt={opt}
            selected={emp.selfEmployment === opt.value}
            onChange={() => update(opt.value)}
            staggerIndex={i + 1}
          />
        ))}
      </fieldset>
      <div style={{ flex: 1 }} />
      <Footer enabled={enabled} caption={caption} ctaLabel={copy.cta.continue} onContinue={next} />
    </main>
  );
}
