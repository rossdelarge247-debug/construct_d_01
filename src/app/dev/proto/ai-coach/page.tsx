'use client';

import Link from 'next/link';
import { tokens } from '@/styles/tokens';
import { RightRail } from './_components/RightRail';
import { SummaryBanner } from './_components/SummaryBanner';
import { CoachCard, type Fallback } from './_components/CoachCard';
import { CoachFooter } from './_components/CoachFooter';

const SUMMARY_INTRO =
  "Your draft sits at 54/46 to you. That's within normal court range, but two items will likely be challenged — here's what to expect.";

const COURT_FALLBACKS: Fallback[] = [
  { title: 'Open with 20% share', rationale: '£36,082 to Mark · likely middle ground' },
  { title: 'Offset against home equity', rationale: 'Keep pension, Mark takes more of home' },
  { title: 'Defer to next review', rationale: '12-month structured review tied to home sale' },
];

const ON_THIS_COMMENT_BODY =
  'Mark wrote: "I think the Halifax savings should be split 50/50 since we both contributed." Your position lists this as your separate pre-marital savings. Worth checking the timeline — pre-marital provenance evidence (statements from before marriage) would settle this cleanly.';

function AiCoachPanel() {
  return (
    <div>
      <SummaryBanner intro={SUMMARY_INTRO} flagCount={1} noticeCount={1} />
      <CoachCard
        type="court-reasonableness"
        title="No pension sharing is unusually weak"
        body="A judge looking at your asset split would expect to see Mark's pension contributing to the division — most settlements at your asset level include a pension order. Going to court with no pension element is rare and risks rejection."
        reasoning="Family-court practice over the past five years shows ~78% of comparable financial-remedy cases (joint assets £250-500k, marriage 10-15 years, dependent children) include a pension-sharing or pension-attachment order. Your draft's silence on pension is the strongest single contributor to a court-reasonableness risk."
        fallbacks={COURT_FALLBACKS}
      />
      <CoachCard
        type="fairness-check"
        title="3-year spousal is on the longer end"
        body="The 3-year spousal maintenance term sits above typical durations for your case profile. Courts increasingly favour shorter, transition-focused awards aligned to a clean break."
        reasoning="Comparable cases from the past 18 months show median spousal terms of 12-24 months for marriages of your duration with both parties earning. A 3-year term is defensible but Mark's legal team is likely to push for 18 months."
      />
      <CoachCard
        type="coaching"
        title="Your home split is clean"
        body="The 60/40 split of the marital home, with you taking the larger share to support childcare continuity, aligns well with court reasonableness for cases like yours. Strong evidence base; well-framed."
        reasoning="The 60/40 split sits within the normal range for cases where the primary carer takes a larger share for child-stability reasons. Your supporting evidence (school catchment continuity, dependent-needs schedule) reads cleanly. No anticipated challenge."
      />
      <CoachCard
        type="on-this-comment"
        title="On this comment: Mark's note about the savings account"
        body={ON_THIS_COMMENT_BODY}
        reasoning="Pre-marital assets typically stay with the contributing party in financial remedy proceedings unless there's been significant comingling. The Halifax statement history from 2008-2014 would be the deciding evidence. If you have pre-marriage statements showing the balance as yours, this is straightforward."
      />
      <CoachFooter />
    </div>
  );
}

export default function AiCoachPage() {
  return (
    <main
      style={{
        minHeight: '100vh',
        background: tokens.color.surface.page,
        fontFamily: tokens.font.sans,
        color: tokens.color.ink,
      }}
    >
      <header
        style={{
          padding: '16px 20px',
          borderBottom: `1px solid ${tokens.color.border}`,
          background: tokens.color.surface.panel,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
        }}
      >
        <Link
          href="/dev/proto"
          aria-label="Back to registry"
          style={{
            fontSize: tokens.type['14-5'],
            color: tokens.color.text.sub,
            textDecoration: 'none',
          }}
        >
          ← Back
        </Link>
        <h1 style={{ fontSize: tokens.type['16'], fontWeight: tokens.weight.semibold, margin: 0 }}>
          AI coach · Settle phase preview
        </h1>
        <span
          style={{
            fontSize: tokens.type['11'],
            color: tokens.color.text.muted,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
          }}
        >
          S-PROTO-ai-coach
        </span>
      </header>
      <div
        style={{
          maxWidth: 720,
          margin: '0 auto',
          padding: '24px 16px 80px',
        }}
      >
        <RightRail aiCoachPanel={<AiCoachPanel />} />
      </div>
    </main>
  );
}
