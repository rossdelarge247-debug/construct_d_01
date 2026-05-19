import type { CSSProperties } from 'react';

export const INK = '#1A1A1A';
export const SUB = '#57534E';
export const MUTE = '#78716C';
export const VIOLET = '#7C3AED';
export const LINE = '#E5E3DC';
export const PANEL_BG = '#F5F3EE';

export const railContainerStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 18,
  padding: '24px 24px 24px 20px',
  fontFamily: 'system-ui, -apple-system, "Segoe UI", sans-serif',
  color: INK,
  fontSize: 13,
  lineHeight: 1.55,
  background: '#FAFAF7',
  borderLeft: `1px solid ${LINE}`,
  minHeight: '100%',
  width: 480,
  boxSizing: 'border-box',
};

export const railEyebrowStyle: CSSProperties = {
  fontSize: 10.5,
  fontWeight: 600,
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  color: MUTE,
};

export const railHeadingStyle: CSSProperties = {
  fontFamily: '"Source Serif Pro", Georgia, serif',
  fontSize: 24,
  fontWeight: 600,
  letterSpacing: '-0.015em',
  lineHeight: 1.1,
  margin: 0,
};

export const railSubStyle: CSSProperties = {
  fontSize: 13,
  color: SUB,
  lineHeight: 1.55,
  margin: 0,
};

export const monoFooterStyle: CSSProperties = {
  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
  fontSize: 10.5,
  letterSpacing: '0.08em',
  color: MUTE,
  marginTop: 'auto',
  paddingTop: 12,
  borderTop: `1px solid ${LINE}`,
};

export function SendIcon({ size = 14 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}

export function SparkleIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2l1.6 5.4L19 9l-5.4 1.6L12 16l-1.6-5.4L5 9l5.4-1.6L12 2z" opacity="0.9" />
      <path d="M19 14l.7 2.3L22 17l-2.3.7L19 20l-.7-2.3L16 17l2.3-.7z" />
    </svg>
  );
}

export function LockIcon({ size = 14 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}
