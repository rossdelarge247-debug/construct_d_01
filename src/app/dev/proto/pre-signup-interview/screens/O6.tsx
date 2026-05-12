'use client';

import { useEffect, useRef, type CSSProperties } from 'react';
import { tokens } from '@/styles/tokens';
import { Arrow } from '../components/Arrow';
import { BrandBar } from '../components/BrandBar';
import { Hero } from '../components/Hero';
import { TopBar } from '../components/TopBar';
import { useProto } from '../lib/proto-context';
import { getCopy, type O6PriorityOption, type O6WorryOption } from '../lib/copy/o6';
import type { Priority, WhatMattersAnswers, Worry } from '../lib/types';
import styles from './O6.module.css';

const CAP = 3;

const colors = {
  ink: tokens.color.ink,
  sub: tokens.color.text.sub,
  muted: tokens.color.text.muted,
  border: tokens.color.border,
  magenta: tokens.color.accent.magenta,
};


function Chip({
  label,
  selected,
  disabled,
  onClick,
}: {
  label: string;
  selected: boolean;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      disabled={disabled}
      onClick={onClick}
      className={styles.chip}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 7,
        background: selected ? colors.ink : '#FFFFFF',
        color: selected ? '#FFFFFF' : disabled ? '#A8A29E' : colors.ink,
        border: `1px solid ${selected ? colors.ink : disabled ? '#EAE7DF' : colors.border}`,
        borderRadius: 999,
        padding: '8px 12px',
        font: `500 12.5px/1.2 ${tokens.font.sans}`,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.3 : 1,
        textAlign: 'left',
      }}
    >
      <span
        aria-hidden="true"
        style={{
          flex: 'none',
          width: 14,
          height: 14,
          borderRadius: 999,
          border: `1.5px solid ${selected ? '#FFFFFF' : '#C9C5BD'}`,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {selected ? (
          <svg width="8" height="8" viewBox="0 0 10 10" fill="none" aria-hidden="true">
            <path
              d="M2 5.2 L4.2 7.4 L8 3.2"
              stroke="#FFFFFF"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : null}
      </span>
      <span>{label}</span>
    </button>
  );
}

interface GroupProps<V extends string> {
  id: string;
  title: string;
  caption: string;
  options: ReadonlyArray<{ value: V; label: string }>;
  selected: ReadonlyArray<V>;
  onToggle: (value: V) => void;
  staggerIndex: number;
}

function CardPlate<V extends string>({
  id,
  title,
  caption,
  options,
  selected,
  onToggle,
  staggerIndex,
}: GroupProps<V>) {
  const capReached = selected.length >= CAP;
  const headingId = `${id}-heading`;
  return (
    <div
      className={styles.entry}
      style={
        {
          background: '#FFFFFF',
          border: `1px solid ${colors.border}`,
          borderRadius: 18,
          padding: 16,
          boxShadow: '0 1px 0 rgba(0,0,0,0.02)',
          '--stagger-index': staggerIndex,
        } as CSSProperties
      }
    >
      <h3
        id={headingId}
        style={{
          margin: 0,
          font: `600 15.5px/1.25 ${tokens.font.serif}`,
          letterSpacing: '-0.01em',
          color: colors.ink,
        }}
      >
        {title}
      </h3>
      <p
        style={{
          margin: '4px 0 0',
          font: `400 11.5px/1.4 ${tokens.font.sans}`,
          color: colors.muted,
        }}
      >
        {caption}
      </p>
      <div
        role="group"
        aria-labelledby={headingId}
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 6,
          marginTop: 10,
        }}
      >
        {options.map((opt) => {
          const isSelected = selected.includes(opt.value);
          return (
            <Chip
              key={opt.value}
              label={opt.label}
              selected={isSelected}
              disabled={capReached && !isSelected}
              onClick={() => onToggle(opt.value)}
            />
          );
        })}
      </div>
    </div>
  );
}

function Footer({
  caption,
  ctaLabel,
  onContinue,
}: {
  caption: string;
  ctaLabel: string;
  onContinue: () => void;
}) {
  const ctaRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const node = ctaRef.current;
    if (!node) return;
    node.classList.remove(styles.ctaEnabled);
    void node.offsetWidth;
    node.classList.add(styles.ctaEnabled);
  }, []);
  return (
    <div
      style={{
        padding: '12px 20px 16px',
        borderTop: `1px solid ${colors.border}`,
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
          font: `400 10.5px/1.35 ${tokens.font.sans}`,
          color: colors.sub,
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
        className={`${styles.cta} ${styles.ctaEnabled}`}
        style={{
          width: '100%',
          background: colors.ink,
          color: '#FFFFFF',
          padding: '13px 18px',
          borderRadius: 999,
          font: `600 14px/1 ${tokens.font.sans}`,
          border: 'none',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          cursor: 'pointer',
        }}
      >
        <span>{ctaLabel}</span>
        <Arrow dir="right" size={13} strokeWidth={2} />
      </button>
    </div>
  );
}

export function O6() {
  const { answers, setAnswer, next, back, step } = useProto();
  const stage = answers.stage ?? 'thinking';
  const copy = getCopy(stage);
  const whatMatters: WhatMattersAnswers = answers.whatMatters ?? {};
  const priorities: ReadonlyArray<Priority> = whatMatters.priorities ?? [];
  const worries: ReadonlyArray<Worry> = whatMatters.worries ?? [];

  const togglePriority = (value: Priority) => {
    const updated = priorities.includes(value)
      ? priorities.filter((v) => v !== value)
      : priorities.length < CAP
        ? [...priorities, value]
        : priorities;
    setAnswer('whatMatters', { ...whatMatters, priorities: updated });
  };

  const toggleWorry = (value: Worry) => {
    const updated = worries.includes(value)
      ? worries.filter((v) => v !== value)
      : worries.length < CAP
        ? [...worries, value]
        : worries;
    setAnswer('whatMatters', { ...whatMatters, worries: updated });
  };

  const total = priorities.length + worries.length;
  const caption =
    total === 0
      ? copy.captions.empty
      : total === 1
        ? copy.captions.notedSingular
        : copy.captions.notedPlural(total);

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
      <Hero
        eyebrow={copy.eyebrow.label}
        eyebrowColor={colors[copy.eyebrow.accent]}
        heading={copy.heading}
        className={styles.entry}
      />
      <div
        style={{
          padding: '8px 16px 12px',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}
      >
        <CardPlate<Priority>
          id="o6-priorities"
          title={copy.priorities.title}
          caption={copy.priorities.caption}
          options={copy.priorities.options as ReadonlyArray<O6PriorityOption>}
          selected={priorities}
          onToggle={togglePriority}
          staggerIndex={1}
        />
        <CardPlate<Worry>
          id="o6-worries"
          title={copy.worries.title}
          caption={copy.worries.caption}
          options={copy.worries.options as ReadonlyArray<O6WorryOption>}
          selected={worries}
          onToggle={toggleWorry}
          staggerIndex={2}
        />
      </div>
      <div style={{ flex: 1 }} />
      <Footer caption={caption} ctaLabel={copy.cta.label} onContinue={next} />
    </main>
  );
}
