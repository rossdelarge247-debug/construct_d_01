'use client'

import { useState, useCallback, useRef } from 'react'
import { type InterviewSession, INITIAL_SESSION } from '@/types/interview'
import type { AIPlanNarrative } from '@/lib/ai/plan-narrative'

export function useInterview() {
  const [session, setSession] = useState<InterviewSession>(INITIAL_SESSION)

  // Pre-generation: stores the promise so plan page can await it
  const planPromise = useRef<Promise<AIPlanNarrative | null> | null>(null)
  const planResult = useRef<AIPlanNarrative | null>(null)

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

  // Start generating the plan narrative in the background
  // Called from the confidence page when enough data exists
  const startPlanGeneration = useCallback(
    (currentSession: InterviewSession, safeguarding: boolean) => {
      // Don't re-trigger if already running or completed
      if (planPromise.current || planResult.current) return

      planPromise.current = fetch('/api/plan/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session: currentSession, hasSafeguardingConcerns: safeguarding }),
      })
        .then(res => res.json())
        .then(data => {
          const narrative = data.narrative as AIPlanNarrative | null
          planResult.current = narrative
          return narrative
        })
        .catch(() => {
          planResult.current = null
          return null
        })
    },
    [],
  )

  // Get the plan narrative — returns immediately if cached, or awaits the promise
  const getPlanNarrative = useCallback(async (): Promise<AIPlanNarrative | null> => {
    if (planResult.current) return planResult.current
    if (planPromise.current) return planPromise.current
    return null
  }, [])

  // Determine which steps are relevant based on situation answers
  const hasChildren = session.situation.has_children === true
  const hasProperty = session.situation.property_status === 'own_jointly' || session.situation.property_status === 'own_one_name'
  const hasSafeguardingConcerns = session.situation.relationship_quality === 'safety_concerns' || session.situation.financial_control_concerns === true

  // Dynamic step list — streamlined (readiness matrix cut, next-steps replaced with choose)
  const interviewSteps = [
    'situation' as const,
    'route' as const,
    ...(hasChildren ? ['children' as const] : []),
    ...(hasProperty ? ['home' as const] : []),
    'finances' as const,
    'plan' as const,
    'choose' as const,
  ]

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
    interviewSteps,
    startPlanGeneration,
    getPlanNarrative,
  }
}
