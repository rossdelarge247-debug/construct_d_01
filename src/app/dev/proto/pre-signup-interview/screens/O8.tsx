'use client';

import { useState, type CSSProperties, type ReactNode } from 'react';
import { tokens } from '@/styles/tokens';
import { Arrow } from '../components/Arrow';
import { BrandBar } from '../components/BrandBar';
import { Footer } from '../components/Footer';
import { Hero } from '../components/Hero';
import { TopBar } from '../components/TopBar';
import { useProto } from '../lib/proto-context';
import { getCopy, type O8Copy, type O8Option, type O8OptionId } from '../lib/copy/o8';
import styles from './O8.module.css';
import focusVisibleStyles from '../components/focus-visible.module.css';

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

const ICONS: Record<O8OptionId, ({ size }: { size?: number }) => ReactNode> = {
  signup: IconWorkspace,
  download: IconDownload,
  conventional: IconExternal,
  support: IconSupport,
};

function PlanRecall({ copy }: { copy: O8Copy['planRecall'] }) {
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
        <span style={{ fontWeight: 500 }}>{copy.label}</span>
        <span style={{ color: colors.muted, fontSize: 10.5 }}>·</span>
        <span style={{ color: colors.muted, fontSize: 10.5, display: 'inline-flex', alignItems: 'center', gap: 3 }}>
          <Arrow dir="left" size={9} strokeWidth={2} />
          <span>{copy.backToPlan}</span>
        </span>
      </a>
    </div>
  );
}


function OptionCard({ option, selected, onSelect, staggerIndex }: {
  option: O8Option;
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
        className={`${styles.entry} ${styles.card} ${focusVisibleStyles.focusable}`}
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

export function O8() {
  const { back, next, answers } = useProto();
  const [selectedId, setSelectedId] = useState<O8OptionId | null>(null);
  const stage = answers.stage ?? 'thinking';
  const copy = getCopy(stage);
  const selected = copy.options.find((o) => o.id === selectedId);

  return (
    <main className={styles.main}>
      <BrandBar />
      <TopBar step={8} total={8} onBack={back} />
      <PlanRecall copy={copy.planRecall} />
      <Hero
        eyebrow={copy.hero.eyebrow}
        eyebrowColor={colors.magenta}
        heading={copy.hero.heading}
        helper={
          <>
            {copy.hero.helper.primary}{' '}
            <span style={{ color: colors.muted }}>{copy.hero.helper.secondary}</span>
          </>
        }
        className={styles.entry}
      />
      <fieldset className={styles.fieldset}>
        <legend className={styles.srOnly}>{copy.hero.heading}</legend>
        {copy.options.map((option, i) => (
          <OptionCard
            key={option.id}
            option={option}
            selected={selectedId === option.id}
            onSelect={() => setSelectedId(option.id)}
            staggerIndex={i + 1}
          />
        ))}
      </fieldset>
      <Footer
        caption={selected ? '' : copy.footer.captionFallback}
        ctaLabel={selected?.cta ?? copy.footer.ctaFallback}
        enabled={!!selected}
        onContinue={next}
        variant="light"
      />
    </main>
  );
}
