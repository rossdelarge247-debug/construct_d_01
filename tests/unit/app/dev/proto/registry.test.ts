import { describe, it, expect } from 'vitest';
import { registry } from '@/app/dev/proto/registry';
import { registryRowSchema } from '@/app/dev/proto/registry-schema';
import type { Section } from '@/app/dev/proto/registry-schema';

describe('registry data', () => {
  describe('section counts total 62', () => {
    it('contains exactly 61 rows', () => {
      expect(registry).toHaveLength(62);
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
        'dev-tools': 7,
      };
      const actual = registry.reduce<Record<string, number>>((counts, row) => {
        counts[row.section] = (counts[row.section] ?? 0) + 1;
        return counts;
      }, {});
      expect(actual).toEqual(expected);
    });

    it('Σ section counts equals 62', () => {
      const sum = Object.values(
        registry.reduce<Record<string, number>>((counts, row) => {
          counts[row.section] = (counts[row.section] ?? 0) + 1;
          return counts;
        }, {}),
      ).reduce((a, b) => a + b, 0);
      expect(sum).toBe(62);
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

  describe('recently-shipped prototype surfaces carry refreshed status + lastTouched + links.prototype', () => {
    const expectedRows: Record<string, { status: string; linksPrototype: string; hasSlice?: boolean }> = {
      'marketing-landing': { status: 'prototype-built', linksPrototype: 'src/app/dev/proto/marketing-landing/' },
      'how-it-works': { status: 'shell-built', linksPrototype: 'src/app/dev/proto/how-it-works/' },
      'pricing': { status: 'shell-built', linksPrototype: 'src/app/dev/proto/pricing/' },
      'faq-trust': { status: 'shell-built', linksPrototype: 'src/app/dev/proto/faq-trust/' },
      'sign-up': { status: 'shell-built', linksPrototype: 'src/app/dev/proto/sign-up/' },
      'welcome-tour': { status: 'prototype-built', linksPrototype: 'src/app/dev/proto/welcome-tour/' },
      'hub-day-7-state-f': { status: 'prototype-built', linksPrototype: 'src/app/dev/proto/post-connect-dashboard/', hasSlice: true },
    };

    for (const [id, expected] of Object.entries(expectedRows)) {
      it(`'${id}' carries status=${expected.status}, lastTouched.session=115, links.prototype set`, () => {
        const row = registry.find((r) => r.id === id);
        expect(row, `row id=${id} missing`).toBeDefined();
        expect(row!.status).toBe(expected.status);
        expect(row!.lastTouched.session).toBe(115);
        expect(row!.lastTouched.date).toBe('2026-05-22');
        expect(row!.links.prototype).toBe(expected.linksPrototype);
        if (expected.hasSlice) {
          expect(row!.links.slice).toBe('docs/slices/S-PROTO-post-connect-dashboard-canvas-port/');
        }
      });
    }
  });

  describe('section-confirm slice surfaces carry refreshed status + lastTouched + links.prototype', () => {
    const expected: Record<string, { status: string; linksPrototype: string; canvasLink: string; hasSlice?: boolean }> = {
      'per-section-confirm': {
        status: 'prototype-built',
        linksPrototype: 'src/app/dev/proto/section-confirm/',
        canvasLink: 'docs/design-source/mobile-screens-v2/',
        hasSlice: true,
      },
      'bank-rec-categorise': {
        status: 'prototype-built',
        linksPrototype: 'src/app/dev/proto/section-confirm/categorise/',
        canvasLink: 'docs/design-source/mobile-screens-v2/',
      },
      'bank-rec-confirm-recurring': {
        status: 'prototype-built',
        linksPrototype: 'src/app/dev/proto/section-confirm/confirm-recurring/',
        canvasLink: 'docs/design-source/mobile-screens-v2/',
      },
    };

    for (const [id, exp] of Object.entries(expected)) {
      it(`'${id}' carries status=${exp.status}, refreshed lastTouched + links.prototype, canvas link retained`, () => {
        const row = registry.find((r) => r.id === id);
        expect(row, `row id=${id} missing`).toBeDefined();
        expect(row!.status).toBe(exp.status);
        expect(row!.lastTouched.session).toBe(117);
        expect(row!.lastTouched.date).toBe('2026-05-22');
        expect(row!.links.prototype).toBe(exp.linksPrototype);
        expect(row!.links.canvas).toBe(exp.canvasLink);
        if (exp.hasSlice) {
          expect(row!.links.slice).toBe('docs/slices/S-PROTO-section-confirm/');
        }
      });
    }

    it("'per-section-confirm' no longer carries the 'high-uncertainty' tag", () => {
      const row = registry.find((r) => r.id === 'per-section-confirm');
      expect(row).toBeDefined();
      expect(row!.tags ?? []).not.toContain('high-uncertainty');
    });

    it("remaining 4 bank-rec-* rows (manual-entry, resolve-duplicate, split, balance-check) stay canvas-drafted (regression guard for out-of-scope)", () => {
      for (const id of ['bank-rec-manual-entry', 'bank-rec-resolve-duplicate', 'bank-rec-split', 'bank-rec-balance-check']) {
        const row = registry.find((r) => r.id === id);
        expect(row, `row id=${id} missing`).toBeDefined();
        expect(row!.status, `row id=${id}`).toBe('canvas-drafted');
      }
    });
  });
});
