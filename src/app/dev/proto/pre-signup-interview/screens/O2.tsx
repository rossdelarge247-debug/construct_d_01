'use client';

import type { CSSProperties, ReactNode } from 'react';
import { tokens } from '@/styles/tokens';
import { useProto } from '../lib/proto-context';
import { getCopy } from '../lib/copy/o2';
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

type ArrowDir = 'right' | 'left' | 'up' | 'down';

function Arrow({
  size = 13,
  strokeWidth = 1.8,
  dir = 'right',
}: {
  size?: number;
  strokeWidth?: number;
  dir?: ArrowDir;
}) {
  const r = { right: 0, left: 180, down: 90, up: 270 }[dir];
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ transform: `rotate(${r}deg)` }}
      aria-hidden="true"
    >
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

function StepRail({ current, total = 8 }: { current: number; total?: number }) {
  return (
    <div
      className="flex items-center gap-2.5"
      role="progressbar"
      aria-valuenow={current}
      aria-valuemin={1}
      aria-valuemax={total}
      aria-label={`Step ${current} of ${total}`}
    >
      <span style={{ color: colors.mute, fontSize: 9.5, fontFamily: tokens.font.mono }}>
        Step {current} / {total}
      </span>
      <div
        className="relative rounded-full overflow-hidden"
        style={{ width: 96, height: 3, background: colors.line }}
        aria-hidden="true"
      >
        <div
          className="absolute rounded-full"
          style={{ top: 0, bottom: 0, left: 0, width: `${(current / total) * 100}%`, background: colors.ink }}
        />
      </div>
    </div>
  );
}

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

function TopBar({ step, total = 8, onBack }: { step: number; total?: number; onBack: () => void }) {
  return (
    <div
      className="px-5 pt-3 pb-3 flex items-center justify-between"
      style={{ borderBottom: `1px solid ${colors.line}` }}
    >
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-1.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-current focus-visible:outline-offset-2"
        style={{
          color: colors.sub,
          fontSize: 11,
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          padding: 0,
        }}
      >
        <Arrow dir="left" size={11} />
        <span>Back</span>
      </button>
      <StepRail current={step} total={total} />
      <div style={{ width: 36 }} aria-hidden="true" />
    </div>
  );
}

function Hero({ eyebrow, heading }: { eyebrow: string; heading: TitleShape }) {
  return (
    <div className="px-5 pt-4 pb-2">
      <div
        style={{
          color: colors.violet,
          fontSize: 9.5,
          fontFamily: tokens.font.mono,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
        }}
      >
        {eyebrow}
      </div>
      <h2
        style={{
          fontFamily: tokens.font.serif,
          fontSize: 26,
          lineHeight: 1.05,
          letterSpacing: '-0.02em',
          fontWeight: 600,
          margin: '8px 0 0 0',
        }}
      >
        {heading.kind === 'plain' ? (
          heading.text
        ) : (
          <>
            {heading.bold}{' '}
            <span style={{ fontStyle: 'italic', fontWeight: 400 }}>{heading.accent}</span>
            {heading.period ? '.' : ''}
          </>
        )}
      </h2>
    </div>
  );
}

function Footer({
  answered,
  total = 4,
  ctaCaption,
  onContinue,
}: {
  answered: number;
  total?: number;
  ctaCaption: string;
  onContinue: () => void;
}) {
  const enabled = answered === total;
  return (
    <div
      className="px-5 pt-3 pb-4"
      style={{
        borderTop: `1px solid ${colors.line}`,
        background: 'rgba(255,255,255,0.6)',
        backdropFilter: 'blur(10px)',
      }}
    >
      <div
        className="flex items-center justify-center mb-2.5"
        style={{ color: colors.mute, fontSize: 10 }}
      >
        <span>{ctaCaption}</span>
      </div>
      <button
        type="button"
        onClick={onContinue}
        disabled={!enabled}
        className="focus-visible:outline focus-visible:outline-2 focus-visible:outline-current focus-visible:outline-offset-2"
        style={{
          width: '100%',
          background: enabled ? colors.ink : colors.line,
          color: enabled ? '#FFFFFF' : colors.disabled,
          padding: '13px 18px',
          borderRadius: 999,
          fontSize: 14,
          fontWeight: 600,
          border: 'none',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          cursor: enabled ? 'pointer' : 'not-allowed',
        }}
      >
        <span>Continue</span>
        <Arrow dir="right" size={13} strokeWidth={2} />
      </button>
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
  const stage = answers.stage ?? 'considering';
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
    <div className="flex flex-col min-h-screen w-full max-w-[480px] mx-auto">
      <TopBar step={step} onBack={back} />
      <Hero eyebrow={copy.eyebrow} heading={copy.heading} />
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
        answered={answered}
        total={4}
        ctaCaption={copy.ctaCaption(answered)}
        onContinue={next}
      />
    </div>
  );
}
