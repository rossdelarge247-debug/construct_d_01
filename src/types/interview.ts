// V1 Gentle Interview — session state types

export interface InterviewSession {
  // Step 2: Situation
  situation: {
    relationship_status: 'married' | 'civil_partnership' | 'cohabiting' | 'other' | null
    living_together: 'yes' | 'no' | 'complicated' | null
    has_children: boolean | null
    children_ages: string | null
    property_status: 'own_jointly' | 'own_one_name' | 'rent' | 'other' | null
    process_status: 'not_yet' | 'discussed' | 'formally_underway' | null
    relationship_quality: 'amicable' | 'difficult' | 'high_conflict' | 'safety_concerns' | null
    device_private: boolean | null
    financial_control_concerns: boolean | null
  }

  // Step 3: Route (generated)
  route: {
    generated: boolean
    summary: string | null
  }

  // Step 4: Children
  children: {
    current_arrangements: 'with_me' | 'with_partner' | 'roughly_shared' | 'other' | null
    desired_arrangements: 'broadly_same' | 'more_with_me' | 'more_with_partner' | 'roughly_equal' | 'not_sure' | null
    concerns: string[]
    most_important: string | null
    confidence: 'known' | 'estimated' | 'unsure' | null
  }

  // Step 5: Home
  home: {
    ownership: 'own_jointly' | 'own_one_name' | 'mortgage' | 'owned_outright' | null
    desired_outcome: 'sell_and_split' | 'one_stays' | 'not_sure' | null
    approximate_value: string | null
    value_confidence: 'known' | 'estimated' | 'unsure' | 'unknown' | null
    mortgage_balance: string | null
    mortgage_confidence: 'known' | 'estimated' | 'unsure' | 'unknown' | 'no_mortgage' | null
    concerns: string[]
    confidence: 'known' | 'estimated' | 'unsure' | null
  }

  // Step 6: Finances
  finances: {
    priorities: string[]
    worries: string[]
    combined_awareness: 'pretty_clear' | 'know_my_side' | 'rough_idea' | 'really_dont_know' | null
    additional_notes: string | null
  }

  // Step 7: Confidence mapping
  confidence: {
    my_income: 'known' | 'estimated' | 'unsure' | 'unknown' | null
    partner_income: 'known' | 'estimated' | 'unsure' | 'unknown' | null
    savings: 'known' | 'estimated' | 'unsure' | 'unknown' | null
    debts: 'known' | 'estimated' | 'unsure' | 'unknown' | null
    property_value: 'known' | 'estimated' | 'unsure' | 'unknown' | null
    mortgage: 'known' | 'estimated' | 'unsure' | 'unknown' | null
    my_pension: 'known' | 'estimated' | 'unsure' | 'unknown' | null
    partner_pension: 'known' | 'estimated' | 'unsure' | 'unknown' | null
    other_assets: 'known' | 'estimated' | 'unsure' | 'unknown' | null
    commitments: 'known' | 'estimated' | 'unsure' | 'unknown' | null
  }
}

export const INITIAL_SESSION: InterviewSession = {
  situation: {
    relationship_status: null,
    living_together: null,
    has_children: null,
    children_ages: null,
    property_status: null,
    process_status: null,
    relationship_quality: null,
    device_private: null,
    financial_control_concerns: null,
  },
  route: {
    generated: false,
    summary: null,
  },
  children: {
    current_arrangements: null,
    desired_arrangements: null,
    concerns: [],
    most_important: null,
    confidence: null,
  },
  home: {
    ownership: null,
    desired_outcome: null,
    approximate_value: null,
    value_confidence: null,
    mortgage_balance: null,
    mortgage_confidence: null,
    concerns: [],
    confidence: null,
  },
  finances: {
    priorities: [],
    worries: [],
    combined_awareness: null,
    additional_notes: null,
  },
  confidence: {
    my_income: null,
    partner_income: null,
    savings: null,
    debts: null,
    property_value: null,
    mortgage: null,
    my_pension: null,
    partner_pension: null,
    other_assets: null,
    commitments: null,
  },
}

export const INTERVIEW_STEPS = [
  { key: 'welcome', path: '/start', label: 'Welcome' },
  { key: 'situation', path: '/start/situation', label: 'Your situation' },
  { key: 'route', path: '/start/route', label: 'Your route' },
  { key: 'children', path: '/start/children', label: 'Children', conditional: true },
  { key: 'home', path: '/start/home', label: 'Your home', conditional: true },
  { key: 'finances', path: '/start/finances', label: 'Finances' },
  { key: 'confidence', path: '/start/confidence', label: 'What you know' },
  { key: 'plan', path: '/start/plan', label: 'Your plan' },
  { key: 'next-steps', path: '/start/next-steps', label: 'Next steps' },
  { key: 'next', path: '/start/next', label: 'What comes next' },
  { key: 'save', path: '/start/save', label: 'Save' },
] as const
