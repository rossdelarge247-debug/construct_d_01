import type { Answers, PlanContent } from './types';

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

function composeSituationSummary(answers: Answers): string {
  const parts: string[] = [];
  if (answers.stage === 'thinking') parts.push('You are considering separating from your partner.');
  else if (answers.stage === 'decided') parts.push('You and your partner have decided to separate.');
  else if (answers.stage === 'in_process') parts.push('You are already in the process of separating.');
  else parts.push('You are thinking through your separation.');

  if (answers.situation?.living === 'yes') parts.push('You still live together.');
  else if (answers.situation?.living === 'no') parts.push('You are living apart.');

  if (answers.situation?.hasChildren === 'yes') parts.push('You have children together.');

  return parts.join(' ');
}

function composeWhatNeedsToHappen(answers: Answers): ReadonlyArray<string> {
  const items: string[] = [
    'Each of you opens up about what you own, owe, earn and spend.',
    'You both look at the picture together and talk through what feels fair.',
    'You write down what you have agreed.',
  ];
  if (answers.situation?.hasChildren === 'yes') {
    items.push('You agree how time with the children works week-to-week, and what each of you contributes.');
  }
  if (answers.situation?.living === 'yes') {
    items.push('You decide who stays in the home, when, and what happens to it longer term.');
  }
  items.push('A judge approves the financial agreement (a consent order) so it is binding.');
  return items;
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
        'Because you (or your partner) are self-employed, Decouple surfaces business income and asset valuations clearly — often the part of disclosure that solicitors charge most for.',
    });
  }
  if (answers.exAndSafety?.relationshipQuality === 'safety-concern' || answers.exAndSafety?.devicePrivate === 'not-sure') {
    notes.push({
      trigger: 'safety',
      body:
        'Because you mentioned safety concerns, Decouple keeps your inputs private until you choose to share, and points you to specialist support if anything feels unsafe.',
    });
  }
  if (answers.partnerFinances?.awareness === 'very-little' || answers.partnerFinances?.awareness === 'hiding') {
    notes.push({
      trigger: 'partner-finance-unknown',
      body:
        'Because you do not have full sight of your partner’s finances, Decouple uses bank-evidenced disclosure — both sides connect their accounts, so the picture is built on facts, not assertions.',
    });
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
    links: { findOutMoreHref: '/about', primaryCTA: 'Continue' },
  };
}
