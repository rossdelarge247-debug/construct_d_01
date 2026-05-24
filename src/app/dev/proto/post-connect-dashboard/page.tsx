'use client';

import { ReactNode, Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { tokens } from '@/styles/tokens';
import { SignedInHeader } from '@/components/layout/signed-in-header';

const INK = tokens.color.ink;
const SUB = tokens.color.text.sub;
const MUTE = tokens.color.text.muted;
const LINE = tokens.color.border;
const CANVAS = tokens.color.surface.canvas;
const BG = tokens.color.surface.page;

const CATS = {
  legal: { label: 'Legal', fg: '#7C3AED', bg: '#F3EEFE' },
  evidence: { label: 'Evidence', fg: '#0369A1', bg: '#E0F2FE' },
  practical: { label: 'Practical', fg: '#BE185D', bg: '#FCE7F3' },
  indecouple: { label: 'In Decouple', fg: '#047857', bg: '#D1FAE5' },
} as const;

type CatKey = keyof typeof CATS;
export type Variant = 'conservative' | 'expressive';

export function resolveVariant(raw: string | null | undefined): Variant {
  return raw === 'expressive' ? 'expressive' : 'conservative';
}

type IcProps = {
  children: ReactNode;
  size?: number;
  sw?: number;
  style?: React.CSSProperties;
};

function Ic({ children, size = 14, sw = 1.8, style }: IcProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={sw}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={style}
    >
      {children}
    </svg>
  );
}

type IcSlot = Omit<IcProps, 'children'>;
const Chev = (p: IcSlot) => (
  <Ic {...p}>
    <polyline points="6 9 12 15 18 9" />
  </Ic>
);
const Check = (p: IcSlot) => (
  <Ic {...p}>
    <polyline points="5 12 10 17 19 7" />
  </Ic>
);
const Plus = (p: IcSlot) => (
  <Ic {...p}>
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </Ic>
);
const Lock = (p: IcSlot) => (
  <Ic {...p}>
    <rect x="4" y="11" width="16" height="10" rx="2" />
    <path d="M8 11V7a4 4 0 0 1 8 0v4" />
  </Ic>
);
const Arrow = (p: IcSlot) => (
  <Ic {...p}>
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="13 6 19 12 13 18" />
  </Ic>
);
const UploadIcon = (p: IcSlot) => (
  <Ic {...p}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </Ic>
);
const Sync = (p: IcSlot) => (
  <Ic {...p}>
    <polyline points="23 4 23 10 17 10" />
    <polyline points="1 20 1 14 7 14" />
    <path d="M3.5 9a9 9 0 0 1 14.8-3.4L23 10M1 14l4.7 4.4A9 9 0 0 0 20.5 15" />
  </Ic>
);

