'use client';

import { useState } from 'react';
import { tokens } from '@/styles/tokens';
import { BrandBar } from '../components/BrandBar';
import { BucketPicker } from '../components/BucketPicker';
import { ExpansionToggle } from '../components/ExpansionToggle';
import { Footer } from '../components/Footer';
import { TopBar } from '../components/TopBar';
import { useProto } from '../lib/proto-context';
import type {
  AdultAge,
  ChildAge,
  ExAgeRelative,
  Quantitative,
  RelationshipLength,
} from '../lib/types';

const CHILD_AGE_OPTIONS: ReadonlyArray<{ value: ChildAge; label: string }> = [
  { value: '0-4', label: '0-4' },
  { value: '5-11', label: '5-11' },
  { value: '12-15', label: '12-15' },
  { value: '16-17', label: '16-17' },
  { value: '18+', label: '18+' },
];

const YOUR_AGE_OPTIONS: ReadonlyArray<{ value: AdultAge; label: string }> = [
  { value: '<30', label: '<30' },
  { value: '30-39', label: '30-39' },
  { value: '40-49', label: '40-49' },
  { value: '50-59', label: '50-59' },
  { value: '60+', label: '60+' },
];

const EX_AGE_OPTIONS: ReadonlyArray<{ value: ExAgeRelative; label: string }> = [
  { value: 'same', label: 'Same age as you' },
  { value: 'older', label: 'Older' },
  { value: 'younger', label: 'Younger' },
  { value: 'unknown', label: "Don't know" },
];

const RELATIONSHIP_LENGTH_OPTIONS: ReadonlyArray<{ value: RelationshipLength; label: string }> = [
  { value: '<2y', label: '<2y' },
  { value: '2-5y', label: '2-5y' },
  { value: '5-10y', label: '5-10y' },
  { value: '10-20y', label: '10-20y' },
  { value: '20+y', label: '20+y' },
];

export function O6_5() {
  const { answers, setAnswer, next, back } = useProto();
  const [expanded, setExpanded] = useState(false);

  const quantitative: Quantitative = answers.quantitative ?? {};
  const showChildrenSection = answers.situation?.hasChildren === 'yes';
  const isSingleChild = answers.situation?.childrenCount === 1;

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
          About you and your relationship
        </h1>

        {showChildrenSection && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 14,
              background: '#FFFFFF',
              border: `1px solid ${tokens.color.border}`,
              borderRadius: 14,
              padding: 14,
            }}
          >
            <h2
              style={{
                margin: 0,
                font: `600 15.5px/1.25 ${tokens.font.serif}`,
                letterSpacing: '-0.01em',
                color: tokens.color.ink,
              }}
            >
              Your {isSingleChild ? 'child' : "children's"} age{isSingleChild ? '' : ' bands'}
            </h2>

            {isSingleChild ? (
              <BucketPicker<ChildAge>
                id="o65-child-youngest"
                label="Your child"
                options={CHILD_AGE_OPTIONS}
                selected={quantitative.child_age_youngest}
                onChange={(value) => update('child_age_youngest', value)}
              />
            ) : (
              <>
                <BucketPicker<ChildAge>
                  id="o65-child-youngest"
                  label="Youngest child"
                  options={CHILD_AGE_OPTIONS}
                  selected={quantitative.child_age_youngest}
                  onChange={(value) => update('child_age_youngest', value)}
                />
                <BucketPicker<ChildAge>
                  id="o65-child-oldest"
                  label="Oldest child"
                  options={CHILD_AGE_OPTIONS}
                  selected={quantitative.child_age_oldest}
                  onChange={(value) => update('child_age_oldest', value)}
                />
              </>
            )}
          </div>
        )}

        <ExpansionToggle
          id="o65-expansion"
          label="Add ages and relationship length — unlocks pension and sharing-principle weighting"
          rationale={
            <ul style={{ margin: 0, paddingLeft: 18 }}>
              <li>
                Your age + how your ex&apos;s age compares to yours shifts pension
                considerations into the foreground. The older partner&apos;s
                pension is often the central asset; relative age matters most
                for sharing-rights calculations.
              </li>
              <li style={{ marginTop: 4 }}>
                Length of relationship weights the sharing-principle calculation
                courts use.
              </li>
            </ul>
          }
          open={expanded}
          onToggle={() => setExpanded((v) => !v)}
        >
          <BucketPicker<AdultAge>
            id="o65-your-age"
            label="Your age"
            options={YOUR_AGE_OPTIONS}
            selected={quantitative.your_age}
            onChange={(value) => update('your_age', value)}
          />
          <BucketPicker<ExAgeRelative>
            id="o65-ex-age"
            label="Your ex's age (relative to yours)"
            options={EX_AGE_OPTIONS}
            selected={quantitative.ex_age_relative}
            onChange={(value) => update('ex_age_relative', value)}
          />
          <BucketPicker<RelationshipLength>
            id="o65-relationship-length"
            label="Length of relationship"
            options={RELATIONSHIP_LENGTH_OPTIONS}
            selected={quantitative.relationship_length}
            onChange={(value) => update('relationship_length', value)}
          />
        </ExpansionToggle>
      </div>

      <div style={{ flex: 1 }} />

      <Footer
        ctaLabel="Continue"
        onContinue={next}
        secondaryActions={
          <button
            type="button"
            onClick={next}
            style={{
              background: 'transparent',
              color: tokens.color.text.sub,
              border: 'none',
              padding: '12px 16px',
              minHeight: 44,
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
