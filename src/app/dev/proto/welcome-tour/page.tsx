'use client';

import { useState, useEffect, type CSSProperties, type ReactNode } from 'react';
import { tokens } from '@/styles/tokens';

/* =========================================================================
   TWEAK DEFAULTS
   ========================================================================= */
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  start_step: 0,
  show_step_numbers: true,
  accent_tone: 'calm',
  large_type: true,
}/*EDITMODE-END*/;

type Tweaks = {
  start_step: number;
  show_step_numbers: boolean;
  accent_tone: string;
  large_type: boolean;
};

/* =========================================================================
   TOKENS
   ========================================================================= */
const INK = tokens.color.ink;
const SUB = tokens.color.text.sub;
const MUTE = tokens.color.text.muted;
const LINE = tokens.color.border;
const BG = tokens.color.surface.page;
const PANEL = tokens.color.surface.panel;
const CANVAS = tokens.color.surface.canvas;

type Phase = {
  n: string;
  k: string;
  kicker: string;
  title: string;
  sub: string;
  body: string;
  accent: string;
  accentSoft: string;
  hue: number;
  illo: string;
};

const PHASES: Phase[] = [
  {
    n: '01',
    k: 'prepare',
    kicker: 'Phase 1 · Disclose',
    title: 'Prepare your disclosure.',
    sub: 'Ditch the bank statements, spreadsheets and Word docs.',
    body: 'Connect your accounts once — Decouple reads twelve months of history, classifies every transaction, and assembles your financial picture in the background. Read-only. Bank-grade encryption. Faster and safer than paperwork.',
    accent: '#4338CA',
    accentSoft: '#EEF2FF',
    hue: 265,
    illo: 'disclose',
  },
  {
    n: '02',
    k: 'share',
    kicker: 'Phase 2 · Reconcile',
    title: 'Share your position with your ex.',
    sub: 'Reconcile your shared household quickly — with minimal conflict.',
    body: 'Invite your ex-partner to build their picture alongside yours. Decouple reconciles the two, surfaces differences side by side, and walks you through each one in plain language. Mediation stays optional, not required.',
    accent: '#9D174D',
    accentSoft: '#FCE7F3',
    hue: 335,
    illo: 'share',
  },
  {
    n: '03',
    k: 'build',
    kicker: 'Phase 3 · Settle',
    title: 'Build your proposal.',
    sub: 'Negotiate with AI legal assurance and reasonableness flags.',
    body: 'Model splits in real time. Every proposal is scored for reasonableness against case precedent; every clause has plain-English translation and legal provenance. You stay in control — we keep you inside the lines of what a court would accept.',
    accent: '#0369A1',
    accentSoft: '#E0F2FE',
    hue: 205,
    illo: 'build',
  },
  {
    n: '04',
    k: 'finalise',
    kicker: 'Phase 4 · Finalise',
    title: 'Finalise your agreement.',
    sub: 'Generate court-ready documents in minutes, not months.',
    body: "Once you're both aligned, Decouple drafts your Consent Order, Form D81, and supporting disclosure bundle. Share with a solicitor for a final review, or submit digitally. Complete the process with a fraction of the hassle and cost.",
    accent: '#166534',
    accentSoft: '#DCFCE7',
    hue: 145,
    illo: 'finalise',
  },
];

const TOTAL_STEPS = PHASES.length + 2; // intro + 4 phases + dashboard
const INTRO_STEP = 0;
const DASH_STEP = TOTAL_STEPS - 1;

/* =========================================================================
   ICONS
   ========================================================================= */
type IcProps = {
  children: ReactNode;
  size?: number;
  sw?: number;
  style?: CSSProperties;
};

const Ic = ({ children, size = 18, sw = 1.75, style }: IcProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
       strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" style={style}>{children}</svg>
);

type IconProps = Omit<IcProps, 'children'>;

const ArrowRight = (p: IconProps) => <Ic {...p}><line x1="5" y1="12" x2="19" y2="12"/><polyline points="13 6 19 12 13 18"/></Ic>;
const ArrowLeft  = (p: IconProps) => <Ic {...p}><line x1="19" y1="12" x2="5" y2="12"/><polyline points="11 18 5 12 11 6"/></Ic>;
const Close      = (p: IconProps) => <Ic {...p}><line x1="5" y1="5" x2="19" y2="19"/><line x1="19" y1="5" x2="5" y2="19"/></Ic>;
const Shield     = (p: IconProps) => <Ic {...p}><path d="M12 3l8 3v6c0 5-3.5 8.5-8 9-4.5-.5-8-4-8-9V6z"/></Ic>;
const Lock       = (p: IconProps) => <Ic {...p}><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></Ic>;
const Sparkles   = (p: IconProps) => <Ic {...p}><path d="M12 3l1.5 5L18 9.5 13.5 11 12 16l-1.5-5L6 9.5 10.5 8z"/><path d="M19 15l.9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9z"/></Ic>;
const Check      = (p: IconProps) => <Ic {...p}><polyline points="5 12 10 17 19 7"/></Ic>;
const Plus       = (p: IconProps) => <Ic {...p}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></Ic>;
const Upload     = (p: IconProps) => <Ic {...p}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></Ic>;
const Settings   = (p: IconProps) => <Ic {...p}><circle cx="12" cy="12" r="3"/><path d="M19 13.5a2 2 0 0 0 .3 1.8l.1.1a1.8 1.8 0 1 1-2.6 2.6l-.1-.1a2 2 0 0 0-3.3 1.4V21a1.8 1.8 0 1 1-3.7 0v-.1a2 2 0 0 0-3.3-1.4l-.1.1A1.8 1.8 0 1 1 3.7 17l.1-.1a2 2 0 0 0-1.4-3.3H2a1.8 1.8 0 1 1 0-3.7h.1A2 2 0 0 0 3.7 6.6l-.1-.1A1.8 1.8 0 1 1 6.2 3.9l.1.1a2 2 0 0 0 3.3-1.4V2a1.8 1.8 0 1 1 3.7 0v.1a2 2 0 0 0 3.3 1.4l.1-.1a1.8 1.8 0 1 1 2.6 2.6l-.1.1a2 2 0 0 0 1.4 3.3H21a1.8 1.8 0 1 1 0 3.7h-.1a2 2 0 0 0-1.4 1.4z"/></Ic>;
const Bell       = (p: IconProps) => <Ic {...p}><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/></Ic>;
const Help       = (p: IconProps) => <Ic {...p}><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3.5"/></Ic>;

