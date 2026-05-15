import { describe, expect, it } from 'vitest';
import { getCopy as o3GetCopy } from '@/app/dev/proto/pre-signup-interview/lib/copy/o3';
import { getCopy as o4GetCopy } from '@/app/dev/proto/pre-signup-interview/lib/copy/o4';
import { getCopy as o5GetCopy } from '@/app/dev/proto/pre-signup-interview/lib/copy/o5';

describe('chassis caption invariants', () => {
  it("O4 oneAnswered is 'Noted — keep going when you're ready.'", () => {
    const copy = o4GetCopy('decided');
    expect(copy.captions.oneAnswered).toBe("Noted — keep going when you're ready.");
  });

  it("O5 oneAnswered is 'Noted — keep going when you're ready.'", () => {
    const copy = o5GetCopy('decided');
    expect(copy.captions.oneAnswered).toBe("Noted — keep going when you're ready.");
  });

  it("O3 pickToContinue is 'Pick the one closest to how things feel right now.' (emotional-frame, fits relationship-quality question)", () => {
    const copy = o3GetCopy('decided');
    expect(copy.captions.pickToContinue).toBe('Pick the one closest to how things feel right now.');
  });

  it("O4 pickToContinue is 'Pick the answer closest to what's true today.' (factual-frame, fits employment-categorization question)", () => {
    const copy = o4GetCopy('decided');
    expect(copy.captions.pickToContinue).toBe("Pick the answer closest to what's true today.");
  });

  it("O3 bothAnswered is 'Both noted — ready when you are.'", () => {
    const copy = o3GetCopy('decided');
    expect(copy.captions.bothAnswered).toBe('Both noted — ready when you are.');
  });
});
