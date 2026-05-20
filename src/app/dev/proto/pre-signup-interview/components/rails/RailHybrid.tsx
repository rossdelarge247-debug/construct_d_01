// Canvas source: docs/design-source/pre-signup-interview/desktop/decoded/Desktop Enhanced - Help Rail - Standalone.html L1983-2086
'use client';

import { useState } from 'react';
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

type TabId = 'ask' | 'mean' | 'why' | 'human';

const TABS: ReadonlyArray<{ id: TabId; label: string }> = [
  { id: 'ask', label: 'Ask Decouple' },
  { id: 'mean', label: 'What this means' },
  { id: 'why', label: 'Why we ask' },
  { id: 'human', label: 'Human' },
];

export function RailHybrid() {
  const [tab, setTab] = useState<TabId>('ask');

  return (
    <aside style={railContainerStyle} aria-label="Help options rail">
      <div>
        <div style={railEyebrowStyle}>Help &middot; choose how</div>
        <h2 style={{ ...railHeadingStyle, marginTop: 4 }}>Stuck? Here.</h2>
      </div>

      <div role="tablist" aria-label="Help options" style={tabRowStyle}>
        {TABS.map((t) => {
          const isActive = tab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              style={isActive ? tabActiveButtonStyle : tabButtonStyle}
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
