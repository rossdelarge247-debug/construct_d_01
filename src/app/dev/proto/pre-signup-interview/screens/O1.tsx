'use client';

import { type CSSProperties } from 'react';
import { tokens } from '@/styles/tokens';
import { Arrow } from '../components/Arrow';
import { BrandBar } from '../components/BrandBar';
import { EntryScaffold } from '../components/EntryScaffold';
import { Footer } from '../components/Footer';
import { Hero } from '../components/Hero';
import { TopBar } from '../components/TopBar';
import { WhyWeAsk } from '../components/WhyWeAsk';
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
    <main className="flex flex-col min-h-screen w-full max-w-[480px] mx-auto pt-6">
      <BrandBar />
      <TopBar step={step} />
      <EntryScaffold
        timeIntro={copy.entry.timeIntro}
        outcomes={copy.entry.outcomes}
        reassurance={copy.entry.reassurance}
        className={styles.entry}
      />
      <Hero
        eyebrow={copy.eyebrow}
        heading={
          <>
            {copy.heading.pre}
            <span style={{ fontStyle: 'italic', fontWeight: 400 }}>{copy.heading.italic}</span>
            {copy.heading.tail}
          </>
        }
        helper={copy.subStem}
        helperVariant="italic-serif"
        className={styles.entry}
      />
      <WhyWeAsk body={copy.whyWeAsk} className={styles.entry} />
      <fieldset
        aria-labelledby="o1-legend"
        className="px-5 space-y-2.5 flex-1"
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
      <Footer
        caption={
          <>
            <span>{copy.trustBand.left}</span>{' '}
            <span style={{ color: '#C9C5BD' }}>·</span>{' '}
            <span>{copy.trustBand.right}</span>
          </>
        }
        ctaLabel={copy.cta}
        enabled={ctaEnabled}
        onContinue={next}
      />
    </main>
  );
}
