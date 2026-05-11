'use client';

export type ArrowDir = 'left' | 'right' | 'up' | 'down';

interface Props {
  dir?: ArrowDir;
  size?: number;
  strokeWidth?: number;
}

const ROTATION: Record<ArrowDir, number> = { right: 0, down: 90, left: 180, up: 270 };

export function Arrow({ dir = 'right', size = 14, strokeWidth = 1.8 }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={{ transform: `rotate(${ROTATION[dir]}deg)` }}
    >
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}
