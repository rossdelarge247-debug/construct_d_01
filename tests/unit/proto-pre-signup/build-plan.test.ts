import { describe, expect, it } from 'vitest';
import { buildPlanFromAnswers } from '@/app/dev/proto/pre-signup-interview/lib/build-plan';
import type { Answers } from '@/app/dev/proto/pre-signup-interview/lib/types';

describe('buildPlanFromAnswers', () => {
  it('returns a fully-shaped plan even for empty answers', () => {
    const plan = buildPlanFromAnswers({});
    expect(plan.journeyStages).toHaveLength(6);
    expect(plan.conventionalPath.cost).toContain('£');
    expect(plan.howDecoupleHelps.pillars).toHaveLength(3);
    expect(plan.personalisedNotes).toHaveLength(0);
    expect(plan.situationSummary).toBeTruthy();
  });

  it('echoes the stage in the situation summary', () => {
    const a: Answers = { stage: 'in_process' };
    const plan = buildPlanFromAnswers(a);
    expect(plan.situationSummary).toMatch(/already in the process/i);
  });

  it('adds a parenting note when children are involved', () => {
    const a: Answers = { situation: { hasChildren: 'yes' } };
    const plan = buildPlanFromAnswers(a);
    expect(plan.personalisedNotes.some((n) => n.trigger === 'children')).toBe(true);
    expect(plan.whatNeedsToHappen.some((s) => s.toLowerCase().includes('children'))).toBe(true);
  });

  it('adds a self-employed note when the user or partner is self-employed', () => {
    const a: Answers = { employment: { selfEmployment: 'me' } };
    const plan = buildPlanFromAnswers(a);
    expect(plan.personalisedNotes.some((n) => n.trigger === 'self-employed')).toBe(true);
  });

  it('adds a safety-concern note with soft framing when relationship is unsafe', () => {
    const a: Answers = { exAndSafety: { relationshipQuality: 'safety-concern' } };
    const plan = buildPlanFromAnswers(a);
    const note = plan.personalisedNotes.find((n) => n.trigger === 'safety');
    expect(note).toBeDefined();
    expect(note?.body).toMatch(/private|specialist support/i);
  });

  it('adds a bank-evidenced note when partner finance is unknown', () => {
    const a: Answers = { partnerFinances: { awareness: 'little' } };
    const plan = buildPlanFromAnswers(a);
    expect(plan.personalisedNotes.some((n) => n.trigger === 'partner-finance-unknown')).toBe(true);
  });

  it('does not include a children-related task when children=none', () => {
    const a: Answers = { situation: { hasChildren: 'no' } };
    const plan = buildPlanFromAnswers(a);
    expect(plan.whatNeedsToHappen.some((s) => s.toLowerCase().includes('children'))).toBe(false);
    expect(plan.personalisedNotes.some((n) => n.trigger === 'children')).toBe(false);
  });

  describe('Dimension 1 — Stage', () => {
    it('thinking → exploratory situationSummary opening', () => {
      const plan = buildPlanFromAnswers({ stage: 'thinking' });
      expect(plan.situationSummary).toMatch(/considering separating/);
    });

    it('decided → action-oriented situationSummary opening', () => {
      const plan = buildPlanFromAnswers({ stage: 'decided' });
      expect(plan.situationSummary).toMatch(/decided to separate/);
    });

    it('thinking → conditional whatNeedsToHappen intro at items[0]', () => {
      const plan = buildPlanFromAnswers({ stage: 'thinking' });
      expect(plan.whatNeedsToHappen[0]).toBe("If you go ahead, here's what would need to happen.");
    });

    it('decided → immediate whatNeedsToHappen intro at items[0]', () => {
      const plan = buildPlanFromAnswers({ stage: 'decided' });
      expect(plan.whatNeedsToHappen[0]).toBe("Here's what needs to happen now.");
    });

    it('in_process → progress whatNeedsToHappen intro at items[0]', () => {
      const plan = buildPlanFromAnswers({ stage: 'in_process' });
      expect(plan.whatNeedsToHappen[0]).toMatch(/already in the process/);
    });

    it('undefined stage → default intro at items[0]', () => {
      const plan = buildPlanFromAnswers({});
      expect(plan.whatNeedsToHappen[0]).toBe("Here's what needs to happen.");
    });

    it('primaryCTA varies per stage', () => {
      expect(buildPlanFromAnswers({ stage: 'thinking' }).links.primaryCTA).toBe('See what comes next');
      expect(buildPlanFromAnswers({ stage: 'decided' }).links.primaryCTA).toBe('Continue');
      expect(buildPlanFromAnswers({ stage: 'in_process' }).links.primaryCTA).toBe('Pick up from here');
      expect(buildPlanFromAnswers({}).links.primaryCTA).toBe('Continue');
    });
  });

  describe('Dimension 2 — Partner-finances awareness', () => {
    it('full → partner-finance-full trigger present', () => {
      const plan = buildPlanFromAnswers({ partnerFinances: { awareness: 'full' } });
      const note = plan.personalisedNotes.find((n) => n.trigger === 'partner-finance-full');
      expect(note).toBeDefined();
      expect(note?.body).toMatch(/head-start|head start/i);
    });

    it('some → partner-finance-some trigger present', () => {
      const plan = buildPlanFromAnswers({ partnerFinances: { awareness: 'some' } });
      const note = plan.personalisedNotes.find((n) => n.trigger === 'partner-finance-some');
      expect(note).toBeDefined();
      expect(note?.body).toMatch(/fills the gaps|partial picture|partial/i);
    });

    it('suspect → partner-finance-unknown trigger (sibling of little)', () => {
      const plan = buildPlanFromAnswers({ partnerFinances: { awareness: 'suspect' } });
      expect(plan.personalisedNotes.some((n) => n.trigger === 'partner-finance-unknown')).toBe(true);
    });

    it('only one partner-finance trigger per render (mutually exclusive)', () => {
      const plan = buildPlanFromAnswers({ partnerFinances: { awareness: 'full' } });
      const triggers = plan.personalisedNotes.filter((n) => n.trigger.startsWith('partner-finance-'));
      expect(triggers).toHaveLength(1);
    });
  });

  describe('Dimension 3 — Example anchoring', () => {
    it('childrenCount=1 uses singular "1 child"', () => {
      const plan = buildPlanFromAnswers({ situation: { hasChildren: 'yes', childrenCount: 1 } });
      expect(plan.situationSummary).toContain('You have 1 child together.');
    });

    it('childrenCount=3 uses plural "3 children"', () => {
      const plan = buildPlanFromAnswers({ situation: { hasChildren: 'yes', childrenCount: 3 } });
      expect(plan.situationSummary).toContain('You have 3 children together.');
    });

    it('childrenCount missing → falls back to "children together"', () => {
      const plan = buildPlanFromAnswers({ situation: { hasChildren: 'yes' } });
      expect(plan.situationSummary).toMatch(/You have children together\./);
      expect(plan.situationSummary).not.toMatch(/You have \d/);
    });

    it('home=mortgage → mortgage sentence', () => {
      const plan = buildPlanFromAnswers({ situation: { home: 'mortgage' } });
      expect(plan.situationSummary).toContain('Your home is mortgaged.');
    });

    it('home=own-outright → own-outright sentence', () => {
      const plan = buildPlanFromAnswers({ situation: { home: 'own-outright' } });
      expect(plan.situationSummary).toContain('You own your home outright.');
    });

    it('home=rent → rent sentence', () => {
      const plan = buildPlanFromAnswers({ situation: { home: 'rent' } });
      expect(plan.situationSummary).toContain('You rent your home.');
    });

    it('home=other → no home sentence', () => {
      const plan = buildPlanFromAnswers({ situation: { home: 'other' } });
      expect(plan.situationSummary).not.toMatch(/your home|own your home|rent your home/i);
    });

    it('priorities[0] → priority-{value} trigger present', () => {
      const plan = buildPlanFromAnswers({ whatMatters: { priorities: ['fair-split'] } });
      expect(plan.personalisedNotes.some((n) => n.trigger === 'priority-fair-split')).toBe(true);
    });

    it('worries[0] → worry-{value} trigger present', () => {
      const plan = buildPlanFromAnswers({ whatMatters: { worries: ['hidden-assets'] } });
      expect(plan.personalisedNotes.some((n) => n.trigger === 'worry-hidden-assets')).toBe(true);
    });

    it('multiple priorities → only first generates a priority trigger', () => {
      const plan = buildPlanFromAnswers({
        whatMatters: { priorities: ['fair-split', 'keep-home', 'speed'] },
      });
      const priorityTriggers = plan.personalisedNotes.filter((n) => n.trigger.startsWith('priority-'));
      expect(priorityTriggers).toHaveLength(1);
      expect(priorityTriggers[0].trigger).toBe('priority-fair-split');
    });

    it('multiple worries → only first generates a worry trigger', () => {
      const plan = buildPlanFromAnswers({
        whatMatters: { worries: ['hidden-assets', 'losing-pension', 'mortgage-alone'] },
      });
      const worryTriggers = plan.personalisedNotes.filter((n) => n.trigger.startsWith('worry-'));
      expect(worryTriggers).toHaveLength(1);
      expect(worryTriggers[0].trigger).toBe('worry-hidden-assets');
    });

    it('combined anchor cap ≤ 2 (1 priority + 1 worry) regardless of selection size', () => {
      const plan = buildPlanFromAnswers({
        whatMatters: {
          priorities: ['fair-split', 'keep-home', 'speed'],
          worries: ['hidden-assets', 'losing-pension', 'mortgage-alone'],
        },
      });
      const anchorTriggers = plan.personalisedNotes.filter(
        (n) => n.trigger.startsWith('priority-') || n.trigger.startsWith('worry-'),
      );
      expect(anchorTriggers).toHaveLength(2);
    });
  });

  describe('Dimension 4 — Lead-ordering', () => {
    it('hasChildren=yes → children lead phrase prepended to summary', () => {
      const plan = buildPlanFromAnswers({ situation: { hasChildren: 'yes' } });
      expect(plan.situationSummary.startsWith('Keeping things steady for the children')).toBe(true);
    });

    it('children lead reorders the children step to substantive position 0', () => {
      const plan = buildPlanFromAnswers({ situation: { hasChildren: 'yes' } });
      // items[0] is the stage-intro framing line; substantive starts at index 1.
      expect(plan.whatNeedsToHappen[1]).toMatch(/time with the children/);
    });

    it('priorities=[keep-home] + home=mortgage → housing lead phrase', () => {
      const plan = buildPlanFromAnswers({
        situation: { living: 'yes', home: 'mortgage' },
        whatMatters: { priorities: ['keep-home'] },
      });
      expect(plan.situationSummary.startsWith('Decisions about your home')).toBe(true);
    });

    it('housing lead with living=yes reorders housing step to substantive position 0', () => {
      const plan = buildPlanFromAnswers({
        situation: { living: 'yes', home: 'mortgage' },
        whatMatters: { priorities: ['keep-home'] },
      });
      expect(plan.whatNeedsToHappen[1]).toMatch(/who stays in the home/);
    });

    it('priorities=[protect-pension] → pensions lead phrase, no whatNeedsToHappen reorder', () => {
      const plan = buildPlanFromAnswers({ whatMatters: { priorities: ['protect-pension'] } });
      expect(plan.situationSummary.startsWith('Protecting pensions')).toBe(true);
      // No pensions step exists in v1 whatNeedsToHappen → default substantive order.
      expect(plan.whatNeedsToHappen[1]).toMatch(/Each of you opens up/);
    });

    it('no signal → general lead, no lead phrase prepended', () => {
      const plan = buildPlanFromAnswers({ stage: 'thinking' });
      expect(plan.situationSummary.startsWith('You are considering separating')).toBe(true);
    });

    it('home=mortgage + keep-home priority → housing wins outright (not tied)', () => {
      const plan = buildPlanFromAnswers({
        situation: { hasChildren: 'yes', living: 'yes', home: 'mortgage' },
        whatMatters: { priorities: ['keep-home'] },
      });
      // children: hasChildren=yes (1) → 1
      // housing: home=mortgage (1) + keep-home priority (1) → 2
      // housing > children → housing wins, no fallback needed
      expect(plan.situationSummary.startsWith('Decisions about your home')).toBe(true);
    });

    it('genuine children-vs-housing tie → children fallback wins', () => {
      const plan = buildPlanFromAnswers({
        situation: { hasChildren: 'yes', living: 'yes', home: 'mortgage' },
        // no priorities → children=1, housing=1 (home only) → tied
      });
      expect(plan.situationSummary.startsWith('Keeping things steady for the children')).toBe(true);
    });

    it('home=rent does not contribute to housing score', () => {
      const plan = buildPlanFromAnswers({
        situation: { home: 'rent' },
        whatMatters: { priorities: ['protect-pension'] },
      });
      // housing score = 0, pensions = 1 → pensions wins
      expect(plan.situationSummary.startsWith('Protecting pensions')).toBe(true);
    });

    it('home=other does not contribute to housing score', () => {
      const plan = buildPlanFromAnswers({
        situation: { home: 'other' },
        whatMatters: { priorities: ['protect-pension'] },
      });
      expect(plan.situationSummary.startsWith('Protecting pensions')).toBe(true);
    });

    it('losing-pension worry contributes to pensions score', () => {
      const plan = buildPlanFromAnswers({ whatMatters: { worries: ['losing-pension'] } });
      expect(plan.situationSummary.startsWith('Protecting pensions')).toBe(true);
    });

    it('children lead with hasChildren=no does not reorder (no children step exists)', () => {
      // children-stability priority but no actual children → leadCategory='children' but no childrenStep to move
      const plan = buildPlanFromAnswers({
        situation: { hasChildren: 'no' },
        whatMatters: { priorities: ['children-stability'] },
      });
      expect(plan.situationSummary.startsWith('Keeping things steady for the children')).toBe(true);
      // no children step exists → substantive items unchanged
      expect(plan.whatNeedsToHappen[1]).toMatch(/Each of you opens up/);
    });
  });
});
