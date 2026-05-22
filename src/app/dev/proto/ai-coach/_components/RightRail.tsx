'use client';

import { useState, type ReactNode } from 'react';
import { tokens } from '@/styles/tokens';

type Tab = 'comments' | 'ai-coach' | 'activity';

interface Props {
  aiCoachPanel: ReactNode;
  commentsStub?: ReactNode;
  activityStub?: ReactNode;
}

const TABS: ReadonlyArray<{ id: Tab; label: string }> = [
  { id: 'comments', label: 'Comments' },
  { id: 'ai-coach', label: 'AI coach' },
  { id: 'activity', label: 'Activity' },
];

const AI_VIOLET = tokens.color.accent.violet;

function StubPanel({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        padding: '20px 12px',
        fontSize: tokens.type['14-5'],
        color: tokens.color.text.muted,
        textAlign: 'center',
        lineHeight: 1.5,
        fontFamily: tokens.font.sans,
      }}
    >
      {children}
    </div>
  );
}

export function RightRail({ aiCoachPanel, commentsStub, activityStub }: Props) {
  const [active, setActive] = useState<Tab>('ai-coach');

  return (
    <aside
      style={{
        background: tokens.color.surface.panel,
        border: `1px solid ${tokens.color.border}`,
        borderRadius: tokens.radius.lg,
        padding: 12,
        fontFamily: tokens.font.sans,
        color: tokens.color.ink,
      }}
    >
      <div
        role="tablist"
        aria-label="Right rail tabs"
        style={{
          display: 'flex',
          gap: 2,
          borderBottom: `1px solid ${tokens.color.border}`,
          marginBottom: 12,
        }}
      >
        {TABS.map((tab) => {
          const isActive = active === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActive(tab.id)}
              style={{
                background: 'transparent',
                border: 'none',
                padding: '8px 12px',
                fontSize: tokens.type['14-5'],
                fontWeight: isActive ? tokens.weight.semibold : tokens.weight.medium,
                color: isActive ? AI_VIOLET : tokens.color.text.sub,
                borderBottom: isActive ? `2px solid ${AI_VIOLET}` : '2px solid transparent',
                marginBottom: -1,
                cursor: 'pointer',
                fontFamily: tokens.font.sans,
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
      <div role="tabpanel">
        {active === 'ai-coach' ? aiCoachPanel : null}
        {active === 'comments' ? (commentsStub ?? <StubPanel>Comments (placeholder) — threading + reply UX deferred.</StubPanel>) : null}
        {active === 'activity' ? (activityStub ?? <StubPanel>Activity (placeholder) — feed + filters deferred.</StubPanel>) : null}
      </div>
    </aside>
  );
}
