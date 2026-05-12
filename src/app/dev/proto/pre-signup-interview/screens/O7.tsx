'use client';

import { useEffect, useState, type CSSProperties, type ReactNode } from 'react';
import { tokens } from '@/styles/tokens';
import { BrandBar } from '../components/BrandBar';
import { Footer } from '../components/Footer';
import { Hero } from '../components/Hero';
import { TopBar } from '../components/TopBar';
import { useProto } from '../lib/proto-context';
import { buildPlanFromAnswers } from '../lib/build-plan';
import type { Answers } from '../lib/types';
import styles from './O7.module.css';

type O7State = 'generating' | 'ready';

const GENERATING_DURATION_MS = 3000;

const colors = {
  ink: tokens.color.ink,
  sub: tokens.color.text.sub,
  muted: tokens.color.text.muted,
  border: tokens.color.border,
  violet: tokens.color.accent.violet,
  magenta: tokens.color.accent.magenta,
};

const VIOLET_SOFT = '#F3EEFE';
const MAGENTA_SOFT = '#FCE7F3';
const PAPER_WARM = '#FBFAF6';
const SOFT = '#FAFAF7';
const SOFTMUTE = '#9A968E';

const EXPRESSIVE_HERO = 'linear-gradient(180deg, #F3EEFE 0%, #FCE7F3 200px, #FBFAF6 460px)';
const GENERATING_BG = 'linear-gradient(180deg, #F3EEFE 0%, #FCE7F3 360px, #FBFAF6 720px)';

const FONT_SERIF = 'var(--ds-font-serif, "Source Serif Pro", "Source Serif 4", Georgia, serif)';
const FONT_MONO = 'var(--ds-font-mono, "JetBrains Mono", ui-monospace, monospace)';

