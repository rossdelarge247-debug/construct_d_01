'use client';

import { tokens } from '@/styles/tokens';
import { BrandBar } from '../components/BrandBar';
import { Footer } from '../components/Footer';
import { TopBar } from '../components/TopBar';
import { useProto } from '../lib/proto-context';

export function QuantBridge() {
  const { next, back, goTo } = useProto();

  return (
    <main
      style={{
        width: '100%',
        maxWidth: 480,
        margin: '0 auto',
        paddingTop: 24,
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <BrandBar />
      <TopBar step={6} total={8} onBack={back} />

      <div
        style={{
          padding: '20px 24px 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
        }}
      >
        <h1
          style={{
            margin: 0,
            font: `600 26px/1.15 ${tokens.font.serif}`,
            letterSpacing: '-0.02em',
            color: tokens.color.ink,
          }}
        >
          You&apos;ve shared what matters.
        </h1>

        <p
          style={{
            margin: 0,
            font: `400 16px/1.5 ${tokens.font.sans}`,
            color: tokens.color.text.sub,
          }}
        >
          Now a few optional questions that help us tailor the numbers in
          your plan — sharing-principle weighting, consent-order complexity,
          and your timeline.
        </p>

        <p
          style={{
            margin: 0,
            font: `400 14px/1.45 ${tokens.font.sans}`,
            color: tokens.color.text.muted,
          }}
        >
          Every question is optional. You can skip any field or skip the
          whole section.
        </p>
      </div>

      <div style={{ flex: 1 }} />

      <Footer
        ctaLabel="Continue"
        onContinue={next}
        secondaryActions={
          <button
            type="button"
            onClick={() => goTo(11)}
            style={{
              background: 'transparent',
              color: tokens.color.text.sub,
              border: 'none',
              padding: '4px 8px',
              font: `500 13.5px/1.3 ${tokens.font.sans}`,
              textDecoration: 'underline',
              cursor: 'pointer',
            }}
          >
            Skip the quantitative section
          </button>
        }
      />
    </main>
  );
}
