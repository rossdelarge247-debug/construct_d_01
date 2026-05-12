'use client';

import type { CSSProperties, ReactNode } from 'react';
import { tokens } from '@/styles/tokens';
import { Arrow } from '../components/Arrow';
import { BrandBar } from '../components/BrandBar';
import { Footer } from '../components/Footer';
import { Hero } from '../components/Hero';
import { TopBar } from '../components/TopBar';
import { useProto } from '../lib/proto-context';
import { getCopy } from '../lib/copy/o2';
import styles from './O2.module.css';
import type {
  ChildrenCount,
  Home,
  LivingTogether,
  RelationshipStatus,
  SituationAnswers,
  TitleShape,
} from '../lib/types';

const colors = {
  ink: tokens.color.ink,
  sub: tokens.color.text.sub,
  mute: tokens.color.text.muted,
  line: tokens.color.border,
  disabled: '#A8A29E',
  violet: tokens.color.accent.violet,
};

function Chip({
  label,
  selected,
  disabled = false,
  onClick,
}: {
  label: string;
  selected: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      disabled={disabled}
      className="focus-visible:outline focus-visible:outline-2 focus-visible:outline-current focus-visible:outline-offset-2 motion-reduce:!transition-none"
      style={{
        background: selected ? colors.ink : '#FFFFFF',
        color: selected ? '#FFFFFF' : disabled ? colors.disabled : colors.ink,
        border: `1px solid ${selected ? colors.ink : disabled ? '#EBE9E2' : colors.line}`,
        borderRadius: 999,
        padding: '9px 13px',
        fontSize: 12.5,
        fontWeight: selected ? 600 : 500,
        lineHeight: 1.1,
        whiteSpace: 'nowrap',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'background 120ms ease-out, border-color 120ms ease-out, color 120ms ease-out',
      }}
    >
      {label}
    </button>
  );
}

function ChipRow<V extends string | number>({
  options,
  value,
  onChange,
}: {
  options: ReadonlyArray<{ value: V; label: string }>;
  value: V | undefined;
  onChange: (v: V) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((opt) => (
        <Chip
          key={String(opt.value)}
          label={opt.label}
          selected={value === opt.value}
          onClick={() => onChange(opt.value)}
        />
      ))}
    </div>
  );
}

function SubLabel({ children }: { children: ReactNode }) {
  return (
    <div
      className="mb-2"
      style={{ fontFamily: tokens.font.serif, fontSize: 14, fontWeight: 600, color: colors.ink, lineHeight: 1.2 }}
    >
      {children}
    </div>
  );
}

const cardStyle: CSSProperties = {
  background: '#FFFFFF',
  border: `1px solid ${colors.line}`,
  borderRadius: 14,
  padding: '14px 14px',
  boxShadow: '0 1px 0 rgba(26,26,26,0.02)',
};

export function O2() {
  const { answers, setAnswer, next, back, step } = useProto();
  const stage = answers.stage ?? 'thinking';
  const copy = getCopy(stage);
  const situation: SituationAnswers = answers.situation ?? {};

  const update = (patch: Partial<SituationAnswers>) => {
    setAnswer('situation', { ...situation, ...patch });
  };

  const answered =
    (situation.relationship ? 1 : 0) +
    (situation.living ? 1 : 0) +
    (situation.hasChildren ? 1 : 0) +
    (situation.home ? 1 : 0);

  return (
    <main className="flex flex-col min-h-screen w-full max-w-[480px] mx-auto pt-6">
      <BrandBar />
      <TopBar step={step} onBack={back} />
      <Hero
        eyebrow={copy.eyebrow}
        eyebrowColor={colors.violet}
        heading={
          copy.heading.kind === 'plain' ? (
            copy.heading.text
          ) : (
            <>
              {copy.heading.bold}{' '}
              <span style={{ fontStyle: 'italic', fontWeight: 400 }}>{copy.heading.accent}</span>
              {copy.heading.period ? '.' : ''}
            </>
          )
        }
        className={styles.entry}
      />
      <div className="px-5 pt-2 pb-3 space-y-2.5 flex-1">
        <div style={cardStyle}>
          <SubLabel>{copy.relationship.label}</SubLabel>
          <ChipRow<RelationshipStatus>
            options={copy.relationship.options}
            value={situation.relationship}
            onChange={(v) => update({ relationship: v })}
          />
        </div>

        <div style={cardStyle}>
          <SubLabel>{copy.living.label}</SubLabel>
          <ChipRow<LivingTogether>
            options={copy.living.options}
            value={situation.living}
            onChange={(v) => update({ living: v })}
          />
        </div>

        <div style={cardStyle}>
          <SubLabel>{copy.children.label}</SubLabel>
          <ChipRow<'no' | 'yes'>
            options={[
              { value: 'no', label: copy.children.noLabel },
              { value: 'yes', label: copy.children.yesLabel },
            ]}
            value={situation.hasChildren}
            onChange={(v) => {
              if (v === 'no') update({ hasChildren: 'no', childrenCount: undefined });
              else update({ hasChildren: 'yes' });
            }}
          />
          {situation.hasChildren === 'yes' && (
            <div className="mt-2.5 pt-2.5" style={{ borderTop: `1px dashed ${colors.line}` }}>
              <div className="mb-1.5" style={{ color: colors.sub, fontSize: 11 }}>
                How many?
              </div>
              <ChipRow<ChildrenCount>
                options={copy.children.countOptions}
                value={situation.childrenCount}
                onChange={(v) => update({ childrenCount: v })}
              />
            </div>
          )}
        </div>

        <div style={cardStyle}>
          <SubLabel>{copy.home.label}</SubLabel>
          <ChipRow<Home>
            options={copy.home.options}
            value={situation.home}
            onChange={(v) => update({ home: v })}
          />
        </div>
      </div>
      <Footer
        caption={copy.ctaCaption(answered)}
        ctaLabel="Continue"
        enabled={answered === 4}
        onContinue={next}
      />
    </main>
  );
}
