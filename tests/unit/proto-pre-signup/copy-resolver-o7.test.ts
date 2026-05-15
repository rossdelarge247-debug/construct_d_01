import { describe, it, expect } from 'vitest';
import { getCopy } from '@/app/dev/proto/pre-signup-interview/lib/copy/o7';

describe('o7 copy resolver', () => {
  const copy = getCopy('thinking');

  describe('hero', () => {
    it('returns the eyebrow', () => {
      expect(copy.hero.eyebrow).toBe('Your plan is ready');
    });

    it('returns the split heading parts', () => {
      expect(copy.hero.heading.prefix).toBe("Here's");
      expect(copy.hero.heading.accent).toBe('your plan');
      expect(copy.hero.heading.suffix).toBe('.');
    });

    it('returns the helper line', () => {
      expect(copy.hero.helper).toMatch(/Built from your six answers/);
    });

    it('returns the meta line', () => {
      expect(copy.hero.meta).toBe('~5 min read · 4 pages · yours to keep');
    });
  });

  describe('actions', () => {
    it('returns the download label', () => {
      expect(copy.actions.downloadAsPdf).toBe('Download as PDF');
    });

    it('returns the email-to-me label', () => {
      expect(copy.actions.emailToMe).toBe('Email it to me');
    });

    it('returns the email-link label', () => {
      expect(copy.actions.emailLink).toBe('Email link');
    });
  });

  describe('sections', () => {
    it('returns Section 1 — situation', () => {
      expect(copy.sections.situation.eyebrow).toBe('Section 1 · what you told us');
      expect(copy.sections.situation.title).toBe('Your situation');
    });

    it('returns Section 2 — journey', () => {
      expect(copy.sections.journey.eyebrow).toBe('Section 2 · the journey');
      expect(copy.sections.journey.title).toBe('What separation looks like');
    });

    it('returns Section 3 — what needs to happen', () => {
      expect(copy.sections.whatNeeds.eyebrow).toBe('Section 3 · tailored to you');
      expect(copy.sections.whatNeeds.title).toBe('What needs to happen');
    });

    it('returns Section 4 — conventional eyebrow only (title is dynamic)', () => {
      expect(copy.sections.conventional.eyebrow).toBe('Section 4 · for comparison');
    });

    it('returns Section 5 — decoupleHelps eyebrow only (title is dynamic)', () => {
      expect(copy.sections.decoupleHelps.eyebrow).toBe('Section 5 · how decouple helps');
    });

    it('returns Section 6 — notes with sub', () => {
      expect(copy.sections.notes.eyebrow).toBe('Section 6 · your specific notes');
      expect(copy.sections.notes.title).toBe('Things to bear in mind');
      expect(copy.sections.notes.sub).toMatch(/Drawn from the corners/);
    });
  });

  describe('reassurance', () => {
    it('returns the reassurance line', () => {
      expect(copy.reassurance).toBe("You've built a strong starting position.");
    });
  });

  describe('generating state', () => {
    it('returns the eyebrow', () => {
      expect(copy.generating.eyebrow).toBe('Drawing it together');
    });

    it('returns the split heading parts', () => {
      expect(copy.generating.heading.prefix).toBe('Take a');
      expect(copy.generating.heading.accent).toBe('breath');
      expect(copy.generating.heading.suffix).toBe('.');
    });

    it('returns the helper line', () => {
      expect(copy.generating.helper).toMatch(/We're shaping this/);
      expect(copy.generating.helper).toMatch(/no clock here/);
    });

    it('returns the aria label', () => {
      expect(copy.generating.ariaLabel).toBe('Plan generation progress');
    });

    it('returns 5 ordered steps with the expected states', () => {
      expect(copy.generating.steps).toHaveLength(5);
      expect(copy.generating.steps[0]).toEqual({ label: 'Listening to your situation', state: 'done' });
      expect(copy.generating.steps[1]).toEqual({ label: 'Mapping the journey', state: 'done' });
      expect(copy.generating.steps[2]).toEqual({ label: 'Tailoring next steps', state: 'done' });
      expect(copy.generating.steps[3]).toEqual({ label: 'Comparing the conventional path', state: 'working' });
      expect(copy.generating.steps[4]).toEqual({ label: 'Writing your specific notes', state: 'pending' });
    });

    it('returns the working indicator', () => {
      expect(copy.generating.workingIndicator).toBe('working…');
    });

    it('returns the quote with smart quotes', () => {
      expect(copy.generating.quote).toBe('“A warm hand on a cold day.”');
    });
  });

  describe('stage parameter', () => {
    it('returns identical copy regardless of stage (chrome text is stage-invariant)', () => {
      const thinking = getCopy('thinking');
      const decided = getCopy('decided');
      const inProcess = getCopy('in_process');
      expect(decided).toEqual(thinking);
      expect(inProcess).toEqual(thinking);
    });
  });
});
