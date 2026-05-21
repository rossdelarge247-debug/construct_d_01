'use client';

import type { ReactNode } from 'react';
import { tokens } from '@/styles/tokens';

type IconProps = { size?: number };

const Ic = ({ children, size = 16 }: { children: ReactNode; size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {children}
  </svg>
);

const Help = (p: IconProps) => (
  <Ic {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.8.5-1 1-1 1.7" />
    <line x1="12" y1="17" x2="12" y2="17" />
  </Ic>
);

const Bell = (p: IconProps) => (
  <Ic {...p}>
    <path d="M18 16v-5a6 6 0 0 0-12 0v5l-2 2h16z" />
    <path d="M10 20a2 2 0 0 0 4 0" />
  </Ic>
);

const Settings = (p: IconProps) => (
  <Ic {...p}>
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 0 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 0 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 0 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 0 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" />
  </Ic>
);

function Wordmark() {
  return (
    <div className="flex items-center gap-2 select-none">
      <div className="relative" style={{ width: 20, height: 20 }}>
        <div className="absolute inset-0 rounded-full" style={{ background: '#111' }} />
        <div className="absolute rounded-full" style={{ left: '42%', top: 0, width: '58%', height: '100%', background: tokens.color.surface.page }} />
        <div className="absolute rounded-full" style={{ left: '45%', top: '12%', width: '10%', height: '76%', background: '#111' }} />
      </div>
      <span style={{ fontSize: '14.5px', letterSpacing: '-0.01em', fontWeight: tokens.weight.semibold, color: '#111' }}>
        decouple
      </span>
    </div>
  );
}

type User = {
  name: string;
  initial: string;
  status?: string;
};

type SignedInHeaderProps = {
  mode?: 'app' | 'tour';
  pageLabel?: string;
  user?: User;
  rightSlot?: ReactNode;
};

export function SignedInHeader({
  mode = 'app',
  pageLabel,
  user,
  rightSlot,
}: SignedInHeaderProps) {
  return (
    <header
      className="flex items-center justify-between px-4 sm:px-5 flex-shrink-0"
      style={{
        height: 56,
        borderBottom: `1px solid ${tokens.color.border}`,
        background: tokens.color.surface.panel,
      }}
    >
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <Wordmark />
        {pageLabel && (
          <>
            <span aria-hidden="true" className="hidden sm:inline" style={{ color: '#E5E7EB' }}>
              /
            </span>
            <div
              className="hidden sm:block text-[12.5px] truncate"
              style={{ color: tokens.color.ink, fontWeight: tokens.weight.semibold }}
            >
              {pageLabel}
            </div>
          </>
        )}
      </div>

      {mode === 'tour' ? (
        <div className="flex items-center">{rightSlot}</div>
      ) : (
        <div className="flex items-center gap-1 sm:gap-1.5">
          <div className="hidden sm:flex items-center gap-1.5">
            <button type="button" aria-label="Help" className="p-2 rounded-md" style={{ color: tokens.color.text.sub, background: 'transparent' }}>
              <Help size={16} />
            </button>
            <button type="button" aria-label="Notifications" className="p-2 rounded-md" style={{ color: tokens.color.text.sub, background: 'transparent' }}>
              <Bell size={16} />
            </button>
            <button type="button" aria-label="Settings" className="p-2 rounded-md" style={{ color: tokens.color.text.sub, background: 'transparent' }}>
              <Settings size={16} />
            </button>
          </div>

          <button type="button" aria-label="Open menu" className="sm:hidden p-2 rounded-md" style={{ color: tokens.color.text.sub, background: 'transparent' }}>
            <Ic size={18}>
              <line x1="4" y1="6" x2="20" y2="6" />
              <line x1="4" y1="12" x2="20" y2="12" />
              <line x1="4" y1="18" x2="20" y2="18" />
            </Ic>
          </button>

          {user && (
            <div className="ml-1 flex items-center gap-2 pl-2" style={{ borderLeft: `1px solid ${tokens.color.border}` }}>
              <div
                aria-label={`Avatar for ${user.name}`}
                className="rounded-full flex items-center justify-center"
                style={{ width: 28, height: 28, background: '#F5F3EE', color: tokens.color.text.sub, fontSize: '11px', fontWeight: tokens.weight.semibold }}
              >
                {user.initial}
              </div>
              <div className="hidden sm:block text-[12px] leading-tight pr-1">
                <div style={{ fontWeight: tokens.weight.semibold, color: tokens.color.ink }}>{user.name}</div>
                {user.status && <div style={{ color: tokens.color.text.muted, fontSize: '11px' }}>{user.status}</div>}
              </div>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
