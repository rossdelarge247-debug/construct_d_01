import { describe, expect, it } from 'vitest';
import { getCopy as o3GetCopy } from '@/app/dev/proto/pre-signup-interview/lib/copy/o3';
import { getCopy as o4GetCopy } from '@/app/dev/proto/pre-signup-interview/lib/copy/o4';
import { getCopy as o5GetCopy } from '@/app/dev/proto/pre-signup-interview/lib/copy/o5';

describe('chassis caption invariants', () => {
  describe('O4 oneAnswered', () => {
    it("is 'Noted — keep going when you're ready.'", () => {
      const copy = o4GetCopy('decided');
      expect(copy.captions.oneAnswered).toBe("Noted — keep going when you're ready.");
    });

    it('does not use admin-panel form-system vocabulary', () => {
      const copy = o4GetCopy('decided');
      expect(copy.captions.oneAnswered).not.toMatch(/Answer recorded/);
    });
  });

  describe('O5 oneAnswered', () => {
    it("is 'Noted — keep going when you're ready.'", () => {
      const copy = o5GetCopy('decided');
      expect(copy.captions.oneAnswered).toBe("Noted — keep going when you're ready.");
    });

    it('does not use admin-panel form-system vocabulary', () => {
      const copy = o5GetCopy('decided');
      expect(copy.captions.oneAnswered).not.toMatch(/Answer recorded/);
    });
  });

  describe('O3 pickToContinue', () => {
    it("is 'Pick the one closest to how things feel right now.'", () => {
      const copy = o3GetCopy('decided');
      expect(copy.captions.pickToContinue).toBe('Pick the one closest to how things feel right now.');
    });

    it('does not use instructional vocabulary ("Pick the option that fits")', () => {
      const copy = o3GetCopy('decided');
      expect(copy.captions.pickToContinue).not.toMatch(/Pick the option that fits/);
    });
  });

  describe('O4 pickToContinue', () => {
    it("is 'Pick the one closest to how things feel right now.'", () => {
      const copy = o4GetCopy('decided');
      expect(copy.captions.pickToContinue).toBe('Pick the one closest to how things feel right now.');
    });

    it('does not use instructional vocabulary', () => {
      const copy = o4GetCopy('decided');
      expect(copy.captions.pickToContinue).not.toMatch(/Pick the option that fits/);
    });
  });

  describe('O3 bothAnswered', () => {
    it("is 'Both noted — ready when you are.'", () => {
      const copy = o3GetCopy('decided');
      expect(copy.captions.bothAnswered).toBe('Both noted — ready when you are.');
    });

    it('does not use bare two-word system-state', () => {
      const copy = o3GetCopy('decided');
      expect(copy.captions.bothAnswered).not.toBe('Both answered.');
    });
  });
});
