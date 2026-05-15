import { describe, expect, it } from 'vitest';
import { getCopy as o6GetCopy } from '@/app/dev/proto/pre-signup-interview/lib/copy/o6';
import { buildPlanFromAnswers } from '@/app/dev/proto/pre-signup-interview/lib/build-plan';

describe('plan-output warmth invariants', () => {
  describe('leadPhrase for housing', () => {
    it("starts the situation summary with 'Where each of you lives next sits at the heart of your plan.' when housing leads", () => {
      const plan = buildPlanFromAnswers({
        situation: { home: 'mortgage' },
        whatMatters: { priorities: ['keep-home'] },
      });
      expect(plan.situationSummary.startsWith('Where each of you lives next sits at the heart of your plan.')).toBe(true);
    });

    it('grounds in where-you-live concrete reality, not analyst meta-phrasing', () => {
      const plan = buildPlanFromAnswers({
        situation: { home: 'mortgage' },
        whatMatters: { priorities: ['keep-home'] },
      });
      expect(plan.situationSummary).not.toMatch(/Decisions about your home shape what comes next/);
    });
  });

  describe('leadPhrase for pensions', () => {
    it("starts the situation summary with 'What you've each built up for later — your plan keeps that in view.' when pensions leads", () => {
      const plan = buildPlanFromAnswers({
        whatMatters: { priorities: ['protect-pension'] },
      });
      expect(plan.situationSummary.startsWith("What you've each built up for later — your plan keeps that in view.")).toBe(true);
    });

    it('grounds in what-the-pension-is, not meta-phrasing about importance', () => {
      const plan = buildPlanFromAnswers({
        whatMatters: { priorities: ['protect-pension'] },
      });
      expect(plan.situationSummary).not.toMatch(/Protecting pensions matters in this picture/);
    });
  });

  describe('homeDescription for mortgage', () => {
    it("is 'You're paying off a mortgage on your home.'", () => {
      const plan = buildPlanFromAnswers({ situation: { home: 'mortgage' } });
      expect(plan.situationSummary).toContain("You're paying off a mortgage on your home.");
    });

    it("does not use the be-verb 'Your home is mortgaged.' framing", () => {
      const plan = buildPlanFromAnswers({ situation: { home: 'mortgage' } });
      expect(plan.situationSummary).not.toMatch(/Your home is mortgaged/);
    });
  });

  describe("O6 'ongoing-support' priority option label", () => {
    it("is 'Knowing one of us will still need support' — emotional-concern anchored", () => {
      const copy = o6GetCopy('decided');
      const option = copy.priorities.options.find((o) => o.value === 'ongoing-support');
      expect(option?.label).toBe('Knowing one of us will still need support');
    });

    it('drops administrative-form vocabulary', () => {
      const copy = o6GetCopy('decided');
      const option = copy.priorities.options.find((o) => o.value === 'ongoing-support');
      expect(option?.label).not.toBe('Ongoing financial support');
    });
  });

  describe("'ongoing-support' priority-note", () => {
    it("starts with 'Because ongoing support matters most to you,'", () => {
      const plan = buildPlanFromAnswers({ whatMatters: { priorities: ['ongoing-support'] } });
      const note = plan.personalisedNotes.find((n) => n.trigger === 'priority-ongoing-support');
      expect(note?.body.startsWith('Because ongoing support matters most to you,')).toBe(true);
    });

    it("does not use 'Because future financial support matters most to you'", () => {
      const plan = buildPlanFromAnswers({ whatMatters: { priorities: ['ongoing-support'] } });
      const note = plan.personalisedNotes.find((n) => n.trigger === 'priority-ongoing-support');
      expect(note?.body).not.toMatch(/Because future financial support matters most to you/);
    });

    it("Decouple-clause uses plain language: 'Decouple maps what's coming in and going out for both of you — so you can see what's actually workable.'", () => {
      const plan = buildPlanFromAnswers({ whatMatters: { priorities: ['ongoing-support'] } });
      const note = plan.personalisedNotes.find((n) => n.trigger === 'priority-ongoing-support');
      expect(note?.body).toContain("Decouple maps what's coming in and going out for both of you — so you can see what's actually workable.");
    });
  });
});
