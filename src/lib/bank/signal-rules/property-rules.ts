// Property signal rules (Form E 2.1-2.2, 3.1)

import type { SignalRule, DetectedSignal } from './types'

const mortgageDetected: SignalRule = {
  id: 'property.mortgage-detected',
  name: 'Mortgage payment',
  section: 'property',
  tier: 'must_nail',
  formEField: '2.1 + 3.1',
  description: 'Payment to known mortgage lender, £200-5000/month, recurring ≥3 months.',
  detect: (input) => {
    const mortgage = input.payments.find(p => p.likely_category === 'mortgage')
    if (!mortgage) return null

    return {
      id: `property.mortgage.${mortgage.payee.slice(0, 15).replace(/\s/g, '-').toLowerCase()}`,
      ruleId: 'property.mortgage-detected',
      name: 'Mortgage payment detected',
      section: 'property',
      formEField: '2.1 + 3.1',
      confidence: mortgage.confidence,
      determination: `Mortgage: £${mortgage.amount}/month to ${mortgage.payee}`,
      reasoning: [
        `Payment to ${mortgage.payee}: £${mortgage.amount}/month`,
        `Frequency: ${mortgage.frequency}`,
        `Confidence: ${Math.round(mortgage.confidence * 100)}%`,
        'User will confirm: sole/joint ownership, estimated property value',
      ],
      evidence: [{
        label: `${mortgage.payee}: £${mortgage.amount}/month (${mortgage.frequency})`,
        metrics: [{ name: 'Confidence', value: `${Math.round(mortgage.confidence * 100)}%` }],
      }],
      crossSectionImpacts: [
        'Mortgage statement needed (balance, rate, terms)',
        'Property valuation needed (3 agents or RICS)',
      ],
    }
  },
}

const councilTaxDetected: SignalRule = {
  id: 'property.council-tax',
  name: 'Council tax',
  section: 'property',
  tier: 'must_nail',
  formEField: '3.1',
  description: 'Payment to local authority for council tax. Infers property location.',
  detect: (input) => {
    const ct = input.payments.find(p => p.likely_category === 'council_tax')
    if (!ct) return null

    return {
      id: `property.council-tax.${ct.payee.slice(0, 15).replace(/\s/g, '-').toLowerCase()}`,
      ruleId: 'property.council-tax',
      name: 'Council tax detected',
      section: 'property',
      formEField: '3.1',
      confidence: ct.confidence,
      determination: `Council tax: £${ct.amount}/month to ${ct.payee}`,
      reasoning: [
        `Payment to ${ct.payee}: £${ct.amount}/month`,
        'Auto-confirmed — bank data is sufficient',
        'Infers approximate property location from council name',
      ],
      evidence: [{
        label: `${ct.payee}: £${ct.amount}/month`,
      }],
      crossSectionImpacts: ['Property location inferred from council name'],
    }
  },
}

const noHousingCosts: SignalRule = {
  id: 'property.no-housing',
  name: 'No housing costs',
  section: 'property',
  tier: 'must_nail',
  formEField: '2.1',
  description: 'No mortgage, rent, or council tax detected. Asks user about housing situation.',
  detect: (input) => {
    const hasMortgage = input.payments.some(p => p.likely_category === 'mortgage')
    const hasRent = input.payments.some(p => p.likely_category === 'rent')
    const hasCouncilTax = input.payments.some(p => p.likely_category === 'council_tax')
    if (hasMortgage || hasRent || hasCouncilTax) return null

    return {
      id: 'property.no-housing',
      ruleId: 'property.no-housing',
      name: 'No housing costs detected',
      section: 'property',
      formEField: '2.1',
      confidence: 0.85,
      determination: 'No mortgage, rent, or council tax found',
      reasoning: [
        'No payments classified as mortgage, rent, or council tax',
        'Possible causes: owns outright, living with family, partner pays, different account',
        'Will ask user about housing situation',
      ],
      evidence: [{
        label: 'No housing-related payments found',
      }],
      crossSectionImpacts: [],
    }
  },
}

export const PROPERTY_RULES: SignalRule[] = [
  mortgageDetected,
  councilTaxDetected,
  noHousingCosts,
]
