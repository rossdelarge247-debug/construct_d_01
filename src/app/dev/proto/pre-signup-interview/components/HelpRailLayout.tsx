'use client';

import type { CSSProperties, ReactNode } from 'react';
import { useVariant } from '@/lib/dev/variant-context';
import { RailGlossary } from './rails/RailGlossary';
import { RailCoach } from './rails/RailCoach';
import { RailWhy } from './rails/RailWhy';
import {
  LINE,
  MUTE,
  railContainerStyle,
  railEyebrowStyle,
  railHeadingStyle,
  railSubStyle,
} from './rails/rail-constants';
import styles from '../page.module.css';

function RailDeferred({ label }: { label: string }) {
  const boxStyle: CSSProperties = {
    border: `1px dashed ${LINE}`,
    borderRadius: 12,
    padding: 16,
    fontSize: 12.5,
    color: MUTE,
    lineHeight: 1.55,
  };
  return (
    <aside style={railContainerStyle} aria-label={`${label} (deferred)`}>
      <div>
        <div style={railEyebrowStyle}>Deferred</div>
        <h2 style={{ ...railHeadingStyle, marginTop: 4 }}>{label}.</h2>
        <p style={{ ...railSubStyle, marginTop: 6 }}>
          This canvas variant is parked for a follow-up slice. The variant infrastructure is
          in place; the component lands once the first three variants have been evaluated.
        </p>
      </div>
      <div style={boxStyle}>
        Why deferred: the canvas designer recommends instrumenting use of the live variants before
        building the remaining two. The three shipped here let you compare the three primary rail
        intents (reference / coach / trust) directly.
      </div>
    </aside>
  );
}

function ActiveRail() {
  const variant = useVariant('pre-signup-interview', 'helpRail');

  if (variant === 'v1') return <RailGlossary focused="relationship" />;
  if (variant === 'v2') return <RailCoach />;
  if (variant === 'v3') return <RailWhy />;
  if (variant === 'v4') return <RailDeferred label="Talk to a human" />;
  if (variant === 'v5') return <RailDeferred label="Hybrid (tabbed)" />;
  return null;
}

export function HelpRailLayout({ children }: { children: ReactNode }) {
  const variant = useVariant('pre-signup-interview', 'helpRail');
  const showRail = variant !== 'off' && variant !== '';

  return (
    <div className={styles.helpRailWrapper} data-rail-active={showRail ? 'true' : 'false'}>
      <div className={styles.helpRailContent}>{children}</div>
      {showRail ? (
        <div className={styles.helpRailColumn} aria-live="polite">
          <ActiveRail />
        </div>
      ) : null}
    </div>
  );
}
