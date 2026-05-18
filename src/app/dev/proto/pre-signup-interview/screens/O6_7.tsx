'use client';

import { useState } from 'react';
import { tokens } from '@/styles/tokens';
import { BrandBar } from '../components/BrandBar';
import { BucketPicker } from '../components/BucketPicker';
import { ExpansionToggle } from '../components/ExpansionToggle';
import { Footer } from '../components/Footer';
import { MultiPicker } from '../components/MultiPicker';
import { TopBar } from '../components/TopBar';
import { useProto } from '../lib/proto-context';
import type { Quantitative, TargetTimeline, TimelineDriver } from '../lib/types';

const TIMELINE_OPTIONS: ReadonlyArray<{ value: TargetTimeline; label: string }> = [
  { value: 'asap', label: 'As soon as possible' },
  { value: '3m', label: 'Within 3 months' },
  { value: '6m', label: 'Within 6 months' },
  { value: '12m', label: 'Within 12 months' },
  { value: '18m+', label: '18+ months — no rush' },
  { value: 'unsure', label: 'Not sure yet' },
];

const DRIVER_OPTIONS: ReadonlyArray<{ value: TimelineDriver; label: string }> = [
  { value: 'deadline', label: 'Court or legal deadline' },
  { value: 'new_relationship', label: 'A new relationship' },
  { value: 'housing', label: 'Housing — buying, renting, downsizing' },
  { value: 'children', label: "Children's stability — school year, moves" },
  { value: 'financial', label: 'Financial pressure' },
  { value: 'emotional', label: 'Emotional readiness' },
  { value: 'none', label: 'No specific driver' },
];

export function O6_7() {
  const { answers, setAnswer, next, back } = useProto();
  const [expanded, setExpanded] = useState(false);

  const quantitative: Quantitative = answers.quantitative ?? {};
  const drivers: ReadonlyArray<TimelineDriver> = quantitative.timeline_drivers ?? [];

  const update = <K extends keyof Quantitative>(key: K, value: Quantitative[K]) => {
    setAnswer('quantitative', { ...quantitative, [key]: value });
  };

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
          padding: '12px 24px 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: 18,
        }}
      >
        <h1
          style={{
            margin: 0,
            font: `600 24px/1.15 ${tokens.font.serif}`,
            letterSpacing: '-0.02em',
            color: tokens.color.ink,
          }}
        >
          Your timeline
        </h1>

        <div
          style={{
            background: '#FFFFFF',
            border: `1px solid ${tokens.color.border}`,
            borderRadius: 14,
            padding: 14,
          }}
        >
          <BucketPicker<TargetTimeline>
            id="o67-timeline"
            label="When would you like this settled?"
            options={TIMELINE_OPTIONS}
            selected={quantitative.target_timeline}
            onChange={(value) => update('target_timeline', value)}
          />
        </div>

        <ExpansionToggle
          id="o67-expansion"
          label="Add what's driving the timeline — helps your plan address the real pressure"
          rationale={
            <ul style={{ margin: 0, paddingLeft: 18 }}>
              <li>
                An ASAP timeline with a court deadline routes differently than ASAP with no driver.
              </li>
              <li style={{ marginTop: 4 }}>
                Children-stability driving the timeline emphasises the school-year framing in your plan.
              </li>
            </ul>
          }
          open={expanded}
          onToggle={() => setExpanded((v) => !v)}
        >
          <MultiPicker<TimelineDriver>
            id="o67-drivers"
            label="What's driving your timeline? (pick any that apply)"
            options={DRIVER_OPTIONS}
            selected={drivers}
            onChange={(nextValues) => update('timeline_drivers', nextValues)}
          />
        </ExpansionToggle>
      </div>

      <div style={{ flex: 1 }} />

      <Footer
        ctaLabel="Continue to your plan"
        onContinue={next}
        secondaryActions={
          <button
            type="button"
            onClick={next}
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
            Skip this screen
          </button>
        }
      />
    </main>
  );
}
