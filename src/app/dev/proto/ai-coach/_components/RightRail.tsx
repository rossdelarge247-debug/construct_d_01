'use client';

import { useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
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
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, currentIndex: number) {
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
    event.preventDefault();
    const delta = event.key === 'ArrowRight' ? 1 : -1;
    const nextIndex = (currentIndex + delta + TABS.length) % TABS.length;
    const nextTab = TABS[nextIndex];
    setActive(nextTab.id);
    tabRefs.current[nextIndex]?.focus();
  }

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
        {TABS.map((tab, index) => {
          const isActive = active === tab.id;
          return (
            <button
              key={tab.id}
              ref={(el) => {
                tabRefs.current[index] = el;
              }}
              id={`tab-${tab.id}`}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={`panel-${tab.id}`}
              tabIndex={isActive ? 0 : -1}
              onClick={() => setActive(tab.id)}
              onKeyDown={(event) => handleKeyDown(event, index)}
              style={{
                background: 'transparent',
                border: 'none',
                padding: '8px 12px',
                minHeight: 44,
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
      <div
        role="tabpanel"
        id={`panel-${active}`}
        aria-labelledby={`tab-${active}`}
        tabIndex={0}
      >
        {active === 'ai-coach' ? aiCoachPanel : null}
        {active === 'comments' ? (commentsStub ?? <StubPanel>Comments (placeholder) — threading + reply UX deferred.</StubPanel>) : null}
        {active === 'activity' ? (activityStub ?? <StubPanel>Activity (placeholder) — feed + filters deferred.</StubPanel>) : null}
      </div>
    </aside>
  );
}
