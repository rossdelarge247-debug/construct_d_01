'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { tokens } from '@/styles/tokens';
import { useBankData } from '../../_context/bank-data-context';
import { ProtoHeader } from '../../_components/ProtoHeader';
import { RadioRow } from '../_components/RadioRow';
import { AIMarginCard } from '../_components/AIMarginCard';
import { SparkGlyph, AI_PURPLE_DEEP } from '../_components/SparkGlyph';
import { SectionLabel } from '../_components/SectionLabel';
import type { ConfirmationSectionKey } from '@/lib/bank/confirmation-questions';
import type { ConfirmationStep } from '@/lib/bank/confirmation-questions';

const SECTION_LABELS: Record<string, string> = {
  income: 'Income', property: 'Property', accounts: 'Accounts',
  pensions: 'Pensions', debts: 'Debts', business: 'Business', other_assets: 'Other assets',
};

function StepRenderer({ step, index, total, onNext }: { step: ConfirmationStep; index: number; total: number; onNext: (stepId: string, answer: string | null) => void }) {
  const [selected, setSelected] = useState<string | null>(step.options?.[0]?.value ?? null);
  const [inputValue, setInputValue] = useState('');

  return (
    <div style={{ flex: 1, overflow: 'auto', padding: '18px 20px 40px' }}>
      <div style={{ maxWidth: 640, margin: '0 auto' }}>
        <h1 style={{
          fontFamily: tokens.font.serif, fontSize: 19, fontWeight: 600,
          letterSpacing: '-0.015em', color: tokens.color.ink, lineHeight: 1.25, margin: '0 0 6px',
        }}>
          {step.text}
        </h1>
        {step.subtext && (
          <p style={{ fontSize: 13, color: tokens.color.text.sub, margin: '0 0 16px', lineHeight: 1.45 }}>
            {step.subtext}
          </p>
        )}

        {step.type === 'question' && step.options && (
          <fieldset style={{ border: 'none', padding: 0, margin: '16px 0 0' }}>
            {step.options.map((opt, i) => (
              <RadioRow
                key={opt.value}
                label={opt.label}
                sub={undefined}
                checked={selected === opt.value}
                onClick={() => setSelected(opt.value)}
                recommended={i === 0}
              />
            ))}
          </fieldset>
        )}

        {step.type === 'confirmation_message' && (
          <div style={{
            padding: '14px 16px', borderRadius: 10, marginTop: 16,
            background: tokens.color.surface.panel, border: `1px solid ${tokens.color.border}`,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
              <SparkGlyph size={12} color={AI_PURPLE_DEEP} />
              <SectionLabel>Confirmed from bank data</SectionLabel>
            </div>
            <p style={{ margin: 0, fontSize: tokens.type['14-5'], color: tokens.color.ink, lineHeight: 1.5 }}>
              {step.text}
            </p>
          </div>
        )}

        {step.type === 'input' && (
          <div style={{ marginTop: 16 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: tokens.color.ink, display: 'block', marginBottom: 6 }}>
              {step.inputPrefix ?? 'Amount'}
            </label>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={step.inputPlaceholder ?? '£0.00'}
              style={{
                width: '100%', padding: '12px 14px', borderRadius: 8, fontSize: 15,
                border: `1px solid ${tokens.color.border}`, fontFamily: tokens.font.mono,
                background: tokens.color.surface.panel,
              }}
            />
            {step.inputQualifiers && (
              <fieldset style={{ border: 'none', padding: 0, margin: '12px 0 0' }}>
                {step.inputQualifiers.map((q) => (
                  <RadioRow key={q.value} label={q.label} checked={false} onClick={() => {}} />
                ))}
              </fieldset>
            )}
          </div>
        )}

        {step.type === 'checklist' && step.options && (
          <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {step.options.map((opt) => (
              <label key={opt.value} style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px',
                borderRadius: 8, border: `1px solid ${tokens.color.border}`,
                background: tokens.color.surface.panel, cursor: 'pointer', fontSize: 14,
              }}>
                <input type="checkbox" style={{ accentColor: tokens.color.ink }} />
                {opt.label}
              </label>
            ))}
          </div>
        )}

        <AIMarginCard
          kind="tip"
          severity="info"
          title={`${step.sectionLabel} — question ${index + 1} of ${total}`}
          body={`This information maps to Form E disclosure. ${step.type === 'confirmation_message' ? 'We\'ve confirmed this from your bank data — just check it looks right.' : 'Your answer helps build an accurate financial picture.'}`}
        />

        <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
          {step.type !== 'confirmation_message' && (
            <button type="button" onClick={() => onNext(step.id, null)} style={{
              flex: 1, padding: '14px', borderRadius: 10, border: `1px solid ${tokens.color.border}`,
              background: 'transparent', color: tokens.color.text.sub, fontWeight: 600,
              fontSize: 13, cursor: 'pointer', fontFamily: tokens.font.sans,
            }}>
              Skip
            </button>
          )}
          <button type="button" onClick={() => onNext(step.id, selected ?? (inputValue || 'yes'))} style={{
            flex: 2, padding: '14px', borderRadius: 10, border: 'none',
            background: tokens.color.ink, color: '#fff', fontWeight: 600,
            fontSize: tokens.type['14-5'], cursor: 'pointer', fontFamily: tokens.font.sans,
          }}>
            {step.type === 'confirmation_message' ? 'Looks right' : 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
}

function shouldShow(step: ConfirmationStep, answers: Record<string, string>): boolean {
  if (!step.showWhen) return true;
  const prev = answers[step.showWhen.questionId];
  if (!prev) return false;
  if (Array.isArray(step.showWhen.value)) return step.showWhen.value.includes(prev);
  return prev === step.showWhen.value;
}

export default function DynamicSectionPage() {
  const params = useParams();
  const sectionKey = (params?.section as string) ?? 'income';
  const label = SECTION_LABELS[sectionKey] ?? sectionKey;
  const { sectionSteps, extractions } = useBankData();
  const allSteps = sectionSteps[sectionKey as ConfirmationSectionKey] ?? [];
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [rawIdx, setRawIdx] = useState(0);

  const visibleSteps = allSteps.filter(s => shouldShow(s, answers));
  const currentStep = Math.min(rawIdx, visibleSteps.length - 1);
  const hasData = extractions.length > 0;
  const step = visibleSteps[currentStep];
  const isComplete = hasData && rawIdx >= visibleSteps.length;

  function handleNext(stepId: string, answer: string | null) {
    if (answer) setAnswers(prev => ({ ...prev, [stepId]: answer }));
    setRawIdx(i => i + 1);
  }

  return (
    <main style={{
      minHeight: '100vh', background: tokens.color.surface.page,
      display: 'flex', flexDirection: 'column', fontFamily: tokens.font.sans,
    }}>
      <ProtoHeader
        backHref="/dev/proto/section-confirm"
        backLabel={`${label} confirmation`}
        rightSlot={hasData && visibleSteps.length > 0 ? (
          <span style={{ fontSize: 11, color: '#9CA3AF', letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 600 }}>
            {Math.min(currentStep + 1, visibleSteps.length)} of {visibleSteps.length}
          </span>
        ) : undefined}
      />

      {!hasData ? (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <p style={{ fontSize: tokens.type['14-5'], color: tokens.color.text.muted, textAlign: 'center' }}>
            No bank data loaded. <Link href="/dev/proto/bank-connect" style={{ color: tokens.color.phase.build.accent }}>Connect a bank</Link> to generate confirmation questions.
          </p>
        </div>
      ) : isComplete ? (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 20, gap: 16 }}>
          <div style={{
            width: 56, height: 56, borderRadius: '50%', background: '#DCFCE7',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28,
            color: tokens.color.phase.finalise.accent,
          }}>
            &#10003;
          </div>
          <h2 style={{ margin: 0, fontSize: tokens.type['17'], fontWeight: 600, color: tokens.color.ink }}>
            {label} confirmed
          </h2>
          <p style={{ margin: 0, fontSize: 13, color: tokens.color.text.sub }}>
            All {visibleSteps.length} question{visibleSteps.length !== 1 ? 's' : ''} reviewed.
          </p>
          <Link href="/dev/proto/section-confirm" style={{
            padding: '12px 24px', borderRadius: 10, background: tokens.color.ink,
            color: '#fff', fontWeight: 600, fontSize: 14, textDecoration: 'none',
          }}>
            Back to sections
          </Link>
        </div>
      ) : visibleSteps.length === 0 ? (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 20, gap: 12 }}>
          <h2 style={{ margin: 0, fontSize: tokens.type['17'], fontWeight: 600, color: tokens.color.ink }}>
            No questions for {label}
          </h2>
          <p style={{ margin: 0, fontSize: 13, color: tokens.color.text.sub }}>
            Nothing to confirm in this section based on your bank data.
          </p>
          <Link href="/dev/proto/section-confirm" style={{
            padding: '10px 20px', borderRadius: 8, fontSize: 13,
            color: tokens.color.text.sub, textDecoration: 'none', border: `1px solid ${tokens.color.border}`,
          }}>
            Back to sections
          </Link>
        </div>
      ) : step ? (
        <StepRenderer
          step={step}
          index={currentStep}
          total={visibleSteps.length}
          onNext={handleNext}
        />
      ) : null}
    </main>
  );
}
