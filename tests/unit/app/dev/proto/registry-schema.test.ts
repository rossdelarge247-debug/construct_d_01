import { describe, it, expect } from 'vitest';
import {
  registryRowSchema,
  sectionSchema,
  statusSchema,
  confidenceSchema,
  ownerSchema,
  type RegistryRow,
} from '@/app/dev/proto/registry-schema';

const validRow: RegistryRow = {
  id: 'test-row',
  title: 'Test row',
  section: 'pre-auth-public',
  status: 'not-started',
  confidence: 'low',
  owner: 'both',
  tags: ['test-tag'],
  openQuestions: ['Is this a question?'],
  lastTouched: { session: 74, date: '2026-05-08' },
  links: { spec: 'docs/example.md' },
};

describe('registryRowSchema', () => {
  describe('valid input', () => {
    it('parses a minimal valid row', () => {
      expect(registryRowSchema.parse(validRow)).toEqual(validRow);
    });

    it('parses a row with all 4 link fields populated', () => {
      const row = {
        ...validRow,
        links: {
          spec: 'spec.md',
          canvas: 'canvas/file.html',
          prototype: 'src/app/dev/proto/x/',
          slice: 'docs/slices/X/',
        },
      };
      expect(() => registryRowSchema.parse(row)).not.toThrow();
    });

    it('accepts empty tags array', () => {
      expect(() => registryRowSchema.parse({ ...validRow, tags: [] })).not.toThrow();
    });

    it('accepts up to 5 open questions', () => {
      const row = { ...validRow, openQuestions: ['q1', 'q2', 'q3', 'q4', 'q5'] };
      expect(() => registryRowSchema.parse(row)).not.toThrow();
    });

    it('accepts empty links object', () => {
      expect(() => registryRowSchema.parse({ ...validRow, links: {} })).not.toThrow();
    });
  });

  describe('invalid input', () => {
    it('rejects empty id', () => {
      expect(() => registryRowSchema.parse({ ...validRow, id: '' })).toThrow();
    });

    it('rejects empty title', () => {
      expect(() => registryRowSchema.parse({ ...validRow, title: '' })).toThrow();
    });

    it('rejects unknown section', () => {
      expect(() =>
        registryRowSchema.parse({ ...validRow, section: 'invalid-section' }),
      ).toThrow();
    });

    it('rejects unknown status', () => {
      expect(() => registryRowSchema.parse({ ...validRow, status: 'made-up' })).toThrow();
    });

    it('rejects unknown confidence', () => {
      expect(() =>
        registryRowSchema.parse({ ...validRow, confidence: 'extreme' }),
      ).toThrow();
    });

    it('rejects unknown owner', () => {
      expect(() => registryRowSchema.parse({ ...validRow, owner: 'system' })).toThrow();
    });

    it('rejects more than 5 open questions', () => {
      const row = {
        ...validRow,
        openQuestions: ['q1', 'q2', 'q3', 'q4', 'q5', 'q6'],
      };
      expect(() => registryRowSchema.parse(row)).toThrow();
    });

    it('rejects missing lastTouched', () => {
      const { lastTouched: _, ...row } = validRow;
      void _;
      expect(() => registryRowSchema.parse(row)).toThrow();
    });

    it('rejects negative session number', () => {
      const row = { ...validRow, lastTouched: { session: -1, date: '2026-05-08' } };
      expect(() => registryRowSchema.parse(row)).toThrow();
    });
  });

  describe('enum schemas exposed for reuse', () => {
    it('sectionSchema accepts all 11 valid values', () => {
      const valid = [
        'pre-auth-public',
        'auth-boundary',
        'post-signup-onboarding',
        'bank-connect',
        'hub',
        'build',
        'reconcile',
        'settle',
        'finalise',
        'cross-cutting',
        'dev-tools',
      ];
      for (const v of valid) {
        expect(() => sectionSchema.parse(v)).not.toThrow();
      }
    });

    it('sectionSchema rejects unknown values', () => {
      expect(() => sectionSchema.parse('not-a-section')).toThrow();
    });

    it('statusSchema accepts all 6 values', () => {
      for (const v of ['not-started', 'spec-only', 'canvas-drafted', 'shell-built', 'prototype-built', 'shipped']) {
        expect(() => statusSchema.parse(v)).not.toThrow();
      }
    });

    it("statusSchema orders 'shell-built' between 'canvas-drafted' and 'prototype-built'", () => {
      const options = statusSchema.options;
      const canvasIdx = options.indexOf('canvas-drafted');
      const shellIdx = options.indexOf('shell-built');
      const protoIdx = options.indexOf('prototype-built');
      expect(canvasIdx).toBeGreaterThanOrEqual(0);
      expect(shellIdx).toBe(canvasIdx + 1);
      expect(protoIdx).toBe(shellIdx + 1);
    });

    it('confidenceSchema accepts all 4 values', () => {
      for (const v of ['high', 'medium', 'low', 'low-blocked']) {
        expect(() => confidenceSchema.parse(v)).not.toThrow();
      }
    });

    it('ownerSchema accepts all 3 values', () => {
      for (const v of ['user', 'claude', 'both']) {
        expect(() => ownerSchema.parse(v)).not.toThrow();
      }
    });
  });
});