/* =========================================================================
   WORDMARK
   ========================================================================= */
function Wordmark({ small }: { small?: boolean }) {
  return (
    <div className="flex items-center gap-2 select-none">
      <div className="relative" style={{ width: small ? 20 : 22, height: small ? 20 : 22 }} aria-hidden>
        <div className="absolute inset-0 rounded-full" style={{ background: '#111' }}/>
        <div className="absolute rounded-full" style={{ left:'42%', top:0, width:'58%', height:'100%', background: BG }}/>
        <div className="absolute rounded-full" style={{ left:'45%', top:'12%', width:'10%', height:'76%', background:'#111' }}/>
      </div>
      <span style={{ fontSize: small ? 14.5 : 16, letterSpacing: '-0.01em', fontWeight: 600, color: '#111' }}>
        decouple
      </span>
    </div>
  );
}

/* =========================================================================
   TOP BAR — main nav visible; left & right nav deliberately hidden
   ========================================================================= */
function TopBar({ onExit, step }: { onExit: () => void; step: number }) {
  const isDash = step === DASH_STEP;
  return (
    <header
      className="flex items-center justify-between px-5 flex-shrink-0 relative z-30"
      style={{ height: 56, borderBottom: `1px solid ${LINE}`, background: PANEL }}>
      <div className="flex items-center gap-3">
        <Wordmark small/>
        <span style={{ color: '#E5E7EB' }}>/</span>
        <div className="flex items-center gap-1.5 text-[12.5px]">
          <span style={{ color: INK, fontWeight: 600 }}>
            {isDash ? 'Dashboard' : 'Welcome'}
          </span>
          {!isDash && (
            <>
              <span style={{ color: '#D4D4D4' }}>·</span>
              <span style={{ color: MUTE }}>First-time tour</span>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {!isDash && (
          <button
            onClick={onExit}
            className="flex items-center gap-1.5 h-8 px-2.5 rounded-md text-[12px]"
            style={{ color: MUTE }}
            onMouseEnter={e => e.currentTarget.style.color = INK}
            onMouseLeave={e => e.currentTarget.style.color = MUTE}>
            Skip tour
            <Close size={13}/>
          </button>
        )}
        {isDash && (
          <>
            <button className="p-2 rounded-md hover:bg-gray-50" title="Help" style={{ color: SUB }}>
              <Help size={16}/>
            </button>
            <button className="p-2 rounded-md hover:bg-gray-50" title="Notifications" style={{ color: SUB }}>
              <Bell size={16}/>
            </button>
            <button className="p-2 rounded-md hover:bg-gray-50" title="Settings" style={{ color: SUB }}>
              <Settings size={16}/>
            </button>
          </>
        )}
        <div className="ml-1 flex items-center gap-2 pl-2" style={{ borderLeft: `1px solid ${LINE}`}}>
          <div className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-semibold"
               style={{ background: '#F5F3EE', color: '#57534E' }}>S</div>
          <div className="text-[12px] leading-tight pr-1">
            <div style={{ fontWeight: 600, color: INK }}>Sarah</div>
            <div style={{ color: MUTE, fontSize: 11 }}>Just joined</div>
          </div>
        </div>
      </div>
    </header>
  );
}

/* =========================================================================
   PROGRESS RAIL — floating at bottom of stage, not a traditional side nav
   ========================================================================= */
function ProgressRail({ step, go, phases }: { step: number; go: (s: number) => void; phases: Phase[] }) {
  if (step === DASH_STEP) return null;
  return (
    <div className="absolute left-1/2 bottom-10 -translate-x-1/2 z-20 flex items-center gap-3 px-4 py-2 rounded-full"
         style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(12px)', border: `1px solid ${LINE}`, boxShadow: '0 2px 20px rgba(0,0,0,0.04)' }}>
      {/* intro pill */}
      <button
        onClick={() => go(INTRO_STEP)}
        className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full transition"
        style={{
          background: step === INTRO_STEP ? INK : 'transparent',
          color: step === INTRO_STEP ? '#FFF' : SUB
        }}>
        <div className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-semibold"
             style={{ background: step === INTRO_STEP ? '#FFF' : '#E5E3DC', color: step === INTRO_STEP ? INK : SUB }}>
          ·
        </div>
        <span className="text-[11px] font-medium tracking-wide">Intro</span>
      </button>

      <div className="w-px h-4" style={{ background: LINE }}/>

      {phases.map((p, i) => {
        const target = i + 1;
        const active  = step === target;
        const passed  = step > target;
        return (
          <button
            key={p.k}
            onClick={() => go(target)}
            className="flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-full pdot group"
            style={{
              background: active ? INK : 'transparent',
              color: active ? '#FFF' : (passed ? INK : MUTE)
            }}>
            <div className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-semibold pdot"
                 style={{
                   background: active ? '#FFF' : (passed ? INK : 'transparent'),
                   color: active ? INK : (passed ? '#FFF' : MUTE),
                   border: active ? 'none' : `1px solid ${passed ? INK : '#D6D3CC'}`
                 }}>
              {passed ? <Check size={10} sw={3}/> : (i+1)}
            </div>
            <span className="text-[11px] font-medium tracking-wide">{p.k[0].toUpperCase()+p.k.slice(1)}</span>
          </button>
        );
      })}

      <div className="w-px h-4" style={{ background: LINE }}/>

      <button
        onClick={() => go(DASH_STEP)}
        className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium"
        style={{ color: MUTE }}>
        <span>Finish</span>
        <ArrowRight size={12}/>
      </button>
    </div>
  );
}

/* =========================================================================
   INTRO STAGE — a calm opening before the phase cards
   ========================================================================= */
function IntroStage({ onStart, onSkip }: { onStart: () => void; onSkip: () => void }) {
  return (
    <div className="w-full h-full flex items-center justify-center relative">
      {/* soft orb */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="orb-spin" style={{
          width: 820, height: 820, borderRadius: '50%',
          background: 'conic-gradient(from 0deg, rgba(67,56,202,0.06), rgba(157,23,77,0.05), rgba(3,105,161,0.06), rgba(22,101,52,0.05), rgba(67,56,202,0.06))',
          filter: 'blur(30px)'
        }}/>
      </div>

      <div className="relative max-w-[760px] w-full px-10 text-center card-anim">
        <div className="label-xs" style={{ color: MUTE }}>Welcome, Sarah</div>
        <h1 className="serif mt-5" style={{ fontSize: 72, fontWeight: 600, letterSpacing: '-0.035em', lineHeight: 1.02, color: INK }}>
          Four steps to a<br/>
          <span style={{ fontStyle: 'italic', color: '#57534E' }}>decoupled</span> life.
        </h1>
        <p className="mt-7 mx-auto" style={{ fontSize: 17, lineHeight: 1.55, color: SUB, maxWidth: 520 }}>
          No paper. No spreadsheets. No back-and-forth over email.
          A single focused workspace that takes you from disclosure
          to court-ready documents — calmly, and in the right order.
        </p>

        <div className="mt-10 flex items-center justify-center gap-3">
          <button
            onClick={onStart}
            className="group inline-flex items-center gap-2 h-12 px-6 rounded-full text-white text-[14px] font-medium transition"
            style={{ background: INK }}
            onMouseEnter={e => e.currentTarget.style.background = '#000'}
            onMouseLeave={e => e.currentTarget.style.background = INK}>
            Take the tour
            <ArrowRight size={15} sw={2.2}/>
          </button>
          <button
            onClick={onSkip}
            className="h-12 px-5 rounded-full text-[13.5px]"
            style={{ color: SUB }}>
            Skip to dashboard
          </button>
        </div>

        <div className="mt-14 flex items-center justify-center gap-6 text-[11.5px]" style={{ color: MUTE }}>
          <div className="flex items-center gap-1.5"><Shield size={12}/> Bank-grade encryption</div>
          <div className="w-1 h-1 rounded-full" style={{ background: '#D6D3CC' }}/>
          <div className="flex items-center gap-1.5"><Lock size={12}/> Read-only access</div>
          <div className="w-1 h-1 rounded-full" style={{ background: '#D6D3CC' }}/>
          <div>Takes about 90 seconds</div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   PHASE STAGE — large hero card, one phase per step
   ========================================================================= */
function PhaseStage({ phase, index, onNext, onPrev, isLast }: { phase: Phase; index: number; total: number; onNext: () => void; onPrev: () => void; isLast: boolean }) {
  return (
    <div className="w-full h-full flex items-center justify-center relative">
      {/* soft color wash behind the card */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: `radial-gradient(circle at 50% 40%, ${phase.accentSoft} 0%, transparent 62%)`,
        opacity: 0.6
      }}/>

      <div className="relative w-full" style={{ maxWidth: 1120, padding: '0 56px' }}>
        <div className="card-anim">
          <div className="flex items-center gap-3">
            <div className="label-xs" style={{ color: phase.accent }}>{phase.kicker}</div>
            <div className="h-px flex-1 max-w-[60px]" style={{ background: '#D6D3CC' }}/>
            <div className="mono text-[11px] tabular" style={{ color: MUTE }}>
              step {index + 1} / {PHASES.length}
            </div>
          </div>

          <div className="mt-6 grid grid-cols-12 gap-10 items-center">
            <div className="col-span-7">
              <div className="serif" style={{ fontSize: 20, lineHeight: 1, color: phase.accent, fontStyle: 'italic', fontWeight: 600 }}>
                {phase.n}
              </div>
              <h2 className="serif mt-4" style={{ fontSize: 62, fontWeight: 600, letterSpacing: '-0.03em', lineHeight: 1.02, color: INK }}>
                {phase.title}
              </h2>
              <div className="serif mt-5" style={{ fontSize: 21, lineHeight: 1.35, color: SUB, fontWeight: 400, fontStyle: 'italic' }}>
                {phase.sub}
              </div>
              <p className="mt-7" style={{ fontSize: 15.5, lineHeight: 1.6, color: SUB, maxWidth: 520 }}>
                {phase.body}
              </p>
            </div>

            <div className="col-span-5">
              <PhaseIllustration phase={phase}/>
            </div>
          </div>

          <div className="mt-12 flex items-center justify-between">
            <button
              onClick={onPrev}
              className="flex items-center gap-1.5 h-10 px-4 rounded-full text-[13px]"
              style={{ color: SUB, background: 'transparent' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.04)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              <ArrowLeft size={14}/>
              Back
            </button>

            <div className="flex items-center gap-3">
              {!isLast && (
                <div className="text-[11.5px]" style={{ color: MUTE }}>
                  Press <span className="mono" style={{ padding: '1px 6px', border: `1px solid ${LINE}`, borderRadius: 4, background: PANEL }}>→</span> to continue
                </div>
              )}
              <button
                onClick={onNext}
                className="inline-flex items-center gap-2 h-11 pl-5 pr-4 rounded-full text-[13.5px] font-medium text-white transition"
                style={{ background: INK }}
                onMouseEnter={e => e.currentTarget.style.background = '#000'}
                onMouseLeave={e => e.currentTarget.style.background = INK}>
                {isLast ? 'Enter your dashboard' : 'Next'}
                <ArrowRight size={14} sw={2.2}/>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   PHASE ILLUSTRATIONS — abstract, CSS + SVG, no stock imagery
   ========================================================================= */
function PhaseIllustration({ phase }: { phase: Phase }) {
  if (phase.k === 'prepare')  return <IlloDisclose   phase={phase}/>;
  if (phase.k === 'share')    return <IlloShare      phase={phase}/>;
  if (phase.k === 'build')    return <IlloBuild      phase={phase}/>;
  if (phase.k === 'finalise') return <IlloFinalise   phase={phase}/>;
  return null;
}

/* --- 01 — bank line items streaming into a structured ledger --- */
function IlloDisclose({ phase }: { phase: Phase }) {
  const rows = [
    { m: 'Tesco Metro',       a: '−£48.32',  tag: 'Groceries',  bank: 'Monzo',   bc: '#14233C', bg: '#FFEEE7', mk: 'M' },
    { m: 'NHS Pensions',      a: '+£2,847',  tag: 'Salary',     bank: 'Monzo',   bc: '#14233C', bg: '#FFEEE7', mk: 'M' },
    { m: 'Halifax Mortgage',  a: '−£1,842',  tag: 'Housing',    bank: 'Halifax', bc: '#005EB8', bg: '#E6F0FA', mk: 'H' },
    { m: 'Aviva Life',        a: '−£1,250',  tag: 'Insurance',  bank: 'Halifax', bc: '#005EB8', bg: '#E6F0FA', mk: 'H' },
    { m: 'BG Energy',         a: '−£184.50', tag: 'Utilities',  bank: 'Monzo',   bc: '#14233C', bg: '#FFEEE7', mk: 'M' },
  ];
  return (
    <div className="relative rounded-2xl hairline p-5" style={{ background: PANEL, boxShadow: '0 4px 30px rgba(67,56,202,0.06)' }}>
      <div className="flex items-center justify-between">
        <div className="text-[12px] font-semibold" style={{ color: INK }}>Transactions · last 12 months</div>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full soft-pulse" style={{ background: '#059669' }}/>
          <span className="text-[10.5px]" style={{ color: MUTE }}>Syncing</span>
        </div>
      </div>
      <div className="mt-4 space-y-1.5">
        {rows.map((r, i) => (
          <div key={i} className="flex items-center gap-3 px-2 py-2 rounded-lg" style={{ background: i===1 ? phase.accentSoft : 'transparent' }}>
            <div className="w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold" style={{ background: r.bg, color: r.bc }}>{r.mk}</div>
            <div className="flex-1 min-w-0">
              <div className="text-[12px] font-medium truncate" style={{ color: INK }}>{r.m}</div>
              <div className="text-[10px]" style={{ color: MUTE }}>{r.bank} · {r.tag}</div>
            </div>
            <div className="mono text-[11px] tabular" style={{ color: r.a.startsWith('+') ? '#059669' : INK }}>{r.a}</div>
          </div>
        ))}
      </div>
      <div className="mt-4 h-px" style={{ background: LINE }}/>
      <div className="mt-3 flex items-center justify-between text-[10.5px]" style={{ color: MUTE }}>
        <div>1,284 classified · 3 need review</div>
        <div className="flex items-center gap-1"><Sparkles size={11} style={{ color: phase.accent }}/> AI categorised</div>
      </div>
    </div>
  );
}

/* --- 02 — two pictures side by side, reconciling --- */
function IlloShare({ phase }: { phase: Phase }) {
  return (
    <div className="relative rounded-2xl hairline p-6" style={{ background: PANEL, boxShadow: '0 4px 30px rgba(157,23,77,0.06)' }}>
      <div className="grid grid-cols-2 gap-3">
        {[
          { n: 'S', name: 'Sarah',  color: '#2F6D5F', complete: 100 },
          { n: 'M', name: 'Mark',   color: '#B45309', complete: 76 }
        ].map((p, i) => (
          <div key={i} className="rounded-xl p-3" style={{ background: CANVAS, border: `1px solid ${LINE}` }}>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-semibold text-white" style={{ background: p.color }}>{p.n}</div>
              <div className="text-[12px] font-semibold">{p.name}</div>
            </div>
            <div className="mt-3 space-y-1.5">
              {[0.85, 0.7, 0.55, 0.4].map((w, k) => (
                <div key={k} className="h-1.5 rounded-full" style={{ background: '#E5E3DC', width: `${(i===1 ? w*0.9 : w)*100}%` }}/>
              ))}
            </div>
            <div className="mt-3 flex items-center justify-between text-[10px]" style={{ color: MUTE }}>
              <span>Disclosure</span>
              <span className="tabular mono" style={{ color: p.color, fontWeight: 600 }}>{p.complete}%</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-xl p-3" style={{ background: phase.accentSoft, border: `1px dashed ${phase.accent}33` }}>
        <div className="flex items-center justify-between">
          <div className="text-[11px] font-semibold" style={{ color: phase.accent }}>Differences found</div>
          <div className="mono text-[10px] tabular" style={{ color: phase.accent }}>3 items</div>
        </div>
        <div className="mt-2 space-y-1.5">
          {[
            { l: 'Family home valuation', a: '£450k', b: '£510k' },
            { l: 'NHS pension CETV',       a: 'Pending', b: '£284k' },
            { l: 'Joint Halifax savings',  a: '£28.4k',  b: '£31.2k' }
          ].map((d, i) => (
            <div key={i} className="flex items-center gap-2 text-[11px]">
              <div className="flex-1 truncate" style={{ color: INK }}>{d.l}</div>
              <div className="mono tabular" style={{ color: SUB }}>{d.a}</div>
              <div className="w-3 text-center" style={{ color: MUTE }}>↔</div>
              <div className="mono tabular" style={{ color: SUB }}>{d.b}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* --- 03 — proposal slider with reasonableness gauge --- */
function IlloBuild({ phase }: { phase: Phase }) {
  return (
    <div className="relative rounded-2xl hairline p-6" style={{ background: PANEL, boxShadow: '0 4px 30px rgba(3,105,161,0.06)' }}>
      <div className="flex items-center justify-between">
        <div className="text-[12px] font-semibold">Proposal v3</div>
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full" style={{ background: '#DCFCE7' }}>
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#059669' }}/>
          <span className="text-[10.5px] font-semibold" style={{ color: '#166534' }}>Within reasonable range</span>
        </div>
      </div>

      <div className="mt-5">
        <div className="text-[10.5px] mb-2 flex items-center justify-between" style={{ color: MUTE }}>
          <span>Capital split — Sarah</span>
          <span className="mono tabular" style={{ color: INK, fontWeight: 600 }}>58%</span>
        </div>
        <div className="relative h-2 rounded-full overflow-hidden" style={{ background: '#F5F3EE' }}>
          {/* reasonable band */}
          <div className="absolute top-0 bottom-0 rounded-full" style={{ left: '48%', width: '22%', background: '#DCFCE7' }}/>
          {/* fill */}
          <div className="absolute top-0 bottom-0 rounded-full" style={{ width: '58%', background: phase.accent }}/>
          {/* marker */}
          <div className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full border-2" style={{ left: 'calc(58% - 7px)', background: PANEL, borderColor: phase.accent, boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}/>
        </div>
        <div className="mt-1.5 flex items-center justify-between text-[10px] mono tabular" style={{ color: MUTE }}>
          <span>50/50</span>
          <span style={{ color: '#166534' }}>reasonable band</span>
          <span>70/30</span>
        </div>
      </div>

      <div className="mt-5 rounded-xl p-3" style={{ background: CANVAS, border: `1px solid ${LINE}` }}>
        <div className="flex items-start gap-2.5">
          <div className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: phase.accentSoft, color: phase.accent }}>
            <Sparkles size={12}/>
          </div>
          <div className="flex-1">
            <div className="text-[11.5px] font-semibold" style={{ color: INK }}>Legal check</div>
            <div className="text-[11px] mt-0.5" style={{ color: SUB, lineHeight: 1.45 }}>
              This split reflects your 14-year marriage, longer career break, and primary care of the children. A court would likely accept it.
            </div>
            <div className="mt-2 flex items-center gap-1.5 text-[10px]" style={{ color: MUTE }}>
              <span className="mono">Cited:</span>
              <span style={{ color: phase.accent, fontWeight: 500 }}>White v White (2000)</span>
              <span>·</span>
              <span style={{ color: phase.accent, fontWeight: 500 }}>Matrimonial Causes Act s.25</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* --- 04 — court-ready doc stack --- */
function IlloFinalise({ phase }: { phase: Phase }) {
  const docs = [
    { t: 'Consent Order', s: 'Ready', status: 'ready',  meta: '12 pages · signed' },
    { t: 'Form D81',      s: 'Ready', status: 'ready',  meta: 'Statement of information' },
    { t: 'Disclosure bundle', s: 'Ready', status: 'ready', meta: '324 pages · indexed' }
  ];
  return (
    <div className="relative">
      {/* stacked paper look */}
      <div className="absolute inset-0 rounded-2xl hairline" style={{ background: PANEL, transform: 'translate(8px, 8px) rotate(1.2deg)', opacity: 0.6 }}/>
      <div className="absolute inset-0 rounded-2xl hairline" style={{ background: PANEL, transform: 'translate(4px, 4px) rotate(0.5deg)', opacity: 0.85 }}/>
      <div className="relative rounded-2xl hairline p-5" style={{ background: PANEL, boxShadow: '0 6px 32px rgba(22,101,52,0.08)' }}>
        <div className="flex items-center justify-between">
          <div className="text-[12px] font-semibold">Court-ready package</div>
          <div className="mono text-[10.5px]" style={{ color: phase.accent }}>v1.0 · FINAL</div>
        </div>
        <div className="mt-4 space-y-2">
          {docs.map((d, i) => (
            <div key={i} className="flex items-center gap-3 px-3 py-2.5 rounded-lg hairline" style={{ background: CANVAS }}>
              <div className="w-7 h-8 rounded-sm flex items-center justify-center flex-shrink-0" style={{ background: PANEL, border: `1px solid ${LINE}` }}>
                <div className="space-y-[2px]">
                  <div style={{ width: 14, height: 1.5, background: '#D6D3CC' }}/>
                  <div style={{ width: 10, height: 1.5, background: '#D6D3CC' }}/>
                  <div style={{ width: 12, height: 1.5, background: '#D6D3CC' }}/>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[12px] font-semibold truncate">{d.t}</div>
                <div className="text-[10.5px]" style={{ color: MUTE }}>{d.meta}</div>
              </div>
              <div className="flex items-center gap-1 text-[10.5px] px-2 py-0.5 rounded-full" style={{ background: phase.accentSoft, color: phase.accent, fontWeight: 600 }}>
                <Check size={11} sw={3}/> {d.s}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <div className="rounded-lg p-2.5 text-center hairline" style={{ background: PANEL }}>
            <div className="text-[10.5px]" style={{ color: MUTE }}>Solicitor review</div>
            <div className="text-[11.5px] font-semibold mt-0.5" style={{ color: INK }}>From £199</div>
          </div>
          <div className="rounded-lg p-2.5 text-center" style={{ background: phase.accent, color: '#FFF' }}>
            <div className="text-[10.5px] opacity-80">Submit digitally</div>
            <div className="text-[11.5px] font-semibold mt-0.5">HMCTS portal</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   DASHBOARD — zero-data state, hyper focused on connecting banks
   ========================================================================= */
const BANKS = [
  { k: 'monzo',    name: 'Monzo',        bg: '#14233C', fg: '#FF3B30', mk: 'M'  },
  { k: 'halifax',  name: 'Halifax',      bg: '#005EB8', fg: '#FFFFFF', mk: 'H'  },
  { k: 'barclays', name: 'Barclays',     bg: '#00AEEF', fg: '#FFFFFF', mk: 'B'  },
  { k: 'hsbc',     name: 'HSBC',         bg: '#DB0011', fg: '#FFFFFF', mk: 'H'  },
  { k: 'natwest',  name: 'NatWest',      bg: '#5A287D', fg: '#FFFFFF', mk: 'N'  },
  { k: 'lloyds',   name: 'Lloyds',       bg: '#006A4D', fg: '#FFFFFF', mk: 'L'  },
  { k: 'santander',name: 'Santander',    bg: '#EC0000', fg: '#FFFFFF', mk: 'S'  },
  { k: 'starling', name: 'Starling',     bg: '#6935D3', fg: '#FFFFFF', mk: '★'  },
];

function DashboardStage({ onConnect, onManual, connected }: { onConnect: (k: string) => void; onManual: () => void; connected: string[] }) {
  return (
    <div className="w-full h-full overflow-y-auto nice-scroll" style={{ background: BG }}>
      <div className="max-w-[960px] mx-auto px-8 py-10">
        {/* greeting */}
        <div className="card-anim">
          <div className="label-xs" style={{ color: MUTE }}>Today · Tuesday</div>
          <h1 className="serif mt-2" style={{ fontSize: 40, fontWeight: 600, letterSpacing: '-0.025em', lineHeight: 1.08 }}>
            Welcome, Sarah.<br/>
            <span style={{ color: SUB, fontStyle: 'italic' }}>Let&apos;s build your picture.</span>
          </h1>

          {/* journey strip */}
          <div className="mt-7 flex items-center gap-0 rounded-xl hairline overflow-hidden" style={{ background: PANEL }}>
            {[
              { n: 1, l: 'Onboard',   active: true  },
              { n: 2, l: 'Disclose',  active: false },
              { n: 3, l: 'Reconcile', active: false },
              { n: 4, l: 'Settle',    active: false },
              { n: 5, l: 'Finalise',  active: false }
            ].map((p, i, arr) => (
              <div key={p.n} className="flex-1 flex items-center gap-2.5 px-3.5 py-3 relative"
                   style={{ borderRight: i < arr.length-1 ? `1px solid ${LINE}` : 'none', background: p.active ? CANVAS : PANEL }}>
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10.5px] font-semibold flex-shrink-0"
                     style={{ background: p.active ? INK : 'transparent', color: p.active ? '#FFF' : MUTE, border: p.active ? 'none' : `1px solid ${LINE}` }}>
                  {p.n}
                </div>
                <div className="min-w-0">
                  <div className="text-[12.5px] font-semibold truncate" style={{ color: p.active ? INK : SUB }}>{p.l}</div>
                  {p.active && <div className="text-[10.5px]" style={{ color: MUTE }}>In progress</div>}
                </div>
              </div>
            ))}
          </div>

          {/* primary panel — connect a bank */}
          <div className="mt-6 rounded-2xl hairline overflow-hidden" style={{ background: PANEL }}>
            <div className="p-7 pb-5">
              <div className="flex items-start justify-between gap-6">
                <div className="flex-1">
                  <div className="label-xs" style={{ color: '#4338CA' }}>Step 1 of disclosure</div>
                  <h2 className="serif mt-3" style={{ fontSize: 28, fontWeight: 600, letterSpacing: '-0.02em', lineHeight: 1.15 }}>
                    Connect your first bank.
                  </h2>
                  <p className="mt-2 text-[14px]" style={{ color: SUB, lineHeight: 1.55, maxWidth: 460 }}>
                    This is the fastest way to start. Decouple reads 12 months of transactions, classifies them, and builds the first draft of your financial picture — usually in under a minute.
                  </p>
                </div>
                <div className="flex-shrink-0 text-right">
                  <div className="mono text-[11px]" style={{ color: MUTE }}>Est. time</div>
                  <div className="serif tabular" style={{ fontSize: 26, color: INK, fontWeight: 600 }}>~60s</div>
                </div>
              </div>

              {/* assurance strip */}
              <div className="mt-5 flex items-center gap-4 text-[11.5px]" style={{ color: SUB }}>
                <div className="flex items-center gap-1.5"><Shield size={13} style={{ color: '#059669' }}/> FCA regulated via TrueLayer</div>
                <div className="w-1 h-1 rounded-full" style={{ background: '#D6D3CC' }}/>
                <div className="flex items-center gap-1.5"><Lock size={13} style={{ color: '#059669' }}/> Read-only — we can&apos;t move money</div>
                <div className="w-1 h-1 rounded-full" style={{ background: '#D6D3CC' }}/>
                <div>Disconnect anytime</div>
              </div>
            </div>

            {/* bank grid */}
            <div className="px-7 pt-1 pb-6">
              <div className="grid grid-cols-4 gap-2">
                {BANKS.map((b) => {
                  const isConnected = connected.includes(b.k);
                  return (
                    <button
                      key={b.k}
                      onClick={() => onConnect(b.k)}
                      className="bank-row flex items-center gap-2.5 px-3 py-2.5 rounded-lg hairline text-left"
                      style={{ background: isConnected ? '#F6FBF8' : PANEL, borderColor: isConnected ? '#A7F3D0' : LINE }}>
                      <div className="w-8 h-8 rounded-md flex items-center justify-center text-[12px] font-bold flex-shrink-0"
                           style={{ background: b.bg, color: b.fg }}>
                        {b.mk}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[12.5px] font-semibold truncate">{b.name}</div>
                        <div className="text-[10.5px]" style={{ color: isConnected ? '#059669' : MUTE }}>
                          {isConnected ? 'Connected' : 'Open banking'}
                        </div>
                      </div>
                      {isConnected ? <Check size={14} sw={2.5} style={{ color: '#059669' }}/> : <Plus size={14} style={{ color: MUTE }}/>}
                    </button>
                  );
                })}
              </div>

              <div className="mt-3 flex items-center gap-2 text-[11.5px]" style={{ color: MUTE }}>
                <span>Don&apos;t see your bank?</span>
                <button className="underline" style={{ color: INK }}>Search all 40+ providers</button>
              </div>
            </div>
          </div>

          {/* secondary — manual entry */}
          <div className="mt-5 rounded-xl hairline flex items-center justify-between px-5 py-4" style={{ background: PANEL }}>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: CANVAS, color: SUB }}>
                <Upload size={16}/>
              </div>
              <div>
                <div className="text-[13px] font-semibold">Prefer to enter things manually?</div>
                <div className="text-[11.5px]" style={{ color: MUTE }}>Upload statements, or key in balances one by one. Takes longer but works.</div>
              </div>
            </div>
            <button
              onClick={onManual}
              className="h-9 px-3.5 rounded-lg text-[13px] font-medium hairline"
              style={{ background: PANEL, color: INK }}>
              Enter manually
            </button>
          </div>

          {/* journey continuation */}
          <a
            href="/dev/proto/moment-1-ack"
            className="mt-8 block w-full rounded-xl py-4 text-center text-[14.5px] font-semibold"
            style={{ background: INK, color: '#FFF', textDecoration: 'none' }}
          >
            Continue to profiling &rarr;
          </a>

          {/* quiet status footer */}
          <div className="mt-10 pt-5 flex items-center justify-between text-[11.5px]" style={{ color: MUTE, borderTop: `1px solid ${LINE}` }}>
            <div>Everything auto-saves. You can leave and come back anytime.</div>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full soft-pulse" style={{ background: '#059669' }}/>
              Tour complete
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   TWEAKS PANEL
   ========================================================================= */
function TweaksPanel({ tw, update }: { tw: Tweaks; update: (k: keyof Tweaks, v: Tweaks[keyof Tweaks]) => void }) {
  return (
    <div className="fixed bottom-5 right-5 z-50 rounded-xl hairline p-4"
         style={{ background: PANEL, boxShadow: '0 10px 40px rgba(0,0,0,0.12)', width: 260 }}>
      <div className="flex items-center justify-between mb-3">
        <div className="text-[12px] font-semibold">Tweaks</div>
        <div className="mono text-[10px]" style={{ color: MUTE }}>Welcome tour</div>
      </div>

      <div className="space-y-3">
        <div>
          <div className="label-xs mb-1.5" style={{ color: MUTE }}>Start step</div>
          <div className="flex gap-1 flex-wrap">
            {['Intro','Prepare','Share','Build','Finalise','Dashboard'].map((l, i) => (
              <button key={i} onClick={() => update('start_step', i)}
                className="px-2 py-1 rounded-md text-[10.5px]"
                style={{ background: tw.start_step === i ? INK : '#F5F3EE', color: tw.start_step === i ? '#FFF' : SUB }}>
                {l}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="label-xs mb-1.5" style={{ color: MUTE }}>Type scale</div>
          <div className="flex gap-1">
            {([['Large', true], ['Compact', false]] as const).map(([l, v]) => (
              <button key={l} onClick={() => update('large_type', v)}
                className="flex-1 px-2 py-1 rounded-md text-[10.5px]"
                style={{ background: tw.large_type === v ? INK : '#F5F3EE', color: tw.large_type === v ? '#FFF' : SUB }}>
                {l}
              </button>
            ))}
          </div>
        </div>

        <label className="flex items-center justify-between text-[11.5px]">
          <span>Show step numbers</span>
          <input type="checkbox" checked={tw.show_step_numbers} onChange={e => update('show_step_numbers', e.target.checked)}/>
        </label>
      </div>
    </div>
  );
}

/* =========================================================================
   APP
   ========================================================================= */
export default function WelcomeTourPage() {
  const [tw, setTw] = useState<Tweaks>(TWEAK_DEFAULTS);
  const [editOn, setEditOn] = useState(false);
  // SSR-safe init: start with the default; hydrate from localStorage after mount.
  const [step, setStep] = useState<number>(() => {
    if (typeof window === 'undefined') return TWEAK_DEFAULTS.start_step || 0;
    const saved = parseInt(localStorage.getItem('decouple_tour_step') || '');
    return Number.isFinite(saved) ? saved : (TWEAK_DEFAULTS.start_step || 0);
  });
  const [connected, setConnected] = useState<string[]>([]);

  useEffect(() => { localStorage.setItem('decouple_tour_step', String(step)); }, [step]);

  // Tweaks activation
  useEffect(() => {
    const onMsg = (e: MessageEvent) => {
      if (e?.data?.type === '__activate_edit_mode')   setEditOn(true);
      if (e?.data?.type === '__deactivate_edit_mode') setEditOn(false);
    };
    window.addEventListener('message', onMsg);
    window.parent?.postMessage({ type: '__edit_mode_available' }, '*');
    return () => window.removeEventListener('message', onMsg);
  }, []);

  // Keyboard nav
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (step === DASH_STEP) return;
      if (e.key === 'ArrowRight' || e.key === 'Enter') { setStep(s => Math.min(DASH_STEP, s+1)); }
      if (e.key === 'ArrowLeft')                        { setStep(s => Math.max(0, s-1)); }
      if (e.key === 'Escape')                           { setStep(DASH_STEP); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [step]);

  const updateTw = (k: keyof Tweaks, v: Tweaks[keyof Tweaks]) => {
    setTw(prev => {
      const next = { ...prev, [k]: v };
      window.parent?.postMessage({ type: '__edit_mode_set_keys', edits: { [k]: v } }, '*');
      if (k === 'start_step') setStep(v as number);
      return next;
    });
  };

  const goto = (s: number) => setStep(Math.max(0, Math.min(DASH_STEP, s)));
  const next = () => goto(step + 1);
  const prev = () => goto(step - 1);

  const handleConnect = (k: string) => {
    setConnected(prev => prev.includes(k) ? prev.filter(x => x !== k) : [...prev, k]);
  };

  /* decide stage */
  let stage;
  if (step === INTRO_STEP) {
    stage = <IntroStage onStart={next} onSkip={() => goto(DASH_STEP)}/>;
  } else if (step === DASH_STEP) {
    stage = <DashboardStage onConnect={handleConnect} onManual={() => {}} connected={connected}/>;
  } else {
    const phaseIdx = step - 1;
    const phase = PHASES[phaseIdx];
    stage = (
      <PhaseStage
        phase={phase}
        index={phaseIdx}
        total={PHASES.length}
        onNext={next}
        onPrev={prev}
        isLast={phaseIdx === PHASES.length - 1}
      />
    );
  }

  return (
    <div className="flex flex-col h-screen" style={{ background: step === DASH_STEP ? BG : CANVAS }}>
      <style jsx>{`
        .label-xs { font-size: 10.5px; letter-spacing: 0.12em; text-transform: uppercase; font-weight: 600; }

        @keyframes cardIn {
          from { opacity: 0; transform: translateY(14px) scale(0.995); filter: blur(4px); }
          to   { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
        }
        .card-anim > :global(*) { animation: cardIn 520ms cubic-bezier(.2,.7,.2,1) both; }
        .card-anim > :global(*:nth-child(1)) { animation-delay: 0ms; }
        .card-anim > :global(*:nth-child(2)) { animation-delay: 60ms; }
        .card-anim > :global(*:nth-child(3)) { animation-delay: 120ms; }
        .card-anim > :global(*:nth-child(4)) { animation-delay: 180ms; }
        .card-anim > :global(*:nth-child(5)) { animation-delay: 240ms; }

        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        .fade-in { animation: fadeIn 360ms ease both; }

        @keyframes orbSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .orb-spin { animation: orbSpin 36s linear infinite; }

        @keyframes softPulse {
          0%, 100% { opacity: 0.55; transform: scale(1); }
          50%      { opacity: 0.85; transform: scale(1.02); }
        }
        .soft-pulse { animation: softPulse 4.2s ease-in-out infinite; }

        .grain::before {
          content: "";
          position: absolute; inset: 0;
          background-image: radial-gradient(rgba(0,0,0,0.035) 1px, transparent 1px);
          background-size: 3px 3px;
          mix-blend-mode: multiply;
          pointer-events: none;
        }

        .pdot { transition: all 260ms cubic-bezier(.2,.7,.2,1); }

        .bank-row { transition: background 140ms, transform 140ms; }
        .bank-row:hover { background: ${CANVAS}; transform: translateX(2px); }

        @keyframes shimmer {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(180%); }
        }
        .shimmer {
          position: absolute; inset: 0;
          background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.7) 50%, transparent 100%);
          animation: shimmer 2.4s ease-in-out infinite;
        }

        .nice-scroll::-webkit-scrollbar { width: 8px; height: 8px; }
        .nice-scroll::-webkit-scrollbar-thumb { background: #E5E7EB; border-radius: 8px; }
        .nice-scroll::-webkit-scrollbar-track { background: transparent; }

        @media (prefers-reduced-motion: reduce) {
          .card-anim > :global(*), .fade-in, .orb-spin, .soft-pulse, .pdot, .bank-row, .shimmer {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>

      <TopBar onExit={() => goto(DASH_STEP)} step={step}/>

      <main className="flex-1 min-h-0 relative grain" style={{ background: step === DASH_STEP ? BG : CANVAS }}>
        <div key={step} className="absolute inset-0 fade-in">
          {stage}
        </div>
        <ProgressRail step={step} go={goto} phases={PHASES}/>
      </main>

      {editOn && <TweaksPanel tw={tw} update={updateTw}/>}
    </div>
  );
}