function PhaseStrip() {
  const phases = [
    { n: 1, l: 'Preparation', state: 'active' as const, sub: 'in progress' },
    { n: 2, l: 'Disclose', state: 'locked' as const, sub: undefined },
    { n: 3, l: 'Reconcile', state: 'locked' as const, sub: undefined },
    { n: 4, l: 'Settle', state: 'locked' as const, sub: undefined },
    { n: 5, l: 'Finalise', state: 'locked' as const, sub: undefined },
  ];
  return (
    <div
      className="flex items-stretch gap-0 rounded-xl overflow-hidden"
      style={{ background: '#FFF', border: `1px solid ${LINE}` }}
    >
      {phases.map((p, i, arr) => {
        const isActive = p.state === 'active';
        return (
          <div
            key={p.n}
            className="flex-1 flex items-center gap-2.5 px-3.5 py-3 relative"
            style={{
              borderRight: i < arr.length - 1 ? `1px solid ${LINE}` : 'none',
              background: isActive ? CANVAS : '#FFF',
              opacity: isActive ? 1 : 0.42,
              cursor: 'default',
            }}
            title={isActive ? '' : 'Unlocks when preparation is complete'}
          >
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center text-[10.5px] font-semibold flex-shrink-0"
              style={{
                background: isActive ? INK : 'transparent',
                color: isActive ? '#FFF' : MUTE,
                border: isActive ? 'none' : `1px solid ${LINE}`,
              }}
            >
              {p.n}
            </div>
            <div className="min-w-0">
              <div
                className="text-[12.5px] font-semibold truncate"
                style={{ color: isActive ? INK : SUB }}
              >
                {p.l}
              </div>
              {isActive && p.sub && (
                <div className="text-[10.5px]" style={{ color: MUTE }}>
                  {p.sub}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

type ConnectedBannerProps = {
  variant: Variant;
  expanded: boolean;
  onToggle: () => void;
};

export function ConnectedBanner({ variant, expanded, onToggle }: ConnectedBannerProps) {
  const accounts = [
    { name: 'Everyday Current', type: 'Current', sort: '20-00-00', num: '••••4821', bal: '£2,847.13' },
    { name: 'Reward Credit Card', type: 'Credit', sort: '20-00-00', num: '••••9930', bal: '−£382.44' },
    { name: 'Joint Savings', type: 'Savings', sort: '20-00-00', num: '••••1104', bal: '£28,402.00' },
  ];
  const isExpressive = variant === 'expressive';

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ background: '#FFF', border: `1px solid ${LINE}` }}
    >
      <div
        className="w-full flex items-center gap-4 px-5 py-4 transition-[background] duration-[140ms] motion-reduce:transition-none"
        style={{ background: isExpressive ? '#F5F1EB' : '#FFF' }}
      >
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={expanded}
          aria-controls="connected-bank-accounts"
          aria-label="Connected to Barclays — toggle accounts panel"
          className="flex items-center gap-4 flex-1 min-w-0 text-left"
          style={{ background: 'transparent', padding: 0 }}
        >
          <div
            className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center text-white text-[14px] font-bold"
            style={{ background: '#00AEEF' }}
          >
            B
          </div>
          <div className="flex-1 min-w-0">
            <div className="label-xs" style={{ color: MUTE, marginBottom: 2 }}>
              Step 1 complete
            </div>
            <div className="flex items-center gap-2">
              <Check size={14} sw={2.5} style={{ color: '#059669' }} />
              <div
                className="text-[15px] font-semibold"
                style={{ color: INK, letterSpacing: '-0.01em' }}
              >
                Connected to Barclays
              </div>
            </div>
            <div
              className="text-[11.5px] mt-1 flex items-center gap-2"
              style={{ color: MUTE }}
            >
              <span>3 accounts · 1,284 transactions classified</span>
              <span className="w-1 h-1 rounded-full" style={{ background: '#D6D3CC' }} />
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#059669' }} />
                Synced 4 min ago
              </span>
            </div>
          </div>
        </button>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            type="button"
            className="h-8 px-3 rounded-md text-[12px] font-medium text-white"
            style={{ background: isExpressive ? '#4338CA' : INK }}
          >
            Add another bank
          </button>
          <button
            type="button"
            onClick={onToggle}
            aria-hidden="true"
            tabIndex={-1}
            className="w-7 h-7 rounded-md flex items-center justify-center transition-transform duration-[180ms] motion-reduce:transition-none"
            style={{
              color: MUTE,
              transform: expanded ? 'rotate(180deg)' : 'none',
            }}
          >
            <Chev size={14} />
          </button>
        </div>
      </div>

      {expanded && (
        <div
          id="connected-bank-accounts"
          className="px-5 pb-4 pt-1"
          style={{ borderTop: `1px solid ${LINE}` }}
        >
          <div className="mt-3 space-y-1">
            {accounts.map((a, i) => (
              <div
                key={i}
                className="flex items-center gap-3 py-2 px-2 rounded-md hover:bg-[#FAFAF7]"
              >
                <div
                  className="w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0"
                  style={{ background: '#00AEEF' }}
                >
                  B
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[12.5px] font-semibold" style={{ color: INK }}>
                    {a.name}
                  </div>
                  <div className="text-[10.5px]" style={{ color: MUTE }}>
                    {a.type} · {a.sort} {a.num}
                  </div>
                </div>
                <div
                  className="mono tabular text-[12.5px] font-semibold"
                  style={{ color: a.bal.startsWith('−') ? '#B91C1C' : INK }}
                >
                  {a.bal}
                </div>
              </div>
            ))}
          </div>
          <div
            className="mt-3 flex items-center justify-between text-[11px]"
            style={{ color: MUTE }}
          >
            <div className="flex items-center gap-1.5">
              <Sync size={11} /> Auto-syncs daily · read-only via TrueLayer
            </div>
            <button type="button" className="underline" style={{ color: INK }}>
              Manage connection
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function DisclosureCard({ variant }: { variant: Variant }) {
  const pct = 32;
  const isExpressive = variant === 'expressive';
  return (
    <div
      className="rounded-xl px-5 py-5"
      style={{ background: '#FFF', border: `1px solid ${LINE}` }}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="label-xs" style={{ color: isExpressive ? '#9D174D' : MUTE }}>
            Your private area
          </div>
          <h3
            className="serif mt-1.5"
            style={{
              fontSize: 20,
              fontWeight: 600,
              letterSpacing: '-0.015em',
              color: INK,
              fontStyle: 'italic',
            }}
          >
            View your disclosure picture
          </h3>
          <p className="mt-1 text-[12.5px]" style={{ color: SUB, lineHeight: 1.5 }}>
            We&apos;ve pre-filled the first draft from your Barclays data. Review, add anything
            missing, and keep it private until you&apos;re ready to share.
          </p>
          <div className="mt-3.5 flex items-center gap-2.5" style={{ maxWidth: 320 }}>
            <div
              className="flex-1 h-1 rounded-full overflow-hidden"
              style={{ background: '#F5F3EE' }}
            >
              <div
                className="h-full rounded-full"
                style={{ width: `${pct}%`, background: isExpressive ? '#9D174D' : INK }}
              />
            </div>
          </div>
        </div>
        <button
          type="button"
          className="h-9 px-3.5 rounded-lg text-[12.5px] font-medium text-white whitespace-nowrap flex-shrink-0 flex items-center gap-1.5"
          style={{ background: INK }}
        >
          Go to your picture
          <Arrow size={13} />
        </button>
      </div>
    </div>
  );
}

type Task = {
  cat: CatKey;
  title: string;
  link?: string;
  action: string;
  actionKind?: 'done' | 'primary' | 'special';
  last?: boolean;
};

function TaskRow({ task, variant }: { task: Task; variant: Variant }) {
  const cat = CATS[task.cat];
  const isExpressive = variant === 'expressive';

  const actionStyles = {
    done: { bg: '#FFF', fg: INK, border: `1px solid ${LINE}` },
    primary: { bg: INK, fg: '#FFF', border: 'none' },
    special: { bg: isExpressive ? '#7C3AED' : INK, fg: '#FFF', border: 'none' },
  } as const;
  const a = actionStyles[task.actionKind || 'primary'];

  return (
    <div
      className="flex items-center gap-3 py-3"
      style={{ borderBottom: task.last ? 'none' : `1px solid ${LINE}` }}
    >
      <div
        className="flex-shrink-0 flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold"
        style={{ background: cat.bg, color: cat.fg, letterSpacing: '0.02em' }}
      >
        {cat.label}
      </div>

      <div
        className="flex-1 min-w-0 text-[13px]"
        style={{ color: INK, lineHeight: 1.45 }}
      >
        {task.title}
        {task.link && (
          <>
            {' '}
            <a
              href="#"
              className="underline"
              style={{ color: isExpressive ? '#4338CA' : INK }}
            >
              {task.link}
            </a>
          </>
        )}
      </div>

      <button
        type="button"
        className="h-8 px-3 rounded-md text-[12px] font-medium flex-shrink-0 flex items-center gap-1 whitespace-nowrap"
        style={{ background: a.bg, color: a.fg, border: a.border }}
      >
        {task.actionKind === 'special' && <UploadIcon size={12} />}
        {task.action}
      </button>
    </div>
  );
}

const PREP_TASKS: Task[] = [
  {
    cat: 'evidence',
    title: "Have you applied for your pension CETV yet? (Don't forget it takes a while)",
    action: 'Done',
    actionKind: 'done',
  },
  {
    cat: 'practical',
    title: "You haven't outlined your child situation yet",
    action: 'Outline now',
    actionKind: 'primary',
  },
  {
    cat: 'practical',
    title: 'Fill out your post separation budgetary needs',
    action: 'Outline now',
    actionKind: 'primary',
  },
  {
    cat: 'legal',
    title: 'Have you applied for your divorce online yet?',
    link: 'For guidance click here',
    action: 'Done',
    actionKind: 'done',
  },
  {
    cat: 'legal',
    title: 'Book your MIAM and use your free £500 voucher',
    action: 'Done',
    actionKind: 'done',
  },
  {
    cat: 'evidence',
    title: 'Upload your mortgage statement',
    action: 'Upload now',
    actionKind: 'special',
  },
  {
    cat: 'practical',
    title: "You haven't outlined your spending needs yet",
    action: 'Outline now',
    actionKind: 'primary',
  },
];

function PrepTasksCard({ variant }: { variant: Variant }) {
  const isExpressive = variant === 'expressive';
  return (
    <div
      className="rounded-xl px-5 py-5"
      style={{ background: '#FFF', border: `1px solid ${LINE}` }}
    >
      <div className="label-xs" style={{ color: isExpressive ? '#9D174D' : MUTE }}>
        Get these 3 done ASAP
      </div>
      <h3
        className="serif mt-1"
        style={{
          fontSize: 19,
          fontWeight: 600,
          letterSpacing: '-0.015em',
          color: INK,
        }}
      >
        Next preparation tasks
      </h3>

      <div className="mt-3">
        {PREP_TASKS.map((t, i) => (
          <TaskRow
            key={i}
            task={{ ...t, last: i === PREP_TASKS.length - 1 }}
            variant={variant}
          />
        ))}
      </div>

      <button
        type="button"
        className="mt-3 text-[12.5px] font-medium flex items-center gap-1.5"
        style={{ color: MUTE }}
      >
        <Plus size={12} /> Add a task
      </button>
    </div>
  );
}

type LockedSectionProps = {
  title: string;
  variant: Variant;
  phaseColor: string;
  unlockReason: string;
  primary: { kicker: string; title: string; sub: string; cta: string };
  tasks: { title: string; items: { cat: CatKey; title: string }[] };
};

function LockedSection({
  title,
  variant,
  phaseColor,
  unlockReason,
  primary,
  tasks,
}: LockedSectionProps) {
  const isExpressive = variant === 'expressive';
  return (
    <div style={{ opacity: 0.55 }}>
      <div className="flex items-center gap-2.5 mb-3">
        <h2
          className="serif"
          style={{
            fontSize: 22,
            fontWeight: 600,
            letterSpacing: '-0.02em',
            color: INK,
          }}
        >
          {title}
        </h2>
        <div
          className="flex items-center gap-1 text-[10.5px] px-2 py-0.5 rounded-full"
          style={{
            background: '#F5F3EE',
            color: MUTE,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            fontWeight: 600,
          }}
        >
          <Lock size={10} sw={2.2} /> Locked
        </div>
        <div
          className="text-[11px]"
          style={{ color: MUTE, fontStyle: 'italic' }}
        >
          {unlockReason}
        </div>
      </div>

      <div className="space-y-4 pointer-events-none">
        <div
          className="rounded-xl px-5 py-5"
          style={{ background: '#FFF', border: `1px dashed ${LINE}` }}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div
                className="label-xs"
                style={{ color: isExpressive ? phaseColor : MUTE }}
              >
                {primary.kicker}
              </div>
              <h3
                className="serif mt-1.5"
                style={{
                  fontSize: 19,
                  fontWeight: 600,
                  letterSpacing: '-0.015em',
                  color: INK,
                  fontStyle: 'italic',
                }}
              >
                {primary.title}
              </h3>
              <p className="mt-1 text-[12.5px]" style={{ color: SUB, lineHeight: 1.5 }}>
                {primary.sub}
              </p>
            </div>
            <button
              type="button"
              disabled
              className="h-9 px-3.5 rounded-lg text-[12.5px] font-medium flex items-center gap-1.5 flex-shrink-0"
              style={{ background: '#FFF', color: MUTE, border: `1px solid ${LINE}` }}
            >
              {primary.cta} <Lock size={11} />
            </button>
          </div>
        </div>

        <div
          className="rounded-xl px-5 py-5"
          style={{ background: '#FFF', border: `1px dashed ${LINE}` }}
        >
          <div className="label-xs" style={{ color: isExpressive ? phaseColor : MUTE }}>
            Next up
          </div>
          <h3
            className="serif mt-1"
            style={{
              fontSize: 18,
              fontWeight: 600,
              letterSpacing: '-0.015em',
              color: INK,
            }}
          >
            {tasks.title}
          </h3>
          <div className="mt-3 space-y-0">
            {tasks.items.map((t, i) => (
              <div
                key={i}
                className="flex items-center gap-3 py-2.5"
                style={{
                  borderBottom:
                    i < tasks.items.length - 1 ? `1px solid ${LINE}` : 'none',
                }}
              >
                <div
                  className="flex-shrink-0 px-2 py-0.5 rounded-full text-[10px] font-semibold"
                  style={{
                    background: CATS[t.cat].bg,
                    color: CATS[t.cat].fg,
                    opacity: 0.7,
                  }}
                >
                  {CATS[t.cat].label}
                </div>
                <div className="flex-1 text-[13px]" style={{ color: SUB }}>
                  {t.title}
                </div>
                <div
                  className="h-8 px-3 rounded-md text-[12px] flex items-center"
                  style={{ color: MUTE, border: `1px solid ${LINE}` }}
                >
                  Locked
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function Dashboard({ variant = 'conservative' }: { variant?: Variant }) {
  const [expanded, setExpanded] = useState(false);
  const isExpressive = variant === 'expressive';
  const mainBg = isExpressive
    ? 'linear-gradient(180deg, #F3EEFE 0%, #F5F5F4 360px)'
    : BG;

  return (
    <div
      data-variant={variant}
      className="flex flex-col"
      style={{ background: BG, minHeight: '100vh' }}
    >
      <SignedInHeader
        mode="app"
        pageLabel="Dashboard"
        user={{ name: 'Sarah', initial: 'S', status: 'Just joined' }}
      />
      <main role="main" id="main" className="flex-1" style={{ background: mainBg }}>
        <div className="mx-auto" style={{ maxWidth: 960, padding: '36px 40px 80px' }}>
          <div>
            <div className="label-xs" style={{ color: MUTE }}>
              Today · 21 April
            </div>
            <h1
              className="serif mt-2"
              style={{
                fontSize: 36,
                fontWeight: 600,
                letterSpacing: '-0.025em',
                lineHeight: 1.1,
                color: INK,
              }}
            >
              Welcome, Sarah.
              <br />
              <span style={{ color: SUB, fontStyle: 'italic' }}>
                Let&apos;s build your picture.
              </span>
            </h1>
          </div>

          <div className="mt-7">
            <PhaseStrip />
          </div>

          <div className="mt-9">
            <div className="flex items-center gap-2.5 mb-3">
              <h2
                className="serif"
                style={{
                  fontSize: 22,
                  fontWeight: 600,
                  letterSpacing: '-0.02em',
                  color: INK,
                }}
              >
                Preparation
              </h2>
              {isExpressive && (
                <span
                  className="text-[10.5px] font-semibold px-2 py-0.5 rounded-full"
                  style={{
                    background: '#EEF2FF',
                    color: '#4338CA',
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                  }}
                >
                  Current phase
                </span>
              )}
            </div>
            <div className="space-y-4">
              <ConnectedBanner
                variant={variant}
                expanded={expanded}
                onToggle={() => setExpanded((e) => !e)}
              />
              <DisclosureCard variant={variant} />
              <PrepTasksCard variant={variant} />
            </div>
          </div>

          <div className="mt-10">
            <LockedSection
              title="Disclosure & reconcile"
              variant={variant}
              phaseColor="#9D174D"
              unlockReason="Unlocks when preparation is complete"
              primary={{
                kicker: 'Your shared area',
                title: 'View your shared household picture',
                sub: 'Where you will find your reconciled household disclosure.',
                cta: 'View your shared area',
              }}
              tasks={{
                title: 'Next disclosure tasks',
                items: [
                  { cat: 'evidence', title: 'Share your private disclosure with Mark' },
                  {
                    cat: 'practical',
                    title: "Review Mark's additions and flag differences",
                  },
                  { cat: 'legal', title: 'Sign off on the reconciled picture' },
                ],
              }}
            />
          </div>

          <div className="mt-10">
            <LockedSection
              title="Settle & finalise"
              variant={variant}
              phaseColor="#0369A1"
              unlockReason="Unlocks when reconciliation is complete"
              primary={{
                kicker: 'Your private area',
                title: 'Create your draft proposal',
                sub: 'Build your opening position with AI legal assurance and reasonableness flags.',
                cta: 'Go to your area',
              }}
              tasks={{
                title: 'Next settlement tasks',
                items: [
                  { cat: 'legal', title: 'Draft capital split proposal' },
                  { cat: 'legal', title: "Review Mark's counter-proposal" },
                  { cat: 'evidence', title: 'Generate Consent Order & Form D81' },
                ],
              }}
            />
          </div>
        </div>
        <Link
          href="/dev/proto/your-picture"
          className="block w-full mt-6 rounded-xl py-4 text-center font-semibold"
          style={{ background: tokens.color.ink, color: '#fff', textDecoration: 'none', fontSize: 14.5 }}
        >
          View your picture &rarr;
        </Link>
      </main>
    </div>
  );
}

function DashboardContent() {
  const params = useSearchParams();
  const variant = resolveVariant(params.get('variant'));
  return <Dashboard variant={variant} />;
}

export default function Page() {
  return (
    <Suspense fallback={null}>
      <DashboardContent />
    </Suspense>
  );
}
