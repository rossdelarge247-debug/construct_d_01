'use client';

import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react';
import { tokens } from '@/styles/tokens';
import { Arrow } from '../components/Arrow';
import { BrandBar } from '../components/BrandBar';
import { Footer } from '../components/Footer';
import { Hero } from '../components/Hero';
import { TopBar } from '../components/TopBar';
import { useProto } from '../lib/proto-context';
import { getCopy, type O3Copy } from '../lib/copy/o3';
import type {
  RelationshipQuality,
  DevicePrivate,
} from '../lib/types';
import styles from './O3.module.css';

const colors = {
  ink: tokens.color.ink,
  sub: tokens.color.text.sub,
  muted: tokens.color.text.muted,
  line: tokens.color.border,
  violet: tokens.color.accent.violet,
};

type RelOption = O3Copy['relationship']['options'][number];

function RelRow({
  opt,
  selected,
  onChange,
  staggerIndex,
}: {
  opt: RelOption;
  selected: boolean;
  onChange: () => void;
  staggerIndex: number;
}) {
  return (
    <label
      className={`${styles.entry} ${styles.card}${selected ? ` ${styles.cardSelected}` : ''}`}
      style={
        {
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          width: '100%',
          background: selected ? colors.ink : '#FFFFFF',
          border: `1px solid ${selected ? colors.ink : colors.line}`,
          borderRadius: 14,
          padding: '14px',
          cursor: 'pointer',
          '--stagger-index': staggerIndex,
        } as CSSProperties
      }
    >
      <input
        type="radio"
        name="o3-relationship"
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

type PrivOption = O3Copy['privacy']['options'][number];

function PrivPill({
  opt,
  selected,
  onChange,
}: {
  opt: PrivOption;
  selected: boolean;
  onChange: () => void;
}) {
  return (
    <label
      className={styles.pill}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        background: selected ? colors.ink : '#FFFFFF',
        color: selected ? '#FFFFFF' : colors.ink,
        border: `1px solid ${selected ? colors.ink : colors.line}`,
        borderRadius: 999,
        padding: '8px 16px',
        font: `${selected ? 600 : 500} 12.5px/1.2 ${tokens.font.sans}`,
        cursor: 'pointer',
        whiteSpace: 'nowrap',
      }}
    >
      <input
        type="radio"
        name="o3-privacy"
        value={opt.value}
        checked={selected}
        onChange={onChange}
        className="sr-only"
      />
      {opt.label}
    </label>
  );
}

export function O3() {
  const { answers, setAnswer, next, back, step } = useProto();
  const exAndSafety = answers.exAndSafety ?? {};
  const stage = answers.stage ?? 'thinking';
  const copy = getCopy(stage);
  const relationshipQuality = exAndSafety.relationshipQuality;
  const devicePrivate = exAndSafety.devicePrivate;
  const enabled = Boolean(relationshipQuality);

  const setRelationship = (v: RelationshipQuality) => {
    setAnswer('exAndSafety', { ...exAndSafety, relationshipQuality: v });
  };
  const setPrivacy = (v: DevicePrivate) => {
    setAnswer('exAndSafety', { ...exAndSafety, devicePrivate: v });
  };

  return (
    <main
      style={{
        width: '100%',
        maxWidth: 480,
        margin: '0 auto',
        paddingTop: 24,
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}
    >
      <BrandBar />
      <TopBar step={step} onBack={back} />
      <Hero
        eyebrow={copy.eyebrow}
        eyebrowColor={colors.violet}
        heading={copy.heading}
        staggerIndex={0}
        className={styles.entry}
      />
      <fieldset
        aria-labelledby="o3-rel-legend"
        style={{
          margin: 0,
          padding: '0 20px',
          border: 'none',
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
        }}
      >
        <legend id="o3-rel-legend" className="sr-only">
          {copy.relationship.label}
        </legend>
        {copy.relationship.options.map((opt, i) => (
          <RelRow
            key={opt.value}
            opt={opt}
            selected={relationshipQuality === opt.value}
            onChange={() => setRelationship(opt.value)}
            staggerIndex={i + 1}
          />
        ))}
      </fieldset>
      <section
        className={styles.entry}
        style={
          {
            margin: '16px 20px 16px',
            paddingTop: 16,
            borderTop: `1px solid ${colors.line}`,
            '--stagger-index': 5,
          } as CSSProperties
        }
      >
        <p
          style={{
            margin: '0 0 8px',
            font: `400 11.5px/1.45 ${tokens.font.sans}`,
            color: colors.sub,
          }}
        >
          {copy.privacy.preamble}
        </p>
        <fieldset
          aria-labelledby="o3-priv-legend"
          style={{
            margin: 0,
            padding: 0,
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            flexWrap: 'wrap',
          }}
        >
          <legend id="o3-priv-legend" className="sr-only">
            {copy.privacy.label}
          </legend>
          <span
            aria-hidden="true"
            style={{
              font: `500 12.5px/1.2 ${tokens.font.sans}`,
              color: colors.ink,
            }}
          >
            {copy.privacy.label}
          </span>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              marginLeft: 'auto',
            }}
          >
            {copy.privacy.options.map((opt) => (
              <PrivPill
                key={opt.value}
                opt={opt}
                selected={devicePrivate === opt.value}
                onChange={() => setPrivacy(opt.value)}
              />
            ))}
          </div>
        </fieldset>
      </section>
      <Footer
        caption={
          !enabled
            ? copy.captions.pickToContinue
            : !Boolean(devicePrivate)
              ? copy.captions.privacyOptional
              : copy.captions.bothAnswered
        }
        ctaLabel="Continue"
        enabled={enabled}
        onContinue={next}
      />
    </main>
  );
}
