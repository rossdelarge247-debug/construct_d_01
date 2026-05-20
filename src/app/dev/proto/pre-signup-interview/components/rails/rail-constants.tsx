import type { CSSProperties } from 'react';

export const INK = '#1A1A1A';
export const SUB = '#57534E';
export const MUTE = '#78716C';
export const VIOLET = '#7C3AED';
export const MAGENTA = '#BE185D';
export const LINE = '#E5E3DC';
export const PANEL_BG = '#F5F3EE';
export const MAGENTA_TINT = '#FCE7F3';
export const PILL_GREEN_INK = '#166534';
export const PILL_GREEN_BG = '#DCFCE7';

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

export const optRowStyle: CSSProperties = {
  background: '#FFFFFF',
  border: `1px solid ${LINE}`,
  borderRadius: 12,
  padding: '14px 16px',
  cursor: 'pointer',
  display: 'grid',
  gridTemplateColumns: '32px 1fr auto',
  gap: 14,
  alignItems: 'center',
  textAlign: 'left',
  fontFamily: 'inherit',
  color: 'inherit',
  width: '100%',
};

export const optIconStyle: CSSProperties = {
  width: 32,
  height: 32,
  borderRadius: 999,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: PANEL_BG,
  color: INK,
};

export const optTitleStyle: CSSProperties = {
  fontFamily: '"Source Serif Pro", Georgia, serif',
  fontSize: 14,
  fontWeight: 600,
  color: INK,
  margin: 0,
};

export const optMetaStyle: CSSProperties = {
  fontSize: 11.5,
  color: MUTE,
  margin: '1px 0 0 0',
};

export const optPillStyle: CSSProperties = {
  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
  fontSize: 9.5,
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  color: PILL_GREEN_INK,
  background: PILL_GREEN_BG,
  padding: '3px 8px',
  borderRadius: 999,
  fontWeight: 600,
};

export const optPillGreyStyle: CSSProperties = {
  ...optPillStyle,
  color: MUTE,
  background: PANEL_BG,
};

export const founderNoteStyle: CSSProperties = {
  background: '#FFFFFF',
  border: `1px dashed ${LINE}`,
  borderRadius: 12,
  padding: 14,
  fontSize: 12.5,
  color: SUB,
  lineHeight: 1.55,
};

export const tabRowStyle: CSSProperties = {
  display: 'flex',
  gap: 4,
  marginBottom: 18,
  borderBottom: `1px solid ${LINE}`,
  paddingBottom: 0,
};

export const tabButtonStyle: CSSProperties = {
  background: 'none',
  border: 'none',
  padding: '8px 12px',
  fontSize: 12,
  fontWeight: 600,
  color: MUTE,
  cursor: 'pointer',
  borderBottom: '2px solid transparent',
  marginBottom: -1,
  fontFamily: 'inherit',
};

export const tabActiveButtonStyle: CSSProperties = {
  ...tabButtonStyle,
  color: INK,
  borderBottomColor: INK,
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

export function ChatIcon({ size = 16 }: { size?: number }) {
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
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  );
}

export function PhoneIcon({ size = 16 }: { size?: number }) {
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
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

export function HeartIcon({ size = 16 }: { size?: number }) {
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
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}
