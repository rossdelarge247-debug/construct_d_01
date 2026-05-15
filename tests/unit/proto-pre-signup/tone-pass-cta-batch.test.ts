import { describe, expect, it } from 'vitest';
import { getCopy as o1GetCopy } from '@/app/dev/proto/pre-signup-interview/lib/copy/o1';
import { getCopy as o4GetCopy } from '@/app/dev/proto/pre-signup-interview/lib/copy/o4';
import { getCopy as o5GetCopy } from '@/app/dev/proto/pre-signup-interview/lib/copy/o5';
import { buildPlanFromAnswers } from '@/app/dev/proto/pre-signup-interview/lib/build-plan';

describe('pre-signup interview CTA invariants — destination-naming safeguards', () => {
  describe('O1 CTA', () => {
    it("is 'Set up your situation' — names the O2 destination", () => {
      const copy = o1GetCopy('decided');
      expect(copy.cta).toBe('Set up your situation');
    });

    it('is not bare anodyne label', () => {
      const copy = o1GetCopy('decided');
      expect(copy.cta).not.toBe('Continue');
    });
  });

  describe('O4 CTA', () => {
    it("is 'Next: their side' — names the O5 destination", () => {
      const copy = o4GetCopy('decided');
      expect(copy.cta.continue).toBe('Next: their side');
    });

    it('is not bare anodyne label', () => {
      const copy = o4GetCopy('decided');
      expect(copy.cta.continue).not.toBe('Continue');
    });
  });

  describe('O5 CTA', () => {
    it("is 'Next: what matters to you' — names the O6 destination", () => {
      const copy = o5GetCopy('decided');
      expect(copy.cta.continue).toBe('Next: what matters to you');
    });

    it('is not bare anodyne label', () => {
      const copy = o5GetCopy('decided');
      expect(copy.cta.continue).not.toBe('Continue');
    });
  });

  describe("primaryCTA for 'decided' stage (build-plan)", () => {
    it("is 'Begin the plan' — equal warmth-footing with 'thinking' / 'in_process'", () => {
      const plan = buildPlanFromAnswers({ stage: 'decided' });
      expect(plan.links.primaryCTA).toBe('Begin the plan');
    });

    it('is not bare anodyne label', () => {
      const plan = buildPlanFromAnswers({ stage: 'decided' });
      expect(plan.links.primaryCTA).not.toBe('Continue');
    });

    it("'thinking' and 'in_process' siblings keep their warm wording (regression)", () => {
      const thinking = buildPlanFromAnswers({ stage: 'thinking' });
      const inProcess = buildPlanFromAnswers({ stage: 'in_process' });
      expect(thinking.links.primaryCTA).toBe('See what comes next');
      expect(inProcess.links.primaryCTA).toBe('Pick up from here');
    });
  });
});
