import type { Answers, Home, PlanContent, Priority, Stage, Worry } from './types';

const STANDARD_JOURNEY_STAGES: PlanContent['journeyStages'] = [
  { key: 'filing', label: 'File for divorce', sub: 'Apply to court (if married)' },
  { key: 'disclosure', label: 'Share finances', sub: 'Each side opens the books' },
  { key: 'negotiation', label: 'Negotiate', sub: 'Talk through what each of you needs' },
  { key: 'agreement', label: 'Agree the settlement', sub: 'Write down what you both want' },
  { key: 'court', label: 'Get court approval', sub: 'A judge approves the agreement' },
  { key: 'implementation', label: 'Implement', sub: 'Move money, transfer assets, close accounts' },
];

const STANDARD_CONVENTIONAL_PATH: PlanContent['conventionalPath'] = {
  headline: 'The path most people take',
  cost: '£14,561 average per couple',
  timeline: '18 to 24 months from start to finish',
  body:
    'Most separating couples each hire a solicitor. Their solicitors negotiate on their behalf, exchange financial information by post or email, and draft the consent order. The journey is thorough, but slow and expensive.',
};

const STANDARD_DECOUPLE_HELPS: PlanContent['howDecoupleHelps'] = {
  headline: 'How Decouple helps',
  body:
    'Decouple is the complete settlement workspace where both of you work on one shared picture of your finances, children, housing and future needs — and generate the legal documents from the agreement you both sign off.',
  pillars: ['Shared, not adversarial', 'Evidenced, not asserted', 'End-to-end, not hand-off'],
};

type LeadCategory = 'children' | 'housing' | 'pensions' | 'general';

function deriveLeadCategory(answers: Answers): LeadCategory {
  let scoreChildren = 0;
  let scoreHousing = 0;
  let scorePensions = 0;
  if (answers.situation?.hasChildren === 'yes') scoreChildren++;
  if (answers.whatMatters?.priorities?.includes('children-stability')) scoreChildren++;
  const home = answers.situation?.home;
  if (home && home !== 'rent' && home !== 'other') scoreHousing++;
  if (answers.whatMatters?.priorities?.includes('keep-home')) scoreHousing++;
  if (answers.whatMatters?.priorities?.includes('protect-pension')) scorePensions++;
  if (answers.whatMatters?.worries?.includes('losing-pension')) scorePensions++;

  const max = Math.max(scoreChildren, scoreHousing, scorePensions);
  if (max === 0) return 'general';
  if (scoreChildren === max) return 'children';
  if (scoreHousing === max) return 'housing';
  return 'pensions';
}

function leadPhrase(lead: LeadCategory): string {
  switch (lead) {
    case 'children': return 'Keeping things steady for the children comes first in your plan.';
    case 'housing': return 'Decisions about your home shape what comes next.';
    case 'pensions': return 'Protecting pensions matters in this picture.';
    case 'general': return '';
  }
}

function primaryCTAForStage(stage: Stage | undefined): string {
  switch (stage) {
    case 'thinking': return 'See what comes next';
    case 'decided': return 'Begin the plan';
    case 'in_process': return 'Pick up from here';
    default: return 'Continue';
  }
}

function whatNeedsIntroForStage(stage: Stage | undefined): string {
  switch (stage) {
    case 'thinking': return "If you go ahead, here's what would need to happen.";
    case 'decided': return "Here's what needs to happen now.";
    case 'in_process': return "You're already in the process — here's what's coming next and where to focus.";
    default: return "Here's what needs to happen.";
  }
}

function homeDescription(home: Home | undefined): string | null {
  switch (home) {
    case 'mortgage': return 'Your home is mortgaged.';
    case 'own-outright': return 'You own your home outright.';
    case 'rent': return 'You rent your home.';
    default: return null;
  }
}

const PRIORITY_NOTES: Record<Priority, string> = {
  'fair-split': 'Because a fair split matters most to you, Decouple shows the full picture so neither of you walks away feeling shortchanged.',
  'keep-home': 'Because keeping the home matters most to you, Decouple helps you model what you can afford solo and the trade-offs that come with it.',
  'protect-pension': 'Because protecting pensions matters most to you, Decouple surfaces pension valuations and sharing options clearly, so nothing important slips past.',
  'children-stability': 'Because keeping things steady for the children matters most to you, Decouple builds the parenting plan alongside the financial picture.',
  'clean-break': 'Because a clean break matters most to you, Decouple shows where ongoing financial ties — joint accounts, pensions, shared liabilities — need definite resolution.',
  'speed': 'Because resolving this quickly matters most to you, Decouple removes the back-and-forth of solicitor letters — both sides see the same picture in real time.',
  'low-cost': 'Because keeping costs low matters most to you, Decouple replaces the £14,561 average solicitor journey with a £800-1,100 collaborative path.',
  'ongoing-support': 'Because future financial support matters most to you, Decouple maps what\'s coming in and going out for both of you — so you can see what\'s actually workable.',
};

const WORRY_NOTES: Record<Worry, string> = {
  'enough-to-live': 'Your worry about having enough to live on is one Decouple addresses head-on — affordability modelling is built in, not bolted on.',
  'hidden-assets': 'Your concern about hidden assets is one Decouple was built around — bank-evidenced disclosure means both sides start from facts, not assertions.',
  'losing-pension': 'Your concern about pensions is one Decouple takes seriously — valuations and sharing options surface clearly, so you can see them yourself.',
  'mortgage-alone': 'Your worry about mortgage payments alone is one Decouple helps model — affordability scenarios sit alongside the picture.',
  'process-cost': 'Your worry about process costs is one Decouple replaces by design — the £800-1,100 collaborative path stands in for the £14,561 solicitor journey.',
  'emotional-toll': 'Your worry about the emotional toll matters here — Decouple lets you set the pace, with no adversarial back-and-forth between solicitors.',
  'ex-cooperation': 'Your worry about your ex co-operating is one Decouple acknowledges — bank-evidenced disclosure produces a complete picture even when co-operation is uneven.',
  'fairness-unknown': 'Your worry about whether the outcome will feel fair is one Decouple addresses by design — both of you build one shared picture before either signs off.',
};

