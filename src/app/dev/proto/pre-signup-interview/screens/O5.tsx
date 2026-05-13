'use client';

import { type CSSProperties } from 'react';
import { tokens } from '@/styles/tokens';
import { BrandBar } from '../components/BrandBar';
import { Footer } from '../components/Footer';
import { Hero } from '../components/Hero';
import { TopBar } from '../components/TopBar';
import { WhyWeAsk } from '../components/WhyWeAsk';
import { useProto } from '../lib/proto-context';
import { getCopy, type O5Option } from '../lib/copy/o5';
import type { PartnerAwareness, PartnerFinancesAnswers } from '../lib/types';
import styles from './O5.module.css';

const colors = {
  ink: tokens.color.ink,
  sub: tokens.color.text.sub,
  muted: tokens.color.text.muted,
  border: tokens.color.border,
  indigo: tokens.color.accent.indigo,
};

const PRIMARY_KEYS: ReadonlyArray<PartnerAwareness> = ['full', 'some', 'little'];


function OptionRow({
  opt,
  selected,
  onChange,
  staggerIndex,
}: {
  opt: O5Option;
  selected: boolean;
  onChange: () => void;
  staggerIndex: number;
}) {
  return (
    <label
      className={`${styles.entry} ${styles.card}`}
      style={
        {
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          width: '100%',
          background: selected ? colors.ink : '#FFFFFF',
          border: `1px solid ${selected ? colors.ink : colors.border}`,
          borderRadius: 14,
          padding: '14px 14px',
          cursor: 'pointer',
          '--stagger-index': staggerIndex,
        } as CSSProperties
      }
    >
      <input
        type="radio"
        name="o5-partner-awareness"
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
            font: `600 14px/1.25 ${tokens.font.sans}`,
            color: selected ? '#FFFFFF' : colors.ink,
          }}
        >
          {opt.primary}
          {opt.detail ? (
            <span
              style={{
                font: `400 14px/1.25 ${tokens.font.serif}`,
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

export function O5() {
  const { answers, setAnswer, next, back, step } = useProto();
  const stage = answers.stage ?? 'thinking';
  const copy = getCopy(stage);
  const finances: PartnerFinancesAnswers = answers.partnerFinances ?? {};

  const update = (value: PartnerAwareness) => {
    setAnswer('partnerFinances', { ...finances, awareness: value });
  };

  const enabled = Boolean(finances.awareness);
  const caption = enabled ? copy.captions.oneAnswered : copy.captions.pickToContinue;

  const primary = copy.options.filter((o) => PRIMARY_KEYS.includes(o.value));
  const secondary = copy.options.filter((o) => !PRIMARY_KEYS.includes(o.value));

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
        helper={copy.helper}
        className={styles.entry}
      />
      <WhyWeAsk body={copy.whyWeAsk} className={styles.entry} />
      <fieldset
        aria-labelledby="o5-partner-legend"
        style={{
          border: 'none',
          margin: 0,
          padding: '4px 20px 12px',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <legend id="o5-partner-legend" className="sr-only">
          {copy.heading}
        </legend>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {primary.map((opt, i) => (
            <OptionRow
              key={opt.value}
              opt={opt}
              selected={finances.awareness === opt.value}
              onChange={() => update(opt.value)}
              staggerIndex={i + 1}
            />
          ))}
        </div>
        <div
          aria-hidden="true"
          style={{
            marginTop: 20,
            marginBottom: 12,
            borderTop: `1px solid ${colors.border}`,
          }}
        />
        <div
          style={{
            marginBottom: 8,
            font: `italic 400 11px/1.4 ${tokens.font.serif}`,
            color: colors.sub,
          }}
        >
          If you have concerns…
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {secondary.map((opt, i) => (
            <OptionRow
              key={opt.value}
              opt={opt}
              selected={finances.awareness === opt.value}
              onChange={() => update(opt.value)}
              staggerIndex={primary.length + i + 1}
            />
          ))}
        </div>
      </fieldset>
      <div style={{ flex: 1 }} />
      <Footer enabled={enabled} caption={caption} ctaLabel={copy.cta.continue} onContinue={next} />
    </main>
  );
}
