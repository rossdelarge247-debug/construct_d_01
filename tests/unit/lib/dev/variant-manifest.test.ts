import { describe, expect, it } from 'vitest';
import { findOption, isValidVariantId, type VariantSet } from '@/lib/dev/variant-manifest';

describe('variant-manifest — findOption', () => {
  const set: VariantSet = {
    label: 'Test',
    options: [
      { id: 'a', label: 'Alpha' },
      { id: 'b', label: 'Beta', description: 'Second option' },
    ],
    default: 'a',
  };

  it('returns the option with matching id', () => {
    expect(findOption(set, 'b')).toEqual({ id: 'b', label: 'Beta', description: 'Second option' });
  });

  it('returns undefined for unknown id', () => {
    expect(findOption(set, 'z')).toBeUndefined();
  });
});

describe('variant-manifest — isValidVariantId', () => {
  const set: VariantSet = {
    label: 'Test',
    options: [
      { id: 'a', label: 'Alpha' },
      { id: 'b', label: 'Beta' },
    ],
    default: 'a',
  };

  it('returns true for a known option id', () => {
    expect(isValidVariantId(set, 'a')).toBe(true);
    expect(isValidVariantId(set, 'b')).toBe(true);
  });

  it('returns false for an unknown id', () => {
    expect(isValidVariantId(set, 'c')).toBe(false);
  });

  it('returns false for null / undefined / empty', () => {
    expect(isValidVariantId(set, null)).toBe(false);
    expect(isValidVariantId(set, undefined)).toBe(false);
    expect(isValidVariantId(set, '')).toBe(false);
  });

  it('returns false when set is undefined', () => {
    expect(isValidVariantId(undefined, 'a')).toBe(false);
  });
});
