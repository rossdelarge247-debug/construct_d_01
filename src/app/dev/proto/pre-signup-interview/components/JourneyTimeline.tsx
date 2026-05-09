import { tokens } from '@/styles/tokens';
import type { PlanContent } from '../lib/types';

export function JourneyTimeline({ stages }: { stages: PlanContent['journeyStages'] }) {
  return (
    <ol style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>
      {stages.map((stage, idx) => {
        const isFirst = idx === 0;
        const isLast = idx === stages.length - 1;
        return (
          <li key={stage.key} style={{ display: 'flex', gap: 14, position: 'relative' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: '0 0 auto' }}>
              <div
                aria-hidden
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 999,
                  background: tokens.color.surface.panel,
                  border: `2px solid ${tokens.color.phase.build.accent}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  font: `600 13px/1 ${tokens.font.sans}`,
                  color: tokens.color.phase.build.accent,
                  zIndex: 1,
                }}
              >
                {idx + 1}
              </div>
              {!isLast && (
                <div
                  aria-hidden
                  style={{ width: 2, flex: 1, background: tokens.color.border, marginTop: -2, marginBottom: -2 }}
                />
              )}
              {isFirst && <div aria-hidden style={{ height: 4 }} />}
            </div>
            <div style={{ paddingTop: 2, paddingBottom: isLast ? 0 : 8 }}>
              <div style={{ font: `600 15px/1.3 ${tokens.font.sans}`, color: tokens.color.ink }}>{stage.label}</div>
              <div style={{ marginTop: 2, font: `400 13px/1.4 ${tokens.font.sans}`, color: tokens.color.text.sub }}>
                {stage.sub}
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
