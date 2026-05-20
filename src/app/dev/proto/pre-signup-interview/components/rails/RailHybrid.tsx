// Canvas source: docs/design-source/pre-signup-interview/desktop/decoded/Desktop Enhanced - Help Rail - Standalone.html L1983-2086
'use client';

import { useRef, useState, type KeyboardEvent } from 'react';
import {
  railContainerStyle,
  railEyebrowStyle,
  railHeadingStyle,
  tabActiveButtonStyle,
  tabButtonStyle,
  tabRowStyle,
} from './rail-constants';
import { RailCoachBody } from './RailCoach';
import { RailGlossaryBody } from './RailGlossary';
import { RailHumanBody } from './RailHuman';
import { RailWhyBody } from './RailWhy';
import styles from '../focus-visible.module.css';

type TabId = 'ask' | 'mean' | 'why' | 'human';

const TABS: ReadonlyArray<{ id: TabId; label: string }> = [
  { id: 'ask', label: 'Ask Decouple' },
  { id: 'mean', label: 'What this means' },
  { id: 'why', label: 'Why we ask' },
  { id: 'human', label: 'Human' },
];

export function RailHybrid() {
  const [tab, setTab] = useState<TabId>('ask');
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    e.preventDefault();
    const currentIndex = TABS.findIndex((t) => t.id === tab);
    const nextIndex =
      e.key === 'ArrowRight'
        ? (currentIndex + 1) % TABS.length
        : (currentIndex - 1 + TABS.length) % TABS.length;
    setTab(TABS[nextIndex].id);
    tabRefs.current[nextIndex]?.focus();
  };

  return (
    <aside style={railContainerStyle} aria-label="Help options rail">
      <div>
        <div style={railEyebrowStyle}>Help &middot; choose how</div>
        <h2 style={{ ...railHeadingStyle, marginTop: 4 }}>Stuck? Here.</h2>
      </div>

      <div
        role="tablist"
        aria-label="Help options"
        style={tabRowStyle}
        onKeyDown={handleKeyDown}
      >
        {TABS.map((t, index) => {
          const isActive = tab === t.id;
          return (
            <button
              key={t.id}
              ref={(el) => {
                tabRefs.current[index] = el;
              }}
              type="button"
              role="tab"
              aria-selected={isActive}
              style={isActive ? tabActiveButtonStyle : tabButtonStyle}
              className={styles.focusable}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      <div role="tabpanel" style={{ display: 'contents' }}>
        {tab === 'ask' && <RailCoachBody />}
        {tab === 'mean' && <RailGlossaryBody focused="relationship" />}
        {tab === 'why' && <RailWhyBody />}
        {tab === 'human' && <RailHumanBody />}
      </div>
    </aside>
  );
}
