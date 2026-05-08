import { describe, it, expect } from 'vitest';
import { registry } from '@/app/dev/proto/registry';
import { registryRowSchema } from '@/app/dev/proto/registry-schema';
import type { Section } from '@/app/dev/proto/registry-schema';

describe('registry data', () => {
  describe('section counts total 61', () => {
    it('contains exactly 61 rows', () => {
      expect(registry).toHaveLength(61);
    });

    it('section counts match acceptance.md AC-1', () => {
      const expected: Record<Section, number> = {
        'pre-auth-public': 8,
        'auth-boundary': 3,
        'post-signup-onboarding': 4,
        'bank-connect': 5,
        hub: 5,
        build: 10,
        reconcile: 5,
        settle: 5,
        finalise: 5,
        'cross-cutting': 5,
        'dev-tools': 6,
      };
      const actual = registry.reduce<Record<string, number>>((counts, row) => {
        counts[row.section] = (counts[row.section] ?? 0) + 1;
        return counts;
      }, {});
      expect(actual).toEqual(expected);
    });

    it('Σ section counts equals 61', () => {
      const sum = Object.values(
        registry.reduce<Record<string, number>>((counts, row) => {
          counts[row.section] = (counts[row.section] ?? 0) + 1;
          return counts;
        }, {}),
      ).reduce((a, b) => a + b, 0);
      expect(sum).toBe(61);
    });
  });

  describe('schema conformance', () => {
    it('every row passes registryRowSchema.parse', () => {
      for (const row of registry) {
        expect(() => registryRowSchema.parse(row), `row id=${row.id}`).not.toThrow();
      }
    });
  });

  describe('id uniqueness', () => {
    it('all row ids are unique', () => {
      const ids = registry.map((r) => r.id);
      expect(new Set(ids).size).toBe(ids.length);
    });

    it('all ids are kebab-case', () => {
      for (const row of registry) {
        expect(row.id, `row id=${row.id}`).toMatch(/^[a-z0-9-]+$/);
      }
    });
  });
});
