import type { ReactNode } from 'react';
import { tokens } from '@/styles/tokens';

interface Props {
  heading: string;
  children: ReactNode;
}

export function PlanSection({ heading, children }: Props) {
  return (
    <section
      style={{
        background: 'rgba(255, 255, 255, 0.7)',
        border: `1px solid ${tokens.color.border}`,
        borderRadius: 16,
        padding: 18,
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
      }}
    >
      <h2
        style={{
          font: `600 13px/1.2 ${tokens.font.sans}`,
          letterSpacing: tokens.letterSpacing.wide,
          color: tokens.color.text.sub,
          textTransform: 'uppercase',
          margin: 0,
        }}
      >
        {heading}
      </h2>
      <div style={{ font: `400 15px/1.55 ${tokens.font.sans}`, color: tokens.color.ink }}>{children}</div>
    </section>
  );
}
