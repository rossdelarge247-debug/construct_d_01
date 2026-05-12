'use client';

import { useState, type CSSProperties, type ReactNode } from 'react';
import { tokens } from '@/styles/tokens';
import { Arrow } from '../components/Arrow';
import { BrandBar } from '../components/BrandBar';
import { Hero } from '../components/Hero';
import { TopBar } from '../components/TopBar';
import { useProto } from '../lib/proto-context';
import styles from './O8.module.css';

const colors = {
  ink: tokens.color.ink,
  sub: tokens.color.text.sub,
  muted: tokens.color.text.muted,
  border: tokens.color.border,
  violet: tokens.color.accent.violet,
  magenta: tokens.color.accent.magenta,
};

const VIOLET_SOFT = '#F3EEFE';
const ICON_BG_UNSELECTED = '#FAFAF7';

const FONT_SERIF = 'var(--ds-font-serif, "Source Serif Pro", "Source Serif 4", Georgia, serif)';
const FONT_MONO = 'var(--ds-font-mono, "JetBrains Mono", ui-monospace, monospace)';

type OptionId = 'signup' | 'download' | 'conventional' | 'support';

type OptionDef = {
  id: OptionId;
  title: string;
  sub: string;
  cta: string;
};

const OPTIONS: ReadonlyArray<OptionDef> = [
  {
    id: 'signup',
    title: 'Create a free account and start building my picture',
    sub: 'Free to start; no card needed.',
    cta: 'Create my account',
  },
  {
    id: 'download',
    title: 'Download my plan and come back later',
    sub: "We'll keep your answers for 30 days if you want to come back.",
    cta: 'Download my plan',
  },
  {
    id: 'conventional',
    title: 'I want to go the conventional route',
    sub: "We'll point you to good starting places.",
    cta: 'See helpful links',
  },
  {
    id: 'support',
    title: 'I need to talk to someone first',
    sub: 'Here are people who can help.',
    cta: 'See support resources',
  },
];

function IconWorkspace({ size = 17 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3.5" y="4.5" width="17" height="13" rx="2" />
      <rect x="6.5" y="7.5" width="11" height="7" rx="1" />
      <circle cx="9" cy="10.5" r="1.1" />
      <path d="M7 14 L10 11.5 L13 13.5 L17 10" />
    </svg>
  );
}

function IconDownload({ size = 17 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M14 3.5 H7 a1.5 1.5 0 0 0-1.5 1.5 V19 a1.5 1.5 0 0 0 1.5 1.5 H17 a1.5 1.5 0 0 0 1.5-1.5 V8 Z" />
      <path d="M14 3.5 V8 H18.5" />
      <line x1="12" y1="11.5" x2="12" y2="16.5" />
      <polyline points="9.5 14 12 16.5 14.5 14" />
    </svg>
  );
}

function IconExternal({ size = 17 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M13.5 5 H19 V10.5" />
      <line x1="19" y1="5" x2="11.5" y2="12.5" />
      <path d="M17 13.5 V18 a2 2 0 0 1-2 2 H6 a2 2 0 0 1-2-2 V9 a2 2 0 0 1 2-2 H10.5" />
    </svg>
  );
}

function IconSupport({ size = 17 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3.5 6 a1.5 1.5 0 0 1 1.5-1.5 H15 a1.5 1.5 0 0 1 1.5 1.5 V12 a1.5 1.5 0 0 1-1.5 1.5 H8.5 L5 16.5 V13.5 a1.5 1.5 0 0 1-1.5-1.5 Z" />
      <path d="M8 16.5 a1.5 1.5 0 0 0 1.5 1.5 H15 L18.5 21 V18 a1.5 1.5 0 0 0 1.5-1.5 V11.5" />
    </svg>
  );
}

const ICONS: Record<OptionId, ({ size }: { size?: number }) => ReactNode> = {
  signup: IconWorkspace,
  download: IconDownload,
  conventional: IconExternal,
  support: IconSupport,
};

function PlanRecall() {
  return (
    <div style={{ padding: '12px 20px 0' }}>
      <a
        href="#"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          background: 'rgba(255,255,255,0.7)',
          border: `1px solid ${colors.border}`,
          borderRadius: 999,
          padding: '5px 11px 5px 9px',
          fontSize: 11,
          color: colors.ink,
          textDecoration: 'none',
          backdropFilter: 'blur(6px)',
        }}
      >
        <span aria-hidden="true" style={{
          width: 14, height: 14, borderRadius: 999,
          background: VIOLET_SOFT,
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          flex: 'none',
        }}>
          <svg width="9" height="9" viewBox="0 0 10 10" fill="none" aria-hidden="true">
            <path d="M2 5.2 L4.2 7.4 L8 3.2" stroke={colors.violet} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <span style={{ fontWeight: 500 }}>Your plan is ready</span>
        <span style={{ color: colors.muted, fontSize: 10.5 }}>·</span>
        <span style={{ color: colors.muted, fontSize: 10.5, display: 'inline-flex', alignItems: 'center', gap: 3 }}>
          <Arrow dir="left" size={9} strokeWidth={2} />
          <span>back to plan</span>
        </span>
      </a>
    </div>
  );
}


