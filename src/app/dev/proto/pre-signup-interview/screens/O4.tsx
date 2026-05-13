'use client';

import { type CSSProperties } from 'react';
import { tokens } from '@/styles/tokens';
import { BrandBar } from '../components/BrandBar';
import { Footer } from '../components/Footer';
import { Hero } from '../components/Hero';
import { TopBar } from '../components/TopBar';
import { WhyWeAsk } from '../components/WhyWeAsk';
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
      <Hero
        eyebrow={copy.eyebrow.label}
        eyebrowColor={colors.indigo}
        heading={copy.heading}
        helper={copy.helper}
        className={styles.entry}
      />
      <WhyWeAsk body={copy.whyWeAsk} className={styles.entry} />
      <fieldset
        aria-labelledby="o4-emp-legend"
        style={{
          border: 'none',
          margin: 0,
          padding: '0 20px 12px',
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
