'use client'

import { useState, useCallback } from 'react'
import { type InterviewSession, INITIAL_SESSION } from '@/types/interview'

export function useInterview() {
  const [session, setSession] = useState<InterviewSession>(INITIAL_SESSION)

  const updateSituation = useCallback(
    (updates: Partial<InterviewSession['situation']>) => {
      setSession(prev => ({
        ...prev,
        situation: { ...prev.situation, ...updates },
      }))
    },
    [],
  )

  const updateRoute = useCallback(
    (updates: Partial<InterviewSession['route']>) => {
      setSession(prev => ({
        ...prev,
        route: { ...prev.route, ...updates },
      }))
    },
    [],
  )

  const updateChildren = useCallback(
    (updates: Partial<InterviewSession['children']>) => {
      setSession(prev => ({
        ...prev,
        children: { ...prev.children, ...updates },
      }))
    },
    [],
  )

  const updateHome = useCallback(
    (updates: Partial<InterviewSession['home']>) => {
      setSession(prev => ({
        ...prev,
        home: { ...prev.home, ...updates },
      }))
    },
    [],
  )

  const updateFinances = useCallback(
    (updates: Partial<InterviewSession['finances']>) => {
      setSession(prev => ({
        ...prev,
        finances: { ...prev.finances, ...updates },
      }))
    },
    [],
  )

  const updateConfidence = useCallback(
    (updates: Partial<InterviewSession['confidence']>) => {
      setSession(prev => ({
        ...prev,
        confidence: { ...prev.confidence, ...updates },
      }))
    },
    [],
  )

  const updateValues = useCallback(
    (updates: Partial<InterviewSession['values']>) => {
      setSession(prev => ({
        ...prev,
        values: { ...prev.values, ...updates },
      }))
    },
    [],
  )

  // Determine which steps are relevant based on situation answers
  const hasChildren = session.situation.has_children === true
  const hasProperty = session.situation.property_status === 'own_jointly' || session.situation.property_status === 'own_one_name'
  const hasSafeguardingConcerns = session.situation.relationship_quality === 'safety_concerns' || session.situation.financial_control_concerns === true

  return {
    session,
    updateSituation,
    updateRoute,
    updateChildren,
    updateHome,
    updateFinances,
    updateConfidence,
    updateValues,
    hasChildren,
    hasProperty,
    hasSafeguardingConcerns,
  }
}
