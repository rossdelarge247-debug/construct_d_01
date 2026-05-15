import { describe, it, expect } from 'vitest';
import { getCopy } from '@/app/dev/proto/pre-signup-interview/lib/copy/o8';

describe('o8 copy resolver', () => {
  const copy = getCopy('thinking');

  describe('planRecall', () => {
    it('returns the label', () => {
      expect(copy.planRecall.label).toBe('Your plan is ready');
    });

    it('returns the back-to-plan affordance', () => {
      expect(copy.planRecall.backToPlan).toBe('back to plan');
    });
  });

  describe('hero', () => {
    it('returns the eyebrow', () => {
      expect(copy.hero.eyebrow).toBe("What's next · take it from here");
    });

    it('returns the heading', () => {
      expect(copy.hero.heading).toBe('What would you like to do next?');
    });

    it('returns the split helper text', () => {
      expect(copy.hero.helper.primary).toBe("There's no wrong answer.");
      expect(copy.hero.helper.secondary).toBe('You can come back anytime.');
    });
  });

  describe('options', () => {
    it('returns 4 options in order', () => {
      expect(copy.options).toHaveLength(4);
      expect(copy.options.map((o) => o.id)).toEqual(['signup', 'download', 'conventional', 'support']);
    });

    it('returns signup option content', () => {
      const signup = copy.options.find((o) => o.id === 'signup')!;
      expect(signup.title).toBe('Create a free account and start building my picture');
      expect(signup.sub).toBe('Free to start; no card needed.');
      expect(signup.cta).toBe('Create my account');
    });

    it('returns download option content', () => {
      const download = copy.options.find((o) => o.id === 'download')!;
      expect(download.title).toBe('Download my plan and come back later');
      expect(download.sub).toBe("We'll keep your answers for 30 days if you want to come back.");
      expect(download.cta).toBe('Download my plan');
    });

    it('returns conventional option content', () => {
      const conventional = copy.options.find((o) => o.id === 'conventional')!;
      expect(conventional.title).toBe('I want to go the conventional route');
      expect(conventional.sub).toBe("We'll point you to good starting places.");
      expect(conventional.cta).toBe('See helpful links');
    });

    it('returns support option content', () => {
      const support = copy.options.find((o) => o.id === 'support')!;
      expect(support.title).toBe('I need to talk to someone first');
      expect(support.sub).toBe('Here are people who can help.');
      expect(support.cta).toBe('See support resources');
    });
  });

  describe('footer fallbacks', () => {
    it('returns the caption fallback for unselected state', () => {
      expect(copy.footer.captionFallback).toBe('Pick an option above to continue.');
    });

    it('returns the cta fallback for unselected state', () => {
      expect(copy.footer.ctaFallback).toBe('Continue');
    });
  });

  describe('stage parameter', () => {
    it('returns identical copy regardless of stage (next-step copy is stage-invariant)', () => {
      const thinking = getCopy('thinking');
      const decided = getCopy('decided');
      const inProcess = getCopy('in_process');
      expect(decided).toEqual(thinking);
      expect(inProcess).toEqual(thinking);
    });
  });
});
