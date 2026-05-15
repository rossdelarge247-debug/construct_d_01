import { describe, expect, it } from 'vitest';
import { getCopy as o1GetCopy } from '@/app/dev/proto/pre-signup-interview/lib/copy/o1';
import { getCopy as o2GetCopy } from '@/app/dev/proto/pre-signup-interview/lib/copy/o2';
import { buildPlanFromAnswers } from '@/app/dev/proto/pre-signup-interview/lib/build-plan';

describe('pre-signup interview copy invariants — positioning safeguards', () => {
  describe("O1 'decided' stage sub-copy", () => {
    it("is 'You want to make a clear plan.'", () => {
      const copy = o1GetCopy('decided');
      const decidedOption = copy.options.find((o) => o.value === 'decided');
      expect(decidedOption?.sub).toBe('You want to make a clear plan.');
    });

    it('does not narrow Decouple to finance vocabulary', () => {
      const copy = o1GetCopy('decided');
      const decidedOption = copy.options.find((o) => o.value === 'decided');
      expect(decidedOption?.sub).not.toMatch(/finance|financial|money/i);
    });

    it("follows the personal-anchor 'You ...' pattern shared by sibling stage options", () => {
      const copy = o1GetCopy('decided');
      copy.options.forEach((opt) => {
        expect(opt.sub.startsWith('You ')).toBe(true);
      });
    });
  });

  describe('O2 eyebrow', () => {
    it("is 'Your situation'", () => {
      const copy = o2GetCopy('decided');
      expect(copy.eyebrow).toBe('Your situation');
    });

    it('does not leak a developer-facing screen identifier (e.g. O2 ·)', () => {
      const copy = o2GetCopy('decided');
      expect(copy.eyebrow).not.toMatch(/^O\d[a-z]?\s*[·:]/);
    });
  });

  describe("'ongoing-support' priority-note Decouple-clause", () => {
    it("uses plain language: 'Decouple maps what's coming in and going out for both of you — so you can see what's actually workable.'", () => {
      const plan = buildPlanFromAnswers({ whatMatters: { priorities: ['ongoing-support'] } });
      const note = plan.personalisedNotes.find((n) => n.trigger === 'priority-ongoing-support');
      expect(note?.body).toBe(
        "Because ongoing support matters most to you, Decouple maps what's coming in and going out for both of you — so you can see what's actually workable.",
      );
    });

    it("does not contain analyst-systems jargon ('map maintenance scenarios', 'bank-evidenced income')", () => {
      const plan = buildPlanFromAnswers({ whatMatters: { priorities: ['ongoing-support'] } });
      const note = plan.personalisedNotes.find((n) => n.trigger === 'priority-ongoing-support');
      expect(note?.body).not.toMatch(/map maintenance scenarios|bank-evidenced income/);
    });

    it("uses the priority-note lead-phrase pattern 'Because <X> matters most to you,'", () => {
      const plan = buildPlanFromAnswers({ whatMatters: { priorities: ['ongoing-support'] } });
      const note = plan.personalisedNotes.find((n) => n.trigger === 'priority-ongoing-support');
      expect(note?.body.startsWith('Because ongoing support matters most to you,')).toBe(true);
    });
  });
});
