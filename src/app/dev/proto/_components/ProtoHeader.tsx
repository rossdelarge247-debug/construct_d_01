'use client';

import Link from 'next/link';
import { tokens } from '@/styles/tokens';
import { APP_NAME } from '@/constants';
import type { ReactNode } from 'react';

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

type ProtoHeaderProps = {
  backHref?: string;
  backLabel?: string;
  rightSlot?: ReactNode;
};

export function ProtoHeader({ backHref, backLabel, rightSlot }: ProtoHeaderProps) {
  return (
    <div className="flex-shrink-0" style={{ position: 'sticky', top: 0, zIndex: 30 }}>
      {/* Primary strip — wordmark + controls */}
      <header
        className="flex items-center justify-between px-4 sm:px-6"
        style={{
          height: 64,
          background: tokens.color.surface.panel,
          borderBottom: backHref ? 'none' : `1px solid ${tokens.color.border}`,
        }}
      >
        <Link
          href="/dev/proto"
          className="text-[18px] font-bold tracking-tight select-none"
          style={{ color: tokens.color.ink, textDecoration: 'none' }}
        >
          {APP_NAME}
        </Link>

        <div className="flex items-center gap-1 sm:gap-1.5">
          <div className="hidden sm:flex items-center gap-1.5">
            <button type="button" aria-label="Help" className="p-2 rounded-md" style={{ color: tokens.color.text.sub, background: 'transparent', border: 'none', cursor: 'pointer' }}>
              <Help size={16} />
            </button>
            <button type="button" aria-label="Notifications" className="p-2 rounded-md" style={{ color: tokens.color.text.sub, background: 'transparent', border: 'none', cursor: 'pointer' }}>
              <Bell size={16} />
            </button>
            <button type="button" aria-label="Settings" className="p-2 rounded-md" style={{ color: tokens.color.text.sub, background: 'transparent', border: 'none', cursor: 'pointer' }}>
              <Settings size={16} />
            </button>
          </div>

          <button type="button" aria-label="Open menu" className="sm:hidden p-2 rounded-md" style={{ color: tokens.color.text.sub, background: 'transparent', border: 'none', cursor: 'pointer' }}>
            <Ic size={18}>
              <line x1="4" y1="6" x2="20" y2="6" />
              <line x1="4" y1="12" x2="20" y2="12" />
              <line x1="4" y1="18" x2="20" y2="18" />
            </Ic>
          </button>

          <div className="ml-1 flex items-center gap-2 pl-2" style={{ borderLeft: `1px solid ${tokens.color.border}` }}>
            <div
              aria-label="Avatar for Sarah"
              className="rounded-full flex items-center justify-center"
              style={{ width: 28, height: 28, background: tokens.color.surface.canvas, color: tokens.color.text.sub, fontSize: '11px', fontWeight: tokens.weight.semibold }}
            >
              S
            </div>
            <div className="hidden sm:block text-[12px] leading-tight pr-1">
              <div style={{ fontWeight: tokens.weight.semibold, color: tokens.color.ink }}>Sarah</div>
              <div style={{ color: tokens.color.text.muted, fontSize: '11px' }}>Building</div>
            </div>
          </div>
        </div>
      </header>

      {/* Sub-nav strip — contextual back + page label */}
      {backHref && (
        <nav
          className="flex items-center justify-between px-4 sm:px-6"
          style={{
            height: 44,
            background: tokens.color.surface.panel,
            borderBottom: `1px solid ${tokens.color.border}`,
          }}
          aria-label="Page navigation"
        >
          <div className="flex items-center gap-3">
            <Link
              href={backHref}
              aria-label="Go back"
              style={{ color: tokens.color.ink, textDecoration: 'none', fontSize: 18, lineHeight: 1 }}
            >
              &larr;
            </Link>
            {backLabel && (
              <span style={{ fontSize: 14, fontWeight: 600, color: tokens.color.ink }}>
                {backLabel}
              </span>
            )}
          </div>
          {rightSlot && <div className="flex items-center gap-2">{rightSlot}</div>}
        </nav>
      )}
    </div>
  );
}
