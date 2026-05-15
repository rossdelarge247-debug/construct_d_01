import { describe, expect, it } from 'vitest';
import { getCopy as o3GetCopy } from '@/app/dev/proto/pre-signup-interview/lib/copy/o3';
import { getCopy as o4GetCopy } from '@/app/dev/proto/pre-signup-interview/lib/copy/o4';

describe('copy: eyebrow labels and partner referent', () => {
  it("O4 eyebrow names the side: 'Money · your side'", () => {
    const copy = o4GetCopy('decided');
    expect(copy.eyebrow.label).toBe('Money · your side');
  });

  it("O3 eyebrow uses partner referent", () => {
    const copy = o3GetCopy('decided');
    expect(copy.eyebrow).toBe('Your partner');
  });

  it("O3 heading uses partner referent", () => {
    const copy = o3GetCopy('decided');
    expect(copy.heading).toBe('How would you describe things between you and your partner?');
  });

  it("O3 relationship-question sr-only legend uses partner referent", () => {
    const copy = o3GetCopy('decided');
    expect(copy.relationship.label).toBe('How would you describe things between you and your partner?');
  });

  it("O4 self-employment 'ex' option detail uses partner referent (value-key kept stable)", () => {
    const copy = o4GetCopy('decided');
    const exOption = copy.options.find((o) => o.value === 'ex');
    expect(exOption?.detail).toBe('my partner is');
    expect(exOption?.value).toBe('ex');
  });
});
