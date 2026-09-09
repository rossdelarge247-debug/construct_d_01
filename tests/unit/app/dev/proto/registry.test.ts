import { describe, it, expect } from 'vitest';
import { registry } from '@/app/dev/proto/registry';
import { registryRowSchema } from '@/app/dev/proto/registry-schema';
import type { Section } from '@/app/dev/proto/registry-schema';

describe('registry data', () => {
  describe('registry totals + section sum invariants', () => {
    it('total row count matches expected length', () => {
      expect(registry).toHaveLength(64);
    });

    it('section counts match acceptance.md AC-1', () => {
      const expected: Record<Section, number> = {
        'pre-auth-public': 8,
        'auth-boundary': 3,
        'post-signup-onboarding': 4,
        'bank-connect': 5,
        hub: 6,
        build: 11,
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

    it('Σ section counts equals total row count', () => {
      const sum = Object.values(
        registry.reduce<Record<string, number>>((counts, row) => {
          counts[row.section] = (counts[row.section] ?? 0) + 1;
          return counts;
        }, {}),
      ).reduce((a, b) => a + b, 0);
      expect(sum).toBe(registry.length);
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

    it("'sign-up' is prototype-built with lastTouched, links.prototype and links.spec set", () => {
      const row = registry.find((r) => r.id === 'sign-up');
      expect(row, 'row id=sign-up missing').toBeDefined();
      expect(row!.status).toBe('prototype-built');
      expect(row!.lastTouched.session).toBe(125);
      expect(row!.lastTouched.date).toBe('2026-09-09');
      expect(row!.links.prototype).toBe('src/app/dev/proto/sign-up/');
      expect(row!.links.spec).toBe('docs/workspace-spec/65a-signup-orientation-reconciliation.md');
    });
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

    it("remaining 4 bank-rec-* rows (manual-entry, resolve-duplicate, split, balance-check) are prototype-built", () => {
      for (const id of ['bank-rec-manual-entry', 'bank-rec-resolve-duplicate', 'bank-rec-split', 'bank-rec-balance-check']) {
        const row = registry.find((r) => r.id === id);
        expect(row, `row id=${id} missing`).toBeDefined();
        expect(row!.status, `row id=${id}`).toBe('prototype-built');
      }
    });
  });

  describe('ai-coach slice surface carries refreshed status + confidence + lastTouched + links', () => {
    it("'ai-coach' transitions spec-only → prototype-built with confidence bump and openQuestion resolution", () => {
      const row = registry.find((r) => r.id === 'ai-coach');
      expect(row, "row id='ai-coach' missing").toBeDefined();
      expect(row!.section).toBe('settle');
      expect(row!.status).toBe('prototype-built');
      expect(row!.confidence).toBe('medium');
      expect(row!.lastTouched.session).toBe(118);
      expect(row!.lastTouched.date).toBe('2026-05-22');
      expect(row!.links.prototype).toBe('src/app/dev/proto/ai-coach/');
      expect(row!.links.slice).toBe('docs/slices/S-PROTO-ai-coach/');
      expect(row!.tags ?? []).toContain('ai-dependent');
      const openQs = row!.openQuestions ?? [];
      expect(openQs.some((q) => q.includes('Invocation pattern locked'))).toBe(true);
    });

    it("other §8 Settle rows unchanged (regression guard)", () => {
      for (const id of ['proposal-builder', 'counter', 'settlement-redline', 'negotiation-history']) {
        const row = registry.find((r) => r.id === id);
        expect(row, `row id=${id} missing`).toBeDefined();
        expect(row!.section).toBe('settle');
      }
      const proposalBuilder = registry.find((r) => r.id === 'proposal-builder');
      expect(proposalBuilder!.status).toBe('spec-only');
      const settlementRedline = registry.find((r) => r.id === 'settlement-redline');
      expect(settlementRedline!.status).toBe('canvas-drafted');
    });
  });

  describe('share-flow slice surface carries refreshed status + confidence + lastTouched + links', () => {
    it("'share-flow' transitions spec-only → prototype-built with confidence bump and openQuestion resolution", () => {
      const row = registry.find((r) => r.id === 'share-flow');
      expect(row, "row id='share-flow' missing").toBeDefined();
      expect(row!.status).toBe('prototype-built');
      expect(row!.confidence).toBe('medium');
      expect(row!.section).toBe('reconcile');
      expect(row!.openQuestions).toEqual([]);
      expect(row!.lastTouched).toEqual({ session: 119, date: '2026-05-23' });
      expect(row!.links.spec).toBe('docs/workspace-spec/68a-decisions-crosscutting.md');
      expect(row!.links.prototype).toBe('src/app/dev/proto/share-flow/');
      expect(row!.links.slice).toBe('docs/slices/S-PROTO-share-flow/');
      expect(row!.links.canvas).toBeUndefined();
    });

    it("other §7 Reconcile rows unchanged (regression guard)", () => {
      for (const id of ['joint-document-view', 'conflict-card', 'reconciliation-queue', 'counter-proposal-request']) {
        const row = registry.find((r) => r.id === id);
        expect(row, `row id=${id} missing`).toBeDefined();
        expect(row!.section).toBe('reconcile');
        expect(row!.lastTouched?.session ?? 0).toBeLessThan(119);
      }
    });
  });

  describe('todos surface — newly-sighted M_Todos canvas added to hub section', () => {
    it("'todos' row exists in hub section with canvas-drafted status + canvas link", () => {
      const row = registry.find((r) => r.id === 'todos');
      expect(row, "row id='todos' missing").toBeDefined();
      expect(row!.section).toBe('hub');
      expect(row!.status).toBe('canvas-drafted');
      expect(row!.confidence).toBe('low');
      expect(row!.links.canvas).toBe('docs/design-source/mobile-screens-v2/');
      expect(row!.tags ?? []).toContain('canvas-multi-variant');
      const openQs = row!.openQuestions ?? [];
      expect(openQs.some((q) => q.toLowerCase().includes('variant'))).toBe(true);
    });
  });
});
