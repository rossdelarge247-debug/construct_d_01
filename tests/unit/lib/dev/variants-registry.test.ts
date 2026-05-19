import { describe, expect, it } from 'vitest';
import { VARIANT_REGISTRY } from '@/lib/dev/variants-registry';

describe('variants-registry', () => {
  it('exposes pre-signup-interview with a helpRail variant set', () => {
    const entry = VARIANT_REGISTRY['pre-signup-interview'];
    expect(entry).toBeDefined();
    expect(entry.prototypeId).toBe('pre-signup-interview');
    expect(entry.manifest.helpRail).toBeDefined();
  });

  it('helpRail has six options including off and v1-v5', () => {
    const set = VARIANT_REGISTRY['pre-signup-interview']?.manifest.helpRail;
    expect(set?.options.map((o) => o.id).sort()).toEqual(['off', 'v1', 'v2', 'v3', 'v4', 'v5']);
  });

  it('helpRail default is off (preserves existing mobile behaviour as the unsurprised default)', () => {
    const set = VARIANT_REGISTRY['pre-signup-interview']?.manifest.helpRail;
    expect(set?.default).toBe('off');
  });
});
