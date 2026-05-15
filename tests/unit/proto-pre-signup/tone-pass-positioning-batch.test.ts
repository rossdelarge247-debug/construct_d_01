import { describe, expect, it } from 'vitest';
import { getCopy as o1GetCopy } from '@/app/dev/proto/pre-signup-interview/lib/copy/o1';
import { getCopy as o2GetCopy } from '@/app/dev/proto/pre-signup-interview/lib/copy/o2';
import { buildPlanFromAnswers } from '@/app/dev/proto/pre-signup-interview/lib/build-plan';

describe('S-PROTO-tone-pass-positioning-batch', () => {
  describe('F-TONE-01 — O1 `decided` sub-copy', () => {
    it("matches the post-fix value 'You want to make a clear plan.'", () => {
      const copy = o1GetCopy('decided');
      const decidedOption = copy.options.find((o) => o.value === 'decided');
      expect(decidedOption?.sub).toBe('You want to make a clear plan.');
    });

    it('does not contain financial-disclosure-narrowing vocabulary', () => {
      const copy = o1GetCopy('decided');
      const decidedOption = copy.options.find((o) => o.value === 'decided');
      expect(decidedOption?.sub).not.toMatch(/finance|financial|money/i);
    });

    it('preserves the personal-anchor pattern shared with sibling stages', () => {
      const copy = o1GetCopy('decided');
      copy.options.forEach((opt) => {
        expect(opt.sub.startsWith('You ')).toBe(true);
      });
    });
  });

  describe('F-TONE-02 — O2 eyebrow', () => {
    it("matches the post-fix value 'Your situation'", () => {
      const copy = o2GetCopy('decided');
      expect(copy.eyebrow).toBe('Your situation');
    });

    it('does not start with a developer-facing screen identifier (e.g. O2 ·)', () => {
      const copy = o2GetCopy('decided');
      expect(copy.eyebrow).not.toMatch(/^O\d[a-z]?\s*[·:]/);
    });
  });

  describe('F-TONE-03 — `ongoing-support` priority-note Decouple-clause', () => {
    it('uses plain language: matches the post-fix value', () => {
      const plan = buildPlanFromAnswers({ whatMatters: { priorities: ['ongoing-support'] } });
      const note = plan.personalisedNotes.find((n) => n.trigger === 'priority-ongoing-support');
      expect(note?.body).toBe(
        "Because future financial support matters most to you, Decouple maps what's coming in and going out for both of you — so you can see what's actually workable.",
      );
    });

    it('does not contain analyst-systems jargon ("map maintenance scenarios", "bank-evidenced income")', () => {
      const plan = buildPlanFromAnswers({ whatMatters: { priorities: ['ongoing-support'] } });
      const note = plan.personalisedNotes.find((n) => n.trigger === 'priority-ongoing-support');
      expect(note?.body).not.toMatch(/map maintenance scenarios|bank-evidenced income/);
    });

    it('lead phrase stays per slice scope: F-TONE-13 cascade deferred to Phase 3 batch 3', () => {
      const plan = buildPlanFromAnswers({ whatMatters: { priorities: ['ongoing-support'] } });
      const note = plan.personalisedNotes.find((n) => n.trigger === 'priority-ongoing-support');
      expect(note?.body.startsWith('Because future financial support matters most to you,')).toBe(true);
    });
  });
});
