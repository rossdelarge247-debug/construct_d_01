import type { CSSProperties } from 'react';
import {
  INK,
  LINE,
  MUTE,
  SUB,
  VIOLET,
  LockIcon,
  SendIcon,
  SparkleIcon,
  railContainerStyle,
  railEyebrowStyle,
  railHeadingStyle,
  railSubStyle,
} from './rail-constants';

const bubbleUserStyle: CSSProperties = {
  alignSelf: 'flex-end',
  maxWidth: '85%',
  background: INK,
  color: '#FAFAF7',
  padding: '10px 14px',
  borderRadius: '14px 14px 4px 14px',
  fontSize: 13,
  lineHeight: 1.45,
};

const bubbleBotStyle: CSSProperties = {
  alignSelf: 'flex-start',
  maxWidth: '90%',
  background: '#FFFFFF',
  border: `1px solid ${LINE}`,
  padding: '10px 14px',
  borderRadius: '14px 14px 14px 4px',
  fontSize: 13,
  lineHeight: 1.5,
  color: INK,
};

const suggestButtonStyle: CSSProperties = {
  textAlign: 'left',
  padding: '8px 12px',
  border: `1px solid ${LINE}`,
  borderRadius: 999,
  background: '#FFFFFF',
  color: SUB,
  fontSize: 12.5,
  cursor: 'pointer',
};

const inputRowStyle: CSSProperties = {
  display: 'flex',
  gap: 8,
  alignItems: 'center',
  border: `1px solid ${LINE}`,
  borderRadius: 24,
  padding: '6px 8px 6px 14px',
  background: '#FFFFFF',
  marginTop: 'auto',
};

const inputStyle: CSSProperties = {
  flex: 1,
  border: 'none',
  outline: 'none',
  background: 'transparent',
  fontSize: 13,
  color: INK,
};

const sendButtonStyle: CSSProperties = {
  background: VIOLET,
  color: '#FFFFFF',
  border: 'none',
  borderRadius: '50%',
  width: 32,
  height: 32,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
};

const SUGGESTIONS = [
  'What counts as "cohabiting" legally?',
  'Should I worry about including children here?',
  'Why do you ask about my home so early?',
];

export function RailCoach() {
  return (
    <aside style={railContainerStyle} aria-label="Decouple AI coach help rail">
      <div>
        <div style={{ ...railEyebrowStyle, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <span style={{ color: VIOLET }}>
            <SparkleIcon />
          </span>{' '}
          Decouple AI · in beta
        </div>
        <h2 style={{ ...railHeadingStyle, marginTop: 4 }}>Ask anything.</h2>
        <p style={{ ...railSubStyle, marginTop: 6 }}>
          I know UK family law and how separations actually go. I won&apos;t replace a solicitor —
          but I can usually unstick you.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={bubbleUserStyle}>
          We&apos;re separated but still legally married — what do I pick?
        </div>
        <div style={bubbleBotStyle}>
          Pick <strong>Married</strong>.{' '}
          <span style={{ fontFamily: '"Source Serif Pro", Georgia, serif', fontStyle: 'italic' }}>
            Separation isn&apos;t a legal status in the UK
          </span>{' '}
          — until divorce papers are filed, you&apos;re still married for most purposes (tax,
          pensions, the assets we&apos;ll discuss). Pick <strong>No</strong> for &quot;Living
          together&quot; if you&apos;re already in different homes.
        </div>
      </div>

      <div>
        <div
          style={{
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
            fontSize: 9.5,
            letterSpacing: '0.12em',
            color: MUTE,
            marginBottom: 8,
            textTransform: 'uppercase',
            fontWeight: 600,
          }}
        >
          Suggested
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {SUGGESTIONS.map((q) => (
            <button key={q} type="button" style={suggestButtonStyle}>
              {q}
            </button>
          ))}
        </div>
      </div>

      <div style={inputRowStyle}>
        <input
          type="text"
          placeholder="Type your question…"
          style={inputStyle}
          aria-label="Type your question"
        />
        <button type="button" style={sendButtonStyle} aria-label="Send question">
          <SendIcon size={13} />
        </button>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: MUTE }}>
        <LockIcon size={11} />
        Conversations are private to you. Not used for training.
      </div>
    </aside>
  );
}
