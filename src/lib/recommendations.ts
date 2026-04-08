// AI-informed recommendation engine
// Generates personalised recommendations from interview session data
// These are rule-based first (fast, reliable), with AI enhancement later

import type { InterviewSession } from '@/types/interview'

export interface Recommendation {
  id: string
  title: string
  explanation: string
  priority: 'high' | 'medium' | 'low'
  category: 'financial' | 'children' | 'process' | 'safety' | 'general'
  serviceLink?: string // Which service phase this connects to
  serviceDescription?: string // What the paid service does for this
}

export interface FinancialReaction {
  trigger: string
  message: string
}

// Tailored reactions to financial priority and worry selections
export function getFinancialReactions(session: InterviewSession): FinancialReaction[] {
  const reactions: FinancialReaction[] = []
  const { priorities, worries } = session.finances

  // Priority reactions
  if (priorities.includes('pension_protection')) {
    reactions.push({
      trigger: 'pension_protection',
      message: 'Pensions are often the largest asset in a separation — sometimes worth more than the family home. Many people don\'t realise this until late in the process. We\'ll make sure this gets the attention it deserves.',
    })
  }

  if (priorities.includes('keep_home')) {
    reactions.push({
      trigger: 'keep_home',
      message: 'Whether staying in the home is achievable depends on the overall financial picture — mortgage affordability, equity, and what other assets exist. Building the full picture is the key next step.',
    })
  }

  if (priorities.includes('clean_break')) {
    reactions.push({
      trigger: 'clean_break',
      message: 'A clean break means neither of you can make financial claims in the future. This is formalised through a consent order — it\'s strongly recommended even when you agree on everything.',
    })
  }

  if (priorities.includes('children_stability')) {
    reactions.push({
      trigger: 'children_stability',
      message: 'Children\'s financial stability often depends on housing, child maintenance, and how assets are divided. Understanding the full financial picture helps protect what matters most for them.',
    })
  }

  // Worry reactions
  if (worries.includes('hidden_assets')) {
    reactions.push({
      trigger: 'hidden_assets',
      message: 'The formal disclosure process requires both parties to declare everything under a legal oath. If information is deliberately hidden, there are serious legal consequences — including court orders and contempt proceedings.',
    })
  }

  if (worries.includes('not_enough')) {
    reactions.push({
      trigger: 'not_enough',
      message: 'This is the most common financial worry during separation. Building a clear picture of income, outgoings, and assets is the first step to understanding what\'s realistic and what you\'re entitled to.',
    })
  }

  if (worries.includes('process_cost')) {
    reactions.push({
      trigger: 'process_cost',
      message: 'The process doesn\'t have to be expensive. The divorce application is £612. Mediation is subsidised with a £500 government voucher. This service is designed to reduce your need for expensive solicitor hours by helping you do the structured preparation yourself.',
    })
  }

  if (worries.includes('pension_loss')) {
    reactions.push({
      trigger: 'pension_loss',
      message: 'Pension values can be complex — the Cash Equivalent Transfer Value (CETV) doesn\'t always reflect the true retirement income, especially for defined benefit schemes like NHS or teachers\' pensions. Getting expert valuation early is one of the smartest things you can do.',
    })
  }

  if (worries.includes('mortgage')) {
    reactions.push({
      trigger: 'mortgage',
      message: 'Mortgage affordability is a practical concern that affects whether one person can stay in the home. Understanding the outstanding balance, your income, and potential remortgage options is an important part of the picture.',
    })
  }

  return reactions
}

