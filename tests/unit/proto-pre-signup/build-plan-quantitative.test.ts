import { describe, expect, it } from 'vitest';
import { buildPlanFromAnswers } from '@/app/dev/proto/pre-signup-interview/lib/build-plan';
import type { Answers, Quantitative } from '@/app/dev/proto/pre-signup-interview/lib/types';

const q = (quant: Partial<Quantitative>): Answers => ({ quantitative: quant as Quantitative });
const triggers = (a: Answers): string[] => buildPlanFromAnswers(a).personalisedNotes.map((n) => n.trigger);
const quantOnly = (a: Answers): { trigger: string; body: string }[] =>
  buildPlanFromAnswers(a).personalisedNotes.filter((n) =>
    n.trigger.startsWith('sharing-') ||
    n.trigger.startsWith('consent-tier-') ||
    n.trigger.startsWith('timeline-')
  );

describe('buildPlanFromAnswers — quantitative layer', () => {
  describe('D5 sharing-principle weighting', () => {
    it('triggers sharing-full-weight for relationship_length 10-20y', () => {
      expect(triggers(q({ relationship_length: '10-20y' }))).toContain('sharing-full-weight');
    });
    it('triggers sharing-full-weight for relationship_length 20+y', () => {
      expect(triggers(q({ relationship_length: '20+y' }))).toContain('sharing-full-weight');
    });
    it('triggers sharing-light-weight for relationship_length <2y', () => {
      expect(triggers(q({ relationship_length: '<2y' }))).toContain('sharing-light-weight');
    });
    it('triggers sharing-light-weight for relationship_length 2-5y', () => {
      expect(triggers(q({ relationship_length: '2-5y' }))).toContain('sharing-light-weight');
    });
    it('emits no sharing note for relationship_length 5-10y (middle bracket)', () => {
      expect(triggers(q({ relationship_length: '5-10y' })).some((s) => s.startsWith('sharing-'))).toBe(false);
    });
    it('emits no sharing note when relationship_length is null', () => {
      expect(triggers(q({ relationship_length: null })).some((s) => s.startsWith('sharing-'))).toBe(false);
    });
  });

  describe('D6 consent-tier complexity', () => {
    it('triggers consent-tier-complex for total_assets 500k-1M', () => {
      expect(triggers(q({ total_assets: '500k-1M' }))).toContain('consent-tier-complex');
    });
    it('triggers consent-tier-complex for total_assets >1M', () => {
      expect(triggers(q({ total_assets: '>1M' }))).toContain('consent-tier-complex');
    });
    it('triggers consent-tier-complex for pension_value 300k+', () => {
      expect(triggers(q({ pension_value: '300k+' }))).toContain('consent-tier-complex');
    });
    it('triggers consent-tier-light for total_assets <10k AND pension_value none', () => {
      expect(triggers(q({ total_assets: '<10k', pension_value: 'none' }))).toContain('consent-tier-light');
    });
    it('triggers consent-tier-light for total_assets 10-50k AND pension_value <25k', () => {
      expect(triggers(q({ total_assets: '10-50k', pension_value: '<25k' }))).toContain('consent-tier-light');
    });
    it('triggers consent-tier-standard for mid-bracket combination (50-200k + 100-300k)', () => {
      expect(triggers(q({ total_assets: '50-200k', pension_value: '100-300k' }))).toContain('consent-tier-standard');
    });
    it('emits no consent note when total_assets and pension_value are both null', () => {
      expect(triggers(q({ total_assets: null, pension_value: null })).some((s) => s.startsWith('consent-tier-'))).toBe(false);
    });
  });

  describe('D7 timeline pressure framing', () => {
    it('triggers timeline-deadline-pressure for asap + deadline driver', () => {
      expect(triggers(q({ target_timeline: 'asap', timeline_drivers: ['deadline'] }))).toContain('timeline-deadline-pressure');
    });
    it('triggers timeline-deadline-pressure for 3m + deadline driver', () => {
      expect(triggers(q({ target_timeline: '3m', timeline_drivers: ['deadline'] }))).toContain('timeline-deadline-pressure');
    });
    it('triggers timeline-unanchored-urgency for asap + empty drivers', () => {
      expect(triggers(q({ target_timeline: 'asap', timeline_drivers: [] }))).toContain('timeline-unanchored-urgency');
    });
    it('triggers timeline-unanchored-urgency for asap with no drivers field at all', () => {
      expect(triggers(q({ target_timeline: 'asap' }))).toContain('timeline-unanchored-urgency');
    });
    it('triggers timeline-patient for target_timeline 18m+', () => {
      expect(triggers(q({ target_timeline: '18m+' }))).toContain('timeline-patient');
    });
    it('triggers timeline-patient for target_timeline unsure', () => {
      expect(triggers(q({ target_timeline: 'unsure' }))).toContain('timeline-patient');
    });
    it('triggers timeline-patient when target_timeline is null and quantitative is provided', () => {
      expect(triggers(q({ target_timeline: null }))).toContain('timeline-patient');
    });
  });

  describe('null tolerance', () => {
    it('emits no quantitative notes when quantitative is absent', () => {
      const t = triggers({});
      expect(t.some((s) =>
        s.startsWith('sharing-') || s.startsWith('consent-tier-') || s.startsWith('timeline-')
      )).toBe(false);
    });
    it('preserves categorical notes unaffected by absent quantitative', () => {
      const a: Answers = { situation: { hasChildren: 'yes' } };
      const plan = buildPlanFromAnswers(a);
      expect(plan.personalisedNotes.some((n) => n.trigger === 'children')).toBe(true);
    });
  });

  describe('cap + ordering (D5 → D6 → D7)', () => {
    it('caps at 2 quantitative notes when all 3 dimensions fire', () => {
      const a = q({ relationship_length: '10-20y', total_assets: '>1M', target_timeline: '18m+' });
      expect(quantOnly(a)).toHaveLength(2);
    });
    it('keeps first 2 in D5 → D6 → D7 order when all 3 fire', () => {
      const a = q({ relationship_length: '10-20y', total_assets: '>1M', target_timeline: '18m+' });
      const out = quantOnly(a);
      expect(out[0].trigger).toBe('sharing-full-weight');
      expect(out[1].trigger).toBe('consent-tier-complex');
      expect(out.some((n) => n.trigger.startsWith('timeline-'))).toBe(false);
    });
    it('falls through to D6 + D7 when D5 returns null', () => {
      const a = q({
        relationship_length: '5-10y',
        total_assets: '>1M',
        target_timeline: 'asap',
        timeline_drivers: ['deadline'],
      });
      const out = quantOnly(a);
      expect(out).toHaveLength(2);
      expect(out[0].trigger).toBe('consent-tier-complex');
      expect(out[1].trigger).toBe('timeline-deadline-pressure');
    });
  });

  describe('body copy (AC-7)', () => {
    it('every quantitative note has a non-empty body of substantive length', () => {
      const a = q({ relationship_length: '10-20y', total_assets: '>1M' });
      const out = quantOnly(a);
      expect(out.length).toBeGreaterThan(0);
      out.forEach((n) => expect(n.body.length).toBeGreaterThan(40));
    });
  });
});
