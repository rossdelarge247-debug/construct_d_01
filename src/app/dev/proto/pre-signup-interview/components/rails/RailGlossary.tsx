// Canvas source: docs/design-source/pre-signup-interview/desktop/decoded/Desktop Enhanced - Help Rail - Standalone.html L1765-1824
import type { CSSProperties } from 'react';
import {
  INK,
  LINE,
  MUTE,
  SUB,
  VIOLET,
  railContainerStyle,
  railEyebrowStyle,
  railHeadingStyle,
  railSubStyle,
  monoFooterStyle,
} from './rail-constants';

type GlossarySection = {
  id: string;
  title: string;
  rows: [string, string][];
};

const SECTIONS: GlossarySection[] = [
  {
    id: 'relationship',
    title: 'Relationship',
    rows: [
      ['Married', 'Formally married, including same-sex marriage.'],
      ['Civil partnership', 'Legally registered; rules differ slightly from marriage but route is similar.'],
      ['Cohabiting', 'Living together without a legal partnership. UK law treats this differently.'],
      ['Other', "Engaged, religiously married only, separated unmarried — pick this and we'll ask more."],
    ],
  },
  {
    id: 'living',
    title: 'Living together',
    rows: [
      ['Yes', 'Still under one roof, even if separately.'],
      ['No', 'Already living apart, by choice or necessity.'],
      ['Complicated', 'On-and-off, half the week, or unclear — totally normal during separation.'],
    ],
  },
  {
    id: 'children',
    title: 'Children under 18',
    rows: [
      ['Why we ask', 'Where children are involved we always cover schooling, contact, and child maintenance first.'],
      ['Step-children', 'Include children you currently care for, even if not biological.'],
    ],
  },
  {
    id: 'home',
    title: 'Your home',
    rows: [
      ['Mortgage / outright', "Whether the property has a loan against it changes how it's split."],
      ['Joint vs. sole names', "We'll ask later — for now just the type of home."],
    ],
  },
];

const sectionStyle: CSSProperties = {
  paddingBottom: 14,
  borderBottom: `1px solid ${LINE}`,
};

const activeSectionStyle: CSSProperties = {
  ...sectionStyle,
  background: 'rgba(124, 58, 237, 0.04)',
  margin: '0 -12px',
  padding: '12px 12px 14px',
  borderRadius: 8,
  border: 'none',
};

const sectionTitleStyle: CSSProperties = {
  fontSize: 12,
  fontWeight: 600,
  letterSpacing: '0.02em',
  margin: '0 0 8px',
  color: INK,
};

const activeSectionTitleStyle: CSSProperties = {
  ...sectionTitleStyle,
  color: VIOLET,
};

const dtStyle: CSSProperties = {
  fontWeight: 600,
  color: INK,
  fontSize: 12.5,
  marginTop: 6,
};

const ddStyle: CSSProperties = {
  margin: '2px 0 0',
  color: SUB,
  fontSize: 12.5,
  lineHeight: 1.5,
};

export function RailGlossary({ focused }: { focused?: string }) {
  return (
    <aside style={railContainerStyle} aria-label="Glossary help rail">
      <div>
        <div style={railEyebrowStyle}>Reference</div>
        <h2 style={{ ...railHeadingStyle, marginTop: 4 }}>What this means.</h2>
        <p style={{ ...railSubStyle, marginTop: 6 }}>
          Plain-English explanations for every option on the left. The card you&apos;re filling
          in is highlighted.
        </p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {SECTIONS.map((section) => {
          const isActive = section.id === focused;
          return (
            <div key={section.id} style={isActive ? activeSectionStyle : sectionStyle}>
              <h3 style={isActive ? activeSectionTitleStyle : sectionTitleStyle}>
                {section.title}
              </h3>
              <dl style={{ margin: 0 }}>
                {section.rows.map(([term, def]) => (
                  <div key={term}>
                    <dt style={dtStyle}>{term}</dt>
                    <dd style={ddStyle}>{def}</dd>
                  </div>
                ))}
              </dl>
            </div>
          );
        })}
      </div>
      <div style={monoFooterStyle}>
        GLOSSARY · UPDATED MAY 2026 · <span style={{ color: MUTE }}>NOT LEGAL ADVICE</span>
      </div>
    </aside>
  );
}