// Generate personalised plan recommendations
export function generateRecommendations(session: InterviewSession, hasSafeguardingConcerns: boolean): Recommendation[] {
  const recs: Recommendation[] = []
  const { situation, finances, confidence, children, home } = session
  const isMarried = situation.relationship_status === 'married' || situation.relationship_status === 'civil_partnership'

  // ── High priority: time-sensitive ──

  const pensionUnknown = confidence.my_pension === 'unknown' || confidence.partner_pension === 'unknown'
  const pensionPriority = finances.priorities.includes('pension_protection') || finances.worries.includes('pension_loss')

  if (pensionUnknown || pensionPriority) {
    recs.push({
      id: 'pension-cetv',
      title: 'Request pension valuations now',
      explanation: pensionPriority
        ? 'You flagged pensions as a priority. Getting a CETV (Cash Equivalent Transfer Value) takes up to 3 months — starting now means this information is ready when you need it. Pensions are often the largest single asset in a settlement.'
        : 'Your pension values are currently unknown. Pensions are often the largest asset — sometimes worth more than the home. Requesting a CETV is free and takes up to 3 months.',
      priority: 'high',
      category: 'financial',
      serviceLink: 'build_your_picture',
      serviceDescription: 'Our financial picture builder helps you track pension values, link evidence, and understand where pensions fit in the overall settlement.',
    })
  }

  // ── High priority: consent order education ──

  if (isMarried) {
    recs.push({
      id: 'consent-order',
      title: 'You\'ll need a financial order — even if you agree',
      explanation: 'Getting divorced does not automatically end financial claims. Without a consent order or clean break order, your ex-partner could make a claim against you years from now. This is the single most important thing to know about the process.'
        + (finances.priorities.includes('clean_break') ? ' You\'ve said a clean break matters to you — a consent order is how this is achieved.' : ''),
      priority: 'high',
      category: 'process',
      serviceLink: 'make_it_official',
      serviceDescription: 'Our Enhanced plan helps you prepare the structured information needed for a consent order, reducing solicitor costs.',
    })
  }

  // ── High priority: safeguarding ──

  if (hasSafeguardingConcerns) {
    recs.push({
      id: 'safety-solicitor',
      title: 'Speak to a specialist solicitor',
      explanation: 'Given your situation, getting professional legal advice is particularly important. Many solicitors offer a free initial consultation. Look for one experienced in domestic abuse cases and who is a member of Resolution.',
      priority: 'high',
      category: 'safety',
    })

    recs.push({
      id: 'miam-exemption',
      title: 'You may be exempt from mediation requirements',
      explanation: 'If you have safety concerns, you may not need to attend a MIAM (Mediation Information and Assessment Meeting) before any court applications. There are specific exemptions for domestic abuse — a solicitor can help you understand whether these apply.',
      priority: 'high',
      category: 'safety',
    })
  }

  // ── Medium priority: building the picture ──

  if (finances.combined_awareness !== 'pretty_clear') {
    const hiddenAssetsConcern = finances.worries.includes('hidden_assets')
    recs.push({
      id: 'financial-picture',
      title: 'Build your complete financial picture',
      explanation: hiddenAssetsConcern
        ? 'You\'re concerned about hidden assets. The best protection is thorough disclosure — knowing exactly what exists. Upload your documents and we\'ll extract and structure everything automatically, making it much harder for anything to be missed.'
        : finances.combined_awareness === 'really_dont_know'
          ? 'You don\'t yet have a clear picture of the combined finances. This is very common — and it\'s exactly what the next stage helps with. Upload documents and we\'ll do the heavy lifting.'
          : 'You know your side but not the full picture. Building out the detail — with evidence linked to every item — creates a much stronger position for any negotiation or disclosure.',
      priority: 'medium',
      category: 'financial',
      serviceLink: 'build_your_picture',
      serviceDescription: 'Upload documents and we\'ll automatically extract, classify, and organise your financial information. Review and confirm — we do the heavy lifting.',
    })
  }

  // ── Medium priority: property ──

  if (home.value_confidence === 'unknown' || home.value_confidence === 'unsure') {
    recs.push({
      id: 'property-value',
      title: 'Get a property valuation',
      explanation: finances.priorities.includes('keep_home')
        ? 'You want to stay in the home. To understand whether this is achievable, you need to know the property value and how much equity exists. An estate agent can give you a free market appraisal.'
        : 'An accurate property value is essential for any financial settlement. An estate agent can give you a free market appraisal — you don\'t need a formal survey at this stage.',
      priority: 'medium',
      category: 'financial',
      serviceLink: 'build_your_picture',
      serviceDescription: 'Track your property value, link the valuation evidence, and see how it fits in your overall financial picture.',
    })
  }

  // ── Medium priority: children ──

  if (children.confidence !== 'known' && children.current_arrangements !== null) {
    recs.push({
      id: 'children-detail',
      title: 'Strengthen your children\'s arrangements',
      explanation: 'The more detail you can think through — school terms, holidays, handovers, special needs — the stronger your position in any discussion or mediation. This also helps the children feel more settled.',
      priority: 'medium',
      category: 'children',
      serviceLink: 'build_your_picture',
      serviceDescription: 'Our guided tools help you build detailed children\'s arrangements that can be shared with a mediator or used in a parenting plan.',
    })
  }

  // ── Medium priority: mediation ──

  if (!hasSafeguardingConcerns) {
    recs.push({
      id: 'mediation',
      title: 'Explore mediation options',
      explanation: 'Before applying to court for most family matters, you usually need to attend a MIAM. There\'s a government voucher worth up to £500 towards mediation costs — available regardless of income. Mediation is often much faster and cheaper than court.'
        + (finances.worries.includes('process_cost') ? ' Given your concern about process costs, mediation can be significantly more affordable.' : ''),
      priority: 'medium',
      category: 'process',
      serviceLink: 'share_and_disclose',
      serviceDescription: 'We help you prepare for mediation — organising your disclosure, structuring your proposals, and tracking what\'s agreed across sessions.',
    })
  }

  // ── Low priority: general ──

  if (isMarried && situation.process_status === 'not_yet') {
    recs.push({
      id: 'divorce-application',
      title: 'The divorce application itself is straightforward',
      explanation: 'You can apply online at gov.uk. It takes about 10 minutes and costs £612 (help with fees is available). The 20-week reflection period starts from application — so applying early gives you time to sort out finances in parallel.',
      priority: 'low',
      category: 'process',
    })
  }

  return recs
}
