// Canvas source: docs/design-source/pre-signup-interview/desktop/decoded/Desktop Enhanced - Help Rail - Standalone.html L1925-1978
import type { CSSProperties } from 'react';
import {
  INK,
  MAGENTA,
  MAGENTA_TINT,
  ChatIcon,
  HeartIcon,
  PhoneIcon,
  founderNoteStyle,
  monoFooterStyle,
  optIconStyle,
  optMetaStyle,
  optPillGreyStyle,
  optPillStyle,
  optTitleStyle,
  railContainerStyle,
  railEyebrowStyle,
  railHeadingStyle,
  railSubStyle,
} from './rail-constants';
import styles from './rail-constants.module.css';

const optionsListStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 10,
};

const founderStrongStyle: CSSProperties = {
  color: INK,
  fontFamily: '"Source Serif Pro", Georgia, serif',
  fontSize: 13,
};

const founderBodyStyle: CSSProperties = {
  margin: '6px 0 0 0',
};

const heartIconBgStyle: CSSProperties = {
  ...optIconStyle,
  background: MAGENTA_TINT,
  color: MAGENTA,
};

export function RailHumanBody() {
  return (
    <>
      <div>
        <div style={railEyebrowStyle}>Need a person?</div>
        <h2 style={{ ...railHeadingStyle, marginTop: 4 }}>We&apos;re here.</h2>
        <p style={{ ...railSubStyle, marginTop: 6 }}>
          Some of these questions are hard to answer alone. Three ways to reach a human &mdash;
          none of them sales.
        </p>
      </div>

      <div style={optionsListStyle}>
        <button type="button" className={styles.optRow}>
          <span style={optIconStyle}>
            <ChatIcon />
          </span>
          <div>
            <h4 style={optTitleStyle}>Chat with the team</h4>
            <p style={optMetaStyle}>Mon&ndash;Fri, 9&ndash;6 &middot; Avg. reply in 4 min</p>
          </div>
          <span style={optPillStyle}>Online</span>
        </button>

        <button type="button" className={styles.optRow}>
          <span style={optIconStyle}>
            <PhoneIcon />
          </span>
          <div>
            <h4 style={optTitleStyle}>Book a 30-min call</h4>
            <p style={optMetaStyle}>Free &middot; with a Decouple guide, not a salesperson</p>
          </div>
          <span style={optPillGreyStyle}>Slots open</span>
        </button>

        <button type="button" className={styles.optRow}>
          <span style={heartIconBgStyle}>
            <HeartIcon />
          </span>
          <div>
            <h4 style={optTitleStyle}>Decouple Listen</h4>
            <p style={optMetaStyle}>Free emotional support line &middot; run by Relate</p>
          </div>
          <span style={optPillGreyStyle}>24/7</span>
        </button>
      </div>

      <div style={founderNoteStyle}>
        <strong style={founderStrongStyle}>A note from Sarah, founder.</strong>
        <p style={founderBodyStyle}>
          Decouple&apos;s team is small and we read every chat ourselves. We can&apos;t give legal
          advice &mdash; but we can almost always get you unstuck.
        </p>
      </div>

      <div style={monoFooterStyle} data-testid="rail-human-safety">
        IF YOU&apos;RE NOT SAFE &middot; CALL 999 OR REFUGE 0808 2000 247
      </div>
    </>
  );
}

export function RailHuman() {
  return (
    <aside style={railContainerStyle} aria-label="Talk to a human help rail">
      <RailHumanBody />
    </aside>
  );
}