function OptionCard({ option, selected, onSelect, staggerIndex }: {
  option: OptionDef;
  selected: boolean;
  onSelect: () => void;
  staggerIndex: number;
}) {
  const Icon = ICONS[option.id];
  const inputId = `o8-opt-${option.id}`;
  const entryStyle: CSSProperties = { ['--stagger-index' as string]: staggerIndex };
  return (
    <div className={styles.cardWrapper}>
      <input
        type="radio"
        name="o8-next-step"
        id={inputId}
        value={option.id}
        checked={selected}
        onChange={onSelect}
        className={styles.srInput}
      />
      <label
        htmlFor={inputId}
        className={`${styles.entry} ${styles.card}`}
        style={{
          ...entryStyle,
          display: 'block',
          width: '100%',
          background: selected ? '#FFFFFF' : 'rgba(255,255,255,0.78)',
          border: selected ? `1.5px solid ${colors.ink}` : `1px solid ${colors.border}`,
          boxShadow: selected
            ? '0 1px 0 rgba(0,0,0,0.04), 0 6px 14px rgba(124,58,237,0.10)'
            : '0 1px 0 rgba(0,0,0,0.02)',
          borderRadius: 16,
          padding: '12px 13px',
          textAlign: 'left',
          cursor: 'pointer',
          transform: selected ? 'translateY(-0.5px)' : 'translateY(0)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 11 }}>
          <span aria-hidden="true" style={{
            flex: 'none',
            width: 18, height: 18, borderRadius: 999,
            border: `1.5px solid ${selected ? colors.ink : '#C9C5BD'}`,
            background: selected ? colors.ink : 'transparent',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            marginTop: 1,
          }}>
            {selected && (
              <span style={{
                width: 6, height: 6, borderRadius: 999, background: '#FFFFFF',
              }} />
            )}
          </span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontFamily: FONT_SERIF,
              fontSize: 14,
              lineHeight: 1.25,
              letterSpacing: '-0.005em',
              fontWeight: 600,
              color: colors.ink,
            }}>
              {option.title}
            </div>
            <div style={{
              fontSize: 11,
              color: colors.sub,
              lineHeight: 1.4,
              marginTop: 3,
            }}>
              {option.sub}
            </div>
          </div>
          <span aria-hidden="true" style={{
            flex: 'none',
            width: 32, height: 32, borderRadius: 10,
            background: selected ? colors.ink : ICON_BG_UNSELECTED,
            color: selected ? '#FFFFFF' : colors.muted,
            border: selected ? 'none' : `1px solid ${colors.border}`,
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            marginTop: 1,
          }}>
            <Icon size={17} />
          </span>
        </div>
      </label>
    </div>
  );
}

function Footer({ selected, onContinue }: { selected: OptionDef | undefined; onContinue: () => void }) {
  return (
    <div
      style={{
        position: 'sticky',
        bottom: 0,
        marginTop: 'auto',
        padding: '10px 20px 14px',
        borderTop: `1px solid ${colors.border}`,
        background: 'rgba(255,255,255,0.62)',
        backdropFilter: 'blur(10px)',
      }}
    >
      <div style={{ minHeight: 46, display: 'flex', alignItems: 'center' }}>
        {selected ? (
          <button
            type="button"
            onClick={onContinue}
            className={styles.cta}
            style={{
              width: '100%',
              background: colors.ink,
              color: '#FFFFFF',
              padding: '12px 18px',
              borderRadius: 999,
              fontSize: 14,
              fontWeight: 600,
              border: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              cursor: 'pointer',
            }}
          >
            <span>{selected.cta}</span>
            <Arrow dir="right" size={13} strokeWidth={2} />
          </button>
        ) : (
          <p style={{
            margin: 0,
            fontSize: 11,
            color: colors.sub,
            lineHeight: 1.45,
            textAlign: 'center',
            width: '100%',
          }}>
            Pick an option above to continue.
          </p>
        )}
      </div>
    </div>
  );
}

export function O8() {
  const { back, next } = useProto();
  const [selectedId, setSelectedId] = useState<OptionId | null>(null);
  const selected = OPTIONS.find((o) => o.id === selectedId);

  return (
    <main className={styles.main}>
      <BrandBar />
      <TopBar step={8} total={8} onBack={back} />
      <PlanRecall />
      <Hero
        eyebrow="What's next · take it from here"
        eyebrowColor={colors.magenta}
        heading="What would you like to do next?"
        helper={
          <>
            There&apos;s no wrong answer.{' '}
            <span style={{ color: colors.muted }}>You can come back anytime.</span>
          </>
        }
        className={styles.entry}
      />
      <fieldset className={styles.fieldset}>
        <legend className={styles.srOnly}>What would you like to do next?</legend>
        {OPTIONS.map((option, i) => (
          <OptionCard
            key={option.id}
            option={option}
            selected={selectedId === option.id}
            onSelect={() => setSelectedId(option.id)}
            staggerIndex={i + 1}
          />
        ))}
      </fieldset>
      <Footer selected={selected} onContinue={next} />
    </main>
  );
}