function composeSituationSummary(answers: Answers): string {
  const parts: string[] = [];

  const leadStr = leadPhrase(deriveLeadCategory(answers));
  if (leadStr) parts.push(leadStr);

  if (answers.stage === 'thinking') parts.push('You are considering separating from your partner.');
  else if (answers.stage === 'decided') parts.push('You and your partner have decided to separate.');
  else if (answers.stage === 'in_process') parts.push('You are already in the process of separating.');
  else parts.push('You are thinking through your separation.');

  if (answers.situation?.living === 'yes') parts.push('You still live together.');
  else if (answers.situation?.living === 'no') parts.push('You are living apart.');

  if (answers.situation?.hasChildren === 'yes') {
    const count = answers.situation.childrenCount;
    if (count === 1) parts.push('You have 1 child together.');
    else if (count) parts.push(`You have ${count} children together.`);
    else parts.push('You have children together.');
  }

  const home = homeDescription(answers.situation?.home);
  if (home) parts.push(home);

  return parts.join(' ');
}

function composeWhatNeedsToHappen(answers: Answers): ReadonlyArray<string> {
  const intro = whatNeedsIntroForStage(answers.stage);

  const childrenStep = 'You agree how time with the children works week-to-week, and what each of you contributes.';
  const housingStep = 'You decide who stays in the home, when, and what happens to it longer term.';
  const closingStep = 'A judge approves the financial agreement (a consent order) so it is binding.';

  const substantive: string[] = [
    'Each of you shares what you own, owe, earn and spend.',
    'You both look at the picture together and talk through what feels fair.',
    'You write down what you have agreed.',
  ];
  if (answers.situation?.hasChildren === 'yes') substantive.push(childrenStep);
  if (answers.situation?.living === 'yes') substantive.push(housingStep);
  substantive.push(closingStep);

  const lead = deriveLeadCategory(answers);
  const reorderTarget =
    lead === 'children' && answers.situation?.hasChildren === 'yes' ? childrenStep
    : lead === 'housing' && answers.situation?.living === 'yes' ? housingStep
    : null;
  if (reorderTarget) {
    const idx = substantive.indexOf(reorderTarget);
    if (idx > 0) {
      substantive.splice(idx, 1);
      substantive.unshift(reorderTarget);
    }
  }

  return [intro, ...substantive];
}

function composePersonalisedNotes(answers: Answers): PlanContent['personalisedNotes'] {
  const notes: PlanContent['personalisedNotes'][number][] = [];
  if (answers.situation?.hasChildren === 'yes') {
    notes.push({
      trigger: 'children',
      body:
        'Because there are children involved, Decouple gives you a parenting plan tool you both build together — schedule, school, healthcare, decisions — alongside the financial picture.',
    });
  }
  if (answers.employment?.selfEmployment && answers.employment.selfEmployment !== 'no') {
    notes.push({
      trigger: 'self-employed',
      body:
        'Because you (or your partner) are self-employed, Decouple surfaces business income and asset valuations clearly — often the part of disclosure that gets most easily overlooked.',
    });
  }
  if (answers.exAndSafety?.relationshipQuality === 'safety-concern' || answers.exAndSafety?.devicePrivate === 'not-sure') {
    notes.push({
      trigger: 'safety',
      body:
        'Because you mentioned safety concerns, Decouple keeps your inputs private until you choose to share, and points you to specialist support if anything feels unsafe.',
    });
  }

  const aware = answers.partnerFinances?.awareness;
  if (aware === 'little' || aware === 'suspect') {
    notes.push({
      trigger: 'partner-finance-unknown',
      body:
        'Because you do not have full sight of your partner’s finances, Decouple uses bank-evidenced disclosure — both sides connect their accounts, so the picture is built on facts, not assertions.',
    });
  } else if (aware === 'full') {
    notes.push({
      trigger: 'partner-finance-full',
      body:
        'Because you have full sight of your partner’s finances, Decouple gives you a head-start on joint preparation — both sides confirm the same picture from connected bank data.',
    });
  } else if (aware === 'some') {
    notes.push({
      trigger: 'partner-finance-some',
      body:
        'Because you have some sight of your partner’s finances, Decouple’s bank-evidenced disclosure fills the gaps — both sides connect their accounts so the picture is complete, not partial.',
    });
  }

  const topPriority = answers.whatMatters?.priorities?.[0];
  if (topPriority) {
    notes.push({ trigger: `priority-${topPriority}`, body: PRIORITY_NOTES[topPriority] });
  }
  const topWorry = answers.whatMatters?.worries?.[0];
  if (topWorry) {
    notes.push({ trigger: `worry-${topWorry}`, body: WORRY_NOTES[topWorry] });
  }

  return notes;
}

export function buildPlanFromAnswers(answers: Answers): PlanContent {
  return {
    situationSummary: composeSituationSummary(answers),
    journeyStages: STANDARD_JOURNEY_STAGES,
    whatNeedsToHappen: composeWhatNeedsToHappen(answers),
    conventionalPath: STANDARD_CONVENTIONAL_PATH,
    howDecoupleHelps: STANDARD_DECOUPLE_HELPS,
    personalisedNotes: composePersonalisedNotes(answers),
    links: { findOutMoreHref: '/about', primaryCTA: primaryCTAForStage(answers.stage) },
  };
}
