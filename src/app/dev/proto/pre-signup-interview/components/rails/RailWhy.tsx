// Canvas source: docs/design-source/pre-signup-interview/desktop/decoded/Desktop Enhanced - Help Rail - Standalone.html L1876-1920
import type { CSSProperties } from 'react';
import {
  INK,
  LINE,
  PANEL_BG,
  SUB,
  LockIcon,
  railContainerStyle,
  railEyebrowStyle,
  railHeadingStyle,
  railSubStyle,
} from './rail-constants';

type WhyRow = [string, string, string];

const ROWS: WhyRow[] = [
  [
    '01',
    'Relationship',
    'Determines the legal route: divorce (married), dissolution (civil partnership), or a separation agreement (cohabiting). The rules for splitting assets differ slightly.',
  ],
  [
    '02',
    'Living together',
    "Affects practical questions we ask later — who keeps the home, whose name is on bills, child-contact logistics. Doesn't decide anything for you.",
  ],
  [
    '03',
    'Children under 18',
    'Where children are involved we put their schooling, contact arrangements and maintenance first, before money. This question gates that.',
  ],
  [
    '04',
    'Your home',
    'For most couples the home is the highest-value joint asset. Knowing the type (mortgage / rent / outright) shapes the rest of the questionnaire.',
  ],
];

const rowStyle: CSSProperties = {
  display: 'flex',
  gap: 12,
  padding: '12px 0',
  borderBottom: `1px solid ${LINE}`,
};

const numStyle: CSSProperties = {
  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
  fontSize: 11,
  color: SUB,
  letterSpacing: '0.08em',
  flexShrink: 0,
  marginTop: 3,
};

const questionStyle: CSSProperties = {
  fontSize: 13,
  fontWeight: 600,
  margin: 0,
  color: INK,
};

const answerStyle: CSSProperties = {
  fontSize: 12.5,
  color: SUB,
  lineHeight: 1.55,
  margin: '4px 0 0',
};

const privacyBoxStyle: CSSProperties = {
  background: PANEL_BG,
  border: `1px solid ${LINE}`,
  borderRadius: 12,
  padding: 14,
  fontSize: 12,
  color: SUB,
  lineHeight: 1.5,
  display: 'flex',
  gap: 10,
};

export function RailWhyBody() {
  return (
    <>
      <div>
        <div style={railEyebrowStyle}>Transparency</div>
        <h2 style={{ ...railHeadingStyle, marginTop: 4 }}>Why we ask.</h2>
        <p style={{ ...railSubStyle, marginTop: 6 }}>
          We don&apos;t ask for anything we don&apos;t use. Here&apos;s what each of the four
          sub-questions on the left actually drives.
        </p>
      </div>
      <div>
        {ROWS.map(([num, q, a], idx) => (
          <div
            key={num}
            style={{
              ...rowStyle,
              ...(idx === ROWS.length - 1 ? { borderBottom: 'none' } : {}),
            }}
          >
            <div style={numStyle}>{num}</div>
            <div>
              <h4 style={questionStyle}>{q}</h4>
              <p style={answerStyle}>{a}</p>
            </div>
          </div>
        ))}
      </div>
      <div style={privacyBoxStyle}>
        <span style={{ color: INK, flexShrink: 0, marginTop: 1 }}>
          <LockIcon size={14} />
        </span>
        <div>
          <strong style={{ color: INK }}>Stays with you.</strong> Nothing on this page is shared,
          sold, or shown to your partner. You decide what to share, later, when you&apos;re ready.
          {' '}
          <a
            href="/privacy"
            style={{ color: INK, textDecoration: 'underline', textUnderlineOffset: 2 }}
          >
            Privacy note →
          </a>
        </div>
      </div>
    </>
  );
}

export function RailWhy() {
  return (
    <aside style={railContainerStyle} aria-label="Why we ask help rail">
      <RailWhyBody />
    </aside>
  );
}