function DownloadIcon({ size = 14, sw = 1.8 }: { size?: number; sw?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

function MailIcon({ size = 14, sw = 1.8 }: { size?: number; sw?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22 6 12 13 2 6" />
    </svg>
  );
}

function CheckIcon({ size = 8 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
         stroke="#FFFFFF" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function Eyebrow({ children, color = colors.muted }: { children: ReactNode; color?: string }) {
  return (
    <div style={{
      fontFamily: FONT_MONO,
      fontSize: 10.5,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      color,
    }}>
      {children}
    </div>
  );
}

function BreathingHalo({ size = 180 }: { size?: number }) {
  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <div
        className={styles.breath}
        style={{
          position: 'absolute', inset: 0, borderRadius: '50%',
          background: 'radial-gradient(closest-side, rgba(190,24,93,0.18), rgba(124,58,237,0.10) 55%, transparent 75%)',
        }}
      />
      <div
        className={styles.breathReverse}
        style={{
          position: 'absolute', inset: 0, borderRadius: '50%',
          background: 'radial-gradient(closest-side, rgba(255,255,255,0.85), transparent 60%)',
          transform: 'scale(0.55)',
        }}
      />
      <div style={{
        position: 'absolute',
        left: '50%', top: '50%', width: 8, height: 8,
        marginLeft: -4, marginTop: -4,
        borderRadius: '50%',
        background: colors.magenta,
        boxShadow: `0 0 0 6px ${MAGENTA_SOFT}, 0 0 0 14px rgba(190,24,93,0.06)`,
      }} />
    </div>
  );
}

function MobileHero() {
  return (
    <div style={{
      background: EXPRESSIVE_HERO,
      borderBottom: `1px solid ${colors.border}`,
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: -120, right: -100,
        width: 320, height: 320, borderRadius: '50%',
        background: 'radial-gradient(closest-side, rgba(255,255,255,0.7), transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{ position: 'relative' }}>
        <Hero
          eyebrow="Your plan is ready"
          eyebrowColor={colors.violet}
          heading={
            <>
              Here&apos;s{' '}
              <span style={{ fontStyle: 'italic', fontWeight: 400, color: colors.magenta }}>your plan</span>
              .
            </>
          }
          helper="Built from your six answers — a warm picture of where you are, what's ahead, and what your options are."
          helperVariant="italic-serif"
        />
        <div style={{ padding: '8px 20px 22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <button type="button" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '8px 14px', borderRadius: 999,
              background: '#FFFFFF', border: `1px solid ${colors.ink}`,
              color: colors.ink, fontSize: 12, fontWeight: 600, cursor: 'pointer',
            }}>
              <DownloadIcon size={12} />
              <span>Save as PDF</span>
            </button>
            <a href="#" style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              fontSize: 12, padding: '6px 8px', color: colors.sub, textDecoration: 'none',
            }}>
              <MailIcon size={11} />
              <span style={{ textDecoration: 'underline', textUnderlineOffset: 4 }}>Email it to me</span>
            </a>
          </div>
          <div style={{ marginTop: 12, fontSize: 10.5, color: colors.muted }}>
            ~5 min read · 4 pages · yours to keep
          </div>
        </div>
      </div>
    </div>
  );
}

function MobileSectionHeader({
  eyebrow, title, sub, eyebrowColor = colors.muted,
}: {
  eyebrow?: string; title: string; sub?: string; eyebrowColor?: string;
}) {
  return (
    <div style={{ marginBottom: 18 }}>
      {eyebrow && <Eyebrow color={eyebrowColor}>{eyebrow}</Eyebrow>}
      <h2 style={{
        fontFamily: FONT_SERIF,
        margin: '8px 0 0',
        fontSize: 24,
        lineHeight: 1.12,
        letterSpacing: '-0.018em',
        fontWeight: 600,
        color: colors.ink,
      }}>
        {title}
      </h2>
      {sub && (
        <p style={{
          fontFamily: FONT_SERIF,
          fontStyle: 'italic',
          margin: '10px 0 0',
          fontSize: 14,
          color: colors.sub,
          lineHeight: 1.5,
        }}>
          {sub}
        </p>
      )}
    </div>
  );
}

const SECTION_PAD: CSSProperties = { padding: '32px 20px 8px' };

function sectionEntryStyle(staggerIndex: number): CSSProperties {
  return { ...SECTION_PAD, ['--stagger-index' as string]: staggerIndex };
}

function SituationSummary({ summary, staggerIndex }: { summary: string; staggerIndex: number }) {
  return (
    <section className={styles.entry} style={sectionEntryStyle(staggerIndex)}>
      <MobileSectionHeader eyebrow="Section 1 · what you told us" title="Your situation" eyebrowColor={colors.violet} />
      <div style={{
        background: '#FFFFFF',
        border: `1px solid ${colors.border}`,
        borderRadius: 16,
        padding: 16,
        fontSize: 14,
        lineHeight: 1.55,
        color: colors.ink,
      }}>
        {summary}
      </div>
    </section>
  );
}

type JourneyStage = { key: string; label: string; sub: string };

function DivorceJourney({ stages, currentStageKey, staggerIndex }: {
  stages: ReadonlyArray<JourneyStage>;
  currentStageKey: string | undefined;
  staggerIndex: number;
}) {
  return (
    <section className={styles.entry} style={sectionEntryStyle(staggerIndex)}>
      <MobileSectionHeader eyebrow="Section 2 · the journey" title="What separation looks like" eyebrowColor={colors.violet} />
      <ol style={{
        margin: 0,
        padding: 0,
        listStyle: 'none',
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
      }}>
        {stages.map((stage, i) => {
          const isCurrent = currentStageKey !== undefined && stage.key === currentStageKey;
          return (
            <li key={stage.key} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
              <div style={{
                width: 22, height: 22, flexShrink: 0,
                borderRadius: '50%',
                background: isCurrent ? colors.magenta : '#FFFFFF',
                border: isCurrent ? 'none' : `1.5px solid ${colors.border}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: FONT_MONO,
                fontSize: 10,
                color: isCurrent ? '#FFFFFF' : SOFTMUTE,
                fontWeight: 600,
              }}>
                {i + 1}
              </div>
              <div style={{ flex: 1, paddingTop: 1 }}>
                <div style={{
                  fontFamily: FONT_SERIF,
                  fontSize: 14.5,
                  lineHeight: 1.45,
                  color: isCurrent ? colors.ink : colors.sub,
                  fontWeight: isCurrent ? 600 : 400,
                }}>
                  {stage.label}
                  {isCurrent && (
                    <span style={{
                      marginLeft: 8,
                      fontFamily: FONT_MONO,
                      fontSize: 9,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      color: colors.magenta,
                    }}>
                      you are here
                    </span>
                  )}
                </div>
                {stage.sub && (
                  <div style={{
                    marginTop: 4,
                    fontSize: 12.5,
                    lineHeight: 1.45,
                    color: colors.muted,
                  }}>
                    {stage.sub}
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

function WhatNeedsToHappen({ items, staggerIndex }: { items: ReadonlyArray<string>; staggerIndex: number }) {
  return (
    <section className={styles.entry} style={sectionEntryStyle(staggerIndex)}>
      <MobileSectionHeader eyebrow="Section 3 · tailored to you" title="What needs to happen" eyebrowColor={colors.violet} />
      <ul style={{
        margin: 0,
        padding: 0,
        listStyle: 'none',
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
      }}>
        {items.map((item, i) => (
          <li key={`${i}-${item.slice(0, 16)}`} style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 10,
            padding: '12px 14px',
            background: SOFT,
            border: `1px solid ${colors.border}`,
            borderRadius: 12,
            fontSize: 14,
            lineHeight: 1.5,
            color: colors.ink,
          }}>
            <span style={{
              fontFamily: FONT_MONO,
              fontSize: 11,
              fontWeight: 600,
              color: colors.violet,
              flexShrink: 0,
              minWidth: 18,
            }}>
              {String(i + 1).padStart(2, '0')}
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

type ConventionalPathData = { headline: string; cost: string; timeline: string; body: string };

function ConventionalPath({ path, staggerIndex }: { path: ConventionalPathData; staggerIndex: number }) {
  return (
    <section className={styles.entry} style={sectionEntryStyle(staggerIndex)}>
      <MobileSectionHeader eyebrow="Section 4 · for comparison" title={path.headline} eyebrowColor={SOFTMUTE} />
      <div style={{
        background: PAPER_WARM,
        border: `1px solid ${colors.border}`,
        borderRadius: 16,
        padding: 18,
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
      }}>
        <div style={{
          fontFamily: FONT_SERIF,
          fontSize: 22,
          fontWeight: 600,
          lineHeight: 1.15,
          color: colors.ink,
          letterSpacing: '-0.02em',
        }}>
          {path.cost}
        </div>
        <div style={{ fontFamily: FONT_MONO, fontSize: 11, color: colors.muted, letterSpacing: '0.04em' }}>
          {path.timeline}
        </div>
        <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.55, color: colors.sub }}>
          {path.body}
        </p>
      </div>
    </section>
  );
}

type DecoupleHelpsData = { headline: string; body: string; pillars: ReadonlyArray<string> };

function DecoupleHelps({ help, staggerIndex }: { help: DecoupleHelpsData; staggerIndex: number }) {
  return (
    <section className={styles.entry} style={sectionEntryStyle(staggerIndex)}>
      <MobileSectionHeader eyebrow="Section 5 · how decouple helps" title={help.headline} eyebrowColor={colors.violet} />
      <p style={{ margin: '0 0 14px', fontSize: 14, lineHeight: 1.55, color: colors.ink }}>
        {help.body}
      </p>
      <ul style={{
        margin: 0,
        padding: 0,
        listStyle: 'none',
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: 10,
      }}>
        {help.pillars.map((pillar) => (
          <li key={pillar} style={{
            padding: '12px 12px',
            background: VIOLET_SOFT,
            border: `1px solid ${colors.border}`,
            borderRadius: 12,
            fontFamily: FONT_SERIF,
            fontSize: 13,
            lineHeight: 1.35,
            color: colors.ink,
            fontWeight: 500,
          }}>
            {pillar}
          </li>
        ))}
      </ul>
    </section>
  );
}

type PersonalisedNote = { trigger: string; body: string };

function PersonalisedNotes({ notes, staggerIndex }: {
  notes: ReadonlyArray<PersonalisedNote>;
  staggerIndex: number;
}) {
  if (notes.length === 0) return null;
  return (
    <section className={styles.entry} style={sectionEntryStyle(staggerIndex)}>
      <MobileSectionHeader
        eyebrow="Section 6 · your specific notes"
        title="Things to bear in mind"
        sub="Drawn from the corners of your situation that need extra care."
        eyebrowColor={colors.magenta}
      />
      <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {notes.map((note) => (
          <li key={note.trigger} style={{
            padding: '14px 16px',
            background: '#FFFFFF',
            border: `1px solid ${colors.border}`,
            borderLeft: `3px solid ${colors.magenta}`,
            borderRadius: 12,
            fontSize: 13.5,
            lineHeight: 1.55,
            color: colors.ink,
          }}>
            {note.body}
          </li>
        ))}
      </ul>
    </section>
  );
}

type DisclosureState = 'done' | 'working' | 'pending';

const DISCLOSURE_STEPS: ReadonlyArray<{ label: string; state: DisclosureState }> = [
  { label: 'Listening to your situation', state: 'done' },
  { label: 'Mapping the journey', state: 'done' },
  { label: 'Tailoring next steps', state: 'done' },
  { label: 'Comparing the conventional path', state: 'working' },
  { label: 'Writing your specific notes', state: 'pending' },
];

function MobileGeneratingView() {
  const { back } = useProto();
  return (
    <div style={{ position: 'relative', minHeight: 'calc(100vh - 24px)', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, background: GENERATING_BG }} aria-hidden="true" />
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', minHeight: 'inherit' }}>
        <TopBar step={7} onBack={back} />

        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '32px 28px',
          textAlign: 'center',
        }}>
          <BreathingHalo size={180} />

          <div style={{ marginTop: 28 }}>
            <Eyebrow color={colors.violet}>Building your plan</Eyebrow>
            <h1 style={{
              fontFamily: FONT_SERIF,
              margin: '12px 0 0',
              fontSize: 28,
              lineHeight: 1.1,
              fontWeight: 600,
              letterSpacing: '-0.02em',
              color: colors.ink,
            }}>
              Take a <span style={{ fontStyle: 'italic', fontWeight: 400, color: colors.magenta }}>breath</span>.
            </h1>
            <p style={{
              fontFamily: FONT_SERIF,
              fontStyle: 'italic',
              margin: '12px auto 0',
              fontSize: 14,
              lineHeight: 1.55,
              color: colors.sub,
              maxWidth: 280,
            }}>
              We&apos;re shaping this around the six things you&apos;ve told us. There&apos;s no clock here — we&apos;ll be ready when you are.
            </p>
          </div>

          <ul
            role="status"
            aria-live="polite"
            aria-label="Plan generation progress"
            style={{
              marginTop: 28,
              padding: 0,
              listStyle: 'none',
              width: '100%',
              maxWidth: 280,
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
              textAlign: 'left',
            }}
          >
            {DISCLOSURE_STEPS.map(({ label, state }) => {
              const isDone = state === 'done';
              const isWorking = state === 'working';
              return (
                <li key={label} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  fontSize: 13,
                  color: isDone ? colors.ink : colors.muted,
                  opacity: isDone ? 1 : 0.55,
                }}>
                  <span aria-hidden="true" style={{
                    width: 14, height: 14, borderRadius: '50%',
                    background: isDone ? colors.violet : 'transparent',
                    border: isDone ? 'none' : `1.5px solid ${colors.muted}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    {isDone && <CheckIcon size={8} />}
                  </span>
                  <span style={{ flex: 1 }}>{label}</span>
                  {isWorking && (
                    <span style={{
                      fontFamily: FONT_MONO,
                      fontSize: 10,
                      color: colors.violet,
                      letterSpacing: '0.04em',
                    }}>
                      working…
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        <div style={{ padding: '16px 24px 22px' }}>
          <div style={{
            fontFamily: FONT_SERIF,
            fontStyle: 'italic',
            textAlign: 'center',
            fontSize: 12.5,
            color: colors.muted,
            lineHeight: 1.5,
          }}>
            &ldquo;A warm hand on a cold day.&rdquo;
          </div>
        </div>
      </div>
    </div>
  );
}

function MobileReadyView({ onNext, answers }: {
  onNext: () => void;
  answers: Answers;
}) {
  const { back } = useProto();
  const plan = buildPlanFromAnswers(answers);
  return (
    <div className={styles.fadeIn} style={{ display: 'flex', flexDirection: 'column' }}>
      <TopBar step={7} onBack={back} />
      <MobileHero />
      <SituationSummary summary={plan.situationSummary} staggerIndex={1} />
      <DivorceJourney stages={plan.journeyStages} currentStageKey={answers.stage} staggerIndex={2} />
      <WhatNeedsToHappen items={plan.whatNeedsToHappen} staggerIndex={3} />
      <ConventionalPath path={plan.conventionalPath} staggerIndex={4} />
      <DecoupleHelps help={plan.howDecoupleHelps} staggerIndex={5} />
      <PersonalisedNotes notes={plan.personalisedNotes} staggerIndex={6} />
      <Footer
        ctaLabel="What's next"
        onContinue={onNext}
        secondaryActions={
          <>
            <button type="button" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '10px 14px', borderRadius: 999,
              background: '#FFFFFF', color: colors.ink, border: `1px solid ${colors.ink}`,
              fontSize: 12.5, fontWeight: 600, cursor: 'pointer',
            }}>
              <DownloadIcon size={12} />
              <span>Download as PDF</span>
            </button>
            <a href="#" style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              fontSize: 12.5, padding: '6px 8px', color: colors.sub, textDecoration: 'none',
            }}>
              <MailIcon size={11} />
              <span style={{ textDecoration: 'underline', textUnderlineOffset: 4 }}>Email link</span>
            </a>
          </>
        }
      />
    </div>
  );
}

export function O7() {
  const { answers, next } = useProto();
  const [state, setState] = useState<O7State>('generating');

  useEffect(() => {
    const timer = setTimeout(() => setState('ready'), GENERATING_DURATION_MS);
    return () => clearTimeout(timer);
  }, []);

  return (
    <main className={styles.main}>
      <BrandBar />
      {state === 'generating' ? <MobileGeneratingView /> : <MobileReadyView onNext={next} answers={answers} />}
    </main>
  );
}
