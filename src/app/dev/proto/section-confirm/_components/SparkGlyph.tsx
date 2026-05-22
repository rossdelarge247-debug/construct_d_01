'use client';

export const AI_PURPLE = '#6D5BD0';
export const AI_PURPLE_DEEP = '#4C3FB8';
export const AI_PURPLE_TINT = '#F5F3FF';
export const AI_PURPLE_EDGE = '#E4DEFD';

export function SparkGlyph({ size = 11, color = '#fff' }: { size?: number; color?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5L18 18M6 18l2.5-2.5M15.5 8.5L18 6" />
    </svg>
  );
}

export function AIBadge({ size = 18 }: { size?: number }) {
  return (
    <span
      style={{
        width: size,
        height: size,
        borderRadius: 999,
        background: AI_PURPLE,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      <SparkGlyph size={size * 0.55} color="#fff" />
    </span>
  );
}
