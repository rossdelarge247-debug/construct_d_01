import { describe, expect, it } from 'vitest';
import { buildPlanFromAnswers } from '@/app/dev/proto/pre-signup-interview/lib/build-plan';
import type { Answers } from '@/app/dev/proto/pre-signup-interview/lib/types';

describe('buildPlanFromAnswers', () => {
  it('returns a fully-shaped plan even for empty answers', () => {
    const plan = buildPlanFromAnswers({});
    expect(plan.journeyStages).toHaveLength(6);
    expect(plan.conventionalPath.cost).toContain('£');
    expect(plan.howDecoupleHelps.pillars).toHaveLength(3);
    expect(plan.personalisedNotes).toHaveLength(0);
    expect(plan.situationSummary).toBeTruthy();
  });

  it('echoes the stage in the situation summary', () => {
    const a: Answers = { stage: 'in-process' };
    const plan = buildPlanFromAnswers(a);
    expect(plan.situationSummary).toMatch(/already in the process/i);
  });

  it('adds a parenting note when children are involved', () => {
    const a: Answers = { children: 'have-with-partner' };
    const plan = buildPlanFromAnswers(a);
    expect(plan.personalisedNotes.some((n) => n.trigger === 'children')).toBe(true);
    expect(plan.whatNeedsToHappen.some((s) => s.toLowerCase().includes('children'))).toBe(true);
  });

  it('adds a self-employed note when the user or partner is self-employed', () => {
    const a: Answers = { employment: { selfEmployment: 'me' } };
    const plan = buildPlanFromAnswers(a);
    expect(plan.personalisedNotes.some((n) => n.trigger === 'self-employed')).toBe(true);
  });

  it('adds a safety-concern note with soft framing when relationship is unsafe', () => {
    const a: Answers = { relationship: 'safety-concern' };
    const plan = buildPlanFromAnswers(a);
    const note = plan.personalisedNotes.find((n) => n.trigger === 'safety');
    expect(note).toBeDefined();
    expect(note?.body).toMatch(/private|specialist support/i);
  });

  it('adds a bank-evidenced note when partner finance is unknown', () => {
    const a: Answers = { partnerFinances: { awareness: 'very-little' } };
    const plan = buildPlanFromAnswers(a);
    expect(plan.personalisedNotes.some((n) => n.trigger === 'partner-finance-unknown')).toBe(true);
  });

  it('does not include a children-related task when children=none', () => {
    const a: Answers = { children: 'none' };
    const plan = buildPlanFromAnswers(a);
    expect(plan.whatNeedsToHappen.some((s) => s.toLowerCase().includes('children'))).toBe(false);
    expect(plan.personalisedNotes.some((n) => n.trigger === 'children')).toBe(false);
  });
});
